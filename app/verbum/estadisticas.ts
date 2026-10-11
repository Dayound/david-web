// El marcador personal de VERBUM. Se guarda solo en el navegador de cada
// jugador (localStorage): si cambia de móvil o borra los datos, empieza de cero.

export type Estadisticas = {
  ultimoDia: string; // el último día que terminó una partida, "AAAA-MM-DD"
  racha: number; // días seguidos jugando, hasta ultimoDia
  mejorFase: number; // el máximo de fases superadas en un día
  completadas: number; // cuántas veces ha superado todas las fases
};

// Los rangos, según las veces que has completado la escalera entera.
// Para añadir uno, ponlo en su sitio de la lista (de menos a más).
export const RANGOS = [
  { nombre: "Bronce", logo: "🥉", desde: 1 },
  { nombre: "Plata", logo: "🥈", desde: 5 },
  { nombre: "Oro", logo: "🥇", desde: 20 },
  { nombre: "Diamante", logo: "💎", desde: 100 },
];

// ---------------------------------------------------------------------------

const CLAVE = "verbum-estadisticas";
const VACIAS: Estadisticas = { ultimoDia: "", racha: 0, mejorFase: 0, completadas: 0 };

export function leerEstadisticas(): Estadisticas {
  try {
    return { ...VACIAS, ...JSON.parse(localStorage.getItem(CLAVE) ?? "{}") };
  } catch {
    return VACIAS;
  }
}

function guardarEstadisticas(e: Estadisticas) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(e));
  } catch {}
}

// El día anterior a una fecha "AAAA-MM-DD".
function diaAnterior(fecha: string): string {
  return new Date(Date.parse(fecha) - 86_400_000).toISOString().slice(0, 10);
}

// Apunta el resultado de la partida de hoy. Si ya estaba apuntado, no hace nada.
export function apuntarPartida(fecha: string, superadas: number, completada: boolean): Estadisticas {
  const e = leerEstadisticas();
  if (e.ultimoDia === fecha) return e;
  const nuevas: Estadisticas = {
    ultimoDia: fecha,
    racha: e.ultimoDia === diaAnterior(fecha) ? e.racha + 1 : 1,
    mejorFase: Math.max(e.mejorFase, superadas),
    completadas: e.completadas + (completada ? 1 : 0),
  };
  guardarEstadisticas(nuevas);
  return nuevas;
}

// La racha que se enseña hoy: si ayer no jugaste (ni hoy todavía), se ha roto.
export function rachaActual(e: Estadisticas, hoy: string): number {
  return e.ultimoDia === hoy || e.ultimoDia === diaAnterior(hoy) ? e.racha : 0;
}

// Tu rango actual (o ninguno) y el siguiente que puedes conseguir.
export function rangoDe(completadas: number) {
  const actual = RANGOS.findLast((r) => completadas >= r.desde);
  const siguiente = RANGOS.find((r) => completadas < r.desde);
  return { actual, siguiente };
}
