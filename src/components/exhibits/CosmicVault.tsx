'use client';

import React, { useState } from 'react';
import { useSound } from '@/context/SoundContext';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Sparkles, Globe, Rocket } from 'lucide-react';

interface CosmicObject {
  id: string;
  name: string;
  subtitle: string;
  speedKms: number;
  displaySpeed: string;
  icon: string;
  color: string;
  description: string;
  earthEquatorSeconds: number; // seconds to circle Earth (40,075 km)
  distanceToMoonSeconds: number; // seconds to reach Moon (384,400 km)
  formula: string;
  citation: string;
}

const COSMIC_OBJECTS: CosmicObject[] = [
  {
    id: 'earth-orbit',
    name: 'Earth Orbiting the Sun',
    subtitle: 'Heliospheric Orbital Velocity',
    speedKms: 29.78,
    displaySpeed: '29.78 km/s (66,615 mph)',
    icon: '🌍',
    color: '#38bdf8',
    description: 'While sitting motionless in your chair right now, you and planet Earth are hurtling through the vacuum of space around the Sun at nearly 30 kilometers every second. You cross the diameter of Earth in ~7 minutes!',
    earthEquatorSeconds: 40075 / 29.78, // ~1345 seconds (~22 minutes)
    distanceToMoonSeconds: 384400 / 29.78, // ~3.58 hours
    formula: 'v_orbit = sqrt(G * M_sun / r) ≈ 29.78 km/s',
    citation: 'NASA Jet Propulsion Laboratory Horizons Ephemeris System',
  },
  {
    id: 'moon-orbit',
    name: 'The Moon Orbiting Earth',
    subtitle: 'Lunar Orbital Velocity',
    speedKms: 1.022,
    displaySpeed: '1.022 km/s (2,286 mph)',
    icon: '🌕',
    color: '#e2e8f0',
    description: 'The Moon orbits Earth at just over 1 km/s (Mach 3). It takes 27.3 days to complete one full revolution of 2.4 million kilometers.',
    earthEquatorSeconds: 40075 / 1.022, // ~10.9 hours
    distanceToMoonSeconds: 384400 / 1.022, // ~4.3 days
    formula: 'v_moon = (2 * π * 384,400 km) / (27.32 * 86,400 s) ≈ 1.022 km/s',
    citation: 'NASA Planetary Data System (Lunar Fact Sheet)',
  },
  {
    id: 'parker-probe',
    name: 'Parker Solar Probe (Perihelion)',
    subtitle: 'Fastest Human-Made Object in History',
    speedKms: 176.0,
    displaySpeed: '176.0 km/s (394,000 mph!)',
    icon: '☀️',
    color: '#f59e0b',
    description: 'Diving through the Sun\'s superheated corona, NASA\'s Parker Solar Probe reaches 176 km/s! At this speed, you could fly from New York to London in under 30 seconds.',
    earthEquatorSeconds: 40075 / 176.0, // ~3.8 minutes
    distanceToMoonSeconds: 384400 / 176.0, // ~36 minutes
    formula: 'v_perihelion = sqrt(G * M_sun * (2/r - 1/a)) ≈ 176 km/s',
    citation: 'NASA Johns Hopkins Applied Physics Laboratory Parker Solar Probe Telemetry',
  },
  {
    id: 'voyager-1-cruise',
    name: 'Voyager 1 Interstellar Cruise',
    subtitle: 'Humanity\'s Farthest Spacecraft',
    speedKms: 17.0,
    displaySpeed: '17.0 km/s (38,000 mph)',
    icon: '🛰️',
    color: '#2dd4bf',
    description: 'Powered by radioactive decay (RTG) and gravitational slingshots from Jupiter and Saturn, Voyager 1 is escaping the Solar System into the interstellar void at 17 km/s.',
    earthEquatorSeconds: 40075 / 17.0, // ~39 minutes
    distanceToMoonSeconds: 384400 / 17.0, // ~6.28 hours
    formula: 'v_infinity = sqrt(v_hyperbolic^2) ≈ 17.0 km/s',
    citation: 'NASA JPL Deep Space Network Voyager Telemetry Archives',
  },
  {
    id: 'milky-way-orbit',
    name: 'Solar System Orbiting the Galactic Center',
    subtitle: 'Galactic Year (Milky Way Rotation)',
    speedKms: 230.0,
    displaySpeed: '230.0 km/s (514,500 mph)',
    icon: '🌌',
    color: '#a855f7',
    description: 'Our entire solar system (the Sun, Earth, Mars, Jupiter) orbits the supermassive black hole Sagittarius A* at 230 km/s. It takes ~230 million years to complete one "Galactic Year" (the dinosaurs roamed Earth 1/4 of a galactic orbit ago!).',
    earthEquatorSeconds: 40075 / 230.0, // ~2.9 minutes
    distanceToMoonSeconds: 384400 / 230.0, // ~27.8 minutes
    formula: 'v_gal = ω * R_sun ≈ 230 km/s at R_0 = 8.2 kpc',
    citation: 'European Southern Observatory (ESO) / Gaia Space Telescope Astrometry',
  },
  {
    id: 'grace-hopper-cosmic',
    name: 'Light in Vacuum (Grace Hopper Nanosecond)',
    subtitle: 'Ultimate Universal Speed Limit (c)',
    speedKms: 299792.458,
    displaySpeed: '299,792.458 km/s (186,282 miles/s)',
    icon: '💡',
    color: '#facc15',
    description: 'In one single second, light wraps around the entire Earth 7.5 times. In one nanosecond (1 billionth of a second), light travels exactly 11.803 inches (29.98 cm)—virtually the exact width of your laptop screen!',
    earthEquatorSeconds: 40075 / 299792.458, // ~0.133 seconds
    distanceToMoonSeconds: 384400 / 299792.458, // 1.282 seconds
    formula: 'c = 299,792,458 m/s (Exact defined SI constant of physics)',
    citation: 'BIPM (Bureau International des Poids et Mesures) SI Base Units',
  },
];

export default function CosmicVault() {
  const { playClick } = useSound();
  const [selectedCosmic, setSelectedCosmic] = useState<CosmicObject>(COSMIC_OBJECTS[0]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="w-full space-y-8">
      {/* Specimen Selection Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Select Cosmic Velocity Specimen:
          </span>
          <span className="text-xs font-mono text-violet-500 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Astrophysics & Space Vault
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {COSMIC_OBJECTS.map((item) => {
            const isSelected = selectedCosmic.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playClick(850);
                  setSelectedCosmic(item);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-violet-500 shadow-md ring-2 ring-violet-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-2xl mb-1.5 select-none">{item.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {item.displaySpeed}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feature Display Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 shadow-sm select-none">
              {selectedCosmic.icon}
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-500">
                Cosmic Velocity Specimen
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedCosmic.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCosmic.subtitle}</p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Cosmic Speed</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-violet-600 dark:text-violet-400">
              {selectedCosmic.displaySpeed}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-6">
          {selectedCosmic.description}
        </p>

        {/* Real-World Distance Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-500 uppercase">Time to Circle Earth Equator:</span>
              <Globe className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {selectedCosmic.earthEquatorSeconds < 1
                ? `${(selectedCosmic.earthEquatorSeconds * 1000).toFixed(0)} ms (0.13s)`
                : selectedCosmic.earthEquatorSeconds < 60
                ? `${selectedCosmic.earthEquatorSeconds.toFixed(1)} seconds`
                : `${(selectedCosmic.earthEquatorSeconds / 60).toFixed(1)} minutes`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Circumference of Earth: 40,075 km (24,901 miles)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-500 uppercase">Time to Fly to the Moon:</span>
              <Rocket className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
              {selectedCosmic.distanceToMoonSeconds < 60
                ? `${selectedCosmic.distanceToMoonSeconds.toFixed(2)} seconds`
                : selectedCosmic.distanceToMoonSeconds < 3600
                ? `${(selectedCosmic.distanceToMoonSeconds / 60).toFixed(1)} minutes`
                : `${(selectedCosmic.distanceToMoonSeconds / 3600).toFixed(1)} hours`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Average Earth-Moon Distance: 384,400 km (238,855 miles)
            </p>
          </div>
        </div>
      </div>

      {/* Plaque Card */}
      <PlaqueCard
        title={selectedCosmic.name}
        subtitle={selectedCosmic.subtitle}
        category="Astrophysics"
        icon={selectedCosmic.icon}
        funFact={selectedCosmic.description}
        mathFormula={selectedCosmic.formula}
        citation={selectedCosmic.citation}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={selectedCosmic.name}
        metricHighlight={selectedCosmic.displaySpeed}
        funFact={selectedCosmic.description}
        mathFormula={selectedCosmic.formula}
        sourceCitation={selectedCosmic.citation}
      />
    </div>
  );
}
