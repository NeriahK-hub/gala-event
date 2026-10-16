import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';
import { SectionHeader } from '../common/SectionHeader';
import { IllustrationChoose, IllustrationDoor, IllustrationLink, IllustrationWhatsApp } from '../help/ClientIllustrations';

interface HowItWorksSectionProps {
  onReserve: () => void;
}

const STEPS = [
  { key: 'step1', Art: IllustrationChoose },
  { key: 'step2', Art: IllustrationWhatsApp },
  { key: 'step3', Art: IllustrationLink },
  { key: 'step4', Art: IllustrationDoor },
];

// « Comment ça marche » : le parcours du client en 4 étapes illustrées
export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onReserve }) => {
  const { t } = useContent();

  return (
    <section id="comment" className="relative scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeader kicker={t('howto.kicker')} title={t('howto.title')} subtitle={t('howto.subtitle')} />

      {/* Téléphone : carrousel à faire glisser · tablette et ordinateur : grille */}
      <Reveal>
      <ol className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {STEPS.map(({ key, Art }, i) => (
            <li key={key} className="relative shrink-0 w-[82%] sm:w-auto snap-center flex flex-col rounded-[1.75rem] bg-white/[0.07] ring-1 ring-white/12 overflow-hidden">
              <div className="relative bg-gradient-to-b from-black/25 to-black/5 px-3 pt-4">
                <Art />
              </div>
              <div className="relative flex-1 px-5 sm:px-6 pb-6 pt-5">
                <span className="absolute -top-5 left-5 sm:left-6 w-10 h-10 rounded-full bg-cta text-[#3D0A04] font-extrabold text-lg flex items-center justify-center shadow-[0_8px_20px_rgba(242,118,27,0.35)] ring-4 ring-[#3A0C12]">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-sans font-bold tracking-tight text-white text-xl leading-snug text-balance">{t(`howto.${key}Title`)}</h3>
                <p className="mt-2 text-[15px] text-white/70 leading-relaxed">{t(`howto.${key}Text`)}</p>
              </div>
            </li>
        ))}
      </ol>
      </Reveal>
      <p className="sm:hidden mt-3 text-center text-xs text-white/50">Fais glisser pour voir les 4 étapes</p>

      <Reveal className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center">
        <button
          onClick={onReserve}
          className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-cta text-[#3D0A04] font-bold text-base shadow-[0_12px_30px_rgba(242,118,27,0.35)] hover:brightness-105 cursor-pointer"
        >
          {t('howto.cta')} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-white/60 max-w-xs text-balance">{t('howto.note')}</p>
      </Reveal>
    </section>
  );
};
