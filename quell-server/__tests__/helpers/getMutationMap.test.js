"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const quellHelpers_1 = require("../../src/helpers/quellHelpers");
const testSchema_1 = __importDefault(require("../../test-config/testSchema"));
const testSchemaWithoutMuts_1 = __importDefault(require("../../test-config/testSchemaWithoutMuts"));
describe('server side tests for getMutationMap', () => {
    afterAll((done) => {
        done();
    });
    console.log((0, quellHelpers_1.getMutationMap)(testSchema_1.default));
    test('Correctly returns valid mutations and their respective type based on schema', () => {
        expect((0, quellHelpers_1.getMutationMap)(testSchema_1.default)).toEqual({
            addBook: 'Book',
            changeBook: 'Book',
            addBookShelf: 'BookShelf',
            addCountry: 'Country', // Not found in testSchema?
            // deleteCity: 'City' // Not found in testSchema?
        });
    });
    test('Returns empty object for schema without mutations', () => {
        expect((0, quellHelpers_1.getMutationMap)(testSchemaWithoutMuts_1.default)).toEqual({});
    });
});
