import React, { useState } from 'react';
import { PartnerSponsor } from '../../types';
import { useContent } from '../../content/ContentContext';
import { Reveal } from '../common/Reveal';

const MIN_TILES = 8; // nombre minimal de tuiles par rangée pour remplir l'écran

const LogoTile: React.FC<{ sponsor: PartnerSponsor }> = ({ sponsor }) => {
  const [broken, setBroken] = useState(false);
  const hasLogo = !!sponsor.logoUrl && !broken;

  return (
    <li
      title={`${sponsor.name} — ${sponsor.category}`}
      className="group shrink-0 h-24 sm:h-28 min-w-[9.5rem] sm:min-w-[11rem] px-7 sm:px-9 rounded-3xl bg-white/95 ring-1 ring-white/30 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-[1.04]"
    >
      {hasLogo ? (
        <img
          src={sponsor.logoUrl}
          alt={sponsor.name}
          loading="lazy"
          draggable={false}
          onError={() => setBroken(true)}
          className="h-12 sm:h-14 w-auto max-w-[11rem] object-contain grayscale opacity-70 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
      ) : (
        <span className="font-sans font-bold tracking-tight text-[#4A2A2E] text-base sm:text-lg text-center leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
          {sponsor.logoText || sponsor.name}
        </span>
      )}
    </li>
  );
};

// Une rangée qui défile : deux copies identiques côte à côte pour une boucle sans coupure
const MarqueeRow: React.FC<{ items: PartnerSponsor[]; reverse?: boolean; seconds: number }> = ({ items, reverse, seconds }) => (
  <div
    className="marquee overflow-hidden"
    style={{
      maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
    }}
  >
    <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`} style={{ ['--dur' as string]: `${seconds}s` }}>
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4" aria-hidden={copy === 1 ? true : undefined}>
          {items.map((s, i) => (
            <LogoTile key={`${s.id}-${i}`} sponsor={s} />
          ))}
        </ul>
      ))}
    </div>
  </div>
);

export const SponsorsSection: React.FC = () => {
  const { content, t } = useContent();
  const sponsors = content.sponsors;

  if (sponsors.length === 0) return null;

  // On répète les partenaires pour remplir chaque rangée ; la 2e rangée démarre à un autre endroit
  const repeat = Math.max(1, Math.ceil(MIN_TILES / sponsors.length));
  const fill = (list: PartnerSponsor[]) => Array.from({ length: repeat }, () => list).flat();
  const shift = Math.floor(sponsors.length / 2) || 0;
  const rowA = fill(sponsors);
  const rowB = fill([...sponsors.slice(shift), ...sponsors.slice(0, shift)].reverse());
  const seconds = Math.max(30, rowA.length * 5);

  return (
    <section className="relative py-16 sm:py-24" aria-label={t('sponsors.title')}>
      <Reveal className="text-center px-4 mb-10 sm:mb-12">
        <span className="inline-block rounded-full bg-white/10 ring-1 ring-white/20 px-5 py-2 text-sm sm:text-base font-medium text-white/85">
          {t('sponsors.title')}
        </span>
      </Reveal>

      <Reveal delay={0.1} className="space-y-3 sm:space-y-4">
        <MarqueeRow items={rowA} seconds={seconds} />
        <MarqueeRow items={rowB} seconds={seconds * 1.15} reverse />
      </Reveal>
    </section>
  );
};
