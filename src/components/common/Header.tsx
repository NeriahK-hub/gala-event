import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from './EmpireLogo';

interface HeaderProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenReservation: () => void;
  /** Vrai quand on est sur la page d'accueil (active le suivi de section) */
  isHome?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection, onOpenReservation, isHome = true }) => {
  const { content, t } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const navLinks = [
    { label: t('nav.about'), id: 'about' },
    { label: t('nav.program'), id: 'programme' },
    { label: t('nav.tickets'), id: 'billets' },
    ...(content.gallery.length > 0 ? [{ label: t('nav.gallery'), id: 'galerie' }] : []),
    { label: t('nav.contact'), id: 'contact' },
  ];

  // Met en évidence la section visible à l'écran (la dernière dont le haut a dépassé 35 % de la hauteur)
  useEffect(() => {
    if (!isHome) {
      setActiveId('');
      return;
    }
    const ids = ['about', 'programme', 'billets', 'galerie', 'contact'];
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = '';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const handleNavClick = (id: string) => {
    if (mobileMenuOpen) {
      // On referme d'abord le menu : lancer le défilement pendant sa fermeture l'annule sur mobile
      setMobileMenuOpen(false);
      window.setTimeout(() => onNavigateSection(id), 380);
    } else {
      onNavigateSection(id);
    }
  };


  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#6A0511]/90 backdrop-blur-md border-b border-[#E8C98A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <button
          onClick={() => handleNavClick('hero')}
          aria-label="Retour en haut de la page"
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <EmpireLogo size={40} className="hidden sm:block" />
          <span className="font-sans font-bold tracking-tight text-lg sm:text-xl text-white whitespace-nowrap">
            {t('nav.brand')}
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-6 ml-auto mr-6" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`text-sm font-medium transition-colors relative py-1.5 cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-[#E8C98A] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="hidden sm:block">
          <button
            onClick={onOpenReservation}
            className="px-5 py-2.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 transition cursor-pointer whitespace-nowrap"
          >
            {t('nav.cta')}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenReservation}
            className="sm:hidden px-3.5 py-2 rounded-full bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            {t('nav.cta')}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            className="p-2.5 rounded-lg text-[#F3E5AB] hover:bg-white/10 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden overflow-hidden bg-[#5A040F]/98 border-b border-[#E8C98A]/25 px-6 space-y-2"
        >
          <div className="py-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="block w-full text-left text-base font-medium text-[#F3E5AB] hover:text-white py-3 border-b border-[#E8C98A]/15 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm tracking-wide cursor-pointer"
            >
              {t('nav.ctaMobile')}
            </button>
          </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  );
};
