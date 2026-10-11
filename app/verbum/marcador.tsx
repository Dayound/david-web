import { rachaActual, rangoDe, type Estadisticas } from "./estadisticas";

// La insignia del jugador, arriba del juego: rango con sus colores,
// racha, mejor fase y escaleras completas. Está pensada para lucirla.
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
  const estilo = actual
    ? `bg-linear-to-br shadow-lg ${actual.estilo}`
    : "border-2 border-dashed border-black/15 dark:border-white/20";

  return (
    <section aria-label="Tu marcador" className={`rounded-2xl p-5 ${estilo}`}>
      <div className="flex items-center gap-4">
        <p className="text-6xl leading-none drop-shadow">{actual?.logo ?? "🔒"}</p>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Tu rango</p>
          <p className="text-2xl font-bold tracking-tight">{actual?.nombre ?? "Sin rango"}</p>
          <p className="text-sm opacity-80">
            {siguiente
              ? `${faltan === 1 ? "Te falta 1 escalera" : `Te faltan ${faltan} escaleras`} para ${siguiente.logo} ${siguiente.nombre}`
              : "Has llegado a lo más alto."}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-black/10 p-3 text-center dark:bg-white/10">
        <Dato valor={`🔥 ${rachaActual(estadisticas, hoy)}`} texto="días seguidos" />
        <Dato valor={`${estadisticas.mejorFase}/${fases}`} texto="mejor fase" />
        <Dato valor={`🏆 ${estadisticas.completadas}`} texto="escaleras" />
      </dl>
    </section>
  );
}

function Dato({ valor, texto }: { valor: string; texto: string }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="text-xs opacity-75">{texto}</dt>
      <dd className="text-xl font-bold">{valor}</dd>
    </div>
  );
}
