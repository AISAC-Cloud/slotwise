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

import { assertValidInterval, intervalsOverlap, type TimeInterval } from './interval.js';

export { assertValidInterval, intervalsOverlap, type TimeInterval };

export type StaffId = string;

export interface Booking extends TimeInterval {
  readonly id: string;
  readonly staffId: StaffId;
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
