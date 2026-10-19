'use client';

import React, { createContext, useContext, useSyncExternalStore, useCallback } from 'react';
import { sound } from '@/lib/soundEngine';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: (pitch?: number) => void;
  playSonar: (freq?: number, duration?: number) => void;
  playPacket: () => void;
  playDrop: () => void;
  playCpu: () => void;
  playChime: () => void;
  playBuzz: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);
const STORAGE_KEY_MUTED = 'waithowfast_is_muted';

const soundListeners = new Set<() => void>();
function notifySound() {
  soundListeners.forEach((l) => l());
}

function subscribeSound(callback: () => void) {
  soundListeners.add(callback);
  return () => {
    soundListeners.delete(callback);
  };
}

function getStoredMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(STORAGE_KEY_MUTED);
    const muted = val === 'true';
    sound.setMuted(muted);
    return muted;
  } catch {}
  return false;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const isMuted = useSyncExternalStore(subscribeSound, getStoredMuted, () => false);

  const toggleMute = useCallback(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
      const next = !current;
      sound.setMuted(next);
      localStorage.setItem(STORAGE_KEY_MUTED, next.toString());
      notifySound();
      if (!next) {
        sound.playClick(900);
      }
    } catch {}
  }, []);

  const playClick = useCallback((pitch?: number) => sound.playClick(pitch), []);
  const playSonar = useCallback((freq?: number, duration?: number) => sound.playSonarPing(freq, duration), []);
  const playPacket = useCallback(() => sound.playPacketArrival(), []);
  const playDrop = useCallback(() => sound.playDataDrop(), []);
  const playCpu = useCallback(() => sound.playCpuTick(), []);
  const playChime = useCallback(() => sound.playChime(), []);
  const playBuzz = useCallback(() => sound.playWarningBuzz(), []);

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playClick,
        playSonar,
        playPacket,
        playDrop,
        playCpu,
        playChime,
        playBuzz,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
