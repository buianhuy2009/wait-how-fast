'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FRAMERATE_EXPLAINERS } from '@/data/framerateData';
import { Activity, Zap } from 'lucide-react';

export default function FrameRateVault() {

  const [detectedHz, setDetectedHz] = useState<number | null>(null);

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

      // Clean bright background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Lane boundaries
      const laneH = height / 4;
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;

      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * laneH);
        ctx.lineTo(width, i * laneH);
        ctx.stroke();
      }

      // Base speed: 520 px/sec
      const baseSpeed = 520;
      continuousPos.current = (continuousPos.current + baseSpeed * dt) % (width - 60);

      // 15 FPS update (66.67 ms)
      if (time - lane15LastUpdate.current >= 66.67) {
        lane15Pos.current = continuousPos.current;
        lane15LastUpdate.current = time;
      }

      // 30 FPS update (33.33 ms)
      if (time - lane30LastUpdate.current >= 33.33) {
        lane30Pos.current = continuousPos.current;
        lane30LastUpdate.current = time;
      }

      // 60 FPS update (16.67 ms)
      if (time - lane60LastUpdate.current >= 16.67) {
        lane60Pos.current = continuousPos.current;
        lane60LastUpdate.current = time;
      }

      // Native monitor update (every rAF frame)
      laneNativePos.current = continuousPos.current;

      const drawLaneObject = (
        laneIdx: number,
        posX: number,
        label: string,
        frameTime: string,
        color: string
      ) => {
        const centerY = laneIdx * laneH + laneH / 2;

        // Lane Info Header on left
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'left';
        ctx.fillText(label, 16, centerY - 6);

        ctx.font = '10px ui-monospace, monospace';
        ctx.fillStyle = color;
        ctx.fillText(frameTime, 16, centerY + 10);

        // Track guideline
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(140, centerY);
        ctx.lineTo(width - 20, centerY);
        ctx.stroke();

        // Moving UFO / Disk
        const diskX = 140 + posX % (width - 180);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(diskX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();

        // Cockpit dome
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(diskX, centerY - 3, 6, 0, Math.PI * 2);
        ctx.fill();

        // White highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(diskX, centerY - 3, 2, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw all 4 lanes
      drawLaneObject(0, lane15Pos.current, '15 FPS', '66.7 ms (Stuttery)', '#ef4444');
      drawLaneObject(1, lane30Pos.current, '30 FPS', '33.3 ms (Console)', '#f59e0b');
      drawLaneObject(2, lane60Pos.current, '60 FPS', '16.7 ms (Web Std)', '#10b981');
      drawLaneObject(
        3,
        laneNativePos.current,
        `NATIVE (${detectedHz || 60} HZ)`,
        `${(1000 / (detectedHz || 60)).toFixed(1)} ms (Your Hardware)`,
        '#0284c7'
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [detectedHz]);

  return (
    <div className="w-full space-y-8">
      {/* Upper Refresh Detector Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-2xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Your Monitor&apos;s Native Hardware Refresh Rate
                </h3>
                {detectedHz && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {detectedHz} Hz
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Calculated automatically from real-time browser frame timestamps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">MONITOR REFRESH</span>
              <strong className="text-indigo-600 text-base font-black">{detectedHz || 60} Hz</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">FRAME INTERVAL</span>
              <strong className="text-amber-600 text-base font-black">
                {(1000 / (detectedHz || 60)).toFixed(2)} ms / frame
              </strong>
            </div>
          </div>
        </div>

        {/* 4-Lane Synchronized Motion Comparator Canvas (Clean light mode, zero-click) */}
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        <p className="mt-4 text-xs text-slate-500 text-center font-mono font-medium">
          💡 <strong>Track with your eyes:</strong> Move your gaze along with each flying object. Notice how 15 FPS and 30 FPS judder with double phantom images, while 60 FPS and your native monitor stay razor-sharp!
        </p>
      </div>

      {/* Explainer Cards: Why 24 FPS Cinema vs Gaming */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FRAMERATE_EXPLAINERS.map((exp, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white border border-slate-200 text-xs leading-relaxed space-y-2 shadow-xs"
          >
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
    </div>
  );
}
