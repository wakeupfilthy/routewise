import { config } from 'dotenv';
config();

import '@/ai/flows/generate-itinerary.ts';
import '@/ai/flows/summarize-location-reviews.ts';
import '@/ai/flows/generate-destination-image.ts';
