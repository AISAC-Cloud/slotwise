import { describe, expect, it } from 'vitest';
import type { TimeInterval } from './overlap.js';
import { fitsWorkingHours, type WorkingWeek } from './working-hours.js';

// 2026-11-20 is a Friday; 2026-11-22 is a Sunday.
function interval(day: string, start: string, end: string): TimeInterval {
  return { start: new Date(`${day}T${start}:00Z`), end: new Date(`${day}T${end}:00Z`) };
}

const FRIDAY = '2026-11-20';
const SUNDAY = '2026-11-22';

/** Open Monday–Saturday 09:00–18:00 UTC; Sunday is a day off. */
const week: WorkingWeek = {
  1: { open: '09:00', close: '18:00' },
  2: { open: '09:00', close: '18:00' },
  3: { open: '09:00', close: '18:00' },
  4: { open: '09:00', close: '18:00' },
  5: { open: '09:00', close: '18:00' },
  6: { open: '09:00', close: '18:00' },
};

describe('fitsWorkingHours', () => {
  it('allows a booking entirely inside working hours', () => {
    expect(fitsWorkingHours(interval(FRIDAY, '10:00', '10:40'), week)).toBe(true);
  });

  it('rejects a booking that starts before opening', () => {
    expect(fitsWorkingHours(interval(FRIDAY, '08:30', '09:10'), week)).toBe(false);
  });

  it('allows a booking that ends exactly at closing time', () => {
    expect(fitsWorkingHours(interval(FRIDAY, '17:20', '18:00'), week)).toBe(true);
  });

  it('rejects a booking that ends after closing', () => {
    expect(fitsWorkingHours(interval(FRIDAY, '17:40', '18:20'), week)).toBe(false);
  });

  it('rejects a booking on a day off', () => {
    expect(fitsWorkingHours(interval(SUNDAY, '10:00', '10:40'), week)).toBe(false);
  });
});
