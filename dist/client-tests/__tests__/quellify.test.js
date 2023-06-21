"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Quellify_1 = require("../../client/src/quell-client/src/Quellify");
const defaultCostOptions = {
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
        (0, Quellify_1.clearCache)();
    });
    // // Test: Checks that caching is working correctly
    //   it('should check the cache for the query, then add it to the cache after', async () => {
    //     const endPoint = 'http://localhost:3000/api/graphql';
    //     const query = 'query { artist(name: "Frank Ocean") { id name albums { id name } } }';
    //     const costOptions = defaultCostOptions;
    //     const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //     // Assertion: the data should not be found in the cache
    //     expect(foundInCache).toBe(false);
    //     // Invoke Quellify on query again
    //     const [cachedData, updatedCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //     // Assertion: Cached data should be the same as the original query
    //     expect(cachedData).toBe(data);
    //     // Assertion: The boolean should return true if it is found in the cache
    //     expect(updatedCache).toEqual(true);
    //   });
    // Test: Tests if delete mutation works
    // it('should update the cache for edit mutation queries', async () => {
    //   const endPoint = 'http://localhost:3000/api/graphql';
    //   const query = 'mutation { deleteCity(name: "San Diego", country: "United States") { id name } }'; 
    //   const costOptions = defaultCostOptions; 
    //   // Perform add mutation query
    //   const [deleteMutationCity, deleteMutationFoundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //   // Get the cityId on the mutation query
    //   // const cityId = addMutationData.addCity.id;
    //   // Assertion: Original query should be in the cache
    //   expect(deleteMutationFoundInCache).toBe(false);
    // });
    // Test: Checks that edited mutations are being cached
    // it('should update the cache for edit mutation queries', async () => {
    //   const endPoint = 'http://localhost:3000/api/graphql';
    //   const addQuery = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }'; 
    //   const costOptions = defaultCostOptions; 
    //   // Perform add mutation query (First query but isnt cached)
    //   const [addMutationData, addMutationfoundInCache] = await Quellify(endPoint, addQuery, costOptions) as [any, boolean];
    //   console.log("FIRST QUERY ON TEST", addMutationData);
    //   // Get the cityId on the mutation query
    //   const cityId = addMutationData.addCity.id;
    //   // console.log('san diego', cityId)
    //   // Assertion: Original query should be in the cache
    //   expect(addMutationfoundInCache).toBe(false);
    //   const city = "Las Vegas";
    //   // TEMPLATE LITERAL WORKS IF YOU PUT IT IN QUOTES
    //   const backticks = `mutation { editCity(id: "${cityId}",name: "${city}", country: "United States") { id name } }`; 
    //   // const editQuery = 'mutation { editCity(name: "Los Altos", country: "United States") { id name } }'; 
    //   const [addMutations2, addCache2] = await Quellify(endPoint, backticks, costOptions) as [any, boolean];
    //   console.log("IM SECOND QUERY", addMutations2);
    //   expect(addCache2).toBe(false);
    //   console.log("DOES THE QUERY 1 EXIST", addMutationData);
    //   console.log("Query 1 Id: ", addMutationData);
    //   console.log("Query 2 Id: ", addMutations2)
    //   console.log('san diego', cityId)
    //   console.log('addMutations2ID', addMutations2.editCity.id)
    //   // // TESTING
    //   // const addQuery2 = 'mutation { addCity(name: "San Diego 2", country: "United States") { id name } }'; 
    //   // const [secondMutationData, secondAddMutationFoundInCache] = await Quellify(endPoint, addQuery2, costOptions) as [any, boolean];
    //   // expect(secondAddMutationFoundInCache).toBe(true);
    //    // Perform edit mutation query (Second query for mutation)
    //   //  const mutationQuery = 'mutation($cityId: ID!, $name: String!, $country: String!) { editCity(id: $cityId, name: $name, country: $country) { id name country } }';
    // //   const mutationQuery = `
    // //   mutation EditCity($cityId: ID!, $name: String!, $country: String!) {
    // //     editCity(id: $cityId, name: $name, country: $country) {
    // //       id
    // //       name
    // //     }
    // //   }
    // // `;
    // // const variables = {
    // //   cityId: cityId,
    // //   name: "LBC",
    // //   country: "United States"
    // // };
    // // const [cacheMutationData, cacheAddMutationfoundInCache] = await Quellify(
    // //   endPoint,
    // //   mutationQuery,
    // //   costOptions,
    // //   { variables } // Pass variables as an object with the "variables" key
    // // ) as [any, boolean];
    // //   //  const mutationQuery = 'mutation { editCity(id: , name: "LBC", country: "United States") { id name country } }';
    // //   // const [cacheMutationData, cacheAddMutationfoundInCache] = await Quellify(endPoint, mutationQuery, costOptions) as [any, boolean];
    // //   console.log(`SECOND QUERY ON TEST ${cacheMutationData}`);
    //   // const hi = await Quellify(endPoint, mutationQuery, costOptions);
    //   // console.log(`this is hi, ${hi}`);
    //   // expect(cacheAddMutationfoundInCache).toBe(true);
    //   // const data = await Quellify(endPoint, query, costOptions);
    //   // const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //   // // Initial query should not be from the cache
    //   // expect(foundInCache).toBe(false);
    //   // // Perform mutation query again
    //   // const [cachedData, updatedCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //   // // Assertion: The data should be found in the cache
    //   // expect(updatedCache).toBe(true)
    //   // // Assertion: The data name should be updated
    //   // expect(cachedData.name).toBe('New York')
    //   // // Assertion: The data id should be unchanged
    //   // expect(cachedData.id).toBe(data.id)
    // });
    // Test: item should be invalidated when a delete mutation is invoked
    it('should invalidate item from cache if delete mutation is invoked', () => __awaiter(void 0, void 0, void 0, function* () {
        const endPoint = 'http://localhost:3000/api/graphql';
        const addQuery = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }';
        const deleteQuery = 'mutation { deleteCity(name: "San Diego") { id name } }';
        const costOptions = defaultCostOptions;
        // Perform the add mutation query
        const [addMutationData, addMutationFoundInCache] = yield (0, Quellify_1.Quellify)(endPoint, addQuery, costOptions);
        // Assertion: Data should not be found in cache
        expect(addMutationFoundInCache).toBe(false);
        // Perform the delete mutation query
        const [deleteMutationData, deleteMutationFoundInCache] = yield (0, Quellify_1.Quellify)(endPoint, deleteQuery, costOptions);
        console.log('delete mutation data', deleteMutationData);
        // Assertion: Data should not be found in cache after delete mutation
        expect(deleteMutationFoundInCache).toBe(false);
        // Perform the add mutation query again
        const [addMutationData2, addMutationFoundInCache2] = yield (0, Quellify_1.Quellify)(endPoint, addQuery, costOptions);
        // Assertion: Data should not be found in cache after delete mutation
        expect(addMutationFoundInCache2).toBe(true);
    }));
    // expect(data).toBeDefined();
    // Test: item should be invalidated when a delete mutation is invoked
    // it('should invalidate item from cache if delete mutation is invoked', async () => {
    //   const endPoint = 'http://localhost:3000/api/graphql';
    //   const query = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }'; 
    //   const costOptions = defaultCostOptions; // Define costOptions
    //   // Perform initial query
    //   const [data, foundInCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //   // Assertion: Data should not be found in cache
    //   expect(foundInCache).toBe(false);
    //   // Perform a delete mutation on the cache
    //   const deleteQuery = 'mutation { deleteCity(name: "San Diego") { id name } }'
    //   // Requery
    //   const [cachedData, updatedCache] = await Quellify(endPoint, deleteQuery, costOptions) as [any, boolean];
    //   // Assertion: The data should be found in the cache
    //   expect(updatedCache).toBe(false);
    //   // query the data once more with the deleted query
    //   const [mutatedData, isCache] = await Quellify(endPoint, query, costOptions) as [any, boolean];
    //   // Assertion: Cache was successfully deleted
    //   expect(isCache).toBe(false)
    // });
    //-------------------------------------------NEXT TEST-------------------------//
    // Test: lruCache should evict the least recently used item from cache if cache size is exceeded
    // it('should evict the LRU item from cache if cache size is exceeded', async () => {
    //   const endPoint = 'http://localhost:3000/api/graphql';
    //   const costOptions = defaultCostOptions;
    //   const query1 = 'query { artist(name: "Frank Ocean") { id name albums { id name } } }';
    //   const query2 = 'query { country(name: "United States") { id name cities { id name attractions { id name } } } }';
    //   const query3 = 'mutation { addCity(name: "San Diego", country: "United States") { id name } }';
    //   // Invoke Quellify on each query to add to cache
    //   await Quellify(endPoint, query1, costOptions);
    //   await Quellify(endPoint, query2, costOptions);
    //   // Assertion: lruCache should contain the queries
    //   expect(lruCache.has(query1)).toBe(true);
    //   expect(lruCache.has(query2)).toBe(true);
    //   // Invoke Quellify again on third query to exceed max cache size
    //   await Quellify(endPoint, query3, costOptions);
    //   // Assertion: lruCache should evict the LRU item
    //   expect(lruCache.has(query1)).toBe(false);
    //   // Assertion: lruCache should still contain the most recently used items
    //   expect(lruCache.has(query2)).toBe(true);
    //   expect(lruCache.has(query3)).toBe(true);
    // });
});
