import React from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { MapPin, Car, Clock, ShieldCheck, Shirt, ExternalLink } from 'lucide-react';

export const VenueSection: React.FC = () => {
  const { content, t } = useContent();
  const GALA_INFO = content.galaInfo;
  return (
    <section id="lieu" className="relative scroll-mt-20 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeader
        kicker={t('venue.kicker')}
        title={t('venue.title')}
        subtitle={`${GALA_INFO.venueRoom} • ${GALA_INFO.venueAddress}, ${GALA_INFO.city}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Venue Presentation & Practical details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="p-7 rounded-2xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E0A0F]/50 to-[#160607]/80 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
            <h3 className="font-serif text-2xl text-[#F9F5EC] font-semibold mb-3">
              {t('venue.cardTitle')}
            </h3>
            <p className="text-stone-100/90 text-sm sm:text-base leading-relaxed mb-6">
              {t('venue.cardText')}
            </p>

            {/* Practical Info List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D4A857]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    {t('venue.info1.title')}
                  </h4>
                  <p className="text-sm text-stone-100/90 mt-0.5">
                    {t('venue.info1.text')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    {t('venue.info2.title')}
                  </h4>
                  <p className="text-sm text-stone-100/90 mt-0.5">
                    {t('venue.info2.text')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    {t('venue.info3.title')}
                  </h4>
                  <p className="text-sm text-stone-100/90 mt-0.5">
                    {t('venue.info3.text')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    {t('venue.info4.title')}
                  </h4>
                  <p className="text-sm text-stone-100/90 mt-0.5">
                    {t('venue.info4.text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stylized Luxury Map / Location View */}
        <div className="lg:col-span-5 rounded-2xl border border-[#D4A857]/30 bg-[#3D030B] overflow-hidden flex flex-col justify-between shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
          {/* Map Representation with Gold Coordinates */}
          <div className="relative h-64 sm:h-72 w-full bg-[#2A0207] flex items-center justify-center p-6 text-center overflow-hidden">
            {/* Map styling grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(#D4A857 1px, transparent 1px), radial-gradient(#D4A857 1px, #2A0207 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
              }}
            />

            {/* Stylized River Congo contour */}
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <path
                d="M -20,60 Q 120,40 220,90 T 420,70"
                stroke="#D4A857"
                strokeWidth="18"
                fill="none"
              />
              <text x="210" y="65" fill="#E8C98A" fontSize="10" letterSpacing="3" textAnchor="middle">
                FLEUVE CONGO
              </text>
            </svg>

            {/* Pullman Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#D4A857] flex items-center justify-center text-[#3D030B] shadow-[0_0_25px_rgba(212,168,87,0.8)] animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#2E0207]/90 border border-[#D4A857]/50 shadow-md">
                <span className="font-serif text-xs font-semibold text-[#F9F5EC] block">
                  {t('venue.mapName')}
                </span>
                <span className="text-xs text-[#D4A857]">
                  {t('venue.mapAddress')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-[#D4A857]/20 flex items-center justify-between bg-[#33030A]">
            <div className="text-xs text-stone-300">
              <span>{t('venue.district')}</span>
            </div>
            <a
              href={t('venue.gpsUrl')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#E8C98A] hover:text-white uppercase tracking-wider font-semibold"
            >
              <span>{t('venue.gpsLabel')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
