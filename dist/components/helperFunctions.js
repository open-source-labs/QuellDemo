export const querySamples = {
    '2depth': `query {
    artist(name: "Frank Ocean") {
      id
      name
      albums {
        id
        name
      }
    }
  }`,
    '3depth': `query {
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
    'mutation': `mutation {
    addCity(name: "San Diego", country: "United States") {
        id
        name
    }
}`,
    'countryMut': `mutation {
    addCountry(name: "Canada") {
        id
        name
    }
}`,
    'delete': `mutation {
    deleteCity(name: "San Diego") {
        id
        name
    }
}`
};
