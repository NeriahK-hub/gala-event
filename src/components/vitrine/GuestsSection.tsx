import React, { useState } from 'react';
import { Star, UserRound } from 'lucide-react';
import { GuestArtist } from '../../types';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const GuestsSection: React.FC = () => {
  const { content, t } = useContent();
  if (content.guests.length === 0) return null;

  return (
    <section id="invites" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('guests.kicker')} title={t('guests.title')} subtitle={t('guests.subtitle')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.guests.map((artist, i) => (
          <Reveal key={artist.id} delay={i * 0.08}>
            <ArtistCard artist={artist} badge={t('guests.badge')} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const ArtistCard: React.FC<{ artist: GuestArtist; badge: string }> = ({ artist, badge }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group rounded-3xl bg-white/10 ring-1 ring-white/15 overflow-hidden flex flex-col hover:bg-white/15 transition-colors duration-300 h-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#3D030B]">
        {artist.imageUrl && !imgError ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#5A040F] to-[#3D030B]">
            <UserRound className="w-10 h-10 text-[#E8C98A] mb-2" />
            <span className="font-sans font-semibold text-lg text-white">{artist.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D030B]/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-block px-3 py-1 rounded-full bg-black/55 backdrop-blur text-xs font-semibold text-white">
            {artist.role}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-sans font-bold tracking-tight text-xl text-white">
            {artist.name}
          </h3>
          <p className="text-sm text-[#FFB43A] font-semibold mb-3">{artist.title}</p>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-4">{artist.bio}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-1.5 text-sm text-white/60">
          <Star className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
      </div>
    </div>
  );
};
