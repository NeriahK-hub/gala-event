import React from 'react';
import { PROGRAM_TIMELINE } from '../../data/mockData';

export const ProgramSection: React.FC = () => {
  return (
    <section id="programme" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
            Le Déroulement
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          Au Programme de la Soirée
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/80 max-w-xl mx-auto">
          Une succession de moments rares, rythmés par l'excellence protocolaire et la grâce artistique.
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l border-[#D4A857]/35 ml-4 sm:ml-32 md:ml-40 space-y-12">
        {PROGRAM_TIMELINE.map((item) => (
          <div key={item.id} className="relative pl-8 sm:pl-10 group">
            
            {/* Timeline Node (Golden Wax/Ring Point) */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-[#D4A857] bg-[#1F0B10] group-hover:bg-[#D4A857] group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(212,168,87,0.5)]" />

            {/* Time label on the left (visible on desktop) */}
            <div className="sm:absolute sm:-left-36 sm:top-0 sm:text-right sm:w-28 mb-1 sm:mb-0">
              <span className="font-serif tabular-nums text-xl sm:text-2xl text-gold-bright tracking-wide block">
                {item.time}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#D4A857]/90 font-medium">
                {item.category}
              </span>
            </div>

            {/* Content card */}
            <div className="p-5 sm:p-6 rounded-xl border border-[#D4A857]/20 bg-gradient-to-br from-[#2E1218]/40 to-[#170709]/60 backdrop-blur-sm hover:border-[#D4A857]/50 transition-all duration-300 shadow-md">
              <h3 className="font-serif text-lg sm:text-xl text-[#F9F5EC] font-semibold mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
