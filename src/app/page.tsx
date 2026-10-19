'use client';

import React from 'react';
import Link from 'next/link';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import CardCalibrator from '@/components/calibrator/CardCalibrator';
import {
  Gauge,
  Radio,
  HardDrive,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export default function MuseumLobby() {
  const { isCalibrated } = useCalibration();
  const { playClick } = useSound();

  const halls = [
    {
      id: 'speed',
      num: '01',
      title: 'True-Scale Speed Track',
      subtitle: '1:1 Physical Inches Per Second',
      description:
        'Objects crawl and race across your monitor at their literal real-world speed. Tectonic continental drift, fingernail growth, snail sprints, and Grace Hopper\'s cosmic light in 1 nanosecond.',
      icon: Gauge,
      accent: 'emerald',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      badge: 'Calibrated 1:1 Physics',
      href: '/hall/speed',
      stat: '0.79 nm/s to 300,000 km/s',
    },
    {
      id: 'latency',
      num: '02',
      title: 'The Latency & Ping Arcade',
      subtitle: 'Feel the Lag from Nerves to Voyager 1',
      description:
        'Type with undersea Atlantic cable delays, steer an Apollo lunar rover with a 2.56-second round trip, and play ping-pong over 35,786 km satellite orbits.',
      icon: Radio,
      accent: 'cyan',
      bgGlow: 'from-cyan-500/10 to-transparent',
      borderColor: 'border-cyan-500/30',
      badge: 'Interactive Sandboxes',
      href: '/hall/latency',
      stat: '0.005 ms to 45.4 Hours',
    },
    {
      id: 'data',
      num: '03',
      title: 'The Data Flood',
      subtitle: 'Bits vs. Bytes as Physical Matter',
      description:
        'Understand why 1 Gbps internet is NOT 1 GB/s! See what happens when 1 Byte becomes 1 grain of rice, 1 sheet of paper, or 1 millimeter of distance.',
      icon: HardDrive,
      accent: 'indigo',
      bgGlow: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/30',
      badge: 'Matter Scaling Engine',
      href: '/hall/data',
      stat: '1 Byte to 1 Petabyte',
    },
    {
      id: 'cpu',
      num: '04',
      title: 'CPU Time Dilation Chamber',
      subtitle: 'If 1 Nanosecond = 1 Human Second',
      description:
        'Slowing computer time by 1,000,000,000x! Watch an office CPU worker snap their fingers for a clock tick, microwave a snack for RAM, and take a weekend ski trip for an SSD.',
      icon: Cpu,
      accent: 'purple',
      bgGlow: 'from-purple-500/10 to-transparent',
      borderColor: 'border-purple-500/30',
      badge: '1ns = 1s Simulation',
      href: '/hall/cpu',
      stat: '0.33 ns to 4.75 Years',
    },
    {
      id: 'framerate',
      num: '05',
      title: 'Frame Rate & Persistence Vault',
      subtitle: 'The Neuroscience of Display Refresh',
      description:
        'Auto-detect your monitor\'s native Hz. Compare 15 vs 30 vs 60 vs 120 FPS lanes side-by-side and discover why 24 FPS works in cinema but feels unplayable in video games.',
      icon: Activity,
      accent: 'amber',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/30',
      badge: 'Hardware Hz Detector',
      href: '/hall/framerate',
      stat: '15 Hz to 240+ Hz',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Welcome Arch */}
      <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center flex flex-col items-center">
        {/* Ambient Cosmic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-cyan-500/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-700/80 text-cyan-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Digital Museum of Speed, Latency & Scale</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Wait, <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">How Fast</span> Is That?
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            A digital science museum that <strong>calibrates to your physical screen inches</strong>:
            watch objects move across your desk at their literal real-world speed, feel ping delays from human nerves to interstellar space, and visualize 1 Gigabit as 3.6 metric tons of rice per second.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/all"
              onClick={() => playClick(900)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-transform hover:scale-105"
            >
              <Layers className="w-4 h-4" />
              <span>Enter Grand Walkthrough (All 5 Halls)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#ticket-booth"
              onClick={() => playClick(700)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
            >
              <span>🎟️ Calibrate Screen First</span>
              {isCalibrated && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </a>
          </div>
        </div>
      </section>

      {/* Ticket Booth: Screen Calibration Section */}
      <section id="ticket-booth" className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            STEP 0 &bull; THE ADMISSION TICKET BOOTH
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Calibrate to Your Monitor&apos;s Real Inches
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browser pixels are arbitrary. By matching an ISO ID-1 card (school ID or credit card), our physics engine renders true 1:1 real-world millimeters.
          </p>
        </div>

        <CardCalibrator />
      </section>

      {/* Museum Floor Plan Section */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              MUSEUM FLOOR PLAN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Explore the 5 Exhibition Halls
            </h2>
          </div>
          <Link
            href="/all"
            onClick={() => playClick(800)}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Exhibits on Single Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => {
            const Icon = hall.icon;
            return (
              <Link
                key={hall.id}
                href={hall.href}
                onClick={() => playClick(850)}
                className={`group relative rounded-3xl p-6 bg-slate-900/80 border ${hall.borderColor} hover:border-slate-500 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle hall top glow */}
                <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${hall.bgGlow} pointer-events-none`} />

                <div>
                  {/* Top Bar: Number & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-slate-400 transition-colors">
                      {hall.num}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {hall.badge}
                    </span>
                  </div>

                  {/* Hall Icon & Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-white shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {hall.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">{hall.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mt-3">
                    {hall.description}
                  </p>
                </div>

                {/* Footer Metric */}
                <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">DYNAMIC RANGE:</span>
                  <strong className="text-cyan-400">{hall.stat}</strong>
                </div>
              </Link>
            );
          })}

          {/* Grand Walkthrough All Halls Card */}
          <Link
            href="/all"
            onClick={() => playClick(850)}
            className="group relative rounded-3xl p-6 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-cyan-950/40 border border-indigo-500/40 hover:border-indigo-400 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black font-mono text-indigo-400">00</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                  Full Experience
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    Grand Walkthrough
                  </h3>
                  <p className="text-xs font-mono text-indigo-300">Continuous Exhibit Stroll</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mt-3">
                Experience every exhibit in sequence—from geological plate tectonics, through undersea fiber typing and the Lunar Rover sandbox, to the CPU dilation desk and frame rate comparator.
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-indigo-500/20 flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-400 font-bold flex items-center gap-1">
                Enter All Halls <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-slate-400">All 5 Galleries</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Curator's Top 4 Mind-Blowing Facts */}
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Curator&apos;s Highlights: 4 Facts That Break Human Intuition
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-lg">🍚</span>
              <h4 className="font-bold text-white">Your Wi-Fi Dumps 3.6 Tons of Rice/sec</h4>
              <p className="text-slate-400">
                If 1 Byte was 1 grain of rice, a 1 Gbps internet connection delivers the mass of two full pickup trucks every single second!
              </p>
              <Link href="/hall/data" className="text-cyan-400 font-mono block pt-1 hover:underline">
                Explore in Hall 3 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-lg">💡</span>
              <h4 className="font-bold text-white">Light in Glass is 31% Slower Than Space</h4>
              <p className="text-slate-400">
                Light in glass fiber travels at 204,000 km/s. In 1 nanosecond, light in fiber optics only travels 8 inches (20 cm)!
              </p>
              <Link href="/hall/latency" className="text-cyan-400 font-mono block pt-1 hover:underline">
                Explore in Hall 2 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-lg">⚡</span>
              <h4 className="font-bold text-white">Grace Hopper&apos;s 11.8-Inch Nanosecond</h4>
              <p className="text-slate-400">
                In 1 billionth of a second, light travels 11.8 inches—virtually the exact width of your laptop screen.
              </p>
              <Link href="/hall/speed" className="text-cyan-400 font-mono block pt-1 hover:underline">
                Explore in Hall 1 &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-lg">☕</span>
              <h4 className="font-bold text-white">To Your CPU, RAM is a Microwave Break</h4>
              <p className="text-slate-400">
                If 1 nanosecond was 1 second, fetching data from RAM takes 1 min 40 sec, while reading an SSD takes an entire weekend trip!
              </p>
              <Link href="/hall/cpu" className="text-cyan-400 font-mono block pt-1 hover:underline">
                Explore in Hall 4 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
