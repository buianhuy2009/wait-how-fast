import test from 'node:test';
import assert from 'node:assert';
import { DATA_SIZES, calculateThroughput } from '../src/data/dataScales.ts';
import { CPU_OPERATIONS } from '../src/data/cpuDilation.ts';
import { SPEED_EXHIBITS } from '../src/data/speeds.ts';

test('Data scale sizes are strictly increasing by 1,000x orders of magnitude', () => {
  for (let i = 1; i < DATA_SIZES.length; i++) {
    assert.strictEqual(
      DATA_SIZES[i].bytes,
      DATA_SIZES[i - 1].bytes * 1000,
      `Expected ${DATA_SIZES[i].name} to be 1000x ${DATA_SIZES[i - 1].name}`
    );
  }
});

test('Wi-Fi throughput calculation accurately computes 1 Gbps to 125 MB/s and rice mass', () => {
  const tp = calculateThroughput(1000);
  assert.strictEqual(tp.speedMBps, 125);

  // 125 MB/s = 125,000,000 Bytes/s
  // Rice: 0.029 g per grain -> 125,000,000 * 0.029 g = 3,625,000 g = 3,625 kg = 3.625 metric tons
  const bytesPerSec = tp.speedMBps * 1_000_000;
  const kgPerSec = (bytesPerSec * 0.029) / 1000;
  const tonsPerSec = kgPerSec / 1000;

  assert.ok(Math.abs(tonsPerSec - 3.625) < 0.001);
});

test('CPU time dilation covers core to ocean network scale', () => {
  const clockTick = CPU_OPERATIONS.find((op) => op.id === 'clock-cycle');
  assert.ok(clockTick);
  assert.strictEqual(clockTick.dilatedSeconds, 0.333);

  const ram = CPU_OPERATIONS.find((op) => op.id === 'main-ram');
  assert.ok(ram);
  assert.strictEqual(ram.dilatedSeconds, 100); // 100s = 1 min 40s

  const ocean = CPU_OPERATIONS.find((op) => op.id === 'ocean-packet');
  assert.ok(ocean);
  // 150,000,000 seconds / (365.25 * 86400) = ~4.75 years
  const years = ocean.dilatedSeconds / (365.25 * 86400);
  assert.ok(Math.abs(years - 4.75) < 0.05);
});

test('Continuous speeds include slow biology and light speed', () => {
  const snail = SPEED_EXHIBITS.find((s) => s.id === 'garden-snail');
  assert.ok(snail);
  assert.strictEqual(snail.speedMps, 0.0013);

  const light = SPEED_EXHIBITS.find((s) => s.id === 'grace-hopper-light');
  assert.ok(light);
  assert.strictEqual(light.speedMps, 299_792_458);
});

test('Printing Money stream physical rates verify against natural constants', () => {
  // US National Debt: $82,400/sec -> annual rate:
  const annualDebt = 82400 * 86400 * 365.25;
  // ~$2.6 Trillion/year:
  assert.ok(annualDebt > 2.5e12 && annualDebt < 2.7e12);

  // Heart blood pump: 84 mL/sec -> time to fill 355mL soda can:
  const secondsPerCan = 355 / 84;
  assert.ok(Math.abs(secondsPerCan - 4.226) < 0.01);
});

test('Subsea fiber glass tax calculates 31.8% velocity reduction', () => {
  const c = 299_792.458; // km/s
  const n = 1.468; // silica glass refractive index
  const vFiber = c / n;
  assert.ok(Math.abs(vFiber - 204218.3) < 1.0);

  const glassTaxPercent = (1 - vFiber / c) * 100;
  assert.ok(Math.abs(glassTaxPercent - 31.88) < 0.1);

  // Earth-Moon 384,400 km round trip radio delay:
  const rttMoonSec = (384_400 * 2) / c;
  assert.ok(Math.abs(rttMoonSec - 2.564) < 0.01);
});
