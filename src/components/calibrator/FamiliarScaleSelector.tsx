'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import {
  DEVICE_PRESETS,
  DevicePreset,
  calculatePpmm,
  mmToPx,
} from '@/lib/ppiMath';
import { FAMILIAR_OBJECTS, FamiliarObject } from '@/lib/familiarObjects';
import {
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Sparkles,
  Ruler,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import ScreenRuler from './ScreenRuler';

interface FamiliarScaleSelectorProps {
  onComplete?: () => void;
  isCompact?: boolean;
}

export default function FamiliarScaleSelector({
  onComplete,
  isCompact = false,
}: FamiliarScaleSelectorProps) {
  const {
    ppi,
    isCalibrated,
    activePresetId,
    setCardWidthPx,
    applyPreset,
    markAsCalibrated,
    resetCalibration,
  } = useCalibration();

  const { playClick, playChime } = useSound();
  const [selectedObject, setSelectedObject] = useState<FamiliarObject>(FAMILIAR_OBJECTS[0]); // Dollar bill default
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const ppmm = calculatePpmm(ppi);

  // Width & height of the currently selected familiar object in CSS pixels
  const objWidthPx = mmToPx(selectedObject.widthMm, ppi);
  const objHeightPx = mmToPx(selectedObject.heightMm, ppi);

  const handlePresetSelect = (preset: DevicePreset) => {
    playClick(900);
    applyPreset(preset);
  };

  const handleSelectObject = (obj: FamiliarObject) => {
    playClick(800);
    setSelectedObject(obj);
  };

  const handleConfirm = () => {
    markAsCalibrated();
    playChime();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#a855f7', '#10b981', '#f59e0b'],
      });
    } catch {}

    if (onComplete) {
      onComplete();
    }
  };

  const adjustPpi = (delta: number) => {
    playClick(750 + delta * 30);
    // adjust via card width ratio: ppi = cardWidth / widthInches
    // cardWidth = (ppi + delta) * widthInches
    const newPpi = Math.max(50, Math.min(400, ppi + delta));
    const newWidth = newPpi * (85.6 / 25.4);
    setCardWidthPx(newWidth);
  };

  return (
    <div
      className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl ${
        isCompact ? 'max-w-2xl' : 'max-w-5xl'
      } mx-auto`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Familiar Everyday Scale & Calibration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            How Big Is 1 Millimeter on Your Display?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            No credit card needed! Pick your device or a familiar everyday object to see true 1:1 real-world size.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setShowHelp(!showHelp);
            }}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="How does screen scale work?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              playClick();
              setShowRuler(!showRuler);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              showRuler
                ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>{showRuler ? 'Hide Ruler' : 'Screen Ruler'}</span>
          </button>
          <button
            onClick={() => {
              playClick(600);
              resetCalibration();
            }}
            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset to default 96 PPI"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explainer Drawer */}
      {showHelp && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-2">
          <p className="font-bold text-indigo-900 dark:text-indigo-300">
            🔍 Why browsers need your screen PPI:
          </p>
          <p>
            When a web page says &ldquo;move 100 pixels per second,&rdquo; on a 27&quot; desktop monitor that might be 1 inch, while on a tiny phone screen that might be only 0.4 inches!
          </p>
          <p>
            By knowing your display&apos;s <strong>Pixels Per Inch ({ppi.toFixed(0)} PPI)</strong>, the museum renders continental drift, fingernail growth, snail crawls, and light waves at their <strong>exact physical millimeter speed in reality</strong>!
          </p>
        </div>
      )}

      {/* STEP 1: Quick 1-Click Device Type Presets (Zero Effort) */}
      <div className="mb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>1. Quick 1-Click Device Setup:</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            Current: {ppi.toFixed(0)} PPI (~{ppmm.toFixed(2)} px/mm)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {DEVICE_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            const Icon =
              preset.deviceType === 'laptop'
                ? Laptop
                : preset.deviceType === 'desktop'
                ? Monitor
                : preset.deviceType === 'tablet'
                ? Tablet
                : Smartphone;

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    {preset.estimatedCssPpi} PPI
                  </span>
                </div>
                <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                  {preset.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Pick a Familiar Everyday Reference Object */}
      <div className="mb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
          <span>2. Or Choose a Familiar Everyday Object to Compare:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {FAMILIAR_OBJECTS.map((obj) => {
            const isSelected = selectedObject.id === obj.id;
            return (
              <button
                key={obj.id}
                onClick={() => handleSelectObject(obj)}
                className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xl select-none">{obj.icon}</span>
                <span className="text-[11px] leading-tight truncate w-full">{obj.name}</span>
                <span className="text-[9px] font-mono text-slate-400">
                  {obj.widthMm < 20 ? `${obj.widthMm}mm` : `${(obj.widthMm / 10).toFixed(1)}cm`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Live Representation of the Familiar Object */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/60 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full mb-6 min-h-[260px]">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Dimension indicator above object */}
        <div className="relative flex flex-col items-center select-none max-w-full">
          <div
            className="flex items-center justify-between mb-2 text-xs font-mono text-indigo-600 dark:text-indigo-400"
            style={{ width: `${Math.min(objWidthPx, 600)}px` }}
          >
            <span className="text-[10px]">◀</span>
            <div className="h-px flex-1 bg-indigo-500/40 mx-2" />
            <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold shadow-sm">
              {selectedObject.widthMm} mm ({selectedObject.widthInches.toFixed(2)} inches)
            </span>
            <div className="h-px flex-1 bg-indigo-500/40 mx-2" />
            <span className="text-[10px]">▶</span>
          </div>

          {/* The Visual Object Simulation Box */}
          <div
            className="relative rounded-2xl p-4 shadow-xl transition-all duration-100 flex flex-col justify-between overflow-hidden border border-slate-300 dark:border-white/20 select-none max-w-full"
            style={{
              width: `${Math.min(objWidthPx, 650)}px`,
              height: `${Math.max(60, Math.min(objHeightPx, 300))}px`,
              background:
                selectedObject.id === 'dollar-bill'
                  ? 'linear-gradient(135deg, #15803d 0%, #166534 50%, #14532d 100%)'
                  : selectedObject.id === 'post-it-note'
                  ? 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)'
                  : selectedObject.id === 'quarter-coin'
                  ? 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 50%, #64748b 100%)'
                  : 'linear-gradient(135deg, #1e1e38 0%, #2a2050 40%, #16162a 100%)',
              color:
                selectedObject.id === 'post-it-note' ? '#713f12' : '#ffffff',
            }}
          >
            {/* Object Title & Details */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedObject.icon}</span>
                <div>
                  <div className="text-xs font-black tracking-wide font-mono">
                    {selectedObject.name}
                  </div>
                  <div className="text-[10px] opacity-80">{selectedObject.subtitle}</div>
                </div>
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 font-bold">
                1:1 Scale
              </div>
            </div>

            {/* Object Middle Fun Fact */}
            <div className="z-10 my-auto text-left text-xs opacity-90 leading-tight">
              {selectedObject.description}
            </div>

            {/* Object Bottom Metric */}
            <div className="flex items-center justify-between z-10 text-[10px] font-mono border-t border-black/10 dark:border-white/10 pt-2 opacity-80">
              <span>{Math.round(objWidthPx)} &times; {Math.round(objHeightPx)} CSS PX</span>
              <span className="font-bold">{ppi.toFixed(0)} PPI</span>
            </div>
          </div>
        </div>

        {/* Fine-Tuning Slider */}
        <div className="w-full max-w-md mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Fine-Tune Display Scale:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{ppi.toFixed(0)} PPI</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustPpi(-5)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold"
              title="-5 PPI"
            >
              -5
            </button>
            <input
              type="range"
              min="70"
              max="220"
              step="1"
              value={ppi}
              onChange={(e) => {
                const targetPpi = parseFloat(e.target.value);
                const newWidth = targetPpi * (85.6 / 25.4);
                setCardWidthPx(newWidth);
              }}
              className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
            />
            <button
              onClick={() => adjustPpi(5)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold"
              title="+5 PPI"
            >
              +5
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
            Tip: Standard laptops are ~112-125 PPI. Standard 24&quot; monitors are ~92-96 PPI.
          </p>
        </div>
      </div>

      {/* Screen Ruler Drawer */}
      {showRuler && (
        <div className="mb-6">
          <ScreenRuler />
        </div>
      )}

      {/* Bottom Confirmation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div>
            <span className="text-slate-400 block text-[10px]">SCREEN SCALE</span>
            <strong className="text-indigo-600 dark:text-indigo-400 text-sm">
              {ppi.toFixed(0)} px/in
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">1 CM ON SCREEN</span>
            <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
              {(ppmm * 10).toFixed(1)} px
            </strong>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCalibrated ? 'Update Calibration' : 'Confirm & Enter Museum'}</span>
        </button>
      </div>
    </div>
  );
}
