import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/mockData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [FAQ_ITEMS[0].id]: true, // First one open by default
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#D4A857] font-medium">
            Conciergerie & Informations
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-script text-4xl sm:text-6xl text-gold-gradient mb-4">
          Questions Fréquentes
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/80 max-w-xl mx-auto">
          Tout ce que vous devez savoir pour préparer votre venue dans les meilleures conditions.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {FAQ_ITEMS.map((item) => {
          const isOpen = !!openIds[item.id];

          return (
            <div
              key={item.id}
              className="rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#7A0815]/30 to-[#4D040E]/60 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#D4A857]/5 transition-colors"
              >
                <span className="font-serif text-base sm:text-lg text-[#F9F5EC] font-medium">
                  {item.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-full border border-[#D4A857]/40 flex items-center justify-center shrink-0 text-[#E8C98A] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#D4A857]/20' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-300 font-light leading-relaxed border-t border-[#D4A857]/10 animate-in fade-in duration-200">
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
