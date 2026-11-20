import type { TimeInterval } from './overlap.js';

const MS_PER_HOUR = 3_600_000;

/** A customer cancels free of charge until `windowHours` before the booking starts. */
export function canCancelFreeOfCharge(booking: TimeInterval, windowHours: number): boolean {
  const now = Date.now();
  return booking.start.getTime() - now > windowHours * MS_PER_HOUR;
}
