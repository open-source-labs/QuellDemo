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
const countriesModel_1 = __importDefault(require("./countriesModel"));
const booksModel_1 = __importDefault(require("./booksModel"));
const graphql_1 = require("graphql");
const BookShelfType = new graphql_1.GraphQLObjectType({
    name: "BookShelf",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const booksList = yield booksModel_1.default.query(`
          SELECT * FROM books WHERE shelf_id = $1`, [Number(parent.id)]);
                    return booksList.rows;
                });
            },
        },
    }),
});
const BookType = new graphql_1.GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        author: { type: graphql_1.GraphQLString },
        shelf_id: { type: graphql_1.GraphQLString },
    }),
});
const CountryType = new graphql_1.GraphQLObjectType({
    name: "Country",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        capital: { type: graphql_1.GraphQLString },
        cities: {
            type: new graphql_1.GraphQLList(CityType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const citiesList = yield countriesModel_1.default.query(`SELECT * FROM cities WHERE country_id = $1`, [Number(parent.id)]);
                    return citiesList.rows;
                });
            },
        },
    }),
});
const CityType = new graphql_1.GraphQLObjectType({
    name: "City",
    fields: () => ({
        country_id: { type: graphql_1.GraphQLString },
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        population: { type: graphql_1.GraphQLInt },
    }),
});
// ADD LANGUAGES TYPE HERE
// ================== //
// ===== QUERIES ==== //
// ================== //
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // GET COUNTRY BY ID
        country: {
            type: CountryType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const country = yield countriesModel_1.default.query(`
          SELECT * FROM countries WHERE id = $1`, [Number(args.id)]);
                    return country.rows[0];
                });
            },
        },
        // GET ALL COUNTRIES
        countries: {
            type: new graphql_1.GraphQLList(CountryType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const countriesFromDB = yield countriesModel_1.default.query(`
          SELECT * FROM countries
          `);
                    return countriesFromDB.rows;
                });
            },
        },
        // GET ALL CITIES IN A COUNTRY
        citiesByCountry: {
            type: new graphql_1.GraphQLList(CityType),
            args: { country_id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const citiesList = yield countriesModel_1.default.query(`
          SELECT * FROM cities WHERE country_id = $1`, [Number(args.country_id)]); // need to dynamically resolve this
                    return citiesList.rows;
                });
            },
        },
        // GET CITY BY ID
        city: {
            type: CityType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const city = yield countriesModel_1.default.query(`
          SELECT * FROM cities WHERE id = $1`, [Number(args.id)]);
                    return city.rows[0];
                });
            },
        },
        // GET ALL CITIES
        cities: {
            type: new graphql_1.GraphQLList(CityType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const citiesList = yield countriesModel_1.default.query(`
          SELECT * FROM cities`);
                    return citiesList.rows;
                });
            },
        },
        // GET ALL BOOKS
        books: {
            type: new graphql_1.GraphQLList(BookType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const books = yield booksModel_1.default.query(`SELECT * FROM books`);
                    return books.rows;
                });
            },
        },
        // GET BOOK BY ID
        book: {
            type: BookType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const book = yield booksModel_1.default.query(`SELECT * FROM books WHERE id = $1`, [
                        Number(args.id),
                    ]);
                    return book.rows[0];
                });
            },
        },
        // GET ALL BOOKSHELVES
        bookShelves: {
            type: new graphql_1.GraphQLList(BookShelfType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const shelvesList = yield booksModel_1.default.query(`
          SELECT * FROM bookShelves`);
                    return shelvesList.rows;
                });
            },
        },
        // GET SHELF BY ID
        bookShelf: {
            type: BookShelfType,
            args: { id: { type: graphql_1.GraphQLID } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const bookShelf = yield booksModel_1.default.query(`SELECT * FROM bookShelves WHERE id = $1`, [Number(args.id)]);
                    return bookShelf.rows[0];
                });
            },
        },
    },
});
// ================== //
// ===== MUTATIONS ==== //
// ================== //
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutationType",
    fields: {
        // add book
        addBook: {
            type: BookType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                author: { type: graphql_1.GraphQLString },
                shelf_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const author = args.author || "";
                    const newBook = yield booksModel_1.default.query(`INSERT INTO books (name, author, shelf_id) VALUES ($1, $2, $3) RETURNING *`, [args.name, author, Number(args.shelf_id)]);
                    return newBook.rows[0];
                });
            },
        },
        // change book
        changeBook: {
            type: BookType,
            args: {
                id: { type: graphql_1.GraphQLID },
                author: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const updatedBook = yield booksModel_1.default.query(`UPDATE books SET author = $2 WHERE id = $1 RETURNING *`, [args.id, args.author]);
                    return updatedBook.rows[0];
                });
            },
        },
        // ADD SHELF
        addBookShelf: {
            type: BookShelfType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const newBookShelf = yield booksModel_1.default.query(`INSERT INTO bookShelves (name) VALUES ($1) RETURNING *`, [args.name]);
                    return newBookShelf.rows[0];
                });
            },
        },
        // UPDATE SHELF
        //ADD COUNTRY (check functionality)
        addCountry: {
            type: CountryType,
            args: {
                capital: { type: graphql_1.GraphQLString },
                cities: { type: graphql_1.GraphQLString },
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const countriesFromDB = yield countriesModel_1.default.query(`INSERT INTO countries (capital, cities, id, name) VALUES($1, $2, $3, $4) RETURNING *`, [args.capital, args.cities, args.id, args.name]);
                    return countriesFromDB.rows[0];
                });
            },
        },
    },
});
// imported into server.js
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    types: [CountryType, CityType, BookType, BookShelfType],
});
