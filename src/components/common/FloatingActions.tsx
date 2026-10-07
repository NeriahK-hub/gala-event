import React, { useEffect, useState } from 'react';
import { ArrowUp, Ticket } from 'lucide-react';
import { useContent } from '../../content/ContentContext';

interface FloatingActionsProps {
  onReserve: () => void;
}

// Barre « Réserver » collée en bas sur mobile + bouton retour en haut, après avoir fait défiler la page
export const FloatingActions: React.FC<FloatingActionsProps> = ({ onReserve }) => {
  const { t } = useContent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Remonter en haut de la page"
        className="hidden sm:flex fixed bottom-24 right-6 z-40 w-11 h-11 items-center justify-center rounded-full bg-[#4A030C]/90 border border-[#E8C98A]/60 text-[#F3E5AB] hover:bg-[#E8C98A] hover:text-[#3D030B] transition-colors cursor-pointer shadow-lg"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-[#4A030C] via-[#4A030C]/95 to-transparent">
        <button
          onClick={onReserve}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm shadow-lg cursor-pointer"
        >
          <Ticket className="w-5 h-5" />
          <span>{t('nav.ctaMobile')}</span>
        </button>
      </div>
    </>
  );
};
