---
id: 004-revisar-rls-supabase
owner: claude
branch: fix/004-revisar-rls-supabase
status: done
created: 2026-10-09
updated: 2026-10-11
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

- [x] Mirar con David las políticas de la tabla en el panel de Supabase

## Progress Notes

- 2026-10-09: Creada.
- 2026-10-11: Empezada en la rama fix/004-revisar-rls-supabase. Primer paso: mirar con David las políticas en el panel de Supabase.
- 2026-10-11 (2): CERRADA. En el panel de Supabase: RLS activado en puntuaciones, con solo dos políticas (SELECT e INSERT para anon y authenticated). Sin políticas de UPDATE ni DELETE, así que están bloqueados. Comprobado que la lectura con la llave publishable funciona (HTTP 200). No ha hecho falta cambiar nada.
