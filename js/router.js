/* yuzaa · router.js
   Navigation sans rechargement : routes, titres de page, ancres et rendu. */
const ROUTES=[['accueil','Accueil'],['infusions','Nos infusions (catalogue)'],['produit-eveil','Produit · Éveil'],['produit-focus','Produit · Focus'],['produit-rush','Produit · Rush'],['coffrets','Coffrets'],['coffret-decouverte','Coffret Découverte'],['coffret-partiels','Pack Partiels'],['coffret-boule','Boule à thé portable'],['pros','Nos offres B2B'],['histoire','Histoire & producteurs'],['engagements','Nos engagements'],['blog','Blog'],['article','Article de blog'],['compte','Mon compte'],['compte-commandes','Compte · mes commandes'],['suivi','Compte · suivi de colis'],['compte-profil','Compte · profil et adresse'],['merci','Merci (après inscription)'],['panier','Panier'],['connexion','Commande · connexion'],['livraison','Commande · livraison'],['paiement','Commande · paiement'],['confirmation','Confirmation'],['faq','FAQ'],['contact','Contact'],['cgv','CGV'],['cgu','CGU'],['mentions','Mentions légales'],['merci-newsletter','Merci (newsletter)'],['page-inexistante','Page 404']];
const TITLES={accueil:'Infusions énergisantes 100 % plantes, sans sucre | yuzaa',
infusions:'Nos infusions énergisantes aux plantes : Éveil, Focus, Rush | yuzaa',
coffrets:'Coffrets et accessoires : Découverte, Pack Partiels, boule à thé | yuzaa',
'coffret-decouverte':'Coffret Découverte : les 3 infusions et une boule à thé | yuzaa',
'coffret-partiels':'Pack Partiels : les 3 infusions énergisantes en 100 g | yuzaa',
'coffret-boule':'Boule à thé portable en inox pour infuser partout | yuzaa',
pros:'Nos offres B2B : infusions pour cafés, coworkings et BDE | yuzaa',
histoire:'Notre histoire et nos producteurs de plantes | yuzaa',
engagements:'Nos engagements : plantes tracées, sans sucre, carton recyclé | yuzaa',
blog:'Blog : caféine, plantes énergisantes et rituels d\'infusion | yuzaa',
faq:'FAQ : caféine, préparation, livraison et retours | yuzaa',
contact:'Contact : une question sur nos infusions ? | yuzaa',
cgv:'Conditions générales de vente | yuzaa',cgu:'Conditions générales d\'utilisation | yuzaa',mentions:'Mentions légales et confidentialité | yuzaa',
panier:'Mon panier | yuzaa',connexion:'Connexion | yuzaa',livraison:'Livraison | yuzaa',paiement:'Paiement sécurisé | yuzaa',confirmation:'Commande confirmée | yuzaa',
compte:'Mon compte | yuzaa','compte-commandes':'Mes commandes | yuzaa','compte-profil':'Mon profil et mon adresse | yuzaa',suivi:'Suivi de colis | yuzaa',
merci:'Bienvenue chez yuzaa | yuzaa','merci-newsletter':'Inscription à la newsletter confirmée | yuzaa'};
/* Titre de chaque page (fiches produits : nom + plantes, pour les moteurs et les IA) */
const andList=s=>s.toLowerCase().replace(/, ([^,]*)$/,' et $1');
function titleOf(r,art){if(TITLES[r])return TITLES[r];if(art)return art.t+' | yuzaa';
 if(r.startsWith('produit-')&&P[r.slice(8)]){const p=P[r.slice(8)];return `${p.name}, infusion ${andList(p.plants)} | yuzaa`;}
 if(r.startsWith('coffret-')&&C[r.slice(8)])return C[r.slice(8)].name+' | yuzaa';
 return 'Page introuvable | yuzaa';}
/* La route existe-t-elle ? (sinon : page 404, non indexée) */
function known(r){return !!(V[r]||(r.startsWith('produit-')&&P[r.slice(8)])||(r.startsWith('coffret-')&&C[r.slice(8)])||(r.startsWith('article-')&&ARTS.some(a=>a.id===r.slice(8))));}
/* Données structurées (JSON-LD) propres à chaque page : produits, articles, fil d'Ariane, FAQ */
const SITE='https://yuzaa.vercel.app';
const abs=u=>SITE+'/'+String(u).replace(/^\//,'');
const FRMOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const isoDate=s=>{const m=String(s||'').match(/(\d{1,2})\s+([a-zéû]+)\s+(\d{4})/i);if(!m)return undefined;const mo=FRMOIS.indexOf(m[2].toLowerCase());return mo<0?undefined:`${m[3]}-${String(mo+1).padStart(2,'0')}-${m[1].padStart(2,'0')}`;};
const ldStrip=h=>String(h||'').replace(/<[^>]+>/g,'').replace(/@@[^@]*@@/g,'').replace(/\s+/g,' ').trim();
const ldOffer=(price,name,url)=>({'@type':'Offer',name,price:price.toFixed(2),priceCurrency:'EUR',availability:'https://schema.org/InStock',itemCondition:'https://schema.org/NewCondition',url,seller:{'@id':SITE+'/#org'}});
function ldProduct(d){const p=P[d],url=SITE+'/produit-'+d;return{'@type':'Product','@id':url+'#produit',name:`${p.name}, infusion ${andList(p.plants)}`,description:`${p.desc} ${p.mg} mg de caféine naturelle par tasse, sans sucre ajouté.`,image:[abs(IMG[d+'S']),abs(IMG[d+'B']),abs(IMG[d+'F'])],brand:{'@type':'Brand',name:'yuzaa'},category:'Infusion énergisante aux plantes',sku:'YZ-'+d.toUpperCase(),url,
 additionalProperty:[{'@type':'PropertyValue',name:'Caféine par tasse',value:p.mg,unitText:'mg'},{'@type':'PropertyValue',name:'Plantes',value:p.plants},{'@type':'PropertyValue',name:'Sucre ajouté',value:'0 g'}],
 offers:[ldOffer(p.price,'Vrac 100 g (environ 40 tasses)',url),ldOffer(6.9,'Boîte de 20 sachets',url)]};}
function ldCoffret(k){const c=C[k],url=SITE+'/coffret-'+k;return{'@type':'Product','@id':url+'#produit',name:c.name,description:ldStrip(c.contenu+' '+c.desc),image:abs(k==='boule'?IMG.bouleA:IMG.trio),brand:{'@type':'Brand',name:'yuzaa'},category:k==='boule'?'Accessoire pour infusion':'Coffret d\'infusions',sku:'YZ-'+k.toUpperCase(),url,offers:ldOffer(c.price,c.name,url)};}
const ldCrumb=items=>({'@type':'BreadcrumbList',itemListElement:items.map(([n,u],i)=>({'@type':'ListItem',position:i+1,name:n,item:SITE+u}))});
const ldList=(name,items)=>({'@type':'ItemList',name,itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,item:it}))});
function ldPage(r,art){const g=[];
 if(r==='accueil')g.push(ldList('Infusions énergisantes yuzaa',['eveil','focus','rush'].map(ldProduct).concat([ldCoffret('decouverte')])));
 else if(r==='infusions')g.push(ldList('Nos infusions énergisantes',['eveil','focus','rush'].map(ldProduct)),ldCrumb([['Accueil','/'],['Nos infusions','/infusions']]));
 else if(r==='coffrets')g.push(ldList('Coffrets et accessoires',['decouverte','partiels','boule'].map(ldCoffret)),ldCrumb([['Accueil','/'],['Coffrets','/coffrets']]));
 else if(r.startsWith('produit-')&&P[r.slice(8)]){const d=r.slice(8);g.push(ldProduct(d),ldCrumb([['Accueil','/'],['Nos infusions','/infusions'],[P[d].name,'/'+r]]));}
 else if(r.startsWith('coffret-')&&C[r.slice(8)]){const k=r.slice(8);g.push(ldCoffret(k),ldCrumb([['Accueil','/'],['Coffrets','/coffrets'],[C[k].name,'/'+r]]));}
 else if(art){const au=(typeof TEAM!=='undefined'&&TEAM[art.au])||[];const k=typeof ARTK!=='undefined'&&ARTK[art.id];const img=k&&IMG[k+'W'];
  g.push({'@type':'BlogPosting','@id':SITE+'/'+r+'#article',headline:art.t,description:ldStrip(art.chapo||art.ex),datePublished:isoDate(art.date),inLanguage:'fr-FR',articleSection:art.cat,timeRequired:'PT'+art.min+'M',image:img?abs(img):undefined,author:au[0]?{'@type':'Person',name:au[0],jobTitle:au[1]}:{'@id':SITE+'/#org'},publisher:{'@id':SITE+'/#org'},mainEntityOfPage:SITE+'/'+r},ldCrumb([['Accueil','/'],['Blog','/blog'],[art.t,'/'+r]]));}
 else if(r==='blog')g.push({'@type':'Blog','@id':SITE+'/blog#blog',name:'Le blog yuzaa',url:SITE+'/blog',publisher:{'@id':SITE+'/#org'},blogPost:ARTS.map(a=>({'@type':'BlogPosting',headline:a.t,url:SITE+'/article-'+a.id,datePublished:isoDate(a.date)}))},ldCrumb([['Accueil','/'],['Blog','/blog']]));
 else if(r==='faq'){const qs=$$('#faqlist details').map(d=>{const s=d.querySelector('summary');const q=s?s.textContent.trim():'';const c=d.cloneNode(true);c.querySelector('summary')?.remove();return q?{'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:c.textContent.replace(/\s+/g,' ').trim()}}:null;}).filter(Boolean);if(qs.length)g.push({'@type':'FAQPage',mainEntity:qs});g.push(ldCrumb([['Accueil','/'],['FAQ','/faq']]));}
 else if(r==='histoire')g.push({'@type':'AboutPage',name:'Notre histoire et nos producteurs',url:SITE+'/histoire',about:{'@id':SITE+'/#org'}},ldCrumb([['Accueil','/'],['Histoire','/histoire']]));
 else if(r==='contact')g.push({'@type':'ContactPage',name:'Contacter yuzaa',url:SITE+'/contact',about:{'@id':SITE+'/#org'}});
 else if(r==='pros')g.push({'@type':'Service',name:'Infusions yuzaa pour les professionnels',serviceType:'Fourniture d\'infusions pour cafés, coworkings et BDE',provider:{'@id':SITE+'/#org'},areaServed:'FR',url:SITE+'/pros'},ldCrumb([['Accueil','/'],['Nos offres B2B','/pros']]));
 return g.length?{'@context':'https://schema.org','@graph':g}:null;}
const DESCS={accueil:"Infusions énergisantes aux plantes : caféine naturelle de guayusa, maté et guarana, sans sucre ajouté. En vrac ou en sachets. Livraison offerte dès 35 €.",
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
function seoMeta(r,art){const strip=ldStrip;const nf=!known(r);
 let d=DESCS[r];
 if(!d&&art)d=strip(art.chapo||art.d||art.t);
 if(!d&&r.startsWith('produit-')&&P[r.slice(8)]){const p=P[r.slice(8)];d=`${p.name}, infusion ${p.plants.toLowerCase()} : ${p.mg} mg de caféine naturelle par tasse, sans sucre ajouté. ${p.taste}. Vrac 100 g ou 20 sachets.`;}
 if(!d&&r.startsWith('coffret-')&&C[r.slice(8)]){const c=C[r.slice(8)];d=strip(`${c.name} : ${c.contenu}`);}
 d=(d||DESCS.accueil);if(d.length>160)d=d.slice(0,157).replace(/\s+\S*$/,'')+'…';
 const set=(sel,attr,val)=>{const e=document.querySelector(sel);if(e)e.setAttribute(attr,val);};
 const url='https://yuzaa.vercel.app/'+(r==='accueil'?'':r);
 set('meta[name=description]','content',d);set('meta[property="og:description"]','content',d);set('meta[property="og:title"]','content',document.title);set('meta[name="twitter:title"]','content',document.title);set('meta[name="twitter:description"]','content',d);
 {const pd=r.startsWith('produit-')&&P[r.slice(8)]?r.slice(8):null;const im=pd?IMG[pd+'S']:IMG.hero;set('meta[property="og:image"]','content',abs(im));set('meta[property="og:type"]','content',pd?'product':art?'article':'website');}
 set('link[rel=canonical]','href',url);set('meta[property="og:url"]','content',url);
 set('meta[name=robots]','content',NOINDEX.includes(r)||nf?'noindex, follow':'index, follow, max-image-preview:large, max-snippet:-1');
 let ld=document.getElementById('ld-page');const data=nf||NOINDEX.includes(r)?null:ldPage(r,art);
 if(!data){if(ld)ld.remove();}else{if(!ld){ld=document.createElement('script');ld.type='application/ld+json';ld.id='ld-page';document.head.appendChild(ld);}const j=JSON.stringify(data);if(ld.textContent!==j)ld.textContent=j;}}
let pendingAnchor=null;
const PATHMODE=/^https?:$/.test(location.protocol)&&/(^|\.)yuzaa\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);
const cur=()=>location.hash.slice(1)||(PATHMODE?decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g,'')):'')||'accueil';
function goReplace(r){if(PATHMODE){history.replaceState(null,'','/'+r);render();}else location.replace('#'+r);}
/* Sur le site en ligne, les liens internes #route deviennent de vraies adresses /route */
function pathLinks(root){if(!PATHMODE||!root)return;$$('a[href^="#"]',root).forEach(a=>{if(a.hasAttribute('data-scroll')||a.hasAttribute('data-focusnl'))return;const r=a.getAttribute('href').slice(1);if(!r||!/^[a-z0-9-]+$/.test(r)||document.getElementById(r)&&!V[r])return;a.setAttribute('href',r==='accueil'?'/':'/'+r);});}
function go(r){r=r||'accueil';if(PATHMODE){history.pushState(null,'',r==='accueil'?'/':'/'+r);render();}else if(location.hash.slice(1)===r)render();else location.hash=r;}
function goAnchor(id){const el=document.getElementById(id);if(!el)return;if(el.tagName==='DETAILS')el.open=true;const rv=el.closest('.rv');if(rv&&!rv.classList.contains('in')){rv.style.transition='none';rv.classList.add('in');void rv.offsetHeight;rv.style.transition='';}el.scrollIntoView({behavior:still()?'auto':'smooth',block:'start'});}
function view(r){if(V[r])return V[r]();if(r.startsWith('produit-')&&P[r.slice(8)])return produit(r.slice(8));if(r.startsWith('coffret-')&&C[r.slice(8)])return coffret(r.slice(8));if(r.startsWith('article-')&&ARTS.some(a=>a.id===r.slice(8)))return article(r.slice(8));return V['404']();}
/* Pages générées à l'avance (outils/build.mjs) : au premier affichage, si le HTML reçu est identique
   à celui que le script produirait, on le garde tel quel (pas de clignotement, chargement plus rapide). */
const hh=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36)+s.length.toString(36);};
let firstRender=true;
function render(keepScroll){const r=cur();saveCart();if(typeof sbNeed==='function')sbNeed(r);
 if(!DEMO&&['connexion','livraison','paiement'].includes(r)){if(!Object.keys(state.cart).length){goReplace('panier');return;}if(r!=='connexion'&&!state.logged){goReplace('connexion');return;}}
 if(!keepScroll)cdrClose();
 const m=$('#view');const html=prep(view(r));const first=firstRender;firstRender=false;
 if(!(first&&m.dataset.h&&m.dataset.h===hh(html)))m.innerHTML=html;m.removeAttribute('data-h');if(first)m.style.minHeight='';
 if(!first&&!keepScroll)document.documentElement.classList.add('nav');setTimeout(buyBar,60);setTimeout(buyBar,600);
 $$('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.nav.split(' ').some(k=>r.startsWith(k))));
 $('#mnav').dataset.open='false';$('[data-burger]').setAttribute('aria-expanded','false');
 const art=r.startsWith('article-')?ARTS.find(a=>'article-'+a.id===r):null;
 document.title=titleOf(known(r)?r:'404',art);seoMeta(r,art);
 if(!keepScroll&&scrollY>0){const top=$('#site').getBoundingClientRect().top+scrollY-60;scrollTo({top:Math.max(0,Math.min(scrollY,top))});}
 pathLinks($('#site'));count();bindSim();bindFaq();if(!keepScroll)animate(first);onScroll();
 if(pendingAnchor){const a=pendingAnchor;pendingAnchor=null;setTimeout(()=>goAnchor(a),60);}}
