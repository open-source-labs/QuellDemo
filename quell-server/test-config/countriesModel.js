"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URI = process.env.PG_URI;
const pool = new pg_1.Pool({
    connectionString: URI
});
exports.default = {
    query: (text, params) => {
        return pool.query(text, params);
    },
    // Below are placeholders, need to research more into the Pool methods
    create: (text, params) => {
        return pool.query(text.name, params);
    },
    findOne: (text, params) => {
        return pool.query(text.name, params);
    },
    deleteOne: (text, params) => {
        return pool.query(text.name, params);
    }
};
