import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { TicketTierId } from '../../types';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

interface TicketsSectionProps {
  onSelectTier: (tierId: TicketTierId) => void;
}

export const TicketsSection: React.FC<TicketsSectionProps> = ({ onSelectTier }) => {
  const { content, t } = useContent();
  const count = content.tiers.length;

  return (
    <section id="billets" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('tickets.kicker')} title={t('tickets.title')} subtitle={t('tickets.subtitle')} />

      <div
        className={`grid grid-cols-1 gap-5 items-stretch mx-auto ${
          count === 1 ? 'max-w-md' : count === 2 ? 'lg:grid-cols-2 max-w-4xl' : 'lg:grid-cols-3'
        }`}
      >
        {content.tiers.map((tier, i) => {
          const featured = !!tier.highlighted;
          return (
            <Reveal
              key={tier.id}
              delay={i * 0.1}
              className={`rounded-[2rem] p-7 sm:p-9 flex flex-col ${
                featured
                  ? 'bg-white text-[#2A1014] shadow-[0_30px_70px_rgba(0,0,0,0.35)]'
                  : 'bg-white/10 text-white ring-1 ring-white/15'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <p className={`text-sm font-semibold ${featured ? 'text-[#D8590B]' : 'text-[#FFB43A]'}`}>{tier.subtitle}</p>
                {tier.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F2761B] text-white text-xs font-bold">{tier.badge}</span>
                )}
              </div>
              <h3 className="font-sans font-bold tracking-tight text-2xl sm:text-3xl">{tier.name}</h3>

              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-sans font-bold tracking-tight text-6xl sm:text-7xl leading-none tabular-nums">
                  {tier.price}
                  <span className="text-3xl sm:text-4xl ml-1">$</span>
                </span>
                <span className={`text-sm ${featured ? 'text-[#8B6B70]' : 'text-white/60'}`}>
                  {tier.capacityPerTicket > 1 ? t('tickets.perTable') : t('tickets.perPerson')}
                </span>
              </p>

              <p className={`mt-5 text-base leading-relaxed ${featured ? 'text-[#6B4A4F]' : 'text-white/70'}`}>
                {tier.description}
              </p>

              <ul className={`mt-6 pt-6 border-t space-y-3 flex-1 ${featured ? 'border-[#EFE5D6]' : 'border-white/15'}`}>
                {tier.perks.map((perk, p) => (
                  <li key={p} className="flex items-start gap-3 text-base">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        featured ? 'bg-[#F2761B]/15 text-[#D8590B]' : 'bg-white/15 text-[#FFB43A]'
                      }`}
                    >
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectTier(tier.id)}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-base shadow-[0_12px_28px_rgba(242,118,27,0.3)] hover:brightness-110 transition cursor-pointer"
              >
                {t('tickets.cta')}
                <ArrowRight className="w-5 h-5" />
              </button>

              {tier.availableCount > 0 && (
                <p className={`text-center text-sm mt-3 ${featured ? 'text-[#8B6B70]' : 'text-white/60'}`}>
                  {tier.availableCount} {t('tickets.remaining')}
                </p>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
