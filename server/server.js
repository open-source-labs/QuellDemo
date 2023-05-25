const {
  getElapsedTime,
  clearElapsedTime,
  graphqlSchema
} = require('./schema/schema.js');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const { QuellCache } = require('../quell-server/src/quell.js');
const env = require('dotenv').config();
const schema = graphqlSchema
const quellCache = new QuellCache({
  schema: schema,
  cacheExpiration: 3600,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  redisPassword: process.env.REDIS_PASSWORD
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(express.static('./dist'));

// clearElapsedTime so that elapsedTime doesn't persist old times for new queries
app.use(
  '/api/graphql',
  clearElapsedTime,
  quellCache.rateLimiter,
  quellCache.costLimit,
  quellCache.depthLimit,
  quellCache.query,
  (req, res) => {
    return res.status(200).send(res.locals);
  }
);

app.get('/api/clearCache', quellCache.clearCache, (req, res) => {
  return res.status(200).send('Redis cache successfully cleared');
});

app.use(
  '/api/redis',
  quellCache.getRedisInfo({
    getStats: true,
    getKeys: true,
    getValues: true
  }),
  (req, res) => {
    return res.status(200).send(res.locals);
  }
);

app.use('/api/queryTime', getElapsedTime, (req, res) => {
  // console.log('elapsed time', getElapsedTime);
  // console.log('elapsed time', res.locals.time);
  return res.status(200).send(res.locals);
  // console.log('reached /api/queryTime');
});

app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' }
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message.err);
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
