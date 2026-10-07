import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { useContent } from '../../content/ContentContext';
import { TicketTierId, Order, IssuedTicket } from '../../types';
import {
  Check,
  Copy,
  ChevronLeft,
  ArrowRight,
  Minus,
  Plus,
  QrCode,
  Smartphone,
  Zap,
  MessageCircle,
  Info,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface ReservationFlowProps {
  initialTierId?: TicketTierId;
  onBackToHome: () => void;
  onOrderCreated: (order: Order) => void;
  onViewTicket: (orderId: string) => void;
}

export const ReservationFlow: React.FC<ReservationFlowProps> = ({
  initialTierId = 'standard',
  onBackToHome,
  onOrderCreated,
  onViewTicket,
}) => {
  const { content } = useContent();
  const TICKET_TIERS = content.tiers;
  const MOBILE_MONEY_ACCOUNTS = content.mobileMoney;
  const GALA_INFO = content.galaInfo;

  // Step state: 1 = Choix du billet, 2 = Formulaire, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [selectedTierId, setSelectedTierId] = useState<TicketTierId>(initialTierId);
  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [payerPhone, setPayerPhone] = useState<string>('');
  const [useSamePhone, setUseSamePhone] = useState<boolean>(true);
  const [selectedOperatorIndex, setSelectedOperatorIndex] = useState<number>(0);

  // Confirmation state
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const currentTier = TICKET_TIERS.find((t) => t.id === selectedTierId) || TICKET_TIERS[0];
  const totalAmount = currentTier.price * quantity;
  const selectedOperator = MOBILE_MONEY_ACCOUNTS[selectedOperatorIndex];

  // Increment / Decrement quantity
  const handleIncrease = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Form submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Renseigne ton nom complet.');
      return;
    }
    if (!contactPhone.trim()) {
      setFormError('Renseigne ton numéro de contact / WhatsApp.');
      return;
    }

    const actualPayerPhone = useSamePhone ? contactPhone : (payerPhone || contactPhone);

    // Generate new order
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GALA-${randomSuffix}`;

    // Create tickets list
    const generatedTickets: IssuedTicket[] = Array.from({ length: quantity }, (_, idx) => {
      const ticketNum = `TKT-${randomSuffix}-0${idx + 1}`;
      return {
        ticketNumber: ticketNum,
        ticketIndex: idx + 1,
        totalTickets: quantity,
        tierId: currentTier.id,
        tierName: currentTier.name,
        attendeeName: idx === 0 ? fullName : `Invité de ${fullName} (${idx + 1}/${quantity})`,
        securityCode: `${currentTier.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + idx)}`,
        qrPayload: `GALA-ROYAL-KIN-2026|${ticketNum}|${currentTier.id.toUpperCase()}|${encodeURIComponent(fullName)}|ORDER-${orderId}`,
        scanned: false,
      };
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: fullName,
      customerEmail: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@client.cd`,
      customerPhone: contactPhone,
      payerPhone: actualPayerPhone,
      tierId: currentTier.id,
      quantity,
      unitPrice: currentTier.price,
      totalAmount,
      status: 'pending',
      tickets: generatedTickets,
    };

    setCreatedOrder(newOrder);
    onOrderCreated(newOrder);
    setStep(3);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#D4A857', '#E8C98A', '#FFF2C6', '#8E0A1C'],
      });
    } catch {
      // ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const getWhatsAppMessageUrl = () => {
    if (!createdOrder) return '#';
    const message = `Bonjour, je réserve pour ${GALA_INFO.name},\n\nJe viens d'effectuer ma réservation :
- Commande : *${createdOrder.id}*
- Titulaire : *${createdOrder.customerName}*
- Formule : *${createdOrder.quantity}x ${currentTier.name}*
- Montant total : *${createdOrder.totalAmount} USD*
- Numéro qui a envoyé le paiement : *${createdOrder.payerPhone}*
- Opérateur : *${selectedOperator.name}*

Voici la confirmation de mon transfert Mobile Money pour valider mes billets. Merci !`;

    return `https://wa.me/${GALA_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const stepLabels = ['Billet', 'Coordonnées', 'Confirmation'];

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-32 sm:pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Retour + progression */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <button
          onClick={step === 1 ? onBackToHome : () => setStep((step - 1) as 1 | 2)}
          className="inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 -ml-1" />
          <span>{step === 1 ? 'Accueil' : 'Retour'}</span>
        </button>

        <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progression de la réservation">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const current = step === n;
            return (
              <li key={label} className="flex items-center gap-2" aria-current={current ? 'step' : undefined}>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    current ? 'bg-white text-[#5A040F]' : done ? 'bg-[#FFB43A] text-[#3D0A04]' : 'bg-white/15 text-white/70'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : n}
                </span>
                <span className={`hidden sm:inline text-sm ${current ? 'text-white font-semibold' : 'text-white/60'}`}>{label}</span>
                {n < 3 && <span className="w-5 sm:w-8 h-px bg-white/25" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-[2rem] border border-white/15 bg-black/25 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] p-5 sm:p-10">
        {/* ================= STEP 1: CHOIX DU BILLET ================= */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <header className="mb-8 sm:mb-10 max-w-xl">
              <p className="text-sm font-semibold text-[#FFB43A] mb-2">{GALA_INFO.theme}</p>
              <h1 className="font-sans font-bold tracking-tight text-white text-4xl sm:text-5xl leading-[1.05]">
                Choisis ton billet.
              </h1>
              <p className="text-base sm:text-lg text-white/75 mt-3">
                Une seule étape pour réserver ta place, puis tu paies par Mobile Money.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
              {/* Choix du billet */}
              <div className="space-y-3" role="radiogroup" aria-label="Type de billet">
                {TICKET_TIERS.map((tier) => {
                  const isSelected = currentTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => setSelectedTierId(tier.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTierId(tier.id);
                        }
                      }}
                      className={`rounded-3xl p-5 sm:p-6 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'bg-white text-[#2A1014] shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-2 ring-[#FFB43A]'
                          : 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/15'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${isSelected ? 'text-[#D8590B]' : 'text-[#FFB43A]'}`}>
                              {tier.subtitle}
                            </span>
                            {tier.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-[#F2761B] text-white text-[11px] font-bold">{tier.badge}</span>
                            )}
                          </div>
                          <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight">{tier.name}</h3>
                          <p className={`text-sm mt-1.5 leading-relaxed ${isSelected ? 'text-[#6B4A4F]' : 'text-white/70'}`}>
                            {tier.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-sans font-bold text-3xl sm:text-4xl tracking-tight tabular-nums leading-none">
                            {tier.price}
                            <span className="text-lg ml-0.5">$</span>
                          </p>
                          <p className={`text-xs mt-1 ${isSelected ? 'text-[#8B6B70]' : 'text-white/60'}`}>
                            {tier.capacityPerTicket > 1 ? `${tier.capacityPerTicket} places` : 'par personne'}
                          </p>
                        </div>
                      </div>

                      {isSelected && tier.perks.length > 0 && (
                        <ul className="mt-5 pt-5 border-t border-[#EFE5D6] space-y-2.5">
                          {tier.perks.map((perk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-[#2A1014]">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-[#F2761B]/15 text-[#D8590B] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" strokeWidth={3} />
                              </span>
                              {perk}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}

                <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-3 text-sm text-white/75">
                  <li className="inline-flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#FFB43A]" /> Paiement Mobile Money</li>
                  <li className="inline-flex items-center gap-2"><Zap className="w-4 h-4 text-[#FFB43A]" /> Billet envoyé sur WhatsApp</li>
                  <li className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#FFB43A]" /> QR code personnel</li>
                </ul>
              </div>

              {/* Ta commande */}
              <aside className="lg:sticky lg:top-28 space-y-4">
                <TicketPreview
                  name={GALA_INFO.name}
                  badge={currentTier.name}
                  dateText={GALA_INFO.dateText}
                  quantity={quantity}
                />

                <div className="rounded-3xl bg-white/10 ring-1 ring-white/15 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Quantité</p>
                      <p className="text-xs text-white/60">
                        {currentTier.capacityPerTicket > 1
                          ? `Chaque billet donne accès à ${currentTier.capacityPerTicket} personnes`
                          : 'Un QR code personnel par billet'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-black/30 p-1">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        aria-label="Retirer un billet"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span aria-live="polite" className="w-9 text-center font-sans font-bold text-xl text-white tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={quantity >= 10}
                        aria-label="Ajouter un billet"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <dl className="mt-5 pt-4 border-t border-white/15 space-y-2 text-sm">
                    <div className="flex justify-between text-white/75">
                      <dt>{quantity} × {currentTier.name}</dt>
                      <dd className="tabular-nums">{currentTier.price * quantity} $</dd>
                    </div>
                    <div className="flex items-baseline justify-between pt-2">
                      <dt className="text-white font-semibold">Total</dt>
                      <dd className="font-sans font-bold text-3xl tracking-tight text-white tabular-nums">
                        {totalAmount}
                        <span className="text-lg ml-0.5">$</span>
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="hidden lg:flex mt-5 w-full items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-base shadow-[0_12px_28px_rgba(242,118,27,0.35)] hover:brightness-110 transition cursor-pointer"
                  >
                    Continuer
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </aside>
            </div>

            {/* Barre collée en bas sur mobile (hors du conteneur flouté, sinon « fixed » est piégé) */}
            {createPortal(
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pt-3 pb-4 bg-[#4A030C]/85 backdrop-blur-xl border-t border-white/15">
              <div className="max-w-5xl mx-auto flex items-center gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-white/70">Total • {quantity} billet{quantity > 1 ? 's' : ''}</p>
                  <p className="font-sans font-bold text-2xl text-white tabular-nums leading-tight">{totalAmount} $</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="ml-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold shadow-lg cursor-pointer"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>,
              document.body
            )}
          </div>
        )}

        {/* ================= STEP 2: FORMULAIRE ================= */}
        {step === 2 && (
          <form onSubmit={handleSubmitForm} className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <span className="text-sm text-[#FFB43A] font-semibold block mb-2">
                Étape 2 sur 3
              </span>
              <h2 className="font-sans font-bold tracking-tight text-white text-3xl sm:text-4xl">
                Tes coordonnées & paiement
              </h2>
              <p className="text-base text-white/75 max-w-md mx-auto mt-1">
                Informations requises pour l'émission des invitations officielles.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs text-center">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm text-white/90 font-semibold block">
                  Nom Complet du Titulaire <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Princesse Kalubi Banza"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 text-sm focus:border-[#FFB43A] focus:outline-none focus:ring-2 focus:ring-[#FFB43A]/30"
                />
                <span className="text-xs text-stone-400">
                  Ce nom sera inscrit sur l'invitation officielle de gala.
                </span>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm text-white/90 font-semibold block">
                  Adresse Courriel (Optionnel)
                </label>
                <input
                  type="email"
                  placeholder="Ex: kalubi@prestige.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 text-sm focus:border-[#FFB43A] focus:outline-none focus:ring-2 focus:ring-[#FFB43A]/30"
                />
              </div>

              {/* Contact Phone (WhatsApp) */}
              <div className="space-y-2">
                <label className="text-sm text-white/90 font-semibold block">
                  Numéro de Contact (WhatsApp) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +243 81 555 1234"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 text-sm focus:border-[#FFB43A] focus:outline-none focus:ring-2 focus:ring-[#FFB43A]/30"
                />
                <span className="text-xs text-stone-400">
                  Numéro auquel nous t'enverrons tes billets validés.
                </span>
              </div>

              {/* Mobile Money Operator Selection */}
              <div className="space-y-2">
                <label className="text-sm text-white/90 font-semibold block">
                  Opérateur Mobile Money Prévu
                </label>
                <select
                  value={selectedOperatorIndex}
                  onChange={(e) => setSelectedOperatorIndex(Number(e.target.value))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white text-sm focus:border-[#FFB43A] focus:outline-none"
                >
                  {MOBILE_MONEY_ACCOUNTS.map((op, idx) => (
                    <option key={idx} value={idx} className="bg-[#3D030B] text-[#F9F5EC]">
                      {op.name} ({op.number})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payer Phone section with explicit requested note */}
            <div className="p-5 rounded-3xl border border-white/15 bg-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="samePhone"
                  checked={useSamePhone}
                  onChange={(e) => setUseSamePhone(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4A857] focus:ring-[#D4A857] border-[#D4A857]/50 accent-[#D4A857]"
                />
                <label htmlFor="samePhone" className="text-xs text-stone-200 cursor-pointer select-none">
                  Je paie depuis mon propre numéro de contact ({contactPhone || 'même numéro'})
                </label>
              </div>

              {!useSamePhone && (
                <div className="space-y-2 pt-2 border-t border-[#D4A857]/20 animate-in fade-in">
                  <label className="text-sm text-white/90 font-semibold block">
                    Numéro qui va envoyer l'argent (Mobile Money) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required={!useSamePhone}
                    placeholder="Ex: +243 89 123 4567"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-white/20 bg-white/10 text-white text-sm focus:border-[#FFB43A] focus:outline-none"
                  />
                  {/* The exact requested note */}
                  <div className="p-3 rounded-lg bg-[#5A040F] border border-[#D4A857]/30 text-xs text-[#F3E5AB]">
                    <Info className="inline w-4 h-4 mr-1 -mt-0.5" /> <strong>Important :</strong> Si tu paies depuis un autre numéro (ex: compte d'un proche, agent shop ou société), écris ce numéro-là afin que notre équipe puisse réconcilier ton paiement.
                  </div>
                </div>
              )}
            </div>

            {/* Visible Order Recap */}
            <div className="p-5 rounded-3xl border border-white/15 bg-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857]">
                  Récapitulatif de la commande :
                </span>
                <p className="font-serif text-lg text-[#F9F5EC] font-semibold">
                  {quantity}x {currentTier.name} ({currentTier.price}$ / unité)
                </p>
                <p className="text-xs text-stone-300">
                  Accès pour {quantity * currentTier.capacityPerTicket} personne(s) à la soirée gala
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-[#D4A857]/80 block">
                  Total à transférer :
                </span>
                <span className="font-sans font-bold tracking-tight text-3xl text-white tabular-nums">
                  {totalAmount} USD
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-6 py-3 rounded-full ring-1 ring-white/30 text-white text-sm font-semibold hover:bg-[#D4A857]/10 cursor-pointer"
              >
                Modifier le billet
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-b from-[#FFB43A] to-[#F2761B] text-[#3D0A04] font-bold text-base shadow-lg hover:shadow-[0_0_25px_rgba(212,168,87,0.6)] cursor-pointer"
              >
                <span>Confirmer ma réservation</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: CONFIRMATION DE COMMANDE ================= */}
        {step === 3 && createdOrder && (
          <div className="space-y-8 text-center animate-in zoom-in-95 duration-400">
            {/* Top Success Badge */}
            <div className="w-16 h-16 rounded-full border-2 border-[#D4A857] bg-[#5A040F] flex items-center justify-center text-[#D4A857] mx-auto shadow-[0_0_25px_rgba(212,168,87,0.4)]">
              <CheckCircle className="w-8 h-8 text-[#D4A857]" />
            </div>

            <div>
              <span className="text-sm text-[#FFB43A] font-semibold block mb-1">
                Réservation Enregistrée avec Succès
              </span>
              <h2 className="font-sans font-bold tracking-tight text-white text-3xl sm:text-4xl">
                Félicitations, {createdOrder.customerName}
              </h2>
              <p className="text-base text-white/75 max-w-md mx-auto mt-2">
                Ta demande de réservation a bien été reçue. Il ne te reste plus qu'à effectuer ton transfert Mobile Money.
              </p>
            </div>

            {/* ORDER CODE DISPLAY (Code de commande bien visible) */}
            <div className="p-6 rounded-3xl bg-white text-[#2A1014] shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-2 ring-[#FFB43A] max-w-md mx-auto">
              <span className="text-xs font-semibold text-[#8B6B70] block mb-1">
                Ton code de commande unique
              </span>
              <div className="font-sans font-bold text-4xl sm:text-5xl tracking-wider text-[#D8590B] py-1">
                {createdOrder.id}
              </div>
              <div className="mt-3 pt-3 border-t border-[#EFE5D6] flex items-center justify-between text-xs text-[#6B4A4F]">
                <span>Montant exact à envoyer :</span>
                <span className="font-bold text-[#D8590B] text-base">{createdOrder.totalAmount} USD</span>
              </div>
            </div>

            {/* MOBILE MONEY DETAILS WITH ONE-CLICK COPY */}
            <div className="p-6 rounded-3xl border border-white/15 bg-white/10 max-w-lg mx-auto text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4A857]/20 pb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold">
                  Numéro Mobile Money Récepteur
                </span>
                <span className="text-xs text-[#E8C98A] font-medium">{selectedOperator.name}</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#5A040F] border border-[#D4A857]/30">
                <div>
                  <span className="text-xs uppercase text-[#D4A857]/80 block">Numéro Officiel</span>
                  <span className="font-serif text-xl text-[#F9F5EC] font-bold tracking-wider">
                    {selectedOperator.number}
                  </span>
                  <span className="text-xs text-[#E8C98A]/90 block">{selectedOperator.holder}</span>
                </div>

                {/* Bouton "Copier" */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(selectedOperator.number)}
                  className="px-4 py-2 rounded-full border border-[#D4A857] bg-[#D4A857]/20 text-[#E8C98A] hover:bg-[#D4A857] hover:text-[#3D030B] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNumber ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {selectedOperator.instructions}
              </p>
            </div>

            {/* ACTIONS: GROS BOUTON WHATSAPP & LIEN VERS LE BILLET */}
            <div className="space-y-4 max-w-md mx-auto pt-2">
              {/* Gros bouton Continuer sur WhatsApp */}
              <a
                href={getWhatsAppMessageUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(37,211,102,0.5)] hover:bg-[#20ba59] transition-all transform hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Continuer sur WhatsApp</span>
              </a>

              {/* Bouton voir la page de mon billet */}
              <button
                type="button"
                onClick={() => onViewTicket(createdOrder.id)}
                className="w-full py-3.5 rounded-full ring-1 ring-white/30 text-white hover:bg-white/10 text-sm font-semibold transition-colors cursor-pointer"
              >
                Voir mon billet (Lien personnel)
              </button>
            </div>

            <p className="text-xs text-[#D4A857]/90 italic pt-2">
              Dès réception de la preuve de paiement par notre conciergerie, ton billet passera automatiquement à l'état « Validé ».
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Aperçu du billet en forme de ticket (encoches latérales par masque CSS)
const TicketPreview: React.FC<{ name: string; badge: string; dateText: string; quantity: number }> = ({ name, badge, dateText, quantity }) => {
  const notch = 'radial-gradient(circle 12px at 0 66%, #0000 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 12px at 100% 66%, #0000 98%, #000) right / 51% 100% no-repeat';
  return (
    <div
      className="relative text-white"
      style={{ WebkitMask: notch, mask: notch, filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.35))' }}
      aria-hidden="true"
    >
      <div className="bg-gradient-to-br from-[#C21226] via-[#8E0A18] to-[#5A040F] rounded-3xl">
        <div className="p-5 pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#FFD9A0]">Soirée gala</p>
          <p className="font-sans font-bold text-2xl tracking-tight leading-tight mt-1">{name}</p>
          <p className="text-sm text-white/80 mt-1">{dateText}</p>
        </div>
        <div className="mx-5 border-t border-dashed border-white/35" />
        <div className="p-5 pt-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/70">Billet</p>
            <p className="text-sm font-semibold">{badge}</p>
            <p className="text-xs text-[#FFD9A0] mt-0.5">× {quantity}</p>
          </div>
          <span className="w-14 h-14 rounded-xl bg-white/90 text-[#5A040F] flex items-center justify-center">
            <QrCode className="w-9 h-9" />
          </span>
        </div>
      </div>
    </div>
  );
};
