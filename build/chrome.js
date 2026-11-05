/* ============================================================ HUB CHROME (sidebar + top bar icons) ============================================================ */
Object.assign(I, {
  dash:'<rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/>',
  ucirc:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5c1.2-2 3.1-3 5.5-3s4.3 1 5.5 3"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
  feed:'<rect x="7" y="3.5" width="13.5" height="11" rx="2"/><path d="M4 7.5v10a3 3 0 0 0 3 3h10M10.5 7.5h6.5M10.5 11h4"/>',
  plane:'<path d="M3 20h18"/><path d="m4 13 2.3-.6 2.6 2.6 4.5-1.3-5.3-6.5 2.4-.7 7.2 5.4 3.1-.9a1.6 1.6 0 1 1 .9 3.1L6.7 18.3 3.2 14.6z"/>',
  otime:'<path d="M20.5 12A8.5 8.5 0 1 1 12 3.5c2.5 0 4.7 1 6.2 2.7"/><path d="M19 3v4h-4M12 8v4l2.5 2"/>',
  benefit:'<path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.3 7.5 9.5 4.4-1.2 7.5-4.9 7.5-9.5V6z"/><path d="M12 15.5s-3.5-2-3.5-4.3a1.9 1.9 0 0 1 3.5-1 1.9 1.9 0 0 1 3.5 1c0 2.3-3.5 4.3-3.5 4.3z"/>',
  hands:'<path d="M3 15h3l4 1.5h3.5a1.5 1.5 0 0 1 0 3H9"/><path d="M13.5 18.5 19 16a1.5 1.5 0 0 1 1.5 2.5L14 21.5H3"/><circle cx="15.5" cy="6" r="2.5"/><circle cx="9" cy="8" r="2"/>',
  exit:'<path d="M14 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H14"/><path d="m16 8 4 4-4 4M20 12H10"/>',
  bars:'<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 16.5v-5M12 16.5v-9M16 16.5v-3"/>',
  down:'<path d="m6 9 6 6 6-6"/>'
});

/* ---------- top-bar clock: one pinned zone (EST by default); hover or tap lists every zone with its hour difference ---------- */
const TZ_ALL = () => [["Eastern Time","America/New_York"], ...HUB.clocks];
const tzName = tz => (TZ_ALL().find(z=>z[1]===tz)||["",tz])[0];
const tzCity = tz => tz.split("/").pop().replace(/_/g," ");
function tzAbbr(tz){ if (tz==="America/New_York"){ const p=new Intl.DateTimeFormat("en-US",{timeZone:tz,timeZoneName:"short"}).formatToParts(new Date()).find(x=>x.type==="timeZoneName"); return p?p.value:"EST"; } return tzName(tz); }
function tzOffsetMin(tz){ const d=new Date(), p={}; new Intl.DateTimeFormat("en-US",{timeZone:tz,year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",hourCycle:"h23"}).formatToParts(d).forEach(x=>p[x.type]=x.value);
  return Math.round((Date.UTC(+p.year,+p.month-1,+p.day,+p.hour%24,+p.minute)-d.getTime())/60000); }
function tzDiff(tz, base){ const m=tzOffsetMin(tz)-tzOffsetMin(base); if(!m) return {t:"Same time",k:"same"};
  const a=Math.abs(m), h=Math.floor(a/60), mm=a%60; return {t:`${m>0?"+":"−"}${h}${mm?`:${String(mm).padStart(2,"0")}`:""}h`,k:m>0?"ahead":"behind"}; }
const topTz = () => (S && S.ui && S.ui.topTz) || "America/New_York";
function renderTopClock(){ const box=$("#tclock"); if(!box) return; const sel=topTz();
  $("#tcPop").innerHTML = `<div class="tc-head"><div><b>World time</b><span>Compared with ${esc(tzAbbr(sel))}</span></div><div class="tc-fmt" role="group" aria-label="Time format"><button type="button" data-clockfmt="12" aria-pressed="${!clock24()}">12h</button><button type="button" data-clockfmt="24" aria-pressed="${clock24()}">24h</button></div></div>
    <div class="tc-list">${TZ_ALL().map(([n,tz])=>`<button type="button" class="tc-row${tz===sel?" on":""}" data-tz-pick="${tz}" role="option" aria-selected="${tz===sel}">
      <span class="tc-ab">${esc(tz==="America/New_York"?tzAbbr(tz):n.slice(0,2).toUpperCase())}</span>
      <span class="tc-nm"><b>${esc(n)}</b><small>${esc(tzCity(tz))} · <i data-tcd></i></small></span>
      <span class="tc-tm" data-tct></span><span class="tc-df" data-tcf></span></button>`).join("")}</div>
    <div class="tc-foot">${ic("clock","width:13px;height:13px")}Click a zone to pin it to the top bar</div>`;
  tickTopClock(); }
function tickTopClock(){ const box=$("#tclock"); if(!box || !S) return; const sel=topTz(), p=tzParts(sel);
  $("#tcTime").innerHTML=clockText(p.h,p.m); $("#tcZone").textContent=tzAbbr(sel); $("#tcDate").textContent=p.date;
  box.querySelectorAll("[data-tz-pick]").forEach(r=>{ const tz=r.dataset.tzPick, q=tzParts(tz), d=tzDiff(tz,sel);
    r.querySelector("[data-tct]").innerHTML=clockText(q.h,q.m); r.querySelector("[data-tcd]").textContent=q.date;
    const f=r.querySelector("[data-tcf]"); f.textContent=tz===sel?"Pinned":d.t; f.className="tc-df "+(tz===sel?"pin":d.k); }); }
document.addEventListener("DOMContentLoaded", renderTopClock);
setInterval(tickTopClock, 1000);
document.addEventListener("click", e=>{
  const pick=e.target.closest("[data-tz-pick]"); if (pick){ S.ui.topTz=pick.dataset.tzPick; save(); renderTopClock(); toast(`${tzName(S.ui.topTz)} pinned to the top bar`); return; }
  const box=$("#tclock"); if(!box) return;
  if (e.target.closest("#tcBtn")){ const o=!box.classList.contains("open"); box.classList.toggle("open",o); $("#tcBtn").setAttribute("aria-expanded",String(o)); return; }
  if (!e.target.closest("#tclock")) { box.classList.remove("open"); $("#tcBtn").setAttribute("aria-expanded","false"); }
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ const b=$("#tclock"); if(b) b.classList.remove("open"); } });
document.addEventListener("click", e=>{ const f=e.target.closest("[data-clockfmt]"); if(!f) return; S.ui.clockFmt=f.dataset.clockfmt; save(); renderTopClock(); });

/* ---------- internet speed test (Cloudflare's open-source @cloudflare/speedtest, loaded only when a test starts) ---------- */
Object.assign(I, { gauge:'<path d="M3.5 16a8.5 8.5 0 1 1 17 0"/><path d="m12 16 4-5"/><circle cx="12" cy="16" r="1.4"/><path d="M6 16h.5M17.5 16h.5M12 7.5V8"/>' });
const SPD_LIB = "https://cdn.jsdelivr.net/npm/@cloudflare/speedtest@1.14.2/+esm";
const SPD_PLAN = [
  {type:"latency",numPackets:1},{type:"download",bytes:1e5,count:1,bypassMinDuration:true},{type:"latency",numPackets:20},
  {type:"download",bytes:1e5,count:9},{type:"download",bytes:1e6,count:8},{type:"upload",bytes:1e5,count:8},
  {type:"upload",bytes:1e6,count:6},{type:"download",bytes:1e7,count:6},{type:"upload",bytes:1e7,count:4},
  {type:"download",bytes:2.5e7,count:4},{type:"upload",bytes:2.5e7,count:4},{type:"download",bytes:1e8,count:3},{type:"upload",bytes:5e7,count:3}
];
let spdRun=null, spdLive=null, spdPhase="", spdErr="";
const mbps = b => b==null||isNaN(b) ? "–" : (b/1e6>=100 ? Math.round(b/1e6) : (b/1e6).toFixed(1));
const msTxt = v => v==null||isNaN(v) ? "–" : Math.round(v);
const SPD_Q = {bad:["Bad","bad"],poor:["Poor","bad"],average:["Okay","warn"],good:["Good","ok"],great:["Great","ok"]};
function spdUses(r){
  if (!r) return [];
  const q = k => (r.sc && r.sc[k] && SPD_Q[r.sc[k]]) || null;
  const d=r.d/1e6, u=r.u/1e6, big = d>=100&&u>=20 ? ["Great","ok"] : d>=40&&u>=10 ? ["Good","ok"] : d>=15&&u>=5 ? ["Slow","warn"] : ["Too slow","bad"];
  return [["Teams calls and screen sharing", q("rtc")], ["Video and streaming", q("streaming")], ["Syncing models (ACC, Revit cloud)", big]].filter(x=>x[1]);
}
function renderSpeed(){ const pop=$("#spdPop"); if(!pop) return;
  const r = spdLive || (S.ui && S.ui.speed) || null, running=!!spdRun;
  const when = !running && r && r.t ? `Last tested ${fmtAgo(r.t)}` : running ? (spdPhase||"Starting…") : "Not tested yet";
  pop.innerHTML = `<div class="sp-card">
    <div class="sp-head"><div><b>Internet speed</b><span>${esc(when)}</span></div>${running?`<span class="sp-live"><i></i>Testing</span>`:""}</div>
    <div class="sp-big">
      <div class="sp-m dl"><small>${ic("arrow","width:13px;height:13px;transform:rotate(90deg)")}Download</small><b>${r?mbps(r.d):"–"}</b><em>Mbps</em></div>
      <div class="sp-m ul"><small>${ic("arrow","width:13px;height:13px;transform:rotate(-90deg)")}Upload</small><b>${r?mbps(r.u):"–"}</b><em>Mbps</em></div>
    </div>
    <div class="sp-small"><span>Ping <b>${r?msTxt(r.p):"–"}</b> ms</span><span>Jitter <b>${r?msTxt(r.j):"–"}</b> ms</span>${r&&r.colo?`<span>Server <b>${esc(r.colo)}</b></span>`:""}${r&&r.isp?`<span>Provider <b>${esc(r.isp)}</b></span>`:""}</div>
    ${running?`<div class="sp-bar"><i style="width:${Math.round((spdLive&&spdLive.pct||0)*100)}%"></i></div>`:""}
    ${!running&&r?`<div class="sp-uses">${spdUses(r).map(([t,[l,k]])=>`<div><span>${esc(t)}</span><em class="${k}">${l}</em></div>`).join("")}</div>`:""}
    ${spdErr?`<p class="sp-err">${esc(spdErr)}</p>`:""}
    <button type="button" class="btn sp-go" id="spdGo">${running?"Stop test":r?"Run again":"Start test"}</button>
    <div class="sp-foot">Measured against Cloudflare's nearest server. Takes about 20 seconds and uses roughly 400 MB on a fast line.</div>
  </div>`;
}
function fmtAgo(t){ const s=Math.round((Date.now()-t)/1000); if(s<60) return "just now"; const m=Math.round(s/60); if(m<60) return `${m} min ago`; const h=Math.round(m/60); if(h<24) return `${h} h ago`; return new Date(t).toLocaleDateString("en-US",{month:"short",day:"numeric"}); }
async function startSpeed(){
  spdErr=""; spdLive={pct:0}; spdPhase="Loading the test…"; spdRun="loading"; $("#spdBtn").classList.add("running"); renderSpeed();
  let SpeedTest; try { SpeedTest=(await import(SPD_LIB)).default; } catch(e){ spdRun=null; spdLive=null; spdErr="Couldn't load the speed test. Check the connection or a firewall blocking cdn.jsdelivr.net."; $("#spdBtn").classList.remove("running"); renderSpeed(); return; }
  if (spdRun!=="loading") return;
  const t=new SpeedTest({autoStart:false, measurements:SPD_PLAN});
  spdRun=t; let done=0; const total=SPD_PLAN.length;
  fetch("https://speed.cloudflare.com/meta").then(r=>r.json()).then(m=>{ if(!spdLive) return; spdLive.colo=(m.colo&&m.colo.city)||""; spdLive.isp=m.asOrganization||""; }).catch(()=>{});
  t.onResultsChange = ({type}) => { if(!spdLive) return; const s=t.results.getSummary(); done++;
    spdPhase = type==="latency"?"Measuring ping…":type==="download"?"Measuring download…":type==="upload"?"Measuring upload…":"Testing…";
    Object.assign(spdLive,{d:s.download,u:s.upload,p:s.latency,j:s.jitter,pct:Math.min(.97,done/(total*6))}); renderSpeed(); };
  t.onFinish = res => { const s=res.getSummary(); let sc={}; try{ const g=res.getScores(); Object.keys(g).forEach(k=>sc[k]=g[k].classificationName); }catch(e){}
    S.ui.speed={d:s.download,u:s.upload,p:s.latency,j:s.jitter,sc,colo:(spdLive&&spdLive.colo)||"",isp:(spdLive&&spdLive.isp)||"",t:Date.now()}; save();
    spdRun=null; spdLive=null; $("#spdBtn").classList.remove("running"); renderSpeed(); toast(`Download ${mbps(s.download)} Mbps · Upload ${mbps(s.upload)} Mbps`); };
  t.onError = e => { spdErr="The test was interrupted. Try again."; };
  t.play();
}
function stopSpeed(){ if(spdRun && spdRun!=="loading") try{ spdRun.pause(); }catch(e){} spdRun=null; spdLive=null; spdPhase=""; $("#spdBtn").classList.remove("running"); renderSpeed(); }
document.addEventListener("click", e=>{
  const box=$("#spd"); if(!box) return;
  if (e.target.closest("#spdGo")){ spdRun?stopSpeed():startSpeed(); return; }
  if (e.target.closest("#spdBtn")){ const o=!box.classList.contains("open"); box.classList.toggle("open",o); $("#spdBtn").setAttribute("aria-expanded",String(o)); if(o) renderSpeed(); return; }
  if (!e.target.closest("#spd")){ box.classList.remove("open"); $("#spdBtn").setAttribute("aria-expanded","false"); }
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ const b=$("#spd"); if(b) b.classList.remove("open"); } });
