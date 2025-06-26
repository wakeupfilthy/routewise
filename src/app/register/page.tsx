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
    username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
    email: z.string().email({ message: 'Por favor, ingresa un correo electrónico válido.' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export default function RegisterPage() {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some((user: any) => user.email === values.email);

        if (userExists) {
            toast({
                title: "Error de registro",
                description: "Un usuario con este correo electrónico ya existe.",
                variant: "destructive",
            });
            return;
        }

        const newUser = {
            uid: Date.now().toString(),
            ...values,
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        toast({
            title: "¡Registro exitoso!",
            description: "Ahora puedes iniciar sesión.",
        });
        router.push('/login');
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Crear una cuenta</CardTitle>
                    <CardDescription>Ingresa tus datos para registrarte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de usuario</FormLabel>
                                    <FormControl>
                                    <Input placeholder="Tu nombre de usuario" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
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
                            <Button type="submit" className="w-full">Registrarse</Button>
                        </form>
                    </Form>
                     <div className="mt-4 text-center text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/login" className="underline">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
