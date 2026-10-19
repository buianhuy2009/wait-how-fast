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
    <div className="w-full bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden text-slate-800">
      {/* Decorative Museum Plaque Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs select-none">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              {category && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {category}
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400 font-bold tracking-wide uppercase">
                Curator Plaque
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
            }`}
            title="Copy museum fact to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Fact'}</span>
          </button>

          {onOpenShareModal && (
            <button
              onClick={() => {
                playClick(900);
                onOpenShareModal();
              }}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
              title="Export Fact Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Narrative Fun Fact */}
      <div className="text-sm text-slate-700 leading-relaxed space-y-3">
        <p className="font-normal">{funFact}</p>

        {comparison && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed">
            <strong className="text-indigo-800 font-bold flex items-center gap-1.5 mb-1">
              <span>💡 Real-World Perspective:</span>
            </strong>
            <p className="font-medium">{comparison}</p>
          </div>
        )}
      </div>

      {/* "Verify the Math" Drawer */}
      {(mathFormula || citation) && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              playClick(700);
              setShowMath(!showMath);
            }}
            className="w-full flex items-center justify-between text-xs font-mono font-bold text-slate-500 hover:text-indigo-600 py-1 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verify the Math & Peer-Reviewed Sources</span>
            </span>
            {showMath ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMath && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-fade-in">
              {mathFormula && (
                <div>
                  <div className="text-[11px] font-mono text-indigo-800 font-bold mb-1 uppercase tracking-wide">
                    Exact Mathematical Formula:
                  </div>
                  <div className="p-3 rounded-xl bg-white font-mono text-indigo-900 text-xs border border-indigo-200/80 overflow-x-auto shadow-2xs">
                    {mathFormula}
                  </div>
                </div>
              )}

              {citation && (
                <div className="flex items-start gap-2 pt-1 text-slate-600">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Official Citation:</span>
                    <span className="text-slate-700 font-medium">{citation}</span>
                    {citationUrl && (
                      <a
                        href={citationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 ml-2 underline text-[11px] font-bold"
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
