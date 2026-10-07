import React, { useMemo, useState } from 'react';
import { AlertTriangle, Camera, CheckCircle2, QrCode, ScanLine, XCircle } from 'lucide-react';
import { IssuedTicket, Order } from '../../types';

type ScanOutcome =
  | { kind: 'valid'; ticket: IssuedTicket; order: Order; time: string }
  | { kind: 'already_used'; ticket: IssuedTicket; order: Order }
  | { kind: 'not_validated'; ticket: IssuedTicket; order: Order }
  | { kind: 'unknown'; code: string };

interface ScannerPanelProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

const nowTime = () => new Date().toTimeString().slice(0, 8);

export const ScannerPanel: React.FC<ScannerPanelProps> = ({ orders, onUpdateOrder }) => {
  const [code, setCode] = useState('');
  const [outcome, setOutcome] = useState<ScanOutcome | null>(null);

  const allTickets = useMemo(
    () => orders.flatMap((o) => o.tickets.map((t) => ({ ticket: t, order: o }))),
    [orders]
  );

  const recentScans = allTickets
    .filter(({ ticket }) => ticket.scanned)
    .sort((a, b) => (b.ticket.scannedAt ?? '').localeCompare(a.ticket.scannedAt ?? ''))
    .slice(0, 6);

  const runScan = (raw: string) => {
    const q = raw.trim().toLowerCase();
    if (!q) return;
    // Le QR code contient « numéro|code de sécurité » : on lit chaque morceau
    const parts = q.split(/[|\s]+/).filter(Boolean);
    const found = allTickets.find(({ ticket }) => {
      const num = ticket.ticketNumber.toLowerCase();
      const code = ticket.securityCode.toLowerCase();
      const hasNum = parts.includes(num);
      const hasCode = parts.includes(code);
      // Si le QR donne les deux, ils doivent correspondre au même billet (anti-falsification)
      if (hasNum && parts.some((p) => /^[a-z]{3,5}-\d{4}-[a-z]$/.test(p))) return hasCode;
      return hasNum || hasCode || ticket.qrPayload.toLowerCase() === q;
    });

    if (!found) {
      setOutcome({ kind: 'unknown', code: raw.trim() });
      return;
    }
    const { ticket, order } = found;
    if (order.status !== 'validated') {
      setOutcome({ kind: 'not_validated', ticket, order });
      return;
    }
    if (ticket.scanned) {
      setOutcome({ kind: 'already_used', ticket, order });
      return;
    }

    const time = nowTime();
    onUpdateOrder({
      ...order,
      tickets: order.tickets.map((t) =>
        t.ticketNumber === ticket.ticketNumber ? { ...t, scanned: true, scannedAt: time, scannedBy: 'Contrôleur (console)' } : t
      ),
    });
    setOutcome({ kind: 'valid', ticket, order, time });
  };

  const testable = allTickets.filter(({ order }) => order.status === 'validated').slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1">
          <ScanLine className="w-6 h-6 text-[#E8C98A]" />
          <h2 className="font-serif text-2xl text-[#F9F5EC]">Contrôle d'entrée</h2>
        </div>
        <p className="text-sm text-stone-300 mb-6">
          Scanne le QR code, ou saisis le numéro du billet (ex. TKT-0001-01) ou son code de sécurité. Un billet valide est marqué « scanné » tout de suite.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runScan(code);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 text-[#E8C98A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
              placeholder="TKT-0001-01 ou GALA-1001-A"
              aria-label="Numéro ou code du billet"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/15 bg-black/30 text-base font-mono text-[#F9F5EC] placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 cursor-pointer"
          >
            Vérifier le billet
          </button>
        </form>

        {testable.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-stone-400 mb-2">Billets de démonstration (un clic remplit le champ) :</p>
            <div className="flex flex-wrap gap-2">
              {testable.map(({ ticket }) => (
                <button
                  key={ticket.ticketNumber}
                  onClick={() => setCode(ticket.ticketNumber)}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-mono text-stone-200 hover:border-[#E8C98A] hover:text-[#F3E5AB] cursor-pointer"
                >
                  {ticket.ticketNumber}
                  {ticket.scanned ? ' · déjà scanné' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zone de caméra (simulation visuelle) */}
        <div className="mt-8 relative aspect-[16/9] max-h-64 rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-6 border-2 border-dashed border-[#E8C98A]/40 rounded-xl" />
          <div className="text-center text-stone-400">
            <Camera className="w-9 h-9 mx-auto mb-2 text-[#E8C98A]/80" />
            <p className="text-sm">Le scan par caméra sera branché avec le backend.</p>
            <p className="text-xs">En attendant, la saisie du code fonctionne.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 className="text-sm font-semibold text-[#E8C98A] mb-4">Derniers billets scannés</h3>
        {recentScans.length === 0 ? (
          <p className="text-sm text-stone-400">Aucune entrée pour le moment.</p>
        ) : (
          <ul className="space-y-3">
            {recentScans.map(({ ticket }) => (
              <li key={ticket.ticketNumber} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#F9F5EC] truncate">{ticket.attendeeName}</p>
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

const ResultOverlay: React.FC<{ outcome: ScanOutcome; onClose: () => void }> = ({ outcome, onClose }) => {
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
          <h3 className="font-serif text-4xl font-bold mt-1">{theme.title}</h3>
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
