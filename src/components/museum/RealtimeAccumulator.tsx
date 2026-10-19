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
  User,
} from 'lucide-react';
import ShareFactModal from '@/components/museum/ShareFactModal';

export default function RealtimeAccumulator() {
  const { playClick, playChime } = useSound();

  // Elapsed seconds tracked in high precision
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [customMbps, setCustomMbps] = useState<number>(1000); // 1 Gbps default
  const [customMbpsInput, setCustomMbpsInput] = useState<string>('1000');
  const [isEditingSpeed, setIsEditingSpeed] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'body' | 'tech' | 'cosmic'>('all');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{ title: string; metric: string; fact: string }>({
    title: 'Real-Time Speed of Reality',
    metric: '',
    fact: '',
  });

  // User's Personal Speed Comparator
  const [personalSpeedType, setPersonalSpeedType] = useState<'walk' | 'bike' | 'run' | 'type'>('walk');
  const [personalSpeedVal, setPersonalSpeedVal] = useState<number>(3.1); // mph default for walking

  const lastTickRef = useRef<number>(0);

  // Real-time animation loop
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
  // 1. Fingernails: 1.319e-6 mm/s = 1.319 nm/s
  const fingernailMm = elapsedSec * 1.319e-6;
  const fingernailNm = fingernailMm * 1_000_000;

  // 2. Scalp hair (100,000 follicles @ 4.75e-6 mm/s): 0.475 mm/s total new hair synthesized
  const hairMm = elapsedSec * 0.475;

  // 3. Blood: 70 mL / beat @ 1.2 beats/sec = 84 mL/sec (0.084 L/sec)
  const bloodLiters = elapsedSec * 0.084;
  const heartBeats = Math.floor(elapsedSec * 1.2);
  const sodaCansFilled = bloodLiters / 0.355; // 355mL per can

  // 4. Snail: 1.3 mm/s
  const snailMm = elapsedSec * 1.3;

  // 5. Earth orbit: 29.78 km/s
  const earthOrbitKm = elapsedSec * 29.78;

  // 6. Speed of light: 299,792.458 km/s
  const lightKm = elapsedSec * 299_792.458;
  const moonDistanceKm = 384_400;
  const moonTrips = (lightKm / moonDistanceKm).toFixed(1);

  // 7. Data download at customMbps:
  const bytesDownloaded = elapsedSec * (customMbps * 125_000); // 1 Mbps = 125,000 Bytes/s
  const mbDownloaded = bytesDownloaded / 1_000_000;
  const gbDownloaded = bytesDownloaded / 1_000_000_000;
  // Rice: 1 Byte = 1 grain (0.029g) -> kg of rice
  const riceGrains = bytesDownloaded;
  const riceKg = (bytesDownloaded * 0.029) / 1000;
  const riceTons = riceKg / 1000;
  const riceTruckloads = riceTons / 1.5; // 1.5 tons per pickup truck
  const paperPages = bytesDownloaded / 2000;

  // 8. CPU Cycles at 3.0 GHz = 3,000,000,000 cycles/sec
  const cpuCycles = elapsedSec * 3_000_000_000;
  const dilatedSeconds = elapsedSec * 1_000_000_000; // 1ns = 1s
  const dilatedYears = dilatedSeconds / (365.25 * 86400);

  // 9. Voyager 1: 17.0 km/s (17,000 m/s)
  const voyagerMeters = elapsedSec * 17_000;
  const voyagerKm = voyagerMeters / 1000;

  // 10. US National Debt: ~$8,250 / sec ($100 bills piled!)
  const debtDollars = elapsedSec * 8250;
  const hundredDollarBills = Math.floor(debtDollars / 100);
  const billStackHeightMm = hundredDollarBills * 0.109; // 0.109 mm per paper bill

  // 11. Global Lightning: ~100 strikes/sec
  const lightningStrikes = Math.floor(elapsedSec * 100);

  // 12. Personal User Velocity
  // 1 mph = 0.44704 m/s
  const personalMps = personalSpeedType === 'type'
    ? (personalSpeedVal * 5) / 60 // characters per sec
    : personalSpeedVal * 0.44704;
  const personalDistanceMeters = personalSpeedType === 'type'
    ? elapsedSec * personalMps // characters typed
    : elapsedSec * personalMps;

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

  const handleCustomSpeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customMbpsInput);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100000) {
      playClick(900);
      setCustomMbps(parsed);
      setIsEditingSpeed(false);
    }
  };

  return (
    <div className="w-full bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Top Banner / Ticker Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Neal.fun Real-Time Accumulator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            While You&apos;ve Been in This Museum...
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Physical reality, biology, and data piling up before your eyes in literal real time.
          </p>
        </div>

        {/* Main Live Stop-Watch Timer Display */}
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-2xl border-2 border-slate-200">
            <Clock className={`w-5 h-5 ${isRunning ? 'text-indigo-600 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '4s' }} />
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
              {formatTimer(elapsedSec)}
            </span>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={() => {
                playClick(isRunning ? 600 : 900);
                setIsRunning(!isRunning);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs ${
                isRunning
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Reset timer to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Time Warp Presets */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs font-mono">
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
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    speedMultiplier === m.mult
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Jump To Future Buttons (1 Min, 1 Hour, 1 Day, 1 Year) */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mr-1">
          Instant Time Jump:
        </span>
        <button
          onClick={() => handleSetPresetTime(60)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
        >
          ⏱️ +1 Minute
        </button>
        <button
          onClick={() => handleSetPresetTime(3600)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
        >
          ⏳ +1 Hour
        </button>
        <button
          onClick={() => handleSetPresetTime(86400)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
        >
          🌅 +1 Day
        </button>
        <button
          onClick={() => handleSetPresetTime(365.25 * 86400)}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs"
        >
          🚀 +1 Full Year
        </button>

        {/* Custom Internet Speed Pill Input */}
        <div className="ml-auto flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 hidden sm:inline font-bold">Your Wi-Fi:</span>
          <button
            onClick={() => setIsEditingSpeed(!isEditingSpeed)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs transition-all"
          >
            <Wifi className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold">{customMbps} Mbps</span>
            {isEditingSpeed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Speed Edit Drawer */}
      {isEditingSpeed && (
        <div className="mb-6 p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono animate-fade-in">
          <div className="space-y-1">
            <span className="font-black text-indigo-950 text-sm">
              Customize Your Connection Speed:
            </span>
            <p className="text-slate-600 text-xs">
              Type your literal plan speed to watch your internet pour as metric tons of rice in real time!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleCustomSpeedSubmit} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="50000"
                value={customMbpsInput}
                onChange={(e) => setCustomMbpsInput(e.target.value)}
                placeholder="e.g. 500"
                className="w-24 px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-indigo-500 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Set Mbps
              </button>
            </form>

            <div className="h-5 w-px bg-indigo-200 hidden sm:block" />

            {[
              { label: '50M', val: 50 },
              { label: '300M', val: 300 },
              { label: '1 Gbps', val: 1000 },
              { label: '2.5G', val: 2500 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => {
                  playClick(900);
                  setCustomMbps(p.val);
                  setCustomMbpsInput(p.val.toString());
                  setIsEditingSpeed(false);
                }}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  customMbps === p.val
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3 overflow-x-auto">
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
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* THE 12 FLAGSHIP NEAL.FUN REAL-TIME ACCUMULATOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: US National Debt (LITERAL NEAL.FUN PRINTING-MONEY PHYSICAL BILL STACK!) */}
        {(activeTab === 'all' || activeTab === 'tech') && (
          <div className="group rounded-3xl p-6 bg-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs select-none">
                    💵
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-emerald-800 uppercase font-mono tracking-wider">
                      US National Debt Printed
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      neal.fun/printing-money
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('US National Debt', `+$${Math.round(debtDollars).toLocaleString()}`, `${hundredDollarBills.toLocaleString()} printed $100 bills piled`)}
                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Big Neal.fun Number */}
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-emerald-950 font-mono tracking-tight">
                  +${Math.round(debtDollars).toLocaleString()}
                </div>
              </div>

              <div className="text-xs text-emerald-900 font-semibold leading-relaxed">
                Growing at ~$8,250 every single second ($2.6 Trillion/year)
              </div>

              {/* PHYSICAL ACCUMULATOR: Visual 3D Stack of $100 Dollar Bills */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-emerald-200">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-800 mb-2 font-bold">
                  <span>Stack of $100 Bills:</span>
                  <span>{hundredDollarBills.toLocaleString()} bills</span>
                </div>
                <div className="h-10 w-full bg-emerald-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-emerald-300">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-200 rounded-xl flex items-center justify-end px-3 text-white font-mono text-xs font-bold"
                    style={{ width: `${Math.min(100, Math.max(8, (hundredDollarBills / 500) * 100))}%` }}
                  >
                    {hundredDollarBills > 0 && `💵 x${hundredDollarBills}`}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1 text-center">
                  Height: {(billStackHeightMm / 10).toFixed(1)} cm of raw physical paper cash
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] font-mono text-emerald-700 flex items-center justify-between">
              <span>Source: US Treasury Dept</span>
              <span className="font-bold">+$8.25k/s</span>
            </div>
          </div>
        )}

        {/* CARD 2: Wi-Fi Data Transfer as Metric Tons of Rice */}
        {(activeTab === 'all' || activeTab === 'tech') && (
          <div className="group rounded-3xl p-6 bg-indigo-50/50 border-2 border-indigo-200 hover:border-indigo-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-indigo-200 shadow-2xs select-none">
                    📡
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-indigo-800 uppercase font-mono tracking-wider">
                      Internet Transferred ({customMbps} Mbps)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                      Physical Data Flood
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Data Transferred', `${gbDownloaded < 1 ? mbDownloaded.toFixed(1) + ' MB' : gbDownloaded.toFixed(2) + ' GB'}`, `Equal to ${riceTons.toFixed(2)} metric tons of rice`)}
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-indigo-950 font-mono tracking-tight">
                  {gbDownloaded < 1
                    ? `${mbDownloaded.toFixed(1)} MB`
                    : gbDownloaded < 1000
                    ? `${gbDownloaded.toFixed(2)} GB`
                    : `${(gbDownloaded / 1000).toFixed(2)} TB`}
                </div>
              </div>

              <div className="text-xs text-indigo-900 font-semibold leading-relaxed">
                If 1 Byte = 1 grain of rice (0.029g):
              </div>

              {/* PHYSICAL ACCUMULATOR: Rice Mass & Packaging Equivalent */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-indigo-900 font-bold">
                  <span>🍚 Grains: {Math.floor(riceGrains).toLocaleString()}</span>
                  <span>{riceTons < 1 ? `${riceKg.toFixed(1)} kg` : `${riceTons.toFixed(2)} Tons`}</span>
                </div>
                <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (riceKg / 500) * 100))}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {riceTruckloads < 1
                    ? `~${(riceKg / 25).toFixed(1)} standard 25kg rice sacks`
                    : `~${riceTruckloads.toFixed(1)} pickup trucks full of raw rice! 🚚`}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-200/80 text-[11px] font-mono text-indigo-700 flex items-center justify-between">
              <span>Paper: {Math.floor(paperPages).toLocaleString()} printed sheets</span>
              <span className="font-bold">{(customMbps / 8).toFixed(1)} MB/s</span>
            </div>
          </div>
        )}

        {/* CARD 3: Snail vs. Real Familiar Objects (Quarter & Dollar Bill) */}
        {(activeTab === 'all' || activeTab === 'body') && (
          <div className="group rounded-3xl p-6 bg-lime-50/50 border-2 border-lime-200 hover:border-lime-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-lime-200 shadow-2xs select-none">
                    🐌
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-lime-900 uppercase font-mono tracking-wider">
                      Garden Snail Crawl Track
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-300">
                      Living Macro Velocity
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Garden Snail Distance', `${snailMm.toFixed(1)} mm`, 'Glides on slime at 1.3 mm/s')}
                  className="p-1.5 rounded-lg text-lime-700 hover:bg-lime-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                  {snailMm < 1000
                    ? `${snailMm.toFixed(1)} mm`
                    : `${(snailMm / 1000).toFixed(2)} meters`}
                </div>
              </div>

              <div className="text-xs text-lime-900 font-semibold leading-relaxed">
                Glides across slime at literal 1.3 mm/second (0.0029 mph)
              </div>

              {/* PHYSICAL ACCUMULATOR: Visual Race Against a Quarter & Dollar Bill */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-lime-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-700 font-bold">
                  <span>🪙 US Quarter (24.3mm)</span>
                  <span>💵 Dollar Bill (156mm)</span>
                </div>
                {/* Visual Slime Track */}
                <div className="relative w-full h-8 bg-lime-100 rounded-xl overflow-hidden border border-lime-300 flex items-center px-2">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-lime-300/60 rounded-xl transition-all duration-200"
                    style={{ width: `${Math.min(100, (snailMm / 156) * 100)}%` }}
                  />
                  {/* Snail Marker */}
                  <span
                    className="absolute text-lg transition-all duration-200"
                    style={{ left: `calc(${Math.min(92, (snailMm / 156) * 92)}%)` }}
                  >
                    🐌
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  {snailMm < 24.26
                    ? `${((snailMm / 24.26) * 100).toFixed(0)}% across a US Quarter coin`
                    : snailMm < 156
                    ? `${((snailMm / 156) * 100).toFixed(0)}% across the length of a $1 Dollar bill!`
                    : `~${(snailMm / 156).toFixed(1)} Dollar bills laid end-to-end!`}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-lime-200/80 text-[11px] font-mono text-lime-800 flex items-center justify-between">
              <span>Standard Cornu aspersum</span>
              <span className="font-bold">1.3 mm/s</span>
            </div>
          </div>
        )}

        {/* CARD 4: Human Heart Aorta Surge & Blood Volume */}
        {(activeTab === 'all' || activeTab === 'body') && (
          <div className="group rounded-3xl p-6 bg-rose-50/50 border-2 border-rose-200 hover:border-rose-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-rose-200 shadow-2xs select-none">
                    ❤️
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-rose-900 uppercase font-mono tracking-wider">
                      Blood Pumped Through Aorta
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      Circulatory Surge
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Aortic Blood Pumped', `${bloodLiters.toFixed(2)} Liters`, `Your heart pumped ${sodaCansFilled.toFixed(1)} cans of soda of blood at 1.2 m/s`)}
                  className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-rose-950 font-mono tracking-tight">
                  {bloodLiters.toFixed(2)} Liters
                </div>
              </div>

              <div className="text-xs text-rose-900 font-semibold leading-relaxed">
                Surged at peak 1.2 m/s (2.7 mph) during systolic heart contraction
              </div>

              {/* PHYSICAL ACCUMULATOR: Soda Cans Filled Beaker */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-rose-900 font-bold">
                  <span>Heart Beats: {heartBeats}</span>
                  <span>🥫 ~{sodaCansFilled.toFixed(1)} soda cans</span>
                </div>
                <div className="w-full h-4 bg-rose-100 rounded-full overflow-hidden border border-rose-200">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (bloodLiters / 20) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  Full adult human blood volume (5.0L) circulated every ~60 seconds
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200/80 text-[11px] font-mono text-rose-800 flex items-center justify-between">
              <span>Guyton Physiology Standard</span>
              <span className="font-bold">84 mL/s</span>
            </div>
          </div>
        )}

        {/* CARD 5: Cosmic Light Distance & Moon Trips */}
        {(activeTab === 'all' || activeTab === 'cosmic') && (
          <div className="group rounded-3xl p-6 bg-amber-50/50 border-2 border-amber-200 hover:border-amber-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-amber-200 shadow-2xs select-none">
                    💡
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-amber-900 uppercase font-mono tracking-wider">
                      Cosmic Light Traveled
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Causality Speed Limit
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Cosmic Light Distance', `${Math.round(lightKm).toLocaleString()} km`, `Light completed ${moonTrips} trips to the Moon`)}
                  className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-amber-950 font-mono tracking-tight">
                  {Math.round(lightKm).toLocaleString()} km
                </div>
              </div>

              <div className="text-xs text-amber-900 font-semibold leading-relaxed">
                Speed of light in vacuum: 299,792.458 km/s (186,282 miles/s)
              </div>

              {/* PHYSICAL ACCUMULATOR: Moon Trip Orbit Visualizer */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-amber-900 font-bold">
                  <span>🌍 Earth to Moon (384,400 km)</span>
                  <span>{moonTrips}x Moon trips</span>
                </div>
                <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(5, (lightKm / moonDistanceKm) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  One-way radio pulse to the Moon takes 1.28 seconds
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/80 text-[11px] font-mono text-amber-800 flex items-center justify-between">
              <span>Grace Hopper 1ns: 11.8 inches</span>
              <span className="font-bold">299,792 km/s</span>
            </div>
          </div>
        )}

        {/* CARD 6: CPU Clock Cycles & Time Dilation */}
        {(activeTab === 'all' || activeTab === 'tech') && (
          <div className="group rounded-3xl p-6 bg-purple-50/50 border-2 border-purple-200 hover:border-purple-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-purple-200 shadow-2xs select-none">
                    💻
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-purple-900 uppercase font-mono tracking-wider">
                      Your CPU Clock Ticks
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                      3.0 GHz Base Clock
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('CPU Cycles', `${(cpuCycles / 1e9).toFixed(1)} Billion Cycles`, `Dilated at 1ns = 1s, your CPU lived ${dilatedYears.toFixed(1)} human years`)}
                  className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-purple-950 font-mono tracking-tight">
                  {(cpuCycles / 1_000_000_000).toFixed(1)} Billion
                </div>
              </div>

              <div className="text-xs text-purple-900 font-semibold leading-relaxed">
                Assuming standard 3.0 GHz modern multi-core processor
              </div>

              {/* PHYSICAL ACCUMULATOR: 1ns = 1s Dilation Life Clock */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-purple-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-purple-900 font-bold">
                  <span>If 1ns = 1 Human Sec:</span>
                  <span>
                    {dilatedYears < 1
                      ? `${(dilatedYears * 365.25).toFixed(1)} Dilated Days`
                      : `${dilatedYears.toFixed(1)} Dilated Years!`}
                  </span>
                </div>
                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(5, (cpuCycles / 50_000_000_000) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  To this worker, waiting for DDR5 RAM takes 1 min 40 sec!
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-200/80 text-[11px] font-mono text-purple-800 flex items-center justify-between">
              <span>0.33 ns per clock cycle</span>
              <span className="font-bold">3.0 Billion/s</span>
            </div>
          </div>
        )}

        {/* CARD 7: Fingernails Microscopic Growth */}
        {(activeTab === 'all' || activeTab === 'body') && (
          <div className="group rounded-3xl p-6 bg-pink-50/50 border-2 border-pink-200 hover:border-pink-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-pink-200 shadow-2xs select-none">
                    💅
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-pink-900 uppercase font-mono tracking-wider">
                      Your Fingernails Grew
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-300">
                      Keratin Matrix
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Fingernail Growth', `${fingernailNm < 1000 ? fingernailNm.toFixed(1) + ' nm' : fingernailMm.toFixed(4) + ' mm'}`, 'Grows continuously at 1.32 nanometers every second')}
                  className="p-1.5 rounded-lg text-pink-700 hover:bg-pink-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-pink-950 font-mono tracking-tight">
                  {fingernailNm < 1000
                    ? `${fingernailNm.toFixed(1)} nm`
                    : `${fingernailMm.toFixed(4)} mm`}
                </div>
              </div>

              <div className="text-xs text-pink-900 font-semibold leading-relaxed">
                Cellular expansion at 1.32 nanometers/sec (~3.5 mm/month)
              </div>

              {/* PHYSICAL ACCUMULATOR: Nanometer Microscopic Scale Bar */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-pink-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-pink-900 font-bold">
                  <span>Microscopic scale:</span>
                  <span>
                    {fingernailNm < 100
                      ? `${(fingernailNm / 100 * 100).toFixed(0)}% of virus (~100nm)`
                      : `~${(fingernailMm / 0.1).toFixed(2)} sheets of paper`}
                  </span>
                </div>
                <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (fingernailNm / 500) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  Takes 62 hours for your fingernail to advance 1 screen pixel!
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-pink-200/80 text-[11px] font-mono text-pink-800 flex items-center justify-between">
              <span>Yaemsiri et al. 2010 Study</span>
              <span className="font-bold">1.32 nm/s</span>
            </div>
          </div>
        )}

        {/* CARD 8: Earth Orbiting the Sun */}
        {(activeTab === 'all' || activeTab === 'cosmic') && (
          <div className="group rounded-3xl p-6 bg-cyan-50/50 border-2 border-cyan-200 hover:border-cyan-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-cyan-200 shadow-2xs select-none">
                    🌍
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-cyan-900 uppercase font-mono tracking-wider">
                      Earth Hurtled Through Space
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                      Heliospheric Orbit
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Earth Orbital Distance', `${Math.round(earthOrbitKm).toLocaleString()} km`, 'Earth orbits the Sun at 29.78 km/s (66,600 mph)')}
                  className="p-1.5 rounded-lg text-cyan-700 hover:bg-cyan-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-cyan-950 font-mono tracking-tight">
                  {Math.round(earthOrbitKm).toLocaleString()} km
                </div>
              </div>

              <div className="text-xs text-cyan-900 font-semibold leading-relaxed">
                Orbiting the Sun at 29.78 km/s (66,600 mph)
              </div>

              {/* PHYSICAL ACCUMULATOR: Equator Lap Visualizer */}
              <div className="mt-4 p-3 rounded-2xl bg-white border border-cyan-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-900 font-bold">
                  <span>Equator Lap (40,075 km):</span>
                  <span>
                    {earthOrbitKm < 40075
                      ? `${((earthOrbitKm / 40075) * 100).toFixed(1)}%`
                      : `${(earthOrbitKm / 40075).toFixed(1)}x laps!`}
                  </span>
                </div>
                <div className="w-full h-3 bg-cyan-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (earthOrbitKm / 40075) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  You circle the entire planet Earth every 22 minutes!
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-200/80 text-[11px] font-mono text-cyan-800 flex items-center justify-between">
              <span>NASA JPL Horizons</span>
              <span className="font-bold">29.78 km/s</span>
            </div>
          </div>
        )}

        {/* CARD 9: Voyager 1 Spacecraft Escape */}
        {(activeTab === 'all' || activeTab === 'cosmic') && (
          <div className="group rounded-3xl p-6 bg-teal-50/50 border-2 border-teal-200 hover:border-teal-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-teal-200 shadow-2xs select-none">
                    🛰️
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-teal-900 uppercase font-mono tracking-wider">
                      Voyager 1 Interstellar Void
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                      Farthest Human Artifact
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Voyager 1 Travel', `${voyagerKm.toFixed(1)} km`, 'Cruising through interstellar space at 17.0 km/s')}
                  className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-teal-950 font-mono tracking-tight">
                  {voyagerKm < 100
                    ? `${Math.round(voyagerMeters).toLocaleString()} meters`
                    : `${voyagerKm.toFixed(1)} km`}
                </div>
              </div>

              <div className="text-xs text-teal-900 font-semibold leading-relaxed">
                Escaping into deep space at 17.0 km/s (38,000 mph)
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-white border border-teal-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-teal-900 font-bold">
                  <span>Current Earth Distance:</span>
                  <span>&gt;24.5 Billion km</span>
                </div>
                <div className="w-full h-3 bg-teal-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (voyagerMeters / 100000) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  Round-trip radio signal takes &gt;45.4 hours at light speed
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-200/80 text-[11px] font-mono text-teal-800 flex items-center justify-between">
              <span>Deep Space Network Telemetry</span>
              <span className="font-bold">17.0 km/s</span>
            </div>
          </div>
        )}

        {/* CARD 10: Global Atmospheric Lightning Strikes */}
        {(activeTab === 'all' || activeTab === 'tech') && (
          <div className="group rounded-3xl p-6 bg-yellow-50/50 border-2 border-yellow-200 hover:border-yellow-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-yellow-200 shadow-2xs select-none">
                    ⚡
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-yellow-900 uppercase font-mono tracking-wider">
                      Global Lightning Strikes
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                      Atmospheric Energy
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Lightning Strikes', `${lightningStrikes.toLocaleString()} bolts`, '~100 lightning flashes strike Earth every second')}
                  className="p-1.5 rounded-lg text-yellow-700 hover:bg-yellow-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-yellow-950 font-mono tracking-tight">
                  {lightningStrikes.toLocaleString()} bolts
                </div>
              </div>

              <div className="text-xs text-yellow-900 font-semibold leading-relaxed">
                Earth experiences ~100 cloud and ground lightning discharges every second
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-white border border-yellow-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-yellow-900 font-bold">
                  <span>Power discharge:</span>
                  <span>~{(lightningStrikes * 1.2).toFixed(0)} Gigawatts</span>
                </div>
                <div className="w-full h-3 bg-yellow-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(100, Math.max(5, (lightningStrikes / 1000) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  Peak lightning current reaches 30,000 Amperes at 30,000 Kelvin!
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-yellow-200/80 text-[11px] font-mono text-yellow-800 flex items-center justify-between">
              <span>NASA LIS Satellite Sensor</span>
              <span className="font-bold">100 strikes/s</span>
            </div>
          </div>
        )}

        {/* CARD 11: Scalp Hair Synthesis (Keratin Production) */}
        {(activeTab === 'all' || activeTab === 'body') && (
          <div className="group rounded-3xl p-6 bg-orange-50/50 border-2 border-orange-200 hover:border-orange-400 shadow-sm transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white border border-orange-200 shadow-2xs select-none">
                    💇
                  </span>
                  <div>
                    <h3 className="text-xs font-black text-orange-900 uppercase font-mono tracking-wider">
                      Scalp Hair Synthesized
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                      100k Follicles Combined
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleShareCard('Scalp Hair Production', `${hairMm.toFixed(2)} mm`, 'Combined production across all 100,000 scalp follicles')}
                  className="p-1.5 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-orange-950 font-mono tracking-tight">
                  {hairMm < 10
                    ? `${hairMm.toFixed(2)} mm`
                    : `${(hairMm / 10).toFixed(2)} cm`}
                </div>
              </div>

              <div className="text-xs text-orange-900 font-semibold leading-relaxed">
                Single strand grows 4.75 nm/s, but 100,000 strands add up to 0.475 mm/s!
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-white border border-orange-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-orange-900 font-bold">
                  <span>Daily keratin output:</span>
                  <span>~41 meters of strand/day</span>
                </div>
                <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (hairMm / 50) * 100))}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-600 font-mono text-center">
                  Your scalp generates 1 full millimeter of new strand every 2.1 seconds
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-orange-200/80 text-[11px] font-mono text-orange-800 flex items-center justify-between">
              <span>Dermatology Biometrics</span>
              <span className="font-bold">0.475 mm/s</span>
            </div>
          </div>
        )}

        {/* CARD 12: YOUR PERSONAL SPEED COMPARATOR (Like Entering Your Wage on printing-money!) */}
        <div className="group rounded-3xl p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-2.5 rounded-2xl bg-white border border-indigo-200 shadow-2xs select-none">
                  🏃
                </span>
                <div>
                  <h3 className="text-xs font-black text-indigo-950 uppercase font-mono tracking-wider">
                    Your Personal Velocity
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                    Interactive Comparator
                  </span>
                </div>
              </div>
              <User className="w-4 h-4 text-indigo-600" />
            </div>

            {/* Selector for Activity */}
            <div className="flex items-center gap-1.5 mb-3 bg-white p-1 rounded-xl border border-indigo-200 text-xs font-mono">
              {[
                { id: 'walk', label: 'Walking (3.1 mph)', val: 3.1 },
                { id: 'bike', label: 'Cycling (12 mph)', val: 12.0 },
                { id: 'run', label: 'Running (8 mph)', val: 8.0 },
              ].map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    playClick(850);
                    setPersonalSpeedType(act.id as typeof personalSpeedType);
                    setPersonalSpeedVal(act.val);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all flex-1 ${
                    personalSpeedType === act.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {act.id === 'walk' ? '🚶 Walk' : act.id === 'bike' ? '🚴 Bike' : '🏃 Run'}
                </button>
              ))}
            </div>

            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-black text-indigo-950 font-mono tracking-tight">
                {personalDistanceMeters < 1000
                  ? `${personalDistanceMeters.toFixed(1)} meters`
                  : `${(personalDistanceMeters / 1000).toFixed(2)} km`}
              </div>
            </div>

            <div className="text-xs text-indigo-900 font-semibold leading-relaxed">
              Moving at {personalSpeedVal} mph ({personalMps.toFixed(2)} m/sec)
            </div>

            {/* Comparator against a snail and an airplane */}
            <div className="mt-4 p-3 rounded-2xl bg-white border border-indigo-200 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-700">
                <span>🐌 Snail multiplier:</span>
                <strong className="text-emerald-600">
                  {(personalMps / 0.0013).toFixed(0)}&times; faster!
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>✈️ Jetliner (250 m/s):</span>
                <strong className="text-indigo-600">
                  {((personalMps / 250) * 100).toFixed(1)}% jet speed
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>💡 Cosmic Light (c):</span>
                <strong className="text-purple-600">
                  {(personalMps / 299792458 * 1e8).toFixed(2)}e-8 c
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-200/80 text-[11px] font-mono text-indigo-700 flex items-center justify-between">
            <span>You vs The Universe</span>
            <span className="font-bold">{personalMps.toFixed(2)} m/s</span>
          </div>
        </div>
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
