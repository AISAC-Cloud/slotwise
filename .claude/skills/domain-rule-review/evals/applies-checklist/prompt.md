---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

Review this scheduling rule for me, it is in src/scheduling/cancellation.ts:

```ts
export function canCancelFreeOfCharge(booking: TimeInterval, windowHours: number): boolean {
  const now = Date.now();
  return booking.start.getTime() - now > windowHours * MS_PER_HOUR;
}
```
