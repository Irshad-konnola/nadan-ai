import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is missing. Please define it in your .env.local file (refer to .env.example).'
  );
}

const sql = neon(databaseUrl);

// We pass the schema so Drizzle provides perfect TypeScript autocomplete
export const db = drizzle(sql, { schema });