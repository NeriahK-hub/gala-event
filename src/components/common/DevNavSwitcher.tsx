import React from 'react';
import { Sparkles, Globe, Ticket, QrCode, Shield, Layers } from 'lucide-react';

export type ActiveView = 'vitrine' | 'reservation' | 'tickets' | 'admin';

interface DevNavSwitcherProps {
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  selectedOrderId?: string;
}

export const DevNavSwitcher: React.FC<DevNavSwitcherProps> = ({
  activeView,
  onChangeView,
  selectedOrderId,
}) => {
  const views: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'vitrine', label: '1. Vitrine', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'reservation', label: '2. Réservation', icon: <Ticket className="w-3.5 h-3.5" /> },
    { id: 'tickets', label: '3. Billets (Client)', icon: <QrCode className="w-3.5 h-3.5" /> },
    { id: 'admin', label: '4. Espace Équipe', icon: <Shield className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] select-none print:hidden">
      <div className="flex items-center gap-1 p-1.5 rounded-full border border-[#D4A857] bg-[#120507]/95 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(212,168,87,0.3)]">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D4A857] border-r border-[#D4A857]/30">
          <Layers className="w-3 h-3 text-[#E8C98A]" />
          <span>Navigation Démo</span>
        </div>

        {views.map((v) => {
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onChangeView(v.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#150608] shadow-md scale-105'
                  : 'text-[#E8C98A]/80 hover:text-white hover:bg-[#D4A857]/10'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
