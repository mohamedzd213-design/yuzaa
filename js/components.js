/* yuzaa · components.js
   Composants réutilisables : cartes produits, tableaux, panier, panneau panier latéral, équipe. */
/* ---------- Composants ---------- */
const pcard=(d,disc)=>{const p=P[d];return `<div class="pcard bg-${d}" style="--c1:${p.c1};--c3:${p.c3};--c7:${p.c7}"><a href="#produit-${d}" class="media" aria-label="Voir ${p.name}">${tinSVG(d)}</a><span class="pastille pastille-${d}">${p.moment} · ${p.mg} mg</span><a href="#produit-${d}" style="text-decoration:none"><h3>${p.name}</h3></a><span class="prate"><span class="stars" aria-hidden="true">${stars(p.rating)}</span>${String(p.rating).replace('.',',')}/5 · ${p.n} avis</span><p class="t-sm muted">${p.plants}. ${p.taste}.</p><div class="row"><span class="price">${eur(p.price)} <small>100 g · 0,30 € la tasse</small></span><a class="btn btn-primary btn-sm" href="#produit-${d}">Découvrir</a></div></div>`;};
const multi=()=>pkImg(IMG.trio,'Les trois tubes Éveil, Focus et Rush');
const bouleSVG=()=>`<img class="ph" src="${IMG.bouleA}" alt="Boule à thé portable yuzaa en inox, devant sa boîte en carton recyclé" loading="lazy" decoding="async">`;
const bouleGal=()=>{const a=['bouleA','Boule à thé portable en inox devant sa boîte yuzaa'],b=['bouleB','Boule à thé portable et sa boîte yuzaa, vue de côté'];const im=([k,t])=>`<img class="ph" src="${IMG[k]}" alt="${t}" decoding="async">`;return `<div class="gal"><div class="media main" id="gmain" style="aspect-ratio:1/1">${im(a)}</div><div class="thumbs"><button type="button" class="media on" data-gal aria-label="Voir la photo 1">${im(a)}</button><button type="button" class="media" data-gal aria-label="Voir la photo 2">${im(b)}</button></div></div>`;};
const cmedia=k=>k==='boule'?bouleSVG():multi();
const cprice=k=>{const c=C[k];return eur(c.price)+(c.old?` <small><s>${eur(c.old)}</s></small>`:'');};
const ccard=k=>{const c=C[k];const q=P[c.c]||P.eveil;return `<div class="pcard bg-${c.c}" style="--c1:${q.c1};--c3:${q.c3};--c7:${q.c7}"><a href="#coffret-${k}" class="media" aria-label="Voir ${c.name}">${cmedia(k)}</a><span class="pastille pastille-${c.c}">${c.tag}</span><a href="#coffret-${k}" style="text-decoration:none"><h3 style="font-size:26px">${c.name}</h3></a><p class="t-sm muted">${c.contenu}</p><div class="row"><span class="price">${cprice(k)}</span><a class="btn btn-ghost btn-sm" href="#coffret-${k}">Découvrir</a></div></div>`;};
const acard=a=>`<a class="acard" href="#article-${a.id}"><div class="media">${artIll(a)}</div><span class="t-over over">${a.cat} · ${a.min} min</span><h3>${a.t}</h3><p>${a.ex}</p></a>`;
const field=(id,label,type,rule,extra='')=>`<div class="field"><label for="${id}">${label}</label><input class="input" id="${id}" name="${id}" type="${type}" data-rule="${rule}" aria-describedby="${id}-err" ${extra}><span class="err" id="${id}-err"></span></div>`;
const STEPS=['Panier','Connexion','Livraison','Paiement','Confirmation'];
const stepper=n=>`<div class="stepper" aria-label="Étapes de commande">${STEPS.map((s,i)=>`<span class="${i<n?'done':i===n?'on':''}" ${i===n?'aria-current="step"':''}><i>${i<n?'✓':i+1}</i><em style="font-style:normal">${s}</em></span>`).join('')}</div>`;
const heroCard=d=>{const p=P[d];return `<a class="hcard hc-${d}" href="#produit-${d}" style="--c1:${p.c1};--c3:${p.c3};--c7:${p.c7}" aria-label="Découvrir ${p.name} : ${p.moment.toLowerCase()}, ${p.mg} mg de caféine, ${eur(p.price)}"><span class="media hc-media">${pkImg(IMG[d+'F'],'','pk-hc')}</span><span class="hc-body"><span class="pastille pastille-${d}">${p.moment} · ${p.mg} mg</span><h2 class="hc-name">${p.name}</h2><span class="hc-plants">${p.plants}</span><span class="hc-rate"><span class="stars" aria-hidden="true">${stars(p.rating)}</span>${String(p.rating).replace('.',',')}/5 · ${p.n} avis</span><span class="hc-row"><span class="price">${eur(p.price)} <small>· 100 g</small></span><span class="btn btn-sm hc-btn">Découvrir</span></span></span></a>`;};
const cmpTable=links=>`<div class="cmpw"><table class="cmp"><thead><tr><th>Recette</th><th>Caféine / tasse</th><th>Plantes</th><th>Goût</th><th>Moment</th><th>Vrac 100 g</th><th>20 sachets</th>${links?'<th aria-label="Fiche produit"></th>':''}</tr></thead><tbody>${['eveil','focus','rush'].map(d=>{const p=P[d];return `<tr><td><span class="pastille pastille-${d}">${p.name}</span></td><td><b><span data-count="${p.mg}">${p.mg}</span> mg</b></td><td>${p.plants}</td><td>${p.taste}</td><td>${p.moment}</td><td>${eur(p.price)}</td><td>6,90 €</td>${links?`<td><a class="link" href="#produit-${d}">Découvrir</a></td>`:''}</tr>`}).join('')}</tbody></table></div>`;
const simBlock=()=>`<section class="sec-tight" id="canettes"><div class="wrap"><div class="sim">
 <div><span class="t-over" style="color:var(--eveil-300)">Comparatif</span><h2 class="t-h2" style="margin-top:8px">Le vrai coût de vos canettes</h2><p style="margin-top:12px">Une canette coûte en moyenne 1,50 € au distributeur, une tasse yuzaa 0,30 €. Faites le calcul.</p>${ill('price','','ill-sim')}
  <label for="sim" style="display:block;margin-top:24px;font-weight:600">Canettes par jour : <output id="simv">2</output></label><input type="range" id="sim" min="1" max="5" value="2" step="1"></div>
 <div class="simout"><div><span class="t-sm">Canettes / mois</span><span class="big" id="sim-a">69 €</span></div><div><span class="t-sm">yuzaa / mois</span><span class="big" id="sim-b">14 €</span></div><div class="save"><span class="t-sm" style="font-weight:600">Économie annuelle</span><span class="big" id="sim-c">662 €</span><span class="t-cap" style="color:var(--sable-800)">Base : 23 jours ouvrés par mois, une tasse pour une canette.</span></div></div>
</div></div></section>`;
const degres=(d='eveil')=>`<section class="sec deg" id="degres"><div class="wrap">
 <div class="deg-top">
  <div class="deg-vis" aria-hidden="true"><span class="thermo"><i></i></span><span class="deg-num"><span data-count="80">80</span><sup>°C</sup></span><span class="deg-mug">${ILL.deg(d)}</span></div>
  <div><span class="t-over" style="color:var(--eveil-700)">Le bon degré</span><h2 class="t-h2" style="margin-top:8px">80 degrés, la température juste</h2>
   <p>Une eau bouillante brûle les feuilles et libère leur amertume. À 80 °C, le guayusa, le maté et le guarana livrent tous leurs arômes, en douceur. Sans thermomètre : portez l'eau à ébullition, puis laissez-la reposer 2 minutes.</p>
   <a class="link" href="#faq" data-anchor="q-80" style="display:inline-block;margin-top:14px">Pourquoi 80 °C ? La réponse dans la FAQ →</a></div>
 </div>
 <h3 class="deg-sub">Usage · Comment ça marche</h3>
 <ol class="deg-steps">
  <li><b>1</b><h4>Chauffez l'eau à 80 °C</h4><p>Frémissante, jamais bouillante : le secret d'une infusion sans amertume.</p></li>
  <li><b>2</b><h4>2,5 g pour 25 cl</h4><p>Une cuillère à café de vrac dans votre boule à thé, ou un sachet.</p></li>
  <li><b>3</b><h4>Infusez 5 minutes</h4><p>Retirez l'infuseur : votre tasse est prête, chaude ou sur glaçons.</p></li>
  <li><b>4</b><h4>Deux tasses par jour</h4><p>Focus le matin, Éveil l'après-midi, Rush les jours décisifs. Dernière tasse avant 16 h.</p></li>
 </ol>
</div></section>`;
const vsCol=(k,cur,lab,li)=>{const c=C[k];return `<div class="vs-col bg-${c.c}${cur===k?' is-cur':''}"><div class="media vs-media">${cmedia(k)}</div><span class="pastille pastille-${c.c}">${lab}</span><h3>${c.name}</h3><p class="price">${cprice(k)}</p><ul>${li.map(x=>`<li>${ico.check}<span>${x}</span></li>`).join('')}</ul>${cur===k?'<span class="vs-here">Vous consultez ce coffret</span>':`<a class="btn btn-ghost btn-sm" href="#coffret-${k}">Découvrir</a>`}</div>`;};
const cofCompare=cur=>`<div class="vs">
 <div class="vs-head"><span class="t-over over">Coffret ou pack ?</span><h2 class="t-h2" style="margin-top:8px">Coffret Découverte ou Pack Partiels ?</h2><p>Le Coffret Découverte permet de goûter les trois recettes en petites quantités, à petit prix. Le Pack Partiels réunit les trois gammes en format complet, pour faire le plein.</p></div>
 <div class="vs-grid">${vsCol('decouverte',cur,'Petit format · pour débuter',['<b>3 × 30 g</b>, environ 12 tasses de chaque recette','Boule à thé portable incluse','Le moins cher pour découvrir la gamme'])}<span class="vs-or" aria-hidden="true">ou</span>${vsCol('partiels',cur,'Format complet · 3 gammes',['<b>3 × 100 g</b>, environ 40 tasses de chaque recette','Les trois gammes en format complet','2,80 € d\'économie par rapport à l\'achat à l\'unité'])}</div>
 <p class="t-sm muted">Encore un doute ? <a class="link" href="#faq" data-anchor="q-coffrets">Consultez la FAQ</a></p>
</div>`;
const askFaq=()=>`<div class="askfaq"><div><b>Vous vous posez des questions ?</b><p class="t-sm muted">Caféine, préparation, livraison : nous avons rassemblé toutes les réponses.</p></div><div class="askfaq-links"><a href="#faq" data-anchor="q-tasses">Combien de tasses par jour ?</a><a href="#faq" data-anchor="q-80">Pourquoi 80 °C ?</a><a href="#faq" data-anchor="q-livraison">Délais de livraison</a><a class="btn btn-primary btn-sm" href="#faq">Consulter la FAQ</a></div></div>`;
const faqHome=()=>`<section class="sec-tight" id="faq-accueil"><div class="wrap faqh">
 <div><span class="t-over over">Questions fréquentes</span><h2 class="t-h2">Vous vous posez des questions ?</h2><p class="muted">Caféine, préparation, coffrets, livraison : l'essentiel en un coup d'œil.</p><a class="btn btn-ghost" href="#faq">Toutes les questions</a></div>
 <div>${['q-cafeine','q-tasses','q-80','q-coffrets','q-livraison'].map(id=>`<details class="cond"><summary>${FQ[id][0]}</summary><p>${FQ[id][1]}</p></details>`).join('')}</div>
</div></section>`;
const inl=k=>{if(P[k]){const p=P[k];return `<aside class="inprod bg-${k}" aria-label="Produit lié : ${p.name}"><a class="media" href="#produit-${k}" tabindex="-1" aria-hidden="true">${tinSVG(k)}</a><div><span class="pastille pastille-${k}">${p.moment} · ${p.mg} mg</span><b>${p.name}</b><p>${p.plants}. ${p.taste}.</p><div class="inprod-row"><span class="price">${eur(p.price)} <small>· 100 g</small></span><a class="link" href="#produit-${k}">Découvrir ${p.name} →</a></div></div></aside>`;}
 const c=C[k];return `<aside class="inprod bg-${c.c}" aria-label="Produit lié : ${c.name}"><a class="media" href="#coffret-${k}" tabindex="-1" aria-hidden="true">${cmedia(k)}</a><div><span class="pastille pastille-${c.c}">${c.tag}</span><b>${c.name}</b><p>${c.contenu}</p><div class="inprod-row"><span class="price">${cprice(k)}</span><a class="link" href="#coffret-${k}">Découvrir →</a></div></div></aside>`;};
const alink=id=>{const a=ARTS.find(x=>x.id===id);return a?`«&nbsp;<a class="link" href="#article-${a.id}">${a.t}</a>&nbsp;»`:'';};
const BIO=['Fatoumata coordonne l\'équipe yuzaa et partage ses routines pour garder une énergie régulière, même pendant les semaines chargées.','Yacine raconte l\'histoire de yuzaa et recueille vos astuces pour traverser les périodes intenses.','Lou-ann accompagne nos partenaires et teste chaque nouvelle façon de préparer nos infusions.','Mohamed veille à ce qu\'une tasse yuzaa reste à 0,30 € et signe nos recettes les plus gourmandes.','Tenah suit nos approvisionnements, de la récolte des plantes jusqu\'à votre porte.','Zeina compose nos recettes et veille à la teneur en caféine de chacune, de la plante à la boîte.'];
const authorBox=a=>{const [n,r,img]=TEAM[a.au];return `<aside class="author" aria-label="À propos de l'auteur"><span class="avatar"><img src="${img}" alt="${n}" width="96" height="96" loading="lazy"></span><div><span class="t-over over">Écrit par</span><b>${n}</b><small>${r} chez yuzaa</small><p>${BIO[a.au]}</p><a class="link t-sm" href="#histoire" data-anchor="equipe">Rencontrer l'équipe →</a></div></aside>`;};
const authForms=next=>`<div class="auth">
 <form class="card form" data-form="login" ${next?`data-next="${next}"`:''} novalidate><h2 class="t-h4">Déjà client ?</h2><p class="t-sm muted" style="margin-top:-8px">Connectez-vous pour retrouver votre adresse et vos commandes.</p><div class="alert alert-err" id="login-msg" hidden role="alert"></div>
  ${field('l-email','E-mail','email','req email','autocomplete="email" placeholder="prenom@email.fr"')}
  ${field('l-pw','Mot de passe','password','req','autocomplete="current-password"')}
  <button class="linkbtn" type="button" data-toast="Un lien de réinitialisation vous sera envoyé par e-mail.">Mot de passe oublié ?</button>
  <button class="btn btn-primary btn-block" type="submit">Se connecter</button></form>
 <form class="card form" data-form="register" ${next?`data-next="${next}"`:''} novalidate><h2 class="t-h4">Nouveau client ?</h2><p class="t-sm muted" style="margin-top:-8px">Créez votre compte en quelques secondes pour suivre vos commandes.</p><div class="alert alert-err" id="reg-msg" hidden role="alert"></div>
  <div class="row2">${field('r-prenom','Prénom','text','req','autocomplete="given-name"')}${field('r-nom','Nom','text','req','autocomplete="family-name"')}</div>
  ${field('r-email','E-mail','email','req email','autocomplete="email" placeholder="prenom@email.fr"')}
  ${field('r-pw','Mot de passe','password','req pw','autocomplete="new-password"')}<span class="hint" style="margin-top:-10px">8 caractères minimum, dont un chiffre.</span>
  <label class="check"><input type="checkbox" id="r-news"> Recevoir la newsletter (conseils et offres, un e-mail par mois)</label>
  <div class="field"><label class="check"><input type="checkbox" id="r-cgu" data-rule="checked" aria-describedby="r-cgu-err"> J'accepte les <a class="link" href="#cgu">conditions générales d'utilisation</a></label><span class="err" id="r-cgu-err"></span></div>
  <button class="btn btn-primary btn-block" type="submit">Créer mon compte</button>
  <p class="t-cap">Vos informations sont enregistrées uniquement sur cet appareil.</p></form>
</div>`;
/* Dates et statut des commandes */
const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const addBD=(d,n)=>{const x=new Date(d);while(n>0){x.setDate(x.getDate()+1);if(x.getDay()%6)n--;}return x;};
const p2=n=>String(n).padStart(2,'0');
const fmtDay=d=>`${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
const fmtShort=s=>{const d=new Date(s);return p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+d.getFullYear();};
const fmtTime=d=>`${p2(d.getDate())}/${p2(d.getMonth()+1)} · ${p2(d.getHours())}:${p2(d.getMinutes())}`;
function ost(o){const t0=new Date(o.date),ship=addBD(t0,1),del=addBD(t0,2);ship.setHours(10,0,0,0);del.setHours(12,0,0,0);const now=new Date();const k=now<ship?'prep':now<del?'ship':'done';return{k,t0,ship,del,pill:k==='prep'?'En préparation':k==='ship'?'En livraison':'Livrée',label:k==='prep'?'Commande en préparation':k==='ship'?'Colis en cours de livraison':'Commande livrée'};}
const itemsTxt=o=>o.items.map(i=>i[2]+(i[1]>1?' × '+i[1]:'')).join(', ');
const miniTrack=s=>`<ol class="mtrack"><li class="done">Confirmée</li><li class="${s.k==='prep'?'now':'done'}">${s.k==='prep'?'En préparation':'Expédiée'}</li><li class="${s.k==='done'?'done':s.k==='ship'?'now':''}">Livrée</li></ol>`;

/* ---------- Panier ---------- */
const FREE=35;
function lineInfo(k){if(P[k])return{name:P[k].name,sub:P[k].key+' · vrac 100 g',price:P[k].price,media:tinSVG(k)};if(k.startsWith('sachets-')){const d=k.slice(8);return{name:P[d].name+' · sachets',sub:'Boîte de 20 sachets',price:6.9,media:tinSVG(d)};}const c=C[k];return{name:c.name,sub:c.contenu,price:c.price,media:cmedia(k)};}
function totals(){let sub=0;for(const[k,q]of Object.entries(state.cart)){sub+=lineInfo(k).price*q;}const disc=state.promo?sub*0.1:0;const free=(sub-disc)>=FREE;const ship=sub===0?0:free?0:4.9;return{sub,disc,ship,free,tot:sub-disc+ship};}
function count(){const n=Object.values(state.cart).reduce((a,b)=>a+b,0);const el=$('#count');el.textContent=n;el.hidden=n===0;}
function toast(html){const t=$('#toast');t.innerHTML=html;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2800);}
function add(k,q=1){state.cart[k]=(state.cart[k]||0)+q;count();cdrOpen(k);}
/* Panneau panier latéral */
let cdrLast=null;
function cdrHTML(hl){const keys=Object.keys(state.cart);const n=Object.values(state.cart).reduce((a,b)=>a+b,0);const nEl=$('#cdr-n');if(nEl)nEl.textContent=n?`(${n})`:'';
 if(!keys.length)return `<div class="cdr-empty"><p class="cdr-empty-t">Votre panier est vide.</p><p class="muted">Trois recettes, trois niveaux de caféine : trouvez celle qui vous correspond.</p><div class="cdr-recs">${['eveil','focus','rush'].map(d=>`<a class="cdr-rec rc-${d}" href="#produit-${d}" data-cdrclose>${pkImg(IMG[d+'F'],'')}<b>${P[d].name}</b><span>${P[d].mg} mg · ${eur(P[d].price)}</span></a>`).join('')}</div><a class="btn btn-primary btn-block" href="#infusions" data-cdrclose>Découvrir les infusions</a></div>`;
 const t=totals();const left=Math.max(0,FREE-(t.sub-t.disc));
 return `<div class="cdr-ship ${t.free?'ok':''}"><p>${ico.truck}<span>${t.free?'<b>Livraison à domicile offerte.</b>':`Plus que <b>${eur(left)}</b> pour la livraison offerte.`}</span></p><div class="bar"><i style="width:${t.free?100:Math.min(100,(t.sub-t.disc)/FREE*100)}%"></i></div></div>
 <ul class="cdr-lines">${keys.map(k=>{const l=lineInfo(k);return `<li class="cdr-line${k===hl?' is-new':''}"><span class="cdr-media">${l.media}</span><div class="cdr-info"><b>${l.name}</b><span class="t-sm muted">${l.sub}</span><div class="cdr-row"><div class="qty qty-s"><button type="button" data-q="${k}" data-d="-1" aria-label="Retirer un ${esc(l.name)}">−</button><span>${state.cart[k]}</span><button type="button" data-q="${k}" data-d="1" aria-label="Ajouter un ${esc(l.name)}">+</button></div><b class="cdr-p">${eur(l.price*state.cart[k])}</b></div><button class="cdr-rm" type="button" data-rm="${k}">Retirer</button></div></li>`}).join('')}</ul>
 ${!state.cart.boule?`<div class="cdr-up"><span class="cdr-media">${bouleSVG()}</span><div><b>Boule à thé portable</b><span class="t-sm muted">Pour infuser votre vrac partout · 8,90 €</span></div><button class="btn btn-ghost btn-sm" type="button" data-add="boule">Ajouter</button></div>`:''}
 <div class="cdr-f"><div class="cdr-tot"><span>Sous-total</span><b>${eur(t.sub-t.disc)}</b></div><p class="t-cap">Livraison ${t.free?'offerte':'4,90 €, offerte dès 35 €'} · code promo à saisir dans le panier.</p>
 <a class="btn btn-primary btn-block" href="#${state.logged?'livraison':'connexion'}" data-cdrclose>Commander</a><a class="btn btn-ghost btn-block" href="#panier" data-cdrclose>Voir le panier</a>
 <p class="cdr-safe">${ico.lock}Paiement sécurisé · retours gratuits sous 30 jours</p></div>`;}
function cdrRefresh(hl){const b=$('#cdr-b');if(b){b.innerHTML=cdrHTML(hl);pathLinks(b);}}
function cdrOpen(hl){const m=$('#cdr');if(!m)return;cdrRefresh(hl);if(!m.hidden)return;cdrLast=document.activeElement;m.hidden=false;document.documentElement.classList.add('cdr-lock');requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('on')));setTimeout(()=>{const x=$('.cdr-x',m);if(x)x.focus({preventScroll:true});},still()?0:320);}
function cdrClose(){const m=$('#cdr');if(!m||m.hidden)return;m.classList.remove('on');document.documentElement.classList.remove('cdr-lock');setTimeout(()=>{m.hidden=true;},still()?0:380);if(cdrLast&&cdrLast.focus&&cdrLast.isConnected)cdrLast.focus({preventScroll:true});}

/* ---------- Équipe (photos issues du pitch) ---------- */
const TEAM=[['Fatoumata Dosso','Cheffe de projet','assets/img/equipe-fatoumata-dosso.jpg'],['Yacine Benchenna','Responsable marketing','assets/img/equipe-yacine-benchenna.jpg'],['Lou-ann Frossard','Responsable commerciale','assets/img/equipe-lou-ann-frossard.jpg'],['Mohamed Haddouche','Responsable financier','assets/img/equipe-mohamed-haddouche.jpg'],['Tenah Koffiye','Responsable logistique','assets/img/equipe-tenah-koffiye.jpg'],['Zeina Shahin','Responsable produit','assets/img/equipe-zeina-shahin.jpg']];
