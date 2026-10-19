'use client';

import React from 'react';
import TrueScaleTrack from '@/components/exhibits/TrueScaleTrack';
import HumanSpeedVault from '@/components/exhibits/HumanSpeedVault';
import LatencyArcade from '@/components/exhibits/LatencyArcade';
import DataFlood from '@/components/exhibits/DataFlood';
import CpuTimeDilation from '@/components/exhibits/CpuTimeDilation';
import FrameRateVault from '@/components/exhibits/FrameRateVault';
import CosmicVault from '@/components/exhibits/CosmicVault';
import RealtimeAccumulator from '@/components/museum/RealtimeAccumulator';
import {
  Gauge,
  Heart,
  Radio,
  HardDrive,
  Cpu,
  Activity,
  Sparkles,
  Compass,
} from 'lucide-react';

export default function GrandWalkthrough() {
  const sections = [
    { id: 'wing-1', title: 'Wing 01: Speed Track', icon: Gauge, color: 'text-emerald-500' },
    { id: 'wing-2', title: 'Wing 02: Speed of You', icon: Heart, color: 'text-rose-500' },
    { id: 'wing-3', title: 'Wing 03: Latency Arcade', icon: Radio, color: 'text-cyan-500' },
    { id: 'wing-4', title: 'Wing 04: The Data Flood', icon: HardDrive, color: 'text-indigo-500' },
    { id: 'wing-5', title: 'Wing 05: Inside Your CPU', icon: Cpu, color: 'text-purple-500' },
    { id: 'wing-6', title: 'Wing 06: Refresh Vault', icon: Activity, color: 'text-amber-500' },
    { id: 'wing-7', title: 'Wing 07: Cosmic Vault', icon: Sparkles, color: 'text-violet-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Walkthrough Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          <Compass className="w-4 h-4" />
          <span>Continuous Museum Tour</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Grand Walkthrough: All 7 Wings
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Stroll sequentially through every single room in the museum. Jump to any wing below or explore down the page:
        </p>

        {/* Sticky Jump Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors shadow-sm"
              >
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span>{s.title}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Flagship Real-Time Live Ticker */}
      <section className="w-full">
        <RealtimeAccumulator />
      </section>

      {/* Wing 1 */}
      <section id="wing-1" className="scroll-mt-24 space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Gauge className="w-4 h-4" />
          <span>Wing 01 &bull; 1:1 True-Scale Speed Track</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          How Fast Things Actually Move
        </h2>
        <TrueScaleTrack />
      </section>

      {/* Wing 2 */}
      <section id="wing-2" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-rose-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Heart className="w-4 h-4" />
          <span>Wing 02 &bull; The Speed of You (Human Biology & Reflex Lab)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          The Hidden Velocities of Your Body
        </h2>
        <HumanSpeedVault />
      </section>

      {/* Wing 3 */}
      <section id="wing-3" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Radio className="w-4 h-4" />
          <span>Wing 03 &bull; The Latency & Ping Arcade</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Feel the Speed-of-Light Lag Across Earth and Space
        </h2>
        <LatencyArcade />
      </section>

      {/* Wing 4 */}
      <section id="wing-4" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-500 font-mono text-xs font-bold uppercase tracking-wider">
          <HardDrive className="w-4 h-4" />
          <span>Wing 04 &bull; The Data Flood</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Bits vs. Bytes as Physical Matter
        </h2>
        <DataFlood />
      </section>

      {/* Wing 5 */}
      <section id="wing-5" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-purple-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Wing 05 &bull; Inside Your CPU (Time Dilation Chamber)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          If 1 Nanosecond = 1 Human Second
        </h2>
        <CpuTimeDilation />
      </section>

      {/* Wing 6 */}
      <section id="wing-6" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Wing 06 &bull; The Refresh & Frame Rate Vault</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          The Neuroscience of Display Refresh & Persistence
        </h2>
        <FrameRateVault />
      </section>

      {/* Wing 7 */}
      <section id="wing-7" className="scroll-mt-24 space-y-4 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-violet-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Wing 07 &bull; The Cosmic Vault</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Planetary, Galactic & Interstellar Velocities
        </h2>
        <CosmicVault />
      </section>
    </div>
  );
}
