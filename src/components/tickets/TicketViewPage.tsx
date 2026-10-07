import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Info,
  MessageCircle,
  Search,
  Share2,
} from 'lucide-react';
import { IssuedTicket, Order, OrderStatus } from '../../types';
import { useContent } from '../../content/ContentContext';
import { QRCodeSvg } from './QRCodeSvg';

interface TicketViewPageProps {
  /** Commande à afficher ; null = formulaire de recherche « Retrouver mon billet » */
  order: Order | null;
  orders: Order[];
  onBackToHome: () => void;
  onFindOrder: (orderId: string) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}

const isDemo = () => new URLSearchParams(window.location.search).has('demo');
const digits = (v: string) => v.replace(/[^0-9]/g, '');

export const TicketViewPage: React.FC<TicketViewPageProps> = ({
  order,
  orders,
  onBackToHome,
  onFindOrder,
  onUpdateOrderStatus,
}) => {
  if (!order) {
    return <LookupForm orders={orders} onBackToHome={onBackToHome} onFindOrder={onFindOrder} />;
  }
  return <ReservationDetails order={order} onBackToHome={onBackToHome} onUpdateOrderStatus={onUpdateOrderStatus} />;
};

/* ---------- Retrouver mon billet ---------- */
const LookupForm: React.FC<{
  orders: Order[];
  onBackToHome: () => void;
  onFindOrder: (id: string) => void;
}> = ({ orders, onBackToHome, onFindOrder }) => {
  const { content } = useContent();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === code.trim().toLowerCase() &&
        (digits(o.customerPhone) === digits(phone) || digits(o.payerPhone) === digits(phone))
    );
    if (!found) {
      setError('Aucune commande ne correspond. Vérifie ton code et ton numéro, ou contacte-nous sur WhatsApp.');
      return;
    }
    setError('');
    onFindOrder(found.id);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-sm text-[#FFD9A0] hover:text-white mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </button>
        <div className="rounded-3xl bg-[#FBF8F2] text-[#2A1014] p-6 sm:p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#F2761B]/15 text-[#D8590B] flex items-center justify-center mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-1">Retrouver mon billet</h1>
          <p className="text-sm text-[#6B4A4F] mb-6">Entre ton code de commande et le numéro utilisé pour réserver.</p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="block text-xs font-semibold text-[#6B4A4F] mb-1.5">Code de commande</span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="GALA-0001"
                className="w-full px-4 py-3 rounded-xl border border-[#E7DCCB] bg-white font-mono focus:border-[#D8590B] focus:outline-none focus:ring-2 focus:ring-[#F2761B]/20"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-[#6B4A4F] mb-1.5">Numéro de téléphone</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                placeholder="+243 …"
                className="w-full px-4 py-3 rounded-xl border border-[#E7DCCB] bg-white focus:border-[#D8590B] focus:outline-none focus:ring-2 focus:ring-[#F2761B]/20"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button type="submit" className="w-full py-3.5 rounded-full bg-[#2A1014] text-white font-bold hover:bg-black cursor-pointer">
              Voir mon billet
            </button>
          </form>

          <a
            href={`https://wa.me/${digits(content.galaInfo.whatsappNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-[#2A1014] underline underline-offset-4"
          >
            <MessageCircle className="w-4 h-4" /> Un souci ? Écris-nous sur WhatsApp
          </a>
          {isDemo() && (
            <p className="mt-4 text-xs text-[#8B6B70]">Démo : essaie GALA-0001 avec le numéro +243 81 000 0001.</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- Détails de la réservation ---------- */
const ReservationDetails: React.FC<{
  order: Order;
  onBackToHome: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}> = ({ order, onBackToHome, onUpdateOrderStatus }) => {
  const { content } = useContent();
  const info = content.galaInfo;
  const [index, setIndex] = useState(0);
  const [shared, setShared] = useState(false);

  const status = order.status;
  const whatsappUrl = `https://wa.me/${digits(info.whatsappNumber)}?text=${encodeURIComponent(
    `Bonjour, je consulte ma réservation ${order.id}. Peux-tu vérifier l'état de ma commande ?`
  )}`;

  const ticket: IssuedTicket | undefined = order.tickets[index];
  const place = [info.venueName, info.city].filter(Boolean).join(', ');

  const share = async () => {
    const text = `Mon billet pour ${info.name} — ${info.dateText}. Commande ${order.id}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: info.name, text });
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      }
    } catch {
      // partage annulé
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 print:pt-4">
      <div className="max-w-md mx-auto">
        {/* Barre du haut */}
        <div className="flex items-center gap-3 mb-5 print:hidden">
          <button
            onClick={onBackToHome}
            aria-label="Retour au site"
            className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-serif text-2xl text-white">Détails de la réservation</h1>
        </div>

        {isDemo() && (
          <div className="mb-4 flex items-center gap-2 p-1.5 rounded-full bg-black/40 text-xs print:hidden">
            <span className="px-2 text-[#FFD9A0]">Démo :</span>
            {(['pending', 'validated', 'rejected'] as OrderStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => onUpdateOrderStatus?.(order.id, s)}
                className={`px-3 py-1 rounded-full cursor-pointer ${status === s ? 'bg-[#FFB43A] text-[#3D0A04] font-bold' : 'text-white/80 hover:text-white'}`}
              >
                {s === 'pending' ? 'En attente' : s === 'validated' ? 'Validé' : 'Refusé'}
              </button>
            ))}
          </div>
        )}

        {/* ===== En attente ===== */}
        {status === 'pending' && (
          <div className="rounded-3xl bg-[#FBF8F2] text-[#2A1014] p-6 sm:p-8 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
              Paiement en cours de vérification
            </span>
            <h2 className="font-serif text-2xl font-semibold mb-2">Ton billet arrive bientôt</h2>
            <p className="text-sm text-[#6B4A4F] leading-relaxed mb-5">
              Notre équipe vérifie ton paiement Mobile Money. Dès qu'il est validé, ton QR code apparaît sur cette page et tu reçois ton billet sur WhatsApp.
            </p>
            <dl className="rounded-2xl bg-white border border-[#EFE5D6] p-4 text-sm text-left space-y-2 mb-5">
              <Row k="Commande" v={order.id} mono />
              <Row k="Billets" v={`${order.quantity} × ${content.tiers.find((t) => t.id === order.tierId)?.name ?? order.tierId}`} />
              <Row k="Montant" v={`${order.totalAmount} USD`} strong />
            </dl>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold hover:bg-[#20ba59]"
            >
              <MessageCircle className="w-5 h-5" /> Contacter l'équipe
            </a>
          </div>
        )}

        {/* ===== Refusé ===== */}
        {status === 'rejected' && (
          <div className="rounded-3xl bg-[#FBF8F2] text-[#2A1014] p-6 sm:p-8 shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h2 className="font-serif text-2xl font-semibold mb-2">Réservation non validée</h2>
            <p className="text-sm text-[#6B4A4F] leading-relaxed mb-5">
              {order.notes || "Nous n'avons pas pu retrouver ton paiement Mobile Money."}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold hover:bg-[#20ba59]"
            >
              <MessageCircle className="w-5 h-5" /> Régulariser sur WhatsApp
            </a>
          </div>
        )}

        {/* ===== Validé : détails + QR code ===== */}
        {status === 'validated' && ticket && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-emerald-200 print:hidden">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>Paiement confirmé{order.paymentReference ? ` • Réf. ${order.paymentReference}` : ''}</span>
            </div>

            {/* Choix du billet quand la commande en contient plusieurs */}
            {order.tickets.length > 1 && (
              <div className="flex flex-wrap gap-2 print:hidden" role="tablist" aria-label="Billets de la commande">
                {order.tickets.map((t, i) => (
                  <button
                    key={t.ticketNumber}
                    role="tab"
                    aria-selected={i === index}
                    onClick={() => setIndex(i)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                      i === index ? 'bg-[#FFB43A] text-[#3D0A04]' : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                  >
                    Billet {i + 1}/{order.tickets.length}
                  </button>
                ))}
              </div>
            )}

            {/* Carte événement */}
            <div className="rounded-2xl bg-[#FBF8F2] text-[#2A1014] p-4 flex items-start justify-between gap-3 shadow-xl">
              <div className="min-w-0">
                <h2 className="font-semibold text-base leading-snug">{info.name}</h2>
                <p className="text-xs text-[#8B6B70] mt-0.5">{info.dateText}</p>
              </div>
              <button
                onClick={share}
                aria-label="Partager"
                className="p-2 rounded-full text-[#D8590B] hover:bg-[#F2761B]/10 cursor-pointer shrink-0 print:hidden"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {shared && <p role="status" className="text-xs text-[#FFD9A0] text-center">Texte copié, tu peux le coller où tu veux.</p>}

            {/* Détails */}
            <div className="rounded-2xl bg-[#FBF8F2] text-[#2A1014] shadow-xl overflow-hidden">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 p-4">
                <Cell k="Titulaire" v={ticket.attendeeName} />
                <Cell k="Billet" v={ticket.tierName} />
                <Cell k="N° du billet" v={ticket.ticketNumber} mono />
                <Cell k="Commande" v={order.id} mono />
                <Cell k="Date" v={info.dateText} />
                <Cell k="Horaires" v={info.timeText || '—'} />
                <div className="col-span-2">
                  <Cell k="Lieu" v={place || '—'} />
                </div>
              </dl>
              <div className="border-t border-dashed border-[#E7DCCB] px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-[#6B4A4F]">Total de la commande</span>
                <span className="font-bold text-[#D8590B] tabular-nums">{order.totalAmount.toFixed(2)} USD</span>
              </div>
            </div>

            {/* QR code */}
            <div className="rounded-2xl bg-white text-[#2A1014] p-5 shadow-xl text-center">
              <div className="relative inline-block">
                <QRCodeSvg value={ticket.qrPayload} size={220} dimmed={ticket.scanned} />
                {ticket.scanned && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-[#2A1014] text-white text-sm font-bold">Déjà utilisé</span>
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs text-[#8B6B70]">
                Code de sécurité : <span className="font-mono font-semibold text-[#2A1014]">{ticket.securityCode}</span>
              </p>
            </div>

            <p className="flex gap-2 text-xs text-white/90 leading-relaxed px-1">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#FFD9A0]" />
              <span>
                <strong className="text-[#FFD9A0]">À savoir :</strong> présente simplement ce QR code à l'entrée. Un seul passage par billet.
              </span>
            </p>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2 print:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 rounded-xl border-2 border-white/70 text-white text-center font-semibold hover:bg-white/10 inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Aide
              </a>
              <button
                onClick={() => window.print()}
                className="py-3.5 rounded-xl bg-[#2A1014] text-white font-semibold hover:bg-black inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" /> Télécharger
              </button>
            </div>
          </div>
        )}

        {status === 'validated' && !ticket && (
          <p className="text-white text-center">Aucun billet n'est rattaché à cette commande pour le moment.</p>
        )}
      </div>
    </div>
  );
};

const Cell: React.FC<{ k: string; v: string; mono?: boolean }> = ({ k, v, mono }) => (
  <div className="min-w-0">
    <dt className="text-xs text-[#9C8286]">{k}</dt>
    <dd className={`text-sm font-medium break-words ${mono ? 'font-mono' : ''}`}>{v}</dd>
  </div>
);

const Row: React.FC<{ k: string; v: string; mono?: boolean; strong?: boolean }> = ({ k, v, mono, strong }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-[#8B6B70]">{k}</dt>
    <dd className={`text-right ${mono ? 'font-mono' : ''} ${strong ? 'font-bold text-[#D8590B]' : ''}`}>{v}</dd>
  </div>
);
