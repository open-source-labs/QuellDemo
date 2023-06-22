import { Pool, QueryResult } from 'pg';
require('dotenv').config();

const URI = process.env.PG_URI;

const pool = new Pool({
  connectionString: URI
});
type ParamsType = number | string;
module.exports = {
  query: (text: string, params: ParamsType[]): Promise<QueryResult> => {
    return pool.query(text, params);
  }
};