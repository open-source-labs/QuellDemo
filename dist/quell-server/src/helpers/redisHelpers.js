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
exports.getStatsFromRedis = exports.getRedisValues = exports.getRedisKeys = exports.getRedisInfo = exports.getFromRedis = void 0;
const redisConnection_1 = require("./redisConnection");
//connection to Redis server
const redisCache = redisConnection_1.redisCacheMain;
/**
 * Reads from Redis cache and returns a promise (Redis v4 natively returns a promise).
 * @param {string} key - The key for Redis lookup.
 * @returns {Promise} A promise representing the value from the redis cache with the provided key.
 */
const getFromRedis = (key, redisCache) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof key !== "string" || key === undefined)
            return;
        const lowerKey = key.toLowerCase();
        const redisResult = yield redisCache.get(lowerKey);
        return redisResult;
    }
    catch (error) {
        const err = {
            log: `Error in QuellCache trying to getFromRedis, ${error}`,
            status: 400,
            message: {
                err: "Error in getFromRedis. Check server log for more details.",
            },
        };
        console.log("err in getFromRedis: ", err);
    }
});
exports.getFromRedis = getFromRedis;
/**
 * Returns a chain of middleware based on what information (if any) the user would
 * like to request from the specified redisCache. It requires an appropriately
 * configured Express route and saves the specified stats to res.locals, for instance:
 * @example
 *  app.use('/redis', getRedisInfo({
 *    getStats: true,
 *    getKeys: true,
 *    getValues: true
 *  }));
 * @param {Object} options - Three properties with boolean values: getStats, getKeys, getValues
 * @returns {Array} An array of middleware functions that retrieves specified Redis info.
 */
const getRedisInfo = (options = {
    getStats: true,
    getKeys: true,
    getValues: true,
}) => {
    console.log("Getting Redis Info");
    const middleware = [];
    /**
     * Helper function within the getRedisInfo function that returns
     * what redis data should be retrieved based on the passed in options.
     * @param {Object} opts - Options object containing a boolean value for getStats, getKeys, and getValues.
     * @returns {string} String that indicates which data should be retrieved from Redis instance.
     */
    const getOptions = (opts) => {
        const { getStats, getKeys, getValues } = opts;
        if (!getStats && getKeys && getValues)
            return "dontGetStats";
        else if (getStats && getKeys && !getValues)
            return "dontGetValues";
        else if (!getStats && getKeys && !getValues)
            return "getKeysOnly";
        else if (getStats && !getKeys && !getValues)
            return "getStatsOnly";
        else
            return "getAll";
    };
    switch (getOptions(options)) {
        case "dontGetStats":
            middleware.push(exports.getRedisKeys, exports.getRedisValues);
            break;
        case "dontGetValues":
            middleware.push(exports.getStatsFromRedis, exports.getRedisKeys);
            break;
        case "getKeysOnly":
            middleware.push(exports.getRedisKeys);
            break;
        case "getStatsOnly":
            middleware.push(exports.getStatsFromRedis);
            break;
        case "getAll":
            middleware.push(exports.getStatsFromRedis, exports.getRedisKeys, exports.getRedisValues);
            break;
    }
    return middleware;
};
exports.getRedisInfo = getRedisInfo;
/**
 * Gets the key names from the Redis cache and adds them to the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getRedisKeys = (req, res, next) => {
    redisCache
        .keys("*")
        .then((response) => {
        res.locals.redisKeys = response;
        return next();
    })
        .catch((error) => {
        const err = {
            log: `Error inside catch block of getRedisKeys, keys potentially undefined, ${error}`,
            status: 400,
            message: {
                err: "Error in redis - getRedisKeys. Check server log for more details.",
            },
        };
        return next(err);
    });
};
exports.getRedisKeys = getRedisKeys;
/**
 * Gets the values associated with the Redis cache keys and adds them to the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getRedisValues = (req, res, next) => {
    if (res.locals.redisKeys && res.locals.redisKeys.length !== 0) {
        redisCache
            .mGet(res.locals.redisKeys)
            .then((response) => {
            res.locals.redisValues = response;
            return next();
        })
            .catch((error) => {
            const err = {
                log: `Error inside catch block of getRedisValues, ${error}`,
                status: 400,
                message: {
                    err: "Error in redis - getRedisValues. Check server log for more details.",
                },
            };
            return next(err);
        });
    }
    else {
        res.locals.redisValues = [];
        return next();
    }
};
exports.getRedisValues = getRedisValues;
/**
 * Gets information and statistics about the server and adds them to the response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const getStatsFromRedis = (req, res, next) => {
    try {
        const getStats = () => {
            // redisCache.info returns information and statistics about the server as an array of field:value.
            redisCache
                .info()
                .then((response) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
                const dataLines = response.split("\r\n");
                const output = {
                    // SERVER
                    server: [
                        // Redis version
                        {
                            name: "Redis version",
                            value: (_a = dataLines
                                .find((line) => line.match(/redis_version/))) === null || _a === void 0 ? void 0 : _a.split(":")[1],
                        },
                        // Redis build id
                        {
                            name: "Redis build id",
                            value: (_b = dataLines
                                .find((line) => line.match(/redis_build_id/))) === null || _b === void 0 ? void 0 : _b.split(":")[1],
                        },
                        // Redis mode
                        {
                            name: "Redis mode",
                            value: (_c = dataLines
                                .find((line) => line.match(/redis_mode/))) === null || _c === void 0 ? void 0 : _c.split(":")[1],
                        },
                        // OS hosting Redis system
                        {
                            name: "Host operating system",
                            value: (_d = dataLines
                                .find((line) => line.match(/os/))) === null || _d === void 0 ? void 0 : _d.split(":")[1],
                        },
                        // TCP/IP listen port
                        {
                            name: "TCP/IP port",
                            value: (_e = dataLines
                                .find((line) => line.match(/tcp_port/))) === null || _e === void 0 ? void 0 : _e.split(":")[1],
                        },
                        // Server time
                        {
                            name: 'System time',
                            value: (_f = dataLines
                                .find((line) => line.match(/server_time_in_usec/))) === null || _f === void 0 ? void 0 : _f.split(':')[1],
                        },
                        // Number of seconds since Redis server start
                        {
                            name: "Server uptime (seconds)",
                            value: (_g = dataLines
                                .find((line) => line.match(/uptime_in_seconds/))) === null || _g === void 0 ? void 0 : _g.split(":")[1],
                        },
                        // Number of days since Redis server start
                        {
                            name: "Server uptime (days)",
                            value: (_h = dataLines
                                .find((line) => line.match(/uptime_in_days/))) === null || _h === void 0 ? void 0 : _h.split(":")[1],
                        },
                        // Path to server's executable
                        {
                            name: 'Path to executable',
                            value: (_j = dataLines
                                .find((line) => line.match(/executable/))) === null || _j === void 0 ? void 0 : _j.split(':')[1],
                        },
                        // Path to server's configuration file
                        {
                            name: "Path to configuration file",
                            value: (_k = dataLines
                                .find((line) => line.match(/config_file/))) === null || _k === void 0 ? void 0 : _k.split(":")[1],
                        },
                    ],
                    // CLIENT
                    client: [
                        // Number of connected clients
                        {
                            name: "Connected clients",
                            value: (_l = dataLines
                                .find((line) => line.match(/connected_clients/))) === null || _l === void 0 ? void 0 : _l.split(":")[1],
                        },
                        // Number of sockets used by cluster bus
                        {
                            name: "Cluster connections",
                            value: (_m = dataLines
                                .find((line) => line.match(/cluster_connections/))) === null || _m === void 0 ? void 0 : _m.split(":")[1],
                        },
                        // Max clients
                        {
                            name: "Max clients",
                            value: (_o = dataLines
                                .find((line) => line.match(/maxclients/))) === null || _o === void 0 ? void 0 : _o.split(":")[1],
                        },
                        // Number of clients being tracked
                        {
                            name: 'Tracked clients',
                            value: (_p = dataLines
                                .find((line) => line.match(/tracking_clients/))) === null || _p === void 0 ? void 0 : _p.split(':')[1],
                        },
                        // Blocked clients
                        {
                            name: "Blocked clients",
                            value: (_q = dataLines
                                .find((line) => line.match(/blocked_clients/))) === null || _q === void 0 ? void 0 : _q.split(":")[1],
                        },
                    ],
                    // MEMORY
                    memory: [
                        // Total allocated memory
                        {
                            name: "Total allocated memory",
                            value: (_r = dataLines
                                .find((line) => line.match(/used_memory_human/))) === null || _r === void 0 ? void 0 : _r.split(":")[1],
                        },
                        // Peak memory consumed
                        {
                            name: "Peak memory consumed",
                            value: (_s = dataLines
                                .find((line) => line.match(/used_memory_peak_human/))) === null || _s === void 0 ? void 0 : _s.split(":")[1],
                        },
                        // % of peak out of total
                        {
                            name: 'Peak memory used % total',
                            value: (_t = dataLines
                                .find((line) => line.match(/used_memory_peak_perc/))) === null || _t === void 0 ? void 0 : _t.split(':')[1],
                        },
                        // Initial amount of memory consumed at startup
                        {
                            name: 'Memory consumed at startup',
                            value: (_u = dataLines
                                .find((line) => line.match(/used_memory_startup/))) === null || _u === void 0 ? void 0 : _u.split(':')[1],
                        },
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
                            name: "Total connections",
                            value: (_v = dataLines
                                .find((line) => line.match(/total_connections_received/))) === null || _v === void 0 ? void 0 : _v.split(":")[1],
                        },
                        // Total number of commands processed by server
                        {
                            name: "Total commands",
                            value: (_w = dataLines
                                .find((line) => line.match(/total_commands_processed/))) === null || _w === void 0 ? void 0 : _w.split(":")[1],
                        },
                        // Number of commands processed per second
                        {
                            name: "Commands processed per second",
                            value: (_x = dataLines
                                .find((line) => line.match(/instantaneous_ops_per_sec/))) === null || _x === void 0 ? void 0 : _x.split(":")[1],
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
                            name: "Error replies",
                            value: (_y = dataLines
                                .find((line) => line.match(/total_error_replies/))) === null || _y === void 0 ? void 0 : _y.split(":")[1],
                        },
                        // Total number of bytes read from network
                        {
                            name: "Bytes read from network",
                            value: (_z = dataLines
                                .find((line) => line.match(/total_net_input_bytes/))) === null || _z === void 0 ? void 0 : _z.split(":")[1],
                        },
                        // Networks read rate per second
                        {
                            name: "Network read rate (Kb/s)",
                            value: (_0 = dataLines
                                .find((line) => line.match(/instantaneous_input_kbps/))) === null || _0 === void 0 ? void 0 : _0.split(":")[1],
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
                            name: "Network write rate (Kb/s)",
                            value: (_1 = dataLines
                                .find((line) => line.match(/instantaneous_output_kbps/))) === null || _1 === void 0 ? void 0 : _1.split(":")[1],
                        },
                    ],
                };
                res.locals.redisStats = output;
                return next();
            })
                .catch((error) => {
                const err = {
                    log: `Error inside catch block of getting info within getStatsFromRedis, ${error}`,
                    status: 400,
                    message: {
                        err: "Error in redis - getStatsFromRedis. Check server log for more details.",
                    },
                };
                return next(err);
            });
        };
        getStats();
    }
    catch (error) {
        const err = {
            log: `Error inside catch block of getStatsFromRedis, ${error}`,
            status: 400,
            message: {
                err: "Error in redis - getStatsFromRedis. Check server log for more details.",
            },
        };
        return next(err);
    }
};
exports.getStatsFromRedis = getStatsFromRedis;
