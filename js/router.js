/* yuzaa · router.js
   Navigation sans rechargement : routes, titres de page, ancres et rendu. */
const ROUTES=[['accueil','Accueil'],['infusions','Nos infusions (catalogue)'],['produit-eveil','Produit · Éveil'],['produit-focus','Produit · Focus'],['produit-rush','Produit · Rush'],['coffrets','Coffrets'],['coffret-decouverte','Coffret Découverte'],['coffret-partiels','Pack Partiels'],['coffret-boule','Boule à thé portable'],['pros','Nos offres B2B'],['histoire','Histoire & producteurs'],['engagements','Nos engagements'],['blog','Blog'],['article','Article de blog'],['compte','Mon compte'],['compte-commandes','Compte · mes commandes'],['suivi','Compte · suivi de colis'],['compte-profil','Compte · profil et adresse'],['merci','Merci (après inscription)'],['panier','Panier'],['connexion','Commande · connexion'],['livraison','Commande · livraison'],['paiement','Commande · paiement'],['confirmation','Confirmation'],['faq','FAQ'],['contact','Contact'],['cgv','CGV'],['cgu','CGU'],['mentions','Mentions légales'],['merci-newsletter','Merci (newsletter)'],['page-inexistante','Page 404']];
const TITLES={accueil:'Infusions énergisantes naturelles sans sucre | yuzaa'};
const DESCS={accueil:"Infusions énergisantes 100 % plantes au guayusa, au maté et au guarana : caféine naturelle, sans sucre ajouté. Livraison offerte dès 35 €.",
infusions:"Éveil, Focus et Rush : trois infusions énergisantes 100 % plantes, de 40 à 80 mg de caféine naturelle par tasse. En vrac 100 g ou en sachets.",
coffrets:"Coffret Découverte, Pack Partiels et boule à thé portable : goûtez la gamme yuzaa ou faites le plein des trois recettes.",
pros:"Cafés, coworkings, BDE : proposez les infusions énergisantes yuzaa à vos clients et à vos membres. Formats et tarifs sur devis.",
histoire:"Guayusa d'Équateur, maté et guarana du Brésil : découvrez l'histoire de yuzaa et les producteurs de nos plantes.",
engagements:"Plantes tracées, sans sucre ajouté, emballages en carton recyclé : les engagements de yuzaa pour une énergie naturelle.",
blog:"Le journal yuzaa : caféine, plantes énergisantes, rituels d'infusion et recettes pour vos journées chargées.",
faq:"Caféine, préparation, livraison, retours, code de bienvenue : toutes les réponses à vos questions sur les infusions yuzaa.",
contact:"Une question sur une infusion ou une commande ? Contactez l'équipe yuzaa par e-mail ou par téléphone, du lundi au vendredi.",
cgv:"Conditions générales de vente de yuzaa : commandes, prix, livraison, rétractation et retours.",
cgu:"Conditions générales d'utilisation du site yuzaa.",
mentions:"Mentions légales et politique de confidentialité du site yuzaa.",
panier:"Votre panier yuzaa. Livraison à domicile offerte dès 35 €, retours gratuits sous 30 jours."};
const NOINDEX=['panier','connexion','livraison','paiement','confirmation','compte','compte-commandes','compte-profil','suivi','merci','merci-newsletter','page-inexistante'];
function seoMeta(r,art){const strip=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/@@[^@]*@@/g,'').replace(/\s+/g,' ').trim();
 let d=DESCS[r];
 if(!d&&art)d=strip(art.chapo||art.d||art.t);
 if(!d&&r.startsWith('produit-')&&P[r.slice(8)]){const p=P[r.slice(8)];d=`${p.name}, infusion ${p.plants.toLowerCase()} : ${p.mg} mg de caféine naturelle par tasse, sans sucre ajouté. ${p.taste}. Vrac 100 g ou 20 sachets.`;}
 if(!d&&r.startsWith('coffret-')&&C[r.slice(8)]){const c=C[r.slice(8)];d=strip(`${c.name} : ${c.contenu}`);}
 d=(d||DESCS.accueil);if(d.length>160)d=d.slice(0,157).replace(/\s+\S*$/,'')+'…';
 const set=(sel,attr,val)=>{const e=document.querySelector(sel);if(e)e.setAttribute(attr,val);};
 const url='https://yuzaa.vercel.app/'+(r==='accueil'?'':r);
 set('meta[name=description]','content',d);set('meta[property="og:description"]','content',d);set('meta[property="og:title"]','content',document.title);
 set('link[rel=canonical]','href',url);set('meta[property="og:url"]','content',url);
 set('meta[name=robots]','content',NOINDEX.includes(r)?'noindex, follow':'index, follow, max-image-preview:large, max-snippet:-1');}
let pendingAnchor=null;
const PATHMODE=/^https?:$/.test(location.protocol)&&/(^|\.)yuzaa\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
const cur=()=>location.hash.slice(1)||(PATHMODE?decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g,'')):'')||'accueil';
function goReplace(r){if(PATHMODE){history.replaceState(null,'','/'+r);render();}else location.replace('#'+r);}
/* Sur le site en ligne, les liens internes #route deviennent de vraies adresses /route */
function pathLinks(root){if(!PATHMODE||!root)return;$$('a[href^="#"]',root).forEach(a=>{if(a.hasAttribute('data-scroll')||a.hasAttribute('data-focusnl'))return;const r=a.getAttribute('href').slice(1);if(!r||!/^[a-z0-9-]+$/.test(r)||document.getElementById(r)&&!V[r])return;a.setAttribute('href',r==='accueil'?'/':'/'+r);});}
function go(r){r=r||'accueil';if(PATHMODE){history.pushState(null,'',r==='accueil'?'/':'/'+r);render();}else if(location.hash.slice(1)===r)render();else location.hash=r;}
function goAnchor(id){const el=document.getElementById(id);if(!el)return;if(el.tagName==='DETAILS')el.open=true;el.scrollIntoView({behavior:still()?'auto':'smooth',block:'start'});}
function view(r){if(V[r])return V[r]();if(r.startsWith('produit-')&&P[r.slice(8)])return produit(r.slice(8));if(r.startsWith('coffret-')&&C[r.slice(8)])return coffret(r.slice(8));if(r.startsWith('article-')&&ARTS.some(a=>a.id===r.slice(8)))return article(r.slice(8));return V['404']();}
function render(keepScroll){const r=cur();saveCart();
 if(!DEMO&&['connexion','livraison','paiement'].includes(r)){if(!Object.keys(state.cart).length){goReplace('panier');return;}if(r!=='connexion'&&!state.logged){goReplace('connexion');return;}}
 if(!keepScroll)cdrClose();
 const m=$('#view');m.innerHTML=view(r);setTimeout(buyBar,60);setTimeout(buyBar,600);
 $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.nav.split(' ').some(k=>r.startsWith(k))));
 $('#mnav').dataset.open='false';$('[data-burger]').setAttribute('aria-expanded','false');
 const art=r.startsWith('article-')?ARTS.find(a=>'article-'+a.id===r):null;
 const lab=art?art.t:(ROUTES.find(x=>x[0]===r)||[0,'Page introuvable'])[1];document.title=(TITLES[r]||lab+' · yuzaa');seoMeta(r,art);
 if(!keepScroll){const top=$('#site').getBoundingClientRect().top+scrollY-60;scrollTo({top:Math.max(0,Math.min(scrollY,top))});}
 pathLinks($('#site'));count();bindSim();bindFaq();if(!keepScroll)animate();onScroll();
 if(pendingAnchor){const a=pendingAnchor;pendingAnchor=null;setTimeout(()=>goAnchor(a),60);}}
