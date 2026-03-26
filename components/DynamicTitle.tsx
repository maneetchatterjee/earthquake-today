'use client';

import { useEffect, useRef } from 'react';
import { useEarthquakeData } from '@/hooks/useEarthquakeData';

function playPing() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignore errors from audio context (e.g., user hasn't interacted with page yet)
  }
}

export default function DynamicTitle() {
  const { day, loading } = useEarthquakeData();
  const prevCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loading && day.length >= 0) {
      document.title = `(${day.length}) Earth Monitor`;
      
      if (prevCountRef.current !== null && day.length > prevCountRef.current) {
        playPing();
      }
      prevCountRef.current = day.length;
    }
  }, [day.length, loading]);

  return null;
}
