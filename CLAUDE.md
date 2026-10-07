# CLAUDE.md

## À quoi sert l'app

« Anniversaire Empire Informatique – Soirée Gala » : site officiel et billetterie (Kinshasa, 12 décembre 2026, billet à 10 $, avec l'Université de Kinshasa). Contact billets : +243 994 047 745. L'app regroupe :

- **Site vitrine** : hero façon affiche (script + « EMPIRE INFORMATIQUE » + ruban + date/prix), compte à rebours, programme, invités, billets, dress code, galerie, lieu, sponsors, FAQ, équipe/contact.
- **Réservation** : parcours de commande de billets (Standard, VIP, Table) avec paiement Mobile Money.
- **Mes billets** : billets personnalisés avec QR code et code de sécurité.
- **Espace équipe** : tableau de bord admin (validation des commandes, scan/validation des billets).

Pour l'instant tout est **côté client** : pas de backend ni de base de données. Les commandes (données fictives) sont perdues au rechargement ; le contenu édité dans l'admin reste dans le `localStorage` du navigateur. L'espace équipe n'a pas d'authentification.

## Commandes

```bash
npm install        # installer les dépendances
npm run dev        # serveur de dev Vite sur http://localhost:3000 (host 0.0.0.0)
npm run lint       # vérification des types : tsc --noEmit (pas d'ESLint)
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
npm run clean      # supprime dist/
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
- **Contenu modifiable** : les textes, billets, programme, invités, galerie, FAQ, partenaires et numéros Mobile Money passent par `src/content/` (`ContentContext.tsx`, `textSchema.ts`). Les composants lisent `useContent()` (`t('clé')`, `content.xxx`) ; `mockData.ts` ne contient que les valeurs par défaut. Pour ajouter un texte modifiable : ajoute une ligne dans `textSchema.ts`, puis utilise `t('ta.clé')`. L'admin (onglet « Contenu du site ») l'édite et sauvegarde dans `localStorage`.
- **Admin** : `components/admin/` (`AdminDashboard` = coquille + vue d'ensemble + commandes, `ScannerPanel`, `ContentEditor`, `fields.tsx` = champs génériques).
- Logo de l'organisateur (Empire Informatique) : `public/logo-empire.png`, composant `EmpireLogo`. Icônes : uniquement `lucide-react` (pas d'emoji ni d'étincelles « IA »).
- Thème visuel : inspiré des affiches de l'événement — rideau de velours rouge (plis verticaux + vignette), texte blanc, accents orange (`#FFB43A`→`#F2761B`) et or (`#E8C98A`), découpes dorées aux bords (`PosterFrame`). La console admin garde un fond sombre neutre. Réglages dans `src/index.css`.

## Règles

- **Tous les textes visibles sont en français** (UI, messages d'erreur, contenus, données de démo).
- **Tutoiement** partout dans l'interface (« Si tu paies depuis un autre numéro », « Réserve ta place »), jamais de vouvoiement.
- **Aucune clé d'API (dont `GEMINI_API_KEY`) ne doit apparaître dans le code** : ni en dur, ni dans un commit, ni exposée au navigateur (pas de préfixe `VITE_`, pas de `define` Vite). Une clé se configure dans `.env.local` (ignoré par git) et tout appel à un service d'IA doit passer par un serveur, jamais directement depuis le front.
- Respecte le style existant : composants fonctionnels, types dans `src/types`, classes Tailwind, ambiance rouge velours / orange / or.
- Avant de conclure une modification : `npm run lint` doit passer.
