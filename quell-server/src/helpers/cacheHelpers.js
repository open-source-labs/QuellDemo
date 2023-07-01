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
exports.normalizeForCache = exports.writeToCache = exports.generateCacheID = exports.updateIdCache = exports.deleteCacheById = exports.clearCache = void 0;
const redis_1 = require("redis");
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPassword = process.env.REDIS_PASSWORD || "";
//connection to Redis server
const redisCache = (0, redis_1.createClient)({
    socket: { host: redisHost, port: redisPort },
    password: redisPassword,
});
redisCache
    .connect()
    .then(() => {
    console.log("Connected to redisCache");
})
    .catch((error) => {
    const err = {
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
let idCache = {};
const clearCache = (req, res, next) => {
    console.log("Clearing Redis Cache");
    redisCache.flushAll();
    idCache = {};
    return next();
};
exports.clearCache = clearCache;
/**
 * Removes key-value from the cache unless the key indicates that the item is not available.
 * @param {string} key - Unique id under which the cached data is stored that needs to be removed.
 */
const deleteCacheById = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisCache.del(key);
    }
    catch (error) {
        const err = {
            log: `Error inside deleteCacheById function, ${error}`,
            status: 400,
            message: {
                err: "Error in redis - deleteCacheById, Check server log for more details.",
            },
        };
        console.log(err);
    }
});
exports.deleteCacheById = deleteCacheById;
/**
 * Stores keys in a nested object under parent name.
 * If the key is a duplication, it is stored in an array.
 *  @param {string} objKey - Object key; key to be cached without ID string.
 *  @param {string} keyWithID - Key to be cached with ID string attached; Redis data is stored under this key.
 *  @param {string} currName - The parent object name.
 */
const updateIdCache = (objKey, keyWithID, currName) => {
    // BUG: Add check - If any of the arguments are missing, return immediately.
    // Currently, if currName is undefined, this function is adding 'undefined' as a
    // key in the idCache.
    if (!idCache[currName]) {
        // If the parent object is not yet defined in the idCache, create the object and add the new key.
        idCache[currName] = {};
        idCache[currName][objKey] = keyWithID;
        return;
    }
    else if (!idCache[currName][objKey]) {
        // If parent object is defined in the idCache, but this is the first child ID, create the
        // array that the ID will be added to.
        idCache[currName][objKey] = [];
    }
    // Add the ID to the array in the idCache.
    idCache[currName][objKey].push(keyWithID);
};
exports.updateIdCache = updateIdCache;
/**
 * Helper function that creates cacheIDs based on information from the prototype in the
 * format of 'field--ID'.
 * @param {string} key - Unique id under which the cached data will be stored.
 * @param {Object} item - Item to be cached.
 */
const generateCacheID = (queryProto) => {
    const cacheID = queryProto.__id
        ? `${queryProto.__type}--${queryProto.__id}`
        : queryProto.__type;
    return cacheID;
};
exports.generateCacheID = generateCacheID;
/**
 * Stringifies and writes an item to the cache unless the key indicates that the item is uncacheable.
 * Sets the expiration time for each item written to cache to the expiration time set on server connection.
 * @param {string} key - Unique id under which the cached data will be stored.
 * @param {Object} item - Item to be cached.
 */
const writeToCache = (key, item, cacheExpiration) => {
    const lowerKey = key.toLowerCase();
    if (!key.includes("uncacheable")) {
        redisCache.set(lowerKey, JSON.stringify(item));
        redisCache.EXPIRE(lowerKey, cacheExpiration);
    }
};
exports.writeToCache = writeToCache;
/**
 * Traverses over response data and formats it appropriately so that it can be stored in the cache.
 * @param {Object} responseData - Data we received from an external source of data such as a database or API.
 * @param {Object} map - Map of queries to their desired data types, used to ensure accurate and consistent caching.
 * @param {Object} protoField - Slice of the prototype currently being used as a template and reference for the responseData to send information to the cache.
 * @param {string} currName - Parent object name, used to pass into updateIDCache.
 */
const normalizeForCache = (responseData, map = {}, protoField, currName, cacheExpiration) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("normalizing cache");
    for (const resultName in responseData) {
        const currField = responseData[resultName];
        const currProto = protoField[resultName];
        if (Array.isArray(currField)) {
            for (let i = 0; i < currField.length; i++) {
                const el = currField[i];
                const dataType = map[resultName];
                if (typeof el === "object" && typeof dataType === "string") {
                    yield (0, exports.normalizeForCache)({ [dataType]: el }, map, {
                        [dataType]: currProto,
                    }, currName);
                }
            }
        }
        else if (typeof currField === "object") {
            // Need to get non-Alias ID for cache
            // Temporary store for field properties
            const fieldStore = {};
            // Create a cacheID based on __type and __id from the prototype.
            let cacheID = Object.prototype.hasOwnProperty.call(map, currProto.__type)
                ? map[currProto.__type]
                : currProto.__type;
            cacheID += currProto.__id ? `--${currProto.__id}` : "";
            // Iterate over keys in nested object
            for (const key in currField) {
                // If prototype has no ID, check field keys for ID (mostly for arrays)
                if (!currProto.__id &&
                    (key === "id" || key === "_id" || key === "ID" || key === "Id")) {
                    // If currname is undefined, assign to responseData at cacheid to lower case at name
                    if (responseData[cacheID.toLowerCase()]) {
                        const responseDataAtCacheID = responseData[cacheID.toLowerCase()];
                        if (typeof responseDataAtCacheID !== "string" &&
                            !Array.isArray(responseDataAtCacheID)) {
                            if (typeof responseDataAtCacheID.name === "string") {
                                currName = responseDataAtCacheID.name;
                            }
                        }
                    }
                    // If the responseData at lower-cased cacheID at name is not undefined, store under name variable
                    // and copy the logic of writing to cache to update the cache with same things, all stored under name.
                    // Store objKey as cacheID without ID added
                    const cacheIDForIDCache = cacheID;
                    cacheID += `--${currField[key]}`;
                    // call IdCache here idCache(cacheIDForIDCache, cacheID)
                    (0, exports.updateIdCache)(cacheIDForIDCache, cacheID, currName);
                }
                fieldStore[key] = currField[key];
                // If object, recurse normalizeForCache assign in that object
                if (typeof currField[key] === "object") {
                    if (protoField[resultName] !== null) {
                        yield (0, exports.normalizeForCache)({ [key]: currField[key] }, map, {
                            [key]: protoField[resultName][key],
                        }, currName);
                    }
                }
            }
            // Store "current object" on cache in JSON format
            (0, exports.writeToCache)(cacheID, fieldStore, cacheExpiration);
        }
    }
});
exports.normalizeForCache = normalizeForCache;
