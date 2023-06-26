import request from 'supertest';
import { app, server, quellCache } from '../server'; 
import mongoose, { ConnectOptions } from 'mongoose';


// npx jest server/__tests__/server.test.ts
beforeAll(async () => {
  await connectToMongoDB();
});

afterAll((done) => {
  server.close();
  quellCache.redisCache.disconnect();
  done();
});

describe('GraphQL API Tests', () => {
  // Test cases...
});

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
}

describe('GraphQL API Tests', () => {
  it('should respond with a successful GraphQL query', async () => {
    const query = `
      query {
        artist(name: "Frank Ocean") {
          id 
          name
          albums {
            id
            name
          }
        }
      }
    `;
    
    const response = await request(app)
      .post('/api/graphql')
      .send({ query })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('should clear the Redis cache', async () => {
    const response = await request(app).get('/api/clearCache');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Redis cache successfully cleared');
  });

  it('should get Redis server information', async () => {
    const response = await request(app).get('/api/redis');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('should get the query execution time', async () => {
    const response = await request(app).get('/api/queryTime');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });

  it('should respond with a 404 error for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
    expect(response.text).toBe("This is not the page you're looking for...");
  });

  // Add more tests as needed
});
