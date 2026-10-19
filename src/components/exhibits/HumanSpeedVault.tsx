'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '@/context/SoundContext';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Heart, Timer, Play } from 'lucide-react';

interface BioSpecimen {
  id: string;
  name: string;
  subtitle: string;
  speedDisplay: string;
  speedMps: number;
  icon: string;
  color: string;
  description: string;
  formula: string;
  citation: string;
}

const BIO_SPECIMENS: BioSpecimen[] = [
  {
    id: 'aorta-blood',
    name: 'Systolic Blood Surge in Aorta',
    subtitle: 'Left Ventricle Contraction',
    speedDisplay: '1.0 to 1.7 m/s (2.2 to 3.8 mph)',
    speedMps: 1.2,
    icon: '❤️',
    color: '#ef4444',
    description: 'When your heart contracts, it fires an arterial blood column through the aortic root at up to 1.7 meters per second—zipping from your chest to your neck in 0.2 seconds.',
    formula: 'v_peak = 1.0 to 1.7 m/s (Standard clinical Doppler echocardiography)',
    citation: 'Guyton and Hall Textbook of Medical Physiology (14th Edition)',
  },
  {
    id: 'capillary-blood',
    name: 'Capillary Microcirculation',
    subtitle: 'Alveoli & Tissue Oxygen Exchange',
    speedDisplay: '0.3 to 1.0 mm/s (0.0003 m/s)',
    speedMps: 0.0005,
    icon: '🩸',
    color: '#f43f5e',
    description: 'In tiny peripheral capillaries (only 8 microns wide, single red-blood cell diameter), blood slows to a crawl so oxygen and nutrients can diffuse into cells.',
    formula: 'v_capillary = Q / A_total ≈ 0.3 mm/s (Flow velocity through cross-sectional bed)',
    citation: 'Guyton & Hall, Chapter 14: Overview of the Circulation',
  },
  {
    id: 'touch-nerve',
    name: 'Sharp Touch Nerve (A-alpha)',
    subtitle: 'Thick Myelinated Sensory Axon',
    speedDisplay: '80 to 120 m/s (180 to 270 mph!)',
    speedMps: 100,
    icon: '⚡',
    color: '#06b6d4',
    description: 'Thick myelin sheaths enable saltatory conduction, allowing action potentials to leap from node to node at the speed of a high-speed bullet train.',
    formula: 'v ≈ 6 * axon_diameter (µm) = 80 - 120 m/s',
    citation: 'Kandel et al., Principles of Neural Science (Chapter 6: Cable Properties of Axons)',
  },
  {
    id: 'dull-pain',
    name: 'Dull Pain Nerve (C-Fiber)',
    subtitle: 'Unmyelinated Slow Ache Conduction',
    speedDisplay: '0.5 to 2.0 m/s (1.1 to 4.5 mph)',
    speedMps: 1.0,
    icon: '🦶',
    color: '#a855f7',
    description: 'When you stub your toe, you feel the tap immediately via A-alpha nerves, but there is a 1.5-second delay before the agonizing dull burn hits—because C-fibers have no myelin insulation!',
    formula: 'v_unmyelinated = 0.5 to 2.0 m/s (Axonal diameter 0.2 - 1.5 µm)',
    citation: 'Purves D. et al., Neuroscience (6th Ed., Chapter 10: Pain Mechanisms)',
  },
  {
    id: 'sneeze-droplet',
    name: 'Sneeze Droplet Expulsion',
    subtitle: 'Tracheobronchial Blast Velocity',
    speedDisplay: '45 m/s (~100 mph / 160 km/h)',
    speedMps: 45,
    icon: '🤧',
    color: '#eab308',
    description: 'A violent sneeze compresses thoracic volume and erupts tens of thousands of microscopic droplets at up to 100 miles per hour, crossing a room in a fraction of a second.',
    formula: 'v_expulsion ≈ 45 m/s (High-speed Schlieren optical imaging)',
    citation: 'Bourouiba, L. et al., Journal of Fluid Mechanics (MIT Fluid Dynamics of Disease Transmission)',
  },
  {
    id: 'eye-blink',
    name: 'Human Eye Blink Duration',
    subtitle: 'Orbicularis Oculi Muscle Contraction',
    speedDisplay: '100 to 150 ms (0.1 to 0.15 seconds)',
    speedMps: 1.0,
    icon: '👁️',
    color: '#10b981',
    description: 'A full eyelid descent and ascent takes ~1/10th of a second. Light travels 45,000 kilometers (more than once around Earth) during a single casual blink!',
    formula: 't_blink = 100 - 150 ms (Spontaneous human blink kinesthesia)',
    citation: 'Schiffman, H. R., Sensation and Perception: An Integrated Approach',
  },
  {
    id: 'usain-bolt',
    name: 'Usain Bolt Top Sprint Speed',
    subtitle: 'Maximum Recorded Human Locomotion',
    speedDisplay: '12.42 m/s (44.72 km/h / 27.78 mph)',
    speedMps: 12.42,
    icon: '🏃',
    color: '#16a34a',
    description: 'Between the 60m and 80m marks at the 2009 Berlin World Championships, Usain Bolt reached 44.72 km/h (12.42 m/s), setting the verified physical limit of human sprinting speed while generating over 2,600 watts of power.',
    formula: 'v_peak = 12.42 m/s; P_max ≈ 2,619 W; 100m World Record = 9.58s',
    citation: 'IAAF Biomechanical Research Project Berlin 2009',
  },
];

export default function HumanSpeedVault() {
  const { playClick, playChime, playBuzz } = useSound();
  const [selectedSpecimen, setSelectedSpecimen] = useState<BioSpecimen>(BIO_SPECIMENS[0]);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Neural Reaction Time Mini-Game
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number>(0);

  const startReactionTest = () => {
    playClick(800);
    setReactionState('waiting');
    setReactionTimeMs(null);

    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      startTimestampRef.current = performance.now();
      setReactionState('ready');
      playChime();
    }, delay);
  };

  const handleBoxClick = () => {
    if (reactionState === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setReactionState('early');
      playBuzz();
    } else if (reactionState === 'ready') {
      const elapsed = Math.round(performance.now() - startTimestampRef.current);
      setReactionTimeMs(elapsed);
      setReactionState('result');
      playClick(1000);
      setHistory((prev) => [elapsed, ...prev.slice(0, 4)]);
    } else if (reactionState === 'early') {
      startReactionTest();
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Specimen Picker Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Select Biological Speed Phenomenon:
          </span>
          <span className="text-xs font-mono text-rose-500 font-semibold flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            Biological Physiology Lab
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {BIO_SPECIMENS.map((specimen) => {
            const isSelected = selectedSpecimen.id === specimen.id;
            return (
              <button
                key={specimen.id}
                onClick={() => {
                  playClick(850);
                  setSelectedSpecimen(specimen);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-2xl mb-1.5 select-none">{specimen.icon}</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {specimen.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {specimen.speedDisplay}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Specimen Feature Arena */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 shadow-sm select-none">
              {selectedSpecimen.icon}
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-500">
                Biological Specimen
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedSpecimen.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedSpecimen.subtitle}</p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Real Velocity</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {selectedSpecimen.speedDisplay}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-6">
          {selectedSpecimen.description}
        </p>

        {/* Visual Velocity Comparator */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span>PHYSICAL SPEED IN HUMAN PERSPECTIVE:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {selectedSpecimen.speedMps < 0.01
                ? `${(selectedSpecimen.speedMps * 1000).toFixed(2)} mm/sec`
                : `${selectedSpecimen.speedMps.toFixed(1)} m/sec (${(selectedSpecimen.speedMps * 2.23694).toFixed(1)} mph)`}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(5, Math.min(100, (selectedSpecimen.speedMps / 120) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Neural Reaction Reflex Station */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Interactive Station: Human Neural Conduction Test
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Measure how fast your eyes, brain, and spinal nerves communicate. Can you beat the 200 ms barrier?
        </p>

        {/* Clickable Target Box */}
        <div
          onClick={handleBoxClick}
          className={`w-full h-44 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-150 ${
            reactionState === 'idle'
              ? 'bg-slate-50 border-slate-300 text-slate-700 hover:border-indigo-500'
              : reactionState === 'waiting'
              ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
              : reactionState === 'ready'
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl scale-[1.01]'
              : reactionState === 'early'
              ? 'bg-red-50 border-red-400 text-red-700'
              : 'bg-indigo-50 border-indigo-500 text-indigo-900'
          }`}
        >
          {reactionState === 'idle' && (
            <div className="text-center space-y-1">
              <span className="text-3xl">🎯</span>
              <div className="text-sm font-bold text-slate-900">Click &quot;Start Reflex Test&quot; Below</div>
              <div className="text-xs text-slate-500">Click when the box turns bright green!</div>
            </div>
          )}

          {reactionState === 'waiting' && (
            <div className="text-center space-y-1">
              <span className="text-3xl">⏳</span>
              <div className="text-base font-black text-rose-700">Wait for Green...</div>
              <div className="text-xs text-rose-600 font-semibold">Don&apos;t click yet!</div>
            </div>
          )}

          {reactionState === 'ready' && (
            <div className="text-center space-y-1">
              <span className="text-4xl">⚡</span>
              <div className="text-2xl font-black tracking-wider text-white">CLICK NOW!</div>
            </div>
          )}

          {reactionState === 'early' && (
            <div className="text-center space-y-1">
              <span className="text-3xl">🚨</span>
              <div className="text-base font-black text-red-700">Too Early! Click to Try Again</div>
              <div className="text-xs text-red-600 font-semibold">Wait until the box turns bright green!</div>
            </div>
          )}

          {reactionState === 'result' && reactionTimeMs && (
            <div className="text-center space-y-1">
              <div className="text-4xl font-black font-mono text-indigo-600">
                {reactionTimeMs} ms
              </div>
              <div className="text-xs font-bold text-slate-700">
                {reactionTimeMs < 180
                  ? '🏆 Pro Esports Reflexes (< 180 ms)!'
                  : reactionTimeMs < 250
                  ? '⚡ Healthy Human Average (180-250 ms)'
                  : '🐢 Slower than usual (> 250 ms)'}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls & Breakdown */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <button
            onClick={startReactionTest}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>{reactionState === 'idle' ? 'Start Reflex Test' : 'Try Again'}</span>
          </button>

          {history.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Recent attempts:</span>
              {history.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
                >
                  {t}ms
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Neural Latency Breakdown */}
        {reactionTimeMs && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-2">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
              Where your {reactionTimeMs} ms was spent inside your body:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">RETINA TO V1</span>
                <strong>~35 ms</strong>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">BRAIN DECISION</span>
                <strong>~70 ms</strong>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">ARM NERVE TRIP</span>
                <strong>~40 ms</strong>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[9px]">FINGER SWITCH</span>
                <strong>~25 ms</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plaque Card */}
      <PlaqueCard
        title={selectedSpecimen.name}
        subtitle={selectedSpecimen.subtitle}
        category="Human Biology"
        icon={selectedSpecimen.icon}
        funFact={selectedSpecimen.description}
        mathFormula={selectedSpecimen.formula}
        citation={selectedSpecimen.citation}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={selectedSpecimen.name}
        metricHighlight={selectedSpecimen.speedDisplay}
        funFact={selectedSpecimen.description}
        mathFormula={selectedSpecimen.formula}
        sourceCitation={selectedSpecimen.citation}
      />
    </div>
  );
}
