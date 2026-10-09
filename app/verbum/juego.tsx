"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { comprobarIntento } from "./acciones";
import Tablero, { type Intento } from "./tablero";
import Teclado from "./teclado";
import { esLetra, INTENTOS, normalizar, type Color } from "./texto";

const PRIORIDAD: Record<Color, number> = { gris: 1, amarillo: 2, verde: 3 };

// La partida guardada en el navegador (localStorage), una sola: la de hoy.
type Partida = { fecha: string; enviados: Intento[]; palabra: string };
const CLAVE = "verbum-partida";

function leerPartida(): Partida | null {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "null");
  } catch {
    return null; // modo privado, datos rotos…: se empieza de cero
  }
}

function guardarPartida(partida: Partida) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(partida));
  } catch {}
}

// La partida guardada solo sirve si es de hoy (y de esta palabra):
// la de otro día se ignora, porque hoy toca otra palabra.
function partidaDeHoy(fecha: string, letras: number): Partida {
  const guardada = leerPartida();
  if (guardada?.fecha === fecha && guardada.enviados.every((e) => e.texto.length === letras)) {
    return guardada;
  }
  return { fecha, enviados: [], palabra: "" };
}

const sinCambios = () => () => {};

type Props = { fecha: string; intentos: number; letras: number };

// El servidor no puede ver el localStorage del navegador, así que primero
// pinta el tablero vacío y, ya en el navegador, carga la partida guardada.
export default function Juego(props: Props) {
  const enNavegador = useSyncExternalStore(sinCambios, () => true, () => false);
  if (!enNavegador) {
    return (
      <div className="flex flex-col gap-6">
        <Tablero intentos={props.intentos} letras={props.letras} enviados={[]} actual="" />
        <p className="min-h-6" />
        <Teclado colores={{}} onLetra={() => {}} onBorrar={() => {}} onEnviar={() => {}} />
      </div>
    );
  }
  return <Partida {...props} />;
}

// La partida: guarda lo que se va escribiendo y lo pasa al tablero.
// Funciona en el navegador porque tiene que reaccionar a cada tecla;
// para saber los colores le pregunta al servidor, que es quien sabe la palabra.
function Partida({ fecha, intentos, letras }: Props) {
  const [enviados, setEnviados] = useState(() => partidaDeHoy(fecha, letras).enviados);
  const [palabra, setPalabra] = useState(() => partidaDeHoy(fecha, letras).palabra); // solo llega si se pierde
  const [actual, setActual] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [comprobando, empezarComprobacion] = useTransition();

  const acertado = enviados.some((e) => e.colores.every((c) => c === "verde"));
  const terminado = acertado || enviados.length >= intentos;
  const bloqueado = terminado || comprobando;

  // Cada vez que se envía un intento, la partida se guarda en el navegador.
  useEffect(() => {
    guardarPartida({ fecha, enviados, palabra });
  }, [fecha, enviados, palabra]);

  // El mejor color que ha sacado cada letra, para pintar el teclado.
  const coloresTeclado: Partial<Record<string, Color>> = {};
  for (const e of enviados) {
    e.colores.forEach((color, i) => {
      const letra = e.texto[i];
      const antes = coloresTeclado[letra];
      if (!antes || PRIORIDAD[color] > PRIORIDAD[antes]) coloresTeclado[letra] = color;
    });
  }

  // Al escribir la última letra de la fila, el intento se envía solo.
  function escribir(letra: string) {
    if (bloqueado || actual.length >= letras) return;
    setMensaje("");
    const texto = actual + letra;
    setActual(texto);
    if (texto.length === letras) enviar(texto);
  }

  function borrar() {
    if (bloqueado) return;
    setMensaje("");
    setActual((a) => a.slice(0, -1));
  }

  // ENVIAR sigue sirviendo para reintentar si algo falló (por ejemplo, sin conexión).
  function enviar(texto = actual) {
    if (bloqueado) return;
    if (texto.length < letras) {
      setMensaje(`Faltan letras: la palabra tiene ${letras}.`);
      return;
    }
    const numero = enviados.length + 1;
    empezarComprobacion(async () => {
      const respuesta = await comprobarIntento(fecha, texto, numero);
      if (!respuesta.ok) {
        setMensaje(respuesta.mensaje);
        return;
      }
      setEnviados((e) => [...e, { texto, colores: respuesta.colores }]);
      setActual("");
      if (respuesta.palabra) setPalabra(respuesta.palabra);
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
      {terminado && (
        <MensajeFinal acertado={acertado} usados={enviados.length} palabra={palabra} />
      )}

      <Tablero intentos={intentos} letras={letras} enviados={enviados} actual={actual} />

      {!terminado && (
        <p aria-live="polite" className="min-h-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {comprobando ? "Comprobando…" : mensaje}
        </p>
      )}

      <Teclado
        colores={coloresTeclado}
        onLetra={escribir}
        onBorrar={borrar}
        onEnviar={enviar}
      />
    </div>
  );
}

// El cartel del final de la partida: has ganado (y en cuántos intentos)
// o has perdido (y cuál era la palabra).
function MensajeFinal({
  acertado,
  usados,
  palabra,
}: {
  acertado: boolean;
  usados: number;
  palabra: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border-2 p-5 text-center ${
        acertado ? "border-green-600" : "border-black/15 dark:border-white/20"
      }`}
    >
      <p className="text-2xl font-semibold tracking-tight">
        {acertado ? "¡Acertaste!" : "¡Casi!"}
      </p>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {acertado ? (
          usados === 1 ? (
            "A la primera. Impresionante."
          ) : (
            `Lo has descubierto en ${usados} de ${INTENTOS} intentos.`
          )
        ) : (
          <>
            La palabra era{" "}
            <span className="font-bold tracking-widest text-foreground">{palabra}</span>.
          </>
        )}
      </p>
      <p className="mt-3 text-sm text-zinc-500">Vuelve mañana para un nuevo reto.</p>
    </div>
  );
}
