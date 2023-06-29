import { DocumentNode } from 'graphql';
import { parse } from 'graphql/language/parser';
import determineType from './helpers/determineType';
import { LRUCache } from 'lru-cache';

import {
  CostParamsType,
  MapCacheType,
  FetchObjType,
  JSONObject,
  JSONValue,
  ClientErrorType,
  QueryResponse
} from './types';

// Custom Error class for client errors
class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientError';
  }
}

// Factory function for creating client error objects
function createClientError(message: string): ClientErrorType {
  return {
    log: message,
    status: 400,
    message: { err: 'Error in performFetch. Check server log for more details.' }
  };
}

// Cache configurations
const MAX_CACHE_SIZE = 2;
// const mapCache = new Map<string, MapCacheType>();
const mapCache: Map<string, JSONObject> = new Map();
const lruCache = new LRUCache<string, MapCacheType>({ max: MAX_CACHE_SIZE });

///////////////////////////////////////////////////////

// Define an interface for the mutation type handlers
interface MutationTypeHandlers {
  delete: string[];
  update: string[];
  create: string[];
} 

// Identifiers for different types of mutations
const mutationTypeHandlers: MutationTypeHandlers = {
  delete: ['delete', 'remove'],
  update: ['update', 'edit'],
  create: ['create', 'add', 'new', 'make']
};

// Define handlers for mutation types
// interface MutationHandlers {
//   [key: string]: (endPoint: string, query: string, fetchConfig: FetchObjType) => Promise<JSONObject>;
// }

// const mutationHandlers: MutationHandlers = {
//   delete: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, { ...fetchConfig, method: 'DELETE' }),
//   update: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, fetchConfig),
//   create: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, fetchConfig),
// };

///////////////////////////////////////////////////////

// Function to invalidate the cache for a specific query
const invalidateCache = (query: string): void => {
  // console.log('INVALIDATE CACHE QUERY: ', query)
  // console.log('INVALIDATE CACHE QUERY TYPE: ', typeof query)
  // console.log('INVALIDATE CACHE - MAP CACHE HAS QUERY: ', mapCache.has(query));


  lruCache.delete(query);
  mapCache.delete(query);
};

///////////////////////////////////////////////////////

/**
 * Normalize the results object by recursively normalizing each value.
 * @param results - the results object to be normalized.
 * @returns - the normalized results object.
 */
const normalizeResults = (results: JSONObject): JSONObject => {
  const normalizedResults: JSONObject = {};

  // Iterate over the entries of the results object
  const entries = Object.entries(results);
  for (const [key, value] of entries) {
    // Normalize the value
    const normalizedValue = normalizeValue(value);
    // Assign the normalized value to the corresponding key in the normalized results object
    normalizedResults[key] = normalizedValue;
  }

  return normalizedResults;
};

/**
 * Normalize a JSON value by checking its type and applying the corresponding normalization logic.
 * @param value - the JSON value to be normalized.
 * @returns - the normalized JSON value.
 */
const normalizeValue = (value: JSONValue): JSONValue => {
  // If the value is null, return null
  if (value === null) return null;
  // If the value is an array, recursively normalize each element
  else if (Array.isArray(value)) return normalizeArray(value);
  // If the value is an object, recursively normalize each property
  else if (typeof value === 'object' && value !== null) return normalizeObject(value);
  // If the value is neither an array nor an object, return the value as is
  else return value;
};

/**
 * Normalize a JSON object by recursively normalizing each value.
 * @param obj - the JSON object to be normalized.
 * @returns - the normalized JSON object.
 */
const normalizeObject = (obj: JSONObject): JSONObject => {
  const normalizedObj: JSONObject = {};
  // Iterate over the entries of the object
  const entries = Object.entries(obj);
  // Normalize the value
  for (const [key, value] of entries) {
    const normalizedValue = normalizeValue(value);
    // Assign the normalized value to the corresponding key in the normalized object
    normalizedObj[key] = normalizedValue;
  }
  return normalizedObj;
};

/**
 * Normalize a JSON array by recursively normalizing each element.
 * @param arr - the JSON array to be normalized.
 * @returns - the normalized JSON array.
 */
const normalizeArray = (arr: JSONValue[]): JSONValue[] => {
  return arr.map((value) => {
    // Normalize each element in the array
    return normalizeValue(value);
  });
};

///////////////////////////////////////////////////////

/**
 * Update the LRU and Map caches with new results after normalizing them.
 * @param query - the query associated with the results.
 * @param results - the results object to be cached.
 */
const updateLRUCache = (query: string, results: JSONObject): void => {
  // console.log('UPDATE LRU CACHE QUERY: ', query)
  // console.log('UPDATE LRU CACHE QUERY TYPE: ', typeof query)
  // Normalize the results
  const normalizedResults = normalizeResults(results);
  // Update the LRU cache with the normalized results
  lruCache.set(query, normalizedResults);
  // Update the Map cache with the normalized results
  mapCache.set(query, normalizedResults);
};

// Function to clear both the LRU and Map caches
const clearCache = (): void => {
  mapCache.clear();
  lruCache.clear();
};

// Function to perform an HTTP fetch to a specified endpoint
const performFetch = async (endPoint: string, fetchConfig?: FetchObjType): Promise<JSONObject> => {
  try {
    const response = await fetch(endPoint, fetchConfig);
    const { queryResponse }: QueryResponse = await response.json();
    return queryResponse.data;
  } catch (error) {
    throw createClientError(`Error when trying to perform fetch to graphQL endpoint: ${error}.`);
  }
};



/**
  * The main function that handles GraphQL queries. 
  * It takes an endpoint, query, cost options, and optional variables as parameters
  * It returns a promise resolving with the response data and a boolean indicating if the data was from cache.
*/
const Quellify = async (
  endPoint: string,
  query: string,
  costOptions: CostParamsType,
  variables?: Record<string, any>,
): Promise<[JSONValue, boolean]> => {

  
  const AST: DocumentNode = parse(query);
  const { operationType, proto } = determineType(AST);

  console.log('MAP CACHE: ', mapCache)
  console.log('LRU CACHE: ', lruCache.dump())

  // Configuration object for the fetch requests
  const fetchConfig: FetchObjType = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, costOptions })
  };

  try {
    // Parsing the query into an AST (Abstract Syntax Tree)
    const AST: DocumentNode = parse(query);

    // Determine the operation type (query, mutation, etc.) of the GraphQL query
    const { operationType, proto } = determineType(AST);

    // Handle query operation type
    if (operationType === 'query') {  
      // Check if results are in LRU, returns results if available
      const lruCachedResults = lruCache.get(query);
      if (lruCachedResults) {
        console.log('LRU CACHED RESULTS: ', lruCachedResults)
        return [lruCachedResults, true];
      }
      // If not in LRU cache, checks if results are in Map Cache, adds results to LRU Cache and returns the results
      const mapCachedResults = mapCache.get(query);
      if (mapCachedResults) {
        console.log('MAP CACHED RESULTS: ', mapCachedResults)
        lruCache.set(query, mapCachedResults as MapCacheType);
        console.log('MAP CACHE: ', mapCache)
        console.log('LRU CACHE: ', lruCache.dump())
        return [mapCachedResults, true];
      } 
      // If not in either cache, perform fetch, update cache and return results
      else {
        const data = await performFetch(endPoint, fetchConfig);
        console.log('FETCHED DATA - QUERY: ', data)
        updateLRUCache(query, data);
        console.log('MAP CACHE: ', mapCache)
        console.log('LRU CACHE: ', lruCache.dump())
        return [data, false];
      }
    }
    
    // Handle mutation operation type
    if (operationType === 'mutation') {
      const mutationType: string = Object.keys(proto)[0];
      const mutationAction = Object.keys(mutationTypeHandlers).find((action) =>
        mutationTypeHandlers[action as keyof MutationTypeHandlers].some((type: string) => mutationType.includes(type))
      ) as keyof MutationTypeHandlers;
      if (mutationAction) {
        const fetchResult: JSONObject = await performFetch(endPoint, fetchConfig);
        console.log('MAP CACHE: ', mapCache)
        console.log('LRU CACHE: ', lruCache.dump())
        invalidateCache(query);
        return [fetchResult, false];
      }
      // Throw error if mutation type is not supported
      throw createClientError('The operation type is not supported.');
    }

    // Handle cases where the query is not optimizable (unQuellable) and directly fetch data
    else if (operationType === 'unQuellable') {
      const data = await performFetch(endPoint, fetchConfig);
      console.log('FETCHED DATA - unQuellable: ', data)
      return [data, false];
    }
    // Throw error if operation type is not supported
    else {
      throw createClientError('The operation type is not supported.');
    }
  } catch (error) {
    throw error instanceof ClientError ? error : createClientError(`Error occurred during Quellify process: ${error}.`);
  }
};

// Export the Quellify function and the clearCache function
export { Quellify, clearCache, lruCache, updateLRUCache };