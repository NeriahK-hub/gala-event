import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from './EmpireLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenMyTickets: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAdmin, onOpenMyTickets }) => {
  const { content, t } = useContent();
  const { galaInfo } = content;

  const links = [
    { label: t('footer.linkHome'), onClick: () => onNavigateSection('hero') },
    { label: t('footer.linkAbout'), onClick: () => onNavigateSection('about') },
    { label: t('footer.linkProgram'), onClick: () => onNavigateSection('programme') },
    { label: t('footer.linkTickets'), onClick: () => onNavigateSection('billets') },
    ...(content.gallery.length > 0 ? [{ label: t('footer.linkGallery'), onClick: () => onNavigateSection('galerie') }] : []),
    { label: t('footer.linkMyTickets'), onClick: onOpenMyTickets, accent: true },
  ];

  return (
    <footer className="relative border-t border-[#E8C98A]/25 bg-[#4A030C] text-[#F9F5EC] pt-16 pb-24 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <EmpireLogo size={88} className="mb-5" />

        <span className="font-script text-4xl text-gold-gradient block mb-2">{galaInfo.name}</span>
        <p className="font-serif italic text-base text-[#F3E5AB] max-w-md mb-8">« {galaInfo.slogan} »</p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-10" aria-label="Liens du pied de page">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.onClick}
              className={`text-xs font-semibold uppercase tracking-[0.1em] transition-colors cursor-pointer ${
                l.accent ? 'text-[#F3E5AB] underline underline-offset-4' : 'text-[#E8C98A] hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-[#E8C98A]/20 w-full flex flex-col sm:flex-row items-center justify-between text-sm text-[#E8C98A] gap-4">
          <p>
            © {new Date().getFullYear()} {galaInfo.name}. {t('contact.presentedBy')} {galaInfo.organizersName}.{' '}
            {t('footer.copyright')}
          </p>
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-sm text-[#E8C98A] hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer.staff')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
