import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { PartnerSponsor } from '../../types';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';

const PartnerCard: React.FC<{ sponsor: PartnerSponsor; index: number }> = ({ sponsor, index }) => {
  const [broken, setBroken] = useState(false);
  const hasLogo = !!sponsor.logoUrl && !broken;

  return (
    <Reveal
      delay={index * 0.07}
      className="w-[calc(50%-0.375rem)] sm:w-60 rounded-3xl bg-white/10 ring-1 ring-white/15 p-3 flex flex-col"
    >
      <div className="h-28 sm:h-32 rounded-2xl bg-white flex items-center justify-center p-4 overflow-hidden">
        {hasLogo ? (
          <img
            src={sponsor.logoUrl}
            alt={`Logo ${sponsor.name}`}
            loading="lazy"
            onError={() => setBroken(true)}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="flex flex-col items-center gap-1 text-[#6B4A4F]">
            <Building2 className="w-8 h-8" />
          </span>
        )}
      </div>
      <div className="px-2 pt-4 pb-2 text-center">
        <p className="font-sans font-bold tracking-tight text-white text-base sm:text-lg leading-snug">{sponsor.logoText}</p>
        <p className="text-sm text-white/60 mt-0.5">{sponsor.category}</p>
      </div>
    </Reveal>
  );
};

export const SponsorsSection: React.FC = () => {
  const { content, t } = useContent();

  if (content.sponsors.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <h2 className="font-sans font-bold tracking-tight text-white text-3xl sm:text-4xl mb-10 sm:mb-12">
            {t('sponsors.title')}
          </h2>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {content.sponsors.map((sponsor, i) => (
            <PartnerCard key={sponsor.id} sponsor={sponsor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
