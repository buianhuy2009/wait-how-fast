'use client';

import React from 'react';
import { useCalibration } from '@/context/CalibrationContext';
import { calculatePpmm } from '@/lib/ppiMath';

export default function ScreenRuler() {
  const { ppi } = useCalibration();
  const ppmm = calculatePpmm(ppi);

  // We will draw a ruler up to 8 inches or 20 cm
  const inchesCount = 7;
  const cmCount = 18;

  return (
    <div className="w-full overflow-x-auto bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Real-World Physical Verification Ruler
        </span>
        <span>Calibrated at: <strong className="text-white font-mono">{ppi.toFixed(1)} CSS PPI</strong></span>
      </div>

      {/* Inches Ruler */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-amber-300/80 mb-1">INCHES (1:1 TRUE PHYSICAL SCALE)</div>
        <div
          className="relative h-12 bg-amber-950/40 border-t-2 border-b-2 border-amber-500/60 rounded flex items-start select-none"
          style={{ width: `${inchesCount * ppi}px` }}
        >
          {Array.from({ length: inchesCount + 1 }).map((_, inchIdx) => (
            <React.Fragment key={`inch-${inchIdx}`}>
              {/* Major tick */}
              <div
                className="absolute top-0 bottom-0 flex flex-col justify-between"
                style={{ left: `${inchIdx * ppi}px` }}
              >
                <div className="w-0.5 h-6 bg-amber-400" />
                <span className="text-[11px] font-bold font-mono text-amber-300 pl-1 -translate-y-1">
                  {inchIdx}&quot;
                </span>
                <div className="w-0.5 h-3 bg-amber-400" />
              </div>

              {/* Sub-ticks (1/2, 1/4, 1/8) */}
              {inchIdx < inchesCount && (
                <>
                  <div
                    className="absolute top-0 w-px h-4 bg-amber-400/70"
                    style={{ left: `${inchIdx * ppi + ppi * 0.5}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-3 bg-amber-400/40"
                    style={{ left: `${inchIdx * ppi + ppi * 0.25}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-3 bg-amber-400/40"
                    style={{ left: `${inchIdx * ppi + ppi * 0.75}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-2 bg-amber-400/20"
                    style={{ left: `${inchIdx * ppi + ppi * 0.125}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-2 bg-amber-400/20"
                    style={{ left: `${inchIdx * ppi + ppi * 0.375}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-2 bg-amber-400/20"
                    style={{ left: `${inchIdx * ppi + ppi * 0.625}px` }}
                  />
                  <div
                    className="absolute top-0 w-px h-2 bg-amber-400/20"
                    style={{ left: `${inchIdx * ppi + ppi * 0.875}px` }}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Centimeters Ruler */}
      <div>
        <div className="text-[11px] font-mono text-cyan-300/80 mb-1">CENTIMETERS & MILLIMETERS (1:1 TRUE SCALE)</div>
        <div
          className="relative h-12 bg-cyan-950/40 border-t-2 border-b-2 border-cyan-500/60 rounded flex items-start select-none"
          style={{ width: `${cmCount * 10 * ppmm}px` }}
        >
          {Array.from({ length: cmCount + 1 }).map((_, cmIdx) => (
            <React.Fragment key={`cm-${cmIdx}`}>
              {/* Major CM tick */}
              <div
                className="absolute top-0 bottom-0 flex flex-col justify-between"
                style={{ left: `${cmIdx * 10 * ppmm}px` }}
              >
                <div className="w-0.5 h-6 bg-cyan-400" />
                <span className="text-[11px] font-bold font-mono text-cyan-300 pl-1 -translate-y-1">
                  {cmIdx}
                </span>
                <div className="w-0.5 h-3 bg-cyan-400" />
              </div>

              {/* Millimeter ticks (1mm to 9mm) */}
              {cmIdx < cmCount &&
                Array.from({ length: 9 }).map((_, mmSubIdx) => {
                  const mm = mmSubIdx + 1;
                  const isMid = mm === 5;
                  return (
                    <div
                      key={`mm-${cmIdx}-${mm}`}
                      className={`absolute top-0 w-px ${isMid ? 'h-4 bg-cyan-300' : 'h-2 bg-cyan-400/40'}`}
                      style={{ left: `${(cmIdx * 10 + mm) * ppmm}px` }}
                    />
                  );
                })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 text-center">
        💡 <strong>Try it:</strong> Hold an actual physical ruler against your screen. The markings above should align millimeter-for-millimeter!
      </p>
    </div>
  );
}
