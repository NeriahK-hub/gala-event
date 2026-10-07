import React from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';

export const ProgramSection: React.FC = () => {
  const { content, t } = useContent();

  return (
    <section id="programme" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('program.kicker')} title={t('program.title')} subtitle={t('program.subtitle')} />

      <div className="relative border-l border-[#E8C98A]/40 ml-4 sm:ml-32 md:ml-40 space-y-10 sm:space-y-12">
        {content.program.map((item) => (
          <div key={item.id} className="relative pl-8 sm:pl-10 group">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-[#E8C98A] bg-[#1C0709] group-hover:bg-[#E8C98A] group-hover:scale-125 transition-all duration-300" />

            <div className="sm:absolute sm:-left-36 sm:top-0 sm:text-right sm:w-28 mb-1 sm:mb-0">
              <span className="font-serif tabular-nums text-2xl text-gold-gradient tracking-wide block">{item.time}</span>
              <span className="text-xs uppercase tracking-widest text-[#E8C98A] font-medium">{item.category}</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-[#E8C98A]/20 bg-[#160607]/40 hover:border-[#E8C98A]/50 transition-colors">
              <h3 className="font-serif text-xl text-[#F9F5EC] font-semibold mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-stone-100/90 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
