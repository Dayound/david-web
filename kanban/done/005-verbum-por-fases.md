---
id: 005-verbum-por-fases
owner: claude
branch: feat/005-verbum-por-fases
status: done
created: 2026-10-11
updated: 2026-10-11
---

# VERBUM por fases

Convertir VERBUM en una escalera de palabras encadenadas, cada fase con un intento menos.

## Acceptance Criteria

1. La partida del día tiene varias fases: la 1.ª con 6 intentos, la 2.ª con 5... hasta la última con 1.
2. Cada palabra está relacionada con la anterior (ej.: pista "animales" → CEBRA → SABANA → ...).
3. Al acertar se pasa a la siguiente fase; las pistas de las fases anteriores siguen visibles.
4. Si fallas una fase, se acaba la partida del día.
5. Marcador personal (guardado en el navegador): racha de días, mejor fase y rango según las veces que has completado las 6 fases.

## Context / Notes

- Idea de David (2026-10-11, contada por voz). Amplía #002 (VERBUM, terminada).
- Ejemplo de David: fase 1, pista "animales", palabra CEBRA, 6 intentos. Fase 2, SABANA (relacionada con cebra), 5 intentos. Y así hasta 1 intento con todas las pistas anteriores a la vista.
- Reglas decididas por David (2026-10-11):
  - 6 fases al día, con 6, 5, 4, 3, 2 y 1 intentos.
  - Si fallas una fase, se acaba la partida del día. Tiene que ser difícil y retador.
  - Una sola pista temática para todo el día (ej.: "animales"). Cada palabra encaja en la temática y además se relaciona con la anterior (ej.: LEÓN → GACELA → ...).
  - Marcador personal de cada jugador: días seguidos jugando (racha), mejor fase alcanzada (su "top") y cuántas veces ha superado las 6 fases. Sin puntos.
  - Rangos con logo según las veces que has completado las 6 fases: bronce (1–4), plata (5–19), oro (20–99), diamante (100+). Se pueden añadir más.
  - El marcador personal se guarda solo en el navegador del jugador. Si algún día hay app, se verá un registro de usuarios.
- Las listas de palabras encadenadas las escribe David (como en #002).
- Esperar a la actualización de Jesús antes de empezar, para no tocar los mismos archivos.

## Checklist

- [x] Decidir las reglas principales
- [x] Resolver las dudas pendientes (rangos en vez de puntos; marcador en el navegador)
- [x] Escaleras de palabras (8 días × 6 palabras)
- [x] Fases en el juego: escalera, intentos que bajan, se acaba al fallar
- [x] Marcador personal (racha, mejor fase, rangos)

## Progress Notes

- 2026-10-11: Creada.
- 2026-10-11 (2): Reglas principales decididas por David (ver Context / Notes).
- 2026-10-11 (3): Rangos (bronce/plata/oro/diamante) en lugar de puntos x20. Marcador personal solo en el navegador.
- 2026-10-11 (4): Empezada en la rama feat/005-verbum-por-fases sin esperar a Jesús (David lo pidió). Primer paso: David escribe las escaleras de 6 palabras en palabras.ts.
- 2026-10-11 (5): Fases programadas. palabras.ts pasa a { pista, palabras: [...] } (las de David quedan como fase 1; la escalera de "animales" es PROVISIONAL de Claude, para probar). El servidor comprueba la palabra de cada fase; al navegador solo llegan las longitudes. Escalera arriba, botón "Siguiente fase", fin de partida al fallar. tsc y lint OK. Falta que David lo pruebe.
- 2026-10-11 (6): David pasó sus escaleras como ejemplo y dio libertad para mejorarlas. Claude las completó: 8 días × 6 palabras, todas de 5–8 letras (comprobado). Se mantiene el orden de los días; hoy toca "animales".
- 2026-10-11 (7): Probado por David: funciona bien. Siguiente: marcador personal.
- 2026-10-11 (8): Marcador personal programado (estadisticas.ts + marcador.tsx), guardado en localStorage "verbum-estadisticas". Se apunta al terminar la partida (una vez por día). Racha, mejor fase, escaleras completas y rango con logo (emoji provisional). Lógica probada con un script: racha, día repetido, día saltado y límites de los rangos. Falta que David lo pruebe.
- 2026-10-11 (9): Marcador probado por David: funciona. Pide darle más protagonismo y ponerlo arriba.
- 2026-10-11 (10): Marcador convertido en insignia con los colores del rango y movido arriba del todo (antes de la pista). Probado por David. Idea de compartir apuntada aparte en #006.
- 2026-10-11 (11): CERRADA. Build OK. A petición de David (estaba cenando) se fusionó en local en main y se subió, sin PR. Practicar el PR desde GitHub queda para la próxima.
