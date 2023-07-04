"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySamples = void 0;
exports.querySamples = {
    '2depthArtist': `query {
        artist(name: "Frank Ocean") {
            id
            name
            albums {
                id
                name
            }
        }
    }`,
    '2depthAlbum': `query {
        album(name: "Channel Orange") {
            id
            name
            artist
            songs {
                id
                name
            }
        }
    }`,
    '2depthSong': `query {
        song(name: "Forrest Gump") {
            id
            name
            artist
            album
        }
    }`,
    '2depthCity': `query {
        city(name: "New York") {
            id
            name
            country
            attractions{
                id
                name
            }
        }
    }`,
    '2depthCountry': `query {
        country(name: "Japan") {
            id
            name
            cities {
                id
                name
            }
        }
    }`,
    '2depthAttraction': `query {
        attractions(name: "Golden Gate Bridges") {
            id
            name
            city
        }
    }`,
    '3depthCountry': `query {
        country(name: "United States") {
            id
            name
            cities {
                id
                name
                attractions {
                    id
                    name
                }
            }
        }
    }`,
    '3depthArtist': `query {
        artist(name: "Frank Ocean") {
            id
            name
            albums {
                id
                name
                songs {
                    id
                    name
                }
            }
        }
        }`,
    'costly': `query {
        attractions(name: "Statue of Liberty") {
            id
            name
        }
        country(name: "Japan") {
            id
            name
            cities {
                id
                name
                attractions {
                    id
                    name
                }
            }
        }
        city(name: "Seattle") {
            id
            name
            attractions {
                id
                name
                country {
                    id
                    name
                    cities {
                        id
                        name
                    }
                }
            }
        }
    }`,
    'nested': `query {
    country(name: "United States") {
        id
        name
        cities {
            id
            name
            attractions {
                id
                name
                city
                country {
                    id
                    cities
                    {
                        id
                        name
                        attractions {
                            id
                            city {
                                id
                                country {
                                    id
                                    name
                                    cities {
                                        id
                                        name
                                        country {
                                            id
                                            name
                                            cities {
                                                id
                                                name
                                                attractions {
                                                    id
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                }
            }
        }
    }`,
    'fragment': `query {
        artist(name: "Frank Ocean") {
            id
            albums {
                ...getalbums
            }
        }
    }
    
    fragment getalbums on Album {
        id
        name
    }`,
    'mutationAddCity': `mutation {
        addCity(name: "San Diego", country: "United States") {
            id
            name
        }
    }`,
    'mutationAddCountry': `mutation {
        addCountry(name: "Canada") {
            id
            name
        }
    }`,
    'mutationAddArtist': `mutation {
        addArtist(name: "Billie Eilish") {
            id
            name
        }
    }`,
    'mutationAddAlbum': `mutation {
        addAlbum(name: "Ocean Eyes", artistName: "Billie Eilish") {
            id
            name
            artist
            songs {
                id
                name
            }
        }
    }`,
    'mutationAddSong': `mutation {
        addSong(name: "Forrest Gump", album: "Channel Orange", artist: "Frank Ocean") {
            id
            name
            artist {
                name
                id
            }
            album {
                name
                id
            }
        }
    }`,
    'mutationDeleteCity': `mutation {
        deleteCity(name: "San Diego") {
            id
            name
        }
    }`,
    'mutationDeleteArtist': `mutation {
        deleteArtist(name: "Billie Eyelash") {
            id
            name
        }
    }`,
    'mutationDeleteAlbum': `mutation {
        deleteAlbum(name: "Ocean Ayes") {
            id
            name
            artist
        }
    }`,
    'mutationEditArtist': `mutation {
        editArtist(newName: "Billie Eyelash", oldName: "Billie Eilish") {
            id
            name
        }
    }`,
};
