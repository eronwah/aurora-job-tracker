import React, { useEffect, useState } from 'react';
import { Briefcase, Sparkles, ShieldCheck } from 'lucide-react';

export default function SplashScreen({ onFinished }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const steps = [
    'Initializing Liquid Aurora workspace...',
    'Loading remote tracker & non-AI platform filters...',
    'Ready for daily applications'
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 380);
    const t2 = setTimeout(() => setStepIndex(2), 820);
    const tFade = setTimeout(() => setIsFading(true), 1080);
    const tDone = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1420);

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
      className={`fixed inset-0 z-[100] bg-[#08040d] safe-top safe-bottom flex flex-col items-center justify-center px-6 transition-opacity duration-350 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient Aurora Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-emerald-500/15 filter blur-[90px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-600/20 filter blur-[100px]" />
      </div>

      {/* Centered Content Card */}
      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Emblem */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-purple-500 p-[2px] shadow-2xl shadow-emerald-500/25">
          <div className="w-full h-full bg-[#0d0718] rounded-[22px] flex items-center justify-center">
            <Briefcase className="w-9 h-9 text-emerald-400" />
          </div>
        </div>

        {/* Title & Pill */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Remote Career Command Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            Aurora<span className="text-emerald-400">Jobs</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Organize remote job applications, explore opportunities on LinkedIn, Indeed &amp; Upwork, tailor human-sounding cover letters, and sync across Desktop &amp; iPhone with Google Sheets.
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-xs mx-auto space-y-2.5 pt-2">
          <div className="h-1.5 w-full rounded-full bg-slate-900 border border-purple-500/20 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-500 animate-splash-progress" />
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] font-medium text-emerald-300/90">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{steps[stepIndex]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
