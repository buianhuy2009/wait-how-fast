export interface DataScaleUnit {
  id: string;
  name: string;
  bytes: number;
  abbreviation: string;
}

export const DATA_SIZES: DataScaleUnit[] = [
  { id: '1b', name: '1 Byte', bytes: 1, abbreviation: '1 B' },
  { id: '1kb', name: '1 Kilobyte', bytes: 1_000, abbreviation: '1 KB' },
  { id: '1mb', name: '1 Megabyte', bytes: 1_000_000, abbreviation: '1 MB' },
  { id: '1gb', name: '1 Gigabyte', bytes: 1_000_000_000, abbreviation: '1 GB' },
  { id: '1tb', name: '1 Terabyte', bytes: 1_000_000_000_000, abbreviation: '1 TB' },
  { id: '1pb', name: '1 Petabyte', bytes: 1_000_000_000_000_000, abbreviation: '1 PB' },
];

export interface PhysicalAnalogyItem {
  id: string;
  name: string;
  icon: string;
  unitNoun: string;
  baseUnitDescription: string;
  scales: Record<string, {
    quantity: string;
    comparison: string;
    visualDetail: string;
  }>;
  throughputFact: string; // e.g. at 1 Gbps internet
}

export const PHYSICAL_ANALOGIES: Record<string, PhysicalAnalogyItem> = {
  rice: {
    id: 'rice',
    name: 'Grains of Rice (Weight & Mass)',
    icon: '🍚',
    unitNoun: 'grain of rice',
    baseUnitDescription: '1 Byte = 1 grain of long-grain white rice (approx 0.029 grams / 0.001 oz)',
    scales: {
      '1b': {
        quantity: '1 grain (0.029 g)',
        comparison: 'A single uncooked grain of rice on your fingertip.',
        visualDetail: 'Tiny white speck.',
      },
      '1kb': {
        quantity: '1,000 grains (29 g)',
        comparison: 'A small snack bowl or 2 tablespoons of rice.',
        visualDetail: 'Fits in the palm of your hand.',
      },
      '1mb': {
        quantity: '1,000,000 grains (29 kg / 64 lbs)',
        comparison: 'A giant commercial restaurant sack of rice, as heavy as an adult Golden Retriever!',
        visualDetail: 'Requires two hands and bent knees to lift.',
      },
      '1gb': {
        quantity: '1 Billion grains (29 Metric Tons)',
        comparison: 'Fills an entire 40-foot intermodal shipping container to the ceiling! Enough to feed 1 person for 100 years.',
        visualDetail: 'A massive steel cargo container parked outside your house.',
      },
      '1tb': {
        quantity: '1 Trillion grains (29,000 Metric Tons)',
        comparison: 'An entire ocean container ship fleet carrying 1,000 shipping containers full of rice.',
        visualDetail: 'A massive cargo freighter cutting across the Pacific Ocean.',
      },
      '1pb': {
        quantity: '1 Quadrillion grains (29 Million Metric Tons)',
        comparison: 'More than half the entire annual rice crop produced by the entire United States!',
        visualDetail: 'A mountain of rice taller than Mount Everest.',
      },
    },
    throughputFact: 'At 1 Gigabit/sec internet (125 MB/s), your Wi-Fi router is dumping 3.625 metric tons of rice per second into your device—the weight of two full-sized pickup trucks every single second!',
  },
  paper: {
    id: 'paper',
    name: 'Sheets of Paper (Height & Volume)',
    icon: '📄',
    unitNoun: 'typed character / paper',
    baseUnitDescription: '1 Byte = 1 typed character (standard printed page holds ~2,000 characters, 0.1 mm thick)',
    scales: {
      '1b': {
        quantity: '1 typed character',
        comparison: 'A single letter "A" typed on a page.',
        visualDetail: 'A pinprick of black ink.',
      },
      '1kb': {
        quantity: '1/2 page of text',
        comparison: 'A quick single-spaced school essay paragraph.',
        visualDetail: 'Half a sheet of printer paper.',
      },
      '1mb': {
        quantity: '500 sheets (5 cm / 2 in tall)',
        comparison: 'One thick Harry Potter novel or a standard 500-sheet ream of copy paper.',
        visualDetail: 'A neat desk stack of paper.',
      },
      '1gb': {
        quantity: '500,000 sheets (50 meters / 164 ft tall)',
        comparison: 'A paper tower taller than the Statue of Liberty (without pedestal) or a 15-story apartment building!',
        visualDetail: 'Towers higher than city streetlamps.',
      },
      '1tb': {
        quantity: '500 Million sheets (50 kilometers / 31 miles tall)',
        comparison: 'A tower of paper reaching far into the stratosphere, higher than commercial airplanes and where weather balloons pop!',
        visualDetail: 'Shoots directly into the black vacuum of space.',
      },
      '1pb': {
        quantity: '500 Billion sheets (50,000 kilometers high)',
        comparison: 'Stretches past geostationary orbit, and wraps completely around planet Earth 1.25 times!',
        visualDetail: 'A planetary ring of printer paper encircling Earth.',
      },
    },
    throughputFact: 'At 1 Gigabit/sec (125 MB/s), your internet connection is printing 62,500 pages per second—creating a 6.25-meter (20-foot) paper pillar every single second!',
  },
  distance: {
    id: 'distance',
    name: 'Physical Distance (Millimeters to Light)',
    icon: '📏',
    unitNoun: 'millimeter of distance',
    baseUnitDescription: '1 Byte = 1 millimeter (width of a lead pencil tip or paperclip wire)',
    scales: {
      '1b': {
        quantity: '1 millimeter',
        comparison: 'Width of a sharp pencil tip or staple wire.',
        visualDetail: 'Tiny notch on a ruler.',
      },
      '1kb': {
        quantity: '1 meter (3.28 ft)',
        comparison: 'The length of an acoustic guitar or the arm span of a 7th grader.',
        visualDetail: 'Standard meter stick.',
      },
      '1mb': {
        quantity: '1 kilometer (0.62 miles)',
        comparison: 'Length of 10 soccer/football fields laid end-to-end, or a brisk 12-minute walk.',
        visualDetail: 'Stretches across your neighborhood.',
      },
      '1gb': {
        quantity: '1,000 kilometers (621 miles)',
        comparison: 'Driving from New York City to Atlanta, or from London to Berlin!',
        visualDetail: 'Crosses several states or European countries.',
      },
      '1tb': {
        quantity: '1,000,000 kilometers (621,371 miles)',
        comparison: 'Wraps around Earth\'s equator 25 times, or flies to the Moon and back, plus another 230,000 km!',
        visualDetail: 'Looped multiple times between Earth and Moon.',
      },
      '1pb': {
        quantity: '1 Billion kilometers (6.68 AU)',
        comparison: 'Travels from Earth past Mars and the asteroid belt, all the way past Jupiter to Saturn!',
        visualDetail: 'Spans across the solar system.',
      },
    },
    throughputFact: 'At 1 Gigabit/sec (125 MB/s), your data stream travels 125 meters per second (280 mph)—faster than a Japanese Shinkansen bullet train!',
  },
  time: {
    id: 'time',
    name: 'Time (Seconds to Geological Epochs)',
    icon: '⏳',
    unitNoun: 'second of time',
    baseUnitDescription: '1 Byte = 1 second of ticking time',
    scales: {
      '1b': {
        quantity: '1 second',
        comparison: 'One tick of a wall clock.',
        visualDetail: 'Single heart beat.',
      },
      '1kb': {
        quantity: '16.6 minutes',
        comparison: 'Duration of one school recess break or walking a mile.',
        visualDetail: 'Short school break.',
      },
      '1mb': {
        quantity: '11.57 days',
        comparison: 'Almost two full weeks (spring break plus extra weekend).',
        visualDetail: 'Two flip calendar pages.',
      },
      '1gb': {
        quantity: '31.69 years',
        comparison: 'A full generation of human life—from birth, through school and university, to adulthood!',
        visualDetail: 'An entire human life chapter.',
      },
      '1tb': {
        quantity: '31,688 years',
        comparison: 'Reaches back into the Upper Paleolithic Ice Age when woolly mammoths and saber-toothed cats roamed Earth!',
        visualDetail: 'Cave art paintings and glacial ice sheets.',
      },
      '1pb': {
        quantity: '31.69 Million years',
        comparison: 'Deep prehistoric geological time (the Oligocene epoch)—before humans, australopithecines, or modern primates existed!',
        visualDetail: 'Ancient mammals before the dawn of humanity.',
      },
    },
    throughputFact: 'At 1 Gigabit/sec (125 MB/s), every single second of streaming delivers nearly 4 years of human life time!',
  },
  water: {
    id: 'water',
    name: 'Water Volume (Droplets to Lakes)',
    icon: '💧',
    unitNoun: 'droplet of water',
    baseUnitDescription: '1 Byte = 1 drop of liquid water (~0.05 milliliters / 20 drops per mL)',
    scales: {
      '1b': {
        quantity: '1 water drop (0.05 mL)',
        comparison: 'A single raindrop hitting a window pane.',
        visualDetail: 'Small clear droplet.',
      },
      '1kb': {
        quantity: '50 mL (1.7 oz)',
        comparison: 'A double shot of espresso or a travel-sized shampoo bottle.',
        visualDetail: 'A small cup.',
      },
      '1mb': {
        quantity: '50 Liters (13.2 gallons)',
        comparison: 'A full domestic bathtub filled with warm water.',
        visualDetail: 'A bubbling home bathtub.',
      },
      '1gb': {
        quantity: '50,000 Liters (13,200 gallons)',
        comparison: 'A large residential backyard swimming pool with deep end!',
        visualDetail: 'A sparkling blue swimming pool.',
      },
      '1tb': {
        quantity: '50 Million Liters (13.2 Million gallons)',
        comparison: 'A 20-acre municipal drinking water reservoir or scenic mountain lake.',
        visualDetail: 'A shimmering lake surrounded by pine trees.',
      },
      '1pb': {
        quantity: '50 Billion Liters (13.2 Billion gallons)',
        comparison: 'An immense inland reservoir supply powering hydroelectric dams and entire cities.',
        visualDetail: 'A massive dam holding back an ocean of fresh water.',
      },
    },
    throughputFact: 'At 1 Gigabit/sec (125 MB/s), your Wi-Fi is pumping 6.25 Liters of water per second (100 gallons a minute)—like an open fire hydrant blasting full bore!',
  },
};

/**
 * Calculates bits to bytes, byte rate, and download times for any speed
 */
export function calculateThroughput(
  speedMbps: number,
  fileSizeMb: number = 50_000 // 50 GB game
): {
  speedMbps: number;
  speedMBps: number;
  bitsPerByte: number;
  downloadSeconds: number;
  formattedDownloadTime: string;
} {
  const speedMBps = speedMbps / 8;
  const downloadSeconds = speedMBps > 0 ? fileSizeMb / speedMBps : Infinity;

  let formattedDownloadTime = 'Instant';
  if (downloadSeconds < 60) {
    formattedDownloadTime = `${downloadSeconds.toFixed(1)} seconds`;
  } else if (downloadSeconds < 3600) {
    formattedDownloadTime = `${(downloadSeconds / 60).toFixed(1)} minutes`;
  } else {
    formattedDownloadTime = `${(downloadSeconds / 3600).toFixed(2)} hours`;
  }

  return {
    speedMbps,
    speedMBps,
    bitsPerByte: 8,
    downloadSeconds,
    formattedDownloadTime,
  };
}
