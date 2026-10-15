/* yuzaa · router.js
   Navigation sans rechargement : routes, titres de page, ancres et rendu. */
const ROUTES=[['accueil','Accueil'],['infusions','Nos infusions (catalogue)'],['produit-eveil','Produit · Éveil'],['produit-focus','Produit · Focus'],['produit-rush','Produit · Rush'],['coffrets','Coffrets'],['coffret-decouverte','Coffret Découverte'],['coffret-partiels','Pack Partiels'],['coffret-boule','Boule à thé portable'],['pros','Pour les pros'],['histoire','Histoire & producteurs'],['engagements','Nos engagements'],['blog','Blog'],['article','Article de blog'],['compte','Mon compte'],['compte-commandes','Compte · mes commandes'],['suivi','Compte · suivi de colis'],['compte-profil','Compte · profil et adresse'],['merci','Merci (après inscription)'],['panier','Panier'],['connexion','Commande · connexion'],['livraison','Commande · livraison'],['paiement','Commande · paiement'],['confirmation','Confirmation'],['faq','FAQ'],['contact','Contact'],['cgv','CGV'],['cgu','CGU'],['mentions','Mentions légales'],['merci-newsletter','Merci (newsletter)'],['page-inexistante','Page 404']];
const TITLES={accueil:'Infusions énergisantes naturelles sans sucre | yuzaa'};
let pendingAnchor=null;
const PATHMODE=/^https?:$/.test(location.protocol)&&/(^|\.)yuzaa\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
const cur=()=>location.hash.slice(1)||(PATHMODE?decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g,'')):'')||'accueil';
function goReplace(r){if(PATHMODE){history.replaceState(null,'','/'+r);render();}else location.replace('#'+r);}
/* Sur le site en ligne, les liens internes #route deviennent de vraies adresses /route */
function pathLinks(root){if(!PATHMODE||!root)return;$$('a[href^="#"]',root).forEach(a=>{if(a.hasAttribute('data-scroll')||a.hasAttribute('data-focusnl'))return;const r=a.getAttribute('href').slice(1);if(!r||!/^[a-z0-9-]+$/.test(r)||document.getElementById(r)&&!V[r])return;a.setAttribute('href',r==='accueil'?'/':'/'+r);});}
function go(r){r=r||'accueil';if(PATHMODE){history.pushState(null,'',r==='accueil'?'/':'/'+r);render();}else if(location.hash.slice(1)===r)render();else location.hash=r;}
function goAnchor(id){const el=document.getElementById(id);if(!el)return;if(el.tagName==='DETAILS')el.open=true;el.scrollIntoView({behavior:still()?'auto':'smooth',block:'start'});}
function view(r){if(V[r])return V[r]();if(r.startsWith('produit-')&&P[r.slice(8)])return produit(r.slice(8));if(r.startsWith('coffret-')&&C[r.slice(8)])return coffret(r.slice(8));if(r.startsWith('article-')&&ARTS.some(a=>a.id===r.slice(8)))return article(r.slice(8));return V['404']();}
function render(keepScroll){const r=cur();
 if(!DEMO&&['connexion','livraison','paiement'].includes(r)){if(!Object.keys(state.cart).length){goReplace('panier');return;}if(r!=='connexion'&&!state.logged){goReplace('connexion');return;}}
 if(!keepScroll)cdrClose();
 const m=$('#view');m.innerHTML=view(r);setTimeout(buyBar,60);setTimeout(buyBar,600);
 $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.nav.split(' ').some(k=>r.startsWith(k))));
 $('#mnav').dataset.open='false';$('[data-burger]').setAttribute('aria-expanded','false');
 const art=r.startsWith('article-')?ARTS.find(a=>'article-'+a.id===r):null;
 const lab=art?art.t:(ROUTES.find(x=>x[0]===r)||[0,'Page introuvable'])[1];document.title=(TITLES[r]||lab+' · yuzaa');
 if(!keepScroll){const top=$('#site').getBoundingClientRect().top+scrollY-60;scrollTo({top:Math.max(0,Math.min(scrollY,top))});}
 pathLinks($('#site'));count();bindSim();bindFaq();if(!keepScroll)animate();onScroll();
 if(pendingAnchor){const a=pendingAnchor;pendingAnchor=null;setTimeout(()=>goAnchor(a),60);}}
