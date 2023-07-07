import {
  getElapsedTime,
  clearElapsedTime,
  graphqlSchema,
} from "./schema/schema";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { QuellCache } from "../quell-server/src/quell";
import { getRedisInfo } from "../quell-server/src/helpers/redisHelpers";
import dotenv from "dotenv";

//load env variables from a .env file
dotenv.config();
const app = express();

/**GraphQL Schema 
* @type {GraphQLSchema} GraphQLSchema instance
*/
const schema = graphqlSchema;

type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

const quellCache = new QuellCache({
  schema: schema,
  cacheExpiration: 3600,
  redisPort: Number(process.env.REDIS_PORT),
  redisHost: process.env.REDIS_HOST, 
  redisPassword: process.env.REDIS_PASSWORD,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
// Connect to mongo database
mongoose
  .connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: string) => console.log(err));

const PORT: number = Number(process.env.PORT) || 3000;
// Serves typescript files after being compiled
app.use(express.static("./dist"));

// clearElapsedTime so that elapsedTime doesn't persist old times for new queries
app.use(
  "/api/graphql",
  clearElapsedTime,
  quellCache.rateLimiter,
  quellCache.costLimit,
  quellCache.depthLimit,
  quellCache.query,
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals);
  }
);

app.get("/api/clearCache", quellCache.clearCache, (req, res) => {
  return res.status(200).send("Redis cache successfully cleared");
});

/**
 * Redis Middleware function to retrieve information from Redis
 * @param {object} options specify various configuration settings in Redis middleware 
 */
const redisMiddleware = getRedisInfo({
  getStats: true,
  getKeys: true,
  getValues: true,
});

app.get("/api/redis", redisMiddleware, (req: Request, res: Response) => {
  return res.status(200).send(res.locals);
});

app.use("/api/queryTime", getElapsedTime, (req, res) => {
  return res.status(200).send(res.locals);
});

app.use((req: Request, res: Response) =>
  res.status(404).send("This is not the page you're looking for...")
);
// Global Error Handler
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
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

export { app, server, quellCache };
