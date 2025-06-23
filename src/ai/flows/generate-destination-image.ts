'use server';
/**
 * @fileOverview Generates an image for a travel destination.
 *
 * - generateDestinationImage - A function that generates an image for a destination.
 * - GenerateDestinationImageInput - The input type for the generateDestinationImage function.
 * - GenerateDestinationImageOutput - The return type for the generateDestinationImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDestinationImageInputSchema = z.object({
  destination: z.string().describe('The travel destination (e.g., "Paris, France").'),
});
export type GenerateDestinationImageInput = z.infer<typeof GenerateDestinationImageInputSchema>;

const GenerateDestinationImageOutputSchema = z.object({
    imageUrl: z.string().describe("The generated image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateDestinationImageOutput = z.infer<typeof GenerateDestinationImageOutputSchema>;

export async function generateDestinationImage(input: GenerateDestinationImageInput): Promise<GenerateDestinationImageOutput> {
  return generateDestinationImageFlow(input);
}

const generateDestinationImageFlow = ai.defineFlow(
  {
    name: 'generateDestinationImageFlow',
    inputSchema: GenerateDestinationImageInputSchema,
    outputSchema: GenerateDestinationImageOutputSchema,
  },
  async ({ destination }) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A beautiful, vibrant, high-quality photograph of a famous landmark or landscape in ${destination}. The image should be appealing for a travel website.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
        // Fallback to a placeholder if image generation fails
        return { imageUrl: 'https://placehold.co/600x400.png' };
    }

    return { imageUrl: media.url };
  }
);
