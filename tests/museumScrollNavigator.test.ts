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

test('Scroll progress ratio monotonically increases through walkthrough', () => {
  const offsets = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000];
  let previousProgress = -1;

  for (let scrollY = 100; scrollY <= 7200; scrollY += 200) {
    const { progressRatio } = computeScrollProgress(scrollY, 800, 8900, offsets);
    assert.ok(
      progressRatio >= previousProgress,
      `Expected monotonic increase: ${progressRatio} >= ${previousProgress} at scrollY ${scrollY}`
    );
    previousProgress = progressRatio;
  }
});
