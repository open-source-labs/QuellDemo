// import { Response, Request, NextFunction, RequestHandler } from "express";
// import { RedisClientType } from "redis";
// import { createClient } from "redis";
// import {
//   RedisOptionsType,
//   RedisStatsType,
//   ServerErrorType,
//   IdCacheType,
//   ProtoObjType,
//   Type,
//   ResponseDataType,
//   QueryMapType,
// } from "../types";
// import { ExecutionResult } from "graphql";

// const redisPort = Number(process.env.REDIS_PORT) || 6379;
// const redisHost = process.env.REDIS_HOST || "127.0.0.1";
// const redisPassword = process.env.REDIS_PASSWORD || "";

// //connection to Redis server
// const redisCache: any = createClient({
//   socket: { host: redisHost, port: redisPort },
//   password: redisPassword,
// });

// redisCache
//   .connect()
//   .then((): void => {})
//   .catch((error: string) => {
//     const err: ServerErrorType = {
//       log: `Error when trying to connect to redisCache, ${error}`,
//       status: 400,
//       message: {
//         err: "Could not connect to redisCache. Check server log for more details.",
//       },
//     };
//     console.log(err);
//   });

// /**
//  * Removes key-value from the cache unless the key indicates that the item is not available.
//  * @param {string} key - Unique id under which the cached data is stored that needs to be removed.
//  */
// export const deleteCacheById = async (key: string) => {
//   try {
//     await redisCache.del(key);
//   } catch (error) {
//     const err: ServerErrorType = {
//       log: `Error inside deleteCacheById function, ${error}`,
//       status: 400,
//       message: {
//         err: "Error in redis - deleteCacheById, Check server log for more details.",
//       },
//     };
//     console.log(err);
//   }
// };

// /**
//  * Stores keys in a nested object under parent name.
//  * If the key is a duplication, it is stored in an array.
//  *  @param {string} objKey - Object key; key to be cached without ID string.
//  *  @param {string} keyWithID - Key to be cached with ID string attached; Redis data is stored under this key.
//  *  @param {string} currName - The parent object name.
//  */
// export const updateIdCache = (
//   objKey: string,
//   keyWithID: string,
//   currName: string,
//   idCache: IdCacheType
// ): void => {
//   // BUG: Add check - If any of the arguments are missing, return immediately.
//   // Currently, if currName is undefined, this function is adding 'undefined' as a
//   // key in the idCache.

//   if (!idCache[currName]) {
//     // If the parent object is not yet defined in the idCache, create the object and add the new key.
//     idCache[currName] = {};
//     idCache[currName][objKey] = keyWithID;
//     return;
//   } else if (
//     !Array.isArray(idCache[currName][objKey]) ||
//     !idCache[currName][objKey]
//   ) {
//     // If parent object is defined in the idCache, but this is the first child ID, create the
//     // array that the ID will be added to.
//     idCache[currName][objKey] = [];
//   }
//   // Add the ID to the array in the idCache.
//   (idCache[currName][objKey] as string[]).push(keyWithID);
// };

// /**
//  * Helper function that creates cacheIDs based on information from the prototype in the
//  * format of 'field--ID'.
//  * @param {string} key - Unique id under which the cached data will be stored.
//  * @param {Object} item - Item to be cached.
//  */
// export const generateCacheID = (queryProto: ProtoObjType): string => {
//   const cacheID: string = queryProto.__id
//     ? `${queryProto.__type}--${queryProto.__id}`
//     : (queryProto.__type as string);
//   return cacheID;
// };

// /**
//  * Stringifies and writes an item to the cache unless the key indicates that the item is uncacheable.
//  * Sets the expiration time for each item written to cache to the expiration time set on server connection.
//  * @param {string} key - Unique id under which the cached data will be stored.
//  * @param {Object} item - Item to be cached.
//  */
// export const writeToCache = (
//   key: string,
//   item: Type | string[] | ExecutionResult,
//   cacheExpiration: number
// ): void => {
//   const lowerKey: string = key.toLowerCase();
//   if (!key.includes("uncacheable")) {
//     redisCache.set(lowerKey, JSON.stringify(item));
//     redisCache.EXPIRE(lowerKey, cacheExpiration);
//   }
// };

// /**
//  * Traverses over response data and formats it appropriately so that it can be stored in the cache.
//  * @param {Object} responseData - Data we received from an external source of data such as a database or API.
//  * @param {Object} map - Map of queries to their desired data types, used to ensure accurate and consistent caching.
//  * @param {Object} protoField - Slice of the prototype currently being used as a template and reference for the responseData to send information to the cache.
//  * @param {string} currName - Parent object name, used to pass into updateIDCache.
//  */
// export const normalizeForCache = async (
//   responseData: ResponseDataType,
//   map: QueryMapType = {},
//   protoField: ProtoObjType,
//   currName: string,
//   cacheExpiration: number,
//   idCache: IdCacheType
// ) => {
//   for (const resultName in responseData) {
//     const currField = responseData[resultName];
//     const currProto: ProtoObjType = protoField[resultName] as ProtoObjType;
//     if (Array.isArray(currField)) {
//       for (let i = 0; i < currField.length; i++) {
//         const el: ResponseDataType = currField[i];

//         const dataType: string | undefined | string[] = map[resultName];

//         if (typeof el === "object" && typeof dataType === "string") {
//           await normalizeForCache(
//             { [dataType]: el },
//             map,
//             {
//               [dataType]: currProto,
//             },
//             currName,
//             cacheExpiration,
//             idCache
//           );
//         }
//       }
//     } else if (typeof currField === "object") {
//       // Need to get non-Alias ID for cache

//       // Temporary store for field properties
//       const fieldStore: ResponseDataType = {};

//       // Create a cacheID based on __type and __id from the prototype.
//       let cacheID: string = Object.prototype.hasOwnProperty.call(
//         map,
//         currProto.__type as string
//       )
//         ? (map[currProto.__type as string] as string)
//         : (currProto.__type as string);

//       cacheID += currProto.__id ? `--${currProto.__id}` : "";

//       // Iterate over keys in nested object
//       for (const key in currField) {
//         // If prototype has no ID, check field keys for ID (mostly for arrays)
//         if (
//           !currProto.__id &&
//           (key === "id" || key === "_id" || key === "ID" || key === "Id")
//         ) {
//           // If currname is undefined, assign to responseData at cacheid to lower case at name
//           if (responseData[cacheID.toLowerCase()]) {
//             const responseDataAtCacheID = responseData[cacheID.toLowerCase()];
//             if (
//               typeof responseDataAtCacheID !== "string" &&
//               !Array.isArray(responseDataAtCacheID)
//             ) {
//               if (typeof responseDataAtCacheID.name === "string") {
//                 currName = responseDataAtCacheID.name;
//               }
//             }
//           }
//           // If the responseData at lower-cased cacheID at name is not undefined, store under name variable
//           // and copy the logic of writing to cache to update the cache with same things, all stored under name.
//           // Store objKey as cacheID without ID added
//           const cacheIDForIDCache: string = cacheID;
//           cacheID += `--${currField[key]}`;
//           // call IdCache here idCache(cacheIDForIDCache, cacheID)
//           updateIdCache(cacheIDForIDCache, cacheID, currName, idCache);
//         }

//         fieldStore[key] = currField[key];

//         // If object, recurse normalizeForCache assign in that object
//         if (typeof currField[key] === "object") {
//           if (protoField[resultName] !== null) {
//             await normalizeForCache(
//               { [key]: currField[key] },
//               map,
//               {
//                 [key]: (protoField[resultName] as ProtoObjType)[key],
//               },
//               currName,
//               cacheExpiration,
//               idCache
//             );
//           }
//         }
//       }
//       // Store "current object" on cache in JSON format
//       writeToCache(cacheID, fieldStore, cacheExpiration);
//     }
//   }
// };
