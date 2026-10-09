# Architecture

## Overview

Web personal en **Next.js 16.4 (App Router) + React 19.3**, TypeScript y Tailwind CSS v4, desplegada en **Vercel** (producción desde `main`, vista previa por rama).

- **Portada** (`/`): página estática con componentes de servidor; el único componente de cliente es el botón de tema.
- **Tema claro/oscuro**: clase `dark` en `<html>`, elegida antes de pintar con un script `beforeInteractive` y guardada en `localStorage`.
- **Marcador** (`/marcador`): lee el top 10 de **Supabase** (tabla `puntuaciones`) con `"use cache"` + `cacheTag("marcador")`; las puntuaciones nuevas entran por una **server action** (`guardarPuntuacion`), que valida en el servidor y llama a `updateTag("marcador")`.
- Sin API routes propias, sin autenticación. Se escribe en Supabase con la llave publishable, así que lo que protege la tabla es la RLS de Supabase.

---

## Changelog

<!-- AI appends here during work. Cleared when map is regenerated. -->
- 2026-10-09: Nueva página /verbum (Juego, Tablero, Teclado como componentes de cliente; retoDelDia con io() en servidor) + server action comprobarIntento (lee palabras.ts, server-only). Portada enlaza a /verbum. Partida guardada en localStorage.

---

## Architecture Map

Interactive visualization: open `architecture/map.html` in a browser.

Data source: `architecture/data.json`

### Data Schema

The `data.json` file follows this structure:

```
meta            — project name, last updated date, stack list
components      — system component groups + edges between them
  groups[]      — { name, color, nodes[] }
  edges[]       — { from, to, label? }
dataModel       — database entities + relationships
  entities[]    — { name, fields[{ name, type, constraint? }] }
  relationships[] — { from, to, type, label }
apiRoutes       — API endpoint groups
  groups[]      — { name, routes[{ method, path, description }] }
```

### Regeneration

When the user says "update the map":
1. Read the changelog entries above.
2. Scan relevant source files for current state.
3. Update `architecture/data.json` with the current architecture.
4. Regenerate `architecture/map.html` with the updated data embedded.
5. Clear the changelog.
6. Show the user what changed.
