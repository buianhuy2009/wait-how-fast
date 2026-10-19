'use client';

import React from 'react';
import { ArrowDown, Clock } from 'lucide-react';

interface CpuDilationStep {
  name: string;
  realTime: string;
  dilatedTime: string;
  icon: string;
  headline: string;
  story: string;
  hardwareLevel: string;
}

const CPU_PAPER_STEPS: CpuDilationStep[] = [
  {
    name: '1 CPU Clock Cycle (3 GHz)',
    realTime: '0.33 ns',
    dilatedTime: '0.33 Seconds',
    icon: '⚡',
    headline: 'A quick snap of your fingers',
    story: 'The CPU performs a single fundamental math instruction. In our dilated universe, this is merely a casual finger snap. Light travels barely 10 centimeters.',
    hardwareLevel: 'Silicon Core',
  },
  {
    name: 'L1 Cache Reference (Hit)',
    realTime: '0.50 ns',
    dilatedTime: '0.50 Seconds',
    icon: '📝',
    headline: 'Glancing at a sticky note on your desk',
    story: 'L1 cache sits directly inside the core silicon. Accessing it is like glancing down at a bright yellow sticky note already stuck to your desk in front of you.',
    hardwareLevel: 'On-Die Cache',
  },
  {
    name: 'L2 Cache Reference',
    realTime: '3.0 ns',
    dilatedTime: '3.0 Seconds',
    icon: '🗄️',
    headline: 'Sliding open your top desk drawer',
    story: 'Slightly larger memory bank. The CPU worker reaches into their top desk drawer, grabs a folder, and slides it shut.',
    hardwareLevel: 'Mid-Tier Cache',
  },
  {
    name: 'L3 Unified Cache',
    realTime: '15 ns',
    dilatedTime: '15 Seconds',
    icon: '📁',
    headline: 'Walking to the filing cabinet in the corner',
    story: 'Shared across all processor cores. In human time, the worker stands up from their chair, walks across the office floor, pulls a file, and sits back down.',
    hardwareLevel: 'Shared Die Cache',
  },
  {
    name: 'Main Memory (DDR5 RAM)',
    realTime: '100 ns',
    dilatedTime: '1 min 40 sec',
    icon: '☕',
    headline: 'Walking to the breakroom to microwave tea',
    story: 'Going off the silicon chip through the memory bus feels like an eternity. The worker has time to take a stroll down the hallway, microwave a hot snack, and leisurely return.',
    hardwareLevel: 'System Bus',
  },
  {
    name: 'NVMe Solid State Drive Read',
    realTime: '150 µs',
    dilatedTime: '1.74 Days (42 Hours)',
    icon: '🧳',
    headline: 'Packing a suitcase for a full weekend trip',
    story: 'Even on the world\'s fastest PCIe SSD, detecting charge in NAND flash takes 150 microseconds. In our dilated world, the worker packs bags, flies to a ski lodge for the entire weekend, and returns Monday!',
    hardwareLevel: 'Flash Storage',
  },
  {
    name: 'Spinning Mechanical Hard Drive Seek',
    realTime: '10 ms',
    dilatedTime: '3.8 Months',
    icon: '💿',
    headline: 'Enrolling in an entire university semester',
    story: 'A mechanical arm must physically swing across platters spinning at 7,200 RPM. To the CPU, this takes nearly 4 months! The worker completes an entire fall semester and all final exams before the data arrives.',
    hardwareLevel: 'Magnetic Disk',
  },
  {
    name: 'Internet API Request Across the Ocean',
    realTime: '150 ms',
    dilatedTime: '4.75 Years',
    icon: '🎓',
    headline: 'From freshman orientation to college graduation!',
    story: 'Sending an HTTP ping from California to an EU datacenter takes 150 milliseconds. Dilated at 1ns = 1s, the CPU worker enters college as an 18-year-old freshman, completes all four years, receives their diploma, and tosses their cap before the response arrives!',
    hardwareLevel: 'Subsea Fiber Cable',
  },
];

export default function CpuPaperScale() {
  return (
    <div className="w-full space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Scale Comparisons &bull; Like Neal.fun / Paper
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          If 1 Nanosecond Was 1 Human Second
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Stretched <strong>1,000,000,000&times;</strong> to reveal why your CPU feels like it’s waiting decades every time you load a webpage.
        </p>
      </div>

      {/* The Big Bold Scale Steps */}
      <div className="space-y-12">
        {CPU_PAPER_STEPS.map((step, idx) => (
          <div
            key={step.name}
            className="group relative bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs transition-all hover:border-slate-300"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="font-mono text-sm font-bold text-slate-400">
                HIERARCHY TIER {idx + 1} OF {CPU_PAPER_STEPS.length} &bull; {step.hardwareLevel.toUpperCase()}
              </span>
              <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                Real Time: {step.realTime}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Massive Bold Headline: Dilated Time */}
              <div className="lg:col-span-5 space-y-2">
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                  {step.dilatedTime}
                </div>
                <div className="text-base sm:text-lg font-bold text-purple-700 flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span>{step.name}</span>
                </div>
              </div>

              {/* Punchy Narrative Comparison */}
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {step.headline}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {step.story}
                </p>

                <div className="pt-2 font-mono text-xs flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    <span>Real: <strong>{step.realTime}</strong></span>
                  </span>
                  <span>&rarr;</span>
                  <span className="text-purple-700 font-bold">
                    Dilated (1ns = 1s): <strong>{step.dilatedTime}</strong>
                  </span>
                </div>
              </div>
            </div>

            {idx < CPU_PAPER_STEPS.length - 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
