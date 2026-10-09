"use client";

import { useEffect, useState } from "react";
import Tablero from "./tablero";
import Teclado from "./teclado";
import { esLetra, normalizar } from "./texto";

// La partida: guarda lo que se va escribiendo y lo pasa al tablero.
// Funciona en el navegador porque tiene que reaccionar a cada tecla.
export default function Juego({ intentos, letras }: { intentos: number; letras: number }) {
  const [enviados, setEnviados] = useState<string[]>([]);
  const [actual, setActual] = useState("");
  const [mensaje, setMensaje] = useState("");

  const terminado = enviados.length >= intentos;

  function escribir(letra: string) {
    if (terminado) return;
    setMensaje("");
    setActual((a) => (a.length < letras ? a + letra : a));
  }

  function borrar() {
    if (terminado) return;
    setMensaje("");
    setActual((a) => a.slice(0, -1));
  }

  function enviar() {
    if (terminado) return;
    if (actual.length < letras) {
      setMensaje(`Faltan letras: la palabra tiene ${letras}.`);
      return;
    }
    // Próximo paso: aquí se comprobará el intento y se pintarán los colores.
    setEnviados((e) => [...e, actual]);
    setActual("");
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
        {terminado ? "Has usado los seis intentos." : mensaje}
      </p>

      <Teclado onLetra={escribir} onBorrar={borrar} onEnviar={enviar} />
    </div>
  );
}
