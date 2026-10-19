'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import {
  Compass,
  Volume2,
  VolumeX,
  CheckCircle2,
  Maximize2,
  HelpCircle,
  X,
  ChevronDown,
} from 'lucide-react';
import FamiliarScaleSelector from '@/components/calibrator/FamiliarScaleSelector';

export default function Navbar() {
  const { ppi, isCalibrated } = useCalibration();
  const { isMuted, toggleMute, playClick } = useSound();

  const [isCalibratorModalOpen, setIsCalibratorModalOpen] = useState(false);
  const [isJumpOpen, setIsJumpOpen] = useState(false);

  const museumHalls = [
    { href: '#realtime-stream', label: '1. Live Real-Time Stream' },
    { href: '#speed-conveyor', label: '2. Speed Conveyor Belts' },
    { href: '#data-scale', label: '3. Data Mass (Rice Scale)' },
    { href: '#cpu-dilation', label: '4. CPU Nanosecond Dilation' },
    { href: '#latency-arcade', label: '5. Latency & Ping Arcade' },
    { href: '#framerate-vault', label: '6. Refresh & Motion Vault' },
    { href: '#cosmic-vault', label: '7. Cosmic Velocity Vault' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Clean Title */}
          <Link
            href="/"
            onClick={() => playClick(850)}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900">
                Wait, How Fast Is That?
              </span>
              <span className="hidden sm:inline-block text-xs font-mono text-slate-500 font-medium pl-2 border-l border-slate-200">
                A Museum of Speed & Scale
              </span>
            </div>
          </Link>

          {/* Calm, Minimal Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Section Jump Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  playClick(800);
                  setIsJumpOpen(!isJumpOpen);
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span>Jump to Section</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isJumpOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsJumpOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-30 font-mono text-xs animate-in fade-in slide-in-from-top-1">
                    {museumHalls.map((hall) => (
                      <a
                        key={hall.href}
                        href={hall.href}
                        onClick={() => {
                          playClick(850);
                          setIsJumpOpen(false);
                        }}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        {hall.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Screen Scale Calibrate Pill */}
            <button
              onClick={() => {
                playClick(900);
                setIsCalibratorModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-mono text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Calibrate screen inches with a credit card or dollar bill"
            >
              <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold">{ppi.toFixed(0)} PPI</span>
              {isCalibrated && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            {/* Subtle Sound Mute Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-full border transition-colors ${
                isMuted
                  ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* About / Methodology */}
            <Link
              href="/about"
              onClick={() => playClick(800)}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Methodology, Citations & Science"
              aria-label="About and Methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Screen Calibrator Modal Dialog */}
      {isCalibratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-4 sm:p-6">
            <button
              onClick={() => setIsCalibratorModalOpen(false)}
              className="absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Close calibration modal"
            >
              <X className="w-5 h-5" />
            </button>
            <FamiliarScaleSelector onComplete={() => setIsCalibratorModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
