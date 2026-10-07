import React from 'react';
import { GALA_INFO } from '../../data/mockData';
import { InteractiveEnvelopeHero } from './InteractiveEnvelopeHero';
import { LuxuryFrame } from '../common/LuxuryFrame';
import { Calendar, MapPin, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onReserveClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReserveClick,
  onExploreClick,
}) => {
  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center items-center overflow-hidden">
      {/* Background ambient lighting and soft vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#A00D22]/60 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#D4A857]/15 rounded-full blur-[100px]" />
      </div>

      <LuxuryFrame className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Kicker / Subtitle */}
        <div className="inline-flex items-center gap-2 mb-3 text-xs sm:text-xs uppercase tracking-[0.18em] text-[#E8C98A]/90 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#D4A857]" />
          <span>{GALA_INFO.edition}</span>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <span>Kinshasa</span>
        </div>

        {/* Gala Name in Royal Script */}
        <h1 className="font-script text-5xl sm:text-7xl md:text-8xl text-gold-gradient tracking-wide mb-3 text-balance max-w-4xl px-10 pb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {GALA_INFO.name}
        </h1>

        {/* Slogan & Theme */}
        <p className="font-serif italic text-lg sm:text-2xl text-[#F3E5AB] max-w-2xl mx-auto mb-4 font-normal tracking-wide">
          « {GALA_INFO.slogan} »
        </p>

        {/* Date and Location in Gold Serif / Sans */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#E8C98A] mb-4">
          <div className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4A857]" />
            <span className="font-semibold">{GALA_INFO.dateText}</span>
            <span className="text-[#D4A857]/90">({GALA_INFO.timeText})</span>
          </div>
          <span aria-hidden="true" className="hidden sm:inline text-[#D4A857]/90">·</span>
          <div className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4A857]" />
            <span>{GALA_INFO.venueName}, {GALA_INFO.city}</span>
          </div>
        </div>

        {/* Action principale, visible tout de suite */}
        <button
          onClick={onReserveClick}
          className="mb-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#3D030B] font-bold text-sm tracking-wide shadow-[0_8px_24px_rgba(212,168,87,0.25)] hover:brightness-110 transition cursor-pointer"
        >
          Réserver mon billet
        </button>

        {/* Central Element: Textured Red Envelope held by Golden Satin Glove Hand */}
        <InteractiveEnvelopeHero onReserveClick={onReserveClick} />

        {/* Discrete bottom scroll indicator */}
        <button
          onClick={onExploreClick}
          className="mt-6 text-xs tracking-[0.12em] uppercase text-[#D4A857]/90 hover:text-[#E8C98A] transition-colors flex flex-col items-center gap-1.5 cursor-pointer group"
        >
          <span>Découvrir l'univers du gala</span>
          <span className="w-4 h-4 border-b border-r border-[#D4A857]/60 rotate-45 transform group-hover:translate-y-1 transition-transform" />
        </button>
      </LuxuryFrame>
    </section>
  );
};
