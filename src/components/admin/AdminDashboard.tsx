import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileEdit,
  LayoutDashboard,
  ListOrdered,
  MessageCircle,
  Menu,
  ScanLine,
  Search,
  Ticket,
  X,
  XCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from '../common/EmpireLogo';
import { ScannerPanel } from './ScannerPanel';
import { ContentEditor } from './ContentEditor';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onBackToHome: () => void;
  onOpenOrderTickets: (orderId: string) => void;
}

type Tab = 'overview' | 'orders' | 'scanner' | 'content';

const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'Commandes', icon: <ListOrdered className="w-5 h-5" /> },
  { id: 'scanner', label: 'Contrôle d\'entrée', icon: <ScanLine className="w-5 h-5" /> },
  { id: 'content', label: 'Contenu du site', icon: <FileEdit className="w-5 h-5" /> },
];

const STATUS_STYLES: Record<OrderStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  validated: { label: 'Validée', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  pending: { label: 'En attente', cls: 'bg-amber-500/15 text-amber-300 border-amber-400/30', icon: <Clock className="w-3.5 h-3.5" /> },
  rejected: { label: 'Refusée', cls: 'bg-red-500/15 text-red-300 border-red-400/30', icon: <XCircle className="w-3.5 h-3.5" /> },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
};

const panel = 'rounded-2xl border border-white/10 bg-white/[0.03]';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrder,
  onBackToHome,
  onOpenOrderTickets,
}) => {
  const { content } = useContent();
  const [tab, setTab] = useState<Tab>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [validatingOrder, setValidatingOrder] = useState<Order | null>(null);
  const [smsReference, setSmsReference] = useState('');
  const [isValidationSuccess, setIsValidationSuccess] = useState(false);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);

  const notify = (message: string) => setToast(message);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(id);
  }, [toast]);

  const validated = orders.filter((o) => o.status === 'validated');
  const pending = orders.filter((o) => o.status === 'pending');
  const soldTickets = validated.reduce((acc, o) => acc + o.quantity, 0);
  const revenue = validated.reduce((acc, o) => acc + o.totalAmount, 0);
  const scannedCount = orders.flatMap((o) => o.tickets).filter((t) => t.scanned).length;
  const pendingAmount = pending.reduce((acc, o) => acc + o.totalAmount, 0);

  const revenueByTier = useMemo(
    () =>
      content.tiers.map((tier) => ({
        tier,
        amount: validated.filter((o) => o.tierId === tier.id).reduce((a, o) => a + o.totalAmount, 0),
        count: validated.filter((o) => o.tierId === tier.id).reduce((a, o) => a + o.quantity, 0),
      })),
    [content.tiers, validated]
  );
  const maxTierAmount = Math.max(1, ...revenueByTier.map((r) => r.amount));

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      !q ||
      order.customerName.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q) ||
      order.payerPhone.includes(searchQuery) ||
      order.customerPhone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const tierName = (id: string) => content.tiers.find((t) => t.id === id)?.name ?? id;

  const openValidate = (order: Order) => {
    setValidatingOrder(order);
    setSmsReference(`MPESA-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setIsValidationSuccess(false);
  };

  const confirmValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatingOrder) return;
    const updated: Order = {
      ...validatingOrder,
      status: 'validated',
      paymentReference: smsReference,
      validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tickets: validatingOrder.tickets.map((t) => ({ ...t, qrPayload: `${t.qrPayload}|REF-${smsReference}` })),
    };
    onUpdateOrder(updated);
    setValidatingOrder(updated);
    setIsValidationSuccess(true);
  };

  const confirmReject = () => {
    if (!rejectingOrder) return;
    onUpdateOrder({ ...rejectingOrder, status: 'rejected', notes: 'Refusé par le gestionnaire - Transfert non confirmé' });
    notify(`Commande ${rejectingOrder.id} refusée`);
    setRejectingOrder(null);
  };

  const whatsAppUrl = (order: Order) => {
    const message = `Bonjour ${order.customerName},\n\nExcellente nouvelle ! Ta réservation pour ${content.galaInfo.name} est désormais *VALIDÉE* :\n- Commande : *${order.id}*\n- Formule : *${order.quantity}x ${order.tierId.toUpperCase()}*\n- Réf. SMS : *${order.paymentReference || 'CONFIRMÉ'}*\n\nTu peux dès à présent consulter et télécharger tes invitations avec QR code personnel sur le portail officiel.\n\nNous avons hâte de t'accueillir le ${content.galaInfo.dateText} !`;
    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const exportCsv = () => {
    const header = ['Commande', 'Date', 'Nom', 'Téléphone', 'Payeur', 'Formule', 'Quantité', 'Montant USD', 'Statut', 'Référence'];
    const rows = orders.map((o) => [
      o.id, o.createdAt, o.customerName, o.customerPhone, o.payerPhone, tierName(o.tierId), o.quantity, o.totalAmount, STATUS_STYLES[o.status].label, o.paymentReference ?? '',
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-gala-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Commandes exportées');
  };

  const goTab = (id: Tab) => {
    setTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <EmpireLogo size={44} />
        <div className="min-w-0">
          <p className="font-serif text-lg text-[#F9F5EC] leading-tight truncate">Console équipe</p>
          <p className="text-xs text-stone-400 truncate">{content.galaInfo.name}</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1" aria-label="Navigation de la console">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => goTab(item.id)}
            aria-current={tab === item.id ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              tab === item.id ? 'bg-[#E8C98A]/15 text-[#F3E5AB]' : 'text-stone-300 hover:bg-white/5'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.id === 'orders' && pending.length > 0 && (
              <span className="ml-auto min-w-6 h-6 px-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold flex items-center justify-center">
                {pending.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={onBackToHome}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-stone-300 hover:bg-white/5 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour au site</span>
        </button>
      </div>
    </div>
  );

  const currentLabel = NAV.find((n) => n.id === tab)?.label;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr] text-[#F9F5EC] bg-[#12070A] relative z-[5]">
      {/* Menu latéral (grand écran) */}
      <aside className="hidden lg:block sticky top-0 h-screen border-r border-white/10 bg-black/50 backdrop-blur-md">{sidebar}</aside>

      {/* Menu latéral (mobile) */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-[85vw] bg-[#0E0506] border-r border-white/10 shadow-2xl">{sidebar}</div>
          <button aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} className="flex-1 bg-black/60 cursor-pointer" />
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-8 h-16 border-b border-white/10 bg-black/50 backdrop-blur-md">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-serif text-xl sm:text-2xl text-[#F9F5EC]">{currentLabel}</h1>
          <div className="ml-auto flex items-center gap-2 text-xs text-stone-400">
            <span className="hidden sm:inline">{content.galaInfo.dateText}</span>
          </div>
        </header>

        <main className="p-4 sm:p-8 max-w-6xl">
          {/* ============ VUE D'ENSEMBLE ============ */}
          {tab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <Kpi
                  icon={<Ticket className="w-5 h-5" />}
                  label="Billets vendus"
                  value={String(soldTickets)}
                  sub={soldTickets > 1 ? 'billets validés' : 'billet validé'}
                />
                <Kpi icon={<DollarSign className="w-5 h-5" />} label="Montant encaissé" value={`${revenue} USD`} sub={`${pendingAmount} USD en attente`} />
                <Kpi icon={<Clock className="w-5 h-5" />} label="À traiter" value={String(pending.length)} sub="commandes à vérifier" tone="amber" />
                <Kpi
                  icon={<ScanLine className="w-5 h-5" />}
                  label="Entrées scannées"
                  value={String(scannedCount)}
                  sub={soldTickets ? `${Math.round((scannedCount / soldTickets) * 100)} % des billets vendus` : 'Aucun billet vendu'}
                  tone="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className={`${panel} p-6`}>
                  <h2 className="font-semibold text-[#F3E5AB] mb-5">Ventes par formule</h2>
                  <ul className="space-y-5">
                    {revenueByTier.map(({ tier, amount, count }) => (
                      <li key={tier.id}>
                        <div className="flex items-baseline justify-between text-sm mb-1.5">
                          <span className="text-stone-100">{tier.name}</span>
                          <span className="text-stone-300 tabular-nums">
                            {count} × — <strong className="text-[#F3E5AB]">{amount} USD</strong>
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C99A45] to-[#E8C98A] transition-all duration-500"
                            style={{ width: `${(amount / maxTierAmount) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={`${panel} p-6`}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-[#F3E5AB]">Commandes à traiter</h2>
                    <button onClick={() => { setStatusFilter('pending'); goTab('orders'); }} className="text-xs text-[#E8C98A] underline underline-offset-4 cursor-pointer">
                      Tout voir
                    </button>
                  </div>
                  {pending.length === 0 ? (
                    <p className="text-sm text-stone-400 py-6 text-center">Tout est à jour. Aucune commande en attente.</p>
                  ) : (
                    <ul className="space-y-3">
                      {pending.slice(0, 4).map((o) => (
                        <li key={o.id} className="flex items-center gap-3 rounded-xl bg-black/25 p-3.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#F9F5EC] truncate">{o.customerName}</p>
                            <p className="text-xs text-stone-400 truncate">
                              {o.id} · {o.quantity} × {tierName(o.tierId)} · {o.totalAmount} USD
                            </p>
                          </div>
                          <button
                            onClick={() => openValidate(o)}
                            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] text-xs font-bold cursor-pointer hover:brightness-110"
                          >
                            Valider
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            </div>
          )}

          {/* ============ COMMANDES ============ */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className={`${panel} p-4 flex flex-col lg:flex-row gap-4 lg:items-center`}>
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#E8C98A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    placeholder="Rechercher un nom, un code ou un numéro"
                    aria-label="Rechercher une commande"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/15 bg-black/30 text-sm text-[#F9F5EC] placeholder-stone-500 focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto" role="tablist" aria-label="Filtrer par statut">
                  {(
                    [
                      ['all', 'Toutes', orders.length],
                      ['pending', 'En attente', pending.length],
                      ['validated', 'Validées', validated.length],
                      ['rejected', 'Refusées', orders.filter((o) => o.status === 'rejected').length],
                    ] as ['all' | OrderStatus, string, number][]
                  ).map(([id, label, count]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={statusFilter === id}
                      onClick={() => setStatusFilter(id)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        statusFilter === id ? 'bg-[#E8C98A] text-[#3D030B] font-bold' : 'text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      {label} <span className="opacity-70">({count})</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportCsv}
                  className="lg:ml-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Exporter en CSV
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className={`${panel} p-10 text-center text-stone-400`}>Aucune commande ne correspond à ta recherche.</div>
              ) : (
                <ul className="space-y-3">
                  {filteredOrders.map((order) => (
                    <li key={order.id} className={`${panel} p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4`}>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <button
                            onClick={() => onOpenOrderTickets(order.id)}
                            title="Voir les billets de cette commande"
                            className="font-mono font-bold text-[#F3E5AB] hover:underline cursor-pointer"
                          >
                            {order.id}
                          </button>
                          <StatusBadge status={order.status} />
                          {order.payerPhone !== order.customerPhone && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300">Payé par un tiers</span>
                          )}
                        </div>
                        <p className="mt-1.5 text-[#F9F5EC] font-semibold">{order.customerName}</p>
                        <p className="text-sm text-stone-400">
                          {order.quantity} × {tierName(order.tierId)} · <strong className="text-stone-200">{order.totalAmount} USD</strong> · Payeur {order.payerPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openValidate(order)}
                              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] text-sm font-bold hover:brightness-110 cursor-pointer"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => setRejectingOrder(order)}
                              className="px-4 py-2.5 rounded-lg border border-red-400/40 text-sm text-red-300 hover:bg-red-500/10 cursor-pointer"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {order.status === 'validated' && (
                          <>
                            <a
                              href={whatsAppUrl(order)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366]/15 text-[#4ade80] text-sm font-semibold hover:bg-[#25D366]/25"
                            >
                              <MessageCircle className="w-4 h-4" /> WhatsApp
                            </a>
                            <button
                              onClick={() => onOpenOrderTickets(order.id)}
                              className="px-4 py-2.5 rounded-lg border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
                            >
                              Voir les billets
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'scanner' && <ScannerPanel orders={orders} onUpdateOrder={onUpdateOrder} />}

          {tab === 'content' && <ContentEditor onViewSite={onBackToHome} notify={notify} />}
        </main>
      </div>

      {/* Fenêtre de validation */}
      {validatingOrder && (
        <Modal onClose={() => setValidatingOrder(null)} title={`Commande ${validatingOrder.id}`} kicker="Validation du paiement">
          {!isValidationSuccess ? (
            <form onSubmit={confirmValidation} className="space-y-5">
              <dl className="rounded-xl bg-black/30 p-4 text-sm space-y-2">
                <Row k="Titulaire" v={validatingOrder.customerName} />
                <Row k="Montant attendu" v={`${validatingOrder.totalAmount} USD`} strong />
                <Row k="Numéro payeur" v={validatingOrder.payerPhone} mono />
              </dl>
              <label className="block">
                <span className="block text-xs font-semibold text-[#E8C98A] mb-1.5">Référence du SMS de paiement *</span>
                <input
                  required
                  value={smsReference}
                  onChange={(e) => setSmsReference(e.target.value)}
                  placeholder="Ex. MPESA-88492021"
                  className="w-full px-3.5 py-3 rounded-lg border border-white/15 bg-black/30 text-sm font-mono text-[#F9F5EC] focus:border-[#E8C98A] focus:outline-none focus:ring-2 focus:ring-[#E8C98A]/20"
                />
                <span className="block text-xs text-stone-400 mt-1">Le code qui figure sur le SMS de confirmation reçu.</span>
              </label>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-sm hover:brightness-110 cursor-pointer"
              >
                Confirmer la validation
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#F9F5EC]">Paiement validé</h3>
                <p className="text-sm text-stone-300 mt-1">
                  Les billets de <strong>{validatingOrder.customerName}</strong> sont générés.
                </p>
              </div>
              <a
                href={whatsAppUrl(validatingOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold text-sm hover:bg-[#20ba59]"
              >
                <MessageCircle className="w-5 h-5" /> Envoyer le billet sur WhatsApp
              </a>
              <button
                onClick={() => {
                  const id = validatingOrder.id;
                  setValidatingOrder(null);
                  onOpenOrderTickets(id);
                }}
                className="w-full py-3 rounded-full border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
              >
                Voir les billets émis
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Confirmation de refus */}
      {rejectingOrder && (
        <Modal onClose={() => setRejectingOrder(null)} title={`Refuser ${rejectingOrder.id} ?`} kicker="Confirmation">
          <p className="text-sm text-stone-200 leading-relaxed mb-6">
            La commande de <strong>{rejectingOrder.customerName}</strong> ({rejectingOrder.totalAmount} USD) sera marquée comme refusée : aucun billet ne sera activé.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setRejectingOrder(null)} className="flex-1 py-3 rounded-full border border-white/20 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
              Annuler
            </button>
            <button onClick={confirmReject} className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-400 cursor-pointer">
              Refuser la commande
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-full bg-[#F3E5AB] text-[#3D030B] text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

const Kpi: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  progress?: number;
  tone?: 'gold' | 'amber' | 'green';
}> = ({ icon, label, value, sub, progress, tone = 'gold' }) => {
  const toneCls = { gold: 'text-[#E8C98A] bg-[#E8C98A]/10', amber: 'text-amber-300 bg-amber-400/10', green: 'text-emerald-300 bg-emerald-400/10' }[tone];
  return (
    <div className={`${panel} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-stone-300">{label}</span>
        <span className={`p-2 rounded-lg ${toneCls}`}>{icon}</span>
      </div>
      <p className="font-serif text-3xl sm:text-4xl text-[#F9F5EC] tabular-nums">{value}</p>
      <p className="text-xs text-stone-400 mt-1">{sub}</p>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#C99A45] to-[#E8C98A]" style={{ width: `${Math.min(100, progress * 100)}%` }} />
        </div>
      )}
    </div>
  );
};

const Row: React.FC<{ k: string; v: string; strong?: boolean; mono?: boolean }> = ({ k, v, strong, mono }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-stone-400">{k}</dt>
    <dd className={`text-right ${strong ? 'font-bold text-[#F3E5AB]' : 'text-stone-100'} ${mono ? 'font-mono' : ''}`}>{v}</dd>
  </div>
);

const Modal: React.FC<{ title: string; kicker: string; onClose: () => void; children: React.ReactNode }> = ({ title, kicker, onClose, children }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-[#E8C98A]/40 bg-[#140708] p-6 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold">{kicker}</p>
            <h2 className="font-serif text-2xl text-[#F9F5EC]">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
