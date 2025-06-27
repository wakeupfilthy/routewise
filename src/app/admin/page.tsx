'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type StoredUser = UserProfile & { password?: string };

export default function AdminPage() {
    const [users, setUsers] = useState<StoredUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const currentUserJson = localStorage.getItem('currentUser');
        if (!currentUserJson) {
            router.push('/login');
            return;
        }

        const currentUser = JSON.parse(currentUserJson);
        if (!currentUser.isAdmin) {
            router.push('/');
            return;
        }

        const allUsersJson = localStorage.getItem('users');
        if (allUsersJson) {
            setUsers(JSON.parse(allUsersJson));
        }
        setIsLoading(false);
    }, [router]);

    const handleDeleteUser = (uid: string) => {
        // Remove user
        const updatedUsers = users.filter(user => user.uid !== uid);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Remove user's itineraries
        const allItineraries = JSON.parse(localStorage.getItem('itineraries') || '[]');
        const updatedItineraries = allItineraries.filter((itinerary: any) => itinerary.userId !== uid);
        localStorage.setItem('itineraries', JSON.stringify(updatedItineraries));

        toast({
            title: "Usuario eliminado",
            description: "El usuario y sus itinerarios han sido eliminados.",
        });
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Panel de Administración</CardTitle>
                    <CardDescription>Gestionar usuarios registrados en la aplicación.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre de usuario</TableHead>
                                <TableHead>Correo electrónico</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta del usuario y todos sus datos asociados.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteUser(user.uid)}>
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
