import { describe, it, expect } from 'vitest';
import {
  cn,
  formatIDR,
  formatDateIndo,
  generateBatchCode,
  generateSKU,
  generateOrderNumber,
  generatePayoutCode,
} from '@/lib/utils';

describe('REG-UTL-01: Currency Formatting (formatIDR)', () => {
  it('formats positive integers to Indonesian Rupiah currency format', () => {
    const formatted = formatIDR(75000);
    expect(formatted).toContain('75.000');
    expect(formatted).toContain('Rp');
  });

  it('formats zero correctly', () => {
    const formatted = formatIDR(0);
    expect(formatted).toContain('0');
    expect(formatted).toContain('Rp');
  });

  it('formats large numbers (millions)', () => {
    const formatted = formatIDR(2500000);
    expect(formatted).toContain('2.500.000');
    expect(formatted).toContain('Rp');
  });
});

describe('REG-UTL-02: Date Formatting (formatDateIndo)', () => {
  it('formats ISO date string into standard Indonesian format', () => {
    const formatted = formatDateIndo('2026-09-05T16:00:00Z');
    expect(formatted).toContain('September');
    expect(formatted).toContain('2026');
  });

  it('gracefully handles invalid date string fallback', () => {
    const invalidInput = 'not-a-valid-date';
    const result = formatDateIndo(invalidInput);
    expect(typeof result).toBe('string');
  });
});

describe('REG-UTL-03: System Code Generators', () => {
  it('generates unique BATCH code conforming to BATCH-YYYYMM-XXX format', () => {
    const code1 = generateBatchCode();
    const code2 = generateBatchCode();
    expect(code1).toMatch(/^BATCH-\d{6}-\d{3}$/);
    expect(code2).toMatch(/^BATCH-\d{6}-\d{3}$/);
  });

  it('generates physical SKU conforming to PT-SM-XXX-XXX format with zero-padded indices', () => {
    const sku1 = generateSKU(1, 42);
    expect(sku1).toBe('PT-SM-001-042');

    const sku2 = generateSKU(12, 5);
    expect(sku2).toBe('PT-SM-012-005');
  });

  it('generates Order Number conforming to ORD-YYYYMM-XXXX format', () => {
    const orderNum = generateOrderNumber();
    expect(orderNum).toMatch(/^ORD-\d{6}-\d{4}$/);
  });

  it('generates Payout Code conforming to PAY-YYYYMMDD-XXX format', () => {
    const payoutCode = generatePayoutCode();
    expect(payoutCode).toMatch(/^PAY-\d{8}-\d{3}$/);
  });
});

describe('Tailwind Class Merge (cn)', () => {
  it('merges class names and resolves tailwind conflict cleanly', () => {
    const result = cn('bg-red-500', 'bg-blue-500', 'p-4');
    expect(result).toBe('bg-blue-500 p-4');
  });
});
