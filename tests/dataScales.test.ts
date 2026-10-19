import test from 'node:test';
import assert from 'node:assert';
import {
  calculateThroughput,
  DATA_SIZES,
  PHYSICAL_ANALOGIES,
} from '../src/data/dataScales.ts';

test('calculateThroughput correctly converts 1 Gbps to 125 MB/s', () => {
  const result = calculateThroughput(1000); // 1000 Mbps = 1 Gbps
  assert.strictEqual(result.speedMbps, 1000);
  assert.strictEqual(result.speedMBps, 125);
  assert.strictEqual(result.bitsPerByte, 8);

  // 50,000 MB (50GB) at 125 MB/s = 400 seconds = ~6.7 minutes
  assert.strictEqual(result.downloadSeconds, 400);
  assert.strictEqual(result.formattedDownloadTime, '6.7 minutes');
});

test('calculateThroughput handles small and fast connections', () => {
  const fast = calculateThroughput(10000, 1000); // 10 Gbps (1250 MB/s), 1 GB file
  assert.strictEqual(fast.speedMBps, 1250);
  assert.strictEqual(fast.downloadSeconds, 0.8);
  assert.strictEqual(fast.formattedDownloadTime, '0.8 seconds');
});

test('PHYSICAL_ANALOGIES and DATA_SIZES have complete definitions for all sizes', () => {
  assert.strictEqual(DATA_SIZES.length, 6);
  assert.strictEqual(DATA_SIZES[0].bytes, 1);
  assert.strictEqual(DATA_SIZES[3].bytes, 1_000_000_000);

  const keys = ['1b', '1kb', '1mb', '1gb', '1tb', '1pb'];
  const analogyKeys = Object.keys(PHYSICAL_ANALOGIES);
  assert.ok(analogyKeys.length >= 5);

  for (const aKey of analogyKeys) {
    const analogy = PHYSICAL_ANALOGIES[aKey];
    assert.ok(analogy.name.length > 0);
    assert.ok(analogy.throughputFact.length > 0);
    for (const size of keys) {
      assert.ok(analogy.scales[size], `Missing scale for ${aKey} -> ${size}`);
      assert.ok(analogy.scales[size].comparison.length > 0);
    }
  }
});
