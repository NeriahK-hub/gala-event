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
  const { content, t, isSectionVisible: show } = useContent();
  const { galaInfo } = content;

  const links = [
    { label: t('footer.linkHome'), onClick: () => onNavigateSection('hero') },
    ...(show('about') ? [{ label: t('footer.linkAbout'), onClick: () => onNavigateSection('about') }] : []),
    ...(show('programme') ? [{ label: t('footer.linkProgram'), onClick: () => onNavigateSection('programme') }] : []),
    ...(show('billets') ? [{ label: t('footer.linkTickets'), onClick: () => onNavigateSection('billets') }] : []),
    ...(content.gallery.length > 0 && show('galerie') ? [{ label: t('footer.linkGallery'), onClick: () => onNavigateSection('galerie') }] : []),
    { label: t('footer.linkMyTickets'), onClick: onOpenMyTickets },
  ];

  return (
    <footer className="relative bg-black/30 text-white pt-16 sm:pt-20 pb-32 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 pb-10 border-b border-white/15">
          <EmpireLogo size={72} />
          <div>
            <p className="font-sans font-bold tracking-tight text-2xl sm:text-3xl">{galaInfo.name}</p>
            <p className="mt-1 text-base text-white/65 max-w-md">{galaInfo.slogan}</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 py-8" aria-label="Liens du pied de page">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={l.onClick}
              className="text-base text-white/75 hover:text-white transition-colors cursor-pointer"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-white/55">
          <p>
            © {new Date().getFullYear()} {galaInfo.name}. {t('contact.presentedBy')} {galaInfo.organizersName}.{' '}
            {t('footer.copyright')}
          </p>
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('footer.staff')}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
