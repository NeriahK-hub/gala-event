import React from 'react';

const GOLD = '#E8C98A';

// Découpes dorées concaves au centre des bords, fixes à l'écran (comme sur un carton d'invitation).
export const PosterFrame: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] print:hidden">
    {/* haut */}
    <svg viewBox="0 0 200 50" className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-40 h-auto" fill={GOLD}>
      <path d="M0,0 C70,0 92,10 100,50 C108,10 130,0 200,0 Z" />
    </svg>
    {/* bas */}
    <svg viewBox="0 0 200 50" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-40 h-auto rotate-180" fill={GOLD}>
      <path d="M0,0 C70,0 92,10 100,50 C108,10 130,0 200,0 Z" />
    </svg>
    {/* gauche */}
    <svg viewBox="0 0 50 200" className="absolute left-0 top-1/2 -translate-y-1/2 h-20 sm:h-40 w-auto" fill={GOLD}>
      <path d="M0,0 C0,70 10,92 50,100 C10,108 0,130 0,200 Z" />
    </svg>
    {/* droite */}
    <svg viewBox="0 0 50 200" className="absolute right-0 top-1/2 -translate-y-1/2 h-20 sm:h-40 w-auto rotate-180" fill={GOLD}>
      <path d="M0,0 C0,70 10,92 50,100 C10,108 0,130 0,200 Z" />
    </svg>
  </div>
);
