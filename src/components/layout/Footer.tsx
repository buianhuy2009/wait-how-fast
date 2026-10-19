'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 py-12 px-4 sm:px-6 lg:px-8 mt-20 shadow-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5 text-slate-900 font-black text-base">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>Wait, How Fast Is That?</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-md">
            An interactive digital museum of speed, network latency, data volume, and physical scale inspired by the tactile, playful curiosity of Neal.fun.
            Designed to give students, developers, and curious minds a tangible grasp of the physical universe and silicon reality.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Peer-Reviewed Formulas & Verified Real-World Benchmarks</span>
          </div>
        </div>

        {/* Museum Halls */}
        <div className="space-y-2 text-xs">
          <div className="font-mono text-slate-900 uppercase font-black text-[11px] mb-2 tracking-wider">
            Museum Exhibition Wings
          </div>
          <ul className="space-y-1.5 font-mono">
            <li>
              <Link href="/hall/speed" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Wing 1: Speed Track
              </Link>
            </li>
            <li>
              <Link href="/hall/biology" className="text-slate-600 hover:text-rose-600 transition-colors">
                Wing 2: The Speed of You
              </Link>
            </li>
            <li>
              <Link href="/hall/latency" className="text-slate-600 hover:text-cyan-600 transition-colors">
                Wing 3: Latency & Ping Arcade
              </Link>
            </li>
            <li>
              <Link href="/hall/data" className="text-slate-600 hover:text-indigo-600 transition-colors">
                Wing 4: The Data Flood
              </Link>
            </li>
            <li>
              <Link href="/hall/cpu" className="text-slate-600 hover:text-purple-600 transition-colors">
                Wing 5: Inside Your CPU
              </Link>
            </li>
            <li>
              <Link href="/hall/framerate" className="text-slate-600 hover:text-amber-600 transition-colors">
                Wing 6: Refresh & Vision Vault
              </Link>
            </li>
            <li>
              <Link href="/hall/cosmic" className="text-slate-600 hover:text-violet-600 transition-colors">
                Wing 7: The Cosmic Vault
              </Link>
            </li>
            <li>
              <Link href="/all" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                Grand Walkthrough (All Wings) &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Scientific Sources & Standards */}
        <div className="space-y-2 text-xs">
          <div className="font-mono text-slate-900 uppercase font-black text-[11px] mb-2 tracking-wider">
            Standards & Citations
          </div>
          <ul className="space-y-1.5 font-mono text-[11px] text-slate-500">
            <li>US Dollar & ID-1 Physical Scale</li>
            <li>NASA JPL Deep Space Network</li>
            <li>ITU-T G.652 Optical Glass Fiber</li>
            <li>NIST Standard Reference Data</li>
            <li>Smithsonian Grace Hopper Archive</li>
            <li className="pt-1">
              <Link href="/about" className="text-indigo-600 hover:underline font-bold">
                View Full Methodology &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <div>
          Wait, How Fast Is That? Digital Science Museum.
        </div>
        <div>
          Made for curious explorers everywhere.
        </div>
      </div>
    </footer>
  );
}
