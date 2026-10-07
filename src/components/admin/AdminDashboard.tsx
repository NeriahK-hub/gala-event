import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { GALA_INFO } from '../../data/mockData';
import {
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Scan,
  Camera,
  LogOut,
  Send,
  MessageCircle,
  DollarSign,
  Ticket,
  Users,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onBackToHome: () => void;
  onOpenOrderTickets: (orderId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrder,
  onBackToHome,
  onOpenOrderTickets,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Logged in for easy demo access
  const [loginEmail, setLoginEmail] = useState<string>('admin@gala-royal.cd');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••');

  // Navigation tab inside admin: 'dashboard' | 'scanner'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner'>('dashboard');

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Validation Modal state
  const [validatingOrder, setValidatingOrder] = useState<Order | null>(null);
  const [smsReference, setSmsReference] = useState<string>('');
  const [isValidationSuccess, setIsValidationSuccess] = useState<boolean>(false);

  // Scanner Simulator state
  const [scanResult, setScanResult] = useState<'valid' | 'already_used' | 'unknown' | null>(null);

  // Calculate KPIs
  const totalSoldTickets = orders
    .filter((o) => o.status === 'validated')
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalPendingOrders = orders.filter((o) => o.status === 'pending').length;

  const totalRevenue = orders
    .filter((o) => o.status === 'validated')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const scannedTicketsCount = orders
    .flatMap((o) => o.tickets)
    .filter((t) => t.scanned).length;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      statusFilter === 'all' ? true : order.status === statusFilter;
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payerPhone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Handle Validation
  const handleOpenValidateModal = (order: Order) => {
    setValidatingOrder(order);
    setSmsReference(`MPESA-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setIsValidationSuccess(false);
  };

  const handleConfirmValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatingOrder) return;

    const updated: Order = {
      ...validatingOrder,
      status: 'validated',
      paymentReference: smsReference,
      validatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tickets: validatingOrder.tickets.map((t) => ({
        ...t,
        qrPayload: `${t.qrPayload}|REF-${smsReference}`,
      })),
    };

    onUpdateOrder(updated);
    setValidatingOrder(updated);
    setIsValidationSuccess(true);
  };

  const handleRejectOrder = (order: Order) => {
    if (confirm(`Confirmer le refus de la commande ${order.id} (${order.customerName}) ?`)) {
      const updated: Order = {
        ...order,
        status: 'rejected',
        notes: 'Refusé par le gestionnaire - Transfert non confirmé',
      };
      onUpdateOrder(updated);
    }
  };

  const getWhatsAppValidationUrl = (order: Order) => {
    const message = `Bonjour ${order.customerName},\n\nExcellente nouvelle ! Ta réservation pour Le Grand Gala Royal de Kinshasa est désormais *VALIDÉE* :\n- Commande : *${order.id}*\n- Formule : *${order.quantity}x ${order.tierId.toUpperCase()}*\n- Réf. SMS : *${order.paymentReference || 'CONFIRMÉ'}*\n\nTu peux dès à présent consulter et télécharger tes invitations avec QR code personnel sur le portail officiel.\n\nNous avons hâte de t'accueillir le 19 Décembre au Pullman Kinshasa !`;

    return `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  // ================= 18. PAGE DE CONNEXION =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-2xl border border-[#D4A857]/30 bg-[#150608] shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center">
          <div className="w-12 h-12 rounded-full border border-[#D4A857] bg-[#1F0B10] flex items-center justify-center text-[#D4A857] mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl text-[#F9F5EC] font-semibold mb-1">
            Espace Équipe & Contrôle
          </h2>
          <p className="text-xs text-stone-300 mb-6">
            Accès sécurisé réservé aux organisateurs du Grand Gala Royal.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAuthenticated(true);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="text-xs uppercase tracking-wider text-[#E8C98A] block mb-1">
                Adresse Courriel
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D4A857]/30 bg-[#120507] text-[#F9F5EC] text-sm focus:border-[#D4A857] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#E8C98A] block mb-1">
                Mot de Passe
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#D4A857]/30 bg-[#120507] text-[#F9F5EC] text-sm focus:border-[#D4A857] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#150608] font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer mt-4"
            >
              Connexion Organisateur
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#D4A857]/20 flex justify-between items-center text-xs">
            <button
              onClick={onBackToHome}
              className="text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              Retour au site
            </button>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="text-[#D4A857] font-semibold hover:underline cursor-pointer"
            >
              Démo : Entrer directement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header of the Team Dashboard */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D4A857]/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-[#D4A857]/20 text-[#D4A857]">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F9F5EC]">
              Console d'Administration & Billetterie
            </h1>
          </div>
          <p className="text-xs text-stone-300 mt-1">
            Supervision des commandes Mobile Money et contrôle d'accès au Pullman Kinshasa
          </p>
        </div>

        {/* Action Tabs & Logout */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#120507] border border-[#D4A857]/30">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#D4A857] text-[#150608]'
                  : 'text-[#E8C98A] hover:text-white'
              }`}
            >
              Commandes
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-[#D4A857] text-[#150608]'
                  : 'text-[#E8C98A] hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scanner Entrée</span>
            </button>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            title="Se déconnecter"
            className="p-2 rounded-lg border border-[#D4A857]/30 text-stone-300 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= 19. TABLEAU DE BORD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Billets vendus */}
            <div className="p-5 rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E1218]/40 to-[#150608] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold block">
                  Billets Vendus
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-gold-bright tabular-nums">
                  {totalSoldTickets}
                </span>
                <span className="text-xs text-stone-400 block mt-0.5">sur 450 places</span>
              </div>
              <div className="p-3 rounded-full bg-[#D4A857]/10 text-[#D4A857]">
                <Ticket className="w-5 h-5" />
              </div>
            </div>

            {/* 2. En attente */}
            <div className="p-5 rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E1218]/40 to-[#150608] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold block">
                  En Attente
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-gold-bright tabular-nums">
                  {totalPendingOrders}
                </span>
                <span className="text-xs text-amber-300/80 block mt-0.5">À vérifier Mobile Money</span>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* 3. Montant encaissé */}
            <div className="p-5 rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E1218]/40 to-[#150608] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold block">
                  Montant Encaissé
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-gold-bright tabular-nums">
                  {totalRevenue} <span className="text-sm font-semibold uppercase text-[#E8C98A]">USD</span>
                </span>
                <span className="text-xs text-stone-400 block mt-0.5">Transactions validées</span>
              </div>
              <div className="p-3 rounded-full bg-[#D4A857]/10 text-[#D4A857]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            {/* 4. Entrées scannées */}
            <div className="p-5 rounded-xl border border-[#D4A857]/25 bg-gradient-to-b from-[#2E1218]/40 to-[#150608] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold block">
                  Entrées Scannées
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-gold-bright tabular-nums">
                  {scannedTicketsCount}
                </span>
                <span className="text-xs text-emerald-400 block mt-0.5">Convives en salle</span>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                <Scan className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Controls: Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-[#D4A857]/20 bg-[#150608]/60">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#D4A857] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, code ou tél..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#D4A857]/30 bg-[#120507] text-xs text-[#F9F5EC] placeholder-stone-400 focus:border-[#D4A857] focus:outline-none"
              />
            </div>

            {/* Status Filter Tabs (En attente, Validées, Refusées, Toutes) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-[#D4A857] text-[#150608] font-bold'
                    : 'text-stone-300 hover:bg-[#D4A857]/10'
                }`}
              >
                Toutes ({orders.length})
              </button>

              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-stone-300 hover:bg-amber-500/10'
                }`}
              >
                En attente ({orders.filter((o) => o.status === 'pending').length})
              </button>

              <button
                onClick={() => setStatusFilter('validated')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === 'validated'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-stone-300 hover:bg-emerald-600/10'
                }`}
              >
                Validées ({orders.filter((o) => o.status === 'validated').length})
              </button>

              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-stone-300 hover:bg-red-600/10'
                }`}
              >
                Refusées ({orders.filter((o) => o.status === 'rejected').length})
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-xl border border-[#D4A857]/20 bg-[#150608]/80 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#120507] text-[#E8C98A] uppercase tracking-wider font-semibold border-b border-[#D4A857]/20">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Nom du Convive</th>
                    <th className="p-4">Formule & Qté</th>
                    <th className="p-4">Montant Attendu</th>
                    <th className="p-4">Numéro Payeur</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A857]/10 text-stone-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        Aucune commande trouvée selon ces critères.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#D4A857]/5 transition-colors">
                        {/* Code */}
                        <td className="p-4 font-mono font-bold text-[#E8C98A]">
                          <button
                            onClick={() => onOpenOrderTickets(order.id)}
                            className="hover:underline text-left cursor-pointer"
                            title="Voir les billets de cette commande"
                          >
                            {order.id}
                          </button>
                        </td>

                        {/* Customer */}
                        <td className="p-4">
                          <div className="font-semibold text-white">{order.customerName}</div>
                          <div className="text-xs text-stone-400">{order.customerPhone}</div>
                        </td>

                        {/* Type & Quantity */}
                        <td className="p-4">
                          <span className="font-medium uppercase text-stone-200">
                            {order.quantity}x {order.tierId}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-mono font-semibold text-[#F3E5AB]">
                          {order.totalAmount} USD
                        </td>

                        {/* Payer Phone */}
                        <td className="p-4 font-mono text-stone-300">
                          {order.payerPhone}
                          {order.payerPhone !== order.customerPhone && (
                            <span className="ml-1.5 text-xs uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              Tiers
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {order.status === 'validated' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs uppercase font-semibold">
                              <CheckCircle className="w-3 h-3" />
                              <span>Validé</span>
                            </span>
                          )}
                          {order.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-xs uppercase font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>En attente</span>
                            </span>
                          )}
                          {order.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500/50 text-red-300 text-xs uppercase font-semibold">
                              <XCircle className="w-3 h-3" />
                              <span>Refusé</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {order.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleOpenValidateModal(order)}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#150608] font-bold text-xs uppercase hover:brightness-110 transition-all cursor-pointer"
                                >
                                  Valider
                                </button>
                                <button
                                  onClick={() => handleRejectOrder(order)}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs transition-colors cursor-pointer"
                                >
                                  Refuser
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => onOpenOrderTickets(order.id)}
                                className="px-3 py-1 rounded-lg border border-[#D4A857]/40 text-[#E8C98A] hover:bg-[#D4A857]/10 text-xs transition-colors cursor-pointer"
                              >
                                Voir billets
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= 20. SCANNER D'ENTRÉE ================= */}
      {activeTab === 'scanner' && (
        <div className="space-y-8 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4A857] font-semibold block mb-1">
              Contrôle des Accès en Temps Réel
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F9F5EC] font-semibold">
              Scanner de Contrôle d'Entrée
            </h2>
            <p className="text-xs text-stone-300 mt-1">
              Positionne le QR Code du billet face à la caméra pour validation automatique.
            </p>
          </div>

          {/* Camera Viewfinder Mock */}
          <div className="relative aspect-square max-w-[340px] sm:max-w-[380px] mx-auto rounded-3xl border-2 border-[#D4A857] bg-black/90 overflow-hidden shadow-[0_0_40px_rgba(212,168,87,0.3)] flex items-center justify-center">
            {/* Camera Simulated Background Grid */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(212, 168, 87, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 168, 87, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* 4 Golden Target Reticle Corners */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-[#D4A857] rounded-tl-lg pointer-events-none" />
            <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-[#D4A857] rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-[#D4A857] rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-[#D4A857] rounded-br-lg pointer-events-none" />

            {/* Animated Laser Scanning Line */}
            <div className="absolute left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D4A857] to-transparent shadow-[0_0_15px_#D4A857] animate-bounce" />

            {/* Camera center lens prompt */}
            <div className="flex flex-col items-center pointer-events-none z-10 text-stone-400">
              <Camera className="w-12 h-12 text-[#D4A857]/90 mb-2" />
              <span className="text-xs uppercase tracking-widest text-[#E8C98A]/80">
                Caméra Active
              </span>
              <span className="text-xs text-stone-500">Viseur Prêt</span>
            </div>
          </div>

          {/* Test Buttons to Trigger the 3 Required Results */}
          <div className="p-6 rounded-2xl border border-[#D4A857]/30 bg-[#150608]/80 space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold block">
              Tester les 3 Réponses du Contrôle d'Accès :
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Résultat 1: Vert « Billet valide » */}
              <button
                onClick={() => setScanResult('valid')}
                className="py-3 px-4 rounded-xl bg-emerald-900/60 border border-emerald-500 text-emerald-200 font-semibold text-xs uppercase hover:bg-emerald-800 transition-colors cursor-pointer shadow-md"
              >
                1. Billet Valide (Vert)
              </button>

              {/* Résultat 2: Rouge « Billet déjà utilisé » */}
              <button
                onClick={() => setScanResult('already_used')}
                className="py-3 px-4 rounded-xl bg-red-900/60 border border-red-500 text-red-200 font-semibold text-xs uppercase hover:bg-red-800 transition-colors cursor-pointer shadow-md"
              >
                2. Déjà Utilisé (Rouge)
              </button>

              {/* Résultat 3: Rouge sombre « Billet inconnu » */}
              <button
                onClick={() => setScanResult('unknown')}
                className="py-3 px-4 rounded-xl bg-neutral-900/80 border border-rose-600 text-rose-300 font-semibold text-xs uppercase hover:bg-neutral-800 transition-colors cursor-pointer shadow-md"
              >
                3. Billet Inconnu (Rouge)
              </button>
            </div>
          </div>

          {/* ================= PLEIN ÉCRAN SCAN RESULTS ================= */}
          {scanResult && (
            <div
              onClick={() => setScanResult(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200"
              style={{
                backgroundColor:
                  scanResult === 'valid'
                    ? 'rgba(6, 78, 59, 0.95)'
                    : scanResult === 'already_used'
                    ? 'rgba(127, 29, 29, 0.96)'
                    : 'rgba(76, 5, 25, 0.96)',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-lg w-full p-8 rounded-3xl border-2 shadow-2xl text-center space-y-6 text-white"
                style={{
                  borderColor:
                    scanResult === 'valid'
                      ? '#10B981'
                      : scanResult === 'already_used'
                      ? '#EF4444'
                      : '#F43F5E',
                }}
              >
                {/* Close modal */}
                <button
                  onClick={() => setScanResult(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* 1. VERT: BILLET VALIDE */}
                {scanResult === 'valid' && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-lg animate-bounce">
                      <CheckCircle className="w-12 h-12 stroke-[2.5]" />
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold opacity-80 block">
                        Accès Autorisé
                      </span>
                      <h3 className="font-serif text-4xl font-bold mt-1">
                        Billet Valide
                      </h3>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/40 text-left space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="opacity-75">Convive :</span>
                        <span className="font-bold text-base">Princesse Kalubi Banza</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Formule :</span>
                        <span className="font-bold text-amber-300">Billet VIP Privilège</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Numéro :</span>
                        <span className="font-mono">TKT-0147-01</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Heure du scan :</span>
                        <span className="font-mono">19:48:12 (Porte d'Honneur)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setScanResult(null)}
                      className="w-full py-3.5 rounded-full bg-white text-emerald-950 font-bold text-xs uppercase tracking-widest hover:bg-emerald-100 cursor-pointer shadow-lg"
                    >
                      Scanner le convive suivant
                    </button>
                  </div>
                )}

                {/* 2. ROUGE: BILLET DÉJÀ UTILISÉ */}
                {scanResult === 'already_used' && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                      <AlertTriangle className="w-12 h-12 stroke-[2.5]" />
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold opacity-80 block">
                        Attention Fraude / Doublon
                      </span>
                      <h3 className="font-serif text-4xl font-bold mt-1">
                        Billet Déjà Utilisé
                      </h3>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-red-500/40 text-left space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="opacity-75">Convive :</span>
                        <span className="font-bold text-base">Invité de Princesse Kalubi</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Numéro Billet :</span>
                        <span className="font-mono">TKT-0147-02</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Premier scan :</span>
                        <span className="font-mono font-bold text-red-300">19:42:10 (Porte Nord 1)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-75">Agent :</span>
                        <span className="font-mono">Contrôleur Porte Nord 1</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setScanResult(null)}
                      className="w-full py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg"
                    >
                      Fermer l'alerte
                    </button>
                  </div>
                )}

                {/* 3. ROUGE SOMBRE: BILLET INCONNU */}
                {scanResult === 'unknown' && (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-rose-700 text-white flex items-center justify-center mx-auto shadow-lg">
                      <XCircle className="w-12 h-12 stroke-[2.5]" />
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold opacity-80 block">
                        Entrée Refusée
                      </span>
                      <h3 className="font-serif text-4xl font-bold mt-1">
                        Billet Inconnu
                      </h3>
                    </div>

                    <p className="text-xs text-rose-100/90 leading-relaxed max-w-sm mx-auto">
                      Ce code QR ne correspond à aucune commande enregistrée dans la base officielle du gala. Merci de diriger le convive vers la conciergerie.
                    </p>

                    <button
                      onClick={() => setScanResult(null)}
                      className="w-full py-3.5 rounded-full bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg"
                    >
                      Retour au scanner
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= MODALE VALIDATION (SMS & WHATSAPP) ================= */}
      {validatingOrder && (
        <div
          onClick={() => setValidatingOrder(null)}
          className="fixed inset-0 z-50 bg-[#0F0405]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full p-7 rounded-2xl border-2 border-[#D4A857] bg-[#120507] shadow-[0_0_50px_rgba(212,168,87,0.3)] text-left space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#D4A857]/20 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold">
                  Validation de Transaction
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Commande {validatingOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setValidatingOrder(null)}
                className="p-1 rounded-full text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isValidationSuccess ? (
              <form onSubmit={handleConfirmValidation} className="space-y-4">
                <div className="p-3 rounded-lg bg-[#150608] border border-[#D4A857]/20 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Titulaire :</span>
                    <span className="font-semibold text-white">{validatingOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Montant :</span>
                    <span className="font-bold text-[#E8C98A]">{validatingOrder.totalAmount} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Numéro Payeur :</span>
                    <span className="font-mono text-stone-200">{validatingOrder.payerPhone}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block mb-1">
                    Référence du SMS de Paiement (Mobile Money) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: MPESA-88492021"
                    value={smsReference}
                    onChange={(e) => setSmsReference(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-[#D4A857]/40 bg-[#0F0405] text-sm text-[#F9F5EC] focus:border-[#D4A857] focus:outline-none"
                  />
                  <span className="text-xs text-stone-400 mt-1 block">
                    Code d'autorisation figurant sur le SMS reçu par Le Cercle.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4A857] to-[#B88934] text-[#150608] font-bold text-xs uppercase tracking-widest hover:brightness-110 cursor-pointer shadow-lg"
                >
                  Confirmer la Validation
                </button>
              </form>
            ) : (
              <div className="space-y-5 text-center animate-in zoom-in-95">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    Paiement Validé avec Succès !
                  </h4>
                  <p className="text-xs text-stone-300 mt-1">
                    Les billets et QR Codes sont générés pour <strong>{validatingOrder.customerName}</strong>.
                  </p>
                </div>

                {/* Gros Bouton Envoyer le billet sur WhatsApp */}
                <a
                  href={getWhatsAppValidationUrl(validatingOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#20ba59] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer le billet sur WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setValidatingOrder(null);
                    onOpenOrderTickets(validatingOrder.id);
                  }}
                  className="w-full py-2.5 rounded-full border border-[#D4A857]/50 text-[#E8C98A] hover:bg-[#D4A857]/10 text-xs uppercase tracking-wider cursor-pointer"
                >
                  Voir les billets émis
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
