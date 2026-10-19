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
    accentColor: '#f59e0b',
    comparisonNote: '0.5 mm of new hair synthesized every second across all 100,000 scalp follicles.',
    category: 'Microscopic',
  },
  {
    id: 'garden-snail',
    name: 'Garden Snail Sprint',
    speedMps: 0.0013, // 1.3 mm/s
    displaySpeed: '1.3 mm / sec',
    icon: '🐌',
    accentColor: '#84cc16',
    comparisonNote: 'Takes 2.0 minutes to crawl the length of a dollar bill (156 mm).',
    category: 'Creeping',
  },
  {
    id: '3d-printer',
    name: 'CoreXY 3D Printer Nozzle',
    speedMps: 0.25, // 250 mm/s
    displaySpeed: '250 mm / sec',
    icon: '🖨️',
    accentColor: '#06b6d4',
    comparisonNote: 'Crosses your entire laptop screen in just over 1 second.',
    category: 'Mechanical',
  },
  {
    id: 'aorta-blood',
    name: 'Heart Contraction (Aorta Surge)',
    speedMps: 1.2, // 1.2 m/s
    displaySpeed: '1.2 m / sec (2.7 mph)',
    icon: '❤️',
    accentColor: '#ef4444',
    comparisonNote: 'Surges from your chest to your brain in a rhythmic systolic pulse.',
    category: 'Biological',
  },
  {
    id: 'cheetah-sprint',
    name: 'Cheetah Top Sprint',
    speedMps: 29.0, // 29 m/s (65 mph)
    displaySpeed: '29 m / sec (65 mph)',
    icon: '🐆',
    accentColor: '#eab308',
    comparisonNote: 'Crosses a standard 100-meter football field in 3.4 seconds.',
    category: 'Terrestrial',
  },
  {
    id: 'speed-of-sound',
    name: 'Speed of Sound in Air (Mach 1)',
    speedMps: 343.0, // 343 m/s
    displaySpeed: '343 m / sec (767 mph)',
    icon: '🔊',
    accentColor: '#3b82f6',
    comparisonNote: 'Acoustic pressure wave sweeps across your screen in 0.8 milliseconds.',
    category: 'Acoustic',
  },
  {
    id: 'speed-of-light',
    name: 'Light in Vacuum (Grace Hopper Nanosecond)',
    speedMps: 299_792_458, // 300,000 km/s
    displaySpeed: '299,792 km / sec',
    icon: '💡',
    accentColor: '#a855f7',
    comparisonNote: 'Travels 11.8 inches (the width of this screen) in exactly 1 nanosecond.',
    category: 'Cosmic Limit',
  },
];

export default function ContinuousSpeedConveyor() {
  const { ppi } = useCalibration();
  const { playClick } = useSound();
  const ppmm = calculatePpmm(ppi);

  // Mode: 'observable' (speed balanced so all motion is visible simultaneously like Sell! Sell! Sell!)
  // or 'literal' (strict 1:1 physical speed where slow things crawl and fast things streak)
  const [motionMode, setMotionMode] = useState<'observable' | 'literal'>('observable');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animPositionsRef = useRef<Record<string, number>>({});
  const lastTimeRef = useRef<number>(0);
  const heartbeatPhaseRef = useRef<number>(0);

  // Initialize positions
  useEffect(() => {
    CONVEYOR_ITEMS.forEach((item, index) => {
      if (animPositionsRef.current[item.id] === undefined) {
        animPositionsRef.current[item.id] = (index * 80) % 600;
      }
    });
  }, []);

  // Main high-performance render loop
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

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clean, bright Neal.fun canvas background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const trackHeight = height / CONVEYOR_ITEMS.length;
      const trackPaddingLeft = 20;
      const trackPaddingRight = 20;
      const trackActiveWidth = width - trackPaddingLeft - trackPaddingRight;

      CONVEYOR_ITEMS.forEach((item, idx) => {
        const trackY = idx * trackHeight;
        const centerY = trackY + trackHeight / 2;

        // Subtle track separator
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, trackY + trackHeight);
        ctx.lineTo(width, trackY + trackHeight);
        ctx.stroke();

        // Conveyor belt bed (Sell! Sell! Sell! style)
        ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
        ctx.fillRect(trackPaddingLeft, trackY + 4, trackActiveWidth, trackHeight - 8);

        // Subtly dashed guide line
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(trackPaddingLeft, centerY + 12);
        ctx.lineTo(width - trackPaddingRight, centerY + 12);
        ctx.stroke();
        ctx.setLineDash([]);

        // Calculate velocity for this track
        let pxPerSec = 0;
        if (motionMode === 'literal') {
          pxPerSec = velocityToPxPerSec(item.speedMps, ppi, 1.0, 1.0);
          // Clamp extreme speeds so browser canvas doesn't glitch
          if (pxPerSec > 2500) pxPerSec = 2500;
        } else {
          // 'observable' mode (relative speeds tuned so human eyes can track all items simultaneously)
          switch (item.id) {
            case 'hair-growth':
              pxPerSec = 8; // gentle crawl
              break;
            case 'garden-snail':
              pxPerSec = item.speedMps * 1000 * ppmm; // literal 1.3 mm/s!
              break;
            case '3d-printer':
              pxPerSec = 140;
              break;
            case 'aorta-blood': {
              const pulse = Math.pow(Math.max(0, Math.sin(heartbeatPhaseRef.current)), 4);
              pxPerSec = 60 + pulse * 280;
              break;
            }
            case 'cheetah-sprint':
              pxPerSec = 360;
              break;
            case 'speed-of-sound':
              pxPerSec = 750;
              break;
            case 'speed-of-light':
              pxPerSec = 1500;
              break;
            default:
              pxPerSec = 100;
          }
        }

        // Advance position
        let currentPos = (animPositionsRef.current[item.id] || 0) + pxPerSec * dt;
        if (currentPos > trackActiveWidth) {
          currentPos = 0;
        }
        animPositionsRef.current[item.id] = currentPos;

        const objectX = trackPaddingLeft + currentPos;

        // Draw motion trail / slime / pulse
        if (item.id === 'garden-snail') {
          // Translucent slime track
          ctx.strokeStyle = 'rgba(132, 204, 22, 0.35)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(trackPaddingLeft, centerY + 12);
          ctx.lineTo(objectX, centerY + 12);
          ctx.stroke();
        } else if (item.id === 'aorta-blood') {
          // Arterial blood pulse glow
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.beginPath();
          ctx.ellipse(objectX, centerY, 24, 14, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.id === 'speed-of-light') {
          // Laser beam streak
          const beamLength = 80;
          const grad = ctx.createLinearGradient(objectX - beamLength, centerY, objectX, centerY);
          grad.addColorStop(0, 'rgba(168, 85, 247, 0)');
          grad.addColorStop(1, 'rgba(168, 85, 247, 0.7)');
          ctx.fillStyle = grad;
          ctx.fillRect(Math.max(trackPaddingLeft, objectX - beamLength), centerY - 3, beamLength, 6);
        }

        // Render moving object icon & marker
        ctx.font = '22px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, objectX, centerY - 2);

        // Track label & speed callout on left
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.name, trackPaddingLeft + 8, trackY + 16);

        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillStyle = item.accentColor;
        ctx.fillText(item.displaySpeed, trackPaddingLeft + 8, trackY + 31);
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
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Continuous Speed Conveyors
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Watch the Universe Move in Real Time
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Inspired by Neal.fun’s <em>Sell! Sell! Sell!</em>: items glide across horizontal conveyor belts at their relative velocities. No start buttons required.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => {
              playClick(850);
              setMotionMode('observable');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              motionMode === 'observable'
                ? 'bg-white text-slate-900 shadow-xs'
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
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Strict 1:1 Scale
          </button>
        </div>
      </div>

      {/* The 7 Conveyor Belts Canvas */}
      <div className="w-full h-[460px] my-6 rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Real-World Everyday Object References Under the Track */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          Hold Against Your Screen to Verify Scale:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          {FAMILIAR_OBJECTS.slice(0, 3).map((obj) => (
            <div
              key={obj.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3"
            >
              <span className="text-2xl">{obj.icon}</span>
              <div>
                <div className="font-bold text-slate-900">{obj.name}</div>
                <div className="text-[11px] text-slate-500">
                  {obj.widthMm} mm ({obj.funFact})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
