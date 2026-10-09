import { Suspense } from "react";
import Link from "next/link";
import { io } from "next/cache";
import BotonTema from "../boton-tema";
import { retoDelDia } from "./palabras";
import Tablero from "./tablero";

export const metadata = { title: "VERBUM · David Villalba" };

const INTENTOS = 6;

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
  let letras = reto.palabra.length;

  // Solo en tu ordenador: /verbum?letras=8 enseña el tablero con 8 casillas
  // para probar cómo se ve. En la web publicada no hace nada.
  if (process.env.NODE_ENV === "development") {
    const prueba = Number((await searchParams).letras);
    if (prueba >= 5 && prueba <= 8) letras = prueba;
  }

  // Al navegador solo le pasamos la pista y cuántas letras tiene la palabra,
  // nunca la palabra.
  return (
    <>
      <p className="mt-6 text-center text-zinc-600 dark:text-zinc-400">
        Pista de hoy:{" "}
        <span className="font-semibold text-foreground">{reto.pista}</span>
        <span className="text-zinc-500"> · {letras} letras</span>
      </p>
      <div className="mt-8">
        <Tablero intentos={INTENTOS} letras={letras} />
      </div>
    </>
  );
}
