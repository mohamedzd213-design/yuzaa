/* yuzaa · app.js
   Pop-up, paiement de démonstration, formulaires, événements et démarrage. */
/* ---------- Pop-up newsletter (site uniquement, une fois par visite) ---------- */
let popLast=null;
function popOpen(){const m=$('#nlpop');if(!m)return;$('.nlpop-media',m).innerHTML=multi();popLast=document.activeElement;m.hidden=false;requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('on')));setTimeout(()=>{const i=$('#pop-email');if(i)i.focus({preventScroll:true});},350);try{sessionStorage.setItem('yz-nl','1');}catch(e){}}
function popClose(){const m=$('#nlpop');if(!m||m.hidden)return;m.classList.remove('on');setTimeout(()=>{m.hidden=true;},still()?0:350);if(popLast&&popLast.focus)popLast.focus({preventScroll:true});}

/* ---------- Paiement PayPal / Apple Pay : simulation animée ---------- */
let payT=[],payLast=null,payW='';
function payStep(n){$$('#paym .paym-step').forEach(x=>x.hidden=+x.dataset.step!==n);}
function payOpen(w){const m=$('#paym');if(!m)return;payW=w;$$('[data-wname]',m).forEach(x=>x.textContent=w);$('#paym-amt').textContent=eur(totals().tot);$('#paym-sum').textContent='Commande yuzaa · livraison à domicile';payStep(1);payLast=document.activeElement;m.hidden=false;requestAnimationFrame(()=>requestAnimationFrame(()=>m.classList.add('on')));setTimeout(()=>{const x=$('.nlpop-x',m);if(x)x.focus({preventScroll:true});},60);payT.push(setTimeout(()=>{payStep(2);const b=$('[data-payok]',m);if(b)b.focus({preventScroll:true});},still()?300:1600));}
function payClose(){const m=$('#paym');if(!m||m.hidden)return;payT.forEach(clearTimeout);payT=[];m.classList.remove('on');setTimeout(()=>{m.hidden=true;},still()?0:300);if(payLast&&payLast.focus&&payLast.isConnected)payLast.focus({preventScroll:true});}
function payOk(){payStep(3);payT.push(setTimeout(()=>{payClose();placeOrder(payW);},still()?200:1300));}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){popClose();payClose();cdrClose();}if(e.key==='Tab'){const m=$('#cdr');if(m&&!m.hidden){const f=$$('a[href],button,input',m).filter(x=>x.offsetParent);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}}});

/* ---------- Validation des formulaires ---------- */
const MSG={req:'Ce champ est obligatoire.',email:'Adresse e-mail invalide. Exemple : prenom@email.fr',cp:'Le code postal doit contenir 5 chiffres.',tel:'Numéro invalide. Exemples : 06 12 34 56 78 ou +33 6 12 34 56 78',card:'Le numéro de carte doit contenir 16 chiffres.',exp:'Format attendu : MM/AA, date non dépassée.',cvc:'Les 3 chiffres au dos de votre carte.',pw:'8 caractères minimum, dont au moins un chiffre.',min20:'Votre message doit contenir au moins 20 caractères.',checked:'Veuillez cocher cette case pour continuer.'};
const TEST={req:v=>v.trim()!=='',email:v=>/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),cp:v=>/^\d{5}$/.test(v.trim()),tel:v=>{const t=v.trim();if(!/^[+\d][\d\s.()-]*$/.test(t))return false;const d=t.replace(/[\s.()-]/g,'');return /^0\d{9}$/.test(d)||/^\+\d{7,15}$/.test(d)||/^00\d{7,15}$/.test(d);},card:v=>/^\d{16}$/.test(v.replace(/\s/g,'')),exp:v=>{const m=v.trim().match(/^(0[1-9]|1[0-2])\/(\d{2})$/);return !!m&&(+m[2]>26||(+m[2]===26&&+m[1]>=10));},cvc:v=>/^\d{3}$/.test(v.trim()),pw:v=>v.length>=8&&/\d/.test(v),min20:v=>v.trim().length>=20};
function check(inp){const rules=(inp.dataset.rule||'').split(' ').filter(Boolean);const f=inp.closest('.field');let bad=null;for(const r of rules){if(r==='checked'){if(!inp.checked){bad=r;break;}continue;}if(r!=='req'&&inp.value.trim()==='')continue;if(!TEST[r](inp.value)){bad=r;break;}}
 if(f){f.classList.toggle('has-error',!!bad);f.classList.toggle('is-ok',!bad&&inp.type!=='checkbox'&&inp.value!=='');const e=f.querySelector('.err');if(e)e.textContent=bad?MSG[bad]:'';}inp.setAttribute('aria-invalid',bad?'true':'false');return !bad;}
function validate(form){let ok=true,first=null;$$('[data-rule]',form).forEach(i=>{if(!check(i)){ok=false;first=first||i;}});if(first)first.focus();return ok;}
const val=id=>{const el=$('#'+id);return el?el.value.trim():'';};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
async function pwHash(salt,pw){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'|'+pw));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}catch(e){return '';}}
function formMsg(id,txt){const m=$('#'+id);if(m){m.textContent=txt;m.hidden=false;}}
function login(a,next,msg){me=a;if(!Array.isArray(me.orders))me.orders=[];state.logged=true;if(state.promo&&me.orders.length){state.promo=null;msg+=' Le code BIENVENUE10 est réservé à la première commande.';}saveAcc();if(next&&cur()!==next)go(next);else render();toast(msg);}
function placeOrder(method){const t=totals();const o={n:'YZ-'+(24000+Math.floor(Math.random()*75000)),date:new Date().toISOString(),items:Object.keys(state.cart).map(k=>{const l=lineInfo(k);return [k,state.cart[k],l.name,l.price];}),sub:t.sub,disc:t.disc,ship:t.ship,tot:t.tot,free:t.free,method,email:me?me.email:'',adr:me?[me.prenom+' '+me.nom,me.adr,me.cp+' '+me.ville]:[]};
 if(me){me.orders.unshift(o);saveAcc();}state.last=o;state.cart={};state.promo=null;count();go('confirmation');}
const H={
 pros:f=>{$('#pros-ok').hidden=false;f.reset();$$('.field',f).forEach(x=>x.classList.remove('is-ok'));},
 newsletter:f=>{setSub($('#nl-email').value.trim());f.reset();go('merci-newsletter');},
 nlpop:f=>{setSub($('#pop-email').value.trim());f.reset();$('#nlpop-form').hidden=true;$('#nlpop-ok').hidden=false;try{sessionStorage.setItem('yz-nl','1');}catch(e){}wRefresh();},
 nlcart:f=>{setSub($('#wtk-email').value.trim());wRefresh();toast('Inscription confirmée : votre code '+WCODE+' est prêt.');},
 login:async f=>{const email=val('l-email').toLowerCase(),a=ACC[email];
  if(!a){formMsg('login-msg','Aucun compte n\'est associé à cette adresse e-mail. Créez le vôtre en quelques secondes avec le formulaire « Nouveau client ».');return;}
  const h=await pwHash(a.salt||'',$('#l-pw').value);if(a.pw&&h&&h!==a.pw){formMsg('login-msg','Mot de passe incorrect. Vérifiez votre saisie et réessayez.');return;}
  login(a,f.dataset.next,'Bon retour, '+esc(a.prenom)+' !');},
 register:async f=>{const email=val('r-email').toLowerCase();
  if(ACC[email]){formMsg('reg-msg','Un compte existe déjà avec cette adresse e-mail. Connectez-vous avec le formulaire « Déjà client ? ».');return;}
  const salt=Math.random().toString(36).slice(2,12);
  const a={prenom:cap(val('r-prenom')),nom:cap(val('r-nom')),email,tel:'',adr:'',cp:'',ville:'',news:$('#r-news').checked,salt,pw:await pwHash(salt,$('#r-pw').value),orders:[],since:new Date().toISOString()};
  ACC[email]=a;if(a.news)setSub(email);login(a,f.dataset.next||'merci','Compte créé. Bienvenue, '+esc(a.prenom)+' !');},
 profil:f=>{const email=val('p-mail').toLowerCase();if(email!==me.email&&ACC[email]){$('#p-mail').closest('.field').classList.add('has-error');$('#p-mail-err').textContent='Cette adresse est déjà utilisée par un autre compte.';return;}
  if(email!==me.email){delete ACC[me.email];me.email=email;ACC[email]=me;}
  me.prenom=cap(val('p-prenom'));me.nom=cap(val('p-nom'));me.tel=val('p-tel');me.news=$('#p-news').checked;saveAcc();render(true);toast('Profil mis à jour');},
 adresse:f=>{me.adr=val('a-adr');me.cp=val('a-cp');me.ville=val('a-ville');saveAcc();render(true);toast('Adresse enregistrée');},
 livraison:f=>{if(me){me.prenom=cap(val('d-prenom'))||me.prenom;me.nom=cap(val('d-nom'))||me.nom;me.adr=val('d-adr');me.cp=val('d-cp');me.ville=val('d-ville');me.tel=val('d-tel');saveAcc();}go('paiement');},
 paiement:f=>placeOrder('carte bancaire'),
 contact:f=>{$('#contact-ok').hidden=false;f.reset();$$('.field',f).forEach(x=>x.classList.remove('is-ok'));}
};

/* ---------- Événements ---------- */
const site=$('#site');
site.addEventListener('submit',e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();const n=f.dataset.form;
 if(n==='promo'){const v=$('#promo').value.trim().toUpperCase();const err=m=>{f.classList.add('has-error');$('#promo-err').textContent=m;};
  if(!v)return err('Veuillez saisir un code promo.');if(v!==WCODE)return err('Ce code n\'est pas valide ou a expiré.');if(!isSub())return err('Ce code est réservé aux inscrits à la newsletter. Inscrivez-vous juste en dessous pour le recevoir.');if(me&&me.orders.length)return err('Ce code est réservé à la première commande.');
  state.promo=v;render(true);toast('Code '+v+' appliqué : −10 %');return;}
 if(validate(f))H[n]&&H[n](f);});
site.addEventListener('focusout',e=>{const i=e.target;if(i.matches&&i.matches('[data-rule]')&&(i.value!==''||i.closest('.has-error')))check(i);});
site.addEventListener('input',e=>{const i=e.target;if(i.matches('[data-rule]')&&i.closest('.has-error'))check(i);});
site.addEventListener('click',e=>{if(e.target.id==='nlpop'){popClose();return;}if(e.target.id==='paym'){payClose();return;}if(e.target.hasAttribute&&e.target.hasAttribute('data-cdrov')){cdrClose();return;}const t=e.target.closest('button,a');if(!t)return;
 if(t.hasAttribute('data-cdrclose')){cdrClose();if(t.tagName!=='A')return;}
 if(t.matches('.hdr .ibtn[href$="panier"]')&&cur()!=='panier'&&!e.metaKey&&!e.ctrlKey){e.preventDefault();cdrOpen();return;}
 if(t.hasAttribute('data-nlclose')){popClose();if(t.tagName!=='A')return;}
 if(t.hasAttribute('data-payclose')){payClose();return;}
 if(t.hasAttribute('data-payok')){payOk();return;}
 if(t.dataset.wallet){const cg=$('#c-cgv');if(cg&&!check(cg)){cg.focus();toast('Veuillez accepter les conditions générales de vente.');return;}payOpen(t.dataset.wallet);return;}
 {const hr=t.tagName==='A'?(t.getAttribute('href')||''):'';if(/^\/(?!\/)/.test(hr)&&!t.target&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();const r=hr.slice(1)||'accueil';if(t.dataset.anchor&&r===cur()){goAnchor(t.dataset.anchor);return;}if(t.dataset.anchor)pendingAnchor=t.dataset.anchor;go(r);return;}}
 if(t.dataset.anchor){const r=(t.getAttribute('href')||'').slice(1);if(!r||r===cur()){e.preventDefault();goAnchor(t.dataset.anchor);}else pendingAnchor=t.dataset.anchor;return;}
 if(t.dataset.add){let q=1,k=t.dataset.add;if(t.hasAttribute('data-useq')){q=+$('#pq').textContent;const f=($('input[name=fmt]:checked')||{}).value;if(f==='sachets')k='sachets-'+k;}add(k,q);if(cur()==='panier')render(true);else added(t);return;}
 if(t.dataset.pq){const el=$('#pq');el.textContent=Math.max(1,+el.textContent+ +t.dataset.pq);return;}
 if(t.dataset.q){const k=t.dataset.q;state.cart[k]+= +t.dataset.d;if(state.cart[k]<=0)delete state.cart[k];count();if(t.closest('#cdr')){cdrRefresh();const nb=$(`#cdr [data-q="${k}"][data-d="${t.dataset.d}"]`);if(nb)nb.focus({preventScroll:true});else $('.cdr-x').focus({preventScroll:true});if(cur()==='panier')render(true);}else render(true);return;}
 if(t.dataset.rm){delete state.cart[t.dataset.rm];count();if(t.closest('#cdr')){cdrRefresh();$('.cdr-x').focus({preventScroll:true});if(cur()==='panier')render(true);}else render(true);toast('Article retiré du panier');return;}
 if(t.dataset.filter){state.filter=t.dataset.filter;render(true);return;}
 if(t.dataset.bfilter){state.bfilter=t.dataset.bfilter;render(true);return;}
 if(t.dataset.car){$('#car').scrollBy({left:+t.dataset.car*300,behavior:'smooth'});return;}
 if(t.hasAttribute('data-gal')){const m=$('#gmain');m.innerHTML=t.innerHTML;m.style.background=t.style.background||'';$$('[data-gal]').forEach(x=>x.classList.toggle('on',x===t));return;}
 if(t.dataset.toast){toast(t.dataset.toast);return;}
 if(t.hasAttribute('data-unpromo')){state.promo=null;render(true);toast('Code promo retiré');return;}
 if(t.hasAttribute('data-logout')){me=null;state.logged=false;saveAcc();const r=cur();if(['compte-commandes','compte-profil','suivi'].includes(r))go('compte');else render();toast('Vous êtes déconnecté(e).');return;}
 if(t.hasAttribute('data-burger')){const m=$('#mnav');const o=m.dataset.open!=='true';m.dataset.open=o;t.setAttribute('aria-expanded',o);return;}
 if(t.hasAttribute('data-nlopen')){e.preventDefault();$('#nlpop-form').hidden=false;$('#nlpop-ok').hidden=true;cdrClose();popOpen();return;}
 if(t.hasAttribute('data-applycode')){if(me&&me.orders.length){toast('Ce code est réservé à la première commande.');return;}state.promo=WCODE;wRefresh();toast('Code '+WCODE+' appliqué : −10 %');return;}
 if(t.hasAttribute('data-focusnl')){e.preventDefault();$('#nl-email').focus();$('#nl-email').scrollIntoView({block:'center',behavior:'smooth'});return;}
 if(t.dataset.scroll){e.preventDefault();const el=document.getElementById(t.dataset.scroll);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});return;}
});
function bindSim(){const s=$('#sim');if(!s)return;const up=()=>{const n=+s.value,a=n*1.5*23,b=n*0.3*23;$('#simv').textContent=n;$('#sim-a').textContent=Math.round(a)+' €';$('#sim-b').textContent=Math.round(b)+' €';$('#sim-c').textContent=Math.round((a-b)*12)+' €';};s.addEventListener('input',up);up();}
function bindFaq(){const q=$('#fq');if(!q)return;q.addEventListener('input',()=>{const v=q.value.trim().toLowerCase();let n=0;$$('#faqlist details').forEach(d=>{const m=!v||d.textContent.toLowerCase().includes(v);d.hidden=!m;if(m)n++;if(v&&m)d.open=true;});$('#fqnone').hidden=n>0;});}

$$('[data-logo]').forEach(a=>a.innerHTML=logoHTML(a.dataset.logo==='light'));
window.addEventListener('hashchange',()=>render());
window.addEventListener('popstate',()=>render());
{const c=DEMO?null:LS.get('yz-cart');if(c&&c.cart&&typeof c.cart==='object')for(const [k,q] of Object.entries(c.cart))if((P[k]||C[k]||(k.startsWith('sachets-')&&P[k.slice(8)]))&&Number.isInteger(q)&&q>0&&q<100)state.cart[k]=q;if(c&&c.promo===WCODE&&isSub())state.promo=WCODE;count();}
if(document.body.dataset.site){let seen=null;try{seen=sessionStorage.getItem('yz-nl');}catch(e){}if(!seen&&!isSub())setTimeout(popOpen,1200);}
render();
