"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const quellHelpers_1 = require("../../src/helpers/quellHelpers");
const schema = require("../../test-config/testSchema");
const schemaWithoutFields = require("../../test-config/testSchemaWithoutFields");
describe("server side tests for getFieldsMap", () => {
    afterAll((done) => {
        done();
    });
    test("Correctly returns valid fields and their respective type based on schema", () => {
        expect((0, quellHelpers_1.getFieldsMap)(schema)).toEqual({
            Book: {
                author: "String",
                id: "ID",
                name: "String",
                shelf_id: "String",
            },
            BookShelf: {
                books: "Book",
                id: "ID",
                name: "String",
            },
            City: {
                country_id: "String",
                id: "ID",
                name: "String",
                population: "Int",
            },
            Country: {
                capital: "String",
                cities: "City",
                id: "ID",
                name: "String",
            },
            RootMutationType: {
                addBook: "Book",
                addBookShelf: "BookShelf",
                addCountry: "Country",
                changeBook: "Book",
                //deleteCity field does not exist in testSchema, therefore commented out
                // deleteCity: "City",
            },
        });
    });
    test("Returns an empty object for any types in the schema without field values", () => {
        expect((0, quellHelpers_1.getFieldsMap)(schemaWithoutFields)).toEqual({
            Book: {},
            BookShelf: {},
            City: {},
            Country: {},
            RootMutationType: {},
        });
    });
});
