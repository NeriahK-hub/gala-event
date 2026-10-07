# CLAUDE.md

## À quoi sert l'app

« Le Grand Gala Royal – Kinshasa » : site officiel et billetterie d'un gala de luxe (Pullman Grand Hôtel Kinshasa, 19 décembre 2026). L'app (généré à l'origine avec Google AI Studio) regroupe :

- **Site vitrine** : hero avec enveloppe interactive, compte à rebours, programme, invités, billets, dress code, galerie, lieu, sponsors, FAQ, équipe/contact.
- **Réservation** : parcours de commande de billets (Standard, VIP, Table) avec paiement Mobile Money.
- **Mes billets** : billets personnalisés avec QR code et code de sécurité.
- **Espace équipe** : tableau de bord admin (validation des commandes, scan/validation des billets).

Pour l'instant tout est **côté client avec des données fictives** : pas de backend, pas de base de données, l'état est perdu au rechargement.

## Commandes

```bash
npm install        # installer les dépendances
npm run dev        # serveur de dev Vite sur http://localhost:3000 (host 0.0.0.0)
npm run lint       # vérification des types : tsc --noEmit (pas d'ESLint)
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
npm run clean      # supprime dist/ et server.js
```

Il n'y a pas de tests automatisés : valide avec `npm run lint` puis `npm run build`.

## Architecture

Stack : React 19 + TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`, styles dans `src/index.css`), `motion` pour les animations, `lucide-react` pour les icônes, `canvas-confetti`.

```
src/
  main.tsx            point d'entrée
  App.tsx             « routeur » maison + état global
  types/index.ts      types métier (Order, IssuedTicket, TicketTier, GalaInfo…)
  data/mockData.ts    toutes les données : GALA_INFO, billets, programme, FAQ, INITIAL_ORDERS…
  components/
    common/           Header, Footer, LuxuryFrame, WaxSeal, DevNavSwitcher
    vitrine/          une section de la page d'accueil par fichier
    reservation/      ReservationFlow
    tickets/          TicketViewPage, QRCodeSvg
    admin/            AdminDashboard
```

- **Pas de react-router** : `App.tsx` garde `activeView` (`vitrine | reservation | tickets | admin`) et affiche la vue correspondante.
- **État partagé dans `App.tsx`** : `orders` (initialisé avec `INITIAL_ORDERS`), `selectedOrderId`, `selectedTierId`. Les composants reçoivent données et callbacks (`onOrderCreated`, `onUpdateOrder`…) en props.
- `DevNavSwitcher` est un sélecteur flottant de démo pour passer d'une vue à l'autre.
- Alias `@` → racine du projet (`vite.config.ts`, `tsconfig.json`).
- Le contenu (textes, prix, dates) vit dans `mockData.ts` : modifie-le là plutôt que dans les composants.
- Thème visuel : bordeaux (`#5C0612`) et or (`#D4A857`), variables CSS dans `src/index.css`.
- Ne touche pas aux options `hmr` / `watch` de `vite.config.ts` (liées à AI Studio via `DISABLE_HMR`).

## Règles

- **Tous les textes visibles sont en français** (UI, messages d'erreur, contenus, données de démo).
- **Tutoiement** partout dans l'interface (« Si tu paies depuis un autre numéro », « Réserve ta place »), jamais de vouvoiement.
- **`GEMINI_API_KEY` ne doit jamais apparaître dans le code** : ni en dur, ni dans un commit, ni exposée au navigateur (pas de préfixe `VITE_`, pas de `define` Vite). Elle se configure dans `.env.local` (ignoré par git) ; `.env.example` ne contient qu'un placeholder. Tout appel à Gemini doit passer par un serveur (Express est déjà en dépendance), jamais directement depuis le front.
- Respecte le style existant : composants fonctionnels, types dans `src/types`, classes Tailwind, ambiance luxe bordeaux/or.
- Avant de conclure une modification : `npm run lint` doit passer.
