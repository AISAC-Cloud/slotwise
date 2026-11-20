import { type TimeInterval, assertValidInterval, intervalsOverlap } from './overlap.js';

const MS_PER_MINUTE = 60_000;

/**
 * The free slots of one staff member's day: back-to-back slots of the service's
 * length, from the start of the day, skipping every slot that overlaps a booking.
 */
export function freeSlots(
  day: TimeInterval,
  serviceMinutes: number,
  bookings: readonly TimeInterval[],
  bufferMinutes = 0,
): TimeInterval[] {
  assertValidInterval(day);
  if (!Number.isInteger(serviceMinutes) || serviceMinutes <= 0) {
    throw new RangeError(`Service length must be a positive whole number of minutes: ${serviceMinutes}`);
  }
  if (!Number.isInteger(bufferMinutes) || bufferMinutes < 0) {
    throw new RangeError(`Buffer must be a whole number of minutes, zero or more: ${bufferMinutes}`);
  }
  const step = serviceMinutes * MS_PER_MINUTE;
  const gap = bufferMinutes * MS_PER_MINUTE;
  const end = day.end.getTime();
  const slots: TimeInterval[] = [];
  for (let start = day.start.getTime(); start + step < end; start += step + gap) {
    const slot = { start: new Date(start), end: new Date(start + step) };
    if (!bookings.some((booking) => intervalsOverlap(slot, booking))) {
      slots.push(slot);
    }
  }
  return slots;
}
