"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.QuellCache = void 0;
var parser_1 = require("graphql/language/parser");
var graphql_1 = require("graphql");
var redis_1 = require("redis");
var quellHelpers_1 = require("./helpers/quellHelpers");
/*
 * Note: This file is identical to the main quell-server file, except that the
 * rateLimiter, depthLimit, and costLimit have been modified to allow the limits
 * to be set in the request body to allow for demoing these features.
*/
var defaultCostParams = {
    maxCost: 5000,
    mutationCost: 5,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    maxDepth: 10,
    ipRate: 3 // requests allowed per second
};
var idCache = {};
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
var QuellCache = /** @class */ (function () {
    function QuellCache(_a) {
        var schema = _a.schema, _b = _a.cacheExpiration, cacheExpiration = _b === void 0 ? 1209600 : _b, // Default expiry time is 14 days in seconds
        _c = _a.costParameters, // Default expiry time is 14 days in seconds
        costParameters = _c === void 0 ? defaultCostParams : _c, redisPort = _a.redisPort, redisHost = _a.redisHost, redisPassword = _a.redisPassword;
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
        this.redisCache = (0, redis_1.createClient)({
            socket: { host: redisHost, port: redisPort },
            password: redisPassword
        });
        this.query = this.query.bind(this);
        this.clearCache = this.clearCache.bind(this);
        this.buildFromCache = this.buildFromCache.bind(this);
        this.generateCacheID = this.generateCacheID.bind(this);
        this.updateCacheByMutation = this.updateCacheByMutation.bind(this);
        this.deleteCacheById = this.deleteCacheById.bind(this);
        this.getStatsFromRedis = this.getStatsFromRedis.bind(this);
        this.getRedisInfo = this.getRedisInfo.bind(this);
        this.getRedisKeys = this.getRedisKeys.bind(this);
        this.getRedisValues = this.getRedisValues.bind(this);
        this.redisCache
            .connect()
            .then(function () {
            console.log('Connected to redisCache');
        })["catch"](function (error) {
            var err = {
                log: "Error when trying to connect to redisCache, ".concat(error),
                status: 400,
                message: {
                    err: 'Could not connect to redisCache. Check server log for more details.'
                }
            };
            console.log(err);
        });
    }
    /**
     * A redis-based IP rate limiter middleware function that limits the number of requests per second based on IP address using Redis.
     *  @param {Request} req - Express request object, including request body with GraphQL query string.
     *  @param {Response} res - Express response object, will carry query response to next middleware.
     *  @param {NextFunction} next - Express next middleware function, invoked when QuellCache completes its work.
     *  @returns {void} Passes an error to Express if no query was included in the request or if the number of requests by the current IP
     *  exceeds the IP rate limit.
     */
    QuellCache.prototype.rateLimiter = function (req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var ipRateLimit, ipAddress, currentTimeSeconds, redisIpTimeKey, err, redisRunQueue, redisResponse, numRequestsString, numRequests, err, error_1, err;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ipRateLimit = (_b = (_a = req.body.costOptions) === null || _a === void 0 ? void 0 : _a.ipRate) !== null && _b !== void 0 ? _b : this.costParameters.ipRate;
                        ipAddress = req.ip;
                        currentTimeSeconds = Math.floor(Date.now() / 1000);
                        redisIpTimeKey = "".concat(ipAddress, ":").concat(currentTimeSeconds);
                        // Return an error if no query is found on the request.
                        if (!req.body.query) {
                            err = {
                                log: 'Error: no GraphQL query found on request body, inside rateLimiter',
                                status: 400,
                                message: {
                                    err: 'Error in rateLimiter: Bad Request. Check server log for more details.'
                                }
                            };
                            return [2 /*return*/, next(err)];
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        redisRunQueue = this.redisCache.multi();
                        // Add to queue: increment the key associated with the current IP address and time in Redis.
                        redisRunQueue.incr(redisIpTimeKey);
                        // Add to queue: set the key to expire after 1 second.
                        redisRunQueue.expire(redisIpTimeKey, 1);
                        return [4 /*yield*/, redisRunQueue.exec()];
                    case 2:
                        redisResponse = (_d.sent()).map(function (result) { return JSON.stringify(result); });
                        numRequestsString = (_c = redisResponse[0]) !== null && _c !== void 0 ? _c : '0';
                        numRequests = parseInt(numRequestsString, 10);
                        // If the number of requests is greater than the IP rate limit, throw an error.
                        if (numRequests > ipRateLimit) {
                            err = {
                                log: "Redis cache error: Express error handler caught too many requests from this IP address (".concat(ipAddress, "): limit is: ").concat(ipRateLimit, " requests per second, inside rateLimiter"),
                                status: 429,
                                message: {
                                    err: 'Error in rateLimiter middleware. Check server log for more details.'
                                }
                            };
                            return [2 /*return*/, next(err)];
                        }
                        console.log("IP ".concat(ipAddress, " made a request. Limit is: ").concat(ipRateLimit, " requests per second. Result: OK."));
                        return [2 /*return*/, next()];
                    case 3:
                        error_1 = _d.sent();
                        err = {
                            log: "Catch block in rateLimiter middleware, ".concat(error_1),
                            status: 500,
                            message: {
                                err: 'IPRate Limiting Error. Check server log for more details.'
                            }
                        };
                        return [2 /*return*/, next(err)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
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
    QuellCache.prototype.query = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err, queryString, AST, _b, proto, operationType, frags, redisValue, mutationQueryObject_1, mutationName_1, mutationType_1, mutation, prototype_1, prototypeKeys, cacheResponse_1, mergedResponse_1, queryObject, newQueryString;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Return an error if no query is found on the request.
                        if (!req.body.query) {
                            err = {
                                log: 'Error: no GraphQL query found on request body',
                                status: 400,
                                message: {
                                    err: 'Error in quellCache.query: Check server log for more details.'
                                }
                            };
                            return [2 /*return*/, next(err)];
                        }
                        queryString = req.body.query;
                        AST = res.locals.AST
                            ? res.locals.AST
                            : (0, parser_1.parse)(queryString);
                        _b = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST), proto = _b.proto, operationType = _b.operationType, frags = _b.frags;
                        if (!(operationType === 'unQuellable')) return [3 /*break*/, 1];
                        /*
                         * If the operation is unQuellable (cannot be cached), execute the operation,
                         * add the result to the response, and return.
                         */
                        (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                            .then(function (queryResult) {
                            res.locals.queryResponse = queryResult;
                            return next();
                        })["catch"](function (error) {
                            var err = {
                                log: "Error inside catch block of operationType === unQuellable of query, ".concat(error),
                                status: 400,
                                message: {
                                    err: 'GraphQL query Error: Check server log for more details.'
                                }
                            };
                            return next(err);
                        });
                        return [3 /*break*/, 6];
                    case 1:
                        if (!(operationType === 'noID')) return [3 /*break*/, 3];
                        /*
                         * If ID was not included in the query, it will not be included in the cache. Execute the GraphQL
                         * operation without writing the result to cache and return.
                         */
                        // FIXME: Can possibly modify query to ALWAYS have an ID but not necessarily return it back to client
                        // unless they also queried for it.
                        (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                            .then(function (queryResult) {
                            res.locals.queryResponse = queryResult;
                            return next();
                        })["catch"](function (error) {
                            var err = {
                                log: "Error inside catch block of operationType === noID of query, ".concat(error),
                                status: 400,
                                message: {
                                    err: 'GraphQL query Error: Check server log for more details.'
                                }
                            };
                            return next(err);
                        });
                        return [4 /*yield*/, this.getFromRedis(queryString)];
                    case 2:
                        redisValue = _c.sent();
                        if (redisValue != null) {
                            // If the query string is found in Redis, add the result to the response and return.
                            redisValue = JSON.parse(redisValue);
                            res.locals.queriesResponse = redisValue;
                            return [2 /*return*/, next()];
                        }
                        else {
                            // Execute the operation, add the result to the response, write the query string and result to cache, and return.
                            (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                                .then(function (queryResult) {
                                res.locals.queryResponse = queryResult;
                                _this.writeToCache(queryString, queryResult);
                                return next();
                            })["catch"](function (error) {
                                var err = {
                                    log: "Error inside catch block of operationType === noID of query, graphQL query failed, ".concat(error),
                                    status: 400,
                                    message: {
                                        err: 'GraphQL query Error: Check server log for more details.'
                                    }
                                };
                                return next(err);
                            });
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(operationType === 'mutation')) return [3 /*break*/, 4];
                        // TODO: If the operation is a mutation, we are currently clearing the cache because it is stale.
                        // The goal would be to instead have a normalized cache and update the cache following a mutation.
                        this.redisCache.flushAll();
                        idCache = {};
                        mutationName_1 = '';
                        mutationType_1 = '';
                        // Loop through the mutations in the mutationMap.
                        for (mutation in this.mutationMap) {
                            // If any mutation from the mutationMap is found on the proto, the query string includes
                            // a valid mutation. Update the mutation query object, name, type variables.
                            if (Object.prototype.hasOwnProperty.call(proto, mutation)) {
                                mutationName_1 = mutation;
                                mutationType_1 = this.mutationMap[mutation];
                                mutationQueryObject_1 = proto[mutation];
                                break;
                            }
                        }
                        // Execute the operation and add the result to the response.
                        (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                            .then(function (databaseResponse) {
                            res.locals.queryResponse = databaseResponse;
                            // If there is a mutation, update the cache with the response.
                            // We don't need to wait until writeToCache is finished.
                            if (mutationQueryObject_1) {
                                _this.updateCacheByMutation(databaseResponse, mutationName_1, mutationType_1, mutationQueryObject_1);
                            }
                            return next();
                        })["catch"](function (error) {
                            var err = {
                                log: "Error inside catch block of operationType === mutation of query, ".concat(error),
                                status: 400,
                                message: {
                                    err: 'GraphQL query (mutation) Error: Check server log for more details.'
                                }
                            };
                            return next(err);
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        prototype_1 = Object.keys(frags).length > 0
                            ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
                            : proto;
                        prototypeKeys = Object.keys(prototype_1);
                        return [4 /*yield*/, this.buildFromCache(prototype_1, prototypeKeys)];
                    case 5:
                        cacheResponse_1 = _c.sent();
                        queryObject = (0, quellHelpers_1.createQueryObj)(prototype_1);
                        // If the cached response is incomplete, reformulate query,
                        // handoff query, join responses, and cache joined responses.
                        if (Object.keys(queryObject).length > 0) {
                            newQueryString = (0, quellHelpers_1.createQueryStr)(queryObject, operationType);
                            // Execute the query using the new query string.
                            (0, graphql_1.graphql)({ schema: this.schema, source: newQueryString })
                                .then(function (databaseResponseRaw) { return __awaiter(_this, void 0, void 0, function () {
                                var databaseResponse, cacheHasData, key, currName;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            databaseResponse = JSON.parse(JSON.stringify(databaseResponseRaw));
                                            cacheHasData = false;
                                            for (key in cacheResponse_1.data) {
                                                if (Object.keys(cacheResponse_1.data[key]).length > 0) {
                                                    cacheHasData = true;
                                                }
                                            }
                                            // Create merged response object to merge the data from the cache and the data from the database.
                                            // If the cache response does not have data then just use the database response.
                                            mergedResponse_1 = cacheHasData
                                                ? (0, quellHelpers_1.joinResponses)(cacheResponse_1.data, databaseResponse.data, prototype_1)
                                                : databaseResponse;
                                            currName = 'string it should not be again';
                                            return [4 /*yield*/, this.normalizeForCache(mergedResponse_1.data, this.queryMap, prototype_1, currName)];
                                        case 1:
                                            _a.sent();
                                            // The response is given a cached key equal to false to indicate to the front end of the demo site that the
                                            // information was *NOT* entirely found in the cache.
                                            mergedResponse_1.cached = false;
                                            res.locals.queryResponse = __assign({}, mergedResponse_1);
                                            return [2 /*return*/, next()];
                                    }
                                });
                            }); })["catch"](function (error) {
                                var err = {
                                    log: "Error inside catch block of operationType === query of query, ".concat(error),
                                    status: 400,
                                    message: {
                                        err: 'GraphQL query Error: Check server log for more details.'
                                    }
                                };
                                return next(err);
                            });
                        }
                        else {
                            // If the query object is empty, there is nothing left to query and we can send the information from cache.
                            // The response is given a cached key equal to true to indicate to the front end of the demo site that the
                            // information was entirely found in the cache.
                            cacheResponse_1.cached = true;
                            res.locals.queryResponse = __assign({}, cacheResponse_1);
                            return [2 /*return*/, next()];
                        }
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reads from Redis cache and returns a promise (Redis v4 natively returns a promise).
     * @param {string} key - The key for Redis lookup.
     * @returns {Promise} - A promise representing the value from the redis cache with the provided key.
     */
    QuellCache.prototype.getFromRedis = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerKey, redisResult, error_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (typeof key !== 'string' || key === undefined)
                            return [2 /*return*/];
                        lowerKey = key.toLowerCase();
                        return [4 /*yield*/, this.redisCache.get(lowerKey)];
                    case 1:
                        redisResult = _a.sent();
                        return [2 /*return*/, redisResult];
                    case 2:
                        error_2 = _a.sent();
                        err = {
                            log: "Error in QuellCache trying to getFromRedis, ".concat(error_2),
                            status: 400,
                            message: {
                                err: 'Error in getFromRedis. Check server log for more details.'
                            }
                        };
                        console.log('err in getFromRedis: ', err);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
    QuellCache.prototype.buildFromCache = function (prototype, prototypeKeys, itemFromCache, firstRun, subID) {
        var _a, _b;
        if (itemFromCache === void 0) { itemFromCache = {}; }
        if (firstRun === void 0) { firstRun = true; }
        if (subID === void 0) { subID = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _c, _d, _e, _i, typeKey;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _loop_1 = function (typeKey) {
                            var cacheID, keyName, capitalized, cacheResponse, redisRunQueue, _loop_2, i, cacheID, cacheResponse, _g, _h, _j, _k, field;
                            return __generator(this, function (_l) {
                                switch (_l.label) {
                                    case 0:
                                        if (!prototypeKeys.includes(typeKey)) return [3 /*break*/, 2];
                                        cacheID = void 0;
                                        if (typeof subID === 'string') {
                                            // Use the subID argument if it is a string (used for recursive calls within buildFromCache).
                                            cacheID = subID;
                                        }
                                        else {
                                            cacheID = this_1.generateCacheID(prototype[typeKey]);
                                        }
                                        keyName = void 0;
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
                                        capitalized = cacheID.charAt(0).toUpperCase() + cacheID.slice(1);
                                        if (idCache[keyName] &&
                                            idCache[keyName][capitalized]) {
                                            cacheID = idCache[keyName][capitalized];
                                        }
                                        return [4 /*yield*/, this_1.getFromRedis(cacheID)];
                                    case 1:
                                        cacheResponse = _l.sent();
                                        itemFromCache[typeKey] = cacheResponse ? JSON.parse(cacheResponse) : {};
                                        _l.label = 2;
                                    case 2:
                                        if (!Array.isArray(itemFromCache[typeKey])) return [3 /*break*/, 7];
                                        redisRunQueue = this_1.redisCache.multi();
                                        _loop_2 = function (i) {
                                            var getCommandCallback_1, currTypeKey_1, cacheResponseRaw, error_3, err, cacheResponseRaw, error_4, err;
                                            return __generator(this, function (_m) {
                                                switch (_m.label) {
                                                    case 0:
                                                        if (!(typeof itemFromCache[typeKey] === 'string')) return [3 /*break*/, 9];
                                                        getCommandCallback_1 = function (cacheResponse) {
                                                            var tempObj = {};
                                                            if (cacheResponse) {
                                                                var interimCache = JSON.parse(cacheResponse);
                                                                var _loop_3 = function (property) {
                                                                    // If property exists, set on tempObj
                                                                    if (Object.prototype.hasOwnProperty.call(interimCache, property) &&
                                                                        !property.includes('__')) {
                                                                        tempObj[property] = interimCache[property];
                                                                    }
                                                                    // If prototype is nested at this field, recurse
                                                                    else if (!property.includes('__') &&
                                                                        typeof prototype[typeKey][property] ===
                                                                            'object') {
                                                                        _this.buildFromCache(prototype[typeKey][property], prototypeKeys, {}, false, "".concat(currTypeKey_1, "--").concat(property)).then(function (tempData) { return (tempObj[property] = tempData.data); });
                                                                    }
                                                                    // If cache does not have property, set to false on prototype so that it is sent to GraphQL
                                                                    else if (!property.includes('__') &&
                                                                        typeof prototype[typeKey][property] !==
                                                                            'object') {
                                                                        prototype[typeKey][property] = false;
                                                                    }
                                                                };
                                                                for (var property in prototype[typeKey]) {
                                                                    _loop_3(property);
                                                                }
                                                                itemFromCache[typeKey][i] = tempObj;
                                                            }
                                                            // If there is nothing in the cache for this key, toggle all fields to false so they will be fetched later.
                                                            else {
                                                                for (var property in prototype[typeKey]) {
                                                                    if (!property.includes('__') &&
                                                                        typeof prototype[typeKey][property] !==
                                                                            'object') {
                                                                        prototype[typeKey][property] = false;
                                                                    }
                                                                }
                                                            }
                                                        };
                                                        currTypeKey_1 = itemFromCache[typeKey][i];
                                                        if (!(i !== 0 && i % this_1.redisReadBatchSize === 0)) return [3 /*break*/, 5];
                                                        _m.label = 1;
                                                    case 1:
                                                        _m.trys.push([1, 3, , 4]);
                                                        return [4 /*yield*/, redisRunQueue.exec()];
                                                    case 2:
                                                        cacheResponseRaw = _m.sent();
                                                        cacheResponseRaw.forEach(function (cacheResponse) {
                                                            return getCommandCallback_1(JSON.stringify(cacheResponse));
                                                        });
                                                        return [3 /*break*/, 4];
                                                    case 3:
                                                        error_3 = _m.sent();
                                                        err = {
                                                            log: "Error inside 1st-catch block of buildFromCache, ".concat(error_3),
                                                            status: 400,
                                                            message: {
                                                                err: 'Error in buildFromCache. Check server log for more details.'
                                                            }
                                                        };
                                                        console.log(err);
                                                        return [3 /*break*/, 4];
                                                    case 4:
                                                        redisRunQueue = this_1.redisCache.multi();
                                                        _m.label = 5;
                                                    case 5:
                                                        // Add a get command for the current type key to the queue.
                                                        redisRunQueue.get(currTypeKey_1.toLowerCase());
                                                        _m.label = 6;
                                                    case 6:
                                                        _m.trys.push([6, 8, , 9]);
                                                        return [4 /*yield*/, redisRunQueue.exec()];
                                                    case 7:
                                                        cacheResponseRaw = _m.sent();
                                                        cacheResponseRaw.forEach(function (cacheResponse) {
                                                            return getCommandCallback_1(JSON.stringify(cacheResponse));
                                                        });
                                                        return [3 /*break*/, 9];
                                                    case 8:
                                                        error_4 = _m.sent();
                                                        err = {
                                                            log: "Error inside 2nd-catch block of buildFromCache, ".concat(error_4),
                                                            status: 400,
                                                            message: {
                                                                err: 'Error in buildFromCache. Check server log for more details.'
                                                            }
                                                        };
                                                        console.log(err);
                                                        return [3 /*break*/, 9];
                                                    case 9: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        i = 0;
                                        _l.label = 3;
                                    case 3:
                                        if (!(i < itemFromCache[typeKey].length)) return [3 /*break*/, 6];
                                        return [5 /*yield**/, _loop_2(i)];
                                    case 4:
                                        _l.sent();
                                        _l.label = 5;
                                    case 5:
                                        i++;
                                        return [3 /*break*/, 3];
                                    case 6: return [3 /*break*/, 17];
                                    case 7:
                                        if (!(firstRun === false)) return [3 /*break*/, 12];
                                        // If this field is not in the cache, then set this field's value to false.
                                        if ((itemFromCache === null ||
                                            !Object.prototype.hasOwnProperty.call(itemFromCache, typeKey)) &&
                                            typeof prototype[typeKey] !== 'object' &&
                                            !typeKey.includes('__') &&
                                            !itemFromCache[0]) {
                                            prototype[typeKey] = false;
                                        }
                                        if (!(!(Object.keys(itemFromCache).length > 0) &&
                                            typeof itemFromCache === 'object' &&
                                            !typeKey.includes('__') &&
                                            typeof prototype[typeKey] === 'object')) return [3 /*break*/, 11];
                                        return [4 /*yield*/, this_1.generateCacheID(prototype)];
                                    case 8:
                                        cacheID = _l.sent();
                                        return [4 /*yield*/, this_1.getFromRedis(cacheID)];
                                    case 9:
                                        cacheResponse = _l.sent();
                                        if (cacheResponse)
                                            itemFromCache[typeKey] = JSON.parse(cacheResponse);
                                        return [4 /*yield*/, this_1.buildFromCache(prototype[typeKey], prototypeKeys, itemFromCache[typeKey], false)];
                                    case 10:
                                        _l.sent();
                                        _l.label = 11;
                                    case 11: return [3 /*break*/, 17];
                                    case 12:
                                        _g = prototype[typeKey];
                                        _h = [];
                                        for (_j in _g)
                                            _h.push(_j);
                                        _k = 0;
                                        _l.label = 13;
                                    case 13:
                                        if (!(_k < _h.length)) return [3 /*break*/, 17];
                                        _j = _h[_k];
                                        if (!(_j in _g)) return [3 /*break*/, 16];
                                        field = _j;
                                        // If field is not found in cache then toggle to false
                                        if (itemFromCache[typeKey] &&
                                            !Object.prototype.hasOwnProperty.call(itemFromCache[typeKey], field) &&
                                            !field.includes('__') &&
                                            typeof prototype[typeKey][field] !== 'object') {
                                            prototype[typeKey][field] = false;
                                        }
                                        if (!(!field.includes('__') &&
                                            typeof prototype[typeKey][field] === 'object')) return [3 /*break*/, 15];
                                        return [4 /*yield*/, this_1.buildFromCache(prototype[typeKey][field], prototypeKeys, itemFromCache[typeKey][field] || {}, false)];
                                    case 14:
                                        _l.sent();
                                        return [3 /*break*/, 16];
                                    case 15:
                                        if (!itemFromCache[typeKey] &&
                                            !field.includes('__') &&
                                            typeof prototype[typeKey][field] !== 'object') {
                                            prototype[typeKey][field] = false;
                                        }
                                        _l.label = 16;
                                    case 16:
                                        _k++;
                                        return [3 /*break*/, 13];
                                    case 17: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _c = prototype;
                        _d = [];
                        for (_e in _c)
                            _d.push(_e);
                        _i = 0;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _d.length)) return [3 /*break*/, 4];
                        _e = _d[_i];
                        if (!(_e in _c)) return [3 /*break*/, 3];
                        typeKey = _e;
                        return [5 /*yield**/, _loop_1(typeKey)];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: 
                    // Return itemFromCache on a data property to resemble GraphQL response format.
                    return [2 /*return*/, { data: itemFromCache }];
                }
            });
        });
    };
    /**
     * Traverses over response data and formats it appropriately so that it can be stored in the cache.
     * @param {Object} responseData - Data we received from an external source of data such as a database or API.
     * @param {Object} map - Map of queries to their desired data types, used to ensure accurate and consistent caching.
     * @param {Object} protoField - Slice of the prototype currently being used as a template and reference for the responseData to send information to the cache.
     * @param {string} currName - Parent object name, used to pass into updateIDCache.
     */
    QuellCache.prototype.normalizeForCache = function (responseData, map, protoField, currName) {
        if (map === void 0) { map = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _i, resultName, currField, currProto, i, el, dataType, fieldStore, cacheID, _d, _e, _f, _g, key, responseDataAtCacheID, cacheIDForIDCache;
            var _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _a = responseData;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _m.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 12];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 11];
                        resultName = _c;
                        currField = responseData[resultName];
                        currProto = protoField[resultName];
                        if (!Array.isArray(currField)) return [3 /*break*/, 6];
                        i = 0;
                        _m.label = 2;
                    case 2:
                        if (!(i < currField.length)) return [3 /*break*/, 5];
                        el = currField[i];
                        dataType = map[resultName];
                        if (!(typeof el === 'object' && typeof dataType === 'string')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.normalizeForCache((_h = {}, _h[dataType] = el, _h), map, (_j = {},
                                _j[dataType] = currProto,
                                _j), currName)];
                    case 3:
                        _m.sent();
                        _m.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 11];
                    case 6:
                        if (!(typeof currField === 'object')) return [3 /*break*/, 11];
                        fieldStore = {};
                        cacheID = Object.prototype.hasOwnProperty.call(map, currProto.__type)
                            ? map[currProto.__type]
                            : currProto.__type;
                        cacheID += currProto.__id ? "--".concat(currProto.__id) : '';
                        _d = currField;
                        _e = [];
                        for (_f in _d)
                            _e.push(_f);
                        _g = 0;
                        _m.label = 7;
                    case 7:
                        if (!(_g < _e.length)) return [3 /*break*/, 10];
                        _f = _e[_g];
                        if (!(_f in _d)) return [3 /*break*/, 9];
                        key = _f;
                        // If prototype has no ID, check field keys for ID (mostly for arrays)
                        if (!currProto.__id &&
                            (key === 'id' || key === '_id' || key === 'ID' || key === 'Id')) {
                            // If currname is undefined, assign to responseData at cacheid to lower case at name
                            if (responseData[cacheID.toLowerCase()]) {
                                responseDataAtCacheID = responseData[cacheID.toLowerCase()];
                                if (typeof responseDataAtCacheID !== 'string' &&
                                    !Array.isArray(responseDataAtCacheID)) {
                                    if (typeof responseDataAtCacheID.name === 'string') {
                                        currName = responseDataAtCacheID.name;
                                    }
                                }
                            }
                            cacheIDForIDCache = cacheID;
                            cacheID += "--".concat(currField[key]);
                            // call IdCache here idCache(cacheIDForIDCache, cacheID)
                            this.updateIdCache(cacheIDForIDCache, cacheID, currName);
                        }
                        fieldStore[key] = currField[key];
                        if (!(typeof currField[key] === 'object')) return [3 /*break*/, 9];
                        if (!(protoField[resultName] !== null)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.normalizeForCache((_k = {}, _k[key] = currField[key], _k), map, (_l = {},
                                _l[key] = protoField[resultName][key],
                                _l), currName)];
                    case 8:
                        _m.sent();
                        _m.label = 9;
                    case 9:
                        _g++;
                        return [3 /*break*/, 7];
                    case 10:
                        // Store "current object" on cache in JSON format
                        this.writeToCache(cacheID, fieldStore);
                        _m.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper function that creates cacheIDs based on information from the prototype in the
     * format of 'field--ID'.
     * @param {string} key - Unique id under which the cached data will be stored.
     * @param {Object} item - Item to be cached.
     */
    QuellCache.prototype.generateCacheID = function (queryProto) {
        var cacheID = queryProto.__id
            ? "".concat(queryProto.__type, "--").concat(queryProto.__id)
            : queryProto.__type;
        return cacheID;
    };
    /**
     * Stringifies and writes an item to the cache unless the key indicates that the item is uncacheable.
     * Sets the expiration time for each item written to cache to the expiration time set on server connection.
     * @param {string} key - Unique id under which the cached data will be stored.
     * @param {Object} item - Item to be cached.
     */
    QuellCache.prototype.writeToCache = function (key, item) {
        var lowerKey = key.toLowerCase();
        if (!key.includes('uncacheable')) {
            this.redisCache.set(lowerKey, JSON.stringify(item));
            this.redisCache.EXPIRE(lowerKey, this.cacheExpiration);
        }
    };
    /**
     * Stores keys in a nested object under parent name.
     * If the key is a duplication, it is stored in an array.
     *  @param {string} objKey - Object key; key to be cached without ID string.
     *  @param {string} keyWithID - Key to be cached with ID string attached; Redis data is stored under this key.
     *  @param {string} currName - The parent object name.
     */
    QuellCache.prototype.updateIdCache = function (objKey, keyWithID, currName) {
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
    QuellCache.prototype.updateCacheByMutation = function (dbRespDataRaw, mutationName, mutationType, mutationQueryObject) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var fieldsListKey, dbRespId, dbRespData, queryKey, queryKeyType, removeFromFieldKeysList, deleteApprFieldKeys, updateApprFieldKeys, hypotheticalRedisKey, redisKey, removalFieldKeysList;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dbRespId = '';
                        dbRespData = {};
                        if (dbRespDataRaw.data) {
                            // TODO: Need to modify this logic if ID is not being requested back during
                            // mutation query.
                            // dbRespDataRaw.data[mutationName] will always return the value at the mutationName
                            // in the form of an object.
                            dbRespId = (_a = dbRespDataRaw.data[mutationName]) === null || _a === void 0 ? void 0 : _a.id;
                            dbRespData = JSON.parse(JSON.stringify(dbRespDataRaw.data[mutationName]));
                        }
                        for (queryKey in this.queryMap) {
                            queryKeyType = this.queryMap[queryKey];
                            if (JSON.stringify(queryKeyType) === JSON.stringify([mutationType])) {
                                fieldsListKey = queryKey;
                                break;
                            }
                        }
                        removeFromFieldKeysList = function (fieldKeysToRemove) { return __awaiter(_this, void 0, void 0, function () {
                            var cachedFieldKeysListRaw, cachedFieldKeysList_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!fieldsListKey) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.getFromRedis(fieldsListKey)];
                                    case 1:
                                        cachedFieldKeysListRaw = _a.sent();
                                        if (cachedFieldKeysListRaw !== null &&
                                            cachedFieldKeysListRaw !== undefined) {
                                            cachedFieldKeysList_1 = JSON.parse(cachedFieldKeysListRaw);
                                            fieldKeysToRemove.forEach(function (fieldKey) {
                                                // Index position of field key to remove from list of field keys
                                                var removalFieldKeyIdx = cachedFieldKeysList_1.indexOf(fieldKey);
                                                if (removalFieldKeyIdx !== -1) {
                                                    cachedFieldKeysList_1.splice(removalFieldKeyIdx, 1);
                                                }
                                            });
                                            this.writeToCache(fieldsListKey, cachedFieldKeysList_1);
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); };
                        deleteApprFieldKeys = function () { return __awaiter(_this, void 0, void 0, function () {
                            var cachedFieldKeysListRaw, cachedFieldKeysList, fieldKeysToRemove, i, fieldKey, fieldKeyValueRaw, fieldKeyValue, remove, arg, argValue;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!fieldsListKey) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.getFromRedis(fieldsListKey)];
                                    case 1:
                                        cachedFieldKeysListRaw = _a.sent();
                                        if (!(cachedFieldKeysListRaw !== null &&
                                            cachedFieldKeysListRaw !== undefined)) return [3 /*break*/, 6];
                                        cachedFieldKeysList = JSON.parse(cachedFieldKeysListRaw);
                                        fieldKeysToRemove = new Set();
                                        i = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(i < cachedFieldKeysList.length)) return [3 /*break*/, 5];
                                        fieldKey = cachedFieldKeysList[i];
                                        return [4 /*yield*/, this.getFromRedis(fieldKey.toLowerCase())];
                                    case 3:
                                        fieldKeyValueRaw = _a.sent();
                                        if (fieldKeyValueRaw !== null && fieldKeyValueRaw !== undefined) {
                                            fieldKeyValue = JSON.parse(fieldKeyValueRaw);
                                            remove = true;
                                            for (arg in mutationQueryObject.__args) {
                                                if (Object.prototype.hasOwnProperty.call(fieldKeyValue, arg)) {
                                                    argValue = mutationQueryObject.__args[arg];
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
                                        _a.label = 4;
                                    case 4:
                                        i++;
                                        return [3 /*break*/, 2];
                                    case 5:
                                        removeFromFieldKeysList(fieldKeysToRemove);
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        updateApprFieldKeys = function () { return __awaiter(_this, void 0, void 0, function () {
                            var cachedFieldKeysListRaw, cachedFieldKeysList;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getFromRedis(fieldsListKey)];
                                    case 1:
                                        cachedFieldKeysListRaw = _a.sent();
                                        // conditional just in case the resolver wants to throw an error. instead of making quellCache invoke it's caching functions, we break here.
                                        if (cachedFieldKeysListRaw === undefined)
                                            return [2 /*return*/];
                                        // list of field keys stored on redis
                                        if (cachedFieldKeysListRaw !== null) {
                                            cachedFieldKeysList = JSON.parse(cachedFieldKeysListRaw);
                                            // Iterate through field key field key values in Redis, and compare to user
                                            // specified mutation args to determine which fields are used to update by
                                            // and which fields need to be updated.
                                            cachedFieldKeysList.forEach(function (fieldKey) { return __awaiter(_this, void 0, void 0, function () {
                                                var fieldKeyValueRaw, fieldKeyValue_1, fieldsToUpdateBy_1, updatedFieldKeyValue_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, this.getFromRedis(fieldKey.toLowerCase())];
                                                        case 1:
                                                            fieldKeyValueRaw = _a.sent();
                                                            if (fieldKeyValueRaw !== null && fieldKeyValueRaw !== undefined) {
                                                                fieldKeyValue_1 = JSON.parse(fieldKeyValueRaw);
                                                                fieldsToUpdateBy_1 = [];
                                                                updatedFieldKeyValue_1 = fieldKeyValue_1;
                                                                Object.entries(mutationQueryObject.__args).forEach(function (_a) {
                                                                    var arg = _a[0], argVal = _a[1];
                                                                    if (arg in fieldKeyValue_1 && fieldKeyValue_1[arg] === argVal) {
                                                                        // Foreign keys are not fields to update by
                                                                        if (arg.toLowerCase().includes('id') === false) {
                                                                            fieldsToUpdateBy_1.push(arg);
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (typeof argVal === 'string')
                                                                            updatedFieldKeyValue_1[arg] = argVal;
                                                                    }
                                                                });
                                                                if (fieldsToUpdateBy_1.length > 0) {
                                                                    this.writeToCache(fieldKey, updatedFieldKeyValue_1);
                                                                }
                                                            }
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        hypotheticalRedisKey = "".concat(mutationType.toLowerCase(), "--").concat(dbRespId);
                        return [4 /*yield*/, this.getFromRedis(hypotheticalRedisKey)];
                    case 1:
                        redisKey = _b.sent();
                        if (redisKey) {
                            // If the key was found in the Redis server cache, the mutation is either update or delete mutation.
                            if (mutationQueryObject.__id) {
                                // If the user specifies dbRespId as an argument in the mutation, then we only need to
                                // update/delete a single cache entry by dbRespId.
                                if (mutationName.substring(0, 3) === 'del') {
                                    // If the first 3 letters of the mutationName are 'del' then the mutation is a delete mutation.
                                    // Users have to prefix their delete mutations with 'del' so that quell can distinguish between delete/update mutations.
                                    this.deleteCacheById("".concat(mutationType.toLowerCase(), "--").concat(mutationQueryObject.__id));
                                    removeFromFieldKeysList(["".concat(mutationType, "--").concat(dbRespId)]);
                                }
                                else {
                                    // Update mutation for single dbRespId
                                    this.writeToCache("".concat(mutationType.toLowerCase(), "--").concat(mutationQueryObject.__id), dbRespData);
                                }
                            }
                            else {
                                removalFieldKeysList = [];
                                if (mutationName.substring(0, 3) === 'del') {
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes key-value from the cache unless the key indicates that the item is not available.
     * @param {string} key - Unique id under which the cached data is stored that needs to be removed.
     */
    QuellCache.prototype.deleteCacheById = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.redisCache.del(key)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        err = {
                            log: "Error inside deleteCacheById function, ".concat(error_5),
                            status: 400,
                            message: {
                                err: 'Error in redis - deleteCacheById, Check server log for more details.'
                            }
                        };
                        console.log(err);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Flushes the Redis cache. To clear the cache from the client, establish an endpoint that
     * passes the request and response objects to an instance of QuellCache.clearCache.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    QuellCache.prototype.clearCache = function (req, res, next) {
        console.log('Clearing Redis Cache');
        this.redisCache.flushAll();
        idCache = {};
        return next();
    };
    /**
     * Returns a chain of middleware based on what information (if any) the user would
     * like to request from the specified redisCache. It requires an appropriately
     * configured Express route and saves the specified stats to res.locals, for instance:
     * @example
     *  app.use('/redis', ...quellCache.getRedisInfo({
     *    getStats: true,
     *    getKeys: true,
     *    getValues: true
     *  }));
     * @param {Object} options - Three properties with boolean values:
     *                           getStats, getKeys, getValues
     * @returns {Array} An array of middleware functions that retrieves specified Redis info.
     */
    QuellCache.prototype.getRedisInfo = function (options) {
        if (options === void 0) { options = {
            getStats: true,
            getKeys: true,
            getValues: true
        }; }
        console.log('Getting Redis Info');
        var middleware = [];
        /**
         * Helper function within the getRedisInfo function that returns
         * what redis data should be retrieved based on the passed in options.
         * @param {Object} opts - Options object containing a boolean value for getStats, getKeys, and getValues.
         * @returns {string} String that indicates which data should be retrieved from Redis instance.
         */
        var getOptions = function (opts) {
            var getStats = opts.getStats, getKeys = opts.getKeys, getValues = opts.getValues;
            if (!getStats && getKeys && getValues)
                return 'dontGetStats';
            else if (getStats && getKeys && !getValues)
                return 'dontGetValues';
            else if (!getStats && getKeys && !getValues)
                return 'getKeysOnly';
            else if (getStats && !getKeys && !getValues)
                return 'getStatsOnly';
            else
                return 'getAll';
        };
        switch (getOptions(options)) {
            case 'dontGetStats':
                middleware.push(this.getRedisKeys, this.getRedisValues);
                break;
            case 'dontGetValues':
                middleware.push(this.getStatsFromRedis, this.getRedisKeys);
                break;
            case 'getKeysOnly':
                middleware.push(this.getRedisKeys);
                break;
            case 'getStatsOnly':
                middleware.push(this.getStatsFromRedis);
                break;
            case 'getAll':
                middleware.push(this.getStatsFromRedis, this.getRedisKeys, this.getRedisValues);
                break;
        }
        return middleware;
    };
    /**
     * Gets information and statistics about the server and adds them to the response.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    QuellCache.prototype.getStatsFromRedis = function (req, res, next) {
        var _this = this;
        try {
            var getStats = function () {
                // redisCache.info returns information and statistics about the server as an array of field:value.
                _this.redisCache
                    .info()
                    .then(function (response) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                    var dataLines = response.split('\r\n');
                    var output = {
                        // SERVER
                        server: [
                            // Redis version
                            {
                                name: 'Redis version',
                                value: (_a = dataLines
                                    .find(function (line) { return line.match(/redis_version/); })) === null || _a === void 0 ? void 0 : _a.split(':')[1]
                            },
                            // Redis build id
                            {
                                name: 'Redis build id',
                                value: (_b = dataLines
                                    .find(function (line) { return line.match(/redis_build_id/); })) === null || _b === void 0 ? void 0 : _b.split(':')[1]
                            },
                            // Redis mode
                            {
                                name: 'Redis mode',
                                value: (_c = dataLines
                                    .find(function (line) { return line.match(/redis_mode/); })) === null || _c === void 0 ? void 0 : _c.split(':')[1]
                            },
                            // OS hosting Redis system
                            {
                                name: 'Host operating system',
                                value: (_d = dataLines
                                    .find(function (line) { return line.match(/os/); })) === null || _d === void 0 ? void 0 : _d.split(':')[1]
                            },
                            // TCP/IP listen port
                            {
                                name: 'TCP/IP port',
                                value: (_e = dataLines
                                    .find(function (line) { return line.match(/tcp_port/); })) === null || _e === void 0 ? void 0 : _e.split(':')[1]
                            },
                            // Server time
                            // {
                            //   name: 'System time',
                            //   value: dataLines
                            //     .find((line) => line.match(/server_time_in_usec/))
                            //     .split(':')[1],
                            // },
                            // Number of seconds since Redis server start
                            {
                                name: 'Server uptime (seconds)',
                                value: (_f = dataLines
                                    .find(function (line) { return line.match(/uptime_in_seconds/); })) === null || _f === void 0 ? void 0 : _f.split(':')[1]
                            },
                            // Number of days since Redis server start
                            {
                                name: 'Server uptime (days)',
                                value: (_g = dataLines
                                    .find(function (line) { return line.match(/uptime_in_days/); })) === null || _g === void 0 ? void 0 : _g.split(':')[1]
                            },
                            // Path to server's executable
                            // {
                            //   name: 'Path to executable',
                            //   value: dataLines
                            //     .find((line) => line.match(/executable/))
                            //     .split(':')[1],
                            // },
                            // Path to server's configuration file
                            {
                                name: 'Path to configuration file',
                                value: (_h = dataLines
                                    .find(function (line) { return line.match(/config_file/); })) === null || _h === void 0 ? void 0 : _h.split(':')[1]
                            }
                        ],
                        // CLIENT
                        client: [
                            // Number of connected clients
                            {
                                name: 'Connected clients',
                                value: (_j = dataLines
                                    .find(function (line) { return line.match(/connected_clients/); })) === null || _j === void 0 ? void 0 : _j.split(':')[1]
                            },
                            // Number of sockets used by cluster bus
                            {
                                name: 'Cluster connections',
                                value: (_k = dataLines
                                    .find(function (line) { return line.match(/cluster_connections/); })) === null || _k === void 0 ? void 0 : _k.split(':')[1]
                            },
                            // Max clients
                            {
                                name: 'Max clients',
                                value: (_l = dataLines
                                    .find(function (line) { return line.match(/maxclients/); })) === null || _l === void 0 ? void 0 : _l.split(':')[1]
                            },
                            // Number of clients being tracked
                            // {
                            //   name: 'Tracked clients',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_clients/))
                            //     .split(':')[1],
                            // },
                            // Blocked clients
                            {
                                name: 'Blocked clients',
                                value: (_m = dataLines
                                    .find(function (line) { return line.match(/blocked_clients/); })) === null || _m === void 0 ? void 0 : _m.split(':')[1]
                            }
                        ],
                        // MEMORY
                        memory: [
                            // Total allocated memory
                            {
                                name: 'Total allocated memory',
                                value: (_o = dataLines
                                    .find(function (line) { return line.match(/used_memory_human/); })) === null || _o === void 0 ? void 0 : _o.split(':')[1]
                            },
                            // Peak memory consumed
                            {
                                name: 'Peak memory consumed',
                                value: (_p = dataLines
                                    .find(function (line) { return line.match(/used_memory_peak_human/); })) === null || _p === void 0 ? void 0 : _p.split(':')[1]
                            }
                            // % of peak out of total
                            // {
                            //   name: 'Peak memory used % total',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_peak_perc/))
                            //     .split(':')[1],
                            // },
                            // Initial amount of memory consumed at startup
                            // {
                            //   name: 'Memory consumed at startup',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_startup/))
                            //     .split(':')[1],
                            // },
                            // Size of dataset
                            // {
                            //   name: 'Dataset size (bytes)',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_dataset/))
                            //     .split(':')[1],
                            // },
                            // Percent of data out of net memory usage
                            // {
                            //   name: 'Dataset memory % total',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_dataset_perc/))
                            //     .split(':')[1],
                            // },
                            // Total system memory
                            // {
                            //   name: 'Total system memory',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_system_memory_human/))
                            //     .split(':')[1],
                            // },
                        ],
                        // STATS
                        stats: [
                            // Total number of connections accepted by server
                            {
                                name: 'Total connections',
                                value: (_q = dataLines
                                    .find(function (line) { return line.match(/total_connections_received/); })) === null || _q === void 0 ? void 0 : _q.split(':')[1]
                            },
                            // Total number of commands processed by server
                            {
                                name: 'Total commands',
                                value: (_r = dataLines
                                    .find(function (line) { return line.match(/total_commands_processed/); })) === null || _r === void 0 ? void 0 : _r.split(':')[1]
                            },
                            // Number of commands processed per second
                            {
                                name: 'Commands processed per second',
                                value: (_s = dataLines
                                    .find(function (line) { return line.match(/instantaneous_ops_per_sec/); })) === null || _s === void 0 ? void 0 : _s.split(':')[1]
                            },
                            // Total number of keys being tracked
                            // {
                            //   name: 'Tracked keys',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_total_keys/))
                            //     .split(':')[1],
                            // },
                            // Total number of items being tracked(sum of clients number for each key)
                            // {
                            //   name: 'Tracked items',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_total_items/))
                            //     .split(':')[1],
                            // },
                            // Total number of read events processed
                            // {
                            //   name: 'Reads processed',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_reads_processed/))
                            //     .split(':')[1],
                            // },
                            // Total number of write events processed
                            // {
                            //   name: 'Writes processed',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_writes_processed/))
                            //     .split(':')[1],
                            // },
                            // Total number of error replies
                            {
                                name: 'Error replies',
                                value: (_t = dataLines
                                    .find(function (line) { return line.match(/total_error_replies/); })) === null || _t === void 0 ? void 0 : _t.split(':')[1]
                            },
                            // Total number of bytes read from network
                            {
                                name: 'Bytes read from network',
                                value: (_u = dataLines
                                    .find(function (line) { return line.match(/total_net_input_bytes/); })) === null || _u === void 0 ? void 0 : _u.split(':')[1]
                            },
                            // Networks read rate per second
                            {
                                name: 'Network read rate (Kb/s)',
                                value: (_v = dataLines
                                    .find(function (line) { return line.match(/instantaneous_input_kbps/); })) === null || _v === void 0 ? void 0 : _v.split(':')[1]
                            },
                            // Total number of bytes written to network
                            // {
                            //   name: 'Bytes written to network',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_net_output_bytes/))
                            //     .split(':')[1],
                            // },
                            // Networks write rate per second
                            {
                                name: 'Network write rate (Kb/s)',
                                value: (_w = dataLines
                                    .find(function (line) { return line.match(/instantaneous_output_kbps/); })) === null || _w === void 0 ? void 0 : _w.split(':')[1]
                            }
                        ]
                    };
                    res.locals.redisStats = output;
                    return next();
                })["catch"](function (error) {
                    var err = {
                        log: "Error inside catch block of getting info within getStatsFromRedis, ".concat(error),
                        status: 400,
                        message: {
                            err: 'Error in redis - getStatsFromRedis. Check server log for more details.'
                        }
                    };
                    return next(err);
                });
            };
            getStats();
        }
        catch (error) {
            var err = {
                log: "Error inside catch block of getStatsFromRedis, ".concat(error),
                status: 400,
                message: {
                    err: 'Error in redis - getStatsFromRedis. Check server log for more details.'
                }
            };
            return next(err);
        }
    };
    /**
     * Gets the key names from the Redis cache and adds them to the response.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    QuellCache.prototype.getRedisKeys = function (req, res, next) {
        this.redisCache
            .keys('*')
            .then(function (response) {
            res.locals.redisKeys = response;
            return next();
        })["catch"](function (error) {
            var err = {
                log: "Error inside catch block of getRedisKeys, keys potentially undefined, ".concat(error),
                status: 400,
                message: {
                    err: 'Error in redis - getRedisKeys. Check server log for more details.'
                }
            };
            return next(err);
        });
    };
    /**
     * Gets the values associated with the Redis cache keys and adds them to the response.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     */
    QuellCache.prototype.getRedisValues = function (req, res, next) {
        if (res.locals.redisKeys.length !== 0) {
            this.redisCache
                .mGet(res.locals.redisKeys)
                .then(function (response) {
                res.locals.redisValues = response;
                return next();
            })["catch"](function (error) {
                var err = {
                    log: "Error inside catch block of getRedisValues, ".concat(error),
                    status: 400,
                    message: {
                        err: 'Error in redis - getRedisValues. Check server log for more details.'
                    }
                };
                return next(err);
            });
        }
        else {
            res.locals.redisValues = [];
            return next();
        }
    };
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
    QuellCache.prototype.depthLimit = function (req, res, next) {
        var _a;
        // Get maximum depth limit from the cost parameters set on server connection.
        var maxDepth = this.costParameters.maxDepth;
        // maxDepth can be reassigned to get depth max limit from req.body if user selects depth limit
        if (req.body.costOptions.maxDepth)
            maxDepth = req.body.costOptions.maxDepth;
        // Get the GraphQL query string from request body.
        var queryString = req.body.query;
        // Pass error to Express if no query is found on the request.
        if (!queryString) {
            {
                var err = {
                    log: 'Invalid request, no query found in req.body',
                    status: 400,
                    message: {
                        err: 'Error in middleware function: depthLimit. Check server log for more details.'
                    }
                };
                return next(err);
            }
        }
        // Create the abstract syntax tree with graphql-js parser.
        // If costLimit was included before depthLimit in middleware chain, we can get the AST and parsed AST from res.locals.
        var AST = res.locals.AST
            ? res.locals.AST
            : (0, parser_1.parse)(queryString);
        // Create response prototype, operation type, and fragments object.
        // The response prototype is used as a template for most operations in Quell including caching, building modified requests, and more.
        var _b = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST), proto = _b.proto, operationType = _b.operationType, frags = _b.frags;
        // Combine fragments on prototype so we can access fragment values in cache.
        var prototype = Object.keys(frags).length > 0
            ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
            : proto;
        /**
         * Recursive helper function that determines if the depth of the prototype object
         * is greater than the maxDepth.
         * @param {Object} proto - The prototype object to determine the depth of.
         * @param {number} [currentDepth=0] - The current depth of the object. Defaults to 0.
         * @returns {void} Passes an error to Express if the depth of the prototype exceeds the maxDepth.
         */
        var determineDepth = function (proto, currentDepth) {
            if (currentDepth === void 0) { currentDepth = 0; }
            if (currentDepth > maxDepth) {
                // Pass error to Express if the maximum depth has been exceeded.
                var err = {
                    log: 'Error in QuellCache.determineDepth: depth limit exceeded.',
                    status: 413,
                    message: {
                        err: "Depth limit exceeded, tried to send query with the depth of ".concat(currentDepth, ".")
                    }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields, recursing and increasing currentDepth by 1 if the field is nested.
            Object.keys(proto).forEach(function (key) {
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    determineDepth(proto[key], currentDepth + 1);
                }
            });
        };
        // Call the helper function.
        determineDepth(prototype);
        // Attach the AST and parsed AST to res.locals so that the next middleware doesn't need to determine these again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto: proto, operationType: operationType, frags: frags };
        return next();
    };
    /**
     * Checks the cost of the query. In the instance of a malicious or overly nested query,
     * short-circuits the query before it goes to the database and passes an error with a
     * status code 413 (content too large).
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @param {Function} next - Express next middleware function.
     * @returns {void} Passes an error to Express if no query was included in the request or if the cost exceeds the maximum allowed cost.
     */
    QuellCache.prototype.costLimit = function (req, res, next) {
        var _a;
        // Get the cost parameters set on server connection.
        var maxCost = this.costParameters.maxCost;
        var _b = this.costParameters, mutationCost = _b.mutationCost, objectCost = _b.objectCost, depthCostFactor = _b.depthCostFactor, scalarCost = _b.scalarCost;
        // maxCost can be reassigned to get maxcost limit from req.body if user selects cost limit
        if (req.body.costOptions.maxCost)
            maxCost = req.body.costOptions.maxCost;
        // Get the GraphQL query string from request body.
        var queryString = req.body.query;
        // Pass error to Express if no query is found on the request.
        if (!queryString) {
            var err = {
                log: 'Invalid request, no query found in req.body',
                status: 400,
                message: {
                    err: 'Error in QuellCache.costLimit. Check server log for more details.'
                }
            };
            return next(err);
        }
        // Create the abstract syntax tree with graphql-js parser.
        // If depthLimit was included before costLimit in middleware chain, we can get the AST and parsed AST from res.locals.
        var AST = res.locals.AST
            ? res.locals.AST
            : (0, parser_1.parse)(queryString);
        // Create response prototype, operation type, and fragments object.
        // The response prototype is used as a template for most operations in Quell including caching, building modified requests, and more.
        var _c = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : (0, quellHelpers_1.parseAST)(AST), proto = _c.proto, operationType = _c.operationType, frags = _c.frags;
        // Combine fragments on prototype so we can access fragment values in cache.
        var prototype = Object.keys(frags).length > 0
            ? (0, quellHelpers_1.updateProtoWithFragment)(proto, frags)
            : proto;
        // Set initial cost to 0.
        // If the operation is a mutation, add to the cost the mutation cost multiplied by the number of mutations.
        var cost = 0;
        if (operationType === 'mutation') {
            cost += Object.keys(prototype).length * mutationCost;
        }
        /**
         * Helper function to pass an error if the cost of the proto is greater than the maximum cost set on server connection.
         * @param {Object} proto - The prototype object to determine the cost of.
         * @returns {void} Passes an error to Express if the cost of the prototype exceeds the maxCost.
         */
        var determineCost = function (proto) {
            // Pass error to Express if the maximum cost has been exceeded.
            if (cost > maxCost) {
                var err = {
                    log: 'Error in costLimit.determineCost(helper): cost limit exceeded.',
                    status: 413,
                    message: {
                        err: "Cost limit exceeded, tried to send query with a cost exceeding ".concat(maxCost, ".")
                    }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields on the prototype.
            Object.keys(proto).forEach(function (key) {
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    // If the current field is nested, recurse and increase the total cost by objectCost.
                    cost += objectCost;
                    return determineCost(proto[key]);
                }
                // If the current field is scalar, increase the total cost by the scalarCost.
                if (proto[key] === true && !key.includes('__')) {
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
        var determineDepthCost = function (proto, totalCost) {
            if (totalCost === void 0) { totalCost = cost; }
            // Pass error to Express if the maximum cost has been exceeded.
            if (totalCost > maxCost) {
                var err = {
                    log: 'Error in costLimit.determineDepthCost(helper): cost limit exceeded.',
                    status: 413,
                    message: {
                        err: "Cost limit exceeded, tried to send query with a cost exceeding ".concat(maxCost, ".")
                    }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // Loop through the fields, recursing and multiplying the current total cost
            // by the depthCostFactor if the field is nested.
            Object.keys(proto).forEach(function (key) {
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    determineDepthCost(proto[key], totalCost * depthCostFactor);
                }
            });
        };
        determineDepthCost(prototype);
        // Attach the AST and parsed AST to res.locals so that the next middleware doesn't need to determine these again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto: proto, operationType: operationType, frags: frags };
        return next();
    };
    return QuellCache;
}());
exports.QuellCache = QuellCache;
