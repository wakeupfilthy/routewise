// src/lib/destination-recommender.ts
'use client';

// --- Data Definitions (to be used by form and recommender) ---

export const preferenciasItems = [
    { id: 'culturales', label: 'Culturales' },
    { id: 'naturaleza', label: 'Naturaleza' },
    { id: 'festivales', label: 'Festivales y eventos' },
    { id: 'playas', label: 'Playas' },
    { id: 'gastronomia', label: 'Gastronomía' },
    { id: 'spa', label: 'Spa y relajación' },
    { id: 'vidaNocturna', label: 'Vida nocturna' },
    { id: 'compras', label: 'Compras' },
];

export const presupuestos = [
  "Muy bajo (<400 USD)",
  "Bajo (400-700 USD)",
  "Medio (700-1000 USD)",
  "Alto (1000-1500 USD)",
  "Muy alto (>1500 USD)"
];

export const acompanantes = ["Solo", "En Pareja", "En Familia", "Con Amigos"];

// --- Destination Data ---

const destinos = [
  {
    destino: "Holbox, México",
    tipo_viaje: ["playas", "naturaleza", "spa"],
    costo_estimado: 150, // Daily cost per person
    ideal_para: "En Pareja"
  },
  {
    destino: "Tulum, México",
    tipo_viaje: ["playas", "vidaNocturna", "culturales", "spa"],
    costo_estimado: 250,
    ideal_para: "Con Amigos"
  },
  {
    destino: "Oaxaca, México",
    tipo_viaje: ["gastronomia", "culturales", "naturaleza"],
    costo_estimado: 90,
    ideal_para: "En Pareja"
  },
  {
    destino: "Ciudad de México, México",
    tipo_viaje: ["culturales", "gastronomia", "vidaNocturna", "compras"],
    costo_estimado: 120,
    ideal_para: "Con Amigos"
  },
  {
    destino: "Kyoto, Japón",
    tipo_viaje: ["culturales", "naturaleza", "gastronomia", "spa"],
    costo_estimado: 180,
    ideal_para: "En Pareja"
  },
  {
    destino: "Roma, Italia",
    tipo_viaje: ["culturales", "gastronomia", "compras"],
    costo_estimado: 220,
    ideal_para: "En Pareja"
  },
  {
    destino: "Parque Nacional Zion, USA",
    tipo_viaje: ["naturaleza"],
    costo_estimado: 160,
    ideal_para: "En Familia"
  },
  {
    destino: "Bangkok, Tailandia",
    tipo_viaje: ["gastronomia", "vidaNocturna", "compras", "culturales"],
    costo_estimado: 70,
    ideal_para: "Solo"
  },
  {
    destino: "Las Vegas, USA",
    tipo_viaje: ["vidaNocturna", "festivales", "compras", "gastronomia"],
    costo_estimado: 300,
    ideal_para: "Con Amigos"
  },
  {
    destino: "Islandia",
    tipo_viaje: ["naturaleza", "spa"],
    costo_estimado: 280,
    ideal_para: "En Pareja"
  },
  {
    destino: "Riviera Maya, México",
    tipo_viaje: ["playas", "spa", "naturaleza"],
    costo_estimado: 240,
    ideal_para: "En Familia"
  }
];

// --- Recommendation Logic ---

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must be of the same length");
    }
    const dotProduct = vecA.map((val, i) => val * vecB[i]).reduce((sum, curr) => sum + curr, 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    return dotProduct / (magnitudeA * magnitudeB);
}

// Categorizes budget based on an estimated total cost for a 5-day trip.
function categorizarPresupuesto(costoDiario: number): string {
  const costoTotalEstimado = costoDiario * 5;
  if (costoTotalEstimado < 400) return presupuestos[0]; // Muy bajo
  if (costoTotalEstimado <= 700) return presupuestos[1]; // Bajo
  if (costoTotalEstimado <= 1000) return presupuestos[2]; // Medio
  if (costoTotalEstimado <= 1500) return presupuestos[3]; // Alto
  return presupuestos[4]; // Muy alto
}

const categoriasIds = preferenciasItems.map(p => p.id);

function crearVectorDestino(destino: typeof destinos[0]) {
  const tipoViajeVec = categoriasIds.map(cat => destino.tipo_viaje.includes(cat) ? 1 : 0);
  const presupuestoCat = categorizarPresupuesto(destino.costo_estimado);
  const presupuestoVec = presupuestos.map(p => p === presupuestoCat ? 1 : 0);
  const acompanamientoVec = acompanantes.map(a => a === destino.ideal_para ? 1 : 0);
  return [...tipoViajeVec, ...presupuestoVec, ...acompanamientoVec];
}

interface UserProfile {
    preferencias: string[];
    presupuesto: string;
    acompanantes: string;
}

function crearVectorUsuario(usuario: UserProfile) {
  const tipoViajeVec = categoriasIds.map(cat => usuario.preferencias.includes(cat) ? 1 : 0);
  const presupuestoVec = presupuestos.map(p => p === usuario.presupuesto ? 1 : 0);
  const acompanamientoVec = acompanantes.map(a => a === usuario.acompanantes ? 1 : 0);
  return [...tipoViajeVec, ...presupuestoVec, ...acompanamientoVec];
}

export function recomendarDestino(usuario: UserProfile): { nombre: string; score: number } | null {
    if (!usuario.preferencias || usuario.preferencias.length === 0) {
        return null;
    }

  const vectorUsuario = crearVectorUsuario(usuario);
  const resultados = destinos.map(dest => {
    const vectorDestino = crearVectorDestino(dest);
    const score = cosineSimilarity(vectorUsuario, vectorDestino);
    return {
      nombre: dest.destino,
      score: isNaN(score) ? 0 : parseFloat(score.toFixed(4))
    };
  });
  
  if(resultados.length === 0) return null;

  return resultados.sort((a, b) => b.score - a.score)[0];
}
