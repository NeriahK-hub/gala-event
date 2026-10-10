import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export const Modal: React.FC<{ title: string; kicker: string; onClose: () => void; children: React.ReactNode }> = ({ title, kicker, onClose, children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#1F1916] p-6 sm:p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#E6C78A] font-semibold">{kicker}</p>
            <h2 className="font-semibold tracking-tight text-xl text-stone-100">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};
