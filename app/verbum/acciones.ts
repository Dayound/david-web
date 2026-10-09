"use server";

import { retoDelDia } from "./palabras";
import { colorear, normalizar, type Color } from "./texto";

export type Respuesta =
  | { ok: true; colores: Color[]; acertado: boolean }
  | { ok: false; mensaje: string };

// La cocina de VERBUM: recibe un intento, lo compara con la palabra del día
// y devuelve solo los colores. La palabra nunca sale del servidor.
export async function comprobarIntento(fecha: string, intento: string): Promise<Respuesta> {
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

  return { ok: true, colores: colorear(texto, reto.palabra), acertado: texto === reto.palabra };
}
