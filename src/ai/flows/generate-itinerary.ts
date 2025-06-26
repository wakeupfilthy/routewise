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

const GenerateItineraryOutputSchema = z.object({
  tripName: z.string().describe('Un nombre para el viaje, como "Mi Viaje a París". El nombre debe ser corto y atractivo.'),
  destination: z.string().describe('El destino del viaje (ciudad y país, e.g., "París, Francia").'),
  duration: z.string().describe('La duración del viaje en días (e.g., "8 días").'),
  dates: z.string().describe('El rango de fechas del viaje (e.g., "17/11/2026 - 25/11/2026").'),
  resumen: z.string().describe("Una breve descripción de la experiencia del viajero."),
  gastos: z.object({
      transporte: z.string().describe("Costo aproximado del transporte de ida y vuelta por persona, en USD."),
      alojamiento: z.string().describe("Costo aproximado del alojamiento para toda la estancia, en USD."),
      comidaDiaria: z.string().describe("Costo aproximado de la comida por día por persona, en USD."),
      actividades: z.string().describe("Costo aproximado de las actividades para todo el viaje, en USD.")
  }).describe("Un resumen de los gastos estimados del viaje en USD."),
  itinerario: z.array(z.object({
      day: z.number().describe("El número del día en el itinerario."),
      title: z.string().describe("Un título para las actividades del día."),
      schedule: z.string().describe("Horarios aproximados para las actividades (e.g., Mañana, Tarde, Noche)."),
      activities: z.string().describe("Descripción detallada de las actividades principales para el día."),
      foodSuggestions: z.string().describe("Sugerencias de lugares para comer o cenar."),
      companionRecommendations: z.string().describe("Recomendaciones específicas según el tipo de acompañamiento."),
      events: z.string().optional().describe("Eventos o festividades especiales que ocurren durante las fechas del viaje.")
  })).describe("El desglose del itinerario diario.")
});

export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateItineraryPrompt',
    input: {schema: GenerateItineraryInputSchema},
    output: {schema: GenerateItineraryOutputSchema},
    model: 'googleai/gemini-2.5-flash-lite-preview-06-17',
    prompt: `Quiero que actúes como un planificador de viajes experto y construyas itinerarios personalizados en español. La respuesta DEBE estar en formato JSON y cumplir con el esquema proporcionado.

**Tareas Generales:**
1.  **Crear un nombre para el viaje:** Basado en el destino, como "Mi Viaje a {{{destino}}}".
2.  **Confirmar detalles:** Incluye el destino (ciudad, país), la duración en días, y el rango de fechas del viaje calculado a partir de la fecha de salida y la duración.
3.  **Generar Resumen:** En el campo \`resumen\`, describe brevemente qué tipo de experiencia vivirá el viajero.
4.  **Estimar Gastos:** En el campo \`gastos\`, muestra un gasto aproximado en USD para:
    *   \`transporte\`: Transporte de ida y vuelta (aproximado, por persona).
    *   \`alojamiento\`: Alojamiento para la estadía completa.
    *   \`comidaDiaria\`: Comida diaria (calculada por persona).
    *   \`actividades\`: Costo total de actividades.
5.  **Desglosar Itinerario:** En el campo \`itinerario\`, desglosa un plan día por día, incluyendo:
    *   \`title\`: Un título para el día.
    *   \`schedule\`: Horarios aproximados (mañana / tarde / noche).
    *   \`activities\`: Actividades principales para cada día.
    *   \`foodSuggestions\`: Lugares sugeridos para comer o cenar.
    *   \`companionRecommendations\`: Recomendaciones relacionadas con el tipo de acompañamiento.
    *   \`events\`: (Opcional) Eventos o festividades que ocurren durante la fecha del viaje. Si no hay, omite este campo.

Adapta todo el plan al presupuesto y al estilo de viaje que mejor encaje para la persona. Haz el texto claro, realista y útil. No repitas información innecesaria.

---

Genera un itinerario con las siguientes características:
- Destino: {{{destino}}}
- Origen: {{{origen}}}
- Duración: {{{duracion}}} días
- Fecha de salida: {{{fechaSalida}}}
- Acompañantes: {{{acompanantes}}}
- Presupuesto: {{{presupuesto}}} (por persona)
- Preferencias de viaje: {{{preferencias}}}
- Otras actividades de interés: {{{otrasActividades}}}

No olvides el formato JSON especificado en las instrucciones. Si no hay eventos o festividades no las menciones.
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
