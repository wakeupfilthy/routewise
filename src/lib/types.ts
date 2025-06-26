import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';
import type { Timestamp } from 'firebase/firestore';

export interface SavedItinerary extends GenerateItineraryOutput {
    id: string; // The Firestore document ID
    createdAt: string; // Stored as an ISO string
    userId: string;
    imageUrl?: string;
}

export interface UserProfile {
    uid: string;
    username: string;
    email: string;
}
