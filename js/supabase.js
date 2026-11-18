/* yuzaa · supabase.js
   Catalogue lu depuis Supabase (table produits) avec repli sur les données du site,
   et comptes clients via Supabase Auth (table clients). Si Supabase est injoignable,
   le site garde son fonctionnement local. Seule la clé publiable est utilisée ici. */
(()=>{
const SB_URL='https://gamexnxhdmsedyyoayad.supabase.co';
const SB_KEY='sb_publishable_uMC_nCQLV-HocBePG5ofZQ_vgQ1Q0va';
if(typeof DEMO!=='undefined'&&DEMO)return;
if(!window.supabase||!window.supabase.createClient)return;
let sb;
try{sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce',storageKey:'yz-auth'}});}catch(e){return;}
window.yzSB=sb;
const BASE=/^https?:$/.test(location.protocol)&&/(^|\.)yuzaa\.vercel\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname)?location.origin:'https://yuzaa.vercel.app';
const BACK=BASE+'/compte';

/* ---------- Lien d'e-mail mal formé ou expiré (#error=…) : on nettoie l'adresse ---------- */
{const h=new URLSearchParams(location.hash.slice(1)),q=new URLSearchParams(location.search);
 const err=h.get('error_description')||q.get('error_description');
 if(h.has('error')||h.has('access_token')||q.has('error')){history.replaceState(null,'',location.pathname);render(true);}
 if(err)setTimeout(()=>toast(/expired|invalid/i.test(err)?'Ce lien a expiré. Connectez-vous ou demandez un nouveau lien.':'Le lien n\'a pas pu être utilisé. Connectez-vous avec votre e-mail.'),400);}

/* ---------- Catalogue : prix, caféine et stock depuis la table produits ---------- */
const PRIX={},STOCK={};
async function catalogue(){
 try{
  const {data,error}=await sb.from('produits').select('id,prix,prix_barre,cafeine_mg,stock');
  if(error||!Array.isArray(data)||!data.length)return;
  let ch=false;
  for(const r of data){
   const pr=Number(r.prix);if(!isFinite(pr)||pr<0)continue;
   if(Number.isInteger(r.stock))STOCK[r.id]=r.stock;
   if(P[r.id]){const p=P[r.id];if(p.price!==pr){p.price=pr;ch=true;}if(Number.isInteger(r.cafeine_mg)&&r.cafeine_mg>0&&p.mg!==r.cafeine_mg){p.mg=r.cafeine_mg;ch=true;}}
   else if(C[r.id]){const c=C[r.id];if(c.price!==pr){c.price=pr;ch=true;}const o=r.prix_barre==null?null:Number(r.prix_barre);if(o&&o>pr){if(c.old!==o){c.old=o;ch=true;}}else if(c.old){delete c.old;ch=true;}}
   else if(r.id.startsWith('sachets-')&&P[r.id.slice(8)]){if(PRIX[r.id]!==pr){PRIX[r.id]=pr;ch=true;}}
  }
  if(ch){count();render(true);if(typeof cdrRefresh==='function'&&$('#cdr')&&!$('#cdr').hidden)cdrRefresh();}
 }catch(e){/* repli : données du site */}
}
const _lineInfo=lineInfo;
lineInfo=function(k){const r=_lineInfo(k);if(PRIX[k]!=null)r.price=PRIX[k];return r;};
const _add=add;
add=function(k,q){if(STOCK[k]===0){toast('Ce produit est momentanément en rupture de stock.');return;}return _add(k,q);};

/* ---------- Comptes clients ---------- */
const ORD=id=>'yz-orders-'+id;   // l'historique des commandes reste dans ce navigateur (pas de table commandes)
const toRow=a=>({id:a.uid,email:a.email,prenom:a.prenom||null,nom:a.nom||null,telephone:a.tel||null,adresse:a.adr||null,code_postal:a.cp||null,ville:a.ville||null,newsletter:!!a.news});
function fromRow(u,row){const m=u.user_metadata||{};row=row||{};const o=LS.get(ORD(u.id));
 return{uid:u.id,email:String(u.email||row.email||'').toLowerCase(),prenom:row.prenom??m.prenom??'',nom:row.nom??m.nom??'',tel:row.telephone||'',adr:row.adresse||'',cp:row.code_postal||'',ville:row.ville||'',news:!!(row.newsletter??m.newsletter),since:row.cree_le||u.created_at,orders:Array.isArray(o)?o:[]};}
async function loadMe(u){let row=null,ok=false;
 try{const {data,error}=await sb.from('clients').select('*').eq('id',u.id).maybeSingle();if(!error){row=data;ok=true;}}catch(e){}
 const a=fromRow(u,row);
 if(ok&&!row)push(a);
 const o=await loadOrders(u.id);if(o)a.orders=o;   // fiche absente (compte créé avant le script SQL) : on la crée
 if(a.news)try{localStorage.setItem('yz-nl-sub',a.email);}catch(e){}
 return a;}
function push(a){if(!a||!a.uid)return;sb.from('clients').upsert(toRow(a)).then(({error})=>{if(error)console.warn('[yuzaa] fiche client non enregistrée :',error.message);});}
/* Commandes : historique lu dans Supabase (tables commandes + lignes_commande) */
async function loadOrders(uid){try{
 const {data,error}=await sb.from('commandes').select('numero,cree_le,sous_total,remise,livraison,total,mode_paiement,email,adresse,statut,lignes_commande(produit_id,nom,quantite,prix_unitaire)').eq('client_id',uid).order('cree_le',{ascending:false}).limit(50);
 if(error||!Array.isArray(data))return null;
 return data.map(c=>({n:c.numero,date:c.cree_le,items:(c.lignes_commande||[]).map(l=>[l.produit_id,l.quantite,(()=>{try{return lineInfo(l.produit_id).name;}catch(e){return l.nom;}})(),Number(l.prix_unitaire)]),sub:+c.sous_total,disc:+c.remise,ship:+c.livraison,tot:+c.total,free:+c.livraison===0,method:c.mode_paiement,email:c.email,adr:Array.isArray(c.adresse)?c.adresse:[],statut:c.statut}));
 }catch(e){return null;}}
const OERR={connexion_requise:'Votre session a expiré. Reconnectez-vous pour valider la commande.',panier_vide:'Votre panier est vide.',code_invalide:'Ce code n\'est pas valide ou a expiré.',code_reserve_newsletter:'Le code BIENVENUE10 est réservé aux inscrits à la newsletter.',code_premiere_commande:'Le code BIENVENUE10 est réservé à la première commande.',quantite_invalide:'Quantité invalide dans le panier.'};
let ordering=false;
const _placeOrder=placeOrder;
placeOrder=async function(method){
 if(!me||!me.uid)return _placeOrder(method);
 if(ordering)return;ordering=true;
 const lignes=Object.entries(state.cart).map(([id,q])=>({id,q}));
 let r;try{r=await sb.rpc('passer_commande',{p_lignes:lignes,p_code:state.promo||null,p_paiement:method,p_adresse:[me.prenom+' '+me.nom,me.adr,me.cp+' '+me.ville]});}catch(e){r={error:e};}
 ordering=false;
 if(r.error){const m=String(r.error.message||'');const k=m.split(':')[0];
  if(m.startsWith('rupture:')){toast('Plus assez de stock pour « '+m.slice(8)+' ». Modifiez votre panier.');go('panier');return;}
  if(m.startsWith('produit_inconnu')){toast('Un produit du panier n\'est plus disponible. Modifiez votre panier.');go('panier');return;}
  if(k.startsWith('code_')){state.promo=null;render(true);toast(OERR[k]);return;}
  if(OERR[k]){toast(OERR[k]);if(k==='connexion_requise')go('connexion');return;}
  // tables pas encore créées ou Supabase injoignable : la commande reste enregistrée dans le navigateur
  console.warn('[yuzaa] commande non enregistrée dans Supabase :',m);return _placeOrder(method);}
 const row=Array.isArray(r.data)?r.data[0]:r.data;
 const before=Object.keys(state.cart).map(k=>{const l=lineInfo(k);return [k,state.cart[k],l.name,l.price];});
 const o={n:row.numero,date:new Date().toISOString(),items:before,sub:+row.sous_total,disc:+row.remise,ship:+row.livraison,tot:+row.total,free:+row.livraison===0,method,email:me.email,adr:[me.prenom+' '+me.nom,me.adr,me.cp+' '+me.ville],statut:'payée'};
 for(const [k,q] of Object.entries(state.cart))if(STOCK[k]!=null)STOCK[k]=Math.max(0,STOCK[k]-q);
 me.orders.unshift(o);saveAcc();state.last=o;state.cart={};state.promo=null;count();go('confirmation');};

/* Newsletter : chaque inscription est enregistrée dans la table newsletter */
const _setSub=setSub;
setSub=function(email){_setSub(email);const e=String(email||'').trim().toLowerCase();if(!TEST.email(e))return;
 const src=$('#nlpop')&&!$('#nlpop').hidden?'popup':$('#cdr')&&!$('#cdr').hidden?'panier':cur()==='compte-profil'?'compte':/^(compte|connexion|merci)/.test(cur())?'inscription':'pied de page';
 sb.from('newsletter').insert({email:e,source:src}).then(({error})=>{if(error&&error.code!=='23505')console.warn('[yuzaa] newsletter :',error.message);});};

let tSave=0;
/* Copie locale du compte connecté (sans mot de passe) : le site le retrouve tout de suite au rechargement,
   puis Supabase confirme la session ou déconnecte. */
function cacheMe(){if(me&&me.uid){LS.set('yz-accounts',{[me.email]:me});LS.set('yz-session',me.email);LS.set(ORD(me.uid),me.orders||[]);}else{LS.del('yz-accounts');LS.del('yz-session');}}
saveAcc=function(){
 cacheMe();
 if(!me||!me.uid)return;
 const a=me;clearTimeout(tSave);tSave=setTimeout(()=>push(a),250);};

/* Les anciens comptes enregistrés seulement dans le navigateur ne sont plus utilisés */
if(me&&!me.uid){me=null;state.logged=false;render(true);}
cacheMe();

const MSGS={
 invalid_credentials:'E-mail ou mot de passe incorrect. Vérifiez votre saisie, ou créez votre compte avec le formulaire « Nouveau client ».',
 email_not_confirmed:'Confirmez d\'abord votre adresse : cliquez sur le lien reçu par e-mail, puis reconnectez-vous.',
 user_already_exists:'Un compte existe déjà avec cette adresse e-mail. Connectez-vous avec le formulaire « Déjà client ? ».',
 email_exists:'Cette adresse est déjà utilisée par un autre compte.',
 weak_password:'Mot de passe trop faible : 8 caractères minimum, dont au moins un chiffre.',
 over_email_send_rate_limit:'Trop d\'e-mails envoyés en peu de temps. Réessayez dans quelques minutes.',
 over_request_rate_limit:'Trop de tentatives. Patientez une minute, puis réessayez.',
 email_address_invalid:'Adresse e-mail refusée. Vérifiez qu\'elle est correcte.',
 signup_disabled:'Les inscriptions sont momentanément fermées.'};
const authMsg=e=>MSGS[e&&e.code]||(e&&/already registered/i.test(e.message||'')?MSGS.user_already_exists:'Service momentanément indisponible. Réessayez dans un instant.');
function busy(f,on){const b=f&&f.querySelector('button[type=submit],button:not([type])');if(b){b.disabled=on;b.setAttribute('aria-busy',on?'true':'false');}}
function okMsg(id,txt){const m=$('#'+id);if(!m)return;m.textContent=txt;m.classList.remove('alert-err');m.classList.add('alert-ok');m.setAttribute('role','status');m.hidden=false;}
function errMsg(id,txt){const m=$('#'+id);if(m){m.classList.remove('alert-ok');m.classList.add('alert-err');m.setAttribute('role','alert');}formMsg(id,txt);}
const hi=a=>a.prenom?', '+esc(a.prenom):'';

H.login=async f=>{const email=val('l-email').toLowerCase();busy(f,true);
 let r;try{r=await sb.auth.signInWithPassword({email,password:$('#l-pw').value});}catch(e){r={error:e};}busy(f,false);
 if(r.error){errMsg('login-msg',authMsg(r.error));return;}
 const a=await loadMe(r.data.user);login(a,f.dataset.next,'Bon retour'+hi(a)+' !');};

H.register=async f=>{const email=val('r-email').toLowerCase(),prenom=cap(val('r-prenom')),nom=cap(val('r-nom')),news=$('#r-news').checked;busy(f,true);
 let r;try{r=await sb.auth.signUp({email,password:$('#r-pw').value,options:{data:{prenom,nom,newsletter:news},emailRedirectTo:BACK}});}catch(e){r={error:e};}busy(f,false);
 if(r.error){errMsg('reg-msg',authMsg(r.error));return;}
 const u=r.data.user;
 if(u&&Array.isArray(u.identities)&&!u.identities.length){errMsg('reg-msg',MSGS.user_already_exists);return;}
 if(news)setSub(email);
 if(!r.data.session){okMsg('reg-msg','Presque fini : un e-mail de confirmation vient d\'être envoyé à '+email+'. Cliquez sur le lien qu\'il contient pour activer votre compte.');f.reset();$$('.field',f).forEach(x=>x.classList.remove('is-ok'));return;}
 const a=await loadMe(u);a.prenom=a.prenom||prenom;a.nom=a.nom||nom;a.news=a.news||news;
 login(a,f.dataset.next||'merci','Compte créé. Bienvenue'+hi(a)+' !');};

H.profil=async f=>{const email=val('p-mail').toLowerCase();let msg='Profil mis à jour';
 if(email!==me.email){busy(f,true);let r;try{r=await sb.auth.updateUser({email},{emailRedirectTo:BACK});}catch(e){r={error:e};}busy(f,false);
  if(r.error){$('#p-mail').closest('.field').classList.add('has-error');$('#p-mail-err').textContent=authMsg(r.error);return;}
  msg='Profil mis à jour. Confirmez votre nouvelle adresse grâce au lien envoyé par e-mail.';}
 me.prenom=cap(val('p-prenom'));me.nom=cap(val('p-nom'));me.tel=val('p-tel');me.news=$('#p-news').checked;
 if(me.news)setSub(me.email);saveAcc();render(true);toast(msg);};

/* Déconnexion (le site vide déjà le compte affiché) et mot de passe oublié */
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button,a');if(!t)return;
 if(t.hasAttribute('data-logout')){sb.auth.signOut().catch(()=>{});return;}
 if(t.classList.contains('linkbtn')&&/mot de passe oubli/i.test(t.textContent)){e.preventDefault();e.stopPropagation();
  const i=$('#l-email'),email=i?i.value.trim().toLowerCase():'';
  if(!TEST.email(email)){if(i){check(i);i.focus();}toast('Saisissez d\'abord votre adresse e-mail dans le champ ci-dessus.');return;}
  sb.auth.resetPasswordForEmail(email,{redirectTo:BACK+'?reset=1'}).then(({error})=>{if(error&&error.code&&/rate_limit/.test(error.code)){toast(authMsg(error));return;}toast('Si un compte existe pour '+email+', un lien de réinitialisation vient de vous être envoyé.');}).catch(()=>toast(authMsg(null)));}
},true);

async function newPassword(){
 for(let n=0;n<3;n++){const pw=prompt('Choisissez votre nouveau mot de passe (8 caractères minimum, dont au moins un chiffre) :');if(pw===null)return;
  if(!TEST.pw(pw)){alert(MSG.pw);continue;}
  const {error}=await sb.auth.updateUser({password:pw});toast(error?authMsg(error):'Mot de passe modifié. Vous êtes connecté(e).');return;}}

/* ---------- Session : au chargement, à la confirmation d'e-mail, à la déconnexion ---------- */
const QS=new URLSearchParams(location.search);let fromLink=QS.has('code')&&!QS.has('reset');
async function onAuth(ev,session){
 const u=session&&session.user;
 if(ev==='SIGNED_OUT'||!u){if(me&&me.uid){me=null;state.logged=false;render(true);}return;}
 if(ev==='PASSWORD_RECOVERY'){if(!me||me.uid!==u.id){me=await loadMe(u);state.logged=true;render(true);}newPassword();return;}
 if(!me||me.uid!==u.id){const a=await loadMe(u);me=a;state.logged=true;
  if(state.promo&&me.orders.length)state.promo=null;
  render(true);if(fromLink){fromLink=false;toast('Adresse confirmée. Bienvenue'+hi(a)+' !');}}
 else if(ev==='USER_UPDATED'&&u.email&&u.email.toLowerCase()!==me.email){me.email=u.email.toLowerCase();saveAcc();render(true);toast('Nouvelle adresse e-mail confirmée.');}}
sb.auth.onAuthStateChange((ev,session)=>{setTimeout(()=>onAuth(ev,session),0);});
/* Lien de confirmation ouvert dans un autre navigateur : l'adresse est confirmée mais la session ne peut pas s'ouvrir */
if(new URLSearchParams(location.search).has('code'))setTimeout(async()=>{const {data}=await sb.auth.getSession();if(!data.session&&fromLink){fromLink=false;toast('Adresse confirmée. Connectez-vous avec votre e-mail et votre mot de passe.');}history.replaceState(null,'',location.pathname);},2500);

catalogue();
})();
