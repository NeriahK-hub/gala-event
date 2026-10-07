# Anniversaire Empire Informatique — Soirée Gala

Site officiel et billetterie de la soirée gala (Kinshasa, 12 décembre 2026) : présentation de la soirée, réservation de billets avec paiement Mobile Money, billets à QR code et console d'administration pour l'équipe.

Organisé par **Empire Informatique**.

## Lancer le projet

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Commande          | Rôle                                  |
| ----------------- | ------------------------------------- |
| `npm run dev`     | serveur de développement              |
| `npm run lint`    | vérification des types (TypeScript)   |
| `npm run build`   | build de production dans `dist/`      |
| `npm run preview` | prévisualiser le build                |

Ajoute `?demo` à l'adresse (`http://localhost:3000/?demo`) pour afficher le sélecteur de pages de démonstration.

## Modifier les textes sans toucher au code

Depuis le pied de page, ouvre **Accès équipe & contrôle**, puis l'onglet **Contenu du site** : tous les textes (de l'accueil au pied de page), les billets, le programme, les invités, la galerie, la FAQ, les partenaires et les numéros Mobile Money sont modifiables.

Les modifications sont enregistrées dans le navigateur. Utilise **Exporter** / **Importer** pour les sauvegarder ou les copier sur un autre appareil.

## Fonctionnement de la billetterie

1. Le client choisit son billet puis envoie sa commande : WhatsApp s'ouvre vers le numéro défini dans l'admin (Contenu du site → Équipe & contact), avec un message déjà prêt.
2. L'équipe échange avec le client et confirme le paiement.
3. Dans l'admin (Commandes → Ajouter une commande), colle le message du client, puis clique sur **Valider** : un **lien d'invitations** est généré.
4. Envoie ce lien au client (bouton WhatsApp) : en cliquant dessus, ses invitations avec QR code s'affichent.
5. À l'entrée, l'onglet **Contrôle d'entrée** vérifie chaque billet (valide, déjà utilisé, inconnu).

## Limites actuelles

- Pas de backend : les commandes et les modifications de contenu restent dans le navigateur de l'admin. Le contrôle d'entrée doit se faire depuis ce même appareil (les scans ne sont pas synchronisés entre appareils).
- L'espace équipe n'a pas d'authentification : à protéger avant une mise en ligne publique.
