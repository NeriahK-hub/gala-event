import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { TicketIcon } from './TicketIcon';
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

      {/* Bouton flottant (mobile) : respecte la zone sûre de l'iPhone, aucun bandeau derrière */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sm:hidden fixed inset-x-4 z-40 pointer-events-none"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <button
          onClick={onReserve}
          className="pointer-events-auto mx-auto flex w-full max-w-sm items-center justify-center gap-2.5 py-4 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-base shadow-[0_14px_34px_rgba(0,0,0,0.45)] ring-1 ring-white/25 cursor-pointer"
        >
          <TicketIcon className="w-11 h-[1.15rem]" />
          <span>{t('nav.ctaMobile')}</span>
        </button>
      </motion.div>
    </>
  );
};
