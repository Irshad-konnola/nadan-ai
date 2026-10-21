import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load local environment files (.env.local has priority over .env)
config({ path: '.env.local' });
config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});