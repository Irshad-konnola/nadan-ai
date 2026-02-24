import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// 1. Users Table: Tracks the user's fitness goals
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  targetCalories: integer("target_calories").notNull(),
  currentStreak: integer("current_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// 2. Daily Logs Table: Tracks the entire day's progress and the AI's current mood
export const dailyLogs = pgTable("daily_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(), // e.g., "2026-02-23"
  totalCaloriesLogged: integer("total_calories_logged").default(0),
  aiMood: text("ai_mood").default("Hype Man"), // Can change to "Strict Coach", etc.
});

// 3. Food Entries Table: The exact items eaten
export const foodEntries = pgTable("food_entries", {
  id: serial("id").primaryKey(),
  logId: integer("log_id").references(() => dailyLogs.id).notNull(),
  rawInput: text("raw_input").notNull(), // Saves the original "Njan 2 porotta kazhichu"
  englishTranslation: text("english_translation").notNull(), // What the AI understood
  calories: integer("calories").notNull(),
  proteinGrams: integer("protein_grams").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});