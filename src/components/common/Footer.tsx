import React from 'react';
import { GALA_INFO } from '../../data/mockData';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenMyTickets: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
  onOpenMyTickets,
}) => {
  return (
    <footer className="relative border-t border-[#D4A857]/25 bg-[#120507] text-[#F9F5EC] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Monogram / Crest */}
        <div className="w-12 h-12 rounded-full border border-[#D4A857] flex items-center justify-center text-[#D4A857] mb-4 bg-[#1F0B10]/50 shadow-[0_0_15px_rgba(212,168,87,0.3)]">
          <span className="font-script text-2xl">R</span>
        </div>

        {/* Gala Name in script */}
        <span className="font-script text-3xl sm:text-4xl text-gold-gradient block mb-2">
          {GALA_INFO.name}
        </span>
        <p className="font-serif italic text-sm text-[#F3E5AB]/90 max-w-md mb-8">
          « {GALA_INFO.slogan} »
        </p>

        {/* Quick Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest text-[#E8C98A]/80 mb-8">
          <button onClick={() => onNavigateSection('hero')} className="hover:text-white transition-colors cursor-pointer">
            Accueil
          </button>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors cursor-pointer">
            Le Gala
          </button>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <button onClick={() => onNavigateSection('programme')} className="hover:text-white transition-colors cursor-pointer">
            Programme
          </button>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <button onClick={() => onNavigateSection('billets')} className="hover:text-white transition-colors cursor-pointer">
            Billetterie
          </button>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <button onClick={() => onNavigateSection('galerie')} className="hover:text-white transition-colors cursor-pointer">
            Galerie
          </button>
          <span aria-hidden="true" className="text-[#D4A857]/90">·</span>
          <button onClick={onOpenMyTickets} className="hover:text-[#FFF2C6] text-[#D4A857] font-semibold transition-colors cursor-pointer">
            Mes Billets
          </button>
        </div>

        {/* Organizers Mention and Copyright */}
        <div className="pt-8 border-t border-[#D4A857]/15 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-[#D4A857]/90 gap-4">
          <p>
            © {new Date().getFullYear()} {GALA_INFO.name}. Organisé par {GALA_INFO.organizersName}.
          </p>

          {/* Discreet Staff link */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-[#E8C98A]/90 hover:text-[#FFF2C6] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A857]" />
              <span>Accès Équipe & Contrôle</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
