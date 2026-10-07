import React, { useState } from 'react';
import { Star, UserRound } from 'lucide-react';
import { GuestArtist } from '../../types';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';

export const GuestsSection: React.FC = () => {
  const { content, t } = useContent();
  if (content.guests.length === 0) return null;

  return (
    <section id="invites" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('guests.kicker')} title={t('guests.title')} subtitle={t('guests.subtitle')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.guests.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} badge={t('guests.badge')} />
        ))}
      </div>
    </section>
  );
};

const ArtistCard: React.FC<{ artist: GuestArtist; badge: string }> = ({ artist, badge }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group rounded-2xl border border-[#E8C98A]/25 bg-[#3D0309]/40 overflow-hidden flex flex-col hover:border-[#E8C98A]/70 transition-colors duration-300">
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
            <span className="font-serif text-lg text-[#E8C98A]">{artist.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3D030B]/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-block px-2.5 py-1 rounded-full bg-[#3D030B]/85 border border-[#E8C98A]/40 text-xs uppercase tracking-wider text-[#F3E5AB]">
            {artist.role}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl text-[#F9F5EC] font-semibold group-hover:text-[#F3E5AB] transition-colors">
            {artist.name}
          </h3>
          <p className="text-sm text-[#E8C98A] font-medium mb-3">{artist.title}</p>
          <p className="text-sm text-stone-100/85 leading-relaxed line-clamp-4">{artist.bio}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#E8C98A]/15 flex items-center gap-1.5 text-xs text-[#E8C98A]">
          <Star className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
      </div>
    </div>
  );
};
