# Kanban

## Structure

```
kanban/
  backlog/       ← tasks not yet started
  doing/         ← active (1-3 max at a time)
  done/          ← completed tasks (keep for reference)
```

Each task is a single `.md` file. Naming: `{id}-{slug}.md` (e.g., `06-google-oauth.md`).

---

## Task template

```markdown
---
id: {slug}
owner: claude          # claude | gemini | codex | self
branch: feat/{slug}    # git branch (set when moving to doing)
status: backlog        # backlog | doing | done
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Task Title

One-line description of what this task achieves.

## Acceptance Criteria

1. Clear, testable condition

## Context / Notes

Background, links, decisions, constraints.

## Checklist

- [ ] Step 1

## Progress Notes

- YYYY-MM-DD: Created.
```

---

## Workflow

1. **Add task:** Create `.md` in `backlog/`. Set `status: backlog`, `created` date.
2. **Start task:** Move file to `doing/`. Update `status: doing`, set `branch`, update `updated`. Create git branch.
3. **Finish task:** Move file to `done/`. Update `status: done`, `updated`. Add final progress note.

---

## Rules

- One task, one file.
- Max 1-3 tasks in `doing/` at any time.
- Don't delete `done/` tasks — they're reference.
- Update `updated` date every time you touch a task.
- Progress Notes are append-only — add new entries, never overwrite.
- Logs live here in Progress Notes. There is no separate LOG.md.
