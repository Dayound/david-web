import { createClient } from "@supabase/supabase-js";

// La "centralita" para hablar con tu Supabase.
// Lee la dirección y la llave publishable de las variables de entorno
// (.env.local en tu ordenador, Settings → Environment Variables en Vercel).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
