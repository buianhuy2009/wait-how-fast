'use client';

import React from 'react';
import Link from 'next/link';
import { useSound } from '@/context/SoundContext';
import RealtimeAccumulator from '@/components/museum/RealtimeAccumulator';
import FamiliarScaleSelector from '@/components/calibrator/FamiliarScaleSelector';
import { MUSEUM_WINGS } from '@/components/museum/MuseumRoomNav';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Compass,
} from 'lucide-react';

export default function MuseumLobby() {
  const { playClick } = useSound();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Welcome Arch */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center overflow-hidden">
        {/* Ambient Subtle Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-cyan-500/10 to-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Interactive Digital Science Museum of Speed, Scale & Reality</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
            Wait, <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">How Fast</span> Is That?
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Experience the true velocities of our universe: watch objects move at their <strong>literal real-world physical speed</strong> on your screen, feel speed-of-light delays from human nerves to deep interstellar space, and visualize 1 Gigabit as 3.6 metric tons of rice per second.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/hall/speed"
              onClick={() => playClick(900)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-500/20 transition-all active:scale-95 hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              <span>Begin Museum Tour (Wing 01)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/all"
              onClick={() => playClick(850)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Grand Walkthrough (All Wings)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship Centerpiece: Neal.fun Real-Time Speed & Scale Accumulator */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <RealtimeAccumulator />
      </section>

      {/* Museum Walkthrough Floor Plan: The 7 Exhibition Wings */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Museum Directory & Walkthrough</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore the 7 Exhibition Wings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Walk room-to-room sequentially or jump directly into any hall below.
            </p>
          </div>

          <Link
            href="/all"
            onClick={() => playClick(800)}
            className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <span>View All 7 Wings on Single Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MUSEUM_WINGS.map((wing) => {
            return (
              <Link
                key={wing.slug}
                href={`/hall/${wing.slug}`}
                onClick={() => playClick(850)}
                className="group relative rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Top Bar: Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-300 dark:text-slate-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {wing.number}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      Walk In &rarr;
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform select-none">
                      {wing.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {wing.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{wing.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {wing.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 font-semibold">ENTER WING</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Grand Walkthrough All Wings Card */}
          <Link
            href="/all"
            onClick={() => playClick(850)}
            className="group relative rounded-3xl p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between border border-indigo-700/50"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-indigo-400">00</span>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 border border-indigo-400/40 text-indigo-200">
                  Full Tour
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Grand Walkthrough
                  </h3>
                  <p className="text-xs text-indigo-200">All 7 Wings in Sequence</p>
                </div>
              </div>

              <p className="text-xs text-indigo-100/90 leading-relaxed mt-2">
                Continuous stroll through every room—from geological plate tectonics, through human heart surges and subsea fiber, to the CPU dilation desk and cosmic velocities.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-indigo-800/60 flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-300 font-bold flex items-center gap-1">
                Enter All Wings <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-indigo-400 font-bold">All 7 Galleries</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Familiar Everyday Objects Scale & Calibration */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <FamiliarScaleSelector />
      </section>

      {/* Curator's Top 4 Mind-Blowing Facts */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mb-12">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Curator&apos;s Highlights: 4 Facts That Break Human Intuition
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-2xl">🍚</span>
              <h4 className="font-bold text-slate-900 dark:text-white">Your Wi-Fi Dumps 3.6 Tons of Rice/sec</h4>
              <p className="text-slate-500 dark:text-slate-400">
                If 1 Byte was 1 grain of rice, a 1 Gbps internet connection delivers the mass of two full pickup trucks every single second!
              </p>
              <Link href="/hall/data" className="text-indigo-600 dark:text-indigo-400 font-mono block pt-1 hover:underline font-bold">
                Explore in Wing 4 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-2xl">💡</span>
              <h4 className="font-bold text-slate-900 dark:text-white">Light in Glass is 31% Slower Than Space</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Because optical fiber is made of solid silica glass (n ≈ 1.468), light slows down to 204,190 km/s. In 1 ns, it only travels 8 inches!
              </p>
              <Link href="/hall/latency" className="text-indigo-600 dark:text-indigo-400 font-mono block pt-1 hover:underline font-bold">
                Explore in Wing 3 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-2xl">⚡</span>
              <h4 className="font-bold text-slate-900 dark:text-white">Grace Hopper&apos;s 11.8-Inch Nanosecond</h4>
              <p className="text-slate-500 dark:text-slate-400">
                In 1 billionth of a second, cosmic light travels 11.8 inches—almost exactly the width of your laptop screen or two dollar bills!
              </p>
              <Link href="/hall/speed" className="text-indigo-600 dark:text-indigo-400 font-mono block pt-1 hover:underline font-bold">
                Explore in Wing 1 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-2xl">☕</span>
              <h4 className="font-bold text-slate-900 dark:text-white">To Your CPU, RAM is a Microwave Break</h4>
              <p className="text-slate-500 dark:text-slate-400">
                If 1 nanosecond was 1 second, fetching data from DDR5 RAM takes 1 min 40 sec, while reading an SSD is a weekend ski trip!
              </p>
              <Link href="/hall/cpu" className="text-indigo-600 dark:text-indigo-400 font-mono block pt-1 hover:underline font-bold">
                Explore in Wing 5 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
