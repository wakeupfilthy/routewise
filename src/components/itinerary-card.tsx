'use client';

import type { SavedItinerary } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ItineraryCardProps {
    itinerary: SavedItinerary;
    onDelete: (id: string) => void;
}

export function ItineraryCard({ itinerary, onDelete }: ItineraryCardProps) {
    const { id, tripName, destination, duration, dates, createdAt } = itinerary;
    const city = destination.split(',')[0];

    const formattedCreationDate = format(parseISO(createdAt), "dd/MM/yy", { locale: es });

    return (
        <Card className="max-w-lg mx-auto overflow-hidden bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link href={`/my-itineraries/${id}`} className="block">
                <div className="relative h-40">
                    <Image
                        src={`https://placehold.co/600x400.png`}
                        data-ai-hint={`${city} landscape`}
                        alt={`Imagen de ${city}`}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-headline text-2xl font-bold">{tripName}</h3>
                    </div>
                </div>
            </Link>
            <CardContent className="p-4 relative">
                <div className="absolute top-2 right-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>Cambiar nombre</DropdownMenuItem>
                            <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive">
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="font-body text-sm text-muted-foreground space-y-1">
                    <p>{city}</p>
                    <p>{duration}</p>
                    <p>{dates}</p>
                    <p>Creado el {formattedCreationDate}</p>
                </div>
            </CardContent>
        </Card>
    );
}
