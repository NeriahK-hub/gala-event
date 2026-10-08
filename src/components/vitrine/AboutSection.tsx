import React from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const AboutSection: React.FC = () => {
  const { content, t } = useContent();

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('about.kicker')} title={t('about.title')} />

      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Reveal>
          <p className="font-sans font-semibold tracking-tight text-white text-2xl sm:text-3xl leading-snug text-balance">
            {t('about.p1')}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-lg text-white/70 leading-relaxed text-balance">{t('about.p2')}</p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="text-lg text-white/70 leading-relaxed text-balance">{t('about.p3')}</p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-14 sm:mt-20">
        {content.galaInfo.keyStats.map((stat, idx) => (
          <Reveal
            key={idx}
            delay={idx * 0.07}
            className="rounded-3xl bg-white/10 ring-1 ring-white/15 p-5 sm:p-7 text-center flex flex-col items-center justify-center"
          >
            <span className="font-sans font-bold tracking-tight text-white text-3xl sm:text-4xl leading-none">
              {stat.value}
            </span>
            <span className="text-sm sm:text-base font-semibold text-[#FFB43A] mt-3">{stat.label}</span>
            <span className="text-sm text-white/60 mt-1 text-balance">{stat.desc}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
