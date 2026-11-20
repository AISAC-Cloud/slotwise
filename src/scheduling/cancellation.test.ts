import { describe, expect, it } from 'vitest';
import { canCancelFreeOfCharge } from './cancellation.js';

const booking = {
  start: new Date('2026-11-20T18:00:00Z'),
  end: new Date('2026-11-20T18:40:00Z'),
};

describe('canCancelFreeOfCharge', () => {
  it('allows cancelling two days before', () => {
    expect(canCancelFreeOfCharge(booking, 24, new Date('2026-11-18T18:00:00Z'))).toBe(true);
  });

  it('refuses cancelling one hour before', () => {
    expect(canCancelFreeOfCharge(booking, 24, new Date('2026-11-20T17:00:00Z'))).toBe(false);
  });

  it('refuses cancelling exactly at the window boundary', () => {
    expect(canCancelFreeOfCharge(booking, 24, new Date('2026-11-19T18:00:00Z'))).toBe(false);
  });

  it('refuses cancelling after the booking started even with a zero window', () => {
    expect(canCancelFreeOfCharge(booking, 0, new Date('2026-11-20T18:10:00Z'))).toBe(false);
  });

  it('throws a RangeError for an invalid booking interval', () => {
    const broken = { start: new Date('nope'), end: booking.end };
    expect(() => canCancelFreeOfCharge(broken, 24, new Date('2026-11-18T18:00:00Z'))).toThrow(RangeError);
  });

  it('throws a RangeError for a negative or non-finite window', () => {
    const now = new Date('2026-11-18T18:00:00Z');
    expect(() => canCancelFreeOfCharge(booking, -1, now)).toThrow(RangeError);
    expect(() => canCancelFreeOfCharge(booking, Number.NaN, now)).toThrow(RangeError);
  });

  it('throws a RangeError for an invalid now', () => {
    expect(() => canCancelFreeOfCharge(booking, 24, new Date('nope'))).toThrow(RangeError);
  });
});
