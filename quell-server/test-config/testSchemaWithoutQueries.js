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
    name: 'BookShelf',
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
            }
        }
    })
});
const BookType = new graphql_1.GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        author: { type: graphql_1.GraphQLString },
        shelf_id: { type: graphql_1.GraphQLString }
    })
});
const CountryType = new graphql_1.GraphQLObjectType({
    name: 'Country',
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
            }
        }
    })
});
const CityType = new graphql_1.GraphQLObjectType({
    name: 'City',
    fields: () => ({
        country_id: { type: graphql_1.GraphQLString },
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        population: { type: graphql_1.GraphQLInt }
    })
});
// ADD LANGUAGES TYPE HERE
// ================== //
// ===== MUTATIONS ==== //
// ================== //
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        // add book
        addBook: {
            type: BookType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                author: { type: graphql_1.GraphQLString },
                shelf_id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const author = args.author || '';
                    const newBook = yield booksModel_1.default.query(`INSERT INTO books (name, author, shelf_id) VALUES ($1, $2, $3) RETURNING *`, [args.name, author, Number(args.shelf_id)]);
                    return newBook.rows[0];
                });
            }
        },
        // change book
        changeBook: {
            type: BookType,
            args: {
                id: { type: graphql_1.GraphQLID },
                author: { type: graphql_1.GraphQLString }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const updatedBook = yield booksModel_1.default.query(`UPDATE books SET author = $2 WHERE id = $1 RETURNING *`, [args.id, args.author]);
                    return updatedBook.rows[0];
                });
            }
        },
        // ADD SHELF
        addBookShelf: {
            type: BookShelfType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const newBookShelf = yield booksModel_1.default.query(`INSERT INTO bookShelves (name) VALUES ($1) RETURNING *`, [args.name]);
                    return newBookShelf.rows[0];
                });
            }
        },
        // ADD COUNTRY
        addCountry: {
            type: CountryType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const country = yield countriesModel_1.default.create({ name: args.name });
                    return country;
                });
            }
        },
        deleteCity: {
            type: CityType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const findCity = yield countriesModel_1.default.findOne({ name: args.name });
                    if (findCity) {
                        yield countriesModel_1.default.deleteOne({ name: args.name });
                    }
                });
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({
    mutation: RootMutation,
    types: [CountryType, CityType, BookType, BookShelfType]
});
