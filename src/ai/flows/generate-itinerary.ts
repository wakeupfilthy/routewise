
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
  userLocale: z.string().optional().describe("La configuración regional del usuario (por ejemplo, 'es-MX' o 'en-US') para determinar la moneda local."),
});

export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const CostSummarySchema = z.object({
    vuelos: z.string().describe('Rango de costo estimado para vuelos (e.g., "500-700 USD").'),
    alojamiento: z.string().describe('Rango de costo estimado para alojamiento (e.g., "1000-1500 USD").'),
    transporteLocal: z.string().describe('Rango de costo estimado para transporte local (e.g., "150-250 USD").'),
    alimentacion: z.string().describe('Rango de costo estimado para alimentación (e.g., "400-600 USD").'),
    actividades: z.string().describe('Rango de costo estimado para actividades y entradas (e.g., "200-300 USD").'),
    extras: z.string().describe('Rango de costo estimado para extras y contingencias (e.g., "100-200 USD").'),
    total: z.string().describe('Rango de costo total estimado (e.g., "2350-3550 USD").'),
  });
  
  const ItineraryItemSchema = z.object({
    day: z.number().describe('El número del día en el itinerario.'),
    title: z.string().describe('Un título para las actividades del día (e.g., "Viaje en el Tiempo al Coliseo y Foro Romano").'),
    time: z.string().describe('El horario para la actividad (e.g., "Mañana (9:00 AM - 1:00 PM)").'),
    description: z.string().describe('Una descripción detallada de la ubicación y la actividad.'),
  });
  
  const GenerateItineraryOutputSchema = z.object({
    tripName: z.string().describe('Un nombre para el viaje, como "Mi Viaje a París". El nombre debe ser corto y atractivo.'),
    destination: z.string().describe('El destino del viaje (ciudad y país, e.g., "París, Francia").'),
    duration: z.string().describe('La duración del viaje en días (e.g., "8 días").'),
    dates: z.string().describe('El rango de fechas del viaje (e.g., "17/11/2026 - 25/11/2026").'),
    summary: CostSummarySchema.describe('Un resumen de los costos estimados del viaje.'),
    itinerary: z.array(ItineraryItemSchema).describe('Una lista de sugerencias de itinerarios diarios.'),
  });

export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateItineraryPrompt',
    input: {schema: GenerateItineraryInputSchema},
    output: {schema: GenerateItineraryOutputSchema},
    prompt: `Eres un experto agente de viajes especializado en crear itinerarios personalizados en español.
  
  Utilizarás la siguiente información para generar un itinerario detallado para el usuario. La respuesta DEBE estar en formato JSON y cumplir con el esquema proporcionado.
  
  **Información del Viaje:**
  - Destino: {{{destino}}}
  - Origen: {{{origen}}}
  - Duración: {{{duracion}}} días
  - Fecha de salida: {{{fechaSalida}}}
  - Presupuesto: {{{presupuesto}}}
  - Acompañantes: {{{acompanantes}}}
  - Preferencias de viaje: {{{preferencias}}}
  - Otras actividades de interés: {{{otrasActividades}}}
  {{#if userLocale}}- Configuración Regional: {{{userLocale}}}{{/if}}
  
  **Tareas:**
  1.  **Crear un nombre para el viaje:** Basado en el destino, como "Mi Viaje a {{{destino}}}".
  2.  **Confirmar detalles:** Incluye el destino (ciudad, país), la duración en días, y el rango de fechas del viaje calculado a partir de la fecha de salida y la duración.
  3.  **Generar un resumen de costos:** Proporciona un rango de precios estimado{{#if userLocale}} en la moneda local del usuario (basado en la configuración regional '{{{userLocale}}}'){{else}} en USD{{/if}} para: vuelos, alojamiento, transporte local, alimentación, actividades y entradas, extras y contingencia, y un total. Sé realista con los costos basándote en el destino y el presupuesto indicado. Incluye el código de la moneda (e.g., USD, EUR, MXN) en cada valor.
  4.  **Crear un itinerario diario:** Para cada día del viaje, define un título, un horario (ej. "Mañana (9:00 AM - 1:00 PM)"), y una descripción de la actividad. Las actividades deben ser coherentes con las preferencias del usuario. Ten en cuenta eventos de temporada o locales.
  
  Genera la respuesta completa en el formato JSON especificado.
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
