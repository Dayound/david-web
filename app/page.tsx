import BotonTema from "./boton-tema";

// Una tarjeta para cada idea de juego. Se escribe una vez y se usa tres veces:
// eso es un componente.
function Idea({
  nombre,
  frase,
  nivel,
}: {
  nombre: string;
  frase: string;
  nivel: string;
}) {
  return (
    <li className="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{nombre}</h3>
        <span className="text-xs uppercase tracking-widest text-zinc-500">
          {nivel}
        </span>
      </div>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{frase}</p>
    </li>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 sm:py-24">
      <div className="flex justify-end">
        <BotonTema />
      </div>

      {/* Cabecera: el círculo con las iniciales es provisional hasta que haya foto */}
      <header className="mt-10 flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-2xl font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          DV
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            David Villalba
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Aprendiendo a construir juegos y apps con Claude.
          </p>
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500">
          Qué hago
        </h2>
        <p className="mt-4 text-lg leading-8">
          Probando, probando.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500">
          Mis ideas de juegos
        </h2>
        <ul className="mt-4 space-y-4">
          <Idea
            nombre="VERBUM"
            nivel="Nivel 1"
            frase="Una palabra al día, seis intentos. Abrir, jugar, descubrir la palabra."
          />
          <Idea
            nombre="App HIIT"
            nivel="Nivel 2"
            frase="No pienses qué entrenar. Abre la app y entrena."
          />
          <Idea
            nombre="WHAT IF?"
            nivel="Nivel 3"
            frase="El desarrollador diseña el problema. El jugador diseña la solución."
          />
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500">
          Contacto
        </h2>
        <p className="mt-4 text-lg">
          <a
            href="https://github.com/dayound"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-zinc-500"
          >
            GitHub · dayound
          </a>
        </p>
      </section>
    </main>
  );
}
