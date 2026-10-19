'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '@/context/SoundContext';
import { Trophy, Play, RotateCcw, Flame } from 'lucide-react';

interface AnimalCompetitor {
  id: string;
  name: string;
  scientificName: string;
  category: 'Aerial Predator' | 'Land Sprinter' | 'Hyper-Strike' | 'Human World Record' | 'Arboreal Mammal' | 'Botanical Record';
  speedMps: number;
  speedKmh: number;
  speedMph: number;
  time100mSec: number;
  time100mDisplay: string;
  accelerationG: string;
  icon: string;
  color: string;
  trackBg: string;
  superpower: string;
  bioDetail: string;
  citation: string;
}

const OLYMPIC_ANIMALS: AnimalCompetitor[] = [
  {
    id: 'peregrine-falcon',
    name: 'Peregrine Falcon (Dive)',
    scientificName: 'Falco peregrinus',
    category: 'Aerial Predator',
    speedMps: 108.0,
    speedKmh: 389.0,
    speedMph: 242.0,
    time100mSec: 0.93,
    time100mDisplay: '0.93 seconds',
    accelerationG: 'Up to 25 Gs pullout',
    icon: '🦅',
    color: '#0284c7',
    trackBg: '#e0f2fe',
    superpower: 'Fastest creature on planet Earth in gravity-assisted stoop dive.',
    bioDetail: 'Tucks wings into a rigid teardrop foil to cut drag. Specialized bony nostrils redirect high-velocity airflow so its lungs don’t burst at 389 km/h!',
    citation: 'Journal of Experimental Biology / National Geographic',
  },
  {
    id: 'cheetah',
    name: 'Cheetah (Sprint)',
    scientificName: 'Acinonyx jubatus',
    category: 'Land Sprinter',
    speedMps: 33.3,
    speedKmh: 120.0,
    speedMph: 75.0,
    time100mSec: 3.0,
    time100mDisplay: '3.00 seconds',
    accelerationG: '0.94 G (0 to 60 mph in 3s)',
    icon: '🐆',
    color: '#ca8a04',
    trackBg: '#fef9c3',
    superpower: 'Accelerates faster off the line than a Ferrari or Porsche.',
    bioDetail: 'Flexible spine acts like a coiled steel spring, yielding 7-meter strides. Non-retractable claws act like athletic track cleats for maximum grip.',
    citation: 'Nature 499 (Wilson et al., Cheetah Locomotion)',
  },
  {
    id: 'mantis-shrimp',
    name: 'Mantis Shrimp (Punch)',
    scientificName: 'Odontodactylus scyllarus',
    category: 'Hyper-Strike',
    speedMps: 23.0,
    speedKmh: 83.0,
    speedMph: 51.0,
    time100mSec: 4.35,
    time100mDisplay: '4.35s (Punch in 0.002s!)',
    accelerationG: '10,400 G (Bullet acceleration)',
    icon: '🦐',
    color: '#ea580c',
    trackBg: '#ffedd5',
    superpower: 'Fastest appendage strike in animal kingdom, vaporizing water.',
    bioDetail: 'Spring-loaded saddle structure accelerates club at 10,400 G. The water cavitation bubble collapses with temperatures reaching 4,700°C and a sonic boom that cracks crab shells!',
    citation: 'Nature 428 (Patek et al., Mantis Shrimp Strike)',
  },
  {
    id: 'usain-bolt',
    name: 'Usain Bolt (Peak Human)',
    scientificName: 'Homo sapiens',
    category: 'Human World Record',
    speedMps: 12.42,
    speedKmh: 44.72,
    speedMph: 27.78,
    time100mSec: 9.58,
    time100mDisplay: '9.58 seconds (WR)',
    accelerationG: '0.82 G initial start',
    icon: '🏃',
    color: '#16a34a',
    trackBg: '#dcfce7',
    superpower: 'Fastest human in history, generating 2,600 watts of peak power.',
    bioDetail: 'Achieved 44.72 km/h between 60m and 80m at the 2009 Berlin World Championships. Took only 41 strides to complete 100 meters (average runners take 45-50).',
    citation: 'IAAF World Championship Biomechanical Research',
  },
  {
    id: 'sloth',
    name: 'Three-Toed Sloth (Ground)',
    scientificName: 'Bradypus tridactylus',
    category: 'Arboreal Mammal',
    speedMps: 0.05,
    speedKmh: 0.18,
    speedMph: 0.11,
    time100mSec: 2000.0,
    time100mDisplay: '33.3 minutes',
    accelerationG: '0.001 G',
    icon: '🦥',
    color: '#65a30d',
    trackBg: '#ecfccb',
    superpower: 'Ultra-low metabolic crawl; grows green algae directly in fur.',
    bioDetail: 'Takes 6 seconds to move 30 centimeters on the ground. Its metabolism is 40% of normal mammals, conserving every joule of energy.',
    citation: 'Journal of Mammalogy / Goffart (Sloth Physiology)',
  },
  {
    id: 'bamboo',
    name: 'Timber Bamboo (Growth)',
    scientificName: 'Phyllostachys reticulata',
    category: 'Botanical Record',
    speedMps: 0.0000116,
    speedKmh: 0.0000416,
    speedMph: 0.000026,
    time100mSec: 8_640_000,
    time100mDisplay: '100 days (1m / 24 hours)',
    accelerationG: 'None (Cell elongation)',
    icon: '🎋',
    color: '#059669',
    trackBg: '#d1fae5',
    superpower: 'Fastest-growing plant on Earth (up to 100 cm in 24 hours).',
    bioDetail: 'Surges 11.6 micrometers every single second through rapid telescoping internode cell expansion. You can visibly watch it grow against a ruler!',
    citation: 'Guinness World Records / Farrelly (Book of Bamboo)',
  },
];

export default function AnimalSpeedOlympics() {
  const { playClick, playChime } = useSound();

  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [raceElapsedSec, setRaceElapsedSec] = useState<number>(0);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalCompetitor>(OLYMPIC_ANIMALS[0]);
  const [dualOpponent, setDualOpponent] = useState<AnimalCompetitor>(OLYMPIC_ANIMALS[3]); // Usain Bolt

  const raceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startRace = () => {
    if (isRacing) {
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
      setIsRacing(false);
      return;
    }

    playClick(950);
    setIsRacing(true);
    setRaceElapsedSec(0);

    const stepMs = 50;
    const interval = setInterval(() => {
      setRaceElapsedSec((prev) => {
        const next = prev + stepMs / 1000;
        // End simulation after 10 seconds (enough for Usain Bolt to finish)
        if (next >= 10.0) {
          clearInterval(interval);
          setIsRacing(false);
          playChime();
          return 10.0;
        }
        return next;
      });
    }, stepMs);

    raceTimerRef.current = interval;
  };

  const resetRace = () => {
    playClick(600);
    if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    setIsRacing(false);
    setRaceElapsedSec(0);
  };

  useEffect(() => {
    return () => {
      if (raceTimerRef.current) clearInterval(raceTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
          <Trophy className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Museum Exhibition &bull; Biology Speed Olympics</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          The Animal Kingdom Speed Olympics
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          From the 10,400 G bullet punch of the mantis shrimp to the 389 km/h stoop dive of the peregrine falcon, watch biology’s greatest speed champions race on a 100-meter track!
        </p>
      </div>

      {/* Main Track Simulation Arena */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Live Olympic Race Track &bull; 100 Meters
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Who Reaches the 100-Meter Finish Line First?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Watch them sprint side-by-side in real-time. Notice how falcon & cheetah vanish into the distance!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startRace}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 ${
                isRacing
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRacing ? 'PAUSE RACE' : 'START 100M RACE!'}</span>
            </button>

            <button
              onClick={resetRace}
              className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors"
              title="Reset Track"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Stopwatch Clock */}
        <div className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs">
          <span className="text-slate-500 font-bold uppercase">RACE STOPWATCH:</span>
          <span className="text-lg font-black text-emerald-600">
            {raceElapsedSec.toFixed(2)}s
          </span>
          <span className="text-slate-400">
            {raceElapsedSec >= 9.58 ? '🏁 Usain Bolt Finished!' : raceElapsedSec >= 3.0 ? '🐆 Cheetah Finished!' : raceElapsedSec >= 0.93 ? '🦅 Falcon Finished!' : 'Racing...'}
          </span>
        </div>

        {/* The 6 Lanes Track */}
        <div className="space-y-3">
          {OLYMPIC_ANIMALS.map((animal, idx) => {
            // Calculate progress along 100m track
            const currentMeters = Math.min(100, raceElapsedSec * animal.speedMps);
            const progressPercent = (currentMeters / 100) * 100;
            const hasFinished = raceElapsedSec >= animal.time100mSec && animal.time100mSec <= 10.0;

            return (
              <div
                key={animal.id}
                onClick={() => {
                  playClick(850);
                  setSelectedAnimal(animal);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedAnimal.id === animal.id
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                      L{idx + 1}
                    </span>
                    <span className="text-base select-none">{animal.icon}</span>
                    <span className="text-sm font-bold">{animal.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hidden sm:inline">
                      {animal.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{animal.speedKmh.toFixed(1)} km/h</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-emerald-700 font-bold">100m: {animal.time100mDisplay}</span>
                  </div>
                </div>

                {/* Track Lane Bar */}
                <div className="relative w-full h-8 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center">
                  {/* Metric Markers */}
                  <div className="absolute inset-0 flex justify-between px-3 text-[9px] font-mono text-slate-400 pointer-events-none items-center">
                    <span>START (0m)</span>
                    <span>25m</span>
                    <span>50m</span>
                    <span>75m</span>
                    <span className="text-rose-500 font-bold">FINISH (100m)</span>
                  </div>

                  {/* Filled track progress */}
                  <div
                    className="h-full opacity-35 transition-all duration-75"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: animal.color,
                    }}
                  />

                  {/* Competitor Avatar Pin on Track */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-75 flex items-center justify-center text-lg select-none drop-shadow-xs"
                    style={{ left: `${Math.max(3, Math.min(97, progressPercent))}%` }}
                  >
                    {animal.icon}
                  </div>

                  {/* Finished Stamp */}
                  {hasFinished && (
                    <div className="absolute right-3 px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-bold shadow-xs">
                      FINISHED &bull; {animal.time100mSec}s
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Specimen Spotlight Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-2xs select-none">
              {selectedAnimal.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
                  {selectedAnimal.category}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs font-mono italic text-slate-500">{selectedAnimal.scientificName}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                {selectedAnimal.name}
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-1">{selectedAnimal.superpower}</p>
            </div>
          </div>

          {/* Big Stat Box */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">TOP SPEED</span>
              <span className="text-xl font-black text-slate-900">{selectedAnimal.speedKmh} km/h</span>
              <span className="text-[10px] text-slate-500 block">{selectedAnimal.speedMph} mph</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-amber-700 block uppercase">ACCELERATION</span>
              <span className="text-sm font-black text-amber-950 block mt-1">{selectedAnimal.accelerationG}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[110px]">
              <span className="text-[10px] font-bold text-emerald-700 block uppercase">100M TIME</span>
              <span className="text-base font-black text-emerald-950 block mt-0.5">{selectedAnimal.time100mDisplay}</span>
            </div>
          </div>
        </div>

        {/* Bio Narrative */}
        <p className="text-base text-slate-700 leading-relaxed mb-6 font-normal">
          {selectedAnimal.bioDetail}
        </p>

        {/* Head-to-Head Duel Comparison Tool */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>PITCH HEAD-TO-HEAD: {selectedAnimal.name} VS.</span>
            </span>

            <select
              value={dualOpponent.id}
              onChange={(e) => {
                const opp = OLYMPIC_ANIMALS.find((a) => a.id === e.target.value);
                if (opp) {
                  playClick(800);
                  setDualOpponent(opp);
                }
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 shadow-2xs"
            >
              {OLYMPIC_ANIMALS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.icon} {a.name} ({a.speedKmh} km/h)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 block uppercase text-[10px]">Speed Ratio</span>
              <strong className="text-lg font-black text-slate-900">
                {selectedAnimal.speedMps >= dualOpponent.speedMps
                  ? `${(selectedAnimal.speedMps / dualOpponent.speedMps).toFixed(1)}x faster than ${dualOpponent.name}`
                  : `${(dualOpponent.speedMps / selectedAnimal.speedMps).toFixed(1)}x slower than ${dualOpponent.name}`}
              </strong>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-400 block uppercase text-[10px]">100-Meter Margin of Victory</span>
              <strong className="text-lg font-black text-slate-900">
                {selectedAnimal.time100mSec < dualOpponent.time100mSec
                  ? `Wins by ${(dualOpponent.time100mSec - selectedAnimal.time100mSec).toFixed(2)} seconds`
                  : `Trails by ${(selectedAnimal.time100mSec - dualOpponent.time100mSec).toFixed(2)} seconds`}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
