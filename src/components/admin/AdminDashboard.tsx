import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  Plus,
  FileEdit,
  LayoutDashboard,
  ListOrdered,
  Menu,
  RotateCcw,
  Settings,
  Trash2,
  Lock,
  LogOut,
  Users,
  BellRing,
  ScanLine,
  Search,
  Ticket,
  XCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { useContent } from '../../content/ContentContext';
import { EmpireLogo } from '../common/EmpireLogo';
import { ScannerPanel } from './ScannerPanel';
import { OverviewPanel, Avatar } from './OverviewPanel';
import { panel } from './ui';
import { useContentChangeLog } from './useContentChangeLog';
import { ContentEditor } from './ContentEditor';
import { SettingsPanel } from './SettingsPanel';
import { TeamPanel } from './TeamPanel';
import { ROLE_LABELS, useTeam } from '../../team/TeamContext';
import { AdminPermission } from '../../types';
import { AdminAuthProvider, useAdminAuth } from './AdminAuth';
import { Modal } from './Modal';
import { AddOrderModal } from './AddOrderModal';
import { buildTicketLink } from '../../lib/ticketLink';
import { copyText } from '../../lib/clipboard';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onAddOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onImportOrders: (orders: Order[]) => void;
  onBackToHome: () => void;
  onOpenOrderTickets: (orderId: string) => void;
}

type Tab = 'overview' | 'orders' | 'scanner' | 'content' | 'settings' | 'team';

// perm : droit nécessaire ; 'manager' = admin n°1 et super admin uniquement
const NAV: { id: Tab; label: string; short: string; icon: React.ReactNode; perm?: AdminPermission | 'manager' }[] = [
  { id: 'overview', label: 'Vue d\'ensemble', short: 'Accueil', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'orders', label: 'Commandes', short: 'Ventes', icon: <ListOrdered className="w-5 h-5" />, perm: 'orders' },
  { id: 'scanner', label: 'Contrôle d\'entrée', short: 'Scanner', icon: <ScanLine className="w-5 h-5" />, perm: 'scanner' },
  { id: 'content', label: 'Contenu du site', short: 'Site', icon: <FileEdit className="w-5 h-5" />, perm: 'content' },
  { id: 'settings', label: 'Réglages', short: 'Réglages', icon: <Settings className="w-5 h-5" />, perm: 'settings' },
  { id: 'team', label: 'Équipe & accès', short: 'Équipe', icon: <Users className="w-5 h-5" />, perm: 'manager' },
];

const TAB_HINTS: Record<Tab, string> = {
  overview: 'Ce qui se passe et ce qu\'il reste à faire',
  orders: 'Valide les paiements et envoie les liens d\'invitations',
  scanner: 'Vérifie les billets à l\'entrée',
  content: 'Modifie les textes et les images du site',
  settings: 'Ventes, sections du site, compte à rebours et sauvegardes',
  team: 'Comptes, liens de scan et historique',
};

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


// Détails d'une commande pour l'historique
const orderDetails = (o: Order, extra: string[] = []) => [
  `Client : ${o.customerName} (${o.customerPhone})`,
  `${o.quantity} billet${o.quantity > 1 ? 's' : ''} · ${o.totalAmount} $`,
  ...(o.payerPhone && o.payerPhone !== o.customerPhone ? [`Payé depuis : ${o.payerPhone}`] : []),
  ...extra,
];

const AdminDashboardInner: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrder,
  onAddOrder,
  onDeleteOrder,
  onImportOrders,
  onBackToHome,
  onOpenOrderTickets,
}) => {
  const { content } = useContent();
  const { authorize } = useAdminAuth();
  const { current, can, isManager, logout, log } = useTeam();
  useContentChangeLog();
  const [rawTab, setTab] = useState<Tab>('overview');
  const allowed = (perm?: AdminPermission | 'manager') => !perm || (perm === 'manager' ? isManager : can(perm));
  const nav = NAV.filter((n) => allowed(n.perm));
  const canValidate = can('validate');
  // Un onglet non autorisé (droits retirés entre-temps) renvoie à la vue d'ensemble
  const tab: Tab = nav.some((n) => n.id === rawTab) ? rawTab : 'overview';
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [validatingOrder, setValidatingOrder] = useState<Order | null>(null);
  const [smsReference, setSmsReference] = useState('');
  const [isValidationSuccess, setIsValidationSuccess] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

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
    setSmsReference('');
    setIsValidationSuccess(false);
  };

  const confirmValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatingOrder) return;
    const updated: Order = {
      ...validatingOrder,
      status: 'validated',
      paymentReference: smsReference.trim() || undefined,
      validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    onUpdateOrder(updated);
    log(`A validé le paiement de la commande ${updated.id}`, undefined, orderDetails(updated, [`Référence du paiement : ${updated.paymentReference ?? 'non renseignée'}`, 'Lien d\'invitations créé']));
    setValidatingOrder(updated);
    setIsValidationSuccess(true);
  };

  const confirmReject = () => {
    if (!rejectingOrder) return;
    onUpdateOrder({ ...rejectingOrder, status: 'rejected', notes: 'Refusé par le gestionnaire - Transfert non confirmé' });
    log(`A refusé la commande ${rejectingOrder.id}`, undefined, orderDetails(rejectingOrder, ['Statut : en attente → refusée']));
    notify(`Commande ${rejectingOrder.id} refusée`);
    setRejectingOrder(null);
  };

  const whatsAppUrl = (order: Order) => {
    const message = `Bonjour ${order.customerName},\n\nTon paiement est bien confirmé. Voici ton lien pour accéder à tes ${order.quantity > 1 ? `${order.quantity} invitations` : 'invitation'} avec QR code :\n\n${buildTicketLink(order)}\n\n_Ouvre ce lien depuis ton téléphone._\nPrésente le QR code à l'entrée le ${content.galaInfo.dateText}. À très bientôt !`;
    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const reminderUrl = (order: Order) => {
    const message = `Bonjour ${order.customerName},\n\nJe reviens vers toi pour ta commande ${order.id} (${order.quantity} × ${tierName(order.tierId)}, ${order.totalAmount} $). Dès que ton paiement est confirmé, je t'envoie ton lien d'invitations.`;
    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const restoreOrder = (order: Order) => {
    onUpdateOrder({ ...order, status: 'pending', notes: undefined });
    log(`A remis en attente la commande ${order.id}`, undefined, orderDetails(order, ['Statut : refusée → en attente']));
    notify(`Commande ${order.id} remise en attente`);
  };

  const confirmDelete = async () => {
    if (!deletingOrder) return;
    if (!(await authorize(`la commande ${deletingOrder.id}`))) return;
    onDeleteOrder(deletingOrder.id);
    log(`A supprimé la commande ${deletingOrder.id}`, undefined, orderDetails(deletingOrder, [`Statut au moment de la suppression : ${STATUS_STYLES[deletingOrder.status].label.toLowerCase()}`]));
    notify(`Commande ${deletingOrder.id} supprimée`);
    setDeletingOrder(null);
  };

  const lock = () => {
    logout();
    onBackToHome();
  };

  const copyLink = async (order: Order) => {
    if (await copyText(buildTicketLink(order))) {
      log(`A copié le lien d'invitations de ${order.customerName}`, undefined, [`Commande ${order.id}`]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } else {
      notify('Copie impossible : sélectionne le lien et copie-le à la main');
    }
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
    log('A exporté les commandes (CSV)', undefined, [`${orders.length} commande${orders.length > 1 ? 's' : ''}`]);
    notify('Commandes exportées');
  };

  const goTab = (id: Tab) => {
    setTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const GROUPS: { title: string; ids: Tab[] }[] = [
    { title: 'Billetterie', ids: ['overview', 'orders', 'scanner'] },
    { title: 'Site', ids: ['content', 'settings'] },
    { title: 'Administration', ids: ['team'] },
  ];

  const navButton = (item: (typeof NAV)[number]) => (
    <button
      key={item.id}
      onClick={() => goTab(item.id)}
      aria-current={tab === item.id ? 'page' : undefined}
      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
        tab === item.id ? 'bg-white/[0.07] text-stone-50 font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]'
      }`}
    >
      {tab === item.id && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#E6C78A]" />}
      <span className={tab === item.id ? 'text-[#E6C78A]' : ''}>{item.icon}</span>
      <span>{item.label}</span>
      {item.id === 'orders' && pending.length > 0 && (
        <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] text-[11px] font-bold flex items-center justify-center">
          {pending.length}
        </span>
      )}
    </button>
  );

  const userCard = current && (
    <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3">
      <Avatar name={current.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-stone-100 truncate">{current.name}</p>
        <p className="text-xs text-stone-500 truncate">{ROLE_LABELS[current.role]}</p>
      </div>
      <button onClick={lock} title="Se déconnecter" aria-label="Se déconnecter" className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-white/10 cursor-pointer">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );

  const current_ = nav.find((n) => n.id === tab);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr] text-stone-200 bg-[#16110F] relative z-[5]">
      {/* Menu latéral (ordinateur) */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-white/[0.06] bg-[#120E0C]">
        <div className="flex items-center gap-3 px-5 h-[72px]">
          <EmpireLogo size={38} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-100 leading-tight truncate">Console équipe</p>
            <p className="text-xs text-stone-500 truncate">{content.galaInfo.name}</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5" aria-label="Navigation de la console">
          {GROUPS.map((g) => {
            const items = nav.filter((n) => g.ids.includes(n.id));
            if (!items.length) return null;
            return (
              <div key={g.title}>
                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-600">{g.title}</p>
                <div className="space-y-0.5">{items.map(navButton)}</div>
              </div>
            );
          })}
        </nav>
        <div className="p-3 space-y-2">
          <button onClick={onBackToHome} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-400 hover:text-stone-200 hover:bg-white/[0.04] cursor-pointer">
            <ArrowLeft className="w-5 h-5" /> Retour au site
          </button>
          {userCard}
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#16110F]/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 sm:px-8 h-16 lg:h-[72px] max-w-6xl">
            <span className="lg:hidden"><EmpireLogo size={32} /></span>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-stone-50 truncate">{current_?.label}</h1>
              <p className="hidden sm:block text-xs text-stone-500 truncate">{current_ ? TAB_HINTS[current_.id] : ''}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onBackToHome}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 text-xs text-stone-300 hover:bg-white/[0.06] cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Voir le site
              </button>
              <div className="relative lg:hidden">
                <button onClick={() => setMenuOpen((v) => !v)} aria-label="Mon compte" aria-expanded={menuOpen} className="cursor-pointer">
                  {current && <Avatar name={current.name} size="sm" />}
                </button>
                {menuOpen && (
                  <>
                    <button aria-label="Fermer" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 cursor-default" />
                    <div className="absolute right-0 top-11 z-50 w-60 rounded-2xl border border-white/10 bg-[#1F1916] p-2 shadow-2xl">
                      <p className="px-3 pt-2 text-sm font-semibold text-stone-100">{current?.name}</p>
                      <p className="px-3 pb-2 text-xs text-stone-500">{current ? ROLE_LABELS[current.role] : ''}</p>
                      <button onClick={onBackToHome} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-300 hover:bg-white/[0.06] cursor-pointer">
                        <ArrowLeft className="w-4 h-4" /> Retour au site
                      </button>
                      <button onClick={lock} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-300 hover:bg-white/[0.06] cursor-pointer">
                        <LogOut className="w-4 h-4" /> Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Onglets en bas (téléphone) */}
        <nav
          aria-label="Navigation de la console"
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-[#16110F]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => goTab(item.id)}
                aria-current={tab === item.id ? 'page' : undefined}
                className={`relative flex-1 min-w-0 flex flex-col items-center gap-1 pt-2.5 pb-2 text-[10px] font-medium cursor-pointer ${
                  tab === item.id ? 'text-[#E6C78A]' : 'text-stone-500'
                }`}
              >
                {item.icon}
                <span className="truncate max-w-full px-0.5">{item.short}</span>
                {item.id === 'orders' && pending.length > 0 && (
                  <span className="absolute top-1.5 left-1/2 ml-2 min-w-4 h-4 px-1 rounded-full bg-[#E6C78A] text-[#2B1B0A] text-[10px] font-bold flex items-center justify-center">
                    {pending.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="p-4 sm:p-8 max-w-6xl"
        >
          {tab === 'overview' && (
            <OverviewPanel
              orders={orders}
              onAddOrder={() => setShowAdd(true)}
              onValidate={openValidate}
              onGo={(id, opts) => {
                if (opts?.pendingOnly) setStatusFilter('pending');
                goTab(id);
              }}
            />
          )}

          {/* ============ COMMANDES ============ */}
          {tab === 'orders' && (
            <div className="space-y-5">
              <div className={`${panel} p-4 flex flex-col lg:flex-row gap-4 lg:items-center`}>
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#E6C78A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    placeholder="Rechercher un nom, un code ou un numéro"
                    aria-label="Rechercher une commande"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-black/20 text-sm text-stone-100 placeholder-stone-500 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10"
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
                        statusFilter === id ? 'bg-white/[0.1] text-stone-50 font-semibold' : 'text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      {label} <span className="opacity-70">({count})</span>
                    </button>
                  ))}
                </div>

                <div className="lg:ml-auto flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E6C78A] text-[#2B1B0A] text-sm font-bold hover:bg-[#EFD6A2] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ajouter une commande
                  </button>
                  <button
                    onClick={exportCsv}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Exporter en CSV
                  </button>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                orders.length === 0 ? (
                  <div className={`${panel} p-10 text-center`}>
                    <p className="font-semibold tracking-tight text-xl text-stone-100 mb-2">Aucune commande pour le moment</p>
                    <p className="text-sm text-stone-300 max-w-md mx-auto mb-6">
                      Quand un client commande, son message arrive sur ton WhatsApp. Colle-le ici pour créer la commande, valide le paiement, puis envoie-lui son lien d'invitations.
                    </p>
                    <button
                      onClick={() => setShowAdd(true)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold cursor-pointer hover:bg-[#EFD6A2]"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une commande
                    </button>
                  </div>
                ) : (
                  <div className={`${panel} p-10 text-center text-stone-400`}>Aucune commande ne correspond à ta recherche.</div>
                )
              ) : (
                <ul className="space-y-3">
                  {filteredOrders.map((order) => (
                    <li key={order.id} className={`${panel} p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4`}>
                      <div className="min-w-0 flex-1 flex items-start gap-3.5">
                        <Avatar name={order.customerName} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                            <p className="text-stone-50 font-semibold">{order.customerName}</p>
                            <StatusBadge status={order.status} />
                            {order.payerPhone !== order.customerPhone && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300/90">Payé par un tiers</span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-stone-400">
                            {order.quantity} billet{order.quantity > 1 ? 's' : ''} · <strong className="text-stone-200 font-semibold">{order.totalAmount} $</strong> · {order.customerPhone}
                          </p>
                          <p className="mt-0.5 text-xs text-stone-500">
                            <button
                              onClick={() => onOpenOrderTickets(order.id)}
                              title="Voir les billets de cette commande"
                              className="font-mono hover:text-stone-300 hover:underline cursor-pointer"
                            >
                              {order.id}
                            </button>
                            {order.createdAt ? ` · ${order.createdAt}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        {order.status === 'pending' && (
                          <>
                            <a
                              href={reminderUrl(order)}
                              onClick={() => log(`A relancé ${order.customerName} sur WhatsApp`, undefined, [`Commande ${order.id} · ${order.totalAmount} $`])}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Relancer le client sur WhatsApp"
                              aria-label="Relancer le client sur WhatsApp"
                              className="inline-flex items-center gap-2 p-2.5 xl:px-3.5 rounded-lg border border-white/10 text-sm text-stone-200 hover:bg-white/[0.06]"
                            >
                              <BellRing className="w-4 h-4" />
                              <span className="hidden xl:inline">Relancer</span>
                            </a>
                            {canValidate && <>
                            <button
                              onClick={() => openValidate(order)}
                              className="px-4 py-2.5 rounded-lg bg-[#E6C78A] text-[#2B1B0A] text-sm font-bold hover:bg-[#EFD6A2] cursor-pointer"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => setRejectingOrder(order)}
                              className="px-4 py-2.5 rounded-lg border border-red-400/40 text-sm text-red-300 hover:bg-red-500/10 cursor-pointer"
                            >
                              Refuser
                            </button>
                            </>}
                          </>
                        )}
                        {order.status === 'rejected' && canValidate && (
                          <button
                            onClick={() => restoreOrder(order)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" /> Remettre en attente
                          </button>
                        )}
                        {order.status === 'validated' && (
                          <>
                            <button
                              onClick={() => {
                                setValidatingOrder(order);
                                setIsValidationSuccess(true);
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366]/15 text-[#4ade80] text-sm font-semibold hover:bg-[#25D366]/25 cursor-pointer"
                            >
                              <Link2 className="w-4 h-4" /> Lien client
                            </button>
                            <button
                              onClick={() => onOpenOrderTickets(order.id)}
                              className="px-4 py-2.5 rounded-lg border border-white/10 text-sm text-stone-100 hover:bg-white/10 cursor-pointer"
                            >
                              Aperçu
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setDeletingOrder(order)}
                          title="Supprimer la commande"
                          aria-label={`Supprimer la commande ${order.id}`}
                          className="p-2.5 rounded-lg text-stone-500 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'scanner' && <ScannerPanel orders={orders} onUpdateOrder={onUpdateOrder} />}

          {tab === 'content' && <ContentEditor onViewSite={onBackToHome} notify={notify} />}

          {tab === 'settings' && <SettingsPanel orders={orders} onImportOrders={onImportOrders} notify={notify} />}

          {tab === 'team' && isManager && <TeamPanel notify={notify} />}
        </motion.main>
      </div>

      {/* Fenêtre de validation + lien d'invitations */}
      {validatingOrder && (
        <Modal
          onClose={() => setValidatingOrder(null)}
          title={`Commande ${validatingOrder.id}`}
          kicker={isValidationSuccess ? "Lien d'invitations" : 'Confirmer le paiement'}
        >
          {!isValidationSuccess ? (
            <form onSubmit={confirmValidation} className="space-y-5">
              <dl className="rounded-xl bg-black/20 p-4 text-sm space-y-2">
                <Row k="Client" v={validatingOrder.customerName} />
                <Row k="Téléphone" v={validatingOrder.customerPhone} mono />
                <Row k="Billets" v={`${validatingOrder.quantity} × ${tierName(validatingOrder.tierId)}`} />
                <Row k="Montant à encaisser" v={`${validatingOrder.totalAmount} USD`} strong />
              </dl>
              <p className="text-sm text-stone-300 leading-relaxed">
                Valide seulement une fois le paiement reçu et confirmé avec le client. Un lien d'invitations sera alors généré.
              </p>
              <label className="block">
                <span className="block text-xs font-semibold text-[#E6C78A] mb-1.5">Référence du paiement (facultatif)</span>
                <input
                  value={smsReference}
                  onChange={(e) => setSmsReference(e.target.value)}
                  placeholder="Ex. code du SMS de confirmation"
                  className="w-full px-3.5 py-3 rounded-lg border border-white/10 bg-black/20 text-sm font-mono text-stone-100 focus:border-[#E6C78A]/60 focus:outline-none focus:ring-2 focus:ring-[#E6C78A]/10"
                />
              </label>
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#E6C78A] text-[#2B1B0A] font-bold text-sm hover:bg-[#EFD6A2] cursor-pointer"
              >
                Paiement reçu&nbsp;: générer le lien
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </span>
                <p className="text-sm text-stone-200">
                  Paiement validé pour <strong className="text-white">{validatingOrder.customerName}</strong>. Envoie-lui ce lien : en cliquant dessus, ses {validatingOrder.quantity > 1 ? `${validatingOrder.quantity} invitations` : 'invitation'} s'affichent.
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#E6C78A] mb-1.5">Lien du client</span>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={buildTicketLink(validatingOrder)}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="Lien d'invitations du client"
                    className="min-w-0 flex-1 px-3 py-2.5 rounded-lg border border-white/10 bg-black/20 text-xs font-mono text-stone-200 truncate"
                  />
                  <button
                    onClick={() => copyLink(validatingOrder)}
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 rounded-lg border border-white/10 text-sm text-white hover:bg-white/10 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copié' : 'Copier'}
                  </button>
                </div>
              </div>

              <a
                href={whatsAppUrl(validatingOrder)}
                onClick={() => log(`A envoyé le lien d'invitations de ${validatingOrder.customerName} sur WhatsApp`, undefined, [`Commande ${validatingOrder.id} · ${validatingOrder.quantity} billet${validatingOrder.quantity > 1 ? 's' : ''}`, `Numéro : ${validatingOrder.customerPhone}`])}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold text-sm hover:bg-[#20ba59]"
              >
                <WhatsAppIcon className="w-5 h-5" /> Envoyer le lien sur WhatsApp
              </a>
              <a
                href={buildTicketLink(validatingOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-white/10 text-sm text-stone-100 hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4" /> Voir comme le client
              </a>
            </div>
          )}
        </Modal>
      )}

      {showAdd && (
        <AddOrderModal
          tiers={content.tiers}
          existingIds={orders.map((o) => o.id)}
          onClose={() => setShowAdd(false)}
          onAdd={(order) => {
            onAddOrder(order);
            log(`A ajouté la commande ${order.id}`, undefined, orderDetails(order));
            setShowAdd(false);
            setStatusFilter('all');
            setTab('orders');
            notify(`Commande ${order.id} ajoutée`);
          }}
        />
      )}

      {/* Confirmation de refus */}
      {rejectingOrder && (
        <Modal onClose={() => setRejectingOrder(null)} title={`Refuser ${rejectingOrder.id} ?`} kicker="Confirmation">
          <p className="text-sm text-stone-200 leading-relaxed mb-6">
            La commande de <strong>{rejectingOrder.customerName}</strong> ({rejectingOrder.totalAmount} USD) sera marquée comme refusée : aucun billet ne sera activé.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setRejectingOrder(null)} className="flex-1 py-3 rounded-full border border-white/10 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
              Annuler
            </button>
            <button onClick={confirmReject} className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-400 cursor-pointer">
              Refuser la commande
            </button>
          </div>
        </Modal>
      )}

      {deletingOrder && (
        <Modal onClose={() => setDeletingOrder(null)} title={`Supprimer ${deletingOrder.id} ?`} kicker="Confirmation">
          <p className="text-sm text-stone-200 leading-relaxed mb-6">
            La commande de <strong>{deletingOrder.customerName}</strong> sera effacée définitivement
            {deletingOrder.status === 'validated' ? ' et les billets déjà envoyés ne seront plus reconnus à l\'entrée' : ''}. Pense à télécharger une sauvegarde avant.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeletingOrder(null)} className="flex-1 py-3 rounded-full border border-white/10 text-sm text-stone-100 hover:bg-white/10 cursor-pointer">
              Annuler
            </button>
            <button onClick={confirmDelete} className="flex-1 py-3 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-400 cursor-pointer">
              Supprimer
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-full bg-stone-100 text-stone-900 text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

const Row: React.FC<{ k: string; v: string; strong?: boolean; mono?: boolean }> = ({ k, v, strong, mono }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-stone-400">{k}</dt>
    <dd className={`text-right ${strong ? 'font-bold text-stone-100' : 'text-stone-100'} ${mono ? 'font-mono' : ''}`}>{v}</dd>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => (
  <AdminAuthProvider>
    <AdminDashboardInner {...props} />
  </AdminAuthProvider>
);
