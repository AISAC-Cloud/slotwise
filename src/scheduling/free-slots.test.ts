import { describe, expect, it } from 'vitest';
import { freeSlots } from './free-slots.js';

function interval(start: string, end: string) {
  return { start: new Date(`2026-11-20T${start}:00Z`), end: new Date(`2026-11-20T${end}:00Z`) };
}

function starts(slots: readonly { start: Date }[]): string[] {
  return slots.map((slot) => slot.start.toISOString().slice(11, 16));
}

describe('freeSlots', () => {
  it('splits an empty morning into back-to-back slots', () => {
    expect(starts(freeSlots(interval('09:00', '10:00'), 25, []))).toEqual(['09:00', '09:25']);
  });

  it('skips the slots that overlap a booking', () => {
    const bookings = [interval('09:30', '10:00')];
    expect(starts(freeSlots(interval('09:00', '11:15'), 30, bookings))).toEqual(['09:00', '10:00', '10:30']);
  });

  it('offers a slot that starts when a booking ends', () => {
    const bookings = [interval('09:00', '09:30')];
    expect(starts(freeSlots(interval('09:00', '10:15'), 30, bookings))).toEqual(['09:30']);
  });

  it('rejects a service length that is not a positive whole number of minutes', () => {
    expect(() => freeSlots(interval('09:00', '10:00'), 0, [])).toThrow(RangeError);
    expect(() => freeSlots(interval('09:00', '10:00'), 12.5, [])).toThrow(RangeError);
  });

  it('rejects an invalid day', () => {
    expect(() => freeSlots(interval('10:00', '09:00'), 30, [])).toThrow(RangeError);
  });

  it('leaves the buffer between two slots', () => {
    expect(starts(freeSlots(interval('09:00', '10:45'), 30, [], 10))).toEqual(['09:00', '09:40']);
  });
});
