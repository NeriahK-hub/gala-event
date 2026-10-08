import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Info,
  Ticket,
  Share2,
} from 'lucide-react';
import { IssuedTicket, Order, OrderStatus } from '../../types';
import { useContent } from '../../content/ContentContext';
import { QRCodeSvg } from './QRCodeSvg';
import { Reveal } from '../common/Reveal';
import { renderInvitation, saveInvitations } from '../../lib/invitationImage';
import { buildTicketLink } from '../../lib/ticketLink';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface TicketViewPageProps {
  /** Commande à afficher ; null = liste « Mes billets » */
  order: Order | null;
  savedOrders: Order[];
  linkError: boolean;
  onBackToHome: () => void;
  onOpenOrder: (order: Order) => void;
  onShowList: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}

const isDemo = () => new URLSearchParams(window.location.search).has('demo');
const digits = (v: string) => v.replace(/[^0-9]/g, '');

export const TicketViewPage: React.FC<TicketViewPageProps> = ({
  order,
  savedOrders,
  linkError,
  onBackToHome,
  onOpenOrder,
  onShowList,
  onUpdateOrderStatus,
}) => {
  if (!order) {
    return <MyTickets savedOrders={savedOrders} linkError={linkError} onBackToHome={onBackToHome} onOpenOrder={onOpenOrder} />;
  }
  return (
    <ReservationDetails order={order} onBack={savedOrders.length > 1 ? onShowList : onBackToHome} onUpdateOrderStatus={onUpdateOrderStatus} />
  );
};

/* ---------- Mes billets ---------- */
const MyTickets: React.FC<{
  savedOrders: Order[];
  linkError: boolean;
  onBackToHome: () => void;
  onOpenOrder: (o: Order) => void;
}> = ({ savedOrders, linkError, onBackToHome, onOpenOrder }) => {
  const { content } = useContent();

  return (
    <div className="min-h-screen pt-28 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-sm text-[#FFD9A0] hover:text-white mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour au site
        </button>

        <h1 className="font-sans font-bold tracking-tight text-white text-4xl mb-2">Mes billets</h1>

        {linkError && (
          <div role="alert" className="mb-4 flex gap-3 rounded-2xl bg-white text-[#2A1014] p-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm">
              Ce lien est incomplet ou invalide. Demande à l'équipe de te renvoyer ton lien d'invitations sur WhatsApp.
            </p>
          </div>
        )}

        {savedOrders.length === 0 ? (
          <div className="rounded-3xl bg-[#FBF8F2] text-[#2A1014] p-6 sm:p-8 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#F2761B]/15 text-[#D8590B] flex items-center justify-center mb-4">
              <Ticket className="w-6 h-6" />
            </div>
            <h2 className="font-sans text-2xl font-bold tracking-tight mb-2">Tes invitations arrivent par lien</h2>
            <p className="text-sm text-[#6B4A4F] leading-relaxed mb-5">
              Une fois ton paiement confirmé, l'équipe t'envoie un lien sur WhatsApp. Ouvre-le&nbsp;: tes invitations avec QR code s'affichent ici, prêtes à être présentées à l'entrée.
            </p>
            <a
              href={`https://wa.me/${digits(content.galaInfo.whatsappNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#25D366] text-[#052e16] font-bold hover:bg-[#20ba59]"
            >
              <WhatsAppIcon className="w-5 h-5" /> Écrire à l'équipe
            </a>
          </div>
        ) : (
          <ul className="space-y-3">
            {savedOrders.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => onOpenOrder(o)}
                  className="w-full text-left rounded-2xl bg-[#FBF8F2] text-[#2A1014] p-4 shadow-xl flex items-center gap-4 hover:ring-2 hover:ring-[#FFB43A] transition cursor-pointer"
                >
                  <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${o.status === 'validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {o.status === 'validated' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold truncate">{o.customerName}</span>
                    <span className="block text-xs text-[#8B6B70]">
                      {o.id} · {o.quantity} billet{o.quantity > 1 ? 's' : ''}
                    </span>
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${o.status === 'validated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {o.status === 'validated' ? 'Débloqué' : 'En attente'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ---------- Mon billet ---------- */
const firstName = (full: string) => full.split(' ')[0] || full;

const GUESTS_KEY = 'gala-guest-names-v1';
const loadGuestNames = (): Record<string, string> => {
  try {
    const raw = JSON.parse(localStorage.getItem(GUESTS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
};

const ReservationDetails: React.FC<{
  order: Order;
  onBack: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}> = ({ order, onBack, onUpdateOrderStatus }) => {
  const { content } = useContent();
  const info = content.galaInfo;
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showInvitation, setShowInvitation] = useState(false);
  const [names, setNames] = useState<Record<string, string>>(loadGuestNames);

  // Le nom choisi par la personne qui a payé apparaît sur l'invitation (le QR code reste identique)
  const named = (t: IssuedTicket): IssuedTicket => ({ ...t, attendeeName: names[t.ticketNumber]?.trim() || t.attendeeName });
  const setGuestName = (ticketNumber: string, value: string) =>
    setNames((prev) => {
      const next = { ...prev, [ticketNumber]: value };
      try {
        localStorage.setItem(GUESTS_KEY, JSON.stringify(next));
      } catch {
        // stockage indisponible
      }
      return next;
    });

  const status = order.status;
  const many = order.tickets.length > 1;
  const raw: IssuedTicket | undefined = order.tickets[index];
  const ticket: IssuedTicket | undefined = raw ? named(raw) : undefined;
  const place = [info.venueName, info.city].filter(Boolean).join(', ');
  const whatsappUrl = `https://wa.me/${digits(info.whatsappNumber)}?text=${encodeURIComponent(
    `Bonjour, j'ai une question sur ma commande ${order.id}.`
  )}`;

  const save = async (list: IssuedTicket[]) => {
    setSaving(true);
    setSaveMessage('');
    try {
      const result = await saveInvitations(list.map((t) => ({ ticket: named(t), info })));
      if (result === 'downloaded') setSaveMessage(list.length > 1 ? 'Billets enregistrés dans tes téléchargements.' : 'Billet enregistré dans tes téléchargements.');
      if (result === 'shared') setSaveMessage('C’est fait !');
    } catch {
      setSaveMessage("Impossible d'enregistrer pour le moment. Prends une capture d'écran du code, ça marche aussi.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  // Lien qui débloque uniquement le billet de cet invité (il ne voit pas les autres)
  const guestLink = (t: IssuedTicket) =>
    buildTicketLink({
      ...order,
      customerName: t.attendeeName,
      totalAmount: order.tickets.length ? order.totalAmount / order.tickets.length : order.totalAmount,
      paymentReference: undefined,
      tickets: [{ ...t, ticketIndex: 1, totalTickets: 1 }],
    });

  const guestWhatsAppUrl = (t: IssuedTicket) =>
    `https://wa.me/?text=${encodeURIComponent(
      `Bonjour ${firstName(t.attendeeName)}, voici ton invitation pour ${info.name} (${info.dateText}).\n\nOuvre ce lien pour voir ton billet :\n${guestLink(t)}\n\nMontre le code à l'entrée.`
    )}`;

  const shareTicket = async () => {
    if (!ticket) return;
    const text = `Voici mon billet pour ${info.name} (${info.dateText}). Ticket ${ticket.ticketNumber}.`;
    try {
      if (navigator.share) await navigator.share({ title: info.name, text });
      else {
        await navigator.clipboard.writeText(text);
        setSaveMessage('Texte copié, tu peux le coller dans WhatsApp.');
        setTimeout(() => setSaveMessage(''), 4000);
      }
    } catch {
      // partage annulé
    }
  };

  const card = 'rounded-[2rem] bg-[#FBF8F2] text-[#2A1014] shadow-2xl';

  return (
    <div className="min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-md mx-auto">
        {/* En-tête simple */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} aria-label="Retour" className="p-2 -ml-2 rounded-full text-white hover:bg-white/10 cursor-pointer">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-sans font-bold tracking-tight text-3xl text-white">{many ? 'Mes billets' : 'Mon billet'}</h1>
        </div>

        {isDemo() && (
          <div className="mb-4 flex items-center gap-2 p-1.5 rounded-full bg-black/40 text-xs">
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

        {/* ===== Paiement en cours de vérification ===== */}
        {status === 'pending' && (
          <Reveal immediate className={`${card} p-7 sm:p-8`}>
            <span className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <Clock className="w-7 h-7" />
            </span>
            <h2 className="font-sans font-bold tracking-tight text-2xl">On vérifie ton paiement</h2>
            <p className="mt-2 text-base text-[#6B4A4F]">Ton billet apparaîtra ici dès que l'équipe aura confirmé.</p>

            <ol className="mt-6 space-y-4">
              {[
                { label: 'Tu as envoyé ta commande', state: 'done' },
                { label: "Tu paies avec l'équipe sur WhatsApp", state: 'now' },
                { label: 'Tu reçois ton lien et ton billet', state: 'next' },
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      step.state === 'done'
                        ? 'bg-emerald-500 text-white'
                        : step.state === 'now'
                        ? 'bg-[#F2761B] text-white'
                        : 'bg-[#EFE5D6] text-[#8B6B70]'
                    }`}
                  >
                    {step.state === 'done' ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </span>
                  <span className={`text-base ${step.state === 'next' ? 'text-[#8B6B70]' : 'font-semibold'}`}>{step.label}</span>
                </li>
              ))}
            </ol>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-full bg-[#25D366] text-[#052e16] font-bold text-base hover:bg-[#20ba59]"
            >
              <WhatsAppIcon className="w-6 h-6" /> Écrire à l'équipe
            </a>
            <p className="mt-4 text-sm text-center text-[#8B6B70]">Commande {order.id}</p>
          </Reveal>
        )}

        {/* ===== Commande refusée ===== */}
        {status === 'rejected' && (
          <Reveal immediate className={`${card} p-7 sm:p-8`}>
            <span className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </span>
            <h2 className="font-sans font-bold tracking-tight text-2xl">On n'a pas retrouvé ton paiement</h2>
            <p className="mt-2 text-base text-[#6B4A4F]">{order.notes || "Écris-nous sur WhatsApp, on va régler ça ensemble."}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-full bg-[#25D366] text-[#052e16] font-bold text-base hover:bg-[#20ba59]"
            >
              <WhatsAppIcon className="w-6 h-6" /> Écrire à l'équipe
            </a>
          </Reveal>
        )}

        {/* ===== Billet prêt ===== */}
        {status === 'validated' && ticket && (
          <div className="space-y-5">
            <Reveal immediate className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </span>
              <div>
                <p className="font-sans font-bold text-white text-xl leading-tight">Ton paiement est confirmé</p>
                <p className="text-base text-white/70 leading-snug">Voici ton billet. Montre-le à l'entrée.</p>
              </div>
            </Reveal>

            {many && (
              <Reveal immediate delay={0.05}>
                <p className="text-sm text-white/70 mb-2">Tu as {order.tickets.length} billets. Touche celui que tu veux montrer :</p>
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tes billets">
                  {order.tickets.map((t, i) => (
                    <button
                      key={t.ticketNumber}
                      role="tab"
                      aria-selected={i === index}
                      onClick={() => setIndex(i)}
                      className={`px-4 py-2.5 rounded-full text-base font-semibold cursor-pointer transition-colors ${
                        i === index ? 'bg-white text-[#5A040F]' : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      {names[t.ticketNumber]?.trim() ? firstName(names[t.ticketNumber].trim()) : i === 0 ? firstName(t.attendeeName) : `Invité ${i}`}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            {/* Le billet */}
            <Reveal immediate delay={0.1} className={`${card} overflow-hidden`}>
              <div className="px-7 pt-7 text-center">
                <p className="text-sm font-semibold text-[#D8590B]">{info.name}</p>
                <p className="mt-1 font-sans font-bold tracking-tight text-2xl leading-tight">{ticket.attendeeName}</p>
                <p className="mt-1 text-base text-[#6B4A4F]">{info.dateText}</p>
                {place && <p className="text-base text-[#6B4A4F]">{place}</p>}
              </div>

              <div className="px-7 py-6 flex flex-col items-center">
                <div className="relative">
                  <QRCodeSvg value={ticket.qrPayload} size={248} dimmed={ticket.scanned} />
                  {ticket.scanned && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-[#2A1014] text-white font-bold">Déjà utilisé</span>
                    </span>
                  )}
                </div>
                <p className="mt-4 font-sans font-bold text-lg text-center">Montre ce code à l'entrée</p>
                <p className="text-sm text-[#8B6B70]">Un seul passage par billet</p>
              </div>

              <div className="border-t border-dashed border-[#E3D6C2] px-7 py-4 flex items-center justify-between text-sm text-[#8B6B70]">
                <span>Billet n° {ticket.ticketNumber}</span>
                <span className="font-mono">{ticket.securityCode}</span>
              </div>
            </Reveal>

            {/* Plusieurs billets : chaque invité reçoit le sien */}
            {many && (
              <Reveal immediate delay={0.14} className="rounded-3xl bg-white/10 ring-1 ring-white/15 p-5">
                <p className="font-sans font-bold text-white text-lg">Ce billet est pour qui ?</p>
                <p className="text-sm text-white/65 mt-0.5">Écris son nom : il apparaît sur l'invitation. Chaque invité a son propre code.</p>
                <input
                  value={names[raw!.ticketNumber] ?? ''}
                  onChange={(e) => setGuestName(raw!.ticketNumber, e.target.value)}
                  placeholder={raw!.attendeeName}
                  aria-label="Nom de l'invité"
                  autoComplete="off"
                  className="mt-3 w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 text-base focus:border-[#FFB43A] focus:outline-none focus:ring-2 focus:ring-[#FFB43A]/30"
                />
                <a
                  href={guestWhatsAppUrl(ticket)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-full bg-[#25D366] text-[#052e16] font-bold text-base hover:bg-[#20ba59]"
                >
                  <WhatsAppIcon className="w-6 h-6" /> Envoyer à {firstName(ticket.attendeeName)}
                </a>
                <p className="mt-2 text-sm text-white/60 text-center">
                  Il reçoit un lien : en l'ouvrant, il voit seulement son billet.
                </p>
              </Reveal>
            )}

            {/* Une seule action principale */}
            <Reveal immediate delay={0.18} className="space-y-3">
              <button
                onClick={() => save([raw!])}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-3 py-[1.1rem] rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-lg shadow-[0_14px_34px_rgba(242,118,27,0.35)] hover:brightness-110 disabled:opacity-60 cursor-pointer"
              >
                <Download className="w-6 h-6" />
                {saving ? 'Un instant…' : 'Enregistrer mon billet'}
              </button>
              <p className="text-center text-sm text-white/65">
                Garde-le dans ton téléphone : il marche même sans internet.
              </p>
              {saveMessage && (
                <p role="status" className="text-center text-base font-semibold text-[#FFE9C2]">
                  {saveMessage}
                </p>
              )}

              {many && (
                <button
                  onClick={() => save(order.tickets)}
                  disabled={saving}
                  className="w-full py-3.5 rounded-full ring-1 ring-white/40 text-white font-semibold hover:bg-white/10 disabled:opacity-60 cursor-pointer"
                >
                  Enregistrer les {order.tickets.length} billets
                </button>
              )}

              <div className={many ? '' : 'grid grid-cols-2 gap-3'}>
                {!many && (
                  <button
                    onClick={shareTicket}
                    className="py-3.5 rounded-full ring-1 ring-white/40 text-white font-semibold hover:bg-white/10 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-5 h-5" /> Partager
                  </button>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-3.5 rounded-full ring-1 ring-white/40 text-white font-semibold hover:bg-white/10 flex items-center justify-center gap-2 ${many ? 'w-full' : ''}`}
                >
                  <WhatsAppIcon className="w-5 h-5" /> Une question ?
                </a>
              </div>
            </Reveal>

            {/* Le reste est rangé : pas besoin d'y toucher */}
            <div className="space-y-2 pt-2">
              <details
                className="group rounded-2xl bg-white/10 ring-1 ring-white/15"
                onToggle={(e) => setShowInvitation((e.currentTarget as HTMLDetailsElement).open)}
              >
                <summary className="flex items-center justify-between px-5 py-4 text-base font-semibold text-white cursor-pointer list-none">
                  Voir l'image de mon invitation
                  <span className="text-white/60 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <div className="px-4 pb-4">
                  {showInvitation && <InvitationPreview ticket={ticket} info={info} />}
                  <p className="mt-2 text-sm text-white/60">C'est cette image qui est enregistrée avec le bouton orange.</p>
                </div>
              </details>

              <details className="group rounded-2xl bg-white/10 ring-1 ring-white/15">
                <summary className="flex items-center justify-between px-5 py-4 text-base font-semibold text-white cursor-pointer list-none">
                  Infos de ma commande
                  <span className="text-white/60 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <dl className="px-5 pb-5 space-y-2 text-base">
                  <Line k="Commande" v={order.id} />
                  <Line k="Billets" v={String(order.tickets.length)} />
                  <Line k="Total payé" v={`${order.totalAmount} $`} />
                  <Line k="Horaires" v={info.timeText || 'À confirmer'} />
                </dl>
              </details>
            </div>
          </div>
        )}

        {status === 'validated' && !ticket && (
          <p className="text-white text-center text-lg">Aucun billet n'est rattaché à cette commande pour le moment.</p>
        )}
      </div>
    </div>
  );
};

const Line: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-white/60">{k}</dt>
    <dd className="font-semibold text-white text-right">{v}</dd>
  </div>
);

// Aperçu de l'invitation qui est enregistrée
const InvitationPreview: React.FC<{ ticket: IssuedTicket; info: ReturnType<typeof useContent>['content']['galaInfo'] }> = ({ ticket, info }) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    renderInvitation({ ticket, info })
      .then((c) => !cancelled && setSrc(c.toDataURL('image/png')))
      .catch(() => !cancelled && setSrc(null));
    return () => {
      cancelled = true;
    };
  }, [ticket, info]);

  return src ? (
    <img src={src} alt={`Invitation ${ticket.ticketNumber}`} className="w-full h-auto block rounded-xl" />
  ) : (
    <div className="aspect-[3/1] w-full animate-pulse rounded-xl bg-white/10" aria-hidden="true" />
  );
};
