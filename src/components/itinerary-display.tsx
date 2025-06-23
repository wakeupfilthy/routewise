'use client';

import { useState } from 'react';
import { GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { LocationDetailsDialog } from './location-details-dialog';
import { MapPin, Utensils, Mountain, Landmark, Sparkles, BookMarked } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type ItineraryItem = GenerateItineraryOutput[0];

const getIconForActivity = (activity: string) => {
  const lowerActivity = activity.toLowerCase();
  if (lowerActivity.includes('hike') || lowerActivity.includes('nature') || lowerActivity.includes('park')) return <Mountain className="h-5 w-5 text-accent" />;
  if (lowerActivity.includes('food') || lowerActivity.includes('eat') || lowerActivity.includes('restaurant') || lowerActivity.includes('tasting')) return <Utensils className="h-5 w-5 text-accent" />;
  if (lowerActivity.includes('museum') || lowerActivity.includes('history') || lowerActivity.includes('art') || lowerActivity.includes('sightsee')) return <Landmark className="h-5 w-5 text-accent" />;
  return <Sparkles className="h-5 w-5 text-accent" />;
};


export function ItineraryDisplay({ itinerary }: { itinerary: GenerateItineraryOutput }) {
  const [selectedLocation, setSelectedLocation] = useState<ItineraryItem | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem('savedItinerary', JSON.stringify(itinerary));
    toast({
        title: "Itinerary Saved!",
        description: "Your itinerary has been saved to this browser.",
    });
  }

  return (
    <div className="font-body max-w-4xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center">Your Personalized Itinerary</h2>
        <Button onClick={handleSave} variant="outline">
            <BookMarked className="mr-2 h-4 w-4" />
            Save Itinerary
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {itinerary.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="bg-card border border-border rounded-lg shadow-md transition-shadow hover:shadow-xl animate-in fade-in-0 slide-in-from-bottom-5 duration-500" style={{animationDelay: `${index * 100}ms`}}>
            <AccordionTrigger className="p-6 text-lg font-headline hover:no-underline text-left">
              <div className="flex items-center gap-4">
                {getIconForActivity(item.activity)}
                <span>Day {item.day}: {item.activity}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <p className="text-muted-foreground mb-4"><strong>Location:</strong> {item.location}</p>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <Button onClick={() => setSelectedLocation(item)}>
                <MapPin className="mr-2 h-4 w-4" />
                View Location Details
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {selectedLocation && (
        <LocationDetailsDialog
          location={selectedLocation}
          open={!!selectedLocation}
          onOpenChange={(isOpen) => !isOpen && setSelectedLocation(null)}
        />
      )}
    </div>
  );
}
