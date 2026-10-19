import test from 'node:test';
import assert from 'node:assert';
import { SPEED_EXHIBITS } from '../src/data/speeds.ts';
import { LATENCY_EXHIBITS } from '../src/data/latencies.ts';

test('SPEED_EXHIBITS includes Grace Hopper light and Continental Drift with valid physics', () => {
  assert.ok(SPEED_EXHIBITS.length >= 8);

  const graceHopper = SPEED_EXHIBITS.find((s) => s.id === 'grace-hopper-light');
  assert.ok(graceHopper);
  assert.strictEqual(graceHopper.speedMps, 299_792_458);

  const drift = SPEED_EXHIBITS.find((s) => s.id === 'continental-drift');
  assert.ok(drift);
  assert.ok(drift.speedMps < 1e-8);

  const snail = SPEED_EXHIBITS.find((s) => s.id === 'garden-snail');
  assert.ok(snail);
  assert.strictEqual(snail.speedMps, 0.0013);

  // Every exhibit must have non-empty citation and mathFormula
  for (const item of SPEED_EXHIBITS) {
    assert.ok(item.citation.length > 5, `Missing citation for ${item.id}`);
    assert.ok(item.mathFormula.length > 5, `Missing formula for ${item.id}`);
    assert.ok(item.defaultZoom >= 1.0);
    assert.ok(item.defaultSlowMo > 0);
  }
});

test('LATENCY_EXHIBITS includes all 7 exhibits with verified RTT and distinct interactive types', () => {
  assert.strictEqual(LATENCY_EXHIBITS.length, 7);

  const moon = LATENCY_EXHIBITS.find((l) => l.id === 'earth-to-moon');
  assert.ok(moon);
  assert.strictEqual(moon.roundTripMs, 2564);
  assert.strictEqual(moon.interactiveType, 'rover');

  const voyager = LATENCY_EXHIBITS.find((l) => l.id === 'voyager-1');
  assert.ok(voyager);
  assert.ok(voyager.roundTripMs > 150_000_000); // > 40 hours in ms
  assert.strictEqual(voyager.interactiveType, 'voyager');

  const fiber = LATENCY_EXHIBITS.find((l) => l.id === 'fiber-optics');
  assert.ok(fiber);
  assert.strictEqual(fiber.interactiveType, 'fiber');
  assert.ok(fiber.plaqueFact.includes('refractive index'));

  const mars = LATENCY_EXHIBITS.find((l) => l.id === 'mars-perseverance');
  assert.ok(mars);
  assert.strictEqual(mars.interactiveType, 'mars');
  assert.ok(mars.roundTripMs >= 360_000); // minutes scale

  const types = new Set(LATENCY_EXHIBITS.map((e) => e.interactiveType));
  assert.ok(types.has('fiber'));
  assert.ok(types.has('reflex'));
  assert.ok(types.has('typing'));
  assert.ok(types.has('pong'));
  assert.ok(types.has('rover'));
  assert.ok(types.has('mars'));
  assert.ok(types.has('voyager'));

  for (const item of LATENCY_EXHIBITS) {
    assert.ok(item.citation.length > 5, `Missing citation for ${item.id}`);
    assert.ok(item.detailedBreakdown.length >= 2, `Missing breakdown for ${item.id}`);
  }
});
