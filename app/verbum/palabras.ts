// Este archivo solo puede usarse en el servidor: si algún día se importa desde
// un componente de cliente, la web no se construye y así la lista nunca llega
// al navegador.
import "server-only";
import { normalizar } from "./texto";

// La lista de retos de VERBUM: cada día toca el siguiente, en orden.
// Cuando se acaba la lista, vuelve a empezar por el primero.
//
// Reglas para escribir un reto:
// - La palabra tiene entre 5 y 8 letras.
// - Puedes escribirla con o sin tildes: el juego las ignora (ÁRBOL = ARBOL).
// - La Ñ cuenta como una letra propia (MONTAÑA no es MONTANA).
// - La pista es la temática del día, en una o pocas palabras.
export const RETOS: Reto[] = [
  { pista: "natural", palabra: "ÁRBOL" },
  { pista: "cocina", palabra: "CUCHARA" },
  { pista: "animales", palabra: "cebra" },
  { pista: "Descanso", palabra: "hamaca" },
  { pista: "pais", palabra: "Suiza" },
  { pista: "Familiar", palabra: "Abuelo" },
  { pista: "tecnologia", palabra: "tablet" },
  { pista: "color", palabra: "blanco" }
];

// El día en que se juega el primer reto de la lista.
export const PRIMER_DIA = "2026-10-09";

// ---------------------------------------------------------------------------
// A partir de aquí no hace falta tocar nada para añadir palabras.

export type Reto = { pista: string; palabra: string };

// La fecha de hoy en España, como "2026-10-09". Así el día cambia
// a medianoche de aquí, esté donde esté el servidor.
function hoyEnEspaña(ahora: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(ahora);
}

// Días que han pasado entre dos fechas "AAAA-MM-DD".
function diasEntre(desde: string, hasta: string): number {
  return Math.round((Date.parse(hasta) - Date.parse(desde)) / 86_400_000);
}

// El reto que toca hoy, con la palabra ya normalizada.
export function retoDelDia(ahora = new Date()): Reto & { fecha: string } {
  const fecha = hoyEnEspaña(ahora);
  const n = diasEntre(PRIMER_DIA, fecha);
  const i = ((n % RETOS.length) + RETOS.length) % RETOS.length; // siempre entre 0 y el final
  const reto = RETOS[i];
  return { fecha, pista: reto.pista, palabra: normalizar(reto.palabra) };
}
