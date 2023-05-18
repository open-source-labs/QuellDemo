import { Quellify, clearLokiCache, lruCache } from '../../client/src/quell-client/src/Quellify';
import { CostParamsType } from '../../quell-server/src/types';

const defaultCostOptions: CostParamsType = {
  maxCost: 5000,
  mutationCost: 5,
  objectCost: 2,
  scalarCost: 1,
  depthCostFactor: 1.5,
  maxDepth: 10,
  ipRate: 3
};

// npx jest client-tests/__tests__/quellify.test.ts
//npx jest --testPathPattern=quellify.test.js

describe('Quellify', () => {
  beforeEach(() => {
    // Clear the Loki cache before each test
    clearLokiCache();
  });

  // Test: Checks that caching is working correctly
    it('should check the cache for the query, then add it to the cache after', async () => {
      const endPoint = 'http://localhost:3000/api/graphql';
      const query = 'query { artist(name: "Frank Ocean") { id name albums { id name } } }';
      const costOptions = defaultCostOptions;
      const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
  
      // Assertion: the data should not be found in the cache
      expect(foundInCache).toBe(false);

      // Invoke Quellify on query again
      const [cachedData, updatedCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
      // Assertion: Cached data should be the same as the original query
      expect(cachedData).toBe(data);
      // Assertion: The boolean should return true if it is found in the cache
      expect(updatedCache).toEqual(true);
    
    });

    
  // Test: Checks that edited mutations are being cached
  it('should update the cache for edit mutation queries', async () => {
    const endPoint = 'http://localhost:3000/api/graphql';
    const query = 'mutation { editCity(id: "123", name: "New York") { id name } }'; 
    const costOptions = defaultCostOptions; 

    // Perform mutation query 
    const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];

    // Initial query should not be from the cache
    expect(foundInCache).toBe(false);

    // Perform mutation query again
    const [cachedData, updatedCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    // Assertion: The data should be found in the cache
    expect(updatedCache).toBe(true)
    // Assertion: The data name should be updated
    expect(cachedData.name).toBe('New York')
    // Assertion: The data id should be unchanged
    expect(cachedData.id).toBe(data.id)

  });

// expect(data).toBeDefined();
// Test: item should be invalidated when a delete mutation is invoked
  it('should invalidate item from cache if delete mutation is invoked', async () => {
    const endPoint = 'http://localhost:3000/api/graphql';
    const query = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }'; 
    const costOptions = defaultCostOptions; // Define costOptions
    // Perform initial query
    const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    // Assertion: Data should not be found in cache
    expect(foundInCache).toBe(false);

    // Perform a delete mutation on the cache
    const deleteQuery = 'mutation { deleteCity(name: "San Diego") { id name } }'
    // Requery
    const [cachedData, updatedCache] = await Quellify(endPoint, deleteQuery, costOptions) as [any, boolean];

    // Assertion: The data should be found in the cache
    expect(updatedCache).toBe(false);
    // query the data once more with the deleted query
    const [mutatedData, isCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    // Assertion: Cache was successfully deleted
    expect(isCache).toBe(false)

  });
  
  // Test: lruCache should evict the least recently used item from cache if cache size is exceeded
  it('should evict the LRU item from cache is cache size is exceeded', async () => {
    const endPoint = 'http://localhost:3000/api/graphql';
    const costOptions = defaultCostOptions;
    const query1 = 'query { artist(name: "Frank Ocean") { id name albums { id name } } }';
    const query2 = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }';
    const query3 = 'query { country(name: "United States") { id name cities { id name attractions { id name } } } }';

    // Invoke Quellify on each query to add to cache
    await Quellify(endPoint, query1, costOptions);
    await Quellify(endPoint, query2, costOptions);

    // Assertion: lruCache should contain the queries
    expect(lruCache.has(query1)).toBe(true);
    expect(lruCache.has(query2)).toBe(true);

    // Invoke Quellify again on third query to exceed max cache size
    await Quellify(endPoint, query3, costOptions);

    // Assertion: lruCache should evict the LRU item
    expect(lruCache.has(query1)).toBe(true);
    
    // Assertion: lruCache should still contain the most recently used items
    expect(lruCache.has(query2)).toBe(false);
    expect(lruCache.has(query3)).toBe(true);

  });

});
