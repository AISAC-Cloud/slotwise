---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

I added a limit on how far ahead people can book, in src/scheduling/working-hours.ts. Tests pass. Anything I should know before I commit?

```ts
export function fitsWorkingHours(booking: TimeInterval, week: WorkingWeek): boolean {
  assertValidInterval(booking);
  const hours = week[booking.start.getUTCDay() as Weekday];
  if (!hours) return false;
  if (booking.start.getTime() > new Date().getTime() + MAX_AHEAD_MS) return false;
  const midnight = Date.UTC(booking.start.getUTCFullYear(), booking.start.getUTCMonth(), booking.start.getUTCDate());
  const open = midnight + minutesOfDay(hours.open) * MS_PER_MINUTE;
  const close = midnight + minutesOfDay(hours.close) * MS_PER_MINUTE;
  return open <= booking.start.getTime() && booking.end.getTime() <= close;
}
```
