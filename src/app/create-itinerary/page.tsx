'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ItineraryForm } from '@/components/itinerary-form';
import { generateItinerary } from '@/ai/flows/generate-itinerary';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import type { UserProfile, SavedItinerary } from '@/lib/types';

export default function CreateItineraryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
    setIsAuthLoading(false);
  }, [router]);

  const handleGenerate = async (data: any) => {
    if (!user) {
      toast({ title: "Error", description: "Debes iniciar sesión para crear un itinerario.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        fechaSalida: format(data.fechaSalida, 'yyyy-MM-dd'),
        preferencias: data.preferencias.join(', '),
      };
      const result = await generateItinerary(formattedData);
      
      if (!result) {
        toast({
            title: "No se encontró itinerario",
            description: "No pudimos encontrar un itinerario para tus preferencias. Intenta ajustar tu búsqueda.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const newItinerary: SavedItinerary = {
        id: Date.now().toString(),
        userId: user.uid,
        createdAt: new Date().toISOString(),
        ...result,
      };

      const allItineraries = JSON.parse(localStorage.getItem('itineraries') || '[]');
      allItineraries.push(newItinerary);
      localStorage.setItem('itineraries', JSON.stringify(allItineraries));
      
      router.push(`/my-itineraries`);

    } catch (e) {
      let errorMessage = "No pudimos generar tu itinerario. Por favor, inténtalo de nuevo más tarde.";
      if (e instanceof Error && e.message) {
        if (e.message.includes('SAFETY')) {
            errorMessage = 'Tu solicitud fue bloqueada por filtros de seguridad. Intenta con una descripción menos específica o diferente.';
        } else if (e.message.includes('quota')) {
            errorMessage = 'Se ha alcanzado el límite de solicitudes. Por favor, inténtalo más tarde.';
        }
      }

      toast({
        title: "Ocurrió un error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error(e);
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isAuthLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <div className="container py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">
            Crear un nuevo viaje
          </h1>
          <p className="text-md mt-2 text-muted-foreground">
              Ingresa los detalles de tu viaje y recibe tu itinerario totalmente personalizado.
          </p>
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
    </div>
  );
}
