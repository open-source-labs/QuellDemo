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
const test_server_1 = __importDefault(require("../../test-config/test-server"));
const quell_1 = require("../../src/quell");
const testSchema_1 = __importDefault(require("../../test-config/testSchema"));
const redisHelpers_1 = require("../../src/helpers/redisHelpers");
// tests pass locally, but time out in travis CI build...
xdescribe('server test for getRedisInfo', () => {
    const Quell = new quell_1.QuellCache({
        schema: testSchema_1.default,
        redisPort: Number(process.env.REDIS_PORT) || 6379,
        redisHost: process.env.REDIS_HOST || '127.0.0.1',
        redisPassword: process.env.REDIS_PASSWORD || '',
    });
    test_server_1.default.use('/redis', ...(0, redisHelpers_1.getRedisInfo)({
        getStats: true,
        getKeys: true,
        getValues: true,
    }));
    const server = test_server_1.default.listen(3000, () => { });
    beforeAll(() => {
        const promise1 = new Promise((resolve, reject) => {
            resolve(Quell.writeToCache('country--1', {
                id: '1',
                capitol: { id: '2', name: 'DC' },
            }));
        });
        const promise2 = new Promise((resolve, reject) => {
            resolve(Quell.writeToCache('country--2', { id: '2' }));
        });
        const promise3 = new Promise((resolve, reject) => {
            resolve(Quell.writeToCache('country--3', { id: '3' }));
        });
        const promise4 = new Promise((resolve, reject) => {
            resolve(Quell.writeToCache('countries', [
                'country--1',
                'country--2',
                'country--3',
            ]));
        });
        return Promise.all([promise1, promise2, promise3, promise4]);
    });
    afterAll(() => {
        server.close();
        Quell.redisCache.flushAll();
        Quell.redisCache.quit();
    });
    it('responds with a 200 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(test_server_1.default).get('/redis');
        expect(response.statusCode).toBe(200);
    }));
    it('gets stats from redis cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(test_server_1.default).get('/redis');
        const redisStats = response.body.redisStats;
        expect(Object.keys(redisStats)).toEqual([
            'server',
            'client',
            'memory',
            'stats',
        ]);
    }));
    it('gets keys from redis cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(test_server_1.default).get('/redis');
        const redisKeys = response.body.redisKeys;
        expect(redisKeys).toEqual([
            'country--2',
            'country--1',
            'countries',
            'country--3',
        ]);
    }));
    it('gets values from redis cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(test_server_1.default).get('/redis');
        const redisValues = response.body.redisValues;
        expect(redisValues).toEqual([
            '{"id":"2"}',
            '{"id":"1","capitol":{"id":"2","name":"DC"}}',
            '["country--1","country--2","country--3"]',
            '{"id":"3"}',
        ]);
    }));
});
