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
  }).returning();

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

  // First meal of the day! Create a new log.
  const newLog = await db.insert(dailyLogs).values({
    userId,
    date: today,
    aiMood: "Hype Man", // Starts positive every day!
    totalCaloriesLogged: 0,
  }).returning();

  return newLog[0];
}

// FIXED: Added proper return statement
export async function addFoodEntry(
  userId: number, 
  rawInput: string, 
  englishTranslation: string, 
  calories: number, 
  proteinGrams: number
) {
  try {
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
    
    // 4. Dynamic Vibe Logic
    let newMood = todayLog.aiMood;
    if (newTotal > 2500) { 
      newMood = "Strict Coach";
    }

    // 5. Update the daily log
    await db.update(dailyLogs)
      .set({ totalCaloriesLogged: newTotal, aiMood: newMood })
      .where(eq(dailyLogs.id, todayLog.id));

    // 6. Revalidate the page
    revalidatePath('/');
    
    // FIX: Return the values needed by the tool
    return { 
      newTotal, 
      newMood 
    };
    
  } catch (error) {
    console.error('Error in addFoodEntry:', error);
    throw error; // Re-throw so the tool can catch it
  }
}