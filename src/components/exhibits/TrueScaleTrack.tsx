'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useCalibration } from '@/context/CalibrationContext';
import { useSound } from '@/context/SoundContext';
import { SPEED_EXHIBITS, SpeedExhibit } from '@/data/speeds';
import { velocityToPxPerSec, calculateScreenTransitTime, calculatePpmm } from '@/lib/ppiMath';
import { FAMILIAR_OBJECTS, FamiliarObject, getFamiliarDistanceComparison } from '@/lib/familiarObjects';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Play, Pause, RotateCcw, ZoomIn, Gauge, Info, Eye } from 'lucide-react';

interface TrueScaleTrackProps {
  initialExhibitId?: string;
}

export default function TrueScaleTrack({ initialExhibitId }: TrueScaleTrackProps) {
  const { ppi, isCalibrated } = useCalibration();
  const { playClick, playPacket } = useSound();

  const [activeExhibit, setActiveExhibit] = useState<SpeedExhibit>(() => {
    return SPEED_EXHIBITS.find((s) => s.id === initialExhibitId) || SPEED_EXHIBITS[3]; // default Garden Snail
  });

  const [isDualRace, setIsDualRace] = useState<boolean>(false);
  const [dualRacer, setDualRacer] = useState<SpeedExhibit>(() => SPEED_EXHIBITS[6]); // Pain Nerve

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [zoomScale, setZoomScale] = useState<number>(activeExhibit.defaultZoom);
  const [slowMoScale, setSlowMoScale] = useState<number>(activeExhibit.defaultSlowMo);

  const [selectedFamiliar, setSelectedFamiliar] = useState<FamiliarObject | null>(FAMILIAR_OBJECTS[0]); // Dollar bill
  const [showFamiliarOverlay, setShowFamiliarOverlay] = useState<boolean>(true);

  const [traveledDistanceMm, setTraveledDistanceMm] = useState<number>(0);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(1200);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posXRef = useRef<number>(50);
  const posDualXRef = useRef<number>(50);
  const traveledMmRef = useRef<number>(0);
  const lastChirpTimeRef = useRef<number>(0);

  const ppmm = calculatePpmm(ppi);

  // Safe client-side screen width to avoid SSR hydration mismatch
  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // When exhibit changes, adjust default zoom and slow-mo
  const selectExhibit = (exhibit: SpeedExhibit) => {
    playClick(850);
    setActiveExhibit(exhibit);
    setZoomScale(exhibit.defaultZoom);
    setSlowMoScale(exhibit.defaultSlowMo);
    posXRef.current = 50;
    posDualXRef.current = 50;
    traveledMmRef.current = 0;
    setTraveledDistanceMm(0);
  };

  const handleReset = () => {
    playClick(600);
    posXRef.current = 50;
    posDualXRef.current = 50;
    traveledMmRef.current = 0;
    setTraveledDistanceMm(0);
  };

  // Main Canvas render loop handled inside useEffect
  useEffect(() => {
    let animId: number;
    let lastTime = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear Canvas
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Draw Physical Measurement Ticks on the Track
      const trackPadding = 50;
      const cmInPx = 10 * ppmm;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      for (let x = trackPadding; x <= width - trackPadding; x += cmInPx) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        const cmVal = Math.round((x - trackPadding) / cmInPx);
        if (cmVal % 5 === 0 && cmVal > 0) {
          ctx.fillText(`${cmVal}cm`, x + 3, height - 10);
        }
      }

      // Draw Finish Line
      const finishX = width - trackPadding;
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(finishX, 20);
      ctx.lineTo(finishX, height - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('FINISH BEZEL', finishX - 70, 30);

      // Draw Familiar Reference Ghost Outline if enabled
      if (showFamiliarOverlay && selectedFamiliar) {
        const overlayWidthPx = selectedFamiliar.widthMm * ppmm;
        const overlayHeightPx = Math.min(height - 40, Math.max(30, selectedFamiliar.heightMm * ppmm));
        const overlayY = (height - overlayHeightPx) / 2;

        ctx.save();
        ctx.fillStyle = 'rgba(99, 102, 241, 0.08)';
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(trackPadding, overlayY, overlayWidthPx, overlayHeightPx);
        ctx.fillRect(trackPadding, overlayY, overlayWidthPx, overlayHeightPx);
        ctx.setLineDash([]);

        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          `${selectedFamiliar.icon} ${selectedFamiliar.name} (${selectedFamiliar.widthMm}mm)`,
          trackPadding + 6,
          overlayY + 14
        );
        ctx.restore();
      }

      // Lane 1 Physics
      const pxPerSec1 = velocityToPxPerSec(
        activeExhibit.speedMps,
        ppi,
        zoomScale,
        slowMoScale
      );

      if (isPlaying) {
        const deltaPx = pxPerSec1 * dt;
        posXRef.current += deltaPx;
        traveledMmRef.current += deltaPx / ppmm;

        if (posXRef.current > finishX) {
          posXRef.current = trackPadding;
          const nowMs = performance.now();
          if (nowMs - lastChirpTimeRef.current > 300) {
            playPacket();
            lastChirpTimeRef.current = nowMs;
          }
        }
      }

      // Draw Lane 1
      const lane1Y = isDualRace ? height * 0.35 : height * 0.5;
      ctx.fillStyle = activeExhibit.accentColor;
      ctx.beginPath();
      ctx.arc(posXRef.current, lane1Y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Lane 1 Glow
      ctx.fillStyle = `${activeExhibit.accentColor}33`;
      ctx.beginPath();
      ctx.arc(posXRef.current, lane1Y, 26, 0, Math.PI * 2);
      ctx.fill();

      // Lane 1 Icon & Label
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeExhibit.icon, posXRef.current, lane1Y);

      ctx.textAlign = 'left';
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(activeExhibit.name, posXRef.current + 25, lane1Y - 6);
      ctx.font = '10px monospace';
      ctx.fillStyle = activeExhibit.accentColor;
      ctx.fillText(`${pxPerSec1.toFixed(1)} px/s`, posXRef.current + 25, lane1Y + 10);

      // Lane 2 (Dual Race Mode)
      if (isDualRace) {
        const pxPerSec2 = velocityToPxPerSec(
          dualRacer.speedMps,
          ppi,
          zoomScale,
          slowMoScale
        );

        if (isPlaying) {
          posDualXRef.current += pxPerSec2 * dt;
          if (posDualXRef.current > finishX) {
            posDualXRef.current = trackPadding;
          }
        }

        const lane2Y = height * 0.72;
        ctx.fillStyle = dualRacer.accentColor;
        ctx.beginPath();
        ctx.arc(posDualXRef.current, lane2Y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${dualRacer.accentColor}33`;
        ctx.beginPath();
        ctx.arc(posDualXRef.current, lane2Y, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dualRacer.icon, posDualXRef.current, lane2Y);

        ctx.textAlign = 'left';
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(dualRacer.name, posDualXRef.current + 25, lane2Y - 6);
        ctx.font = '10px monospace';
        ctx.fillStyle = dualRacer.accentColor;
        ctx.fillText(`${pxPerSec2.toFixed(1)} px/s`, posDualXRef.current + 25, lane2Y + 10);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const interval = setInterval(() => {
      setTraveledDistanceMm(traveledMmRef.current);
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, [activeExhibit, isDualRace, dualRacer, isPlaying, zoomScale, slowMoScale, ppi, ppmm, playPacket, showFamiliarOverlay, selectedFamiliar]);

  const transitTime = calculateScreenTransitTime(
    activeExhibit.speedMps,
    screenWidth,
    ppi
  );

  return (
    <div className="w-full space-y-6">
      {/* Exhibit Selection Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            SELECT SPEED SPECIMEN:
          </span>
          {!isCalibrated && (
            <span className="text-xs text-amber-600 flex items-center gap-1 font-mono font-semibold">
              <Info className="w-3.5 h-3.5" />
              Using 96 PPI default. Tap Screen Scale in navbar for 1:1 true physical scale!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {SPEED_EXHIBITS.map((item) => {
            const isSelected = activeExhibit.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectExhibit(item)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
                style={{
                  borderLeftColor: isSelected ? item.accentColor : undefined,
                  borderLeftWidth: isSelected ? '4px' : undefined,
                }}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold truncate text-slate-900">{item.name}</div>
                <div className="text-[10px] font-mono text-indigo-600 font-bold mt-0.5 truncate">{item.displaySpeed}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Track Interactive Arena */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Track Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick(isPlaying ? 600 : 900);
                setIsPlaying(!isPlaying);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs active:scale-95 ${
                isPlaying
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE' : 'START SIMULATION'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors shadow-2xs"
              title="Reset Track"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playClick(900);
                setIsDualRace(!isDualRace);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                isDualRace
                  ? 'bg-purple-100 border-purple-300 text-purple-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🏁 {isDualRace ? 'Dual Race: ON' : 'Dual Race: OFF'}
            </button>
          </div>

          {/* Real-World Distance Meter */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">REAL SPEED</span>
              <span className="text-indigo-600 font-black text-sm">{activeExhibit.displaySpeed}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">DISTANCE COVERED</span>
              <span className="text-emerald-600 font-black text-sm">
                {traveledDistanceMm < 10
                  ? `${traveledDistanceMm.toFixed(2)} mm`
                  : traveledDistanceMm < 1000
                  ? `${(traveledDistanceMm / 10).toFixed(1)} cm`
                  : `${(traveledDistanceMm / 1000).toFixed(2)} m`}
              </span>
              <span className="text-indigo-600 block text-[10px] font-bold">
                ~{getFamiliarDistanceComparison(traveledDistanceMm)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold">TIME TO CROSS MONITOR</span>
              <span className="text-amber-600 font-black text-sm">{transitTime.formatted}</span>
            </div>
          </div>
        </div>

        {/* Familiar Everyday Reference Overlay Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-mono">
          <span className="text-slate-600 font-bold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Familiar Object Reference on Track:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {FAMILIAR_OBJECTS.slice(0, 5).map((obj) => (
              <button
                key={obj.id}
                onClick={() => {
                  playClick(800);
                  setSelectedFamiliar(obj);
                  setShowFamiliarOverlay(true);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  showFamiliarOverlay && selectedFamiliar?.id === obj.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {obj.icon} {obj.name}
              </button>
            ))}
            <button
              onClick={() => {
                playClick(700);
                setShowFamiliarOverlay(!showFamiliarOverlay);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                !showFamiliarOverlay
                  ? 'bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              {showFamiliarOverlay ? 'Hide Ghost' : 'Show Ghost'}
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative shadow-inner">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Zoom & Slow-Mo Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-200">
          {/* Microscope Zoom */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-emerald-600" />
                MICROSCOPE ZOOM (FOR NANOSCALE)
              </span>
              <span className="text-emerald-700 font-black">{zoomScale.toLocaleString()}x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold">1x</span>
              <input
                type="range"
                min="0"
                max="7"
                step="0.1"
                value={Math.log10(zoomScale)}
                onChange={(e) => {
                  const val = Math.round(Math.pow(10, parseFloat(e.target.value)));
                  setZoomScale(val);
                }}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-emerald-600"
              />
              <span className="text-[10px] font-mono text-slate-500 font-bold">10,000,000x</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Magnifies atomic/geological speeds so continental drift and fingernails visibly move.
            </p>
          </div>

          {/* Bullet-Time Slow-Mo */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-600" />
                BULLET-TIME SLOW-MO (FOR LIGHT/SOUND)
              </span>
              <span className="text-indigo-700 font-black">
                {slowMoScale >= 1
                  ? `${slowMoScale}x`
                  : `1/${Math.round(1 / slowMoScale).toLocaleString()}x`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold">10⁻⁹s</span>
              <input
                type="range"
                min="-9"
                max="0"
                step="0.2"
                value={Math.log10(slowMoScale)}
                onChange={(e) => {
                  const val = Math.pow(10, parseFloat(e.target.value));
                  setSlowMoScale(val);
                }}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
              />
              <span className="text-[10px] font-mono text-slate-500 font-bold">1x (Real Time)</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Slows down hyper-sonic sound and light so human eyes can track wave propagation.
            </p>
          </div>
        </div>

        {/* Dual Race Opponent Selector */}
        {isDualRace && (
          <div className="mt-4 p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-4">
            <span className="text-xs font-mono font-bold text-purple-900">
              Select Lane 2 Racer to Pit Against {activeExhibit.name}:
            </span>
            <select
              value={dualRacer.id}
              onChange={(e) => {
                const r = SPEED_EXHIBITS.find((s) => s.id === e.target.value);
                if (r) {
                  playClick(800);
                  setDualRacer(r);
                }
              }}
              className="bg-white border border-purple-300 rounded-xl px-3 py-1.5 text-xs text-purple-900 font-mono font-bold shadow-2xs"
            >
              {SPEED_EXHIBITS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.name} ({item.displaySpeed})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Official Museum Plaque */}
      <PlaqueCard
        title={activeExhibit.name}
        subtitle={activeExhibit.subtitle}
        category={activeExhibit.category}
        icon={activeExhibit.icon}
        funFact={activeExhibit.plaqueFact}
        comparison={activeExhibit.interactiveTips}
        mathFormula={activeExhibit.mathFormula}
        citation={activeExhibit.citation}
        citationUrl={activeExhibit.citationSource}
        shareSnippet={`Did you know? ${activeExhibit.plaqueFact}`}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Export / Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={activeExhibit.name}
        metricHighlight={activeExhibit.displaySpeed}
        funFact={activeExhibit.plaqueFact}
        mathFormula={activeExhibit.mathFormula}
        sourceCitation={activeExhibit.citation}
      />
    </div>
  );
}
