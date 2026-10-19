'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import {
  Compass,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Gauge,
  Heart,
  Radio,
  HardDrive,
  Cpu,
  Activity,
  Layers,
  HelpCircle,
  Maximize2,
} from 'lucide-react';
import FamiliarScaleSelector from '@/components/calibrator/FamiliarScaleSelector';

const NAV_HALLS = [
  { href: '/hall/speed', label: '1. Speed Track', icon: Gauge, color: 'text-emerald-400' },
  { href: '/hall/biology', label: '2. Speed of You', icon: Heart, color: 'text-rose-400' },
  { href: '/hall/latency', label: '3. Latency Arcade', icon: Radio, color: 'text-cyan-400' },
  { href: '/hall/data', label: '4. The Data Flood', icon: HardDrive, color: 'text-indigo-400' },
  { href: '/hall/cpu', label: '5. Inside Your CPU', icon: Cpu, color: 'text-purple-400' },
  { href: '/hall/framerate', label: '6. Refresh Vault', icon: Activity, color: 'text-amber-400' },
  { href: '/hall/cosmic', label: '7. Cosmic Vault', icon: Sparkles, color: 'text-violet-400' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { ppi, isCalibrated } = useCalibration();
  const { isMuted, toggleMute, playClick } = useSound();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalibratorModalOpen, setIsCalibratorModalOpen] = useState(false);

  const handleNavClick = () => {
    playClick(850);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Museum Branding */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-600 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Wait, How Fast Is That?</span>
              </div>
              <div className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider uppercase">
                Digital Museum of Speed & Scale
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_HALLS.map((hall) => {
              const isActive = pathname === hall.href;
              const Icon = hall.icon;
              return (
                <Link
                  key={hall.href}
                  href={hall.href}
                  onClick={() => playClick(800)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : hall.color.replace('text-', 'text-indigo-')}`} />
                  <span>{hall.label}</span>
                </Link>
              );
            })}

            <Link
              href="/all"
              onClick={() => playClick(800)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === '/all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>All Halls</span>
            </Link>
          </nav>

          {/* Right Utilities: Calibration Badge, Sound Toggle, About */}
          <div className="flex items-center gap-2">
            {/* PPI Calibrator Button */}
            <button
              onClick={() => {
                playClick(900);
                setIsCalibratorModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border bg-white border-slate-200 hover:border-indigo-400 text-slate-800 shadow-2xs hover:bg-slate-50 active:scale-95"
              title="Display Screen Scale (Click to adjust)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold">{ppi.toFixed(0)} PPI</span>
              {isCalibrated && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
              }`}
              title={isMuted ? 'Unmute synthesized sound effects' : 'Mute sound effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* About Link */}
            <Link
              href="/about"
              onClick={() => playClick(800)}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="Methodology, Citations & Science"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <div className="text-[11px] font-mono text-slate-400 uppercase px-3 py-1">Museum Wings</div>
            {NAV_HALLS.map((hall) => {
              const Icon = hall.icon;
              return (
                <Link
                  key={hall.href}
                  href={hall.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span>{hall.label}</span>
                </Link>
              );
            })}
            <Link
              href="/all"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Full Museum Walkthrough (All Wings)</span>
            </Link>
            <Link
              href="/about"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>About, Citations & Science Methodology</span>
            </Link>
          </div>
        )}
      </header>

      {/* Recalibrate Modal Dialog */}
      {isCalibratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setIsCalibratorModalOpen(false)}
              className="absolute top-6 right-6 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
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
