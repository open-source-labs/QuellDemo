import { Pool, QueryResult } from 'pg';

import dotenv from 'dotenv'
dotenv.config()
console.log(Pool)
const URI = process.env.PG_URI_BOOKS;

const pool = new Pool({
  connectionString: URI
});
type ParamsType = number | string;
export default {
  query: (text: string, params?: ParamsType[]): Promise<QueryResult> => {
    return pool.query(text, params);
  }
};