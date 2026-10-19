/**
 * ISO/IEC 7810 ID-1 standard card dimensions and monitor calibration math.
 * Standard ID-1 cards include credit cards, student IDs, driver's licenses, and gift cards globally.
 */

export const ISO_CARD = {
  widthMm: 85.60,
  heightMm: 53.98,
  widthInches: 85.60 / 25.4, // ~3.3700787 inches
  heightInches: 53.98 / 25.4, // ~2.1251968 inches
  aspectRatio: 85.60 / 53.98, // ~1.58577
};

export interface DevicePreset {
  id: string;
  name: string;
  deviceType: 'laptop' | 'desktop' | 'tablet' | 'mobile';
  diagonalInches: number;
  estimatedCssPpi: number;
  description: string;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'standard-96',
    name: 'W3C Standard Display',
    deviceType: 'desktop',
    diagonalInches: 24,
    estimatedCssPpi: 96,
    description: 'Default W3C reference screen (1 in = 96 CSS px)',
  },
  {
    id: 'macbook-13',
    name: '13" MacBook / Ultrabook',
    deviceType: 'laptop',
    diagonalInches: 13.3,
    estimatedCssPpi: 112,
    description: 'Common 13-inch modern laptops',
  },
  {
    id: 'chromebook-11',
    name: '11.6" School Chromebook',
    deviceType: 'laptop',
    diagonalInches: 11.6,
    estimatedCssPpi: 135,
    description: 'Standard 11.6" 1366x768 student laptop',
  },
  {
    id: 'desktop-24',
    name: '24" 1080p Monitor',
    deviceType: 'desktop',
    diagonalInches: 24,
    estimatedCssPpi: 92,
    description: 'Standard 24-inch full HD desktop monitor',
  },
  {
    id: 'desktop-27-1440p',
    name: '27" 1440p QHD Monitor',
    deviceType: 'desktop',
    diagonalInches: 27,
    estimatedCssPpi: 109,
    description: '27-inch 2560x1440 desktop display',
  },
  {
    id: 'phone-6-1',
    name: '6.1" Smartphone (iPhone/Galaxy)',
    deviceType: 'mobile',
    diagonalInches: 6.1,
    estimatedCssPpi: 156,
    description: 'Standard modern 6.1-inch smartphone viewport',
  },
];

/**
 * Calculates PPI from card width in CSS pixels
 */
export function calculatePpiFromCardWidth(cardWidthCssPx: number): number {
  if (cardWidthCssPx <= 0) return 96;
  return cardWidthCssPx / ISO_CARD.widthInches;
}

/**
 * Calculates card width in CSS pixels from target PPI
 */
export function calculateCardWidthFromPpi(ppi: number): number {
  if (ppi <= 0) return 96 * ISO_CARD.widthInches;
  return ppi * ISO_CARD.widthInches;
}

/**
 * Calculates Pixels Per Millimeter (PPMM)
 */
export function calculatePpmm(ppi: number): number {
  return ppi / 25.4;
}

/**
 * Converts millimeters to CSS pixels
 */
export function mmToPx(mm: number, ppi: number): number {
  return mm * calculatePpmm(ppi);
}

/**
 * Converts inches to CSS pixels
 */
export function inchesToPx(inches: number, ppi: number): number {
  return inches * ppi;
}

/**
 * Converts real velocity (meters per second) to CSS pixels per second on screen
 */
export function velocityToPxPerSec(
  velocityMetersPerSec: number,
  ppi: number,
  zoomScale: number = 1.0,
  timeDilation: number = 1.0 // e.g. 0.001 for slow-mo, 1000 for fast forward
): number {
  const ppmm = calculatePpmm(ppi);
  const mmPerSec = velocityMetersPerSec * 1000;
  return mmPerSec * ppmm * zoomScale * timeDilation;
}

/**
 * Computes how many seconds it takes for an object of given speed (m/s)
 * to cross a screen of width (cssPx), with physical true scaling (1x zoom, 1x time)
 */
export function calculateScreenTransitTime(
  velocityMetersPerSec: number,
  screenWidthCssPx: number,
  ppi: number
): { seconds: number; formatted: string } {
  const pxPerSec = velocityToPxPerSec(velocityMetersPerSec, ppi, 1.0, 1.0);
  if (pxPerSec <= 0) {
    return { seconds: Infinity, formatted: 'Never' };
  }
  const seconds = screenWidthCssPx / pxPerSec;
  return { seconds, formatted: formatDuration(seconds) };
}

/**
 * Human friendly duration formatting (e.g. 4.8 months, 62 hours, 0.3 seconds)
 */
export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds <= 0) return 'Instant';

  if (seconds < 0.000001) {
    return `${(seconds * 1_000_000_000).toFixed(2)} nanoseconds`;
  }
  if (seconds < 0.001) {
    return `${(seconds * 1_000_000).toFixed(2)} microseconds`;
  }
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(1)} milliseconds`;
  }
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)} minutes`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  }
  const days = hours / 24;
  if (days < 30) {
    return `${days.toFixed(1)} days`;
  }
  const months = days / 30.4375;
  if (months < 12) {
    return `${months.toFixed(1)} months`;
  }
  const years = days / 365.25;
  return `${years.toFixed(1)} years`;
}
