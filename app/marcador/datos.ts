import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "../lib/supabase";

export type Puntuacion = {
  id: number;
  nombre: string;
  puntos: number;
  fecha: string;
};

// Lee el top 10 del archivador. Next.js lo guarda en memoria (caché) para no
// preguntar a Supabase cada vez; cuando alguien añade una puntuación, se borra
// esa memoria con la etiqueta "marcador" y se vuelve a leer.
export async function leerTop10(): Promise<Puntuacion[]> {
  "use cache";
  cacheTag("marcador");
  cacheLife("minutes");

  const { data, error } = await supabase
    .from("puntuaciones")
    .select("id, nombre, puntos, fecha")
    .order("puntos", { ascending: false })
    .order("fecha", { ascending: true })
    .limit(10);

  if (error) throw new Error(`No se pudo leer el marcador: ${error.message}`);
  return data;
}
