import { Response, Request, NextFunction, RequestHandler } from "express";
import { RedisClientType } from "redis";
import { createClient } from "redis";
import {
  RedisOptionsType,
  RedisStatsType,
  ServerErrorType,
  IdCacheType,
  ProtoObjType,
  Type,
} from "../types";
// import {} from "";
import { ExecutionResult } from "graphql";
import { QuellCache } from "../quell";

const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPassword = process.env.REDIS_PASSWORD || "";

//connection to Redis server
const redisCache: any = createClient({
  socket: { host: redisHost, port: redisPort },
  password: redisPassword,
});

redisCache
  .connect()
  .then((): void => {
    console.log("Connected to redisCache");
  })
  .catch((error: string) => {
    const err: ServerErrorType = {
      log: `Error when trying to connect to redisCache, ${error}`,
      status: 400,
      message: {
        err: "Could not connect to redisCache. Check server log for more details.",
      },
    };
    console.log(err);
  });

/**
 * Flushes the Redis cache. To clear the cache from the client, establish an endpoint that
 * passes the request and response objects to an instance of QuellCache.clearCache.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
let idCache: IdCacheType = {};

export const clearCache = (req: Request, res: Response, next: NextFunction) => {
  console.log("Clearing Redis Cache");
  redisCache.flushAll();
  idCache = {};
  return next();
};

/**
 * Removes key-value from the cache unless the key indicates that the item is not available.
 * @param {string} key - Unique id under which the cached data is stored that needs to be removed.
 */
export const deleteCacheById = async (key: string) => {
  try {
    await redisCache.del(key);
  } catch (error) {
    const err: ServerErrorType = {
      log: `Error inside deleteCacheById function, ${error}`,
      status: 400,
      message: {
        err: "Error in redis - deleteCacheById, Check server log for more details.",
      },
    };
    console.log(err);
  }
};

/**
 * Stores keys in a nested object under parent name.
 * If the key is a duplication, it is stored in an array.
 *  @param {string} objKey - Object key; key to be cached without ID string.
 *  @param {string} keyWithID - Key to be cached with ID string attached; Redis data is stored under this key.
 *  @param {string} currName - The parent object name.
 */
export const updateIdCache = (
  objKey: string,
  keyWithID: string,
  currName: string
): void => {
  // BUG: Add check - If any of the arguments are missing, return immediately.
  // Currently, if currName is undefined, this function is adding 'undefined' as a
  // key in the idCache.

  if (!idCache[currName]) {
    // If the parent object is not yet defined in the idCache, create the object and add the new key.
    idCache[currName] = {};
    idCache[currName][objKey] = keyWithID;
    return;
  } else if (!idCache[currName][objKey]) {
    // If parent object is defined in the idCache, but this is the first child ID, create the
    // array that the ID will be added to.
    idCache[currName][objKey] = [];
  }
  // Add the ID to the array in the idCache.
  (idCache[currName][objKey] as string[]).push(keyWithID);
};

/**
 * Helper function that creates cacheIDs based on information from the prototype in the
 * format of 'field--ID'.
 * @param {string} key - Unique id under which the cached data will be stored.
 * @param {Object} item - Item to be cached.
 */
export const generateCacheID = (queryProto: ProtoObjType): string => {
  const cacheID: string = queryProto.__id
    ? `${queryProto.__type}--${queryProto.__id}`
    : (queryProto.__type as string);
  return cacheID;
};

/**
 * Stringifies and writes an item to the cache unless the key indicates that the item is uncacheable.
 * Sets the expiration time for each item written to cache to the expiration time set on server connection.
 * @param {string} key - Unique id under which the cached data will be stored.
 * @param {Object} item - Item to be cached.
 */

export const writeToCache = (
  key: string,
  item: Type | string[] | ExecutionResult,
  cacheExpiration?: number
): void => {
  const lowerKey: string = key.toLowerCase();
  if (!key.includes("uncacheable")) {
    redisCache.set(lowerKey, JSON.stringify(item));
    redisCache.EXPIRE(lowerKey, cacheExpiration);
  }
};
