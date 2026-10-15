/* yuzaa · animations.js
   Animations au défilement, compteurs, en-tête et barre d'achat collante. */
/* ---------- Animations ---------- */
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const still=()=>RM.matches||$('#site').classList.contains('wf');
const RV='.hm-head,.hm-rc,.hm-why-list li,.hm-steps li,.hm-day,.hm-rv,.hm-sim,.hm-vs,.hm-boule,.hm-q,.hm-art,.hm-table,.sec-head,.pcard,.acard,.card,.member,.day,.sim,.daycards>div,.tiles>*,.steps4>*,.g4>*,.quality>*,.feat>*,.cmpw,.plant,.origin,.pillar,.stat,.tstep,.faqg details,.faqh details,.deg-steps li,.thermo,.vs-col,.inprod,.author,.askfaq,.eng-g,.chain>div,.empty-acc,.proof,.story>*,.quote';
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;io.unobserve(t);if(t.dataset.count!=null)countUp(t);else t.classList.add('in');}),{rootMargin:'0px 0px -8% 0px',threshold:.08}):null;
function countUp(el){const n=+el.dataset.count,t0=performance.now(),dur=1100;const step=now=>{const k=Math.min(1,(now-t0)/dur);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};el.textContent='0';requestAnimationFrame(step);}
function animate(){const v=$('#view');v.classList.remove('pg-in');if(still()||!io)return;void v.offsetWidth;v.classList.add('pg-in');
 const seen=new Map();$$(RV,v).forEach(el=>{if(el.closest('.hero')||el.parentElement.closest('.rv'))return;const par=el.parentElement;const i=seen.get(par)||0;seen.set(par,i+1);el.style.setProperty('--rd',(Math.min(i,5)*.09)+'s');el.classList.add('rv');io.observe(el);});
 $$('[data-count]',v).forEach(el=>io.observe(el));}
let ticking=false;
function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;const h=$('.hdr');if(h)h.classList.toggle('is-scrolled',scrollY>8);buyBar();const m=$('.hero .media svg,.hero .media img');if(m&&!still()){const r=m.getBoundingClientRect();if(r.bottom>0)m.style.setProperty('--px',Math.round(-r.top*.08)+'px');}});}
window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',()=>buyBar());window.addEventListener('load',()=>buyBar());
function buyBar(){const m=$('.mbuy');if(!m)return;const b=$('.pinfo .buy [data-add]');let out=true;if(b){const r=b.getBoundingClientRect();out=r.bottom<72||r.top>innerHeight;}const f=$('.ftr');if(f&&f.getBoundingClientRect().top<innerHeight)out=false;m.classList.toggle('show',out);}
document.addEventListener('change',e=>{const t=e.target;if(t.id==='psort'){state.sort=t.value;render(true);const s2=$('#psort');if(s2)s2.focus({preventScroll:true});return;}if(t.name!=='fmt')return;const pp=$('#pp-price'),pu=$('#pp-unit');if(!pp)return;const d=(cur().match(/^produit-(\w+)/)||[])[1];const p=P[d];if(!p)return;if(t.value==='sachets'){pp.textContent='6,90 €';pu.textContent='Boîte de 20 sachets · format pratique à emporter';}else{pp.textContent=eur(p.price);pu.textContent='Vrac 100 g · environ 40 tasses · 0,30 € la tasse';}});
function fly(btn){if(still())return;const cart=$('.hdr .ibtn[href="#panier"]');if(!cart)return;const a=btn.getBoundingClientRect(),b=cart.getBoundingClientRect();if(!b.width)return;const d=document.createElement('span');d.className='fly';d.style.left=(a.left+a.width/2-8)+'px';d.style.top=(a.top+a.height/2-8)+'px';document.body.appendChild(d);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.transform=`translate(${b.left+b.width/2-a.left-a.width/2}px,${b.top+b.height/2-a.top-a.height/2}px) scale(.45)`;d.style.opacity='.3';}));
 setTimeout(()=>{d.remove();cart.classList.remove('bump');void cart.offsetWidth;cart.classList.add('bump');},760);}
function added(btn){if(!btn.isConnected||btn.classList.contains('is-added'))return;const w=btn.offsetWidth,h=btn.innerHTML;btn.style.minWidth=w+'px';btn.classList.add('is-added');btn.innerHTML='✓ Ajouté';setTimeout(()=>{if(!btn.isConnected)return;btn.classList.remove('is-added');btn.innerHTML=h;btn.style.minWidth='';},1400);}
