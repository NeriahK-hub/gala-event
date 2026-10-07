import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useContent } from '../../content/ContentContext';
import { TicketTierId, Order, IssuedTicket } from '../../types';
import { LuxuryFrame } from '../common/LuxuryFrame';
import {
  Check,
  Copy,
  ChevronLeft,
  ArrowRight,
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
  initialTierId = 'vip',
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
        colors: ['#D4A857', '#E8C98A', '#FFF2C6', '#4A0A12'],
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
    const message = `Bonjour Conciergerie du Grand Gala Royal,\n\nJe viens d'effectuer ma réservation :
- Commande : *${createdOrder.id}*
- Titulaire : *${createdOrder.customerName}*
- Formule : *${createdOrder.quantity}x ${currentTier.name}*
- Montant total : *${createdOrder.totalAmount} USD*
- Numéro qui a envoyé le paiement : *${createdOrder.payerPhone}*
- Opérateur : *${selectedOperator.name}*

Voici la confirmation de mon transfert Mobile Money pour valider mes billets. Merci !`;

    return `https://wa.me/${GALA_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={step === 1 ? onBackToHome : () => setStep((step - 1) as 1 | 2)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8C98A] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{step === 1 ? "Retour à l'accueil" : 'Étape précédente'}</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D4A857]">
          <span className={step >= 1 ? 'font-bold text-[#F3E5AB]' : 'opacity-75'}>1. Billet</span>
          <span className="opacity-40">›</span>
          <span className={step >= 2 ? 'font-bold text-[#F3E5AB]' : 'opacity-75'}>2. Coordonnées</span>
          <span className="opacity-40">›</span>
          <span className={step === 3 ? 'font-bold text-[#F3E5AB]' : 'opacity-75'}>3. Confirmation</span>
        </div>
      </div>

      <LuxuryFrame className="p-6 sm:p-10 rounded-2xl border border-[#D4A857]/30 bg-gradient-to-b from-[#2E0A0F]/50 via-[#1C0709]/70 to-[#3D030B] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* ================= STEP 1: CHOIX DU BILLET ================= */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4A857] font-semibold block mb-2">
                Étape 1 sur 3
              </span>
              <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#F3E5AB] tracking-tight">
                Choisis ta formule
              </h1>
              <p className="font-serif italic text-sm text-[#F3E5AB]/80 mt-1">
                Choisis le niveau de prestige et le nombre de convives.
              </p>
            </div>

            {/* Tier Selector Radio Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TICKET_TIERS.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#D4A857] bg-[#4A0A12]/80 shadow-[0_0_20px_rgba(212,168,87,0.35)] scale-[1.02]'
                        : 'border-[#D4A857]/20 bg-[#160607]/40 hover:border-[#D4A857]/50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold">
                          {tier.subtitle}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#D4A857] bg-[#D4A857] text-[#3D030B]'
                              : 'border-[#D4A857]/40'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-[#F9F5EC] mb-1">
                        {tier.name}
                      </h3>

                      <div className="font-serif text-3xl text-gold-bright tabular-nums mb-3">
                        {tier.price} <span className="text-xs uppercase text-[#E8C98A]">USD</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300/80 line-clamp-2">
                      {tier.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector (+ and -) */}
            <div className="p-6 rounded-xl border border-[#D4A857]/20 bg-[#3D030B]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-lg text-[#F9F5EC] font-semibold">
                  Nombre de Billets
                </h3>
                <p className="text-xs text-stone-300">
                  {currentTier.id === 'table'
                    ? 'Chaque table réserve 8 places royales contiguës'
                    : '1 billet par convive (QR Code nominatif par personne)'}
                </p>
              </div>

              {/* + and - controller */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-[#D4A857] text-[#E8C98A] disabled:opacity-40 disabled:border-stone-600 hover:bg-[#D4A857] hover:text-[#3D030B] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                >
                  -
                </button>

                <span className="font-serif text-3xl text-gold-bright tabular-nums min-w-8 text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-full border border-[#D4A857] text-[#E8C98A] disabled:opacity-40 disabled:border-stone-600 hover:bg-[#D4A857] hover:text-[#3D030B] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Live Calculation Summary Banner */}
            <div className="p-6 rounded-xl border border-[#D4A857]/30 bg-gradient-to-r from-[#1C0709] to-[#3D030B] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857]">
                  Récapitulatif de la sélection :
                </span>
                <p className="font-serif text-xl text-[#F9F5EC] font-semibold">
                  {quantity}x {currentTier.name}
                </p>
              </div>

              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                <span className="text-xs uppercase tracking-wider text-[#D4A857]/80">
                  Total à régler :
                </span>
                <span className="font-serif text-3xl sm:text-4xl text-gold-bright tabular-nums">
                  {totalAmount} <span className="text-sm font-semibold uppercase text-[#E8C98A]">USD</span>
                </span>
              </div>
            </div>

            {/* Next Step CTA */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_25px_rgba(212,168,87,0.5)] transition-all cursor-pointer"
              >
                <span>Continuer vers le formulaire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: FORMULAIRE ================= */}
        {step === 2 && (
          <form onSubmit={handleSubmitForm} className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4A857] font-semibold block mb-2">
                Étape 2 sur 3
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#F3E5AB] tracking-tight">
                Tes coordonnées & paiement
              </h2>
              <p className="font-serif italic text-sm text-[#F3E5AB]/80 mt-1">
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
                <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block">
                  Nom Complet du Titulaire <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Princesse Kalubi Banza"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D4A857]/30 bg-[#3D030B]/70 text-[#F9F5EC] placeholder-[#D4A857]/40 text-sm focus:border-[#D4A857] focus:outline-none focus:ring-1 focus:ring-[#D4A857]"
                />
                <span className="text-xs text-stone-400">
                  Ce nom sera inscrit sur l'invitation officielle de gala.
                </span>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block">
                  Adresse Courriel (Optionnel)
                </label>
                <input
                  type="email"
                  placeholder="Ex: kalubi@prestige.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D4A857]/30 bg-[#3D030B]/70 text-[#F9F5EC] placeholder-[#D4A857]/40 text-sm focus:border-[#D4A857] focus:outline-none focus:ring-1 focus:ring-[#D4A857]"
                />
              </div>

              {/* Contact Phone (WhatsApp) */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block">
                  Numéro de Contact (WhatsApp) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +243 81 555 1234"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D4A857]/30 bg-[#3D030B]/70 text-[#F9F5EC] placeholder-[#D4A857]/40 text-sm focus:border-[#D4A857] focus:outline-none focus:ring-1 focus:ring-[#D4A857]"
                />
                <span className="text-xs text-stone-400">
                  Numéro auquel nous t'enverrons tes billets validés.
                </span>
              </div>

              {/* Mobile Money Operator Selection */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block">
                  Opérateur Mobile Money Prévu
                </label>
                <select
                  value={selectedOperatorIndex}
                  onChange={(e) => setSelectedOperatorIndex(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-[#D4A857]/30 bg-[#3D030B]/90 text-[#F9F5EC] text-sm focus:border-[#D4A857] focus:outline-none"
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
            <div className="p-5 rounded-xl border border-[#D4A857]/30 bg-[#160607]/60 space-y-4">
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
                  <label className="text-xs uppercase tracking-wider text-[#E8C98A] font-semibold block">
                    Numéro qui va envoyer l'argent (Mobile Money) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required={!useSamePhone}
                    placeholder="Ex: +243 89 123 4567"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#D4A857]/40 bg-[#3D030B]/80 text-[#F9F5EC] text-sm focus:border-[#D4A857] focus:outline-none"
                  />
                  {/* The exact requested note */}
                  <div className="p-3 rounded-lg bg-[#1C0709] border border-[#D4A857]/30 text-xs text-[#F3E5AB]">
                    <Info className="inline w-4 h-4 mr-1 -mt-0.5" /> <strong>Important :</strong> Si tu paies depuis un autre numéro (ex: compte d'un proche, agent shop ou société), écris ce numéro-là afin que notre équipe puisse réconcilier ton paiement.
                  </div>
                </div>
              )}
            </div>

            {/* Visible Order Recap */}
            <div className="p-5 rounded-xl border border-[#D4A857]/25 bg-[#3D030B]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#D4A857]">
                  Récapitulatif de la commande :
                </span>
                <p className="font-serif text-lg text-[#F9F5EC] font-semibold">
                  {quantity}x {currentTier.name} ({currentTier.price}$ / unité)
                </p>
                <p className="text-xs text-stone-300">
                  Accès pour {quantity * currentTier.capacityPerTicket} convive(s) au Pullman Kinshasa
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-[#D4A857]/80 block">
                  Total à transférer :
                </span>
                <span className="font-serif text-3xl text-gold-bright tabular-nums">
                  {totalAmount} USD
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#D4A857]/40 text-[#E8C98A] text-xs uppercase tracking-wider hover:bg-[#D4A857]/10 cursor-pointer"
              >
                Modifier le billet
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#3D030B] font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-[0_0_25px_rgba(212,168,87,0.6)] cursor-pointer"
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
            <div className="w-16 h-16 rounded-full border-2 border-[#D4A857] bg-[#1C0709] flex items-center justify-center text-[#D4A857] mx-auto shadow-[0_0_25px_rgba(212,168,87,0.4)]">
              <CheckCircle className="w-8 h-8 text-[#D4A857]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-[#D4A857] font-semibold block mb-1">
                Réservation Enregistrée avec Succès
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#F3E5AB] tracking-tight">
                Félicitations, {createdOrder.customerName}
              </h2>
              <p className="font-serif italic text-sm text-[#F3E5AB]/85 max-w-md mx-auto mt-2">
                Ta demande de réservation a bien été reçue. Il ne te reste plus qu'à effectuer ton transfert Mobile Money.
              </p>
            </div>

            {/* ORDER CODE DISPLAY (Code de commande bien visible) */}
            <div className="p-6 rounded-2xl border-2 border-[#D4A857] bg-gradient-to-b from-[#4A0A12]/80 to-[#160607] shadow-[0_0_30px_rgba(212,168,87,0.3)] max-w-md mx-auto">
              <span className="text-xs uppercase tracking-[0.12em] text-[#D4A857] font-semibold block mb-1">
                Ton code de commande unique
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-gold-bright font-bold tracking-wider py-1">
                {createdOrder.id}
              </div>
              <div className="mt-3 pt-3 border-t border-[#D4A857]/20 flex items-center justify-between text-xs text-stone-200">
                <span>Montant exact à envoyer :</span>
                <span className="font-bold text-[#E8C98A] text-base">{createdOrder.totalAmount} USD</span>
              </div>
            </div>

            {/* MOBILE MONEY DETAILS WITH ONE-CLICK COPY */}
            <div className="p-6 rounded-xl border border-[#D4A857]/30 bg-[#3D030B]/80 max-w-lg mx-auto text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4A857]/20 pb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4A857] font-semibold">
                  Numéro Mobile Money Récepteur
                </span>
                <span className="text-xs text-[#E8C98A] font-medium">{selectedOperator.name}</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[#1C0709] border border-[#D4A857]/30">
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
                className="w-full py-3.5 rounded-full border border-[#D4A857] text-[#E8C98A] hover:bg-[#D4A857]/20 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
              >
                Voir mon billet (Lien personnel)
              </button>
            </div>

            <p className="text-xs text-[#D4A857]/90 italic pt-2">
              Dès réception de la preuve de paiement par notre conciergerie, ton billet passera automatiquement à l'état « Validé ».
            </p>
          </div>
        )}
      </LuxuryFrame>
    </div>
  );
};
