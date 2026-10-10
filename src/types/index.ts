export type TicketTierId = 'standard' | 'vip' | 'table';

export interface TicketTier {
  id: TicketTierId;
  name: string;
  price: number;
  subtitle: string;
  description: string;
  perks: string[];
  badge?: string;
  highlighted?: boolean;
  availableCount: number;
  capacityPerTicket: number; // e.g. 1 for standard/vip, 8 for table
}

export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: string;
}

export interface GuestArtist {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PartnerSponsor {
  id: string;
  name: string;
  category: string;
  logoText: string;
  /** Logo ou image de la structure (lien ou image importée) */
  logoUrl?: string;
  tagline?: string;
}

export interface MobileMoneyAccount {
  name: string;
  operator: string;
  number: string;
  holder: string;
  instructions: string;
}

export type OrderStatus = 'pending' | 'validated' | 'rejected';

export interface IssuedTicket {
  ticketNumber: string; // e.g. TKT-0147-01
  ticketIndex: number; // e.g. 1
  totalTickets: number; // e.g. 2
  tierId: TicketTierId;
  tierName: string;
  attendeeName: string;
  securityCode: string;
  qrPayload: string;
  scanned: boolean;
  scannedAt?: string;
  scannedBy?: string;
}

export interface Order {
  id: string; // e.g. GALA-0147
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  payerPhone: string; // "Si tu paies depuis un autre numéro"
  tierId: TicketTierId;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  paymentReference?: string; // SMS ref MPESA-XXXX
  validatedAt?: string;
  notes?: string;
  tickets: IssuedTicket[];
}

export interface GalaInfo {
  name: string;
  edition: string;
  theme: string;
  slogan: string;
  dateText: string;
  timeText: string;
  isoDate: string;
  venueName: string;
  venueRoom: string;
  venueAddress: string;
  city: string;
  organizersName: string;
  organizersBio: string;
  whatsappNumber: string;
  contactEmail: string;
  instagram: string;
  keyStats: {
    value: string;
    label: string;
    desc: string;
  }[];
  dressCode: {
    title: string;
    subtitle: string;
    description: string;
    colors: { name: string; hex: string; desc: string }[];
    womenGuidelines: string;
    menGuidelines: string;
  };
}

export interface SiteSettings {
  /** Billetterie ouverte : si false, la réservation affiche un message « ventes fermées » */
  salesOpen: boolean;
  /** Identifiants des sections de la vitrine masquées */
  hiddenSections: string[];
  /** Fin de la billetterie (compte à rebours), format AAAA-MM-JJTHH:MM */
  salesDeadline: string;
  /** Ferme automatiquement les ventes quand le compte à rebours arrive à zéro */
  autoCloseSales: boolean;
}

export interface SiteContent {
  settings: SiteSettings;
  galaInfo: GalaInfo;
  texts: Record<string, string>;
  tiers: TicketTier[];
  program: ProgramItem[];
  guests: GuestArtist[];
  gallery: GalleryItem[];
  faq: FaqItem[];
  sponsors: PartnerSponsor[];
}

// ===== Équipe : comptes admin, liens de scan, historique =====

/** super = concepteur du site, owner = admin n°1 (organisateur), admin = admins 2, 3… */
export type AdminRole = 'super' | 'owner' | 'admin';

/** Droits qu'un admin n°1 peut cocher pour un admin de son équipe */
export type AdminPermission = 'orders' | 'validate' | 'scanner' | 'content' | 'settings';

export interface AdminAccount {
  id: string;
  name: string;
  /** Identifiant de connexion (ex. « christelle ») : on se connecte avec identifiant + code */
  login: string;
  role: AdminRole;
  permissions: AdminPermission[];
  codeHash: string;
  active: boolean;
  createdAt: string;
  createdBy?: string;
}

/** Lien de contrôle d'entrée (?scan=…) attribué à une personne : il ne permet que de scanner */
export interface ScanLink {
  id: string;
  label: string;
  token: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
  scanCount: number;
  lastUsedAt?: string;
  /** Après cette date (AAAA-MM-JJTHH:MM), le lien ne marche plus */
  expiresAt?: string;
}

/** Lien personnel à usage unique : créer son compte (invitation) ou choisir un nouveau code (réinitialisation) */
export interface AdminInvite {
  id: string;
  token: string;
  kind: 'invite' | 'reset';
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  /** Compte concerné (réinitialisation) */
  accountId?: string;
  createdAt: string;
  createdBy: string;
  /** Horodatage (ms) de fin de validité */
  expiresAt: number;
  usedAt?: string;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  /** Compte qui a fait l'action (sert à masquer les actions du super admin aux autres) */
  actorId?: string;
  action: string;
  /** Détails : ce qui a changé exactement (avant → après, droits ajoutés/retirés…) */
  details?: string[];
}
