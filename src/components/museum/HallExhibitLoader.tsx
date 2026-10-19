'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TrueScaleTrack from '@/components/exhibits/TrueScaleTrack';
import LatencyArcade from '@/components/exhibits/LatencyArcade';
import DataFlood from '@/components/exhibits/DataFlood';
import CpuTimeDilation from '@/components/exhibits/CpuTimeDilation';
import FrameRateVault from '@/components/exhibits/FrameRateVault';

function ExhibitContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();

  const exhibitParam = searchParams.get('exhibit') || undefined;
  const sizeParam = searchParams.get('size') || undefined;
  const analogyParam = searchParams.get('unit') || undefined;

  switch (slug) {
    case 'speed':
      return <TrueScaleTrack key={exhibitParam || 'default'} initialExhibitId={exhibitParam} />;
    case 'latency':
      return <LatencyArcade key={exhibitParam || 'default'} initialExhibitId={exhibitParam} />;
    case 'data':
      return <DataFlood key={`${sizeParam || '1gb'}-${analogyParam || 'rice'}`} initialSizeId={sizeParam || '1gb'} initialAnalogyId={analogyParam || 'rice'} />;
    case 'cpu':
      return <CpuTimeDilation key={exhibitParam || 'default'} initialOpId={exhibitParam || 'main-ram'} />;
    case 'framerate':
      return <FrameRateVault />;
    default:
      return null;
  }
}

export default function HallExhibitLoader({ slug }: { slug: string }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-72 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-500 animate-pulse">
          Opening Exhibition Hall...
        </div>
      }
    >
      <ExhibitContent slug={slug} />
    </Suspense>
  );
}
