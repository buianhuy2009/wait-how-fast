'use client';

import React, { useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { ArrowDown } from 'lucide-react';

interface DataStep {
  size: string;
  bytes: number;
  quantityTitle: string;
  analogyHeadline: string;
  icon: string;
  description: string;
  comparisonFact: string;
  techExample: string;
}

const DATA_PAPER_STEPS: DataStep[] = [
  {
    size: '1 Byte',
    bytes: 1,
    quantityTitle: '1 Grain of Rice',
    analogyHeadline: 'A single grain on your fingertip',
    icon: '🍚',
    description: 'Weighs 0.029 grams. You could balance it on the tip of your pinky finger without feeling any weight.',
    comparisonFact: 'Fits easily on the head of a pushpin.',
    techExample: 'A single typed letter like "A" in a text file.',
  },
  {
    size: '1 Kilobyte (KB)',
    bytes: 1_000,
    quantityTitle: '1,000 Grains • 29 grams',
    analogyHeadline: 'A spoonful of rice in your palm',
    icon: '🥄',
    description: 'About 2 tablespoons of rice. Fits comfortably in your cupped hand, weighing about as much as a single slice of bread.',
    comparisonFact: 'A snack bowl portion of uncooked grains.',
    techExample: 'A short paragraph of text or a plain text email.',
  },
  {
    size: '1 Megabyte (MB)',
    bytes: 1_000_000,
    quantityTitle: '1 Million Grains • 29 kg (64 lbs)',
    analogyHeadline: 'A restaurant burlap sack of rice',
    icon: '🐕',
    description: 'A heavy commercial sack of rice. Weighs as much as a full-grown Golden Retriever—requires two hands and bent knees to lift!',
    comparisonFact: 'Heavier than an average 8-year-old child.',
    techExample: 'A 1-minute MP3 song or high-resolution smartphone photo.',
  },
  {
    size: '1 Gigabyte (GB)',
    bytes: 1_000_000_000,
    quantityTitle: '1 Billion Grains • 29 Metric Tons',
    analogyHeadline: 'A 40-foot freight shipping container',
    icon: '📦',
    description: 'Fills a full-sized 40-foot intermodal steel shipping container to the ceiling. Heavy as two city buses—needs an industrial crane to lift!',
    comparisonFact: 'Enough rice to feed a person three meals a day for 100 years.',
    techExample: 'A 1-hour high-definition 1080p video stream.',
  },
  {
    size: '1 Terabyte (TB)',
    bytes: 1_000_000_000_000,
    quantityTitle: '1 Trillion Grains • 29,000 Metric Tons',
    analogyHeadline: 'An ocean cargo container ship',
    icon: '🚢',
    description: 'A massive 400-meter ocean cargo freighter carrying 1,000 shipping containers packed with raw rice cutting across the Pacific.',
    comparisonFact: 'Equal to a fleet of 20,000 pickup trucks bumper-to-bumper.',
    techExample: 'A modern computer SSD hard drive holding an entire library.',
  },
  {
    size: '1 Petabyte (PB)',
    bytes: 1_000_000_000_000_000,
    quantityTitle: '1 Quadrillion Grains • 29 Million Metric Tons',
    analogyHeadline: 'A mountain of rice burying Manhattan',
    icon: '🏔️',
    description: 'A colossal mountain of rice taller than Mount Everest. If dumped over New York City, it would bury all of Manhattan knee-deep in rice!',
    comparisonFact: 'More than half the entire annual rice harvest of the United States.',
    techExample: 'All photos uploaded to Facebook or 500 billion pages of printed text.',
  },
];

export default function DataPaperScale() {
  const { playClick } = useSound();
  const [userMbps, setUserMbps] = useState<number>(1000); // 1 Gbps default

  // Math: 1 Byte = 0.029g of rice
  // 1 Mbps = 125,000 Bytes/s
  const bytesPerSec = userMbps * 125_000;
  const kgPerSec = (bytesPerSec * 0.029) / 1000;
  const tonsPerSec = kgPerSec / 1000;
  const pickupTrucksPerSec = tonsPerSec / 1.5;

  return (
    <div className="w-full space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Scale Comparisons &bull; Like Neal.fun / Paper
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          What If 1 Byte Was 1 Grain of Rice?
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Data is invisible. But when every single Byte becomes a physical grain of rice (0.029 grams), the numbers reveal their true physical weight.
        </p>
      </div>

      {/* The Big Bold Scale Steps (Neal.fun / Paper style: large, clean, generous breathing room) */}
      <div className="space-y-12">
        {DATA_PAPER_STEPS.map((step, idx) => (
          <div
            key={step.size}
            className="relative bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 shadow-xs"
          >
            {/* Step Number */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-8">
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step {idx + 1} of {DATA_PAPER_STEPS.length}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {step.bytes.toLocaleString()} Bytes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Massive Bold Size & Icon */}
              <div className="lg:col-span-5 space-y-2">
                <div className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
                  {step.size}
                </div>
                <div className="text-lg sm:text-xl font-bold text-sky-800 flex items-center gap-2">
                  <span className="text-3xl select-none">{step.icon}</span>
                  <span>{step.quantityTitle}</span>
                </div>
              </div>

              {/* Clean Comparison Copy */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {step.analogyHeadline}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 font-mono text-xs text-slate-600">
                  <span className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <strong>Physical:</strong> {step.comparisonFact}
                  </span>
                  <span className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <strong>Digital:</strong> {step.techExample}
                  </span>
                </div>
              </div>
            </div>

            {idx < DATA_PAPER_STEPS.length - 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* The Wi-Fi Rice Converter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Interactive Converter
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How Much Rice Pours Through Your Wi-Fi?
          </h3>
          <p className="text-sm text-slate-600">
            Because 1 Byte = 8 bits, 1 Gbps internet is 125 MB/s. Drag to see your plan:
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700">
            <span>PLAN SPEED:</span>
            <span className="text-base text-sky-800">
              {userMbps >= 1000 ? `${(userMbps / 1000).toFixed(1)} Gbps` : `${userMbps} Mbps`}
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="3000"
            step="50"
            value={userMbps}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setUserMbps(val);
              playClick(750 + (val / 3000) * 200);
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-sky-800"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>50 Mbps</span>
            <span>300 Mbps (Average)</span>
            <span>1 Gbps (Gigabit)</span>
            <span>3 Gbps</span>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2 mt-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Pouring Through Your Router Every Second:
            </div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
              {tonsPerSec < 1
                ? `${kgPerSec.toFixed(1)} kg of rice / sec`
                : `${tonsPerSec.toFixed(2)} Metric Tons / sec`}
            </div>
            <p className="text-sm text-slate-600 pt-1 font-medium">
              {pickupTrucksPerSec < 1
                ? `That’s ~${(kgPerSec / 25).toFixed(1)} standard 25kg sacks of rice pouring into your room every single second!`
                : `That’s equal to ~${pickupTrucksPerSec.toFixed(1)} pickup trucks full of raw rice dumping onto your floor every second! 🚚`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
