'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { summarizeLocationReviews, SummarizeLocationReviewsOutput } from '@/ai/flows/summarize-location-reviews';
import type { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';
import { Skeleton } from '@/components/ui/skeleton';

type LocationDetailsDialogProps = {
  location: GenerateItineraryOutput[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Mock reviews for demonstration purposes
const mockReviews = [
  "Absolutely breathtaking! A must-see for anyone visiting the area.",
  "It was a bit crowded, but the views were worth it. Plan to go early.",
  "An unforgettable experience. The guides were knowledgeable and friendly.",
  "Decent place, but I think it's a bit overrated. There are better spots nearby.",
  "I loved every moment of it. The atmosphere is just magical. Highly recommend!",
];

export function LocationDetailsDialog({ location, open, onOpenChange }: LocationDetailsDialogProps) {
  const [summary, setSummary] = useState<SummarizeLocationReviewsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setSummary(null);
      
      const timer = setTimeout(() => {
        summarizeLocationReviews({
          locationName: location.location,
          reviews: mockReviews,
        })
        .then(setSummary)
        .catch(console.error)
        .finally(() => setIsLoading(false));
      }, 500); // Simulate network delay

      return () => clearTimeout(timer);
    }
  }, [open, location]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] font-body">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{location.activity}</DialogTitle>
          <DialogDescription>in {location.location}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="font-bold mb-2 font-headline text-primary">Description</h3>
            <p className="text-muted-foreground">{location.description}</p>
          </div>
          <div>
             <h3 className="font-bold mb-2 font-headline text-primary">AI Review Summary</h3>
            {isLoading && (
              <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[200px]" />
              </div>
            )}
            {summary && <p className="text-muted-foreground italic p-3 bg-secondary/50 rounded-md">"{summary.summary}"</p>}
          </div>
          <div>
            <h3 className="font-bold mb-2 font-headline text-primary">Sample Reviews</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {mockReviews.map((review, i) => (
                  <div key={i} className="text-sm p-3 bg-secondary/50 rounded-md">{review}</div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
