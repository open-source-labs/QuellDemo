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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.QuellCache = void 0;
var parser_1 = require("graphql/language/parser");
var visitor_1 = require("graphql/language/visitor");
var graphql_1 = require("graphql");
var redis_1 = require("redis");
var defaultCostParams = {
    maxCost: 5000,
    mutationCost: 5,
    objectCost: 2,
    scalarCost: 1,
    depthCostFactor: 1.5,
    maxDepth: 10,
    ipRate: 3
};
var idCache = {};
/**
 * Creates a QuellCache instance that provides middleware for caching between the graphQL endpoint and
 * front-end requests, connects to redis cloud store via user-specified parameters.
 *    - it takes in a schema, redis specifications grouped into an object, cache expiration time in seconds,
 *    and cost parameters as an object
 *    - if there is no cache expiration provided by the user, cacheExpiration defaults to 14 days in seconds,
 *    - if there are no cost parameters provided by the user, costParameters is given the default values
 *    found in defaultCostParameters
 *  @param {Object} schema - GraphQL defined schema that is used to facilitate caching by providing valid queries,
 *  mutations, and fields
 *  @param {Number} cacheExpiration - Time in seconds for redis values to be evicted from the cache
 *  @param {Object} costParameters - An object with key-pair values for maxCost, mutationCost, objectCost,
 *  scalarCost, depthCostFactor, maxDepth, ipRate
 *  @param {Number} redisPort - Redis port that Quell uses to facilitate caching
 *  @param {String} redisHost - Redis host URI
 *  @param {String} redisPassword - Redis password to host URI
 */
// default host is localhost, default expiry time is 14 days in milliseconds
var QuellCache = /** @class */ (function () {
    function QuellCache(_a) {
        var schema = _a.schema, _b = _a.cacheExpiration, cacheExpiration = _b === void 0 ? 1209600 : _b, // default expiry time is 14 days in milliseconds;
        _c = _a.costParameters, // default expiry time is 14 days in milliseconds;
        costParameters = _c === void 0 ? defaultCostParams : _c, redisPort = _a.redisPort, redisHost = _a.redisHost, redisPassword = _a.redisPassword;
        this.idCache = idCache;
        this.schema = schema;
        this.costParameters = Object.assign(defaultCostParams, costParameters);
        this.depthLimit = this.depthLimit.bind(this);
        this.costLimit = this.costLimit.bind(this);
        this.rateLimiter = this.rateLimiter.bind(this);
        this.queryMap = this.getQueryMap(schema);
        this.mutationMap = this.getMutationMap(schema);
        this.fieldsMap = this.getFieldsMap(schema);
        this.cacheExpiration = cacheExpiration;
        this.redisReadBatchSize = 10;
        this.redisCache = (0, redis_1.createClient)({
            socket: { host: redisHost, port: redisPort },
            password: redisPassword
        });
        this.query = this.query.bind(this);
        this.parseAST = this.parseAST.bind(this);
        this.clearCache = this.clearCache.bind(this);
        this.buildFromCache = this.buildFromCache.bind(this);
        this.generateCacheID = this.generateCacheID.bind(this);
        this.updateCacheByMutation = this.updateCacheByMutation.bind(this);
        this.deleteCacheById = this.deleteCacheById.bind(this);
        this.getStatsFromRedis = this.getStatsFromRedis.bind(this);
        this.getRedisInfo = this.getRedisInfo.bind(this);
        this.getRedisKeys = this.getRedisKeys.bind(this);
        this.getRedisValues = this.getRedisValues.bind(this);
        this.joinResponses = this.joinResponses.bind(this);
        this.redisCache.connect().then(function () {
            console.log('Connected to redisCache');
        });
    }
    /**
     * A redis-based IP rate limiter method. It:
     *    - receives the ipRate in requests per second from the request object on the front-end,
     *    - if there is no ipRate set on front-end, it'll default to the value in the defaultCostParameters,
     *    - creates a key using the IP address and current time in seconds,
     *    - increments the value at this key for each new call received,
     *    - if the value of calls is greater than the ipRate limit, it will not process the query,
     *    - keys are set to expire after 1 second
     *  @param {Object} req - Express request object, including request body with GraphQL query string
     *  @param {Object} res - Express response object, will carry query response to next middleware
     *  @param {Function} next - Express next middleware function, invoked when QuellCache completes its work
     */
    QuellCache.prototype.rateLimiter = function (req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var ipRateLimit, ipAddress, currentTimeSeconds, redisIpTimeKey, redisRunQueue, redisResponse, numRequestsString, numRequests, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ipRateLimit = (_b = (_a = req.body.costOptions) === null || _a === void 0 ? void 0 : _a.ipRate) !== null && _b !== void 0 ? _b : this.costParameters.ipRate;
                        ipAddress = req.ip;
                        currentTimeSeconds = Math.floor(Date.now() / 1000);
                        redisIpTimeKey = "".concat(ipAddress, ":").concat(currentTimeSeconds);
                        // Return an error if no query is found in the request.
                        if (!req.body.query) {
                            return [2 /*return*/, next({
                                    status: 400,
                                    log: 'Error: no GraphQL query found on request body'
                                })];
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
                            return [2 /*return*/, next({
                                    status: 429,
                                    log: "Redis cache error: Express error handler caught too many requests from this IP address (".concat(ipAddress, "): limit is: ").concat(ipRateLimit, " requests per second")
                                })];
                        }
                        console.log("IP ".concat(ipAddress, " made a request. Limit is: ").concat(ipRateLimit, " requests per second. Result: OK."));
                        return [2 /*return*/, next()];
                    case 3:
                        error_1 = _d.sent();
                        return [2 /*return*/, next({
                                status: 500,
                                log: "Redis cache error: ".concat(error_1)
                            })];
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
     *  @param {Object} req - Express request object, including request body with GraphQL query string
     *  @param {Object} res - Express response object, will carry query response to next middleware
     *  @param {Function} next - Express next middleware function, invoked when QuellCache completes its work
     */
    QuellCache.prototype.query = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var queryString, AST, _b, proto, operationType, frags, redisValue, mutationQueryObject_1, mutationName_1, mutationType_1, mutation, prototype_1, prototypeKeys, cacheResponse_1, mergedResponse_1, queryObject, newQueryString;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // handle request without query
                        if (!req.body.query) {
                            return [2 /*return*/, next({ log: 'Error: no GraphQL query found on request body' })];
                        }
                        queryString = req.body.query;
                        AST = res.locals.AST
                            ? res.locals.AST
                            : (0, parser_1.parse)(queryString);
                        _b = (_a = res.locals.parsedAST) !== null && _a !== void 0 ? _a : this.parseAST(AST), proto = _b.proto, operationType = _b.operationType, frags = _b.frags;
                        if (!(operationType === 'unQuellable')) return [3 /*break*/, 1];
                        (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                            .then(function (queryResult) {
                            res.locals.queryResponse = queryResult;
                            return next();
                        })["catch"](function (error) {
                            return next("graphql library error: ".concat(error));
                        });
                        return [3 /*break*/, 6];
                    case 1:
                        if (!(operationType === 'noID')) return [3 /*break*/, 3];
                        (0, graphql_1.graphql)({ schema: this.schema, source: queryString })
                            .then(function (queryResult) {
                            res.locals.queryResponse = queryResult;
                            return next();
                        })["catch"](function (error) {
                            return next({ log: 'graphql library error: ', error: error });
                        });
                        return [4 /*yield*/, this.getFromRedis(queryString)];
                    case 2:
                        redisValue = _c.sent();
                        // If the query string is found in Redis, add the result to the response and return.
                        if (redisValue != null) {
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
                                return next("graphql library error: ".concat(error));
                            });
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(operationType === 'mutation')) return [3 /*break*/, 4];
                        /*
                         * Currently clearing the cache on mutation because it is stale.
                         * We should instead be updating the cache following a mutation.
                         */
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
                        //Can possibly modify query to ALWAYS have an ID but not necessarily return it back to client
                        // unless they also queried for it.
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
                            return next("graphql library error: ".concat(error));
                        });
                        return [3 /*break*/, 6];
                    case 4:
                        prototype_1 = Object.keys(frags).length > 0
                            ? this.updateProtoWithFragment(proto, frags)
                            : proto;
                        prototypeKeys = Object.keys(prototype_1);
                        return [4 /*yield*/, this.buildFromCache(prototype_1, prototypeKeys)];
                    case 5:
                        cacheResponse_1 = _c.sent();
                        queryObject = this.createQueryObj(prototype_1);
                        // If the cached response is incomplete, reformulate query,
                        // handoff query, join responses, and cache joined responses.
                        if (Object.keys(queryObject).length > 0) {
                            newQueryString = this.createQueryStr(queryObject, operationType);
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
                                                ? this.joinResponses(cacheResponse_1.data, databaseResponse.data, prototype_1)
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
                                return next({ log: 'graphql library error: ', error: error });
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
     * UpdateIdCache:
     *    - stores keys in a nested object under parent name
     *    - if the key is a duplication, they are stored in an array
     *  @param {String} objKey - Object key; key to be cached without ID string
     *  @param {String} keyWithID - Key to be cached with ID string attatched; redis data is stored under this key
     *  @param {String} currName - The parent object name
     */
    QuellCache.prototype.updateIdCache = function (objKey, keyWithID, currName) {
        // BUG: Add check - If any of the arguments are missing, return immediately.
        // Currently, if currName is undefined, this function is adding 'undefined' as a
        // key in the idCache.
        // if the parent object is not yet defined
        if (!idCache[currName]) {
            idCache[currName] = {};
            idCache[currName][objKey] = keyWithID;
            return;
        }
        // if parent obj is defined, but this is the first child key
        else if (!idCache[currName][objKey]) {
            idCache[currName][objKey] = [];
        }
        // update ID cache under key of currName in an array
        idCache[currName][objKey].push(keyWithID);
    };
    /**
     * parseAST traverses the abstract syntax tree depth-first to create a template for future operations, such as
     * request data from the cache, creating a modified query string for additional information needed, and joining cache and database responses
     * @param {Object} AST - an abstract syntax tree generated by gql library that we will traverse to build our prototype
     * @param {Object} options - a field for user-supplied options, not fully integrated
     * @returns {Object} prototype object
     * @returns {string} operationType
     * @returns {Object} frags object
     */
    QuellCache.prototype.parseAST = function (AST, options) {
        if (options === void 0) { options = { userDefinedID: null }; }
        // Initialize prototype and frags as empty objects.
        // Information from the AST is distilled into the prototype for easy
        // access during caching, rebuilding query strings, etc.
        var proto = {};
        // The frags object will contain the fragments defined in the query in a format
        // similar to the proto.
        var frags = {};
        // Create operation type variable. This will be 'query', 'mutation', 'subscription', 'noID', or 'unQuellable'.
        var operationType = '';
        // Initialize a stack to keep track of depth first parsing path.
        var stack = [];
        // Create field arguments object, which will track the id, type, alias, and args for the fields.
        // The field arguments object will eventually be merged with the prototype object.
        var fieldArgs = {};
        // Extract the userDefinedID from the options object, if provided.
        var userDefinedID = options.userDefinedID;
        /**
         * visit is a utility provided in the graphql-JS library. It performs a
         * depth-first traversal of the abstract syntax tree, invoking a callback
         * when each SelectionSet node is entered. That function builds the prototype.
         * Invokes a callback when entering and leaving Field node to keep track of nodes with stack
         *
         * Find documentation at:
         * https://graphql.org/graphql-js/language/#visit
         */
        (0, visitor_1.visit)(AST, {
            // The enter function will be triggered upon entering each node in the traversal.
            enter: function (node) {
                var _a, _b;
                // Quell cannot cache directives, so we need to return as unQuellable if the node has directives.
                if (node === null || node === void 0 ? void 0 : node.directives) {
                    if ((_b = (_a = node === null || node === void 0 ? void 0 : node.directives) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 > 0) {
                        operationType = 'unQuellable';
                        // Return BREAK to break out of the current traversal branch.
                        return visitor_1.BREAK;
                    }
                }
            },
            // If the current node is of type OperationDefinition, this function will be triggered upon entering it.
            // It checks the type of operation being performed.
            OperationDefinition: function (node) {
                // Quell cannot cache subscriptions, so we need to return as unQuellable if the type is subscription.
                operationType = node.operation;
                if (node.operation === 'subscription') {
                    operationType = 'unQuellable';
                    // Return BREAK to break out of the current traversal branch.
                    return visitor_1.BREAK;
                }
            },
            // If the current node is of type FragmentDefinition, this function will be triggered upon entering it.
            FragmentDefinition: function (node) {
                // Add the fragment name to the stack.
                stack.push(node.name.value);
                // Get the name of the fragment.
                var fragName = node.name.value;
                // Add the fragment name as a key in the frags object, initialized to an empty object.
                frags[fragName] = {};
                // Loop through the selections in the selection set for the current FragmentDefinition node.
                for (var i = 0; i < node.selectionSet.selections.length; i++) {
                    // Below, we get the 'name' property from the SelectionNode.
                    // However, InlineFragmentNode (one of the possible types for SelectionNode) does
                    // not have a 'name' property, so we will want to skip nodes with that type.
                    if (node.selectionSet.selections[i].kind !== 'InlineFragment') {
                        // Add base-level field names in the fragment to the frags object.
                        frags[fragName][node.selectionSet.selections[i].name.value] = true;
                    }
                }
            },
            Field: {
                // If the current node is of type Field, this function will be triggered upon entering it.
                enter: function (node) {
                    // Return introspection queries as unQuellable so that we do not cache them.
                    // "__keyname" syntax is later used for Quell's field-specific options, though this does not create collision with introspection.
                    if (node.name.value.includes('__')) {
                        operationType = 'unQuellable';
                        // Return BREAK to break out of the current traversal branch.
                        return visitor_1.BREAK;
                    }
                    // Create an args object that will be populated with the current node's arguments.
                    var argsObj = {};
                    // auxillary object for storing arguments, aliases, field-specific options, and more
                    // query-wide options should be handled on Quell's options object
                    var auxObj = {
                        __id: null
                    };
                    // Loop through the field's arguments.
                    if (node.arguments) {
                        node.arguments.forEach(function (arg) {
                            var key = arg.name.value;
                            // Quell cannot cache queries with variables, so we need to return unQuellable if the query has variables.
                            if (arg.value.kind === 'Variable' && operationType === 'query') {
                                operationType = 'unQuellable';
                                // Return BREAK to break out of the current traversal branch.
                                return visitor_1.BREAK;
                            }
                            /*
                             * In the next step, we get the value from the argument node's value node.
                             * This assumes that the value node has a 'value' property.
                             * If the 'kind' of the value node is ObjectValue, ListValue, NullValue, or ListValue
                             * then the value node will not have a 'value' property, so we must first check that
                             * the 'kind' does not match any of those types.
                             */
                            if (arg.value.kind === 'NullValue' ||
                                arg.value.kind === 'ObjectValue' ||
                                arg.value.kind === 'ListValue') {
                                operationType = 'unQuellable';
                                // Return BREAK to break out of the current traversal branch.
                                return visitor_1.BREAK;
                            }
                            // Assign argument values to argsObj (key will be argument name, value will be argument value),
                            // skipping field-specific options ('__') provided as arguments.
                            if (!key.includes('__')) {
                                // Get the value from the argument node's value node.
                                argsObj[key] = arg.value.value;
                            }
                            // If a userDefinedID was included in the options object and the current argument name matches
                            // that ID, update the auxiliary object's id.
                            if (userDefinedID ? key === userDefinedID : false) {
                                auxObj.__id = arg.value.value;
                            }
                            else if (
                            // If a userDefinedID was not provided, determine the uniqueID from the args.
                            // Note: do not use key.includes('id') to avoid assigning fields such as "idea" or "idiom" as uniqueID.
                            key === 'id' ||
                                key === '_id' ||
                                key === 'ID' ||
                                key === 'Id') {
                                // If the name of the argument is 'id', '_id', 'ID', or 'Id',
                                // set the '__id' field on the auxObj equal to value of that argument.
                                auxObj.__id = arg.value.value;
                            }
                        });
                    }
                    // Gather other auxiliary data such as aliases, arguments, query type, and more to append to the prototype for future reference.
                    // Set the fieldType (which will be the key in the fieldArgs object) equal to either the field's alias or the field's name.
                    var fieldType = node.alias
                        ? node.alias.value
                        : node.name.value;
                    // Set the '__type' property of the auxiliary object equal to the field's name, converted to lower case.
                    auxObj.__type = node.name.value.toLowerCase();
                    // Set the '__alias' property of the auxiliary object equal to the field's alias if it has one.
                    auxObj.__alias = node.alias ? node.alias.value : null;
                    // Set the '__args' property of the auxiliary object equal to the args
                    auxObj.__args = Object.keys(argsObj).length > 0 ? argsObj : null;
                    // Add auxObj fields to prototype, allowing future access to type, alias, args, etc.
                    /*
                     * BUG: Should "...argsObj[fieldType]" be removed? Because we verified above that all the values in
                     * argsObj will be string/boolean/null, argsObj[fieldType] will never be an object, so spreading it will
                     * not result in key-value pairs. -- Removed argsObj[fieldType] from being spread into fieldArgs
                     */
                    fieldArgs[fieldType] = __assign({}, auxObj);
                    // Add the field type to stacks to keep track of depth-first parsing path.
                    stack.push(fieldType);
                },
                // If the current node is of type Field, this function will be triggered after visiting it and all of its children.
                leave: function () {
                    // Pop stacks to keep track of depth-first parsing path
                    stack.pop();
                }
            },
            SelectionSet: {
                // If the current node is of type SelectionSet, this function will be triggered upon entering it.
                // The selection sets contain all of the sub-fields.
                // Iterate through the sub-fields to construct fieldsObject
                enter: function (node, key, parent, 
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                path, 
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ancestors) {
                    /*
                     * Exclude SelectionSet nodes whose parents' are not of the kind
                     * 'Field' to exclude nodes that do not contain information about
                     *  queried fields.
                     */
                    // FIXME: It is possible for the parent to be an array. This happens when the selection set
                    // is a fragment spread. In that case, the parent will not have a 'kind' property. For now,
                    // add a check that parent is not an array.
                    if (parent && // parent is not undefined
                        !Array.isArray(parent) && // parent is not readonly ASTNode[]
                        parent.kind === 'Field' // can now safely cast parent to ASTNode
                    ) {
                        var fieldsValues = {};
                        /*
                         * Create a variable called fragment, initialized to false, to indicate whether the selection set includes a fragment spread.
                         * Loop through the current selection set's selections array.
                         * If the array contains a FragmentSpread node, set the fragment variable to true.
                         * This is reset to false upon entering each new selection set.
                         */
                        var fragment = false;
                        for (var _i = 0, _a = node.selections; _i < _a.length; _i++) {
                            var field = _a[_i];
                            if (field.kind === 'FragmentSpread')
                                fragment = true;
                            /*
                             * If the current selection in the selections array is not a nested object
                             * (i.e. does not have a SelectionSet), set its value in fieldsValues to true.
                             * Below, we get the 'name' property from the SelectionNode.
                             * However, InlineFragmentNode (one of the possible types for SelectionNode) does
                             * not have a 'name' property, so we will want to skip nodes with that type.
                             * Furthermore, FragmentSpreadNodes never have a selection set property.
                             */
                            if (field.kind !== 'InlineFragment' &&
                                (field.kind === 'FragmentSpread' || !field.selectionSet))
                                fieldsValues[field.name.value] = true;
                        }
                        // if ID was not included on the request then the query will not be included in the cache, but the request will be processed
                        // AND if current node is NOT a fragment.
                        if (!Object.prototype.hasOwnProperty.call(fieldsValues, 'id') &&
                            !Object.prototype.hasOwnProperty.call(fieldsValues, '_id') &&
                            !Object.prototype.hasOwnProperty.call(fieldsValues, 'ID') &&
                            !Object.prototype.hasOwnProperty.call(fieldsValues, 'Id') &&
                            !fragment) {
                            operationType = 'noID';
                            // Return BREAK to break out of the current traversal branch.
                            return visitor_1.BREAK;
                        }
                        // place current fieldArgs object onto fieldsObject so it gets passed along to prototype
                        // fieldArgs contains arguments, aliases, etc.
                        var fieldsObject_1 = __assign(__assign({}, fieldsValues), fieldArgs[stack[stack.length - 1]]);
                        // loop through stack to get correct path in proto for temp object;
                        stack.reduce(function (prev, curr, index) {
                            // if last item in path, set value
                            if (index + 1 === stack.length)
                                prev[curr] = __assign({}, fieldsObject_1);
                            return prev[curr];
                        }, proto);
                    }
                },
                // If the current node is of type SelectionSet, this function will be triggered upon entering it.
                leave: function () {
                    // pop stacks to keep track of depth-first parsing path
                    stack.pop();
                }
            }
        });
        return { proto: proto, operationType: operationType, frags: frags };
    };
    /**
     * updateProtoWithFragment takes collected fragments and integrates them onto the prototype where referenced
     * @param {Object} protoObj - prototype before it has been updated with fragments
     * @param {Object} frags - fragments object to update prototype with
     * @returns {Object} updated prototype object
     */
    QuellCache.prototype.updateProtoWithFragment = function (protoObj, frags) {
        // If the proto or frags objects are null/undefined, return the protoObj.
        if (!protoObj || !frags)
            return protoObj;
        // Loop through the fields in the proto object.
        for (var key in protoObj) {
            // If the field is a nested object and not an introspection field (fields starting with '__'
            // that provide information about the underlying schema)
            if (typeof protoObj[key] === 'object' && !key.includes('__')) {
                // Update the field to the result of recursively calling updateProtoWithFragment,
                // passing the field and fragments.
                protoObj[key] = this.updateProtoWithFragment(protoObj[key], frags);
            }
            // If the field is a reference to a fragment, replace the reference to the fragment with
            // the actual fragment.
            if (Object.prototype.hasOwnProperty.call(frags, key)) {
                protoObj = __assign(__assign({}, protoObj), frags[key]);
                delete protoObj[key];
            }
        }
        // Return the updated proto
        return protoObj;
    };
    /**
     * getFromRedis reads from Redis cache and returns a promise (Redis v4 natively returns a promise).
     * @param {String} key - the key for Redis lookup
     * @returns {Promise} A promise representing the value from the redis cache with the provided key
     */
    QuellCache.prototype.getFromRedis = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerKey, redisResult, err_1;
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
                        err_1 = _a.sent();
                        console.log('err in getFromRedis: ', err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *  getMutationMap generates a map of mutation to GraphQL object types. This mapping is used
     *  to identify references to cached data when mutation occurs.
     *  @param {Object} schema - GraphQL defined schema that is used to facilitate caching by providing valid queries,
     *  mutations, and fields
     *  @returns {Object} mutationMap - map of mutations to GraphQL types
     */
    QuellCache.prototype.getMutationMap = function (schema) {
        var _a;
        var mutationMap = {};
        // get object containing all root mutations defined in the schema
        var mutationTypeFields = (_a = schema
            .getMutationType()) === null || _a === void 0 ? void 0 : _a.getFields();
        // if queryTypeFields is a function, invoke it to get object with queries
        var mutationsObj = typeof mutationTypeFields === 'function'
            ? mutationTypeFields()
            : mutationTypeFields;
        for (var mutation in mutationsObj) {
            // get name of GraphQL type returned by query
            // if ofType --> this is collection, else not collection
            var returnedType = void 0;
            if (mutationsObj[mutation].type.ofType) {
                returnedType = [];
                returnedType.push(mutationsObj[mutation].type.ofType.name);
            }
            if (mutationsObj[mutation].type.name) {
                returnedType = mutationsObj[mutation].type.name;
            }
            mutationMap[mutation] = returnedType;
        }
        return mutationMap;
    };
    /**
     *  getQueryMap generates a map of queries to GraphQL object types. This mapping is used
     *  to identify and create references to cached data.
     *  @param {Object} schema - GraphQL defined schema that is used to facilitate caching by providing valid queries,
     *  mutations, and fields
     *  @returns {Object} queryMap - map of queries to GraphQL types
     */
    QuellCache.prototype.getQueryMap = function (schema) {
        var _a;
        var queryMap = {};
        // get object containing all root queries defined in the schema
        var queryTypeFields = (_a = schema
            .getQueryType()) === null || _a === void 0 ? void 0 : _a.getFields();
        // if queryTypeFields is a function, invoke it to get object with queries
        var queriesObj = typeof queryTypeFields === 'function'
            ? queryTypeFields()
            : queryTypeFields;
        for (var query in queriesObj) {
            // get name of GraphQL type returned by query
            // if ofType --> this is collection, else not collection
            var returnedType = void 0;
            if (queriesObj[query].type.ofType) {
                returnedType = [];
                returnedType.push(queriesObj[query].type.ofType.name);
            }
            if (queriesObj[query].type.name) {
                returnedType = queriesObj[query].type.name;
            }
            queryMap[query] = returnedType;
        }
        return queryMap;
    };
    /**
     *  getFieldsMap generates of map of fields to GraphQL types. This mapping is used to identify
     *  and create references to cached data.
     *  @param {Object} schema - GraphQL defined schema that is used to facilitate caching by providing valid queries,
     *  mutations, and fields
     *  @returns {Object} fieldsMap - map of fields to GraphQL types
     */
    QuellCache.prototype.getFieldsMap = function (schema) {
        var fieldsMap = {};
        var typesList = schema.getTypeMap();
        var builtInTypes = [
            'String',
            'Int',
            'Float',
            'Boolean',
            'ID',
            'Query',
            '__Type',
            '__Field',
            '__EnumValue',
            '__DirectiveLocation',
            '__Schema',
            '__TypeKind',
            '__InputValue',
            '__Directive',
        ];
        // exclude built-in types
        var customTypes = Object.keys(typesList).filter(function (type) { var _a; return !builtInTypes.includes(type) && type !== ((_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name); });
        // loop through types
        for (var _i = 0, customTypes_1 = customTypes; _i < customTypes_1.length; _i++) {
            var type = customTypes_1[_i];
            var fieldsObj = {};
            var fields = typesList[type]._fields;
            if (typeof fields === 'function')
                fields = fields();
            for (var field in fields) {
                var key = fields[field].name;
                var value = fields[field].type.ofType
                    ? fields[field].type.ofType.name
                    : fields[field].type.name;
                fieldsObj[key] = value;
            }
            // place assembled types on fieldsMap
            fieldsMap[type] = fieldsObj;
        }
        return fieldsMap;
    };
    /**
     * buildFromCache finds any requested information in the cache and assembles it on the cacheResponse
     * uses the prototype as a template for cacheResponse, marks any data not found in the cache on the prototype for future retrieval from database
     * @param {Object} prototype - unique id under which the cached data will be stored
     * @param {Array} prototypeKeys - keys in the prototype
     * @param {Object} itemFromCache - item to be cached
     * @param {boolean} firstRun - boolean indicated if this is the first run
     * @param {boolean|string} subID - used to pass id to recursive calls
     * @returns {Object} cacheResponse, mutates prototype
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
                                        cacheID = this_1.generateCacheID(prototype[typeKey]);
                                        keyName = void 0;
                                        if (typeof subID === 'string') {
                                            cacheID = subID;
                                        }
                                        // let cacheID: string = subID || this.generateCacheID(prototype[typeKey]);
                                        // value won't always be at .name on the args object
                                        if (((_a = prototype[typeKey]) === null || _a === void 0 ? void 0 : _a.__args) === null) {
                                            keyName = undefined;
                                        }
                                        else {
                                            keyName = Object.values((_b = prototype[typeKey]) === null || _b === void 0 ? void 0 : _b.__args)[0];
                                        }
                                        // is this also redundent
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
                                            var getCommandCallback_1, currTypeKey_1, cacheResponseRaw, err_2, cacheResponseRaw, err_3;
                                            return __generator(this, function (_m) {
                                                switch (_m.label) {
                                                    case 0:
                                                        if (!(typeof itemFromCache[typeKey] === 'string')) return [3 /*break*/, 9];
                                                        getCommandCallback_1 = function (cacheResponse) {
                                                            var tempObj = {};
                                                            if (cacheResponse) {
                                                                var interimCache = JSON.parse(cacheResponse);
                                                                var _loop_3 = function (property) {
                                                                    // if property exists, set on tempObj
                                                                    if (Object.prototype.hasOwnProperty.call(interimCache, property) &&
                                                                        !property.includes('__')) {
                                                                        tempObj[property] = interimCache[property];
                                                                    }
                                                                    // if prototype is nested at this field, recurse
                                                                    else if (!property.includes('__') &&
                                                                        typeof prototype[typeKey][property] ===
                                                                            'object') {
                                                                        // same as return type for buildfromcache
                                                                        _this.buildFromCache(prototype[typeKey][property], prototypeKeys, {}, false, "".concat(currTypeKey_1, "--").concat(property)).then(function (tempData) { return (tempObj[property] = tempData.data); });
                                                                    }
                                                                    // if cache does not have property, set to false on prototype so that it is sent to graphQL
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
                                                            // if there is nothing in the cache for this key, then toggle all fields to false so it is fetched later
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
                                                        err_2 = _m.sent();
                                                        console.log("Error in buildFromCache: ".concat(err_2));
                                                        return [3 /*break*/, 4];
                                                    case 4:
                                                        redisRunQueue = this_1.redisCache.multi();
                                                        _m.label = 5;
                                                    case 5:
                                                        // Otherwise, add a get command for the current type key to the queue.
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
                                                        err_3 = _m.sent();
                                                        console.log("Error in buildFromCache: ".concat(err_3));
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
                                        // if this field is NOT in the cache, then set this field's value to false
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
                                        // if field is not found in cache then toggle to false
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
                    // return itemFromCache on a data property to resemble graphQL response format
                    return [2 /*return*/, { data: itemFromCache }];
                }
            });
        });
    };
    /**
     * helper function
     * generateCacheID creates cacheIDs based on information from the prototype
     * format of 'field--ID'
     * @param {String} key - unique id under which the cached data will be stored
     * @param {Object} item - item to be cached
     */
    QuellCache.prototype.generateCacheID = function (queryProto) {
        var cacheID = queryProto.__id
            ? "".concat(queryProto.__type, "--").concat(queryProto.__id)
            : queryProto.__type;
        return cacheID;
    };
    /**
     * createQueryObj takes in a map of fields and true/false values (the prototype), and creates a query object containing any values missing from the cache
     * the resulting queryObj is then used as a template to create GQL query strings
     * @param {String} map - map of fields and true/false values from initial request, should be the prototype
     * @returns {Object} queryObject with only values to be requested from GraphQL endpoint
     */
    QuellCache.prototype.createQueryObj = function (map) {
        var output = {};
        // iterate over every key in map
        // true values are filtered out, false values are placed on output
        for (var key in map) {
            var reduced = reducer(map[key]);
            if (Object.keys(reduced).length > 0) {
                output[key] = reduced;
            }
        }
        /**
         * reducer takes in a fields object and returns only the values needed from the server
         * @param {Object} fields - Object containing true or false values that determines what should be
         * retrieved from the server.
         * @returns {Object} Filtered object of only queries without a value or an empty object
         */
        // filter fields object to contain only values needed from server
        function reducer(fields) {
            // filter stores values needed from server
            var filter = {};
            // propsFilter for properties such as args, aliases, etc.
            var propsFilter = {};
            for (var key in fields) {
                // if value is false, place directly on filter
                if (fields[key] === false) {
                    filter[key] = false;
                }
                // force the id onto the query object
                if (key === 'id' || key === '_id' || key === 'ID' || key === 'Id') {
                    filter[key] = false;
                }
                // if value is an object, recurse to determine nested values
                if (typeof fields[key] === 'object' && !key.includes('__')) {
                    var reduced = reducer(fields[key]);
                    // if reduced object has any values to pass, place on filter
                    if (Object.keys(reduced).length > 1) {
                        filter[key] = reduced;
                    }
                }
                // if reserved property such as args or alias, place on propsFilter
                if (key.includes('__')) {
                    propsFilter[key] = fields[key];
                }
            }
            var numFields = Object.keys(fields).length;
            // if the filter has any values to pass, return filter & propsFilter, otherwise return empty object
            return Object.keys(filter).length > 1 && numFields > 5
                ? __assign(__assign({}, filter), propsFilter) : {};
        }
        return output;
    };
    /**
     * createQueryStr traverses over a supplied query Object and uses the fields on there to create a query string reflecting the data,
     * this query string is a modified version of the query string received by Quell that has references to data found within the cache removed
     * so that the final query is reduced in scope and faster
     * @param {Object} queryObject - a modified version of the prototype with only values we want to pass onto the queryString
     * @param {String} operationType - a string indicating the GraphQL operation type- 'query', 'mutation', etc.
     */
    QuellCache.prototype.createQueryStr = function (queryObject, operationType) {
        if (Object.keys(queryObject).length === 0)
            return '';
        var openCurly = '{';
        var closeCurly = '}';
        var openParen = '(';
        var closeParen = ')';
        var mainStr = '';
        // iterate over every key in queryObject
        // place key into query object
        for (var key in queryObject) {
            mainStr += " ".concat(key).concat(getAliasType(queryObject[key])).concat(getArgs(queryObject[key]), " ").concat(openCurly, " ").concat(stringify(queryObject[key])).concat(closeCurly);
        }
        /**
         * stringify is a helper function that is used to recursively build a graphQL query string from a nested object and
         * will ignore any __values (ie __alias and __args)
         * @param {Object} fields - an object whose properties need to be converted to a string to be used for a graphQL query
         * @returns {string} innerStr - a graphQL query string
         */
        // recurse to build nested query strings
        // ignore all __values (ie __alias and __args)
        function stringify(fields) {
            // initialize inner string
            var innerStr = '';
            // iterate over KEYS in OBJECT
            for (var key in fields) {
                // is fields[key] string? concat with inner string & empty space
                if (typeof fields[key] === 'boolean') {
                    innerStr += key + ' ';
                }
                // is key object? && !key.includes('__'), recurse stringify
                if (typeof fields[key] === 'object' && !key.includes('__')) {
                    var fieldsObj = fields[key];
                    // TODO try to fix this error
                    var type = getAliasType(fieldsObj);
                    var args = getArgs(fieldsObj);
                    innerStr += "".concat(key).concat(type).concat(args, " ").concat(openCurly, " ").concat(stringify(fieldsObj)).concat(closeCurly, " ");
                }
            }
            return innerStr;
        }
        // iterates through arguments object for current field and creates arg string to attach to query string
        function getArgs(fields) {
            var argString = '';
            if (!fields.__args)
                return '';
            Object.keys(fields.__args).forEach(function (key) {
                argString
                    ? (argString += ", ".concat(key, ": \"").concat(fields.__args[key], "\""))
                    : (argString += "".concat(key, ": \"").concat(fields.__args[key], "\""));
            });
            // return arg string in parentheses, or if no arguments, return an empty string
            return argString ? "".concat(openParen).concat(argString).concat(closeParen) : '';
        }
        // if Alias exists, formats alias for query string
        function getAliasType(fields) {
            return fields.__alias ? ": ".concat(fields.__type) : '';
        }
        // create final query string
        var queryStr = openCurly + mainStr + ' ' + closeCurly;
        return operationType ? operationType + ' ' + queryStr : queryStr;
    };
    /**
     * joinResponses combines two objects containing results from separate sources and outputs a single object with information from both sources combined,
     * formatted to be delivered to the client, using the queryProto as a template for how to structure the final response object.
     * @param {Object} cacheResponse - response data from the cache
     * @param {Object} serverResponse - response data from the server or external API
     * @param {Object} queryProto - current slice of the prototype being used as a template for final response object structure
     * @param {Boolean} fromArray - whether or not the current recursive loop came from within an array, should NOT be supplied to function call
     */
    QuellCache.prototype.joinResponses = function (cacheResponse, serverResponse, queryProto, fromArray) {
        var _a, _b, _c, _d, _e, _f;
        if (fromArray === void 0) { fromArray = false; }
        var mergedResponse = {};
        // loop through fields object keys, the "source of truth" for structure
        // store combined responses in mergedResponse
        for (var key in queryProto) {
            // for each key, check whether data stored at that key is an array or an object
            var checkResponse = Object.prototype.hasOwnProperty.call(serverResponse, key)
                ? serverResponse
                : cacheResponse;
            if (Array.isArray(checkResponse[key])) {
                // merging logic depends on whether the data is on the cacheResponse, serverResponse, or both
                // if both of the caches contain the same keys...
                if (cacheResponse[key] && serverResponse[key]) {
                    // we first check to see if the responses have identical keys to both avoid
                    // only returning 1/2 of the data (ex: there are 2 objects in the cache and
                    // you query for 4 objects (which includes the 2 cached objects) only returning
                    // the 2 new objects from the server)
                    // if the keys are identical, we can return a "simple" merge of both
                    var cacheKeys = Object.keys(cacheResponse[key][0]);
                    var serverKeys = Object.keys(serverResponse[key][0]);
                    var keysSame = true;
                    for (var n = 0; n < cacheKeys.length; n++) {
                        if (cacheKeys[n] !== serverKeys[n])
                            keysSame = false;
                    }
                    if (keysSame) {
                        mergedResponse[key] = __spreadArray(__spreadArray([], cacheResponse[key], true), serverResponse[key], true);
                    }
                    // otherwise, we need to combine the responses at the object level
                    else {
                        var mergedArray = [];
                        for (var i = 0; i < cacheResponse[key].length; i++) {
                            // for each index of array, combine cache and server response objects
                            var joinedResponse = this.joinResponses((_a = {}, _a[key] = cacheResponse[key][i], _a), (_b = {}, _b[key] = serverResponse[key][i], _b), (_c = {}, _c[key] = queryProto[key], _c), true);
                            mergedArray.push(joinedResponse);
                        }
                        mergedResponse[key] = mergedArray;
                    }
                }
                else if (cacheResponse[key]) {
                    mergedResponse[key] = cacheResponse[key];
                }
                else {
                    mergedResponse[key] = serverResponse[key];
                }
            }
            else {
                if (!fromArray) {
                    // if object doesn't come from an array, we must assign on the object at the given key
                    mergedResponse[key] = __assign(__assign({}, cacheResponse[key]), serverResponse[key]);
                }
                else {
                    // if the object comes from an array, we do not want to assign to a key as per GQL spec
                    mergedResponse = __assign(__assign({}, cacheResponse[key]), serverResponse[key]);
                }
                for (var fieldName in queryProto[key]) {
                    // check for nested objects
                    if (typeof queryProto[key][fieldName] === 'object' &&
                        !fieldName.includes('__')) {
                        // recurse joinResponses on that object to create deeply nested copy on mergedResponse
                        var mergedRecursion = {};
                        if (cacheResponse[key][fieldName] &&
                            serverResponse[key][fieldName]) {
                            mergedRecursion = this.joinResponses((_d = {},
                                _d[fieldName] = cacheResponse[key][fieldName],
                                _d), (_e = {},
                                _e[fieldName] = serverResponse[key][fieldName],
                                _e), (_f = {}, _f[fieldName] = queryProto[key][fieldName], _f));
                        }
                        else if (cacheResponse[key][fieldName]) {
                            mergedRecursion[fieldName] = cacheResponse[key][fieldName];
                        }
                        else {
                            mergedRecursion[fieldName] = serverResponse[key][fieldName];
                        }
                        if (typeof mergedResponse[key] === 'object' ||
                            Array.isArray(mergedResponse[key])) {
                            mergedResponse[key] = __assign(__assign({}, mergedResponse[key]), mergedRecursion);
                        }
                        else {
                            // case for when mergedResponse[key] is not an object or array and possibly
                            // boolean or a string
                            mergedResponse[key] = __assign({ key: mergedResponse[key] }, mergedRecursion);
                        }
                        // place on merged response
                    }
                }
            }
        }
        return mergedResponse;
    };
    /**
     * writeToCache writes a value to the cache unless the key indicates that the item is uncacheable. Note: writeToCache will JSON.stringify the input item
     * writeTochache will set expiration time for each item written to cache
     * @param {String} key - unique id under which the cached data will be stored
     * @param {Object} item - item to be cached
     */
    QuellCache.prototype.writeToCache = function (key, item) {
        var lowerKey = key.toLowerCase();
        if (!key.includes('uncacheable')) {
            this.redisCache.set(lowerKey, JSON.stringify(item));
            this.redisCache.EXPIRE(lowerKey, this.cacheExpiration);
        }
    };
    /**
     * updateCacheByMutation updates the Redis cache when the operation is a mutation.
     * - For update and delete mutations, checks if the mutation query includes an id.
     * If so, it will update the cache at that id. If not, it will iterate through the cache to find the appropriate fields to update/delete.
     * @param {Object} dbRespDataRaw - raw response from the database returned following mutation
     * @param {String} mutationName - name of the mutation (e.g. addItem)
     * @param {String} mutationType - type of mutation (add, update, delete)
     * @param {Object} mutationQueryObject - arguments and values for the mutation
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
                            // in the form of an object
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
                                                // index position of field key to remove from list of field keys
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
                                            // iterate through field key field key values in redis, and compare to user
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
                                                                // arg in forEach method is a string such as name
                                                                // argVal is the actual value 'San Diego'
                                                                // how would this work if it's a mutation query with arguments?
                                                                Object.entries(mutationQueryObject.__args).forEach(function (_a) {
                                                                    var arg = _a[0], argVal = _a[1];
                                                                    if (arg in fieldKeyValue_1 && fieldKeyValue_1[arg] === argVal) {
                                                                        // foreign keys are not fields to update by
                                                                        if (arg.toLowerCase().includes('id') === false) {
                                                                            // arg.toLowerCase
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
                            // key was found in redis server cache so mutation is either update or delete mutation
                            // if user specifies dbRespId as an arg in mutation, then we only need to update/delete a single cache entry by dbRespId
                            if (mutationQueryObject.__id) {
                                if (mutationName.substring(0, 3) === 'del') {
                                    // if the first 3 letters of the mutationName are 'del' then mutation is a delete mutation
                                    // users have to prefix their delete mutations with 'del' so that quell can distinguish between delete/update mutations
                                    // toLowerCase on both mutation types
                                    this.deleteCacheById("".concat(mutationType.toLowerCase(), "--").concat(mutationQueryObject.__id));
                                    removeFromFieldKeysList(["".concat(mutationType, "--").concat(dbRespId)]);
                                }
                                else {
                                    // update mutation for single dbRespId
                                    this.writeToCache("".concat(mutationType.toLowerCase(), "--").concat(mutationQueryObject.__id), dbRespData);
                                }
                            }
                            else {
                                removalFieldKeysList = [];
                                // TODO - look into what this is being used for if anything
                                if (mutationName.substring(0, 3) === 'del') {
                                    // mutation is delete mutation
                                    deleteApprFieldKeys();
                                }
                                else {
                                    updateApprFieldKeys();
                                }
                            }
                        }
                        else {
                            // key was not found in redis server cache so mutation is an add mutation
                            this.writeToCache(hypotheticalRedisKey, dbRespData);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * deleteCacheById removes key-value from the cache unless the key indicates that the item is not available.
     * @param {String} key - unique id under which the cached data is stored that needs to be removed
     */
    QuellCache.prototype.deleteCacheById = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.redisCache.del(key)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.log('err in deleteCacheById: ', err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * normalizeForCache traverses over response data and formats it appropriately so we can store it in the cache.
     * @param {Object} responseData - data we received from an external source of data such as a database or API
     * @param {Object} map - a map of queries to their desired data types, used to ensure accurate and consistent caching
     * @param {Object} protoField - a slice of the prototype currently being used as a template and reference for the responseData to send information to the cache
     * @param {String} currName - parent object name, used to pass into updateIDCache
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
                        // if prototype has no ID, check field keys for ID (mostly for arrays)
                        if (!currProto.__id &&
                            (key === 'id' || key === '_id' || key === 'ID' || key === 'Id')) {
                            // if currname is undefined, assign to responseData at cacheid to lower case at name
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
                            // call idcache here idCache(cacheIDForIDCache, cacheID)
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
                        // store "current object" on cache in JSON format
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
     * clearCache flushes the Redis cache. To clear the cache from the client, establish an endpoint that
     * passes the request and response objects to an instance of QuellCache.clearCache.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    QuellCache.prototype.clearCache = function (req, res, next) {
        console.log('Clearing Redis Cache');
        this.redisCache.flushAll();
        idCache = {};
        return next();
    };
    /**
     * The getRedisInfo returns a chain of middleware based on what information
     * (if any) the user would like to request from the specified redisCache. It
     * requires an appropriately configured Express route and saves the specified stats
     * to res.locals, for instance:
     * @example
     *  app.use('/redis', ...quellCache.getRedisInfo({
     *    getStats: true,
     *    getKeys: true,
     *    getValues: true
     *  }));
     * @param {Object} options - three properties with boolean values:
     *                           getStats, getKeys, getValues
     * @returns {Array} An array of middleware functions that retrieves specified Redis info
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
         * getOptions is a helper function within the getRedisInfo function that returns
         * what redis data should be retrieved based off the passed in options
         * @param {Object} opts - Options object containing a boolean value for getStats, getKeys, and getValues
         * @returns {string} a string that indicates which data should be retrieved from redis instance
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
     * getStatsFromRedis gets information and statistics about the server and adds them to the response.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    QuellCache.prototype.getStatsFromRedis = function (req, res, next) {
        var _this = this;
        try {
            var getStats = function () {
                // redisCache.info returns information and statistics about the server as an array of field:value
                _this.redisCache
                    .info()
                    .then(function (response) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
                    var dataLines = response.split('\r\n');
                    // dataLines is an array of strings
                    var output = {
                        // SERVER
                        server: [
                            // redis version
                            {
                                name: 'Redis version',
                                value: (_a = dataLines
                                    .find(function (line) { return line.match(/redis_version/); })) === null || _a === void 0 ? void 0 : _a.split(':')[1]
                            },
                            // redis build id
                            {
                                name: 'Redis build id',
                                value: (_b = dataLines
                                    .find(function (line) { return line.match(/redis_build_id/); })) === null || _b === void 0 ? void 0 : _b.split(':')[1]
                            },
                            // redis mode
                            {
                                name: 'Redis mode',
                                value: (_c = dataLines
                                    .find(function (line) { return line.match(/redis_mode/); })) === null || _c === void 0 ? void 0 : _c.split(':')[1]
                            },
                            // os hosting redis system
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
                            // server time
                            // {
                            //   name: 'System time',
                            //   value: dataLines
                            //     .find((line) => line.match(/server_time_in_usec/))
                            //     .split(':')[1],
                            // },
                            // num of seconds since Redis server start
                            {
                                name: 'Server uptime (seconds)',
                                value: (_f = dataLines
                                    .find(function (line) { return line.match(/uptime_in_seconds/); })) === null || _f === void 0 ? void 0 : _f.split(':')[1]
                            },
                            // num of days since Redis server start
                            {
                                name: 'Server uptime (days)',
                                value: (_g = dataLines
                                    .find(function (line) { return line.match(/uptime_in_days/); })) === null || _g === void 0 ? void 0 : _g.split(':')[1]
                            },
                            // path to server's executable
                            // {
                            //   name: 'Path to executable',
                            //   value: dataLines
                            //     .find((line) => line.match(/executable/))
                            //     .split(':')[1],
                            // },
                            // path to server's configuration file
                            {
                                name: 'Path to configuration file',
                                value: (_h = dataLines
                                    .find(function (line) { return line.match(/config_file/); })) === null || _h === void 0 ? void 0 : _h.split(':')[1]
                            },
                        ],
                        // CLIENT
                        client: [
                            // number of connected clients
                            {
                                name: 'Connected clients',
                                value: (_j = dataLines
                                    .find(function (line) { return line.match(/connected_clients/); })) === null || _j === void 0 ? void 0 : _j.split(':')[1]
                            },
                            // number of sockets used by cluster bus
                            {
                                name: 'Cluster connections',
                                value: (_k = dataLines
                                    .find(function (line) { return line.match(/cluster_connections/); })) === null || _k === void 0 ? void 0 : _k.split(':')[1]
                            },
                            // max clients
                            {
                                name: 'Max clients',
                                value: (_l = dataLines
                                    .find(function (line) { return line.match(/maxclients/); })) === null || _l === void 0 ? void 0 : _l.split(':')[1]
                            },
                            // number of clients being tracked
                            // {
                            //   name: 'Tracked clients',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_clients/))
                            //     .split(':')[1],
                            // },
                            // blocked clients
                            {
                                name: 'Blocked clients',
                                value: (_m = dataLines
                                    .find(function (line) { return line.match(/blocked_clients/); })) === null || _m === void 0 ? void 0 : _m.split(':')[1]
                            },
                        ],
                        // MEMORY
                        memory: [
                            // total allocated memory
                            {
                                name: 'Total allocated memory',
                                value: (_o = dataLines
                                    .find(function (line) { return line.match(/used_memory_human/); })) === null || _o === void 0 ? void 0 : _o.split(':')[1]
                            },
                            // peak memory consumed
                            {
                                name: 'Peak memory consumed',
                                value: (_p = dataLines
                                    .find(function (line) { return line.match(/used_memory_peak_human/); })) === null || _p === void 0 ? void 0 : _p.split(':')[1]
                            },
                            // % of peak out of total
                            // {
                            //   name: 'Peak memory used % total',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_peak_perc/))
                            //     .split(':')[1],
                            // },
                            // initial amount of memory consumed at startup
                            // {
                            //   name: 'Memory consumed at startup',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_startup/))
                            //     .split(':')[1],
                            // },
                            // size of dataset
                            // {
                            //   name: 'Dataset size (bytes)',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_dataset/))
                            //     .split(':')[1],
                            // },
                            // percent of data out of net mem usage
                            // {
                            //   name: 'Dataset memory % total',
                            //   value: dataLines
                            //     .find((line) => line.match(/used_memory_dataset_perc/))
                            //     .split(':')[1],
                            // },
                            // total system memory
                            // {
                            //   name: 'Total system memory',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_system_memory_human/))
                            //     .split(':')[1],
                            // },
                        ],
                        // STATS
                        stats: [
                            // total number of connections accepted by server
                            {
                                name: 'Total connections',
                                value: (_q = dataLines
                                    .find(function (line) { return line.match(/total_connections_received/); })) === null || _q === void 0 ? void 0 : _q.split(':')[1]
                            },
                            // total number of commands processed by server
                            {
                                name: 'Total commands',
                                value: (_r = dataLines
                                    .find(function (line) { return line.match(/total_commands_processed/); })) === null || _r === void 0 ? void 0 : _r.split(':')[1]
                            },
                            // number of commands processed per second
                            {
                                name: 'Commands processed per second',
                                value: (_s = dataLines
                                    .find(function (line) { return line.match(/instantaneous_ops_per_sec/); })) === null || _s === void 0 ? void 0 : _s.split(':')[1]
                            },
                            // total number of keys being tracked
                            // {
                            //   name: 'Tracked keys',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_total_keys/))
                            //     .split(':')[1],
                            // },
                            // total number of items being tracked(sum of clients number for each key)
                            // {
                            //   name: 'Tracked items',
                            //   value: dataLines
                            //     .find((line) => line.match(/tracking_total_items/))
                            //     .split(':')[1],
                            // },
                            // total number of read events processed
                            // {
                            //   name: 'Reads processed',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_reads_processed/))
                            //     .split(':')[1],
                            // },
                            // total number of write events processed
                            // {
                            //   name: 'Writes processed',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_writes_processed/))
                            //     .split(':')[1],
                            // },
                            // total number of error replies
                            {
                                name: 'Error replies',
                                value: (_t = dataLines
                                    .find(function (line) { return line.match(/total_error_replies/); })) === null || _t === void 0 ? void 0 : _t.split(':')[1]
                            },
                            // total number of bytes read from network
                            {
                                name: 'Bytes read from network',
                                value: (_u = dataLines
                                    .find(function (line) { return line.match(/total_net_input_bytes/); })) === null || _u === void 0 ? void 0 : _u.split(':')[1]
                            },
                            // networks read rate per second
                            {
                                name: 'Network read rate (Kb/s)',
                                value: (_v = dataLines
                                    .find(function (line) { return line.match(/instantaneous_input_kbps/); })) === null || _v === void 0 ? void 0 : _v.split(':')[1]
                            },
                            // total number of bytes written to network
                            // {
                            //   name: 'Bytes written to network',
                            //   value: dataLines
                            //     .find((line) => line.match(/total_net_output_bytes/))
                            //     .split(':')[1],
                            // },
                            // networks write rate per second
                            {
                                name: 'Network write rate (Kb/s)',
                                value: (_w = dataLines
                                    .find(function (line) { return line.match(/instantaneous_output_kbps/); })) === null || _w === void 0 ? void 0 : _w.split(':')[1]
                            },
                        ]
                    };
                    res.locals.redisStats = output;
                    return next();
                })["catch"](function (err) {
                    return next(err);
                });
            };
            getStats();
        }
        catch (err) {
            return next(err);
        }
    };
    /**
     * getRedisKeys gets the key names from the redis cache and adds them to the response.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    QuellCache.prototype.getRedisKeys = function (req, res, next) {
        this.redisCache
            .keys('*')
            .then(function (response) {
            res.locals.redisKeys = response;
            return next();
        })["catch"](function (err) {
            return next(err);
        });
    };
    /**
     * getRedisValues gets the values associated with the redis cache keys and adds them to the response.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    QuellCache.prototype.getRedisValues = function (req, res, next) {
        if (res.locals.redisKeys.length !== 0) {
            this.redisCache
                .mGet(res.locals.redisKeys)
                .then(function (response) {
                res.locals.redisValues = response;
                return next();
            })["catch"](function (err) {
                return next(err);
            });
        }
        else {
            res.locals.redisValues = [];
            return next();
        }
    };
    /**
     * depthLimit takes in the query, parses it, and identifies the general shape of the request.
     * depthLimit then checks the depth limit set on server connection and compares it against the current queries depth.
     *
     * In the instance of a malicious or overly nested query, depthLimit short-circuits the query before it goes to the database,
     * sending a status code 400 (bad request) back to the client/requester.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    // what parameters should they take? If middleware, good as is, has to take in query obj in request, limit set inside.
    // If function inside whole of Quell, (query, limit), so they are explicitly defined and passed in
    QuellCache.prototype.depthLimit = function (req, res, next) {
        // get depth max limit from cost parameters
        var maxDepth = this.costParameters.maxDepth;
        // maxDepth can be reassigned to get depth max limit from req.body if user selects depth limit
        if (req.body.costOptions.maxDepth)
            maxDepth = req.body.costOptions.maxDepth;
        // return error if no query in request.
        if (!req.body.query) {
            {
                var err = {
                    log: 'Invalid request, no query found in req.body',
                    status: 400,
                    message: { err: 'Error in depthLimit' }
                };
                return next(err);
            }
        }
        // assign graphQL query string to variable queryString
        var queryString = req.body.query;
        // create AST
        var AST = (0, parser_1.parse)(queryString);
        // create response prototype, and operation type, and fragments object
        // the response prototype is used as a template for most operations in quell including caching, building modified requests, and more
        var _a = this.parseAST(AST), proto = _a.proto, operationType = _a.operationType, frags = _a.frags;
        // check for fragments
        var prototype = Object.keys(frags).length > 0
            ? this.updateProtoWithFragment(proto, frags)
            : proto;
        /**
         * determineDepth is a helper function to pass an error if the depth of the proto is greater than the maxDepth.
         * will be using this function to recursively go deeper into the nested query
         * @param {Object} proto - the prototype
         * @param {Number} currentDepth - initialized to 0, increases for each nested level within proto
         */
        var determineDepth = function (proto, currentDepth) {
            if (currentDepth === void 0) { currentDepth = 0; }
            if (currentDepth > maxDepth) {
                var err = {
                    log: "Depth limit exceeded, tried to send query with the depth of ".concat(currentDepth, "."),
                    status: 413,
                    message: { err: 'Error in determineDepth' }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // for each field
            Object.keys(proto).forEach(function (key) {
                // if the field is nested, recurse, increasing currentDepth by 1
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    determineDepth(proto[key], currentDepth + 1);
                }
            });
        };
        // call helper function
        determineDepth(prototype);
        // attach to res.locals so query doesn't need to re run these functions again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto: proto, operationType: operationType, frags: frags };
        // if (currentDepth > this.limit) return res.status(400).send("Too many nested queries!");
        return next();
    };
    /**
     * costLimit checks the cost of the query and, in the instance of a malicious or overly nested query,
     * costLimit short-circuits the query before it goes to the database,
     * sending a status code 400 (bad request) back to the client/requester.
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    QuellCache.prototype.costLimit = function (req, res, next) {
        // get default values for costParameters
        var maxCost = this.costParameters.maxCost;
        var _a = this.costParameters, mutationCost = _a.mutationCost, objectCost = _a.objectCost, depthCostFactor = _a.depthCostFactor, scalarCost = _a.scalarCost;
        // maxCost can be reassigned to get maxcost limit from req.body if user selects cost limit
        if (req.body.costOptions.maxCost)
            maxCost = req.body.costOptions.maxCost;
        // return error if no query in request.
        if (!req.body.query) {
            var err = {
                log: 'Invalid request, no query found in req.body',
                status: 400,
                message: { err: 'Error in costLimit' }
            };
            return next(err);
        }
        // assign graphQL query string to variable queryString
        var queryString = req.body.query;
        // create AST
        var AST = (0, parser_1.parse)(queryString);
        // create response prototype, and operation type, and fragments object
        // the response prototype is used as a template for most operations in quell including caching, building modified requests, and more
        var _b = this.parseAST(AST), proto = _b.proto, operationType = _b.operationType, frags = _b.frags;
        // check for fragments
        var prototype = Object.keys(frags).length > 0
            ? this.updateProtoWithFragment(proto, frags)
            : proto;
        var cost = 0;
        // mutation check
        operationType === 'mutation'
            ? (cost += Object.keys(prototype).length * mutationCost)
            : null;
        /**
         * helper function to pass an error if the cost of the proto is greater than the maxCost
         * @param {Object} proto - the prototype
         */
        var determineCost = function (proto) {
            // create error if maxCost exceeded
            if (cost > maxCost) {
                var err = {
                    log: "Cost limit exceeded, tried to send query with a cost exceeding ".concat(maxCost, "."),
                    status: 413,
                    message: { err: 'Error in determineCost' }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // for each field
            Object.keys(proto).forEach(function (key) {
                // if the field is nested, increase the total cost by objectCost and recurse
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    cost += objectCost;
                    return determineCost(proto[key]);
                }
                // if scalar, increase the total cost by scalarCost
                if (proto[key] === true && !key.includes('__')) {
                    cost += scalarCost;
                }
            });
        };
        determineCost(prototype);
        /**
         * helper function to pass an error if the cost of the proto, taking into account depth levels, is greater than the maxCost
         * essentially multiplies the cost by a depth cost adjustment, which is equal to depthCostFactor raised to the power of the depth
         * @param {Object} proto - the prototype
         * @param {Number} totalCost - cost of the proto
         */
        var determineDepthCost = function (proto, totalCost) {
            if (totalCost === void 0) { totalCost = cost; }
            // create error if maxCost exceeded
            if (totalCost > maxCost) {
                var err = {
                    log: "Cost limit exceeded, tried to send query with a cost exceeding ".concat(maxCost, "."),
                    status: 413,
                    message: { err: 'Error in determineDepthCost' }
                };
                res.locals.queryErr = err;
                return next(err);
            }
            // for each field
            Object.keys(proto).forEach(function (key) {
                // if the field is nested, recurse, multiplying the current total cost by the depthCostFactor
                if (typeof proto[key] === 'object' && !key.includes('__')) {
                    determineDepthCost(proto[key], totalCost * depthCostFactor);
                }
            });
        };
        determineDepthCost(prototype);
        // attach to res.locals so query doesn't need to re run these functions again.
        res.locals.AST = AST;
        res.locals.parsedAST = { proto: proto, operationType: operationType, frags: frags };
        // return next
        return next();
    };
    return QuellCache;
}());
exports.QuellCache = QuellCache;
