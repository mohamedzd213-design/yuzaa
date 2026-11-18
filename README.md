# yuzaa · site e-commerce

Site de la marque yuzaa : infusions énergisantes 100 % plantes, sans sucre ajouté (Éveil, Focus, Rush).

En ligne : https://yuzaa.vercel.app

## Structure

```
index.html            Page unique : en-tête, pied de page, pop-ups et panneau panier
css/
  design-system.css   Jetons du design system « Nature & Énergie » et composants de base
  layout.css          Structure des pages, versions tablette et mobile
  animations.css      Apparitions au défilement, transitions (respecte prefers-reduced-motion)
  components.css      Comparatifs, coffrets, FAQ, compte, tunnel de commande, articles
  theme.css           Finitions : rythme, typographie éditoriale, accessibilité
  home.css            Direction artistique « Atelier végétal » et page d'accueil
  pages.css           Direction artistique sur toutes les pages, panneau panier latéral
js/
  core.js             Outils, données (recettes, coffrets, articles), panier, comptes
  media.js            Photos des packagings, illustrations SVG, icônes
  components.js       Cartes produits, tableaux, panier et panneau latéral
  views.js            Gabarits de toutes les pages
  router.js           Navigation sans rechargement (routes, titres, ancres)
  animations.js       Animations au défilement, compteurs, barre d'achat collante
  app.js              Pop-up, formulaires, événements, démarrage
assets/img/           Photos des packagings, de la boule à thé et de l'équipe (WebP, JPEG)
assets/icons/         Favicon
robots.txt, sitemap.xml, site.webmanifest
vercel.json           Réécriture des routes vers index.html, en-têtes de cache et de sécurité
```

Les scripts sont chargés dans l'ordre avec `defer` et partagent la même portée globale.

## Fonctionnalités

- Navigation sans rechargement : chaque page a sa propre adresse (`/infusions`, `/produit-focus`, `/blog`…).
- Panier : ajout depuis les fiches produits et coffrets, panneau latéral, quantités, code BIENVENUE10, livraison offerte dès 35 €.
- Compte client et tunnel de commande (panier, connexion, livraison, paiement, confirmation). Les données restent dans le navigateur (localStorage), les mots de passe sont hachés (SHA-256 salé).
- Paiement PayPal / Apple Pay simulé : démonstration, aucun paiement réel.
- FAQ avec recherche, blog et articles, formulaires validés (contact, devis pros, newsletter).
- Animations sobres au défilement, désactivées si l'utilisateur réduit les animations.

## Lancer en local

```
npx serve .
```

Puis ouvrir http://localhost:3000. Un simple double-clic sur `index.html` fonctionne aussi (navigation par `#route`).

## Déploiement

Chaque push sur `main` est déployé automatiquement par Vercel.

## Supabase

- `js/vendor/supabase-2.99.3.js` : bibliothèque officielle supabase-js (copie locale, aucune dépendance externe).
- `js/supabase.js` : lit le catalogue (table `produits` : prix, prix barré, caféine, stock) avec repli sur les données du site, et gère inscription, connexion, profil, adresse, mot de passe oublié via Supabase Auth (table `clients`, une ligne par compte, protégée par RLS).
- Seule la clé **publiable** est dans le site. Ne jamais y mettre la clé secrète.
- Commandes : la fonction SQL `passer_commande` recalcule prix, remise BIENVENUE10, livraison et stock côté Supabase, puis enregistre `commandes` + `lignes_commande`. Repli dans le navigateur si Supabase est indisponible.
- Newsletter : chaque inscription (pop-up, pied de page, panier, compte) est ajoutée à la table `newsletter` (insertion seule, liste illisible depuis le site).
