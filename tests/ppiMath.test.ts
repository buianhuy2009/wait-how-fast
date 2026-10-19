import test from 'node:test';
import assert from 'node:assert';
import {
  ISO_CARD,
  calculatePpiFromCardWidth,
  calculateCardWidthFromPpi,
  calculatePpmm,
  mmToPx,
  inchesToPx,
  velocityToPxPerSec,
  calculateScreenTransitTime,
  formatDuration,
} from '../src/lib/ppiMath.ts';

test('ISO_CARD has standard ISO/IEC 7810 ID-1 dimensions', () => {
  assert.strictEqual(ISO_CARD.widthMm, 85.60);
  assert.strictEqual(ISO_CARD.heightMm, 53.98);
  assert.ok(Math.abs(ISO_CARD.widthInches - 3.3700787) < 0.0001);
  assert.ok(Math.abs(ISO_CARD.aspectRatio - 1.58577) < 0.001);
});

test('calculatePpiFromCardWidth and calculateCardWidthFromPpi are symmetric', () => {
  const targetPpi = 112;
  const cardPx = calculateCardWidthFromPpi(targetPpi);
  const derivedPpi = calculatePpiFromCardWidth(cardPx);
  assert.ok(Math.abs(derivedPpi - targetPpi) < 0.0001);
});

test('calculatePpmm calculates correct pixels per millimeter', () => {
  const ppi = 96; // 96 px per 25.4 mm
  const ppmm = calculatePpmm(ppi);
  assert.ok(Math.abs(ppmm - 96 / 25.4) < 0.0001);
});

test('mmToPx and inchesToPx scale accurately', () => {
  const ppi = 100;
  const inches = 2.5;
  assert.strictEqual(inchesToPx(inches, ppi), 250);

  const mm = 25.4; // 1 inch
  assert.ok(Math.abs(mmToPx(mm, ppi) - 100) < 0.0001);
});

test('velocityToPxPerSec respects zoom and time dilation', () => {
  const ppi = 96;
  const ppmm = 96 / 25.4;
  const v = 0.5; // 0.5 m/s = 500 mm/s
  const basePxSec = 500 * ppmm;

  assert.ok(Math.abs(velocityToPxPerSec(v, ppi, 1.0, 1.0) - basePxSec) < 0.0001);
  assert.ok(Math.abs(velocityToPxPerSec(v, ppi, 2.0, 1.0) - (basePxSec * 2)) < 0.0001);
  assert.ok(Math.abs(velocityToPxPerSec(v, ppi, 1.0, 0.5) - (basePxSec * 0.5)) < 0.0001);
});

test('calculateScreenTransitTime handles instant, slow, and fast speeds', () => {
  const ppi = 96;
  const screenWidth = 1000;

  // Garden snail: 1.3 mm/s
  const snailResult = calculateScreenTransitTime(0.0013, screenWidth, ppi);
  assert.ok(snailResult.seconds > 100);
  assert.ok(snailResult.formatted.includes('minutes'));

  // Zero speed
  const zeroResult = calculateScreenTransitTime(0, screenWidth, ppi);
  assert.strictEqual(zeroResult.seconds, Infinity);
  assert.strictEqual(zeroResult.formatted, 'Never');
});

test('formatDuration formats all magnitude scales correctly', () => {
  assert.strictEqual(formatDuration(0.000000005), '5.00 nanoseconds');
  assert.strictEqual(formatDuration(0.00005), '50.00 microseconds');
  assert.strictEqual(formatDuration(0.025), '25.0 milliseconds');
  assert.strictEqual(formatDuration(3.5), '3.50 seconds');
  assert.strictEqual(formatDuration(180), '3.0 minutes');
  assert.strictEqual(formatDuration(7200), '2.0 hours');
  assert.strictEqual(formatDuration(172800), '2.0 days');
  assert.strictEqual(formatDuration(86400 * 60), '2.0 months');
  assert.strictEqual(formatDuration(86400 * 730), '2.0 years');
  assert.strictEqual(formatDuration(0), 'Instant');
  assert.strictEqual(formatDuration(-10), 'Instant');
  assert.strictEqual(formatDuration(Infinity), 'Instant');
});

test('calculateScreenTransitTime calculates nanosecond light transit accurately', () => {
  const ppi = 96;
  // Grace Hopper 11.8 inches = 11.8 * 96 px = 1132.8 px
  const widthPx = 11.8 * ppi;
  const lightSpeedMps = 299_792_458;
  const result = calculateScreenTransitTime(lightSpeedMps, widthPx, ppi);
  // ~1.0 nanosecond
  assert.ok(Math.abs(result.seconds - 1e-9) < 0.05e-9);
  assert.ok(result.formatted.includes('nanosecond'));
});
