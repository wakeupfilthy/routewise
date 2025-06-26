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
      actividades: z.string().describe("Costo aproximado de las actividades para todo el viaje, en USD."),
      total: z.string().describe("La suma total de todos los gastos estimados para el viaje, en USD.")
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
    prompt: `Actúa como un planificador de viajes experto. Genera un itinerario personalizado en español, siguiendo estrictamente el formato JSON y el esquema de salida proporcionado.

**Instrucciones Generales:**
1.  **Formato JSON:** Tu respuesta DEBE ser un único objeto JSON válido que se ajuste al esquema de salida.
2.  **Idioma:** Toda la respuesta debe estar en español.
3.  **Realismo:** Adapta todas las sugerencias al presupuesto, preferencias y tipo de acompañantes indicados. Asegúrate de que las actividades recomendadas estén directamente relacionadas con las **preferencias** del usuario. Sé claro, realista y útil.
4.  **Detalles del Viaje:**
    - \`tripName\`: Crea un nombre corto y atractivo para el viaje.
    - \`destination\`, \`duration\`, \`dates\`: Confirma estos detalles basándote en la entrada. Las fechas deben calcularse a partir de la fecha de salida y la duración.
5.  **Resumen:** En el campo \`resumen\`, describe en un párrafo breve la experiencia general que vivirá el viajero.
6.  **Gastos Estimados (en USD):**
    - Calcula los costos aproximados para \`transporte\`, \`alojamiento\`, \`comidaDiaria\`, y \`actividades\`.
    - Calcula y proporciona el costo \`total\` estimado para todo el viaje.
7.  **Itinerario Detallado:**
    - En el campo \`itinerario\`, crea un array donde cada objeto representa un día del viaje.
    - Para cada día, detalla las \`activities\`, \`foodSuggestions\`, y \`companionRecommendations\`.
    - Si hay eventos especiales (\`events\`) durante las fechas del viaje, inclúyelos. Si no, omite el campo \`events\`.

---

**Datos del Viaje para Generar el Itinerario:**
- **Destino:** {{{destino}}}
- **Origen:** {{{origen}}}
- **Duración:** {{{duracion}}} días
- **Fecha de salida:** {{{fechaSalida}}}
- **Acompañantes:** {{{acompanantes}}}
- **Presupuesto:** {{{presupuesto}}} (por persona)
- **Preferencias:** {{{preferencias}}}
- **Otras actividades de interés:** {{{otrasActividades}}}

Genera la respuesta en formato JSON. No incluyas texto o explicaciones fuera del objeto JSON.
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
