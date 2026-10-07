import { IssuedTicket, Order, TicketTierId } from '../types';

// Sans serveur, les données voyagent dans le texte :
//  - la commande du client voyage dans le message WhatsApp (« code de commande »),
//  - les invitations voyagent dans le lien que l'admin envoie au client.
// Le contrôle à l'entrée reste l'autorité : un billet fabriqué à la main ne figure pas dans la liste de l'admin.

const toBase64Url = (text: string): string => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (token: string): string => {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/** Texte encodé dans le QR code d'un billet (court, donc facile à scanner) */
export const makeQrPayload = (ticketNumber: string, securityCode: string) => `${ticketNumber}|${securityCode}`;

/* ---------- Commande du client → message WhatsApp → admin ---------- */

interface OrderRequest {
  i: string; // id commande
  n: string; // nom
  p: string; // téléphone
  e?: string; // e-mail
  t: TicketTierId;
  q: number;
  u: number; // prix unitaire
  c: string; // date de création
}

export const encodeOrderRequest = (order: Order): string => {
  const req: OrderRequest = {
    i: order.id,
    n: order.customerName,
    p: order.customerPhone,
    e: order.customerEmail || undefined,
    t: order.tierId,
    q: order.quantity,
    u: order.unitPrice,
    c: order.createdAt,
  };
  return toBase64Url(JSON.stringify(req));
};

/** Cherche un code de commande dans un message collé (ou le code seul) et reconstruit la commande */
export const decodeOrderRequest = (
  text: string,
  tierName: (id: TicketTierId) => string
): Order | null => {
  const match = text.match(/(?:Code\s*commande\s*:\s*)?([A-Za-z0-9_-]{40,})\s*$/m) ?? text.match(/([A-Za-z0-9_-]{40,})/);
  if (!match) return null;
  try {
    const r = JSON.parse(fromBase64Url(match[1])) as OrderRequest;
    if (!r.i || !r.n || !r.q) return null;
    return buildOrder({
      id: r.i,
      name: r.n,
      phone: r.p,
      email: r.e,
      tierId: r.t,
      quantity: r.q,
      unitPrice: r.u,
      createdAt: r.c,
      tierName: tierName(r.t),
    });
  } catch {
    return null;
  }
};

/* ---------- Construction d'une commande + billets ---------- */

interface BuildOrderInput {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tierId: TicketTierId;
  tierName: string;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
}

const randomCode = () => Math.floor(1000 + Math.random() * 9000);

export const buildOrder = (i: BuildOrderInput): Order => {
  const suffix = i.id.replace(/^GALA-/, '');
  const tickets: IssuedTicket[] = Array.from({ length: i.quantity }, (_, idx) => {
    const ticketNumber = `TKT-${suffix}-${String(idx + 1).padStart(2, '0')}`;
    const securityCode = `${i.tierId.slice(0, 3).toUpperCase()}-${randomCode()}-${String.fromCharCode(65 + idx)}`;
    return {
      ticketNumber,
      ticketIndex: idx + 1,
      totalTickets: i.quantity,
      tierId: i.tierId,
      tierName: i.tierName,
      attendeeName: idx === 0 ? i.name : `Invité de ${i.name} (${idx + 1}/${i.quantity})`,
      securityCode,
      qrPayload: makeQrPayload(ticketNumber, securityCode),
      scanned: false,
    };
  });

  return {
    id: i.id,
    createdAt: i.createdAt ?? new Date().toISOString().replace('T', ' ').substring(0, 16),
    customerName: i.name,
    customerEmail: i.email ?? '',
    customerPhone: i.phone,
    payerPhone: i.phone,
    tierId: i.tierId,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    totalAmount: i.unitPrice * i.quantity,
    status: 'pending',
    tickets,
  };
};

export const newOrderId = () => `GALA-${Date.now().toString(36).slice(-5).toUpperCase()}`;

/* ---------- Lien d'invitations admin → client ---------- */

interface TicketToken {
  v: 1;
  i: string; // commande
  n: string; // titulaire
  t: TicketTierId;
  tn: string; // nom du billet
  a: number; // total
  r?: string; // référence de paiement
  k: [string, string, string][]; // [numéro, code de sécurité, nom du porteur]
}

export const buildTicketLink = (order: Order, baseUrl = window.location.origin + window.location.pathname): string => {
  const token: TicketToken = {
    v: 1,
    i: order.id,
    n: order.customerName,
    t: order.tierId,
    tn: order.tickets[0]?.tierName ?? '',
    a: order.totalAmount,
    r: order.paymentReference || undefined,
    k: order.tickets.map((t) => [t.ticketNumber, t.securityCode, t.attendeeName]),
  };
  return `${baseUrl}?billet=${toBase64Url(JSON.stringify(token))}`;
};

/** Reconstruit une commande « validée » à partir du lien reçu par le client */
export const decodeTicketToken = (token: string): Order | null => {
  try {
    const d = JSON.parse(fromBase64Url(token)) as TicketToken;
    if (d.v !== 1 || !d.i || !Array.isArray(d.k) || d.k.length === 0) return null;
    const tickets: IssuedTicket[] = d.k.map(([ticketNumber, securityCode, attendeeName], idx) => ({
      ticketNumber,
      ticketIndex: idx + 1,
      totalTickets: d.k.length,
      tierId: d.t,
      tierName: d.tn,
      attendeeName,
      securityCode,
      qrPayload: makeQrPayload(ticketNumber, securityCode),
      scanned: false,
    }));
    return {
      id: d.i,
      createdAt: '',
      customerName: d.n,
      customerEmail: '',
      customerPhone: '',
      payerPhone: '',
      tierId: d.t,
      quantity: d.k.length,
      unitPrice: d.k.length ? d.a / d.k.length : 0,
      totalAmount: d.a,
      status: 'validated',
      paymentReference: d.r,
      tickets,
    };
  } catch {
    return null;
  }
};

/* ---------- Billets déjà débloqués sur cet appareil ---------- */

const MY_TICKETS_KEY = 'gala-my-tickets-v1';

export const loadMyTickets = (): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(MY_TICKETS_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export const saveMyTicket = (token: string) => {
  try {
    const list = loadMyTickets().filter((t) => t !== token);
    localStorage.setItem(MY_TICKETS_KEY, JSON.stringify([token, ...list].slice(0, 20)));
  } catch {
    // stockage indisponible : le lien reste utilisable
  }
};
