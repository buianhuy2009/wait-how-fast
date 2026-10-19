export interface SpeedExhibit {
  id: string;
  name: string;
  subtitle: string;
  speedMps: number; // meters per second
  displaySpeed: string;
  category: 'ultra-slow' | 'everyday' | 'biological' | 'cosmic';
  defaultZoom: number; // e.g. 1,000,000 for nanometers
  defaultSlowMo: number; // e.g. 0.001 for hyper-fast
  icon: string;
  accentColor: string;
  plaqueFact: string;
  screenTransitSummary: string; // e.g. "Takes 4.8 months to cross 1 cm"
  mathFormula: string;
  citation: string;
  citationSource: string;
  interactiveTips: string;
}

export const SPEED_EXHIBITS: SpeedExhibit[] = [
  {
    id: 'continental-drift',
    name: 'Continental Drift',
    subtitle: 'North America & Europe Tectonic Separation',
    speedMps: 7.92e-10, // ~2.5 cm/year
    displaySpeed: '0.79 nm/s (2.5 cm/year)',
    category: 'ultra-slow',
    defaultZoom: 2_000_000,
    defaultSlowMo: 1.0,
    icon: '🌍',
    accentColor: '#10b981',
    plaqueFact: 'North America and Europe drift apart across the Mid-Atlantic Ridge at roughly the exact same speed your fingernails grow (about 2.5 cm every year). On your monitor at 1:1 true physical scale, it takes 4.8 months to move just 1 centimeter!',
    screenTransitSummary: 'Takes ~4.8 months to move 1 centimeter across your screen.',
    mathFormula: 'v = (0.025 m) / (365.25 * 86,400 s) = 7.924 * 10^-10 m/s (0.792 nm/s)',
    citation: 'USGS Global Plate Motion Models & NOAA Satellite Geodesy',
    citationSource: 'https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move',
    interactiveTips: 'Toggle "Microscope Zoom (2,000,000x)" to watch tectonic plates visibly crawl in real time.',
  },
  {
    id: 'fingernail-growth',
    name: 'Fingernail Growth',
    subtitle: 'Human Keratin Matrix Extrusion',
    speedMps: 1.32e-9, // ~3.47 mm/month
    displaySpeed: '1.32 nm/s (3.47 mm/month)',
    category: 'ultra-slow',
    defaultZoom: 1_000_000,
    defaultSlowMo: 1.0,
    icon: '💅',
    accentColor: '#ec4899',
    plaqueFact: 'Human fingernails grow at an average rate of 3.47 mm per month (thumbnails and middle fingers grow fastest; toenails grow at roughly 1/3 this speed). At true scale, it takes approximately 62 hours for a fingernail tip to advance by just one single pixel on your screen.',
    screenTransitSummary: 'Takes ~62 hours to advance by 1 single display pixel.',
    mathFormula: 'v = (0.00347 m) / (30.4375 * 86,400 s) = 1.319 * 10^-9 m/s (1.32 nm/s)',
    citation: 'Yaemsiri, S. et al., "Growth rate of human fingernails and toenails", Journal of the European Academy of Dermatology and Venereology (2010)',
    citationSource: 'https://pubmed.ncbi.nlm.nih.gov/20015152/',
    interactiveTips: 'Use the 1,000,000x zoom slider to witness keratinocyte cell division occurring before your eyes.',
  },
  {
    id: 'hair-growth',
    name: 'Human Hair Growth',
    subtitle: 'Scalp Follicle Production',
    speedMps: 4.75e-9, // ~1.25 cm/month
    displaySpeed: '4.75 nm/s (1.25 cm/month)',
    category: 'ultra-slow',
    defaultZoom: 500_000,
    defaultSlowMo: 1.0,
    icon: '💇',
    accentColor: '#f59e0b',
    plaqueFact: 'An individual scalp hair moves forward by 1 pixel every 14.5 hours. However, with an average of 100,000 follicles on a human head, your scalp collectively synthesizes 0.47 millimeters of brand-new hair every single second!',
    screenTransitSummary: 'Single strand takes ~14.5 hours per pixel; scalp produces 0.5 mm/sec combined!',
    mathFormula: 'v = (0.0125 m) / (30.4375 * 86,400 s) = 4.753 * 10^-9 m/s per follicle',
    citation: 'LeBeau, M. A. et al., "Hair Growth Rates", Forensic Science International',
    citationSource: 'https://www.sciencedirect.com/journal/forensic-science-international',
    interactiveTips: 'Compare single-strand speed against the combined 100,000 follicle production rate.',
  },
  {
    id: 'garden-snail',
    name: 'Garden Snail',
    subtitle: 'Cornu aspersum Top Sprint',
    speedMps: 0.0013, // 1.3 mm/s
    displaySpeed: '1.3 mm/s (0.0029 mph)',
    category: 'everyday',
    defaultZoom: 1.0,
    defaultSlowMo: 1.0,
    icon: '🐌',
    accentColor: '#84cc16',
    plaqueFact: 'A garden snail glides across pedal slime at approximately 1.3 millimeters per second. It takes about 3.8 minutes to crawl from the left bezel to the right bezel of a 13-inch laptop screen. During a standard 45-minute school class, it covers 3.5 meters (11.5 feet)!',
    screenTransitSummary: 'Takes ~3.8 minutes to crawl across your 13-inch monitor bezel-to-bezel.',
    mathFormula: 'v = 0.0013 m/s = 1.3 mm/s = 4.68 m/hr = 0.00291 mph',
    citation: 'World Snail Racing Championship / BBC Science Focus Zoology',
    citationSource: 'https://www.sciencefocus.com/nature/how-fast-does-a-snail-travel',
    interactiveTips: 'Watch the live snail glide in real time without any zoom or slow-motion.',
  },
  {
    id: '3d-printer-nozzle',
    name: 'High-Speed 3D Printer Nozzle',
    subtitle: 'CoreXY Printhead (Bambu Lab / Voron)',
    speedMps: 0.5, // 500 mm/s
    displaySpeed: '500 mm/s (1.12 mph)',
    category: 'everyday',
    defaultZoom: 1.0,
    defaultSlowMo: 1.0,
    icon: '🖨️',
    accentColor: '#06b6d4',
    plaqueFact: 'Modern CoreXY 3D printers deposit molten filament at speeds up to 500 mm/s and accelerate at 20,000 mm/s² (over 2 Gs of acceleration). That starting snap accelerates faster than a Formula 1 racecar off the starting grid!',
    screenTransitSummary: 'Crosses your entire 12-inch screen in approximately 0.6 seconds.',
    mathFormula: 'v = 0.50 m/s = 500 mm/s; a = 20,000 mm/s² ≈ 2.04 G',
    citation: 'Bambu Lab X1-Carbon / Voron 2.4 Engineering Benchmarks',
    citationSource: 'https://bambulab.com/en/x1',
    interactiveTips: 'Observe how rapidly 500 mm/s crosses your calibrated display in 1:1 true scale.',
  },
  {
    id: 'blood-aorta',
    name: 'Blood in Human Aorta',
    subtitle: 'Systolic Heart Contraction Surge',
    speedMps: 1.0, // 1.0 m/s mean systolic
    displaySpeed: '1.0 m/s (2.24 mph)',
    category: 'biological',
    defaultZoom: 1.0,
    defaultSlowMo: 1.0,
    icon: '❤️',
    accentColor: '#ef4444',
    plaqueFact: 'During systolic contraction, your left ventricle exerts immense pressure, shooting blood through the aortic root at 1.0 to 1.7 meters per second. It zips completely across your laptop screen in roughly 0.3 seconds before slowing in peripheral capillaries.',
    screenTransitSummary: 'Crosses your screen in ~0.3 seconds in a sharp pulse.',
    mathFormula: 'v_peak = 1.0 to 1.7 m/s (Doppler echocardiography standard velocity)',
    citation: 'American Heart Association / Guyton and Hall Textbook of Medical Physiology (14th Ed.)',
    citationSource: 'https://www.heart.org',
    interactiveTips: 'Notice the contrast between aorta blood (1.0 m/s) and capillary blood (0.0003 m/s).',
  },
  {
    id: 'pain-nerve',
    name: 'Dull Pain Nerve (C-Fiber)',
    subtitle: 'Unmyelinated Slow Pain Impulse',
    speedMps: 1.0, // 0.5 - 2.0 m/s
    displaySpeed: '1.0 m/s (2.24 mph)',
    category: 'biological',
    defaultZoom: 1.0,
    defaultSlowMo: 1.0,
    icon: '⚡',
    accentColor: '#a855f7',
    plaqueFact: 'When you stub your toe, myelinated A-beta nerve fibers send the sharp touch sensation to your brain at 120 m/s (~270 mph) almost instantly. But unmyelinated C-fibers carrying the agonizing dull ache creep along at just 1 m/s (2.2 mph), explaining the 1.5-second dread delay!',
    screenTransitSummary: 'Takes ~1.5 seconds to travel from your big toe to your sensory cortex.',
    mathFormula: 'Conduction Velocity = 0.5 to 2.0 m/s (Unmyelinated Type C sensory axons)',
    citation: 'Purves D. et al., Neuroscience (6th Ed., Chapter 10: Pain Mechanisms)',
    citationSource: 'https://www.ncbi.nlm.nih.gov/books/NBK10924/',
    interactiveTips: 'Race the 1 m/s C-Fiber against the 120 m/s Touch fiber in the dual track.',
  },
  {
    id: 'sound-in-air',
    name: 'Speed of Sound (Mach 1)',
    subtitle: 'Acoustic Compression Wave in 20°C Air',
    speedMps: 343, // 343 m/s
    displaySpeed: '343 m/s (767 mph)',
    category: 'cosmic',
    defaultZoom: 1.0,
    defaultSlowMo: 0.001, // 1000x slow-mo
    icon: '🔊',
    accentColor: '#3b82f6',
    plaqueFact: 'Sound travels through dry air at 20°C at 343 m/s. In real time, a sound wavefront crosses your entire 12-inch laptop screen in less than 0.9 milliseconds. When slowed down 1,000x in Bullet-Time mode, it drifts across at a comfortable 34.3 cm/s.',
    screenTransitSummary: 'Crosses your screen in ~0.00087 seconds (870 microseconds)!',
    mathFormula: 'c_air = 331.3 * sqrt(1 + T/273.15) ≈ 343.2 m/s at 20°C',
    citation: 'NIST Standard Reference Data / CRC Handbook of Chemistry and Physics',
    citationSource: 'https://www.nist.gov',
    interactiveTips: 'Use the Bullet-Time Slow-Mo slider (0.001x) to observe the wave propagating.',
  },
  {
    id: 'grace-hopper-light',
    name: 'Grace Hopper\'s "Light in 1 Nanosecond"',
    subtitle: 'Cosmic Speed of Light in Vacuum',
    speedMps: 299_792_458,
    displaySpeed: '299,792,458 m/s (186,282 mi/s)',
    category: 'cosmic',
    defaultZoom: 1.0,
    defaultSlowMo: 0.000_000_001, // 1 billionth second scale
    icon: '💡',
    accentColor: '#facc15',
    plaqueFact: 'Computer pioneer Admiral Grace Hopper famously carried 11.8-inch (29.98 cm) pieces of wire to hand out to military admirals and students. That 11.8 inches is the absolute maximum cosmic distance light or electricity can travel in one billionth of a second (1 ns)—virtually the exact width of your laptop screen!',
    screenTransitSummary: 'Travels 11.8 inches (screen width) in exactly 0.000000001 seconds (1 ns)!',
    mathFormula: 'd = c * t = 299,792,458 m/s * 10^-9 s = 0.299792 m = 11.803 inches',
    citation: 'Grace Murray Hopper Collection, Smithsonian National Museum of American History',
    citationSource: 'https://americanhistory.si.edu/collections/search/object/nmah_692464',
    interactiveTips: 'In Freeze-Frame 1-Nanosecond mode, see how light fills your calibrated screen from bezel to bezel.',
  },
];
