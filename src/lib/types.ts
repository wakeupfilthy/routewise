import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';

export interface SavedItinerary extends GenerateItineraryOutput {
    id: string;
    createdAt: string;
    imageUrl?: string;
}

export interface User {
    username: string;
    email: string;
    password: string; // In a real app, this would be a hash.
}
