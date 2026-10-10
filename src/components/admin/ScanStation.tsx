import React, { useState } from 'react';
import { QrCode, ScanLine, ShieldOff } from 'lucide-react';
import { Order } from '../../types';
import { checkTicket, ScanOutcome } from '../../lib/scan';
import { useTeam } from '../../team/TeamContext';
import { EmpireLogo } from '../common/EmpireLogo';
import { QrCamera } from './QrCamera';
import { ResultOverlay } from './ScannerPanel';

interface ScanStationProps {
  token: string;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

// Page ouverte par un lien de scan (?scan=…) : la personne ne peut que contrôler les billets, rien d'autre.
export const ScanStation: React.FC<ScanStationProps> = ({ token, orders, onUpdateOrder }) => {
  const { findScanLink, recordScan, log } = useTeam();
  const link = findScanLink(token);
  const [code, setCode] = useState('');
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);
  const [count, setCount] = useState(0);

  if (!link || !link.active) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#12070A] text-[#F9F5EC] relative z-[5]">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
          <span className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-500/15 text-red-300 flex items-center justify-center">
            <ShieldOff className="w-6 h-6" />
          </span>
          <h1 className="font-serif text-2xl mb-2">{link ? 'Lien désactivé' : 'Lien de scan non reconnu'}</h1>
          <p className="text-sm text-stone-400">
            {link
              ? 'Ce lien de contrôle a été désactivé par l\'organisateur. Demande-lui un nouveau lien.'
              : 'Ce lien n\'existe pas ou n\'est pas reconnu sur cet appareil. Vérifie que tu as bien ouvert le lien complet envoyé par l\'organisateur.'}
          </p>
        </div>
      </div>
    );
  }

  const runScan = (raw: string) => {
    const res = checkTicket(raw, orders, link.label);
    if (!res) return;
    if (res.updatedOrder && res.outcome.kind === 'valid') {
      onUpdateOrder(res.updatedOrder);
      recordScan(link.id);
      setCount((c) => c + 1);
      log(`A scanné le billet ${res.outcome.ticket.ticketNumber}`, `Scan · ${link.label}`);
    }
    setOutcome(res.outcome);
  };

  return (
    <div className="min-h-screen bg-[#12070A] text-[#F9F5EC] relative z-[5] pb-10">
      <header className="sticky top-0 z-10 flex items-center gap-3 px-4 h-16 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <EmpireLogo size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">Contrôle d'entrée</p>
          <p className="text-xs text-stone-400 truncate">{link.label}</p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold tabular-nums">
          <ScanLine className="w-4 h-4" /> {count} entrée{count > 1 ? 's' : ''}
        </span>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        <QrCamera onDetected={runScan} paused={!!outcome} className="aspect-[3/4] sm:aspect-square" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runScan(code);
          }}
          className="space-y-3"
        >
          <p className="text-xs text-stone-400 text-center">Le QR code ne passe pas ? Saisis le numéro du billet&nbsp;:</p>
          <div className="relative">
            <QrCode className="w-5 h-5 text-[#E8C98A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="TKT-0001-01"
              aria-label="Numéro ou code du billet"
              autoCapitalize="characters"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/15 bg-black/30 text-base font-mono text-[#F9F5EC] placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20"
            />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl border border-white/20 text-sm font-semibold hover:bg-white/10 cursor-pointer">
            Vérifier le billet
          </button>
        </form>
      </main>

      {outcome && <ResultOverlay outcome={outcome} onClose={() => { setOutcome(null); setCode(''); }} />}
    </div>
  );
};
