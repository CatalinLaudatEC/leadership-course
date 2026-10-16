/* ============================================================ FX ENGINE ============================================================ */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
I.search='<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>';
I.spark='<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>';
I.up='<path d="m6 15 6-6 6 6"/>';
const STAGGER = ".crumb,.ph,.card,.dsec,.ccard,.doctile,.toolbar,.tabs,.tabpane";
function afterRender(changed){
  const pg=$("#page");
  if (!changed || RM) return;
  pg.classList.remove("anim-in"); void pg.offsetWidth; pg.classList.add("anim-in");
  let i=0; pg.querySelectorAll(STAGGER).forEach(el=>{ if(i>40) return; el.classList.add("fx-rise"); el.style.setProperty("--d",Math.min(i++*45,800)+"ms"); });
  countUp(pg);
  clearTimeout(window._ai); window._ai=setTimeout(()=>pg.classList.remove("anim-in"),2300);
}
function countUp(root){
  root.querySelectorAll(".kpi .v, .ring-txt, .donut-leg b").forEach(el=>{
    const node=[...el.childNodes].find(n=>n.nodeType===3&&/\d/.test(n.nodeValue)); if(!node) return;
    const m=node.nodeValue.match(/^(\D*)(\d+)(.*)$/); if(!m||+m[2]===0) return;
    const to=+m[2], t0=performance.now(), d=1100;
    const step=now=>{ const p=Math.min(1,(now-t0)/d), e=1-Math.pow(1-p,3); node.nodeValue=m[1]+Math.round(to*e)+m[3]; if(p<1) requestAnimationFrame(step); };
    node.nodeValue=m[1]+"0"+m[3]; requestAnimationFrame(step);
  });
}
/* loading bar */
function loadStart(){ const b=$("#loadbar"); if(!b) return; b.style.transition="none"; b.style.width="0"; b.classList.add("run"); void b.offsetWidth; b.style.transition=""; b.style.width="72%"; clearTimeout(window._lb1); clearTimeout(window._lb2);
  window._lb1=setTimeout(()=>{ b.style.width="100%"; window._lb2=setTimeout(()=>{ b.classList.remove("run"); },380); },260); }
/* toast (overrides the basic one) */
function toast(m, kind){ const t=$("#toast"); t.innerHTML=`<span class="ti">${ic(kind||"ok")}</span><span>${esc(m)}</span><span class="tbar"></span>`; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"),2200); }
/* ripple */
document.addEventListener("pointerdown",e=>{ if(RM) return; const b=e.target.closest(".btn,.choices button,.toggle button,.pills button,.palbtn,.gapbtn"); if(!b||b.disabled) return;
  const r=b.getBoundingClientRect(), s=Math.max(r.width,r.height), sp=document.createElement("span"); sp.className="ripple"; sp.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
  if(getComputedStyle(b).position==="static") b.style.position="relative"; b.style.overflow="hidden"; b.appendChild(sp); setTimeout(()=>sp.remove(),700); },{passive:true});
/* tilt + spotlight */
const TILT=".kpi,.doctile,.ccard,.lvlcard,.dg-week,.dg-box,.dg-cp,.choices button:not(:disabled),.rule,.jump a,.subhead,.flow button,.slist button";
let curTilt=null;
function resetTilt(el){ if(!el) return; el.classList.remove("tilting"); el.style.transform=""; }
document.addEventListener("pointermove",e=>{
  if (RM || e.pointerType!=="mouse") return;
  const g=e.target.closest(".card:not(.toc),.dsec,.ccard,.doctile");
  if (g){ const r=g.getBoundingClientRect(); g.style.setProperty("--mx",(e.clientX-r.left)+"px"); g.style.setProperty("--my",(e.clientY-r.top)+"px"); }
  const t=e.target.closest(TILT);
  if (t!==curTilt){ resetTilt(curTilt); curTilt=t; }
  if (!t) return;
  const r=t.getBoundingClientRect(), px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5, big=r.width>380, a=big?2.5:9;
  t.classList.add("tilt","tilting");
  t.style.transform=`perspective(900px) rotateX(${(-py*a).toFixed(2)}deg) rotateY(${(px*a).toFixed(2)}deg) translateY(-4px) scale(${big?1.008:1.035})`;
},{passive:true});
document.addEventListener("pointerleave",()=>{ resetTilt(curTilt); curTilt=null; });
document.addEventListener("scroll",()=>{ if(window._sr) return; window._sr=requestAnimationFrame(()=>{ window._sr=0; const h=document.documentElement, p=h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight); $("#scrollbar").style.setProperty("--p",p.toFixed(4)); $("#totop").classList.toggle("show",h.scrollTop>700); }); },{passive:true});
/* confetti */
function confetti(n=160){
  if (RM) return; const cv=$("#fx"), ctx=cv.getContext("2d"), dpr=devicePixelRatio||1; cv.width=innerWidth*dpr; cv.height=innerHeight*dpr; ctx.scale(dpr,dpr);
  const cols=["#22D3EE","#5B8DEF","#A855F7","#4CC38A","#F0A63A","#F472B6","#FFFFFF"], P=[];
  for(let i=0;i<n;i++){ const side=i%2?1:-1; P.push({x:innerWidth/2+side*innerWidth*.18,y:innerHeight*.42,vx:(Math.random()*9+2)*-side*(Math.random()<.5?1:.4)+(Math.random()-.5)*6,vy:-Math.random()*15-5,w:Math.random()*8+4,h:Math.random()*5+3,c:cols[i%cols.length],r:Math.random()*6,vr:(Math.random()-.5)*.4,s:Math.random()<.25}); }
  const t0=performance.now();
  (function loop(now){ ctx.clearRect(0,0,innerWidth,innerHeight); let alive=0;
    P.forEach(p=>{ p.vy+=.32; p.vx*=.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; if(p.y<innerHeight+30){ alive++; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=Math.max(0,1-(now-t0)/3200); ctx.fillStyle=p.c; if(p.s){ ctx.beginPath(); ctx.arc(0,0,p.h/1.4,0,7); ctx.fill(); } else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); } });
    if (alive && now-t0<3400) requestAnimationFrame(loop); else ctx.clearRect(0,0,innerWidth,innerHeight); })(t0);
}
/* modal */
function modal(o){
  const m=$("#modal"); m.innerHTML=`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="mt"><button class="iconbtn m-x" data-mclose aria-label="Close">${ic("x")}</button>
    <div class="m-ic">${ic(o.icon||"award")}</div><h2 id="mt">${o.title}</h2><p>${o.body}</p>${o.extra||""}
    <div class="m-acts">${(o.actions||[{t:"Continue"}]).map((a,i,arr)=>a.h?`<a class="btn ${i<arr.length-1?"out":""}" href="${a.h}" data-mclose>${a.t}</a>`:`<button class="btn ${i<arr.length-1?"out":""}" data-mclose>${a.t}</button>`).join("")}</div></div>`;
  m.classList.add("show"); setTimeout(()=>{ const f=m.querySelector(".m-acts .btn:last-child"); f&&f.focus(); },60);
  if (o.confetti) setTimeout(()=>confetti(o.confetti===true?170:o.confetti),180);
}
function closeModal(){ $("#modal").classList.remove("show"); }
/* celebration watcher */
let SNAP=null;
function metrics(){ return {docs:DOC_KEYS.filter(k=>docPct(k)===1), l3:C.filter(c=>lvl(c.id)>=3).map(c=>c.id), drill:(S.drill.i||0)>=COURSE.drill.length, cp:SC.every(s=>scnState(s)==="full"), qc:Object.keys(S.qc).filter(k=>S.qc[k]===6)}; }
function watch(){
  const m=metrics();
  if (SNAP && !$("#modal").classList.contains("show")){
    const nd=m.docs.filter(d=>!SNAP.docs.includes(d)), nl=m.l3.filter(x=>!SNAP.l3.includes(x)), nq=m.qc.filter(x=>!SNAP.qc.includes(x));
    if (nd.length){ const k=nd[0], nx=DOC_KEYS.find(x=>docPct(x)<1&&!(DOC_META[x].mentor&&!isMentor())); setTimeout(()=>modal({icon:DOC_META[k].icon,title:"Document complete",body:`Every section of <b>${esc(DOC_META[k].name)}</b> is marked as read.`,confetti:true,actions:nx?[{t:"Overview",h:"#/"},{t:`Next: ${esc(DOC_META[nx].short)}`,h:`#/doc/${nx}`}]:[{t:"All five documents read — back to overview",h:"#/"}]}),250); }
    else if (nl.length){ const c=C.find(x=>x.id===nl[0]); setTimeout(()=>modal({icon:"award",title:`Competency ${c.id} signed off`,body:`<b>${esc(c.title)}</b> reached Level ${lvl(c.id)} · ${esc(COURSE.levels[lvl(c.id)-1].name)}.`,confetti:true,extra:`<div class="m-list"><div>${ic("award")}${C.filter(x=>lvl(x.id)>=3).length} of 15 competencies now at L3 or above</div></div>`,actions:[{t:"Close"},{t:"Sign-off record",h:"#/record"}]}),200); }
    else if (m.drill && !SNAP.drill){ const D=COURSE.drill, sc=D.filter((d,k)=>(S.drill.r||{})[k]===d.a).length; setTimeout(()=>modal({icon:"route",title:`${sc} of ${D.length} routed correctly`,body:sc>=8?"Routing is solid — that is what the checkpoint marks hardest.":"Worth another pass. Review the escalation table and run it again.",confetti:sc>=8?140:false,actions:[{t:"See breakdown"}]}),300); }
    else if (m.cp && !SNAP.cp){ setTimeout(()=>modal({icon:"check",title:"All ten situations answered",body:esc(DOCS.candidate.closing||""),confetti:true,actions:[{t:"Close"}]}),300); }
    else if (nq.length){ confetti(90); }
  }
  SNAP=m;
}
/* theme switch with circular reveal */
function themeSwitch(e){
  const flip=()=>{ S.ui.theme=S.ui.theme==="dark"?"light":"dark"; save(); render(true); };
  if (RM || !document.startViewTransition){ flip(); return; }
  const r=$("#themeBtn").getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2, R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(flip).ready.then(()=>document.documentElement.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${R}px at ${x}px ${y}px)`]},{duration:650,easing:"cubic-bezier(.2,.8,.2,1)",pseudoElement:"::view-transition-new(root)"}));
}
/* command palette */
let palAll=[], palRes=[], palSel=0;
function palIndex(){
  const it=[];
  NAV.filter(n=>n.h).forEach(n=>it.push({t:n.t,s:"Page",i:n.i,h:n.h}));
  C.forEach(c=>it.push({t:`${c.id}. ${c.title}`,s:`Competency · ${c.weekLabel}`,i:"award",h:`#/c/${c.id}`}));
  DOC_KEYS.forEach(k=>{ if(DOC_META[k].mentor&&!isMentor()) return; DOCS[k].sections.forEach(s=>it.push({t:s.title,s:`${DOC_META[k].short}${s.kicker?" · "+s.kicker:s.group?" · "+s.group:""}`,i:DOC_META[k].icon,h:`#/doc/${k}?sec=${s.id}`,k,sec:s.id})); });
  return it;
}
function palRender(){
  const q=($("#palIn").value||"").trim().toLowerCase();
  if (!q) palRes=palAll.filter(x=>x.s==="Page").concat(upNext().slice(0,3).map(c=>palAll.find(x=>x.h===`#/c/${c.id}`)));
  else { const a=palAll.filter(x=>(x.t+" "+x.s).toLowerCase().includes(q)); const b=palAll.filter(x=>x.k&&!a.includes(x)&&SEC_TEXT[x.k][x.sec].includes(q)).map(x=>({...x,s:`${x.s} · mentions “${q}”`})); palRes=a.concat(b).slice(0,40); }
  palSel=Math.min(palSel,Math.max(0,palRes.length-1));
  $("#palList").innerHTML = palRes.length ? palRes.map((x,i)=>`<button class="p-it" data-pi="${i}" aria-selected="${i===palSel}" role="option" style="animation-delay:${Math.min(i,12)*18}ms"><span class="pi">${ic(x.i,"width:16px;height:16px")}</span><span><div class="pt">${esc(x.t)}</div><div class="ps">${esc(x.s)}</div></span><span class="go">${ic("chev","width:16px;height:16px")}</span></button>`).join("") : `<div class="p-empty">Nothing matches “${esc(q)}”.</div>`;
  const sel=$(`.p-it[aria-selected="true"]`); sel&&sel.scrollIntoView({block:"nearest"});
}
function openPal(){ palAll=palIndex(); palSel=0; const p=$("#pal");
  p.innerHTML=`<div class="pbox" role="dialog" aria-modal="true" aria-label="Search everything"><div class="p-in">${ic("search")}<input id="palIn" placeholder="Search pages, competencies, every document section…" autocomplete="off" aria-label="Search everything"><kbd>Esc</kbd></div><div class="p-list" id="palList" role="listbox"></div><div class="p-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Ctrl</kbd> <kbd>K</kbd> toggle</span><span style="margin-left:auto">${palAll.length} items indexed</span></div></div>`;
  p.classList.add("show"); palRender(); setTimeout(()=>$("#palIn").focus(),40); }
function closePal(){ $("#pal").classList.remove("show"); }
function palGo(i){ const x=palRes[i]; if(!x) return; closePal(); const p=parse(); if(x.k && p.view==="doc" && p.arg===x.k){ jumpTo(x.k,x.sec); return; } location.hash=x.h; }
document.addEventListener("keydown",e=>{
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); $("#pal").classList.contains("show")?closePal():openPal(); return; }
  if (e.key==="/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ e.preventDefault(); openPal(); return; }
  if ($("#pal").classList.contains("show")){
    if (e.key==="Escape"){ closePal(); return; }
    if (e.key==="ArrowDown"){ e.preventDefault(); palSel=Math.min(palRes.length-1,palSel+1); palRender(); }
    if (e.key==="ArrowUp"){ e.preventDefault(); palSel=Math.max(0,palSel-1); palRender(); }
    if (e.key==="Enter"){ e.preventDefault(); palGo(palSel); }
  }
  if (e.key==="Escape" && $("#modal").classList.contains("show")) closeModal();
});
document.addEventListener("input",e=>{ if(e.target.id==="palIn"){ palSel=0; palRender(); } });
document.addEventListener("click",e=>{
  if (e.target.closest("#palBtn")){ openPal(); return; }
  const pi=e.target.closest("[data-pi]"); if(pi){ palGo(+pi.dataset.pi); return; }
  if (e.target.id==="pal") closePal();
  if (e.target.closest("[data-mclose]") || e.target.id==="modal") closeModal();
  if (e.target.closest("#totop")) window.scrollTo({top:0,behavior:RM?"auto":"smooth"});
},true);
document.addEventListener("mousemove",e=>{ const pi=e.target.closest&&e.target.closest("[data-pi]"); if(pi && +pi.dataset.pi!==palSel){ palSel=+pi.dataset.pi; $$(".p-it").forEach((b,i)=>b.setAttribute("aria-selected",String(i===palSel))); } },{passive:true});
/* splash + welcome */
function welcome(){
  modal({icon:"spark",title:"Welcome to the Learning Center",body:"The Team Leader Raising Program, with every source document turned into something you can read, fill in and track.",
    extra:`<div class="m-list">${[["book","Five documents, segmented and searchable"],["grid","Overview, charts and the 10-week timeline"],["award","Competencies, quick checks and sign-off"],["search",`Press <kbd>Ctrl</kbd> <kbd>K</kbd> to search everything`]].map(([i,t],k)=>`<div style="animation-delay:${250+k*90}ms">${ic(i)}<span>${t}</span></div>`).join("")}</div>`,
    actions:[{t:"Start exploring"}],confetti:110});
  S.ui.welcomed=true; save();
}
setTimeout(()=>{ const sp=$("#splash"); sp&&sp.classList.add("out"); if(!S.ui.welcomed) setTimeout(welcome,550); setTimeout(()=>sp&&sp.remove(),900); }, RM?0:1150);
