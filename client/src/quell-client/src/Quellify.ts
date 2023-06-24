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
  JSONObjectWithId,
  QueryResponse
} from './types';

/** 
 * Initialize a new Map object with keys of type string and values
 * @type {MapCacheType} - key: the GraphQL queries, value: the cached results
 */
const mapCache = new Map<string, MapCacheType>();

/**
 * Function to manually removes item from cache 
 * @param {string} query - the query that needs to be removed from the cache.
*/
const invalidateCache = (query: string): void => {
  // console.log('INSIDE OF INVALIDATE CACHE')
  if (mapCache.has(query)) {
    // console.log('INVALIDATE CACHE - MAP CACHE HAS THE QUERY')
    lruCache.delete(query);
    // mapCache.delete(query);
    console.log(mapCache);
  }
}

/** 
 * Implement LRU caching strategy 
 * Set the maximum cache size on LRU cache
 */
const MAX_CACHE_SIZE: number = 2;
const lruCache = new LRUCache<string, MapCacheType>({ max: MAX_CACHE_SIZE });

// Track the order of accessed queries
const lruCacheOrder: string[] = []; 

// Function to update LRU Cache on each query
const updateLRUCache = (query: string, results: JSONObject): void => {
  // console.log('INSIDE OF UPDATE LRU CACHE')
  const cacheSize = lruCacheOrder.length;
  if (cacheSize >= MAX_CACHE_SIZE) {
    // console.log('UPDATE LRU CACHE - CACHE SIZE IS OVER MAX')
    const leastRecentlyUsedQuery = lruCacheOrder.shift();
    if (leastRecentlyUsedQuery) {
      // console.log(`LEAST RECENTLY USED QUERY: ${JSON.stringify(leastRecentlyUsedQuery)}`)
      invalidateCache(leastRecentlyUsedQuery);
    }
  }
  lruCacheOrder.push(query);
  lruCache.set(query, results as MapCacheType);
};

/** Clears entire existing cache and ID cache and resets to a new cache. */
const clearCache = (): void => {
  // console.log('INSIDE OF CLEAR CACHE');
  mapCache.clear();
  lruCache.clear();
  console.log('Client cache has been cleared....');
};



/**
 * Quellify replaces the need for front-end developers who are using GraphQL to communicate with their servers
 * to write fetch requests. Quell provides caching functionality that a normal fetch request would not provide.
 *  @param {string} endPoint - The endpoint to send the GraphQL query or mutation to, e.g. '/graphql'.
 *  @param {string} query - The GraphQL query or mutation to execute.
 *  @param {object} costOptions - Any changes to the default cost options for the query or mutation.
 *  default costOptions = {}
 */
async function Quellify(
  endPoint: string,
  query: string,
  costOptions: CostParamsType,
  variables?: Record<string, any>) {
  // console.log('INSIDE OF QUELLIFY')

  // Check the LRU cache before performing fetch request
  const cachedResults = lruCache.get(query);
  if (cachedResults) {
    // console.log(`QUELLIFY - FOUND QUERY IN CACHE: ${JSON.stringify(cachedResults)}`)
    return [cachedResults, true];
  }

  // console.log(`QUELLIFY - NOT FOUND QUERY IN CACHE :(`)

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
    // console.log('INSIDE OF QUELLIFY - PERFORM FETCH')
    try {
      const data = await fetch(endPoint, fetchConfig);
      console.log({data})
      const response: QueryResponse = await data.json();
      console.log({response})
      console.log(`PERFORM FETCH QUERY RESPONSE DATA: ${JSON.stringify(response.queryResponse.data)}`)
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
    console.log('QUELLIFY - REFETCH LRU CACHE')
    try {
      const cacheSize = lruCacheOrder.length;
      console.log(`REFETCH LRU CACHE - CACHE SIZE: ${cacheSize}`)
      // i < cacheSize - 1 because the last query in the order array is the current query
      for (let i = 0; i < cacheSize - 1; i++) {
        const query = lruCacheOrder[i];
        // Get operation type for query
        const oldAST: DocumentNode = parse(query);
        const { operationType } = determineType(oldAST);
        // If the operation type is not a query, leave it out of the refetch
        if (operationType !== 'query') {
          continue;
        }
        // If the operation type is a query, refetch the query from the LRU cache
        const cachedResults = lruCache.get(query);
        if (cachedResults) {
          console.log(`REFETCH LRU CACHE - FOUND QUERY IN CACHE: ${cachedResults}`)
          // Fetch configuration for post requests that is passed to the performFetch function.
          const fetchConfig: FetchObjType = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, costOptions })
          };
          const data = await fetch(endPoint, fetchConfig);
          const response: QueryResponse = await data.json();
          console.log(`REFETCH QUERY RESPONSE DATA: ${JSON.stringify(response.queryResponse.data)}`)
          updateLRUCache(query, response.queryResponse.data);
        }
      }
    } catch (error) {
      const err: ClientErrorType = {
        log: `Error when trying to refetch LRU cache: ${error}.`,
        status: 400,
        message: {
          err: 'Error in refetchLRUCache. Check server log for more details.'
        }
      };
      console.log('Error when refetching LRU cache: ', err);
      throw error;
    }
  };


  // Create AST based on the input query using the parse method available in the GraphQL library
  // (further reading: https://en.wikipedia.org/wiki/Abstract_syntax_tree).
  const AST: DocumentNode = parse(query);

  // Find operationType, proto using determineType
  const { operationType, proto } = determineType(AST);
  console.log({operationType})

  if (operationType === 'unQuellable') {
    /**
     * If the operation is unQuellable (cannot be cached), fetch the data from the GraphQL endpoint.
     * @return {Promise} - All returns in an async function return promises by default, therefore we are returning a promise that will resolve from perFormFetch.
     */

    // console.log('OPERATION TYPE IS UNQUELLABLE')

    const parsedData: JSONValue = await performFetch(postFetch);
    
    // The second element in the return array is a boolean that the data was not found in the Cache.
    return [parsedData, false];
  } else if (operationType === 'mutation') {
    // console.log('OPERATION TYPE IS MUTATION')
    // Assign mutationType:
    const mutationType: string = Object.keys(proto)[0];
    console.log({mutationType})
    console.log({proto})

       // Check if mutation is an add mutation:
       if (
        mutationType.includes('add') ||
        mutationType.includes('new') ||
        mutationType.includes('create') ||
        mutationType.includes('make')
      ) {
        // console.log('MUTATION TYPE IS ADD, NEW, CREATE, OR MAKE')
        // Execute a POST fetch request with the query.
        const parsedData: JSONObject = await performFetch(postFetch);
        if (parsedData) {
          console.log('MUTATION(ADD, NEW, CREATE, OR MAKE) - parsedData', parsedData)
          mapCache.set(query, parsedData)
          refetchLRUCache();
          return [parsedData, false];
        }
      }

      // Check if mutation type is an edit or update mutation.
      else if(
        mutationType.includes('edit') || 
        mutationType.includes('update')
        ){
          console.log('MUTATION TYPE IS EDIT OR UPDATE')
        // Execute a POST fetch request with the query. (mongoDB & edit update appropriately)
        const parsedData: JSONObject = await performFetch(postFetch);
        console.log('parsed data for edit/update', parsedData)
        //we need to update entry in map & lrucache 
        
        // We are currently clearing the cache for edit/update/delete queries as the cache becomes stale 
        if (parsedData) {
          //clear LRU & Map cache as with mutation & delete; client stored cache is no longer up-to-date
          //OPPORUNITY: MUTATION & DELETE FEATURE TO STORE IN CLIENT CACHE
          clearCache()
          return [parsedData, false];


          //how can we update entry in map (before we were updating entry in loki); 
            //map is storing: {key(query): {results of query}}
            //we want to update value on map specific to the id? 
            //

            
          // Find the existing entry by its ID (why?)
          // const cachedEntry = mapCache.get({ id: parsedData.id }); 
        
          //grab id from mongodb; 
          //update map at specific id? 
          // Search for an entry in the mapCache map based on a condition defined by the predicate function: 
          // (where the id property of the value matches the id property of parsedData).
        //   function findOne(map: any, predicate: any) {
        //     for (const [key, value] of map.entries()) {
        //       if (predicate(value, key, map)) {
        //         return value;
        //       }
        //     }
        //     return undefined; // Return undefined if no matching entry is found
        //   }
        //   const mutation = parsedData[mutationType] as JSONObjectWithId;
        //   console.log("THIS IS PARSEDDATA.ID", mutation.id as string);
        //   const cachedEntry = findOne(mapCache, (v: any, k: any, m: any) => v.id === mutation.id)
        //   console.log('This is new cachedEntry (map)', cachedEntry)
        //   console.log('typeof new cachedEntry', typeof cachedEntry)
        //   // const cachedEntry = mapCache.get(parsedData.id); 

        //   if (cachedEntry) {
        //     // Update the existing entry with the new data
        //     Object.assign(cachedEntry, parsedData); 

        //      // Update the entry in the map cache
        //      mapCache.set(query, cachedEntry );

        //     // Update LRU Cache
        //     updateLRUCache(query, cachedEntry);
        //     refetchLRUCache();
        //     return [cachedEntry, false];
        // }
      }
    }
    // Check if mutation is a delete mutation
      else if (mutationType.includes('delete') || mutationType.includes('remove')) {
        // console.log('MUTATION TYPE IS DELETE OR REMOVE')
        // Execute a fetch request with the query
        console.log('we entered delete/remove mutationtype')
        const parsedData: JSONObject = await performFetch(deleteFetch);
        // parsedData = response.queryResponse.data;
        console.log(`THIS ISparsedData: `, parsedData)
        if (parsedData) {
          //clear LRU & Map cache as with mutation & delete; client stored cache is no longer up-to-date
          //OPPORUNITY: MUTATION & DELETE FEATURE TO STORE IN CLIENT CACHE
          clearCache()
          return [parsedData, false];

        //   console.log(`were insided parsedData: `, parsedData);
        //   // Find the existing entry by its ID
        //   const cachedEntry = parsedData;
        //   console.log(cachedEntry)
        //   //bool returning 
        //   if (cachedEntry) {
        //   // // Remove the item from cache
        //   invalidateCache(query);
        //   mapCache.delete(query);
        //   // Refetch each query in the LRU cache to update the cache
        //   refetchLRUCache();
        //   return [cachedEntry, false];
        // } else {
        //   return [null, false];
        // }
      }
    }
    // Operation type does not meet mutation or unquellable types. 
    // In other words, it is a Query
  } else {
    console.log('OPERATION TYPE IS QUERY!!')
        // If the query has not been made already, execute a fetch request with the query.
        const parsedData: JSONObject = await performFetch(postFetch);
        // console.log("this is parsed Data from query: ", parsedData);
        
        // Add the new data to both client-side caches.
        if (parsedData) {
          lruCache.set(query, parsedData);
          mapCache.set(query, parsedData)
          // console.log("DIS DA MAPCACHE",mapCache)
          const addedEntry = mapCache.get(query); 
          
          // Return the parsed data along with a flag indicating that the data was not found in the cache.
          return [addedEntry, false];
      }
    }
  }

export { Quellify, clearCache, lruCache };