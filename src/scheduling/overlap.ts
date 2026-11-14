/**
 * Scheduling invariant: two bookings of the same staff member must not overlap.
 *
 * Pure domain rule: no I/O, no clock. It answers "would this booking collide?"
 * for the bookings it is given. It does NOT prevent two concurrent requests from
 * both passing the check (the race in docs/domain.md); that needs a database
 * constraint or lock at the persistence layer.
 *
 * Staff IDs are assumed unique within the caller's tenant; tenant isolation is
 * enforced elsewhere.
 */

export type StaffId = string;

export interface TimeInterval {
  readonly start: Date;
  /** Exclusive: the interval is [start, end). */
  readonly end: Date;
}

export interface Booking extends TimeInterval {
  readonly id: string;
  readonly staffId: StaffId;
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

/**
 * True when both bookings belong to the same staff member and their times
 * overlap. A booking never conflicts with itself (same id), so rescheduling
 * can be checked against the current list.
 */
export function bookingsConflict(a: Booking, b: Booking): boolean {
  assertValidInterval(a);
  assertValidInterval(b);
  return a.id !== b.id && a.staffId === b.staffId && intervalsOverlap(a, b);
}

/** The existing bookings the candidate would collide with. Empty means allowed. */
export function findConflicts(candidate: Booking, existing: readonly Booking[]): Booking[] {
  assertValidInterval(candidate);
  return existing.filter((other) => bookingsConflict(candidate, other));
}
