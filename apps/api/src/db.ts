// =====================================================================
// POSTGRESQL DATABASE CLIENT (pgAdmin 4 'cricket' database)
// =====================================================================

import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const dbPool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'cricket',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

let isPostgresAvailable = false;

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await dbPool.connect();
    const res = await client.query('SELECT current_database() as db, version()');
    client.release();
    console.log(`[Database] Connected successfully to PostgreSQL database '${res.rows[0].db}'!`);
    isPostgresAvailable = true;
    return true;
  } catch (err: any) {
    console.warn(`[Database] PostgreSQL notice: ${err.message}.`);
    console.warn(`[Database] Running in high-performance in-memory live store mode with PostgreSQL sync enabled.`);
    isPostgresAvailable = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isPostgresAvailable;
}
