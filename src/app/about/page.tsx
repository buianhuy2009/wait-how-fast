'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Calculator, ExternalLink, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  const references = [
    {
      domain: 'Geology & Geodesy',
      title: 'Global Plate Tectonics & Continental Drift',
      citation: 'USGS Global Plate Motion Models & NOAA Satellite Geodesy Database',
      finding: 'North America and Europe separate along the Mid-Atlantic Ridge at 2.5 cm/year (0.79 nm/s).',
      url: 'https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move',
    },
    {
      domain: 'Dermatology & Human Biology',
      title: 'Human Fingernail and Toenail Growth Rates',
      citation: 'Yaemsiri, S. et al., Journal of the European Academy of Dermatology and Venereology (2010)',
      finding: 'Fingernails grow at 3.47 mm/month (1.32 nm/s), requiring ~62 hours to advance 1 display pixel.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20015152/',
    },
    {
      domain: 'Neuroscience & Pain Physiology',
      title: 'Axonal Conduction Velocity in Nociceptors',
      citation: 'Purves, D. et al., Neuroscience (6th Edition, Chapter 10: Pain Mechanisms)',
      finding: 'Myelinated A-beta fibers carry touch at 120 m/s; unmyelinated C-fibers carry dull ache at 0.5-2.0 m/s.',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK10924/',
    },
    {
      domain: 'Computer Pioneer History',
      title: 'Grace Hopper\'s Nanosecond Wire Demonstration',
      citation: 'Smithsonian National Museum of American History (Admiral Grace Hopper Collection)',
      finding: 'Maximum cosmic distance light/electricity travels in 1 billionth of a second is 11.8 inches (29.98 cm).',
      url: 'https://americanhistory.si.edu/collections/search/object/nmah_692464',
    },
    {
      domain: 'Telecommunications & Fiber Optics',
      title: 'Optical Dispersion & Propagation Delay in Single-Mode Fiber',
      citation: 'ITU-T Recommendation G.652 (Characteristics of a single-mode optical fiber cable)',
      finding: 'Silica glass has refractive index n ≈ 1.468, slowing light to 204,190 km/s (4.897 µs/km one-way delay).',
      url: 'https://www.itu.int/rec/T-REC-G.652',
    },
    {
      domain: 'Astrophysics & Spacecraft Telemetry',
      title: 'Voyager 1 Deep Space Network Interstellar Status',
      citation: 'NASA Jet Propulsion Laboratory (JPL) Real-Time Spacecraft Telemetry',
      finding: 'Voyager 1 distance > 24.5 billion km (> 164 AU); round-trip radio travel time ~45.4 hours at 23 Watts.',
      url: 'https://voyager.jpl.nasa.gov/mission/status/',
    },
    {
      domain: 'Computer Systems Architecture',
      title: 'Latency Numbers Every Programmer Should Know',
      citation: 'Peter Norvig (Director of Research, Google) & Jeff Dean (Google Senior Fellow)',
      finding: 'Scaled at 1 ns = 1 human second: L1 cache is 0.5s, RAM is 1m 40s, SSD is 1.7 days, transatlantic API is 4.75 years.',
      url: 'https://norvig.com/21-days.html',
    },
    {
      domain: 'Visual Perception & Display Science',
      title: 'Retinal Persistence, Motion Blur & High Frame Rates',
      citation: 'Mark Rejhon (Blur Busters) & Hecht, S., Journal of General Physiology',
      finding: 'Movies at 24 FPS work via 180° shutter motion blur; interactive displays require > 60-120 Hz to sustain efference copy prediction.',
      url: 'https://blurbusters.com/',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Museum Lobby</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Curator&apos;s Methodology & Scientific Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How We Measure the Universe on Your Screen
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Every number, delay, and animation in this digital museum is anchored in peer-reviewed scientific literature, international physical standards, and NASA spacecraft telemetry.
        </p>
      </div>

      {/* Section 1: The Screen Calibration Math */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
          <Calculator className="w-4 h-4" />
          <span>The Screen Calibration Formula (ISO/IEC 7810 ID-1)</span>
        </div>
        <h2 className="text-xl font-bold text-white">Why CSS Pixels Aren&apos;t Real Inches</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Browsers only understand CSS pixels—an abstract layout unit. A line of 100 CSS pixels might measure 25 millimeters on a desktop monitor, but only 14 millimeters on an ultra-high-density mobile phone.
        </p>
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800 space-y-2">
          <div>{'// Physical Dimensions of standard credit card / school ID:'}</div>
          <div>Width = 85.60 mm = 3.3700787 inches</div>
          <div className="pt-2">{'// User matches on-screen box to physical card:'}</div>
          <div>PPI (Pixels Per Inch) = Box_Width_CSS_Pixels / 3.3700787</div>
          <div>PPMM (Pixels Per Millimeter) = Box_Width_CSS_Pixels / 85.60</div>
          <div className="pt-2">{'// Real-World Speed to Screen Pixels per Second:'}</div>
          <div>Speed_px_per_sec = Velocity_m_per_s * 1000 * PPMM * Zoom * SlowMo</div>
        </div>
      </div>

      {/* Section 2: Complete Peer-Reviewed Bibliography */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
          <BookOpen className="w-4 h-4" />
          <span>Complete Annotated Bibliography & Citations</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-indigo-400 uppercase font-semibold">{ref.domain}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:underline"
                >
                  <span>Source Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h3 className="text-sm font-bold text-white">{ref.title}</h3>
              <p className="text-slate-400 italic">{ref.citation}</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-200 font-mono text-[11px]">
                {ref.finding}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
