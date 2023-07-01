import { Request, Response, NextFunction } from "express";

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
  buildSchema,
  GraphQLError,
  GraphQLInt,
} from "graphql";

import Songs from "../models/songsModel";
import Artist from "../models/artistsModel";
import Album from "../models/albumsModel";
import Attractions from "../models/attractionsModel";
import Cities from "../models/citiesModel";
import Countries from "../models/countriesModel";

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

interface CityDocument extends Document {
  name: string;
  country: string;
}

interface CountryDocument extends Document {
  name: string;
}
let elapsedTime: ElapsedTime = {};

/////////////////////////////////////////////////////////////////

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve(parent: { name: string }, args: unknown ) {
        const startTime = new Date().getTime();
        return Album.find({ artist: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.albums = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.albums, "ms");
          return result;
        });
      },
    },
  }),
});

const AlbumType: GraphQLObjectType = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    artist: { type: GraphQLString },
    songs: {
      type: new GraphQLList(SongType),
      resolve(parent: { name: string }, args: unknown) {
        const startTime = new Date().getTime();
        return Songs.find({ album: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.songs = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.songs, "ms");
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
    artist: { type: GraphQLString },
    album: { type: GraphQLString },
  }),
});

/////////////////////////////////////////////////////////////////

//when is this being run?
const AttractionsType = new GraphQLObjectType({
  name: "Attractions",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    city: {
      type: GraphQLString,
      resolve(parent, args) {
        // Retrieve the city name directly
        return Cities.findOne({ name: parent.city })
          .then((city) => {
            const cityDoc = city as CityDocument | null;
            if (cityDoc) {
              return cityDoc.name; // Return the city name directly
            }
            return null;
          });
      },
    },
    country: {
      type: GraphQLString,
      async resolve(parent: { name: string; city: string }, args: unknown) {
        const startTime = new Date().getTime();
        const city = await Cities.findOne({ name: parent.city });
        const cityDoc = city as CityDocument | null;
        if (cityDoc && cityDoc.country) {
          const country = await Countries.findOne({ name: cityDoc.country });
          const endTime = new Date().getTime();
          elapsedTime.country = endTime - startTime;
          console.log("elapsedTime: ", elapsedTime.country, "ms");
          return country?.name; // Return the name property of the resolved country object
        }
        return null;
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
      async resolve(parent: { name: string }, args: unknown) {
        const startTime = new Date().getTime();
        const attractions = await Attractions.find({ city: parent.name });
        const endTime = new Date().getTime();
        elapsedTime.attractions = endTime - startTime;
        console.log("elapsedTime: ", elapsedTime.attractions, "ms");
        return attractions;
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
      async resolve(parent: { name: string }, args: unknown) {
        const startTime = new Date().getTime();
        return Cities.find({ country: parent.name }).then((result) => {
          const endTime = new Date().getTime();
          elapsedTime.cities = endTime - startTime;
          console.log("elapsedTime.cities: ", elapsedTime.cities, "ms");
          return result;
        });
      },
    },
  }),
});

/////////////////////////////////////////////////////////////////

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    song: {
      type: SongType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const song = await Songs.findOne({ name: args.name });
        return song;
      },
    },
    album: {
      type: AlbumType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const album = await Album.findOne({ name: args.name });
        return album;
      },
    },
    artist: {
      type: ArtistType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const artist = await Artist.findOne({ name: args.name });
        return artist;
      },
    },
    country: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        return await Countries.findOne({ name: args.name });
      },
    },
    city: {
      type: CityType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const city = await Cities.findOne({ name: args.name });
        return city;
      },
    },
    attractions: {
      type: AttractionsType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const attractions = await Attractions.findOne({ name: args.name });
        return attractions;
      },
    },
  },
});

/////////////////////////////////////////////////////////////////

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
      async resolve(parent: unknown, args: { name: string; album: string; artist: string }) {
        // Find the album by name
        const album = await Album.findOne({ name: args.album });
    
        // If the album doesn't exist or the album's artist doesn't match the provided artist, throw an error
        if (!album || album.artist !== args.artist) {
          throw new Error("Album not found or the album artist doesn't match the provided artist.");
        }
    
        // Create the song and associate it with the found album
        const song = await Songs.create({
          name: args.name,
          album: album.name,
          artist: args.artist,
        });
    
        return song;
      },
    }, 
    addArtist: {
      type: ArtistType,
      args: {
        name: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { name: string }) {
        const artist = await Artist.create({
          name: args.name,
        });
        return artist;
      },
    },
    addAlbum: {
      type: AlbumType,
      args: {
        name: { type: GraphQLString },
        artistName: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { name: string; artistName: string }) {
        // Find the artist by name
        let artist = await Artist.findOne({ name: args.artistName });
    
        // If the artist doesn't exist, create a new artist
        if (!artist) artist = await Artist.create({ name: args.artistName });
  
        // Create the album
        const album = await Album.create({
          name: args.name,
          artist: artist.name, // Store the artist's name in the album schema
        });
    
        return album;
      },
    },
    addAttraction: {
      type: AttractionsType,
      args: { name: { type: GraphQLString }, city: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string; city: string }) {
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
    addCountry: {
      type: CountryType,
      args: { name: { type: GraphQLString } },
      async resolve(parent: unknown, args: { name: string }) {
        const country = await Countries.create({ name: args.name });
        return country;
      },
    },
    addCity: {
      type: CityType,
      args: { name: { type: GraphQLString }, country: { type: GraphQLString } },
      async resolve(parent: unknown, args: { country: string; name: string }) {
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
    deleteArtist: {
      type: ArtistType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { id: number | string, name: string }) {
        const findArtist = await Artist.findOne({$or: [
          { _id: args.id },
          { name: args.name }
        ]});
        if (findArtist) {
          await Artist.deleteOne({$or: [
            { _id: args.id },
            { name: args.name }
          ]});
          return findArtist;
        }
      },
    },
    deleteAlbum: {
      type: AlbumType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { id: number | string, name: string }) {
        const findAlbum = await Album.findOne({$or: [
          { _id: args.id },
          { name: args.name }
        ]});
        if (findAlbum) {
          await Album.deleteOne({$or: [
            { _id: args.id },
            { name: args.name }
          ]});
          return findAlbum;
        }
      },
    },
    deleteCity: {
      type: CityType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { id: number | string, name: string }) {
        const findCity = await Cities.findOne({$or: [
          { _id: args.id },
          { name: args.name }
        ]});
        if (findCity) {
          await Cities.deleteOne({$or: [
            { _id: args.id },
            { name: args.name }
          ]});
          return findCity;
        }
      },
    },
    deleteCountry: {
      type: CountryType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { id: number | string, name: string }) {
        const findCountry = await Countries.findOne({$or: [
          { _id: args.id },
          { name: args.name }
        ]});
        if (findCountry) {
          await Countries.deleteOne({$or: [
            { _id: args.id },
            { name: args.name }
          ]});
        }
      },
    },
    updateAttraction: {
      type: AttractionsType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        city: { type: GraphQLString },
      },
      async resolve(parent: unknown, args: { id: string | number, name: string, city: string }) {
        const { id, name, city } = args;
        const checkCity = await Cities.findOne({$or: [
          { _id: args.id },
          { name: args.name }
        ]});
        if (!checkCity) {
          throw new Error("City not found");
        }
        const updatedAttraction = await Attractions.findOneAndUpdate(
          { _id: id },
          { $set: { name, city } },
          { new: true }
        );
        return updatedAttraction;
      },
    },
    editArtist: {
      type: ArtistType,
      args: {
        newName: { type: GraphQLString },
        oldName: { type: GraphQLString }
      },
      async resolve(parent: unknown, args: { oldName: string, newName: string }) {
        const { oldName, newName } = args;
        console.log('oldName: ', oldName)
        console.log('newName: ', newName)

        
        const updateArtist = await Artist.updateOne(
          { name: oldName },
          { name: newName },
        );

        const updatedArtist = await Artist.findOne(
          { name: newName },
        );
        console.log('updated artist: ', updatedArtist)
        return updatedArtist;
      },
    },
  },
});

/////////////////////////////////////////////////////////////////

interface ElapsedTimeResponse {
  locals: {
    time?: ElapsedTime;
  };
}

export const getElapsedTime = (
  req: Request,
  res: ElapsedTimeResponse,
  next: NextFunction
) => {
  console.log("elapsed time in mid: ", elapsedTime);

  res.locals.time = elapsedTime;
  console.log('res.locals.time', res.locals.time)
  return next();
};

export const clearElapsedTime = (req: Request, res: Response, next: NextFunction) => {
  elapsedTime = {};
  console.log(elapsedTime);
  return next();
};

export const mutationMap: Record<string, string[]> = {
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

export const graphqlSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutations,
  types: [ArtistType, AlbumType, SongType],
});
