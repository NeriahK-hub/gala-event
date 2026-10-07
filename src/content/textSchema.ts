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
  f('nav.cta', 'nav', 'Bouton du menu', 'Réserver'),
  f('nav.ctaMobile', 'nav', 'Bouton du menu mobile', 'Réserver mon billet'),

  // Hero
  f('hero.cta', 'hero', 'Bouton principal', 'Réserver mon billet'),
  f('hero.envelopeHint', 'hero', 'Invitation à toucher l\'enveloppe', 'Touche l\'enveloppe pour découvrir ton invitation'),
  f('hero.envelopeHintOpen', 'hero', 'Texte quand l\'enveloppe est ouverte', 'Invitation ouverte • Touche pour refermer'),
  f('hero.scroll', 'hero', 'Lien « Découvrir »', 'Découvrir le gala'),
  f('hero.envelopeLabel', 'hero', 'Mot écrit sur l\'enveloppe', 'Vip'),
  f('hero.cardTagline', 'hero', 'Sous-titre de la carte d\'invitation', 'Kinshasa • 5ᵉ édition'),
  f('hero.cardText', 'hero', 'Texte de la carte d\'invitation', '« Nous avons l\'honneur de t\'inviter à une nuit de distinction : dîner gastronomique, musique live et élégance au cœur de Kinshasa. »', true),
  f('hero.cardCta', 'hero', 'Bouton de la carte', 'Réserver mon billet'),

  // Compte à rebours
  f('countdown.kicker', 'countdown', 'Titre', 'Le compte à rebours est lancé'),
  f('countdown.note', 'countdown', 'Phrase sous le compte à rebours', '450 places seulement. Réserve la tienne avant qu\'il ne soit trop tard.'),
  f('countdown.days', 'countdown', 'Libellé « Jours »', 'Jours'),
  f('countdown.hours', 'countdown', 'Libellé « Heures »', 'Heures'),
  f('countdown.minutes', 'countdown', 'Libellé « Minutes »', 'Minutes'),
  f('countdown.seconds', 'countdown', 'Libellé « Secondes »', 'Secondes'),

  // Le gala
  f('about.kicker', 'about', 'Petit titre', 'Le gala'),
  f('about.title', 'about', 'Titre', 'Une nuit d\'exception au cœur de Kinshasa'),
  f('about.p1', 'about', 'Paragraphe 1 (mis en avant)', 'Le Grand Gala Royal réunit la grandeur des traditions et l\'énergie créative du Congo d\'aujourd\'hui, le temps d\'une soirée inoubliable.', true),
  f('about.p2', 'about', 'Paragraphe 2', 'Pour cette cinquième édition, entrepreneurs, artistes, diplomates et leaders d\'opinion se retrouvent autour d\'un dîner gastronomique en cinq services, d\'un orchestre de 18 musiciens et d\'un grand bal de minuit.', true),
  f('about.p3', 'about', 'Paragraphe 3', 'Le cercle reste volontairement restreint, dans le cadre somptueux du Pullman Grand Hôtel : on vient ici pour les rencontres autant que pour le spectacle.', true),

  // Programme
  f('program.kicker', 'program', 'Petit titre', 'Le déroulé'),
  f('program.title', 'program', 'Titre', 'Ta soirée, heure par heure'),
  f('program.subtitle', 'program', 'Sous-titre', 'De l\'arrivée sur le tapis rouge au bal de minuit, chaque moment est pensé pour t\'émerveiller.', true),

  // Invités
  f('guests.kicker', 'guests', 'Petit titre', 'Sur scène'),
  f('guests.title', 'guests', 'Titre', 'Invités d\'honneur & artistes'),
  f('guests.subtitle', 'guests', 'Sous-titre', 'Les voix et les talents qui feront vibrer la soirée.', true),
  f('guests.badge', 'guests', 'Mention en bas de chaque carte', 'Prestation exclusive'),

  // Billets
  f('tickets.kicker', 'tickets', 'Petit titre', 'Billetterie officielle'),
  f('tickets.title', 'tickets', 'Titre', 'Choisis ta formule'),
  f('tickets.subtitle', 'tickets', 'Sous-titre', 'Trois façons de vivre la soirée. Tu paies par Mobile Money et tu reçois ton billet sur WhatsApp.', true),
  f('tickets.perksLabel', 'tickets', 'Titre de la liste d\'avantages', 'Ce qui est inclus'),
  f('tickets.cta', 'tickets', 'Bouton de chaque billet', 'Réserver ce billet'),
  f('tickets.remaining', 'tickets', 'Mention places restantes (après le nombre)', 'places restantes'),
  f('tickets.perPerson', 'tickets', 'Mention « par personne »', 'Par convive'),
  f('tickets.perTable', 'tickets', 'Mention « par table »', 'Par table (8 pers.)'),

  // Dress code
  f('dresscode.kicker', 'dresscode', 'Petit titre', 'Dress code'),
  f('dresscode.paletteLabel', 'dresscode', 'Titre du nuancier', 'Les couleurs à privilégier'),
  f('dresscode.womenTitle', 'dresscode', 'Titre colonne 1', 'Pour elles'),
  f('dresscode.menTitle', 'dresscode', 'Titre colonne 2', 'Pour eux'),
  f('dresscode.note', 'dresscode', 'Note en bas', 'Le dress code est vérifié dès l\'entrée. Merci de t\'y conformer pour préserver l\'ambiance de la soirée.', true),

  // Galerie
  f('gallery.kicker', 'gallery', 'Petit titre', 'Souvenirs'),
  f('gallery.title', 'gallery', 'Titre', 'Les éditions précédentes en images'),
  f('gallery.subtitle', 'gallery', 'Sous-titre', 'Un aperçu de l\'ambiance des galas passés.', true),

  // Lieu
  f('venue.kicker', 'venue', 'Petit titre', 'Le lieu'),
  f('venue.title', 'venue', 'Titre', 'Pullman Grand Hôtel Kinshasa'),
  f('venue.cardTitle', 'venue', 'Titre de la carte', 'Le Salon Congo, face au fleuve'),
  f('venue.cardText', 'venue', 'Texte de la carte', 'Une salle de réception d\'exception, à l\'acoustique remarquable et à la hauteur sous plafond majestueuse, avec un accès direct aux jardins.', true),
  f('venue.info1.title', 'venue', 'Info 1 — titre', 'Arrivée'),
  f('venue.info1.text', 'venue', 'Info 1 — texte', 'Portes dès 18h45. Début de la cérémonie à 19h30 précises.', true),
  f('venue.info2.title', 'venue', 'Info 2 — titre', 'Parking & voiturier'),
  f('venue.info2.text', 'venue', 'Info 2 — texte', 'Parking sécurisé de 300 places. Voiturier offert aux billets VIP.', true),
  f('venue.info3.title', 'venue', 'Info 3 — titre', 'Entrée'),
  f('venue.info3.text', 'venue', 'Info 3 — texte', 'Ton billet numérique (QR code) est demandé à l\'entrée.', true),
  f('venue.info4.title', 'venue', 'Info 4 — titre', 'Vestiaire'),
  f('venue.info4.text', 'venue', 'Info 4 — texte', 'Vestiaire gratuit et surveillé à l\'entrée du Salon.', true),
  f('venue.mapName', 'venue', 'Nom sur la carte', 'Pullman Kinshasa (Gombe)'),
  f('venue.mapAddress', 'venue', 'Adresse sur la carte', '4 Avenue Batetela'),
  f('venue.district', 'venue', 'Quartier', 'Quartier de la Gombe'),
  f('venue.gpsLabel', 'venue', 'Libellé du lien GPS', 'Ouvrir l\'itinéraire'),
  f('venue.gpsUrl', 'venue', 'Lien Google Maps', 'https://maps.google.com/?q=Pullman+Grand+Hotel+Kinshasa'),

  // Partenaires
  f('sponsors.title', 'sponsors', 'Titre', 'Ils soutiennent le gala'),

  // FAQ
  f('faq.kicker', 'faq', 'Petit titre', 'Aide'),
  f('faq.title', 'faq', 'Titre', 'Tes questions, nos réponses'),
  f('faq.subtitle', 'faq', 'Sous-titre', 'L\'essentiel pour réserver et profiter de ta soirée l\'esprit tranquille.', true),

  // Contact
  f('contact.kicker', 'contact', 'Petit titre', 'Organisation'),
  f('contact.whatsapp', 'contact', 'Bouton WhatsApp', 'Écrire sur WhatsApp'),
  f('contact.whatsappMessage', 'contact', 'Message WhatsApp pré-rempli', 'Bonjour, j\'ai une question sur le Grand Gala Royal.', true),
  f('contact.email', 'contact', 'Bouton e-mail', 'Envoyer un e-mail'),
  f('contact.cities', 'contact', 'Villes', 'Kinshasa • Paris • Bruxelles'),
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
