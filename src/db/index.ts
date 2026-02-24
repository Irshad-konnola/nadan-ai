import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This connects to the URL in your .env.local file
const sql = neon(process.env.DATABASE_URL!);

// We pass the schema so Drizzle provides perfect TypeScript autocomplete later
export const db = drizzle(sql, { schema });