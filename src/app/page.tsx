'use client';
import { useState } from 'react';
import { ItineraryForm } from '@/components/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { generateItinerary, GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';
import { Compass } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [itinerary, setItinerary] = useState<GenerateItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (data: any) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateItinerary(data);
      if (!result || result.length === 0) {
        toast({
            title: "No Itinerary Found",
            description: "We couldn't find an itinerary for your preferences. Try adjusting your search.",
            variant: "destructive",
        });
      }
      setItinerary(result);
    } catch (e) {
      toast({
        title: "An error occurred",
        description: "We couldn't generate your itinerary. Please try again later.",
        variant: "destructive"
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-4">
            <Compass className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary">
              RouteWise
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Your personal travel assistant. Tell us your preferences, and we'll craft the perfect journey for you.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ItineraryForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="text-center mt-12">
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="font-body text-muted-foreground">Crafting your perfect trip...</p>
            </div>
          </div>
        )}

        {itinerary && itinerary.length > 0 && !isLoading && (
          <div className="mt-16">
            <ItineraryDisplay itinerary={itinerary} />
          </div>
        )}
      </main>
    </div>
  );
}
