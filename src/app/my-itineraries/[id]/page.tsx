'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { SavedItinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit2, HomeIcon, PlaneIcon, BookmarkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ItineraryDetailPage() {
    const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    useEffect(() => {
        if (id) {
            const savedItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
            const currentItinerary = savedItineraries.find(it => it.id === id);
            if (currentItinerary) {
                setItinerary(currentItinerary);
            } else {
                router.push('/my-itineraries');
            }
        }
    }, [id, router]);

    if (!itinerary) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { tripName, destination, duration, dates, summary, itinerary: dailyPlan } = itinerary;

    const summaryItems = [
      { label: 'Vuelos', value: summary.vuelos },
      { label: 'Alojamiento', value: summary.alojamiento },
      { label: 'Transporte Local', value: summary.transporteLocal },
      { label: 'Alimentación', value: summary.alimentacion },
      { label: 'Actividades y Entradas', value: summary.actividades },
      { label: 'Extras y Contingencia', value: summary.extras },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/my-itineraries')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2">
                        <h1 className="text-3xl md:text-4xl font-headline font-bold">{tripName}</h1>
                        <Button variant="ghost" size="icon">
                            <Edit2 className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-muted-foreground mt-1">Destino a {destination}</p>
                    <p className="text-muted-foreground">{duration}</p>
                    <p className="text-muted-foreground">{dates}</p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                    <Card className="mb-8 bg-primary/10 border-primary/30 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-center text-2xl font-headline font-semibold">Resumen de Costos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summaryItems.map(item => (
                                    <div key={item.label} className="flex justify-between items-center text-sm font-body">
                                        <span className="text-muted-foreground">{item.label}</span>
                                        <span className="font-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-primary/30 my-4"></div>
                            <div className="flex justify-between items-center font-bold text-lg font-body">
                                <span>TOTAL:</span>
                                <span>{summary.total}</span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Los precios son referenciales y pueden variar.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {dailyPlan.map((day, index) => (
                            <div key={index}>
                                <h2 className="text-xl font-headline font-bold mb-3">Día {day.day}</h2>
                                <Card className="bg-primary/10 border-primary/30 shadow-lg">
                                    <CardContent className="p-4 font-body">
                                        <p className="font-bold text-base">{day.time}: {day.title}</p>
                                        <p className="text-muted-foreground mt-2 text-sm">{day.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            
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
