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

  // Near the top of the document
  if (scrollY < 80) {
    return { activeIndex: 0, progressRatio: 0 };
  }

  // Near the bottom of the document
  if (windowHeight + scrollY >= docHeight - 40) {
    return { activeIndex: N - 1, progressRatio: 1 };
  }

  // Viewport trigger line (35% from the top of the screen for natural reading focal point)
  const triggerY = scrollY + windowHeight * 0.35;

  if (triggerY <= sectionOffsets[0]) {
    return { activeIndex: 0, progressRatio: 0 };
  }

  if (triggerY >= sectionOffsets[N - 1]) {
    return { activeIndex: N - 1, progressRatio: 1 };
  }

  // Determine which section segment triggerY currently lies within
  for (let i = 0; i < N - 1; i++) {
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
