'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((user: any) => user.email === values.email && user.password === values.password);

        if (foundUser) {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            // Dispatch a storage event to notify other tabs/components
            window.dispatchEvent(new Event("storage"));
            toast({
                title: "¡Bienvenido de nuevo!",
            });
            router.push('/create-itinerary');
        } else {
            toast({
                title: "Error de inicio de sesión",
                description: "Correo electrónico o contraseña incorrectos.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Iniciar Sesión</CardTitle>
                    <CardDescription>Ingresa a tu cuenta para ver tus viajes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                    <Input placeholder="tu@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">Iniciar Sesión</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        ¿No tienes una cuenta?{" "}
                        <Link href="/register" className="underline">
                            Regístrate
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
