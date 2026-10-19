'use client';

import React from 'react';
import RealtimeAccumulator from '@/components/museum/RealtimeAccumulator';
import ContinuousSpeedConveyor from '@/components/exhibits/ContinuousSpeedConveyor';
import TrueScaleTrack from '@/components/exhibits/TrueScaleTrack';
import DataPaperScale from '@/components/exhibits/DataPaperScale';
import DataFlood from '@/components/exhibits/DataFlood';
import CpuPaperScale from '@/components/exhibits/CpuPaperScale';
import CpuTimeDilation from '@/components/exhibits/CpuTimeDilation';
import LatencyArcade from '@/components/exhibits/LatencyArcade';
import FrameRateVault from '@/components/exhibits/FrameRateVault';
import HumanSpeedVault from '@/components/exhibits/HumanSpeedVault';
import CosmicVault from '@/components/exhibits/CosmicVault';
import FamiliarScaleSelector from '@/components/calibrator/FamiliarScaleSelector';
import { ArrowDown } from 'lucide-react';

export default function MuseumWalkthrough() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Welcoming Hero Entrance */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-36 sm:pb-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-slate-500 bg-slate-100 mb-6">
          <span>Digital Science Museum</span>
          <span>&bull;</span>
          <span>Zero clicks needed</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05]">
          Wait, How Fast Is That?
        </h1>

        <p className="mt-6 text-lg sm:text-2xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
          A physical exploration of speed, scale, and the hidden velocities of our universe.
          Just scroll down to enter.
        </p>

        {/* Scroll Prompt Indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 text-slate-400 font-mono text-xs font-semibold animate-bounce">
          <span>Scroll to walk through the museum</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </section>

      {/* 2. Hall 01: Real-Time Stream (Printing Money style) */}
      <section id="realtime-stream" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 01 &bull; Real-Time Stream
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The World While You&apos;re Scrolling
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Continuous real-time accumulators inspired by Neal.fun’s <em>Printing Money</em>: watching cash pile up, rice pour, and light cross space.
          </p>
        </div>
        <RealtimeAccumulator />
      </section>

      {/* 3. Hall 02: Continuous Speed Conveyors (Sell! Sell! Sell! style) */}
      <section id="speed-conveyor" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 02 &bull; 1:1 True-Scale Speed Tracks
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Fast Things Actually Move
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Live conveyor belts gliding continuously across your screen at their relative physical speeds.
          </p>
        </div>
        <div className="space-y-12">
          <ContinuousSpeedConveyor />
          <TrueScaleTrack />
        </div>
      </section>

      {/* 4. Hall 03: The Scale of Data (Neal.fun / Paper style) */}
      <section id="data-scale" className="w-full max-w-5xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <DataPaperScale />
        <div className="mt-16">
          <DataFlood />
        </div>
      </section>

      {/* 5. Hall 04: Inside Your CPU (Neal.fun / Paper style) */}
      <section id="cpu-dilation" className="w-full max-w-5xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <CpuPaperScale />
        <div className="mt-16">
          <CpuTimeDilation />
        </div>
      </section>

      {/* 6. Hall 05: The Latency & Ping Arcade */}
      <section id="latency-arcade" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 05 &bull; The Latency Arcade
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Feel the Speed-of-Light Lag
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From the glass tax in subsea optical fiber to the 2.56-second Lunar rover delay and 21-minute Mars lag.
          </p>
        </div>
        <LatencyArcade />
      </section>

      {/* 7. Hall 06: Refresh & Frame Rate Vault */}
      <section id="framerate-vault" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 06 &bull; The Refresh Vault
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Neuroscience of Display Refresh
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Track motion across 15, 30, 60 FPS and your screen’s native hardware Hz.
          </p>
        </div>
        <FrameRateVault />
      </section>

      {/* 8. Hall 07: The Speed of You (Human Biology) */}
      <section id="human-vault" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 07 &bull; The Speed of You
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The Hidden Velocities of Your Body
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Systolic aorta blood pulses, sneeze droplet blast velocity, and neural reflex test.
          </p>
        </div>
        <HumanSpeedVault />
      </section>

      {/* 9. Hall 08: The Cosmic Vault */}
      <section id="cosmic-vault" className="w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 08 &bull; The Cosmic Vault
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Planetary, Galactic & Interstellar Velocities
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Earth orbiting the Sun at 30 km/s, Parker Solar Probe at 176 km/s, and Grace Hopper’s light nanosecond.
          </p>
        </div>
        <CosmicVault />
      </section>

      {/* 10. Hall 09: Screen Scale Calibrator */}
      <section id="screen-scale" className="w-full max-w-5xl px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 09 &bull; Physical Screen Calibration
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Calibrate to Your Monitor Inches
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hold a standard credit card or dollar bill against the screen to ensure 100% physically exact millimeter precision.
          </p>
        </div>
        <FamiliarScaleSelector />
      </section>
    </div>
  );
}
