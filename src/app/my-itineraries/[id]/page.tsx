'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { SavedItinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit2, HomeIcon, PlaneIcon, BookmarkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter as DialogFooterComponent,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateDestinationImage } from '@/ai/flows/generate-destination-image';

export default function ItineraryDetailPage() {
    const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [newTripName, setNewTripName] = useState('');

    const generateAndSaveImage = useCallback(async (currentItinerary: SavedItinerary) => {
        if (!id) return;
        try {
            const { imageUrl } = await generateDestinationImage({ destination: currentItinerary.destination });
            if (imageUrl) {
                const updatedItinerary = { ...currentItinerary, imageUrl };
                
                setItinerary(updatedItinerary);

                const savedItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
                const updatedItineraries = savedItineraries.map(it => 
                    it.id === id ? updatedItinerary : it
                );
                localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
            }
        } catch (error) {
            console.error("Failed to generate destination image:", error);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            const savedItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
            const currentItinerary = savedItineraries.find(it => it.id === id);
            if (currentItinerary) {
                setItinerary(currentItinerary);
                setNewTripName(currentItinerary.tripName);
                if (!currentItinerary.imageUrl) {
                    generateAndSaveImage(currentItinerary);
                }
            } else {
                router.push('/my-itineraries');
            }
        }
    }, [id, router, generateAndSaveImage]);

    const handleRenameSubmit = () => {
        if (!itinerary || !newTripName.trim()) return;

        const savedItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
        const updatedItineraries = savedItineraries.map(it => 
            it.id === id ? { ...it, tripName: newTripName.trim() } : it
        );
        localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
        
        setItinerary(prev => prev ? { ...prev, tripName: newTripName.trim() } : null);
        
        setIsRenameDialogOpen(false);
    }

    if (!itinerary) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { tripName, destination, duration, dates, resumen, gastos, itinerario: dailyPlan, imageUrl } = itinerary;
    const city = destination.split(',')[0];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 border-b">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/my-itineraries')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 pb-8">
                <div className="relative h-56 md:h-72 rounded-lg overflow-hidden -mx-4 md:mx-0 mb-8 shadow-lg">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={`Imagen de ${city}`}
                            fill
                            className="object-cover"
                            data-ai-hint={`${city} landscape`}
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="text-center mb-8 -mt-24 md:-mt-28 relative z-10">
                     <div className="flex justify-center items-center gap-2 text-foreground">
                        <h1 className="text-3xl md:text-4xl font-headline font-bold">{tripName}</h1>
                        <Button variant="ghost" size="icon" onClick={() => setIsRenameDialogOpen(true)} className="text-foreground hover:bg-black/10">
                            <Edit2 className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-muted-foreground mt-1">{destination}</p>
                    <p className="text-muted-foreground">{duration}</p>
                    <p className="text-muted-foreground">{dates}</p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                    {resumen && (
                        <Card className="mb-8 bg-card border-border shadow-md">
                            <CardHeader>
                                <CardTitle className="text-center text-xl font-headline font-semibold">Tu Experiencia de Viaje</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-muted-foreground font-body">{resumen}</p>
                            </CardContent>
                        </Card>
                    )}

                    {gastos && (
                        <Card className="mb-8 bg-primary/10 border-primary/30 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl font-headline font-semibold">Gastos Estimados (USD)</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pt-0 pb-2">
                                <div className="space-y-2">
                                    {[
                                        { label: 'Transporte (p.p.)', value: gastos.transporte },
                                        { label: 'Alojamiento (total)', value: gastos.alojamiento },
                                        { label: 'Comida (diario p.p.)', value: gastos.comidaDiaria },
                                        { label: 'Actividades (total)', value: gastos.actividades },
                                    ].map(item => (
                                        item.value && (
                                            <div key={item.label} className="flex justify-between items-center text-sm font-body">
                                                <span className="text-muted-foreground">{item.label}</span>
                                                <span className="font-semibold">{item.value}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </CardContent>
                            {gastos.total && (
                                <CardFooter className="flex-col items-start px-6 pb-4 pt-0">
                                    <div className="w-full h-px bg-primary/30 my-2"></div>
                                    <div className="flex justify-between items-center w-full">
                                        <span className="text-lg font-bold">Total Estimado</span>
                                        <span className="text-lg font-bold">{gastos.total}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground text-center w-full mt-2">
                                        Los precios son referenciales y pueden variar.
                                    </p>
                                </CardFooter>
                            )}
                        </Card>
                    )}

                    <div className="space-y-6">
                        <h2 className="text-2xl font-headline font-bold text-center mb-4">Itinerario Detallado</h2>
                        {dailyPlan && dailyPlan.length > 0 ? (
                            dailyPlan.map((day, index) => (
                                <Card key={index} className="bg-primary/10 border-primary/30 shadow-lg overflow-hidden">
                                    <CardHeader className="bg-primary/20 p-4">
                                        <CardTitle className="text-lg font-headline font-semibold">Día {day.day}: {day.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 font-body space-y-4">
                                        <div>
                                            <h4 className="font-bold text-base">🗓️ Horario: {day.schedule}</h4>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">📍 Actividades</h4>
                                            <p className="text-muted-foreground mt-1 text-sm">{day.activities}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">🍽️ Sugerencias Gastronómicas</h4>
                                            <p className="text-muted-foreground mt-1 text-sm">{day.foodSuggestions}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">💡 Recomendaciones</h4>
                                            <p className="text-muted-foreground mt-1 text-sm">{day.companionRecommendations}</p>
                                        </div>
                                        {day.events && (
                                            <div>
                                                <h4 className="font-bold text-base">🎉 Eventos Especiales</h4>
                                                <p className="text-muted-foreground mt-1 text-sm">{day.events}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                             <Card className="bg-card border-border shadow-md">
                                <CardContent className="p-6">
                                    <p className="text-center text-muted-foreground font-body">
                                        No hay un plan de itinerario detallado disponible.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            
            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cambiar nombre del viaje</DialogTitle>
                        <DialogDescription>
                            Elige un nuevo nombre para tu viaje a {itinerary?.destination}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nombre
                            </Label>
                            <Input
                                id="name"
                                value={newTripName}
                                onChange={(e) => setNewTripName(e.target.value)}
                                className="col-span-3"
                                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                            />
                        </div>
                    </div>
                    <DialogFooterComponent>
                         <DialogClose asChild>
                           <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleRenameSubmit}>Guardar cambios</Button>
                    </DialogFooterComponent>
                </DialogContent>
            </Dialog>
            
            <footer className="sticky bottom-0 bg-primary/20 backdrop-blur-sm border-t mt-8">
                <div className="container mx-auto h-16 flex justify-around items-center text-gray-600">
                    <Link href="/" className="flex flex-col items-center gap-1">
                        <HomeIcon className="h-6 w-6" />
                    </Link>
                    <Link href="/" className="flex flex-col items-center p-3 bg-primary rounded-full text-primary-foreground -translate-y-6 shadow-lg border-4 border-background">
                        <PlaneIcon className="h-8 w-8" />
                    </Link>
                    <Link href="/my-itineraries" className="flex flex-col items-center gap-1 text-primary">
                        <BookmarkIcon className="h-6 w-6" />
                    </Link>
                </div>
            </footer>
        </div>
    );
}
