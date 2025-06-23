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
  "¡Absolutamente impresionante! Una visita obligada para cualquiera que visite la zona.",
  "Estaba un poco lleno, pero las vistas valieron la pena. Planea ir temprano.",
  "Una experiencia inolvidable. Los guías eran conocedores y amables.",
  "Lugar decente, pero creo que está un poco sobrevalorado. Hay mejores lugares cerca.",
  "Me encantó cada momento. El ambiente es simplemente mágico. ¡Muy recomendable!",
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
          <DialogDescription>en {location.location}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="font-bold mb-2 font-headline text-primary-foreground">Descripción</h3>
            <p className="text-muted-foreground">{location.description}</p>
          </div>
          <div>
             <h3 className="font-bold mb-2 font-headline text-primary-foreground">Resumen de Reseñas (IA)</h3>
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
            <h3 className="font-bold mb-2 font-headline text-primary-foreground">Reseñas de Ejemplo</h3>
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
