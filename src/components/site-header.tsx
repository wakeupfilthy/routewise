'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plane } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

export function SiteHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/');
    setTimeout(() => window.location.reload(), 500);
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
