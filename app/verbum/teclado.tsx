import { ESTILO_COLOR } from "./tablero";
import type { Color } from "./texto";

// El teclado en pantalla, con la distribución española (con Ñ).
const FILAS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENVIAR", "Z", "X", "C", "V", "B", "N", "M", "BORRAR"],
];

const SIN_USAR =
  "bg-zinc-200 hover:bg-zinc-300 active:bg-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600";

export default function Teclado({
  colores,
  onLetra,
  onBorrar,
  onEnviar,
}: {
  colores: Partial<Record<string, Color>>; // el mejor color que ha sacado cada letra
  onLetra: (letra: string) => void;
  onBorrar: () => void;
  onEnviar: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-1.5">
      {FILAS.map((fila, i) => (
        <div key={i} className="flex gap-1">
          {fila.map((tecla) => {
            const especial = tecla === "ENVIAR" || tecla === "BORRAR";
            const color = colores[tecla];
            return (
              <button
                key={tecla}
                type="button"
                onClick={() =>
                  tecla === "ENVIAR" ? onEnviar() : tecla === "BORRAR" ? onBorrar() : onLetra(tecla)
                }
                aria-label={tecla === "BORRAR" ? "Borrar" : tecla === "ENVIAR" ? "Enviar" : tecla}
                className={`flex h-12 min-w-0 items-center justify-center rounded-md font-semibold transition-colors ${
                  color ? ESTILO_COLOR[color] : SIN_USAR
                } ${especial ? "flex-[1.5] text-xs" : "flex-1 text-sm sm:text-base"}`}
              >
                {tecla === "BORRAR" ? "⌫" : tecla}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
