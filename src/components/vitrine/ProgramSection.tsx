import React from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const ProgramSection: React.FC = () => {
  const { content, t } = useContent();

  return (
    <section id="programme" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('program.kicker')} title={t('program.title')} subtitle={t('program.subtitle')} />

      <ol className="space-y-3 sm:space-y-4">
        {content.program.map((item, i) => (
          <Reveal
            key={item.id}
            delay={i * 0.08}
            className="rounded-3xl bg-white/10 ring-1 ring-white/15 p-6 sm:p-8 grid sm:grid-cols-[170px_1fr] gap-x-8 gap-y-2 items-start"
          >
            <div>
              <p className="font-sans font-bold tracking-tight text-white text-2xl sm:text-3xl leading-none">{item.time}</p>
              <p className="text-sm font-semibold text-[#FFB43A] mt-2">{item.category}</p>
            </div>
            <div>
              <h3 className="font-sans font-bold tracking-tight text-white text-xl sm:text-2xl">{item.title}</h3>
              <p className="text-base text-white/70 leading-relaxed mt-2">{item.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
};
