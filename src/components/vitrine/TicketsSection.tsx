import React from 'react';
import { TICKET_TIERS } from '../../data/mockData';
import { TicketTierId } from '../../types';
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react';

interface TicketsSectionProps {
  onSelectTier: (tierId: TicketTierId) => void;
}

export const TicketsSection: React.FC<TicketsSectionProps> = ({ onSelectTier }) => {
  return (
    <section id="billets" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
            Billetterie Officielle
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          Choisis ta formule
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/80 max-w-xl mx-auto">
          Des formules conçues pour t'offrir une expérience royale sur mesure.
        </p>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {TICKET_TIERS.map((tier) => {
          const isVip = tier.id === 'vip';

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isVip
                  ? 'border-2 border-[#D4A857] bg-gradient-to-b from-[#A00D22]/80 via-[#7A0815]/90 to-[#3D030B] shadow-[0_0_35px_rgba(212,168,87,0.3)] lg:-translate-y-3'
                  : 'border border-[#D4A857]/30 bg-gradient-to-b from-[#8E0A1C]/50 to-[#5A040F]/80 shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:border-[#D4A857]/60'
              }`}
            >
              {/* Top VIP Badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-1 rounded-full bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#3D030B] text-xs font-bold tracking-widest uppercase shadow-md">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{tier.badge}</span>
                  </span>
                </div>
              )}

              {/* Card Header */}
              <div className="p-7 sm:p-8 border-b border-[#D4A857]/20">
                <p className="text-xs uppercase tracking-[0.12em] text-[#D4A857] font-semibold mb-2">
                  {tier.subtitle}
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F9F5EC] mb-4">
                  {tier.name}
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-serif text-5xl sm:text-6xl text-gold-bright tracking-tight tabular-nums">
                    {tier.price}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold uppercase text-[#E8C98A]">USD</span>
                    <span className="text-xs text-[#D4A857]/90">
                      {tier.id === 'table' ? 'Par table (8 pers.)' : 'Par convive'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-200 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Perks List */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-8">
                  <p className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold mb-4">
                    Privilèges Inclus :
                  </p>
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 text-xs text-stone-200">
                      <div className="w-4 h-4 rounded-full border border-[#D4A857]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#D4A857] bg-[#D4A857]/10">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Reservation CTA Button */}
                <div>
                  <button
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isVip
                        ? 'bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] shadow-[0_0_20px_rgba(212,168,87,0.5)] hover:shadow-[0_0_30px_rgba(212,168,87,0.8)] hover:scale-[1.02]'
                        : 'border border-[#D4A857] text-[#E8C98A] hover:bg-[#D4A857] hover:text-[#3D030B]'
                    }`}
                  >
                    <span>Réserver ce billet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-center text-xs text-[#D4A857]/90 mt-2">
                    {tier.availableCount} places restantes à ce tarif
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
