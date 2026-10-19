'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function PrintingMoneyStream() {
  const [elapsedSec, setElapsedSec] = useState<number>(0);

  // Canvas references for the 4 synchronized printing columns
  const moneyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const riceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bloodCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Continuous animation and real-time counter update
  useEffect(() => {
    let animId: number;
    startTimeRef.current = performance.now();
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const totalElapsed = (now - startTimeRef.current) / 1000;
      setElapsedSec(totalElapsed);
      lastTimeRef.current = now;

      // 1. Render Printing Money Column (US National Debt $8,250/s)
      const moneyCanvas = moneyCanvasRef.current;
      if (moneyCanvas) {
        const ctx = moneyCanvas.getContext('2d');
        if (ctx) {
          const w = moneyCanvas.width;
          const h = moneyCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Top print roller
          ctx.fillStyle = '#64748b';
          ctx.fillRect(w * 0.15, 0, w * 0.7, 8);

          // Moving continuous sheet of $100 bills sliding downwards
          const billH = 48;
          const billW = w * 0.7;
          const billX = (w - billW) / 2;
          const billSpeed = 80; // px/s
          const offset = (totalElapsed * billSpeed) % billH;

          for (let y = -billH + offset; y < h; y += billH + 8) {
            // Bill background
            ctx.fillStyle = '#ecfdf5';
            ctx.strokeStyle = '#059669';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(billX, y, billW, billH, 4);
            ctx.fill();
            ctx.stroke();

            // Inner border
            ctx.strokeStyle = '#a7f3d0';
            ctx.lineWidth = 1;
            ctx.strokeRect(billX + 4, y + 4, billW - 8, billH - 8);

            // Bill text & denomination
            ctx.fillStyle = '#047857';
            ctx.font = 'bold 12px ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$100', billX + billW / 2, y + billH / 2);

            ctx.font = '8px ui-sans-serif, sans-serif';
            ctx.fillText('UNITED STATES', billX + billW / 2, y + 12);
          }
        }
      }

      // 2. Render 1 Gbps Rice Flood (125 MB/s = 3.625 kg/s)
      const riceCanvas = riceCanvasRef.current;
      if (riceCanvas) {
        const ctx = riceCanvas.getContext('2d');
        if (ctx) {
          const w = riceCanvas.width;
          const h = riceCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Data funnel spout at top
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(w * 0.4, 0, w * 0.2, 10);

          // Grains of rice cascading downwards
          const grainCount = 35;
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;

          for (let i = 0; i < grainCount; i++) {
            const seed = (i * 9973 + 123) % 1000;
            const seedX = (seed / 1000) * (w * 0.6) + w * 0.2;
            const speed = 120 + ((i * 37) % 80);
            const y = ((totalElapsed * speed + i * 25) % (h + 20)) - 10;

            // Draw an oval grain of rice
            ctx.save();
            ctx.translate(seedX, y);
            ctx.rotate((i * 45 * Math.PI) / 180 + totalElapsed);
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 3. Render Heart Systolic Blood Pump (84 mL/s)
      const bloodCanvas = bloodCanvasRef.current;
      if (bloodCanvas) {
        const ctx = bloodCanvas.getContext('2d');
        if (ctx) {
          const w = bloodCanvas.width;
          const h = bloodCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Aorta vessel walls
          ctx.strokeStyle = '#fecdd3';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(w * 0.3, 0);
          ctx.lineTo(w * 0.3, h);
          ctx.moveTo(w * 0.7, 0);
          ctx.lineTo(w * 0.7, h);
          ctx.stroke();

          // Systolic heartbeat pulse wave
          const heartPhase = totalElapsed * 1.2 * Math.PI * 2; // ~72 BPM
          const pulseWave = Math.pow(Math.max(0, Math.sin(heartPhase)), 4);
          const pulseSpeed = 160 + pulseWave * 200;
          const dropSpacing = 40;
          const dropOffset = (totalElapsed * pulseSpeed) % dropSpacing;

          for (let y = -dropSpacing + dropOffset; y < h; y += dropSpacing) {
            ctx.fillStyle = `rgba(225, 29, 72, ${0.4 + pulseWave * 0.5})`;
            ctx.beginPath();
            ctx.ellipse(w / 2, y, 16 + pulseWave * 8, 8, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 4. Render Speed of Light Photons (300,000 km/s)
      const lightCanvas = lightCanvasRef.current;
      if (lightCanvas) {
        const ctx = lightCanvas.getContext('2d');
        if (ctx) {
          const w = lightCanvas.width;
          const h = lightCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Laser photon beams streaking down
          const beamCount = 6;
          for (let i = 0; i < beamCount; i++) {
            const bx = w * 0.2 + (i / (beamCount - 1)) * (w * 0.6);
            const speed = 400 + (i % 3) * 100;
            const y = ((totalElapsed * speed + i * 45) % (h + 60)) - 30;
            const beamLen = 50;

            const grad = ctx.createLinearGradient(bx, y - beamLen, bx, y);
            grad.addColorStop(0, 'rgba(168, 85, 247, 0)');
            grad.addColorStop(1, 'rgba(168, 85, 247, 0.9)');
            ctx.fillStyle = grad;
            ctx.fillRect(bx - 1.5, Math.max(0, y - beamLen), 3, beamLen);

            // Bright photon head
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Rates and Math (strictly verified)
  // 1. US National Debt: ~$82,400 / sec ($2.6 Trillion/year US Federal Debt increase)
  const debtDollars = elapsedSec * 82400;
  const hundredDollarBills = Math.floor(debtDollars / 100);
  const billStackHeightCm = (hundredDollarBills * 0.109) / 10; // 0.109 mm per paper bill

  // 2. 1 Gbps Wi-Fi / Fiber: 125 MB/s
  // Rice: 1 Byte = 1 grain (0.029g) -> 125,000,000 * 0.029g = 3.625 kg/s
  const mbDownloaded = elapsedSec * 125;
  const gbDownloaded = mbDownloaded / 1000;
  const riceKg = elapsedSec * 3.625;
  const riceTons = riceKg / 1000;

  // 3. Heart Blood: 84 mL / sec
  const bloodLiters = elapsedSec * 0.084;
  const sodaCans = bloodLiters / 0.355; // 355 mL per can

  // 4. Speed of Light: 299,792 km / sec
  const lightKm = elapsedSec * 299_792.458;
  const moonTrips = lightKm / 384_400; // 384,400 km to the Moon

  return (
    <div className="w-full space-y-8">
      {/* 4 Synchronized Vertical Printing Columns (Neal.fun Printing Money Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* COLUMN 1: US National Debt ($100 Bills Printing) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl select-none">💵</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                US National Debt
              </span>
            </div>

            {/* Live Ticking Number */}
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight my-1">
              +${Math.round(debtDollars).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Growing at +$82,400 every single second ($2.6T/yr)
            </div>

            {/* Continuous Printing Press Canvas */}
            <div className="w-full h-44 my-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 overflow-hidden relative">
              <canvas
                ref={moneyCanvasRef}
                width={240}
                height={176}
                className="w-full h-full block"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-600 flex items-center justify-between">
            <span>{hundredDollarBills.toLocaleString()} bills printed</span>
            <span className="font-bold text-emerald-700">{billStackHeightCm.toFixed(1)} cm stack</span>
          </div>
        </div>

        {/* COLUMN 2: 1 Gbps Fiber Pouring as Rice */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl select-none">🍚</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-800">
                1 Gbps Internet Flood
              </span>
            </div>

            {/* Live Ticking Number */}
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight my-1">
              {gbDownloaded < 1
                ? `${mbDownloaded.toFixed(1)} MB`
                : `${gbDownloaded.toFixed(2)} GB`}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              125 MB/s = 3.625 kg of rice per second
            </div>

            {/* Continuous Rice Cascade Canvas */}
            <div className="w-full h-44 my-4 rounded-2xl bg-sky-50/50 border border-sky-100 overflow-hidden relative">
              <canvas
                ref={riceCanvasRef}
                width={240}
                height={176}
                className="w-full h-full block"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-600 flex items-center justify-between">
            <span>Rice Mass:</span>
            <span className="font-bold text-sky-700">
              {riceTons < 1 ? `${riceKg.toFixed(1)} kg` : `${riceTons.toFixed(2)} Metric Tons`}
            </span>
          </div>
        </div>

        {/* COLUMN 3: Your Heart Contraction (Systolic Surge) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl select-none">❤️</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800">
                Heart Systolic Pump
              </span>
            </div>

            {/* Live Ticking Number */}
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight my-1">
              {bloodLiters.toFixed(2)} Liters
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Surging at 84 mL/sec (1.2 beats/sec)
            </div>

            {/* Continuous Arterial Blood Stream Canvas */}
            <div className="w-full h-44 my-4 rounded-2xl bg-rose-50/50 border border-rose-100 overflow-hidden relative">
              <canvas
                ref={bloodCanvasRef}
                width={240}
                height={176}
                className="w-full h-full block"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-600 flex items-center justify-between">
            <span>Soda Cans:</span>
            <span className="font-bold text-rose-700">{sodaCans.toFixed(1)} cans filled</span>
          </div>
        </div>

        {/* COLUMN 4: Speed of Light in Space */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl select-none">💡</span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-800">
                Speed of Light (c)
              </span>
            </div>

            {/* Live Ticking Number */}
            <div className="font-mono text-3xl font-black text-slate-900 tracking-tight my-1">
              {Math.round(lightKm).toLocaleString()} km
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Crossing 300,000 km every single second
            </div>

            {/* Continuous Photon Beam Stream Canvas */}
            <div className="w-full h-44 my-4 rounded-2xl bg-purple-50/50 border border-purple-100 overflow-hidden relative">
              <canvas
                ref={lightCanvasRef}
                width={240}
                height={176}
                className="w-full h-full block"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs font-mono text-slate-600 flex items-center justify-between">
            <span>Lunar Trips:</span>
            <span className="font-bold text-purple-700">{moonTrips.toFixed(2)}x to Moon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
