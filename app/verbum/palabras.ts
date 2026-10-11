// Este archivo solo puede usarse en el servidor: si algún día se importa desde
// un componente de cliente, la web no se construye y así la lista nunca llega
// al navegador.
import "server-only";
import { FASES, normalizar } from "./texto";

// La lista de retos de VERBUM: cada día toca el siguiente, en orden.
// Cuando se acaba la lista, vuelve a empezar por el primero.
//
// Cada reto es una escalera de palabras: una por fase, en orden.
// Reglas para escribir un reto:
// - Hasta 6 palabras (una por fase). Si pones menos, ese día tiene menos fases.
// - Cada palabra tiene entre 5 y 8 letras.
// - Cada palabra encaja en la pista y se relaciona con la anterior.
// - Puedes escribirlas con o sin tildes: el juego las ignora (ÁRBOL = ARBOL).
// - La Ñ cuenta como una letra propia (MONTAÑA no es MONTANA).
// - La pista es la temática del día, en una o pocas palabras.
// Escaleras de David, completadas por Claude (con su permiso) para que
// todas tengan 6 palabras de 5–8 letras.
export const RETOS: Reto[] = [
  { pista: "natural", palabras: ["ÁRBOL", "RAÍCES", "TIERRA", "SEMILLA", "FLORES", "ABEJA"] },
  { pista: "cocina", palabras: ["VAJILLA", "PLATO", "CUCHARA", "CALDO", "PUCHERO", "FOGÓN"] },
  { pista: "animales", palabras: ["CEBRA", "SABANA", "ÁFRICA", "LEONES", "GACELA", "MANADA"] },
  { pista: "descanso", palabras: ["HAMACA", "SIESTA", "VERANO", "PLAYA", "ARENA", "TOALLA"] },
  { pista: "país", palabras: ["SUIZA", "ALPES", "MONTAÑA", "NIEVE", "ESQUÍ", "TRINEO"] },
  { pista: "familia", palabras: ["ABUELO", "NIETO", "PRIMO", "HERMANO", "GEMELOS", "PADRES"] },
  { pista: "tecnología", palabras: ["TABLET", "PORTÁTIL", "TECLADO", "RATÓN", "CABLE", "ROUTER"] },
  { pista: "color", palabras: ["BLANCO", "NEGRO", "MARRÓN", "NARANJA", "AMARILLO", "VERDE"] },
];

// El día en que se juega el primer reto de la lista.
export const PRIMER_DIA = "2026-10-09";

// ---------------------------------------------------------------------------
// A partir de aquí no hace falta tocar nada para añadir palabras.

export type Reto = { pista: string; palabras: string[] };

// La fecha de hoy en España, como "2026-10-09". Así el día cambia
// a medianoche de aquí, esté donde esté el servidor.
function hoyEnEspaña(ahora: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(ahora);
}

// Días que han pasado entre dos fechas "AAAA-MM-DD".
function diasEntre(desde: string, hasta: string): number {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / 86_400_000);
}

// El reto que toca hoy, con las palabras ya normalizadas.
export function retoDelDia(ahora = new Date()): Reto & { fecha: string } {
  const fecha = hoyEnEspaña(ahora);
  const n = diasEntre(PRIMER_DIA, fecha);
  const i = ((n % RETOS.length) + RETOS.length) % RETOS.length; // siempre entre 0 y el final
  const reto = RETOS[i];
  return { fecha, pista: reto.pista, palabras: reto.palabras.slice(0, FASES).map(normalizar) };
}
