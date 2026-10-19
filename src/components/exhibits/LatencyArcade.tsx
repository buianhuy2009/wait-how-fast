'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from '@/context/SoundContext';
import { LATENCY_EXHIBITS, LatencyExhibit } from '@/data/latencies';
import PlaqueCard from '@/components/museum/PlaqueCard';
import ShareFactModal from '@/components/museum/ShareFactModal';
import {
  Terminal,
  Gamepad2,
  Timer,
  Radio,
  Rocket,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Send,
  ShieldAlert,
} from 'lucide-react';

interface LatencyArcadeProps {
  initialExhibitId?: string;
}

export default function LatencyArcade({ initialExhibitId }: LatencyArcadeProps) {
  const { playClick, playSonar, playPacket, playChime, playBuzz } = useSound();

  const [activeExhibit, setActiveExhibit] = useState<LatencyExhibit>(() => {
    return LATENCY_EXHIBITS.find((l) => l.id === initialExhibitId) || LATENCY_EXHIBITS[2]; // Tokyo-London default
  });

  const [activeTab, setActiveTab] = useState<'fiber' | 'typing' | 'pong' | 'rover' | 'mars' | 'reflex' | 'voyager'>(() => {
    const found = LATENCY_EXHIBITS.find((l) => l.id === initialExhibitId);
    return found ? found.interactiveType : 'typing';
  });
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Switch exhibit and auto-select relevant mini-game tab
  const selectExhibit = (exhibit: LatencyExhibit) => {
    playClick(900);
    setActiveExhibit(exhibit);
    setActiveTab(exhibit.interactiveType);
  };

  // =========================================================================
  // TAB 1: FIBER OPTIC GLASS ("THE GLASS TAX")
  // =========================================================================
  const [fiberDistanceKm, setFiberDistanceKm] = useState<number>(5585); // London to NY
  const [laserPulseProgress, setLaserPulseProgress] = useState<number | null>(null);
  const fiberCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const speedSpaceKmS = 299792;
  const speedFiberKmS = 204190; // n = 1.4682
  const vacuumRttMs = (fiberDistanceKm / speedSpaceKmS) * 2 * 1000;
  const fiberRttMs = (fiberDistanceKm / speedFiberKmS) * 2 * 1000;
  const glassTaxMs = fiberRttMs - vacuumRttMs;

  const fireLaserPulse = () => {
    playSonar(1480, 0.2);
    setLaserPulseProgress(0);
    const duration = 2400; // 2.4s animation
    const start = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1.0, elapsed / duration);
      setLaserPulseProgress(progress);

      if (progress >= 1.0) {
        clearInterval(interval);
        playPacket();
        setTimeout(() => setLaserPulseProgress(null), 1200);
      }
    }, 16);
  };

  useEffect(() => {
    if (activeTab !== 'fiber') return;
    const canvas = fiberCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      const trackPad = 40;
      const trackWidth = width - trackPad * 2;
      const yVacuum = height * 0.35;
      const yFiber = height * 0.7;

      // Vacuum Lane
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(trackPad, yVacuum);
      ctx.lineTo(width - trackPad, yVacuum);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`EMPTY SPACE / VACUUM (c = 300,000 km/s)`, trackPad, yVacuum - 14);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${vacuumRttMs.toFixed(2)} ms RTT`, width - trackPad - 80, yVacuum - 14);

      // Fiber Silica Glass Lane
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(trackPad, yFiber);
      ctx.lineTo(width - trackPad, yFiber);
      ctx.stroke();

      // Glass Cladding Glow
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 18;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`SOLID SILICA GLASS (v = 204,190 km/s — Refractive Index n = 1.468)`, trackPad, yFiber - 18);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`${fiberRttMs.toFixed(2)} ms RTT (+${glassTaxMs.toFixed(2)}ms Glass Tax)`, width - trackPad - 200, yFiber - 18);

      // Draw Laser Pulses if active
      if (laserPulseProgress !== null) {
        // In vacuum: travels at 1.0 relative speed (arrives first at t = 0.68)
        const vacP = Math.min(1.0, laserPulseProgress * (1 / 0.681));
        const vacX = trackPad + vacP * trackWidth;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(vacX, yVacuum, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(vacX, yVacuum, 14, 0, Math.PI * 2);
        ctx.fill();

        // In glass: travels at 0.681 relative speed (arrives at t = 1.0)
        const fibP = laserPulseProgress;
        const fibX = trackPad + fibP * trackWidth;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fibX, yFiber, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(fibX, yFiber, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeTab, laserPulseProgress, fiberDistanceKm, vacuumRttMs, fiberRttMs, glassTaxMs]);

  // =========================================================================
  // TAB 2: SUBSEA OCEAN TYPIST (ROBUST FIFO QUEUE WITH DELAYED ECHO)
  // =========================================================================
  const [inputText, setInputText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [customLatencyMs, setCustomLatencyMs] = useState<number>(210);
  const [inFlightPackets, setInFlightPackets] = useState<number>(0);
  const typingQueueRef = useRef<{ value: string; timestamp: number }[]>([]);

  const handleTypingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInputText(newVal);
    playClick(750);

    typingQueueRef.current.push({
      value: newVal,
      timestamp: performance.now(),
    });
    setInFlightPackets(typingQueueRef.current.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      let updatedVal: string | null = null;

      while (
        typingQueueRef.current.length > 0 &&
        now - typingQueueRef.current[0].timestamp >= customLatencyMs
      ) {
        const item = typingQueueRef.current.shift();
        if (item) {
          updatedVal = item.value;
        }
      }

      if (updatedVal !== null) {
        setDisplayedText(updatedVal);
        playPacket();
      }
      setInFlightPackets(typingQueueRef.current.length);
    }, 20);

    return () => clearInterval(interval);
  }, [customLatencyMs, playPacket]);

  const handleClearTerminal = () => {
    setInputText('');
    setDisplayedText('');
    typingQueueRef.current = [];
    setInFlightPackets(0);
    playClick(600);
  };

  // =========================================================================
  // TAB 3: NERVE REFLEX BENCH
  // =========================================================================
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reflexStartTime, setReflexStartTime] = useState<number>(0);
  const [userReactionMs, setUserReactionMs] = useState<number | null>(null);
  const reflexTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // =========================================================================
  // TAB 4: LUNAR ROVER (2.56S DELAY + ARROW KEYS & WASD SUPPORT)
  // =========================================================================
  const roverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const roverStateRef = useRef({
    x: 180,
    y: 120,
    heading: 0,
    speed: 0,
  });
  const roverCommandQueueRef = useRef<{ timestamp: number; type: 'steer' | 'throttle'; val: number }[]>([]);
  const [roverTelemetry, setRoverTelemetry] = useState<{ speed: number; x: number; y: number; pendingCommands: number }>({
    speed: 0,
    x: 180,
    y: 120,
    pendingCommands: 0,
  });

  const sendRoverCommand = useCallback(
    (type: 'steer' | 'throttle', val: number) => {
      playSonar(900, 0.08);
      roverCommandQueueRef.current.push({
        timestamp: performance.now(),
        type,
        val,
      });
      setRoverTelemetry((prev) => ({
        ...prev,
        pendingCommands: roverCommandQueueRef.current.length,
      }));
    },
    [playSonar]
  );

  // Keyboard navigation for Lunar Rover
  useEffect(() => {
    if (activeTab !== 'rover') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        sendRoverCommand('throttle', 0.4);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        sendRoverCommand('throttle', -0.4);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        sendRoverCommand('steer', -0.25);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        sendRoverCommand('steer', 0.25);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, sendRoverCommand]);

  useEffect(() => {
    if (activeTab !== 'rover') return;

    let animId: number;
    const canvas = roverCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const obstacles = [
      { x: 140, y: 70, r: 28, label: 'Crater Tycho-A' },
      { x: 320, y: 150, r: 35, label: 'Regolith Boulder' },
      { x: 500, y: 70, r: 24, label: 'Crater Artemis' },
    ];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      const now = performance.now();
      const delayMs = 1282; // 1.28s uplink light delay

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
            roverStateRef.current.speed = Math.max(-1.2, Math.min(2.8, roverStateRef.current.speed + cmd.val));
          }
        }
      }

      // Update position
      const r = roverStateRef.current;
      r.x += Math.cos(r.heading) * r.speed;
      r.y += Math.sin(r.heading) * r.speed;

      // Wrap boundaries
      if (r.x < 20) r.x = width - 20;
      if (r.x > width - 20) r.x = 20;
      if (r.y < 20) r.y = height - 20;
      if (r.y > height - 20) r.y = 20;

      // Draw landscape
      ctx.fillStyle = '#11131a';
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = '#475569';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 47) % width;
        const sy = (i * 61) % height;
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
        pendingCommands: roverCommandQueueRef.current.length,
      });
    }, 150);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      clearInterval(telemetryInterval);
    };
  }, [activeTab]);

  // =========================================================================
  // TAB 5: MARS PERSEVERANCE ROVER (CLIFF HAZARD & INTERPLANETARY LAG)
  // =========================================================================
  const [marsDistanceMode, setMarsDistanceMode] = useState<'closest' | 'average' | 'furthest'>('average');
  const [marsSimState, setMarsSimState] = useState<'approaching' | 'command_sent' | 'cliff_fallen' | 'autonav_saved'>('approaching');
  const [marsElapsedSec, setMarsElapsedSec] = useState<number>(0);

  const marsConfig = {
    closest: { km: 54_600_000, oneWayMin: 3.03, rttMin: 6.07, label: 'Closest Approach (54.6M km)' },
    average: { km: 189_000_000, oneWayMin: 10.5, rttMin: 21.0, label: 'Average Distance (189M km)' },
    furthest: { km: 401_000_000, oneWayMin: 22.3, rttMin: 44.6, label: 'Maximum Apogee (401M km)' },
  }[marsDistanceMode];

  const handleSendMarsStop = () => {
    playBuzz();
    setMarsSimState('command_sent');
    setMarsElapsedSec(0);

    // Accelerate countdown to demonstrate the tragic delay
    const start = performance.now();
    const interval = setInterval(() => {
      const elapsed = Math.round((performance.now() - start) / 100);
      setMarsElapsedSec(elapsed);

      if (elapsed >= 35) {
        clearInterval(interval);
        setMarsSimState('cliff_fallen');
        playBuzz();
      }
    }, 100);
  };

  const handleEnableAutoNav = () => {
    playChime();
    setMarsSimState('autonav_saved');
  };

  const handleResetMars = () => {
    playClick(600);
    setMarsSimState('approaching');
    setMarsElapsedSec(0);
  };

  // =========================================================================
  // TAB 6: STARLINK VS GEO SATELLITE PONG
  // =========================================================================
  const pongCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pongMode, setPongMode] = useState<'starlink' | 'geo'>('starlink');
  const [pongScore, setPongScore] = useState<{ player: number; cpu: number }>({ player: 0, cpu: 0 });
  const playerPaddleYRef = useRef<number>(100);
  const delayedPaddleYRef = useRef<number>(100);
  const paddleQueueRef = useRef<{ timestamp: number; y: number }[]>([]);
  const ballRef = useRef({ x: 200, y: 100, vx: 3.5, vy: 2.5 });

  useEffect(() => {
    if (activeTab !== 'pong') return;

    let animId: number;
    const canvas = pongCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lagMs = pongMode === 'starlink' ? 32 : 600;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

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
      if (b.y < 10 || b.y > height - 10) {
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
      if (b.x >= width - 35 && b.x <= width - 20) {
        b.vx = -Math.abs(b.vx);
        playSonar(1100, 0.06);
      }

      // Score checking
      if (b.x < 0) {
        setPongScore((s) => ({ ...s, cpu: s.cpu + 1 }));
        b.x = width / 2;
        b.y = height / 2;
        b.vx = 3.5;
        playBuzz();
      } else if (b.x > width) {
        setPongScore((s) => ({ ...s, player: s.player + 1 }));
        b.x = width / 2;
        b.y = height / 2;
        b.vx = -3.5;
        playChime();
      }

      // Render Pong
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Center dotted line
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Real-Time Player Ghost (Where your mouse actually is right now)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(20, playerPaddleYRef.current, 10, paddleH);

      // Draw Delayed Paddle (What server sees after satellite round-trip)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(20, delayedPaddleYRef.current, 10, paddleH);

      // Draw CPU Paddle
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(width - 30, Math.max(0, Math.min(height - paddleH, cpuPaddleY)), 10, paddleH);

      // Draw Ball
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [activeTab, pongMode, playSonar, playBuzz, playChime]);

  const handlePongMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = pongCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top - 25;
    const clampedY = Math.max(0, Math.min(rect.height - 50, mouseY));

    playerPaddleYRef.current = clampedY;
    paddleQueueRef.current.push({
      timestamp: performance.now(),
      y: clampedY,
    });
  };

  // =========================================================================
  // TAB 7: VOYAGER 1 PING
  // =========================================================================
  const [voyagerPingSent, setVoyagerPingSent] = useState<boolean>(false);
  const [voyagerPingProgress, setVoyagerPingProgress] = useState<number>(0);

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

  const resetVoyagerPing = () => {
    playClick(600);
    setVoyagerPingSent(false);
    setVoyagerPingProgress(0);
  };

  return (
    <div className="w-full space-y-6">
      {/* Exhibit Selector Bar */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
          Select Latency Experiment:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {LATENCY_EXHIBITS.map((item) => {
            const isSelected = activeExhibit.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectExhibit(item)}
                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-50 border-cyan-600 shadow-sm ring-2 ring-cyan-500/20 text-cyan-950 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1 select-none">{item.icon}</div>
                <div className="text-xs font-bold truncate text-slate-900">{item.name}</div>
                <div className="text-[10px] font-mono font-bold text-cyan-700 mt-0.5 truncate">
                  {item.roundTripMs < 1000
                    ? `${item.roundTripMs} ms`
                    : item.roundTripMs < 60_000
                    ? `${(item.roundTripMs / 1000).toFixed(1)}s`
                    : item.roundTripMs < 3_600_000
                    ? `${(item.roundTripMs / 60_000).toFixed(0)} min`
                    : `${(item.roundTripMs / 3_600_000).toFixed(1)} hrs`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Arcade Window */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                playClick(800);
                setActiveTab('fiber');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'fiber'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Fiber Glass Tax
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('typing');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'typing'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Ocean Typist ({customLatencyMs}ms)
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('reflex');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'reflex'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              Nerve Reflex Bench
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('pong');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'pong'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Satellite Pong
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('rover');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'rover'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Lunar Rover (2.56s Lag)
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('mars');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'mars'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Mars Cliff Hazard ({marsConfig.oneWayMin} min Lag)
            </button>

            <button
              onClick={() => {
                playClick(800);
                setActiveTab('voyager');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'voyager'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              Voyager 1 Ping
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <span>ROUND-TRIP DELAY:</span>
            <strong className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 text-slate-900">
              {activeExhibit.roundTripMs < 1000
                ? `${activeExhibit.roundTripMs} ms`
                : activeExhibit.roundTripMs < 60_000
                ? `${(activeExhibit.roundTripMs / 1000).toFixed(2)}s`
                : `${(activeExhibit.roundTripMs / 60_000).toFixed(1)} minutes`}
            </strong>
          </div>
        </div>

        {/* --- TAB 1: FIBER OPTIC GLASS TAX --- */}
        {activeTab === 'fiber' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
              <div>
                💡 <strong>The Glass Tax:</strong> Silica glass has a refractive index of n ≈ 1.468, which slows light from 300,000 km/s down to 204,190 km/s (31.8% slower than space)!
              </div>
              <button
                onClick={fireLaserPulse}
                disabled={laserPulseProgress !== null}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md"
              >
                {laserPulseProgress !== null ? 'PULSING LASER...' : '⚡ FIRE LASER PULSE RACE'}
              </button>
            </div>

            {/* Distance Slider & Presets */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="text-slate-400">CABLE TRANSMISSION DISTANCE:</span>
                <span className="text-cyan-400 font-bold">{fiberDistanceKm.toLocaleString()} km</span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="250"
                value={fiberDistanceKm}
                onChange={(e) => setFiberDistanceKm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-cyan-400"
              />
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-mono text-slate-500">Quick Routes:</span>
                <button
                  onClick={() => setFiberDistanceKm(5585)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    fiberDistanceKm === 5585 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  London &rarr; New York (5,585 km)
                </button>
                <button
                  onClick={() => setFiberDistanceKm(8280)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    fiberDistanceKm === 8280 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  SF &rarr; Tokyo (8,280 km)
                </button>
                <button
                  onClick={() => setFiberDistanceKm(13200)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    fiberDistanceKm === 13200 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Tokyo &rarr; London Subsea (13,200 km)
                </button>
              </div>
            </div>

            {/* Canvas Race View */}
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas ref={fiberCanvasRef} className="w-full h-full block" />
            </div>

            {/* Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">VACUUM SPEED OF LIGHT</span>
                <strong className="text-white text-sm">{vacuumRttMs.toFixed(2)} ms RTT</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">300,000 km/s in space</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/30">
                <span className="text-[10px] text-sky-400 block font-semibold">SILICA FIBER CABLE</span>
                <strong className="text-sky-300 text-sm">{fiberRttMs.toFixed(2)} ms RTT</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">204,190 km/s in glass</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30">
                <span className="text-[10px] text-amber-400 block font-semibold">&quot;THE GLASS TAX&quot; ADDED</span>
                <strong className="text-amber-300 text-sm">+{glassTaxMs.toFixed(2)} ms</strong>
                <span className="text-[10px] text-slate-400 block mt-0.5">Delay added purely by glass!</span>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: SUBSEA OCEAN TYPIST --- */}
        {activeTab === 'typing' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
              <span>
                💡 <strong>How it works:</strong> Type in the left box. Every keystroke and backspace is buffered and delayed by{' '}
                <strong className="text-cyan-400">{customLatencyMs} ms</strong> before echoing onto the remote terminal!
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">Preset:</span>
                <button
                  onClick={() => setCustomLatencyMs(10)}
                  className={`px-2 py-1 rounded font-mono text-xs ${customLatencyMs === 10 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                >
                  Local (10ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(70)}
                  className={`px-2 py-1 rounded font-mono text-xs ${customLatencyMs === 70 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                >
                  Atlantic (70ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(210)}
                  className={`px-2 py-1 rounded font-mono text-xs ${customLatencyMs === 210 ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-cyan-300'}`}
                >
                  Tokyo (210ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(600)}
                  className={`px-2 py-1 rounded font-mono text-xs ${customLatencyMs === 600 ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-amber-300'}`}
                >
                  GEO (600ms)
                </button>
                <button
                  onClick={() => setCustomLatencyMs(2564)}
                  className={`px-2 py-1 rounded font-mono text-xs ${customLatencyMs === 2564 ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-red-300'}`}
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
                  placeholder="Type a sentence here (e.g. 'Hello from London! Subsea fiber cables are deep...')"
                  className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-slate-500">
                  <span>Characters typed: {inputText.length}</span>
                  {inFlightPackets > 0 && (
                    <span className="text-cyan-400 animate-pulse">
                      ⚡ {inFlightPackets} packets in-flight under the ocean...
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
                  <button onClick={handleClearTerminal} className="text-slate-400 hover:text-white">
                    Clear Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: REFLEX BENCH --- */}
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

        {/* --- TAB 4: STARLINK VS GEO SATELLITE PONG --- */}
        {activeTab === 'pong' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs gap-3">
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

              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-white">
                  Score: <span className="text-cyan-400 font-bold">{pongScore.player}</span> -{' '}
                  <span className="text-red-400 font-bold">{pongScore.cpu}</span>
                </div>
                <button
                  onClick={() => {
                    playClick(600);
                    setPongScore({ player: 0, cpu: 0 });
                  }}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  Reset Score
                </button>
              </div>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-crosshair">
              <canvas
                ref={pongCanvasRef}
                onMouseMove={handlePongMouseMove}
                className="w-full h-full block"
              />
            </div>
            <p className="text-[11px] text-slate-500 text-center font-mono">
              Notice the faint cyan ghost paddle: that is where your mouse is right now. The solid paddle is where the satellite server receives your position!
            </p>
          </div>
        )}

        {/* --- TAB 5: LUNAR ROVER --- */}
        {activeTab === 'rover' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
              <span>
                🌕 <strong>Earth-to-Moon Teleoperation:</strong> Steer the rover around lunar craters using Arrow Keys or buttons. Every command takes{' '}
                <strong className="text-amber-400">1.28 seconds</strong> to reach the Moon, and telemetry takes{' '}
                <strong className="text-amber-400">1.28 seconds</strong> to return!
              </span>
              <div className="text-xs font-mono text-slate-400">
                Speed: <strong className="text-white">{roverTelemetry.speed.toFixed(1)} m/s</strong> | In-flight cmds:{' '}
                <strong className="text-cyan-400">{roverTelemetry.pendingCommands}</strong>
              </div>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas ref={roverCanvasRef} className="w-full h-full block" />
            </div>

            {/* Rover Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => sendRoverCommand('steer', -0.3)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
              >
                ◀ Turn Left (&larr; / A)
              </button>
              <button
                onClick={() => sendRoverCommand('throttle', 0.5)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
              >
                ▲ Accelerate (&uarr; / W)
              </button>
              <button
                onClick={() => sendRoverCommand('throttle', -0.5)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
              >
                ▼ Reverse / Brake (&darr; / S)
              </button>
              <button
                onClick={() => sendRoverCommand('steer', 0.3)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
              >
                Turn Right (&rarr; / D) ▶
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center font-mono">
              💡 Tip: Press your keyboard Arrow Keys or W/A/S/D to drive. Notice how awkward it feels to navigate around craters with 1.28s of radio lag!
            </p>
          </div>
        )}

        {/* --- TAB 6: MARS PERSEVERANCE ROVER CLIFF HAZARD --- */}
        {activeTab === 'mars' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
              <div>
                🔴 <strong>The Interplanetary Dilemma:</strong> Why NASA engineers CANNOT steer Mars rovers with a joystick. Signals take minutes to cross space!
              </div>
              <div className="flex items-center gap-2">
                {(['closest', 'average', 'furthest'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      playClick(850);
                      setMarsDistanceMode(mode);
                      handleResetMars();
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono ${
                      marsDistanceMode === mode
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mars Simulation Arena */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-red-950/30 via-slate-950 to-slate-950 border border-red-500/30 min-h-[260px] flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-500/20 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block">
                    MISSION CONTROL TELEMETRY
                  </span>
                  <div className="text-lg font-bold text-white tracking-tight">
                    Perseverance Approaching Jezero Crater Rim
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">DISTANCE TO MARS</span>
                    <strong className="text-red-400">{(marsConfig.km / 1_000_000).toFixed(1)} Million km</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ONE-WAY LIGHT TIME</span>
                    <strong className="text-amber-400">{marsConfig.oneWayMin} Minutes</strong>
                  </div>
                </div>
              </div>

              {/* Status Display */}
              <div className="text-center py-6 space-y-4">
                {marsSimState === 'approaching' && (
                  <div className="space-y-3">
                    <div className="text-amber-300 font-mono text-sm flex items-center justify-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span>HAZARD ALERT: Rover video frame shows steep cliff edge 3 meters ahead!</span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto">
                      You are in NASA Mission Control on Earth. Click the emergency brake below to try and stop the rover!
                    </p>
                    <button
                      onClick={handleSendMarsStop}
                      className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-2 mx-auto"
                    >
                      <Send className="w-4 h-4" />
                      TRANSMIT EMERGENCY BRAKE SIGNAL TO MARS
                    </button>
                  </div>
                )}

                {marsSimState === 'command_sent' && (
                  <div className="space-y-3">
                    <div className="text-amber-400 font-mono text-sm animate-pulse">
                      📡 Radio wave en route across interplanetary space... ({marsElapsedSec}s elapsed / simulated {marsConfig.oneWayMin} min)
                    </div>
                    <div className="w-full max-w-md h-3 bg-slate-900 rounded-full mx-auto overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-red-500 transition-all duration-100"
                        style={{ width: `${Math.min(100, (marsElapsedSec / 35) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {marsSimState === 'cliff_fallen' && (
                  <div className="space-y-3 max-w-xl mx-auto">
                    <div className="p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-mono space-y-2 text-left">
                      <div className="font-bold text-red-400 text-sm flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                        TOO LATE! THE ROVER FELL OFF THE CLIFF {marsConfig.oneWayMin} MINUTES AGO!
                      </div>
                      <p>
                        By the time Earth received the video frame showing the rover near the cliff, that frame was already <strong>{marsConfig.oneWayMin} minutes old</strong>.
                        When you clicked the brake button, your signal took another <strong>{marsConfig.oneWayMin} minutes</strong> to arrive.
                      </p>
                      <p className="text-slate-300">
                        At Mars average distance, that is an unbridgeable <strong>21-minute round trip</strong>. Human joystick control across interplanetary distances is fundamentally impossible!
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={handleEnableAutoNav}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-lg"
                      >
                        🤖 Turn ON Onboard NASA AutoNav AI
                      </button>
                      <button
                        onClick={handleResetMars}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700"
                        title="Reset"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {marsSimState === 'autonav_saved' && (
                  <div className="space-y-3 max-w-xl mx-auto">
                    <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-mono space-y-2 text-left">
                      <div className="font-bold text-emerald-400 text-sm">
                        ✨ AUTONAV ENGAGED: ROVER SAVED AUTONOMOUSLY!
                      </div>
                      <p>
                        Perseverance uses dual high-resolution Navcams and an onboard FPGA computer vision system that builds 3D terrain maps in real time.
                        When AutoNav detected the crater drop-off 2 meters away, it stopped the steering actuators in <strong>0.1 seconds</strong> without waiting for Earth!
                      </p>
                    </div>
                    <button
                      onClick={handleResetMars}
                      className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700"
                    >
                      Try Simulation Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 7: VOYAGER 1 PING --- */}
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
                    <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-mono space-y-3">
                      <div>✨ Voyager 1 telemetry received! 23-Watt transmitter confirmation acknowledged.</div>
                      <button
                        onClick={resetVoyagerPing}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700"
                      >
                        Transmit Another Ping
                      </button>
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
            : activeExhibit.roundTripMs < 60_000
            ? `${(activeExhibit.roundTripMs / 1000).toFixed(1)} seconds`
            : `${(activeExhibit.roundTripMs / 60_000).toFixed(1)} minutes`
        }
        funFact={activeExhibit.plaqueFact}
        mathFormula={activeExhibit.mathFormula}
        sourceCitation={activeExhibit.citation}
      />
    </div>
  );
}
