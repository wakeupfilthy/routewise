import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';

export interface SavedItinerary extends GenerateItineraryOutput {
    id: string;
    createdAt: string;
    imageUrl?: string;
}
