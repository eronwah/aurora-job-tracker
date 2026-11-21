import React, { useEffect, useState } from 'react';
import { Briefcase, Sparkles, ShieldCheck } from 'lucide-react';

export default function SplashScreen({ onFinished }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const steps = [
    'Initializing workspace...',
    'Syncing Google Sheet pipeline & non-AI feeds...',
    'Ready for daily applications'
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 360);
    const t2 = setTimeout(() => setStepIndex(2), 780);
    const tFade = setTimeout(() => setIsFading(true), 1040);
    const tDone = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1360);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tFade);
      clearTimeout(tDone);
    };
  }, [onFinished]);

  return (
    <div
      aria-label="Loading AuroraJobs"
      className={`fixed inset-0 z-[100] bg-[#0b0c0e] safe-top safe-bottom flex flex-col items-center justify-center px-6 transition-opacity duration-300 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Silver & Yellow Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-yellow-400/12 filter blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-zinc-300/12 filter blur-[110px]" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Metallic Silver & Yellow Emblem */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-400 via-zinc-200 to-zinc-500 p-[2px] shadow-2xl shadow-yellow-400/20">
          <div className="w-full h-full bg-[#111317] rounded-[22px] flex items-center justify-center">
            <Briefcase className="w-9 h-9 text-yellow-400" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>Remote Career Command Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Aurora<span className="text-yellow-400">Jobs</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
            Track remote job applications, discover verified remote listings with clear platform sources, tailor human-sounding cover letters, and stay synced automatically with Google Sheets.
          </p>
        </div>

        {/* Animated Yellow & Silver Progress Bar */}
        <div className="w-full max-w-xs mx-auto space-y-2.5 pt-2">
          <div className="h-1.5 w-full rounded-full bg-zinc-900 border border-zinc-700/70 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-zinc-300 via-yellow-400 to-amber-300 animate-splash-progress" />
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] font-medium text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            <span>{steps[stepIndex]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
