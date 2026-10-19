'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSound } from '@/context/SoundContext';
import {
  MUSEUM_WALKTHROUGH_SECTIONS,
  computeScrollProgress,
} from '@/data/museumSections';

export { MUSEUM_WALKTHROUGH_SECTIONS, computeScrollProgress };
export type { MuseumWalkthroughSection } from '@/data/museumSections';

export default function MuseumScrollNavigator() {
  const { playClick } = useSound();
  const [activeId, setActiveId] = useState<string>('entrance');
  const [progressRatio, setProgressRatio] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const updateProgress = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const offsets = MUSEUM_WALKTHROUGH_SECTIONS.map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + scrollY;
    });

    const { activeIndex, progressRatio: ratio } = computeScrollProgress(
      scrollY,
      windowHeight,
      docHeight,
      offsets
    );

    setActiveId(MUSEUM_WALKTHROUGH_SECTIONS[activeIndex]?.id ?? 'entrance');
    setProgressRatio(ratio);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    const rafId = window.requestAnimationFrame(() => {
      updateProgress();
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [updateProgress]);

  const scrollToSection = (id: string, index: number) => {
    try {
      playClick(520 + index * 35);
    } catch {}

    if (id === 'entrance') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveId('entrance');
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
    }
  };

  const activeIndex = MUSEUM_WALKTHROUGH_SECTIONS.findIndex((s) => s.id === activeId);

  return (
    <nav
      aria-label="Museum Hall Navigator"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden lg:flex fixed left-3 xl:left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center select-none"
    >
      <div
        className={`relative flex flex-col items-center bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-full py-3.5 px-1.5 shadow-2xs transition-all duration-300 ${
          isHovered
            ? 'bg-white/95 border-slate-300 shadow-md opacity-100 scale-[1.02]'
            : 'opacity-60 hover:opacity-100'
        }`}
      >
        {/* Subtle dots container */}
        <div className="relative flex flex-col items-center gap-2.5">
          {/* Vertical Track Rail (runs from center of first dot to center of last dot) */}
          <div className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-[2px] pointer-events-none">
            {/* Inactive line */}
            <div className="w-full h-full bg-slate-200/90 rounded-full" />
            {/* Active filled line */}
            <div
              className="absolute top-0 left-0 w-full bg-indigo-600 rounded-full transition-[height] duration-75 ease-out"
              style={{
                height: `${Math.min(100, Math.max(0, progressRatio * 100))}%`,
              }}
            />
          </div>

          {/* Dots & Quiet Tooltips */}
          {MUSEUM_WALKTHROUGH_SECTIONS.map((section, idx) => {
            const isActive = activeId === section.id;
            const isPast = idx < activeIndex;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id, idx)}
                aria-label={`Jump to ${section.number}. ${section.title}`}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 z-10"
              >
                {/* Visual Dot */}
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-all duration-200 ${
                    isActive
                      ? 'w-3 h-3 bg-indigo-600 ring-4 ring-indigo-100 shadow-xs scale-110'
                      : isPast
                      ? 'w-2 h-2 bg-indigo-500 group-hover:scale-125'
                      : 'w-2 h-2 bg-slate-300 group-hover:bg-slate-400 group-hover:scale-125'
                  }`}
                />

                {/* Quiet Tooltip on hover/focus */}
                <div
                  role="tooltip"
                  className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 -translate-x-1.5 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-all duration-150 ease-out z-50 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-xs font-mono font-medium shadow-md border border-slate-800">
                    <span className="text-indigo-300 font-bold">{section.number}.</span>
                    <span>{section.title}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
