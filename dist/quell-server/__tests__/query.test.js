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
const quell_1 = require("../src/quell");
const testSchema_1 = __importDefault(require("../test-config/testSchema"));
describe('server test for query', () => {
    const Quell = new quell_1.QuellCache({
        schema: testSchema_1.default,
        redisPort: Number(process.env.REDIS_PORT) || 6379,
        redisHost: process.env.REDIS_HOST || '127.0.0.1',
        redisPassword: process.env.REDIS_PASSWORD || '',
    });
    // inputs: prototype object (which contains args), collection (defaults to an empty array)
    // outputs: protoype object with fields that were not found in the cache set to false
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
    // afterAll(() => {
    //   Quell.redisCache.flushAll();
    //   Quell.redisCache.quit();
    // });
    test('If query is empty, should error out in rateLimiter', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockReq = {
            body: {}
        };
        const mockRes = {};
        const mockNext = jest.fn();
        yield Quell.rateLimiter(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith({
            log: "Error: no GraphQL query found on request body, inside rateLimiter",
            status: 400,
            message: {
                err: "Error in rateLimiter: Bad Request. Check server log for more details.",
            },
        });
    }));
    test('If query is empty, should error out in query', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockReq = {
            body: {}
        };
        const mockRes = {};
        const mockNext = jest.fn();
        yield Quell.query(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith({
            log: "Error: no GraphQL query found on request body",
            status: 400,
            message: {
                err: "Error in quellCache.query: Check server log for more details.",
            },
        });
    }));
});
