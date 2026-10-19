'use client';

import React, { useRef, useEffect } from 'react';

interface LatencyTrack {
  id: string;
  name: string;
  speedDisplay: string;
  rttDisplay: string;
  explanation: string;
  accentColor: string;
  icon: string;
  oneWaySec: number;
}

const LATENCY_TRACKS: LatencyTrack[] = [
  {
    id: 'vacuum',
    name: 'Light in Vacuum (Grace Hopper Nanosecond)',
    speedDisplay: '300,000 km / s (1.00 c)',
    rttDisplay: '1 ns per 11.8 inches',
    explanation: 'The absolute cosmic speed limit. Travels ~1 foot in one billionth of a second.',
    accentColor: '#9333ea',
    icon: '💡',
    oneWaySec: 1.0,
  },
  {
    id: 'fiber-glass',
    name: 'Subsea Fiber Optic Cable ("The Glass Tax")',
    speedDisplay: '204,000 km / s (0.68 c)',
    rttDisplay: '31.8% slower than vacuum',
    explanation: 'Silica glass has refractive index n = 1.468. Light slows down by nearly 1/3 inside the glass core!',
    accentColor: '#0284c7',
    icon: '🌊',
    oneWaySec: 1.47,
  },
  {
    id: 'moon-ping',
    name: 'Earth to Moon Rover Ping (384,400 km)',
    speedDisplay: '300,000 km / s',
    rttDisplay: '2.56 seconds RTT',
    explanation: 'Apollo astronauts and lunar rovers experienced an unavoidable 2.56-second round-trip radio delay.',
    accentColor: '#eab308',
    icon: '🌕',
    oneWaySec: 2.56,
  },
  {
    id: 'mars-ping',
    name: 'Earth to Mars Curiosity Rover (Deep Space)',
    speedDisplay: '300,000 km / s',
    rttDisplay: '6 to 42 minutes RTT',
    explanation: 'Too far for human remote control: Curiosity and Perseverance rovers must drive autonomously with AI.',
    accentColor: '#ea580c',
    icon: '🪐',
    oneWaySec: 5.0, // normalized visual pace
  },
];

export default function ContinuousLatencyStream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const trackHeight = height / LATENCY_TRACKS.length;
      const isMobile = width < 640;
      const labelColWidth = isMobile ? 120 : 210;
      const trackLeft = labelColWidth + 24;
      const trackRight = width - 24;
      const trackSpan = Math.max(100, trackRight - trackLeft);

      LATENCY_TRACKS.forEach((track, idx) => {
        const trackY = idx * trackHeight;
        const centerY = trackY + trackHeight / 2;

        // Separator
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, trackY + trackHeight);
        ctx.lineTo(width, trackY + trackHeight);
        ctx.stroke();

        // Left Info
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(track.name, 12, trackY + 16);

        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillStyle = track.accentColor;
        ctx.fillText(`${track.speedDisplay} • ${track.rttDisplay}`, 12, trackY + 34);

        if (!isMobile) {
          ctx.font = 'normal 10px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = '#64748b';
          const truncated =
            track.explanation.length > 36
              ? track.explanation.substring(0, 34) + '…'
              : track.explanation;
          ctx.fillText(truncated, 12, trackY + 50);
        }

        // Divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(labelColWidth, trackY + 4);
        ctx.lineTo(labelColWidth, trackY + trackHeight - 4);
        ctx.stroke();

        // Guide line
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(trackLeft, centerY);
        ctx.lineTo(trackRight, centerY);
        ctx.stroke();

        // Start & End nodes
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(trackLeft, centerY, 5, 0, Math.PI * 2);
        ctx.arc(trackRight, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Bouncing Signal Packet (Ping-Pong round trip)
        const cycle = track.oneWaySec * 2;
        const phase = (elapsed % cycle) / cycle; // 0 to 1
        // Ping-pong position
        const t = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        const packetX = trackLeft + t * trackSpan;

        // Signal Trail
        ctx.fillStyle = track.accentColor;
        ctx.beginPath();
        ctx.arc(packetX, centerY, 7, 0, Math.PI * 2);
        ctx.fill();

        // White core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(packetX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Icon at end
        ctx.font = '16px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(track.icon, trackRight + 12, centerY);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
      <div className="pb-6 border-b border-slate-100">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Continuous Latency Arena &bull; Speed-of-Light Delays
        </span>
        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Why Internet Lag & Space Communication Cannot Be Fixed
        </h3>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
          Signals ping-ponging back and forth in real-time. Watch how subsea glass slows photons down by 31.8%, and why Mars rovers cannot be driven by humans with a joystick.
        </p>
      </div>

      <div className="w-full h-[360px] sm:h-[400px] my-6 rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}
