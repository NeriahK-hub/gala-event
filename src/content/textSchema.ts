// Tous les textes de la page, modifiables depuis l'admin (onglet « Contenu du site »).
// Pour ajouter un texte : ajoute une ligne ici, puis utilise t('ta.clef') dans le composant.

export interface TextField {
  key: string;
  section: string;
  label: string;
  value: string; // valeur par défaut
  multiline?: boolean;
}

export const TEXT_SECTIONS: { id: string; label: string }[] = [
  { id: 'nav', label: 'Menu & en-tête' },
  { id: 'hero', label: 'Accueil (hero)' },
  { id: 'countdown', label: 'Compte à rebours' },
  { id: 'about', label: 'Le gala' },
  { id: 'program', label: 'Programme' },
  { id: 'guests', label: 'Invités & artistes' },
  { id: 'tickets', label: 'Billets' },
  { id: 'dresscode', label: 'Dress code' },
  { id: 'gallery', label: 'Galerie' },
  { id: 'venue', label: 'Le lieu' },
  { id: 'sponsors', label: 'Partenaires' },
  { id: 'faq', label: 'Questions fréquentes' },
  { id: 'contact', label: 'Équipe & contact' },
  { id: 'footer', label: 'Pied de page' },
];

const f = (
  key: string,
  section: string,
  label: string,
  value: string,
  multiline = false
): TextField => ({ key, section, label, value, multiline });

export const TEXT_FIELDS: TextField[] = [
  // Menu
  f('nav.about', 'nav', 'Lien « Le gala »', 'Le gala'),
  f('nav.program', 'nav', 'Lien « Programme »', 'Programme'),
  f('nav.tickets', 'nav', 'Lien « Billets »', 'Billets'),
  f('nav.gallery', 'nav', 'Lien « Galerie »', 'Galerie'),
  f('nav.contact', 'nav', 'Lien « Contact »', 'Contact'),
  f('nav.brand', 'nav', 'Nom à côté du logo', 'Gala Empire Informatique'),
  f('nav.cta', 'nav', 'Bouton du menu', 'Réserver'),
  f('nav.ctaMobile', 'nav', 'Bouton du menu mobile', 'Réserver mon billet'),

  // Hero
  f('hero.titleScript', 'hero', 'Titre — mot en écriture manuscrite', 'Anniversaire'),
  f('hero.titleMain', 'hero', 'Titre — gros texte blanc', 'Empire Informatique'),
  f('hero.titleBadge', 'hero', 'Titre — ruban', 'Soirée gala'),
  f('hero.priceLabel', 'hero', 'Libellé du prix', 'Le billet'),
  f('hero.cta', 'hero', 'Bouton principal', 'Réserver mon billet'),
  f('hero.scroll', 'hero', 'Lien « Découvrir »', 'Découvrir la soirée'),

  // Compte à rebours
  f('countdown.kicker', 'countdown', 'Titre', 'Le compte à rebours est lancé'),
  f('countdown.note', 'countdown', 'Phrase sous le compte à rebours', 'Billet à 10 $ seulement. Réserve le tien dès maintenant.'),
  f('countdown.days', 'countdown', 'Libellé « Jours »', 'Jours'),
  f('countdown.hours', 'countdown', 'Libellé « Heures »', 'Heures'),
  f('countdown.minutes', 'countdown', 'Libellé « Minutes »', 'Minutes'),
  f('countdown.seconds', 'countdown', 'Libellé « Secondes »', 'Secondes'),

  // Le gala
  f('about.kicker', 'about', 'Petit titre', 'Le gala'),
  f('about.title', 'about', 'Titre', 'Un anniversaire, une grande soirée'),
  f('about.p1', 'about', 'Paragraphe 1 (mis en avant)', 'Empire Informatique célèbre son anniversaire à Kinshasa avec une conférence et une grande soirée gala.', true),
  f('about.p2', 'about', 'Paragraphe 2', 'Pour participer à la soirée gala, un seul billet : 10 $. Tu commandes en ligne, tu finalises le paiement avec l\'équipe sur WhatsApp, puis tu reçois ton lien d\'invitations avec QR code.', true),
  f('about.p3', 'about', 'Paragraphe 3', 'Organisée en partenariat avec l\'Université de Kinshasa, la soirée se vit en tenue élégante : sors ton plus beau look.', true),

  // Programme
  f('program.kicker', 'program', 'Petit titre', 'Le déroulé'),
  f('program.title', 'program', 'Titre', 'Au programme'),
  f('program.subtitle', 'program', 'Sous-titre', 'Une conférence, puis la grande soirée gala.', true),

  // Invités
  f('guests.kicker', 'guests', 'Petit titre', 'Sur scène'),
  f('guests.title', 'guests', 'Titre', 'Invités d\'honneur & artistes'),
  f('guests.subtitle', 'guests', 'Sous-titre', 'Les personnalités et les talents qui feront vibrer la soirée.', true),
  f('guests.badge', 'guests', 'Mention en bas de chaque carte', 'Prestation exclusive'),

  // Billets
  f('tickets.kicker', 'tickets', 'Petit titre', 'Billetterie officielle'),
  f('tickets.title', 'tickets', 'Titre', 'Réserve ton billet'),
  f('tickets.subtitle', 'tickets', 'Sous-titre', 'Un seul billet à 10 $ pour la soirée gala. Tu commandes ici, tu paies avec l\'équipe sur WhatsApp, et tes invitations s\'ouvrent grâce à un lien.', true),
  f('tickets.perksLabel', 'tickets', 'Titre de la liste d\'avantages', 'Ce qui est inclus'),
  f('tickets.cta', 'tickets', 'Bouton de chaque billet', 'Réserver ce billet'),
  f('tickets.remaining', 'tickets', 'Mention places restantes (après le nombre)', 'places restantes'),
  f('tickets.perPerson', 'tickets', 'Mention « par personne »', 'Par personne'),
  f('tickets.perTable', 'tickets', 'Mention « par table »', 'Par table (8 pers.)'),

  // Dress code
  f('dresscode.kicker', 'dresscode', 'Petit titre', 'Dress code'),
  f('dresscode.paletteLabel', 'dresscode', 'Titre du nuancier', 'Les couleurs de la soirée'),
  f('dresscode.womenTitle', 'dresscode', 'Titre colonne 1', 'Pour elles'),
  f('dresscode.menTitle', 'dresscode', 'Titre colonne 2', 'Pour eux'),
  f('dresscode.note', 'dresscode', 'Note en bas', 'La tenue est vérifiée à l\'entrée. Merci de t\'y conformer.', true),

  // Galerie
  f('gallery.kicker', 'gallery', 'Petit titre', 'En images'),
  f('gallery.title', 'gallery', 'Titre', 'Affiches & souvenirs'),
  f('gallery.subtitle', 'gallery', 'Sous-titre', 'L\'univers visuel de la soirée.', true),

  // Lieu
  f('venue.kicker', 'venue', 'Petit titre', 'Infos pratiques'),
  f('venue.title', 'venue', 'Titre', 'Lieu & informations'),
  f('venue.cardTitle', 'venue', 'Titre de la carte', 'Tout ce qu\'il faut savoir'),
  f('venue.cardText', 'venue', 'Texte de la carte', 'Le lieu précis et les horaires seront communiqués très bientôt aux détenteurs de billets. Une question ? Appelle-nous, on te répond.', true),
  f('venue.info1.title', 'venue', 'Info 1 — titre', 'Horaires'),
  f('venue.info1.text', 'venue', 'Info 1 — texte', 'Communiqués prochainement.', true),
  f('venue.info2.title', 'venue', 'Info 2 — titre', 'Billet'),
  f('venue.info2.text', 'venue', 'Info 2 — texte', 'Ton billet numérique avec QR code est demandé à l\'entrée.', true),
  f('venue.info3.title', 'venue', 'Info 3 — titre', 'Tenue'),
  f('venue.info3.text', 'venue', 'Info 3 — texte', 'Tenue de soirée élégante exigée.', true),
  f('venue.info4.title', 'venue', 'Info 4 — titre', 'Contact'),
  f('venue.info4.text', 'venue', 'Info 4 — texte', 'Appelle ou écris sur WhatsApp au +243 994 047 745.', true),
  f('venue.mapName', 'venue', 'Nom sur la carte', 'Kinshasa, RDC'),
  f('venue.mapAddress', 'venue', 'Adresse sur la carte', 'Lieu à confirmer'),
  f('venue.district', 'venue', 'Quartier', 'Université de Kinshasa × Empire Informatique'),
  f('venue.gpsLabel', 'venue', 'Libellé du lien GPS', 'Voir Kinshasa'),
  f('venue.gpsUrl', 'venue', 'Lien Google Maps', 'https://maps.google.com/?q=Kinshasa'),

  // Partenaires
  f('sponsors.title', 'sponsors', 'Titre', 'Partenaires & collaborateurs'),

  // FAQ
  f('faq.kicker', 'faq', 'Petit titre', 'Aide'),
  f('faq.title', 'faq', 'Titre', 'Questions fréquentes'),
  f('faq.subtitle', 'faq', 'Sous-titre', 'L\'essentiel pour réserver ton billet.', true),

  // Contact
  f('contact.kicker', 'contact', 'Petit titre', 'Organisation'),
  f('contact.whatsapp', 'contact', 'Bouton WhatsApp', 'Écrire sur WhatsApp'),
  f('contact.whatsappMessage', 'contact', 'Message WhatsApp pré-rempli', 'Bonjour, j\'aimerais des informations sur la soirée gala d\'anniversaire d\'Empire Informatique.', true),
  f('contact.email', 'contact', 'Bouton e-mail', 'Envoyer un e-mail'),
  f('contact.extra', 'contact', 'Autres numéros', 'Autres contacts : +243 827 201 290 / 820 700 248'),
  f('contact.cities', 'contact', 'Villes', 'Kinshasa, RDC'),
  f('contact.presentedBy', 'contact', 'Mention « organisé par »', 'Organisé par'),

  // Footer
  f('footer.linkHome', 'footer', 'Lien « Accueil »', 'Accueil'),
  f('footer.linkAbout', 'footer', 'Lien « Le gala »', 'Le gala'),
  f('footer.linkProgram', 'footer', 'Lien « Programme »', 'Programme'),
  f('footer.linkTickets', 'footer', 'Lien « Billetterie »', 'Billetterie'),
  f('footer.linkGallery', 'footer', 'Lien « Galerie »', 'Galerie'),
  f('footer.linkMyTickets', 'footer', 'Lien « Mes billets »', 'Mes billets'),
  f('footer.copyright', 'footer', 'Mention de droits (après l\'année et le nom)', 'Tous droits réservés.'),
  f('footer.staff', 'footer', 'Lien équipe', 'Accès équipe & contrôle'),
];

export const DEFAULT_TEXTS: Record<string, string> = Object.fromEntries(
  TEXT_FIELDS.map((x) => [x.key, x.value])
);
