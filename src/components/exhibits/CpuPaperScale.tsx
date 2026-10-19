'use client';

import React from 'react';
import { ArrowDown, Cpu, Clock } from 'lucide-react';

interface CpuMilestoneStep {
  name: string;
  hardwareLevel: string;
  realTime: string;
  dilatedTime: string;
  cyclesMissed: string;
  icon: string;
  headline: string;
  story: string;
  milestoneKey: 'clock' | 'l1' | 'l2' | 'l3' | 'ram' | 'ssd' | 'hdd' | 'internet';
}

const CPU_MILESTONE_STEPS: CpuMilestoneStep[] = [
  {
    name: '1 CPU Clock Cycle (3 GHz)',
    hardwareLevel: 'Silicon Core',
    realTime: '0.33 ns',
    dilatedTime: '1 Second',
    cyclesMissed: '0 cycles (Current tick)',
    icon: '⚡',
    headline: 'A single snap of your fingers',
    story: 'The CPU performs a fundamental arithmetic instruction (like adding two numbers). If 1 cycle = 1 second, this is a casual heartbeat or finger snap. Light travels barely 10 centimeters.',
    milestoneKey: 'clock',
  },
  {
    name: 'L1 Cache Reference (Hit)',
    hardwareLevel: 'On-Die Cache',
    realTime: '0.50 ns',
    dilatedTime: '1.5 Seconds',
    cyclesMissed: '1 to 2 cycles',
    icon: '📝',
    headline: 'Glancing at a yellow sticky note on your desk',
    story: 'L1 cache sits directly inside the core silicon nanometers away from the ALU. Accessing it is like glancing down at a bright yellow sticky note already stuck to your desk right next to your keyboard.',
    milestoneKey: 'l1',
  },
  {
    name: 'L2 Cache Reference',
    hardwareLevel: 'Mid-Tier Core Cache',
    realTime: '3.0 ns',
    dilatedTime: '9 Seconds',
    cyclesMissed: '9 cycles',
    icon: '🗄️',
    headline: 'Sliding open your top desk drawer',
    story: 'Slightly larger memory bank. The CPU worker slides open their top wooden desk drawer, grabs a folder, notes the number, and slides it shut.',
    milestoneKey: 'l2',
  },
  {
    name: 'L3 Unified Cache',
    hardwareLevel: 'Shared Die Cache',
    realTime: '15 ns',
    dilatedTime: '45 Seconds',
    cyclesMissed: '45 cycles',
    icon: '📁',
    headline: 'Walking across the office to the filing cabinet',
    story: 'Shared across all processor cores. The worker stands up from their chair, walks across the office room, pulls a manila folder from the metal filing cabinet, and sits back down.',
    milestoneKey: 'l3',
  },
  {
    name: 'Main Memory (DDR5 RAM)',
    hardwareLevel: 'Motherboard System Bus',
    realTime: '100 ns',
    dilatedTime: '5 Minutes',
    cyclesMissed: '300 cycles (5 minutes of idle time)',
    icon: '🌯',
    headline: 'Walking to the breakroom & heating a microwave burrito',
    story: 'Leaving the CPU silicon through the memory bus feels like an eternity. The worker has time to take a stroll down the hallway, microwave a hot snack for 5 minutes, grab a drink, and leisurely return.',
    milestoneKey: 'ram',
  },
  {
    name: 'NVMe Solid State Drive (SSD) Read',
    hardwareLevel: 'PCIe Flash Storage',
    realTime: '150 µs',
    dilatedTime: '1.74 Days (42 Hours!)',
    cyclesMissed: '450,000 cycles missed',
    icon: '🧳',
    headline: 'Packing a suitcase for a full weekend vacation trip!',
    story: 'Even on the fastest PCIe 5.0 SSD, sensing charge in NAND flash memory takes 150 microseconds. In our dilated world, the worker packs bags, flies to a ski lodge for the entire weekend, and only returns Monday morning!',
    milestoneKey: 'ssd',
  },
  {
    name: 'Spinning Hard Disk Seek',
    hardwareLevel: 'Magnetic Disk',
    realTime: '10 ms',
    dilatedTime: '3.8 Months',
    cyclesMissed: '30,000,000 cycles missed',
    icon: '📚',
    headline: 'Enrolling in and completing an entire college semester!',
    story: 'A mechanical arm must physically swing across magnetic platters spinning at 7,200 RPM. To the CPU, this takes nearly 4 months! The worker completes an entire fall semester, attends lectures, and finishes final exams before the data arrives.',
    milestoneKey: 'hdd',
  },
  {
    name: 'Internet API Request Across Ocean',
    hardwareLevel: 'Subsea Fiber Optic Cable',
    realTime: '150 ms',
    dilatedTime: '4.75 Years',
    cyclesMissed: '450,000,000 cycles missed!',
    icon: '🎓',
    headline: 'From freshman orientation all the way to college graduation!',
    story: 'Sending an HTTP ping from California to Europe takes 150 milliseconds. Dilated at 1 cycle = 1 second, the CPU worker enters university as an 18-year-old freshman, completes all 4 years, earns their Bachelor’s degree, and tosses their graduation cap before the web response arrives!',
    milestoneKey: 'internet',
  },
];

function CpuMilestoneIllustration({ milestoneKey }: { milestoneKey: CpuMilestoneStep['milestoneKey'] }) {
  switch (milestoneKey) {
    case 'clock':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          <circle cx="120" cy="80" r="45" fill="#faf5ff" stroke="#d8b4fe" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Hand Snapping Fingers */}
          <g transform="translate(120, 85)">
            <path d="M-15 30 L-10 0 C-10 -15, 0 -15, 0 0 L0 30" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
            <path d="M0 5 C5 -18, 16 -18, 16 5 L16 30" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
            <circle cx="8" cy="-14" r="3" fill="#fb923c" />
            {/* Snap Spark */}
            <path d="M-5 -25 L-2 -18 L5 -20 L0 -14 L6 -10 L-2 -12 L-4 -5 L-6 -12 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
          <text x="120" y="28" textAnchor="middle" fill="#7e22ce" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1 TICK = 1 SECOND
          </text>
        </svg>
      );

    case 'l1':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Desk surface */}
          <rect x="20" y="110" width="200" height="35" rx="4" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Keyboard edge */}
          <rect x="25" y="115" width="85" height="24" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          {/* Yellow Sticky Note on Desk */}
          <g transform="translate(140, 50)">
            {/* Shadow */}
            <rect x="2" y="3" width="65" height="65" rx="2" fill="#cbd5e1" opacity="0.6" />
            {/* Note paper */}
            <rect x="0" y="0" width="65" height="65" rx="2" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
            {/* Folded corner */}
            <path d="M50 65 L65 50 L50 50 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
            {/* Sticky glue strip */}
            <rect x="0" y="0" width="65" height="12" fill="#facc15" opacity="0.5" />
            {/* Handwritten note lines */}
            <line x1="8" y1="20" x2="45" y2="20" stroke="#854d0e" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="32" x2="52" y2="32" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" />
            <text x="8" y="46" fill="#854d0e" fontSize="8" fontFamily="monospace" fontWeight="bold">x = 42</text>
          </g>
          <text x="120" y="28" textAnchor="middle" fill="#854d0e" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1.5 SECONDS: DESK STICKY NOTE
          </text>
        </svg>
      );

    case 'l2':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Wooden Desk with Open Drawer */}
          <g transform="translate(40, 45)">
            {/* Desk frame */}
            <rect x="0" y="0" width="160" height="90" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Slide-out Drawer */}
            <g transform="translate(10, 15)">
              <rect x="0" y="0" width="140" height="50" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              {/* Drawer Handle */}
              <rect x="55" y="22" width="30" height="6" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
              {/* Files inside drawer */}
              <rect x="15" y="-12" width="30" height="20" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
              <rect x="35" y="-16" width="30" height="24" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <rect x="55" y="-10" width="30" height="18" rx="2" fill="#f43f5e" stroke="#e11d48" strokeWidth="1" />
            </g>
          </g>
          <text x="120" y="28" textAnchor="middle" fill="#0369a1" fontSize="10" fontFamily="monospace" fontWeight="bold">
            9 SECONDS: TOP DESK DRAWER
          </text>
        </svg>
      );

    case 'l3':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Metal Office Filing Cabinet */}
          <g transform="translate(85, 35)">
            <rect x="0" y="0" width="70" height="110" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            {/* 3 Drawers */}
            {[0, 36, 72].map((dy) => (
              <g key={dy} transform={`translate(4, ${dy + 4})`}>
                <rect x="0" y="0" width="62" height="30" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
                <rect x="22" y="12" width="18" height="5" rx="2" fill="#475569" />
                <rect x="24" y="4" width="14" height="6" rx="1" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
              </g>
            ))}
          </g>
          {/* Walking footprints */}
          <circle cx="50" cy="110" r="3" fill="#94a3b8" />
          <circle cx="65" cy="125" r="3" fill="#94a3b8" />
          <text x="120" y="24" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold">
            45 SECONDS: OFFICE FILING CABINET
          </text>
        </svg>
      );

    case 'ram':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Microwave Oven */}
          <g transform="translate(45, 38)">
            {/* Outer Box */}
            <rect x="0" y="0" width="150" height="95" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            {/* Glass Door */}
            <rect x="8" y="10" width="95" height="75" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            {/* Steaming Burrito inside */}
            <ellipse cx="55" cy="62" rx="25" ry="8" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
            {/* Steam curves */}
            <path d="M45 50 Q48 40 45 32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M55 48 Q58 38 55 30" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M65 52 Q68 42 65 34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            {/* Control Panel with Digital Timer */}
            <g transform="translate(110, 10)">
              {/* Display */}
              <rect x="0" y="0" width="32" height="16" rx="2" fill="#020617" />
              <text x="16" y="12" textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace" fontWeight="bold">05:00</text>
              {/* Buttons */}
              <circle cx="8" cy="28" r="4" fill="#334155" />
              <circle cx="24" cy="28" r="4" fill="#334155" />
              <circle cx="8" cy="42" r="4" fill="#334155" />
              <circle cx="24" cy="42" r="4" fill="#334155" />
              <rect x="4" y="55" width="24" height="8" rx="2" fill="#ef4444" />
            </g>
          </g>
          <text x="120" y="24" textAnchor="middle" fill="#b45309" fontSize="10" fontFamily="monospace" fontWeight="bold">
            5 MINUTES: BREAKROOM MICROWAVE BURRITO
          </text>
        </svg>
      );

    case 'ssd':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Packed Travel Rolling Suitcase for Weekend Ski Trip */}
          <g transform="translate(75, 40)">
            {/* Luggage body */}
            <rect x="0" y="15" width="65" height="90" rx="8" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            {/* Rib lines */}
            <line x1="12" y1="25" x2="12" y2="95" stroke="#026597" strokeWidth="2" />
            <line x1="32" y1="25" x2="32" y2="95" stroke="#026597" strokeWidth="2" />
            <line x1="52" y1="25" x2="52" y2="95" stroke="#026597" strokeWidth="2" />
            {/* Telescoping handle */}
            <path d="M22 15 L22 -10 L43 -10 L43 15" stroke="#475569" strokeWidth="2.5" fill="none" />
            <rect x="20" y="-12" width="25" height="5" rx="2" fill="#1e293b" />
            {/* Wheels */}
            <circle cx="12" cy="108" r="5" fill="#1e293b" />
            <circle cx="53" cy="108" r="5" fill="#1e293b" />
            {/* Luggage tag */}
            <rect x="45" y="30" width="16" height="22" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <text x="53" y="44" textAnchor="middle" fill="#854d0e" fontSize="7" fontFamily="monospace" fontWeight="bold">TRIP</text>
          </g>
          {/* Airplane ticket & sunglasses */}
          <g transform="translate(155, 75)">
            <rect x="0" y="0" width="55" height="25" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
            <text x="27" y="16" textAnchor="middle" fill="#0f172a" fontSize="8" fontFamily="monospace" fontWeight="bold">WEEKEND</text>
          </g>
          <text x="120" y="24" textAnchor="middle" fill="#0284c7" fontSize="10" fontFamily="monospace" fontWeight="bold">
            1.7 DAYS (42 HOURS): WEEKEND VACATION
          </text>
        </svg>
      );

    case 'hdd':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* Flip Academic Calendar & Stack of Textbooks */}
          <g transform="translate(45, 42)">
            {/* Calendar */}
            <rect x="0" y="0" width="70" height="60" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="0" y="0" width="70" height="16" rx="4" fill="#ef4444" />
            <text x="35" y="12" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">SEMESTER</text>
            <text x="35" y="42" textAnchor="middle" fill="#0f172a" fontSize="18" fontFamily="monospace" fontWeight="black">4 MO</text>
          </g>
          {/* Stack of University Textbooks */}
          <g transform="translate(130, 60)">
            <rect x="0" y="32" width="75" height="14" rx="2" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
            <rect x="5" y="16" width="70" height="14" rx="2" fill="#10b981" stroke="#047857" strokeWidth="1" />
            <rect x="8" y="0" width="65" height="14" rx="2" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
            <text x="40" y="27" textAnchor="middle" fill="#ffffff" fontSize="7" fontFamily="monospace">CALCULUS</text>
          </g>
          <text x="120" y="24" textAnchor="middle" fill="#b91c1c" fontSize="10" fontFamily="monospace" fontWeight="bold">
            3.8 MONTHS: COLLEGE SEMESTER & EXAMS
          </text>
        </svg>
      );

    case 'internet':
      return (
        <svg viewBox="0 0 240 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="240" height="160" rx="12" fill="#f8fafc" />
          {/* College Graduation Cap & Diploma Scroll */}
          <g transform="translate(120, 70)">
            {/* Cap Mortarboard */}
            <polygon points="0,-25 45,-12 0,0 -45,-12" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
            <rect x="-18" y="-12" width="36" height="14" rx="3" fill="#1e1b4b" />
            {/* Gold Button & Tassel */}
            <circle cx="0" cy="-12" r="3" fill="#eab308" />
            <path d="M0 -12 C15 -10, 25 0, 22 15" stroke="#eab308" strokeWidth="2" fill="none" />
            <rect x="20" y="15" width="4" height="8" rx="1" fill="#ca8a04" />
          </g>
          {/* Rolled Diploma Scroll */}
          <g transform="translate(70, 110)">
            <rect x="0" y="0" width="100" height="18" rx="4" fill="#fffbeb" stroke="#d97706" strokeWidth="1" />
            <rect x="42" y="-2" width="16" height="22" rx="2" fill="#ef4444" />
            <text x="50" y="12" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">DEGREE</text>
          </g>
          <text x="120" y="24" textAnchor="middle" fill="#4338ca" fontSize="10" fontFamily="monospace" fontWeight="bold">
            4.75 YEARS: FRESHMAN TO GRADUATION!
          </text>
        </svg>
      );
  }
}

export default function CpuPaperScale() {
  return (
    <div className="w-full space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>Why Is Your Computer Waiting? &bull; 1 CPU Tick = 1 Human Second</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Why Is Your Computer Waiting?
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Your computer’s processor runs at 3 GHz (<strong>3 billion clock cycles every single second</strong>).
          To understand why hard drives and network cables feel agonizingly slow, imagine each CPU tick takes{' '}
          <strong className="text-purple-700 font-bold">1 full human second</strong> (like a calm heartbeat).
        </p>
      </div>

      {/* The Mental Model Summary Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shrink-0 shadow-md">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">
              The Office Worker Mental Model
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Imagine your CPU is an ultra-fast worker sitting at an office desk. A sticky note on the desk is L1 cache. The breakroom microwave is RAM.
              A weekend ski trip is reading from an SSD. And fetching a website across the ocean takes <strong>4.75 YEARS</strong>—the worker completes all 4 years of college and gets their diploma before the packet arrives!
            </p>
          </div>
        </div>
      </div>

      {/* The Milestone Cards with Clean Progress and Rich Illustrations */}
      <div className="space-y-12">
        {CPU_MILESTONE_STEPS.map((step, idx) => (
          <div
            key={step.name}
            className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-12 shadow-xs transition-all hover:border-slate-300"
          >
            {/* Header / Tier indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-8">
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                Milestone {idx + 1} of {CPU_MILESTONE_STEPS.length} &bull; {step.hardwareLevel}
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                Real hardware: {step.realTime}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Dilated Time & Milestone SVG */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono">
                    {step.dilatedTime}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-purple-700 flex items-center gap-2">
                    <span className="text-2xl select-none">{step.icon}</span>
                    <span>{step.name}</span>
                  </div>
                </div>

                {/* The Custom Vector Milestone Graphic */}
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner flex items-center justify-center p-2">
                  <CpuMilestoneIllustration milestoneKey={step.milestoneKey} />
                </div>
              </div>

              {/* Right Column: Punchy Story & Stats */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  {step.headline}
                </h4>
                <p className="text-base text-slate-600 leading-relaxed font-normal">
                  {step.story}
                </p>

                {/* Progress Visualizer Bar */}
                <div className="space-y-1.5 pt-2 font-mono text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-500">CYCLES MISSED WHILE WAITING:</span>
                    <span className="font-bold text-purple-700">{step.cyclesMissed}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(4, ((idx + 1) / CPU_MILESTONE_STEPS.length) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 font-mono text-xs text-slate-600">
                  <span className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <strong>Real Time:</strong> {step.realTime}
                  </span>
                  <span className="bg-purple-50 border border-purple-200 text-purple-900 rounded-xl px-3 py-1.5">
                    <strong>Dilated (1 tick = 1s):</strong> {step.dilatedTime}
                  </span>
                </div>
              </div>
            </div>

            {idx < CPU_MILESTONE_STEPS.length - 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
