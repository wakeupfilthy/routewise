'use client';
 
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { SavedItinerary, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit, Edit2, Save, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

export default function ItineraryDetailPage() {
    const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
    const [editableItinerary, setEditableItinerary] = useState<SavedItinerary | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [newTripName, setNewTripName] = useState('');

    const updateLocalStorageItinerary = (itineraryToSave: SavedItinerary) => {
        const allItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('itineraries') || '[]');
        const index = allItineraries.findIndex(it => it.id === itineraryToSave.id);
        if (index !== -1) {
            const { imageUrl, ...restOfItinerary } = itineraryToSave;
            allItineraries[index] = restOfItinerary;
            try {
                localStorage.setItem('itineraries', JSON.stringify(allItineraries));
            } catch (error) {
                console.error("Failed to save to localStorage:", error);
            }
        }
    };

    const generateAndSaveImage = useCallback(async (currentItinerary: SavedItinerary) => {
        if (!id || !user) return;
        try {
            const { imageUrl } = await generateDestinationImage({ destination: currentItinerary.destination });
            if (imageUrl) {
                const updatedItinerary = { ...currentItinerary, imageUrl };
                setItinerary(updatedItinerary);
            }
        } catch (error) {
            console.error("Failed to generate destination image:", error);
        }
    }, [id, user]);

    useEffect(() => {
        const userJson = localStorage.getItem('currentUser');
        if (userJson) {
            setUser(JSON.parse(userJson));
        } else {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (user && id) {
            const allItineraries: SavedItinerary[] = JSON.parse(localStorage.getItem('itineraries') || '[]');
            const currentItinerary = allItineraries.find(it => it.id === id && it.userId === user.uid);

            if (currentItinerary) {
                setItinerary(currentItinerary);
                setEditableItinerary(JSON.parse(JSON.stringify(currentItinerary))); // deep copy
                setNewTripName(currentItinerary.tripName);
                if (!currentItinerary.imageUrl) {
                    generateAndSaveImage(currentItinerary);
                }
            } else {
                router.push('/my-itineraries');
            }
        }
    }, [id, router, user, generateAndSaveImage]);
    
    useEffect(() => {
        if (itinerary && !isEditing) {
            setEditableItinerary(JSON.parse(JSON.stringify(itinerary)));
        }
    }, [isEditing, itinerary]);

    const handleRenameSubmit = async () => {
        if (!itinerary || !newTripName.trim() || !user) return;
        
        const updatedItinerary = { ...itinerary, tripName: newTripName.trim() };
        setItinerary(updatedItinerary);
        updateLocalStorageItinerary(updatedItinerary);
        
        setIsRenameDialogOpen(false);
    }
    
    const handleSaveEdits = () => {
        if (!editableItinerary) return;
        setItinerary(editableItinerary);
        updateLocalStorageItinerary(editableItinerary);
        setIsEditing(false);
    };

    const handleFieldChange = (field: keyof SavedItinerary, value: string) => {
        if (editableItinerary) {
            setEditableItinerary({ ...editableItinerary, [field]: value });
        }
    };

    const handleDailyPlanChange = (index: number, field: keyof SavedItinerary['itinerario'][number], value: string) => {
        if (editableItinerary) {
            const newDailyPlan = [...editableItinerary.itinerario];
            const currentDay = newDailyPlan[index];
            if (currentDay) {
                (currentDay as any)[field] = value;
                setEditableItinerary({ ...editableItinerary, itinerario: newDailyPlan });
            }
        }
    };

    if (!itinerary || !editableItinerary) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { tripName, destination, duration, dates, gastos, imageUrl } = itinerary;
    const { resumen, itinerario: dailyPlan } = isEditing ? editableItinerary : itinerary;
    const city = destination.split(',')[0];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-20 border-b">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
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
                     <div className="flex justify-center items-center gap-2 text-white drop-shadow-md">
                        <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">{tripName}</h1>
                        {user && (
                            <Button variant="ghost" size="icon" onClick={() => setIsRenameDialogOpen(true)} className="text-white hover:bg-black/20">
                                <Edit2 className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                     <div className="text-foreground mt-1">
                        <p>{destination}</p>
                        <p>{duration}</p>
                        <p>{dates}</p>
                    </div>
                </div>
                
                <div className="max-w-3xl mx-auto">
                    {resumen && (
                        <Card className="mb-8 bg-card border-border shadow-md">
                            <CardHeader>
                                <CardTitle className="text-center text-xl font-headline font-semibold">Tu Experiencia de Viaje</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea
                                        value={editableItinerary.resumen}
                                        onChange={(e) => handleFieldChange('resumen', e.target.value)}
                                        className="w-full min-h-[100px] text-sm"
                                    />
                                ) : (
                                    <p className="text-center text-muted-foreground font-body">{resumen}</p>
                                )}
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
                                            {isEditing ? (
                                                <Textarea
                                                    value={editableItinerary.itinerario[index].activities}
                                                    onChange={(e) => handleDailyPlanChange(index, 'activities', e.target.value)}
                                                    className="mt-1 text-sm w-full"
                                                />
                                            ) : (
                                                <p className="text-muted-foreground mt-1 text-sm">{day.activities}</p>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">🍽️ Sugerencias Gastronómicas</h4>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editableItinerary.itinerario[index].foodSuggestions}
                                                    onChange={(e) => handleDailyPlanChange(index, 'foodSuggestions', e.target.value)}
                                                    className="mt-1 text-sm w-full"
                                                />
                                            ) : (
                                                <p className="text-muted-foreground mt-1 text-sm">{day.foodSuggestions}</p>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">💡 Recomendaciones</h4>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editableItinerary.itinerario[index].companionRecommendations}
                                                    onChange={(e) => handleDailyPlanChange(index, 'companionRecommendations', e.target.value)}
                                                    className="mt-1 text-sm w-full"
                                                />
                                            ) : (
                                                <p className="text-muted-foreground mt-1 text-sm">{day.companionRecommendations}</p>
                                            )}
                                        </div>
                                        {day.events && (
                                            <div>
                                                <h4 className="font-bold text-base">🎉 Eventos Especiales</h4>
                                                {isEditing ? (
                                                    <Textarea
                                                        value={editableItinerary.itinerario[index].events || ''}
                                                        onChange={(e) => handleDailyPlanChange(index, 'events', e.target.value)}
                                                        className="mt-1 text-sm w-full"
                                                    />
                                                ) : (
                                                    <p className="text-muted-foreground mt-1 text-sm">{day.events}</p>
                                                )}
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
                    <div className="mt-8 flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveEdits}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar Cambios
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar Itinerario
                            </Button>
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
        </div>
    );
}
