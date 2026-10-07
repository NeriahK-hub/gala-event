import React, { useState } from 'react';
import { GUEST_ARTISTS } from '../../data/mockData';
import { Award, Music, Sparkles } from 'lucide-react';

export const GuestsSection: React.FC = () => {
  return (
    <section id="invites" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
            Prestige & Talents
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          Invités d'Honneur & Artistes
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/80 max-w-xl mx-auto">
          Les personnalités et virtuoses qui sublimeront la scène du Grand Gala Royal.
        </p>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GUEST_ARTISTS.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </section>
  );
};

interface ArtistCardProps {
  artist: typeof GUEST_ARTISTS[0];
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#8E0A1C]/50 to-[#5A040F]/80 overflow-hidden flex flex-col hover:border-[#D4A857] transition-all duration-500 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
      {/* Photo Frame */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#3D030B]">
        {!imgError ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#7A0815] to-[#3D030B]">
            <Music className="w-10 h-10 text-[#D4A857]/90 mb-2" />
            <span className="font-serif text-lg text-[#E8C98A]">{artist.name}</span>
          </div>
        )}

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A040F] via-transparent to-transparent opacity-90" />

        {/* Delicate Role Kicker pinned over bottom of image */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2E0207]/85 border border-[#D4A857]/40 text-xs uppercase tracking-wider text-[#F3E5AB]">
            {artist.role}
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg text-[#F9F5EC] font-semibold group-hover:text-[#F3E5AB] transition-colors">
            {artist.name}
          </h3>
          <p className="text-xs text-[#D4A857]/80 font-medium mb-3">
            {artist.title}
          </p>
          <p className="text-xs text-stone-300/80 leading-relaxed line-clamp-3">
            {artist.bio}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#D4A857]/15 flex items-center gap-1.5 text-xs text-[#D4A857]/90">
          <Sparkles className="w-3 h-3" />
          <span>Prestation exclusive</span>
        </div>
      </div>
    </div>
  );
};
