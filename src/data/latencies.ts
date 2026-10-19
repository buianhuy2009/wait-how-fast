export interface LatencyExhibit {
  id: string;
  name: string;
  subtitle: string;
  roundTripMs: number;
  oneWayMs: number;
  distanceKm: number;
  category: 'terrestrial' | 'biological' | 'space' | 'interstellar';
  icon: string;
  interactiveType: 'typing' | 'pong' | 'rover' | 'reflex' | 'voyager';
  plaqueFact: string;
  detailedBreakdown: { label: string; timeMs: number; description: string }[];
  mathFormula: string;
  citation: string;
  citationSource: string;
}

export const LATENCY_EXHIBITS: LatencyExhibit[] = [
  {
    id: 'fiber-optics',
    name: 'Inside Fiber Optic Glass ("The Glass Tax")',
    subtitle: 'Silica Refractive Index & Submarine Cables',
    roundTripMs: 10, // for a standard 1000 km link
    oneWayMs: 5,
    distanceKm: 1000,
    category: 'terrestrial',
    icon: '💡',
    interactiveType: 'typing',
    plaqueFact: 'Light does NOT travel at 300,000 km/s on the internet. Because optical fiber is made of solid silica glass (refractive index n ≈ 1.468), light slows down by 31.8% to ~204,190 km/s! In 1 nanosecond, light in glass travels only 8 inches (20.4 cm).',
    detailedBreakdown: [
      { label: 'Speed of Light in Vacuum', timeMs: 3.33, description: '1000 km in pure vacuum: 3.33 ms' },
      { label: 'Glass Refraction Tax (n = 1.468)', timeMs: 1.56, description: 'Silica glass matrix impedance: +1.56 ms' },
      { label: 'EDFA Optical Amplifiers', timeMs: 0.11, description: 'Signal regeneration along cable repeaters' },
    ],
    mathFormula: 'v_fiber = c / n = 299,792 km/s / 1.4682 ≈ 204,190 km/s (4.897 µs/km one-way)',
    citation: 'ITU-T Recommendation G.652 (Characteristics of single-mode optical fiber)',
    citationSource: 'https://www.itu.int/rec/T-REC-G.652',
  },
  {
    id: 'human-reflex',
    name: 'Human Eye-to-Finger Reflex',
    subtitle: 'Physiological Neural Conduction Benchmark',
    roundTripMs: 220,
    oneWayMs: 220,
    distanceKm: 0.002,
    category: 'biological',
    icon: '🧠',
    interactiveType: 'reflex',
    plaqueFact: 'When a traffic light turns red or an enemy appears on screen, you cannot react in 0ms. Nerve action potentials travel at maximum 120 m/s in myelinated axons, and biochemical synaptic gaps consume precious milliseconds. Even top esports pros plateau around 150-180 ms!',
    detailedBreakdown: [
      { label: 'Retinal Photoreceptor Transduction', timeMs: 30, description: 'Opsin chemical cascade converting photons to electrical impulses' },
      { label: 'Optic Nerve to Visual Cortex (V1)', timeMs: 45, description: 'Traveling through optic chiasm & lateral geniculate nucleus' },
      { label: 'Cortical Evaluation & Motor Decision', timeMs: 80, description: 'Frontal eye field & motor cortex deliberate and issue command' },
      { label: 'Spinal Cord & Arm Nerve Conduction', timeMs: 40, description: 'Action potential races down median/ulnar nerves at 60 m/s' },
      { label: 'Motor Endplate & Key Switch Actuation', timeMs: 25, description: 'Acetylcholine triggers muscle fiber contraction & mechanical travel' },
    ],
    mathFormula: 'Total Reaction Time = T_retina + T_visual + T_decision + T_motor + T_muscle ≈ 180-250 ms',
    citation: 'Kandel, E. R. et al., Principles of Neural Science (6th Edition)',
    citationSource: 'https://accessmedicine.mhmedical.com/book.aspx?bookid=2951',
  },
  {
    id: 'tokyo-london',
    name: 'Tokyo to London Submarine Cable',
    subtitle: 'Undersea Fiber Transit Across 13,000+ km',
    roundTripMs: 210,
    oneWayMs: 105,
    distanceKm: 13200,
    category: 'terrestrial',
    icon: '🌊',
    interactiveType: 'typing',
    plaqueFact: 'Over 99% of global telecommunications flow through subsea glass cables lying on the dark ocean floor. Typing a single key from London to a Tokyo server requires pulses of light to travel ~13,200 km through fiber repeaters, waiting over 200 ms for the echo!',
    detailedBreakdown: [
      { label: 'Outbound Glass Propagation (London -> Tokyo)', timeMs: 65, description: 'Speed of light in silica (204,000 km/s)' },
      { label: 'Subsea Optical Repeaters & Routing Hops', timeMs: 40, description: 'BGP routing, packet serialization, and laser amplification' },
      { label: 'Inbound Return Packet (Tokyo -> London)', timeMs: 105, description: 'Echo confirmation returning across ocean bed' },
    ],
    mathFormula: 'RTT = 2 * (Distance / v_glass) + RouterDelays = 2 * (13,200 km / 204,190 km/s) + 80 ms ≈ 210 ms',
    citation: 'TeleGeography Submarine Cable Map & Global Internet Benchmarks',
    citationSource: 'https://www.submarinecablemap.com/',
  },
  {
    id: 'starlink-vs-geo',
    name: 'Starlink (LEO) vs Geostationary Satellite',
    subtitle: 'Low Earth Orbit (550 km) vs Clarke Belt (35,786 km)',
    roundTripMs: 600, // comparing 35ms LEO vs 600ms GEO
    oneWayMs: 300,
    distanceKm: 35786,
    category: 'space',
    icon: '🛰️',
    interactiveType: 'pong',
    plaqueFact: 'Geostationary satellites hover at 35,786 km so they stay locked over one spot on Earth. But radio waves must travel 71,500 km up and down twice—adding over 600 ms of latency! Low Earth Orbit satellites (Starlink, Kuiper) fly at only 550 km, slashing latency to ~30 ms.',
    detailedBreakdown: [
      { label: 'Starlink LEO Round-Trip', timeMs: 32, description: '550 km altitude: 3.6 ms radio travel + laser links + ground station ≈ 30-35 ms' },
      { label: 'Geostationary Uplink + Downlink', timeMs: 478, description: 'Speed of light travel to 35,786 km and back (71,572 km twice = 143,144 km)' },
      { label: 'GEO Gateway & Buffer Processing', timeMs: 122, description: 'Satellite transponder processing & ground station BGP router buffers' },
    ],
    mathFormula: 't_GEO_radio = 4 * (35,786 km / 299,792 km/s) ≈ 477.5 ms (Round trip to satellite and back to Earth twice)',
    citation: 'FCC Satellite Division Filings & ITU Radio Regulations',
    citationSource: 'https://www.fcc.gov/space',
  },
  {
    id: 'earth-to-moon',
    name: 'Earth to the Moon (Apollo & Artemis)',
    subtitle: 'Lunar Speed-of-Light Teleoperation Delay',
    roundTripMs: 2564,
    oneWayMs: 1282,
    distanceKm: 384400,
    category: 'space',
    icon: '🌕',
    interactiveType: 'rover',
    plaqueFact: 'The average distance from Earth to the Moon is 384,400 km. Even traveling at the cosmic speed of light, every radio command takes 1.28 seconds to reach the Moon, and video feedback takes 1.28 seconds to return. If you steer a lunar rover toward a crater, you won\'t see it turn for 2.56 seconds!',
    detailedBreakdown: [
      { label: 'Earth Uplink Transmission', timeMs: 1282, description: 'Deep Space Network radio wave traveling across lunar distance' },
      { label: 'Lunar Rover Actuator Response', timeMs: 50, description: 'Rover steering motor engages on regolith' },
      { label: 'Downlink Telemetry & Video Frame', timeMs: 1282, description: 'Camera frame traveling back to mission control on Earth' },
    ],
    mathFormula: 'RTT = 2 * (384,400 km / 299,792.458 km/s) = 2.5644 seconds (Round-trip light time)',
    citation: 'NASA Lunar Laser Ranging Experiment & Apollo Telemetry Archives',
    citationSource: 'https://science.nasa.gov/moon',
  },
  {
    id: 'mars-perseverance',
    name: 'Mars Perseverance Rover',
    subtitle: 'Interplanetary Telemetry at 54 to 400 Million km',
    roundTripMs: 1_260_000, // ~21 minutes at average distance (~10.5 min one way)
    oneWayMs: 630_000,
    distanceKm: 189_000_000, // average distance
    category: 'space',
    icon: '🔴',
    interactiveType: 'rover',
    plaqueFact: 'Depending on orbital positions, Mars is between 54.6 million km and 401 million km from Earth. One-way light travel takes 3 to 22 minutes (round trip: 6 to 45 minutes!). By the time NASA engineers see a video frame of a rover teetering on a cliff edge, the rover drove off it 10 minutes ago! That is why Mars rovers require onboard autonomous AI vision (AutoNav).',
    detailedBreakdown: [
      { label: 'Closest Approach (Perigee)', timeMs: 364_000, description: '54.6 million km = 3.03 minutes one-way (6.07 min RTT)' },
      { label: 'Average Orbital Distance', timeMs: 1_260_000, description: '189 million km = 10.5 minutes one-way (21 min RTT)' },
      { label: 'Furthest Opposition (Apogee)', timeMs: 2_675_000, description: '401 million km = 22.3 minutes one-way (44.6 min RTT)' },
    ],
    mathFormula: 't_one_way = Distance / c = (54.6 * 10^6 km to 401 * 10^6 km) / 299,792 km/s = 182 s to 1,337 s',
    citation: 'NASA Jet Propulsion Laboratory (JPL) Mars 2020 Mission Telemetry',
    citationSource: 'https://mars.nasa.gov/mars2020/',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1 (Interstellar Space)',
    subtitle: 'Humanity\'s Most Distant Messenger (> 24.5 Billion km)',
    roundTripMs: 163_440_000, // ~45.4 hours round-trip
    oneWayMs: 81_720_000, // ~22.7 hours one-way
    distanceKm: 24_500_000_000,
    category: 'interstellar',
    icon: '🌌',
    interactiveType: 'voyager',
    plaqueFact: 'Launched in 1977, Voyager 1 is now in interstellar space over 24.5 billion km (164 AU) away. A command sent right now at the speed of light will take 22.7 hours to reach Voyager 1, and its response will take another 22.7 hours to arrive back on Earth—a 45.4 hour round-trip! Even more astonishing: its transmitter runs on only 23 Watts (the light bulb in your kitchen refrigerator)!',
    detailedBreakdown: [
      { label: 'Transmit past Moon (384,400 km)', timeMs: 1282, description: 'Passes lunar orbit in 1.28 seconds' },
      { label: 'Transmit past Mars orbit (~225M km)', timeMs: 750_000, description: 'Passes Mars orbit in 12.5 minutes' },
      { label: 'Transmit past Jupiter (~778M km)', timeMs: 2_595_000, description: 'Passes Jupiter in 43.2 minutes' },
      { label: 'Transmit past Pluto / Kuiper Belt (~5.9B km)', timeMs: 19_680_000, description: 'Passes Pluto in 5.46 hours' },
      { label: 'Arrival at Voyager 1 (> 24.5B km)', timeMs: 81_720_000, description: 'Reaches interstellar probe in 22.7 hours' },
    ],
    mathFormula: 'RTT = 2 * (24,500,000,000 km / 299,792.458 km/s) ≈ 163,446 seconds ≈ 45.4 hours',
    citation: 'NASA Deep Space Network (DSN) Voyager 1 Real-Time Telemetry',
    citationSource: 'https://voyager.jpl.nasa.gov/mission/status/',
  },
];
