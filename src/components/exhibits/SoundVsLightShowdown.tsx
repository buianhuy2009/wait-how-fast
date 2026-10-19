'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSound } from '@/context/SoundContext';
import { Zap, Volume2, Globe, Sparkles, Info } from 'lucide-react';

export default function SoundVsLightShowdown() {
  const { playClick, playLightning, playThunder } = useSound();

  // Experiment 1: Lightning Strike Simulator
  const [distanceKm, setDistanceKm] = useState<number>(1.0); // 1.0 km default
  const [strikeState, setStrikeState] = useState<'idle' | 'striking' | 'sound-traveling' | 'arrived'>('idle');
  const [elapsedSoundTime, setElapsedSoundTime] = useState<number>(0);
  const [screenFlash, setScreenFlash] = useState<boolean>(false);
  const [thunderShake, setThunderShake] = useState<boolean>(false);

  // Speed constants
  const SPEED_OF_SOUND_MPS = 343; // 343 m/s in air at 20°C
  const SPEED_OF_LIGHT_MPS = 299_792_458; // 300,000 km/s

  const distanceMeters = distanceKm * 1000;
  const lightArrivalSeconds = distanceMeters / SPEED_OF_LIGHT_MPS; // ~3.33 microseconds for 1 km
  const soundArrivalSeconds = distanceMeters / SPEED_OF_SOUND_MPS; // ~2.915 seconds for 1 km

  const strikeAnimRef = useRef<number | null>(null);
  const strikeStartTimestampRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scale zoomer state
  const [scaleZoom, setScaleZoom] = useState<number>(1); // 1 to 1000

  // 1-Second Earth Orbit visual animation phase
  const [earthRotation, setEarthRotation] = useState<number>(0);
  const [lightOrbitAngle, setLightOrbitAngle] = useState<number>(0);
  const isOrbiting = true;

  // 1-second simulation loop for Earth light orbits
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastT) / 1000;
      lastT = now;

      if (isOrbiting) {
        setEarthRotation((prev) => (prev + dt * 10) % 360);
        // Light circles Earth 7.5 times per second = 7.5 * 360 = 2700 deg/sec
        setLightOrbitAngle((prev) => (prev + dt * 2700) % 360);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOrbiting]);

  // Handle Lightning Strike Trigger
  const triggerLightning = useCallback(() => {
    playClick(950);
    setStrikeState('striking');
    setElapsedSoundTime(0);
    setScreenFlash(true);
    setThunderShake(false);

    // Play instant lightning crackle sound
    playLightning();

    setTimeout(() => {
      setScreenFlash(false);
      setStrikeState('sound-traveling');
    }, 120);

    const startTime = performance.now();
    strikeStartTimestampRef.current = startTime;

    if (strikeAnimRef.current) cancelAnimationFrame(strikeAnimRef.current);

    const updateSoundProgress = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setElapsedSoundTime(elapsed);

      if (elapsed >= soundArrivalSeconds) {
        setElapsedSoundTime(soundArrivalSeconds);
        setStrikeState('arrived');
        setThunderShake(true);
        playThunder();

        setTimeout(() => {
          setThunderShake(false);
        }, 900);
        return;
      }

      strikeAnimRef.current = requestAnimationFrame(updateSoundProgress);
    };

    strikeAnimRef.current = requestAnimationFrame(updateSoundProgress);
  }, [playClick, playLightning, playThunder, soundArrivalSeconds]);

  // Canvas Drawing for Lightning Landscape
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Night Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.7, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Distant storm clouds on the left
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(80, 40, 50, 0, Math.PI * 2);
    ctx.arc(140, 30, 60, 0, Math.PI * 2);
    ctx.arc(200, 45, 45, 0, Math.PI * 2);
    ctx.fill();

    // Ground plane
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, h - 36, w, 36);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, h - 36, w, 1);

    // Strike position (left side) and Observer position (right side)
    const strikeX = 80;
    const strikeY = h - 36;
    const observerX = w - 70;
    const observerY = h - 36;

    // Draw Observer Person / Station on right
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(observerX, observerY - 26, 7, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.fillRect(observerX - 4, observerY - 19, 8, 14); // body
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU (0 m)', observerX, observerY + 20);

    // Draw Distance Metric Scale Line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(strikeX, h - 14);
    ctx.lineTo(observerX, h - 14);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${distanceKm.toFixed(1)} km (${distanceMeters.toLocaleString()} meters)`, (strikeX + observerX) / 2, h - 6);

    // If striking or flash active, draw lightning bolt
    if (strikeState === 'striking' || screenFlash) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(140, 40);
      ctx.lineTo(120, 90);
      ctx.lineTo(135, 110);
      ctx.lineTo(strikeX, strikeY);
      ctx.stroke();

      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Strike origin marker
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(strikeX, strikeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('STRIKE', strikeX, strikeY + 20);

    // Draw expanding Sound Wave Arc
    if (strikeState === 'sound-traveling' || strikeState === 'arrived') {
      const soundProgress = Math.min(1, elapsedSoundTime / soundArrivalSeconds);
      const totalSpan = observerX - strikeX;
      const currentRadius = soundProgress * totalSpan;

      // Sound shockwave arcs expanding toward observer
      ctx.save();
      ctx.beginPath();
      ctx.arc(strikeX, strikeY - 10, currentRadius, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.strokeStyle = strikeState === 'arrived' ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = strikeState === 'arrived' ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.stroke();

      // Outer secondary ripple
      if (currentRadius > 20) {
        ctx.beginPath();
        ctx.arc(strikeX, strikeY - 10, Math.max(0, currentRadius - 18), -Math.PI * 0.45, Math.PI * 0.45);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // Sound packet position indicator
      const frontX = strikeX + currentRadius;
      ctx.fillStyle = strikeState === 'arrived' ? '#ef4444' : '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      if (soundProgress < 0.95) {
        ctx.fillText(`Sound wavefront: ${(soundProgress * 100).toFixed(0)}%`, frontX, h - 50);
      }
    }
  }, [distanceKm, distanceMeters, strikeState, screenFlash, elapsedSoundTime, soundArrivalSeconds]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (strikeAnimRef.current) cancelAnimationFrame(strikeAnimRef.current);
    };
  }, []);

  return (
    <div className="w-full space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>True-Scale Physics Showdown &bull; 874,000&times; Gap</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Speed of Light vs. Speed of Sound
        </h2>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          On ordinary horizontal conveyors they look comparable. But in physical reality, Light is{' '}
          <strong className="text-purple-600 font-black">874,030.5 times faster</strong> than Sound! Here is what that looks like drawn to honest physical scale.
        </p>
      </div>

      {/* Feature 1: The Interactive Lightning Strike at Distance */}
      <div
        className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs transition-transform ${
          thunderShake ? 'animate-bounce' : ''
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Interactive Experiment 01 &bull; The Flash-to-Bang Delay
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Why You See Lightning Before You Hear Thunder
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              When lightning strikes {distanceKm} km away, light arrives in microseconds. Watch the sound wave physically crawl across your screen!
            </p>
          </div>

          <button
            onClick={triggerLightning}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span>STRIKE LIGHTNING!</span>
          </button>
        </div>

        {/* Distance Slider */}
        <div className="max-w-xl mb-6 space-y-2">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700">
            <span>STRIKE DISTANCE:</span>
            <span className="text-indigo-600 text-sm font-black">{distanceKm.toFixed(1)} km ({distanceMeters.toLocaleString()} m)</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={distanceKm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setDistanceKm(val);
              setStrikeState('idle');
              setElapsedSoundTime(0);
              playClick(750 + val * 50);
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>0.5 km (~1.5s delay)</span>
            <span>1.0 km (~2.9s delay)</span>
            <span>3.0 km (~8.7s delay)</span>
            <span>10.0 km (~29s delay)</span>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Flash Overlay */}
          {screenFlash && (
            <div className="absolute inset-0 bg-white/90 pointer-events-none transition-opacity duration-150" />
          )}

          {/* Status Overlay Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>
                Light Arrival:{' '}
                <strong className="text-amber-300">
                  {strikeState === 'idle'
                    ? `${(lightArrivalSeconds * 1_000_000).toFixed(1)} µs (Instant)`
                    : `${(lightArrivalSeconds * 1_000_000).toFixed(1)} µs (ARRIVED!)`}
                </strong>
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>
                Sound Arrival:{' '}
                <strong className={strikeState === 'arrived' ? 'text-rose-400' : 'text-cyan-300'}>
                  {strikeState === 'idle'
                    ? `${soundArrivalSeconds.toFixed(2)} seconds`
                    : strikeState === 'arrived'
                    ? `BOOM! Reached in ${soundArrivalSeconds.toFixed(2)}s`
                    : `Traveling: ${elapsedSoundTime.toFixed(2)}s / ${soundArrivalSeconds.toFixed(2)}s`}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Live Metrics Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <div className="text-[10px] font-mono font-bold uppercase text-amber-700">Light Transit (300,000 km/s)</div>
            <div className="text-2xl font-black font-mono text-amber-950 mt-1">
              0.0000033 sec
            </div>
            <p className="text-xs text-amber-900 mt-1">
              Takes only 3.3 microseconds to travel 1 kilometer. Before human neurons can register a single frame, light has arrived.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
            <div className="text-[10px] font-mono font-bold uppercase text-sky-700">Sound Transit (343 m/s)</div>
            <div className="text-2xl font-black font-mono text-sky-950 mt-1">
              {soundArrivalSeconds.toFixed(2)} seconds
            </div>
            <p className="text-xs text-sky-900 mt-1">
              Air acoustic waves crawl at 343 m/s. You can comfortably sip coffee or count &quot;one-one-thousand, two-one-thousand...&quot;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
            <div className="text-[10px] font-mono font-bold uppercase text-purple-700">The Exact Velocity Ratio</div>
            <div className="text-2xl font-black font-mono text-purple-950 mt-1">
              874,030.5&times;
            </div>
            <p className="text-xs text-purple-900 mt-1">
              Light covers 874 kilometers in the time it takes sound to cross just 1 single meter!
            </p>
          </div>
        </div>

        {/* Rule of Thumb Callout */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block font-bold mb-0.5">The Outdoor Rule of Thumb:</strong>
            Because sound travels roughly 1 kilometer every 3 seconds (or 1 mile every 5 seconds), count seconds between the flash and the thunder clap, then divide by 3 to know the distance in kilometers!
          </div>
        </div>
      </div>

      {/* Feature 2: In Exactly 1 Second: 3 Football Fields vs. 7.5 Earth Orbits */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="pb-6 border-b border-slate-100 mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Interactive Experiment 02 &bull; What Happens in 1.000 Second?
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            In 1 Second: Sound Covers 3 Football Fields. Light Circles Earth 7.5 Times!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Let one second tick on a clock. Watch how unimaginably far light travels compared to sound.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Sound: 343 meters (3.5 football fields) */}
          <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-500">Acoustic Speed of Sound</span>
              <span className="text-xs font-mono font-bold text-sky-600">343 meters in 1 second</span>
            </div>

            <div className="text-3xl font-black font-mono text-slate-900">
              343 Meters
            </div>

            <p className="text-xs text-slate-600">
              Equivalent to 3.5 American football fields or 1 full outdoor track lap.
            </p>

            {/* Stadium Visual Diagram */}
            <div className="relative w-full h-32 rounded-xl bg-emerald-950 border border-emerald-800 p-4 flex flex-col justify-between overflow-hidden">
              {/* Running track lanes */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0, #10b981 1px, transparent 0, transparent 40px)',
              }} />

              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 font-bold z-10">
                <span>START LINE</span>
                <span>3.5 FOOTBALL FIELDS</span>
                <span>FINISH (343m)</span>
              </div>

              {/* Sound wave dot moving */}
              <div className="relative w-full h-4 bg-emerald-900/60 rounded-full overflow-hidden border border-emerald-700 z-10">
                <div className="h-full bg-cyan-400 animate-pulse rounded-full" style={{ width: '100%' }} />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 z-10">
                <span>0m</span>
                <span className="text-cyan-300 font-bold">Sound wave arrives in 1.0s</span>
                <span>343m</span>
              </div>
            </div>
          </div>

          {/* Light: 300,000 km (7.5 orbits around Earth) */}
          <div className="space-y-4 p-6 rounded-2xl bg-[#090d1a] border border-indigo-950 text-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-purple-400">Cosmic Speed of Light (c)</span>
              <span className="text-xs font-mono font-bold text-amber-300">300,000 km in 1 second</span>
            </div>

            <div className="text-3xl font-black font-mono text-white">
              300,000 Kilometers
            </div>

            <p className="text-xs text-slate-400">
              In that same 1 second, light wraps around the entire Earth <strong>7.5 times</strong>!
            </p>

            {/* Earth Orbit SVG Visualizer */}
            <div className="relative w-full h-32 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Globe */}
              <div
                className="relative w-20 h-20 rounded-full border-2 border-cyan-500/50 bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                style={{ transform: `rotate(${earthRotation}deg)` }}
              >
                <Globe className="w-12 h-12 text-cyan-200/80" />
              </div>

              {/* Light beam orbit path */}
              <div
                className="absolute w-28 h-28 rounded-full border border-purple-500/30"
                style={{ transform: 'rotate(25deg)' }}
              >
                {/* Orbiting Photon packet */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/80 -top-1.5 left-1/2 -translate-x-1/2"
                  style={{
                    transformOrigin: '0 56px',
                    transform: `rotate(${lightOrbitAngle}deg)`,
                  }}
                />
              </div>

              <div className="absolute bottom-2 left-3 text-[10px] font-mono text-purple-300">
                Earth Circumference: 40,075 km &bull; <strong>7.5 full laps / sec</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: The 874,000x Honest Screen Pixel Comparator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="pb-6 border-b border-slate-100 mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Interactive Experiment 03 &bull; True Visual Screen Scale
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            If Sound Was 1 Pixel Wide, How Wide Would Light Be?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            If Sound in 1 millisecond (34.3 cm) is represented by <strong>1 single pixel</strong> on your screen, Light in that same millisecond is <strong>874,030 pixels wide</strong>—requiring 455 monitors lined up down your street!
          </p>
        </div>

        <div className="space-y-6">
          {/* Zoom Slider */}
          <div className="max-w-xl space-y-2">
            <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700">
              <span>ZOOM MAGNIFICATION:</span>
              <span className="text-indigo-600 font-black">{scaleZoom}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              step="5"
              value={scaleZoom}
              onChange={(e) => setScaleZoom(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>1x (1 screen)</span>
              <span>100x (Small street)</span>
              <span>500x (Entire neighborhood)</span>
            </div>
          </div>

          {/* Visual Bar Comparison */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            {/* Sound bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                  Speed of Sound in 1 ms (34.3 cm):
                </span>
                <span className="font-bold text-sky-600">1 pixel wide</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-lg overflow-hidden flex items-center px-1">
                <div className="w-1 h-3 bg-sky-600 rounded-xs" title="1 single pixel" />
              </div>
            </div>

            {/* Light bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-slate-600">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                  Speed of Light in 1 ms (300 km):
                </span>
                <span className="font-bold text-purple-600">874,030 pixels (455 monitors wide!)</span>
              </div>
              <div className="relative w-full h-6 bg-purple-100 rounded-lg overflow-hidden border border-purple-200">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500"
                  style={{ width: '100%' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-black text-white drop-shadow-sm">
                  &larr; Continues past your screen across 454 more laptop displays &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
