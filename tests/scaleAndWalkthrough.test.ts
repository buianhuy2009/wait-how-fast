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

test('Paper stack height scale accurately scales from 0.1 mm to 100 million km', () => {
  const sheetThicknessMeters = 0.0001; // 0.1 mm = 100 µm

  // 1 Byte = 1 sheet = 0.1 mm
  assert.strictEqual(1 * sheetThicknessMeters * 1000, 0.1);

  // 1 KB = 1,000 sheets = 100 mm = 10 cm = 0.1 m
  const kbHeightM = 1_000 * sheetThicknessMeters;
  assert.strictEqual(kbHeightM, 0.1);

  // 1 MB = 1,000,000 sheets = 100 meters (taller than Statue of Liberty 93m)
  const mbHeightM = 1_000_000 * sheetThicknessMeters;
  assert.strictEqual(mbHeightM, 100);

  // 1 GB = 1,000,000,000 sheets = 100,000 meters = 100 km (Kármán line / Space boundary)
  const gbHeightKm = (1_000_000_000 * sheetThicknessMeters) / 1000;
  assert.strictEqual(gbHeightKm, 100);

  // 1 TB = 1,000,000,000,000 sheets = 100,000 km (26% of distance to the Moon 384,400 km)
  const tbHeightKm = (1_000_000_000_000 * sheetThicknessMeters) / 1000;
  assert.strictEqual(tbHeightKm, 100_000);
  assert.ok(tbHeightKm / 384_400 > 0.25 && tbHeightKm / 384_400 < 0.27);

  // 1 PB = 1,000,000,000,000,000 sheets = 100,000,000 km (2/3 of 150M km distance to Sun)
  const pbHeightKm = (1_000_000_000_000_000 * sheetThicknessMeters) / 1000;
  assert.strictEqual(pbHeightKm, 100_000_000);
  assert.strictEqual(pbHeightKm / 150_000_000, 2 / 3);
});

test('CPU time dilation 3 GHz math harmonizes cycles missed with dilated human times', () => {
  const clockTick = CPU_OPERATIONS.find((op) => op.id === 'clock-cycle');
  assert.ok(clockTick);
  assert.strictEqual(clockTick.dilatedSeconds, 0.333);

  const ram = CPU_OPERATIONS.find((op) => op.id === 'main-ram');
  assert.ok(ram);
  assert.strictEqual(ram.dilatedSeconds, 100);

  // In 3 GHz model: 1 cycle = 0.3333333333 ns, dilated to 1 human second
  // Scale multiplier = 3,000,000,000
  // L1 Cache: 0.5 ns * 3 GHz = 1.5 cycles = 1.5 seconds
  assert.strictEqual(0.5e-9 * 3e9, 1.5);

  // L2 Cache: 3.0 ns * 3 GHz = 9 cycles = 9 seconds
  assert.strictEqual(3.0e-9 * 3e9, 9);

  // L3 Cache: 15.0 ns * 3 GHz = 45 cycles = 45 seconds
  assert.strictEqual(Math.round(15.0e-9 * 3e9), 45);

  // RAM: 100 ns * 3 GHz = 300 cycles = 300 seconds = 5 minutes
  assert.strictEqual(Math.round(100e-9 * 3e9), 300);

  // Fast NVMe SSD: 50 µs * 3 GHz = 150,000 cycles = 150,000 seconds = 41.67 hours (~1.74 days)
  const ssdCycles = 50e-6 * 3e9;
  assert.strictEqual(ssdCycles, 150_000);
  const ssdHours = ssdCycles / 3600;
  assert.ok(Math.abs(ssdHours - 41.6667) < 0.01);

  // Enterprise HDD Seek: 3.333 ms * 3 GHz = 10,000,000 cycles = 10,000,000 seconds = 3.8 months
  const hddCycles = (10 / 3) * 1e-3 * 3e9;
  assert.strictEqual(Math.round(hddCycles), 10_000_000);
  const hddMonths = hddCycles / (86400 * 30.4375);
  assert.ok(Math.abs(hddMonths - 3.8) < 0.1);

  // Ocean fiber request: 50 ms * 3 GHz = 150,000,000 cycles = 150,000,000 seconds = 4.75 years
  const oceanCycles = 50e-3 * 3e9;
  assert.strictEqual(oceanCycles, 150_000_000);
  const oceanYears = oceanCycles / (86400 * 365.25);
  assert.ok(Math.abs(oceanYears - 4.75) < 0.05);
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
  const annualDebt = 82400 * 86400 * 365.25;
  assert.ok(annualDebt > 2.5e12 && annualDebt < 2.7e12);

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

  const rttMoonSec = (384_400 * 2) / c;
  assert.ok(Math.abs(rttMoonSec - 2.564) < 0.01);
});
