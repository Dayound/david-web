"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { comprobarIntento } from "./acciones";
import Tablero, { type Intento } from "./tablero";
import Teclado from "./teclado";
import { esLetra, intentosDeFase, normalizar, type Color } from "./texto";

const PRIORIDAD: Record<Color, number> = { gris: 1, amarillo: 2, verde: 3 };

// La partida guardada en el navegador (localStorage), una sola: la de hoy.
// fase: en la que estás (1, 2, …) · resueltas: las palabras de las fases ya superadas
// enviados: los intentos de la fase actual · palabra: solo llega si se pierde
type Partida = {
  fecha: string;
  fase: number;
  resueltas: string[];
  enviados: Intento[];
  palabra: string;
};
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

// La partida guardada solo sirve si es de hoy (y de estas palabras):
// la de otro día, o la del VERBUM de antes de las fases, se ignora.
function partidaDeHoy(fecha: string, letras: number[]): Partida {
  const g = leerPartida();
  if (
    g?.fecha === fecha &&
    Array.isArray(g.resueltas) &&
    g.fase >= 1 &&
    g.fase <= letras.length &&
    g.enviados.every((e) => e.texto.length === letras[g.fase - 1])
  ) {
    return g;
  }
  return { fecha, fase: 1, resueltas: [], enviados: [], palabra: "" };
}

const sinCambios = () => () => {};

// letras: cuántas letras tiene la palabra de cada fase (una por fase)
type Props = { fecha: string; letras: number[] };

// El servidor no puede ver el localStorage del navegador, así que primero
// pinta el tablero vacío y, ya en el navegador, carga la partida guardada.
export default function Juego(props: Props) {
  const enNavegador = useSyncExternalStore(sinCambios, () => true, () => false);
  if (!enNavegador) {
    return (
      <div className="flex flex-col gap-6">
        <Escalera total={props.letras.length} fase={1} resueltas={[]} />
        <Tablero intentos={intentosDeFase(1)} letras={props.letras[0]} enviados={[]} actual="" />
        <p className="min-h-6" />
        <Teclado colores={{}} onLetra={() => {}} onBorrar={() => {}} onEnviar={() => {}} />
      </div>
    );
  }
  return <Partida {...props} />;
}

// La partida: guarda lo que se va escribiendo y lo pasa al tablero.
// Funciona en el navegador porque tiene que reaccionar a cada tecla;
// para saber los colores le pregunta al servidor, que es quien sabe las palabras.
function Partida({ fecha, letras: letrasPorFase }: Props) {
  const [partida, setPartida] = useState(() => partidaDeHoy(fecha, letrasPorFase));
  const [actual, setActual] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [comprobando, empezarComprobacion] = useTransition();

  const { fase, resueltas, enviados, palabra } = partida;
  const total = letrasPorFase.length;
  const letras = letrasPorFase[fase - 1];
  const intentos = intentosDeFase(fase);

  const filaGanadora = enviados.find((e) => e.colores.every((c) => c === "verde"));
  const perdido = !filaGanadora && enviados.length >= intentos;
  const completado = !!filaGanadora && fase === total;
  const faseSuperada = !!filaGanadora && fase < total; // esperando a pasar a la siguiente
  const bloqueado = perdido || completado || faseSuperada || comprobando;

  // Cada cambio en la partida se guarda en el navegador.
  useEffect(() => {
    guardarPartida(partida);
  }, [partida]);

  // El mejor color que ha sacado cada letra en esta fase, para pintar el teclado.
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
      const respuesta = await comprobarIntento(fecha, fase, texto, numero);
      if (!respuesta.ok) {
        setMensaje(respuesta.mensaje);
        return;
      }
      setPartida((p) => ({
        ...p,
        enviados: [...p.enviados, { texto, colores: respuesta.colores }],
        palabra: respuesta.palabra ?? p.palabra,
      }));
      setActual("");
    });
  }

  // Pasa a la fase siguiente: la palabra acertada se apunta en la escalera.
  function siguienteFase() {
    if (!filaGanadora) return;
    setPartida((p) => ({
      ...p,
      fase: p.fase + 1,
      resueltas: [...p.resueltas, filaGanadora.texto],
      enviados: [],
    }));
    setMensaje("");
  }

  // El teclado del ordenador: letras (con o sin tilde), Retroceso y Enter.
  useEffect(() => {
    function alPulsar(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (faseSuperada) siguienteFase();
        else enviar();
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
      <Escalera total={total} fase={fase} resueltas={resueltas} />

      {(perdido || completado) && (
        <MensajeFinal completado={completado} fase={fase} total={total} palabra={palabra} />
      )}

      {faseSuperada && (
        <div role="status" className="rounded-xl border-2 border-green-600 p-5 text-center">
          <p className="text-2xl font-semibold tracking-tight">¡Fase {fase} superada!</p>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            La siguiente tiene un intento menos: {intentosDeFase(fase + 1)}.
          </p>
          <button
            type="button"
            onClick={siguienteFase}
            className="mt-4 rounded-lg bg-foreground px-5 py-2.5 font-semibold text-background hover:opacity-90"
          >
            Siguiente fase →
          </button>
        </div>
      )}

      <p className="text-center text-sm text-zinc-500">
        Fase {fase} de {total} · {letras} letras · {intentos}{" "}
        {intentos === 1 ? "intento" : "intentos"}
      </p>

      <Tablero intentos={intentos} letras={letras} enviados={enviados} actual={actual} />

      {!bloqueado && (
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

// La escalera del día: las palabras ya acertadas, la fase actual y las que faltan.
function Escalera({
  total,
  fase,
  resueltas,
}: {
  total: number;
  fase: number;
  resueltas: string[];
}) {
  if (total === 1) return null; // un día de una sola palabra no tiene escalera
  return (
    <ol className="flex flex-wrap justify-center gap-2 text-sm font-semibold tracking-widest">
      {Array.from({ length: total }, (_, i) => {
        const resuelta = resueltas[i];
        const estilo = resuelta
          ? "border-transparent bg-green-600 text-white"
          : i === fase - 1
            ? "border-foreground"
            : "border-black/15 text-zinc-400 dark:border-white/20";
        return (
          <li key={i} className={`rounded-md border-2 px-2.5 py-1 ${estilo}`}>
            {resuelta ?? i + 1}
          </li>
        );
      })}
    </ol>
  );
}

// El cartel del final de la partida: has completado la escalera
// o te has quedado en una fase (y cuál era la palabra).
function MensajeFinal({
  completado,
  fase,
  total,
  palabra,
}: {
  completado: boolean;
  fase: number;
  total: number;
  palabra: string;
}) {
  return (
    <div
      role="status"
      className={`rounded-xl border-2 p-5 text-center ${
        completado ? "border-green-600" : "border-black/15 dark:border-white/20"
      }`}
    >
      <p className="text-2xl font-semibold tracking-tight">
        {completado ? "¡Escalera completa!" : "¡Casi!"}
      </p>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {completado ? (
          total === 1 ? "Lo has descubierto." : `Has superado las ${total} fases.`
        ) : (
          <>
            {total > 1 && `Te has quedado en la fase ${fase} de ${total}. `}
            La palabra era{" "}
            <span className="font-bold tracking-widest text-foreground">{palabra}</span>.
          </>
        )}
      </p>
      <p className="mt-3 text-sm text-zinc-500">Vuelve mañana para un nuevo reto.</p>
    </div>
  );
}
