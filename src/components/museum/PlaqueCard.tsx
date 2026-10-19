'use client';

import React, { useState } from 'react';
import { useSound } from '@/context/SoundContext';
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink, Share2, BookOpen, Calculator } from 'lucide-react';

interface PlaqueCardProps {
  title: string;
  subtitle?: string;
  category?: string;
  icon?: string;
  funFact: string;
  comparison?: string;
  mathFormula?: string;
  citation?: string;
  citationUrl?: string;
  shareSnippet?: string;
  onOpenShareModal?: () => void;
}

export default function PlaqueCard({
  title,
  subtitle,
  category,
  icon,
  funFact,
  comparison,
  mathFormula,
  citation,
  citationUrl,
  shareSnippet,
  onOpenShareModal,
}: PlaqueCardProps) {
  const { playClick } = useSound();
  const [showMath, setShowMath] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const textToCopy = shareSnippet || `"${funFact}" — Exhibit from Wait, How Fast Is That? (Digital Speed & Latency Museum)`;

  const handleCopy = async () => {
    playClick(1000);
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative Museum Plaque Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700 select-none">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              {category && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700/80">
                  {category}
                </span>
              )}
              <span className="text-[11px] font-mono text-indigo-400 font-semibold tracking-wide uppercase">
                Museum Plaque No.
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Copy museum fact to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Fact'}</span>
          </button>

          {onOpenShareModal && (
            <button
              onClick={() => {
                playClick(900);
                onOpenShareModal();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Export Fact Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Narrative Fun Fact */}
      <div className="text-sm text-slate-200 leading-relaxed space-y-3">
        <p className="font-normal">{funFact}</p>

        {comparison && (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
            <strong className="text-indigo-400 font-semibold flex items-center gap-1.5 mb-1">
              <span>💡 Real-World Perspective:</span>
            </strong>
            <p>{comparison}</p>
          </div>
        )}
      </div>

      {/* "Verify the Math" Drawer */}
      {(mathFormula || citation) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => {
              playClick(700);
              setShowMath(!showMath);
            }}
            className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-indigo-300 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verify the Math & Peer-Reviewed Sources</span>
            </span>
            {showMath ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMath && (
            <div className="mt-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs">
              {mathFormula && (
                <div>
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-1 uppercase tracking-wide">
                    Exact Mathematical Formula:
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 font-mono text-cyan-200 text-xs border border-cyan-500/20 overflow-x-auto">
                    {mathFormula}
                  </div>
                </div>
              )}

              {citation && (
                <div className="flex items-start gap-2 pt-1 text-slate-400">
                  <BookOpen className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[11px] font-mono text-slate-500 block uppercase">Official Citation:</span>
                    <span className="text-slate-300">{citation}</span>
                    {citationUrl && (
                      <a
                        href={citationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 ml-2 underline text-[11px]"
                      >
                        Read Paper <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
