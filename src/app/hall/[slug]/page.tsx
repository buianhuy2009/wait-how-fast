import React from 'react';
import { notFound } from 'next/navigation';
import HallExhibitLoader from '@/components/museum/HallExhibitLoader';
import MuseumRoomNav, { MuseumBottomDoors } from '@/components/museum/MuseumRoomNav';

export function generateStaticParams() {
  return [
    { slug: 'speed' },
    { slug: 'biology' },
    { slug: 'latency' },
    { slug: 'data' },
    { slug: 'cpu' },
    { slug: 'framerate' },
    { slug: 'cosmic' },
  ];
}

const VALID_SLUGS = new Set(['speed', 'biology', 'latency', 'data', 'cpu', 'framerate', 'cosmic']);

export default async function HallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!VALID_SLUGS.has(slug)) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Walkthrough Navigation Header */}
      <MuseumRoomNav currentSlug={slug} />

      {/* Hall Exhibit Content with Suspense Wrapper */}
      <div className="w-full">
        <HallExhibitLoader slug={slug} />
      </div>

      {/* Bottom Walkthrough Corridor & Next Room Doors */}
      <MuseumBottomDoors currentSlug={slug} />
    </div>
  );
}
