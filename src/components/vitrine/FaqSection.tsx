import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';

export const FaqSection: React.FC = () => {
  const { content, t } = useContent();
  const [openId, setOpenId] = useState<string | null>(content.faq[0]?.id ?? null);

  return (
    <section id="faq" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-20">
      <SectionHeader kicker={t('faq.kicker')} title={t('faq.title')} subtitle={t('faq.subtitle')} />

      <div className="space-y-3">
        {content.faq.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E8C98A]/25 bg-[#3D0309]/35 overflow-hidden"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#E8C98A]/5 transition-colors"
              >
                <span className="font-serif text-lg text-[#F9F5EC] font-medium">{item.question}</span>
                <span
                  className={`w-8 h-8 rounded-full border border-[#E8C98A]/50 flex items-center justify-center shrink-0 text-[#E8C98A] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#E8C98A]/15' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-3 text-sm sm:text-base text-stone-100/90 leading-relaxed border-t border-[#E8C98A]/15">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
