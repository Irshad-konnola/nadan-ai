import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load the .env.local variables
config({ path: '.env.local' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle", // Where migration files will be saved
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});