import { describe, expect, it } from 'vitest';
import { type Booking, bookingsConflict, findConflicts, intervalsOverlap } from './overlap.js';

let nextId = 0;
function booking(staffId: string, start: string, end: string, id = `b${++nextId}`): Booking {
  return {
    id,
    staffId,
    start: new Date(`2026-11-20T${start}:00Z`),
    end: new Date(`2026-11-20T${end}:00Z`),
  };
}

/** Checks both argument orders, so every case also proves symmetry. */
function expectConflict(a: Booking, b: Booking, expected: boolean): void {
  expect(bookingsConflict(a, b)).toBe(expected);
  expect(bookingsConflict(b, a)).toBe(expected);
}

describe('bookingsConflict: same staff member', () => {
  it('conflicts when the new booking overlaps the end of an existing one', () => {
    expectConflict(booking('ana', '10:00', '10:40'), booking('ana', '10:30', '11:10'), true);
  });

  it('conflicts when the new booking overlaps the start of an existing one', () => {
    expectConflict(booking('ana', '10:30', '11:10'), booking('ana', '10:00', '10:40'), true);
  });

  it('conflicts when one booking contains the other', () => {
    expectConflict(booking('ana', '09:00', '12:00'), booking('ana', '10:00', '10:40'), true);
  });

  it('conflicts when the times are identical', () => {
    expectConflict(booking('ana', '18:00', '18:40'), booking('ana', '18:00', '18:40'), true);
  });

  it('allows back-to-back bookings (end === start)', () => {
    expectConflict(booking('ana', '10:00', '10:40'), booking('ana', '10:40', '11:20'), false);
  });

  it('allows disjoint bookings', () => {
    expectConflict(booking('ana', '09:00', '09:40'), booking('ana', '14:00', '14:40'), false);
  });

  it('does not conflict a booking with itself (rescheduling)', () => {
    const original = booking('ana', '10:00', '10:40', 'same');
    const moved = booking('ana', '10:20', '11:00', 'same');
    expectConflict(original, moved, false);
  });
});

describe('bookingsConflict: different staff members', () => {
  it('allows the same times for different staff', () => {
    expectConflict(booking('ana', '18:00', '18:40'), booking('bruno', '18:00', '18:40'), false);
  });
});

describe('bookingsConflict: invalid intervals', () => {
  it('rejects a booking that ends before it starts', () => {
    expect(() => bookingsConflict(booking('ana', '11:00', '10:00'), booking('ana', '12:00', '13:00'))).toThrow(
      RangeError,
    );
  });

  it('rejects a zero-length booking', () => {
    expect(() => bookingsConflict(booking('ana', '12:00', '13:00'), booking('ana', '10:00', '10:00'))).toThrow(
      RangeError,
    );
  });

  it('rejects an invalid date', () => {
    const broken: Booking = { id: 'x', staffId: 'ana', start: new Date('nope'), end: new Date() };
    expect(() => bookingsConflict(broken, booking('ana', '10:00', '11:00'))).toThrow(RangeError);
  });
});

describe('intervalsOverlap', () => {
  it('treats intervals as half-open [start, end)', () => {
    const morning = booking('ana', '09:00', '10:00');
    const next = booking('ana', '10:00', '11:00');
    expect(intervalsOverlap(morning, next)).toBe(false);
    expect(intervalsOverlap(next, morning)).toBe(false);
  });
});

describe('findConflicts', () => {
  it('returns only the conflicting bookings', () => {
    const candidate = booking('ana', '10:00', '11:00');
    const overlapsAna = booking('ana', '10:30', '11:30');
    const backToBack = booking('ana', '11:00', '11:40');
    const otherStaff = booking('bruno', '10:00', '11:00');
    const alsoOverlapsAna = booking('ana', '09:30', '10:10');

    expect(findConflicts(candidate, [overlapsAna, backToBack, otherStaff, alsoOverlapsAna])).toEqual([
      overlapsAna,
      alsoOverlapsAna,
    ]);
  });

  it('returns an empty list when there are no existing bookings', () => {
    expect(findConflicts(booking('ana', '10:00', '11:00'), [])).toEqual([]);
  });

  it('rejects an invalid candidate even with no existing bookings', () => {
    expect(() => findConflicts(booking('ana', '11:00', '10:00'), [])).toThrow(RangeError);
  });
});
