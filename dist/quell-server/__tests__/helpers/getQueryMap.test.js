"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const quellHelpers_1 = require("../../src/helpers/quellHelpers");
const testSchema_1 = __importDefault(require("../../test-config/testSchema"));
const testSchemaWithoutQueries_1 = __importDefault(require("../../test-config/testSchemaWithoutQueries"));
describe('server side tests for getQueryMap', () => {
    afterAll((done) => {
        done();
    });
    test('Correctly returns valid queries and their respective type based on schema', () => {
        expect((0, quellHelpers_1.getQueryMap)(testSchema_1.default)).toEqual({
            book: 'Book',
            bookShelf: 'BookShelf',
            bookShelves: ['BookShelf'],
            books: ['Book'],
            cities: ['City'],
            citiesByCountry: ['City'],
            city: 'City',
            countries: ['Country'],
            country: 'Country'
        });
    });
    test('Returns empty object for schema without queries', () => {
        expect((0, quellHelpers_1.getQueryMap)(testSchemaWithoutQueries_1.default)).toEqual({});
    });
});
