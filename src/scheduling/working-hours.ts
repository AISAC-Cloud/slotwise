/**
 * Scheduling rule: a booking must fit inside the staff member's working hours
 * for its weekday.
 *
 * Pure domain rule: no I/O, no clock. Working hours are UTC times of day for
 * now; per-tenant time zones come later.
 */

import type { TimeInterval } from './overlap.js';

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

/** True when the booking lies entirely within the working hours of its weekday. */
export function fitsWorkingHours(_booking: TimeInterval, _week: WorkingWeek): boolean {
  throw new Error('fitsWorkingHours: not implemented');
}
