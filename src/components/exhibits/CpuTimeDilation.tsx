'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import { CPU_OPERATIONS, CpuOperation } from '@/data/cpuDilation';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Cpu, Play, RotateCcw } from 'lucide-react';

interface CpuTimeDilationProps {
  initialOpId?: string;
}

export default function CpuTimeDilation({ initialOpId = 'main-ram' }: CpuTimeDilationProps) {
  const { playClick, playCpu, playChime, playBuzz } = useSound();

  const [activeOp, setActiveOp] = useState<CpuOperation>(() => {
    return CPU_OPERATIONS.find((op) => op.id === initialOpId) || CPU_OPERATIONS[5]; // Main RAM
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedElapsedSec, setSimulatedElapsedSec] = useState<number>(0);
  const [paceMode, setPaceMode] = useState<'fast' | 'real'>('fast');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectOp = (op: CpuOperation) => {
    playClick(900);
    setActiveOp(op);
    setIsSimulating(false);
    setSimulatedElapsedSec(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleStartSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (activeOp.id === 'branch-mispredict') {
      playBuzz();
    } else {
      playCpu();
    }

    setIsSimulating(true);
    setSimulatedElapsedSec(0);

    const stepMs = 50;
    // For long operations (SSD, HDD, Network), we accelerate time unless user explicitly chose literal 1:1 pace!
    let timeMultiplier = 1.0;
    if (paceMode === 'fast') {
      if (activeOp.dilatedSeconds > 3600) {
        timeMultiplier = activeOp.dilatedSeconds / 6; // finishes in ~6 seconds
      } else if (activeOp.dilatedSeconds > 60) {
        timeMultiplier = activeOp.dilatedSeconds / 4; // finishes in ~4 seconds
      }
    }

    const interval = setInterval(() => {
      setSimulatedElapsedSec((prev) => {
        const next = prev + (stepMs / 1000) * timeMultiplier;
        if (next >= activeOp.dilatedSeconds) {
          clearInterval(interval);
          setIsSimulating(false);
          playChime();
          return activeOp.dilatedSeconds;
        }
        return next;
      });
    }, stepMs);

    timerRef.current = interval;
  };

  const handleReset = () => {
    playClick(600);
    setIsSimulating(false);
    setSimulatedElapsedSec(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const progressPercent = Math.min(100, (simulatedElapsedSec / activeOp.dilatedSeconds) * 100);

  return (
    <div className="w-full space-y-6">
      {/* Upper Selector Grid: Computer Operations */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          SELECT CPU HARDWARE OPERATION (1 NS = 1 HUMAN SECOND):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {CPU_OPERATIONS.map((op) => {
            const isSelected = activeOp.id === op.id;
            return (
              <button
                key={op.id}
                onClick={() => selectOp(op)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-50 border-purple-500 shadow-sm ring-2 ring-purple-500/20 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
                style={{
                  borderLeftColor: isSelected ? op.accentColor : undefined,
                  borderLeftWidth: isSelected ? '4px' : undefined,
                }}
              >
                <div className="text-xl mb-1">{op.icon}</div>
                <div className="text-xs font-bold truncate text-slate-900">{op.name}</div>
                <div className="text-[10px] font-mono text-purple-600 font-bold mt-0.5 truncate">{op.realTimeDisplay}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage: The CPU Worker Office */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Stage Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 shadow-2xs">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                The CPU Time Dilation Chamber (1 Nanosecond = 1 Human Second)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Slowed down <strong>1,000,000,000&times;</strong> to reveal what your CPU does while waiting for data.
              </p>
            </div>
          </div>

          {/* Dual Live Clocks */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] font-bold">CPU REAL TIME</span>
              <strong className="text-indigo-600 text-sm font-black">{activeOp.realTimeDisplay}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
              <span className="text-purple-700 block text-[10px] font-bold">HUMAN DILATED TIME</span>
              <strong className="text-purple-950 text-sm font-black">{activeOp.dilatedDisplay}</strong>
            </div>
          </div>
        </div>

        {/* The Animated Office Simulation Arena */}
        <div className="relative rounded-2xl p-8 bg-[#0b0f19] border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          {/* Subtle office floor grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #a855f7 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Animated CPU Worker Character Stage */}
          <div className="relative flex flex-col items-center z-10 text-center max-w-xl">
            {/* Worker Avatar & Prop */}
            <div className="relative mb-4">
              <div
                className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-5xl shadow-2xl transition-all duration-300 ${
                  isSimulating
                    ? 'border-purple-400 bg-purple-950/60 scale-105 shadow-purple-500/30 animate-bounce'
                    : 'border-slate-700 bg-slate-900 shadow-slate-900/50'
                }`}
              >
                {activeOp.icon}
              </div>

              {isSimulating && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold animate-pulse">
                  ACTIVE
                </div>
              )}
            </div>

            {/* Action Title */}
            <h4 className="text-xl font-bold text-white mb-1 tracking-tight">
              {activeOp.workerAction}
            </h4>

            {/* Narrative Story */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mb-6">
              {activeOp.workerStory}
            </p>

            {/* Progress Bar & Counter */}
            <div className="w-full max-w-md space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>DILATED ELAPSED TIME:</span>
                <span className="text-purple-300 font-bold">
                  {simulatedElapsedSec < 60
                    ? `${simulatedElapsedSec.toFixed(1)}s`
                    : simulatedElapsedSec < 3600
                    ? `${(simulatedElapsedSec / 60).toFixed(1)} min`
                    : simulatedElapsedSec < 86400
                    ? `${(simulatedElapsedSec / 3600).toFixed(1)} hours`
                    : `${(simulatedElapsedSec / 86400).toFixed(1)} days`} / {activeOp.dilatedDisplay}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Simulation Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleStartSimulation}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${
                  isSimulating
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{isSimulating ? 'PAUSE DILATION' : 'DISPATCH CPU REQUEST'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playClick(850);
                  setPaceMode(paceMode === 'fast' ? 'real' : 'fast');
                  handleReset();
                }}
                className={`px-3 py-2.5 rounded-xl border text-xs font-mono transition-colors ${
                  paceMode === 'real'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle between Fast-Forward preview and Literal 1s=1ns real-time waiting"
              >
                {paceMode === 'real' ? '⏱️ Real 1ns=1s Pace' : '⏩ Fast-Forward'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Museum Plaque */}
      <PlaqueCard
        title={activeOp.name}
        subtitle={`Hardware Hierarchy: Level ${activeOp.hardwareLevel.toUpperCase()}`}
        category="cpu architecture"
        icon={activeOp.icon}
        funFact={`In 1 human second dilated time, light travels 30 cm (the width of your desk). To fetch data from RAM (${activeOp.realTimeDisplay}), your CPU worker has time to take a break, microwave a snack, and return!`}
        comparison={activeOp.workerStory}
        mathFormula={`Dilated Factor = 10^9 (1 second per 1 nanosecond); Real Time = ${activeOp.realNanoseconds} ns -> Dilated Time = ${activeOp.dilatedSeconds} s`}
        citation={activeOp.citation}
        citationUrl={activeOp.citationSource}
        shareSnippet={`If 1 nanosecond was 1 second, reading from RAM takes 1m 40s, an SSD takes a weekend trip, and fetching an API across the ocean takes 4.75 YEARS!`}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Export / Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="If 1 Nanosecond Was 1 Human Second"
        metricHighlight="RAM = 1m 40s • SSD = 1.7 Days • Ocean API = 4.75 Years"
        funFact="If 1 nanosecond equaled 1 human second, a CPU cycle is a finger snap, reading from RAM takes a microwave snack break, reading an SSD takes a full weekend ski trip, and fetching an API across the ocean takes 4.75 YEARS—the entire span of middle school and high school!"
        sourceCitation="Peter Norvig & Jeff Dean (Latency Numbers Every Computer Scientist Should Know)"
      />
    </div>
  );
}
