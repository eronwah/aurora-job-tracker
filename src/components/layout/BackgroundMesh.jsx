import React from 'react';

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep dark base */}
      <div className="absolute inset-0 bg-[#08040d]" />

      {/* Fluid emerald glow blob 1 */}
      <div 
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-emerald-500/12 filter blur-[110px] animate-liquid-flow"
        style={{ animationDuration: '18s' }}
      />

      {/* Fluid violet glow blob 2 */}
      <div 
        className="absolute top-1/4 -right-28 w-[38rem] h-[38rem] rounded-full bg-purple-600/15 filter blur-[130px] animate-liquid-flow"
        style={{ animationDuration: '22s', animationDirection: 'reverse' }}
      />

      {/* Cyan & emerald lower accent */}
      <div 
        className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full bg-teal-400/10 filter blur-[120px] animate-pulse-slow"
      />

      {/* Micro dot matrix pattern for modern depth */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#00e599 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
