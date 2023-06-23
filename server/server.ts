import {
  getElapsedTime,
  clearElapsedTime,
  graphqlSchema,
} from "./schema/schema";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { QuellCache } from "../quell-server/dist/src/quell";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const schema = graphqlSchema;

type ServerError = {
  log: string,
  status: number,
  message: { err: string },
}

const quellCache = new QuellCache({
  schema: schema,
  cacheExpiration: 3600,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) throw new Error('The MONGO URI environment variable must be')

mongoose
  .connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: string) => console.log(err));

const PORT: number = Number(process.env.PORT) || 3000;

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
    console.log("inside server route to /api/graphql");
    console.log('res.locals in server: ', res.locals);
    return res.status(200).send(res.locals);
  }
);

app.get("/api/clearCache", quellCache.clearCache, (req, res) => {
  return res.status(200).send("Redis cache successfully cleared");
});

app.use(
  "/api/redis",
  quellCache.getRedisInfo({
    getStats: true,
    getKeys: true,
    getValues: true,
  }),
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals);
  }
);

app.use("/api/queryTime", getElapsedTime, (req, res) => {
  // console.log('elapsed time', getElapsedTime);
  // console.log('elapsed time', res.locals.time);
  return res.status(200).send(res.locals);
  // console.log('reached /api/queryTime');
});

app.use((req: Request, res: Response) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message.err);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
