import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { Reveal } from '../common/Reveal';

export const FaqSection: React.FC = () => {
  const { content, t } = useContent();
  const [openId, setOpenId] = useState<string | null>(content.faq[0]?.id ?? null);

  return (
    <section id="faq" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('faq.kicker')} title={t('faq.title')} subtitle={t('faq.subtitle')} />

      <div className="space-y-3">
        {content.faq.map((item, i) => {
          const isOpen = openId === item.id;
          return (
            <Reveal key={item.id} delay={i * 0.05} className="rounded-3xl bg-white/10 ring-1 ring-white/15 overflow-hidden">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-6 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="font-sans font-semibold tracking-tight text-white text-lg sm:text-xl">{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 sm:px-8 pb-6 sm:pb-7 text-base sm:text-lg text-white/70 leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
