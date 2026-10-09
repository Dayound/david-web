// El teclado en pantalla, con la distribución española (con Ñ).
const FILAS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENVIAR", "Z", "X", "C", "V", "B", "N", "M", "BORRAR"],
];

export default function Teclado({
  onLetra,
  onBorrar,
  onEnviar,
}: {
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
            return (
              <button
                key={tecla}
                type="button"
                onClick={() =>
                  tecla === "ENVIAR" ? onEnviar() : tecla === "BORRAR" ? onBorrar() : onLetra(tecla)
                }
                aria-label={tecla === "BORRAR" ? "Borrar" : tecla === "ENVIAR" ? "Enviar" : tecla}
                className={`flex h-12 min-w-0 items-center justify-center rounded-md bg-zinc-200 font-semibold transition-colors hover:bg-zinc-300 active:bg-zinc-400 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 ${
                  especial ? "flex-[1.5] text-xs" : "flex-1 text-sm sm:text-base"
                }`}
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
