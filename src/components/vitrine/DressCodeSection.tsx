import React from 'react';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';

export const DressCodeSection: React.FC = () => {
  const { content, t } = useContent();
  const { dressCode } = content.galaInfo;

  return (
    <section id="dresscode" className="relative scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Reveal className="rounded-[2rem] bg-white/10 ring-1 ring-white/15 p-7 sm:p-14">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm sm:text-base font-semibold text-[#FFB43A] mb-3">{t('dresscode.kicker')}</p>
          <h2 className="font-sans font-bold tracking-tight text-white text-4xl sm:text-5xl leading-[1.05] text-balance">
            {dressCode.title}
          </h2>
          <p className="mt-4 text-xl text-white/85 text-balance">{dressCode.subtitle}</p>
          <p className="mt-3 text-lg text-white/65 leading-relaxed text-balance">{dressCode.description}</p>
        </div>

        <div className="mt-12 sm:mt-14 text-center">
          <p className="text-sm font-semibold text-white/60 mb-6">{t('dresscode.paletteLabel')}</p>
          <ul className="flex flex-wrap items-start justify-center gap-x-8 gap-y-6 sm:gap-x-12">
            {dressCode.colors.map((color, i) => (
              <li key={i} className="flex flex-col items-center w-28 sm:w-32">
                <span
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-1 ring-white/40 shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
                  style={{ backgroundColor: color.hex }}
                  aria-hidden="true"
                />
                <span className="mt-3 text-base font-semibold text-white">{color.name}</span>
                <span className="text-sm text-white/60 text-balance">{color.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-12 sm:mt-14">
          {[
            { title: t('dresscode.womenTitle'), text: dressCode.womenGuidelines },
            { title: t('dresscode.menTitle'), text: dressCode.menGuidelines },
          ].map((g) => (
            <div key={g.title} className="rounded-3xl bg-black/20 p-6 sm:p-8">
              <h3 className="font-sans font-bold tracking-tight text-white text-xl">{g.title}</h3>
              <p className="mt-2 text-base text-white/70 leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/60">{t('dresscode.note')}</p>
      </Reveal>
    </section>
  );
};
