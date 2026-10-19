'use client';

import React from 'react';
import Link from 'next/link';
import { useSound } from '@/context/SoundContext';
import { Compass, Volume2, VolumeX } from 'lucide-react';

export default function Navbar() {
  const { isMuted, toggleMute, playClick } = useSound();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Clean Logo & Title */}
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

        {/* Minimal Right Controls: Sound Toggle & About Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/about"
            onClick={() => playClick(800)}
            className="text-xs font-mono font-medium text-slate-500 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Methodology
          </Link>

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
        </div>
      </div>
    </header>
  );
}
