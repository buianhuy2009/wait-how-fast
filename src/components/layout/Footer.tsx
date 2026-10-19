'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Wait, How Fast Is That?</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            An interactive digital museum of speed, network latency, data volume, and physical scale.
            Designed to give students, developers, and educators a tangible, intuitive grasp of how the physical universe and computer systems operate.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Peer-Reviewed Formulas & Verified Real-World Benchmarks</span>
          </div>
        </div>

        {/* Museum Halls */}
        <div className="space-y-2 text-xs">
          <div className="font-mono text-slate-200 uppercase font-bold text-[11px] mb-2 tracking-wider">
            Museum Halls
          </div>
          <ul className="space-y-1.5 font-mono">
            <li>
              <Link href="/hall/speed" className="hover:text-cyan-400 transition-colors">
                Hall 1: 1:1 True-Scale Speed
              </Link>
            </li>
            <li>
              <Link href="/hall/latency" className="hover:text-cyan-400 transition-colors">
                Hall 2: Latency & Ping Arcade
              </Link>
            </li>
            <li>
              <Link href="/hall/data" className="hover:text-cyan-400 transition-colors">
                Hall 3: The Data Flood (Bits vs Bytes)
              </Link>
            </li>
            <li>
              <Link href="/hall/cpu" className="hover:text-cyan-400 transition-colors">
                Hall 4: CPU Time Dilation
              </Link>
            </li>
            <li>
              <Link href="/hall/framerate" className="hover:text-cyan-400 transition-colors">
                Hall 5: Frame Rate & Persistence
              </Link>
            </li>
            <li>
              <Link href="/all" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Grand Walkthrough (All Halls)
              </Link>
            </li>
          </ul>
        </div>

        {/* Scientific Sources & Standards */}
        <div className="space-y-2 text-xs">
          <div className="font-mono text-slate-200 uppercase font-bold text-[11px] mb-2 tracking-wider">
            Standards & Citations
          </div>
          <ul className="space-y-1.5 font-mono text-[11px]">
            <li className="flex items-center gap-1">
              <span>ISO/IEC 7810 ID-1 (Card Width)</span>
            </li>
            <li className="flex items-center gap-1">
              <span>NASA JPL Deep Space Network</span>
            </li>
            <li className="flex items-center gap-1">
              <span>ITU-T G.652 Optical Glass Fiber</span>
            </li>
            <li className="flex items-center gap-1">
              <span>NIST Standard Reference Data</span>
            </li>
            <li className="flex items-center gap-1">
              <span>Smithsonian Grace Hopper Archive</span>
            </li>
            <li className="pt-1">
              <Link href="/about" className="text-cyan-400 hover:underline">
                View Full Methodology &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Built with Pride */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <div>
          Built with Next.js, TypeScript & Web Audio API. Ready for Vercel edge deployment.
        </div>
        <div className="flex items-center gap-1">
          Made for 7th-grade science explorers everywhere.
        </div>
      </div>
    </footer>
  );
}
