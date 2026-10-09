// El tablero: una fila por intento y una casilla por letra.
// De momento está vacío; en el siguiente paso se rellenará al escribir.
export default function Tablero({
  intentos,
  letras,
}: {
  intentos: number;
  letras: number;
}) {
  return (
    <div
      className="mx-auto grid w-full gap-1.5"
      // Cada casilla mide como mucho 3.5rem: con 5 letras el tablero es más
      // estrecho y con 8 más ancho, pero siempre cabe en un móvil.
      style={{ maxWidth: `${letras * 3.5 + (letras - 1) * 0.375}rem` }}
    >
      {Array.from({ length: intentos }, (_, fila) => (
        <div
          key={fila}
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${letras}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: letras }, (_, columna) => (
            <div
              key={columna}
              className="flex aspect-square items-center justify-center rounded-md border-2 border-black/15 text-2xl font-bold uppercase dark:border-white/20"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
