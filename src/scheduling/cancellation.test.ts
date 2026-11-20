import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canCancelFreeOfCharge } from './cancellation.js';

const booking = {
  start: new Date('2026-11-20T18:00:00Z'),
  end: new Date('2026-11-20T18:40:00Z'),
};

describe('canCancelFreeOfCharge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows cancelling two days before', () => {
    vi.setSystemTime(new Date('2026-11-18T18:00:00Z'));
    expect(canCancelFreeOfCharge(booking, 24)).toBe(true);
  });

  it('refuses cancelling one hour before', () => {
    vi.setSystemTime(new Date('2026-11-20T17:00:00Z'));
    expect(canCancelFreeOfCharge(booking, 24)).toBe(false);
  });
});
