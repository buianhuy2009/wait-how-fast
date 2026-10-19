import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HallExhibitLoader from '@/components/museum/HallExhibitLoader';
import { ArrowLeft, ArrowRight, Gauge, Radio, HardDrive, Cpu, Activity } from 'lucide-react';

interface HallConfig {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  prevSlug: string | null;
  prevName: string | null;
  nextSlug: string | null;
  nextName: string | null;
}

const HALLS_META: Record<string, HallConfig> = {
  speed: {
    slug: 'speed',
    number: 'Hall 01',
    title: 'The 1:1 True-Scale Speed Track',
    subtitle: 'Physical Inches / Millimeters Per Second',
    description:
      'Objects crawl and sprint across your physical display at their exact, mathematically verified real-world speeds calibrated to your screen inches.',
    icon: Gauge,
    prevSlug: null,
    prevName: null,
    nextSlug: 'latency',
    nextName: 'Hall 02: Latency Arcade',
  },
  latency: {
    slug: 'latency',
    number: 'Hall 02',
    title: 'The Latency & Ping Arcade',
    subtitle: 'Round-Trip Delays from Human Nerves to Voyager 1',
    description:
      'Experience the physical speed-of-light limits of information. Feel the delay in subsea ocean fiber, human nerve reflexes, Apollo lunar rover steering, and deep space telemetry.',
    icon: Radio,
    prevSlug: 'speed',
    prevName: 'Hall 01: True-Scale Speed',
    nextSlug: 'data',
    nextName: 'Hall 03: The Data Flood',
  },
  data: {
    slug: 'data',
    number: 'Hall 03',
    title: 'The Data Flood (Bits vs. Bytes)',
    subtitle: 'Visualizing Binary Information as Physical Matter',
    description:
      'Why 1 Gbps internet is NOT 1 GB/s. Watch 8 bits merge into 1 Byte, and scale data volumes from 1 Byte to 1 Petabyte as grains of rice, copy paper towers, and ticking time.',
    icon: HardDrive,
    prevSlug: 'latency',
    prevName: 'Hall 02: Latency Arcade',
    nextSlug: 'cpu',
    nextName: 'Hall 04: CPU Time Dilation',
  },
  cpu: {
    slug: 'cpu',
    number: 'Hall 04',
    title: 'Inside Your CPU (Time Dilation Chamber)',
    subtitle: 'If 1 Nanosecond = 1 Human Second',
    description:
      'Slowing down the silicon clock by 1,000,000,000x to understand what your CPU actually waits for during RAM memory access, SSD reads, and transatlantic API requests.',
    icon: Cpu,
    prevSlug: 'data',
    prevName: 'Hall 03: The Data Flood',
    nextSlug: 'framerate',
    nextName: 'Hall 05: Frame Rate Vault',
  },
  framerate: {
    slug: 'framerate',
    number: 'Hall 05',
    title: 'The Refresh & Frame Rate Vault',
    subtitle: 'The Neuroscience of Visual Persistence & Motion',
    description:
      'Auto-detect your display’s native refresh rate, compare 15 vs 30 vs 60 vs Native Hz lanes side-by-side, and uncover why 24 FPS works in cinema but feels unplayable in video games.',
    icon: Activity,
    prevSlug: 'cpu',
    prevName: 'Hall 04: CPU Time Dilation',
    nextSlug: 'speed',
    nextName: 'Hall 01: True-Scale Speed',
  },
};

export function generateStaticParams() {
  return [
    { slug: 'speed' },
    { slug: 'latency' },
    { slug: 'data' },
    { slug: 'cpu' },
    { slug: 'framerate' },
  ];
}

export default async function HallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const config = HALLS_META[slug];
  if (!config) {
    notFound();
  }

  const Icon = config.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hall Header & Breadcrumbs */}
      <div className="border-b border-slate-800 pb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/"
              className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors"
            >
              Museum Lobby
            </Link>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs font-mono text-indigo-400 font-semibold">{config.number}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-cyan-400">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-400 mt-0.5">
                {config.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation to Next / Previous Hall */}
        <div className="flex items-center gap-2">
          {config.prevSlug && (
            <Link
              href={`/hall/${config.prevSlug}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev Hall</span>
            </Link>
          )}

          {config.nextSlug && (
            <Link
              href={`/hall/${config.nextSlug}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition-colors shadow-md"
            >
              <span className="hidden sm:inline">Next Hall</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Hall Exhibit Content with Suspense Wrapper */}
      <div className="w-full">
        <HallExhibitLoader slug={slug} />
      </div>
    </div>
  );
}
