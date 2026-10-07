import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { WaxSeal } from '../common/WaxSeal';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { GALA_INFO } from '../../data/mockData';

interface InteractiveEnvelopeHeroProps {
  onReserveClick: () => void;
}

export const InteractiveEnvelopeHero: React.FC<InteractiveEnvelopeHeroProps> = ({
  onReserveClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleEnvelope = () => {
    if (!isOpen) {
      // Trigger gold sparkle confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4A857', '#E8C98A', '#FFF2C6', '#8B0A1A'],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl mx-auto my-6 px-4">
      {/* Interactive prompt banner */}
      <button
        onClick={handleToggleEnvelope}
        className="group mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4A857]/40 bg-[#7A0815]/80 hover:bg-[#8B0A1A] hover:border-[#D4A857] transition-all duration-300 text-xs tracking-wider uppercase text-[#E8C98A] cursor-pointer shadow-lg"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#D4A857] animate-spin" style={{ animationDuration: '6s' }} />
        <span>{isOpen ? "L'invitation est ouverte • Clique pour refermer" : "Touche l'enveloppe pour déplier l'invitation"}</span>
      </button>

      {/* Main Container holding Envelope & Golden Glove Hand */}
      <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-[340px] sm:h-[400px] flex items-center justify-center select-none">
        
        {/* THE ROYAL INVITATION CARD (Slides out when opened) */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-[88%] sm:w-[90%] transition-all duration-700 ease-out z-20 ${
            isOpen
              ? '-top-14 sm:-top-20 opacity-100 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(212,168,87,0.35)]'
              : 'top-8 opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative p-6 sm:p-7 rounded-lg border border-[#D4A857] bg-gradient-to-b from-[#1C0206] via-[#33040B] to-[#1C0206] text-center text-[#F9F5EC] overflow-hidden">
            {/* Fine filigree background lines */}
            <div className="absolute inset-1.5 border border-[#D4A857]/30 rounded pointer-events-none" />
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 rounded-full text-[#D4A857]/90 hover:text-[#D4A857] hover:bg-[#D4A857]/10"
                title="Refermer l'invitation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crest & Invitation Header */}
            <div className="mb-2">
              <span className="font-script text-3xl sm:text-4xl text-[#E8C98A] block leading-none">
                Le Grand Gala Royal
              </span>
              <p className="text-xs tracking-[0.25em] text-[#D4A857] uppercase font-semibold mt-1">
                Kinshasa • Vème Édition
              </p>
            </div>

            <div className="my-2.5 h-[1px] w-28 mx-auto bg-gradient-to-r from-transparent via-[#D4A857]/80 to-transparent" />

            <p className="font-serif italic text-xs sm:text-sm text-[#F3E5AB]/95 leading-relaxed max-w-xs mx-auto">
              « En l'honneur d'une nuit de distinction et de splendeur, nous avons l'insigne honneur de te convier à cette célébration impériale. »
            </p>

            <div className="mt-3.5 space-y-1 text-xs">
              <p className="text-[#E8C98A] font-semibold">{GALA_INFO.dateText}</p>
              <p className="text-[#D4A857]/90 text-xs">{GALA_INFO.venueName} • {GALA_INFO.timeText}</p>
            </div>

            <div className="mt-4 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReserveClick();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] font-semibold text-xs tracking-wider uppercase shadow-lg hover:shadow-[0_0_20px_rgba(212,168,87,0.7)] transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>Réserver mon billet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* THE RED TEXTURED ENVELOPE */}
        <div
          onClick={handleToggleEnvelope}
          className={`relative w-[280px] sm:w-[340px] h-[190px] sm:h-[220px] rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.65)] cursor-pointer transition-all duration-500 ease-out z-10 ${
            isOpen ? 'translate-y-16 sm:translate-y-20' : 'hover:scale-[1.02]'
          }`}
        >
          {/* Envelope Body Texture & Grain */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#8B0A1A] via-[#700715] to-[#4A030C] border border-[#A81428]/60 overflow-hidden shadow-inner">
            {/* Fine diagonal weave texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, #FFF 0, #FFF 1px, transparent 0, transparent 8px)',
              }}
            />
            {/* Subtle luxury edge bevel */}
            <div className="absolute inset-0 border border-[#D4A857]/20 rounded-lg pointer-events-none" />

            {/* Inscription "Vip" in golden script on top flap zone */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-10">
              <span className="font-script text-3xl sm:text-4xl text-[#E8C98A]/90 tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Vip
              </span>
            </div>

            {/* Bottom triangular folds of the envelope */}
            <svg
              viewBox="0 0 340 220"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              {/* Left fold */}
              <polygon
                points="0,220 170,120 0,0"
                fill="#5C0612"
                opacity="0.5"
              />
              {/* Right fold */}
              <polygon
                points="340,220 170,120 340,0"
                fill="#4D040E"
                opacity="0.6"
              />
              {/* Bottom fold */}
              <polygon
                points="0,220 170,115 340,220"
                fill="#6B0816"
                opacity="0.75"
              />
              {/* Fine gold hairline border along fold lines */}
              <line x1="0" y1="220" x2="170" y2="115" stroke="#D4A857" strokeWidth="0.8" opacity="0.3" />
              <line x1="340" y1="220" x2="170" y2="115" stroke="#D4A857" strokeWidth="0.8" opacity="0.3" />
            </svg>
          </div>

          {/* TOP FLAP (Flips open or closed) */}
          <div
            className={`absolute top-0 left-0 right-0 h-[115px] origin-top transition-transform duration-700 ease-in-out z-15 ${
              isOpen ? '-rotate-180 opacity-60' : 'rotate-0'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <svg
              viewBox="0 0 340 115"
              className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 340,0 170,115"
                fill="#7E0918"
                stroke="#A81428"
                strokeWidth="0.8"
              />
              <line x1="0" y1="0" x2="170" y2="115" stroke="#D4A857" strokeWidth="0.8" opacity="0.4" />
              <line x1="340" y1="0" x2="170" y2="115" stroke="#D4A857" strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>

          {/* GOLD WAX SEAL IN THE CENTER OF THE FLAP */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 z-30 ${
              isOpen ? 'top-1/2 -translate-y-1/2 scale-75 opacity-70' : 'top-[88px] sm:top-[96px] -translate-y-1/2 scale-100'
            }`}
          >
            <WaxSeal size="md" interactive={false} />
          </div>
        </div>

        {/* THE GOLDEN SATIN GLOVE HAND (Gracefully holding the envelope from below) */}
        <div className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[410px] pointer-events-none z-25 select-none drop-shadow-[0_12px_25px_rgba(0,0,0,0.7)]">
          <svg
            viewBox="0 0 420 180"
            className="w-full h-auto overflow-visible"
            fill="none"
          >
            <defs>
              {/* Ultra luxurious liquid satin gold gradients */}
              <linearGradient id="goldSatinGlove" x1="0%" y1="20%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#8A631E" />
                <stop offset="18%" stopColor="#C89D42" />
                <stop offset="38%" stopColor="#FDEAB8" />
                <stop offset="55%" stopColor="#DCAE52" />
                <stop offset="78%" stopColor="#8C621D" />
                <stop offset="100%" stopColor="#674712" />
              </linearGradient>

              <linearGradient id="goldHighlightSheen" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#FFF2C6" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#D4A857" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8A631E" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="wristSatinFolds" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#55390E" />
                <stop offset="25%" stopColor="#B38734" />
                <stop offset="50%" stopColor="#FFEFBE" />
                <stop offset="75%" stopColor="#B38734" />
                <stop offset="100%" stopColor="#55390E" />
              </linearGradient>
            </defs>

            {/* Arm / Forearm coming from right side */}
            <path
              d="M 420,135 
                 C 370,120 330,110 295,95 
                 C 275,85 255,80 230,82
                 C 200,85 170,95 145,108
                 C 130,116 115,118 95,116
                 C 80,115 65,110 50,118
                 C 42,123 48,135 60,135
                 C 90,135 125,148 160,155
                 C 210,165 270,162 330,158
                 L 420,150 Z"
              fill="url(#goldSatinGlove)"
            />

            {/* Thumb resting gracefully over the front lower border of the envelope */}
            <path
              d="M 175,70 
                 C 195,68 225,75 240,86
                 C 235,95 210,95 185,92
                 C 170,90 155,82 175,70 Z"
              fill="url(#goldHighlightSheen)"
              opacity="0.95"
            />

            {/* Fingers cradling beneath the envelope */}
            {/* Index finger */}
            <path
              d="M 120,105 
                 C 105,98 85,96 70,102 
                 C 64,105 66,112 75,114 
                 C 90,116 110,115 125,114 Z"
              fill="url(#goldSatinGlove)"
            />
            {/* Middle finger */}
            <path
              d="M 105,112 
                 C 88,106 65,106 50,113 
                 C 46,116 48,122 58,123 
                 C 75,124 92,122 110,121 Z"
              fill="url(#goldHighlightSheen)"
            />

            {/* Wrist satin gathering creases / folds */}
            <path
              d="M 310,102 C 315,120 318,140 312,158"
              stroke="#5A3D10"
              strokeWidth="2.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 312,103 C 317,121 320,141 314,159"
              stroke="#FFEFBE"
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 345,112 C 350,125 352,142 348,154"
              stroke="#5A3D10"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M 347,113 C 352,126 354,143 350,155"
              stroke="#FFEFBE"
              strokeWidth="1.2"
              fill="none"
              opacity="0.75"
            />

            {/* High satin sheen highlight across top curve of the palm & forearm */}
            <path
              d="M 380,128 C 340,115 290,95 240,84 C 210,78 185,82 165,92"
              stroke="url(#goldHighlightSheen)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </svg>
        </div>

      </div>

      {/* Direct CTA button below envelope */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onReserveClick}
          className="px-8 py-3.5 rounded-full border border-[#D4A857] bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] font-bold text-xs sm:text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(212,168,87,0.45)] hover:shadow-[0_0_35px_rgba(212,168,87,0.8)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
        >
          Réserver mon billet
        </button>

        <button
          onClick={handleToggleEnvelope}
          className="px-6 py-3.5 rounded-full border border-[#D4A857]/40 text-[#E8C98A] hover:text-[#FFF2C6] hover:border-[#D4A857] hover:bg-[#D4A857]/10 text-xs sm:text-sm tracking-wider uppercase transition-colors cursor-pointer whitespace-nowrap"
        >
          {isOpen ? "Fermer l'invitation" : "Voir l'invitation de luxe"}
        </button>
      </div>
    </div>
  );
};
