'use client';

import React from 'react';
import TrueScaleTrack from '@/components/exhibits/TrueScaleTrack';
import LatencyArcade from '@/components/exhibits/LatencyArcade';
import DataFlood from '@/components/exhibits/DataFlood';
import CpuTimeDilation from '@/components/exhibits/CpuTimeDilation';
import FrameRateVault from '@/components/exhibits/FrameRateVault';
import { Gauge, Radio, HardDrive, Cpu, Activity, Compass } from 'lucide-react';

export default function GrandWalkthrough() {
  const sections = [
    { id: 'hall-1', title: 'Hall 01: True-Scale Speed', icon: Gauge, color: 'text-emerald-400' },
    { id: 'hall-2', title: 'Hall 02: Latency Arcade', icon: Radio, color: 'text-cyan-400' },
    { id: 'hall-3', title: 'Hall 03: The Data Flood', icon: HardDrive, color: 'text-indigo-400' },
    { id: 'hall-4', title: 'Hall 04: CPU Time Dilation', icon: Cpu, color: 'text-purple-400' },
    { id: 'hall-5', title: 'Hall 05: Frame Rate Vault', icon: Activity, color: 'text-amber-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Walkthrough Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
          <Compass className="w-3.5 h-3.5" />
          <span>Continuous Museum Tour</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Grand Walkthrough: All 5 Halls
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Stroll sequentially through every exhibit in the digital museum. Jump to any hall below:
        </p>

        {/* Sticky Jump Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span>{s.title}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Hall 1 */}
      <section id="hall-1" className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Gauge className="w-4 h-4" />
          <span>Hall 01 &bull; 1:1 True-Scale Speed Track</span>
        </div>
        <h2 className="text-2xl font-black text-white">How Fast Things Actually Move</h2>
        <TrueScaleTrack />
      </section>

      {/* Hall 2 */}
      <section id="hall-2" className="scroll-mt-24 space-y-4 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Radio className="w-4 h-4" />
          <span>Hall 02 &bull; The Latency & Ping Arcade</span>
        </div>
        <h2 className="text-2xl font-black text-white">Feel the Speed-of-Light Lag</h2>
        <LatencyArcade />
      </section>

      {/* Hall 3 */}
      <section id="hall-3" className="scroll-mt-24 space-y-4 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
          <HardDrive className="w-4 h-4" />
          <span>Hall 03 &bull; The Data Flood</span>
        </div>
        <h2 className="text-2xl font-black text-white">Bits vs. Bytes as Physical Matter</h2>
        <DataFlood />
      </section>

      {/* Hall 4 */}
      <section id="hall-4" className="scroll-mt-24 space-y-4 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Hall 04 &bull; CPU Time Dilation Chamber</span>
        </div>
        <h2 className="text-2xl font-black text-white">If 1 Nanosecond = 1 Human Second</h2>
        <CpuTimeDilation />
      </section>

      {/* Hall 5 */}
      <section id="hall-5" className="scroll-mt-24 space-y-4 pt-10 border-t border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Hall 05 &bull; The Refresh & Frame Rate Vault</span>
        </div>
        <h2 className="text-2xl font-black text-white">The Neuroscience of Display Refresh</h2>
        <FrameRateVault />
      </section>
    </div>
  );
}
