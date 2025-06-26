'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
            <Plane className="h-6 w-6" />
            <span className="font-bold sm:inline-block">RouteWise</span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                    <Link href="/create-itinerary">Crear Viaje</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/my-itineraries">Mis Itinerarios</Link>
                </Button>
                <Button onClick={handleLogout}>Cerrar Sesión</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
