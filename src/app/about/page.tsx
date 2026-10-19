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
      finding: 'Myelinated A-alpha fibers carry touch at 80-120 m/s; unmyelinated C-fibers carry dull ache at 0.5-2.0 m/s.',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK10924/',
    },
    {
      domain: 'Computer Pioneer History',
      title: 'Grace Hopper\'s Nanosecond Wire Demonstration',
      citation: 'Smithsonian National Museum of American History (Admiral Grace Hopper Collection)',
      finding: 'Maximum cosmic distance light travels in 1 billionth of a second (1 ns) is 11.803 inches (29.98 cm).',
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
      finding: 'Voyager 1 distance > 24.5 billion km (> 164 AU); round-trip radio travel time ~45.4 hours at 17.0 km/s.',
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
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Museum Lobby</span>
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Curator&apos;s Methodology & Scientific Verification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How We Measure the Universe on Your Screen
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Every speed, latency delay, and visual comparison in this digital museum is anchored in peer-reviewed scientific literature, international physical standards, and NASA spacecraft telemetry.
        </p>
      </div>

      {/* Section 1: The Screen Calibration Math */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>Familiar Scale & Display Pixel Density Math</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">Why CSS Pixels Aren&apos;t Real Inches</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Browsers only understand CSS pixels—an abstract layout unit. A line of 100 CSS pixels might measure 25 millimeters on a desktop monitor, but only 14 millimeters on an ultra-high-density mobile phone.
        </p>
        <div className="p-4 rounded-2xl bg-slate-50 font-mono text-xs text-indigo-950 border border-slate-200 space-y-2">
          <div className="text-slate-400">{'// Physical Dimensions of universally familiar reference items:'}</div>
          <div>US Dollar Bill = 156.0 mm = 6.1417 inches</div>
          <div>Apple iPhone / Galaxy = ~147.0 mm = 5.787 inches</div>
          <div>US Quarter ($0.25) = 24.26 mm = 0.955 inches</div>
          <div className="pt-2 text-slate-400">{'// Convert Real Physical Millimeters to Display Pixels:'}</div>
          <div>PPMM (Pixels Per Millimeter) = PPI / 25.4</div>
          <div>Object_CSS_Pixels = Real_Object_mm * PPMM</div>
          <div className="pt-2 text-slate-400">{'// Real-World Physical Velocity to Screen Movement per Second:'}</div>
          <div>Speed_px_per_sec = Velocity_m_per_s * 1000 * PPMM * Zoom * SlowMo</div>
        </div>
      </div>

      {/* Section 2: Complete Peer-Reviewed Bibliography */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Complete Annotated Bibliography & Citations</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 hover:border-indigo-300 shadow-sm transition-all space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-indigo-600 uppercase font-bold">{ref.domain}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold underline"
                >
                  <span>Source Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h3 className="text-base font-bold text-slate-900">{ref.title}</h3>
              <p className="text-slate-500 italic">{ref.citation}</p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs">
                {ref.finding}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
