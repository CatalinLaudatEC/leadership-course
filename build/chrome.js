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
  $("#tcPop").innerHTML = `<div class="tc-head"><b>World time</b><span>Compared with ${esc(tzAbbr(sel))}</span></div>
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
document.addEventListener("change", e=>{ if (e.target.id==="clockFmt") tickTopClock(); });
