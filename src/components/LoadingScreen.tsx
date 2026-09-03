import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Sparkles, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onLoaded?: () => void;
  minDurationMs?: number;
}

const CIVIC_TIPS = [
  'Connecting to OpenStreetMap India & Bengaluru Ward Grid...',
  'Initializing AI Civic Hazard Detection...',
  'Syncing Clean City Squads & Community Reports...',
  'Loading Namma Points & Citizen Leaderboard...',
  'Empowering Citizens to Report, Track & Transform Bengaluru...',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoaded,
  minDurationMs = 1200,
}) => {
  const [progress, setProgress] = useState(15);
  const [tipIndex, setTipIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const step = Math.floor(Math.random() * 25) + 10;
        return Math.min(100, prev + step);
      });
    }, 180);

    // Tip cycle timer
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CIVIC_TIPS.length);
    }, 900);

    // Finish after min duration
    const timeout = setTimeout(() => {
      setProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        if (onLoaded) onLoaded();
      }, 400);
    }, minDurationMs);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
      clearTimeout(timeout);
    };
  }, [minDurationMs, onLoaded]);

  return (
    <div
      id="namma-app-loading-screen"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-white to-cyan-50/40 p-6 select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-400/10 via-emerald-400/10 to-purple-400/10 blur-3xl animate-pulse" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-cyan-100/60 animate-ping opacity-25" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Glowing Logo Wrapper */}
        <div className="relative mb-6 transform transition-all duration-700 ease-out hover:scale-105">
          {/* Subtle Glow Aura behind Logo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-emerald-500/20 blur-xl animate-pulse" />
          
          <div className="relative bg-white/80 p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xl backdrop-blur-md">
            <Logo size="xl" showTagline={true} />
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-xs space-y-2 mt-4">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
            <span className="flex items-center gap-1 text-cyan-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              Loading Platform...
            </span>
            <span className="font-mono text-slate-700">{progress}%</span>
          </div>
        </div>

        {/* Dynamic Contextual Civic Tip */}
        <div className="mt-5 min-h-[32px] flex items-center justify-center px-3 py-1.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-xs backdrop-blur-sm max-w-xs transition-all">
          <p className="text-xs font-medium text-slate-600 line-clamp-1 animate-in fade-in duration-300">
            {CIVIC_TIPS[tipIndex]}
          </p>
        </div>

        {/* Civic Trust Badge */}
        <div className="mt-8 flex items-center gap-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            BBMP Verified
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-sky-600">
            <MapPin className="w-3.5 h-3.5" />
            OpenStreetMap
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-purple-600">
            <Sparkles className="w-3.5 h-3.5" />
            AI Powered
          </span>
        </div>
      </div>
    </div>
  );
};
