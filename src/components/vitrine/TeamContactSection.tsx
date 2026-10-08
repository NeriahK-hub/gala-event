import React from 'react';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from '../common/EmpireLogo';
import { Reveal } from '../common/Reveal';

export const TeamContactSection: React.FC = () => {
  const { content, t } = useContent();
  const { galaInfo } = content;
  const whatsappUrl = `https://wa.me/${galaInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    t('contact.whatsappMessage')
  )}`;

  return (
    <section id="contact" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
      <Reveal className="rounded-[2rem] bg-white/10 ring-1 ring-white/15 p-8 sm:p-14 text-center">
        <div className="flex justify-center mb-6">
          <EmpireLogo size={96} />
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#FFB43A] mb-3">{t('contact.kicker')}</p>
        <h2 className="font-sans font-bold tracking-tight text-white text-4xl sm:text-5xl leading-[1.05] text-balance">
          {galaInfo.organizersName}
        </h2>
        <p className="mt-4 text-lg text-white/70 leading-relaxed max-w-xl mx-auto text-balance">{galaInfo.organizersBio}</p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-[#052e16] font-bold hover:bg-[#20ba59] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            {t('contact.whatsapp')}
          </a>
          {galaInfo.contactEmail && (
            <a
              href={`mailto:${galaInfo.contactEmail}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full ring-1 ring-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {t('contact.email')}
            </a>
          )}
        </div>

        <ul className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base text-white/75">
          {galaInfo.instagram && (
            <li className="inline-flex items-center gap-2">
              <Instagram className="w-4 h-4 text-[#FFB43A]" />
              {galaInfo.instagram}
            </li>
          )}
          <li className="inline-flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#FFB43A]" />
            {galaInfo.whatsappNumber}
          </li>
          <li className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FFB43A]" />
            {t('contact.cities')}
          </li>
        </ul>
        {t('contact.extra') && <p className="mt-3 text-sm text-white/55">{t('contact.extra')}</p>}
      </Reveal>
    </section>
  );
};
