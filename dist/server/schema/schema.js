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
exports.graphqlSchema = exports.mutationMap = exports.clearElapsedTime = exports.getElapsedTime = void 0;
const graphql_1 = require("graphql");
const songsModel_1 = __importDefault(require("../models/songsModel"));
const artistsModel_1 = __importDefault(require("../models/artistsModel"));
const albumsModel_1 = __importDefault(require("../models/albumsModel"));
const attractionsModel_1 = __importDefault(require("../models/attractionsModel"));
const citiesModel_1 = __importDefault(require("../models/citiesModel"));
const countriesModel_1 = __importDefault(require("../models/countriesModel"));
let elapsedTime = {};
/////////////////////////////////////////////////////////////////
const ArtistType = new graphql_1.GraphQLObjectType({
    name: "Artist",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        albums: {
            type: new graphql_1.GraphQLList(AlbumType),
            resolve(parent, args) {
                const startTime = new Date().getTime();
                return albumsModel_1.default.find({ artist: parent.name }).then((result) => {
                    const endTime = new Date().getTime();
                    elapsedTime.albums = endTime - startTime;
                    console.log("elapsedTime: ", elapsedTime.albums, "ms");
                    return result;
                });
            },
        },
    }),
});
const AlbumType = new graphql_1.GraphQLObjectType({
    name: "Album",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        artist: { type: graphql_1.GraphQLString },
        songs: {
            type: new graphql_1.GraphQLList(SongType),
            resolve(parent, args) {
                const startTime = new Date().getTime();
                return songsModel_1.default.find({ album: parent.name }).then((result) => {
                    const endTime = new Date().getTime();
                    elapsedTime.songs = endTime - startTime;
                    console.log("elapsedTime: ", elapsedTime.songs, "ms");
                    return result;
                });
            },
        },
    }),
});
const SongType = new graphql_1.GraphQLObjectType({
    name: "Song",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        artist: { type: graphql_1.GraphQLString },
        album: { type: graphql_1.GraphQLString },
    }),
});
/////////////////////////////////////////////////////////////////
const AttractionsType = new graphql_1.GraphQLObjectType({
    name: "Attractions",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        city: {
            type: graphql_1.GraphQLString,
            resolve(parent, args) {
                // Retrieve the city name directly
                return citiesModel_1.default.findOne({ name: parent.city })
                    .then((city) => {
                    const cityDoc = city;
                    if (cityDoc) {
                        return cityDoc.name; // Return the city name directly
                    }
                    return null;
                });
            },
        },
        country: {
            type: graphql_1.GraphQLString,
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const startTime = new Date().getTime();
                    const city = yield citiesModel_1.default.findOne({ name: parent.city });
                    const cityDoc = city;
                    if (cityDoc && cityDoc.country) {
                        const country = yield countriesModel_1.default.findOne({ name: cityDoc.country });
                        const endTime = new Date().getTime();
                        elapsedTime.country = endTime - startTime;
                        console.log("elapsedTime: ", elapsedTime.country, "ms");
                        return country === null || country === void 0 ? void 0 : country.name; // Return the name property of the resolved country object
                    }
                    return null;
                });
            },
        },
    }),
});
const CityType = new graphql_1.GraphQLObjectType({
    name: "City",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        attractions: {
            type: new graphql_1.GraphQLList(AttractionsType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const startTime = new Date().getTime();
                    const attractions = yield attractionsModel_1.default.find({ city: parent.name });
                    const endTime = new Date().getTime();
                    elapsedTime.attractions = endTime - startTime;
                    console.log("elapsedTime: ", elapsedTime.attractions, "ms");
                    return attractions;
                });
            },
        },
    }),
});
const CountryType = new graphql_1.GraphQLObjectType({
    name: "Country",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        cities: {
            type: new graphql_1.GraphQLList(CityType),
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const startTime = new Date().getTime();
                    return citiesModel_1.default.find({ country: parent.name }).then((result) => {
                        const endTime = new Date().getTime();
                        elapsedTime.cities = endTime - startTime;
                        console.log("elapsedTime.cities: ", elapsedTime.cities, "ms");
                        return result;
                    });
                });
            },
        },
    }),
});
/////////////////////////////////////////////////////////////////
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        song: {
            type: SongType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const song = yield songsModel_1.default.findOne({ name: args.name });
                    return song;
                });
            },
        },
        album: {
            type: AlbumType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const album = yield albumsModel_1.default.findOne({ name: args.name });
                    return album;
                });
            },
        },
        artist: {
            type: ArtistType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const artist = yield artistsModel_1.default.findOne({ name: args.name });
                    return artist;
                });
            },
        },
        country: {
            type: CountryType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield countriesModel_1.default.findOne({ name: args.name });
                });
            },
        },
        city: {
            type: CityType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const city = yield citiesModel_1.default.findOne({ name: args.name });
                    return city;
                });
            },
        },
        attractions: {
            type: AttractionsType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const attractions = yield attractionsModel_1.default.findOne({ name: args.name });
                    return attractions;
                });
            },
        },
    },
});
/////////////////////////////////////////////////////////////////
const RootMutations = new graphql_1.GraphQLObjectType({
    name: "RootMutationsType",
    fields: {
        addSong: {
            type: SongType,
            args: {
                name: { type: graphql_1.GraphQLString },
                album: { type: graphql_1.GraphQLString },
                artist: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Find the album by name
                    const album = yield albumsModel_1.default.findOne({ name: args.album });
                    // If the album doesn't exist or the album's artist doesn't match the provided artist, throw an error
                    if (!album || album.artist !== args.artist) {
                        throw new Error("Album not found or the album artist doesn't match the provided artist.");
                    }
                    // Create the song and associate it with the found album
                    const song = yield songsModel_1.default.create({
                        name: args.name,
                        album: album.name,
                        artist: args.artist,
                    });
                    return song;
                });
            },
        },
        addArtist: {
            type: ArtistType,
            args: {
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const artist = yield artistsModel_1.default.create({
                        name: args.name,
                    });
                    return artist;
                });
            },
        },
        addAlbum: {
            type: AlbumType,
            args: {
                name: { type: graphql_1.GraphQLString },
                artistName: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    // Find the artist by name
                    let artist = yield artistsModel_1.default.findOne({ name: args.artistName });
                    // If the artist doesn't exist, create a new artist
                    if (!artist)
                        artist = yield artistsModel_1.default.create({ name: args.artistName });
                    // Create the album
                    const album = yield albumsModel_1.default.create({
                        name: args.name,
                        artist: artist.name, // Store the artist's name in the album schema
                    });
                    return album;
                });
            },
        },
        addAttraction: {
            type: AttractionsType,
            args: { name: { type: graphql_1.GraphQLString }, city: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const checkCity = yield citiesModel_1.default.findOne({ name: args.city });
                    if (checkCity) {
                        const newAttraction = yield attractionsModel_1.default.create({
                            name: args.name,
                            city: args.city,
                        });
                        return newAttraction;
                    }
                    else {
                        const error = new Error(`City not found in database, add city and country first.`);
                        error.code = "COST_LIMIT_EXCEEDED";
                        error.http = { status: 406 };
                        throw error;
                    }
                });
            },
        },
        addCountry: {
            type: CountryType,
            args: { name: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const country = yield countriesModel_1.default.create({ name: args.name });
                    return country;
                });
            },
        },
        addCity: {
            type: CityType,
            args: { name: { type: graphql_1.GraphQLString }, country: { type: graphql_1.GraphQLString } },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const checkCountry = yield countriesModel_1.default.findOne({ name: args.country });
                    if (checkCountry) {
                        const newCity = yield citiesModel_1.default.create({
                            name: args.name,
                            country: args.country,
                        });
                        return newCity;
                    }
                });
            },
        },
        deleteArtist: {
            type: ArtistType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const findArtist = yield artistsModel_1.default.findOne({ $or: [
                            { _id: args.id },
                            { name: args.name }
                        ] });
                    if (findArtist) {
                        yield artistsModel_1.default.deleteOne({ $or: [
                                { _id: args.id },
                                { name: args.name }
                            ] });
                        return findArtist;
                    }
                });
            },
        },
        deleteAlbum: {
            type: AlbumType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const findAlbum = yield albumsModel_1.default.findOne({ $or: [
                            { _id: args.id },
                            { name: args.name }
                        ] });
                    if (findAlbum) {
                        yield albumsModel_1.default.deleteOne({ $or: [
                                { _id: args.id },
                                { name: args.name }
                            ] });
                        return findAlbum;
                    }
                });
            },
        },
        deleteCity: {
            type: CityType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const findCity = yield citiesModel_1.default.findOne({ $or: [
                            { _id: args.id },
                            { name: args.name }
                        ] });
                    if (findCity) {
                        yield citiesModel_1.default.deleteOne({ $or: [
                                { _id: args.id },
                                { name: args.name }
                            ] });
                        return findCity;
                    }
                });
            },
        },
        deleteCountry: {
            type: CountryType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const findCountry = yield countriesModel_1.default.findOne({ $or: [
                            { _id: args.id },
                            { name: args.name }
                        ] });
                    if (findCountry) {
                        yield countriesModel_1.default.deleteOne({ $or: [
                                { _id: args.id },
                                { name: args.name }
                            ] });
                    }
                });
            },
        },
        updateAttraction: {
            type: AttractionsType,
            args: {
                id: { type: graphql_1.GraphQLID },
                name: { type: graphql_1.GraphQLString },
                city: { type: graphql_1.GraphQLString },
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { id, name, city } = args;
                    const checkCity = yield citiesModel_1.default.findOne({ $or: [
                            { _id: args.id },
                            { name: args.name }
                        ] });
                    if (!checkCity) {
                        throw new Error("City not found");
                    }
                    const updatedAttraction = yield attractionsModel_1.default.findOneAndUpdate({ _id: id }, { $set: { name, city } }, { new: true });
                    return updatedAttraction;
                });
            },
        },
        editArtist: {
            type: ArtistType,
            args: {
                newName: { type: graphql_1.GraphQLString },
                oldName: { type: graphql_1.GraphQLString }
            },
            resolve(parent, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { oldName, newName } = args;
                    const updateArtist = yield artistsModel_1.default.updateOne({ name: oldName }, { name: newName });
                    const updatedArtist = yield artistsModel_1.default.findOne({ name: newName });
                    return updatedArtist;
                });
            },
        },
    },
});
const getElapsedTime = (req, res, next) => {
    res.locals.time = elapsedTime;
    return next();
};
exports.getElapsedTime = getElapsedTime;
const clearElapsedTime = (req, res, next) => {
    elapsedTime = {};
    return next();
};
exports.clearElapsedTime = clearElapsedTime;
exports.mutationMap = {
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
};
exports.graphqlSchema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutations,
    types: [ArtistType, AlbumType, SongType],
});
