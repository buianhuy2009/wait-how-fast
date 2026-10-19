'use client';

import React from 'react';
import MuseumScrollNavigator from '@/components/museum/MuseumScrollNavigator';
import PrintingMoneyStream from '@/components/museum/PrintingMoneyStream';
import ContinuousSpeedConveyor from '@/components/exhibits/ContinuousSpeedConveyor';
import SoundVsLightShowdown from '@/components/exhibits/SoundVsLightShowdown';
import AnimalSpeedOlympics from '@/components/exhibits/AnimalSpeedOlympics';
import DataPaperScale from '@/components/exhibits/DataPaperScale';
import CpuPaperScale from '@/components/exhibits/CpuPaperScale';
import ContinuousLatencyStream from '@/components/exhibits/ContinuousLatencyStream';
import FrameRateVault from '@/components/exhibits/FrameRateVault';
import HumanSpeedVault from '@/components/exhibits/HumanSpeedVault';
import CosmicVault from '@/components/exhibits/CosmicVault';
import { ArrowDown } from 'lucide-react';

export default function MuseumWalkthrough() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Non-distractive Left-Docked Museum Scroll Navigator */}
      <MuseumScrollNavigator />

      {/* 1. Welcoming Hero Entrance */}
      <section id="entrance" className="scroll-mt-24 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-36 sm:pb-32 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200 mb-6 shadow-2xs">
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

      {/* 2. Hall 01: Real-Time Stream (Neal.fun Printing Money style) */}
      <section id="realtime-stream" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 01 &bull; Real-Time Stream
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The World While You&apos;re Scrolling
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Continuous real-time printing presses inspired by Neal.fun’s <em>Printing Money</em>: watching $100 bills print, rice pour, and light cross space in literal real time.
          </p>
        </div>
        <PrintingMoneyStream />
      </section>

      {/* 3. Hall 02: Continuous Speed Conveyors (Neal.fun Sell! Sell! Sell! style) */}
      <section id="speed-conveyor" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 02 &bull; 1:1 True-Scale Speed Tracks
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How Fast Things Actually Move
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Live conveyor belts gliding continuously across your screen at their relative physical velocities, inspired by Neal.fun’s <em>Sell! Sell! Sell!</em>.
          </p>
        </div>
        <ContinuousSpeedConveyor />
      </section>

      {/* 4. Special Feature: True-Scale Showdown (Sound vs. Light) */}
      <section id="sound-vs-light" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <SoundVsLightShowdown />
      </section>

      {/* 5. Special Feature: The Animal Kingdom Speed Olympics */}
      <section id="animal-olympics" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <AnimalSpeedOlympics />
      </section>

      {/* 6. Hall 03: The Scale of Data (Neal.fun / Paper style with rich SVG illustrations) */}
      <section id="data-scale" className="scroll-mt-20 w-full max-w-5xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <DataPaperScale />
      </section>

      {/* 7. Hall 04: Inside Your CPU (Why Is Your Computer Waiting?) */}
      <section id="cpu-dilation" className="scroll-mt-20 w-full max-w-5xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <CpuPaperScale />
      </section>

      {/* 8. Hall 05: Speed of Light & The Latency Arena */}
      <section id="latency-arena" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <ContinuousLatencyStream />
      </section>

      {/* 9. Hall 06: Refresh & Frame Rate Vault */}
      <section id="framerate-vault" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 06 &bull; The Refresh Vault
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The Neuroscience of Display Refresh
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Watch 15, 30, 60 FPS and your screen’s native hardware Hz fly side-by-side continuously.
          </p>
        </div>
        <FrameRateVault />
      </section>

      {/* 10. Hall 07: The Speed of You (Human Biology) */}
      <section id="human-vault" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 07 &bull; The Speed of You
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            The Hidden Velocities of Your Body
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From systolic aorta blood pulses to sensory nerve conduction and sneeze blast velocity.
          </p>
        </div>
        <HumanSpeedVault />
      </section>

      {/* 11. Hall 08: The Cosmic Vault */}
      <section id="cosmic-vault" className="scroll-mt-20 w-full max-w-6xl px-4 sm:px-6 py-20 sm:py-32 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
            Hall 08 &bull; The Cosmic Vault
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Planetary, Galactic & Interstellar Velocities
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Earth orbiting the Sun at 30 km/s, Parker Solar Probe at 176 km/s, and Grace Hopper’s light nanosecond.
          </p>
        </div>
        <CosmicVault />
      </section>
    </div>
  );
}
