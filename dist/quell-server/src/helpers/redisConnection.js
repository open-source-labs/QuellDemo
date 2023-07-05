"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCacheMain = void 0;
const redis_1 = require("redis");
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || 'red-ciisb0p5rnut2se112ug';
const redisPassword = process.env.REDIS_PASSWORD;
// Create and export the Redis client instance
exports.redisCacheMain = (0, redis_1.createClient)({
    socket: { host: redisHost, port: redisPort },
    password: redisPassword,
});
// Handle errors during the connection
exports.redisCacheMain.on("error", (error) => {
    console.error(`Error when trying to connect to redisCacheMain: ${error}`);
});
// Establish the connection to Redis
exports.redisCacheMain.connect().then(() => {
    console.log("Connected to redisCacheMain");
    console.log(redisHost);
});
