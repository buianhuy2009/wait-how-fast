import test from 'node:test';
import assert from 'node:assert';
import { CPU_OPERATIONS } from '../src/data/cpuDilation.ts';
import { FRAMERATE_TIERS, FRAMERATE_EXPLAINERS } from '../src/data/framerateData.ts';

test('CPU_OPERATIONS has verified hierarchical latency tiers', () => {
  assert.ok(CPU_OPERATIONS.length >= 8);

  const clockCycle = CPU_OPERATIONS.find((op) => op.id === 'clock-cycle');
  assert.ok(clockCycle);
  assert.strictEqual(clockCycle.dilatedSeconds, 0.333);

  const l1 = CPU_OPERATIONS.find((op) => op.id === 'l1-cache');
  assert.ok(l1);
  assert.strictEqual(l1.realNanoseconds, 0.5);

  const ram = CPU_OPERATIONS.find((op) => op.id === 'main-ram');
  assert.ok(ram);
  assert.strictEqual(ram.dilatedSeconds, 100); // 1m 40s

  const ssd = CPU_OPERATIONS.find((op) => op.id === 'nvme-ssd');
  assert.ok(ssd);
  assert.strictEqual(ssd.realNanoseconds, 150_000); // 150 µs

  const ocean = CPU_OPERATIONS.find((op) => op.id === 'ocean-packet');
  assert.ok(ocean);
  assert.strictEqual(ocean.realNanoseconds, 150_000_000); // 150 ms
});

test('FRAMERATE_TIERS covers 15, 30, 60, 120 FPS standards', () => {
  assert.strictEqual(FRAMERATE_TIERS.length, 4);

  const fps60 = FRAMERATE_TIERS.find((t) => t.fps === 60);
  assert.ok(fps60);
  assert.ok(Math.abs(fps60.frameTimeMs - 16.67) < 0.01);

  const fps120 = FRAMERATE_TIERS.find((t) => t.fps === 120);
  assert.ok(fps120);
  assert.ok(Math.abs(fps120.frameTimeMs - 8.33) < 0.01);

  assert.ok(FRAMERATE_EXPLAINERS.length >= 3);
  const cinema = FRAMERATE_EXPLAINERS.find((e) => e.title.includes('24 FPS'));
  assert.ok(cinema);
  assert.ok(cinema.content.includes('shutter'));
});
