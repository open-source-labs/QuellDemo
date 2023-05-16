import { DocumentNode } from 'graphql';
import { Collection } from 'lokijs';
import { parse } from 'graphql/language/parser';
import determineType from './helpers/determineType';
import { LRUCache } from 'lru-cache';
import Loki from 'lokijs';
import type {
  CostParamsType,
  IDLokiCacheType,
  LokiGetType,
  FetchObjType,
  JSONObject,
  JSONValue,
  ClientErrorType
} from './types';
const lokidb: Loki = new Loki('client-cache');
let lokiCache: Collection = lokidb.addCollection('loki-client-cache', {
  disableMeta: true
});
/* The IDCache is a psuedo-join table that is a JSON object in memory,
that uses cached queries to return their location ($loki (lokiID)) from LokiCache.
i.e. {{JSONStringifiedQuery: $lokiID}}
  const IDCache = {
  query1: $loki1,
  query2: $loki2,
  query3: $loki3
 };
 */
let IDCache: IDLokiCacheType = {};
/**
 * Manually removes item from cache
 */
const invalidateCache = (query: string): void => {
  if (IDCache[query]) {
    const cacheId: number = IDCache[query];
    lruCache.delete(query);
    lokiCache.remove(cacheId);
    delete IDCache[query];
    console.log('Cache invalidated for query:', query);
    console.log('IDCache:', IDCache);
    console.log('LRUCache:', lruCache);
    console.log('lokiCache:', lokiCache);
  }
}
/**
 * Implement LRU caching strategy
 */

// Set the maximum cache size on LRU cache
const MAX_CACHE_SIZE: number = 2;
const lruCache = new LRUCache<string, LokiGetType>({
  max: MAX_CACHE_SIZE,
});

// Track the order of accessed queries
const lruCacheOrder: string[] = []; 

// Update LRU Cache on each query
const updateLRUCache = (query: string, results: LokiGetType): void => {
  const cacheSize = lruCacheOrder.length;
  if (cacheSize >= MAX_CACHE_SIZE) {
    // Get and remove the least recently used query
    const leastRecentlyUsedQuery = lruCacheOrder.shift(); 
    if (leastRecentlyUsedQuery) {
      // Invalidate the cache entry in Loki and IDCache
      invalidateCache(leastRecentlyUsedQuery); 
    }
  }
  // Add the current query to the end of the order array
  lruCacheOrder.push(query); 
  // Set the query and results in the cache
  lruCache.set(query, results); 
  console.log('Cache updated for query:', query);
  console.log('LRUCache:', lruCache);
};
/**
 * Clears entire existing cache and ID cache and resets to a new cache.
 */
const clearCache = (): void => {
  lokidb.removeCollection('loki-client-cache');
  lokiCache = lokidb.addCollection('loki-client-cache', {
    disableMeta: true
  });
  IDCache = {};
  lruCache.clear();
  console.log('Client cache has been cleared.');
};

/**
 * Quellify replaces the need for front-end developers who are using GraphQL to communicate with their servers
 * to write fetch requests. Quell provides caching functionality that a normal fetch request would not provide.
 *  @param {string} endPoint - The endpoint to send the GraphQL query or mutation to, e.g. '/graphql'.
 *  @param {string} query - The GraphQL query or mutation to execute.
 *  @param {object} costOptions - Any changes to the default cost options for the query or mutation.
 *
 *  default costOptions = {
 *   maxCost: 5000, // maximum cost allowed before a request is rejected
 *   mutationCost: 5, // cost of a mutation
 *   objectCost: 2, // cost of retrieving an object
 *   scalarCost: 1, // cost of retrieving a scalar
 *   depthCostFactor: 1.5, // multiplicative cost of each depth level
 *   depthMax: 10, //depth limit parameter
 *   ipRate: 3 // requests allowed per second
 * }
 *
 */
async function Quellify(
  endPoint: string,
  query: string,
  costOptions: CostParamsType
) {
  // Check the LRU cache before performing fetch request
  const cachedResults = lruCache.get(query);
  if (cachedResults) {
    console.log('pulling from lru cache');
    console.log('IDCache', IDCache[query]);
    return [cachedResults, true];
  }
  /**
   * Fetch configuration for post requests that is passed to the performFetch function.
   */
  const postFetch: FetchObjType = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, costOptions })
  };
  /**
   * Fetch configuration for delete requests that is passed to the performFetch function.
   */
  const deleteFetch: FetchObjType = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, costOptions })
  };
  /**
   * Makes requests to the GraphQL endpoint.
   * @param {FetchObjType} [fetchConfig] - (optional) Configuration options for the fetch call.
   * @returns {Promise} A Promise that resolves to the parsed JSON response.
   */
  const performFetch = async (
    fetchConfig?: FetchObjType
  ): Promise<JSONObject> => {
    try {
      const data = await fetch(endPoint, fetchConfig);
      const response = await data.json();
      updateLRUCache(query, response.queryResponse.data);
      return response.queryResponse.data;
    } catch (error) {
      const err: ClientErrorType = {
        log: `Error when trying to perform fetch to graphQL endpoint: ${error}.`,
        status: 400,
        message: {
          err: 'Error in performFetch. Check server log for more details.'
        }
      };
      console.log('Error when performing Fetch: ', err);
      throw error;
    }
  };

  // Refetch LRU cache
  const refetchLRUCache = async (): Promise<void> => {
    const cacheSize = lruCacheOrder.length;
    for (let i = 0; i < cacheSize; i++) {
      const cachedQuery = lruCacheOrder[i];
      // Get operation type for cachedQuery
      const oldAST: DocumentNode = parse(cachedQuery);
      const { operationType } = determineType(oldAST);
      // If the operation type is a mutation, delete the query from the LRU cache
      if (operationType === 'mutation') {
        invalidateCache(cachedQuery);
        continue;
      }
      // If the operation type is a query, refetch the query from the LRU cache
      const cachedResults = lruCache.get(cachedQuery);
      if (cachedResults) {
        // Fetch configuration for post requests that is passed to the performFetch function.
        const fetchConfig: FetchObjType = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cachedQuery, costOptions })
        };
        const data = await fetch(endPoint, fetchConfig);
        const response = await data.json();
        updateLRUCache(cachedQuery, response.queryResponse.data);
      }
    }
  };
  
  // Create AST based on the input query using the parse method available in the GraphQL library
  // (further reading: https://en.wikipedia.org/wiki/Abstract_syntax_tree).
  const AST: DocumentNode = parse(query);
  // Find operationType, proto using determineType
  const { operationType, proto } = determineType(AST);
  if (operationType === 'unQuellable') {
    /*
     * If the operation is unQuellable (cannot be cached), fetch the data
     * from the GraphQL endpoint.
     */
    // All returns in an async function return promises by default;
    // therefore we are returning a promise that will resolve from perFormFetch.
    const parsedData: JSONValue = await performFetch(postFetch);
    // The second element in the return array is a boolean that the data was not found in the lokiCache.
    return [parsedData, false];
  } else if (operationType === 'mutation') {
    // Assign mutationType
    const mutationType: string = Object.keys(proto)[0];
    // Check the cache for the query
    if (IDCache[query]) {
      // check if mutation is an add mutation
      if (
        mutationType.includes('add') ||
        mutationType.includes('new') ||
        mutationType.includes('create') ||
        mutationType.includes('make')
      ) {
        // Update the data found in cache
        // Grab the $loki ID from the IDCache.
        const mutationID: number = IDCache[query];
        // Grab the results from lokiCache for the $loki ID.
        const results: LokiGetType = lokiCache.get(mutationID);
        lruCache.set(query, results);

        // Refetch each query in the LRU cache to update the cache
        console.log(lruCache);

        // The second element in the return array is a boolean that the data was found in the lokiCache.
        return [results, true];
    }
    // Check if mutation is a delete mutation
    else if (
      mutationType.includes('delete') ||
      mutationType.includes('remove')
    ) {
      // Update the data found in cache
      // Grab the $loki ID from the IDCache.
      const mutationID: number = IDCache[query];
      console.log('delete mutation id', mutationID);
      // Grab the results from lokiCache for the $loki ID.
      const results: LokiGetType = lokiCache.get(mutationID);
      console.log('CACHE HAS BEEN INVALIDATED')
      invalidateCache(query);
      // The second element in the return array is a boolean that the data was found in the lokiCache.
      return [results, true];
  }
    // Check if mutation is an update mutation
    else if (
      mutationType.includes('update') 
    ) {
      // Update the data found in cache
      // Grab the $loki ID from the IDCache.
      const mutationID: number = IDCache[query];
      // Grab the results from lokiCache for the $loki ID.
      const results: LokiGetType = lokiCache.get(mutationID);
      lruCache.set(query, results);
      // The second element in the return array is a boolean that the data was found in the lokiCache.
      return [results, true];
   }
  } else {
   
       // If mutation is not in cache
       // Check if mutation is an add mutation
       if (
        mutationType.includes('add') ||
        mutationType.includes('new') ||
        mutationType.includes('create') ||
        mutationType.includes('make')
      ) {
        // Execute a fetch request with the query
        const parsedData: JSONObject = await performFetch(postFetch);
        if (parsedData) {
          const addedEntry = lokiCache.insert(parsedData);
          IDCache[query] = addedEntry.$loki;
          return [addedEntry, false];
        }
        
    // Check if mutation is a delete mutation
    
    else if (
      mutationType.includes('delete') ||
      mutationType.includes('remove')
    )  {
      console.log('hello it is deleted')
      // execute a fetch request with the query
      const parsedData: JSONObject = await performFetch(deleteFetch);
      console.log('parsedData', parsedData);
      if (parsedData) {
        const removedEntry = lokiCache.get(IDCache[query]);
        if (removedEntry) {
        lokiCache.remove(removedEntry);
        invalidateCache(query);
        return [removedEntry, false];
      } else {
        return [null, false];
      }
    }
  // Check if mutation is an update mutation
  else if (
    mutationType.includes('update') 
  ) {
    // Execute a fetch request with the query
    const parsedData: JSONObject = await performFetch(postFetch);
    if (parsedData) {
      const updatedEntry = lokiCache.update(parsedData);
      IDCache[query] = updatedEntry.$loki;
      return [updatedEntry, false];
    }
   }
  }
 }
}
    // Operation is a Query
  } else {
    if (IDCache[query]) {
        // If the query has a $loki ID in the IDCache, retrieve and return the results from the lokiCache.
        // Grab the $loki ID from the IDCache.
        const queryID: number = IDCache[query];
  
        // Grab the results from lokiCache for the $loki ID.
        const results: LokiGetType = lokiCache.get(queryID);
        lruCache.set(query, results)
        // The second element in the return array is a boolean that the data was found in the lokiCache.
        return [results, true];
      } else {
        // If the query has not been made already, execute a fetch request with the query.
        const parsedData: JSONObject = await performFetch(postFetch);
        // Add the new data to the lokiCache.
        if (parsedData) {
          const addedEntry = lokiCache.insert(parsedData);
          // Add query $loki ID to IDcache at query key
          IDCache[query] = addedEntry.$loki;
          lruCache.set(query, addedEntry);
          // The second element in the return array is a boolean that the data was not found in the lokiCache.
          return [addedEntry, false];
      }
    }
  }
}
export { Quellify, clearCache as clearLokiCache };
