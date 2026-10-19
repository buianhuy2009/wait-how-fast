import test from 'node:test';
import assert from 'node:assert';
import {
  MUSEUM_WALKTHROUGH_SECTIONS,
  computeScrollProgress,
} from '../src/data/museumSections.ts';

test('MUSEUM_WALKTHROUGH_SECTIONS contains all 11 required museum halls in order', () => {
  assert.strictEqual(MUSEUM_WALKTHROUGH_SECTIONS.length, 11);

  const expectedTitles = [
    'Entrance',
    'Real-Time Stream',
    'Speed Conveyor',
    'Sound vs Light',
    'Animal Olympics',
    'Data Scale',
    'CPU Dilation',
    'Latency Arena',
    'Refresh Vault',
    'Speed of You',
    'Cosmic Vault',
  ];

  const expectedIds = [
    'entrance',
    'realtime-stream',
    'speed-conveyor',
    'sound-vs-light',
    'animal-olympics',
    'data-scale',
    'cpu-dilation',
    'latency-arena',
    'framerate-vault',
    'human-vault',
    'cosmic-vault',
  ];

  for (let i = 0; i < 11; i++) {
    const sec = MUSEUM_WALKTHROUGH_SECTIONS[i];
    assert.strictEqual(sec.title, expectedTitles[i]);
    assert.strictEqual(sec.id, expectedIds[i]);
    assert.strictEqual(sec.number, i.toString().padStart(2, '0'));
  }
});

test('computeScrollProgress handles edge cases (empty or single item)', () => {
  const empty = computeScrollProgress(0, 800, 5000, []);
  assert.strictEqual(empty.activeIndex, 0);
  assert.strictEqual(empty.progressRatio, 0);

  const single = computeScrollProgress(0, 800, 5000, [100]);
  assert.strictEqual(single.activeIndex, 0);
  assert.strictEqual(single.progressRatio, 1);
});

test('computeScrollProgress returns entrance at top of page', () => {
  const offsets = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000];
  const top = computeScrollProgress(20, 800, 9000, offsets);
  assert.strictEqual(top.activeIndex, 0);
  assert.strictEqual(top.progressRatio, 0);
});

test('computeScrollProgress returns cosmic vault at bottom of page', () => {
  const offsets = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000];
  // docHeight = 9000, windowHeight = 800, scrollY = 8200 -> scrollY + windowHeight = 9000 >= docHeight - 40
  const bottom = computeScrollProgress(8200, 800, 9000, offsets);
  assert.strictEqual(bottom.activeIndex, 10);
  assert.strictEqual(bottom.progressRatio, 1);
});

test('computeScrollProgress correctly calculates intermediate sections and smooth progress', () => {
  // 11 sections separated by 1000px: 0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000
  const offsets = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
  const windowHeight = 1000;
  // trigger line is scrollY + 0.35 * 1000 = scrollY + 350
  // When scrollY = 2650: triggerY = 3000 (Sound vs Light offset)
  const soundVsLight = computeScrollProgress(2650, windowHeight, 15000, offsets);
  assert.strictEqual(soundVsLight.activeIndex, 3);
  assert.ok(Math.abs(soundVsLight.progressRatio - 0.3) < 0.001);

  // When scrollY = 3150: triggerY = 3500 (halfway between Sound vs Light and Animal Olympics)
  const halfway = computeScrollProgress(3150, windowHeight, 15000, offsets);
  assert.strictEqual(halfway.activeIndex, 3);
  assert.ok(Math.abs(halfway.progressRatio - 0.35) < 0.001);

  // When scrollY = 3650: triggerY = 4000 (Animal Olympics)
  const animalOlympics = computeScrollProgress(3650, windowHeight, 15000, offsets);
  assert.strictEqual(animalOlympics.activeIndex, 4);
  assert.ok(Math.abs(animalOlympics.progressRatio - 0.4) < 0.001);
});

test('Scroll progress ratio monotonically increases through walkthrough starting from 0', () => {
  const offsets = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000];
  let previousProgress = -1;

  for (let scrollY = 0; scrollY <= 8200; scrollY += 20) {
    const { progressRatio } = computeScrollProgress(scrollY, 800, 9000, offsets);
    assert.ok(
      progressRatio >= previousProgress,
      `Expected monotonic increase: ${progressRatio} >= ${previousProgress} at scrollY ${scrollY}`
    );
    previousProgress = progressRatio;
  }
});

test('Scroll progress ratio has no discontinuous jumps across entrance threshold (smooth ramp)', () => {
  const offsets = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000];
  // Verify that stepping from scrollY=79 to 81 does not produce a sudden multi-percent jump
  const p79 = computeScrollProgress(79, 800, 9000, offsets).progressRatio;
  const p80 = computeScrollProgress(80, 800, 9000, offsets).progressRatio;
  const p81 = computeScrollProgress(81, 800, 9000, offsets).progressRatio;

  assert.strictEqual(p79, 0);
  assert.strictEqual(p80, 0);
  assert.ok(p81 >= 0 && p81 < 0.001, `Expected smooth start, got ${p81}`);
  assert.ok(Math.abs(p81 - p80) < 0.001, 'Delta across threshold must be smooth and sub-milliratio');
});

test('computeScrollProgress safely triggers bottom of document when scroll hits end', () => {
  // Scenario where last section is tall, but user scrolled to document bottom
  const offsets = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 12000];
  // docHeight = 13000, windowHeight = 1000 -> scrollY = 11980 (within 40px of bottom 12000)
  const atEnd = computeScrollProgress(11980, 1000, 13000, offsets);
  assert.strictEqual(atEnd.activeIndex, 10);
  assert.strictEqual(atEnd.progressRatio, 1);
});
