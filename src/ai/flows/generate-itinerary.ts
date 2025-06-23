// src/ai/flows/generate-itinerary.ts
'use server';

/**
 * @fileOverview A personalized itinerary generation AI agent.
 *
 * - generateItinerary - A function that handles the itinerary generation process.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  destino: z.string().describe('La ciudad de destino del viaje.'),
  origen: z.string().describe('La ciudad de origen del viaje.'),
  duracion: z.string().describe('La duración del viaje en días.'),
  fechaSalida: z.string().describe('La fecha de salida del viaje.'),
  presupuesto: z.string().describe('El presupuesto para el viaje (e.g., Bajo, Medio, Alto).'),
  acompanantes: z.string().describe('Con quién viaja el usuario (e.g., Solo, En Pareja, etc.).'),
  preferencias: z.string().describe('Una lista de preferencias de viaje separada por comas (e.g., culturales, naturaleza, gastronomía).'),
  otrasActividades: z.string().optional().describe('Otras actividades de interés para el usuario.'),
});

export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const ItineraryItemSchema = z.object({
  day: z.number().describe('El número del día en el itinerario.'),
  location: z.string().describe('La ubicación para el día.'),
  activity: z.string().describe('La actividad para el día.'),
  description: z.string().describe('Una descripción detallada de la ubicación y la actividad.'),
});

const GenerateItineraryOutputSchema = z.array(ItineraryItemSchema).describe('Una lista clasificada de sugerencias de itinerarios basada en la alineación con las preferencias del usuario.');

export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `Eres un experto agente de viajes especializado en crear itinerarios personalizados en español.

Utilizarás la siguiente información para generar un itinerario detallado para el usuario, incluyendo lugares, actividades y descripciones. Ten en cuenta los eventos de temporada para crear la ruta óptima y devuelve un itinerario clasificado según la mejor alineación con las preferencias del usuario.

Destino: {{{destino}}}
Origen: {{{origen}}}
Duración: {{{duracion}}} días
Fecha de salida: {{{fechaSalida}}}
Presupuesto: {{{presupuesto}}}
Acompañantes: {{{acompanantes}}}
Preferencias de viaje: {{{preferencias}}}
Otras actividades de interés: {{{otrasActividades}}}

Itinerario:
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
