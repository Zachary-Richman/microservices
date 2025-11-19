/* import postgres from "postgres"

loadEnvFile(`${__dirname}/.env`);

const connectionString = process.env.DATABASE_URL
console.log(connectionString);
if (!connectionString) throw new Error("DATABASE_URL is not set");
const sql = postgres(connectionString)

export default sql
*/
import { loadEnvFile } from 'node:process';
//loadEnvFile();


import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qdwxaipraskonmhnurva.supabase.co'
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY
if (!supabaseKey) throw new Error('Supabase key is not set');
const supabase = createClient(supabaseUrl, process.env.SUPABASE_PRIVATE_KEY ? process.env.SUPABASE_PRIVATE_KEY : "");
export default supabase;