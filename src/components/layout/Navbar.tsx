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
  CreditCard,
  CheckCircle2,
  Menu,
  X,
  Gauge,
  Radio,
  HardDrive,
  Cpu,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import CardCalibrator from '@/components/calibrator/CardCalibrator';

const NAV_HALLS = [
  { href: '/hall/speed', label: '1. True-Scale Speed', icon: Gauge, color: 'text-emerald-400' },
  { href: '/hall/latency', label: '2. Latency Arcade', icon: Radio, color: 'text-cyan-400' },
  { href: '/hall/data', label: '3. The Data Flood', icon: HardDrive, color: 'text-indigo-400' },
  { href: '/hall/cpu', label: '4. CPU Time Dilation', icon: Cpu, color: 'text-purple-400' },
  { href: '/hall/framerate', label: '5. Frame Rate Vault', icon: Activity, color: 'text-amber-400' },
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Museum Branding */}
          <Link
            href="/"
            onClick={handleNavClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Wait, How Fast Is That?</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${hall.color}`} />
                  <span>{hall.label}</span>
                </Link>
              );
            })}

            <Link
              href="/all"
              onClick={() => playClick(800)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === '/all'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                isCalibrated
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 animate-pulse'
              }`}
              title="Click to recalibrate screen PPI"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="font-bold">{ppi.toFixed(0)} PPI</span>
              {isCalibrated ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] hidden sm:inline">(Uncalibrated)</span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
              }`}
              title={isMuted ? 'Unmute synthesized sound effects' : 'Mute sound effects'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* About Link */}
            <Link
              href="/about"
              onClick={() => playClick(800)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Methodology, Citations & Science"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase px-3 py-1">Museum Halls</div>
            {NAV_HALLS.map((hall) => {
              const Icon = hall.icon;
              return (
                <Link
                  key={hall.href}
                  href={hall.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-900"
                >
                  <Icon className={`w-4 h-4 ${hall.color}`} />
                  <span>{hall.label}</span>
                </Link>
              );
            })}
            <Link
              href="/all"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-indigo-300 hover:bg-slate-900"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Full Museum Walkthrough (All Halls)</span>
            </Link>
            <Link
              href="/about"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>About, Citations & Science Methodology</span>
            </Link>
          </div>
        )}
      </header>

      {/* Recalibrate Modal Dialog */}
      {isCalibratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <button
              onClick={() => setIsCalibratorModalOpen(false)}
              className="absolute top-8 right-8 z-20 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <CardCalibrator onComplete={() => setIsCalibratorModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
