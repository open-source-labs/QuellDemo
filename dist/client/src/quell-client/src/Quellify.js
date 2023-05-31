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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quellify = exports.refetchLRUCache = exports.clearCache = exports.updateLRUCache = exports.invalidateCache = exports.initializeCache = void 0;
const graphql_1 = require("graphql");
const lru_cache_1 = require("lru-cache");
const lokijs_1 = __importDefault(require("lokijs"));
const determineType_1 = __importDefault(require("./helpers/determineType"));
const MAX_CACHE_SIZE = 2;
const lokidb = new lokijs_1.default('client-cache');
let lruCache;
let lokiCache;
const initializeCache = () => {
    lokidb.removeCollection('loki-client-cache');
    lokiCache = lokidb.addCollection('loki-client-cache', {
        disableMeta: true
    });
    lruCache = new lru_cache_1.LRUCache({
        max: MAX_CACHE_SIZE,
    });
};
exports.initializeCache = initializeCache;
const invalidateCache = (query) => {
    lruCache.del(query);
};
exports.invalidateCache = invalidateCache;
const updateLRUCache = (query, results) => {
    if (lruCache.length >= MAX_CACHE_SIZE) {
        const leastRecentlyUsedQuery = lruCache.shift();
        if (leastRecentlyUsedQuery) {
            lokiCache.remove(leastRecentlyUsedQuery);
        }
    }
    lruCache.set(query, results);
};
exports.updateLRUCache = updateLRUCache;
const clearCache = () => {
    initializeCache();
    console.log('Client cache has been cleared.');
};
exports.clearCache = clearCache;
const performFetch = (endPoint, fetchConfig) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch(endPoint, fetchConfig);
        const response = yield data.json();
        updateLRUCache(fetchConfig.body, response.queryResponse.data);
        return response.queryResponse.data;
    }
    catch (error) {
        const err = {
            log: `Error when trying to perform fetch to GraphQL endpoint: ${error}.`,
            status: 400,
            message: {
                err: 'Error in performFetch. Check server log for more details.'
            }
        };
        console.log('Error when performing Fetch: ', err);
        throw error;
    }
});
const refetchLRUCache = () => __awaiter(void 0, void 0, void 0, function* () {
    const queries = Array.from(lruCache.keys());
    for (const query of queries) {
        const ast = (0, graphql_1.parse)(query);
        const { operationType } = (0, determineType_1.default)(ast);
        if (operationType === 'query') {
            const fetchConfig = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: query
            };
            const data = yield performFetch(endPoint, fetchConfig);
        }
    }
});
exports.refetchLRUCache = refetchLRUCache;
const Quellify = (endPoint, query, costOptions, variables) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedResults = lruCache.get(query);
    if (cachedResults) {
        return [cachedResults, true];
    }
    const postFetch = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, costOptions })
    };
    const AST = (0, graphql_1.parse)(query);
    const { operationType, proto } = (0, determineType_1.default)(AST);
    if (operationType === 'unQuellable') {
        return [null, false];
    }
    if (operationType === 'mutation') {
        try {
            const result = yield performFetch(endPoint, postFetch);
            return [result, true];
        }
        catch (error) {
            throw error;
        }
    }
    if (operationType === 'subscription') {
        // Subscription code here
    }
    if (operationType === 'query') {
        const queryResults = lokiCache.findOne({ query });
        if (queryResults) {
            updateLRUCache(query, queryResults.data);
            return [queryResults.data, true];
        }
        try {
            const data = yield performFetch(endPoint, postFetch);
            const node = { query, data, costOptions };
            lokiCache.insert(node);
            updateLRUCache(query, data);
            return [data, true];
        }
        catch (error) {
            throw error;
        }
    }
    return [null, false];
});
exports.Quellify = Quellify;
