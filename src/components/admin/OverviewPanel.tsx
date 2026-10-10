import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CircleDollarSign, Clock, FileEdit, Link2, Plus, ScanLine, Ticket, TimerReset } from 'lucide-react';
import { Order } from '../../types';
import { useContent } from '../../content/ContentContext';
import { useTeam } from '../../team/TeamContext';
import { panel } from './ui';

type GoTab = 'orders' | 'scanner' | 'content' | 'settings' | 'team';

interface OverviewPanelProps {
  orders: Order[];
  onGo: (tab: GoTab, opts?: { pendingOnly?: boolean }) => void;
  onValidate: (order: Order) => void;
  onAddOrder: () => void;
}

const DAY = 86_400_000;

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 || h >= 18 ? 'Bonsoir' : 'Bonjour';
};

const remaining = (ms: number) => {
  if (ms <= 0) return 'terminé';
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / 3_600_000);
  if (d > 0) return `${d} j ${h} h`;
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h} h ${m} min`;
};

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ orders, onGo, onValidate, onAddOrder }) => {
  const { content, isSalesOpen } = useContent();
  const { current, can, isManager, activity, scanLinks } = useTeam();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const validated = orders.filter((o) => o.status === 'validated');
  const pending = orders.filter((o) => o.status === 'pending');
  const sold = validated.reduce((a, o) => a + o.quantity, 0);
  const revenue = validated.reduce((a, o) => a + o.totalAmount, 0);
  const pendingAmount = pending.reduce((a, o) => a + o.totalAmount, 0);
  const scanned = validated.flatMap((o) => o.tickets).filter((t) => t.scanned).length;
  const salesOpen = isSalesOpen();
  const deadline = new Date(content.settings.salesDeadline).getTime();

  // Billets vendus par jour (14 derniers jours), d'après la date de commande
  const days = useMemo(() => {
    const out: { key: string; label: string; count: number }[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      out.push({ key, label: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), count: 0 });
    }
    validated.forEach((o) => {
      const day = out.find((d) => o.createdAt.startsWith(d.key));
      if (day) day.count += o.quantity;
    });
    return out;
  }, [validated]);
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const weekCount = days.slice(7).reduce((a, d) => a + d.count, 0);

  const firstName = current?.name.split(' ')[0] ?? '';

  const actions = [
    can('orders') && { label: 'Nouvelle commande', hint: 'Depuis WhatsApp', icon: <Plus className="w-5 h-5" />, onClick: onAddOrder },
    can('scanner') && { label: 'Scanner un billet', hint: 'Contrôle à l\'entrée', icon: <ScanLine className="w-5 h-5" />, onClick: () => onGo('scanner') },
    can('content') && { label: 'Modifier le site', hint: 'Textes et images', icon: <FileEdit className="w-5 h-5" />, onClick: () => onGo('content') },
    isManager && { label: 'Lien de scan', hint: `${scanLinks.filter((l) => l.active).length} lien(s) actif(s)`, icon: <Link2 className="w-5 h-5" />, onClick: () => onGo('team') },
  ].filter(Boolean) as { label: string; hint: string; icon: React.ReactNode; onClick: () => void }[];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Bienvenue + état de la billetterie */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#2B1E18] via-[#1E1714] to-[#18120F] p-6 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 w-72 h-72 rounded-full bg-[#E6C78A]/[0.07] blur-3xl" />
        <p className="text-sm text-[#E6C78A]">{greeting()} {firstName},</p>
        <h2 className="mt-1 font-semibold tracking-tight text-2xl sm:text-4xl text-stone-100 leading-tight text-balance">
          {pending.length > 0
            ? `${pending.length} commande${pending.length > 1 ? 's' : ''} attend${pending.length > 1 ? 'ent' : ''} ta validation`
            : 'Tout est à jour'}
        </h2>
        <p className="mt-2 text-sm text-stone-300 max-w-xl">
          {pending.length > 0
            ? 'Vérifie le paiement avec le client sur WhatsApp, puis valide : son lien d\'invitations est créé tout de suite.'
            : 'Aucune commande en attente. Partage le site pour faire venir de nouvelles réservations.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          {pending.length > 0 && can('orders') && (
            <button
              onClick={() => onGo('orders', { pendingOnly: true })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] text-sm font-bold hover:bg-[#EFD6A2] cursor-pointer"
            >
              Traiter les commandes <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border ${
              salesOpen ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300' : 'border-red-400/30 bg-red-500/10 text-red-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${salesOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            {salesOpen ? 'Ventes ouvertes' : 'Ventes fermées'}
          </span>
          {!Number.isNaN(deadline) && (
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border border-white/10 bg-white/5 text-stone-200">
              <TimerReset className="w-3.5 h-3.5 text-[#E6C78A]" />
              Fin de la billetterie : {remaining(deadline - now)}
            </span>
          )}
        </div>
      </section>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <Kpi icon={<Ticket className="w-4.5 h-4.5" />} label="Billets vendus" value={sold} sub={`${weekCount} cette semaine`} />
        <Kpi icon={<CircleDollarSign className="w-4.5 h-4.5" />} label="Encaissé" value={revenue} suffix=" $" sub={`${pendingAmount} $ en attente`} />
        <Kpi icon={<Clock className="w-4.5 h-4.5" />} label="À traiter" value={pending.length} sub={pending.length ? 'à valider' : 'rien en attente'} tone="amber" />
        <Kpi
          icon={<ScanLine className="w-4.5 h-4.5" />}
          label="Entrées"
          value={scanned}
          sub={sold ? `sur ${sold} billets` : 'aucun billet vendu'}
          tone="green"
          progress={sold ? scanned / sold : 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Ventes des 14 derniers jours */}
        <section className={`${panel} p-5 sm:p-6 lg:col-span-3`}>
          <div className="flex items-baseline justify-between gap-3 mb-5">
            <h3 className="font-semibold text-stone-100">Billets vendus par jour</h3>
            <span className="text-xs text-stone-500">14 derniers jours</span>
          </div>
          <div className="flex items-end gap-1 sm:gap-1.5 h-40" role="img" aria-label="Billets vendus par jour sur les 14 derniers jours">
            {days.map((d, i) => (
              <div key={d.key} className="group relative flex-1 h-full flex flex-col justify-end items-center">
                <span className="mb-1 text-[10px] tabular-nums text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                <div
                  title={`${d.label} : ${d.count} billet${d.count > 1 ? 's' : ''}`}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    d.count ? (i === days.length - 1 ? 'bg-[#E6C78A]' : 'bg-[#E6C78A]/45') : 'bg-white/[0.06]'
                  }`}
                  style={{ height: `${d.count ? Math.max(8, (d.count / maxDay) * 100) : 4}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] sm:text-xs text-stone-500">
            <span>{days[0].label}</span>
            <span>{days[7].label}</span>
            <span>Aujourd'hui</span>
          </div>
        </section>

        {/* Actions rapides */}
        <section className={`${panel} p-5 sm:p-6 lg:col-span-2`}>
          <h3 className="font-semibold text-stone-100 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.onClick}
                className="group text-left rounded-2xl border border-white/10 bg-black/25 p-3.5 hover:border-white/15 hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <span className="w-9 h-9 rounded-xl bg-[#E6C78A]/10 text-[#E6C78A] flex items-center justify-center mb-2.5 group-hover:bg-[#E6C78A]/15 transition-colors">
                  {a.icon}
                </span>
                <span className="block text-sm font-semibold text-stone-100 leading-snug">{a.label}</span>
                <span className="block text-xs text-stone-400 mt-0.5">{a.hint}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Commandes à traiter */}
        {can('orders') && (
          <section className={`${panel} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-100">Commandes à traiter</h3>
              <button onClick={() => onGo('orders', { pendingOnly: true })} className="text-xs text-[#E6C78A] hover:text-white inline-flex items-center gap-1 cursor-pointer">
                Tout voir <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {pending.length === 0 ? (
              <p className="text-sm text-stone-500 py-8 text-center">Aucune commande en attente.</p>
            ) : (
              <ul className="space-y-2">
                {pending.slice(0, 5).map((o) => (
                  <li key={o.id} className="flex items-center gap-3 rounded-xl bg-black/25 p-3">
                    <Avatar name={o.customerName} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-100 truncate">{o.customerName}</p>
                      <p className="text-xs text-stone-400 truncate">
                        {o.quantity} billet{o.quantity > 1 ? 's' : ''} · {o.totalAmount} $ · {o.id}
                      </p>
                    </div>
                    {can('validate') && (
                      <button
                        onClick={() => onValidate(o)}
                        className="px-3.5 py-2 rounded-lg bg-[#E6C78A] text-[#2B1B0A] text-xs font-bold cursor-pointer hover:bg-[#EFD6A2]"
                      >
                        Valider
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Activité récente */}
        {isManager && (
          <section className={`${panel} p-5 sm:p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-100">Activité récente</h3>
              <button onClick={() => onGo('team')} className="text-xs text-[#E6C78A] hover:text-white inline-flex items-center gap-1 cursor-pointer">
                Historique <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {activity.length === 0 ? (
              <p className="text-sm text-stone-500 py-8 text-center">Rien pour le moment.</p>
            ) : (
              <ol className="relative space-y-4 pl-5 before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-white/10">
                {activity.slice(0, 6).map((e) => (
                  <li key={e.id} className="relative text-sm">
                    <span className="absolute -left-5 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#E8C98A]/60 bg-[#1F1916]" />
                    <p className="text-stone-300 leading-snug">
                      <strong className="text-stone-100 font-semibold">{e.actor}</strong> {e.action.charAt(0).toLowerCase() + e.action.slice(1)}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 tabular-nums">{e.at}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

const Kpi: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  sub: string;
  tone?: 'gold' | 'amber' | 'green';
  progress?: number;
}> = ({ icon, label, value, suffix = '', sub, tone = 'gold', progress }) => {
  const toneCls = { gold: 'text-[#E6C78A] bg-[#E8C98A]/10', amber: 'text-amber-300 bg-amber-400/10', green: 'text-emerald-300 bg-emerald-400/10' }[tone];
  return (
    <div className={`${panel} p-4 sm:p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${toneCls}`}>{icon}</span>
        <span className="text-xs sm:text-sm text-stone-300 truncate">{label}</span>
      </div>
      <p className="font-sans font-semibold tracking-tight text-3xl sm:text-4xl text-stone-100 tabular-nums">
        {value}
        <span className="text-xl sm:text-2xl text-stone-400">{suffix}</span>
      </p>
      <p className="text-xs text-stone-400 mt-1 truncate">{sub}</p>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500/80 to-emerald-400/80 transition-all duration-700" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
};

export const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'md' }) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      aria-hidden
      className={`shrink-0 rounded-full bg-[#E6C78A]/15 border border-[#E6C78A]/25 text-stone-100 font-semibold flex items-center justify-center ${
        size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
      }`}
    >
      {initials || '?'}
    </span>
  );
};
