import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, QrCode, ScanLine, XCircle } from 'lucide-react';
import { Order } from '../../types';
import { checkTicket, ScanOutcome, scanLog } from '../../lib/scan';
import { QrCamera } from './QrCamera';
import { useTeam } from '../../team/TeamContext';

interface ScannerPanelProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}


export const ScannerPanel: React.FC<ScannerPanelProps> = ({ orders, onUpdateOrder }) => {
  const [code, setCode] = useState('');
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);

  const allTickets = useMemo(
    () => orders.flatMap((o) => o.tickets.map((t) => ({ ticket: t, order: o }))),
    [orders]
  );

  const validTickets = allTickets.filter(({ order }) => order.status === 'validated');
  const totalValid = validTickets.length;
  const scannedCount = validTickets.filter(({ ticket }) => ticket.scanned).length;

  const recentScans = allTickets
    .filter(({ ticket }) => ticket.scanned)
    .sort((a, b) => (b.ticket.scannedAt ?? '').localeCompare(a.ticket.scannedAt ?? ''))
    .slice(0, 6);

  const { current, log } = useTeam();

  const runScan = (raw: string) => {
    const res = checkTicket(raw, orders, current?.name ?? 'Console');
    if (!res) return;
    if (res.updatedOrder) onUpdateOrder(res.updatedOrder);
    log(...scanLog(res.outcome));
    setOutcome(res.outcome);
  };

  const testable = allTickets.filter(({ order }) => order.status === 'validated').slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-6">
        <QrCamera onDetected={runScan} paused={!!outcome} className="aspect-[4/3] sm:aspect-[16/9] mb-5" />
        <p className="text-sm text-stone-400 mb-3">
          Le QR code ne passe pas ? Saisis le numéro du billet (ex. TKT-0001-01) ou son code de sécurité.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runScan(code);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 text-[#E6C78A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="TKT-0001-01 ou GALA-1001-A"
              aria-label="Numéro ou code du billet"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/20 text-base font-mono text-stone-100 placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer"
          >
            Vérifier le billet
          </button>
        </form>

        {testable.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-stone-400 mb-2">Billets de démonstration (un clic remplit le champ)&nbsp;:</p>
            <div className="flex flex-wrap gap-2">
              {testable.map(({ ticket }) => (
                <button
                  key={ticket.ticketNumber}
                  onClick={() => setCode(ticket.ticketNumber)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-stone-200 hover:border-[#E8C98A] hover:text-stone-100 cursor-pointer"
                >
                  {ticket.ticketNumber}
                  {ticket.scanned ? ' · déjà scanné' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-300 flex items-center justify-center">
            <ScanLine className="w-5 h-5" />
          </span>
          <div>
            <p className="text-2xl font-semibold text-stone-50 tabular-nums leading-none">
              {scannedCount}
              <span className="text-base text-stone-500"> / {totalValid}</span>
            </p>
            <p className="text-xs text-stone-400 mt-1">entrées sur les billets vendus</p>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-stone-300 mb-3">Derniers billets scannés</h3>
        {recentScans.length === 0 ? (
          <p className="text-sm text-stone-400">Aucune entrée pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {recentScans.map(({ ticket }) => (
              <li key={ticket.ticketNumber} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-stone-100 truncate">{ticket.attendeeName}</p>
                  <p className="text-xs text-stone-400 font-mono">
                    {ticket.ticketNumber} · {ticket.scannedAt}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {outcome && <ResultOverlay outcome={outcome} onClose={() => { setOutcome(null); setCode(''); }} />}
    </div>
  );
};

const THEMES = {
  valid: { bg: 'bg-emerald-950/95', border: 'border-emerald-400', icon: 'bg-emerald-400 text-emerald-950', label: 'Accès autorisé', title: 'Billet valide', Icon: CheckCircle2, btn: 'bg-white text-emerald-950 hover:bg-emerald-100' },
  already_used: { bg: 'bg-red-950/95', border: 'border-red-400', icon: 'bg-red-500 text-white', label: 'Attention : doublon', title: 'Billet déjà utilisé', Icon: AlertTriangle, btn: 'bg-red-500 text-white hover:bg-red-400' },
  not_validated: { bg: 'bg-amber-950/95', border: 'border-amber-400', icon: 'bg-amber-400 text-amber-950', label: 'Paiement non confirmé', title: 'Commande non validée', Icon: AlertTriangle, btn: 'bg-amber-400 text-amber-950 hover:bg-amber-300' },
  unknown: { bg: 'bg-rose-950/95', border: 'border-rose-400', icon: 'bg-rose-500 text-white', label: 'Entrée refusée', title: 'Billet inconnu', Icon: XCircle, btn: 'bg-rose-500 text-white hover:bg-rose-400' },
} as const;

export const ResultOverlay: React.FC<{ outcome: ScanOutcome; onClose: () => void }> = ({ outcome, onClose }) => {
  const theme = THEMES[outcome.kind];
  const Icon = theme.Icon;

  const rows: [string, string][] =
    outcome.kind === 'unknown'
      ? [['Code saisi', outcome.code]]
      : [
          ['Convive', outcome.ticket.attendeeName],
          ['Formule', outcome.ticket.tierName],
          ['Billet', outcome.ticket.ticketNumber],
          ['Commande', outcome.order.id],
          ...(outcome.kind === 'valid' ? ([['Heure du scan', outcome.time]] as [string, string][]) : []),
          ...(outcome.kind === 'already_used'
            ? ([['Premier scan', `${outcome.ticket.scannedAt ?? ''} — ${outcome.ticket.scannedBy ?? ''}`]] as [string, string][])
            : []),
        ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md ${theme.bg}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border-2 ${theme.border} bg-black/40 p-8 text-center text-white space-y-6`}
      >
        <div className={`w-20 h-20 rounded-full ${theme.icon} flex items-center justify-center mx-auto`}>
          <Icon className="w-11 h-11" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-bold opacity-80">{theme.label}</p>
          <h3 className="font-semibold tracking-tight text-3xl font-bold mt-1">{theme.title}</h3>
        </div>
        <dl className="rounded-2xl bg-black/40 p-5 text-left space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="opacity-70">{k}</dt>
              <dd className="font-semibold text-right break-all">{v}</dd>
            </div>
          ))}
        </dl>
        {outcome.kind === 'not_validated' && (
          <p className="text-sm opacity-90">Le paiement de cette commande n'est pas encore validé. Oriente le convive vers la conciergerie.</p>
        )}
        {outcome.kind === 'unknown' && (
          <p className="text-sm opacity-90">Aucun billet ne correspond à ce code. Oriente le convive vers la conciergerie.</p>
        )}
        <button
          autoFocus
          onClick={onClose}
          className={`w-full py-3.5 rounded-full font-bold text-sm cursor-pointer ${theme.btn}`}
        >
          {outcome.kind === 'valid' ? 'Convive suivant' : 'Fermer'}
        </button>
      </div>
    </div>
  );
};
