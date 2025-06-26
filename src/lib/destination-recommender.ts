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
    { destino: 'Holbox, México', tipo_viaje: [ 'playas', 'naturaleza', 'spa' ], costo_estimado: 120, ideal_para: 'En Pareja' },
    { destino: 'Tulum, México', tipo_viaje: [ 'playas', 'vidaNocturna', 'culturales', 'spa' ], costo_estimado: 200, ideal_para: 'Con Amigos' },
    { destino: 'Kioto, Japón', tipo_viaje: [ 'culturales', 'gastronomia', 'naturaleza', 'festivales' ], costo_estimado: 250, ideal_para: 'En Pareja' },
    { destino: 'Oaxaca de Juárez, México', tipo_viaje: [ 'culturales', 'gastronomia', 'festivales' ], costo_estimado: 100, ideal_para: 'Solo' },
    { destino: 'Bangkok, Tailandia', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna' ], costo_estimado: 130, ideal_para: 'Con Amigos' },
    { destino: 'Buenos Aires, Argentina', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna' ], costo_estimado: 130, ideal_para: 'En Pareja' },
    { destino: 'Riviera Maya, México', tipo_viaje: [ 'playas', 'naturaleza', 'spa' ], costo_estimado: 250, ideal_para: 'En Familia' },
    { destino: 'Roma, Italia', tipo_viaje: [ 'culturales', 'gastronomia', 'compras' ], costo_estimado: 270, ideal_para: 'En Pareja' },
    { destino: 'Ciudad de México, México', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna', 'festivales' ], costo_estimado: 110, ideal_para: 'Solo' },
    { destino: 'San Miguel de Allende, México', tipo_viaje: [ 'culturales', 'gastronomia', 'spa' ], costo_estimado: 60, ideal_para: 'En Pareja' },
    { destino: 'Puerto Escondido, México', tipo_viaje: [ 'playas', 'vidaNocturna', 'naturaleza' ], costo_estimado: 125, ideal_para: 'Con Amigos' },
    { destino: 'Medellín, Colombia', tipo_viaje: [ 'culturales', 'vidaNocturna', 'naturaleza' ], costo_estimado: 65, ideal_para: 'Con Amigos' },
    { destino: 'Lisboa, Portugal', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna' ], costo_estimado: 190, ideal_para: 'En Pareja' },
    { destino: 'Praga, República Checa', tipo_viaje: [ 'culturales', 'vidaNocturna', 'compras' ], costo_estimado: 200, ideal_para: 'Con Amigos' },
    { destino: 'Chiang Mai, Tailandia', tipo_viaje: [ 'culturales', 'naturaleza', 'gastronomia', 'spa' ], costo_estimado: 105, ideal_para: 'Solo' },
    { destino: 'Cusco, Perú', tipo_viaje: [ 'culturales', 'naturaleza', 'gastronomia' ], costo_estimado: 110, ideal_para: 'Solo' },
    { destino: 'Mazatlán, México', tipo_viaje: [ 'playas', 'vidaNocturna', 'gastronomia', 'festivales' ], costo_estimado: 150, ideal_para: 'En Familia' },
    { destino: 'Palenque, México', tipo_viaje: [ 'culturales', 'naturaleza' ], costo_estimado: 90, ideal_para: 'Solo' },
    { destino: 'Viena, Austria', tipo_viaje: [ 'culturales', 'gastronomia', 'festivales' ], costo_estimado: 195, ideal_para: 'En Pareja' },
    { destino: 'Ciudad del Cabo, Sudáfrica', tipo_viaje: [ 'naturaleza', 'culturales', 'gastronomia', 'playas' ], costo_estimado: 190, ideal_para: 'En Pareja' },
    { destino: 'Río de Janeiro, Brasil', tipo_viaje: [ 'playas', 'vidaNocturna', 'naturaleza', 'festivales' ], costo_estimado: 148, ideal_para: 'Con Amigos' },
    { destino: 'Dublín, Irlanda', tipo_viaje: [ 'culturales', 'vidaNocturna', 'gastronomia' ], costo_estimado: 210, ideal_para: 'Con Amigos' },
    { destino: 'Mérida, México', tipo_viaje: [ 'culturales', 'gastronomia', 'naturaleza' ], costo_estimado: 100, ideal_para: 'En Familia' },
    { destino: 'Marrakech, Marruecos', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna' ], costo_estimado: 85, ideal_para: 'Solo' },
    { destino: 'Bacalar, México', tipo_viaje: [ 'playas', 'naturaleza', 'spa' ], costo_estimado: 75, ideal_para: 'En Pareja' },
    { destino: 'Guadalajara, México', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna', 'festivales' ], costo_estimado: 85, ideal_para: 'Con Amigos' },
    { destino: 'Puebla, México', tipo_viaje: [ 'culturales', 'gastronomia' ], costo_estimado: 60, ideal_para: 'En Familia' },
    { destino: 'San Sebastián, España', tipo_viaje: [ 'gastronomia', 'playas', 'culturales' ], costo_estimado: 220, ideal_para: 'En Pareja' },
    { destino: 'Florencia, Italia', tipo_viaje: [ 'culturales', 'gastronomia' ], costo_estimado: 190, ideal_para: 'En Pareja' },
    { destino: 'Edimburgo, Escocia', tipo_viaje: [ 'culturales', 'vidaNocturna', 'festivales' ], costo_estimado: 230, ideal_para: 'Con Amigos' },
    { destino: 'Oporto, Portugal', tipo_viaje: [ 'culturales', 'gastronomia', 'vidaNocturna' ], costo_estimado: 110, ideal_para: 'En Pareja' },
    { destino: 'Chicago, Estados Unidos', tipo_viaje: [ 'gastronomia', 'festivales', 'vidaNocturna' ], costo_estimado: 250, ideal_para: 'Con Amigos' },
    { destino: 'Cartagena, Colombia', tipo_viaje: [ 'playas', 'culturales', 'vidaNocturna' ], costo_estimado: 120, ideal_para: 'En Pareja' },
    { destino: 'Valencia, España', tipo_viaje: [ 'culturales', 'gastronomia', 'playas' ], costo_estimado: 140, ideal_para: 'En Familia' },
    { destino: 'Budapest, Hungría', tipo_viaje: [ 'culturales', 'vidaNocturna', 'gastronomia' ], costo_estimado: 160, ideal_para: 'Con Amigos' },
    { destino: 'Zacatecas, México', tipo_viaje: [ 'culturales', 'vidaNocturna' ], costo_estimado: 70, ideal_para: 'En Pareja' },
    { destino: 'Morelia, México', tipo_viaje: [ 'culturales', 'gastronomia' ], costo_estimado: 80, ideal_para: 'En Familia' },
    { destino: 'Ixtapa-Zihuatanejo, México', tipo_viaje: [ 'playas', 'gastronomia', 'naturaleza' ], costo_estimado: 130, ideal_para: 'En Familia' },
    { destino: 'Campeche, México', tipo_viaje: [ 'culturales', 'playas', 'gastronomia' ], costo_estimado: 90, ideal_para: 'En Pareja' },
    { destino: 'Monterrey, México', tipo_viaje: [ 'gastronomia', 'naturaleza', 'vidaNocturna' ], costo_estimado: 110, ideal_para: 'Con Amigos' },
    { destino: 'Taxco, México', tipo_viaje: [ 'culturales', 'gastronomia' ], costo_estimado: 75, ideal_para: 'En Pareja' },
    { destino: 'Veracruz, México', tipo_viaje: [ 'playas', 'vidaNocturna', 'culturales' ], costo_estimado: 95, ideal_para: 'En Familia' },
    { destino: 'Tequila, México', tipo_viaje: [ 'gastronomia', 'culturales', 'festivales' ], costo_estimado: 100, ideal_para: 'Con Amigos' },
    { destino: 'Huatulco, México', tipo_viaje: [ 'playas', 'naturaleza' ], costo_estimado: 140, ideal_para: 'En Familia' },
    { destino: 'Chihuahua, México', tipo_viaje: [ 'naturaleza', 'culturales' ], costo_estimado: 120, ideal_para: 'Solo' },
    { destino: 'Berlín, Alemania', tipo_viaje: [ 'culturales', 'vidaNocturna', 'festivales' ], costo_estimado: 150, ideal_para: 'Con Amigos' },
    { destino: 'Lima, Perú', tipo_viaje: [ 'gastronomia', 'culturales' ], costo_estimado: 70, ideal_para: 'Solo' },
    { destino: 'Sídney, Australia', tipo_viaje: [ 'playas', 'naturaleza', 'vidaNocturna' ], costo_estimado: 200, ideal_para: 'Con Amigos' },
    { destino: 'Estocolmo, Suecia', tipo_viaje: [ 'culturales', 'naturaleza', 'gastronomia' ], costo_estimado: 180, ideal_para: 'En Pareja' },
    { destino: 'Nueva Orleans, Estados Unidos', tipo_viaje: [ 'gastronomia', 'festivales', 'vidaNocturna', 'culturales' ], costo_estimado: 220, ideal_para: 'Con Amigos' },
    { destino: 'Cracovia, Polonia', tipo_viaje: [ 'culturales', 'vidaNocturna' ], costo_estimado: 80, ideal_para: 'Solo' },
    { destino: 'Ho Chi Minh, Vietnam', tipo_viaje: [ 'gastronomia', 'culturales', 'vidaNocturna' ], costo_estimado: 55, ideal_para: 'Solo' },
    { destino: 'Atenas, Grecia', tipo_viaje: [ 'culturales', 'gastronomia', 'playas' ], costo_estimado: 130, ideal_para: 'En Pareja' },
    { destino: 'Bali, Indonesia', tipo_viaje: [ 'naturaleza', 'playas', 'culturales' ], costo_estimado: 90, ideal_para: 'En Pareja' },
    { destino: 'Vancouver, Canadá', tipo_viaje: [ 'naturaleza', 'gastronomia', 'culturales' ], costo_estimado: 190, ideal_para: 'En Familia' },
    { destino: 'Zanzíbar, Tanzania', tipo_viaje: [ 'playas', 'culturales', 'naturaleza' ], costo_estimado: 110, ideal_para: 'En Pareja' }
    
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
  
  if (resultados.length === 0) return null;

  const sortedResultados = resultados.sort((a, b) => b.score - a.score);
  
  const top5 = sortedResultados.slice(0, 5);

  if (top5.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * top5.length);
  return top5[randomIndex];
}
