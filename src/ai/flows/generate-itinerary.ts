// src/ai/flows/generate-itinerary.ts
'use server';

/**
 * @fileOverview A personalized itinerary generation AI agent.
 *
 * - generateItinerary - A function that handles the itinerary generation process.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  travelStyle: z.string().describe('The preferred travel style (e.g., adventurous, relaxing, cultural).'),
  budget: z.string().describe('The budget for the trip (e.g., low, medium, high).'),
  interests: z.string().describe('A comma-separated list of interests (e.g., history, food, nature).'),
  activities: z.string().describe('A comma-separated list of desired activities (e.g., hiking, sightseeing, museum visits).'),
  location: z.string().describe('The desired location for the itinerary.'),
  duration: z.string().describe('The duration of the trip in days.'),
  timeOfYear: z.string().describe('The time of year for the trip (e.g., summer, winter, specific month).'),
});

export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const ItineraryItemSchema = z.object({
  day: z.number().describe('The day number in the itinerary.'),
  location: z.string().describe('The location for the day.'),
  activity: z.string().describe('The activity for the day.'),
  description: z.string().describe('A detailed description of the location and activity.'),
});

const GenerateItineraryOutputSchema = z.array(ItineraryItemSchema).describe('A ranked list of itinerary suggestions based on alignment with user preferences.');

export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel agent specializing in creating personalized itineraries.

You will use the following information to generate a detailed itinerary for the user, including locations, activities, and descriptions.  Take into consideration seasonal events to create the optimal route, and return an itinerary ranked by best alignment with user preferences.

Travel Style: {{{travelStyle}}}
Budget: {{{budget}}}
Interests: {{{interests}}}
Activities: {{{activities}}}
Location: {{{location}}}
Duration: {{{duration}}} days
Time of Year: {{{timeOfYear}}}

Itinerary:
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
