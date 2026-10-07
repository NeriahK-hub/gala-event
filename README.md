# Le Grand Gala Royal — Kinshasa

Site officiel et billetterie du Grand Gala Royal : présentation de la soirée, réservation de billets avec paiement Mobile Money, billets à QR code et console d'administration pour l'équipe.

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

## Limites actuelles

- Pas de backend : les commandes et les modifications de contenu restent dans le navigateur.
- L'espace équipe n'a pas d'authentification : à protéger avant une mise en ligne publique.
