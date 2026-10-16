import React from 'react';
import { AdminPermission } from '../../types';
import {
  ArtAccount,
  ArtAddOrder,
  ArtBackup,
  ArtContent,
  ArtFollowUp,
  ArtHistory,
  ArtInvite,
  ArtScan,
  ArtScanLink,
  ArtSendLink,
  ArtSettings,
  ArtValidate,
} from './AdminIllustrations';

// Tutos de la console. Dans les étapes, [[Texte]] s'affiche comme un bouton de l'interface.

export type HelpTab = 'orders' | 'scanner' | 'content' | 'settings' | 'team';
export type HelpCategory = 'Commandes' | 'Entrée' | 'Site' | 'Équipe' | 'Mon compte';

export interface Tutorial {
  id: string;
  title: string;
  summary: string;
  category: HelpCategory;
  /** Droit nécessaire ('manager' = admin n°1 et super admin) */
  perm?: AdminPermission | 'manager';
  minutes: number;
  Art: React.FC;
  steps: string[];
  warning?: string;
  tip?: string;
  goto?: { tab: HelpTab; label: string };
}

export const TUTORIALS: Tutorial[] = [
  {
    id: 'ajouter-commande',
    title: 'Ajouter une commande reçue sur WhatsApp',
    summary: 'Le client t\'a écrit : en un copier-coller, sa commande apparaît dans la console.',
    category: 'Commandes',
    perm: 'orders',
    minutes: 1,
    Art: ArtAddOrder,
    steps: [
      'Sur WhatsApp, appuie longuement sur le message du client puis copie-le en entier.',
      'Dans la console, ouvre [[Commandes]] puis clique sur [[Ajouter une commande]].',
      'Reste sur l\'onglet [[Depuis WhatsApp]] et colle le message dans le cadre.',
      'Vérifie le nom, le nombre de billets et le total qui s\'affichent, puis clique sur [[Ajouter la commande]].',
    ],
    tip: 'Le client n\'a pas utilisé le site ? Choisis l\'onglet [[À la main]] et remplis son nom, son numéro et le nombre de billets.',
    goto: { tab: 'orders', label: 'Ouvrir les commandes' },
  },
  {
    id: 'valider-paiement',
    title: 'Valider un paiement',
    summary: 'Quand l\'argent est bien arrivé, tu valides : le lien d\'invitations du client est créé.',
    category: 'Commandes',
    perm: 'validate',
    minutes: 1,
    Art: ArtValidate,
    steps: [
      'Ouvre ton compte Mobile Money et vérifie que le paiement est bien arrivé (montant et numéro).',
      'Dans [[Commandes]], filtre sur [[En attente]] et repère le client.',
      'Clique sur [[Valider]]. Tu peux noter la référence du SMS de paiement (facultatif).',
      'Clique sur [[Paiement reçu : générer le lien]]. Le lien d\'invitations du client est prêt.',
    ],
    warning: 'Ne valide jamais sur une simple capture d\'écran envoyée par le client : vérifie toujours dans ton compte Mobile Money.',
    goto: { tab: 'orders', label: 'Voir les commandes en attente' },
  },
  {
    id: 'envoyer-lien',
    title: 'Envoyer ses invitations au client',
    summary: 'Le client reçoit un lien qui ouvre ses billets avec leur QR code.',
    category: 'Commandes',
    perm: 'orders',
    minutes: 1,
    Art: ArtSendLink,
    steps: [
      'Juste après la validation, clique sur [[Envoyer le lien sur WhatsApp]] : le message est déjà écrit avec le lien.',
      'Plus tard, retrouve le lien depuis [[Commandes]] avec le bouton [[Lien client]] d\'une commande validée.',
      'Tu peux aussi [[Copier]] le lien pour l\'envoyer autrement (SMS, e-mail).',
      'Pour voir exactement ce que le client verra, clique sur [[Voir comme le client]].',
    ],
    tip: 'Une personne a payé pour plusieurs invités ? Depuis son lien, elle pourra envoyer à chacun son invitation.',
    goto: { tab: 'orders', label: 'Ouvrir les commandes' },
  },
  {
    id: 'relancer-refuser',
    title: 'Relancer ou refuser une commande',
    summary: 'Un client n\'a pas encore payé ? Relance-le. Le paiement n\'arrive pas ? Refuse.',
    category: 'Commandes',
    perm: 'validate',
    minutes: 1,
    Art: ArtFollowUp,
    steps: [
      'Dans [[Commandes]], sur une commande en attente, clique sur [[Relancer]] : un message poli s\'ouvre dans WhatsApp.',
      'Si le paiement n\'arrive pas, clique sur [[Refuser]] puis confirme.',
      'Erreur ? Sur une commande refusée, [[Remettre en attente]] la fait revenir.',
    ],
    tip: 'Chaque relance, refus ou validation est noté dans l\'historique avec le nom de la personne qui l\'a fait.',
    goto: { tab: 'orders', label: 'Ouvrir les commandes' },
  },
  {
    id: 'scanner',
    title: 'Contrôler les entrées avec la caméra',
    summary: 'Le jour J, scanne le QR code de chaque invitation : vert, la personne entre.',
    category: 'Entrée',
    perm: 'scanner',
    minutes: 2,
    Art: ArtScan,
    steps: [
      'Ouvre [[Contrôle d\'entrée]] sur ton téléphone, puis touche [[Activer la caméra]] et autorise la caméra.',
      'Vise le QR code de l\'invitation (sur téléphone ou imprimée) : la vérification est automatique.',
      'Vert « Billet valide » : la personne entre. Touche [[Convive suivant]].',
      'Rouge « Billet déjà utilisé » : quelqu\'un est déjà entré avec ce billet. L\'heure du premier passage s\'affiche.',
      'Orange « Commande non validée » ou « Billet inconnu » : envoie la personne vers l\'équipe à l\'accueil.',
    ],
    tip: 'Le QR code ne passe pas (écran cassé, lumière) ? Tape le numéro du billet, par exemple TKT-0001-01, puis [[Vérifier le billet]].',
    warning: 'La caméra ne marche que sur le site en ligne (adresse en https), pas en test sur ton réseau local.',
    goto: { tab: 'scanner', label: 'Ouvrir le contrôle d\'entrée' },
  },
  {
    id: 'lien-scan',
    title: 'Donner un accès « scanner seul » à un contrôleur',
    summary: 'Un lien par personne à l\'entrée : elle scanne, sans voir les commandes ni l\'argent.',
    category: 'Entrée',
    perm: 'manager',
    minutes: 2,
    Art: ArtScanLink,
    steps: [
      'Ouvre [[Équipe & accès]], puis la partie « Liens de contrôle d\'entrée ».',
      'Écris le nom ou le poste (ex. Porte A – Jean) et clique sur [[Créer le lien]].',
      'Clique sur [[Envoyer]] pour lui envoyer le lien sur WhatsApp, avec les explications.',
      'Vérifie la date [[Valable jusqu\'au]] : par défaut, le lien s\'arrête le lendemain de l\'événement.',
      'Un souci ? [[Désactiver]] coupe le lien immédiatement.',
    ],
    tip: 'Chaque lien compte ses entrées : tu sais combien de personnes sont passées par chaque porte.',
    goto: { tab: 'team', label: 'Ouvrir Équipe & accès' },
  },
  {
    id: 'inviter-admin',
    title: 'Inviter un admin et choisir ses droits',
    summary: 'Ajoute quelqu\'un à l\'équipe : il choisit lui-même son code, toi tu choisis ce qu\'il peut faire.',
    category: 'Équipe',
    perm: 'manager',
    minutes: 2,
    Art: ArtInvite,
    steps: [
      'Ouvre [[Équipe & accès]] et clique sur [[Inviter un admin]].',
      'Écris son nom et coche ce qu\'il pourra faire (Commandes, Valider les paiements, Contrôle d\'entrée…).',
      'Clique sur [[Créer le lien d\'invitation]], puis [[Envoyer sur WhatsApp]].',
      'La personne ouvre le lien, découvre son identifiant et choisit son code. Le lien ne marche qu\'une fois, pendant 24 h.',
      'Tu peux changer ses droits à tout moment en touchant les pastilles sous son nom.',
    ],
    tip: 'Il a perdu l\'adresse de la console ? [[Envoyer l\'accès]] lui renvoie l\'adresse et son identifiant (jamais son code).',
    warning: 'Pour supprimer quoi que ce soit, un admin doit avoir l\'accord de l\'admin n°1 (son code est demandé).',
    goto: { tab: 'team', label: 'Ouvrir Équipe & accès' },
  },
  {
    id: 'contenu',
    title: 'Modifier un texte ou une image du site',
    summary: 'Titres, programme, FAQ, partenaires… tout se change sans toucher au code.',
    category: 'Site',
    perm: 'content',
    minutes: 2,
    Art: ArtContent,
    steps: [
      'Ouvre [[Contenu du site]] et choisis la partie à modifier dans la liste (ex. Billets, Programme, FAQ).',
      'Change le texte directement dans le champ : c\'est enregistré tout seul.',
      'Pour une image, clique sur le cadre de l\'image et choisis une photo sur ton appareil.',
      'Clique sur [[Voir le site]] pour vérifier le résultat.',
    ],
    tip: '[[Exporter]] télécharge tout le contenu : pratique pour le copier sur un autre appareil avec [[Importer]].',
    goto: { tab: 'content', label: 'Ouvrir le contenu du site' },
  },
  {
    id: 'ventes',
    title: 'Ouvrir ou fermer les ventes',
    summary: 'Billetterie, compte à rebours et sections du site : tout se règle par des interrupteurs.',
    category: 'Site',
    perm: 'settings',
    minutes: 1,
    Art: ArtSettings,
    steps: [
      'Ouvre [[Réglages]].',
      '[[Ventes ouvertes]] : coupe-le quand c\'est complet. Les clients voient « Les ventes sont fermées ».',
      'Dans « Compte à rebours de la billetterie », choisis la date de fin des ventes.',
      'Laisse [[Fermer les ventes automatiquement]] activé : à zéro, les ventes se ferment toutes seules.',
      'Dans « Sections du site », masque ou affiche une partie de la page (ex. Dress code).',
    ],
    goto: { tab: 'settings', label: 'Ouvrir les réglages' },
  },
  {
    id: 'sauvegarde',
    title: 'Sauvegarder les commandes',
    summary: 'Une copie de sécurité, à faire régulièrement : elle se réimporte en un clic.',
    category: 'Site',
    perm: 'settings',
    minutes: 1,
    Art: ArtBackup,
    steps: [
      'Ouvre [[Réglages]], partie « Sauvegarde des commandes ».',
      'Clique sur [[Télécharger la sauvegarde]] : un fichier .json arrive dans tes téléchargements.',
      'Range-le dans un endroit sûr (Google Drive, clé USB…).',
      'Pour récupérer les commandes, clique sur [[Importer une sauvegarde]] et choisis ce fichier.',
    ],
    warning: 'Tant que la base de données n\'est pas branchée, les commandes sont seulement dans ce navigateur : sans sauvegarde, vider le navigateur les efface.',
    goto: { tab: 'settings', label: 'Ouvrir les réglages' },
  },
  {
    id: 'historique',
    title: 'Lire l\'historique de l\'équipe',
    summary: 'Qui a validé, refusé, modifié ou scanné quoi, et quand. Avec le détail.',
    category: 'Équipe',
    perm: 'manager',
    minutes: 1,
    Art: ArtHistory,
    steps: [
      'Ouvre [[Équipe & accès]] et descends jusqu\'à « Historique des actions ».',
      'Choisis une personne dans la liste pour ne voir que ses actions.',
      'Cherche un numéro de commande (ex. GALA-0012), un nom ou un mot comme « droits » ou « scan ».',
      'Sous chaque action, le détail : ce qui a été ajouté (vert), retiré (rouge), l\'avant → après.',
    ],
    goto: { tab: 'team', label: 'Voir l\'historique' },
  },
  {
    id: 'compte',
    title: 'Me connecter, me déconnecter, code oublié',
    summary: 'Ton identifiant + ton code. Personne d\'autre ne connaît ton code.',
    category: 'Mon compte',
    minutes: 1,
    Art: ArtAccount,
    steps: [
      'Pour entrer : ouvre l\'adresse de la console, tape ton identifiant (ex. christelle) et ton code.',
      'Pour sortir : [[Se déconnecter]], en bas du menu (sur téléphone : touche le rond avec tes initiales).',
      'La console se déconnecte aussi toute seule après 30 minutes sans activité.',
      'Code oublié ? Demande à l\'admin n°1 : il t\'envoie un lien pour en choisir un nouveau.',
    ],
    warning: 'Après 5 codes faux, la console se bloque 5 minutes sur l\'appareil : c\'est une protection.',
  },
];

// Listes à cocher pour préparer l'événement
export interface ChecklistGroup {
  id: string;
  title: string;
  hint: string;
  items: { id: string; text: string; perm?: AdminPermission | 'manager' }[];
}

export const CHECKLISTS: ChecklistGroup[] = [
  {
    id: 'j30',
    title: 'Un mois avant',
    hint: 'Lancer les ventes',
    items: [
      { id: 'textes', text: 'Relire les textes du site (date, lieu, horaires, prix)', perm: 'content' },
      { id: 'whatsapp', text: 'Vérifier le numéro WhatsApp qui reçoit les commandes', perm: 'content' },
      { id: 'ventes', text: 'Ouvrir les ventes et régler la fin de la billetterie', perm: 'settings' },
      { id: 'equipe', text: 'Inviter les admins et choisir leurs droits', perm: 'manager' },
      { id: 'test', text: 'Faire une commande test de bout en bout (commande → validation → lien)', perm: 'orders' },
    ],
  },
  {
    id: 'j7',
    title: 'Une semaine avant',
    hint: 'Préparer l\'entrée',
    items: [
      { id: 'attente', text: 'Traiter toutes les commandes en attente (valider ou relancer)', perm: 'validate' },
      { id: 'liens', text: 'Créer un lien de scan par contrôleur et le leur envoyer', perm: 'manager' },
      { id: 'essai-scan', text: 'Tester le scan avec un vrai téléphone sur le site en ligne', perm: 'scanner' },
      { id: 'sauvegarde', text: 'Télécharger une sauvegarde des commandes', perm: 'settings' },
      { id: 'rappel', text: 'Rappeler aux clients d\'enregistrer leur billet sur leur téléphone', perm: 'orders' },
    ],
  },
  {
    id: 'jourj',
    title: 'Le jour J',
    hint: 'À l\'entrée',
    items: [
      { id: 'batterie', text: 'Téléphones des contrôleurs chargés (et une batterie externe)', perm: 'scanner' },
      { id: 'reseau', text: 'Connexion Internet vérifiée à l\'entrée de la salle', perm: 'scanner' },
      { id: 'fermer', text: 'Fermer les ventes à l\'heure prévue', perm: 'settings' },
      { id: 'accueil', text: 'Une personne de l\'équipe à l\'accueil pour les cas difficiles', perm: 'manager' },
      { id: 'sauvegarde-fin', text: 'Après l\'événement : dernière sauvegarde, puis désactiver les liens de scan', perm: 'manager' },
    ],
  },
];
