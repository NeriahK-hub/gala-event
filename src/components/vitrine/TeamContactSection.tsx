import React from 'react';
import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from '../common/EmpireLogo';

export const TeamContactSection: React.FC = () => {
  const { content, t } = useContent();
  const { galaInfo } = content;
  const whatsappUrl = `https://wa.me/${galaInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    t('contact.whatsappMessage')
  )}`;

  return (
    <section id="contact" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20">
      <div className="relative p-8 sm:p-12 rounded-3xl border border-[#E8C98A]/30 bg-[#160607]/45 text-center">
        <div className="flex justify-center mb-6">
          <EmpireLogo size={112} />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#D4A857]/70" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold">{t('contact.kicker')}</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#D4A857]/70" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          {galaInfo.organizersName}
        </h2>

        <p className="text-stone-100/90 text-base leading-relaxed max-w-2xl mx-auto mb-10">{galaInfo.organizersBio}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold text-sm shadow-lg hover:bg-[#20ba59] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{t('contact.whatsapp')}</span>
          </a>

          <a
            href={`mailto:${galaInfo.contactEmail}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#E8C98A]/60 text-[#F3E5AB] hover:bg-[#E8C98A]/10 text-sm font-semibold transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>{t('contact.email')}</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 border-t border-[#E8C98A]/20 text-sm text-[#F3E5AB]">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#E8C98A]" />
            <span>{galaInfo.instagram}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#E8C98A]" />
            <span>{galaInfo.whatsappNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E8C98A]" />
            <span>{t('contact.cities')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
