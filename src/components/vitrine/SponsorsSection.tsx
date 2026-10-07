import React from 'react';
import { PARTNERS_SPONSORS } from '../../data/mockData';

export const SponsorsSection: React.FC = () => {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-[#D4A857]/20 bg-[#150608]/50">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#D4A857]/90 font-semibold mb-8">
          Mécènes & Partenaires Officiels de Prestige
        </p>

        {/* Clean, Sobres Logos Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {PARTNERS_SPONSORS.map((sponsor) => (
            <div
              key={sponsor.id}
              className="p-4 rounded-xl border border-[#D4A857]/15 bg-[#170709]/30 hover:border-[#D4A857]/40 hover:bg-[#1F0B10]/50 transition-all flex flex-col items-center justify-center text-center group cursor-default"
            >
              <span className="font-serif tracking-widest text-xs sm:text-sm font-semibold text-[#E8C98A]/85 group-hover:text-white transition-colors">
                {sponsor.logoText}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#D4A857]/90 mt-1">
                {sponsor.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
