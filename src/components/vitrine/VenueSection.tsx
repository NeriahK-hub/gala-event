import React from 'react';
import { Clock, ExternalLink, MapPin, Phone, Shirt, Ticket } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const VenueSection: React.FC = () => {
  const { content, t } = useContent();
  const info = content.galaInfo;

  const items = [
    { icon: <Clock className="w-5 h-5" />, title: t('venue.info1.title'), text: t('venue.info1.text') },
    { icon: <Ticket className="w-5 h-5" />, title: t('venue.info2.title'), text: t('venue.info2.text') },
    { icon: <Shirt className="w-5 h-5" />, title: t('venue.info3.title'), text: t('venue.info3.text') },
    { icon: <Phone className="w-5 h-5" />, title: t('venue.info4.title'), text: t('venue.info4.text') },
  ];

  return (
    <section id="lieu" className="relative scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeader
        kicker={t('venue.kicker')}
        title={t('venue.title')}
        subtitle={[info.venueName, info.venueRoom, info.venueAddress, info.city].filter(Boolean).join(' • ')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5 items-stretch">
        <Reveal className="rounded-[2rem] bg-white/10 ring-1 ring-white/15 p-7 sm:p-10">
          <h3 className="font-sans font-bold tracking-tight text-white text-2xl sm:text-3xl">{t('venue.cardTitle')}</h3>
          <p className="mt-3 text-lg text-white/70 leading-relaxed">{t('venue.cardText')}</p>

          <ul className="mt-8 pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="w-11 h-11 rounded-full bg-white/10 text-[#FFB43A] flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-base text-white/70 mt-0.5">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal
          delay={0.1}
          className="rounded-[2rem] bg-gradient-to-b from-[#C21226]/60 to-[#4A030C]/60 ring-1 ring-white/15 p-7 sm:p-10 flex flex-col items-center justify-center text-center"
        >
          <span className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] flex items-center justify-center shadow-[0_12px_28px_rgba(242,118,27,0.35)]">
            <MapPin className="w-8 h-8" />
          </span>
          <p className="mt-5 font-sans font-bold tracking-tight text-white text-2xl">{t('venue.mapName')}</p>
          <p className="mt-1 text-base text-white/75">{t('venue.mapAddress')}</p>
          <p className="mt-1 text-sm text-white/55 text-balance">{t('venue.district')}</p>
          <a
            href={t('venue.gpsUrl')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full ring-1 ring-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
          >
            {t('venue.gpsLabel')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
};
