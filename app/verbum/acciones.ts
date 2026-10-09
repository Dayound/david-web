"use server";

import { retoDelDia } from "./palabras";
import { colorear, INTENTOS, normalizar, type Color } from "./texto";

export type Respuesta =
  | { ok: true; colores: Color[]; acertado: boolean; palabra?: string }
  | { ok: false; mensaje: string };

// La cocina de VERBUM: recibe un intento, lo compara con la palabra del día
// y devuelve solo los colores. La palabra solo sale del servidor para
// enseñarla cuando se falla el último intento.
export async function comprobarIntento(
  fecha: string,
  intento: string,
  numero: number, // qué intento es: 1, 2, … 6
): Promise<Respuesta> {
  const reto = retoDelDia();

  // Si la página se abrió ayer y ya ha pasado la medianoche, la palabra ha cambiado.
  if (fecha !== reto.fecha) {
    return { ok: false, mensaje: "Ha empezado un día nuevo: recarga la página para el reto de hoy." };
  }

  // No nos fiamos de lo que llega del navegador: lo comprobamos otra vez aquí.
  const texto = normalizar(String(intento));
  if (!/^[A-ZÑ]+$/.test(texto) || texto.length !== reto.palabra.length) {
    return { ok: false, mensaje: `El intento tiene que tener ${reto.palabra.length} letras.` };
  }

  const acertado = texto === reto.palabra;
  // Nota: el número de intento lo dice el navegador, así que alguien con
  // conocimientos podría pedir la palabra antes de tiempo. Para un juego
  // entre amigos vale; evitarlo del todo exigiría guardar cada partida en el servidor.
  const palabra = !acertado && numero >= INTENTOS ? reto.palabra : undefined;
  return { ok: true, colores: colorear(texto, reto.palabra), acertado, palabra };
}
