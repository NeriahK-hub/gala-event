import React from 'react';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ kicker, title, subtitle }) => (
  <div className="text-center mb-14 sm:mb-16">
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-10 sm:w-12 bg-gradient-to-r from-transparent to-[#D4A857]/70" />
      <span className="text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold">{kicker}</span>
      <div className="h-px w-10 sm:w-12 bg-gradient-to-l from-transparent to-[#D4A857]/70" />
    </div>
    <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4 text-balance">
      {title}
    </h2>
    {subtitle && (
      <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/90 max-w-xl mx-auto text-balance">
        {subtitle}
      </p>
    )}
  </div>
);
