import React from 'react';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';

export const SponsorsSection: React.FC = () => {
  const { content, t } = useContent();

  if (content.sponsors.length === 0) return null;

  return (
    <section className="relative py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <p className="text-sm sm:text-base font-semibold text-white/60 mb-8">{t('sponsors.title')}</p>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {content.sponsors.map((sponsor, i) => (
            <Reveal
              key={sponsor.id}
              delay={i * 0.07}
              className="min-w-[200px] rounded-2xl bg-white/10 ring-1 ring-white/15 px-6 py-5 flex flex-col items-center justify-center text-center"
            >
              <span className="font-sans font-bold tracking-tight text-white text-base sm:text-lg">{sponsor.logoText}</span>
              <span className="text-sm text-white/60 mt-1">{sponsor.category}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
