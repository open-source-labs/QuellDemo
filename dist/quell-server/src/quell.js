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
exports.QuellCache = void 0;
const parser_1 = require("graphql/language/parser");
const redisConnection_1 = require("./helpers/redisConnection");
const redisHelpers_1 = require("./helpers/redisHelpers");
const graphql_1 = require("graphql");
const quellHelpers_1 = require("./helpers/quellHelpers");
/*
 * Note: This file is identical to the main quell-server file, except that the
 * rateLimiter, depthLimit, and costLimit have been modified to allow the limits
 * to be set in the request body to allow for demoing these features.
 */
const defaultCostParams = {
    maxCost: 5000,
    mutationCost: 5,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    maxDepth: 10,
    ipRate: 3, // requests allowed per second
};
let idCache = {};
/**
 * Creates a QuellCache instance that provides middleware for caching between the graphQL endpoint and
 * front-end requests, connects to redis cloud store via user-specified parameters.
 *    - If there is no cache expiration provided by the user, cacheExpiration defaults to 14 days in seconds.
 *    - If there are no cost parameters provided by the user, costParameters is given the default values.
 *    - If redisPort, redisHost, and redisPassword are omitted, will use local Redis instance.
 *     See https://redis.io/docs/getting-started/installation/ for instructions on installing Redis and starting a Redis server.
 *  @param {ConstructorOptions} options - The options to use for the cache.
 *  @param {GraphQLSchema} options.schema - GraphQL defined schema that is used to facilitate caching by providing valid queries,
 *  mutations, and fields.
 *  @param {number} [options.cacheExpiration=1209600] - Time in seconds for redis values to be evicted from the cache. Defaults to 14 days.
 *  @param {CostParamsType} [options.costParameters=defaultCostParams] - The cost parameters to use for caching. Defaults to:
 *    - maxCost: 5000 (maximum cost allowed before a request is rejected)
 *    - mutationCost: 5 (cost of a mutation)
 *    - objectCost: 2 (cost of retrieving an object)
 *    - scalarCost: 1 (cost of retrieving a scalar)
 *    - depthCostFactor: 1.5 (multiplicative cost of each depth level)
 *    - maxDepth: 10 (depth limit parameter)
 *    - ipRate: 3 (requests allowed per second)
 *  @param {number} options.redisPort - (optional) The Redis port to connect to.
 *  @param {string} options.redisHost - (optional) The Redis host URI to connect to.
 *  @param {string} options.redisPassword - (optional) The Redis password to the host URI.
 *  @example // Omit redisPort, redisHost, and redisPassword to use a local Redis instance.
 *  const quellCache = new QuellCache({
 *    schema: schema,
 *    cacheExpiration: 3600, // 1 hour in seconds
 *    });
 */
class QuellCache {
    constructor({ schema, cacheExpiration = 1209600, // Default expiry time is 14 days in seconds
    costParameters = defaultCostParams, redisPort, redisHost, redisPassword, }) {
        this.idCache = idCache;
        this.schema = schema;
        this.costParameters = Object.assign(defaultCostParams, costParameters);
        this.depthLimit = this.depthLimit.bind(this);
        this.costLimit = this.costLimit.bind(this);
        this.rateLimiter = this.rateLimiter.bind(this);
        this.queryMap = (0, quellHelpers_1.getQueryMap)(schema);
        this.mutationMap = (0, quellHelpers_1.getMutationMap)(schema);
        this.fieldsMap = (0, quellHelpers_1.getFieldsMap)(schema);
        this.cacheExpiration = cacheExpiration;
        this.redisReadBatchSize = 10;
        this.redisCache = redisConnection_1.redisCacheMain;
        this.query = this.query.bind(this);
        this.clearCache = this.clearCache.bind(this);
        this.buildFromCache = this.buildFromCache.bind(this);
        this.generateCacheID = this.generateCacheID.bind(this);
        this.updateCacheByMutation = this.updateCacheByMutation.bind(this);
        this.deleteCacheById = this.deleteCacheById.bind(this);
    }
    /**
     * A redis-based IP rate limiter middleware function that limits the number of requests per second based on IP address using Redis.
     *  @param {Request} req - Express request object, including request body with GraphQL query string.
     *  @param {Response} res - Express response object, will carry query response to next middleware.
     *  @param {NextFunction} next - Express next middleware function, invoked when QuellCache completes its work.
     *  @returns {void} Passes an error to Express if no query was included in the request or if the number of requests by the current IP
     *  exceeds the IP rate limit.
     */
    rateLimiter(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // Set ipRate to the ipRate limit from the request body or use default.
            const ipRateLimit = (_b = (_a = req.body.costOptions) === null || _a === void 0 ? void 0 : _a.ipRate) !== null && _b !== void 0 ? _b : this.costParameters.ipRate;
            // Get the IP address from the request.
            const ipAddress = req.ip;
            // Get the current time in seconds.
            const currentTimeSeconds = Math.floor(Date.now() / 1000);
            // Create a Redis IP key using the IP address and current time.
            const redisIpTimeKey = `${ipAddress}:${currentTimeSeconds}`;
            // Return an error if no query is found on the request.
            if (!req.body.query) {
                const err = {
                    log: "Error: no GraphQL query found on request body, inside rateLimiter",
                    status: 400,
                    message: {
                        err: "Error in rateLimiter: Bad Request. Check server log for more details.",
                    },
                };
                return next(err);
            }
            try {
                // Create a Redis multi command queue.
                const redisRunQueue = this.redisCache.multi();
                // Add to queue: increment the key associated with the current IP address and time in Redis.
                redisRunQueue.incr(redisIpTimeKey);
                // Add to queue: set the key to expire after 1 second.
                redisRunQueue.expire(redisIpTimeKey, 1);
                // Execute the Redis multi command queue.
                const redisResponse = (yield redisRunQueue.exec()).map((result) => JSON.stringify(result));
                // Save result of increment command, which will be the number of requests made by the current IP address in the last second.
                // Since the increment command was the first command in the queue, it will be the first result in the returned array.
                const numRequestsString = (_c = redisResponse[0]) !== null && _c !== void 0 ? _c : "0";
                const numRequests = parseInt(numRequestsString, 10);
                // If the number of requests is greater than the IP rate limit, throw an error.
                if (numRequests > ipRateLimit) {
                    const err = {
                        log: `Redis cache error: Express error handler caught too many requests from this IP address (${ipAddress}): limit is: ${ipRateLimit} requests per second, inside rateLimiter`,
                        status: 429,
                        message: {
                            err: "Error in rateLimiter middleware. Check server log for more details.",
                        },
                    };
                    return next(err);
                }
                return next();
            }
            catch (error) {
                const err = {
                    log: `Catch block in rateLimiter middleware, ${error}`,
                    status: 500,
                    message: {
                        err: "IPRate Limiting Error. Check server log for more details.",
                    },
                };
                return next(err);
            }
        });
    }
    /**
     * The class's controller method. It:
     *    - reads the query string from the request object,
     *    - tries to construct a response from cache,
     *    - reformulates a query for any data not in cache,
     *    - passes the reformulated query to the graphql library to resolve,
     *    - joins the cached and uncached responses,
     *    - decomposes and caches the joined query, and
     *    - attaches the joined response to the response object before passing control to the next middleware.
     *  @param {Request} req - Express request object, including request body with GraphQL query string.
     *  @param {Response} res - Express response object, will carry query response to next middleware.
     *  @param {NextFunction} next - Express next middleware function, invoked when QuellCache completes its work.
     */
    query(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Return an error if no query is found on the request.
            if (!req.body.query) {
                const err = {
                    log: "Error: no GraphQL query found on request body",
                    status: 400,
                    message: {
                        err: "Error in quellCache.query: Check server log for more details.",
                    },
                };
                return next(err);
            }
            // Retrieve GraphQL query string from request body.
            const queryString = req.body.query;
            // Create the abstract syntax tree with graphql-js parser.
            // If depth limit or cost limit were implemented, then we can get the AST and parsed AST from res.locals.
            const AST = res.locals.AST
                ? res.locals.AST
                : (0, parser_1.parse)(queryString);
            // Create response prototype, operation type, and fragments object.
            // The response prototype is used as a template for most operations in Quell including caching, building modified requests, and more.
            const { proto, operationType, frags } = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST);
            // Determine if Quell is able to handle the operation.
            // Quell can handle mutations and queries.
            if (operationType === "unQuellable") {
                /*
                 * If the operation is unQuellable (cannot be cached), execute the operation,
                 * add the result to the response, and return.
                 */
                (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                    .then((queryResult) => {
                    res.locals.queryResponse = queryResult;
                    return next();
                })
                    .catch((error) => {
                    const err = {
                        log: `Error inside catch block of operationType === unQuellable of query, ${error}`,
                        status: 400,
                        message: {
                            err: "GraphQL query Error: Check server log for more details.",
                        },
                    };
                    return next(err);
                });
            }
            else if (operationType === "noID") {
                /*
                 * If ID was not included in the query, it will not be included in the cache. Execute the GraphQL
                 * operation without writing the result to cache and return.
                 */
                // FIXME: Can possibly modify query to ALWAYS have an ID but not necessarily return it back to client
                // unless they also queried for it.
                (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                    .then((queryResult) => {
                    res.locals.queryResponse = queryResult;
                    return next();
                })
                    .catch((error) => {
                    const err = {
                        log: `Error inside catch block of operationType === noID of query, ${error}`,
                        status: 400,
                        message: {
                            err: "GraphQL query Error: Check server log for more details.",
                        },
                    };
                    return next(err);
                });
                /*
                 * The code from here to the end of the current if block was left over from a previous
                 * implementation and is not currently being used.
                 * For the previous implementation: if the ID was not included, used the cache result
                 * if the query string was found in the Redis cache. Otherwise, used the result of
                 * executing the operation and stored the result in cache.
                 */
                // Check Redis for the query string .
                let redisValue = yield (0, redisHelpers_1.getFromRedis)(queryString, this.redisCache);
                if (redisValue != null) {
                    // If the query string is found in Redis, add the result to the response and return.
                    redisValue = JSON.parse(redisValue);
                    res.locals.queryResponse = redisValue;
                    return next();
                }
                else {
                    // Execute the operation, add the result to the response, write the query string and result to cache, and return.
                    (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                        .then((queryResult) => {
                        res.locals.queryResponse = queryResult;
                        this.writeToCache(queryString, queryResult);
                        return next();
                    })
                        .catch((error) => {
                        const err = {
                            log: `Error inside catch block of operationType === noID of query, graphQL query failed, ${error}`,
                            status: 400,
                            message: {
                                err: "GraphQL query Error: Check server log for more details.",
                            },
                        };
                        return next(err);
                    });
                }
            }
            else if (operationType === "mutation") {
                // TODO: If the operation is a mutation, we are currently clearing the cache because it is stale.
                // The goal would be to instead have a normalized cache and update the cache following a mutation.
                this.redisCache.flushAll();
                idCache = {};
                // Determine if the query string is a valid mutation in the schema.
                // Declare variables to store the mutation proto, mutation name, and mutation type.
                let mutationQueryObject;
                let mutationName = "";
                let mutationType = "";
                // Loop through the mutations in the mutationMap.
                for (const mutation in this.mutationMap) {
                    // If any mutation from the mutationMap is found on the proto, the query string includes
                    // a valid mutation. Update the mutation query object, name, type variables.
                    if (Object.prototype.hasOwnProperty.call(proto, mutation)) {
                        mutationName = mutation;
                        mutationType = this.mutationMap[mutation];
                        mutationQueryObject = proto[mutation];
                        break;
                    }
                }
                // Execute the operation and add the result to the response.
                (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                    .then((databaseResponse) => {
                    res.locals.queryResponse = databaseResponse;
                    // If there is a mutation, update the cache with the response.
                    // We don't need to wait until writeToCache is finished.
                    if (mutationQueryObject) {
                        this.updateCacheByMutation(databaseResponse, mutationName, mutationType, mutationQueryObject);
                    }
                    return next();
                })
                    .catch((error) => {
                    const err = {
                        log: `Error inside catch block of operationType === mutation of query, ${error}`,
                        status: 400,
                        message: {
                            err: "GraphQL query (mutation) Error: Check server log for more details.",
                        },
                    };
                    return next(err);
                });
            }
            else {
                /*
                 * Otherwise, the operation type is a query.
                 */
                // Combine fragments on prototype so we can access fragment values in cache.
                const prototype = Object.keys(frags).length > 0
                    ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
                    : proto;
                // Create a list of the keys on prototype that will be passed to buildFromCache.
                const prototypeKeys = Object.keys(prototype);
                // Check the cache for the requested values.
                // buildFromCache will modify the prototype to mark any values not found in the cache
                // so that they may later be retrieved from the database.
                const cacheResponse = yield this.buildFromCache(prototype, prototypeKeys);
                // Create merged response object to merge the data from the cache and the data from the database.
                let mergedResponse;
                // Create query object containing the fields that were not found in the cache.
                // This will be used to create a new GraphQL string.
                const queryObject = (0, quellHelpers_1.createQueryObj)(prototype);
                // If the cached response is incomplete, reformulate query,
                // handoff query, join responses, and cache joined responses.
                if (Object.keys(queryObject).length > 0) {
                    // Create a new query string that contains only the fields not found in the cache so that we can
                    // request only that information from the database.
                    const newQueryString = (0, quellHelpers_1.createQueryStr)(queryObject, operationType);
                    // Execute the query using the new query string.
                    (0, graphql_1.graphql)({ schema: this.schema, source: newQueryString })
                        .then((databaseResponseRaw) => __awaiter(this, void 0, void 0, function* () {
                        // The GraphQL must be parsed in order to join with it with the data retrieved from
                        // the cache before sending back to user.
                        const databaseResponse = JSON.parse(JSON.stringify(databaseResponseRaw));
                        // Check if the cache response has any data by iterating over the keys in cache response.
                        let cacheHasData = false;
                        for (const key in cacheResponse.data) {
                            if (Object.keys(cacheResponse.data[key]).length > 0) {
                                cacheHasData = true;
                            }
                        }
                        // Create merged response object to merge the data from the cache and the data from the database.
                        // If the cache response does not have data then just use the database response.
                        mergedResponse = cacheHasData
                            ? (0, quellHelpers_1.joinResponses)(cacheResponse.data, databaseResponse.data, prototype)
                            : databaseResponse;
                        const currName = "string it should not be again";
                        const test = yield this.normalizeForCache(mergedResponse.data, this.queryMap, prototype, currName);
                        // The response is given a cached key equal to false to indicate to the front end of the demo site that the
                        // information was *NOT* entirely found in the cache.
                        mergedResponse.cached = false;
                        res.locals.queryResponse = Object.assign({}, mergedResponse);
                        return next();
                    }))
                        .catch((error) => {
                        const err = {
                            log: `Error inside catch block of operationType === query of query, ${error}`,
                            status: 400,
                            message: {
                                err: "GraphQL query Error: Check server log for more details.",
                            },
                        };
                        return next(err);
                    });
                }
                else {
                    // If the query object is empty, there is nothing left to query and we can send the information from cache.
                    // The response is given a cached key equal to true to indicate to the front end of the demo site that the
                    // information was entirely found in the cache.
                    cacheResponse.cached = true;
                    res.locals.queryResponse = Object.assign({}, cacheResponse);
                    return next();
                }
            }
        });
    }
    /**
     * Finds any requested information in the cache and assembles it on the cacheResponse.
     * Uses the prototype as a template for cacheResponse and marks any data not found in the cache
     * on the prototype for future retrieval from database.
     * @param {Object} prototype - Unique id under which the cached data will be stored.
     * @param {Array} prototypeKeys - Keys in the prototype.
     * @param {Object} itemFromCache - Item to be cached.
     * @param {boolean} firstRun - Boolean indicated if this is the first run.
     * @param {boolean|string} subID - Used to pass id to recursive calls.
     * @returns {Object} cacheResponse, mutates prototype.
     */
    buildFromCache(prototype, prototypeKeys, itemFromCache = {}, firstRun = true, subID = false) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const typeKey in prototype) {
                // If the current key is a root query, check cache and set any results to itemFromCache.
                if (prototypeKeys.includes(typeKey)) {
                    // Create a variable cacheID, used to determine what ID should be used for the Redis lookup.
                    let cacheID;
                    if (typeof subID === "string") {
                        // Use the subID argument if it is a string (used for recursive calls within buildFromCache).
                        cacheID = subID;
                    }
                    else {
                        cacheID = this.generateCacheID(prototype[typeKey]);
                    }
                    let keyName;
                    // Value won't always be at .name on the args object
                    if (((_a = prototype[typeKey]) === null || _a === void 0 ? void 0 : _a.__args) === null) {
                        keyName = undefined;
                    }
                    else {
                        keyName = Object.values((_b = prototype[typeKey]) === null || _b === void 0 ? void 0 : _b.__args)[0];
                    }
                    if (idCache[keyName] && idCache[keyName][cacheID]) {
                        cacheID = idCache[keyName][cacheID];
                    }
                    // Capitalize first letter of cache ID just in case
                    const capitalized = cacheID.charAt(0).toUpperCase() + cacheID.slice(1);
                    if (idCache[keyName] &&
                        idCache[keyName][capitalized]) {
                        cacheID = idCache[keyName][capitalized];
                    }
                    // const cacheResponse: string | null | void = await getFromRedis(
                    //   cacheID
                    // );
                    const cacheResponse = yield (0, redisHelpers_1.getFromRedis)(cacheID, this.redisCache);
                    itemFromCache[typeKey] = cacheResponse ? JSON.parse(cacheResponse) : {};
                }
                // If itemFromCache at the current key is an array, iterate through and gather data.
                if (Array.isArray(itemFromCache[typeKey])) {
                    // Create a new Redis run queue.
                    let redisRunQueue = this.redisCache.multi();
                    const array = itemFromCache[typeKey];
                    for (let i = 0; i < array.length; i++) {
                        if (typeof itemFromCache[typeKey] === "string") {
                            /**
                             * Helper function that will be called for each response in the
                             * array of responses returned by Redis' exec() command within buildFromCache.
                             * @param {string} cacheResponse - Response from one of the get commands in the Redis queue.
                             */
                            const getCommandCallback = (cacheResponse) => {
                                const tempObj = {};
                                if (cacheResponse) {
                                    const interimCache = JSON.parse(cacheResponse);
                                    for (const property in prototype[typeKey]) {
                                        // If property exists, set on tempObj
                                        if (Object.prototype.hasOwnProperty.call(interimCache, property) &&
                                            !property.includes("__")) {
                                            tempObj[property] = interimCache[property];
                                        }
                                        // If prototype is nested at this field, recurse
                                        else if (!property.includes("__") &&
                                            typeof prototype[typeKey][property] ===
                                                "object") {
                                            this.buildFromCache(prototype[typeKey][property], prototypeKeys, {}, false, `${currTypeKey}--${property}`).then((tempData) => (tempObj[property] = tempData.data));
                                        }
                                        // If cache does not have property, set to false on prototype so that it is sent to GraphQL
                                        else if (!property.includes("__") &&
                                            typeof prototype[typeKey][property] !==
                                                "object") {
                                            prototype[typeKey][property] = false;
                                        }
                                    }
                                    itemFromCache[typeKey][i] = tempObj;
                                }
                                // If there is nothing in the cache for this key, toggle all fields to false so they will be fetched later.
                                else {
                                    for (const property in prototype[typeKey]) {
                                        if (!property.includes("__") &&
                                            typeof prototype[typeKey][property] !==
                                                "object") {
                                            prototype[typeKey][property] = false;
                                        }
                                    }
                                }
                            };
                            const currTypeKey = itemFromCache[typeKey][i];
                            // If the size of the current batch equals the redisReadBatchSize in the constructor
                            // execute the current batch and reset the queue.
                            if (i !== 0 && i % this.redisReadBatchSize === 0) {
                                try {
                                    const cacheResponseRaw = yield redisRunQueue.exec();
                                    cacheResponseRaw.forEach((cacheResponse) => getCommandCallback(JSON.stringify(cacheResponse)));
                                }
                                catch (error) {
                                    const err = {
                                        log: `Error inside 1st-catch block of buildFromCache, ${error}`,
                                        status: 400,
                                        message: {
                                            err: "Error in buildFromCache. Check server log for more details.",
                                        },
                                    };
                                    console.log(err);
                                }
                                redisRunQueue = this.redisCache.multi();
                            }
                            // Add a get command for the current type key to the queue.
                            redisRunQueue.get(currTypeKey.toLowerCase());
                            // Execute any remnants in redis run queue.
                            try {
                                const cacheResponseRaw = yield redisRunQueue.exec();
                                cacheResponseRaw.forEach((cacheResponse) => getCommandCallback(JSON.stringify(cacheResponse)));
                            }
                            catch (error) {
                                const err = {
                                    log: `Error inside 2nd-catch block of buildFromCache, ${error}`,
                                    status: 400,
                                    message: {
                                        err: "Error in buildFromCache. Check server log for more details.",
                                    },
                                };
                                console.log(err);
                            }
                        }
                    }
                }
                // Recurse through buildFromCache using typeKey and prototype.
                // If itemFromCache is empty, then check the cache for data; otherwise, persist itemFromCache
                // if this iteration is a nested query (i.e. if typeKey is a field in the query)
                else if (firstRun === false) {
                    // If this field is not in the cache, then set this field's value to false.
                    if ((itemFromCache === null ||
                        !Object.prototype.hasOwnProperty.call(itemFromCache, typeKey)) &&
                        typeof prototype[typeKey] !== "object" &&
                        !typeKey.includes("__") &&
                        !itemFromCache[0]) {
                        prototype[typeKey] = false;
                    }
                    // If this field is a nested query, then recurse the buildFromCache function and iterate through the nested query.
                    if (!(Object.keys(itemFromCache).length > 0) &&
                        typeof itemFromCache === "object" &&
                        !typeKey.includes("__") &&
                        typeof prototype[typeKey] === "object") {
                        const cacheID = yield this.generateCacheID(prototype);
                        const cacheResponse = yield (0, redisHelpers_1.getFromRedis)(cacheID, this.redisCache);
                        if (cacheResponse)
                            itemFromCache[typeKey] = JSON.parse(cacheResponse);
                        yield this.buildFromCache(prototype[typeKey], prototypeKeys, itemFromCache[typeKey], false);
                    }
                }
                // If not an array and not a recursive call, handle normally
                else {
                    for (const field in prototype[typeKey]) {
                        // If field is not found in cache then toggle to false
                        if (itemFromCache[typeKey] &&
                            !Object.prototype.hasOwnProperty.call(itemFromCache[typeKey], field) &&
                            !field.includes("__") &&
                            typeof prototype[typeKey][field] !== "object") {
                            prototype[typeKey][field] = false;
                        }
                        // If field contains a nested query, then recurse the function and iterate through the nested query
                        if (!field.includes("__") &&
                            typeof prototype[typeKey][field] === "object") {
                            yield this.buildFromCache(prototype[typeKey][field], prototypeKeys, itemFromCache[typeKey][field] || {}, false);
                        }
                        // If there are no data in itemFromCache, toggle to false
                        else if (!itemFromCache[typeKey] &&
                            !field.includes("__") &&
                            typeof prototype[typeKey][field] !== "object") {
                            prototype[typeKey][field] = false;
                        }
                    }
                }
            }
            // Return itemFromCache on a data property to resemble GraphQL response format.
            return { data: itemFromCache };
        });
    }
    /**
     * Traverses over response data and formats it appropriately so that it can be stored in the cache.
     * @param {Object} responseData - Data we received from an external source of data such as a database or API.
     * @param {Object} map - Map of queries to their desired data types, used to ensure accurate and consistent caching.
     * @param {Object} protoField - Slice of the prototype currently being used as a template and reference for the responseData to send information to the cache.
     * @param {string} currName - Parent object name, used to pass into updateIDCache.
     */
    normalizeForCache(responseData, map = {}, protoField, currName) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const resultName in responseData) {
                const currField = responseData[resultName];
                const currProto = protoField[resultName];
                if (Array.isArray(currField)) {
                    for (let i = 0; i < currField.length; i++) {
                        const el = currField[i];
                        const dataType = map[resultName];
                        if (typeof el === "object" && typeof dataType === "string") {
                            yield this.normalizeForCache({ [dataType]: el }, map, {
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
                            this.updateIdCache(cacheIDForIDCache, cacheID, currName);
                        }
                        fieldStore[key] = currField[key];
                        // If object, recurse normalizeForCache assign in that object
                        if (typeof currField[key] === "object") {
                            if (protoField[resultName] !== null) {
                                const test = yield this.normalizeForCache({ [key]: currField[key] }, map, {
                                    [key]: protoField[resultName][key],
                                }, currName);
                            }
                        }
                    }
                    // Store "current object" on cache in JSON format
                    this.writeToCache(cacheID, fieldStore);
                }
            }
        });
    }
    /**
     * Helper function that creates cacheIDs based on information from the prototype in the
     * format of 'field--ID'.
     * @param {string} key - Unique id under which the cached data will be stored.
     * @param {Object} item - Item to be cached.
     */
    generateCacheID(queryProto) {
        const cacheID = queryProto.__id
            ? `${queryProto.__type}--${queryProto.__id}`
            : queryProto.__type;
        return cacheID;
    }
    /**
     * Stringifies and writes an item to the cache unless the key indicates that the item is uncacheable.
     * Sets the expiration time for each item written to cache to the expiration time set on server connection.
     * @param {string} key - Unique id under which the cached data will be stored.
     * @param {Object} item - Item to be cached.
     */
    writeToCache(key, item) {
        const lowerKey = key.toLowerCase();
        if (!key.includes("uncacheable")) {
            this.redisCache.set(lowerKey, JSON.stringify(item));
            this.redisCache.EXPIRE(lowerKey, this.cacheExpiration);
        }
    }
    /**
     * Stores keys in a nested object under parent name.
     * If the key is a duplication, it is stored in an array.
     *  @param {string} objKey - Object key; key to be cached without ID string.
     *  @param {string} keyWithID - Key to be cached with ID string attached; Redis data is stored under this key.
     *  @param {string} currName - The parent object name.
     */
    updateIdCache(objKey, keyWithID, currName) {
        if (!idCache[currName]) {
            idCache[currName] = {};
            idCache[currName][objKey] = keyWithID;
            return undefined; // Explicitly return undefined
        }
        else if (!Array.isArray(idCache[currName][objKey]) || !idCache[currName][objKey]) {
            idCache[currName][objKey] = [];
        }
        else {
            idCache[currName][objKey].push(keyWithID);
        }
        return undefined; // Explicitly return undefined
    }
    /**
     * Updates the Redis cache when the operation is a mutation.
     * - For update and delete mutations, checks if the mutation query includes an id.
     * If so, it will update the cache at that id. If not, it will iterate through the cache
     * to find the appropriate fields to update/delete.
     * @param {Object} dbRespDataRaw - Raw response from the database returned following mutation.
     * @param {string} mutationName - Name of the mutation (e.g. addItem).
     * @param {string} mutationType - Type of mutation (add, update, delete).
     * @param {Object} mutationQueryObject - Arguments and values for the mutation.
     */
    updateCacheByMutation(dbRespDataRaw, mutationName, mutationType, mutationQueryObject) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let fieldsListKey;
            let dbRespId = "";
            let dbRespData = {};
            if (dbRespDataRaw.data) {
                // TODO: Need to modify this logic if ID is not being requested back during
                // mutation query.
                // dbRespDataRaw.data[mutationName] will always return the value at the mutationName
                // in the form of an object.
                dbRespId = (_a = dbRespDataRaw.data[mutationName]) === null || _a === void 0 ? void 0 : _a.id;
                dbRespData = yield JSON.parse(JSON.stringify(dbRespDataRaw.data[mutationName]));
            }
            for (const queryKey in this.queryMap) {
                const queryKeyType = this.queryMap[queryKey];
                if (JSON.stringify(queryKeyType) === JSON.stringify([mutationType])) {
                    fieldsListKey = queryKey;
                    break;
                }
            }
            /**
             * Helper function to delete field keys from cached field list.
             * @param {Set<string> | Array<string>} fieldKeysToRemove - Field keys to be removed from the cached field list.
             */
            const removeFromFieldKeysList = (fieldKeysToRemove) => __awaiter(this, void 0, void 0, function* () {
                if (fieldsListKey) {
                    const cachedFieldKeysListRaw = yield (0, redisHelpers_1.getFromRedis)(fieldsListKey, this.redisCache);
                    if (cachedFieldKeysListRaw !== null &&
                        cachedFieldKeysListRaw !== undefined) {
                        const cachedFieldKeysList = JSON.parse(cachedFieldKeysListRaw);
                        fieldKeysToRemove.forEach((fieldKey) => {
                            // Index position of field key to remove from list of field keys
                            const removalFieldKeyIdx = cachedFieldKeysList.indexOf(fieldKey);
                            if (removalFieldKeyIdx !== -1) {
                                cachedFieldKeysList.splice(removalFieldKeyIdx, 1);
                            }
                        });
                        this.writeToCache(fieldsListKey, cachedFieldKeysList);
                    }
                }
            });
            /**
             * Helper function that loops through the cachedFieldKeysList and helps determine which
             * fieldKeys should be deleted and passes those fields to removeFromFieldKeysList for removal.
             */
            const deleteApprFieldKeys = () => __awaiter(this, void 0, void 0, function* () {
                if (fieldsListKey) {
                    const cachedFieldKeysListRaw = yield (0, redisHelpers_1.getFromRedis)(fieldsListKey, this.redisCache);
                    if (cachedFieldKeysListRaw !== null &&
                        cachedFieldKeysListRaw !== undefined) {
                        const cachedFieldKeysList = JSON.parse(cachedFieldKeysListRaw);
                        const fieldKeysToRemove = new Set();
                        for (let i = 0; i < cachedFieldKeysList.length; i++) {
                            const fieldKey = cachedFieldKeysList[i];
                            const fieldKeyValueRaw = yield (0, redisHelpers_1.getFromRedis)(fieldKey.toLowerCase(), this.redisCache);
                            if (fieldKeyValueRaw !== null && fieldKeyValueRaw !== undefined) {
                                const fieldKeyValue = JSON.parse(fieldKeyValueRaw);
                                let remove = true;
                                for (const arg in mutationQueryObject.__args) {
                                    if (Object.prototype.hasOwnProperty.call(fieldKeyValue, arg)) {
                                        const argValue = mutationQueryObject.__args[arg];
                                        if (fieldKeyValue[arg] !== argValue) {
                                            remove = false;
                                            break;
                                        }
                                    }
                                    else {
                                        remove = false;
                                        break;
                                    }
                                }
                                if (remove === true) {
                                    fieldKeysToRemove.add(fieldKey);
                                    this.deleteCacheById(fieldKey.toLowerCase());
                                }
                            }
                        }
                        removeFromFieldKeysList(fieldKeysToRemove);
                    }
                }
            });
            /**
             * Helper function that loops through the cachedFieldKeysList and updates the appropriate
             * field key values and writes the updated values to the redis cache
             */
            const updateApprFieldKeys = () => __awaiter(this, void 0, void 0, function* () {
                const cachedFieldKeysListRaw = yield (0, redisHelpers_1.getFromRedis)(fieldsListKey, this.redisCache);
                // conditional just in case the resolver wants to throw an error. instead of making quellCache invoke it's caching functions, we break here.
                if (cachedFieldKeysListRaw === undefined)
                    return;
                // list of field keys stored on redis
                if (cachedFieldKeysListRaw !== null) {
                    const cachedFieldKeysList = JSON.parse(cachedFieldKeysListRaw);
                    // Iterate through field key field key values in Redis, and compare to user
                    // specified mutation args to determine which fields are used to update by
                    // and which fields need to be updated.
                    cachedFieldKeysList.forEach((fieldKey) => __awaiter(this, void 0, void 0, function* () {
                        const fieldKeyValueRaw = yield (0, redisHelpers_1.getFromRedis)(fieldKey.toLowerCase(), this.redisCache);
                        if (fieldKeyValueRaw !== null && fieldKeyValueRaw !== undefined) {
                            const fieldKeyValue = JSON.parse(fieldKeyValueRaw);
                            const fieldsToUpdateBy = [];
                            const updatedFieldKeyValue = fieldKeyValue;
                            Object.entries(mutationQueryObject.__args).forEach(([arg, argVal]) => {
                                if (arg in fieldKeyValue && fieldKeyValue[arg] === argVal) {
                                    // Foreign keys are not fields to update by
                                    if (arg.toLowerCase().includes("id") === false) {
                                        fieldsToUpdateBy.push(arg);
                                    }
                                }
                                else {
                                    if (typeof argVal === "string")
                                        updatedFieldKeyValue[arg] = argVal;
                                }
                            });
                            if (fieldsToUpdateBy.length > 0) {
                                this.writeToCache(fieldKey, updatedFieldKeyValue);
                            }
                        }
                    }));
                }
            });
            // If there is no id property on dbRespDataRaw.data[mutationName]
            // dbRespId defaults to an empty string and no redisKey will be found.
            const hypotheticalRedisKey = `${mutationType.toLowerCase()}--${dbRespId}`;
            const redisKey = yield (0, redisHelpers_1.getFromRedis)(hypotheticalRedisKey, this.redisCache);
            if (redisKey) {
                // If the key was found in the Redis server cache, the mutation is either update or delete mutation.
                if (mutationQueryObject.__id) {
                    // If the user specifies dbRespId as an argument in the mutation, then we only need to
                    // update/delete a single cache entry by dbRespId.
                    if (mutationName.substring(0, 3) === "del") {
                        // If the first 3 letters of the mutationName are 'del' then the mutation is a delete mutation.
                        // Users have to prefix their delete mutations with 'del' so that quell can distinguish between delete/update mutations.
                        this.deleteCacheById(`${mutationType.toLowerCase()}--${mutationQueryObject.__id}`);
                        removeFromFieldKeysList([`${mutationType}--${dbRespId}`]);
                    }
                    else {
                        // Update mutation for single dbRespId
                        this.writeToCache(`${mutationType.toLowerCase()}--${mutationQueryObject.__id}`, dbRespData);
                    }
                }
                else {
                    // If the user didn't specify dbRespId, we need to iterate through all key value pairs and determine which key values match dbRespData.
                    // Note that there is a potential edge case here if there are no queries that have type GraphQLList.
                    // if (!fieldsListKey) throw 'error: schema must have a GraphQLList';
                    // Unused variable
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const removalFieldKeysList = [];
                    if (mutationName.substring(0, 3) === "del") {
                        // Mutation is delete mutation
                        deleteApprFieldKeys();
                    }
                    else {
                        updateApprFieldKeys();
                    }
                }
            }
            else {
                // If the key was not found in the Redis server cache, the mutation is an add mutation.
                this.writeToCache(hypotheticalRedisKey, dbRespData);
            }
        });
    }
    /**
     * Removes key-value from the cache unless the key indicates that the item is not available.
     * @param {string} key - Unique id under which the cached data is stored that needs to be removed.
     */
    deleteCacheById(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redisCache.del(key);
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
    }
    /**
     * Flushes the Redis cache. To clear the cache from the client, establish an endpoint that
     * passes the request and response objects to an instance of QuellCache.clearCache.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    clearCache(req, res, next) {
        console.log("Clearing Redis Cache");
        this.redisCache.flushAll();
        idCache = {};
        return next();
    }
    /**
     * Takes in the query, parses it, and identifies the general shape of the request in order
     * to compare the query's depth to the depth limit set on server connection.
     *
     * In the instance of a malicious or overly nested query, short-circuits the query before
     * it goes to the database and passes an error with a status code 413 (content too large).
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     * @returns {void} Passes an error to Express if no query was included in the request or if the depth exceeds the maximum allowed depth.
     */
    // what parameters should they take? If middleware, good as is, has to take in query obj in request, limit set inside.
    // If function inside whole of Quell, (query, limit), so they are explicitly defined and passed in
    depthLimit(req, res, next) {
        var _a;
        // Get maximum depth limit from the cost parameters set on server connection.
        let { maxDepth } = this.costParameters;
        // maxDepth can be reassigned to get depth max limit from req.body if user selects depth limit
        if (req.body.costOptions && req.body.costOptions.maxDepth)
            maxDepth = req.body.costOptions.maxDepth;
        // Get the GraphQL query string from request body.
        const queryString = req.body.query;
        // Pass error to Express if no query is found on the request.
        if (!queryString) {
            {
                const err = {
                    log: "Invalid request, no query found in req.body",
                    status: 400,
                    message: {
                        err: "Error in middleware function: depthLimit. Check server log for more details.",
                    },
                };
                return next(err);
            }
        }
        // Create the abstract syntax tree with graphql-js parser.
        // If costLimit was included before depthLimit in middleware chain, we can get the AST and parsed AST from res.locals.
        const AST = res.locals.AST
            ? res.locals.AST
            : (0, parser_1.parse)(queryString);
        // Create response prototype, operation type, and fragments object.
        // The response prototype is used as a template for most operations in Quell including caching, building modified requests, and more.
        const { proto, operationType, frags, } = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST);
        // Combine fragments on prototype so we can access fragment values in cache.
        const prototype = Object.keys(frags).length > 0
            ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
            : proto;
        /**
         * Recursive helper function that determines if the depth of the prototype object
         * is greater than the maxDepth.
         * @param {Object} proto - The prototype object to determine the depth of.
         * @param {number} [currentDepth=0] - The current depth of the object. Defaults to 0.
         * @returns {void} Passes an error to Express if the depth of the prototype exceeds the maxDepth.
         */
        const determineDepth = (proto, currentDepth = 0) => {
            if (currentDepth > maxDepth) {
                // Pass error to Express if the maximum depth has been exceeded.
                const err = {
                    log: "Error in QuellCache.determineDepth: depth limit exceeded.",
                    status: 413,
                    message: {
                        err: `Depth limit exceeded, tried to send query with the depth of ${currentDepth}.`,
                    },
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields, recursing and increasing currentDepth by 1 if the field is nested.
            Object.keys(proto).forEach((key) => {
                if (typeof proto[key] === "object" && !key.includes("__")) {
                    determineDepth(proto[key], currentDepth + 1);
                }
            });
        };
        // Call the helper function.
        determineDepth(prototype);
        // Attach the AST and parsed AST to res.locals so that the next middleware doesn't need to determine these again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto, operationType, frags };
        return next();
    }
    /**
     * Checks the cost of the query. In the instance of a malicious or overly nested query,
     * short-circuits the query before it goes to the database and passes an error with a
     * status code 413 (content too large).
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {void} Passes an error to Express if no query was included in the request or if the cost exceeds the maximum allowed cost.
     */
    costLimit(req, res, next) {
        var _a;
        // Get the cost parameters set on server connection.
        let { maxCost } = this.costParameters;
        const { mutationCost, objectCost, depthCostFactor, scalarCost } = this.costParameters;
        // maxCost can be reassigned to get maxcost limit from req.body if user selects cost limit
        if (req.body.costOptions && req.body.costOptions.maxCost)
            maxCost = req.body.costOptions.maxCost;
        // Get the GraphQL query string from request body.
        const queryString = req.body.query;
        // Pass error to Express if no query is found on the request.
        if (!queryString) {
            const err = {
                log: "Invalid request, no query found in req.body",
                status: 400,
                message: {
                    err: "Error in QuellCache.costLimit. Check server log for more details.",
                },
            };
            return next(err);
        }
        // Create the abstract syntax tree with graphql-js parser.
        // If depthLimit was included before costLimit in middleware chain, we can get the AST and parsed AST from res.locals.
        const AST = res.locals.AST
            ? res.locals.AST
            : (0, parser_1.parse)(queryString);
        // Create response prototype, operation type, and fragments object.
        // The response prototype is used as a template for most operations in Quell including caching, building modified requests, and more.
        const { proto, operationType, frags, } = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST);
        // Combine fragments on prototype so we can access fragment values in cache.
        const prototype = Object.keys(frags).length > 0
            ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
            : proto;
        // Set initial cost to 0.
        // If the operation is a mutation, add to the cost the mutation cost multiplied by the number of mutations.
        let cost = 0;
        if (operationType === "mutation") {
            cost += Object.keys(prototype).length * mutationCost;
        }
        /**
         * Helper function to pass an error if the cost of the proto is greater than the maximum cost set on server connection.
         * @param {Object} proto - The prototype object to determine the cost of.
         * @returns {void} Passes an error to Express if the cost of the prototype exceeds the maxCost.
         */
        const determineCost = (proto) => {
            // Pass error to Express if the maximum cost has been exceeded.
            if (cost > maxCost) {
                const err = {
                    log: "Error in costLimit.determineCost(helper): cost limit exceeded.",
                    status: 413,
                    message: {
                        err: `Cost limit exceeded, tried to send query with a cost exceeding ${maxCost}.`,
                    },
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields on the prototype.
            Object.keys(proto).forEach((key) => {
                if (typeof proto[key] === "object" && !key.includes("__")) {
                    // If the current field is nested, recurse and increase the total cost by objectCost.
                    cost += objectCost;
                    return determineCost(proto[key]);
                }
                // If the current field is scalar, increase the total cost by the scalarCost.
                if (proto[key] === true && !key.includes("__")) {
                    cost += scalarCost;
                }
            });
        };
        determineCost(prototype);
        /**
         * Helper function to pass an error if the cost of the proto, taking into account depth levels, is greater than
         * the maximum cost set on server connection.
         *
         * This function essentially multiplies the cost by a depth cost adjustment, which is equal to the
         * depthCostFactor raised to the power of the depth.
         * @param {Object} proto - The prototype object to determine the cost of.
         * @param {number} totalCost - Current cost of the prototype.
         * @returns {void} Passes an error to Express if the cost of the prototype exceeds the maxCost.
         */
        const determineDepthCost = (proto, totalCost = cost) => {
            // Pass error to Express if the maximum cost has been exceeded.
            if (totalCost > maxCost) {
                const err = {
                    log: "Error in costLimit.determineDepthCost(helper): cost limit exceeded.",
                    status: 413,
                    message: {
                        err: `Cost limit exceeded, tried to send query with a cost exceeding ${maxCost}.`,
                    },
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields, recursing and multiplying the current total cost
            // by the depthCostFactor if the field is nested.
            Object.keys(proto).forEach((key) => {
                if (typeof proto[key] === "object" && !key.includes("__")) {
                    determineDepthCost(proto[key], totalCost * depthCostFactor);
                }
            });
        };
        determineDepthCost(prototype);
        // Attach the AST and parsed AST to res.locals so that the next middleware doesn't need to determine these again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto, operationType, frags };
        return next();
    }
}
exports.QuellCache = QuellCache;
