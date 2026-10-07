import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Joue l'animation tout de suite (hero, pages) au lieu d'attendre le défilement */
  immediate?: boolean;
}

// Apparition douce : fondu + léger glissement vers le haut, une seule fois
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 24, immediate = false }) => {
  const target = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: target } : { whileInView: target, viewport: { once: true, margin: '-70px' } })}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

// Nombre qui glisse quand sa valeur change (compte à rebours, quantité, total)
export const AnimatedNumber: React.FC<{ value: string | number; className?: string }> = ({ value, className = '' }) => (
  <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={String(value)}
        initial={{ y: '55%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '-55%', opacity: 0 }}
        transition={{ duration: 0.38, ease: EASE }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>
);
