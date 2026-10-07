import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { GALA_INFO } from '../../data/mockData';
import { QRCodeSvg } from './QRCodeSvg';
import { WaxSeal } from '../common/WaxSeal';
import { LuxuryFrame } from '../common/LuxuryFrame';
import {
  Download,
  Clock,
  CheckCircle,
  Share2,
  Calendar,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface TicketViewPageProps {
  order: Order;
  onBackToHome: () => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({
  order,
  onBackToHome,
  onUpdateOrderStatus,
}) => {
  // Local state for testing toggle between "pending" and "validated"
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const isPending = currentStatus === 'pending';
  const isValidated = currentStatus === 'validated';
  const isRejected = currentStatus === 'rejected';

  const handleStatusToggle = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(order.id, newStatus);
    }
  };

  const handleDownloadPdf = (ticketNum: string) => {
    setDownloadSuccess(ticketNum);
    setTimeout(() => {
      window.print();
    }, 400);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  const whatsappUrl = `https://wa.me/${GALA_INFO.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Bonjour Conciergerie, je consulte mon billet pour la commande ${order.id}. Peux-tu vérifier l'état de validation ?`
  )}`;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Top Header & Back */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E8C98A] hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour au site officiel</span>
        </button>

        {/* DEMO STATE SWITCHER FOR TESTING */}
        <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#D4A857]/40 bg-[#150608]/80 text-xs">
          <span className="text-xs uppercase text-[#D4A857]/80 px-2 font-medium">
            Testeur d'état :
          </span>
          <button
            onClick={() => handleStatusToggle('pending')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              isPending
                ? 'bg-[#B88934] text-[#150608] font-bold'
                : 'text-[#E8C98A] hover:text-white'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => handleStatusToggle('validated')}
            className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
              isValidated
                ? 'bg-[#D4A857] text-[#150608] font-bold'
                : 'text-[#E8C98A] hover:text-white'
            }`}
          >
            Validé
          </button>
        </div>
      </div>

      {/* Main Order Header Banner */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4A857] font-semibold block mb-1">
          Portail Numérique des Convives
        </span>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl text-[#F3E5AB] tracking-tight">
          Invitation & Billet Officiel
        </h1>
        <p className="text-xs sm:text-sm text-[#F3E5AB]/80 mt-1">
          Commande <strong className="text-gold-bright">{order.id}</strong> • Titulaire : {order.customerName}
        </p>
      </div>

      {/* ================= ÉTAT : EN ATTENTE ================= */}
      {isPending && (
        <LuxuryFrame className="p-8 sm:p-12 rounded-2xl border-2 border-[#D4A857]/60 bg-gradient-to-b from-[#2E1218]/70 to-[#150608] text-center max-w-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="w-16 h-16 rounded-full border border-[#D4A857] bg-[#1F0B10] flex items-center justify-center text-[#E8C98A] mx-auto mb-6 shadow-lg">
            <Clock className="w-8 h-8 animate-pulse text-[#D4A857]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#B88934]/20 border border-[#D4A857] text-xs font-bold uppercase tracking-widest text-[#F3E5AB] mb-3">
            Paiement en cours de vérification
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#F9F5EC] font-semibold mb-3">
            Ton versement est en cours de traitement
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md mx-auto mb-6">
            Notre équipe de conciergerie procède actuellement à la réconciliation de ta transaction Mobile Money. Dès réception, tes QR codes d'accès officiels seront activés sur cette page.
          </p>

          {/* Details summary */}
          <div className="p-4 rounded-xl border border-[#D4A857]/20 bg-[#120507] text-left max-w-md mx-auto space-y-2 text-xs mb-8">
            <div className="flex justify-between">
              <span className="text-stone-400">Code Commande :</span>
              <span className="font-bold text-[#E8C98A]">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Formule :</span>
              <span className="text-stone-200">{order.quantity}x {order.tierId.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Montant attendu :</span>
              <span className="font-bold text-[#E8C98A]">{order.totalAmount} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Numéro payeur renseigné :</span>
              <span className="text-stone-200">{order.payerPhone}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#20ba59] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter la conciergerie</span>
            </a>

            <button
              onClick={() => handleStatusToggle('validated')}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#D4A857] text-[#E8C98A] hover:bg-[#D4A857]/20 text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Simuler la validation immédiate
            </button>
          </div>
        </LuxuryFrame>
      )}

      {/* ================= ÉTAT : REFUSÉ ================= */}
      {isRejected && (
        <div className="p-8 rounded-2xl border border-red-500/50 bg-[#150608] text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-red-200 font-semibold mb-2">
            Réservation Non Validée
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed mb-6">
            {order.notes || "Le versement Mobile Money correspondant n'a pas pu être identifié."}
          </p>
          <a
            href={whatsappUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs uppercase font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Régulariser sur WhatsApp</span>
          </a>
        </div>
      )}

      {/* ================= ÉTAT : VALIDÉ ================= */}
      {isValidated && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* Notification banner */}
          <div className="p-4 rounded-xl border border-[#D4A857]/50 bg-[#170709]/80 max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#D4A857] shrink-0" />
              <div className="text-xs text-left">
                <span className="font-bold text-[#E8C98A] block">
                  Paiement Confirmé • Billets Officiels Activés
                </span>
                <span className="text-stone-300">
                  {order.tickets.length} invitation(s) individuelle(s) prête(s) pour le contrôle d'accès.
                </span>
              </div>
            </div>
            {order.paymentReference && (
              <span className="hidden sm:inline text-xs uppercase font-mono px-2 py-1 rounded bg-[#120507] border border-[#D4A857]/30 text-[#D4A857]">
                Réf: {order.paymentReference}
              </span>
            )}
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs text-center max-w-md mx-auto animate-bounce">
              ✓ Génération du document PDF pour {downloadSuccess} en cours...
            </div>
          )}

          {/* LIST OF ISSUED TICKETS (Chacun avec son QR Code, nom, type, numéro 1/3, 2/3, etc.) */}
          <div className="space-y-12">
            {order.tickets.map((tkt, idx) => (
              <LuxuryTicketCard
                key={tkt.ticketNumber}
                ticket={tkt}
                order={order}
                onDownload={() => handleDownloadPdf(tkt.ticketNumber)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface LuxuryTicketCardProps {
  ticket: Order['tickets'][0];
  order: Order;
  onDownload: () => void;
}

const LuxuryTicketCard: React.FC<LuxuryTicketCardProps> = ({
  ticket,
  order,
  onDownload,
}) => {
  return (
    <div className="relative rounded-2xl border-2 border-[#D4A857] bg-gradient-to-br from-[#0F0405] via-[#3E030B] to-[#0F0405] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(212,168,87,0.25)] overflow-hidden max-w-3xl mx-auto print:shadow-none print:border-black">
      {/* Decorative inner frame */}
      <div className="absolute inset-2 border border-[#D4A857]/30 rounded-xl pointer-events-none" />

      {/* Concave scallops in the ticket corners */}
      <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-[#1F0B10] border border-[#D4A857]" />
      <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#1F0B10] border border-[#D4A857]" />
      <div className="absolute -bottom-3 -left-3 w-7 h-7 rounded-full bg-[#1F0B10] border border-[#D4A857]" />
      <div className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-[#1F0B10] border border-[#D4A857]" />

      <div className="p-6 sm:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Gala info, Attendee, Seat Tier */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4A857] text-[#150608] font-bold text-xs uppercase tracking-wider">
              {ticket.tierName}
            </span>
            <span className="text-xs font-mono text-[#E8C98A]">
              Billet {ticket.ticketIndex} / {ticket.totalTickets}
            </span>
          </div>

          <div>
            <span className="font-script text-3xl sm:text-4xl text-gold-gradient block">
              {GALA_INFO.name}
            </span>
            <p className="text-xs uppercase tracking-[0.12em] text-[#D4A857] font-semibold">
              {GALA_INFO.edition} • Kinshasa
            </p>
          </div>

          <div className="space-y-1 pt-1 border-t border-[#D4A857]/20">
            <span className="text-xs uppercase tracking-wider text-stone-400 block">
              Nom du Convive :
            </span>
            <p className="font-serif text-xl sm:text-2xl text-[#F9F5EC] font-semibold">
              {ticket.attendeeName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#E8C98A]/90">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 block">Date & Heure</span>
              <p className="font-semibold text-stone-200">{GALA_INFO.dateText}</p>
              <p className="text-xs text-[#D4A857]">{GALA_INFO.timeText}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 block">Lieu de Réception</span>
              <p className="font-semibold text-stone-200">Pullman Grand Hôtel</p>
              <p className="text-xs text-[#D4A857]">Salon Congo</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A857]" />
            <span>Code de Sécurité : <strong className="font-mono text-[#E8C98A]">{ticket.securityCode}</strong></span>
          </div>
        </div>

        {/* Separator Line (Dashed ticket stub effect) */}
        <div className="hidden md:flex flex-col items-center justify-between h-48 border-r-2 border-dashed border-[#D4A857]/40 px-2" />

        {/* Right Side: QR Code, Wax Seal & Download Action */}
        <div className="flex flex-col items-center justify-center space-y-4 shrink-0 text-center">
          {/* Individual QR Code for this ticket */}
          <div className="relative group">
            <QRCodeSvg value={ticket.qrPayload} size={150} />
            <div className="text-xs font-mono text-[#D4A857] mt-1.5 uppercase">
              {ticket.ticketNumber}
            </div>
          </div>

          {/* Download PDF CTA Button */}
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4A857] via-[#F3E5AB] to-[#D4A857] text-[#150608] font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(212,168,87,0.7)] transition-all transform hover:scale-[1.02] cursor-pointer print:hidden"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger le PDF</span>
          </button>
        </div>
      </div>

      {/* Ticket Footer Ribbon */}
      <div className="bg-[#120507] px-6 py-2.5 border-t border-[#D4A857]/20 flex items-center justify-between text-xs text-[#D4A857]/90">
        <span>Dress Code impératif : Black Tie & Touche d'Or</span>
        <span>Invitation nominative et non transférable sans accord</span>
      </div>
    </div>
  );
};
