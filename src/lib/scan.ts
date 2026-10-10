import { IssuedTicket, Order } from '../types';

export type ScanOutcome =
  | { kind: 'valid'; ticket: IssuedTicket; order: Order; time: string }
  | { kind: 'already_used'; ticket: IssuedTicket; order: Order }
  | { kind: 'not_validated'; ticket: IssuedTicket; order: Order }
  | { kind: 'unknown'; code: string };

const nowTime = () => new Date().toTimeString().slice(0, 8);

/**
 * Vérifie un code scanné (QR « numéro|code de sécurité », numéro seul ou code seul) dans le carnet de commandes.
 * Si le billet est valide, renvoie aussi la commande mise à jour (billet marqué « scanné » par `scannedBy`).
 */
export const checkTicket = (
  raw: string,
  orders: Order[],
  scannedBy: string
): { outcome: ScanOutcome; updatedOrder?: Order } | null => {
  const q = raw.trim().toLowerCase();
  if (!q) return null;
  const parts = q.split(/[|\s]+/).filter(Boolean);
  const all = orders.flatMap((order) => order.tickets.map((ticket) => ({ ticket, order })));
  const found = all.find(({ ticket }) => {
    const num = ticket.ticketNumber.toLowerCase();
    const code = ticket.securityCode.toLowerCase();
    const hasNum = parts.includes(num);
    const hasCode = parts.includes(code);
    // Si le QR donne les deux, ils doivent correspondre au même billet (anti-falsification)
    if (hasNum && parts.some((p) => /^[a-z]{3,5}-\d{4}-[a-z]$/.test(p))) return hasCode;
    return hasNum || hasCode || ticket.qrPayload.toLowerCase() === q;
  });

  if (!found) return { outcome: { kind: 'unknown', code: raw.trim() } };
  const { ticket, order } = found;
  if (order.status !== 'validated') return { outcome: { kind: 'not_validated', ticket, order } };
  if (ticket.scanned) return { outcome: { kind: 'already_used', ticket, order } };

  const time = nowTime();
  const updatedOrder: Order = {
    ...order,
    tickets: order.tickets.map((t) => (t.ticketNumber === ticket.ticketNumber ? { ...t, scanned: true, scannedAt: time, scannedBy } : t)),
  };
  return { outcome: { kind: 'valid', ticket, order: updatedOrder, time }, updatedOrder };
};
