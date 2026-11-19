#!/usr/bin/env node
/* yuzaa · outils/build.mjs
   Génère le site publié à partir des sources (css/*.css, js/*.js, outils/gabarit.html) :
   - une page HTML complète par adresse (index.html, pages/*.html, app.html, 404.html) avec son
     contenu, son titre, sa description, son adresse canonique et ses données structurées : les
     robots (Google, ChatGPT, Claude, Perplexity) lisent le site sans exécuter JavaScript ;
   - le CSS minifié et intégré dans chaque page (pas de fichier CSS bloquant l'affichage) ;
   - les scripts minifiés dans js/min/ (noms avec empreinte, mis en cache un an) ;
   - vercel.json (réécritures page par page, vraie erreur 404), sitemap.xml, robots.txt, llms.txt.

   Usage, depuis la racine du dépôt :
     npm install --prefix outils        (une fois : terser, lightningcss, playwright)
     node outils/build.mjs
   Ensuite : git add -A && git commit && git push (Vercel publie tout seul).
   Les photos réduites viennent de outils/images.py, les polices de outils/polices.py. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://yuzaa.vercel.app';
const R = p => path.join(ROOT, p);
const read = p => fs.readFileSync(R(p), 'utf8');
const write = (p, s) => { fs.mkdirSync(path.dirname(R(p)), {recursive: true}); fs.writeFileSync(R(p), s); };
const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const today = new Date().toISOString().slice(0, 10);

function need(name) {
  try { return require(name); } catch (e) {}
  try { return require(path.join(ROOT, 'outils', 'node_modules', name)); } catch (e) {}
  throw new Error(`Module ${name} introuvable : lancez « npm install --prefix outils ».`);
}
const {minify} = need('terser');
const lightning = need('lightningcss');
const {chromium} = need('playwright');

const GAB = read('outils/gabarit.html');

/* ---------- CSS : concaténé, minifié, intégré ---------- */
const cssFiles = [...GAB.matchAll(/<link rel="stylesheet" href="\/(css\/[^"]+)">/g)].map(m => m[1]);
const cssSrc = cssFiles.map(f => `/* ${f} */\n` + read(f)).join('\n');
const cssOut = lightning.transform({filename: 'site.css', code: Buffer.from(cssSrc), minify: true, errorRecovery: true});
if (cssOut.warnings.length) console.warn('CSS :', cssOut.warnings.length, 'avertissement(s), ex.', cssOut.warnings[0].message);
const CSS = cssOut.code.toString();

/* ---------- JS : minifié, un fichier par source (tâches courtes pour le navigateur) ---------- */
const jsFiles = [...GAB.matchAll(/<script src="\/(js\/[^"]+)" defer><\/script>/g)].map(m => m[1]);
fs.rmSync(R('js/min'), {recursive: true, force: true});
async function minJS(file, replace = []) {
  let code = read(file);
  for (const [a, b] of replace) code = code.split(a).join(b);
  const out = await minify({[file]: code}, {ecma: 2020, compress: {passes: 2}, mangle: true, format: {comments: false}});
  const name = `js/min/${path.basename(file, '.js')}.${hash(out.code)}.js`;
  write(name, out.code);
  return name;
}
const sbMin = await minJS('js/supabase.js');
const jsMin = [];
for (const f of jsFiles) jsMin.push(await minJS(f, f === 'js/app.js' ? [["'/js/supabase.js'", `'/${sbMin}'`]] : []));
const SCRIPTS = jsMin.map(f => `<script src="/${f}" defer></script>`).join('\n');

/* ---------- Serveur local : fichiers du dépôt, sinon le gabarit (comme le site d'origine) ---------- */
const TYPES = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8'};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory() || p === '/') f = R('outils/gabarit.html');
  res.writeHead(200, {'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream'});
  res.end(fs.readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({viewport: {width: 1366, height: 900}, locale: 'fr-FR', serviceWorkers: 'block'});
await ctx.route(/supabase\.co|_vercel|googleapis|gstatic/, r => r.abort());
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));

async function snap(route) {
  await page.goto(BASE + (route === 'accueil' ? '/' : '/' + route), {waitUntil: 'load'});
  await page.waitForTimeout(150);
  return page.evaluate(() => {
    const r = cur(), html = prep(view(r));
    // contenu « propre » (sans les classes d'animation ajoutées au premier affichage), liens en /route
    const box = document.createElement('div'); box.style.display = 'none'; document.body.appendChild(box);
    box.innerHTML = html; pathLinks(box); const viewHTML = box.innerHTML; box.remove();
    const st = document.getElementById('stage').cloneNode(true);
    st.querySelector('#view').innerHTML = '<!--VIEW-->';
    st.querySelectorAll('.is-scrolled,.is-hidden,.bump').forEach(e => e.classList.remove('is-scrolled', 'is-hidden', 'bump'));
    st.querySelectorAll('.mbuy.show').forEach(e => e.classList.remove('show'));
    st.querySelectorAll('#ck').forEach(e => { e.hidden = false; e.classList.add('on'); });
    const meta = s => { const e = document.querySelector(s); return e ? e.getAttribute('content') || e.getAttribute('href') : ''; };
    const ld = document.getElementById('ld-page');
    return {route: r, known: known(r), hash: hh(html), hash2: hh(prep(view(r))), viewHTML, stageHTML: st.outerHTML,
      title: document.title, desc: meta('meta[name=description]'), robots: meta('meta[name=robots]'), canonical: meta('link[rel=canonical]'),
      ogType: meta('meta[property="og:type"]'), ogImage: meta('meta[property="og:image"]'), ld: ld ? ld.textContent : ''};
  });
}

/* ---------- Liste des adresses ---------- */
await page.goto(BASE + '/', {waitUntil: 'load'});
const data = await page.evaluate(() => ({
  routes: ROUTES.map(x => x[0]).concat(ARTS.map(a => 'article-' + a.id)).filter((r, i, a) => a.indexOf(r) === i && known(r)),
  noindex: NOINDEX,
  P: Object.values(P).map(p => ({id: p.id, name: p.name, mg: p.mg, plants: p.plants, moment: p.moment, taste: p.taste, price: p.price, desc: p.desc})),
  C: Object.values(C).map(c => ({id: c.id, name: c.name, price: c.price, old: c.old || null, contenu: c.contenu})),
  ARTS: ARTS.map(a => ({id: a.id, t: a.t, ex: a.ex, cat: a.cat})),
}));
// « article » est l'ancien modèle d'article (doublon du premier article) : redirigé vers le blog
const indexable = data.routes.filter(r => !data.noindex.includes(r) && r !== 'article');
const shell = data.routes.filter(r => data.noindex.includes(r) && r !== 'page-inexistante');

/* ---------- Assemblage d'une page ---------- */
function buildPage(s, {preload = '', robots, absolute = false, emptyView = false} = {}) {
  let h = GAB;
  const setMeta = (re, val) => { h = h.replace(re, (m, a, b) => a + esc(val) + b); };
  setMeta(/(<title>)[^<]*(<\/title>)/, s.title);
  setMeta(/(<meta name="description" content=")[^"]*(")/, s.desc);
  setMeta(/(<meta name="robots" content=")[^"]*(")/, robots || s.robots);
  // pages noindex (app.html, 404.html) : pas de balise canonical, plutôt qu'une canonical vers l'accueil
  if (s.canonical) setMeta(/(<link rel="canonical" href=")[^"]*(")/, s.canonical);
  else h = h.replace(/<link rel="canonical"[^>]*>\n?/, '');
  setMeta(/(<meta property="og:url" content=")[^"]*(")/, s.canonical || SITE + '/');
  setMeta(/(<meta property="og:title" content=")[^"]*(")/, s.title);
  setMeta(/(<meta property="og:description" content=")[^"]*(")/, s.desc);
  setMeta(/(<meta property="og:type" content=")[^"]*(")/, s.ogType || 'website');
  setMeta(/(<meta property="og:image" content=")[^"]*(")/, s.ogImage);
  setMeta(/(<meta name="twitter:title" content=")[^"]*(")/, s.title);
  setMeta(/(<meta name="twitter:description" content=")[^"]*(")/, s.desc);
  if (s.ogImage && !/gamme-yuzaa\.webp$/.test(s.ogImage)) h = h.replace(/<meta property="og:image:(alt|width|height)"[^>]*>\n/g, '');
  const fonts = '<link rel="preload" href="/assets/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>';
  h = h.replace('<!--PRELOAD-->', [preload, fonts].filter(Boolean).join('\n'));
  // CSS intégré à la place des feuilles de style
  h = h.replace(/(<link rel="stylesheet" href="\/css\/[^"]+">\n?)+/, `<style>${CSS}</style>\n`);
  if (s.ld) h = h.replace('</head>', `<script type="application/ld+json" id="ld-page">${s.ld.replace(/</g, '\\u003c')}</script>\n</head>`);
  // corps : en-tête, contenu et pied de page tels qu'affichés
  const a = h.indexOf('<div class="stage" id="stage">'), b = h.indexOf('<div class="toast"');
  let stage = s.stageHTML.replace('<!--VIEW-->', emptyView ? '' : s.viewHTML);
  stage = stage.replace(/<main id="view"([^>]*)>/, (m, at) => `<main id="view"${at.replace(/\sdata-h="[^"]*"/, '').replace(/\sstyle="[^"]*"/, '').replace(/\sclass="[^"]*"/, '')}${emptyView ? ' style="min-height:100vh"' : ` data-h="${s.hash}"`}>`);
  h = h.slice(0, a) + stage + '\n' + h.slice(b);
  h = h.replace(/(<script src="\/js\/[^"]+" defer><\/script>\n?)+/, SCRIPTS + '\n');
  if (absolute) h = h.replace(/(src|href|srcset)="(assets\/)/g, '$1="/$2').replace(/, (assets\/)/g, ', /$1');
  return h;
}

/* ---------- Génération ---------- */
fs.rmSync(R('pages'), {recursive: true, force: true});
const report = [];
let homeSnap = null;
for (const r of indexable) {
  const s = await snap(r);
  if (s.route !== r) throw new Error(`Route ${r} : rendu ${s.route}`);
  if (s.hash !== s.hash2) console.warn(`! ${r} : contenu variable d'un rendu à l'autre (la page sera reconstruite au chargement)`);
  let preload = '';
  if (r === 'accueil') {
    homeSnap = s;
    const m = s.viewHTML.match(/<img[^>]*fetchpriority="high"[^>]*>/);
    if (m) {
      const ss = (m[0].match(/srcset="([^"]+)"/) || [])[1], sz = (m[0].match(/sizes="([^"]+)"/) || [])[1];
      if (ss) preload = `<link rel="preload" as="image" imagesrcset="${ss}" imagesizes="${sz}" fetchpriority="high">`;
    }
  }
  const html = buildPage(s, {preload});
  write(r === 'accueil' ? 'index.html' : `pages/${r}.html`, html);
  const txt = s.viewHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  report.push({r, kb: Math.round(Buffer.byteLength(html) / 1024), text: txt.length, h1: (s.viewHTML.match(/<h1/g) || []).length});
}
// coquille pour les pages privées (panier, compte, commande) : non indexées, contenu affiché par le script
{
  const s = await snap('cgu');
  s.stageHTML = s.stageHTML.replace(/ class="on"/g, '').replace(/ aria-current="page"/g, '');
  write('app.html', buildPage({...s, title: 'yuzaa', desc: s.desc, canonical: '', ld: '', ogType: 'website', ogImage: SITE + '/assets/img/gamme-yuzaa.webp'}, {robots: 'noindex, follow', emptyView: true}));
}
// page 404 (servie par Vercel avec le statut 404 pour toute adresse inconnue)
{
  const s = await snap('page-introuvable-404');
  write('404.html', buildPage({...s, canonical: '', ld: ''}, {robots: 'noindex, follow', absolute: true}));
}
await browser.close();
server.close();

/* ---------- vercel.json ---------- */
const vercel = {
  trailingSlash: false,
  redirects: [{source: '/accueil', destination: '/', permanent: true}, {source: '/index.html', destination: '/', permanent: true}, {source: '/article', destination: '/blog', permanent: true}],
  rewrites: [
    ...indexable.filter(r => r !== 'accueil').map(r => ({source: '/' + r, destination: `/pages/${r}.html`})),
    {source: `/(${shell.join('|')})`, destination: '/app.html'},
  ],
  headers: [
    {source: '/assets/(.*)', headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]},
    {source: '/js/min/(.*)', headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}]},
    {source: '/js/vendor/(.*)', headers: [{key: 'Cache-Control', value: 'public, max-age=2592000'}]},
    {source: '/(css|js)/([^/]+)', headers: [{key: 'Cache-Control', value: 'public, max-age=0, must-revalidate'}]},
    {source: '/(llms.txt|robots.txt|sitemap.xml)', headers: [{key: 'Cache-Control', value: 'public, max-age=3600'}]},
    {source: '/(.*)', headers: [
      {key: 'X-Content-Type-Options', value: 'nosniff'},
      {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
      {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'},
      {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
      {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains'},
    ]},
  ],
};
write('vercel.json', JSON.stringify(vercel, null, 2) + '\n');

/* ---------- sitemap.xml, robots.txt ---------- */
const prio = r => r === 'accueil' ? '1.0' : /^(infusions|produit-|coffrets|coffret-)/.test(r) ? '0.9' : /^(blog|article-|histoire|pros)/.test(r) ? '0.7' : '0.4';
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(r => `  <url><loc>${SITE}/${r === 'accueil' ? '' : r}</loc><lastmod>${today}</lastmod><priority>${prio(r)}</priority></url>`).join('\n')}
</urlset>
`);
const priv = ['compte', 'panier', 'connexion', 'livraison', 'paiement', 'confirmation', 'suivi', 'merci', 'pages/'];
write('robots.txt', `# yuzaa : infusions énergisantes 100 % plantes
# Les moteurs de recherche et les assistants IA sont les bienvenus sur tout le site public.
# Présentation du site pour les IA : ${SITE}/llms.txt

User-agent: *
Allow: /
${priv.map(p => 'Disallow: /' + p).join('\n')}

# Robots des assistants IA, autorisés explicitement
${['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Mistral', 'CCBot'].map(b => `User-agent: ${b}\nAllow: /\n${priv.map(p => 'Disallow: /' + p).join('\n')}`).join('\n\n')}

Sitemap: ${SITE}/sitemap.xml
`);

/* ---------- llms.txt ---------- */
const eur = n => n.toFixed(2).replace('.', ',') + ' €';
const plantsAnd = s => s.toLowerCase().replace(/, ([^,]*)$/, ' et $1');
write('llms.txt', `# yuzaa

> yuzaa est une marque française d'infusions énergisantes 100 % plantes, sans sucre ajouté. Trois recettes à la caféine naturelle (guayusa, maté, guarana) pour les journées d'étude et de travail : Éveil (40 mg de caféine par tasse), Focus (60 mg) et Rush (80 mg). Vente en ligne en France métropolitaine.

Informations clés :
- Formats : vrac 100 g (environ 40 tasses, ${eur(data.P[0].price)}) ou boîte de 20 sachets (6,90 €).
- Livraison à domicile en 48 h : 4,90 €, offerte dès 35 € d'achat. Retours gratuits sous 30 jours.
- Paiement sécurisé par carte, PayPal ou Apple Pay. Emballages en carton recyclé.
- Préparation : 2,5 g par tasse, eau à 80 °C, 5 minutes d'infusion. 2 tasses par jour maximum, pas après 16 h ; déconseillé aux femmes enceintes ou allaitantes et aux moins de 16 ans.
- Contact : bonjour@yuzaa.fr · Instagram et TikTok : @yuzaa.energie

## Les trois recettes

${data.P.map(p => `- [${p.name}, infusion ${plantsAnd(p.plants)}](${SITE}/produit-${p.id}) : ${p.moment.toLowerCase()}, ${p.mg} mg de caféine par tasse, goût ${p.taste.toLowerCase()}. ${eur(p.price)} les 100 g.`).join('\n')}
- [Comparer les trois recettes](${SITE}/infusions) : catalogue complet, filtres par moment de la journée.

## Coffrets et accessoires

${data.C.map(c => `- [${c.name}](${SITE}/coffret-${c.id}) : ${c.contenu} ${eur(c.price)}${c.old ? ` au lieu de ${eur(c.old)}` : ''}.`).join('\n')}

## La marque

- [Notre histoire et nos producteurs](${SITE}/histoire) : guayusa d'Équateur, maté et guarana du Brésil.
- [Nos engagements](${SITE}/engagements) : plantes tracées et bio, sans sucre ajouté, carton recyclé.
- [Nos offres B2B](${SITE}/pros) : cafés, coworkings et BDE, formats et tarifs sur devis.
- [Questions fréquentes](${SITE}/faq) : caféine, préparation, livraison, retours, code de bienvenue.
- [Contact](${SITE}/contact)

## Blog

${data.ARTS.map(a => `- [${a.t}](${SITE}/article-${a.id}) : ${a.ex}`).join('\n')}

## Optional

- [Conditions générales de vente](${SITE}/cgv)
- [Mentions légales et confidentialité](${SITE}/mentions)
- [Plan du site](${SITE}/sitemap.xml)
`);

/* ---------- Bilan ---------- */
console.log(`${indexable.length} pages générées + app.html + 404.html · CSS ${Math.round(CSS.length / 1024)} Ko · JS ${jsMin.length} fichiers`);
for (const x of report) if (!x.h1 || x.text < 300) console.warn(`! ${x.r} : h1=${x.h1}, texte=${x.text} caractères`);
if (errors.length) console.warn('Erreurs JavaScript pendant la génération :', [...new Set(errors)].slice(0, 5));
write('outils/rapport-build.json', JSON.stringify({date: new Date().toISOString(), pages: report}, null, 1) + '\n');
