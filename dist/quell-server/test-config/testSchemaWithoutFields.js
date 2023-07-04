"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlNodeModule = process.env.NODE_ENV === 'development'
    ? '../../../quell-server/node_modules/graphql'
    : 'graphql';
const graphql_1 = require("graphql");
// =========================== //
// ===== TYPE DEFINITIONS ==== //
// =========================== //
/*
  Generally corresponds with table we're pulling from
*/
const BookShelfType = new graphql_1.GraphQLObjectType({
    name: 'BookShelf',
    fields: () => ({})
});
const BookType = new graphql_1.GraphQLObjectType({
    name: 'Book',
    fields: () => ({})
});
const CountryType = new graphql_1.GraphQLObjectType({
    name: 'Country',
    fields: () => ({})
});
const CityType = new graphql_1.GraphQLObjectType({
    name: 'City',
    fields: () => ({})
});
// ADD LANGUAGES TYPE HERE
// ================== //
// ===== QUERIES ==== //
// ================== //
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {}
});
// ================== //
// ===== MUTATIONS ==== //
// ================== //
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'RootMutationType',
    fields: {}
});
// imported into server.js
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
    types: [CountryType, CityType, BookType, BookShelfType]
});
