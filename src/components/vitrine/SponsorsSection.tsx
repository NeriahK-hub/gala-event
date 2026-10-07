import React from 'react';
import { useContent } from '../../content/ContentContext';

export const SponsorsSection: React.FC = () => {
  const { content, t } = useContent();

  if (content.sponsors.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-y border-[#E8C98A]/20 bg-[#160607]/30">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold mb-8">{t('sponsors.title')}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-stretch">
          {content.sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="p-4 rounded-xl border border-[#E8C98A]/20 bg-[#160607]/30 hover:border-[#E8C98A]/50 transition-colors flex flex-col items-center justify-center text-center"
            >
              <span className="font-serif tracking-widest text-sm font-semibold text-[#F3E5AB]">{sponsor.logoText}</span>
              <span className="text-xs uppercase tracking-wider text-[#E8C98A]/90 mt-1">{sponsor.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
