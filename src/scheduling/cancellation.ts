import { assertValidInterval, MS_PER_HOUR, type TimeInterval } from './interval.js';

/**
 * A customer cancels free of charge until `windowHours` before the booking starts.
 *
 * Pure domain rule: no clock. The caller passes `now`.
 * Throws a RangeError for an invalid booking interval, an invalid `now`, or a
 * window that is not a finite, non-negative number of hours.
 */
export function canCancelFreeOfCharge(
  booking: TimeInterval,
  windowHours: number,
  now: Date,
): boolean {
  assertValidInterval(booking);
  if (!Number.isFinite(windowHours) || windowHours < 0) {
    throw new RangeError(`Cancellation window must be a non-negative number of hours: ${windowHours}`);
  }
  const nowMs = now.getTime();
  if (Number.isNaN(nowMs)) {
    throw new RangeError('Current time is an invalid date');
  }
  return booking.start.getTime() - nowMs > windowHours * MS_PER_HOUR;
}
