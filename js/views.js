/* yuzaa · views.js
   Gabarits de toutes les pages (accueil, catalogue, fiches, coffrets, histoire, blog, compte, tunnel, FAQ, légal). */
/* ---------- Pages ---------- */
const V={};
const hmStars=n=>`<span class="hm-stars" aria-hidden="true">${'★★★★★'.slice(0,n)}${'☆☆☆☆☆'.slice(0,5-n)}</span>`;
const hmArrow='<svg class="hm-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const hmRecipe=d=>{const p=P[d];return `<article class="hm-rc rc-${d}" id="rc-${d}">
 <a class="hm-rc-media" href="#produit-${d}" aria-label="Découvrir ${p.name}"><span class="hm-arch"></span>${pkImg(IMG[d+'F'],`${p.name} : boîte de 20 sachets et tube de vrac 100 g`)}</a>
 <div class="hm-rc-body">
  <span class="hm-tag">${p.moment} · ${p.mg} mg</span>
  <h3 class="hm-rc-name"><a href="#produit-${d}">${p.name}</a></h3>
  <p class="hm-rc-plants">${p.plants}</p>
  <p class="hm-rc-rate">${hmStars(Math.round(p.rating))}<span>${String(p.rating).replace('.',',')}/5 · ${p.n} avis</span></p>
  <div class="hm-rc-buy"><p class="hm-rc-price">${eur(p.price)} <small>100 g · 0,30&nbsp;€ la tasse</small></p><a class="hm-btn hm-btn-rc" href="#produit-${d}" aria-label="Découvrir ${p.name}">Découvrir${hmArrow}</a></div>
 </div>
</article>`;};
const hmVs=(k,lab,li)=>{const c=C[k];return `<article class="hm-vs rc-${c.c}"><a class="hm-vs-media" href="#coffret-${k}" aria-label="Voir ${c.name}"><span class="hm-arch"></span>${cmedia(k)}</a><div class="hm-vs-body"><span class="hm-tag">${lab}</span><h3>${c.name}</h3><p class="hm-vs-price">${cprice(k)}</p><ul>${li.map(x=>`<li>${ico.check}<span>${x}</span></li>`).join('')}</ul><a class="hm-btn hm-btn-line" href="#coffret-${k}">Découvrir${hmArrow}</a></div></article>`;};
const hmMarquee=()=>{const it=[[ico.truck,'Livraison offerte dès 35&nbsp;€'],[ico.return,'Retours gratuits 30 jours'],[ico.lock,'Paiement sécurisé'],[ico.nosugar,'Sans sucre ajouté'],[ico.leaf,'100 % plantes'],[ico.tin,'Carton recyclé']];const row=it.map(([i,t])=>`<li>${i}${t}</li>`).join('');return `<div class="hm-marquee" aria-label="Nos garanties"><ul class="hm-mq-track">${row}</ul><ul class="hm-mq-track" aria-hidden="true">${row}</ul></div>`;};
const hmDeg=(d='eveil')=>`<section class="hm-sec hm-deg" id="degres"><div class="hm-wrap">
 <div class="hm-deg-top">
  <div class="hm-deg-num" aria-hidden="true"><span data-count="80">80</span><sup>°C</sup><span class="hm-deg-mug">${ILL.deg(d)}</span></div>
  <div class="hm-deg-txt"><span class="hm-eyebrow">Le bon degré</span><h2 class="hm-h2">80 degrés, la température juste</h2><p>Une eau bouillante brûle les feuilles et libère leur amertume. À 80 °C, le guayusa, le maté et le guarana livrent tous leurs arômes, en douceur. Sans thermomètre : portez l'eau à ébullition, puis laissez-la reposer 2 minutes.</p><a class="hm-link" href="#faq" data-anchor="q-80">Pourquoi 80 °C ? La réponse dans la FAQ&nbsp;→</a></div>
 </div>
 <h3 class="hm-deg-sub">Usage · Comment ça marche</h3>
 <ol class="hm-steps">
  <li><b>1</b><h4>Chauffez l'eau à 80 °C</h4><p>Frémissante, jamais bouillante : le secret d'une infusion sans amertume.</p></li>
  <li><b>2</b><h4>2,5 g pour 25 cl</h4><p>Une cuillère à café de vrac dans votre boule à thé, ou un sachet.</p></li>
  <li><b>3</b><h4>Infusez 5 minutes</h4><p>Retirez l'infuseur : votre tasse est prête, chaude ou sur glaçons.</p></li>
  <li><b>4</b><h4>Deux tasses par jour</h4><p>Focus le matin, Éveil l'après-midi, Rush les jours décisifs. Dernière tasse avant 16 h.</p></li>
 </ol>
</div></section>`;
const hmSim=()=>`<section class="hm-sec hm-sim-s" id="canettes"><div class="hm-wrap"><div class="hm-sim">
 <div class="hm-sim-l"><span class="hm-eyebrow">Comparatif</span><h2 class="hm-h2">Le vrai coût de vos canettes</h2><p>Une canette coûte en moyenne 1,50&nbsp;€ au distributeur, une tasse yuzaa 0,30&nbsp;€. Faites le calcul.</p>
  <label for="sim" class="hm-sim-lab">Canettes par jour : <output id="simv">2</output></label><input type="range" id="sim" min="1" max="5" value="2" step="1"></div>
 <div class="hm-sim-r"><div><span>Canettes / mois</span><b id="sim-a">69&nbsp;€</b></div><div><span>yuzaa / mois</span><b id="sim-b">14&nbsp;€</b></div><div class="hm-sim-save"><span>Économie annuelle</span><b id="sim-c">662&nbsp;€</b><small>Base : 23 jours ouvrés par mois, une tasse pour une canette.</small></div></div>
</div></div></section>`;
V.accueil=()=>`<div class="hm">
<section class="hm-hero" aria-labelledby="hero-t"><div class="hm-wrap hm-hero-g">
 <div class="hm-hero-txt">
  <span class="hm-eyebrow">Infusions énergisantes · 100 % plantes · Sans sucre ajouté</span>
  <h1 class="hm-h1" id="hero-t">Osez l'énergie végétale.</h1>
  <p class="hm-lead">Guayusa, maté et guarana : trois recettes riches en caféine naturelle, pour une énergie progressive, sans sucre ajouté ni arôme artificiel.</p>
  <div class="hm-ctas"><a class="hm-btn hm-btn-ink hm-btn-lg" href="#accueil" data-anchor="comparer">Découvrir les infusions${hmArrow}</a><a class="hm-btn hm-btn-line hm-btn-lg" href="#coffret-decouverte">Coffret Découverte · 19,90&nbsp;€</a></div>
  <a class="hm-proof-rate" href="#accueil" data-anchor="avis">${hmStars(5)}<span><b>4,7/5</b> · 439 avis vérifiés</span></a>
  <ul class="hm-proofs"><li>${ico.nosugar}Sans sucre ajouté</li><li>${ico.leaf}100 % plantes</li><li>${ico.tin}Carton recyclé</li></ul>
 </div>
 <div class="hm-hero-vis" aria-hidden="true">
  <div class="hm-hero-arch"><span class="hm-sun"></span><img src="${IMG.hero}" alt="" class="hm-hero-img" decoding="async"><span class="hm-floor"></span></div>
  <svg class="hm-seal" viewBox="0 0 120 120"><defs><path id="hmc" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0"/></defs><text><textPath href="#hmc">100 % PLANTES · SANS SUCRE AJOUTÉ · </textPath></text><g transform="translate(43 42) scale(.72)"><path d="M9 39C9 18 22 6 44 4c0 23-13 35-35 35z" fill="currentColor"/></g></svg>
  <span class="hm-chip hm-chip-a"><b>40 · 60 · 80</b> mg de caféine par tasse</span>
 </div>
</div></section>
${hmMarquee()}

<section class="hm-sec" id="comparer"><div class="hm-wrap">
 <div class="hm-head"><div><span class="hm-eyebrow">Comparer les recettes</span><h2 class="hm-h2">Éveil, Focus ou Rush&nbsp;: laquelle choisir ?</h2></div><p class="hm-head-p">Repère : un espresso ou une canette de 250 ml contiennent environ 80 mg de caféine. <a class="hm-link" href="#infusions">Voir toute la gamme&nbsp;→</a></p></div>
 <div class="hm-rcs">${['eveil','focus','rush'].map(hmRecipe).join('')}</div>
 <p class="hm-foot">Vous hésitez ? <a class="hm-link" href="#coffret-decouverte">Goûtez les trois avec le Coffret Découverte, 19,90&nbsp;€</a><span aria-hidden="true">·</span><a class="hm-link" href="#accueil" data-anchor="faq-accueil">Questions fréquentes</a></p>
 <div class="hm-table">${cmpTable(1)}</div>
</div></section>

<section class="hm-sec hm-why"><div class="hm-wrap hm-why-g">
 <div class="hm-why-head"><span class="hm-eyebrow">Pourquoi yuzaa</span><h2 class="hm-h2">Une énergie transparente</h2><a class="hm-btn hm-btn-line" href="#engagements">Nos engagements${hmArrow}</a></div>
 <ol class="hm-why-list">
  <li><span class="hm-why-n">01</span><span class="hm-ico">${ico.lab}</span><h3>Caféine affichée</h3><p>Une teneur précise sur chaque recette : 40, 60 ou 80 mg par tasse. <a class="hm-link" href="#faq" data-anchor="q-cafeine">En savoir plus</a></p></li>
  <li><span class="hm-why-n">02</span><span class="hm-ico">${ico.nosugar}</span><h3>Zéro sucre ajouté</h3><p>Ni sucre, ni édulcorant, ni arôme artificiel. Uniquement des plantes.</p></li>
  <li><span class="hm-why-n">03</span><span class="hm-ico">${ico.leaf}</span><h3>100 % plantes</h3><p>Guayusa, maté et guarana, associés à la citronnelle, au gingembre ou au cacao. <a class="hm-link" href="#histoire" data-anchor="producteurs">Nos producteurs</a></p></li>
  <li><span class="hm-why-n">04</span><span class="hm-ico">${ico.tin}</span><h3>Emballage responsable</h3><p>Des boîtes en carton recyclé et des retours gratuits sous 30 jours.</p></li>
 </ol>
</div></section>

${hmDeg('eveil')}

<section class="hm-sec hm-day-s"><div class="hm-wrap"><div class="hm-day">
 <div class="hm-head"><div><span class="hm-eyebrow">Guide de la caféine</span><h2 class="hm-h2">La bonne intensité, au bon moment</h2></div><a class="hm-link" href="#article-cafeine-moment">Lire le guide&nbsp;→</a></div>
 <div class="hm-dayline" aria-hidden="true"><i class="hm-dl-f"></i><i class="hm-dl-e"></i><i class="hm-dl-n"></i><span class="hm-pin" style="left:8%">Focus · 8 h 30</span><span class="hm-pin" style="left:46%">Éveil · 14 h</span><span class="hm-pin hm-pin-n" style="left:60%">Plus de caféine après 16 h</span></div>
 <div class="hm-hours" aria-hidden="true"><span>7 h</span><span>10 h</span><span>13 h</span><span>16 h</span><span>19 h</span><span>22 h</span></div>
 <div class="hm-moments"><div class="rc-focus"><b>Le matin</b><span>Focus · 60 mg, pour une matinée de cours ou de travail exigeante.</span></div><div class="rc-eveil"><b>Après le déjeuner</b><span>Éveil · 40 mg, pour relancer l'après-midi en préservant le sommeil.</span></div><div class="rc-rush"><b>Jour d'examen</b><span>Rush · 80 mg, le matin, en remplacement de Focus.</span></div></div>
 <p class="hm-note">Combien de tasses par jour ? <a class="hm-link" href="#faq" data-anchor="q-tasses">Nos repères dans la FAQ</a></p>
</div></div></section>

<section class="hm-sec hm-reviews" id="avis"><div class="hm-wrap hm-rv-g">
 <div class="hm-rv-head"><span class="hm-eyebrow">Avis clients</span><h2 class="hm-rv-score"><b>4,7/5</b><span>439 avis vérifiés</span></h2>${hmStars(5)}<a class="hm-link" href="#produit-focus" data-anchor="avis">Voir tous les avis&nbsp;→</a></div>
 <div class="hm-rv-list">
  <figure class="hm-rv"><span class="hm-stars" aria-label="5 sur 5">★★★★★</span><blockquote>« J'ai remplacé mes deux canettes quotidiennes par Focus le matin et Éveil l'après-midi. Mon énergie est plus régulière et je dors mieux. »</blockquote><figcaption><span class="hm-av rc-focus">I</span>Inès, 22 ans · alternante en marketing</figcaption></figure>
  <figure class="hm-rv"><span class="hm-stars" aria-label="5 sur 5">★★★★★</span><blockquote>« Je ne bois pas de café. Rush, avec ses notes torréfiées et cacaotées, est devenu mon allié pendant les examens. »</blockquote><figcaption><span class="hm-av rc-rush">M</span>Malik, 20 ans · étudiant en licence</figcaption></figure>
  <figure class="hm-rv"><span class="hm-stars" aria-label="4 sur 5">★★★★☆</span><blockquote>« Le coffret Découverte m'a permis de trouver ma recette. La boule à thé me suit désormais à la bibliothèque. »</blockquote><figcaption><span class="hm-av rc-eveil">C</span>Clara, 19 ans · étudiante en licence</figcaption></figure>
 </div>
</div></section>

${hmSim()}

<section class="hm-sec" id="coffrets-accueil"><div class="hm-wrap">
 <div class="hm-head"><div><span class="hm-eyebrow">Coffret ou pack ?</span><h2 class="hm-h2">Coffret Découverte ou Pack Partiels ?</h2></div><p class="hm-head-p">Le Coffret Découverte permet de goûter les trois recettes en petites quantités, à petit prix. Le Pack Partiels réunit les trois gammes en format complet, pour faire le plein.</p></div>
 <div class="hm-vss">${hmVs('decouverte','Petit format · pour débuter',['<b>3 × 30 g</b>, environ 12 tasses de chaque recette','Boule à thé portable incluse','Le moins cher pour découvrir la gamme'])}${hmVs('partiels','Format complet · 3 gammes',['<b>3 × 100 g</b>, environ 40 tasses de chaque recette','Les trois gammes en format complet','2,80&nbsp;€ d\'économie par rapport à l\'achat à l\'unité'])}</div>
 <p class="hm-note">Encore un doute ? <a class="hm-link" href="#faq" data-anchor="q-coffrets">Consultez la FAQ</a></p>
 <a class="hm-boule" href="#coffret-boule"><span class="hm-boule-img">${bouleSVG()}</span><span class="hm-boule-txt"><b>Et pour infuser partout : la boule à thé portable</b><span>Réutilisable, sans sachet jetable · 8,90&nbsp;€</span></span><span class="hm-btn hm-btn-ink">Découvrir${hmArrow}</span></a>
</div></section>

<section class="hm-sec" id="faq-accueil"><div class="hm-wrap hm-faq">
 <div class="hm-faq-head"><span class="hm-eyebrow">Questions fréquentes</span><h2 class="hm-h2">Vous vous posez des questions ?</h2><p>Caféine, préparation, coffrets, livraison : l'essentiel en un coup d'œil.</p><a class="hm-btn hm-btn-line" href="#faq">Toutes les questions${hmArrow}</a></div>
 <div class="hm-faq-list">${['q-cafeine','q-tasses','q-80','q-coffrets','q-livraison'].map(id=>`<details class="hm-q"><summary>${FQ[id][0]}<span class="hm-q-i" aria-hidden="true"></span></summary><p>${FQ[id][1]}</p></details>`).join('')}</div>
</div></section>

<section class="hm-sec hm-journal"><div class="hm-wrap">
 <div class="hm-head"><div><span class="hm-eyebrow">Le journal</span><h2 class="hm-h2">Conseils &amp; rituels</h2></div><a class="hm-link" href="#blog">Tous les articles&nbsp;→</a></div>
 <div class="hm-arts">${ARTS.slice(0,3).map(a=>`<a class="hm-art" href="#article-${a.id}"><span class="hm-art-media">${artIll(a)}</span><span class="hm-art-meta">${a.cat} · ${a.min} min</span><h3>${a.t}</h3><p>${a.ex}</p></a>`).join('')}</div>
</div></section>
</div>`;
V.infusions=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Nos infusions</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <h1 class="t-h1">Nos infusions énergisantes</h1>
 <p class="t-lg muted" style="max-width:62ch;margin-top:12px">Trois recettes 100 % plantes, trois niveaux de caféine naturelle. Disponibles en vrac (100 g, environ 40 tasses) ou en boîte de 20 sachets. Pour découvrir la gamme, commencez par le Coffret Découverte.</p>
 <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;margin-block:32px 24px">
  <div class="chips" role="group" aria-label="Filtrer par moment">${[['tout','Toutes'],['apres-midi','Énergie douce'],['matin','Concentration'],['rush','Coup de boost']].map(([v,l])=>`<button class="chip" type="button" data-filter="${v}" aria-pressed="${state.filter===v}">${l}</button>`).join('')}</div>
  <select class="input psort" id="psort" style="width:auto" aria-label="Trier"><option value="mg"${state.sort==='mg'?' selected':''}>Trier : caféine croissante</option><option value="note"${state.sort==='note'?' selected':''}>Trier : mieux notées</option></select>
 </div>
 <div class="g3" id="plist">${['eveil','focus','rush'].filter(d=>state.filter==='tout'||P[d].mom===state.filter).sort((a,b)=>state.sort==='note'?P[b].rating-P[a].rating:P[a].mg-P[b].mg).map(d=>pcard(d)).join('')}${state.filter==='tout'?ccard('decouverte')+ccard('partiels')+ccard('boule'):''}</div>
</div></section>
<section class="sec" id="comparer"><div class="wrap">
 <h2 class="t-h2">Comparer les recettes</h2><p class="muted" style="margin-block:8px 24px">Repère : un espresso ou une canette de 250 ml contiennent environ 80 mg de caféine.</p>
 ${cmpTable(1)}
 <p class="t-sm muted" style="margin-top:16px">Une question sur la caféine ou la préparation ? <a class="link" href="#faq" data-anchor="faq-cafeine">Consultez la FAQ</a></p>
</div></section>`;

function produit(d){const p=P[d];const others=['eveil','focus','rush'].filter(x=>x!==d);return `
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / <a href="#infusions">Nos infusions</a> / ${p.name}</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap pgrid">
 <div class="gal"><div class="media main rc-${d}" id="gmain">${tinSVG(d)}</div>
  <div class="thumbs"><button type="button" class="media on rc-${d}" data-gal aria-label="Voir le produit">${tinSVG(d)}</button><button type="button" class="media rc-${d}" data-gal aria-label="Voir le détail de la boîte">${backImg(d)}</button><button type="button" class="media rc-${d}" data-gal aria-label="Voir la plante">${botSVG(d)}</button></div></div>
 <div class="pinfo">
  <span class="pastille pastille-${d}">${p.moment}</span>
  <h1>${p.name}</h1>
  <p class="kw">${p.key} · ${p.mg} mg de caféine</p>
  <a href="#produit-${d}" data-anchor="avis" class="t-sm prate-link" style="color:var(--text-secondary)"><span class="stars">${stars(p.rating)}</span> ${String(p.rating).replace('.',',')}/5 · ${p.n} avis</a>
  <div class="pprice"><b id="pp-price">${eur(p.price)}</b><span id="pp-unit">Vrac 100 g · environ 40 tasses · 0,30 € la tasse</span></div>
  <p>${p.desc}</p>
  ${gauge(d)}
  <fieldset class="opts" style="border:0;padding:0;margin:0"><legend class="t-label" style="margin-bottom:10px">Format</legend>
   <label class="opt"><input type="radio" name="fmt" value="vrac" checked><span class="grow">Vrac · 100 g<small>Environ 40 tasses · 0,30 € la tasse</small></span><b>${eur(p.price)}</b></label>
   <label class="opt"><input type="radio" name="fmt" value="sachets"><span class="grow">Boîte de 20 sachets<small>Format pratique à emporter</small></span><b>6,90 €</b></label>
  </fieldset>
  <div class="buy"><div class="qty"><button type="button" data-pq="-1" aria-label="Retirer une boîte">−</button><span id="pq">1</span><button type="button" data-pq="1" aria-label="Ajouter une boîte">+</button></div><button class="btn btn-primary" style="flex:1" type="button" data-add="${d}" data-tone="${d}" data-useq>Ajouter au panier</button></div>
  <div class="reas"><span>${ico.truck}Livraison à domicile en 48 h · offerte dès 35 €</span><span>${ico.return}Retours gratuits sous 30 jours</span><span>${ico.lock}Paiement sécurisé · carte, PayPal, Apple Pay</span><span class="paysec"><span class="payb" role="img" aria-label="Visa, Mastercard, PayPal, Apple Pay"><i title="Visa"><svg viewBox="0 6.5 24 11" style="width:30px;height:14px" aria-hidden="true"><path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/></svg></i><i title="Mastercard"><svg viewBox="0 0 38 24" style="width:34px;height:22px" aria-hidden="true"><circle cx="15" cy="12" r="7.5" fill="#EB001B"/><circle cx="23" cy="12" r="7.5" fill="#F79E1B"/><path d="M19 5.6a7.5 7.5 0 0 1 0 12.8a7.5 7.5 0 0 1 0-12.8z" fill="#FF5F00"/></svg></i><i title="PayPal"><svg viewBox="0 0 24 24" style="width:16px;height:16px" aria-hidden="true"><path fill="#003087" d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/></svg></i><i title="Apple Pay"><svg viewBox="0 4 24 16" style="width:33px;height:22px" aria-hidden="true"><path fill="#000" d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z"/></svg></i></span></span></div>
 </div>
</div></section>

<div class="hm">${hmDeg(d)}</div>

<section class="sec-tight"><div class="wrap quality">
 <div class="card">${ill('flat',d,'ill-card')}<h2 class="t-h4">Composition</h2><dl class="kv"><dt>Ingrédients</dt><dd>${p.plants}*</dd><dt>Caféine</dt><dd>${p.mg} mg par tasse de 25 cl</dd><dt>Sucre</dt><dd>0 g, sans édulcorant</dd><dt>Formats</dt><dd>Vrac 100 g (≈ 40 tasses) · 20 sachets</dd><dt>Emballage</dt><dd>Boîte en carton recyclé</dd><dt>Allergènes</dt><dd>Aucun</dd></dl><p class="t-cap" style="margin-top:14px">* 100 % plantes, sans sucre ajouté. Déconseillé aux femmes enceintes ou allaitantes et aux moins de 16 ans.</p></div>
 <div class="card bg-sable" style="border:0"><h2 class="t-h4">Teneur en caféine</h2><dl class="kv"><dt>Par tasse</dt><dd><span data-count="${p.mg}">${p.mg}</span> mg</dd><dt>Repère</dt><dd>${d==='eveil'?'La moitié d\'un espresso':d==='focus'?'Les trois quarts d\'un espresso':'Un espresso'}</dd><dt>Conseil</dt><dd>2 tasses par jour maximum, pas après 16 h</dd></dl><a class="link" href="#faq" data-anchor="faq-cafeine" style="display:inline-block;margin-top:16px">Toutes vos questions sur la caféine →</a></div>
</div></section>

<section class="sec-tight" id="avis"><div class="wrap">
 <div class="sec-head"><div><h2 class="t-h2">Avis clients · ${p.name}</h2><p>${String(p.rating).replace('.',',')}/5 · ${p.n} avis vérifiés après achat</p></div><button class="btn btn-ghost btn-sm" type="button" data-toast="Vous pourrez laisser un avis après réception de votre commande.">Écrire un avis</button></div>
 <div class="g3"><div class="review"><span class="stars">★★★★★</span><p>« Aucune amertume, je le bois sans sucre. Je reste concentrée jusqu'à midi. »</p><footer>Sarah · étudiante en master</footer></div><div class="review"><span class="stars">★★★★★</span><p>« La teneur en caféine est indiquée sur la boîte : je sais exactement ce que je consomme. »</p><footer>Yanis · alternant développeur</footer></div><div class="review"><span class="stars">★★★★☆</span><p>« Excellent goût. Avec la boule à thé, je le prépare directement à la bibliothèque. »</p><footer>Léa · alternante commerce</footer></div></div>
 ${askFaq()}
</div></section>
<div class="hm">${hmSim()}</div>

<section class="sec-tight"><div class="wrap">
 <div class="sec-head"><div><h2 class="t-h2">Vous aimerez aussi</h2><p class="sec-links"><a class="link" href="#infusions">Voir toute la gamme</a><a class="link" href="#coffrets">Coffrets &amp; accessoires</a></p></div><div class="cnav"><button type="button" data-car="-1" aria-label="Précédent">←</button><button type="button" data-car="1" aria-label="Suivant">→</button></div></div>
 <div class="carousel" id="car">${others.map(x=>pcard(x)).join('')}${ccard('boule')}${ccard('decouverte')}${ccard('partiels')}</div>
</div></section>

<section class="sec-tight"><div class="wrap" style="max-width:860px">
 <h2 class="t-h3" style="margin-bottom:12px">Conditions</h2>
 <details class="cond"><summary>Livraison</summary><p>Livraison à domicile en 48 h en France métropolitaine : 4,90 €, offerte dès 35 € d'achat. Expédition sous 24 h ouvrées.</p></details>
 <details class="cond"><summary>Retours et remboursements</summary><p>Retours gratuits sous 30 jours. Le remboursement est effectué dès réception du colis.</p></details>
 <details class="cond"><summary>Précautions d'emploi</summary><p>Contient de la caféine. Ne pas dépasser deux tasses par jour. Déconseillé aux femmes enceintes ou allaitantes et aux moins de 16 ans.</p></details>
</div></section>
<div class="mbuy"><div><b>${p.name}</b><div class="t-sm muted">${eur(p.price)} · vrac 100 g</div></div><button class="btn btn-primary" type="button" data-add="${d}" data-tone="${d}" data-useq>Ajouter</button></div>`;}

V.coffrets=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Coffrets</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <h1 class="t-h1">Coffrets &amp; accessoires</h1>
 <p class="t-lg muted" style="max-width:62ch;margin-top:12px">Goûter la gamme, faire le plein des trois recettes ou infuser en déplacement : choisissez la formule qui vous correspond.</p>
 <div class="g3" style="margin-top:36px">${ccard('decouverte')}${ccard('partiels')}${ccard('boule')}</div>
</div></section>
<section class="sec-tight"><div class="wrap">${cofCompare('')}</div></section>
<section class="sec"><div class="wrap"><div class="band">${ill('cafe','','ill-band')}<div style="max-width:56ch"><span class="t-over" style="color:var(--eveil-700)">Pour les pros</span><h2 class="t-h3" style="margin-top:8px">Vous gérez un café, un coworking ou un BDE ?</h2><p class="muted">Des formats et des tarifs adaptés à votre établissement ou à vos événements, sur devis.</p></div><a class="btn btn-ghost" href="#pros">Demander un devis</a></div></div></section>`;

function coffret(k){const c=C[k];return `
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / <a href="#coffrets">Coffrets</a> / ${c.name}</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap pgrid">
 ${k==='boule'?bouleGal():`<div class="media main rc-${c.c}" style="aspect-ratio:1/1">${cmedia(k)}</div>`}
 <div class="pinfo"><span class="pastille pastille-${c.c}">${c.tag}</span><h1 style="font-size:clamp(36px,4.4cqi,52px)">${c.name}</h1>${c.sub?`<p class="cof-sub">${c.sub}</p>`:''}<p class="kw">${c.contenu}</p><p>${c.desc}</p>
 <div class="buy"><span class="price" style="font-size:28px;align-self:center;flex:1">${cprice(k)}</span><button class="btn btn-primary" type="button" data-add="${k}">Ajouter au panier</button></div>
 <div class="reas"><span>${ico.truck}Livraison à domicile en 48 h · offerte dès 35 €</span><span>${ico.return}Retours gratuits sous 30 jours</span><span>${ico.tin}Boîte en carton recyclé</span></div></div>
</div></section>
${k!=='boule'?`<section class="sec-tight"><div class="wrap">${cofCompare(k)}</div></section>`:''}
<section class="sec-tight"><div class="wrap"><h2 class="t-h2" style="margin-bottom:20px">Les recettes</h2><div class="steps4"><a class="step-l rc-eveil" href="#produit-eveil">${pkImg(IMG.eveilF,'Éveil : boîte de sachets et tube de vrac','pk-step')}<b>Éveil</b><p>Énergie douce, 40 mg.</p></a><a class="step-l rc-focus" href="#produit-focus">${pkImg(IMG.focusF,'Focus : boîte de sachets et tube de vrac','pk-step')}<b>Focus</b><p>Concentration, 60 mg.</p></a><a class="step-l rc-rush" href="#produit-rush">${pkImg(IMG.rushF,'Rush : boîte de sachets et tube de vrac','pk-step')}<b>Rush</b><p>Coup de boost, 80 mg.</p></a><a class="step-l" href="#faq" data-anchor="q-80"><span class="pk-step">${ILL.deg('focus')}</span><b>80 °C</b><p>5 minutes d'infusion, 2,5 g par tasse.</p></a></div></div></section>
<section class="sec-tight"><div class="wrap"><div class="sec-head"><h2 class="t-h2">Suggestions</h2></div><div class="g3">${k==='boule'?ccard('decouverte')+pcard('focus')+pcard('eveil'):k==='decouverte'?ccard('partiels')+ccard('boule')+pcard('focus'):pcard('focus')+pcard('eveil')+pcard('rush')}</div></div></section>
<section class="sec-tight"><div class="wrap" style="max-width:860px"><details class="cond"><summary>Conditions</summary><p>Livraison à domicile en 48 h : 4,90 €, offerte dès 35 € d'achat. Retours gratuits sous 30 jours. <a class="link" href="#faq" data-anchor="faq-commande">Toutes les réponses dans la FAQ</a></p></details></div></section>
<div class="mbuy"><div><b>${c.name}</b><div class="t-sm muted">${eur(c.price)}</div></div><button class="btn btn-primary" type="button" data-add="${k}">Ajouter</button></div>`;}

V.pros=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Pour les pros</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <span class="t-over over">Offre professionnelle</span><h1 class="t-h1" style="margin-top:8px">Pour les pros</h1><p class="t-lg muted" style="max-width:62ch;margin-top:12px">Proposez yuzaa à vos clients, à vos membres ou à vos adhérents. Formats, volumes et tarifs sur devis.</p>
 <div class="g3" style="margin-top:32px"><div class="plant bg-focus">${ill('cafe','','ill-card')}<h3>Cafés</h3><p class="t-sm">Du vrac en grand format pour votre carte, et une alternative au café pour ceux qui n'en boivent pas.</p></div><div class="plant bg-eveil">${ill('desk','','ill-card')}<h3>Coworkings</h3><p class="t-sm">Une station d'infusions en libre-service pour accompagner les longues journées de travail.</p></div><div class="plant bg-rush">${ill('stand','','ill-card')}<h3>BDE</h3><p class="t-sm">Des tarifs dédiés pour vos ventes et vos stands, et des échantillons pour les semaines d'examens.</p></div></div>
</div></section>
<section class="sec-tight" style="padding-bottom:80px"><div class="wrap" style="max-width:820px">
 <form class="card form" style="padding:32px" data-form="pros" novalidate><h2 class="t-h3">Demander un devis</h2><div class="alert alert-ok" id="pros-ok" hidden role="status">Demande envoyée. Nous revenons vers vous sous 48 h ouvrées avec une proposition.</div>
  <div class="row2">${field('p-structure','Nom de la structure','text','req','autocomplete="organization"')}<div class="field"><label for="p-type">Type</label><select class="input" id="p-type"><option>Café</option><option>Coworking</option><option>BDE / association étudiante</option><option>Autre</option></select></div></div>
  <div class="row2">${field('p-email','E-mail','email','req email','autocomplete="email"')}<div class="field"><label for="p-vol">Volume estimé par mois</label><select class="input" id="p-vol"><option>Moins de 1 kg</option><option>1 à 5 kg</option><option>Plus de 5 kg</option><option>Pour un événement</option></select></div></div>
  <div class="field"><label for="p-msg">Votre besoin</label><textarea class="input" id="p-msg" rows="4" data-rule="req min20" aria-describedby="p-msg-err" placeholder="Ex. : stand BDE pendant la semaine d'examens, environ 300 étudiants"></textarea><span class="err" id="p-msg-err"></span></div>
  <button class="btn btn-primary" type="submit" style="justify-self:start">Envoyer ma demande</button>
  <p class="t-sm muted">Questions fréquentes des professionnels : <a class="link" href="#faq" data-anchor="faq-pros">consultez la FAQ</a></p></form>
</div></section>`;

V.histoire=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Histoire &amp; producteurs</nav></div>
<section class="hero sh-hero"><div class="wrap g2">
 <div><span class="t-over over">Histoire &amp; producteurs</span>
  <h1 class="t-display">Au commencement, une feuille.</h1>
  <p class="hero-sub">Bien avant les canettes, l'énergie poussait dans les arbres.</p>
  <p class="lead">En Amazonie et en Amérique du Sud, on boit depuis des siècles du guayusa, du maté et du guarana pour commencer la journée, travailler ou se retrouver. yuzaa remet ce savoir dans votre tasse.</p>
  <nav class="subnav" aria-label="Sur cette page"><a href="#histoire" data-anchor="constat">Notre histoire</a><a href="#histoire" data-anchor="producteurs">Nos producteurs</a><a href="#histoire" data-anchor="equipe">L'équipe</a><a href="#engagements">Nos engagements</a></nav>
 </div>
 <div class="media">${leavesSVG()}</div>
</div></section>

<section class="sec" id="constat"><div class="wrap g2 sh-why">
 <div><span class="t-over over">Le constat</span><h2 class="t-h2" style="margin-block:8px 16px">Pourquoi yuzaa ?</h2>
  <p>Pendant nos longues journées de travail, l'énergie arrivait en canette : beaucoup de sucre, des arômes, des colorants, et des après-midis en dents de scie.</p>
  <p>Nous cherchions une alternative aussi efficace, mais plus simple. Nous l'avons trouvée dans des plantes que d'autres cultures connaissent depuis toujours.</p>
  <blockquote class="sh-quote">« Je fais attention à tout ce que je mange, sauf à ce qui me fait tenir la journée. »<cite>Une phrase entendue dans presque tous nos échanges avec nos clients.</cite></blockquote>
 </div>
 <div class="sh-stats">${ill('swap','','ill-card')}<div class="stat"><span class="t-sm">Une canette de 250 ml</span><b><span data-count="27">27</span> g</b><span class="t-sm">de sucre en moyenne</span></div><div class="stat is-brand"><span class="t-sm">Une tasse yuzaa</span><b>0 g</b><span class="t-sm">de sucre ajouté</span></div><div class="stat is-warm"><span class="t-sm">Le prix d'une tasse</span><b>0,30 €</b><span class="t-sm">contre 1,50 € la canette</span></div></div>
</div></section>

<section class="sec-tight"><div class="wrap"><div class="band" style="background:var(--bg-brand-subtle)">${ill('mix','','ill-band')}<div style="max-width:60ch"><span class="t-over over">Notre mission</span><h2 class="t-h3" style="margin-top:8px">Une énergie naturelle, simple et transparente.</h2><p class="muted">100 % plantes, sans sucre ajouté, en carton recyclé : les engagements qui guident chacune de nos recettes.</p></div><a class="btn btn-primary" href="#engagements">Découvrir nos engagements</a></div></div></section>

<section class="sec" id="producteurs"><div class="wrap">
 <div class="sec-head"><div><span class="t-over over">Nos producteurs</span><h2 class="t-h2" style="margin-top:8px">Trois plantes, trois terres, trois rituels</h2><p>Chaque recette yuzaa commence par une plante et par l'histoire des peuples qui l'ont fait connaître.</p></div></div>
 <div class="origins">
  <article class="origin"><div class="media">${landSVG('eveil')}</div><div>
   <span class="pastille pastille-eveil">Amazonie équatorienne · Éveil</span>
   <h3>Guayusa, la feuille de l'aube</h3>
   <p>Au pied des Andes, les familles kichwa se réveillent avant le soleil. Autour du feu, elles partagent une infusion de guayusa et se racontent leurs rêves de la nuit.</p>
   <p>Cette feuille d'un houx amazonien apporte une énergie douce et progressive. C'est la base d'Éveil, avec la citronnelle et la menthe.</p>
   <a class="link" href="#produit-eveil">Découvrir Éveil →</a></div></article>
  <article class="origin"><div class="media">${landSVG('focus')}</div><div>
   <span class="pastille pastille-focus">Forêts d'Amérique du Sud · Focus et Rush</span>
   <h3>Maté, la boisson du partage</h3>
   <p>Des forêts du Paraguay aux plaines d'Argentine, le maté se boit à plusieurs. La calebasse passe de main en main, pendant les études, au travail ou entre amis.</p>
   <p>Vert, il offre une concentration stable : c'est le cœur de Focus, avec le gingembre et le citron. Torréfié, il donne à Rush ses notes profondes.</p>
   <a class="link" href="#produit-focus">Découvrir Focus →</a></div></article>
  <article class="origin"><div class="media">${landSVG('rush')}</div><div>
   <span class="pastille pastille-rush">Amazonie brésilienne · Rush</span>
   <h3>Guarana, la graine qui ouvre les yeux</h3>
   <p>Sur les rives de l'Amazone, le peuple sateré-mawé cultive le guarana depuis des générations. Ses fruits rouges, entrouverts sur une graine noire, ressemblent à des yeux grands ouverts.</p>
   <p>C'est la plante la plus riche en caféine de notre gamme. Associée au cacao, elle fait de Rush la recette des grands jours.</p>
   <a class="link" href="#produit-rush">Découvrir Rush →</a></div></article>
 </div>
 <div class="chain"><div><span>01</span><b>La récolte</b><p>Feuilles de guayusa et de maté cueillies à la main, fruits de guarana récoltés à maturité, dans leurs régions d'origine.</p></div><div><span>02</span><b>Le séchage</b><p>Les feuilles sont séchées, le maté de Rush torréfié ; les graines de guarana sont grillées puis moulues.</p></div><div><span>03</span><b>L'assemblage</b><p>Nous associons chaque plante à ses partenaires aromatiques, puis conditionnons les recettes en carton recyclé.</p></div></div>
</div></section>

<section class="sec sh-team" id="equipe"><div class="wrap">
 <div class="sec-head"><div><span class="t-over over">L'équipe</span><h2 class="t-h2" style="margin-top:8px">Une équipe de six, derrière chaque tasse</h2><p>Six profils complémentaires, de la gestion de projet à la logistique, réunis autour d'une même conviction : l'énergie peut être naturelle.</p></div></div>
 <div class="team">${TEAM.map(([n,r,img])=>`<div class="member"><span class="avatar"><img src="${img}" alt="${n}, ${r}" width="120" height="120" loading="lazy"></span><b>${n}</b><small>${r}</small></div>`).join('')}</div>
</div></section>

<section class="sec-tight" style="padding-bottom:88px"><div class="wrap"><div class="sh-cta">
 <div><span class="t-over" style="color:var(--eveil-300)">Infusez vos journées</span><h2 class="t-h2" style="margin-top:8px">Trois origines, trois énergies.<br>Laquelle est la vôtre ?</h2><p>Éveil, Focus ou Rush : choisissez selon votre journée, ou goûtez les trois avec le Coffret Découverte.</p></div>
 <div class="cta-side">${pkImg(IMG.trio,'Les trois recettes yuzaa : Éveil, Focus et Rush','pk-cta')}<div class="ctas"><a class="btn btn-light" href="#infusions">Découvrir les recettes</a><a class="btn sh-ghost" href="#coffret-decouverte">Coffret Découverte · 19,90 €</a></div></div>
</div></div></section>`;

V.engagements=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Nos engagements</nav></div>
<section class="hero sh-hero"><div class="wrap g2">
 <div><span class="t-over over">Nos engagements</span>
  <h1 class="t-display">Une énergie naturelle, simple et transparente.</h1>
  <p class="hero-sub">Ce qui entre dans votre tasse, et ce qui n'y entrera jamais.</p>
  <p class="lead">Trois recettes, trois engagements et une règle : tout vous dire. Chaque boîte yuzaa affiche ses plantes, sa teneur en caféine et nos conseils de consommation.</p>
 </div>
 <div class="media">${multi()}</div>
</div></section>
<section class="sec"><div class="wrap">
 <div class="sec-head"><div><span class="t-over over">Nos trois engagements</span><h2 class="t-h2" style="margin-top:8px">Ce que nous mettons dans votre tasse</h2></div></div>
 <div class="g3">
  <div class="pillar">${ill('mix','','ill-card')}<h3>100 % plantes</h3><p>Des feuilles, des graines, des épices et des agrumes. Aucun arôme artificiel, aucun colorant.</p><ul class="eng-list"><li>Guayusa, maté vert, maté torréfié, guarana</li><li>Citronnelle, menthe, gingembre, citron, cacao</li><li>Rien d'autre</li></ul></div>
  <div class="pillar">${ill('mug','eveil','ill-card')}<h3>Sans sucre ajouté</h3><p>Ni sucre, ni édulcorant. La douceur vient des plantes elles-mêmes, pour une énergie régulière du matin au soir.</p><ul class="eng-list"><li>0 g de sucre ajouté par tasse</li><li>Contre 27 g dans une canette de 250 ml</li><li>Pas de pic de glycémie</li></ul></div>
  <div class="pillar"><figure class="illf ill-card ill-pk">${pkImg(IMG.trio,'Boîtes et tubes yuzaa en carton recyclé')}</figure><h3>Carton recyclé</h3><p>Boîtes, tubes et colis : nos emballages sont en carton recyclé. Pas de canette, pas de capsule.</p><ul class="eng-list"><li>Boîtes et tubes en carton recyclé</li><li>Colis en carton recyclé</li><li>Boule à thé réutilisable</li></ul></div>
 </div>
</div></section>
<section class="sec sh-band"><div class="wrap g2">
 <div><span class="t-over over">Transparence</span><h2 class="t-h2" style="margin-block:8px 16px">La caféine, en toutes lettres</h2><p class="muted">Chaque recette indique sa teneur en caféine par tasse de 25 cl, sur la boîte comme sur le site. Vous savez exactement ce que vous buvez, et vous choisissez votre intensité selon votre journée.</p><p class="t-sm muted" style="margin-top:12px">Repère : un espresso contient environ 80 mg de caféine.</p><a class="link" href="#faq" data-anchor="faq-cafeine" style="display:inline-block;margin-top:14px">Toutes vos questions sur la caféine →</a></div>
 <div class="eng-gauges">${['eveil','focus','rush'].map(d=>`<a class="eng-g" href="#produit-${d}"><span class="pastille pastille-${d}">${P[d].name}</span><b>${P[d].mg} mg</b><span class="eng-bar"><i style="width:${P[d].mg/80*100}%;background:${P[d].c5}"></i></span></a>`).join('')}</div>
</div></section>
<section class="sec"><div class="wrap g2" style="align-items:stretch">
 <div class="card eng-card">${ill('moon','','ill-card')}<span class="t-over over">Consommation responsable</span><h3 class="t-h4">Une énergie qui respecte votre sommeil</h3><p class="muted">Nous recommandons deux tasses par jour au maximum, la dernière avant 16 h. Nos infusions contiennent de la caféine : elles sont déconseillées aux femmes enceintes ou allaitantes, aux moins de 16 ans et aux personnes sensibles à la caféine.</p><a class="link" href="#faq" data-anchor="q-tasses">Nos repères de consommation →</a></div>
 <div class="card eng-card">${ill('price','','ill-card')}<span class="t-over over">Un prix juste</span><h3 class="t-h4">0,30 € la tasse</h3><p class="muted">Une énergie naturelle ne doit pas coûter plus cher qu'une canette. En vrac, une tasse yuzaa revient à 0,30 €, contre 1,50 € en moyenne pour une canette au distributeur.</p><a class="link" href="#accueil" data-anchor="canettes">Calculer vos économies →</a></div>
</div></section>
<section class="sec-tight" style="padding-bottom:88px"><div class="wrap"><div class="sh-cta">
 <div><span class="t-over" style="color:var(--eveil-300)">Infusez vos journées</span><h2 class="t-h2" style="margin-top:8px">D'où viennent nos plantes ?</h2><p>Guayusa d'Amazonie équatorienne, maté d'Amérique du Sud, guarana d'Amazonie brésilienne : découvrez nos producteurs et leurs rituels.</p></div>
 <div class="cta-side"><div class="bot-trio">${['eveil','focus','rush'].map(d=>`<span>${botSVG(d)}</span>`).join('')}</div><div class="ctas"><a class="btn btn-light" href="#histoire" data-anchor="producteurs">Histoire &amp; producteurs</a><a class="btn sh-ghost" href="#infusions">Découvrir les recettes</a></div></div>
</div></div></section>`;

V.blog=()=>{const cats=['Tous','Énergie','Plantes','Recettes','Routine'];const list=ARTS.slice(1).filter(a=>state.bfilter==='Tous'||a.cat===state.bfilter);return `
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Blog</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <h1 class="t-h1">Le journal yuzaa</h1><p class="t-lg muted" style="max-width:60ch;margin-top:12px">Caféine, plantes, recettes et rituels : nos conseils pour gérer votre énergie sans sacrifier votre sommeil.</p>
 <a class="feat" href="#article-${ARTS[0].id}" style="margin-top:40px"><div class="media">${artIll(ARTS[0])}</div><div><span class="t-over over">À la une · ${ARTS[0].cat}</span><h2 class="t-h2" style="margin-block:10px 12px">${ARTS[0].t}</h2><p class="muted">${ARTS[0].ex}</p><span class="link" style="display:inline-block;margin-top:16px">Lire l'article →</span></div></a>
</div></section>
<section class="sec-tight"><div class="wrap">
 <div class="chips" role="group" aria-label="Filtrer les articles" style="margin-bottom:28px">${cats.map(c=>`<button class="chip" type="button" data-bfilter="${c}" aria-pressed="${state.bfilter===c}">${c}</button>`).join('')}</div>
 <div class="g3">${list.length?list.map(acard).join(''):'<p class="muted">Aucun article dans cette catégorie pour le moment.</p>'}</div>
</div></section>
<section class="sec"><div class="wrap"><div class="band" style="background:var(--bg-brand-subtle)">${ill('kettle','','ill-band')}<div><h2 class="t-h3">Recevez nos conseils chaque mois</h2><p class="muted">Et profitez de −10 % sur votre première commande.</p></div><a class="btn btn-primary" href="#nl-email" data-focusnl>S'inscrire à la newsletter</a></div></div></section>`;};

const artFill=t=>(t||'').replace(/@@([a-z-]+)@@/g,(m,id)=>alink(id)).replace(/%%([a-z]+)%%/g,(m,k)=>inl(k));
const PERKS=()=>`<div class="perks">${[[ico.truck,'Livraison offerte','Dès 35 €, à domicile en 48 h'],[ico.lock,'Paiement sécurisé','Carte, PayPal, Apple Pay'],[ico.return,'Retours gratuits','Sous 30 jours'],[ico.tin,'Carton recyclé','Boîtes, tubes et colis']].map(([i,t,s])=>`<div><span class="ico">${i}</span><b>${t}</b><small>${s}</small></div>`).join('')}</div>`;
function article(id){const a=ARTS.find(x=>x.id===id)||ARTS[0];const [an,ar,ai]=TEAM[a.au];const rel=ARTS.filter(x=>x!==a&&!a.top.includes(x.id)).slice(0,3);return ` <div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / <a href="#blog">Blog</a> / ${a.cat}</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap art-w">
 <a class="pastille pastille-${a.c} art-cat" href="#blog">${a.cat}</a><h1 class="t-h1" style="margin-top:12px">${a.t}</h1>
 <div class="meta"><span class="meta-au"><img src="${ai}" alt="" width="28" height="28">Par ${an}, ${ar.toLowerCase()}</span><span>${a.min} min de lecture</span></div>
</div></section>
<div class="wrap art-w"><div class="media art-hero" style="aspect-ratio:16/9">${artIll(a)}</div></div>
<section class="sec-tight"><div class="wrap art-w"><article class="prose art">
 <p class="chapo">${a.chapo}</p><a class="art-cta" href="#${a.cta[0]}">${a.cta[1]} <span aria-hidden="true">→</span></a>
 <nav class="art-som" aria-label="Sommaire"><b class="t-over">Sommaire</b><ol>${a.toc.map(([i,t])=>`<li><a href="#article-${a.id}" data-scroll="${i}">${t}</a></li>`).join('')}</ol></nav>
 <div class="art-res"><b>Résumé</b><ul>${a.resume.map(x=>`<li>${x}</li>`).join('')}</ul></div>
 ${a.secs.map(s=>`<h2 id="${s.id}">${s.h}</h2>${artFill(s.p)}${(s.h3||[]).map(([t,p])=>`<h3>${t}</h3>${p.startsWith('<')?p:`<p>${artFill(p)}</p>`}`).join('')}${artFill(s.after)}`).join('')}
 <h2 id="${a.prod.id}">${a.prod.h}</h2><p>${a.prod.p}</p>${inl(a.prod.d)}
 <h2 id="${a.prec.id}">${a.prec.h}</h2>${a.prec.pre?`<p>${a.prec.pre}</p>`:''}<p>${a.prec.p}</p><h3>${a.prec.tt}</h3><div class="cmpw"><table class="cmp art-tab"><thead><tr>${a.prec.th.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${a.prec.rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <h2 id="${a.how.id}">${a.how.h}</h2>${artFill(a.how.p)}
 <p class="art-date">Publié le ${a.date}</p>${authorBox(a)}
</article></div></section>
<section class="sec-tight"><div class="wrap"><div class="sec-head"><div><span class="t-over over">Pour aller plus loin</span><h2 class="t-h2" style="margin-top:8px">Produits associés</h2></div><a class="link" href="#infusions">Toute la gamme →</a></div><div class="g4 art-prods">${a.prods.map(k=>P[k]?pcard(k):ccard(k)).join('')}</div></div></section>
<section class="sec-tight"><div class="wrap art-w"><h2 class="t-h3">Top articles</h2><div class="art-top">${a.top.map(i=>{const x=ARTS.find(y=>y.id===i);return `<a href="#article-${x.id}"><span class="t-over over">${x.cat} · ${x.min} min</span><b>${x.t}</b><p>${x.ex}</p></a>`;}).join('')}</div></div></section>
<section class="sec-tight"><div class="wrap art-w"><h2 class="t-h2" style="margin-bottom:16px">Questions fréquentes</h2>${a.faq.map(([q,r])=>`<details class="cond"><summary>${q}</summary><p>${r}</p></details>`).join('')}</div></section>
<section class="sec-tight"><div class="wrap"><div class="sec-head"><h2 class="t-h2">À lire aussi</h2><a class="btn btn-ghost" href="#blog">Voir le blog</a></div><div class="g3">${rel.map(acard).join('')}</div></div></section>
<section class="sec-tight" style="padding-bottom:72px"><div class="wrap">${PERKS()}</div></section>`;}
 V.article=()=>article(ARTS[0].id);

/* ---------- Compte client ---------- */
V.compte=()=>state.logged?acct('compte'):`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Mon compte</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <h1 class="t-h1" style="margin-bottom:10px">Mon compte</h1><p class="muted" style="margin-bottom:28px">Suivez vos commandes et retrouvez votre adresse en un clic.</p>
 ${authForms('')}
 <p class="t-sm muted" style="margin-top:24px">Besoin d'aide ? <a class="link" href="#faq">Consultez la FAQ</a> ou <a class="link" href="#contact">contactez-nous</a>.</p>
</div></section>`;
V['compte-commandes']=()=>state.logged?acct('commandes'):V.compte();
V['compte-profil']=()=>state.logged?acct('profil'):V.compte();
V.suivi=()=>state.logged?acct('suivi'):V.compte();
function acct(tab){const tabs=[['compte','Tableau de bord'],['compte-commandes','Mes commandes'],['suivi','Suivi de colis'],['compte-profil','Profil &amp; adresse']];const key={compte:'compte',commandes:'compte-commandes',suivi:'suivi',profil:'compte-profil'}[tab];const lab=tabs.find(x=>x[0]===key)[1];return `
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / ${tab==='compte'?'Mon compte':`<a href="#compte">Mon compte</a> / ${lab}`}</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap dash">
 <nav class="side" aria-label="Menu du compte">${tabs.map(([h,l])=>`<a href="#${h}"${h===key?' class="on" aria-current="page"':''}>${l}</a>`).join('')}<button type="button" data-logout>Se déconnecter</button></nav>
 <div class="dmain">${tab==='compte'?dashMain():tab==='commandes'?ordersMain():tab==='suivi'?suiviMain():profilMain()}</div>
</div></section>`;}
const emptyOrders=t=>`<div class="card empty-acc">${ill('mug','eveil','ill-empty')}<h2 class="t-h4">${t}</h2><p class="muted" style="max-width:52ch">Votre historique est vide. Trouvez la recette qui vous correspond, ou goûtez les trois avec le Coffret Découverte.</p><div class="ctas" style="margin-top:4px;justify-content:center"><a class="btn btn-primary" href="#infusions">Découvrir nos infusions</a><a class="btn btn-ghost" href="#coffret-decouverte">Coffret Découverte · 19,90 €</a></div><p class="t-sm muted">Première commande : −10 % pour les inscrits à la newsletter. <button class="linkbtn" type="button" data-nlopen>Recevoir mon code</button></p></div>`;
const profSum=()=>`<div class="g2" style="gap:20px;align-items:stretch"><div class="card" style="padding:24px"><h2 class="t-h4">Profil</h2><dl class="kv"><dt>Nom</dt><dd>${esc(me.prenom)} ${esc(me.nom)}</dd><dt>E-mail</dt><dd>${esc(me.email)}</dd><dt>Téléphone</dt><dd>${me.tel?esc(me.tel):'Non renseigné'}</dd><dt>Newsletter</dt><dd>${me.news?'Inscrit(e)':'Non inscrit(e)'}</dd></dl><a class="link t-sm" href="#compte-profil" style="display:inline-block;margin-top:12px">Modifier</a></div><div class="card" style="padding:24px"><h2 class="t-h4">Adresse de livraison</h2><p class="muted" style="margin-top:12px">${me.adr?`${esc(me.prenom)} ${esc(me.nom)}<br>${esc(me.adr)}<br>${esc(me.cp)} ${esc(me.ville)}`:'Aucune adresse enregistrée pour le moment.'}</p><a class="link t-sm" href="#compte-profil" style="display:inline-block;margin-top:12px">${me.adr?'Modifier':'Ajouter une adresse'}</a></div></div>`;
function dashMain(){const o=me.orders,last=o[0];
 if(!last)return `<div class="welcome"><h1 class="t-h3">Bonjour ${esc(me.prenom)}</h1><p class="muted">Bienvenue dans votre espace client. Vos commandes et leur suivi apparaîtront ici.</p></div>${emptyOrders('Aucune commande pour le moment')}${profSum()}`;
 const s=ost(last);return `<div class="welcome"><h1 class="t-h3">Bonjour ${esc(me.prenom)}</h1><p class="muted">${s.k==='done'?`Votre dernière commande a été livrée le ${fmtDay(s.del)}.`:`Votre commande ${last.n} est ${s.k==='prep'?'en préparation':'en cours de livraison'} : livraison prévue ${fmtDay(s.del)}.`}</p></div>
 ${s.k!=='done'?`<div class="card cur-order"><div><span class="t-over over">Commande en cours · ${last.n}</span><h2 class="t-h4" style="margin-top:6px">${s.label}</h2><p class="t-sm muted">${itemsTxt(last)} · ${eur(last.tot)}</p></div><a class="btn btn-primary btn-sm" href="#suivi">Suivre ma commande</a>${miniTrack(s)}</div>`:''}
 <div class="tiles"><div class="tile bg-focus"><span class="t-sm">Commandes</span><b>${o.length}</b><a class="link t-sm" href="#compte-commandes">Voir l'historique</a></div><div class="tile bg-eveil"><span class="t-sm">Commandes livrées offertes</span><b>${o.filter(x=>x.free).length}</b><span class="t-cap">Commandes de 35 € ou plus</span></div><div class="tile bg-rush"><span class="t-sm">Dernière commande</span><b>${fmtShort(last.date).slice(0,5)}</b><span class="t-cap">${eur(last.tot)} · ${s.pill}</span></div></div>
 ${profSum()}`;}
function ordersMain(){const o=me.orders;if(!o.length)return `<h1 class="t-h3">Mes commandes</h1>${emptyOrders('Aucune commande pour le moment')}`;return `<div class="card" style="padding:24px"><h1 class="t-h4" style="margin-bottom:12px">Mes commandes</h1><div style="overflow-x:auto"><table class="otable"><thead><tr><th>N°</th><th>Date</th><th>Contenu</th><th>Total</th><th>Statut</th></tr></thead><tbody>${o.map((x,i)=>{const s=ost(x);return `<tr><td>${x.n}</td><td>${fmtShort(x.date)}</td><td>${itemsTxt(x)}</td><td>${eur(x.tot)}${x.free?'<br><span class="t-cap">Livraison offerte</span>':''}</td><td>${s.k==='done'?'<span class="pill p-ok">Livrée</span>':i===0?`<a href="#suivi" class="pill p-run">${s.pill}</a>`:`<span class="pill p-run">${s.pill}</span>`}</td></tr>`;}).join('')}</tbody></table></div></div>`;}
function suiviMain(){const last=me.orders[0];if(!last)return `<h1 class="t-h3">Suivi de colis</h1>${emptyOrders('Aucune commande à suivre')}`;const s=ost(last);
 const st=[{b:'Confirmée',d:`${fmtTime(s.t0)} · paiement accepté`,k:'done'},{b:s.k==='prep'?'En préparation':'Expédiée',d:s.k==='prep'?`Expédition prévue ${fmtDay(s.ship)}`:`Prise en charge le ${fmtDay(s.ship)}`,k:s.k==='prep'?'now':'done'},{b:'Livrée',d:s.k==='done'?`Le ${fmtDay(s.del)}`:`Prévue ${fmtDay(s.del)} avant 13 h`,k:s.k==='done'?'done':s.k==='ship'?'now':'next'}];
 const ev=[[s.t0,'Paiement confirmé, commande enregistrée']];if(s.k!=='prep')ev.unshift([s.ship,'Colis préparé et pris en charge par le transporteur']);if(s.k==='done')ev.unshift([s.del,'Colis livré']);
 return `<div class="track-head"><span class="t-over over">Commande ${last.n}</span><h1 class="t-h2" style="margin-top:8px">${s.k==='done'?'Livrée le '+fmtDay(s.del):'Livraison prévue '+fmtDay(s.del)}</h1><p class="muted" style="margin-top:8px">Livraison à domicile (48 h) · ${last.adr.map(esc).join(', ')}</p></div>
 <div class="track">${st.map(x=>`<div class="tstep ${x.k==='done'?'bg-eveil':x.k==='now'?'bg-focus now':'bg-sable'}"${x.k==='now'?' aria-current="step"':''}><span class="pill ${x.k==='done'?'p-ok':x.k==='now'?'p-run':''}" style="justify-self:start${x.k==='next'?';background:var(--sable-200)':''}">${x.k==='done'?'✓ Terminé':x.k==='now'?'En cours':'À venir'}</span><b>${x.b}</b><span class="t-sm muted">${x.d}</span></div>`).join('')}</div>
 <div class="g2" style="align-items:start;gap:20px"><div class="card" style="padding:24px"><h2 class="t-h4">Historique</h2><div class="events">${ev.map(([d,t])=>`<div><span>${fmtTime(d)}</span>${t}</div>`).join('')}</div><a class="link t-sm" href="#contact" style="display:inline-block;margin-top:14px">Un problème avec votre livraison ?</a></div>
 <div class="card" style="padding:24px"><h2 class="t-h4">Articles</h2>${last.items.map(([k,q,n,pr])=>`<div class="line" style="grid-template-columns:64px 1fr auto"><div class="media" style="width:64px;height:64px;background:var(--bg-subtle)">${lineInfo(k).media}</div><div><b>${n}</b><div class="t-sm muted">× ${q}</div></div><span>${eur(pr*q)}</span></div>`).join('')}<div class="r" style="display:flex;justify-content:space-between;margin-top:12px;font-weight:600"><span>Total payé</span><span>${eur(last.tot)}</span></div></div></div>`;}
function profilMain(){return `<h1 class="t-h3">Profil &amp; adresse</h1>
<div class="g2" style="gap:20px;align-items:start">
 <form class="card form" data-form="profil" novalidate style="padding:24px"><h2 class="t-h4">Profil</h2>
  <div class="row2">${field('p-prenom','Prénom','text','req',`autocomplete="given-name" value="${esc(me.prenom)}"`)}${field('p-nom','Nom','text','req',`autocomplete="family-name" value="${esc(me.nom)}"`)}</div>
  ${field('p-mail','E-mail','email','req email',`autocomplete="email" value="${esc(me.email)}"`)}
  ${field('p-tel','Téléphone','tel','tel',`autocomplete="tel" inputmode="tel" placeholder="+33 6 12 34 56 78" value="${esc(me.tel)}"`)}
  <label class="check"><input type="checkbox" id="p-news" ${me.news?'checked':''}> Recevoir la newsletter</label>
  <button class="btn btn-primary" type="submit" style="justify-self:start">Enregistrer</button></form>
 <form class="card form" data-form="adresse" novalidate style="padding:24px"><h2 class="t-h4">Adresse de livraison</h2>
  ${field('a-adr','Adresse','text','req',`autocomplete="street-address" value="${esc(me.adr)}"`)}
  <div class="row2">${field('a-cp','Code postal','text','req cp',`inputmode="numeric" autocomplete="postal-code" value="${esc(me.cp)}"`)}${field('a-ville','Ville','text','req',`autocomplete="address-level2" value="${esc(me.ville)}"`)}</div>
  <p class="t-sm muted">Livraison à domicile en France métropolitaine.</p>
  <button class="btn btn-primary" type="submit" style="justify-self:start">Enregistrer l'adresse</button></form>
</div>`;}

/* ---------- Tunnel de commande ---------- */
V.panier=()=>{const keys=Object.keys(state.cart);if(!keys.length)return `<div class="wrap">${stepper(0)}<div class="empty"><div class="media" style="width:160px;height:190px;background:none">${tinSVG('focus')}</div><h1 class="t-h3">Votre panier est vide</h1><p class="muted">Découvrez nos trois recettes pour trouver celle qui vous correspond.</p><a class="btn btn-primary" href="#infusions">Découvrir les infusions</a></div><div class="empty-sug"><div class="sec-head"><h2 class="t-h3">Nos recettes</h2><a class="link" href="#coffret-decouverte">Goûtez les trois avec le Coffret Découverte</a></div><div class="g3">${pcard('eveil')+pcard('focus')+pcard('rush')}</div></div></div>`;
 const t=totals();const left=Math.max(0,FREE-(t.sub-t.disc));return `
<div class="wrap">${stepper(0)}<h1 class="t-h1" style="margin-bottom:24px">Mon panier</h1>
<div class="cartg"><div>
 <div class="jauge ${t.free?'ok':''}"><span class="jauge-t">${ico.truck}${t.free?'Livraison à domicile offerte.':`Plus que ${eur(left)} pour bénéficier de la livraison offerte.`}</span><div class="bar"><i style="width:${t.free?100:Math.min(100,(t.sub-t.disc)/FREE*100)}%"></i></div></div>
 ${keys.map(k=>{const l=lineInfo(k);return `<div class="line"><div class="media" style="background:var(--bg-subtle)">${l.media}</div><div><h3>${l.name}</h3><p class="t-sm muted">${l.sub}</p><button class="rm" type="button" data-rm="${k}">Retirer</button></div><div class="lp" style="display:grid;gap:8px;justify-items:end"><div class="qty"><button type="button" data-q="${k}" data-d="-1" aria-label="Moins">−</button><span>${state.cart[k]}</span><button type="button" data-q="${k}" data-d="1" aria-label="Plus">+</button></div><b class="price" style="font-size:18px">${eur(l.price*state.cart[k])}</b></div></div>`}).join('')}
 ${!state.cart.boule?`<div class="card upsell"><div class="media">${bouleSVG()}</div><div><b>Complétez avec la boule à thé portable</b><div class="t-sm muted">Pour infuser votre vrac partout · 8,90 €</div></div><button class="btn btn-ghost btn-sm" type="button" data-add="boule">Ajouter</button></div>`:''}
</div>
<aside class="recap" aria-label="Récapitulatif"><h2 class="t-h4">Récapitulatif</h2>
 <form class="field ${state.promo?'is-ok':''}" data-form="promo" novalidate><label for="promo">Code promo</label>${state.promo?`<div class="promo-on"><span>${ico.check}<b>${state.promo}</b> · −10 %</span><button type="button" class="linkbtn" data-unpromo>Retirer</button></div>`:`<div class="promo"><input class="input" id="promo" placeholder="Saisissez votre code" autocomplete="off" aria-describedby="promo-err"><button class="btn btn-ghost btn-sm" type="submit">Appliquer</button></div><span class="err" id="promo-err"></span>`}</form>
 ${wTicket(false)}
 <div class="r"><span>Sous-total</span><span>${eur(t.sub)}</span></div>
 ${t.disc?`<div class="r" style="color:var(--feedback-success)"><span>Code ${state.promo}</span><span>−${eur(t.disc)}</span></div>`:''}
 <div class="r"><span>Livraison à domicile</span><span>${t.free?'Offerte':eur(t.ship)}</span></div>
 <div class="r tot"><span>Total</span><span>${eur(t.tot)}</span></div>
 <a class="btn btn-primary btn-block" href="#${state.logged?'livraison':'connexion'}">Valider mon panier</a>
 <p class="t-cap" style="text-align:center">Paiement sécurisé · Carte bancaire, PayPal, Apple Pay<br><span class="payb payb-c" role="img" aria-label="Visa, Mastercard, PayPal, Apple Pay"><i title="Visa"><svg viewBox="0 6.5 24 11" style="width:30px;height:14px" aria-hidden="true"><path fill="#1A1F71" d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"/></svg></i><i title="Mastercard"><svg viewBox="0 0 38 24" style="width:34px;height:22px" aria-hidden="true"><circle cx="15" cy="12" r="7.5" fill="#EB001B"/><circle cx="23" cy="12" r="7.5" fill="#F79E1B"/><path d="M19 5.6a7.5 7.5 0 0 1 0 12.8a7.5 7.5 0 0 1 0-12.8z" fill="#FF5F00"/></svg></i><i title="PayPal"><svg viewBox="0 0 24 24" style="width:16px;height:16px" aria-hidden="true"><path fill="#003087" d="M7.016 19.198h-4.2a.562.562 0 0 1-.555-.65L5.093.584A.692.692 0 0 1 5.776 0h7.222c3.417 0 5.904 2.488 5.846 5.5-.006.25-.027.5-.066.747A6.794 6.794 0 0 1 12.071 12H8.743a.69.69 0 0 0-.682.583l-.325 2.056-.013.083-.692 4.39-.015.087zM19.79 6.142c-.01.087-.01.175-.023.261a7.76 7.76 0 0 1-7.695 6.598H9.007l-.283 1.795-.013.083-.692 4.39-.134.843-.014.088H6.86l-.497 3.15a.562.562 0 0 0 .555.65h3.612c.34 0 .63-.249.683-.585l.952-6.031a.692.692 0 0 1 .683-.584h2.126a6.793 6.793 0 0 0 6.707-5.752c.306-1.95-.466-3.744-1.89-4.906z"/></svg></i><i title="Apple Pay"><svg viewBox="0 4 24 16" style="width:33px;height:22px" aria-hidden="true"><path fill="#000" d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z"/></svg></i></span><br>Livraison, retours, codes promo : <a class="link" href="#faq" data-anchor="faq-commande">consultez la FAQ</a></p>
</aside></div></div><div style="height:64px"></div>`;};

V.connexion=()=>{const live=state.logged&&!DEMO;return `
<div class="wrap">${stepper(1)}<div class="cartg"><div>
 <h1 class="t-h2" style="margin-bottom:8px">Connexion</h1>
 ${live?`<div class="card logged"><div><span class="t-over over">Vous êtes connecté(e)</span><p style="margin-top:6px"><b>${esc(me.prenom)} ${esc(me.nom)}</b> · ${esc(me.email)}</p></div><div class="ctas" style="margin:0"><button class="btn btn-ghost btn-sm" type="button" data-logout>Changer de compte</button><a class="btn btn-primary" href="#livraison">Continuer vers la livraison</a></div></div>`:`<p class="muted" style="margin-bottom:24px;max-width:60ch">Connectez-vous ou créez votre compte pour suivre votre commande. Votre adresse sera enregistrée pour vos prochains achats.</p>${authForms('livraison')}`}
 <div style="margin-top:20px"><a class="btn btn-ghost" href="#panier">← Retour au panier</a></div>
</div>${recapMini()}</div></div><div style="height:64px"></div>`;};

V.livraison=()=>{const t=totals();const a=me||{};return `
<div class="wrap">${stepper(2)}<div class="cartg">
<form class="form" data-form="livraison" novalidate><h1 class="t-h2">Livraison</h1>
 ${me?`<p class="muted" style="margin-top:-6px">Connecté(e) : <b>${esc(me.prenom)} ${esc(me.nom)}</b> · ${esc(me.email)}</p>`:''}
 <div class="row2">${field('d-prenom','Prénom','text','req',`autocomplete="given-name" value="${esc(a.prenom)}"`)}${field('d-nom','Nom','text','req',`autocomplete="family-name" value="${esc(a.nom)}"`)}</div>
 ${field('d-adr','Adresse','text','req',`autocomplete="street-address" value="${esc(a.adr)}"`)}
 <div class="row2">${field('d-cp','Code postal','text','req cp',`inputmode="numeric" autocomplete="postal-code" value="${esc(a.cp)}"`)}${field('d-ville','Ville','text','req',`autocomplete="address-level2" value="${esc(a.ville)}"`)}</div>
 ${field('d-tel','Téléphone (pour le transporteur)','tel','req tel',`autocomplete="tel" inputmode="tel" placeholder="+33 6 12 34 56 78" value="${esc(a.tel)}"`)}<span class="hint" style="margin-top:-10px">Formats acceptés : 06 12 34 56 78, +33 6 12 34 56 78 ou tout indicatif international.</span>
 <div class="shipbox"><span class="ico">${ico.truck}</span><div><b>Livraison à domicile</b><small>Sous 48 h en France métropolitaine · expédition sous 24 h ouvrées</small></div><b>${t.free?'Offerte':'4,90 €'}</b></div>
 ${t.free?'':`<p class="t-sm muted" style="margin-top:-6px">Plus que ${eur(Math.max(0,FREE-(t.sub-t.disc)))} pour bénéficier de la livraison offerte.</p>`}
 <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><a class="btn btn-ghost" href="#panier">← Retour au panier</a><button class="btn btn-primary" type="submit">Continuer vers le paiement</button></div>
 <p class="t-sm muted">Une question sur la livraison ? <a class="link" href="#faq" data-anchor="q-livraison">Consultez la FAQ</a></p>
</form>${recapMini()}</div></div><div style="height:64px"></div>`;};
function recapMini(){const t=totals();return `<aside class="recap" aria-label="Récapitulatif"><h2 class="t-h4">Votre commande</h2>${Object.keys(state.cart).map(k=>`<div class="r"><span>${lineInfo(k).name} × ${state.cart[k]}</span><span>${eur(lineInfo(k).price*state.cart[k])}</span></div>`).join('')}${t.disc?`<div class="r"><span>Code ${state.promo}</span><span>−${eur(t.disc)}</span></div>`:''}<div class="r"><span>Livraison à domicile</span><span>${t.free?'Offerte':eur(t.ship)}</span></div><div class="r tot"><span>Total</span><span>${eur(t.tot)}</span></div></aside>`;}

V.paiement=()=>`
<div class="wrap">${stepper(3)}<div class="cartg">
<form class="form" data-form="paiement" novalidate><h1 class="t-h2">Paiement</h1>
 <div class="chips" role="group" aria-label="Moyen de paiement"><button class="chip" type="button" aria-pressed="true">Carte bancaire</button><button class="chip" type="button" data-wallet="PayPal">PayPal</button><button class="chip" type="button" data-wallet="Apple Pay">Apple Pay</button></div>
 ${field('c-num','Numéro de carte','text','req card','inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456"')}
 <div class="row2">${field('c-exp','Expiration (MM/AA)','text','req exp','autocomplete="cc-exp" placeholder="09/28"')}${field('c-cvc','Cryptogramme','text','req cvc','inputmode="numeric" autocomplete="cc-csc" placeholder="123"')}</div>
 ${field('c-nom','Nom sur la carte','text','req',`autocomplete="cc-name" value="${me?esc(me.prenom+' '+me.nom):''}"`)}
 <div class="field"><label class="check"><input type="checkbox" id="c-cgv" data-rule="checked" aria-describedby="c-cgv-err"> J'accepte les <a class="link" href="#cgv">conditions générales de vente</a></label><span class="err" id="c-cgv-err"></span></div>
 <p class="hint">Site de démonstration : aucun paiement réel n'est effectué. Utilisez un numéro fictif, par exemple 4242 4242 4242 4242.</p>
 <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><a class="btn btn-ghost" href="#livraison">← Retour à la livraison</a><button class="btn btn-primary" type="submit">Payer ${eur(totals().tot)}</button></div>
</form>${recapMini()}</div></div><div style="height:64px"></div>`;

V.confirmation=()=>{const o=state.last||(me&&me.orders[0]);if(!o)return `<div class="wrap">${stepper(4)}<div class="confirm"><span class="okmark">${ico.check}</span><h1 class="t-h1">Votre commande est confirmée.</h1><p class="t-lg muted">Retrouvez son suivi à tout moment dans votre compte.</p><div class="ctas" style="justify-content:center"><a class="btn btn-primary" href="#compte">Mon compte</a><a class="btn btn-ghost" href="#infusions">Continuer mes achats</a></div></div></div>`;
 const s=ost(o),pr=me?me.prenom:'';const code=(pr.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z]/gi,'').toUpperCase()||'YUZAA')+'-YZ';return `
<div class="wrap">${stepper(4)}<div class="confirm"><span class="okmark">${ico.check}</span><h1 class="t-h1">Merci${pr?' '+esc(pr):''}, votre commande est confirmée.</h1><p class="t-lg muted" style="max-width:56ch">Commande <b>${o.n}</b> réglée par ${o.method} : ${eur(o.tot)}. Un e-mail récapitulatif vient de vous être envoyé${o.email?' à '+esc(o.email):''}. Livraison à domicile prévue ${fmtDay(s.del)}.</p><div class="ctas" style="justify-content:center"><a class="btn btn-primary" href="#suivi">Suivre ma commande</a><a class="btn btn-ghost" href="#article-bien-infuser">Bien préparer ma première tasse</a></div></div>
<div class="g3" style="margin-bottom:80px"><div class="proof"><span class="ico">${ico.truck}</span><h3>Livraison ${JOURS[s.del.getDay()]}</h3><p>Vous recevrez le lien de suivi par e-mail dès l'expédition.</p></div><div class="proof"><span class="ico">${ico.leaf}</span><h3>Votre première semaine</h3><p>Focus le matin, Éveil après le déjeuner : nos conseils de préparation arrivent par e-mail.</p></div><div class="proof"><span class="ico">${ico.tin}</span><h3>Parrainez un proche</h3><p>Avec votre code ${esc(code)}, offrez 5 € et recevez 5 €.</p></div></div></div>`;};

const FAQ=[
 ['faq-cafeine','Caféine & recettes',[
  ['q-cafeine','Combien de caféine contient une tasse ?',`Éveil contient 40 mg de caféine, Focus 60 mg et Rush 80 mg par tasse de 25 cl. À titre de repère, un espresso en contient environ 80 mg.`],
  ['q-choisir','Quelle recette choisir ?',`Éveil pour une énergie douce, Focus pour la concentration, Rush pour les journées les plus exigeantes. Le <a class="link" href="#coffret-decouverte">Coffret Découverte</a> permet de goûter les trois.`],
  ['q-tasses','Combien de tasses par jour au maximum ?',`Nous recommandons deux tasses par jour au maximum, et pas de caféine après 16 h afin de préserver votre sommeil.`],
  ['q-cafe','Les infusions remplacent-elles le café ?',`Oui, pour l'effet : la caféine est la même molécule, qu'elle provienne du café ou des plantes. Le goût, lui, est sans amertume et sans sucre ajouté.`],
  ['q-deconseille','À qui les infusions sont-elles déconseillées ?',`Nos infusions contiennent de la caféine : elles sont déconseillées aux femmes enceintes ou allaitantes, aux moins de 16 ans et aux personnes sensibles à la caféine.`]]],
 ['faq-preparation','Préparation',[
  ['q-80','Pourquoi infuser à 80 °C ?',`Une eau bouillante brûle les feuilles et libère leur amertume. À 80 °C, les arômes restent intacts. Sans thermomètre : portez l'eau à ébullition, puis laissez-la reposer 2 minutes.`],
  ['q-preparer','Comment préparer mon infusion ?',`2,5 g de vrac (une cuillère à café) ou un sachet pour 25 cl d'eau à 80 °C, puis 5 minutes d'infusion. La boule à thé portable vous permet de la préparer partout.`],
  ['q-vrac','Vrac ou sachets ?',`Le vrac (100 g, environ 40 tasses) revient à 0,30 € la tasse. La boîte de 20 sachets est plus pratique à emporter.`],
  ['q-glace','Peut-on boire les infusions glacées ?',`Oui : préparez votre infusion à 80 °C, laissez-la refroidir, puis versez-la sur des glaçons.`]]],
 ['faq-commande','Commande & livraison',[
  ['q-coffrets','Quelle différence entre le Coffret Découverte et le Pack Partiels ?',`Le Coffret Découverte (19,90 €) réunit de petites quantités, 3 × 30 g, soit environ 12 tasses de chaque recette, et une boule à thé : idéal pour débuter. Le Pack Partiels (32,90 €) réunit les trois gammes en format complet, 3 × 100 g, soit environ 120 tasses.`],
  ['q-compte','Dois-je créer un compte pour commander ?',`Oui. Votre compte vous permet de suivre votre commande et de retrouver votre adresse. Il se crée en quelques secondes, juste avant le choix de la livraison.`],
  ['q-livraison','Quels sont les délais et frais de livraison ?',`Nous livrons à domicile en 48 h, en France métropolitaine, pour 4,90 €. La livraison est offerte dès 35 € d'achat.`],
  ['q-code','Comment obtenir le code de bienvenue ?',`Inscrivez-vous à la newsletter (pop-up d'accueil, pied de page, panier ou création de compte) : votre code de −10 % s'affiche aussitôt et vous est envoyé par e-mail. Il est valable sur votre première commande, à saisir dans le champ « Code promo » du panier. Il n'est jamais appliqué automatiquement.`],
  ['q-paiement','Quels moyens de paiement acceptez-vous ?',`Carte bancaire, PayPal et Apple Pay. Le paiement est entièrement sécurisé.`],
  ['q-retours','Puis-je retourner un produit ?',`Oui, les retours sont gratuits sous 30 jours à compter de la réception.`]]],
 ['faq-pros','Offre pros',[
  ['q-pros','Proposez-vous une offre pour les cafés, coworkings et BDE ?',`Oui, sur devis. Faites votre demande depuis la page <a class="link" href="#pros">Pour les pros</a> : nous revenons vers vous sous 48 h ouvrées.`],
  ['q-event','Puis-je commander pour un événement ?',`Oui : stand, semaine d'examens, salon… Précisez votre besoin dans le <a class="link" href="#pros">formulaire de devis</a>.`]]]];
const FQ={};FAQ.forEach(c=>c[2].forEach(([i,q,a])=>FQ[i]=[q,a]));
V.faq=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / FAQ</nav></div>
<section class="sec-tight" style="padding-top:8px"><div class="wrap">
 <h1 class="t-h1">Questions fréquentes</h1><p class="t-lg muted" style="margin-block:12px 24px">Caféine, préparation, commande et livraison : retrouvez les réponses aux questions les plus fréquentes.</p>
 <div class="field" style="max-width:520px;margin-bottom:40px"><label for="fq">Rechercher une question</label><input class="input" id="fq" type="search" placeholder="Ex. : caféine, livraison, retours"></div>
 <div class="faqg"><nav class="faqcat" aria-label="Catégories">${FAQ.map(c=>`<a href="#faq" data-scroll="${c[0]}">${c[1]}</a>`).join('')}</nav>
 <div id="faqlist">${FAQ.map(c=>`<h2 id="${c[0]}">${c[1]}</h2>${c[2].map(q=>`<details class="cond" id="${q[0]}"><summary>${q[1]}</summary><p>${q[2]}</p></details>`).join('')}`).join('')}<p id="fqnone" class="muted" hidden style="margin-top:16px">Aucune question ne correspond. <a class="link" href="#contact">Posez-nous la vôtre.</a></p></div></div>
</div></section>
<section class="sec"><div class="wrap"><div class="band" style="background:var(--bg-brand-subtle)">${ill('mug','focus','ill-band')}<div><h2 class="t-h3">Vous n'avez pas trouvé votre réponse ?</h2><p class="muted">Notre équipe vous répond sous 24 h ouvrées.</p></div><a class="btn btn-primary" href="#contact">Nous contacter</a></div></div></section>`;

V.contact=()=>`
<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / Contact</nav></div>
<section class="sec-tight" style="padding-top:8px;padding-bottom:80px"><div class="wrap">
 <h1 class="t-h1" style="margin-bottom:28px">Nous contacter</h1>
 <div class="contact">
  <div class="coord"><div><h3>E-mail</h3><p>bonjour@yuzaa.fr</p></div><div><h3>Téléphone</h3><p>01 84 60 12 34<br><span style="color:var(--focus-100);font-size:14px">Du lundi au vendredi, de 9 h à 18 h</span></p></div><div><h3>Adresse</h3><p>yuzaa SAS<br>12 rue des Plantes<br>69007 Lyon</p></div><div><h3>Réseaux</h3><p>Instagram et TikTok : @yuzaa.energie</p></div>${ill('mug','eveil','ill-card')}</div>
  <form class="card form" style="padding:32px" data-form="contact" novalidate><div class="alert alert-ok" id="contact-ok" hidden role="status">Message envoyé. Notre équipe vous répond sous 24 h ouvrées.</div>
   <div class="row2">${field('k-nom','Nom','text','req','autocomplete="name"')}${field('k-email','E-mail','email','req email','autocomplete="email"')}</div>
   <div class="field"><label for="k-sujet">Sujet</label><select class="input" id="k-sujet"><option>Question sur un produit</option><option>Ma commande</option><option>Offre pros (café, coworking, BDE)</option><option>Autre</option></select></div>
   <div class="field"><label for="k-msg">Message</label><textarea class="input" id="k-msg" rows="5" data-rule="req min20" aria-describedby="k-msg-err"></textarea><span class="err" id="k-msg-err"></span></div>
   <button class="btn btn-primary" type="submit" style="justify-self:start">Envoyer le message</button></form>
 </div>
</div></section>`;

function legal(title,intro,arts){return `<div class="wrap"><nav class="crumb" aria-label="Fil d'Ariane"><a href="#accueil">Accueil</a> / ${title}</nav></div><section class="sec-tight" style="padding-top:8px;padding-bottom:80px"><div class="wrap"><h1 class="t-h1">${title}</h1><p class="t-cap" style="margin-block:10px 32px">Mise à jour le 12 octobre 2026</p><div class="legal"><aside class="toc" aria-label="Sommaire"><b class="t-over">Sommaire</b><ol>${arts.map((a,i)=>`<li><a href="#${title==='Mentions légales'?'mentions':title.startsWith('Conditions générales de vente')?'cgv':'cgu'}" data-scroll="lg${i}">${a[0]}</a></li>`).join('')}</ol></aside><div><p>${intro}</p>${arts.map((a,i)=>`<h2 id="lg${i}">${i+1}. ${a[0]}</h2><p>${a[1]}</p>`).join('')}</div></div></div></section>`;}
V.cgv=()=>legal('Conditions générales de vente','Les présentes conditions régissent les ventes conclues sur yuzaa.fr entre yuzaa SAS et tout client consommateur.',[['Produits','Infusions 100 % plantes contenant de la caféine naturelle, vendues en vrac (100 g) ou en boîte de 20 sachets, et accessoires.'],['Prix','Les prix sont indiqués en euros TTC. Les frais de livraison sont précisés avant la validation de la commande.'],['Commande et paiement','La commande nécessite un compte client, créé en quelques secondes avant le choix de la livraison. Elle est confirmée après paiement par carte, PayPal ou Apple Pay. Un e-mail de confirmation est envoyé.'],['Livraison','Livraison à domicile en 48 h en France métropolitaine : 4,90 €, offerte dès 35 € d\'achat.'],['Retours','Retours gratuits sous 30 jours à compter de la réception.'],['Offre professionnelle','Les ventes aux cafés, coworkings et BDE font l\'objet d\'un devis et de conditions particulières.']]);
V.cgu=()=>legal('Conditions générales d\'utilisation','Les présentes CGU définissent les règles d\'utilisation du site yuzaa.fr et de l\'espace client.',[['Accès au site','Le site est accessible gratuitement. yuzaa peut suspendre l\'accès pour maintenance.'],['Compte client','Vous êtes responsable de la confidentialité de votre mot de passe. Chaque compte est personnel.'],['Avis clients','Seuls les clients ayant acheté le produit peuvent publier un avis. Les avis injurieux sont supprimés.'],['Propriété intellectuelle','Les textes, visuels et le logo yuzaa sont protégés et ne peuvent être réutilisés sans autorisation.'],['Données personnelles','Vos données servent à traiter vos commandes et, avec votre accord, à vous adresser la newsletter. Vous pouvez les modifier ou les supprimer à tout moment.']]);
V.mentions=()=>legal('Mentions légales','Informations légales relatives à l\'éditeur et à l\'hébergeur du site yuzaa.fr.',[['Éditeur','yuzaa SAS, 12 rue des Plantes, 69007 Lyon · bonjour@yuzaa.fr'],['Hébergement','Hébergeur à préciser lors de la mise en ligne.'],['Cookies','Seuls les cookies nécessaires au panier et à la mesure d\'audience sont déposés, après consentement.']]);

V.merci=()=>`<section class="sec"><div class="wrap"><div class="confirm"><span class="okmark">${ico.check}</span><span class="t-over over">Inscription confirmée</span><h1 class="t-h1">Bienvenue chez yuzaa${me?', '+esc(me.prenom):''}</h1><p class="t-lg muted" style="max-width:54ch">Votre compte est créé et un e-mail de bienvenue vient de vous être envoyé.${isSub()?' Merci pour votre inscription à la newsletter : voici votre code de <b>−10 %</b> pour votre première commande, à saisir dans votre panier.':' Inscrivez-vous à la newsletter pour recevoir votre code de <b>−10 %</b> sur votre première commande.'}</p>${isSub()?`<div class="card" style="padding:18px 28px;font:800 26px var(--font-display);letter-spacing:.06em;color:var(--text-brand)">${WCODE}</div>`:'<button class="btn btn-primary" type="button" data-nlopen>Recevoir mon code de bienvenue</button>'}<div class="ctas" style="justify-content:center"><a class="btn btn-primary" href="#infusions">Découvrir les recettes</a><a class="btn btn-ghost" href="#compte">Accéder à mon compte</a></div><figure class="illf ill-wide ill-pk">${pkImg(IMG.trio,'Les trois recettes yuzaa : Éveil, Focus et Rush')}</figure></div><div class="g3"><div class="proof"><span class="ico">${ico.leaf}</span><h3>Goûtez les trois recettes</h3><p>Le coffret Découverte : 3 × 30 g et une boule à thé pour 19,90 €.</p></div><div class="proof"><span class="ico">${ico.lab}</span><h3>Consultez le guide de la caféine</h3><p>40, 60 ou 80 mg : choisissez selon votre besoin.</p></div><div class="proof"><span class="ico">${ico.tin}</span><h3>Suivez-nous</h3><p>Recettes et conseils sur Instagram et TikTok @yuzaa.energie.</p></div></div></div></section>`;
V['merci-newsletter']=()=>`<section class="sec"><div class="wrap"><div class="confirm"><span class="okmark">${ico.check}</span><span class="t-over over">Newsletter</span><h1 class="t-h1">Merci pour votre inscription</h1><p class="t-lg muted" style="max-width:54ch">Vous recevrez un e-mail par mois : nouveaux articles, recettes et offres. Pour votre première commande, saisissez le code <b>BIENVENUE10</b> dans votre panier : −10 %.</p><div class="ctas" style="justify-content:center"><a class="btn btn-primary" href="#infusions">Découvrir les infusions</a><a class="btn btn-ghost" href="#blog">Lire le blog</a></div>${ill('latte','','ill-wide')}</div></div></section>`;
V['404']=()=>`<section><div class="wrap nf"><div><div class="code">404</div><h1 class="t-h2" style="margin-block:12px">Cette page est introuvable.</h1><p class="muted" style="max-width:44ch">Le lien est peut-être erroné ou la page a été déplacée. Voici quelques pages utiles :</p><div class="ctas"><a class="btn btn-primary" href="#accueil">Retour à l'accueil</a><a class="btn btn-ghost" href="#infusions">Nos infusions</a></div><p class="t-sm" style="margin-top:20px"><a class="link" href="#faq">FAQ</a> · <a class="link" href="#contact">Contact</a> · <a class="link" href="#blog">Blog</a></p></div><div class="media" style="aspect-ratio:1/1;background:var(--focus-50)">${pkImg(IMG.focusF,'Boîte Focus renversée','pk-tilt')}</div></div></section>`;
