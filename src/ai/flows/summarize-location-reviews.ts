// Summarizes location reviews using GenAI to provide a quick understanding of overall sentiment and key points.
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLocationReviewsInputSchema = z.object({
  locationName: z.string().describe('The name of the location.'),
  reviews: z.array(z.string()).describe('An array of user reviews for the location.'),
});
export type SummarizeLocationReviewsInput = z.infer<typeof SummarizeLocationReviewsInputSchema>;

const SummarizeLocationReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the user reviews.'),
});
export type SummarizeLocationReviewsOutput = z.infer<typeof SummarizeLocationReviewsOutputSchema>;

export async function summarizeLocationReviews(input: SummarizeLocationReviewsInput): Promise<SummarizeLocationReviewsOutput> {
  return summarizeLocationReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLocationReviewsPrompt',
  input: {schema: SummarizeLocationReviewsInputSchema},
  output: {schema: SummarizeLocationReviewsOutputSchema},
  prompt: `Summarize the following user reviews for {{locationName}}. Provide a concise summary of the overall sentiment and key points.\n\nReviews:\n{{#each reviews}}\n- {{{this}}}\n{{/each}}\n`,
});

const summarizeLocationReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeLocationReviewsFlow',
    inputSchema: SummarizeLocationReviewsInputSchema,
    outputSchema: SummarizeLocationReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
