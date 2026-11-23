# Domain rule checklist

The long version of the review, opened only when a change touches intervals, errors or tests.

## Purity

- No I/O, no clock, no tenant lookup inside a rule. `Date.now()`, `new Date()` with no argument and `performance.now()` are clock reads.
- Time comes in as a parameter (`now: Date`). `new Date(value)` with an argument is a conversion, not a clock read.
- Concurrency, tenant isolation and idempotency do not belong in a rule; they live in the persistence layer.

## Intervals

- Half-open `[start, end)`: `a.start < b.end && b.start < a.end` is the overlap test.
- A booking may start at opening and end exactly at closing; `<=` on the end is right, `<` on the end is a bug.
- Back-to-back bookings do not overlap.
- A booking that runs past midnight ends after closing, so it never fits a day.

## Errors

- An invalid interval (NaN date, `end <= start`) throws a `RangeError` through `assertValidInterval`.
- Every `RangeError` message names the offending value.
- No `return false` for bad input: a rule answers "is this allowed?" only for valid data.

## Identity

- A booking never conflicts with itself (same `id`); this is how a reschedule is checked.

## Tests

- One test on each side of every limit: just inside, exactly on it, just outside.
- Tests that need "now" pass it in; no fake timers in a pure rule.
- Tests are not changed to make a rule pass.
