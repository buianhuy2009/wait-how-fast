'use client';

import React, { createContext, useContext, useState, useSyncExternalStore, useCallback } from 'react';
import {
  calculatePpiFromCardWidth,
  calculateCardWidthFromPpi,
  DevicePreset,
} from '@/lib/ppiMath';

interface CalibrationContextType {
  ppi: number;
  cardWidthPx: number;
  isCalibrated: boolean;
  activePresetId: string | null;
  setPpi: (ppi: number) => void;
  setCardWidthPx: (widthPx: number) => void;
  applyPreset: (preset: DevicePreset) => void;
  markAsCalibrated: () => void;
  resetCalibration: () => void;
}

const DEFAULT_PPI = 96;
const CalibrationContext = createContext<CalibrationContextType | null>(null);

const STORAGE_KEY_PPI = 'waithowfast_screen_ppi';
const STORAGE_KEY_CALIBRATED = 'waithowfast_is_calibrated';
const STORAGE_KEY_PRESET = 'waithowfast_active_preset';

// Simple external store subscribers
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getStoredPpi(): number {
  if (typeof window === 'undefined') return DEFAULT_PPI;
  try {
    const val = localStorage.getItem(STORAGE_KEY_PPI);
    if (val) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed > 30 && parsed < 600) return parsed;
    }
  } catch {}
  return DEFAULT_PPI;
}

function getStoredCalibrated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY_CALIBRATED) === 'true';
  } catch {}
  return false;
}

function getStoredPreset(): string | null {
  if (typeof window === 'undefined') return 'standard-96';
  try {
    const val = localStorage.getItem(STORAGE_KEY_PRESET);
    if (val !== null) return val;
    // If neither calibrated nor preset saved, default to standard-96
    const isCal = localStorage.getItem(STORAGE_KEY_CALIBRATED);
    const hasPpi = localStorage.getItem(STORAGE_KEY_PPI);
    if (!isCal && !hasPpi) return 'standard-96';
    return null;
  } catch {}
  return null;
}

export function CalibrationProvider({ children }: { children: React.ReactNode }) {
  const ppi = useSyncExternalStore(subscribe, getStoredPpi, () => DEFAULT_PPI);
  const isCalibrated = useSyncExternalStore(subscribe, getStoredCalibrated, () => false);
  const activePresetId = useSyncExternalStore(subscribe, getStoredPreset, () => null);

  const [cardWidthOverride, setCardWidthOverride] = useState<number | null>(null);
  const cardWidthPx = cardWidthOverride ?? calculateCardWidthFromPpi(ppi);

  const setPpi = useCallback((newPpi: number) => {
    const clampedPpi = Math.max(40, Math.min(500, newPpi));
    setCardWidthOverride(calculateCardWidthFromPpi(clampedPpi));
    try {
      localStorage.setItem(STORAGE_KEY_PPI, clampedPpi.toString());
      notify();
    } catch {}
  }, []);

  const setCardWidthPx = useCallback((newWidthPx: number) => {
    const clampedWidth = Math.max(120, Math.min(1600, newWidthPx));
    const newPpi = calculatePpiFromCardWidth(clampedWidth);
    setCardWidthOverride(clampedWidth);
    try {
      localStorage.setItem(STORAGE_KEY_PPI, newPpi.toString());
      localStorage.removeItem(STORAGE_KEY_PRESET);
      notify();
    } catch {}
  }, []);

  const applyPreset = useCallback((preset: DevicePreset) => {
    const newPpi = preset.estimatedCssPpi;
    setCardWidthOverride(calculateCardWidthFromPpi(newPpi));
    try {
      localStorage.setItem(STORAGE_KEY_PPI, newPpi.toString());
      localStorage.setItem(STORAGE_KEY_PRESET, preset.id);
      localStorage.setItem(STORAGE_KEY_CALIBRATED, 'true');
      notify();
    } catch {}
  }, []);

  const markAsCalibrated = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CALIBRATED, 'true');
      notify();
    } catch {}
  }, []);

  const resetCalibration = useCallback(() => {
    setCardWidthOverride(calculateCardWidthFromPpi(DEFAULT_PPI));
    try {
      localStorage.removeItem(STORAGE_KEY_PPI);
      localStorage.removeItem(STORAGE_KEY_CALIBRATED);
      localStorage.removeItem(STORAGE_KEY_PRESET);
      notify();
    } catch {}
  }, []);

  return (
    <CalibrationContext.Provider
      value={{
        ppi,
        cardWidthPx,
        isCalibrated,
        activePresetId,
        setPpi,
        setCardWidthPx,
        applyPreset,
        markAsCalibrated,
        resetCalibration,
      }}
    >
      {children}
    </CalibrationContext.Provider>
  );
}

export function useCalibration() {
  const context = useContext(CalibrationContext);
  if (!context) {
    throw new Error('useCalibration must be used within a CalibrationProvider');
  }
  return context;
}
