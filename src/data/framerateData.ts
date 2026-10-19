export interface FrameRateTier {
  fps: number;
  label: string;
  frameTimeMs: number;
  description: string;
  perceivedSmoothness: string;
  color: string;
}

export const FRAMERATE_TIERS: FrameRateTier[] = [
  {
    fps: 15,
    label: '15 FPS (PowerPoint Mode)',
    frameTimeMs: 66.67,
    description: 'Distinct, disjointed phantom images. Eye saccades easily catch the jump between positions.',
    perceivedSmoothness: 'Choppy & Stuttery',
    color: '#ef4444',
  },
  {
    fps: 30,
    label: '30 FPS (Classic Console)',
    frameTimeMs: 33.33,
    description: 'Adequate for passive viewing, but rapid mouse pans reveal noticeable double-imaging and input drag.',
    perceivedSmoothness: 'Barely Acceptable for Interaction',
    color: '#f59e0b',
  },
  {
    fps: 60,
    label: '60 FPS (Web & Mobile Baseline)',
    frameTimeMs: 16.67,
    description: 'The standard baseline for modern digital displays. Good motion persistence with minimal jitter.',
    perceivedSmoothness: 'Smooth Baseline',
    color: '#10b981',
  },
  {
    fps: 120,
    label: '120 FPS (High-Refresh / ProMotion)',
    frameTimeMs: 8.33,
    description: 'Text remains readable even while scrolling fast. Input delay drops below 10 ms for true direct-manipulation feel.',
    perceivedSmoothness: 'Buttery Fluid',
    color: '#38bdf8',
  },
];

export const FRAMERATE_EXPLAINERS = [
  {
    title: 'Why 24 FPS Works in Cinema, but Sucks in Video Games',
    content: 'A Hollywood film camera shutter stays open for 1/48th of a second (a 180° shutter angle). Moving objects naturally blur across the film emulsion, creating continuous optical streaks that your brain smoothly connects. Video games render mathematically crisp, zero-blur instantaneous snapshots. At 24 FPS with no shutter blur, your retina sees a sequence of jagged teleporting images!',
    citation: 'American Cinematographer Manual (10th Ed.) & Blur Busters (Mark Rejhon)',
    citationSource: 'https://blurbusters.com/',
  },
  {
    title: 'The Brain\'s "Efference Copy" (Direct Manipulation Illusion)',
    content: 'When you sit in a movie theater, you are a passive observer. But when you grab a computer mouse, your brain sends a motor command to your hand and simultaneously keeps an "efference copy" in your sensory cortex. If the screen cursor lags behind your hand movement by more than 15 milliseconds, the brain\'s predictive model fails, breaking the illusion that you are directly touching the digital object.',
    citation: 'Wolpert, D. M. et al., "Internal models in the cerebellum", Trends in Cognitive Sciences',
    citationSource: 'https://www.cell.com/trends/cognitive-sciences/home',
  },
  {
    title: 'Critical Flicker Fusion & Peripheral Vision',
    content: 'The human eye doesn\'t see in "frames per second", but photoreceptor rods and cones have a biochemical recovery time. While the center of your eye (fovea) stops detecting flicker around 60 to 75 Hz, your peripheral vision is wired with fast magnocellular cells that detect motion and flicker up to 120 Hz to alert you to predators in your side vision!',
    citation: 'Hecht, S. & Shlaer, S., "The relation between visual acuity and illumination", Journal of General Physiology',
    citationSource: 'https://rupress.org/jgp',
  },
];
