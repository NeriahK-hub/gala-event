import React from 'react';
import { Shirt } from 'lucide-react';
import { useContent } from '../../content/ContentContext';

export const DressCodeSection: React.FC = () => {
  const { content, t } = useContent();
  const { dressCode } = content.galaInfo;

  return (
    <section id="dresscode" className="relative scroll-mt-20 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Container with gold hairline frame */}
      <div className="relative p-8 sm:p-12 rounded-2xl border border-[#D4A857]/30 bg-gradient-to-b from-[#2E0A0F]/40 via-[#1C0709]/60 to-[#160607]/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold mb-3">
            <Shirt className="w-4 h-4" />
            <span>{t('dresscode.kicker')}</span>
          </div>
          <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-3">
            {dressCode.title}
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/90 max-w-xl mx-auto">
            {dressCode.subtitle}
          </p>
          <p className="text-sm sm:text-base text-stone-100/90 max-w-2xl mx-auto mt-3 leading-relaxed">
            {dressCode.description}
          </p>
        </div>

        {/* Color Palette Swatches (Small round circles as in the reference image!) */}
        <div className="my-10 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-[#E8C98A]/80 font-semibold mb-5">
            {t('dresscode.paletteLabel')}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            {dressCode.colors.map((color, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4A857] shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-115 transition-transform duration-300"
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}: ${color.desc}`}
                />
                <span className="text-xs font-medium text-[#E8C98A] mt-2 group-hover:text-white transition-colors">
                  {color.name}
                </span>
                <span className="text-xs text-[#D4A857]/90">
                  {color.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines for Women & Men */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[#D4A857]/20">
          {/* Pour les Dames */}
          <div className="p-6 rounded-xl border border-[#D4A857]/20 bg-[#3D030B]/60">
            <h3 className="font-serif text-lg font-semibold text-[#F3E5AB] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A857]" />
              {t('dresscode.womenTitle')}
            </h3>
            <p className="text-sm text-stone-100/90 leading-relaxed">
              {dressCode.womenGuidelines}
            </p>
          </div>

          {/* Pour les Messieurs */}
          <div className="p-6 rounded-xl border border-[#D4A857]/20 bg-[#3D030B]/60">
            <h3 className="font-serif text-lg font-semibold text-[#F3E5AB] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A857]" />
              {t('dresscode.menTitle')}
            </h3>
            <p className="text-sm text-stone-100/90 leading-relaxed">
              {dressCode.menGuidelines}
            </p>
          </div>
        </div>

        {/* Note on protocol */}
        <div className="mt-8 text-center text-sm text-[#E8C98A] italic">
          {t('dresscode.note')}
        </div>
      </div>
    </section>
  );
};
