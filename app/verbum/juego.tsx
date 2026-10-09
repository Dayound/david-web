"use client";

import { useEffect, useState, useTransition } from "react";
import { comprobarIntento } from "./acciones";
import Tablero, { type Intento } from "./tablero";
import Teclado from "./teclado";
import { esLetra, normalizar, type Color } from "./texto";

const PRIORIDAD: Record<Color, number> = { gris: 1, amarillo: 2, verde: 3 };

// La partida: guarda lo que se va escribiendo y lo pasa al tablero.
// Funciona en el navegador porque tiene que reaccionar a cada tecla;
// para saber los colores le pregunta al servidor, que es quien sabe la palabra.
export default function Juego({
  fecha,
  intentos,
  letras,
}: {
  fecha: string;
  intentos: number;
  letras: number;
}) {
  const [enviados, setEnviados] = useState<Intento[]>([]);
  const [actual, setActual] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [comprobando, empezarComprobacion] = useTransition();

  const acertado = enviados.some((e) => e.colores.every((c) => c === "verde"));
  const terminado = acertado || enviados.length >= intentos;
  const bloqueado = terminado || comprobando;

  // El mejor color que ha sacado cada letra, para pintar el teclado.
  const coloresTeclado: Partial<Record<string, Color>> = {};
  for (const e of enviados) {
    e.colores.forEach((color, i) => {
      const letra = e.texto[i];
      const antes = coloresTeclado[letra];
      if (!antes || PRIORIDAD[color] > PRIORIDAD[antes]) coloresTeclado[letra] = color;
    });
  }

  function escribir(letra: string) {
    if (bloqueado) return;
    setMensaje("");
    setActual((a) => (a.length < letras ? a + letra : a));
  }

  function borrar() {
    if (bloqueado) return;
    setMensaje("");
    setActual((a) => a.slice(0, -1));
  }

  function enviar() {
    if (bloqueado) return;
    if (actual.length < letras) {
      setMensaje(`Faltan letras: la palabra tiene ${letras}.`);
      return;
    }
    const texto = actual;
    empezarComprobacion(async () => {
      const respuesta = await comprobarIntento(fecha, texto);
      if (!respuesta.ok) {
        setMensaje(respuesta.mensaje);
        return;
      }
      setEnviados((e) => [...e, { texto, colores: respuesta.colores }]);
      setActual("");
    });
  }

  // El teclado del ordenador: letras (con o sin tilde), Retroceso y Enter.
  useEffect(() => {
    function alPulsar(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        enviar();
      } else if (e.key === "Backspace") {
        borrar();
      } else {
        const letra = normalizar(e.key);
        if (esLetra(letra)) escribir(letra);
      }
    }
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  });

  return (
    <div className="flex flex-col gap-6">
      <Tablero intentos={intentos} letras={letras} enviados={enviados} actual={actual} />

      <p aria-live="polite" className="min-h-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {acertado
          ? "¡Acertaste!"
          : terminado
            ? "Has usado los seis intentos."
            : comprobando
              ? "Comprobando…"
              : mensaje}
      </p>

      <Teclado
        colores={coloresTeclado}
        onLetra={escribir}
        onBorrar={borrar}
        onEnviar={enviar}
      />
    </div>
  );
}
