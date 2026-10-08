import React from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ kicker, title, subtitle }) => (
  <Reveal className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
    <p className="text-sm sm:text-base font-semibold text-[#FFB43A] mb-3">{kicker}</p>
    <h2 className="font-sans font-bold tracking-tight text-white text-4xl sm:text-5xl leading-[1.05] text-balance">
      {title}
    </h2>
    {subtitle && <p className="mt-4 text-lg sm:text-xl text-white/75 text-balance">{subtitle}</p>}
  </Reveal>
);
