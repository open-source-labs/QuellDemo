import { Quellify, clearLokiCache, lruCache } from '../../client/src/quell-client/src/Quellify';
import { CostParamsType } from '../../quell-server/src/types';
// import { lruCache } from '../../client/src/quell-client/src/Quellify';

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

    it('should check the cache for the query, then add it to the cache after', async () => {
      const endPoint = '/graphql';
      const query = 'query { artist(name: "Frank Ocean") { id name albums { id name } } }';
      const costOptions = defaultCostOptions;
      const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
  
      expect(foundInCache).toBe(false);
     
    });

    
  // test: should update the cache when using edit mutation
  it('should update the cache for edit mutation queries', async () => {
    const endPoint = '/graphql';
    const query = 'mutation { editCity(id: "123", name: "New York") { id name } }'; 
    const costOptions = defaultCostOptions; 

    const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];


    expect(foundInCache).toBe(false);

  });


// // test: item should be invalidated when a delete mutation is invoked
//   it('should invalidate item from cache if delete mutation is invoked', async () => {
//     const endPoint = '/graphql';
//     const query = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }'; 
//     const costOptions = defaultCostOptions; // Define costOptions

//     const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];


//     expect(foundInCache).toBe(false);
//     expect(data).toBeDefined();
//     // Add more assertions based on the expected response
//   });
  
//   // test: lruCache should evict the least recently used item from cache if cache size is exceeded
//   it('should retrieve data from the cache for cached queries', async () => {
//     const endPoint = '/graphql';
//     const query = '...'; // Provide an example of a cached query
//     const costOptions = defaultCostOptions; // Define costOptions
    

//     const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];


//     expect(foundInCache).toBe(true);
//     expect(data).toBeDefined();
//     // Add more assertions based on the expected response
//   });

//     // test: 
//     it('should retrieve data from the cache for cached queries', async () => {
//       const endPoint = '/graphql';
//       const query = '...'; // Provide an example of a cached query
//       const costOptions = defaultCostOptions; // Define costOptions
      
  
//       const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
  
  
//       expect(foundInCache).toBe(true);
//       expect(data).toBeDefined();
//       // Add more assertions based on the expected response
//     });
  


});
