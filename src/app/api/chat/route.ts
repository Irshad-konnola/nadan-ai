import { streamText, tool,convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { addFoodEntry, getOrCreateUser } from '../../../actions/dbActions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// 1. Extract the schema so TypeScript can perfectly infer the types
const logFoodSchema = z.object({
  rawInput: z.string().describe('The exact string the user typed (e.g., Njan 2 porotta kazhichu)'),
  englishTranslation: z.string().describe('The English translation of the food'),
  calories: z.number().describe('Total estimated calories'),
  proteinGrams: z.number().describe('Total estimated protein in grams'),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // For testing purposes, we hardcode a user. 
  // Later, this will be replaced by the currently logged-in user from Clerk/NextAuth.
  const user = await getOrCreateUser("Tester", 2000);

  const result = streamText({
    model: google('gemini-2.5-flash'),
messages: await convertToModelMessages(messages),
    system: `You are NutriVibe, an AI nutritionist for people in Kerala. 
    You understand English, Malayalam, and Manglish. 
    If a user tells you what they ate, estimate the calories and protein, and you MUST use the 'logFood' tool to save it.
    Keep your responses conversational, fun, and culturally relevant.`,
    
    tools: {
      logFood: tool({
        description: 'Log a food entry to the database with nutritional estimates.',
        parameters: z.object({
          rawInput: z.string().describe('The exact string the user typed (e.g., Njan 2 porotta kazhichu)'),
          englishTranslation: z.string().describe('The English translation of the food'),
          calories: z.number().describe('Total estimated calories'),
          proteinGrams: z.number().describe('Total estimated protein in grams'),
        }),
        
        // FIX: Force TypeScript to ignore the Zod v4 version mismatch here
        // @ts-expect-error: AI SDK type mismatch with Zod v4
        execute: async ({ rawInput, englishTranslation, calories, proteinGrams }) => {
          
          const dbResult = await addFoodEntry(
            user.id, 
            rawInput, 
            englishTranslation, 
            calories, 
            proteinGrams
          );
          
          return {
            success: true,
            message: `Successfully logged. New daily total is ${dbResult.newTotal} calories. The new AI mood is ${dbResult.newMood}.`
          };
        },
      }),
    },
    // maxSteps is removed because SDK v6 handles the agent loop automatically
  });

  // 2. The new method name for SDK v6
  return result.toUIMessageStreamResponse();
}