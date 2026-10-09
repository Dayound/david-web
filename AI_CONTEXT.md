# AI_CONTEXT — david-web

## Qué es

Web personal de David Villalba: quién es, qué hace, sus ideas de juegos
(VERBUM, App HIIT, WHAT IF?) y un marcador público con el top 10.
También es su campo de prácticas para aprender a construir con Claude
y el ciclo completo: kanban → rama → Pull Request → despliegue.

- Producción: https://david-web-xzo2.vercel.app
- Repo: GitHub `Dayound/david-web`

## Stack

- Next.js 16.4 (App Router, Cache Components: `"use cache"`, `cacheTag`, `updateTag`) + React 19.3
- TypeScript, Tailwind CSS v4
- Supabase (tabla `puntuaciones`) mediante `@supabase/supabase-js`
- Vercel: despliegue automático desde `main`; cada rama tiene vista previa (pide iniciar sesión en Vercel)

## Estructura

- `app/page.tsx` — portada (cabecera, Qué hago, ideas de juegos, enlace al marcador, contacto)
- `app/layout.tsx` — layout raíz, fuentes Geist, script de tema inicial sin parpadeo
- `app/boton-tema.tsx` — botón claro/oscuro (cliente, guarda en `localStorage`)
- `app/marcador/` — página del marcador: `datos.ts` (lee top 10 con caché), `acciones.ts` (server action que guarda), `formulario.tsx` (cliente)
- `app/lib/supabase.ts` — cliente de Supabase

## Variables de entorno

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — en `.env.local` y en Vercel.

## Comandos

- `npm run dev` — localhost:3000
- `npm run build`, `npm run lint`, `npx tsc --noEmit`

## Forma de trabajar

- David está aprendiendo: vamos paso a paso y explicando el porqué.
- Los textos personales de la web los escribe David, no Claude.
- La interfaz, el código comentado y los mensajes van en español.
- David abre y fusiona los PR desde la web de GitHub.
