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
const quell_1 = require("../../src/quell");
const cacheHelpers_1 = require("../../src/helpers/cacheHelpers");
const testSchema_1 = __importDefault(require("../../test-config/testSchema"));
describe('server test for buildFromCache', () => {
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
            resolve((0, cacheHelpers_1.writeToCache)('country--1', {
                id: '1',
                capitol: { id: '2', name: 'DC' },
            }, 1209600));
        });
        const promise2 = new Promise((resolve, reject) => {
            resolve((0, cacheHelpers_1.writeToCache)('country--2', { id: '2' }, 1209600));
        });
        const promise3 = new Promise((resolve, reject) => {
            resolve((0, cacheHelpers_1.writeToCache)('country--3', { id: '3' }, 1209600));
        });
        const promise4 = new Promise((resolve, reject) => {
            resolve((0, cacheHelpers_1.writeToCache)('countries', [
                'country--1',
                'country--2',
                'country--3',
            ], 1209600));
        });
        return Promise.all([promise1, promise2, promise3, promise4]);
    });
    // afterAll(() => {
    //   Quell.redisCache.flushall();
    //   Quell.redisCache.quit();
    // });
    test('Basic query', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            country: {
                id: true,
                name: true,
                __alias: null,
                __args: { id: '3' },
                __type: 'country',
                __id: '3',
            },
        };
        const endProto = {
            country: {
                id: true,
                name: false,
                __alias: null,
                __args: { id: '3' },
                __type: 'country',
                __id: '3',
            },
        };
        const expectedResponseFromCache = {
            data: {
                country: {
                    id: '3',
                },
            },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        // we expect prototype after running through buildFromCache to have id has stayed true but every other field has been toggled to false (if not found in sessionStorage)
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
    test('Basic query for data not in the cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            book: {
                id: true,
                name: true,
                __alias: null,
                __args: { id: '3' },
                __type: 'book',
                __id: '3',
            },
        };
        const endProto = {
            book: {
                id: false,
                name: false,
                __alias: null,
                __args: { id: '3' },
                __type: 'book',
                __id: '3',
            },
        };
        const expectedResponseFromCache = {
            data: { book: {} },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        // we expect prototype after running through buildFromCache to have id has stayed true but every other field has been toggled to false (if not found in sessionStorage)
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
    test('Multiple nested queries that include args and aliases', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            Canada: {
                id: true,
                name: true,
                __alias: 'Canada',
                __args: { id: '1' },
                __type: 'country',
                __id: '1',
                capitol: {
                    id: true,
                    name: true,
                    population: true,
                    __alias: null,
                    __args: {},
                    __type: 'capitol',
                    __id: null,
                },
            },
            Mexico: {
                id: true,
                name: true,
                __alias: 'Mexico',
                __args: { id: '2' },
                __type: 'country',
                __id: '2',
                climate: {
                    seasons: true,
                    __alias: null,
                    __args: {},
                    __type: 'climate',
                    __id: null,
                },
            },
        };
        const endProto = {
            Canada: {
                id: true,
                name: false,
                __alias: 'Canada',
                __args: { id: '1' },
                __type: 'country',
                __id: '1',
                capitol: {
                    id: true,
                    name: true,
                    population: false,
                    __alias: null,
                    __args: {},
                    __type: 'capitol',
                    __id: null,
                },
            },
            Mexico: {
                id: true,
                name: false,
                __alias: 'Mexico',
                __args: { id: '2' },
                __type: 'country',
                __id: '2',
                climate: {
                    seasons: false,
                    __alias: null,
                    __args: {},
                    __type: 'climate',
                    __id: null,
                },
            },
        };
        const expectedResponseFromCache = {
            data: {
                Canada: {
                    id: '1',
                    capitol: {
                        id: '2',
                        name: 'DC',
                    },
                },
                Mexico: {
                    id: '2',
                },
            },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
    xtest('Handles array', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            countries: {
                id: true,
                name: true,
                __alias: null,
                __args: {},
                __type: 'countries',
            },
        };
        const endProto = {
            countries: {
                id: true,
                name: false,
                __alias: null,
                __args: {},
                __type: 'countries',
            },
        };
        const expectedResponseFromCache = {
            data: {
                countries: [
                    {
                        id: '1',
                    },
                    {
                        id: '2',
                    },
                    {
                        id: '3',
                    },
                ],
            },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
    test('Handles deeply nested queries with an empty cache', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            continents: {
                id: true,
                name: true,
                __type: 'continents',
                __alias: null,
                __args: {},
                __id: null,
                cities: {
                    id: true,
                    name: true,
                    __type: 'cities',
                    __alias: null,
                    __args: {},
                    __id: null,
                    attractions: {
                        id: true,
                        name: true,
                        __type: 'attractions',
                        __alias: null,
                        __args: {},
                        __id: null,
                    },
                },
            },
        };
        const endProto = {
            continents: {
                id: false,
                name: false,
                __type: 'continents',
                __alias: null,
                __args: {},
                __id: null,
                cities: {
                    id: false,
                    name: false,
                    __type: 'cities',
                    __alias: null,
                    __args: {},
                    __id: null,
                    attractions: {
                        id: false,
                        name: false,
                        __type: 'attractions',
                        __alias: null,
                        __args: {},
                        __id: null,
                    },
                },
            },
        };
        const expectedResponseFromCache = {
            data: { continents: {} },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
    test('Basic query', () => __awaiter(void 0, void 0, void 0, function* () {
        const testProto = {
            country: {
                id: true,
                name: true,
                __alias: null,
                __args: { id: '3' },
                __type: 'country',
                __id: '3',
            },
        };
        const endProto = {
            country: {
                id: true,
                name: false,
                __alias: null,
                __args: { id: '3' },
                __type: 'country',
                __id: '3',
            },
        };
        const expectedResponseFromCache = {
            data: {
                country: {
                    id: '3',
                },
            },
        };
        const prototypeKeys = Object.keys(testProto);
        const responseFromCache = yield Quell.buildFromCache(testProto, prototypeKeys);
        // we expect prototype after running through buildFromCache to have id has stayed true but every other field has been toggled to false (if not found in sessionStorage)
        expect(testProto).toEqual(endProto);
        expect(responseFromCache).toEqual(expectedResponseFromCache);
    }));
});
