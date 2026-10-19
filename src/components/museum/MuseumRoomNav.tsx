'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSound } from '@/context/SoundContext';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Gauge,
  Heart,
  Radio,
  HardDrive,
  Cpu,
  Activity,
  Sparkles,
  Map,
  X,
  Layers,
} from 'lucide-react';

export interface MuseumWing {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  emoji: string;
  color: string;
  accentBg: string;
  description: string;
}

export const MUSEUM_WINGS: MuseumWing[] = [
  {
    slug: 'speed',
    number: 'Wing 01',
    title: 'The Speed Track',
    subtitle: 'Macroscopic Speeds in 1:1 Scale',
    icon: Gauge,
    emoji: '🏎️',
    color: 'text-emerald-500',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    description: 'Fingernail growth, tectonic plate drift, sprinting snails, and Grace Hopper\'s cosmic light in 1ns.',
  },
  {
    slug: 'biology',
    number: 'Wing 02',
    title: 'The Speed of You',
    subtitle: 'Human Biological Velocities & Reflexes',
    icon: Heart,
    emoji: '🧬',
    color: 'text-rose-500',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    description: 'Systolic aorta blood surge, dull C-fiber pain vs touch, sneeze velocity, and neural reflex test.',
  },
  {
    slug: 'latency',
    number: 'Wing 03',
    title: 'The Latency Arcade',
    subtitle: 'Speed-of-Light Lag Across Earth & Space',
    icon: Radio,
    emoji: '📡',
    color: 'text-cyan-500',
    accentBg: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800',
    description: 'Undersea optical glass tax, Apollo lunar rover delay, and deep interstellar Voyager 1 ping.',
  },
  {
    slug: 'data',
    number: 'Wing 04',
    title: 'The Data Flood',
    subtitle: 'Bits vs. Bytes as Physical Matter',
    icon: HardDrive,
    emoji: '🌊',
    color: 'text-indigo-500',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    description: '1 Gbps internet isn\'t 1 GB/s. Visualize data as grains of rice, paper towers, and LEGO bricks.',
  },
  {
    slug: 'cpu',
    number: 'Wing 05',
    title: 'Inside Your CPU',
    subtitle: 'Time Dilation: 1 Nanosecond = 1 Human Second',
    icon: Cpu,
    emoji: '⏳',
    color: 'text-purple-500',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    description: 'Clock tick finger snap, RAM microwave tea break, SSD ski vacation, and transatlantic graduation.',
  },
  {
    slug: 'framerate',
    number: 'Wing 06',
    title: 'The Refresh & Vision Vault',
    subtitle: 'Neuroscience of Motion & Display Hz',
    icon: Activity,
    emoji: '👁️',
    color: 'text-amber-500',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    description: 'Native display Hz detector, 15 vs 30 vs 60 vs 120 FPS lanes, and why 24 FPS works in cinema.',
  },
  {
    slug: 'cosmic',
    number: 'Wing 07',
    title: 'The Cosmic Vault',
    subtitle: 'Planetary & Interstellar Velocities',
    icon: Sparkles,
    emoji: '🌌',
    color: 'text-violet-500',
    accentBg: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
    description: 'Earth orbiting the Sun at 29.8 km/s, Voyager 1 in the interstellar void, and light in vacuum.',
  },
];

interface MuseumRoomNavProps {
  currentSlug: string;
}

export default function MuseumRoomNav({ currentSlug }: MuseumRoomNavProps) {
  const { playClick, playChime } = useSound();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const currentIndex = MUSEUM_WINGS.findIndex((w) => w.slug === currentSlug);
  const currentWing = MUSEUM_WINGS[currentIndex] || MUSEUM_WINGS[0];

  const prevWing = currentIndex > 0 ? MUSEUM_WINGS[currentIndex - 1] : null;
  const nextWing = currentIndex < MUSEUM_WINGS.length - 1 ? MUSEUM_WINGS[currentIndex + 1] : null;

  return (
    <>
      {/* Top Walkthrough Navigation Banner */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 select-none">
            {currentWing.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentWing.number} of {MUSEUM_WINGS.length.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Museum Walkthrough Tour
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentWing.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentWing.subtitle}</p>
          </div>
        </div>

        {/* Room Steps Progress Indicators & Map Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Visual Step Dots */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {MUSEUM_WINGS.map((wing, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <Link
                  key={wing.slug}
                  href={`/hall/${wing.slug}`}
                  onClick={() => playClick(800)}
                  title={`${wing.number}: ${wing.title}`}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm scale-105'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </Link>
              );
            })}
          </div>

          {/* Museum Map Button */}
          <button
            onClick={() => {
              playClick(900);
              setIsMapOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            <Map className="w-4 h-4 text-indigo-500" />
            <span>Museum Map</span>
          </button>

          {/* Quick Prev / Next Buttons */}
          <div className="flex items-center gap-1.5">
            {prevWing && (
              <Link
                href={`/hall/${prevWing.slug}`}
                onClick={() => playClick(750)}
                className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                title={`Previous: ${prevWing.title}`}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}

            {nextWing ? (
              <Link
                href={`/hall/${nextWing.slug}`}
                onClick={() => playChime()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <span>Next Wing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/"
                onClick={() => playChime()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
              >
                <span>Museum Lobby</span>
                <Compass className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Museum Map Modal Directory */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsMapOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-2">
                <Map className="w-3.5 h-3.5" />
                <span>Museum Directory</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Floor Plan: All 7 Exhibition Wings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Walk through sequentially or teleport straight into any exhibition room.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {MUSEUM_WINGS.map((wing) => {
                const isCurrent = wing.slug === currentSlug;
                return (
                  <Link
                    key={wing.slug}
                    href={`/hall/${wing.slug}`}
                    onClick={() => {
                      playClick(850);
                      setIsMapOpen(false);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      isCurrent
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm select-none">
                      {wing.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {wing.number}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                            You Are Here
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {wing.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {wing.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <Link
                href="/all"
                onClick={() => setIsMapOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View All 7 Exhibits on One Single Page</span>
              </Link>
              <button
                onClick={() => setIsMapOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MuseumBottomDoors({ currentSlug }: { currentSlug: string }) {
  const { playClick, playChime } = useSound();
  const currentIndex = MUSEUM_WINGS.findIndex((w) => w.slug === currentSlug);
  const prevWing = currentIndex > 0 ? MUSEUM_WINGS[currentIndex - 1] : null;
  const nextWing = currentIndex < MUSEUM_WINGS.length - 1 ? MUSEUM_WINGS[currentIndex + 1] : null;

  return (
    <div className="w-full mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      {prevWing ? (
        <Link
          href={`/hall/${prevWing.slug}`}
          onClick={() => playClick(800)}
          className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all group"
        >
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Previous Wing
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {prevWing.emoji} {prevWing.title}
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/"
          className="w-full sm:w-auto flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <Compass className="w-4 h-4" />
          <span>Return to Museum Lobby</span>
        </Link>
      )}

      {nextWing ? (
        <Link
          href={`/hall/${nextWing.slug}`}
          onClick={() => playChime()}
          className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all group"
        >
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200 block">
              Step to Next Room
            </span>
            <span className="text-sm font-black">
              {nextWing.title} {nextWing.emoji}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-indigo-500 text-white group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      ) : (
        <Link
          href="/"
          onClick={() => playChime()}
          className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
        >
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-200 block">
              Tour Completed!
            </span>
            <span className="text-sm font-black">Back to Museum Lobby 🏛️</span>
          </div>
          <Compass className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
