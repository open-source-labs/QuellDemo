import { graphql, GraphQLSchema } from 'graphql';
import { graphqlSchema } from '../schema/schema'; // Adjust the import path accordingly
import mongoose from 'mongoose';

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

  test('Fetches artist with GraphQL', async () => {
    // Mock implementation for Artist.findOne
    Artist.findOne.mockResolvedValue({ name: 'Coldplay' });

    // Mock implementation for Album.find
    Album.find.mockResolvedValue([ // Add this block
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

    const result = await graphql({
      schema: graphqlSchema as GraphQLSchema,
      source: query,
      rootValue: {}, // rootValue or any other necessary context
    });

    if (result.errors) {
      console.error(result.errors);
    }
    // Check if no errors
    expect(result.errors).toBeUndefined();

    // Type checking and assertions
    const data = result.data as { artist: { name: string; albums: { name: string }[] } };
    expect(data.artist.name).toBe('Coldplay');
    expect(data.artist.albums).toHaveLength(2);
    expect(data.artist.albums[0].name).toBe('Parachutes');
    expect(data.artist.albums[1].name).toBe('A Rush of Blood to the Head');
  });
  
    // Test case for fetching a city
    test('Fetches city with GraphQL', async () => {
      City.findOne.mockResolvedValue({ name: 'Paris', country: 'France' });
  
      const query = `
        {
          city(name: "Paris") {
            name
            country
          }
        }
      `;
  
      const result = await graphql({
        schema: graphqlSchema as GraphQLSchema,
        source: query,
        rootValue: {},
      });
  
      if (result.errors) {
        console.error(result.errors);
      }
  
      expect(result.errors).toBeUndefined();
  
      const data = result.data as { city: { name: string; country: string } };
      expect(data.city.name).toBe('Paris');
      expect(data.city.country).toBe('France');
    });
});
