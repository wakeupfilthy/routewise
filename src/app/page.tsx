import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Plane, PenSquare, Compass } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="container grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-gray-800">
            Tu viaje soñado, a un clic de distancia.
          </h1>
          <p className="text-lg text-muted-foreground">
            Con RouteWise, planificar tu próxima aventura es más fácil que nunca. Ingresa tus preferencias y deja que nuestra IA cree el itinerario perfecto para ti.
          </p>
          <Button size="lg" asChild className="text-lg py-6 px-8">
            <Link href="/register">Comenzar ahora</Link>
          </Button>
        </div>
        <div className="relative h-80 lg:h-[450px] rounded-lg overflow-hidden shadow-2xl group">
           <Image 
                src="https://placehold.co/600x400.png"
                alt="Collage de imágenes de viajes mostrando un mapa, una maleta y un pasaporte"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="travel collage"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </section>
      
      <section className="bg-muted py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline">¿Cómo funciona?</h2>
            <p className="text-muted-foreground mt-2">Tres simples pasos para tu próxima gran aventura.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                        <PenSquare className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl mt-4">1. Dinos tus gustos</CardTitle>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Completa un simple formulario con tu destino, presupuesto y qué te gusta hacer.</p>
              </CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                        <Compass className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl mt-4">2. Genera tu itinerario</CardTitle>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Nuestra IA analiza tus respuestas para crear un plan de viaje personalizado día por día.</p>
              </CardContent>
            </Card>
             <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
                        <Plane className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl mt-4">3. Guarda y viaja</CardTitle>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Guarda tus itinerarios favoritos, accede a ellos cuando quieras y ¡prepárate para la aventura!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
