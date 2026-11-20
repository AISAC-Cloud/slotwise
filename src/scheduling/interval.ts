/**
 * Time interval helpers shared by the scheduling rules.
 *
 * Intervals are half-open [start, end). Pure: no I/O, no clock.
 */

export interface TimeInterval {
  readonly start: Date;
  /** Exclusive: the interval is [start, end). */
  readonly end: Date;
}

/** Throws a RangeError unless start and end are valid dates with start < end. */
export function assertValidInterval(interval: TimeInterval): void {
  const start = interval.start.getTime();
  const end = interval.end.getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new RangeError('Interval has an invalid date');
  }
  if (end <= start) {
    throw new RangeError(
      `Interval must end after it starts: ${interval.start.toISOString()} – ${interval.end.toISOString()}`,
    );
  }
}

/**
 * Half-open intervals [start, end): touching ends do NOT overlap, so a booking
 * ending at 10:00 and one starting at 10:00 are both allowed.
 */
export function intervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  return a.start.getTime() < b.end.getTime() && b.start.getTime() < a.end.getTime();
}
