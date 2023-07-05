"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quellCache = exports.server = exports.app = void 0;
const schema_1 = require("./schema/schema");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const quell_1 = require("../quell-server/src/quell");
const redisHelpers_1 = require("../quell-server/src/helpers/redisHelpers");
const dotenv_1 = __importDefault(require("dotenv"));
//load env variables from a .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
/**GraphQL Schema
* @type {GraphQLSchema} GraphQLSchema instance
*/
const schema = schema_1.graphqlSchema;
const quellCache = new quell_1.QuellCache({
    schema: schema,
    cacheExpiration: 3600,
    redisPort: Number(process.env.REDIS_PORT) || 6379,
    redisHost: process.env.REDIS_HOST || 'red-ciisb0p5rnut2se112ug',
    redisPassword: process.env.REDIS_PASSWORD,
});
exports.quellCache = quellCache;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Connect to mongo database
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
const PORT = Number(process.env.PORT) || 3000;
// Serves typescript files after being compiled
app.use(express_1.default.static("./dist"));
// clearElapsedTime so that elapsedTime doesn't persist old times for new queries
app.use("/api/graphql", schema_1.clearElapsedTime, quellCache.rateLimiter, quellCache.costLimit, quellCache.depthLimit, quellCache.query, (req, res) => {
    return res.status(200).send(res.locals);
});
app.get("/api/clearCache", quellCache.clearCache, (req, res) => {
    return res.status(200).send("Redis cache successfully cleared");
});
/**
 * Redis Middleware function to retrieve information from Redis
 * @param {object} options specify various configuration settings in Redis middleware
 */
const redisMiddleware = (0, redisHelpers_1.getRedisInfo)({
    getStats: true,
    getKeys: true,
    getValues: true,
});
app.get("/api/redis", redisMiddleware, (req, res) => {
    return res.status(200).send(res.locals);
});
app.use("/api/queryTime", schema_1.getElapsedTime, (req, res) => {
    return res.status(200).send(res.locals);
});
app.use((req, res) => res.status(404).send("This is not the page you're looking for..."));
// Global Error Handler
app.use((err, req, res, next) => {
    const defaultErr = {
        log: "Express error handler caught unknown middleware error",
        status: 500,
        message: { err: "An error occurred" },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    return res.status(errorObj.status).json(errorObj.message.err);
});
const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}...`);
});
exports.server = server;
