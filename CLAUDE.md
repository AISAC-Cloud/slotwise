# CLAUDE.md

## Project

slotwise is a multi-tenant subscription scheduling platform for service businesses (barbershops, clinics,
studios). It is the capstone of a course and grows module by module; most of the system does not exist yet.
Read `docs/domain.md` before designing anything: it defines the bounded contexts and the invariants the code
must protect.

## Commands

Node >= 22, ESM (`"type": "module"`). No build step and no linter yet.

```bash
npm run test                         # vitest run (all src/**/*.test.ts)
npm run test -- overlap              # single test file (filter by path)
npm run test -- overlap -t "half-open"  # single test by name
npm run typecheck                    # tsc --noEmit
```

`npm run test *` is pre-allowed in `.claude/settings.json`; prefer it over invoking `npx vitest` directly.
`git push` requires confirmation, and `.env` files must not be read.

## Architecture

- Code is organized by bounded context under `src/<context>/` (Scheduling, Customers, Billing, Notifications).
  Each context has its own vocabulary for the same appointment (booking / visit / charge / reminder); keep
  those terms inside their context rather than sharing one model.
- Domain rules are pure functions: no I/O, no clock, no tenant lookup. They answer "is this allowed?" for
  the data they are given. Concurrency (two simultaneous bookings), tenant isolation, and idempotent payment
  processing are explicitly *not* handled there; they belong to the persistence/infrastructure layers still to
  be built. `src/scheduling/overlap.ts` is the reference example of this split.
- Time intervals are half-open `[start, end)`: back-to-back bookings do not overlap. Invalid intervals
  (NaN dates, `end <= start`) throw `RangeError`. A booking never conflicts with itself (same `id`), which
  is how rescheduling is checked.

## TypeScript conventions

`tsconfig.json` is strict beyond `strict: true`, which affects how code must be written:

- `module: nodenext` + `verbatimModuleSyntax`: relative imports need the `.js` extension
  (`./overlap.js`), and type-only imports must use `import type` / `type` specifiers.
- `noUncheckedIndexedAccess`: indexed access yields `T | undefined`; narrow before use.
- `exactOptionalPropertyTypes`: don't assign `undefined` to an optional property; omit it instead.
- `noUnusedLocals` / `noUnusedParameters` are errors.

## Domain

@docs/domain.md
