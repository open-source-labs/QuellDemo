#! /usr/bin/env node
"use strict";
console.log("Inside clear-cache");
fetch('localhost:3000/clearCache')
    .then(res => console.log("CLEARED CACHE", res));
