import { rachaActual, rangoDe, type Estadisticas } from "./estadisticas";

// La tarjeta "Tu marcador": racha, mejor fase, escaleras completas y rango.
export default function Marcador({
  estadisticas,
  hoy,
  fases,
}: {
  estadisticas: Estadisticas;
  hoy: string;
  fases: number; // cuántas fases tiene el reto de hoy
}) {
  const { actual, siguiente } = rangoDe(estadisticas.completadas);
  const faltan = siguiente ? siguiente.desde - estadisticas.completadas : 0;

  return (
    <section className="rounded-xl border-2 border-black/15 p-5 dark:border-white/20">
      <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">
        Tu marcador
      </h2>

      <div className="mt-4 text-center">
        <p className="text-4xl">{actual?.logo ?? "🔒"}</p>
        <p className="mt-1 font-semibold">{actual ? `Rango ${actual.nombre}` : "Sin rango todavía"}</p>
        {siguiente && (
          <p className="text-sm text-zinc-500">
            {faltan === 1 ? "Te falta 1 escalera" : `Te faltan ${faltan} escaleras`} para{" "}
            {siguiente.logo} {siguiente.nombre}
          </p>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        <Dato valor={rachaActual(estadisticas, hoy)} texto="días seguidos" />
        <Dato valor={`${estadisticas.mejorFase}/${fases}`} texto="mejor fase" />
        <Dato valor={estadisticas.completadas} texto="escaleras completas" />
      </dl>
    </section>
  );
}

function Dato({ valor, texto }: { valor: string | number; texto: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-xs text-zinc-500">{texto}</dt>
      <dd className="text-2xl font-bold">{valor}</dd>
    </div>
  );
}
