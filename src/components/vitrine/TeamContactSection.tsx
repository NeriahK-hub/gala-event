import React from 'react';
import { GALA_INFO } from '../../data/mockData';
import { MessageCircle, Mail, Instagram, Phone, Shield, Sparkles } from 'lucide-react';

export const TeamContactSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/${GALA_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Bonjour Conciergerie du Grand Gala Royal, je souhaite des renseignements concernant la soirée du ${GALA_INFO.dateText}.`
  )}`;

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative p-8 sm:p-12 rounded-2xl border border-[#D4A857]/30 bg-gradient-to-b from-[#8E0A1C]/50 via-[#7A0815]/70 to-[#3D030B] shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-center">
        
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
            Comité d'Organisation
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          {GALA_INFO.organizersName}
        </h2>

        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-10">
          {GALA_INFO.organizersBio}
        </p>

        {/* WhatsApp & Concierge Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20ba59] transition-all transform hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contacter sur WhatsApp (Conciergerie)</span>
          </a>

          <a
            href={`mailto:${GALA_INFO.contactEmail}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#D4A857]/50 text-[#E8C98A] hover:bg-[#D4A857]/10 text-xs uppercase tracking-wider transition-colors"
          >
            <Mail className="w-4 h-4 text-[#D4A857]" />
            <span>Envoyer un Courriel</span>
          </a>
        </div>

        {/* Social and Direct Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#D4A857]/20 text-xs text-[#E8C98A]/80">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#D4A857]" />
            <span>{GALA_INFO.instagram}</span>
          </div>

          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4A857]" />
            <span>{GALA_INFO.whatsappNumber}</span>
          </div>

          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4A857]" />
            <span>Kinshasa • Paris • Bruxelles</span>
          </div>
        </div>
      </div>
    </section>
  );
};
