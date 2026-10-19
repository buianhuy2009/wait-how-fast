'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import { calculatePpmm, velocityToPxPerSec } from '@/lib/ppiMath';
import { FAMILIAR_OBJECTS } from '@/lib/familiarObjects';
import { AlertCircle, ArrowDown } from 'lucide-react';

interface ConveyorItem {
  id: string;
  name: string;
  speedMps: number;
  displaySpeed: string;
  icon: string;
  accentColor: string;
  comparisonNote: string;
  category: 'highlights' | 'animals' | 'physics';
}

const ALL_CONVEYOR_ITEMS: ConveyorItem[] = [
  // Highlights
  {
    id: 'hair-growth',
    name: 'Scalp Hair Growth',
    speedMps: 4.75e-9,
    displaySpeed: '4.75 nm / sec',
    icon: '💇',
    accentColor: '#d97706',
    comparisonNote: '0.5 mm synthesized every second across scalp.',
    category: 'highlights',
  },
  {
    id: 'garden-snail',
    name: 'Garden Snail',
    speedMps: 0.0013,
    displaySpeed: '1.3 mm / sec',
    icon: '🐌',
    accentColor: '#65a30d',
    comparisonNote: 'Takes 2 minutes to crawl a dollar bill.',
    category: 'highlights',
  },
  {
    id: '3d-printer',
    name: '3D Printer Nozzle',
    speedMps: 0.25,
    displaySpeed: '250 mm / sec',
    icon: '🖨️',
    accentColor: '#0891b2',
    comparisonNote: 'Crosses your monitor in ~1 second.',
    category: 'highlights',
  },
  {
    id: 'aorta-blood',
    name: 'Aorta Blood Surge',
    speedMps: 1.2,
    displaySpeed: '1.2 m / sec (2.7 mph)',
    icon: '❤️',
    accentColor: '#dc2626',
    comparisonNote: 'Systolic pulse surging to your brain.',
    category: 'highlights',
  },
  {
    id: 'cheetah-sprint',
    name: 'Cheetah Top Sprint',
    speedMps: 33.3,
    displaySpeed: '33.3 m / sec (75 mph)',
    icon: '🐆',
    accentColor: '#ca8a04',
    comparisonNote: 'Crosses 100m in 3.0 seconds flat.',
    category: 'highlights',
  },
  {
    id: 'speed-of-sound',
    name: 'Speed of Sound',
    speedMps: 343.0,
    displaySpeed: '343 m / sec (Mach 1)',
    icon: '🔊',
    accentColor: '#2563eb',
    comparisonNote: 'Crosses screen in 0.8 milliseconds.',
    category: 'highlights',
  },
  {
    id: 'speed-of-light',
    name: 'Speed of Light (c)',
    speedMps: 299_792_458,
    displaySpeed: '300,000 km / sec',
    icon: '💡',
    accentColor: '#9333ea',
    comparisonNote: 'Cosmic limit (shown compressed on belt; see true scale below).',
    category: 'highlights',
  },

  // Animal Kingdom additions
  {
    id: 'bamboo-growth',
    name: 'Bamboo Growth',
    speedMps: 1.16e-5,
    displaySpeed: '11.6 µm / sec',
    icon: '🎋',
    accentColor: '#059669',
    comparisonNote: 'Fastest growing plant on Earth (1m / day).',
    category: 'animals',
  },
  {
    id: 'sloth',
    name: 'Garden Sloth Crawl',
    speedMps: 0.05,
    displaySpeed: '0.05 m / sec (0.11 mph)',
    icon: '🦥',
    accentColor: '#84cc16',
    comparisonNote: 'Takes 6 seconds to crawl 1 foot.',
    category: 'animals',
  },
  {
    id: 'usain-bolt',
    name: 'Usain Bolt Peak Sprint',
    speedMps: 12.42,
    displaySpeed: '12.42 m / sec (27.8 mph)',
    icon: '🏃',
    accentColor: '#16a34a',
    comparisonNote: 'Fastest recorded human in history.',
    category: 'animals',
  },
  {
    id: 'mantis-shrimp',
    name: 'Mantis Shrimp Strike',
    speedMps: 23.0,
    displaySpeed: '23 m / sec (10,400 G)',
    icon: '🦐',
    accentColor: '#ea580c',
    comparisonNote: 'Accelerates like a .22 bullet, vaporizing water.',
    category: 'animals',
  },
  {
    id: 'cheetah-animal',
    name: 'Cheetah Maximum Sprint',
    speedMps: 33.3,
    displaySpeed: '33.3 m / sec (75 mph)',
    icon: '🐆',
    accentColor: '#ca8a04',
    comparisonNote: 'Accelerates 0 to 60 mph in 3 seconds.',
    category: 'animals',
  },
  {
    id: 'peregrine-falcon',
    name: 'Peregrine Falcon Dive',
    speedMps: 108.0,
    displaySpeed: '108 m / sec (242 mph)',
    icon: '🦅',
    accentColor: '#0284c7',
    comparisonNote: 'Fastest creature on Earth in stoop dive.',
    category: 'animals',
  },

  // Physics & Cosmic
  {
    id: 'continental-drift',
    name: 'Continental Drift',
    speedMps: 7.92e-10,
    displaySpeed: '0.79 nm / sec (2.5 cm/yr)',
    icon: '🌍',
    accentColor: '#10b981',
    comparisonNote: 'Mid-Atlantic ridge tectonic separation.',
    category: 'physics',
  },
  {
    id: 'sound-wave',
    name: 'Sound Wave (20°C)',
    speedMps: 343.0,
    displaySpeed: '343 m / sec (Mach 1)',
    icon: '🔊',
    accentColor: '#2563eb',
    comparisonNote: 'Sweeps across monitor in 0.8 ms.',
    category: 'physics',
  },
  {
    id: 'earth-sun-orbit',
    name: 'Earth Orbiting Sun',
    speedMps: 29_780,
    displaySpeed: '29.78 km / sec (66,600 mph)',
    icon: '☀️',
    accentColor: '#38bdf8',
    comparisonNote: 'Travels 30 km every single second right now.',
    category: 'physics',
  },
  {
    id: 'parker-probe',
    name: 'Parker Solar Probe',
    speedMps: 176_000,
    displaySpeed: '176 km / sec (394,000 mph)',
    icon: '🛰️',
    accentColor: '#f59e0b',
    comparisonNote: 'Fastest human-made object in history.',
    category: 'physics',
  },
  {
    id: 'light-vacuum',
    name: 'Light in Vacuum (c)',
    speedMps: 299_792_458,
    displaySpeed: '300,000 km / sec',
    icon: '💡',
    accentColor: '#9333ea',
    comparisonNote: 'Universal speed limit (874,000x faster than sound).',
    category: 'physics',
  },
];

export default function ContinuousSpeedConveyor() {
  const { ppi } = useCalibration();
  const { playClick } = useSound();
  const ppmm = calculatePpmm(ppi);

  const [activeTab, setActiveTab] = useState<'highlights' | 'animals' | 'physics'>('highlights');
  const [motionMode, setMotionMode] = useState<'observable' | 'literal'>('observable');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animPositionsRef = useRef<Record<string, number>>({});
  const lastTimeRef = useRef<number>(0);
  const heartbeatPhaseRef = useRef<number>(0);
  const beltTreadPhaseRef = useRef<number>(0);

  const currentItems = useMemo(() => {
    return ALL_CONVEYOR_ITEMS.filter((item) => item.category === activeTab);
  }, [activeTab]);

  // Initialize positions
  useEffect(() => {
    currentItems.forEach((item, index) => {
      if (animPositionsRef.current[item.id] === undefined) {
        animPositionsRef.current[item.id] = (index * 90) % 500;
      }
    });
  }, [currentItems]);

  // Main Canvas Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      heartbeatPhaseRef.current += dt * 1.2 * Math.PI * 2; // ~72 BPM
      beltTreadPhaseRef.current = (beltTreadPhaseRef.current + dt * 40) % 16;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clean bright Neal.fun canvas background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const numTracks = currentItems.length;
      const trackHeight = height / numTracks;

      const isMobile = width < 640;
      const labelColWidth = isMobile ? 120 : 210;
      const conveyorLeft = labelColWidth + 12;
      const conveyorRight = width - 16;
      const conveyorActiveWidth = Math.max(100, conveyorRight - conveyorLeft);

      currentItems.forEach((item, idx) => {
        const trackY = idx * trackHeight;
        const centerY = trackY + trackHeight / 2;

        // Track Separator Line
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, trackY + trackHeight);
        ctx.lineTo(width, trackY + trackHeight);
        ctx.stroke();

        // Left Label Column
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, trackY + 2, labelColWidth, trackHeight - 4);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Item Name
        ctx.font = 'bold 13px ui-sans-serif, system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.name, 12, trackY + 14);

        // Display Speed
        ctx.font = 'bold 11px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = item.accentColor;
        ctx.fillText(item.displaySpeed, 12, trackY + 32);

        // Category / Note
        if (!isMobile) {
          ctx.font = 'normal 10px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = '#64748b';
          const truncatedNote =
            item.comparisonNote.length > 34
              ? item.comparisonNote.substring(0, 32) + '…'
              : item.comparisonNote;
          ctx.fillText(truncatedNote, 12, trackY + 48);
        }

        // Vertical divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(labelColWidth, trackY + 4);
        ctx.lineTo(labelColWidth, trackY + trackHeight - 4);
        ctx.stroke();

        // Conveyor Belt Bed
        const beltY = centerY - 18;
        const beltH = 36;
        ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(conveyorLeft, beltY, conveyorActiveWidth, beltH, 8);
        ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving Conveyor Tread Pattern
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        const treadSpacing = 16;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(conveyorLeft, beltY, conveyorActiveWidth, beltH, 8);
        ctx.clip();

        for (
          let tx = conveyorLeft - 16 + (beltTreadPhaseRef.current % treadSpacing);
          tx < conveyorRight;
          tx += treadSpacing
        ) {
          ctx.beginPath();
          ctx.moveTo(tx, beltY);
          ctx.lineTo(tx + 6, beltY + beltH);
          ctx.stroke();
        }
        ctx.restore();

        // Calculate velocity
        let pxPerSec = 0;
        if (motionMode === 'literal') {
          pxPerSec = velocityToPxPerSec(item.speedMps, ppi, 1.0, 1.0);
          if (pxPerSec > 2200) pxPerSec = 2200;
        } else {
          // Observable View
          if (item.speedMps < 1e-4) {
            pxPerSec = 10;
          } else if (item.speedMps < 0.01) {
            pxPerSec = 25;
          } else if (item.speedMps < 0.1) {
            pxPerSec = 50;
          } else if (item.speedMps < 1.0) {
            pxPerSec = 120;
          } else if (item.speedMps < 2.0) {
            const pulse = Math.pow(Math.max(0, Math.sin(heartbeatPhaseRef.current)), 4);
            pxPerSec = 80 + pulse * 240;
          } else if (item.speedMps < 15.0) {
            pxPerSec = 220; // Usain Bolt
          } else if (item.speedMps < 25.0) {
            pxPerSec = 290; // Mantis Shrimp
          } else if (item.speedMps < 40.0) {
            pxPerSec = 380; // Cheetah
          } else if (item.speedMps < 150.0) {
            pxPerSec = 520; // Falcon
          } else if (item.speedMps < 1000.0) {
            pxPerSec = 750; // Sound
          } else {
            pxPerSec = 1400; // Cosmic / Light
          }
        }

        // Advance position
        let currentPos = (animPositionsRef.current[item.id] || 0) + pxPerSec * dt;
        if (currentPos > conveyorActiveWidth - 24) {
          currentPos = 0;
        }
        animPositionsRef.current[item.id] = currentPos;

        const objectX = conveyorLeft + 12 + currentPos;

        // Custom visual trails
        if (item.id === 'garden-snail' || item.id === 'sloth') {
          ctx.strokeStyle = 'rgba(101, 163, 13, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(conveyorLeft + 10, centerY + 6);
          ctx.lineTo(objectX, centerY + 6);
          ctx.stroke();
        } else if (item.id === 'mantis-shrimp') {
          // Cavitation bubble flash
          ctx.fillStyle = 'rgba(234, 88, 12, 0.3)';
          ctx.beginPath();
          ctx.arc(objectX, centerY, 18, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.id === 'speed-of-light' || item.id === 'light-vacuum') {
          // Laser beam streak
          const beamLen = 70;
          const grad = ctx.createLinearGradient(objectX - beamLen, centerY, objectX, centerY);
          grad.addColorStop(0, 'rgba(147, 51, 234, 0)');
          grad.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
          ctx.fillStyle = grad;
          ctx.fillRect(Math.max(conveyorLeft, objectX - beamLen), centerY - 2, beamLen, 4);
        }

        // Emoji
        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, objectX, centerY);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [currentItems, motionMode, ppi, ppmm]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Horizontal Velocity Arena &bull; Like Neal.fun / Sell! Sell! Sell!
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            Objects Moving at Their True Physical Speeds
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
            Items glide continuously across horizontal conveyor belts in real-time. No start buttons, no configuration—just continuous motion.
          </p>
        </div>

        {/* Observable vs 1:1 Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => {
              playClick(850);
              setMotionMode('observable');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              motionMode === 'observable'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Observable View
          </button>
          <button
            onClick={() => {
              playClick(850);
              setMotionMode('literal');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              motionMode === 'literal'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Strict 1:1 Scale
          </button>
        </div>
      </div>

      {/* Category Tabs: Highlights vs Animals vs Physics */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            playClick(800);
            setActiveTab('highlights');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'highlights'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ⭐ Key Highlights ({ALL_CONVEYOR_ITEMS.filter((i) => i.category === 'highlights').length})
        </button>
        <button
          onClick={() => {
            playClick(800);
            setActiveTab('animals');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'animals'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🐾 Animal Kingdom ({ALL_CONVEYOR_ITEMS.filter((i) => i.category === 'animals').length})
        </button>
        <button
          onClick={() => {
            playClick(800);
            setActiveTab('physics');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'physics'
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🌌 Cosmic & Physics ({ALL_CONVEYOR_ITEMS.filter((i) => i.category === 'physics').length})
        </button>
      </div>

      {/* The Conveyor Belts Canvas */}
      <div className="w-full h-[540px] sm:h-[580px] my-4 rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Scale Callout: Why Sound vs. Light needs a special showdown */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 font-medium">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Important Physics Scale Note:</strong>
            On this conveyor belt, the Speed of Light is displayed compressed so it doesn&apos;t flash past your monitor invisibly. In honest physics, Light is{' '}
            <strong>874,030.5&times; faster than Sound</strong>!
          </div>
        </div>
        <a
          href="#sound-vs-light"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-200 text-amber-950 font-bold shrink-0 self-start sm:self-auto transition-colors"
        >
          <span>See True-Scale Showdown</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Everyday Object Reference Line Below Conveyor */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hold Against Your Screen to Verify Scale:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {FAMILIAR_OBJECTS.slice(0, 3).map((obj) => (
            <div
              key={obj.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3"
            >
              <span className="text-2xl select-none">{obj.icon}</span>
              <div>
                <div className="font-bold text-slate-900">{obj.name}</div>
                <div className="text-[11px] text-slate-500">
                  {obj.widthMm} mm wide ({obj.funFact})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
