'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import { FRAMERATE_EXPLAINERS } from '@/data/framerateData';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Eye, Activity, Play, Pause, Zap } from 'lucide-react';

export default function FrameRateVault() {
  const { playClick } = useSound();

  const [detectedHz, setDetectedHz] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // 0.5x, 1x, 2x
  const [showStrobeGhost, setShowStrobeGhost] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Monitor Hz detection with background tab immunity
  useEffect(() => {
    let animId: number;
    const validDeltas: number[] = [];
    let lastT = 0;

    const detect = (time: number) => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        animId = requestAnimationFrame(detect);
        return;
      }
      if (lastT > 0) {
        const dt = time - lastT;
        // Accept valid consecutive frame intervals between 2ms (500Hz) and 45ms (22Hz)
        if (dt >= 2 && dt <= 45) {
          validDeltas.push(dt);
        }
      }
      lastT = time;

      if (validDeltas.length < 60) {
        animId = requestAnimationFrame(detect);
      } else {
        const avgFrameMs = validDeltas.reduce((a, b) => a + b, 0) / validDeltas.length;
        const calculatedHz = Math.round(1000 / avgFrameMs);

        // Normalize to common hardware refresh rates
        let standardHz = calculatedHz;
        if (Math.abs(calculatedHz - 60) <= 5) standardHz = 60;
        else if (Math.abs(calculatedHz - 75) <= 5) standardHz = 75;
        else if (Math.abs(calculatedHz - 90) <= 5) standardHz = 90;
        else if (Math.abs(calculatedHz - 120) <= 8) standardHz = 120;
        else if (Math.abs(calculatedHz - 144) <= 8) standardHz = 144;
        else if (Math.abs(calculatedHz - 165) <= 8) standardHz = 165;
        else if (Math.abs(calculatedHz - 240) <= 12) standardHz = 240;
        else if (Math.abs(calculatedHz - 360) <= 15) standardHz = 360;
        else standardHz = Math.max(30, Math.min(360, calculatedHz));

        setDetectedHz(standardHz);
      }
    };

    animId = requestAnimationFrame(detect);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Multi-Lane Canvas Comparator
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lane15LastUpdate = useRef<number>(0);
  const lane30LastUpdate = useRef<number>(0);
  const lane60LastUpdate = useRef<number>(0);

  const lane15Pos = useRef<number>(50);
  const lane30Pos = useRef<number>(50);
  const lane60Pos = useRef<number>(50);
  const laneNativePos = useRef<number>(50);
  const continuousPos = useRef<number>(50);

  // Ghost history buffers
  const ghostHistory15 = useRef<number[]>([]);
  const ghostHistory30 = useRef<number[]>([]);
  const ghostHistory60 = useRef<number[]>([]);
  const ghostHistoryNative = useRef<number[]>([]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Clear
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Lane boundaries
      const laneH = height / 4;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * laneH);
        ctx.lineTo(width, i * laneH);
        ctx.stroke();
      }

      // Base speed: 600 px/sec * multiplier
      const baseSpeed = 600 * speedMultiplier;

      if (isPlaying) {
        continuousPos.current = (continuousPos.current + baseSpeed * dt) % (width - 80);

        // 15 FPS update (66.67 ms)
        if (time - lane15LastUpdate.current >= 66.67) {
          lane15Pos.current = continuousPos.current;
          lane15LastUpdate.current = time;
          ghostHistory15.current.push(continuousPos.current);
          if (ghostHistory15.current.length > 8) ghostHistory15.current.shift();
        }

        // 30 FPS update (33.33 ms)
        if (time - lane30LastUpdate.current >= 33.33) {
          lane30Pos.current = continuousPos.current;
          lane30LastUpdate.current = time;
          ghostHistory30.current.push(continuousPos.current);
          if (ghostHistory30.current.length > 8) ghostHistory30.current.shift();
        }

        // 60 FPS update (16.67 ms)
        if (time - lane60LastUpdate.current >= 16.67) {
          lane60Pos.current = continuousPos.current;
          lane60LastUpdate.current = time;
          ghostHistory60.current.push(continuousPos.current);
          if (ghostHistory60.current.length > 8) ghostHistory60.current.shift();
        }

        // Native monitor update (every rAF frame)
        laneNativePos.current = continuousPos.current;
        ghostHistoryNative.current.push(continuousPos.current);
        if (ghostHistoryNative.current.length > 8) ghostHistoryNative.current.shift();
      }

      const drawLaneObject = (
        laneIdx: number,
        posX: number,
        label: string,
        frameTime: string,
        color: string,
        ghosts: number[]
      ) => {
        const centerY = laneIdx * laneH + laneH / 2;

        // Lane Info Header
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, 14, centerY - 8);

        ctx.font = '10px monospace';
        ctx.fillStyle = color;
        ctx.fillText(frameTime, 14, centerY + 8);

        // Strobe Ghost Trail (if toggled)
        if (showStrobeGhost) {
          ghosts.forEach((gx, idx) => {
            const alpha = ((idx + 1) / ghosts.length) * 0.35;
            ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.beginPath();
            ctx.arc(gx + 30, centerY, 14, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Main UFO / Flying Disk
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(posX + 30, centerY, 16, 0, Math.PI * 2);
        ctx.fill();

        // Cockpit dome
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(posX + 30, centerY - 4, 7, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing navigation light
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(posX + 30, centerY - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw all 4 lanes
      drawLaneObject(0, lane15Pos.current, '15 FPS', '66.7 ms (Stuttery)', '#ef4444', ghostHistory15.current);
      drawLaneObject(1, lane30Pos.current, '30 FPS', '33.3 ms (Console)', '#f59e0b', ghostHistory30.current);
      drawLaneObject(2, lane60Pos.current, '60 FPS', '16.7 ms (Web Std)', '#10b981', ghostHistory60.current);
      drawLaneObject(
        3,
        laneNativePos.current,
        `NATIVE (${detectedHz || 60} HZ)`,
        `${(1000 / (detectedHz || 60)).toFixed(1)} ms (Your Hardware)`,
        '#38bdf8',
        ghostHistoryNative.current
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier, showStrobeGhost, detectedHz]);

  return (
    <div className="w-full space-y-6">
      {/* Upper Refresh Detector Card */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Live Native Refresh Rate Detector
                </h3>
                {detectedHz && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    Detected: {detectedHz} Hz
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Calculated in real-time from high-precision `requestAnimationFrame` hardware delta timestamps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">MONITOR REFRESH</span>
              <strong className="text-indigo-600 text-base font-black">{detectedHz || 60} Hz</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">FRAME TIME INTERVAL</span>
              <strong className="text-amber-600 text-base font-black">
                {(1000 / (detectedHz || 60)).toFixed(2)} ms / frame
              </strong>
            </div>
          </div>
        </div>

        {/* Lane Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick(isPlaying ? 600 : 900);
                setIsPlaying(!isPlaying);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-2xs active:scale-95 ${
                isPlaying
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
            </button>

            <button
              onClick={() => {
                playClick(800);
                setShowStrobeGhost(!showStrobeGhost);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                showStrobeGhost
                  ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{showStrobeGhost ? 'Hide Retinal Ghosts' : 'Show Retinal Ghost Trail'}</span>
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 font-bold">Object Speed:</span>
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => {
                  playClick(850);
                  setSpeedMultiplier(s);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  speedMultiplier === s
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* 4-Lane Synchronized Motion Comparator Canvas */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0d18] relative shadow-inner">
          <canvas ref={canvasRef} width={800} height={320} className="w-full h-full block" />
        </div>

        <p className="mt-3 text-xs text-slate-500 text-center font-mono font-medium">
          💡 <strong>Track with your eyes:</strong> Move your gaze along with each flying object. Notice how at 15 FPS and 30 FPS your eyes perceive jagged, jumping phantom images, while 60Hz and your native monitor remain smoothly glued to your fovea!
        </p>
      </div>

      {/* Explainer Accordions: Why 24 FPS in Cinema vs Gaming */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FRAMERATE_EXPLAINERS.map((exp, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white border-2 border-slate-200/90 text-xs leading-relaxed space-y-2 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              {exp.title}
            </h4>
            <p className="text-slate-600">{exp.content}</p>
            <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 font-bold">
              Source: {exp.citation}
            </div>
          </div>
        ))}
      </div>

      {/* Official Museum Plaque */}
      <PlaqueCard
        title="The Neuroscience of Frame Rate & Persistence"
        subtitle="Critical Flicker Fusion, Motion Blur Shutter Angles, & Efference Copy"
        category="visual optics"
        icon="⚡"
        funFact="A movie at 24 FPS looks cinematic because a mechanical shutter stays open for 1/48th of a second, smearing natural motion blur. But in video games with zero camera blur and active mouse input, anything under 60 FPS breaks the brain's efference copy, destroying the illusion of direct physical control!"
        comparison="Your peripheral retina contains fast magnocellular rods that detect flicker up to 120 Hz to alert you to predators in your side vision!"
        mathFormula="Frame Time = 1000 ms / Refresh Rate (Hz); e.g. 60 Hz = 16.67 ms, 120 Hz = 8.33 ms"
        citation="Mark Rejhon, Blur Busters & Journal of General Physiology"
        citationUrl="https://blurbusters.com"
        shareSnippet={`Why does 24 FPS work in cinema but suck in video games? Because movies have 180° shutter motion blur, and your brain isn't moving a mouse with an efference copy!`}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Why 24 FPS Cinema Works, But Video Games Feel Broken"
        metricHighlight="Hollywood 24 FPS = 180° Shutter Blur • Gaming = 0ms Needle-Sharp"
        funFact="Movies at 24 FPS look cinematic because the physical camera shutter stays open for 1/48th of a second, blending frames naturally. Video games render mathematically sharp slices—with no shutter blur and active mouse control, anything under 60 FPS breaks the illusion of direct touch!"
        sourceCitation="Wait, How Fast Is That? Digital Speed & Latency Museum"
      />
    </div>
  );
}
