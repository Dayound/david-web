import Link from "next/link";
import BotonTema from "../boton-tema";
import { leerTop10 } from "./datos";
import Formulario from "./formulario";

export const metadata = { title: "Marcador · David Villalba" };

export default async function Marcador() {
  const top10 = await leerTop10();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 sm:py-24">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-500 hover:text-foreground">
          ← Volver
        </Link>
        <BotonTema />
      </div>

      <h1 className="mt-10 text-3xl font-semibold tracking-tight">Marcador</h1>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        Apunta tu puntuación y mira si entras en el top 10.
      </p>

      <section className="mt-10">
        <Formulario />
      </section>

      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500">Top 10</h2>
        {top10.length === 0 ? (
          <p className="mt-4 text-zinc-500">Todavía no hay puntuaciones. ¡Sé el primero!</p>
        ) : (
          <ol className="mt-4 divide-y divide-black/10 dark:divide-white/15">
            {top10.map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-4 py-3">
                <span className="w-6 text-right text-zinc-500">{i + 1}</span>
                <span className="flex-1 truncate">{p.nombre}</span>
                <span className="font-semibold tabular-nums">{p.puntos}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
