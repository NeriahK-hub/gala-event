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
      {/* Fondu doux derrière le bouton : le contenu disparaît proprement au lieu d'être coupé */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sm:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none bg-gradient-to-t from-[#2A0609] via-[#2A0609]/70 to-transparent"
        style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 7.5rem)' }}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sm:hidden fixed inset-x-4 z-40 pointer-events-none"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        <button
          onClick={onReserve}
          className="pointer-events-auto mx-auto flex w-full max-w-sm items-center justify-center gap-2.5 py-4 rounded-full bg-cta text-[#3D0A04] font-bold text-base shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_28px_rgba(0,0,0,0.35)] cursor-pointer active:scale-[0.98] transition-transform"
        >
          <TicketIcon className="w-11 h-[1.15rem]" />
          <span>{t('nav.ctaMobile')}</span>
        </button>
      </motion.div>
    </>
  );
};
