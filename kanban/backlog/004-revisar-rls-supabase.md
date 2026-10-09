---
id: 004-revisar-rls-supabase
owner: claude
branch:
status: backlog
created: 2026-10-09
updated: 2026-10-09
---

# Revisar la seguridad (RLS) de la tabla puntuaciones

Comprobar que en Supabase nadie puede borrar ni cambiar puntuaciones, solo añadir y leer.

## Acceptance Criteria

1. La tabla `puntuaciones` tiene RLS activado.
2. Con la llave publishable solo se puede leer (SELECT) e insertar (INSERT), no actualizar ni borrar.

## Context / Notes

- El marcador escribe en Supabase con la llave publishable (`app/lib/supabase.ts`), así que la única protección de la tabla son las reglas RLS.
- Detectado al crear `architecture.md` (2026-10-09).

## Checklist

- [ ] Mirar con David las políticas de la tabla en el panel de Supabase

## Progress Notes

- 2026-10-09: Creada.
