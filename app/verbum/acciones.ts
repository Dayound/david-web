"use server";

import { retoDelDia } from "./palabras";
import { colorear, intentosDeFase, normalizar, type Color } from "./texto";

export type Respuesta =
  | { ok: true; colores: Color[]; acertado: boolean; palabra?: string }
  | { ok: false; mensaje: string };

// La cocina de VERBUM: recibe un intento, lo compara con la palabra de esa
// fase y devuelve solo los colores. La palabra solo sale del servidor para
// enseñarla cuando se falla el último intento de la fase.
export async function comprobarIntento(
  fecha: string,
  fase: number, // en qué fase está: 1, 2, … 6
  intento: string,
  numero: number, // qué intento de la fase es: 1, 2, …
): Promise<Respuesta> {
  const reto = retoDelDia();

  // Si la página se abrió ayer y ya ha pasado la medianoche, las palabras han cambiado.
  if (fecha !== reto.fecha) {
    return { ok: false, mensaje: "Ha empezado un día nuevo: recarga la página para el reto de hoy." };
  }

  // No nos fiamos de lo que llega del navegador: lo comprobamos otra vez aquí.
  const palabraDeFase = reto.palabras[fase - 1];
  if (!Number.isInteger(fase) || !palabraDeFase) {
    return { ok: false, mensaje: "Esa fase no existe: recarga la página." };
  }
  const texto = normalizar(String(intento));
  if (!/^[A-ZÑ]+$/.test(texto) || texto.length !== palabraDeFase.length) {
    return { ok: false, mensaje: `El intento tiene que tener ${palabraDeFase.length} letras.` };
  }

  const acertado = texto === palabraDeFase;
  // Nota: la fase y el número de intento los dice el navegador, así que alguien
  // con conocimientos podría pedir una palabra antes de tiempo. Para un juego
  // entre amigos vale; evitarlo del todo exigiría guardar cada partida en el servidor.
  const palabra = !acertado && numero >= intentosDeFase(fase) ? palabraDeFase : undefined;
  return { ok: true, colores: colorear(texto, palabraDeFase), acertado, palabra };
}
