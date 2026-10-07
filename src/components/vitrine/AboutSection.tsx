import React from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const AboutSection: React.FC = () => {
  const { content, t } = useContent();

  return (
    <section id="about" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('about.kicker')} title={t('about.title')} />

      <div className="max-w-3xl mx-auto text-center space-y-6">
        <Reveal><p className="font-serif text-xl sm:text-2xl text-[#F3E5AB] leading-relaxed">{t('about.p1')}</p></Reveal>
        <Reveal delay={0.1}><p className="text-stone-100/90 text-base leading-relaxed">{t('about.p2')}</p></Reveal>
        <Reveal delay={0.2}><p className="text-stone-100/90 text-base leading-relaxed">{t('about.p3')}</p></Reveal>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16">
        {content.galaInfo.keyStats.map((stat, idx) => (
          <Reveal
            key={idx}
            delay={idx * 0.08}
            className="rounded-2xl border border-[#E8C98A]/25 bg-[#3D0309]/35 px-4 py-6 text-center flex flex-col items-center"
          >
            <span className="font-serif tabular-nums text-3xl sm:text-4xl text-gold-gradient tracking-tight">
              {stat.value}
            </span>
            <span className="text-sm font-semibold text-[#F3E5AB] mt-2">{stat.label}</span>
            <span className="text-xs text-[#E8C98A]/90 mt-1 max-w-[180px]">{stat.desc}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
