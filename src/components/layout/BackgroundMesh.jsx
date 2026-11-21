import React from 'react';

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep carbon graphite base */}
      <div className="absolute inset-0 bg-[#0b0c0e]" />

      {/* Liquid luminous yellow ambient orb 1 */}
      <div 
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-yellow-400/10 filter blur-[120px] animate-liquid-flow"
        style={{ animationDuration: '18s' }}
      />

      {/* Brushed silver metallic ambient orb 2 */}
      <div 
        className="absolute top-1/4 -right-28 w-[38rem] h-[38rem] rounded-full bg-zinc-300/10 filter blur-[130px] animate-liquid-flow"
        style={{ animationDuration: '22s', animationDirection: 'reverse' }}
      />

      {/* Subtle warm silver/gold lower accent */}
      <div 
        className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full bg-amber-300/8 filter blur-[120px] animate-pulse-slow"
      />

      {/* Fine silver micro dot matrix */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#d4d4d8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
