'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Send } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { recomendarDestino, preferenciasItems, presupuestos, acompanantes } from '@/lib/destination-recommender';


const formSchema = z.object({
  recomendarDestino: z.boolean().optional(),
  destino: z.string().min(2, { message: 'Destino debe tener al menos 2 caracteres.' }),
  origen: z.string().min(2, { message: 'Origen debe tener al menos 2 caracteres.' }),
  duracion: z.string().min(1, { message: 'Duración es requerida.' }).regex(/^\d+$/, "Debe ser un número."),
  fechaSalida: z.date({ required_error: "Fecha de salida es requerida." }),
  presupuesto: z.string().min(1, { message: 'Presupuesto es requerido.' }),
  acompanantes: z.string().min(1, { message: 'Este campo es requerido.' }),
  preferencias: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Tienes que seleccionar al menos una preferencia.",
  }),
  otrasActividades: z.string().optional(),
});

type ItineraryFormProps = {
  onGenerate: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export function ItineraryForm({ onGenerate, isLoading }: ItineraryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recomendarDestino: false,
      destino: '',
      origen: '',
      duracion: '5',
      fechaSalida: undefined,
      presupuesto: 'Medio (700-1000 USD)',
      acompanantes: 'Solo',
      preferencias: ['naturaleza'],
      otrasActividades: '',
    },
  });

  const [isClient, setIsClient] = useState(false);

  const watchPreferencias = form.watch('preferencias');
  const watchPresupuesto = form.watch('presupuesto');
  const watchAcompanantes = form.watch('acompanantes');
  const watchRecomendar = form.watch('recomendarDestino');

  useEffect(() => {
      setIsClient(true);
      if (!form.getValues('fechaSalida')) {
          form.setValue('fechaSalida', new Date());
      }
  }, [form]);

  useEffect(() => {
    if (watchRecomendar) {
        const userProfile = {
            preferencias: watchPreferencias,
            presupuesto: watchPresupuesto,
            acompanantes: watchAcompanantes,
        };
        const recommendation = recomendarDestino(userProfile);
        if (recommendation) {
            form.setValue('destino', recommendation.nombre, { shouldValidate: true });
        }
    }
  }, [watchPreferencias, watchPresupuesto, watchAcompanantes, watchRecomendar, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values);
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 font-body">
            <h2 className="text-xl font-headline font-semibold">Detalles del viaje</h2>

            <FormField
                control={form.control}
                name="recomendarDestino"
                render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 bg-primary/10 rounded-md border border-primary/20">
                    <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="font-semibold text-primary-foreground">
                            Recomendar un destino
                        </FormLabel>
                        <FormDescription>
                            Deja que nuestra IA elija el destino perfecto para ti.
                        </FormDescription>
                    </div>
                </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino (ciudad)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. París, Francia" {...field} disabled={watchRecomendar} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Madrid, España" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duracion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración del viaje (Días)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaSalida"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Fecha de salida</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal bg-white",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value && isClient ? (
                                format(field.value, "dd/MM/yy")
                            ) : (
                                <span>DD/MM/YY</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="presupuesto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presupuesto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {presupuestos.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acompanantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Con quién viajas?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {acompanantes.map((a) => (
                             <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
                <h2 className="text-xl font-headline font-semibold">Preferencias</h2>
                <FormField
                    control={form.control}
                    name="preferencias"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">¿Qué tipo(s) de viaje prefieres?</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {preferenciasItems.map((item) => (
                            <FormField
                                key={item.id}
                                control={form.control}
                                name="preferencias"
                                render={({ field }) => {
                                return (
                                    <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            );
                                        }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                    </FormItem>
                                );
                                }}
                            />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <FormField
              control={form.control}
              name="otrasActividades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Hay alguna otra actividad que quieras hacer?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe otras actividades aquí..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 font-bold">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                  Sugiriendo...
                </>
              ) : (
                <>
                  Sugerir
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
    </div>
  );
}
