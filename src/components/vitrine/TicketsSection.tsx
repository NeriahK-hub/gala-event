import React from 'react';
import { ArrowRight, Check, Crown } from 'lucide-react';
import { TicketTierId } from '../../types';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';

interface TicketsSectionProps {
  onSelectTier: (tierId: TicketTierId) => void;
}

export const TicketsSection: React.FC<TicketsSectionProps> = ({ onSelectTier }) => {
  const { content, t } = useContent();

  return (
    <section id="billets" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('tickets.kicker')} title={t('tickets.title')} subtitle={t('tickets.subtitle')} />

      <div className={`grid grid-cols-1 gap-8 items-stretch ${content.tiers.length === 1 ? 'max-w-md mx-auto' : content.tiers.length === 2 ? 'lg:grid-cols-2 max-w-4xl mx-auto' : 'lg:grid-cols-3'}`}>
        {content.tiers.map((tier) => {
          const isVip = !!tier.highlighted;

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isVip
                  ? 'border-2 border-[#E8C98A] bg-[#3D0309]/60 shadow-[0_0_35px_rgba(232,201,138,0.2)] lg:-translate-y-3'
                  : 'border border-[#E8C98A]/30 bg-[#3D0309]/35 hover:border-[#E8C98A]/60'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-1 rounded-full bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] text-xs font-bold tracking-widest uppercase shadow-md">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{tier.badge}</span>
                  </span>
                </div>
              )}

              <div className="p-7 sm:p-8 border-b border-[#E8C98A]/20">
                <p className="text-xs uppercase tracking-[0.12em] text-[#E8C98A] font-semibold mb-2">{tier.subtitle}</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F9F5EC] mb-4">{tier.name}</h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-serif text-5xl sm:text-6xl text-gold-gradient tracking-tight tabular-nums">
                    {tier.price}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold uppercase text-[#E8C98A]">USD</span>
                    <span className="text-xs text-[#E8C98A]/90">
                      {tier.capacityPerTicket > 1 ? t('tickets.perTable') : t('tickets.perPerson')}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-stone-100/90 leading-relaxed">{tier.description}</p>
              </div>

              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-8">
                  <p className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold mb-4">
                    {t('tickets.perksLabel')}
                  </p>
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3 text-sm text-stone-100">
                      <div className="w-5 h-5 rounded-full border border-[#E8C98A]/60 flex items-center justify-center shrink-0 mt-0.5 text-[#E8C98A] bg-[#E8C98A]/10">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{perk}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <button
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3.5 px-6 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isVip
                        ? 'bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] shadow-[0_8px_24px_rgba(232,201,138,0.25)] hover:brightness-110'
                        : 'border border-[#E8C98A] text-[#F3E5AB] hover:bg-[#E8C98A] hover:text-[#3D030B]'
                    }`}
                  >
                    <span>{t('tickets.cta')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {tier.availableCount > 0 && (
                    <p className="text-center text-xs text-[#E8C98A] mt-2">
                      {tier.availableCount} {t('tickets.remaining')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
