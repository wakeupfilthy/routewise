'use client';
import { useState } from 'react';
import { ItineraryForm } from '@/components/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { generateItinerary, GenerateItineraryOutput } from '@/ai/flows/generate-itinerary';
import { HomeIcon, PlaneIcon, BookmarkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function Home() {
  const [itinerary, setItinerary] = useState<GenerateItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (data: any) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const formattedData = {
        ...data,
        fechaSalida: format(data.fechaSalida, 'yyyy-MM-dd'),
        preferencias: data.preferencias.join(', '),
      };
      const result = await generateItinerary(formattedData);
      if (!result || result.length === 0) {
        toast({
            title: "No se encontró itinerario",
            description: "No pudimos encontrar un itinerario para tus preferencias. Intenta ajustar tu búsqueda.",
            variant: "destructive",
        });
      }
      setItinerary(result);
    } catch (e) {
      toast({
        title: "Ocurrió un error",
        description: "No pudimos generar tu itinerario. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            PLANIFICA TU VIAJE
          </h1>
          <div className='mt-2 text-muted-foreground'>
            <p className="text-md">
              Ayúdanos a conocerte mejor
            </p>
            <p className="text-md">
              Ingresa los detalles de tu viaje y recibe tu itinerario totalmente personalizado
            </p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          <ItineraryForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="text-center mt-12">
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="font-body text-muted-foreground">Creando tu viaje perfecto...</p>
            </div>
          </div>
        )}

        {itinerary && itinerary.length > 0 && !isLoading && (
          <div className="mt-16">
            <ItineraryDisplay itinerary={itinerary} />
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-primary/20 backdrop-blur-sm border-t">
        <div className="container mx-auto h-16 flex justify-around items-center text-gray-600">
          <button className="flex flex-col items-center gap-1 text-primary">
            <HomeIcon className="h-6 w-6" />
          </button>
          <button className="flex flex-col items-center p-3 bg-primary rounded-full text-primary-foreground -translate-y-6 shadow-lg border-4 border-background">
            <PlaneIcon className="h-8 w-8" />
          </button>
          <button className="flex flex-col items-center gap-1">
            <BookmarkIcon className="h-6 w-6" />
          </button>
        </div>
      </footer>
    </div>
  );
}
