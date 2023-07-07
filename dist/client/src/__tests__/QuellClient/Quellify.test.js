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
const Quellify_1 = require("../../quell-client/src/Quellify");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
describe('Quellify', () => {
    let quellify;
    let req, res, next;
    beforeEach(() => {
        req = node_mocks_http_1.default.createRequest();
        res = node_mocks_http_1.default.createResponse();
        next = jest.fn();
    });
    describe('handleRequest', () => {
        const query = `
      query {
        artist(name: "Frank Ocean") {
          id
          name
          albums {
            id
            name
            songs {
              id
              name
            }
          }
        }
      }
    `;
        it('should fetch data and cache it for a query not in the cache', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { query };
            yield (0, Quellify_1.Quellify)("/api/graphql", query, { maxCost: 50, maxDepth: 10, ipRate: 5 }, {
                addCity: ['cities'],
                addCountry: ['countries'],
                addAttraction: ['attractions'],
                addArtist: ['artists'],
                addAlbum: ['albums'],
                addSong: ['songs'],
                deleteCity: ['cities'],
                deleteArtist: ['artists'],
                deleteAlbum: ['albums'],
                editArtist: ['artists'],
            }).handleRequest(req, res, next);
            const cacheKey = JSON.stringify(query);
            expect(Quellify_1.Quellify.mapCache.has(cacheKey)).toBe(true);
        }));
        it('should retrieve data from the cache for a repeated query', () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = { query };
            yield quellify.handleRequest(req, res, next); // First request to cache data
            const responseFirstRequest = res._getData();
            yield quellify.handleRequest(req, res, next); // Second request should retrieve data from cache
            const responseSecondRequest = res._getData();
            expect(responseFirstRequest).toEqual(responseSecondRequest);
        }));
    });
    describe('handleMutation', () => {
        // Similar to the previous example
    });
    describe('Quellify function (client side)', () => {
        const query = `
      query {
        artist(name: "Frank Ocean") {
          id
          name
          albums {
            id
            name
            songs {
              id
              name
            }
          }
        }
      }
    `;
        const maxDepth = 5;
        const maxCost = 1000;
        const ipRate = 100;
        const mutationMap = {}; // Whatever the structure of mutationMap is
        it('should return a normalized object and cache status', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, Quellify_1.Quellify)("/api/graphql", query, { maxDepth, maxCost, ipRate }, mutationMap);
            expect(Array.isArray(response)).toBe(true);
            expect(response).toHaveLength(2);
            const [normalizedResponse, isCacheHit] = response;
            // Assert the structure of normalizedResponse is correct
            // Check if cache status (isCacheHit) is correct
            // ...
        }));
        it('should measure and log response time', () => __awaiter(void 0, void 0, void 0, function* () {
            const startTime = new Date().getTime();
            yield (0, Quellify_1.Quellify)("/api/graphql", query, { maxDepth, maxCost, ipRate }, mutationMap);
            const responseTime = new Date().getTime() - startTime;
            expect(responseTime).toBeLessThan(1000); // Arbitrary time limit, can be adjusted
        }));
        // Add additional test cases as needed...
    });
});
