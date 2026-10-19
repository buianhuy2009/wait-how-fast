'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Copy, Check, Sparkles } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

interface ShareFactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metricHighlight: string;
  funFact: string;
  mathFormula?: string;
  sourceCitation?: string;
}

export default function ShareFactModal({
  isOpen,
  onClose,
  title,
  metricHighlight,
  funFact,
  mathFormula,
  sourceCitation,
}: ShareFactModalProps) {
  const { playClick, playChime } = useSound();
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const socialSnippet = `🤯 "${funFact}"\n\nMetric: ${metricHighlight}\n\nExplore at Wait, How Fast Is That? (True-Scale Digital Museum)`;

  const handleCopyText = async () => {
    playClick(1000);
    try {
      await navigator.clipboard.writeText(socialSnippet);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2500);
    } catch {}
  };

  const handleExportPng = () => {
    playChime();
    setIsExporting(true);

    try {
      // Create high-res canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;

      // Dark gradient background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#090a16');
      grad.addColorStop(0.5, '#12142a');
      grad.addColorStop(1, '#0c0e1d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Accent border
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Museum Brand Header
      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('WAIT, HOW FAST IS THAT? // DIGITAL MUSEUM EXHIBIT', 70, 85);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(title, 70, 155);

      // Metric Highlight Pill
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(70, 185, 520, 60);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.strokeRect(70, 185, 520, 60);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px monospace';
      ctx.fillText(metricHighlight, 90, 226);

      // Fact text (wrapped)
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px sans-serif';

      const words = funFact.split(' ');
      let line = '';
      let y = 290;
      const maxWidth = 1060;
      const lineHeight = 36;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 70, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 70, y);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '18px monospace';
      ctx.fillText('Calibrated to 1:1 true physical display scale • ISO/IEC 7810 ID-1 Verified', 70, 560);

      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `wait-how-fast-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // export error fallback
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            playClick(600);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Export & Share Exhibit Plaque</h3>
        </div>

        {/* Visual Fact Card Preview */}
        <div
          ref={cardRef}
          className="rounded-2xl p-6 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/30 shadow-2xl relative mb-6"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-indigo-400 mb-2">
            <span>WAIT, HOW FAST IS THAT?</span>
            <span className="text-slate-500">EXHIBIT CITATION</span>
          </div>

          <h4 className="text-xl font-bold text-white mb-2">{title}</h4>

          <div className="inline-block px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 font-mono text-xs font-semibold mb-3">
            {metricHighlight}
          </div>

          <p className="text-sm text-slate-200 leading-relaxed italic mb-4">
            &ldquo;{funFact}&rdquo;
          </p>

          {mathFormula && (
            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 truncate">
              Math: {mathFormula}
            </div>
          )}
          {sourceCitation && (
            <div className="text-[10px] font-mono text-slate-500 pt-1 truncate">
              Source: {sourceCitation}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleCopyText}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all border ${
              copiedSnippet
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
            }`}
          >
            {copiedSnippet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSnippet ? 'Snippet Copied!' : 'Copy Social / Blog Quote'}</span>
          </button>

          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PNG...' : 'Download Image Card (PNG)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
