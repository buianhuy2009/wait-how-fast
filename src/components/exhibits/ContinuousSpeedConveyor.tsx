'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import { calculatePpmm, velocityToPxPerSec } from '@/lib/ppiMath';
import { FAMILIAR_OBJECTS } from '@/lib/familiarObjects';

interface ConveyorItem {
  id: string;
  name: string;
  speedMps: number;
  displaySpeed: string;
  icon: string;
  accentColor: string;
  comparisonNote: string;
  category: string;
}

const CONVEYOR_ITEMS: ConveyorItem[] = [
  {
    id: 'hair-growth',
    name: 'Scalp Hair Growth',
    speedMps: 4.75e-9, // 4.75 nm/s
    displaySpeed: '4.75 nm / sec',
    icon: '💇',
    accentColor: '#d97706',
    comparisonNote: '0.5 mm synthesized every second across all scalp follicles.',
    category: 'Microscopic',
  },
  {
    id: 'garden-snail',
    name: 'Garden Snail',
    speedMps: 0.0013, // 1.3 mm/s
    displaySpeed: '1.3 mm / sec',
    icon: '🐌',
    accentColor: '#65a30d',
    comparisonNote: 'Takes 2 minutes to crawl the length of a dollar bill.',
    category: 'Creeping',
  },
  {
    id: '3d-printer',
    name: '3D Printer Nozzle',
    speedMps: 0.25, // 250 mm/s
    displaySpeed: '250 mm / sec',
    icon: '🖨️',
    accentColor: '#0891b2',
    comparisonNote: 'Crosses your entire monitor screen in ~1 second.',
    category: 'Mechanical',
  },
  {
    id: 'aorta-blood',
    name: 'Aorta Blood Surge',
    speedMps: 1.2, // 1.2 m/s
    displaySpeed: '1.2 m / sec (2.7 mph)',
    icon: '❤️',
    accentColor: '#dc2626',
    comparisonNote: 'Systolic pulse surging from your heart to your brain.',
    category: 'Biological',
  },
  {
    id: 'cheetah-sprint',
    name: 'Cheetah Top Sprint',
    speedMps: 29.0, // 29 m/s (65 mph)
    displaySpeed: '29 m / sec (65 mph)',
    icon: '🐆',
    accentColor: '#ca8a04',
    comparisonNote: 'Crosses a 100-meter field in 3.4 seconds.',
    category: 'Terrestrial',
  },
  {
    id: 'speed-of-sound',
    name: 'Speed of Sound',
    speedMps: 343.0, // 343 m/s
    displaySpeed: '343 m / sec (Mach 1)',
    icon: '🔊',
    accentColor: '#2563eb',
    comparisonNote: 'Sweeps across your monitor in 0.8 milliseconds.',
    category: 'Acoustic',
  },
  {
    id: 'speed-of-light',
    name: 'Speed of Light (c)',
    speedMps: 299_792_458, // 300,000 km/s
    displaySpeed: '300,000 km / sec',
    icon: '💡',
    accentColor: '#9333ea',
    comparisonNote: 'Travels 11.8 inches (width of this screen) in 1 nanosecond.',
    category: 'Cosmic Limit',
  },
];

export default function ContinuousSpeedConveyor() {
  const { ppi } = useCalibration();
  const { playClick } = useSound();
  const ppmm = calculatePpmm(ppi);

  const [motionMode, setMotionMode] = useState<'observable' | 'literal'>('observable');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animPositionsRef = useRef<Record<string, number>>({});
  const lastTimeRef = useRef<number>(0);
  const heartbeatPhaseRef = useRef<number>(0);
  const beltTreadPhaseRef = useRef<number>(0);

  // Initialize staggered positions
  useEffect(() => {
    CONVEYOR_ITEMS.forEach((item, index) => {
      if (animPositionsRef.current[item.id] === undefined) {
        animPositionsRef.current[item.id] = (index * 90) % 500;
      }
    });
  }, []);

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

      const numTracks = CONVEYOR_ITEMS.length;
      const trackHeight = height / numTracks;

      // Responsive label column width on the left
      const isMobile = width < 640;
      const labelColWidth = isMobile ? 120 : 210;
      const conveyorLeft = labelColWidth + 12;
      const conveyorRight = width - 16;
      const conveyorActiveWidth = Math.max(100, conveyorRight - conveyorLeft);

      CONVEYOR_ITEMS.forEach((item, idx) => {
        const trackY = idx * trackHeight;
        const centerY = trackY + trackHeight / 2;

        // Track Separator Line
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, trackY + trackHeight);
        ctx.lineTo(width, trackY + trackHeight);
        ctx.stroke();

        // Left Label Column (Fixed area, never covered by moving items)
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

        // Category / Note (hidden on narrow screens to keep it uncluttered)
        if (!isMobile) {
          ctx.font = 'normal 10px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = '#64748b';
          const truncatedNote =
            item.comparisonNote.length > 34
              ? item.comparisonNote.substring(0, 32) + '…'
              : item.comparisonNote;
          ctx.fillText(truncatedNote, 12, trackY + 48);
        }

        // Vertical divider between label column and conveyor belt
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(labelColWidth, trackY + 4);
        ctx.lineTo(labelColWidth, trackY + trackHeight - 4);
        ctx.stroke();

        // Conveyor Belt Bed (Sell! Sell! Sell! mechanical aesthetic)
        const beltY = centerY - 18;
        const beltH = 36;
        ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(conveyorLeft, beltY, conveyorActiveWidth, beltH, 8);
        ctx.fill();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving Conveyor Tread Pattern (Sell! Sell! Sell! style)
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

        // Calculate velocity for this track
        let pxPerSec = 0;
        if (motionMode === 'literal') {
          pxPerSec = velocityToPxPerSec(item.speedMps, ppi, 1.0, 1.0);
          if (pxPerSec > 2200) pxPerSec = 2200;
        } else {
          // Observable View: calibrated so all speeds are distinct yet eye-trackable
          switch (item.id) {
            case 'hair-growth':
              pxPerSec = 10;
              break;
            case 'garden-snail':
              pxPerSec = Math.max(18, item.speedMps * 1000 * ppmm * 4);
              break;
            case '3d-printer':
              pxPerSec = 130;
              break;
            case 'aorta-blood': {
              const pulse = Math.pow(Math.max(0, Math.sin(heartbeatPhaseRef.current)), 4);
              pxPerSec = 70 + pulse * 260;
              break;
            }
            case 'cheetah-sprint':
              pxPerSec = 340;
              break;
            case 'speed-of-sound':
              pxPerSec = 700;
              break;
            case 'speed-of-light':
              pxPerSec = 1400;
              break;
            default:
              pxPerSec = 120;
          }
        }

        // Advance position
        let currentPos = (animPositionsRef.current[item.id] || 0) + pxPerSec * dt;
        if (currentPos > conveyorActiveWidth - 24) {
          currentPos = 0;
        }
        animPositionsRef.current[item.id] = currentPos;

        const objectX = conveyorLeft + 12 + currentPos;

        // Visual FX for specific items
        if (item.id === 'garden-snail') {
          // Slime trail left by snail on conveyor
          ctx.strokeStyle = 'rgba(101, 163, 13, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(conveyorLeft + 10, centerY + 6);
          ctx.lineTo(objectX, centerY + 6);
          ctx.stroke();
        } else if (item.id === '3d-printer') {
          // Extruded molten filament line
          ctx.strokeStyle = 'rgba(8, 145, 178, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(conveyorLeft + 10, centerY + 4);
          ctx.lineTo(objectX, centerY + 4);
          ctx.stroke();
        } else if (item.id === 'aorta-blood') {
          // Systolic arterial pulse glow
          ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
          ctx.beginPath();
          ctx.ellipse(objectX, centerY, 22, 12, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.id === 'speed-of-light') {
          // Laser beam streak
          const beamLen = 70;
          const grad = ctx.createLinearGradient(objectX - beamLen, centerY, objectX, centerY);
          grad.addColorStop(0, 'rgba(147, 51, 234, 0)');
          grad.addColorStop(1, 'rgba(147, 51, 234, 0.8)');
          ctx.fillStyle = grad;
          ctx.fillRect(Math.max(conveyorLeft, objectX - beamLen), centerY - 2, beamLen, 4);
        }

        // Render moving object emoji on the conveyor
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
  }, [motionMode, ppi, ppmm]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
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

      {/* The 7 Conveyor Belts Canvas (Generous height, clean lanes, no text collisions) */}
      <div className="w-full h-[520px] sm:h-[560px] my-6 rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
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
