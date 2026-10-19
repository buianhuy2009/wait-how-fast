/**
 * Universally familiar everyday objects for physical screen comparison.
 * Zero credit card required! People know and recognize these objects instantly.
 */

export interface FamiliarObject {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  widthMm: number;
  heightMm: number;
  widthInches: number;
  heightInches: number;
  category: 'currency' | 'everyday' | 'body' | 'tech';
  description: string;
  funFact: string;
}

export const FAMILIAR_OBJECTS: FamiliarObject[] = [
  {
    id: 'dollar-bill',
    name: 'US Dollar Bill ($1)',
    subtitle: 'Standard US Federal Reserve Note',
    icon: '💵',
    widthMm: 156.0, // 6.14 inches
    heightMm: 66.3, // 2.61 inches
    widthInches: 156.0 / 25.4,
    heightInches: 66.3 / 25.4,
    category: 'currency',
    description: 'Every US banknote ($1 through $100) is exactly 6.14" × 2.61" (156 mm × 66.3 mm).',
    funFact: 'A garden snail would take ~2 minutes to crawl from George Washington\'s nose to the bill\'s edge!',
  },
  {
    id: 'smartphone',
    name: '6.1" Smartphone (iPhone / Galaxy)',
    subtitle: 'Standard Modern Phone Body',
    icon: '📱',
    widthMm: 71.5,
    heightMm: 146.7,
    widthInches: 71.5 / 25.4,
    heightInches: 146.7 / 25.4,
    category: 'tech',
    description: 'Standard modern smartphone size (iPhone 13-16, Samsung Galaxy S22-S24).',
    funFact: 'In 1 nanosecond, light travels 11.8 inches—almost exactly the height of two iPhones stacked vertically!',
  },
  {
    id: 'quarter-coin',
    name: 'US Quarter ($0.25)',
    subtitle: 'Standard 25-Cent Coin',
    icon: '🪙',
    widthMm: 24.26,
    heightMm: 24.26,
    widthInches: 24.26 / 25.4,
    heightInches: 24.26 / 25.4,
    category: 'currency',
    description: 'Standard US quarter coin diameter is exactly 24.26 mm (0.955 inches).',
    funFact: 'A garden snail travels the width of a quarter in ~18 seconds.',
  },
  {
    id: 'post-it-note',
    name: 'Standard Post-it Note (3" × 3")',
    subtitle: 'Yellow Sticky Note',
    icon: '🏷️',
    widthMm: 76.2,
    heightMm: 76.2,
    widthInches: 3.0,
    heightInches: 3.0,
    category: 'everyday',
    description: 'Classic 3-inch square Post-it note found in offices and classrooms globally.',
    funFact: 'Light takes just 0.25 nanoseconds (254 picoseconds) to cross a 3-inch Post-it note!',
  },
  {
    id: 'pencil',
    name: 'Standard #2 Pencil',
    subtitle: 'Hexagonal School Pencil',
    icon: '✏️',
    widthMm: 190.0,
    heightMm: 7.5,
    widthInches: 190.0 / 25.4,
    heightInches: 7.5 / 25.4,
    category: 'everyday',
    description: 'An unsharpened standard school pencil is ~190 mm (7.5 inches) long.',
    funFact: 'North America and Europe separate by the length of a pencil once every 7.6 years.',
  },
  {
    id: 'fingernail',
    name: 'Human Fingernail Width',
    subtitle: 'Index Fingernail Bed',
    icon: '💅',
    widthMm: 12.0,
    heightMm: 12.0,
    widthInches: 12.0 / 25.4,
    heightInches: 12.0 / 25.4,
    category: 'body',
    description: 'Average adult index fingernail is ~12 mm (~0.5 inches) wide.',
    funFact: 'It takes ~3 months for your fingernail to grow the length of your own fingernail bed!',
  },
  {
    id: 'ant',
    name: 'Worker Ant',
    subtitle: 'Common Garden Ant (Lasius niger)',
    icon: '🐜',
    widthMm: 3.5,
    heightMm: 1.5,
    widthInches: 3.5 / 25.4,
    heightInches: 1.5 / 25.4,
    category: 'everyday',
    description: 'Standard black garden ant is ~3 to 4 mm long.',
    funFact: 'A sneeze expels droplets that travel 13,000 ant-lengths in a single second (45 m/s)!',
  },
  {
    id: 'student-id',
    name: 'Standard Plastic Card (ID / Gift Card)',
    subtitle: 'ISO/IEC 7810 ID-1 Standard',
    icon: '🪪',
    widthMm: 85.6,
    heightMm: 53.98,
    widthInches: 85.6 / 25.4,
    heightInches: 53.98 / 25.4,
    category: 'everyday',
    description: 'Standard library card, school ID, or transit pass (85.6 mm × 53.98 mm).',
    funFact: 'This is the international ISO standard size for virtually every wallet card.',
  },
];

/**
 * Compares an arbitrary distance in millimeters to familiar everyday objects.
 */
export function getFamiliarDistanceComparison(distanceMm: number): string {
  if (distanceMm < 0.0001) {
    return `${(distanceMm * 1_000_000).toFixed(1)} nm (smaller than a virus capsid)`;
  }
  if (distanceMm < 0.01) {
    return `${(distanceMm * 1000).toFixed(1)} µm (~${(distanceMm * 1000 / 7).toFixed(1)} red blood cell widths)`;
  }
  if (distanceMm < 1) {
    return `${(distanceMm).toFixed(2)} mm (~${(distanceMm / 0.1).toFixed(0)} sheets of paper thick)`;
  }
  if (distanceMm < 10) {
    return `${(distanceMm).toFixed(1)} mm (~${(distanceMm / 3.5).toFixed(1)} ant lengths)`;
  }
  if (distanceMm < 50) {
    return `${(distanceMm / 24.26).toFixed(1)} US Quarter widths (${(distanceMm).toFixed(1)} mm)`;
  }
  if (distanceMm < 100) {
    return `${(distanceMm / 76.2).toFixed(1)} Post-it Notes (${(distanceMm).toFixed(1)} mm)`;
  }
  if (distanceMm < 300) {
    return `${(distanceMm / 156.0).toFixed(1)} US Dollar bills (${(distanceMm / 10).toFixed(1)} cm)`;
  }
  if (distanceMm < 1000) {
    return `${(distanceMm / 190.0).toFixed(1)} pencil lengths (${(distanceMm / 1000).toFixed(2)} meters)`;
  }
  return `${(distanceMm / 1000).toFixed(2)} meters`;
}
