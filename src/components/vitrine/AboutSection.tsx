import React from 'react';
import { GALA_INFO } from '../../data/mockData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Decorative center filigree divider */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
        <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
          L'Esprit du Gala
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
      </div>

      <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight text-center mb-6">
        L'Art de Vivre Impérial à Kinshasa
      </h2>

      {/* Main Presentation Prose */}
      <div className="max-w-3xl mx-auto text-center space-y-6 text-[#F9F5EC]/90 text-sm sm:text-base leading-relaxed">
        <p className="font-serif text-lg sm:text-xl text-[#F3E5AB] leading-relaxed">
          Né de la vision du Cercle de l'Excellence, Le Grand Gala Royal célèbre la rencontre sublime entre la grandeur des traditions protocolaires et le génie contemporain du Congo.
        </p>

        <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
          Cette cinquième édition réunit les bâtisseurs de notre avenir, les figures de la haute diplomatie, les maîtres de l'art et les leaders d'opinion pour une veillée empreinte de courtoisie, de gastronomie d'auteur et d'émotions symphoniques.
        </p>

        <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
          Pensé pour un cercle restreint d'amateurs de distinction, cet événement exclusif offre un cadre somptueux où les conversations d'exception se nouent au son des violons et sous les feux des lustres de cristal du Pullman Grand Hôtel.
        </p>
      </div>

      {/* Key Stats (3-4 Chiffres Clés) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-[#D4A857]/20 text-center">
        {GALA_INFO.keyStats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <span className="font-serif tabular-nums text-3xl sm:text-5xl text-gold-bright tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#E8C98A] mt-2">
              {stat.label}
            </span>
            <span className="text-xs sm:text-xs text-[#D4A857]/90 mt-1 max-w-[180px]">
              {stat.desc}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
