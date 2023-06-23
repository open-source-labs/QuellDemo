import { NextFunction } from "express";
import { GraphQLEnumType, GraphQLObjectType } from "graphql";

import {
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  buildSchema,
  GraphQLError,
  GraphQLInt,
} from "graphql";
import Songs from "../models/songsModel.js";
import Artist from "../models/artistsModel.js";
import Album from "../models/albumsModel.js";
import Attractions from "../models/attractionsModel.js";
import Cities from "../models/citiesModel.js";
import Countries from "../models/countriesModel.js";

//TYPE DEFS
//THIS IS JUST ALL MOCK DATA AND MOCK TYPES
//ALTERNATIVELY IN THE RESOLVER CHOOSE THE DB OF YOUR LIKING
//WE USED MONGODB FOR TESTING PURPOSES BUT PSQL MAYBE BETTER!
interface ElapsedTime {
  albums?: number;
  songs?: number;
  country?: number;
  attractions?: number;
  cities?: number;
}

interface CustomError extends Error {
  code: string;
  http: { status: number };
}

let elapsedTime: ElapsedTime = {};

const ArtistType: GraphQLObjectType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      // a resolver function is responsible for return data for a specific field
      // this is where we can grab the specific timing for the field
      resolve(parent: { name: string }, args: any) {
        const startTime = new Date().getTime();
        return Album.find({ artist: parent.name }).then((result) => {
          // console.log(result);
          const endTime = new Date().getTime();
          elapsedTime.albums = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.albums, "ms");
          return result;
        });
      },
    },
  }),
});

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parent: { name: string }, args: any) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Songs.find({ album: parentName }).then((result: any) => {
          const endTime = new Date().getTime();
          elapsedTime.songs = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.songs, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});
//when is this being run?
const AttractionsType = new GraphQLObjectType({
  name: "Attractions",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    city: { type: GraphQLString },
    country: {
      type: CountryType,
      resolve(parent: { name: string; city: string }, args: any) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Cities.findOne({ city: parent.city })
          .then((city) => Countries.findOne({ country: city?.country }))
          .then((result) => {
            const endTime = new Date().getTime();
            elapsedTime.country = endTime - startTime;
            console.log("elapsedTime: ", elapsedTime.country, "ms");
            // console.log(result);
            return result;
          });
      },
    },
  }),
});

const CityType: GraphQLObjectType = new GraphQLObjectType({
  name: "City",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    country: { type: GraphQLString },
    attractions: {
      type: new GraphQLList(AttractionsType),
      resolve(parent: { name: string }, args: any) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Attractions.find({ city: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.attractions = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.attractions, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const CountryType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cities: {
      type: new GraphQLList(CityType),
      async resolve(parent: { name: string }, args: any) {
        const startTime = new Date().getTime();
        const parentName = parent.name;
        return Cities.find({ country: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.cities = endTime - startTime;
          console.log("elapsedTime.cities: ", elapsedTime.cities, "ms");
          // console.log(result);
          return result;
        });
      },
    },
  }),
});

const SongType = new GraphQLObjectType({
  name: "Song",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: ArtistType },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    song: {
      type: SongType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const song = Songs.findOne({ name: args.name });
        return song;
      },
    },
    album: {
      type: AlbumType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const album = Album.findOne({ name: args.name });
        return album;
      },
    },
    artist: {
      type: ArtistType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const artist = await Artist.findOne({ name: args.name });
        return artist;
      },
    },
    country: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const country = await Countries.findOne({ name: args.name });
        return country;
      },
    },
    city: {
      type: CityType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const city = await Cities.findOne({ name: args.name });
        return city;
      },
    },
    attractions: {
      type: AttractionsType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const attractions = await Attractions.findOne({ name: args.name });
        return attractions;
      },
    },
  },
});

const RootMutations = new GraphQLObjectType({
  name: "RootMutationsType",
  fields: {
    addSong: {
      type: SongType,
      args: {
        name: { type: GraphQLString },
        album: { type: GraphQLString },
        artist: { type: GraphQLString },
      },
      async resolve(
        parent: any,
        args: { name: string; album: string; artist: string }
      ) {
        const song = await Songs.create({
          name: args.name,
          album: args.album,
          artist: args.artist,
        });
        return song;
      },
    },

    addAttraction: {
      type: AttractionsType,
      args: { name: { type: GraphQLString }, city: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string; city: string }) {
        const checkCity = await Cities.findOne({ name: args.city });
        if (checkCity) {
          const newAttraction = await Attractions.create({
            name: args.name,
            city: args.city,
          });
          return newAttraction;
        } else {
          const error: CustomError = new Error(
            `City not found in database, add city and country first.`
          ) as CustomError;
          error.code = "COST_LIMIT_EXCEEDED";
          error.http = { status: 406 };

          throw error;
        }
      },
    },
    addCity: {
      type: CityType,
      args: { name: { type: GraphQLString }, country: { type: GraphQLString } },
      async resolve(parent: any, args: { country: string; name: string }) {
        const checkCountry = await Countries.findOne({ name: args.country });
        if (checkCountry) {
          const newCity = await Cities.create({
            name: args.name,
            country: args.country,
          });
          return newCity;
        }
      },
    },
    editCity: {
      type: CityType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      async resolve(
        parent: any,
        args: { id: string | number; name: string; country: string }
      ) {
        const { id, name, country } = args;
        const checkCountry = await Countries.findOne({ name: country });
        if (!checkCountry) {
          throw new Error("Country not found");
        }
        const updatedCity = await Cities.findOneAndUpdate(
          { _id: id },
          { $set: { name, country } },
          { new: true }
        );
        return updatedCity;
      },
    },
    // editCity: {
    //   type: CityType,
    //   args: { id: { type: GraphQLID }, name: { type: GraphQLString }, country: { type: GraphQLString } },
    //   async resolve(parent, args) {
    //     const updatedCity = await Cities.findByIdAndUpdate(
    //       args.id,
    //       { name: args.name, country: args.country },
    //       { new: true }
    //     );

    //     return updatedCity;
    //   },
    deleteCity: {
      type: CityType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent: any, args: { id: number | string }) {
        // console.log({ args });
        // console.log({ parent });
        const findCity = await Cities.findOne({ _id: args.id });
        // console.log({ findCity });
        if (findCity) {
          await Cities.deleteOne({ _id: args.id });
        }
      },
    },
    addCountry: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: any, args: { name: string }) {
        const country = await Countries.create({ name: args.name });
        return country;
      },
    },
  },
});

interface ElapsedTimeResponse {
  locals: {
    time?: ElapsedTime;
  };
}

const getElapsedTime = (
  req: Request,
  res: ElapsedTimeResponse,
  next: NextFunction
) => {
  console.log("elapsed time in mid: ", elapsedTime);

  res.locals.time = elapsedTime;
  return next();
};

const clearElapsedTime = (req: Request, res: Response, next: NextFunction) => {
  elapsedTime = {};
  console.log(elapsedTime);
  return next();
};

const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType],
});

module.exports = {
  clearElapsedTime,
  getElapsedTime,
  graphqlSchema,
};
