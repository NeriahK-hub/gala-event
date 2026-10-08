import React from 'react';
import { Calendar, ChevronDown, MapPin, Phone, Ticket } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from '../common/EmpireLogo';
import { Reveal } from '../common/Reveal';

interface HeroSectionProps {
  onReserveClick: () => void;
  onExploreClick: () => void;
}

// Date de l'événement : « 12 », « DÉC. », « 2026 » (calculée depuis la date du compte à rebours)
const splitDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '').toUpperCase() + '.',
    year: String(d.getFullYear()),
  };
};

export const HeroSection: React.FC<HeroSectionProps> = ({ onReserveClick, onExploreClick }) => {
  const { content, t } = useContent();
  const info = content.galaInfo;
  const date = splitDate(info.isoDate);
  const price = content.tiers[0]?.price;

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-14 px-4 flex flex-col items-center justify-center text-center overflow-hidden scroll-mt-20"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <Reveal immediate><EmpireLogo size={76} className="mb-4" /></Reveal>

        <Reveal immediate delay={0.05}>
        <p className="inline-flex items-center gap-2 mb-2 text-xs sm:text-sm text-[#FFD9A0] font-semibold">
          {info.edition}
        </p>
        </Reveal>

        {/* Titre façon affiche : script + gros caractères blancs + ruban */}
        <Reveal immediate delay={0.12} className="flex flex-col items-center">
        <span className="font-script text-6xl sm:text-8xl text-gold-gradient leading-none -mb-2 sm:-mb-4 [text-shadow:0_2px_0_rgba(120,40,0,0.35)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          {t('hero.titleScript')}
        </span>
        <h1 className="font-sans font-black uppercase leading-[0.92] tracking-tight text-white text-[2.6rem] sm:text-7xl md:text-[5.5rem] drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
          {t('hero.titleMain')}
        </h1>
        </Reveal>

        <Reveal immediate delay={0.24} className="relative mt-4 mb-5">
          <div className="px-10 sm:px-14 py-2.5 bg-gradient-to-b from-[#C21226] to-[#8E0A18] border-y-2 border-[#F0B54A] shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
            <span className="font-sans font-extrabold uppercase tracking-[0.14em] text-white text-lg sm:text-2xl">
              {t('hero.titleBadge')}
            </span>
          </div>
        </Reveal>

        <Reveal immediate delay={0.32}>
          <p className="font-serif italic text-lg sm:text-2xl text-[#FFE9C2] max-w-2xl mb-5 text-balance">{info.slogan}</p>
        </Reveal>

        {/* Date + prix, comme les pastilles orange de l'affiche */}
        <Reveal immediate delay={0.4} className="flex flex-wrap items-stretch justify-center gap-3 mb-5">
          {date && (
            <div className="px-5 py-3 rounded-xl bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#4A0A06] text-center shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
              <span className="block font-sans font-black text-4xl sm:text-5xl leading-none">{date.day}</span>
              <span className="block font-sans font-extrabold text-sm sm:text-base leading-tight">{date.month}</span>
              <span className="block font-sans font-extrabold text-sm sm:text-base leading-tight">{date.year}</span>
            </div>
          )}
          {price !== undefined && (
            <div className="px-5 py-3 rounded-xl border-2 border-[#F0B54A] bg-[#4A0610]/70 text-center flex flex-col justify-center">
              <span className="block text-xs uppercase tracking-wider text-[#FFD9A0] font-semibold">{t('hero.priceLabel')}</span>
              <span className="block font-sans font-black text-4xl sm:text-5xl text-white leading-none">
                {price}
                <span className="text-2xl sm:text-3xl ml-1 text-[#FFB43A]">$</span>
              </span>
            </div>
          )}
        </Reveal>

        <Reveal immediate delay={0.48} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base text-[#FFE9C2] mb-6">
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FFB43A]" />
            <span className="font-semibold">{info.dateText}</span>
            {info.timeText && <span className="text-[#FFD9A0]">({info.timeText})</span>}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FFB43A]" />
            <span>
              {[info.venueName, info.city].filter(Boolean).join(', ')}
            </span>
          </span>
        </Reveal>

        <Reveal immediate delay={0.56} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-extrabold text-base shadow-[0_12px_28px_rgba(242,118,27,0.35)] hover:brightness-110 transition cursor-pointer"
          >
            <Ticket className="w-5 h-5" />
            {t('hero.cta')}
          </button>
          <a
            href={`tel:${info.whatsappNumber.replace(/[^0-9+]/g, '')}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/50 text-white font-semibold text-base hover:bg-white/10 transition"
          >
            <Phone className="w-5 h-5" />
            {info.whatsappNumber}
          </a>
        </Reveal>

        <Reveal immediate delay={0.8}>
        <button
          onClick={onExploreClick}
          className="mt-10 text-xs tracking-[0.14em] uppercase text-[#FFD9A0] hover:text-white transition-colors flex flex-col items-center gap-1.5 cursor-pointer group"
        >
          <span>{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        </Reveal>
      </div>
    </section>
  );
};
