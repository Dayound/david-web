"use client";

import { useActionState } from "react";
import { guardarPuntuacion, type Estado } from "./acciones";

const estadoInicial: Estado = { ok: false, mensaje: "" };

// La sala: el formulario que ve el jugador. Al pulsar "Enviar",
// manda los datos a la cocina (guardarPuntuacion) y enseña la respuesta.
export default function Formulario() {
  const [estado, enviar, enviando] = useActionState(guardarPuntuacion, estadoInicial);

  return (
    <form action={enviar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        Nombre
        <input
          name="nombre"
          required
          maxLength={30}
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base dark:border-white/20"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm sm:w-32">
        Puntos
        <input
          name="puntos"
          type="number"
          required
          min={0}
          max={1000000}
          step={1}
          className="rounded-lg border border-black/15 bg-transparent px-3 py-2 text-base dark:border-white/20"
        />
      </label>
      <button
        disabled={enviando}
        className="rounded-lg bg-foreground px-4 py-2 font-medium text-background transition-opacity disabled:opacity-50"
      >
        {enviando ? "Enviando…" : "Enviar"}
      </button>
      {estado.mensaje && (
        <p
          aria-live="polite"
          className={`text-sm sm:basis-full ${estado.ok ? "text-green-600" : "text-red-600"}`}
        >
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
