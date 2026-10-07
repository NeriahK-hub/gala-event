import React from 'react';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';

export const SponsorsSection: React.FC = () => {
  const { content, t } = useContent();

  if (content.sponsors.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#E8C98A]/20 bg-[#3D0309]/30">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold mb-8">{t('sponsors.title')}</p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {content.sponsors.map((sponsor, i) => (
            <Reveal
              key={sponsor.id}
              delay={i * 0.08}
              className="min-w-[200px] p-4 rounded-xl border border-[#E8C98A]/20 bg-[#3D0309]/30 hover:border-[#E8C98A]/50 transition-colors flex flex-col items-center justify-center text-center"
            >
              <span className="font-serif tracking-widest text-sm font-semibold text-[#F3E5AB]">{sponsor.logoText}</span>
              <span className="text-xs uppercase tracking-wider text-[#E8C98A]/90 mt-1">{sponsor.category}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
