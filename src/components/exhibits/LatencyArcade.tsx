'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import { LATENCY_EXHIBITS, LatencyExhibit } from '@/data/latencies';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import { Terminal, Gamepad2, Timer, Radio, Rocket } from 'lucide-react';

interface LatencyArcadeProps {
  initialExhibitId?: string;
}

export default function LatencyArcade({ initialExhibitId }: LatencyArcadeProps) {
  const { playClick, playSonar, playPacket, playChime, playBuzz } = useSound();

  const [activeExhibit, setActiveExhibit] = useState<LatencyExhibit>(() => {
    return LATENCY_EXHIBITS.find((l) => l.id === initialExhibitId) || LATENCY_EXHIBITS[2]; // Tokyo-London
  });

  const [activeTab, setActiveTab] = useState<'typing' | 'reflex' | 'rover' | 'pong' | 'voyager'>('typing');
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Tab 1: Subsea Cable Typing state
  const [inputText, setInputText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [inFlightPackets, setInFlightPackets] = useState<number>(0);
  const [customLatencyMs, setCustomLatencyMs] = useState<number>(210);

  // Tab 2: Reflex Reaction state
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reflexStartTime, setReflexStartTime] = useState<number>(0);
  const [userReactionMs, setUserReactionMs] = useState<number | null>(null);
  const reflexTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Tab 3: Lunar Rover state
  const roverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const roverStateRef = useRef({
    x: 150,
    y: 100,
    heading: 0,
    speed: 0,
    targetHeading: 0,
  });
  const roverCommandQueueRef = useRef<{ timestamp: number; type: 'steer' | 'throttle'; val: number }[]>([]);
  const [roverTelemetry, setRoverTelemetry] = useState<{ speed: number; x: number; y: number }>({ speed: 0, x: 150, y: 100 });

  // Tab 4: Pong with latency state
  const pongCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pongMode, setPongMode] = useState<'starlink' | 'geo'>('starlink');
  const [pongScore, setPongScore] = useState<{ player: number; cpu: number }>({ player: 0, cpu: 0 });
  const playerPaddleYRef = useRef<number>(100);
  const delayedPaddleYRef = useRef<number>(100);
  const paddleQueueRef = useRef<{ timestamp: number; y: number }[]>([]);
  const ballRef = useRef({ x: 200, y: 100, vx: 3.5, vy: 2.5 });

  // Tab 5: Voyager 1 Ping state
  const [voyagerPingSent, setVoyagerPingSent] = useState<boolean>(false);
  const [voyagerPingProgress, setVoyagerPingProgress] = useState<number>(0);

  // Switch exhibit and auto-select relevant mini-game tab
  const selectExhibit = (exhibit: LatencyExhibit) => {
    playClick(900);
    setActiveExhibit(exhibit);
    setActiveTab(exhibit.interactiveType);
    setCustomLatencyMs(exhibit.roundTripMs);
  };

  // --- SUBSEA TYPING LOGIC ---
  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInputText(newVal);

    if (newVal.length > inputText.length) {
      // New char typed
      playClick(750);
      setInFlightPackets((prev) => prev + 1);

      const delay = customLatencyMs;
      setTimeout(() => {
        setDisplayedText(newVal);
        setInFlightPackets((prev) => Math.max(0, prev - 1));
        playPacket();
      }, delay);
    } else {
      setDisplayedText(newVal);
    }
  };

  // --- REFLEX TEST LOGIC ---
  const startReflexTest = () => {
    playClick(800);
    setReflexState('waiting');
    setUserReactionMs(null);

    const randomDelay = 1800 + Math.random() * 3000;
    reflexTimerRef.current = setTimeout(() => {
      setReflexState('ready');
      setReflexStartTime(performance.now());
      playSonar(1200, 0.1);
    }, randomDelay);
  };

  const handleReflexClick = () => {
    if (reflexState === 'waiting') {
      if (reflexTimerRef.current) clearTimeout(reflexTimerRef.current);
      setReflexState('idle');
      playBuzz();
      alert('Too early! Wait for the screen to turn GREEN.');
    } else if (reflexState === 'ready') {
      const reactionTime = Math.round(performance.now() - reflexStartTime);
      setUserReactionMs(reactionTime);
      setReflexState('result');
      playChime();
    }
  };

  // --- LUNAR ROVER GAME LOOP ---
  useEffect(() => {
    if (activeTab !== 'rover') return;

    let animId: number;
    const canvas = roverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const obstacles = [
      { x: 120, y: 70, r: 25, label: 'Crater Tycho-A' },
      { x: 280, y: 140, r: 35, label: 'Regolith Boulder' },
      { x: 440, y: 60, r: 20, label: 'Crater Artemis' },
    ];

    const loop = () => {
      const now = performance.now();
      const delayMs = 1282; // 1.28s uplink delay

      // Process delayed commands
      while (
        roverCommandQueueRef.current.length > 0 &&
        now - roverCommandQueueRef.current[0].timestamp >= delayMs
      ) {
        const cmd = roverCommandQueueRef.current.shift();
        if (cmd) {
          if (cmd.type === 'steer') {
            roverStateRef.current.heading += cmd.val;
          } else if (cmd.type === 'throttle') {
            roverStateRef.current.speed = Math.max(-1, Math.min(2.5, roverStateRef.current.speed + cmd.val));
          }
        }
      }

      // Update position
      const r = roverStateRef.current;
      r.x += Math.cos(r.heading) * r.speed;
      r.y += Math.sin(r.heading) * r.speed;

      // Wrap boundaries
      if (r.x < 20) r.x = canvas.width - 20;
      if (r.x > canvas.width - 20) r.x = 20;
      if (r.y < 20) r.y = canvas.height - 20;
      if (r.y > canvas.height - 20) r.y = 20;

      // Draw lunar landscape
      ctx.fillStyle = '#11131a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 37) % canvas.width);
        const sy = ((i * 53) % canvas.height);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Craters
      obstacles.forEach((obs) => {
        ctx.fillStyle = '#1e2230';
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.fillText(obs.label, obs.x - obs.r, obs.y + obs.r + 12);
      });

      // Draw Lunar Rover (with rotation)
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.rotate(r.heading);

      // Chassis
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-14, -9, 28, 18);

      // Solar panel & antenna
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-8, -6, 16, 12);

      // High Gain Dish Antenna
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(6, 0, 5, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-16, -12, 8, 4);
      ctx.fillRect(8, -12, 8, 4);
      ctx.fillRect(-16, 8, 8, 4);
      ctx.fillRect(8, 8, 8, 4);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    const telemetryInterval = setInterval(() => {
      setRoverTelemetry({
        speed: roverStateRef.current.speed,
        x: Math.round(roverStateRef.current.x),
        y: Math.round(roverStateRef.current.y),
      });
    }, 200);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(telemetryInterval);
    };
  }, [activeTab]);

  const sendRoverCommand = (type: 'steer' | 'throttle', val: number) => {
    playSonar(900, 0.08);
    roverCommandQueueRef.current.push({
      timestamp: performance.now(),
      type,
      val,
    });
  };

  // --- PONG GAME LOOP (STARLINK VS GEO) ---
  useEffect(() => {
    if (activeTab !== 'pong') return;

    let animId: number;
    const canvas = pongCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lagMs = pongMode === 'starlink' ? 32 : 600;

    const loop = () => {
      const now = performance.now();

      // Retrieve delayed paddle position
      while (
        paddleQueueRef.current.length > 0 &&
        now - paddleQueueRef.current[0].timestamp >= lagMs
      ) {
        const item = paddleQueueRef.current.shift();
        if (item) {
          delayedPaddleYRef.current = item.y;
        }
      }

      // Ball movement
      const b = ballRef.current;
      b.x += b.vx;
      b.y += b.vy;

      // Top/bottom bounce
      if (b.y < 10 || b.y > canvas.height - 10) {
        b.vy = -b.vy;
      }

      // Left paddle collision (Player with latency)
      const paddleH = 50;
      if (b.x <= 35 && b.x >= 20) {
        if (b.y >= delayedPaddleYRef.current && b.y <= delayedPaddleYRef.current + paddleH) {
          b.vx = Math.abs(b.vx) * 1.05;
          playSonar(1400, 0.06);
        }
      }

      // Right paddle collision (CPU)
      const cpuPaddleY = b.y - paddleH / 2;
      if (b.x >= canvas.width - 35 && b.x <= canvas.width - 20) {
        b.vx = -Math.abs(b.vx);
        playSonar(1100, 0.06);
      }

      // Score checking
      if (b.x < 0) {
        setPongScore((s) => ({ ...s, cpu: s.cpu + 1 }));
        b.x = canvas.width / 2;
        b.y = canvas.height / 2;
        b.vx = 3.5;
        playBuzz();
      } else if (b.x > canvas.width) {
        setPongScore((s) => ({ ...s, player: s.player + 1 }));
        b.x = canvas.width / 2;
        b.y = canvas.height / 2;
        b.vx = -3.5;
        playChime();
      }

      // Render Pong
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center dotted line
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Real-Time Player Ghost (Where your mouse actually is)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(20, playerPaddleYRef.current, 10, paddleH);

      // Draw Delayed Paddle (What server sees after latency)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(20, delayedPaddleYRef.current, 10, paddleH);

      // Draw CPU Paddle
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(canvas.width - 30, Math.max(0, Math.min(canvas.height - paddleH, cpuPaddleY)), 10, paddleH);

      // Draw Ball
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, pongMode, playSonar, playBuzz, playChime]);

  const handlePongMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = pongCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top - 25;
    const clampedY = Math.max(0, Math.min(canvas.height - 50, mouseY));

    playerPaddleYRef.current = clampedY;
    paddleQueueRef.current.push({
      timestamp: performance.now(),
      y: clampedY,
    });
  };

  // --- VOYAGER 1 PING SIMULATION ---
  const sendVoyagerPing = () => {
    playSonar(1600, 0.4);
    setVoyagerPingSent(true);
    setVoyagerPingProgress(0);

    const duration = 12000; // 12 seconds accelerated journey
    const start = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setVoyagerPingProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        playPacket();
      }
    }, 50);
  };

  return (
    <div className="w-full space-y-6">
      {/* Exhibit Selector Bar */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          SELECT LATENCY EXPERIMENT:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {LATENCY_EXHIBITS.map((item) => {
            const isSelected = activeExhibit.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectExhibit(item)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500 shadow-lg text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold truncate text-slate-200">{item.name}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  {item.roundTripMs < 1000 ? `${item.roundTripMs} ms` : `${(item.roundTripMs / 1000).toFixed(1)}s`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Arcade Window */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                playClick(800);
                setActiveTab('typing');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'typing'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Subsea Ocean Typist ({customLatencyMs}ms)
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('reflex');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'reflex'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              Nerve Reflex Bench
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('rover');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'rover'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Lunar Rover (2.56s Delay)
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('pong');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'pong'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Starlink vs GEO Pong
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('voyager');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTab === 'voyager'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              Voyager 1 Deep Space Ping
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>ROUND-TRIP DELAY:</span>
            <strong className="px-2 py-0.5 rounded bg-slate-800 border border-cyan-500/30 text-white">
              {activeExhibit.roundTripMs < 1000
                ? `${activeExhibit.roundTripMs} ms`
                : `${(activeExhibit.roundTripMs / 1000).toFixed(2)} seconds`}
            </strong>
          </div>
        </div>

        {/* --- TAB 1: SUBSEA OCEAN TYPIST --- */}
        {activeTab === 'typing' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>
                💡 <strong>How it works:</strong> Type in the left box. Every keystroke is queued and delayed by{' '}
                <strong className="text-cyan-400">{customLatencyMs} ms</strong> before echoing onto the remote terminal!
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Preset:</span>
                <button
                  onClick={() => setCustomLatencyMs(10)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
                >
                  Local (10ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(210)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-mono"
                >
                  Tokyo (210ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(600)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-mono"
                >
                  Satellite (600ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(2564)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-red-300 font-mono"
                >
                  Moon (2.5s)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local Input Side */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LOCAL KEYBOARD INPUT
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Immediate</span>
                </div>
                <textarea
                  value={inputText}
                  onChange={handleTypingChange}
                  placeholder="Type a sentence here (e.g. 'Hello from London! The subsea cables are deep...')"
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-slate-500">
                  <span>Characters typed: {inputText.length}</span>
                  {inFlightPackets > 0 && (
                    <span className="text-cyan-400 animate-pulse">
                      ⚡ {inFlightPackets} packets in-flight under Atlantic ocean...
                    </span>
                  )}
                </div>
              </div>

              {/* Remote Echo Side */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    REMOTE SERVER ECHO ({customLatencyMs}ms Delay)
                  </span>
                  <span className="text-[11px] font-mono text-cyan-500">Subsea Transatlantic</span>
                </div>
                <div className="w-full h-32 bg-slate-900/90 border border-cyan-500/20 rounded-lg p-3 text-sm text-cyan-300 font-mono overflow-y-auto whitespace-pre-wrap">
                  {displayedText}
                  <span className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-slate-500">
                  <span>Echoed characters: {displayedText.length}</span>
                  <button
                    onClick={() => {
                      setInputText('');
                      setDisplayedText('');
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: REFLEX BENCH --- */}
        {activeTab === 'reflex' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              Test your biological reaction speed. When the red button turns <strong>BRIGHT GREEN</strong>, click as fast as humanly possible!
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-slate-950 rounded-xl border border-slate-800 min-h-[260px]">
              {reflexState === 'idle' && (
                <button
                  onClick={startReflexTest}
                  className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl transition-transform hover:scale-105"
                >
                  START REFLEX BENCHMARK
                </button>
              )}

              {reflexState === 'waiting' && (
                <button
                  onClick={handleReflexClick}
                  className="w-full max-w-md py-12 rounded-2xl bg-red-950/60 border-2 border-red-500/80 text-red-300 font-bold text-lg cursor-pointer animate-pulse"
                >
                  WAIT FOR GREEN... (DO NOT CLICK YET!)
                </button>
              )}

              {reflexState === 'ready' && (
                <button
                  onClick={handleReflexClick}
                  className="w-full max-w-md py-12 rounded-2xl bg-emerald-500 border-4 border-white text-slate-950 font-black text-2xl shadow-2xl cursor-pointer hover:bg-emerald-400 scale-105 transition-transform"
                >
                  CLICK NOW! CLICK!
                </button>
              )}

              {reflexState === 'result' && userReactionMs && (
                <div className="w-full max-w-xl text-center space-y-4">
                  <div className="text-3xl font-mono font-black text-white">
                    Your Reaction Time: <span className="text-emerald-400">{userReactionMs} ms</span>
                  </div>

                  {/* Physiological Breakdown Visualizer */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2">
                    <div className="text-xs font-mono font-semibold text-indigo-300 mb-2">
                      WHERE DID YOUR {userReactionMs} MILLISECONDS GO? (BIOLOGICAL BREAKDOWN):
                    </div>
                    {activeExhibit.detailedBreakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-800/60 last:border-0">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="text-cyan-400 font-bold">~{item.timeMs} ms</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={startReflexTest}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition-colors"
                  >
                    Test Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: LUNAR ROVER --- */}
        {activeTab === 'rover' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>
                🌕 <strong>Earth-to-Moon Teleoperation:</strong> Steer the rover around lunar craters. Every command takes{' '}
                <strong className="text-amber-400">1.28 seconds</strong> to reach the Moon!
              </span>
              <div className="text-xs font-mono text-slate-400">
                Speed: <strong className="text-white">{roverTelemetry.speed.toFixed(1)} m/s</strong> | Pos:{' '}
                {roverTelemetry.x},{roverTelemetry.y}
              </div>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas ref={roverCanvasRef} width={600} height={256} className="w-full h-full block" />
            </div>

            {/* Rover Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => sendRoverCommand('steer', -0.3)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm"
              >
                ◀ Turn Left (1.28s Lag)
              </button>
              <button
                onClick={() => sendRoverCommand('throttle', 0.5)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg"
              >
                ▲ Accelerate (Forward)
              </button>
              <button
                onClick={() => sendRoverCommand('throttle', -0.5)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm"
              >
                ▼ Reverse / Brake
              </button>
              <button
                onClick={() => sendRoverCommand('steer', 0.3)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm"
              >
                Turn Right (1.28s Lag) ▶
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 4: STARLINK VS GEO PONG --- */}
        {activeTab === 'pong' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Satellite Orbit:</span>
                <button
                  onClick={() => {
                    playClick(900);
                    setPongMode('starlink');
                  }}
                  className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
                    pongMode === 'starlink'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Starlink LEO (550 km ~32ms Lag)
                </button>
                <button
                  onClick={() => {
                    playClick(900);
                    setPongMode('geo');
                  }}
                  className={`px-3 py-1 rounded font-mono text-xs transition-colors ${
                    pongMode === 'geo'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Geostationary (35,786 km ~600ms Lag)
                </button>
              </div>

              <div className="font-mono text-xs text-white">
                Score: <span className="text-cyan-400 font-bold">{pongScore.player}</span> -{' '}
                <span className="text-red-400 font-bold">{pongScore.cpu}</span>
              </div>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-crosshair">
              <canvas
                ref={pongCanvasRef}
                width={600}
                height={256}
                onMouseMove={handlePongMouseMove}
                className="w-full h-full block"
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center font-mono">
              Notice the faint cyan ghost paddle: that is where your mouse is right now. The solid paddle is where the satellite server receives your position!
            </p>
          </div>
        )}

        {/* --- TAB 5: VOYAGER 1 PING --- */}
        {activeTab === 'voyager' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              Voyager 1 is <strong>over 24.5 Billion kilometers away</strong> in interstellar space. Broadcast a radio signal at the speed of light:
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
              {!voyagerPingSent ? (
                <button
                  onClick={sendVoyagerPing}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl flex items-center gap-2"
                >
                  <Radio className="w-5 h-5" />
                  TRANSMIT DEEP SPACE NETWORK PING
                </button>
              ) : (
                <div className="w-full max-w-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>RADIO WAVE EN ROUTE:</span>
                    <span>{voyagerPingProgress.toFixed(1)}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-4 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-75"
                      style={{ width: `${voyagerPingProgress}%` }}
                    />
                  </div>

                  {/* Milestone Markers */}
                  <div className="grid grid-cols-5 text-[10px] font-mono text-slate-500 text-center pt-1">
                    <span>Earth (0h)</span>
                    <span>Mars (12.5m)</span>
                    <span>Jupiter (43m)</span>
                    <span>Pluto (5.5h)</span>
                    <span className="text-emerald-400 font-bold">Voyager 1 (22.7h)</span>
                  </div>

                  {voyagerPingProgress >= 100 && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-mono">
                      ✨ Voyager 1 telemetry received! 23-Watt transmitter confirmation acknowledged.
                    </div>
                  )}
                </div>
              )}
            </div>
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
        mathFormula={activeExhibit.mathFormula}
        citation={activeExhibit.citation}
        citationUrl={activeExhibit.citationSource}
        shareSnippet={`Mind-bending speed fact: ${activeExhibit.plaqueFact}`}
        onOpenShareModal={() => setIsShareOpen(true)}
      />

      {/* Share Modal */}
      <ShareFactModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={activeExhibit.name}
        metricHighlight={
          activeExhibit.roundTripMs < 1000
            ? `${activeExhibit.roundTripMs} ms`
            : `${(activeExhibit.roundTripMs / 1000).toFixed(1)} seconds`
        }
        funFact={activeExhibit.plaqueFact}
        mathFormula={activeExhibit.mathFormula}
        sourceCitation={activeExhibit.citation}
      />
    </div>
  );
}
