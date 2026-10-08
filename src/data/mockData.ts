import {
  GalaInfo,
  TicketTier,
  ProgramItem,
  GuestArtist,
  GalleryItem,
  FaqItem,
  PartnerSponsor,
  Order
} from '../types';

export const GALA_INFO: GalaInfo = {
  name: "Anniversaire Empire Informatique",
  edition: "Université de Kinshasa × Empire Informatique",
  theme: "Conférence & Soirée Gala",
  slogan: "Une soirée de gala pour célébrer l'anniversaire d'Empire Informatique.",
  dateText: "Samedi 12 décembre 2026",
  timeText: "Horaires à confirmer",
  isoDate: "2026-12-12T18:00:00",
  venueName: "Lieu communiqué prochainement",
  venueRoom: "",
  venueAddress: "",
  city: "Kinshasa, RDC",
  organizersName: "Empire Informatique",
  organizersBio: "Empire Informatique fête son anniversaire avec une conférence et une grande soirée gala à Kinshasa, en partenariat avec l'Université de Kinshasa.",
  whatsappNumber: "+243 994 047 745",
  contactEmail: "",
  instagram: "",
  keyStats: [
    { value: "10 $", label: "Le billet", desc: "Prix unique pour participer à la soirée gala" },
    { value: "12 déc.", label: "2026", desc: "Date de la soirée gala" },
    { value: "2", label: "Temps forts", desc: "Une conférence et une soirée gala" },
    { value: "Kinshasa", label: "RDC", desc: "Avec l'Université de Kinshasa" },
  ],
  dressCode: {
    title: "Tenue de soirée",
    subtitle: "Élégance en rouge, noir et or",
    description: "Pour la soirée gala, soigne ta tenue : costume ou robe de soirée, avec une touche de rouge ou d'or pour rester dans l'esprit de l'événement.",
    colors: [
      { name: "Rouge velours", hex: "#B10F1F", desc: "La couleur de la soirée" },
      { name: "Noir", hex: "#141414", desc: "L'élégance classique" },
      { name: "Or", hex: "#E8C98A", desc: "La touche de lumière" },
      { name: "Ivoire", hex: "#F5F1E8", desc: "La douceur" },
    ],
    womenGuidelines: "Robe de soirée longue ou élégante, accessoires dorés ou argentés. Le rouge est à l'honneur.",
    menGuidelines: "Costume sombre ou smoking, chemise soignée, cravate ou nœud papillon. Une touche de rouge est la bienvenue."
  }
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'standard',
    name: 'Billet Soirée Gala',
    price: 10,
    subtitle: "Prix unique",
    description: "Ton billet pour participer à la soirée gala d'anniversaire d'Empire Informatique.",
    highlighted: true,
    capacityPerTicket: 1,
    availableCount: 0,
    perks: [
      "Accès à la soirée gala",
      "Billet numérique avec QR code personnel",
      "Invitations débloquées par un lien, dès que ton paiement est confirmé",
    ]
  }
];

export const PROGRAM_TIMELINE: ProgramItem[] = [
  {
    id: 'p1',
    time: 'Partie 1',
    title: 'La conférence',
    description: "Un temps d'échanges et de partage pour l'anniversaire d'Empire Informatique. Les détails et les horaires seront communiqués prochainement.",
    category: 'Conférence'
  },
  {
    id: 'p2',
    time: 'Partie 2',
    title: 'La soirée gala',
    description: "La grande soirée de gala, en tenue élégante, pour célébrer l'anniversaire ensemble. Les détails et les horaires seront communiqués prochainement.",
    category: 'Soirée gala'
  }
];

// À compléter depuis l'admin (Contenu du site → Invités & artistes)
export const GUEST_ARTISTS: GuestArtist[] = [];

// À compléter depuis l'admin : importe tes affiches et photos (Contenu du site → Galerie)
export const GALLERY_ITEMS: GalleryItem[] = [];

export const PARTNERS_SPONSORS: PartnerSponsor[] = [
  { id: 'sp-1', name: 'Empire Informatique', category: 'Organisateur', logoText: 'Empire Informatique', logoUrl: '/logo-empire.png' },
  { id: 'sp-2', name: 'Université de Kinshasa', category: 'Partenaire', logoText: 'Université de Kinshasa', logoUrl: '/partners/universite-de-kinshasa.png' },
  { id: 'sp-3', name: 'Manasse Design', category: 'Design graphique', logoText: 'Manasse Design', logoUrl: '/partners/manasse-design.svg' },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Quand a lieu la soirée gala et combien coûte le billet ?',
    answer: "La soirée gala a lieu le samedi 12 décembre 2026 à Kinshasa. Le billet coûte 10 $ par personne. Le lieu et les horaires précis seront communiqués prochainement."
  },
  {
    id: 'faq-2',
    question: 'Comment réserver et payer mon billet ?',
    answer: "Choisis ton billet sur le site, remplis ton nom et ton numéro WhatsApp, puis envoie ta commande : WhatsApp s'ouvre avec un message déjà prêt. L'équipe t'explique comment payer et confirme ton paiement dans la conversation."
  },
  {
    id: 'faq-3',
    question: 'Comment vais-je recevoir mon billet ?',
    answer: "Une fois ton paiement confirmé, l'équipe t'envoie un lien sur WhatsApp. En cliquant dessus, tes invitations avec QR code s'affichent : tu peux les enregistrer ou les télécharger."
  },
  {
    id: 'faq-4',
    question: 'Puis-je commander plusieurs billets ?',
    answer: "Oui. Choisis la quantité souhaitée lors de la réservation : chaque billet a son propre QR code, que tu peux partager avec la personne qui vient avec toi."
  },
  {
    id: 'faq-5',
    question: 'Puis-je payer depuis le numéro de quelqu\'un d\'autre ?',
    answer: "Oui, aucun souci. Dis-le simplement à l'équipe dans la conversation WhatsApp pour qu'elle retrouve ton paiement."
  },
  {
    id: 'faq-6',
    question: 'J\'ai perdu mon lien d\'invitations, que faire ?',
    answer: "Écris-nous sur WhatsApp au +243 994 047 745 avec ton nom : nous te renvoyons ton lien."
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'GALA-0001',
    createdAt: '2026-10-06 14:22',
    customerName: 'Client démo 1',
    customerEmail: 'demo1@exemple.cd',
    customerPhone: '+243 81 000 0001',
    payerPhone: '+243 81 000 0001',
    tierId: 'standard',
    quantity: 2,
    unitPrice: 10,
    totalAmount: 20,
    status: 'validated',
    paymentReference: 'MPESA-00000001',
    validatedAt: '2026-10-06 14:35',
    tickets: [
      {
        ticketNumber: 'TKT-0001-01',
        ticketIndex: 1,
        totalTickets: 2,
        tierId: 'standard',
        tierName: 'Billet Soirée Gala',
        attendeeName: 'Client démo 1',
        securityCode: 'GALA-1001-A',
        qrPayload: 'EMPIRE-GALA-2026|TKT-0001-01|STD|DEMO-1|VALID',
        scanned: false
      },
      {
        ticketNumber: 'TKT-0001-02',
        ticketIndex: 2,
        totalTickets: 2,
        tierId: 'standard',
        tierName: 'Billet Soirée Gala',
        attendeeName: 'Invité de Client démo 1',
        securityCode: 'GALA-1001-B',
        qrPayload: 'EMPIRE-GALA-2026|TKT-0001-02|STD|DEMO-1B|VALID',
        scanned: true,
        scannedAt: '19:42:10',
        scannedBy: 'Contrôleur entrée 1'
      }
    ]
  },
  {
    id: 'GALA-0002',
    createdAt: '2026-10-07 09:15',
    customerName: 'Client démo 2',
    customerEmail: 'demo2@exemple.cd',
    customerPhone: '+243 82 000 0002',
    payerPhone: '+243 89 000 0003',
    tierId: 'standard',
    quantity: 3,
    unitPrice: 10,
    totalAmount: 30,
    status: 'pending',
    tickets: [1, 2, 3].map((i) => ({
      ticketNumber: `TKT-0002-0${i}`,
      ticketIndex: i,
      totalTickets: 3,
      tierId: 'standard' as const,
      tierName: 'Billet Soirée Gala',
      attendeeName: i === 1 ? 'Client démo 2' : `Accompagnateur ${i - 1}`,
      securityCode: `GALA-1002-${'ABC'[i - 1]}`,
      qrPayload: `EMPIRE-GALA-2026|TKT-0002-0${i}|STD|DEMO-2|PENDING`,
      scanned: false
    }))
  },
  {
    id: 'GALA-0003',
    createdAt: '2026-10-07 13:00',
    customerName: 'Client démo 3',
    customerEmail: 'demo3@exemple.cd',
    customerPhone: '+243 85 000 0004',
    payerPhone: '+243 85 000 0004',
    tierId: 'standard',
    quantity: 1,
    unitPrice: 10,
    totalAmount: 10,
    status: 'rejected',
    notes: 'Référence Mobile Money non trouvée',
    tickets: []
  }
];
