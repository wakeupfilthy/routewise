'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ItineraryCard } from '@/components/itinerary-card';
import { Search } from 'lucide-react';
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
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function MyItinerariesPage() {
    const [itineraries, setItineraries] = useState<SavedItinerary[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [renamingItinerary, setRenamingItinerary] = useState<SavedItinerary | null>(null);
    const [newTripName, setNewTripName] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();

    const fetchItineraries = useCallback(async (uid: string) => {
        const q = query(collection(db, 'users', uid, 'itineraries'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedItineraries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Firestore timestamps need to be converted
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
            return {
                id: doc.id,
                ...data,
                createdAt,
            } as SavedItinerary;
        });
        setItineraries(fetchedItineraries);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchItineraries(currentUser.uid);
            } else {
                router.push('/login');
            }
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, [router, fetchItineraries]);

    const handleDelete = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'itineraries', id));
            setItineraries(prev => prev.filter(it => it.id !== id));
        } catch (error) {
            console.error("Error deleting itinerary: ", error);
        }
    }

    const handleRenameRequest = (itinerary: SavedItinerary) => {
        setRenamingItinerary(itinerary);
        setNewTripName(itinerary.tripName);
        setIsRenameDialogOpen(true);
    };

    const handleRenameSubmit = async () => {
        if (!renamingItinerary || !newTripName.trim() || !user) return;

        const docRef = doc(db, 'users', user.uid, 'itineraries', renamingItinerary.id);
        try {
            await updateDoc(docRef, { tripName: newTripName.trim() });
            setItineraries(prev => prev.map(it =>
                it.id === renamingItinerary.id ? { ...it, tripName: newTripName.trim() } : it
            ));
            setIsRenameDialogOpen(false);
            setRenamingItinerary(null);
            setNewTripName('');
        } catch (error) {
            console.error("Error renaming itinerary: ", error);
        }
    };

    const filteredItineraries = itineraries.filter(it => 
        it.tripName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (isAuthLoading) {
         return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold">Mis Itinerarios</h1>
                    <p className="text-md text-muted-foreground mt-2">Aquí encontrarás todos tus viajes guardados.</p>
                </header>

                <div className="relative mb-8 max-w-lg mx-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nombre o destino..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                        <div className="text-center py-12">
                            <div className="text-center py-12 text-muted-foreground bg-card border rounded-lg">
                                <h3 className="text-xl font-semibold text-foreground">No tienes viajes guardados</h3>
                                <p className="mt-2">¡Parece que todavía no has planificado ninguna aventura!</p>
                                <Button asChild variant="default" className="mt-4">
                                    <Link href="/create-itinerary">Crea tu primer itinerario</Link>
                                </Button>
                            </div>
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
        </div>
    )
}
