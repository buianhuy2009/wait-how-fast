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

test('Animal Kingdom and Human Speed Olympics exhibits have verified physics', () => {
  const mantis = SPEED_EXHIBITS.find((s) => s.id === 'mantis-shrimp');
  assert.ok(mantis);
  assert.strictEqual(mantis.speedMps, 23);
  assert.ok(mantis.plaqueFact.includes('10,400 G'));
  assert.ok(mantis.plaqueFact.includes('cavitation'));

  const falcon = SPEED_EXHIBITS.find((s) => s.id === 'peregrine-falcon');
  assert.ok(falcon);
  assert.strictEqual(falcon.speedMps, 108);
  assert.ok(falcon.displaySpeed.includes('389 km/h'));

  const cheetah = SPEED_EXHIBITS.find((s) => s.id === 'cheetah-sprint');
  assert.ok(cheetah);
  assert.strictEqual(cheetah.speedMps, 33.3);

  const bolt = SPEED_EXHIBITS.find((s) => s.id === 'usain-bolt');
  assert.ok(bolt);
  assert.strictEqual(bolt.speedMps, 12.42);
  assert.ok(bolt.displaySpeed.includes('44.72 km/h'));

  const sloth = SPEED_EXHIBITS.find((s) => s.id === 'three-toed-sloth');
  assert.ok(sloth);
  assert.strictEqual(sloth.speedMps, 0.05);

  const bamboo = SPEED_EXHIBITS.find((s) => s.id === 'bamboo-growth');
  assert.ok(bamboo);
  assert.strictEqual(bamboo.speedMps, 1.16e-5);
  assert.ok(bamboo.displaySpeed.includes('1 meter / 24 hours'));
});

test('True-Scale Showdown verifies exact 874,000x gap between Light and Sound', () => {
  const soundSpeed = 343; // m/s
  const lightSpeed = 299_792_458; // m/s
  const ratio = lightSpeed / soundSpeed;

  // Exact physical ratio ~ 874,030.5x
  assert.ok(ratio > 874_000 && ratio < 874_100);

  // 1 km lightning strike arrival times
  const distance = 1000; // meters
  const lightArrival = distance / lightSpeed; // seconds
  const soundArrival = distance / soundSpeed; // seconds

  // Light arrives in ~3.3 microseconds
  assert.ok(Math.abs(lightArrival * 1_000_000 - 3.3356) < 0.01);
  // Sound takes ~2.915 seconds
  assert.ok(Math.abs(soundArrival - 2.915) < 0.01);

  // In 1.0 second:
  const sound1sDistanceM = soundSpeed * 1.0;
  assert.strictEqual(sound1sDistanceM, 343);

  const light1sDistanceKm = (lightSpeed * 1.0) / 1000;
  const earthCircumferenceKm = 40_075;
  const earthOrbits = light1sDistanceKm / earthCircumferenceKm;
  // Light wraps around Earth ~7.48 times (7.5 times)
  assert.ok(Math.abs(earthOrbits - 7.48) < 0.02);
});

