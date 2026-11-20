/**
 * Scheduling rule: a booking must fit inside the staff member's working hours
 * for its weekday.
 *
 * Pure domain rule: no I/O, no clock. Working hours are UTC times of day for
 * now; per-tenant time zones come later.
 */

import { assertValidInterval, MS_PER_MINUTE, type TimeInterval } from './interval.js';

/** 0 = Sunday … 6 = Saturday, as returned by Date#getUTCDay(). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** UTC time of day, "HH:MM". */
export type TimeOfDay = `${number}:${number}`;

export interface DayHours {
  readonly open: TimeOfDay;
  /** Exclusive: a booking may end exactly at closing time. */
  readonly close: TimeOfDay;
}

/** A missing weekday is a day off. */
export type WorkingWeek = Readonly<Partial<Record<Weekday, DayHours>>>;

/** Minutes since midnight for "HH:MM"; throws RangeError if malformed or out of range. */
function minutesOfDay(time: TimeOfDay): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  const hours = Number(match?.[1]);
  const minutes = Number(match?.[2]);
  if (!match || hours > 24 || minutes > 59 || (hours === 24 && minutes !== 0)) {
    throw new RangeError(`Invalid time of day: ${time}`);
  }
  return hours * 60 + minutes;
}

/**
 * True when the booking lies entirely within the working hours of the weekday
 * it starts on. Half-open: it may start at opening and end exactly at closing.
 * A booking that runs past midnight ends after closing, so it never fits.
 */
export function fitsWorkingHours(booking: TimeInterval, week: WorkingWeek): boolean {
  assertValidInterval(booking);
  const hours = week[booking.start.getUTCDay() as Weekday];
  if (!hours) return false;

  const start = booking.start;
  const midnight = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const open = midnight + minutesOfDay(hours.open) * MS_PER_MINUTE;
  const close = midnight + minutesOfDay(hours.close) * MS_PER_MINUTE;
  return open <= start.getTime() && booking.end.getTime() <= close;
}
