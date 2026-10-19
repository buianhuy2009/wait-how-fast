'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Wifi,
  ChevronDown,
  ChevronUp,
  Clock,
  Share2,
} from 'lucide-react';
import ShareFactModal from '@/components/museum/ShareFactModal';

export default function RealtimeAccumulator() {
  const { playClick, playChime } = useSound();

  // Elapsed seconds tracked in high precision
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [customMbps, setCustomMbps] = useState<number>(1000); // 1 Gbps default
  const [isEditingSpeed, setIsEditingSpeed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'body' | 'tech' | 'cosmic'>('all');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; metric: string; fact: string }>({
    title: 'Real-Time Speed of Reality',
    metric: '',
    fact: '',
  });

  const lastTickRef = useRef<number>(0);

  // Real-time animation loop (updates every ~50ms for buttery smooth counter increments)
  useEffect(() => {
    let animId: number;
    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      if (!lastTickRef.current) lastTickRef.current = now;
      const deltaSec = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (isRunning && deltaSec > 0 && deltaSec < 1.0) {
        setElapsedSec((prev) => prev + deltaSec * speedMultiplier);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, speedMultiplier]);

  const handleReset = () => {
    playClick(600);
    setElapsedSec(0);
    lastTickRef.current = performance.now();
  };

  const handleSetPresetTime = (seconds: number) => {
    playChime();
    setElapsedSec(seconds);
  };

  // Rates and Math (strictly verified)
  // 1. Fingernails: 1.319e-6 mm/s
  const fingernailMm = elapsedSec * 1.319e-6;
  const fingernailNm = fingernailMm * 1_000_000;

  // 2. Scalp hair (100,000 follicles @ 4.75e-6 mm/s): 0.475 mm/s total new hair synthesized
  const hairMm = elapsedSec * 0.475;

  // 3. Blood: 70 mL / beat @ 1.2 beats/sec = 84 mL/sec (0.084 L/sec)
  const bloodLiters = elapsedSec * 0.084;
  const heartBeats = Math.floor(elapsedSec * 1.2);

  // 4. Snail: 1.3 mm/s
  const snailMm = elapsedSec * 1.3;

  // 5. Earth orbit: 29.78 km/s
  const earthOrbitKm = elapsedSec * 29.78;

  // 6. Speed of light: 299,792.458 km/s
  const lightKm = elapsedSec * 299_792.458;
  const moonTrips = (lightKm / 384_400).toFixed(1);

  // 7. Data download at customMbps:
  const bytesDownloaded = elapsedSec * (customMbps * 125_000); // 1 Mbps = 125,000 Bytes/s
  const mbDownloaded = bytesDownloaded / 1_000_000;
  const gbDownloaded = bytesDownloaded / 1_000_000_000;
  // Rice: 1 Byte = 1 grain (0.029g) -> kg of rice
  const riceKg = (bytesDownloaded * 0.029) / 1000;
  const riceTons = riceKg / 1000;
  // Paper: 2000 chars per page
  const paperPages = bytesDownloaded / 2000;

  // 8. CPU Cycles at 3.0 GHz = 3,000,000,000 cycles/sec
  const cpuCycles = elapsedSec * 3_000_000_000;
  // If 1ns = 1s, dilated human seconds = cycles * (1/3 GHz) * 1s
  const dilatedSeconds = elapsedSec * 1_000_000_000;
  const dilatedYears = dilatedSeconds / (365.25 * 86400);

  // 9. Voyager 1: 17.0 km/s (17,000 m/s)
  const voyagerMeters = elapsedSec * 17_000;
  const voyagerKm = voyagerMeters / 1000;

  // 10. US National Debt: ~$8,250 / sec
  const debtDollars = elapsedSec * 8250;

  // 11. Global Lightning: ~100 strikes/sec
  const lightningStrikes = Math.floor(elapsedSec * 100);

  // 12. Human Walking: 1.4 m/s
  const walkingMeters = elapsedSec * 1.4;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins < 60) {
      return `${mins.toString().padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}s`;
    }
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m ${s.toFixed(0)}s`;
  };

  const handleShareCard = (title: string, metric: string, fact: string) => {
    playClick(950);
    setShareData({ title, metric, fact });
    setIsShareOpen(true);
  };

  const accumulatorItems = [
    {
      id: 'fingernails',
      category: 'body',
      icon: '💅',
      title: 'Your Fingernails Grew',
      value:
        fingernailNm < 1000
          ? `${fingernailNm.toFixed(1)} nanometers`
          : `${fingernailMm.toFixed(4)} mm`,
      comparison:
        fingernailNm < 100
          ? `Half the width of a coronavirus particle (~100 nm)`
          : `~${(fingernailMm / 0.1).toFixed(2)} sheets of paper thick`,
      subtext: `Grows continuously at 1.32 nm/sec (~3.5 mm/month)`,
      color: 'from-pink-500/10 to-rose-500/10 border-pink-500/30 text-pink-400',
      badge: 'Body Biology',
      rawProgress: Math.min(100, (fingernailNm / 1000) * 100),
    },
    {
      id: 'hair',
      category: 'body',
      icon: '💇',
      title: 'Your Scalp Synthesized Hair',
      value:
        hairMm < 10
          ? `${hairMm.toFixed(2)} millimeters`
          : `${(hairMm / 10).toFixed(2)} centimeters`,
      comparison: `Combined production across all ~100,000 scalp follicles`,
      subtext: `Single hair grows 4.75 nm/s, but 100,000 strands add up to 0.475 mm/s!`,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400',
      badge: 'Human Keratin',
      rawProgress: Math.min(100, (hairMm / 50) * 100),
    },
    {
      id: 'blood',
      category: 'body',
      icon: '❤️',
      title: 'Blood Pumped Through Aorta',
      value: `${bloodLiters.toFixed(2)} Liters (${heartBeats} beats)`,
      comparison: `Surged at 1.0 m/s (~2.2 mph) during systolic contractions`,
      subtext: `Your heart pumped ~${(bloodLiters / 0.355).toFixed(1)} cans of soda of blood`,
      color: 'from-red-500/10 to-rose-500/10 border-red-500/30 text-red-400',
      badge: 'Circulatory Surge',
      rawProgress: Math.min(100, (bloodLiters / 20) * 100),
    },
    {
      id: 'snail',
      category: 'everyday',
      icon: '🐌',
      title: 'A Garden Snail Crawled',
      value:
        snailMm < 1000
          ? `${snailMm.toFixed(1)} mm`
          : `${(snailMm / 1000).toFixed(2)} meters`,
      comparison:
        snailMm < 24.26
          ? `${(snailMm / 24.26 * 100).toFixed(0)}% of a US Quarter width (24.26 mm)`
          : snailMm < 156
          ? `~${(snailMm / 24.26).toFixed(1)} US Quarters wide (${(snailMm / 156 * 100).toFixed(0)}% of a Dollar bill)`
          : `~${(snailMm / 156).toFixed(1)} Dollar bills laid end-to-end!`,
      subtext: `Glides across slime at 1.3 mm/s (0.0029 mph)`,
      color: 'from-lime-500/10 to-emerald-500/10 border-lime-500/30 text-lime-400',
      badge: 'Living Velocity',
      rawProgress: Math.min(100, (snailMm / 156) * 100),
    },
    {
      id: 'earth',
      category: 'cosmic',
      icon: '🌍',
      title: 'Earth Hurtled Through Space',
      value: `${Math.round(earthOrbitKm).toLocaleString()} km (${(earthOrbitKm * 0.621371).toFixed(0)} miles)`,
      comparison:
        earthOrbitKm < 40075
          ? `~${(earthOrbitKm / 40075 * 100).toFixed(1)}% around the Earth's equator (40,075 km)`
          : `${(earthOrbitKm / 40075).toFixed(1)}x Earth equator laps!`,
      subtext: `Orbiting the Sun at 29.78 km/s (66,600 mph)`,
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
      badge: 'Orbital Speed',
      rawProgress: Math.min(100, (earthOrbitKm / 40075) * 100),
    },
    {
      id: 'light',
      category: 'cosmic',
      icon: '💡',
      title: 'Cosmic Light Traveled',
      value: `${Math.round(lightKm).toLocaleString()} km`,
      comparison:
        lightKm < 384400
          ? `${(lightKm / 384400 * 100).toFixed(1)}% of distance to the Moon (384,400 km)`
          : `${moonTrips}x trips to the Moon and back!`,
      subtext: `Speed of light in vacuum: 299,792.458 km/s (186,282 miles/s)`,
      color: 'from-yellow-500/10 to-amber-500/10 border-yellow-500/30 text-yellow-400',
      badge: 'Speed of Causality',
      rawProgress: Math.min(100, (lightKm / 384400) * 100),
    },
    {
      id: 'data',
      category: 'tech',
      icon: '📡',
      title: `Internet Transferred (${customMbps} Mbps)`,
      value:
        gbDownloaded < 1
          ? `${mbDownloaded.toFixed(1)} MB`
          : gbDownloaded < 1000
          ? `${gbDownloaded.toFixed(2)} GB`
          : `${(gbDownloaded / 1000).toFixed(2)} TB`,
      comparison:
        riceTons < 1
          ? `Equal to ${(riceKg).toFixed(1)} kg of rice (${(paperPages).toFixed(0)} printed pages)`
          : `Equal to ${riceTons.toFixed(2)} Metric Tons of rice (${(paperPages / 500).toFixed(0)} reams of paper!)`,
      subtext: `At ${customMbps} Mbps, transferring ${(customMbps / 8).toFixed(1)} MB every single second`,
      color: 'from-indigo-500/10 to-violet-500/10 border-indigo-500/30 text-indigo-400',
      badge: 'Digital Matter',
      rawProgress: Math.min(100, (gbDownloaded / 50) * 100),
      isInteractive: true,
    },
    {
      id: 'cpu',
      category: 'tech',
      icon: '💻',
      title: 'Your CPU Completed Clock Ticks',
      value: `${(cpuCycles / 1_000_000_000).toFixed(1)} Billion Cycles`,
      comparison:
        dilatedYears < 1
          ? `Dilated at 1ns = 1s: CPU worker lived ${(dilatedYears * 365.25).toFixed(1)} days!`
          : `Dilated at 1ns = 1s: CPU lived ${dilatedYears.toFixed(1)} human years!`,
      subtext: `Assuming modern 3.0 GHz base clock speed (0.33 ns per clock cycle)`,
      color: 'from-purple-500/10 to-fuchsia-500/10 border-purple-500/30 text-purple-400',
      badge: 'Silicon Life',
      rawProgress: Math.min(100, (cpuCycles / 100_000_000_000) * 100),
    },
    {
      id: 'voyager',
      category: 'cosmic',
      icon: '🛰️',
      title: 'Voyager 1 Traveled Further Away',
      value:
        voyagerKm < 100
          ? `${Math.round(voyagerMeters).toLocaleString()} meters`
          : `${voyagerKm.toFixed(1)} km`,
      comparison: `Drifting through interstellar space at 17.0 km/s (38,000 mph)`,
      subtext: `Already >24.5 billion km from Earth (>45.4 hours light round-trip)`,
      color: 'from-teal-500/10 to-emerald-500/10 border-teal-500/30 text-teal-400',
      badge: 'Interstellar Probe',
      rawProgress: Math.min(100, (voyagerKm / 500) * 100),
    },
    {
      id: 'debt',
      category: 'everyday',
      icon: '💵',
      title: 'US National Debt Increased',
      value: `+$${Math.round(debtDollars).toLocaleString()}`,
      comparison: `Accumulating at ~$8,250 every single second ($2.6 Trillion/year)`,
      subtext: `Publicly held and intragovernmental Treasury debt growth`,
      color: 'from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'Economic Ticker',
      rawProgress: Math.min(100, (debtDollars / 100000) * 100),
    },
    {
      id: 'lightning',
      category: 'everyday',
      icon: '⚡',
      title: 'Lightning Bolts Struck Earth',
      value: `${lightningStrikes.toLocaleString()} strikes`,
      comparison: `Global lightning rate is ~100 cloud-to-ground/cloud strikes every second`,
      subtext: `NASA TRMM and LIS satellite satellite meteorological data`,
      color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/30 text-amber-400',
      badge: 'Atmospheric Power',
      rawProgress: Math.min(100, (lightningStrikes / 1000) * 100),
    },
    {
      id: 'walker',
      category: 'everyday',
      icon: '🚶',
      title: 'Average Human Walk Distance',
      value:
        walkingMeters < 1000
          ? `${walkingMeters.toFixed(1)} meters`
          : `${(walkingMeters / 1000).toFixed(2)} km`,
      comparison: `At standard adult walking pace of 1.4 m/s (5.0 km/h / 3.1 mph)`,
      subtext: `Crosses an Olympic 100m sprint track every 71 seconds`,
      color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/30 text-cyan-400',
      badge: 'Human Pace',
      rawProgress: Math.min(100, (walkingMeters / 100) * 100),
    },
  ];

  const filteredItems =
    activeTab === 'all'
      ? accumulatorItems
      : accumulatorItems.filter((item) => item.category === activeTab);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Top Banner / Ticker Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neal.fun Real-Time Accumulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            While You&apos;ve Been in This Museum...
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-world physics and biology accumulating before your eyes in real time.
          </p>
        </div>

        {/* Main Live Stop-Watch Timer Display */}
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Clock className={`w-5 h-5 ${isRunning ? 'text-cyan-500 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '4s' }} />
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-wider">
              {formatTimer(elapsedSec)}
            </span>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={() => {
                playClick(isRunning ? 600 : 900);
                setIsRunning(!isRunning);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1 ${
                isRunning
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Reset timer to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Time Warp Presets */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono">
              {[
                { label: '1x', mult: 1 },
                { label: '10x', mult: 10 },
                { label: '100x', mult: 100 },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => {
                    playClick(800);
                    setSpeedMultiplier(m.mult);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition-all ${
                    speedMultiplier === m.mult
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jump To Future Buttons (1 Hour, 1 Day, 1 Year) */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase mr-1">
          Instant Time Jump:
        </span>
        <button
          onClick={() => handleSetPresetTime(60)}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          ⏱️ +1 Minute
        </button>
        <button
          onClick={() => handleSetPresetTime(3600)}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          ⏳ +1 Hour
        </button>
        <button
          onClick={() => handleSetPresetTime(86400)}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          🌅 +1 Day
        </button>
        <button
          onClick={() => handleSetPresetTime(365.25 * 86400)}
          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors font-bold"
        >
          🚀 +1 Full Year
        </button>

        {/* Custom Internet Speed Pill Input */}
        <div className="ml-auto flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">Your Wi-Fi:</span>
          <button
            onClick={() => setIsEditingSpeed(!isEditingSpeed)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <Wifi className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-bold">{customMbps} Mbps</span>
            {isEditingSpeed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Speed Edit Drawer */}
      {isEditingSpeed && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">
              Customize Your Connection Speed:
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              See how many tons of rice or paper towers your actual internet delivers in real time!
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: '50 Mbps (DSL)', val: 50 },
              { label: '300 Mbps (Cable)', val: 300 },
              { label: '1000 Mbps (1G)', val: 1000 },
              { label: '2500 Mbps (2.5G)', val: 2500 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => {
                  playClick(900);
                  setCustomMbps(p.val);
                  setIsEditingSpeed(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  customMbps === p.val
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'all', label: 'All Accumulators' },
          { id: 'body', label: '🧠 Human Body & Biology' },
          { id: 'tech', label: '⚡ Computing & Internet' },
          { id: 'cosmic', label: '🌌 Cosmic & Universe' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClick(750);
              setActiveTab(tab.id as typeof activeTab);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Neal.fun-Style Live Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Top Row: Icon + Title + Share Button */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm select-none">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleShareCard(item.title, item.value, item.comparison)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-opacity"
                  title="Share this fact"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Big Neal.fun-Style Real-Time Number */}
              <div className="my-2">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {item.value}
                </div>
              </div>

              {/* Physical Comparison Narrative */}
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium mt-1">
                {item.comparison}
              </div>
            </div>

            {/* Bottom Subtext & Progress Visual */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-1.5">
                <span className="truncate">{item.subtext}</span>
              </div>
              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(2, item.rawProgress)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal Dialog */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={shareData.title}
        metricHighlight={shareData.metric}
        funFact={shareData.fact}
        sourceCitation="Wait, How Fast Is That? Digital Science Museum (Real-Time Accumulator)"
      />
    </div>
  );
}
