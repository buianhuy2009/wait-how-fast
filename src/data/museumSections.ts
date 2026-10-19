export interface MuseumWalkthroughSection {
  id: string;
  number: string;
  title: string;
}

export const MUSEUM_WALKTHROUGH_SECTIONS: MuseumWalkthroughSection[] = [
  { id: 'entrance', number: '00', title: 'Entrance' },
  { id: 'realtime-stream', number: '01', title: 'Real-Time Stream' },
  { id: 'speed-conveyor', number: '02', title: 'Speed Conveyor' },
  { id: 'sound-vs-light', number: '03', title: 'Sound vs Light' },
  { id: 'animal-olympics', number: '04', title: 'Animal Olympics' },
  { id: 'data-scale', number: '05', title: 'Data Scale' },
  { id: 'cpu-dilation', number: '06', title: 'CPU Dilation' },
  { id: 'latency-arena', number: '07', title: 'Latency Arena' },
  { id: 'framerate-vault', number: '08', title: 'Refresh Vault' },
  { id: 'human-vault', number: '09', title: 'Speed of You' },
  { id: 'cosmic-vault', number: '10', title: 'Cosmic Vault' },
];

/**
 * Pure calculation function for scroll progress and active section detection.
 * Separated for testability and 60fps animation frame performance.
 */
export function computeScrollProgress(
  scrollY: number,
  windowHeight: number,
  docHeight: number,
  sectionOffsets: number[]
): { activeIndex: number; progressRatio: number } {
  const N = sectionOffsets.length;
  if (N === 0) return { activeIndex: 0, progressRatio: 0 };
  if (N === 1) return { activeIndex: 0, progressRatio: 1 };

  // Bottom of document guard: user scrolled to or near document bottom
  if (windowHeight + scrollY >= docHeight - 40) {
    return { activeIndex: N - 1, progressRatio: 1 };
  }

  // Top of document: entrance breathing room (scrollY <= 80px)
  const entranceThreshold = 80;
  if (scrollY <= entranceThreshold) {
    return { activeIndex: 0, progressRatio: 0 };
  }

  // Viewport trigger line (35% from the top of the screen for natural reading focal point)
  const focalOffset = windowHeight * 0.35;
  const triggerY = scrollY + focalOffset;

  if (triggerY <= sectionOffsets[0]) {
    return { activeIndex: 0, progressRatio: 0 };
  }

  if (triggerY >= sectionOffsets[N - 1]) {
    return { activeIndex: N - 1, progressRatio: 1 };
  }

  // Smoothly interpolate between entranceThreshold and the scroll position where triggerY reaches sectionOffsets[1]
  // This completely eliminates any discontinuous step jump at scrollY = 80px
  const s1TriggerScrollY = Math.max(entranceThreshold + 1, sectionOffsets[1] - focalOffset);
  if (scrollY < s1TriggerScrollY) {
    const fraction = (scrollY - entranceThreshold) / (s1TriggerScrollY - entranceThreshold);
    const progressRatio = Math.max(0, Math.min(1 / (N - 1), fraction / (N - 1)));
    const activeIndex = fraction >= 0.5 ? 1 : 0;
    return { activeIndex, progressRatio };
  }

  // Determine which section segment triggerY currently lies within
  for (let i = 1; i < N - 1; i++) {
    const current = sectionOffsets[i];
    const next = sectionOffsets[i + 1];

    if (triggerY >= current && triggerY < next) {
      const interval = Math.max(1, next - current);
      const fraction = Math.max(0, Math.min(1, (triggerY - current) / interval));
      const progressRatio = (i + fraction) / (N - 1);
      return { activeIndex: i, progressRatio };
    }
  }

  return { activeIndex: N - 1, progressRatio: 1 };
}
