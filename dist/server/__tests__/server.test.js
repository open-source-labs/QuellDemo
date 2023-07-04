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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const mongoose_1 = __importDefault(require("mongoose"));
// npx jest server/__tests__/server.test.ts
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToMongoDB();
}));
afterAll((done) => {
    server_1.server.close();
    server_1.quellCache.redisCache.disconnect();
    done();
});
// describe('GraphQL API Tests', () => {
// });
function connectToMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB');
        }
        catch (err) {
            console.log(err);
        }
    });
}
describe('GraphQL API Tests', () => {
    it('should respond with a successful GraphQL query', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield (0, supertest_1.default)(server_1.app)
            .post('/api/graphql')
            .send({ query })
            .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        // Add more assertions as needed
    }));
    it('should clear the Redis cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get('/api/clearCache');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Redis cache successfully cleared');
    }));
    it('should get Redis server information', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get('/api/redis');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        // Add more assertions as needed
    }));
    it('should get the query execution time', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get('/api/queryTime');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        // Add more assertions as needed
    }));
    it('should respond with a 404 error for unknown routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get('/unknown-route');
        expect(response.status).toBe(404);
        expect(response.text).toBe("This is not the page you're looking for...");
    }));
    // Add more tests as needed
});
