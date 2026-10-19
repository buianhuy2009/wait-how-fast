'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import {
  ISO_CARD,
  DEVICE_PRESETS,
  DevicePreset,
  calculatePpmm,
} from '@/lib/ppiMath';
import ScreenRuler from './ScreenRuler';
import { CreditCard, CheckCircle2, RefreshCw, Ruler, Monitor, Laptop, Smartphone, HelpCircle } from 'lucide-react';

interface CardCalibratorProps {
  onComplete?: () => void;
  isCompact?: boolean;
}

export default function CardCalibrator({ onComplete, isCompact = false }: CardCalibratorProps) {
  const {
    ppi,
    cardWidthPx,
    isCalibrated,
    activePresetId,
    setCardWidthPx,
    applyPreset,
    markAsCalibrated,
    resetCalibration,
  } = useCalibration();

  const { playClick, playChime } = useSound();
  const [showRuler, setShowRuler] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const cardHeightPx = cardWidthPx / ISO_CARD.aspectRatio;
  const ppmm = calculatePpmm(ppi);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCardWidthPx(val);
  };

  const adjustWidth = (delta: number) => {
    playClick(750 + delta * 20);
    setCardWidthPx(cardWidthPx + delta);
  };

  const handlePresetClick = (preset: DevicePreset) => {
    playClick(900);
    applyPreset(preset);
  };

  const handleConfirm = () => {
    markAsCalibrated();
    playChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#facc15'],
      });
    } catch {}

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md ${isCompact ? 'max-w-2xl' : 'max-w-4xl'} mx-auto`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Ticket Booth: Screen Scale Calibration
              </h2>
              {isCalibrated && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Calibrated
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hold any physical card against your screen so objects move at their <strong>exact real-world speed</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setShowHelp(!showHelp);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Why do we need this?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              playClick();
              setShowRuler(!showRuler);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              showRuler
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Ruler className="w-4 h-4" />
            {showRuler ? 'Hide Ruler' : 'Verify with Ruler'}
          </button>
          <button
            onClick={() => {
              playClick(600);
              resetCalibration();
            }}
            className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset calibration to default"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Why explain drawer */}
      {showHelp && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200/90 leading-relaxed space-y-2">
          <p className="font-semibold text-indigo-300">
            🔍 Why web browsers don&apos;t know how big your screen is:
          </p>
          <p>
            When a webpage tells an object to move &ldquo;100 pixels per second,&rdquo; that could be 1 inch on a 24&quot; TV or only 0.4 inches on a sharp phone!
            Every school ID, credit card, library card, or gift card in the world is manufactured to the identical international specification: <strong>ISO/IEC 7810 ID-1 (85.60 mm wide)</strong>.
          </p>
          <p>
            By matching the card below, we calculate your screen&apos;s true <strong>Pixels Per Inch ({ppi.toFixed(1)} PPI)</strong> so the garden snail, blood flow, and continental drift move at the exact mathematical speed of reality!
          </p>
        </div>
      )}

      {/* Interactive Card Canvas Arena */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden mb-6 min-h-[300px]">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Card Measurement Guides */}
        <div className="relative flex flex-col items-center select-none">
          {/* Top Width Dimension Arrow */}
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-cyan-400" style={{ width: `${cardWidthPx}px` }}>
            <span className="text-[10px]">◀</span>
            <div className="h-px flex-1 bg-cyan-400/40 mx-2" />
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
              {ISO_CARD.widthMm} mm &bull; {ISO_CARD.widthInches.toFixed(2)}&quot;
            </span>
            <div className="h-px flex-1 bg-cyan-400/40 mx-2" />
            <span className="text-[10px]">▶</span>
          </div>

          {/* The Physical Card Simulation Box */}
          <div
            className="relative rounded-2xl p-5 shadow-2xl transition-all duration-75 flex flex-col justify-between overflow-hidden border border-white/20 select-none"
            style={{
              width: `${cardWidthPx}px`,
              height: `${cardHeightPx}px`,
              background: 'linear-gradient(135deg, #1e1e38 0%, #2a2050 40%, #16162a 100%)',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.8), 0 0 30px rgba(99, 102, 241, 0.15)',
            }}
          >
            {/* Holographic Sheen Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.4) 40%, transparent 60%)',
              }}
            />

            {/* Card Top Row: Chip and Contactless */}
            <div className="flex items-center justify-between z-10">
              {/* EMV Gold Chip */}
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-300/80 p-1 flex flex-col justify-around shadow-inner">
                <div className="w-full h-px bg-amber-800/40" />
                <div className="w-full h-px bg-amber-800/40" />
                <div className="w-full h-px bg-amber-800/40" />
              </div>

              {/* Contactless Wave */}
              <div className="text-slate-400 font-mono text-xs flex items-center gap-1 opacity-70">
                <span className="text-sm">)))</span>
              </div>
            </div>

            {/* Card Middle: Museum Pass Text */}
            <div className="z-10 my-auto text-left">
              <div className="text-[10px] tracking-widest uppercase font-mono text-indigo-300/80">
                MUSEUM OF SPEED ADMISSION
              </div>
              <div className="text-base font-bold text-white tracking-wider font-mono">
                ISO/IEC 7810 ID-1
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Standard School ID / Credit Card
              </div>
            </div>

            {/* Card Bottom: Metrics */}
            <div className="flex items-center justify-between z-10 text-[10px] font-mono text-slate-300 border-t border-white/10 pt-2">
              <span>{Math.round(cardWidthPx)} &times; {Math.round(cardHeightPx)} CSS PX</span>
              <span className="text-emerald-400 font-bold">{ppi.toFixed(1)} PPI</span>
            </div>
          </div>
        </div>

        {/* Fine-Tuning Controls */}
        <div className="w-full max-w-lg mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Resize Card to Match Physical Object:</span>
            <span className="text-cyan-400 font-bold">{cardWidthPx} px</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustWidth(-5)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-mono border border-slate-700"
              title="-5 pixels"
            >
              -5
            </button>
            <button
              onClick={() => adjustWidth(-1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-mono border border-slate-700"
              title="-1 pixel"
            >
              -1
            </button>

            <input
              type="range"
              min="180"
              max="650"
              step="1"
              value={cardWidthPx}
              onChange={handleSliderChange}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-cyan-400"
            />

            <button
              onClick={() => adjustWidth(1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-mono border border-slate-700"
              title="+1 pixel"
            >
              +1
            </button>
            <button
              onClick={() => adjustWidth(5)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-mono border border-slate-700"
              title="+5 pixels"
            >
              +5
            </button>
          </div>
        </div>
      </div>

      {/* Screen Ruler Drawer */}
      {showRuler && (
        <div className="mb-6">
          <ScreenRuler />
        </div>
      )}

      {/* Device Presets (Fallback if user has no card nearby) */}
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <span>No physical card handy? Choose a quick device preset:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {DEVICE_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            const Icon =
              preset.deviceType === 'laptop'
                ? Laptop
                : preset.deviceType === 'desktop'
                ? Monitor
                : Smartphone;

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900/80 text-cyan-300">
                    {preset.estimatedCssPpi} PPI
                  </span>
                </div>
                <div className="text-xs font-medium truncate">{preset.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary Bar & Confirm Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-6 text-xs text-slate-300 font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">CURRENT PPI</span>
            <strong className="text-cyan-400 text-sm">{ppi.toFixed(1)} px/in</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">PIXELS PER MM</span>
            <strong className="text-indigo-400 text-sm">{ppmm.toFixed(2)} px/mm</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">1 CM ON SCREEN</span>
            <strong className="text-emerald-400 text-sm">{(ppmm * 10).toFixed(1)} px</strong>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <CheckCircle2 className="w-5 h-5" />
          {isCalibrated ? 'Update Calibration' : 'Confirm Calibration & Enter Museum'}
        </button>
      </div>
    </div>
  );
}
