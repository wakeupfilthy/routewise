'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { ItineraryCard } from '@/components/itinerary-card';
import { HomeIcon, PlaneIcon, BookmarkIcon, Search, MoreHorizontal } from 'lucide-react';
import type { SavedItinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function MyItinerariesPage() {
    const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false)
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [renamingItinerary, setRenamingItinerary] = useState<SavedItinerary | null>(null);
    const [newTripName, setNewTripName] = useState('');

    useEffect(() => {
        setIsClient(true)
        const saved = JSON.parse(localStorage.getItem('savedItineraries') || '[]');
        setItineraries(saved.sort((a: SavedItinerary, b: SavedItinerary) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, []);

    const handleDelete = (id: string) => {
        const updatedItineraries = itineraries.filter(it => it.id !== id);
        setItineraries(updatedItineraries);
        localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
    }

    const handleRenameRequest = (itinerary: SavedItinerary) => {
        setRenamingItinerary(itinerary);
        setNewTripName(itinerary.tripName);
        setIsRenameDialogOpen(true);
    };

    const handleRenameSubmit = () => {
        if (!renamingItinerary || !newTripName.trim()) return;

        const updatedItineraries = itineraries.map(it =>
            it.id === renamingItinerary.id ? { ...it, tripName: newTripName.trim() } : it
        );
        setItineraries(updatedItineraries);
        localStorage.setItem('savedItineraries', JSON.stringify(updatedItineraries));
        
        setIsRenameDialogOpen(false);
        setRenamingItinerary(null);
        setNewTripName('');
    };

    const filteredItineraries = itineraries.filter(it => 
        it.tripName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!isClient) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
            <main className="flex-grow container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold">MIS ITINERARIOS</h1>
                    <div className='mt-2 text-muted-foreground'>
                        <p className="text-md">Descubre tu siguiente destino</p>
                        <p className="text-md">Aquí encontrarás los detalles del viaje de tus sueños para que vivas la mejor experiencia</p>
                    </div>
                </header>

                <div className="relative mb-8 max-w-lg mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2">
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {filteredItineraries.length > 0 ? (
                        filteredItineraries.map(itinerary => (
                            <ItineraryCard 
                                key={itinerary.id} 
                                itinerary={itinerary} 
                                onDelete={handleDelete}
                                onRenameRequest={handleRenameRequest}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No tienes viajes guardados.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/">¡Crea tu primer itinerario!</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cambiar nombre del viaje</DialogTitle>
                        <DialogDescription>
                            Elige un nuevo nombre para tu viaje a {renamingItinerary?.destination}.
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
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleRenameSubmit}>Guardar cambios</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <footer className="fixed bottom-0 left-0 right-0 bg-primary/20 backdrop-blur-sm border-t">
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
    )
}
