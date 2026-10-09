---
id: 002-verbum
owner: claude
branch: feat/002-verbum
status: doing
created: 2026-10-09
updated: 2026-10-09
---

# VERBUM: una palabra al día, seis intentos

Primer juego de la web (Nivel 1): adivinar la palabra del día en seis intentos.

## Acceptance Criteria

1. Hay una página `/verbum` enlazada desde la tarjeta de la portada.
2. Se puede jugar una partida completa: escribir intentos, ver pistas por letra (bien colocada / está en otro sitio / no está) y ganar o perder en seis intentos.
3. La palabra cambia cada día y es la misma para todos los jugadores.
4. Funciona en el móvil y en modo claro y oscuro.
5. Está publicado en https://david-web-xzo2.vercel.app/verbum

## Context / Notes

- Frase de la portada: "Una palabra al día, seis intentos. Abrir, jugar, descubrir la palabra."
- Reglas decididas por David (2026-10-09):
  - La palabra tiene **entre 5 y 8 letras** y cambia según el día. El tablero se adapta a la longitud.
  - Cada día tiene una **temática / pista** visible (ej.: pista "natural" → palabra ARBOL).
  - Se **ignoran las tildes** (ÁRBOL = ARBOL). La **Ñ es una letra propia**.
  - De momento no se comprueba que el intento sea una palabra real. **En el futuro sí.**
  - La partida **se guarda** al recargar (en el navegador).
  - Marcador: se decide más adelante.
- La palabra del día se elige por fecha (hora de España), así es la misma para todos.
- Nota para el futuro: si la palabra viaja al navegador, se puede ver mirando el código. Cuando se compruebe que el intento es una palabra real, se puede mover la comprobación al servidor.

## Checklist

- [x] Decidir las reglas
- [x] Lista de palabras con su pista (`app/verbum/palabras.ts`) y elección de la del día
- [x] Tablero: 6 filas × N letras, con la pista arriba
- [x] Teclado en pantalla (con Ñ) + teclado físico
- [x] Comprobar un intento: verde / amarillo / gris, con letras repetidas bien contadas
- [x] Mensaje de victoria / derrota
- [ ] Guardar la partida del día en el navegador
- [ ] Enlace desde la tarjeta VERBUM de la portada
- [ ] Probar en móvil y modo claro/oscuro, PR y publicar

## Progress Notes

- 2026-10-09: Creada.
- 2026-10-09 (2): Reglas decididas por David (ver Context / Notes). Tarea partida en pasos.
- 2026-10-09 (3): Empezada en la rama feat/002-verbum. Primer paso: David escribe la lista de palabras y pistas en app/verbum/palabras.ts.
- 2026-10-09 (4): Lista de 8 retos escrita por David en app/verbum/palabras.ts (todas de 5–8 letras, revisadas). retoDelDia() elige el reto por fecha en hora de España; probado el cambio a medianoche.
- 2026-10-09 (5): Tablero (6 filas × N casillas, se adapta a 5–8 letras) y teclado (pantalla con Ñ + teclado físico, tildes ignoradas). Probado por David en localhost. La palabra nunca llega al navegador: solo pista y longitud; palabras.ts lleva `import "server-only"` y normalizar() se movió a texto.ts. La comprobación de intentos se hará en el servidor.
- 2026-10-09 (6): Colores verde/amarillo/gris calculados en el servidor (server action comprobarIntento, devuelve solo colores). Letras repetidas contadas bien, probado. El teclado también se pinta. Probado por David.
- 2026-10-09 (7): Mensaje final arriba del tablero: "¡Acertaste!" con intentos usados, o "¡Casi!" con la palabra (el servidor solo la envía tras fallar el 6º intento). Textos provisionales escritos por Claude, David puede cambiarlos en MensajeFinal (juego.tsx).
