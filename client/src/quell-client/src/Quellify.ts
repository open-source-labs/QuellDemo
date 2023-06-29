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
const mapCache = new Map<string, MapCacheType>();
const lruCache = new LRUCache<string, MapCacheType>({ max: MAX_CACHE_SIZE });


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
interface MutationHandlers {
  [key: string]: (endPoint: string, query: string, fetchConfig: FetchObjType) => Promise<JSONObject>;
}

const mutationHandlers: MutationHandlers = {
  delete: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, fetchConfig),
  update: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, fetchConfig),
  create: async (endPoint: string, query: string, fetchConfig: FetchObjType) => performFetch(endPoint, fetchConfig),
};

// Function to invalidate the cache for a specific query
const invalidateCache = (query: string): void => {
  lruCache.delete(query);
  mapCache.delete(query);
};

// Function to update LRU and Map caches with new results
const updateLRUCache = (query: string, results: JSONObject): void => {
  lruCache.set(query, results as MapCacheType);
  mapCache.set(query, results as MapCacheType);
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
        return [mapCachedResults, true];
      } 
      // If not in either cache, perform fetch, update cache and return results
      else {
        const data = await performFetch(endPoint, fetchConfig);
        console.log('FETCHED DATA - QUERY: ', data)
        updateLRUCache(query, data);
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
        let fetchResult: JSONObject = {};
        // Invalidate cache for delete mutations and return empty object
        if (mutationAction === 'delete') {
          const deleteFetchConfig: FetchObjType = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, costOptions })
          };
          const fetchResult = await performFetch(endPoint, deleteFetchConfig);
          invalidateCache(query);
          return [fetchResult, false];
        } else {
          // Update cache for update or create mutations and return fetched data
          fetchResult = await performFetch(endPoint, fetchConfig);
          updateLRUCache(query, fetchResult);
        }
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