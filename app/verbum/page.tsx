import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import BotonTema from "../boton-tema";
import { retoDelDia } from "./palabras";
import Juego from "./juego";

export const metadata = { title: "VERBUM · David Villalba" };

export default function Verbum({ searchParams }: PageProps<"/verbum">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 sm:py-24">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-500 hover:text-foreground">
          ← Volver
        </Link>
        <BotonTema />
      </div>

      <h1 className="mt-10 text-center text-3xl font-semibold tracking-[0.3em]">
        VERBUM
      </h1>

      <Suspense fallback={<p className="mt-10 text-center text-zinc-500">Cargando…</p>}>
        <RetoDeHoy searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

// El reto depende del día, así que no se puede preparar de antemano:
// io() le dice a Next.js que espere a que alguien abra la página.
async function RetoDeHoy({ searchParams }: Pick<PageProps<"/verbum">, "searchParams">) {
  await io();
  const reto = retoDelDia();
  let letras = reto.palabras.map((p) => p.length);

  // Solo en tu ordenador: /verbum?letras=8 enseña el tablero con 8 casillas
  // en todas las fases para probar cómo se ve. En la web publicada no hace nada.
  if (process.env.NODE_ENV === "development") {
    const prueba = Number((await searchParams).letras);
    if (prueba >= 5 && prueba <= 8) letras = letras.map(() => prueba);
  }

  // Al navegador solo le pasamos la pista y cuántas letras tiene cada palabra,
  // nunca las palabras.
  return (
    <div className="mt-8">
      <Juego fecha={reto.fecha} pista={reto.pista} letras={letras} />
    </div>
  );
}
