// src/__tests__/utils.test.ts
// Unit tests for shared utility functions
// Imports: vitest, formatDuration, parseDuration, truncate, getGreeting

import { describe, it, expect } from 'vitest';
import { formatDuration, parseDuration, truncate, cn } from '../lib/utils';

describe('formatDuration', () => {
  it('formats seconds to m:ss', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(180)).toBe('3:00');
    expect(formatDuration(3661)).toBe('61:01');
  });

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('handles NaN', () => {
    expect(formatDuration(NaN)).toBe('0:00');
  });
});

describe('parseDuration', () => {
  it('parses ISO 8601 duration', () => {
    expect(parseDuration('PT3M45S')).toBe(225);
    expect(parseDuration('PT1H2M3S')).toBe(3723);
    expect(parseDuration('PT30S')).toBe(30);
    expect(parseDuration('PT5M')).toBe(300);
  });

  it('returns 0 for invalid input', () => {
    expect(parseDuration('')).toBe(0);
    expect(parseDuration('invalid')).toBe(0);
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello…');
  });

  it('leaves short strings untouched', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('deduplicates tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
