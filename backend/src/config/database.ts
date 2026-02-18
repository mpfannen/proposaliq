import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  // SSL configuration for cloud databases (Supabase, etc.)
  ssl: process.env.DB_HOST?.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : false,
  // Connection timeout and retry settings
  connectionTimeoutMillis: 10000,
  query_timeout: 10000,
  // Force IPv4 resolution
  options: '-c search_path=public',
});

pool.on('error', (err: Error) => {
  console.error('Database connection error:', err.message);
});

export default pool;
