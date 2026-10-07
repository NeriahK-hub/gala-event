import React from 'react';
import { GALA_INFO } from '../../data/mockData';
import { MapPin, Car, Clock, ShieldCheck, Shirt, ExternalLink } from 'lucide-react';

export const VenueSection: React.FC = () => {
  return (
    <section id="lieu" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4A857]/60" />
          <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-medium">
            Le Sanctuaire de la Soirée
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4A857]/60" />
        </div>

        <h2 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight mb-4">
          Le Pullman Grand Hôtel Kinshasa
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F3E5AB]/80 max-w-xl mx-auto">
          {GALA_INFO.venueRoom} • {GALA_INFO.venueAddress}, {GALA_INFO.city}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Venue Presentation & Practical details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="p-7 rounded-2xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E1218]/50 to-[#170709]/80 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
            <h3 className="font-serif text-2xl text-[#F9F5EC] font-semibold mb-3">
              Un Écrin Impérial Face au Fleuve Congo
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
              Haut lieu des grandes réceptions de la République et symbole d'hospitalité 5 étoiles, le Salon Congo du Pullman offre une acoustique remarquable, une hauteur sous plafond majestueuse et des accès directs aux jardins royaux.
            </p>

            {/* Practical Info List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D4A857]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    Heure d'arrivée
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Portes dès 18h45. Début de la cérémonie à 19h30 précises.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    Parking & Voiturier
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Parking clos sécurisé 300 places. Service voiturier gratuit VIP.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    Accès & Sécurité
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Billet numérique (QR Code) ou invitation de luxe nominative requise.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4A857]/10 border border-[#D4A857]/30 text-[#D4A857]">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#E8C98A] uppercase tracking-wider">
                    Vestiaire d'Honneur
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Vestiaire d'apparat gratuit et gardé à l'entrée du Salon.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stylized Luxury Map / Location View */}
        <div className="lg:col-span-5 rounded-2xl border border-[#D4A857]/30 bg-[#150608] overflow-hidden flex flex-col justify-between shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
          {/* Map Representation with Gold Coordinates */}
          <div className="relative h-64 sm:h-72 w-full bg-[#2A0207] flex items-center justify-center p-6 text-center overflow-hidden">
            {/* Map styling grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'radial-gradient(#D4A857 1px, transparent 1px), radial-gradient(#D4A857 1px, #2A0207 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
              }}
            />

            {/* Stylized River Congo contour */}
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
              <path
                d="M -20,60 Q 120,40 220,90 T 420,70"
                stroke="#D4A857"
                strokeWidth="18"
                fill="none"
              />
              <text x="210" y="65" fill="#E8C98A" fontSize="10" letterSpacing="3" textAnchor="middle">
                FLEUVE CONGO
              </text>
            </svg>

            {/* Pullman Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#D4A857] flex items-center justify-center text-[#150608] shadow-[0_0_25px_rgba(212,168,87,0.8)] animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-[#0F0405]/90 border border-[#D4A857]/50 shadow-md">
                <span className="font-serif text-xs font-semibold text-[#F9F5EC] block">
                  Pullman Kinshasa (Gombe)
                </span>
                <span className="text-xs text-[#D4A857]">
                  4 Avenue Batetela
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-[#D4A857]/20 flex items-center justify-between bg-[#33030A]">
            <div className="text-xs text-stone-300">
              <span>Quartier Diplomatique • Gombe</span>
            </div>
            <a
              href="https://maps.google.com/?q=Pullman+Grand+Hotel+Kinshasa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#E8C98A] hover:text-white uppercase tracking-wider font-semibold"
            >
              <span>Itinéraire GPS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
