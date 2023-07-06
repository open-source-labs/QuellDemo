"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisCacheMain = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisPort = Number(process.env.REDIS_PORT);
const redisHost = process.env.REDIS_HOST;
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
});
