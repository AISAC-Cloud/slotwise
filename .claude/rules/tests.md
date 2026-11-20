---
paths:
  - "src/**/*.test.ts"
---

# Tests

- Use Vitest: import `describe`, `it` and `expect` from "vitest".
- One behavior per test, named in plain English ("rejects a booking that overlaps another").
- Bookings in tests use fixed UTC instants, never the current time.
