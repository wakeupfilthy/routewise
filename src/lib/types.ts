import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';

export interface SavedItinerary extends GenerateItineraryOutput {
    id: string; // The a unique id for the itinerary
    createdAt: string; // Stored as an ISO string
    userId: string;
    imageUrl?: string;
}

export interface UserProfile {
    uid: string;
    username: string;
    email: string;
}
