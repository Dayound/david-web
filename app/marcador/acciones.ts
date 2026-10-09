"use server";

import { updateTag } from "next/cache";
import { supabase } from "../lib/supabase";

export type Estado = { ok: boolean; mensaje: string };

// La cocina: recibe lo que se envía desde el formulario, lo revisa
// y lo guarda en Supabase. Esto nunca se ejecuta en el navegador.
export async function guardarPuntuacion(
  _estadoAnterior: Estado,
  formData: FormData,
): Promise<Estado> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const puntos = Number(formData.get("puntos"));

  // No nos fiamos de lo que llega del navegador: lo comprobamos otra vez aquí.
  if (nombre.length < 1 || nombre.length > 30) {
    return { ok: false, mensaje: "El nombre tiene que tener entre 1 y 30 letras." };
  }
  if (!Number.isInteger(puntos) || puntos < 0 || puntos > 1_000_000) {
    return { ok: false, mensaje: "Los puntos tienen que ser un número entero entre 0 y 1.000.000." };
  }

  const { error } = await supabase.from("puntuaciones").insert({ nombre, puntos });
  if (error) {
    return { ok: false, mensaje: "No se ha podido guardar. Prueba otra vez en un momento." };
  }

  // Borra la memoria del top 10 para que salga la puntuación nueva.
  updateTag("marcador");
  return { ok: true, mensaje: `¡Guardado! ${nombre}, ${puntos} puntos.` };
}
