# yuzaa · site e-commerce

Site de la marque yuzaa : infusions énergisantes 100 % plantes, sans sucre ajouté (Éveil, Focus, Rush).

En ligne : https://yuzaa.vercel.app

## À lire avant de modifier le site

Les pages publiées sont **générées**. On ne les modifie jamais à la main :

| Fichiers générés (ne pas modifier) | Sources (à modifier) |
|---|---|
| `index.html`, `pages/*.html`, `app.html`, `404.html` | `outils/gabarit.html` (en-tête, pied de page, pop-ups, panneau panier) |
| `js/min/*.js` | `js/*.js` (contenu des pages, panier, comptes) |
| CSS intégré dans chaque page | `css/*.css` |
| `vercel.json`, `sitemap.xml`, `robots.txt`, `llms.txt` | `outils/build.mjs` |
| `assets/img/r/*.webp`, `js/img-tailles.js` | photos de `assets/img/` + `outils/images.py` |
| `assets/fonts/*.woff2` | `outils/polices.py` |

Pour publier une modification :

```
npm install --prefix outils      # une seule fois (terser, lightningcss, playwright)
python3 outils/images.py         # seulement si une photo a été ajoutée ou remplacée
node outils/build.mjs            # régénère toutes les pages
node outils/serveur.mjs          # vérification en local : http://localhost:8123
git add -A && git commit -m "…" && git push
```

Chaque push sur `main` est publié automatiquement par Vercel. Sans `node outils/build.mjs`, une
modification de `js/` ou `css/` n'apparaît pas sur le site (les pages chargent les fichiers minifiés).

Ne jamais remettre `cleanUrls` dans `vercel.json` (les adresses comme `/infusions` renvoyaient 404).

## Ce que fait la génération (outils/build.mjs)

- **Une vraie page HTML par adresse** (24 pages publiques) : le contenu, le titre, la description,
  l'adresse canonique et les données structurées sont dans le HTML. Google, ChatGPT, Claude ou
  Perplexity lisent tout le site sans exécuter JavaScript. Au chargement, le script reconnaît la page
  déjà construite et la garde telle quelle (pas de clignotement, pas de décalage).
- Les pages privées (panier, connexion, compte, tunnel de commande) utilisent `app.html`, en `noindex`.
- Une adresse inconnue renvoie une vraie erreur 404 (`404.html`).
- CSS minifié et intégré dans la page (rien ne bloque l'affichage), scripts minifiés avec empreinte
  dans le nom (mis en cache un an), polices hébergées sur le site, photos en plusieurs tailles
  (`srcset`) : un téléphone télécharge une photo de 480 ou 600 px au lieu de 1 200 px.
- Supabase (170 Ko) se charge à la première interaction, ou tout de suite sur les pages de compte et de commande.
- `vercel.json` (réécritures page par page, redirections, en-têtes de cache et de sécurité),
  `sitemap.xml`, `robots.txt` (robots IA nommés) et `llms.txt` (résumé du site pour les IA).
- Rapport : `outils/rapport-build.json` (poids, longueur de texte et nombre de h1 par page).

## Structure

```
outils/
  gabarit.html        Gabarit commun de toutes les pages
  build.mjs           Génération du site publié
  images.py           Tailles réduites des photos (assets/img/r/)
  polices.py          Polices Bricolage Grotesque et DM Sans réduites aux caractères utilisés
  serveur.mjs         Serveur local qui imite Vercel
css/
  fonts.css           Polices hébergées et polices de secours aux mêmes proportions
  design-system.css   Jetons du design system « Nature & Énergie » et composants de base
  layout.css          Structure des pages, versions tablette et mobile
  animations.css      Apparitions au défilement, transitions (respecte prefers-reduced-motion)
  components.css      Comparatifs, coffrets, FAQ, compte, tunnel de commande, articles
  theme.css           Finitions : rythme, typographie éditoriale, accessibilité
  home.css            Page d'accueil
  pages.css           Direction artistique noir et blanc sur toutes les pages, panneau panier
  finitions.css       Corrections des audits (mobile, accessibilité, premier affichage)
js/
  core.js             Outils, données (recettes, coffrets, articles), panier, comptes
  img-tailles.js      Tailles de photos disponibles (généré par outils/images.py)
  media.js            Photos (srcset), illustrations SVG, icônes
  components.js       Cartes produits, tableaux, panier et panneau latéral
  views.js            Gabarits de toutes les pages
  router.js           Navigation sans rechargement, titres, descriptions, données structurées
  animations.js       Animations au défilement, compteurs, barre d'achat collante
  app.js              Pop-up, formulaires, événements, chargement différé de Supabase, démarrage
  supabase.js         Comptes, commandes, newsletter et catalogue via Supabase
  vendor/             supabase-js (copie locale)
assets/img/           Photos des packagings, de la boule à thé, du blog et de l'équipe
assets/fonts/         Polices (woff2)
assets/icons/         Favicon
```

Les scripts sont chargés dans l'ordre avec `defer` et partagent la même portée globale.

## Fonctionnalités

- Navigation sans rechargement : chaque page a sa propre adresse (`/infusions`, `/produit-focus`, `/blog`…).
- Panier : ajout depuis les fiches produits et coffrets, panneau latéral, quantités, code BIENVENUE10 (réservé aux inscrits à la newsletter), livraison offerte dès 35 €.
- Compte client et tunnel de commande (panier, connexion, livraison, paiement, confirmation).
- Paiement simulé : démonstration, aucun paiement réel.
- FAQ avec recherche, blog et articles, formulaires validés (contact, devis pros, newsletter).
- Animations sobres au défilement, désactivées si l'utilisateur réduit les animations.
- Accessibilité : lien « Aller au contenu », focus gardé dans les fenêtres (pop-up, paiement, panier), annonces pour lecteurs d'écran au panier.

## Supabase

- `js/vendor/supabase-2.99.3.js` : bibliothèque officielle supabase-js (copie locale, aucune dépendance externe).
- `js/supabase.js` : lit le catalogue (table `produits` : prix, prix barré, caféine, stock) avec repli sur les données du site, et gère inscription, connexion, profil, adresse, mot de passe oublié via Supabase Auth (table `clients`, une ligne par compte, protégée par RLS).
- Seule la clé **publiable** est dans le site. Ne jamais y mettre la clé secrète.
- Commandes : la fonction SQL `passer_commande` recalcule prix, remise BIENVENUE10, livraison et stock côté Supabase, puis enregistre `commandes` + `lignes_commande`. Repli dans le navigateur si Supabase est indisponible.
- Newsletter : chaque inscription (pop-up, pied de page, panier, compte) est ajoutée à la table `newsletter` (insertion seule, liste illisible depuis le site).
- Les deux scripts sont chargés par `app.js` (fonction `sbLoad`) : ils n'ont pas de balise dans le gabarit.
