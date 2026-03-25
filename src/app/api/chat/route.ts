import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { addFoodEntry, getOrCreateUser } from '../../../actions/dbActions';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the type for the tool parameters
type LogFoodParams = {
  rawInput: string;
  englishTranslation: string;
  calories: number;
  proteinGrams: number;
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  // For testing purposes, we hardcode a user. 
  // Later, this will be replaced by the currently logged-in user from Clerk/NextAuth.
  const user = await getOrCreateUser("Tester", 2000);

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: messages,
    system: `You are NutriVibe, an AI nutritionist for people in Kerala. 
    You understand English, Malayalam, and Manglish. 
    If a user tells you what they ate, estimate the calories and protein, and you MUST use the 'logFood' tool to save it.
    Keep your responses conversational, fun, and culturally relevant.
    
    IMPORTANT: When you use the logFood tool, you MUST provide ALL these fields:
    - rawInput: The exact text the user said
    - englishTranslation: English translation of what they ate
    - calories: Estimated calories (number)
    - proteinGrams: Estimated protein (number)`,
    
    tools: {
      logFood: tool({
        description: 'Log a food entry to the database with nutritional estimates.',
        parameters: z.object({
          rawInput: z.string().describe('The exact string the user typed (e.g., Njan 2 porotta kazhichu)'),
          englishTranslation: z.string().describe('The English translation of the food'),
          calories: z.number().describe('Total estimated calories'),
          proteinGrams: z.number().describe('Total estimated protein in grams'),
        }),
        
        // @ts-expect-error - Tool type mismatch with SDK version
        execute: async ({ rawInput, englishTranslation, calories, proteinGrams }: LogFoodParams) => {
          try {
            console.log('📝 Attempting to log food:', { 
              userId: user.id,
              rawInput, 
              englishTranslation, 
              calories, 
              proteinGrams 
            });
            
            const dbResult = await addFoodEntry(
              user.id, 
              rawInput, 
              englishTranslation, 
              calories, 
              proteinGrams
            );
            
            console.log('✅ Food logged successfully:', dbResult);
            
            return {
              success: true,
              message: `Successfully logged! New daily total: ${dbResult.newTotal} calories. AI mood: ${dbResult.newMood}`
            };
          } catch (error) {
            console.error('❌ Error logging food:', error);
            // Safely handle unknown error type
            const errorMessage = error && typeof error === 'object' && 'message' in error 
              ? String(error.message) 
              : 'Unknown error occurred';
            
            return {
              success: false,
              message: `Failed to log food: ${errorMessage}`
            };
          }
        },
      }),
    },
  });

  // Use toTextStreamResponse() for this SDK version
return result.toTextStreamResponse();
}