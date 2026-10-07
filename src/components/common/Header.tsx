import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { GALA_INFO } from '../../data/mockData';

interface HeaderProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenReservation: () => void;
  activeSection?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateSection,
  onOpenReservation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Le gala', id: 'about' },
    { label: 'Programme', id: 'programme' },
    { label: 'Billets', id: 'billets' },
    { label: 'Galerie', id: 'galerie' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#8A0A1B]/85 backdrop-blur-md border-b border-[#E8C98A]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark (Single text element in royal script) */}
        <button
          onClick={() => handleNavClick('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-script text-2xl sm:text-3xl text-[#E8C98A] group-hover:text-[#FFF2C6] transition-colors whitespace-nowrap block">
            {GALA_INFO.name}
          </span>
        </button>

        {/* Zone 2: 4–6 nav links (Clean text with subtle underline hover) */}
        <nav className="hidden lg:flex items-center gap-5 ml-auto mr-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-xs font-medium uppercase tracking-[0.1em] text-[#E8C98A]/85 hover:text-[#FFF2C6] transition-colors relative py-1 cursor-pointer group whitespace-nowrap"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4A857] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary action (Bouton doré « Réserver ») */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenReservation}
            className="px-5 py-2.5 rounded-full border border-[#D4A857] bg-transparent text-[#E8C98A] font-semibold text-xs uppercase tracking-wider hover:bg-gradient-to-r hover:from-[#D4A857] hover:to-[#B88934] hover:text-[#3D030B] hover:shadow-[0_0_20px_rgba(212,168,87,0.4)] transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Réserver
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenReservation}
            className="px-3.5 py-1.5 rounded-full border border-[#D4A857] bg-[#D4A857]/10 text-[#E8C98A] text-xs font-semibold uppercase tracking-wider"
          >
            Réserver
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu principal"
            className="p-2 rounded-lg text-[#E8C98A] hover:bg-[#D4A857]/10 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#3D030B]/98 border-b border-[#D4A857]/30 px-6 py-8 space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left text-sm font-medium uppercase tracking-widest text-[#E8C98A] hover:text-white py-2 border-b border-[#D4A857]/15"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation();
              }}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Réserver mon billet
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
