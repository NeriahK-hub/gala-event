import {
  GalaInfo,
  TicketTier,
  ProgramItem,
  GuestArtist,
  GalleryItem,
  FaqItem,
  PartnerSponsor,
  MobileMoneyAccount,
  Order
} from '../types';

export const GALA_INFO: GalaInfo = {
  name: "Le Grand Gala Royal",
  edition: "Cinquième Édition Anniversaire",
  theme: "L'Élégance Céleste & L'Or Noir",
  slogan: "Une nuit où le prestige rencontre l'art et la musique.",
  dateText: "Samedi 19 Décembre 2026",
  timeText: "19h30 — 03h30",
  isoDate: "2026-12-19T19:30:00",
  venueName: "Pullman Grand Hôtel Kinshasa",
  venueRoom: "Salon Congo & Jardins Royaux",
  venueAddress: "4 Avenue Batetela, Gombe",
  city: "Kinshasa, RDC",
  organizersName: "Empire Informatique",
  organizersBio: "Équipe organisatrice du Grand Gala Royal, dédiée au rayonnement de l'art de vivre, de la culture et de la réussite à Kinshasa et à travers le monde.",
  whatsappNumber: "+243820000147",
  contactEmail: "concierge@gala-royal-kinshasa.com",
  instagram: "@legrandgalaroyal",
  keyStats: [
    { value: "450", label: "Invités d'Honneur", desc: "Décideurs, artistes & personnalités" },
    { value: "5 Services", label: "Dîner Gastronomique", desc: "Signé par une cheffe étoilée" },
    { value: "18 Musiciens", label: "Orchestre Symphonique", desc: "Cordes, cuivres & opéra lyrique" },
    { value: "Vème", label: "Édition de Légende", desc: "Le sommet du raffinement congolais" },
  ],
  dressCode: {
    title: "Black Tie & Touche d'Or",
    subtitle: "Haute Couture & Tenue d'Apparat",
    description: "Une soirée royale demande une tenue à la hauteur. Inspire-toi du bordeaux, de l'or et des soieries précieuses.",
    colors: [
      { name: "Bordeaux Royal", hex: "#7A0815", desc: "La noblesse et la passion" },
      { name: "Bordeaux Sombre", hex: "#4D040E", desc: "La profondeur impériale" },
      { name: "Or Satiné", hex: "#D4A857", desc: "L'éclat céleste du prestige" },
      { name: "Crème d'Ivoire", hex: "#E8C98A", desc: "La douceur et la pureté" },
      { name: "Noir Velours", hex: "#161616", desc: "L'élégance intemporelle" },
    ],
    womenGuidelines: "Robes de soirée longues au sol, drapés de velours, taffetas ou soies précieuses. Parures dorées ou diamants. Étole, gants d'opéra en satin doré recommandés.",
    menGuidelines: "Smoking noir de coupe impeccable ou veste bordeaux en velours palatial. Chemise de soirée plastronnée, nœud papillon en soie naturelle et souliers vernis."
  }
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'standard',
    name: 'Billet Standard',
    price: 50,
    subtitle: "L'Accès Prestige",
    description: "Vis une soirée d'exception avec accès au cocktail de bienvenue, au grand spectacle et au bal dansant.",
    capacityPerTicket: 1,
    availableCount: 78,
    perks: [
      "Accueil au Tapis Rouge & Photocall officiel",
      "Coupe de bienvenue & cocktail dînatoire raffiné",
      "Placement assis en salle de spectacle",
      "Accès intégral au concert lyrique & performances",
      "Ouverture du Bal Royal & soirée dansante",
      "Vestiaire d'honneur surveillé inclus"
    ]
  },
  {
    id: 'vip',
    name: 'Billet VIP Privilège',
    price: 120,
    subtitle: "L'Expérience Impériale",
    description: "Le sommet du confort : placement premier rang, dîner gastronomique 5 services et champagne à discrétion.",
    highlighted: true,
    badge: "Le Plus Prisé",
    capacityPerTicket: 1,
    availableCount: 22,
    perks: [
      "Entrée coupe-file Tapis Rouge VIP exclusive",
      "Table d'honneur avec vue panoramique sur scène",
      "Dîner Gastronomique 5 Services avec accords mets & vins",
      "Champagne millésimé servi à discrétion",
      "Service voiturier privé & stationnement réservé",
      "Coffret cadeau souvenir numéroté d'artisanat d'or",
      "Accès au salon privé des artistes & invités d'honneur"
    ]
  },
  {
    id: 'table',
    name: 'Table Prestige (8 Convives)',
    price: 800,
    subtitle: "Pour Cercles & Entreprises d'Élite",
    description: "Une table royale privative pour 8 convives avec maître d'hôtel dédié et champagne Grand Cru.",
    badge: "Exclusivité Royale",
    capacityPerTicket: 8,
    availableCount: 5,
    perks: [
      "Table royale privative réservée au nom de ton entreprise ou de ta famille",
      "Maître d'hôtel & sommelier dédiés à ta table toute la nuit",
      "Dîner Gastronomique 5 services pour les 8 convives",
      "3 bouteilles de Champagne Grand Cru & spiritueux rares",
      "Service voiturier VIP pour les 8 véhicules",
      "Mention d'honneur dans le livret de gala & visibilité partenaires",
      "Séance photo privée avec les artistes et personnalités"
    ]
  }
];

export const PROGRAM_TIMELINE: ProgramItem[] = [
  {
    id: 'p1',
    time: '19:00',
    title: 'Arrivée Impériale & Tapis Rouge',
    description: 'Accueil des convives sous la voûte lumineuse. Photocall haute couture, fanfare de cuivres d\'honneur et premières flûtes de champagne millésimé.',
    category: 'Accueil'
  },
  {
    id: 'p2',
    time: '20:00',
    title: 'Cocktail d\'Ouverture & Quatuor Royal',
    description: 'Amuse-bouches d\'art culinaire congolais revisité, déambulation parmi les sculptures éphémères et sonates jouées par le Quatuor à Cordes de Kinshasa.',
    category: 'Cocktail'
  },
  {
    id: 'p3',
    time: '21:00',
    title: 'Le Dîner Gastronomique en 5 Actes',
    description: 'Ouverture des portes du Salon Congo. Dégustation d\'un banquet féerique préparé par la Cheffe Marcelle Ntumba, avec accords de grands crus de Bourgogne et Bordeaux.',
    category: 'Gastronomie'
  },
  {
    id: 'p4',
    time: '22:30',
    title: 'Le Grand Spectacle Lyrique & Rumba Symphonique',
    description: 'Une fusion magique et inédite : le Ténor Élysée Kinkela et 18 musiciens réinventent les grands airs d\'opéra et les chefs-d\'œuvre du patrimoine musical congolais.',
    category: 'Spectacle'
  },
  {
    id: 'p5',
    time: '23:45',
    title: 'Cérémonie des Prix de l\'Excellence Kinshasa',
    description: 'Remise solennelle des Trophées d\'Or distinguant 5 figures emblématiques de l\'entrepreneuriat, des arts et de la philanthropie en Afrique.',
    category: 'Distinction'
  },
  {
    id: 'p6',
    time: '00:30',
    title: 'Le Bal de Minuit & Célébration Dansante',
    description: 'Ouverture traditionnelle de la valse viennoise et de la rumba royale, suivie d\'un DJ Set d\'ambiance chic jusqu\'aux premières lueurs du jour.',
    category: 'Bal Royal'
  }
];

export const GUEST_ARTISTS: GuestArtist[] = [
  {
    id: 'art-1',
    name: 'Patricia Malela',
    role: 'Maîtresse de Cérémonie',
    title: 'Journaliste & Égérie de Mode',
    bio: 'Voix et présence incontournable des grands événements culturels panafricains, réputée pour sa grâce et sa diction incomparable.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'art-2',
    name: 'Élysée Kinkela',
    role: 'Ténor & Soliste Lyrique',
    title: 'Étoile de l\'Opéra de Kinshasa',
    bio: 'Premier ténor congolais ayant foulé les scènes européennes, il sublime la rencontre entre chant classique et émotions du fleuve.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'art-3',
    name: 'The Kinshasa Royal Strings',
    role: 'Orchestre Symphonique',
    title: 'Ensemble Instrumental Philharmonique',
    bio: '18 virtuoses des cordes et des vents combinant partitions classiques et mélodies intemporelles du fleuve Congo.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'art-4',
    name: 'Cheffe Marcelle Ntumba',
    role: 'Cheffe Étoilée & Créatrice Culinaire',
    title: 'Haute Gastronomie Africaine',
    bio: 'Pionnière de la gastronomie inventive à Kinshasa et Paris, elle compose pour le gala un menu impérial inédit en 5 actes.',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'La Grande Table des Ambassadeurs',
    caption: 'Argenterie étincelante, compositions florales pourpres et candélabres dorés au Salon Congo.',
    category: 'Décors',
    imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'gal-2',
    title: 'L\'Élégance du Tapis Rouge',
    caption: 'Les convives immortalisés dans leurs plus somptueuses tenues Black Tie et velours bordeaux.',
    category: 'Ambiance',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'gal-3',
    title: 'Le Quatuor Symphonique en Harmonie',
    caption: 'Notes envoûtantes de violons et violoncelles sous les lustres de cristal de Bohême.',
    category: 'Spectacle',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'gal-4',
    title: 'Le Toast au Champagne Millésimé',
    caption: 'Célébration du rayonnement culturel et économique au cours de la Vème Édition.',
    category: 'Cocktail',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'gal-5',
    title: 'La Remise du Trophée de l\'Excellence',
    caption: 'Couronnement des lauréats sous les ovations de l\'assemblée et faisceaux dorés.',
    category: 'Distinction',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'gal-6',
    title: 'Le Bal de Minuit sous les Étoiles',
    caption: 'Tournoiement des robes de bal et valse solennelle pour clore la soirée dans l\'apothéose.',
    category: 'Soirée',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85'
  }
];

export const PARTNERS_SPONSORS: PartnerSponsor[] = [
  { id: 'sp-1', name: 'Rawbank Prestige', category: 'Banque Officielle', logoText: 'RAWBANK PRESTIGE' },
  { id: 'sp-2', name: 'Maison Taittinger', category: 'Champagne d\'Honneur', logoText: 'CHAMPAGNE TAITTINGER' },
  { id: 'sp-3', name: 'Pullman Grand Hôtel', category: 'Hôte Hospitalité', logoText: 'PULLMAN KINSHASA' },
  { id: 'sp-4', name: 'Vodacom M-Pesa Premium', category: 'Paiement Mobile', logoText: 'M-PESA PREMIER' },
  { id: 'sp-5', name: 'Airtel Money VIP', category: 'Paiement Mobile', logoText: 'AIRTEL MONEY' },
  { id: 'sp-6', name: 'Kinshasa Life Magazine', category: 'Partenaire Média', logoText: 'KINSHASA LIFE' },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Comment effectuer le règlement de mon billet par Mobile Money ?',
    answer: 'La procédure est simple et instantanée : choisis ta formule de billet sur le site, remplis ton nom et tes coordonnées, puis tu reçois notre numéro Mobile Money officiel (M-Pesa, Airtel Money ou Orange Money). Effectue le transfert du montant exact depuis ton téléphone, puis transmets le code de transaction par WhatsApp. Notre équipe valide ta commande sous 15 minutes.'
  },
  {
    id: 'faq-2',
    question: 'Comment vais-je recevoir mon billet et son QR Code officiel ?',
    answer: 'Dès validation de ton paiement par l\'équipe, ton billet numérique sécurisé est généré avec un QR Code unique haute sécurité. Tu le reçois directement sur WhatsApp et tu peux également le télécharger en format PDF haute définition sur cette plateforme via ton code de commande personnel.'
  },
  {
    id: 'faq-3',
    question: 'Puis-je commander plusieurs billets en une seule fois ?',
    answer: 'Absolument ! Lors de la sélection, ajuste la quantité souhaitée (+ / -). Chaque billet de ta commande disposera de son propre QR Code individuel (ex: Billet 1/3, 2/3, 3/3) nominatif que tu pourras partager individuellement avec tes accompagnateurs.'
  },
  {
    id: 'faq-4',
    question: 'Que faire si je paie depuis le numéro d\'un tiers ou d\'un agent ?',
    answer: 'C\'est prévu ! Le formulaire comporte un champ spécifique « Numéro qui va envoyer l\'argent ». Indique-y simplement le numéro exact émetteur du transfert Mobile Money afin que nos contrôleurs puissent réconcilier ton versement en toute sérénité.'
  },
  {
    id: 'faq-5',
    question: 'Que faire si je perds mon billet ou mon code de commande ?',
    answer: 'Ne t\'inquiète pas : munis-toi de ton nom et du numéro de téléphone utilisé lors de la réservation, puis contacte notre conciergerie WhatsApp (+243 82 000 0147). Ton invitation te sera renvoyée instantanément sans aucun frais.'
  },
  {
    id: 'faq-6',
    question: 'Le Dress Code est-il obligatoire pour accéder au Gala ?',
    answer: 'Oui, le dress code « Black Tie & Touche d\'Or » est strictement requis. Robes longues de gala pour les dames et smoking ou costume sombre avec nœud papillon pour les messieurs. Les baskets et tenues décontractées ne seront pas admises à l\'entrée pour préserver la magie du cadre.'
  }
];

export const MOBILE_MONEY_ACCOUNTS: MobileMoneyAccount[] = [
  {
    name: 'Vodacom M-Pesa',
    operator: 'M-Pesa',
    number: '+243 82 999 8888',
    holder: 'LE CERCLE EXCELLENCE SARL',
    instructions: 'Composer *1122# > Envoi d\'argent > Vers le numéro +243 82 999 8888'
  },
  {
    name: 'Airtel Money',
    operator: 'Airtel',
    number: '+243 99 888 7777',
    holder: 'LE CERCLE EXCELLENCE SARL',
    instructions: 'Composer *501# > Transfert d\'argent > Vers le numéro +243 99 888 7777'
  },
  {
    name: 'Orange Money',
    operator: 'Orange',
    number: '+243 89 777 6666',
    holder: 'LE CERCLE EXCELLENCE SARL',
    instructions: 'Composer *144# > Envoi d\'argent > Vers le numéro +243 89 777 6666'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'GALA-0147',
    createdAt: '2026-10-06 14:22',
    customerName: 'Princesse Kalubi Banza',
    customerEmail: 'kalubi.banza@prestige.cd',
    customerPhone: '+243 81 555 1234',
    payerPhone: '+243 81 555 1234',
    tierId: 'vip',
    quantity: 2,
    unitPrice: 120,
    totalAmount: 240,
    status: 'validated',
    paymentReference: 'MPESA-88492021',
    validatedAt: '2026-10-06 14:35',
    tickets: [
      {
        ticketNumber: 'TKT-0147-01',
        ticketIndex: 1,
        totalTickets: 2,
        tierId: 'vip',
        tierName: 'Billet VIP Privilège',
        attendeeName: 'Princesse Kalubi Banza',
        securityCode: 'VIP-7789-A',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0147-01|VIP|KALUBI-BANZA|VALID',
        scanned: false
      },
      {
        ticketNumber: 'TKT-0147-02',
        ticketIndex: 2,
        totalTickets: 2,
        tierId: 'vip',
        tierName: 'Billet VIP Privilège',
        attendeeName: 'Invité de Princesse Kalubi',
        securityCode: 'VIP-7789-B',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0147-02|VIP|GUEST-BANZA|VALID',
        scanned: true,
        scannedAt: '19:42:10',
        scannedBy: 'Contrôleur Porte Nord 1'
      }
    ]
  },
  {
    id: 'GALA-0148',
    createdAt: '2026-10-07 09:15',
    customerName: 'Christian Mwamba Kapinga',
    customerEmail: 'c.mwamba@katangagroup.org',
    customerPhone: '+243 82 444 9876',
    payerPhone: '+243 89 123 4567', // Different payer phone
    tierId: 'standard',
    quantity: 3,
    unitPrice: 50,
    totalAmount: 150,
    status: 'pending',
    tickets: [
      {
        ticketNumber: 'TKT-0148-01',
        ticketIndex: 1,
        totalTickets: 3,
        tierId: 'standard',
        tierName: 'Billet Standard',
        attendeeName: 'Christian Mwamba Kapinga',
        securityCode: 'STD-1123-A',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0148-01|STD|MWAMBA-C|PENDING',
        scanned: false
      },
      {
        ticketNumber: 'TKT-0148-02',
        ticketIndex: 2,
        totalTickets: 3,
        tierId: 'standard',
        tierName: 'Billet Standard',
        attendeeName: 'Accompagnateur 1 - Mwamba',
        securityCode: 'STD-1123-B',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0148-02|STD|MWAMBA-G1|PENDING',
        scanned: false
      },
      {
        ticketNumber: 'TKT-0148-03',
        ticketIndex: 3,
        totalTickets: 3,
        tierId: 'standard',
        tierName: 'Billet Standard',
        attendeeName: 'Accompagnateur 2 - Mwamba',
        securityCode: 'STD-1123-C',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0148-03|STD|MWAMBA-G2|PENDING',
        scanned: false
      }
    ]
  },
  {
    id: 'GALA-0149',
    createdAt: '2026-10-07 11:40',
    customerName: 'Groupe Rawbank Direction',
    customerEmail: 'direction.relations@rawbank.cd',
    customerPhone: '+243 99 777 0001',
    payerPhone: '+243 99 777 0001',
    tierId: 'table',
    quantity: 1,
    unitPrice: 800,
    totalAmount: 800,
    status: 'validated',
    paymentReference: 'AIRTEL-77291039',
    validatedAt: '2026-10-07 12:05',
    tickets: [
      {
        ticketNumber: 'TKT-0149-01',
        ticketIndex: 1,
        totalTickets: 1,
        tierId: 'table',
        tierName: 'Table Prestige (8 Convives)',
        attendeeName: 'Table Privative Rawbank Direction',
        securityCode: 'TBL-8800-ROYAL',
        qrPayload: 'GALA-ROYAL-KIN-2026|TKT-0149-01|TABLE|RAW-BANK-DIR|VALID',
        scanned: false
      }
    ]
  },
  {
    id: 'GALA-0150',
    createdAt: '2026-10-07 13:00',
    customerName: 'Serge Lukusa',
    customerEmail: 's.lukusa@gmail.com',
    customerPhone: '+243 85 111 2233',
    payerPhone: '+243 85 111 2233',
    tierId: 'vip',
    quantity: 1,
    unitPrice: 120,
    totalAmount: 120,
    status: 'rejected',
    notes: 'Référence Mobile Money non trouvée après 48h de relance',
    tickets: []
  }
];
