import type { Color } from "./texto";

export type Intento = { texto: string; colores: Color[] };

// Cómo se pinta cada casilla (y cada tecla) según su color.
export const ESTILO_COLOR: Record<Color, string> = {
  verde: "border-transparent bg-green-600 text-white",
  amarillo: "border-transparent bg-yellow-500 text-white",
  gris: "border-transparent bg-zinc-300 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-100",
};

// El tablero: una fila por intento y una casilla por letra.
// Las filas ya enviadas (con colores), la que se está escribiendo y las vacías.
export default function Tablero({
  intentos,
  letras,
  enviados,
  actual,
}: {
  intentos: number;
  letras: number;
  enviados: Intento[];
  actual: string;
}) {
  return (
    <div
      className="mx-auto grid w-full gap-1.5"
      // Cada casilla mide como mucho 3.5rem: con 5 letras el tablero es más
      // estrecho y con 8 más ancho, pero siempre cabe en un móvil.
      style={{ maxWidth: `${letras * 3.5 + (letras - 1) * 0.375}rem` }}
    >
      {Array.from({ length: intentos }, (_, fila) => {
        const enviado = enviados[fila];
        const texto = enviado ? enviado.texto : fila === enviados.length ? actual : "";
        return (
          <div
            key={fila}
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${letras}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: letras }, (_, columna) => {
              const letra = texto[columna] ?? "";
              const estilo = enviado
                ? ESTILO_COLOR[enviado.colores[columna]]
                : letra
                  ? "border-black/40 dark:border-white/50"
                  : "border-black/15 dark:border-white/20";
              return (
                <div
                  key={columna}
                  className={`flex aspect-square items-center justify-center rounded-md border-2 text-xl font-bold uppercase transition-colors sm:text-2xl ${estilo}`}
                >
                  {letra}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
