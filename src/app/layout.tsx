import type {Metadata} from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'Tripmate',
  description: 'Tu compañero de viaje con IA.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tripmate',
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
      <body className={cn("font-body antialiased", montserrat.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
