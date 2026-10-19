'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import {
  DATA_SIZES,
  PHYSICAL_ANALOGIES,
  calculateThroughput,
} from '@/data/dataScales';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Waves, Scale, Zap } from 'lucide-react';

interface DataFloodProps {
  initialSizeId?: string;
  initialAnalogyId?: string;
}

export default function DataFlood({
  initialSizeId = '1gb',
  initialAnalogyId = 'rice',
}: DataFloodProps) {
  const { playClick, playDrop } = useSound();

  const [selectedSizeId, setSelectedSizeId] = useState<string>(initialSizeId);
  const [selectedAnalogyId, setSelectedAnalogyId] = useState<string>(initialAnalogyId);
  const [ispSpeedMbps, setIspSpeedMbps] = useState<number>(1000); // 1 Gbps default
  const [gameSizeGb, setGameSizeGb] = useState<number>(50); // 50 GB game
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Pipe animation canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bitAccumulatorRef = useRef<number>(0);

  const selectedSize = DATA_SIZES.find((s) => s.id === selectedSizeId) || DATA_SIZES[3];
  const selectedAnalogy = PHYSICAL_ANALOGIES[selectedAnalogyId] || PHYSICAL_ANALOGIES.rice;
  const currentScale = selectedAnalogy.scales[selectedSizeId];

  const throughput = calculateThroughput(ispSpeedMbps, gameSizeGb * 1000);

  // Canvas Pipe Animation: 8 bits falling into 1 byte container with DPR scaling
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Particle {
      x: number;
      y: number;
      vy: number;
      bitIndex: number;
    }

    const particles: Particle[] = [];
    let lastSpawn = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (time: number) => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Spawn bit particle
      if (time - lastSpawn > 250) {
        lastSpawn = time;
        bitAccumulatorRef.current = (bitAccumulatorRef.current + 1) % 8;
        particles.push({
          x: width * 0.35 + (Math.random() - 0.5) * 16,
          y: 20,
          vy: 3.5,
          bitIndex: bitAccumulatorRef.current,
        });
      }

      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Pipe Glass Wall Outline
      const pipeX = width * 0.35;
      const pipeW = 40;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(pipeX - pipeW / 2, 10, pipeW, 110);

      // Byte Bucket at bottom
      const bucketX = width * 0.7;
      const bucketW = 90;
      const bucketH = 70;
      const bucketY = 60;
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(bucketX - bucketW / 2, bucketY, bucketW, bucketH);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('1 BYTE (B)', bucketX - 32, bucketY - 10);

      // Draw Funnel tube between pipe and bucket
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pipeX + pipeW / 2, 120);
      ctx.lineTo(bucketX - bucketW / 2, bucketY + bucketH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update & render bit particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.vy;

        // In pipe
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`${p.bitIndex + 1}`, p.x - 2, p.y + 3);

        // Reached end of pipe -> transfers to byte bucket
        if (p.y >= 115) {
          particles.splice(i, 1);
          playDrop();
        }
      }

      // Draw Byte fill level in bucket
      const fillHeight = (bitAccumulatorRef.current / 8) * (bucketH - 10);
      ctx.fillStyle = 'rgba(129, 140, 248, 0.4)';
      ctx.fillRect(
        bucketX - bucketW / 2 + 5,
        bucketY + bucketH - fillHeight - 5,
        bucketW - 10,
        fillHeight
      );

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`${bitAccumulatorRef.current} / 8 bits`, bucketX - 28, bucketY + bucketH / 2 + 4);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [playDrop]);

  const handleSizeChange = (id: string) => {
    playClick(850);
    setSelectedSizeId(id);
  };

  const handleAnalogyChange = (id: string) => {
    playClick(950);
    setSelectedAnalogyId(id);
  };

  return (
    <div className="w-full space-y-6">
      {/* Upper Interactive Arena: The Great "b" vs "B" Pipe */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                The Great &quot;b&quot; vs &quot;B&quot; Trap (Why 1 Gbps &ne; 1 GB/s)
              </h3>
              <p className="text-xs text-slate-400">
                Internet providers advertise in <strong>lowercase bits (b)</strong>. Your computer files are stored in <strong>capital Bytes (B)</strong>!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">THE LAW:</span>
            <span className="px-3 py-1 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold">
              1 Byte (B) = 8 bits (b)
            </span>
          </div>
        </div>

        {/* Live Pipe & Valve Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Animated Pipe Canvas */}
          <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
            <canvas ref={canvasRef} width={460} height={176} className="w-full h-full block" />
          </div>

          {/* Real-World Internet Speed & Steam Download Calculator */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">YOUR INTERNET SPEED PLAN:</span>
                <span className="text-cyan-400 font-bold">
                  {ispSpeedMbps >= 1000 ? `${(ispSpeedMbps / 1000).toFixed(1)} Gbps` : `${ispSpeedMbps} Mbps`}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={ispSpeedMbps}
                onChange={(e) => setIspSpeedMbps(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>50 Mbps</span>
                <span>1 Gbps (Standard Fiber)</span>
                <span>5 Gbps</span>
              </div>
            </div>

            {/* Conversion Result Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ISP ADVERTISED SPEED</span>
                <strong className="text-cyan-400 text-sm">{ispSpeedMbps} Mbps</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bits per second</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/30">
                <span className="text-[10px] text-indigo-400 block font-semibold">ACTUAL FILE DOWNLOAD RATE</span>
                <strong className="text-indigo-300 text-sm">{throughput.speedMBps.toFixed(1)} MB/s</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">MegaBYTES per second</span>
              </div>
            </div>

            {/* Download Time Calculator */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Download time for a {gameSizeGb} GB file:</span>
                <span className="text-emerald-400 font-bold">{throughput.formattedDownloadTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-slate-500">File size:</span>
                {[10, 50, 100, 150].map((gb) => (
                  <button
                    key={gb}
                    onClick={() => {
                      playClick(800);
                      setGameSizeGb(gb);
                    }}
                    className={`px-2 py-0.5 rounded font-mono ${
                      gameSizeGb === gb
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {gb}GB
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Interactive Arena: "What If 1 Byte Was..." Physical Scaling Engine */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                The Physical Scaling Engine (&ldquo;What If 1 Byte Was...&rdquo;)
              </h3>
              <p className="text-xs text-slate-400">
                Data is invisible—until you map each byte to physical matter in the universe.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Pick Data Size */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            STEP 1: SELECT DATA VOLUME
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DATA_SIZES.map((size) => {
              const isSelected = selectedSize.id === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => handleSizeChange(size.id)}
                  className={`p-3 rounded-xl border text-center font-mono transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 font-bold scale-[1.02]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="text-sm">{size.abbreviation}</div>
                  <div className="text-[10px] text-slate-400">{size.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pick Physical Matter Analogy */}
        <div className="mb-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            STEP 2: SELECT PHYSICAL MATTER OBJECT
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.values(PHYSICAL_ANALOGIES).map((analogy) => {
              const isSelected = selectedAnalogy.id === analogy.id;
              return (
                <button
                  key={analogy.id}
                  onClick={() => handleAnalogyChange(analogy.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{analogy.icon}</span>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{analogy.name.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400 truncate">{analogy.unitNoun}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Scaled Result Showcase Box */}
        {currentScale && (
          <div className="relative rounded-2xl p-6 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/30 shadow-2xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-500/20 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedAnalogy.icon}</span>
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                    {selectedSize.name} ({selectedSize.abbreviation}) IN {selectedAnalogy.name.toUpperCase()}
                  </span>
                  <h4 className="text-xl font-black text-white tracking-tight mt-0.5">
                    {currentScale.quantity}
                  </h4>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-xs">
                {selectedSize.bytes.toLocaleString()} Bytes
              </div>
            </div>

            {/* Comparison Narrative */}
            <div className="text-base text-slate-100 font-medium leading-relaxed mb-4">
              {currentScale.comparison}
            </div>

            {/* Wi-Fi Throughput Fact Pill */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">
                  Real-World Wi-Fi Router Throughput:
                </strong>
                <span>{selectedAnalogy.throughputFact}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Museum Plaque */}
      <PlaqueCard
        title="The Physical Reality of 1 Gigabit vs 1 Gigabyte"
        subtitle="Binary Serialization, Rice Mass, and Stratospheric Paper Stacks"
        category="data & scale"
        icon="💾"
        funFact={`At 1 Gigabit/sec internet, your router pours 3.6 metric tons of rice per second into your device. A 1 Gigabyte file in printed copy paper stands 50 meters (164 feet) tall—higher than the Statue of Liberty!`}
        comparison="Never get tricked by internet sales: 1 Gbps internet is 125 Megabytes per second, because 8 bits equal 1 Byte."
        mathFormula="1 Gbps = 1,000,000,000 bits/sec / 8 = 125,000,000 Bytes/sec (125 MB/s)"
        citation="IEEE 802.3 Ethernet Standards & National Bureau of Standards"
        citationUrl="https://standards.ieee.org"
        shareSnippet={`Mind-blown: At 1 Gbps, my Wi-Fi is pouring 3.6 metric tons of rice per second into my laptop!`}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Export / Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="1 Gigabit Internet as Physical Rice"
        metricHighlight="1 Gbps = 3.6 Metric Tons of Rice / Sec"
        funFact="At 1 Gigabit/sec internet speed, your Wi-Fi router is pouring 3.6 metric tons of rice per second into your device (the weight of two full-sized pickup trucks every second)!"
        mathFormula="1 Gbps = 125 MB/s = 125,000,000 Bytes/s * 0.029g/grain = 3,625 kg/s"
        sourceCitation="Wait, How Fast Is That? Digital Speed & Latency Museum"
      />
    </div>
  );
}
