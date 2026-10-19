'use client';

import React, { useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { ArrowDown, Sparkles } from 'lucide-react';

interface DataStep {
  size: string;
  bytes: number;
  quantityTitle: string;
  analogyHeadline: string;
  icon: string;
  description: string;
  comparisonFact: string;
  techExample: string;
  illustrationKey: '1b' | '1kb' | '1mb' | '1gb' | '1tb' | '1pb';
}

const DATA_RICE_STEPS: DataStep[] = [
  {
    size: '1 Byte',
    bytes: 1,
    quantityTitle: '1 Grain of Rice • 0.029 g',
    analogyHeadline: 'A single grain balanced on your fingertip',
    icon: '🍚',
    description: 'Weighs 0.029 grams. You could balance it on the tip of your pinky finger without feeling any weight. Fits on the head of a pushpin.',
    comparisonFact: 'Fits easily on the head of a pushpin or 1mm ruler notch.',
    techExample: 'A single typed letter like "A" in a text file.',
    illustrationKey: '1b',
  },
  {
    size: '1 Kilobyte (KB)',
    bytes: 1_000,
    quantityTitle: '1,000 Grains • 29 grams',
    analogyHeadline: 'A snack bowl of rice in your palm',
    icon: '🥄',
    description: 'About 2 tablespoons of rice. Fits comfortably in your cupped hand, weighing 29 grams—about as much as a single slice of sandwich bread.',
    comparisonFact: 'Exact same weight as 1 slice of sandwich bread.',
    techExample: 'A short paragraph of text or a plain text email.',
    illustrationKey: '1kb',
  },
  {
    size: '1 Megabyte (MB)',
    bytes: 1_000_000,
    quantityTitle: '1 Million Grains • 29 kg (64 lbs)',
    analogyHeadline: 'A restaurant burlap sack of rice',
    icon: '🐕',
    description: 'A heavy commercial sack of rice. Weighs 29 kg (64 lbs)—exactly as heavy as an adult Golden Retriever! Requires two hands and bent knees to lift.',
    comparisonFact: 'Heavier than an average 8-year-old child or adult Golden Retriever.',
    techExample: 'A 1-minute MP3 song or high-resolution smartphone photo.',
    illustrationKey: '1mb',
  },
  {
    size: '1 Gigabyte (GB)',
    bytes: 1_000_000_000,
    quantityTitle: '1 Billion Grains • 29 Metric Tons',
    analogyHeadline: 'A 40-foot freight shipping container',
    icon: '📦',
    description: 'Fills a full-sized 40-foot intermodal steel shipping container to the ceiling. Heavy as two city buses—needs an industrial port crane to lift!',
    comparisonFact: '29 Metric Tons: enough rice to feed 1 human for 100 years.',
    techExample: 'A 1-hour high-definition 1080p video stream.',
    illustrationKey: '1gb',
  },
  {
    size: '1 Terabyte (TB)',
    bytes: 1_000_000_000_000,
    quantityTitle: '1 Trillion Grains • 29,000 Metric Tons',
    analogyHeadline: 'An ocean cargo container ship fleet',
    icon: '🚢',
    description: 'A massive 400-meter ocean cargo freighter carrying 1,000 shipping containers full of rice cutting across the Pacific Ocean.',
    comparisonFact: '1,000 shipping containers on a freighter, or paper 5.6x higher than Mt. Everest.',
    techExample: 'A modern computer SSD hard drive holding an entire library.',
    illustrationKey: '1tb',
  },
  {
    size: '1 Petabyte (PB)',
    bytes: 1_000_000_000_000_000,
    quantityTitle: '1 Quadrillion Grains • 29 Million Metric Tons',
    analogyHeadline: 'A mountain of rice dwarfing Mount Everest',
    icon: '🏔️',
    description: 'A colossal mountain of rice towering above the clouds, dwarfing Mount Everest (8,848m). If dumped over New York City, it would bury all of Manhattan knee-deep!',
    comparisonFact: 'Dwarfs Mount Everest! 500 billion sheets would wrap around Earth 1.25 times.',
    techExample: 'All photos uploaded to Facebook or 500 billion pages of printed text.',
    illustrationKey: '1pb',
  },
];

const DATA_PAPER_STEPS: DataStep[] = [
  {
    size: '1 Byte',
    bytes: 1,
    quantityTitle: '1 Sheet of Paper • 0.1 mm (100 µm)',
    analogyHeadline: 'A single page held between two fingertips',
    icon: '📄',
    description: 'Standard 20 lb copy paper is exactly 0.1 millimeters thick (100 micrometers). As thin as a single human hair, effortlessly fluttering in the wind.',
    comparisonFact: 'Thickness: 0.1 mm (same as a strand of human hair).',
    techExample: 'A single typed letter like "A" in a text file.',
    illustrationKey: '1b',
  },
  {
    size: '1 Kilobyte (KB)',
    bytes: 1_000,
    quantityTitle: '1,000 Sheets • 10 cm (4 inches)',
    analogyHeadline: 'Two reams of paper stacked on a desk',
    icon: '📚',
    description: 'A standard pack (ream) is 500 sheets (5 cm). 1,000 sheets is two full reams stacked high—the exact height of a coffee mug, weighing 5 kg (11 lbs).',
    comparisonFact: 'Height: 10 cm (exact height of a standard coffee mug).',
    techExample: 'A short paragraph of text or a plain text email.',
    illustrationKey: '1kb',
  },
  {
    size: '1 Megabyte (MB)',
    bytes: 1_000_000,
    quantityTitle: '1 Million Sheets • 100 meters (328 ft)',
    analogyHeadline: 'A paper tower taller than the Statue of Liberty',
    icon: '🗽',
    description: 'Stacking 1,000,000 sheets reaches 100 meters (328 feet) into the sky! It looms taller than both Big Ben (96m) and the Statue of Liberty (93m).',
    comparisonFact: 'Height: 100 meters (taller than Statue of Liberty 93m).',
    techExample: 'A 1-minute MP3 song or high-resolution smartphone photo.',
    illustrationKey: '1mb',
  },
  {
    size: '1 Gigabyte (GB)',
    bytes: 1_000_000_000,
    quantityTitle: '1 Billion Sheets • 100 kilometers (62 miles)',
    analogyHeadline: 'A paper needle piercing the edge of space (Kármán Line)',
    icon: '🚀',
    description: '1 billion sheets reaches 100 kilometers into the sky—the internationally recognized boundary of outer space! It shoots past jetliners and auroras right up to low satellites.',
    comparisonFact: 'Height: 100 km (11x higher than Mount Everest, reaches space).',
    techExample: 'A 1-hour high-definition 1080p video stream.',
    illustrationKey: '1gb',
  },
  {
    size: '1 Terabyte (TB)',
    bytes: 1_000_000_000_000,
    quantityTitle: '1 Trillion Sheets • 100,000 km (62,137 miles)',
    analogyHeadline: 'A cosmic ribbon spanning 1/4 the way to the Moon',
    icon: '🌙',
    description: '100,000 kilometers! This colossal ribbon of paper wraps around Earth’s entire equator 2.5 times, or extends more than one-quarter of the total distance from Earth to the Moon (384,400 km).',
    comparisonFact: 'Height: 100,000 km (wraps Earth 2.5x; 26% to the Moon).',
    techExample: 'A modern computer SSD hard drive holding an entire library.',
    illustrationKey: '1tb',
  },
  {
    size: '1 Petabyte (PB)',
    bytes: 1_000_000_000_000_000,
    quantityTitle: '1 Quadrillion Sheets • 100,000,000 km (62 Million mi)',
    analogyHeadline: 'A paper bridge spanning 2/3 of the distance to the Sun!',
    icon: '☀️',
    description: '100,000,000 kilometers of stacked paper! This mind-boggling stack shoots past the orbit of Venus and stretches two-thirds of the entire distance from Earth to the Sun (150,000,000 km).',
    comparisonFact: 'Height: 100,000,000 km (2/3 the distance to the Sun).',
    techExample: 'All photos uploaded to Facebook or 500 billion pages of printed text.',
    illustrationKey: '1pb',
  },
];

function StepIllustration({
  stepKey,
  mode,
}: {
  stepKey: '1b' | '1kb' | '1mb' | '1gb' | '1tb' | '1pb';
  mode: 'rice' | 'paper';
}) {
  if (mode === 'paper') {
    switch (stepKey) {
      case '1b':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="200" rx="16" fill="#f8fafc" />
            <circle cx="160" cy="100" r="75" fill="#f1f5f9" />

            {/* Fingertips pinching sheet */}
            <path d="M90 160 C100 125, 135 110, 150 105 C158 102, 162 108, 158 116 C148 135, 120 175, 105 190 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
            <path d="M190 160 C180 125, 165 110, 160 105 C155 102, 152 108, 155 116 C162 135, 175 175, 185 190 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />

            {/* A single sheet of paper edge-on */}
            <g transform="translate(160, 95)">
              <rect x="-40" y="-35" width="80" height="50" rx="2" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="-30" y1="-20" x2="10" y2="-20" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-30" y1="-10" x2="30" y2="-10" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-30" y1="0" x2="20" y2="0" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Caliper caliper measuring 0.1 mm */}
            <line x1="120" y1="35" x2="200" y2="35" stroke="#64748b" strokeWidth="2" />
            <line x1="120" y1="28" x2="120" y2="42" stroke="#64748b" strokeWidth="2" />
            <line x1="200" y1="28" x2="200" y2="42" stroke="#64748b" strokeWidth="2" />
            <text x="160" y="24" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">0.1 mm (100 µm)</text>

            {/* Badge */}
            <rect x="55" y="160" width="210" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x="160" y="176" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              1 SHEET = 0.1 mm (HUMAN HAIR THIN)
            </text>
          </svg>
        );

      case '1kb':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="200" rx="16" fill="#f8fafc" />
            <line x1="20" y1="160" x2="300" y2="160" stroke="#cbd5e1" strokeWidth="2" />

            {/* 2 Reams of Paper Stacked (10 cm tall) */}
            <g transform="translate(100, 110)">
              {/* Shadow */}
              <ellipse cx="0" cy="50" rx="50" ry="8" fill="#cbd5e1" opacity="0.6" />
              {/* Bottom Ream (500 sheets = 5 cm) */}
              <rect x="-45" y="22" width="90" height="26" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
              <rect x="-43" y="32" width="86" height="6" fill="#38bdf8" opacity="0.5" />
              <text x="0" y="38" textAnchor="middle" fill="#0369a1" fontSize="6" fontFamily="monospace" fontWeight="bold">REAM 1 (500 SHEETS)</text>

              {/* Top Ream (500 sheets = 5 cm) */}
              <rect x="-45" y="-6" width="90" height="26" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
              <rect x="-43" y="4" width="86" height="6" fill="#38bdf8" opacity="0.5" />
              <text x="0" y="10" textAnchor="middle" fill="#0369a1" fontSize="6" fontFamily="monospace" fontWeight="bold">REAM 2 (500 SHEETS)</text>

              {/* Height Bracket */}
              <path d="M52 -6 L58 -6 L58 48 L52 48" stroke="#0284c7" strokeWidth="1.5" fill="none" />
              <text x="64" y="25" fill="#0284c7" fontSize="9" fontFamily="monospace" fontWeight="bold">10 cm</text>
            </g>

            {/* Coffee Mug next to reams for scale (10 cm tall) */}
            <g transform="translate(230, 118)">
              <ellipse cx="0" cy="42" rx="22" ry="6" fill="#cbd5e1" opacity="0.6" />
              {/* Mug body */}
              <rect x="-18" y="-12" width="36" height="52" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
              {/* Mug handle */}
              <path d="M18 0 C30 0, 30 30, 18 30" stroke="#b91c1c" strokeWidth="3" fill="none" />
              {/* Steam */}
              <path d="M-6 -20 Q-4 -28 -6 -34" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
              <path d="M4 -22 Q6 -30 4 -36" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
              <text x="0" y="18" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">COFFEE MUG</text>
              <text x="0" y="27" textAnchor="middle" fill="#fee2e2" fontSize="6.5" fontFamily="monospace">(10 CM)</text>
            </g>

            <text x="175" y="125" textAnchor="middle" fill="#0284c7" fontSize="18" fontWeight="bold">=</text>

            {/* Badge */}
            <rect x="50" y="16" width="220" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x="160" y="32" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              1,000 SHEETS = 10 CM (COFFEE MUG HEIGHT)
            </text>
          </svg>
        );

      case '1mb':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="200" rx="16" fill="#f8fafc" />
            <line x1="20" y1="168" x2="300" y2="168" stroke="#cbd5e1" strokeWidth="2" />

            {/* 100-Meter Paper Skyscraper Tower */}
            <g transform="translate(105, 110)">
              <rect x="-16" y="-70" width="32" height="128" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
              {/* Stack slices */}
              {[-50, -30, -10, 10, 30].map((y) => (
                <line key={y} x1="-16" y1={y} x2="16" y2={y} stroke="#cbd5e1" strokeWidth="1" />
              ))}
              <text x="0" y="-80" textAnchor="middle" fill="#0284c7" fontSize="8" fontFamily="monospace" fontWeight="black">
                100 METERS
              </text>
              <text x="0" y="-15" textAnchor="middle" fill="#0369a1" fontSize="7" fontFamily="monospace" fontWeight="bold">
                1 MILLION
              </text>
              <text x="0" y="-5" textAnchor="middle" fill="#0369a1" fontSize="6" fontFamily="monospace">
                SHEETS
              </text>
            </g>

            {/* Statue of Liberty (93 m) beside tower */}
            <g transform="translate(225, 120)">
              {/* Pedestal */}
              <rect x="-18" y="18" width="36" height="30" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
              {/* Statue body */}
              <path d="M-8 18 L-5 -45 L5 -45 L8 18 Z" fill="#0d9488" stroke="#0f766e" strokeWidth="1" />
              {/* Torch arm raised */}
              <line x1="4" y1="-40" x2="14" y2="-65" stroke="#0d9488" strokeWidth="2" />
              <circle cx="14" cy="-66" r="3" fill="#f59e0b" />
              {/* Crown */}
              <circle cx="0" cy="-48" r="5" fill="#0d9488" />
              <text x="0" y="32" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">STATUE OF</text>
              <text x="0" y="40" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontFamily="monospace" fontWeight="bold">LIBERTY (93m)</text>
            </g>

            <text x="165" y="105" textAnchor="middle" fill="#64748b" fontSize="14" fontWeight="bold">&gt;</text>

            {/* Badge */}
            <rect x="35" y="14" width="250" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
            <text x="160" y="30" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
              1 MILLION SHEETS = 100m (TALLER THAN STATUE OF LIBERTY)
            </text>
          </svg>
        );

      case '1gb':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Atmosphere gradient from sky to black space */}
            <rect width="320" height="200" rx="16" fill="#0b132b" />
            <rect x="0" y="120" width="320" height="80" fill="#38bdf8" opacity="0.3" />

            {/* Ground */}
            <line x1="0" y1="185" x2="320" y2="185" stroke="#334155" strokeWidth="2" />

            {/* Paper needle reaching 100 km space */}
            <g transform="translate(140, 185)">
              <line x1="0" y1="0" x2="0" y2="-155" stroke="#ffffff" strokeWidth="3" />
              <circle cx="0" cy="-155" r="4" fill="#38bdf8" />
            </g>

            {/* Altitude Markers */}
            <g transform="translate(195, 30)" fontFamily="monospace" fontSize="8" fill="#94a3b8">
              <text x="0" y="10" fill="#38bdf8" fontWeight="bold">100 km: KÁRMÁN LINE (SPACE!)</text>
              <line x1="-50" y1="8" x2="-2" y2="8" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

              <text x="0" y="60">50 km: Stratosphere</text>
              <text x="0" y="110">10 km: Jet Cruising Altitude</text>
              <text x="0" y="145">8.8 km: Mt. Everest Peak</text>
            </g>

            {/* Orbiting Satellite in space */}
            <g transform="translate(70, 35)">
              <rect x="-8" y="-4" width="16" height="8" fill="#94a3b8" />
              <line x1="-18" y1="0" x2="-8" y2="0" stroke="#38bdf8" strokeWidth="2" />
              <line x1="8" y1="0" x2="18" y2="0" stroke="#38bdf8" strokeWidth="2" />
              <text x="0" y="-8" textAnchor="middle" fill="#e2e8f0" fontSize="7" fontFamily="monospace">Satellite</text>
            </g>

            {/* Airplane at 10km */}
            <g transform="translate(80, 140) scale(0.6)">
              <path d="M0 0 L15 -3 L25 0 L15 3 Z" fill="#ffffff" />
              <line x1="8" y1="-8" x2="14" y2="8" stroke="#ffffff" strokeWidth="2" />
            </g>

            {/* Badge */}
            <rect x="40" y="10" width="240" height="22" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="160" y="24" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              1 BILLION SHEETS = 100 KM (PIERCES INTO OUTER SPACE)
            </text>
          </svg>
        );

      case '1tb':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Deep Space Background */}
            <rect width="320" height="200" rx="16" fill="#030712" />

            {/* Stars */}
            {[[30, 40], [80, 25], [140, 60], [210, 30], [290, 50], [60, 160], [260, 150]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1" fill="#ffffff" opacity="0.8" />
            ))}

            {/* Earth on Left */}
            <g transform="translate(70, 110)">
              <circle cx="0" cy="0" r="38" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <path d="M-20 -15 Q-5 -30 15 -15 Q25 0 10 20 Q-10 30 -25 15 Z" fill="#10b981" opacity="0.7" />
              <text x="0" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold">EARTH</text>
            </g>

            {/* Moon on Far Right */}
            <g transform="translate(275, 75)">
              <circle cx="0" cy="0" r="14" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <circle cx="-3" cy="-2" r="3" fill="#94a3b8" opacity="0.5" />
              <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="7" fontFamily="monospace">MOON (384,400 km)</text>
            </g>

            {/* 100,000 km Paper Ribbon stretching 1/4 the way to Moon */}
            <path
              d="M70 72 C120 40, 140 85, 175 80"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Distance marker */}
            <line x1="70" y1="125" x2="175" y2="125" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="122" y="138" textAnchor="middle" fill="#facc15" fontSize="8" fontFamily="monospace" fontWeight="bold">
              100,000 KM (26% TO MOON)
            </text>

            {/* Equator wrapping loop */}
            <ellipse cx="70" cy="110" rx="44" ry="14" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
            <text x="70" y="16" textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace">
              Wraps Earth Equator 2.5 times!
            </text>

            {/* Badge */}
            <rect x="35" y="170" width="250" height="22" rx="6" fill="#1e293b" stroke="#facc15" strokeWidth="1" />
            <text x="160" y="185" textAnchor="middle" fill="#facc15" fontSize="9" fontFamily="monospace" fontWeight="bold">
              1 TRILLION SHEETS = 100,000 KM (1/4 WAY TO THE MOON)
            </text>
          </svg>
        );

      case '1pb':
        return (
          <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="200" rx="16" fill="#020617" />

            {/* Giant Sun on Left */}
            <g transform="translate(10, 100)">
              <circle cx="0" cy="0" r="50" fill="#f59e0b" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="0" cy="0" r="62" fill="#f59e0b" opacity="0.2" />
              <text x="15" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="black">SUN</text>
            </g>

            {/* Planetary Orbits */}
            <ellipse cx="10" cy="100" rx="80" ry="60" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <ellipse cx="10" cy="100" rx="140" ry="75" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <ellipse cx="10" cy="100" rx="280" ry="90" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" fill="none" />

            {/* Earth at 150 Million km */}
            <g transform="translate(290, 100)">
              <circle cx="0" cy="0" r="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="20" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace" fontWeight="bold">EARTH (150M km)</text>
            </g>

            {/* Venus */}
            <g transform="translate(150, 75)">
              <circle cx="0" cy="0" r="5" fill="#f97316" />
              <text x="0" y="-8" textAnchor="middle" fill="#fed7aa" fontSize="6" fontFamily="monospace">Venus</text>
            </g>

            {/* 100,000,000 km Golden Paper Stack stretching from Earth 2/3 towards the Sun */}
            <line x1="290" y1="100" x2="103" y2="100" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <circle cx="103" cy="100" r="3" fill="#ffffff" />

            <text x="195" y="90" textAnchor="middle" fill="#fef08a" fontSize="8" fontFamily="monospace" fontWeight="black">
              100,000,000 KM PAPER BRIDGE (2/3 TO SUN!)
            </text>

            {/* Badge */}
            <rect x="25" y="170" width="270" height="22" rx="6" fill="#1e293b" stroke="#eab308" strokeWidth="1" />
            <text x="160" y="185" textAnchor="middle" fill="#facc15" fontSize="9" fontFamily="monospace" fontWeight="bold">
              1 PETABYTE = 100M KM &bull; SPANS 2/3 OF DISTANCE TO THE SUN!
            </text>
          </svg>
        );
    }
  }

  // Rice mode illustrations
  switch (stepKey) {
    case '1b':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#f8fafc" />
          <circle cx="160" cy="100" r="75" fill="#f1f5f9" />
          <circle cx="160" cy="100" r="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

          {/* Fingertip silhouette */}
          <path
            d="M80 170 C90 130, 130 115, 145 110 C155 107, 160 115, 155 125 C145 145, 110 185, 100 200 Z"
            fill="#fed7aa"
            stroke="#ea580c"
            strokeWidth="1.5"
          />
          {/* Fingernail */}
          <path d="M125 125 C132 118, 145 116, 148 122 C142 128, 134 130, 125 125 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />

          {/* Single grain of rice */}
          <g transform="translate(160, 95) rotate(-25)">
            <ellipse cx="2" cy="4" rx="12" ry="5" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="0" cy="0" rx="12" ry="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
            <ellipse cx="-2" cy="-1.5" rx="7" ry="2" fill="#f8fafc" />
          </g>

          {/* Magnifying lens ring callout */}
          <circle cx="160" cy="95" r="30" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="182" y1="116" x2="205" y2="135" stroke="#0284c7" strokeWidth="2" />

          {/* Ruler tick mark */}
          <line x1="60" y1="50" x2="110" y2="50" stroke="#64748b" strokeWidth="2" />
          <line x1="60" y1="42" x2="60" y2="58" stroke="#64748b" strokeWidth="2" />
          <line x1="110" y1="42" x2="110" y2="58" stroke="#64748b" strokeWidth="2" />
          <line x1="85" y1="45" x2="85" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="85" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">1 mm</text>

          {/* Pushpin next to it */}
          <g transform="translate(235, 75)">
            <ellipse cx="0" cy="0" rx="8" ry="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
            <path d="M-6 0 L-3 -16 L3 -16 L6 0 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
            <circle cx="0" cy="-16" r="4" fill="#dc2626" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="0" y="32" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Pushpin</text>
          </g>

          {/* Callout badge */}
          <rect x="180" y="145" width="125" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <text x="242" y="161" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1 GRAIN = 0.029g
          </text>
        </svg>
      );

    case '1kb':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#f8fafc" />
          <line x1="20" y1="155" x2="300" y2="155" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="20" y="156" width="280" height="30" fill="#f1f5f9" opacity="0.6" />

          {/* Kitchen Rice Bowl */}
          <g transform="translate(110, 110)">
            <ellipse cx="0" cy="46" rx="55" ry="10" fill="#cbd5e1" opacity="0.5" />
            <ellipse cx="0" cy="8" rx="46" ry="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <ellipse cx="-15" cy="4" rx="4" ry="2" fill="#e2e8f0" />
            <ellipse cx="5" cy="0" rx="4" ry="2" fill="#e2e8f0" />
            <ellipse cx="-8" cy="12" rx="4" ry="2" fill="#e2e8f0" />
            <ellipse cx="18" cy="8" rx="4" ry="2" fill="#e2e8f0" />
            <ellipse cx="0" cy="-4" rx="4" ry="2" fill="#e2e8f0" />
            <path
              d="M-50 10 C-50 45, 50 45, 50 10 C40 12, -40 12, -50 10 Z"
              fill="#ffffff"
              stroke="#64748b"
              strokeWidth="2"
            />
            <ellipse cx="0" cy="10" rx="50" ry="10" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M-20 4 C-35 -20, -50 -35, -55 -40" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="-18" cy="6" rx="8" ry="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* Slice of Bread next to bowl (same weight = 29g) */}
          <g transform="translate(225, 115)">
            <ellipse cx="0" cy="40" rx="30" ry="6" fill="#cbd5e1" opacity="0.5" />
            <path
              d="M-25 15 C-28 0, -22 -15, -12 -18 C0 -22, 12 -18, 22 -18 C28 0, 25 15, 25 35 C15 37, -15 37, -25 35 Z"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="1.5"
            />
            <path
              d="M-20 15 C-22 2, -18 -10, -10 -12 C0 -15, 10 -12, 18 -12 C22 2, 20 15, 20 30 C10 32, -10 32, -20 30 Z"
              fill="#fffbeb"
            />
            <text x="0" y="10" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="monospace" fontWeight="bold">1 SLICE</text>
            <text x="0" y="20" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="monospace">OF BREAD</text>
          </g>

          <text x="172" y="125" textAnchor="middle" fill="#0284c7" fontSize="20" fontWeight="bold">=</text>

          <rect x="65" y="18" width="190" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <text x="160" y="34" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1,000 GRAINS = 29g (1 SNACK BOWL)
          </text>
        </svg>
      );

    case '1mb':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#f8fafc" />
          <line x1="20" y1="165" x2="300" y2="165" stroke="#cbd5e1" strokeWidth="2" />

          {/* Commercial Burlap Sack of Rice (29 kg) */}
          <g transform="translate(100, 115)">
            <ellipse cx="0" cy="50" rx="42" ry="10" fill="#cbd5e1" opacity="0.6" />
            <path
              d="M-36 48 C-42 10, -32 -20, -15 -35 C-5 -42, 5 -42, 15 -35 C32 -20, 42 10, 36 48 C20 52, -20 52, -36 48 Z"
              fill="#d4a373"
              stroke="#8d5b4c"
              strokeWidth="2"
            />
            <ellipse cx="0" cy="-34" rx="14" ry="4" fill="#a98467" stroke="#6c584c" strokeWidth="1.5" />
            <path d="M-8 -38 C-12 -46, 12 -46, 8 -38 Z" fill="#d4a373" stroke="#8d5b4c" strokeWidth="1.5" />
            <rect x="-24" y="-5" width="48" height="32" rx="4" fill="#faedcd" stroke="#8d5b4c" strokeWidth="1" strokeDasharray="2 2" />
            <text x="0" y="7" textAnchor="middle" fill="#6c584c" fontSize="8" fontFamily="monospace" fontWeight="black">1 MB RICE</text>
            <text x="0" y="18" textAnchor="middle" fill="#8d5b4c" fontSize="7" fontFamily="monospace" fontWeight="bold">29 KG (64 LBS)</text>
          </g>

          {/* Full-grown Golden Retriever silhouette (same weight: 29 kg) */}
          <g transform="translate(220, 125)">
            <ellipse cx="0" cy="40" rx="45" ry="8" fill="#cbd5e1" opacity="0.6" />
            <path
              d="M-30 20 C-35 5, -25 -10, -10 -10 C5 -10, 20 0, 30 5 C35 15, 30 25, 25 35 C20 38, -25 38, -30 20 Z"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            <circle cx="32" cy="-4" r="12" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <path d="M30 -8 C34 -15, 42 -6, 38 2 Z" fill="#d97706" />
            <ellipse cx="40" cy="-2" rx="4" ry="3" fill="#fbbf24" />
            <circle cx="43" cy="-3" r="2" fill="#1e293b" />
            <line x1="-22" y1="30" x2="-22" y2="40" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <line x1="-12" y1="30" x2="-12" y2="40" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="30" x2="15" y2="40" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <line x1="25" y1="30" x2="25" y2="40" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            <path d="M-30 15 C-42 10, -45 -5, -40 -12" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />

            <text x="0" y="52" textAnchor="middle" fill="#b45309" fontSize="8" fontFamily="monospace" fontWeight="bold">
              GOLDEN RETRIEVER (29 KG)
            </text>
          </g>

          <text x="158" y="115" textAnchor="middle" fill="#0284c7" fontSize="20" fontWeight="bold">=</text>

          <rect x="50" y="18" width="220" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <text x="160" y="34" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1 MILLION GRAINS = 29 KG (BURLAP SACK)
          </text>
        </svg>
      );

    case '1gb':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#f8fafc" />
          <line x1="15" y1="165" x2="305" y2="165" stroke="#cbd5e1" strokeWidth="2" />

          {/* Industrial 40-foot Shipping Container (29 Metric Tons) */}
          <g transform="translate(130, 115)">
            <rect x="-95" y="46" width="190" height="8" rx="4" fill="#cbd5e1" opacity="0.6" />
            <rect x="-95" y="-30" width="190" height="76" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            {[-80, -65, -50, -35, -20, -5, 10, 25, 40, 55, 70].map((cx) => (
              <line key={cx} x1={cx} y1="-28" x2={cx} y2="44" stroke="#0369a1" strokeWidth="2" />
            ))}
            <rect x="-95" y="-30" width="12" height="12" fill="#0369a1" />
            <rect x="83" y="-30" width="12" height="12" fill="#0369a1" />
            <rect x="-95" y="34" width="12" height="12" fill="#0369a1" />
            <rect x="83" y="34" width="12" height="12" fill="#0369a1" />
            <rect x="-50" y="2" width="100" height="22" rx="3" fill="#ffffff" opacity="0.9" />
            <text x="0" y="14" textAnchor="middle" fill="#0f172a" fontSize="8" fontFamily="monospace" fontWeight="black">
              1 GB &bull; 40-FT CONTAINER
            </text>
            <text x="0" y="21" textAnchor="middle" fill="#0284c7" fontSize="6.5" fontFamily="monospace" fontWeight="bold">
              29 METRIC TONS RICE
            </text>
          </g>

          {/* Car parked next to container for scale */}
          <g transform="translate(265, 148)">
            <path
              d="M-22 8 C-20 0, -12 -5, -4 -5 L8 -5 C14 -5, 18 0, 22 8 Z"
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1"
            />
            <rect x="-24" y="5" width="48" height="10" rx="2" fill="#dc2626" />
            <circle cx="-14" cy="15" r="5" fill="#1e293b" />
            <circle cx="14" cy="15" r="5" fill="#1e293b" />
            <text x="0" y="26" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Car for Scale</text>
          </g>

          {/* Crane Hook above container */}
          <path d="M130 10 L130 45" stroke="#eab308" strokeWidth="3" />
          <path d="M120 45 C120 60, 140 60, 140 45 C140 40, 130 40, 130 52" stroke="#ca8a04" strokeWidth="2.5" fill="none" />

          <rect x="45" y="16" width="230" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <text x="160" y="32" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1 BILLION GRAINS = 40-FT CONTAINER (29 TONS)
          </text>
        </svg>
      );

    case '1tb':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#f8fafc" />

          {/* Ocean Waves */}
          <path d="M0 160 Q40 150 80 160 T160 160 T240 160 T320 160 L320 200 L0 200 Z" fill="#0284c7" opacity="0.3" />
          <path d="M0 170 Q40 162 80 170 T160 170 T240 170 T320 170 L320 200 L0 200 Z" fill="#0369a1" opacity="0.7" />

          {/* Massive Ocean Cargo Freighter Container Ship */}
          <g transform="translate(130, 140)">
            <path d="M-90 15 L100 15 L115 0 L-85 0 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M-85 0 L-70 -10 L95 -10 L115 0 Z" fill="#dc2626" />
            <rect x="75" y="-30" width="22" height="20" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <line x1="86" y1="-30" x2="86" y2="-40" stroke="#64748b" strokeWidth="1.5" />
            {[-65, -45, -25, -5, 15, 35, 55].map((sx, i) => (
              <g key={sx}>
                <rect x={sx} y="-18" width="18" height="8" fill={i % 2 === 0 ? '#0284c7' : '#eab308'} stroke="#0f172a" strokeWidth="0.8" />
                <rect x={sx} y="-26" width="18" height="8" fill={i % 3 === 0 ? '#10b981' : '#f97316'} stroke="#0f172a" strokeWidth="0.8" />
                <rect x={sx} y="-34" width="18" height="8" fill={i % 2 === 1 ? '#8b5cf6' : '#ef4444'} stroke="#0f172a" strokeWidth="0.8" />
              </g>
            ))}
            <text x="15" y="26" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold">
              1,000 CONTAINERS (29,000 METRIC TONS)
            </text>
          </g>

          <rect x="40" y="12" width="240" height="24" rx="8" fill="#ffffff" stroke="#0284c7" strokeWidth="1" />
          <text x="160" y="28" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1 TRILLION GRAINS = FREIGHTER FLEET (29,000 TONS)
          </text>
        </svg>
      );

    case '1pb':
      return (
        <svg viewBox="0 0 320 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="200" rx="16" fill="#090d16" />

          {/* Stars */}
          {[
            [30, 30], [80, 20], [150, 15], [220, 25], [290, 40],
            [45, 70], [270, 80], [190, 45], [110, 55]
          ].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r="1" fill="#ffffff" opacity="0.8" />
          ))}

          {/* Earth's Curved Horizon */}
          <path d="M-40 210 Q160 155 360 210 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M-40 215 Q160 162 360 215 Z" fill="#0f172a" />

          {/* Colossal Mountain of Rice Dwarfing Everything */}
          <path
            d="M50 178 L160 50 L270 178 Z"
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <path d="M160 50 Q150 110 135 178" stroke="#cbd5e1" strokeWidth="1.5" />
          <path d="M160 50 Q175 115 190 178" stroke="#e2e8f0" strokeWidth="1.5" />
          <path d="M130 90 L160 50 L185 85 Z" fill="#f8fafc" />

          {/* Mount Everest drawn tiny for scale comparison */}
          <g transform="translate(85, 178)">
            <path d="M-15 0 L0 -26 L15 0 Z" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <path d="M-4 -20 L0 -26 L4 -20 Z" fill="#ffffff" />
            <text x="0" y="-30" textAnchor="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace" fontWeight="bold">
              MT. EVEREST (8.8 KM)
            </text>
          </g>

          {/* Tiny Manhattan skyline at bottom base */}
          <g transform="translate(225, 178)">
            <rect x="-4" y="-12" width="4" height="12" fill="#e2e8f0" />
            <line x1="-2" y1="-16" x2="-2" y2="-12" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="2" y="-8" width="5" height="8" fill="#cbd5e1" />
            <rect x="9" y="-6" width="4" height="6" fill="#94a3b8" />
            <text x="3" y="-18" textAnchor="middle" fill="#e2e8f0" fontSize="6" fontFamily="monospace">
              NYC SKYLINE
            </text>
          </g>

          <text x="160" y="42" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="monospace" fontWeight="black">
            1 PB RICE MOUNTAIN (DWARFS EVEREST & BURIED MANHATTAN)
          </text>

          <rect x="40" y="10" width="240" height="22" rx="6" fill="#1e293b" stroke="#7c3aed" strokeWidth="1" />
          <text x="160" y="25" textAnchor="middle" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">
            1 PETABYTE = 29 MILLION TONS &bull; DWARFS EVEREST
          </text>
        </svg>
      );
  }
}

export default function DataPaperScale() {
  const { playClick } = useSound();
  const [userMbps, setUserMbps] = useState<number>(1000); // 1 Gbps default
  const [viewMode, setViewMode] = useState<'rice' | 'paper'>('rice');

  // Math: 1 Byte = 0.029g of rice OR 1 sheet of paper = 0.1mm
  // 1 Mbps = 125,000 Bytes/s
  const bytesPerSec = userMbps * 125_000;
  const kgPerSec = (bytesPerSec * 0.029) / 1000;
  const tonsPerSec = kgPerSec / 1000;
  const pickupTrucksPerSec = tonsPerSec / 1.5;

  // Paper stack throughput: 1 Byte = 1 sheet = 0.1 mm = 0.0001 meters
  const paperMetersPerSec = bytesPerSec * 0.0001;
  const paperKmPerSec = paperMetersPerSec / 1000;

  const currentSteps = viewMode === 'rice' ? DATA_RICE_STEPS : DATA_PAPER_STEPS;

  return (
    <div className="w-full space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-900 border border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Rich Vector Illustrations &bull; Neal.fun Style Visual Scale</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {viewMode === 'rice'
            ? 'What If 1 Byte Was 1 Grain of Rice?'
            : 'What If 1 Byte Was 1 Sheet of Paper?'}
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {viewMode === 'rice'
            ? 'Data is invisible. But when every single Byte becomes a physical grain of rice (0.029 grams), the numbers reveal their true physical weight and mass.'
            : 'When every single Byte becomes a single sheet of printer paper (0.1 mm thick), data stacks reach into the sky, outer space, and all the way to the Sun.'}
        </p>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-xs mt-3 shadow-inner">
          <button
            onClick={() => {
              playClick(850);
              setViewMode('rice');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              viewMode === 'rice'
                ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🍚</span>
            <span>Rice Grain Mass</span>
          </button>
          <button
            onClick={() => {
              playClick(850);
              setViewMode('paper');
            }}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
              viewMode === 'paper'
                ? 'bg-white text-slate-950 shadow-md ring-1 ring-slate-900/5'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📄</span>
            <span>Paper Stack Height</span>
          </button>
        </div>
      </div>

      {/* The Big Bold Scale Steps (Neal.fun / Paper style with Custom SVG Illustrations) */}
      <div className="space-y-12">
        {currentSteps.map((step, idx) => (
          <div
            key={`${viewMode}-${step.size}`}
            className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xs transition-all hover:border-slate-300"
          >
            {/* Step Number Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-8">
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                Step {idx + 1} of {currentSteps.length} &bull; {viewMode === 'rice' ? 'Rice Analogy' : 'Paper Stack Analogy'}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {step.bytes.toLocaleString()} Bytes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Big Bold Size & Bespoke SVG Illustration */}
              <div className="lg:col-span-6 space-y-4">
                <div className="space-y-1">
                  <div className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
                    {step.size}
                  </div>
                  <div className="text-lg font-bold text-sky-800 flex items-center gap-2">
                    <span className="text-2xl select-none">{step.icon}</span>
                    <span>{step.quantityTitle}</span>
                  </div>
                </div>

                {/* The Custom Vector Illustration */}
                <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center p-2">
                  <StepIllustration stepKey={step.illustrationKey} mode={viewMode} />
                </div>
              </div>

              {/* Right Column: Clean Comparison Copy */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {step.analogyHeadline}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>

                <div className="pt-2 flex flex-col gap-2.5 font-mono text-xs text-slate-700">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
                    <strong className="text-sky-700 shrink-0 uppercase">
                      {viewMode === 'rice' ? 'Physical Weight:' : 'Physical Height:'}
                    </strong>
                    <span>{step.comparisonFact}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2">
                    <strong className="text-indigo-700 shrink-0 uppercase">Digital Equivalent:</strong>
                    <span>{step.techExample}</span>
                  </div>
                </div>
              </div>
            </div>

            {idx < currentSteps.length - 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* The Wi-Fi Physical Converter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Interactive Converter
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {viewMode === 'rice'
              ? 'How Much Rice Pours Through Your Wi-Fi?'
              : 'How High Would Your Wi-Fi Print Paper?'}
          </h3>
          <p className="text-sm text-slate-600">
            Because 1 Byte = 8 bits, 1 Gbps internet is 125 MB/s ({bytesPerSec.toLocaleString()} Bytes every single second). Drag to see your plan:
          </p>
        </div>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700">
            <span>PLAN SPEED:</span>
            <span className="text-base text-sky-800">
              {userMbps >= 1000 ? `${(userMbps / 1000).toFixed(1)} Gbps` : `${userMbps} Mbps`}
            </span>
          </div>

          <input
            type="range"
            min="50"
            max="3000"
            step="50"
            value={userMbps}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setUserMbps(val);
              playClick(750 + (val / 3000) * 200);
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-sky-800"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>50 Mbps</span>
            <span>300 Mbps (Average)</span>
            <span>1 Gbps (Gigabit)</span>
            <span>3 Gbps</span>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2 mt-6">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              {viewMode === 'rice'
                ? 'Pouring Through Your Router Every Second:'
                : 'Printing Through Your Router Every Second:'}
            </div>
            <div className="text-3xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
              {viewMode === 'rice'
                ? tonsPerSec < 1
                  ? `${kgPerSec.toFixed(1)} kg of rice / sec`
                  : `${tonsPerSec.toFixed(2)} Metric Tons / sec`
                : paperKmPerSec < 1
                  ? `${paperMetersPerSec.toFixed(0)} meters of paper / sec`
                  : `${paperKmPerSec.toFixed(1)} km of paper / sec`}
            </div>
            <p className="text-sm text-slate-600 pt-1 font-medium">
              {viewMode === 'rice'
                ? pickupTrucksPerSec < 1
                  ? `That’s ~${(kgPerSec / 25).toFixed(1)} standard 25kg sacks of rice pouring into your room every single second!`
                  : `That’s equal to ~${pickupTrucksPerSec.toFixed(1)} pickup trucks full of raw rice dumping onto your floor every second! 🚚`
                : paperKmPerSec < 1
                  ? `That’s a stack of paper taller than a 30-story building shooting into the sky every second!`
                  : `That’s a paper stack shooting ${paperKmPerSec.toFixed(1)} km into the atmosphere every second—reaching space in ${(100 / paperKmPerSec).toFixed(1)} seconds! 🚀`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
