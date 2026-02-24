'use server';

import { db } from '../db';
import { users, dailyLogs, foodEntries } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getOrCreateUser(name: string, targetCalories: number) {
  // Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.name, name)).limit(1);
  
  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // If not, create them
  const newUser = await db.insert(users).values({
    name,
    targetCalories,
  }).returning(); // .returning() asks Postgres to send back the created row

  return newUser[0];
}

export async function getOrCreateTodayLog(userId: number) {
  // Get today's date as a string (e.g., "2026-02-23")
  const today = new Date().toISOString().split('T')[0];

  // Look for a log matching the user AND today's date
  const log = await db.select()
    .from(dailyLogs)
    .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, today)))
    .limit(1);

  if (log.length > 0) {
    return log[0];
  }

  // for dynamic vibe
  // First meal of the day! Create a new log.
  const newLog = await db.insert(dailyLogs).values({
    userId,
    date: today,
    aiMood: "Hype Man", // Starts positive every day!
    totalCaloriesLogged: 0,
  }).returning();

  return newLog[0];
}

//addfood
export async function addFoodEntry(
  userId: number, 
  rawInput: string, 
  englishTranslation: string, 
  calories: number, 
  proteinGrams: number
) {
  // 1. Ensure we have a log for today
  const todayLog = await getOrCreateTodayLog(userId);

  // 2. Insert the specific food item
  await db.insert(foodEntries).values({
    logId: todayLog.id,
    rawInput,
    englishTranslation,
    calories,
    proteinGrams,
  });

  // 3. Update the total calories for the day
  const newTotal = (todayLog.totalCaloriesLogged || 0) + calories;
  
  // 4. (Optional) Basic Dynamic Vibe Logic Check
  // If they eat way too much, change the AI mood to "Strict Coach"
  let newMood = todayLog.aiMood;
  if (newTotal > 2500) { 
    newMood = "Strict Coach";
  }

  await db.update(dailyLogs)
    .set({ totalCaloriesLogged: newTotal, aiMood: newMood })
    .where(eq(dailyLogs.id, todayLog.id));

  // 5. Tell Next.js to instantly update the UI without refreshing the page
  revalidatePath('/');
  
  return { success: true, newTotal, newMood };
}