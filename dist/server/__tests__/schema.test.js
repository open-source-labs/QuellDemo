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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema"); // Adjust the import path accordingly
// Mocking mongoose models
jest.mock('../models/albumsModel', () => ({
    find: jest.fn(),
    findOne: jest.fn(),
}));
jest.mock('../models/artistsModel', () => ({ findOne: jest.fn() }));
jest.mock('../models/songsModel', () => ({ find: jest.fn() }));
jest.mock('../models/attractionsModel', () => ({ findOne: jest.fn(), find: jest.fn() }));
jest.mock('../models/citiesModel', () => ({ findOne: jest.fn() }));
jest.mock('../models/countriesModel', () => ({ findOne: jest.fn() }));
const Artist = require('../models/artistsModel');
const Album = require('../models/albumsModel');
const Song = require('../models/songsModel');
const Attraction = require('../models/attractionsModel');
const Country = require('../models/countriesModel');
const City = require('../models/citiesModel');
describe('GraphQL Schema', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Fetches artist with GraphQL', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock implementation for Artist.findOne
        Artist.findOne.mockResolvedValue({ name: 'Coldplay' });
        // Mock implementation for Album.find
        Album.find.mockResolvedValue([
            { name: 'Parachutes' },
            { name: 'A Rush of Blood to the Head' },
        ]);
        const query = `
      {
        artist(name: "Coldplay") {
          name
          albums {
            name
          }
        }
      }
    `;
        const result = yield (0, graphql_1.graphql)({
            schema: schema_1.graphqlSchema,
            source: query,
            rootValue: {}, // rootValue or any other necessary context
        });
        if (result.errors) {
            console.error(result.errors);
        }
        // Check if no errors
        expect(result.errors).toBeUndefined();
        // Type checking and assertions
        const data = result.data;
        expect(data.artist.name).toBe('Coldplay');
        expect(data.artist.albums).toHaveLength(2);
        expect(data.artist.albums[0].name).toBe('Parachutes');
        expect(data.artist.albums[1].name).toBe('A Rush of Blood to the Head');
    }));
    // Test case for fetching a city
    test('Fetches city with GraphQL', () => __awaiter(void 0, void 0, void 0, function* () {
        City.findOne.mockResolvedValue({ name: 'Paris', country: 'France' });
        const query = `
        {
          city(name: "Paris") {
            name
            country
          }
        }
      `;
        const result = yield (0, graphql_1.graphql)({
            schema: schema_1.graphqlSchema,
            source: query,
            rootValue: {},
        });
        if (result.errors) {
            console.error(result.errors);
        }
        expect(result.errors).toBeUndefined();
        const data = result.data;
        expect(data.city.name).toBe('Paris');
        expect(data.city.country).toBe('France');
    }));
});
