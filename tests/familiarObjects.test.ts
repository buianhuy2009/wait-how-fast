import test from 'node:test';
import assert from 'node:assert';
import { FAMILIAR_OBJECTS, getFamiliarDistanceComparison } from '../src/lib/familiarObjects.ts';

test('FAMILIAR_OBJECTS contains universally familiar reference objects with verified physical dimensions', () => {
  assert.ok(FAMILIAR_OBJECTS.length >= 6);

  const dollar = FAMILIAR_OBJECTS.find((o) => o.id === 'dollar-bill');
  assert.ok(dollar);
  assert.strictEqual(dollar.widthMm, 156.0);
  assert.strictEqual(dollar.heightMm, 66.3);

  const quarter = FAMILIAR_OBJECTS.find((o) => o.id === 'quarter-coin');
  assert.ok(quarter);
  assert.strictEqual(quarter.widthMm, 24.26);

  const postIt = FAMILIAR_OBJECTS.find((o) => o.id === 'post-it-note');
  assert.ok(postIt);
  assert.strictEqual(postIt.widthMm, 76.2);
  assert.strictEqual(postIt.heightMm, 76.2);

  for (const obj of FAMILIAR_OBJECTS) {
    assert.ok(obj.name.length > 0);
    assert.ok(obj.widthMm > 0);
    assert.ok(obj.heightMm > 0);
    assert.ok(obj.funFact.length > 5);
  }
});

test('getFamiliarDistanceComparison scales across nanometers to meters', () => {
  const nano = getFamiliarDistanceComparison(0.00005);
  assert.ok(nano.includes('nm'));

  const quarterScale = getFamiliarDistanceComparison(24.26);
  assert.ok(quarterScale.includes('Quarter'));

  const dollarScale = getFamiliarDistanceComparison(156.0);
  assert.ok(dollarScale.includes('Dollar'));

  const meterScale = getFamiliarDistanceComparison(2500);
  assert.ok(meterScale.includes('meters'));
});
