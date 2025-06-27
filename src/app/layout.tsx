import type {Metadata} from 'next'; 
import { Playfair_Display, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['700']
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'RouteWise',
  description: 'Tu compañero de viaje con IA.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RouteWise',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.png',
    shortcut: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-body antialiased", ptSans.variable, playfair.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
