/* ============================================================ HUB DASHBOARD (front page) — barebones active version ============================================================
   A one-to-one copy of The Hub's dashboard (hub.eracore.com/home) in the course's design system: same cards, same
   content, nothing added. The enhanced version (course feed, activity stats, day/night clocks) is the git tag
   `dashboard-enhanced`. Links to pages that only exist in The Hub show a toast instead of leaving the page. */
Object.assign(I, {
  tasks:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  cap:'<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/><path d="M22 9.5V15"/>',
  leave:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9.5 14.5 2 2 3.5-3.5"/>',
  trend:'<path d="m3 17 5.5-5.5 4 4L21 7"/><path d="M15 7h6v6"/>',
  bolt:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
  layout:'<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 9.5h17M9.5 9.5v11"/>',
  gavel:'<path d="m14 4 6 6M11.5 6.5l6 6M9 9l6 6"/><path d="m12.5 7.5-5 5"/><path d="M4 20l6-6"/><path d="M3 21h8"/>',
  doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  org:'<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-2h12v2"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  mega:'<path d="M3 10.5v3a1 1 0 0 0 1 1h2l6 4.5V5L6 9.5H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  event:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m12 12.5.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>',
  idcard:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2M14.5 10h3.5M14.5 13.5h3.5"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14.6c2.3-.2 4 1.2 4.6 3.9"/>',
  okc:'<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
});

const HUB = {
  tasks: [
    {t:"Upload your government ID", s:"Required for verification", i:"idcard"},
    {t:"AI Innovation", s:"Needs volunteers", i:"people"}
  ],
  links: [
    ["My Workspace","View your tasks and projects","layout","blue"],
    ["My Profile","Update your information","user","sky"],
    ["Company Policies","View all company policies","gavel","amber"],
    ["My Documents","Your files and signed forms","doc","green"],
    ["Org Chart","Explore your team","org","indigo"]
  ],
  clocks: [
    ["Adriatic BIM (EU)","Europe/Zagreb"], ["Egypt","Africa/Cairo"], ["India","Asia/Kolkata"], ["LATAM","America/Mexico_City"],
    ["MENA","Asia/Dubai"], ["Pakistan","Asia/Karachi"], ["Romania","Europe/Bucharest"], ["Ukraine","Europe/Kyiv"]
  ],
  /* Hubstaff working activity, Mon..Sun, newest week first. Only the current week has data, as in The Hub. */
  activity: [[32,43,43,null,null,null,null]],
  weeks: 4
};
let hubWeek = 0;

const dayStart = d => { const x=new Date(d); x.setHours(0,0,0,0); return x; };
const weekMonday = off => { const t=dayStart(new Date()), dow=(t.getDay()+6)%7; t.setDate(t.getDate()-dow-7*off); return t; };
const fmtMD = d => d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
const hubToast = name => toast(`${name} lives in The Hub — not part of this course demo`, "link");

/* ---------- activity chart (monotone curve, like The Hub's) ---------- */
function monotonePath(P){
  if (P.length<2) return "";
  const n=P.length, d=[], m=[];
  for(let i=0;i<n-1;i++) d.push((P[i+1][1]-P[i][1])/(P[i+1][0]-P[i][0]));
  m[0]=d[0]; m[n-1]=d[n-2];
  for(let i=1;i<n-1;i++) m[i]= d[i-1]*d[i]<=0 ? 0 : (d[i-1]+d[i])/2;
  for(let i=0;i<n-1;i++){ if(d[i]===0){ m[i]=0; m[i+1]=0; continue; } const a=m[i]/d[i], b=m[i+1]/d[i], s=a*a+b*b; if(s>9){ const t=3/Math.sqrt(s); m[i]=t*a*d[i]; m[i+1]=t*b*d[i]; } }
  let p=`M${P[0][0]},${P[0][1]}`;
  for(let i=0;i<n-1;i++){ const h=(P[i+1][0]-P[i][0])/3; p+=` C${P[i][0]+h},${P[i][1]+m[i]*h} ${P[i+1][0]-h},${P[i+1][1]-m[i+1]*h} ${P[i+1][0]},${P[i+1][1]}`; }
  return p;
}
const compactChart = () => matchMedia("(max-width:600px)").matches;
function activityChart(off){
  const sm=compactChart(), W=sm?400:900, H=sm?230:300, l=sm?30:40, r=sm?10:14, t=12, b=26, cw=(W-l-r)/6, ch=H-t-b;
  const mon=weekMonday(off), today=dayStart(new Date()), raw=HUB.activity[off]||[];
  const days=[...Array(7)].map((_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d; });
  const vals=days.map((d,i)=> d>today ? null : (raw[i]??null));
  const X=i=>l+i*cw, Y=v=>t+ch-(v/100)*ch;
  let grid=""; for(let v=0; v<=100; v+=20){ grid+=`${v?`<line x1="${l}" x2="${W-r}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/>`:""}<line x1="${l-5}" x2="${l}" y1="${Y(v)}" y2="${Y(v)}" class="tick"/><text x="${l-8}" y="${Y(v)+4}" text-anchor="end" class="ax">${v}</text>`; }
  const axes=`<line x1="${l}" x2="${l}" y1="${t}" y2="${Y(0)}" class="axl"/><line x1="${l}" x2="${W-r}" y1="${Y(0)}" y2="${Y(0)}" class="axl"/>`;
  const xl=days.map((d,i)=>`<line x1="${X(i)}" x2="${X(i)}" y1="${Y(0)}" y2="${Y(0)+5}" class="tick"/><text x="${X(i)}" y="${H-6}" text-anchor="${i===0?"start":i===6?"end":"middle"}" class="ax">${sm?d.toLocaleDateString("en-US",{weekday:"narrow"}):d.toLocaleDateString("en-US",{weekday:"short"})+" "+d.getDate()}</text>`).join("");
  const runs=[]; let cur=[]; vals.forEach((v,i)=>{ if(v==null){ if(cur.length) runs.push(cur); cur=[]; } else cur.push(i); }); if(cur.length) runs.push(cur);
  const areas=runs.map(run=>{ const P=run.map(i=>[X(i),Y(vals[i])]), line=run.length>1?monotonePath(P):"";
    return run.length>1?`<path class="area" d="${line} L${P[P.length-1][0]},${Y(0)} L${P[0][0]},${Y(0)} Z"/><path class="line" pathLength="1" d="${line}"/>`:""; }).join("");
  const dots=vals.map((v,i)=> v==null?"":`<circle class="pt" cx="${X(i)}" cy="${Y(v)}" r="4" tabindex="0" data-tip="<b>${days[i].toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</b>${v}% activity"/>`).join("");
  return `<svg class="actchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Hubstaff working activity for the week of ${fmtMD(mon)}">${grid}${axes}${areas}${dots}${xl}</svg>`;
}

/* ---------- time helpers (used by the top-bar clock) ---------- */
const clock24 = () => S.ui.clockFmt!=="12";
function tzParts(tz){ const p={}; new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23",weekday:"short",day:"numeric",month:"short"}).formatToParts(new Date()).forEach(x=>p[x.type]=x.value); return {h:+p.hour%24,m:+p.minute,s:+p.second,date:`${p.weekday} ${p.day} ${p.month}`}; }
function clockText(h,m){ const mm=String(m).padStart(2,"0"); return clock24() ? `${String(h).padStart(2,"0")}:${mm}` : `${h%12||12}:${mm}<small>${h<12?"AM":"PM"}</small>`; }

/* ---------- view ---------- */
V.home = () => {
  const now=new Date(), hr=now.getHours(), greet=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
  const first=esc((S.profile.name||"there").split(" ")[0]);
  const viewAll=(attrs)=>`<${attrs.startsWith("href")?"a":"button type=\"button\""} class="hlink" ${attrs}>View All ${ic("arrow","width:14px;height:14px")}</${attrs.startsWith("href")?"a":"button"}>`;
  const stat=(o)=>`<div class="card hstat"><div class="hs-h"><span class="tile">${ic(o.i)}</span><h2>${o.title}</h2>${o.badge!=null?`<span class="hcount green">${o.badge}</span>`:""}</div>
      <div class="hs-b">${o.body}</div><div class="hs-f">${o.foot}</div></div>`;
  const weeks=[...Array(HUB.weeks)].map((_,o)=>{ const m=weekMonday(o), e=new Date(m); e.setDate(m.getDate()+6); return `<option value="${o}" ${o===hubWeek?"selected":""}>${fmtMD(m)} – ${fmtMD(e)}</option>`; }).join("");
  return `
  <div class="hub">
    <div class="hub-head">
      <div><h1>${greet}, ${first} <span class="wave" aria-hidden="true">👋</span></h1><div class="sub">Here's what's happening across your hub today.</div></div>
      <div class="hub-date">${now.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div>
    </div>

    <div class="hub-main">
      <div class="hub-stats">
        ${stat({title:"Pending Tasks", i:"tasks", body:`<span class="v">${HUB.tasks.length}</span><span class="vt">items waiting for you</span>`, foot:viewAll('data-hscroll="hubTasks"')})}
        ${stat({title:"Courses Due", i:"cap", badge:0, body:`<span class="vl">${ic("okc","width:16px;height:16px")}No courses due</span>`, foot:viewAll('data-hubtoast="Courses"')})}
        ${stat({title:"Leave Requests", i:"leave", badge:0, body:`<span class="vl">${ic("cal","width:16px;height:16px")}days remaining this year</span>`, foot:viewAll('data-hubtoast="Leave"')})}
      </div>

      <div class="hub-mid">
        <div class="card hsec hact">
          <div class="hsec-h">${ic("trend","width:20px;height:20px")}<div><h2>Your Activity</h2><div class="hsub">Hubstaff working activity</div></div>
            <label class="hsel"><select id="hubWeek" aria-label="Week">${weeks}</select></label></div>
          <div class="hsec-b">${activityChart(hubWeek)}</div>
        </div>
        <div class="card hsec hlinks">
          <div class="hsec-h">${ic("bolt","width:20px;height:20px")}<div><h2>Quick Links</h2><div class="hsub">Access your most used tools</div></div></div>
          <div class="hsec-b">${HUB.links.map(([t,s,i,tone])=>`<button class="qlink" type="button" data-hubtoast="${t}"><span class="hi q-${tone}">${ic(i,"width:16px;height:16px")}</span><span class="ht"><b>${t}</b><small>${s}</small></span><span class="hchev">${ic("chev","width:16px;height:16px")}</span></button>`).join("")}</div>
        </div>
      </div>

      <div class="hub-low">
        <div class="card hsec" id="hubTasks">
          <div class="hsec-h">${ic("tasks","width:20px;height:20px")}<h2>Pending Tasks</h2><span class="hcount amber">${HUB.tasks.length}</span></div>
          <div class="hsec-b">${HUB.tasks.map(x=>`<button class="htask" type="button" data-hubtoast="${esc(x.t)}"><span class="hi">${ic(x.i,"width:15px;height:15px")}</span><span class="ht"><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span></button>`).join("")}
            <button class="hlink strong" type="button" data-hubtoast="My Workspace">Go To My Workspace ${ic("arrow","width:14px;height:14px")}</button></div>
        </div>
        <div class="card hsec">
          <div class="hsec-h">${ic("mega","width:20px;height:20px")}<h2>Recent Announcements</h2><span class="hcount green">0</span>${viewAll('data-hubtoast="Announcements"')}</div>
          <div class="hsec-b"><p class="hnone">Nothing new to read.</p></div>
        </div>
        <div class="card hsec">
          <div class="hsec-h">${ic("event","width:20px;height:20px")}<h2>Upcoming Events</h2>${viewAll('data-hubtoast="Events"')}</div>
          <div class="hsec-b"><p class="hnone">Nothing coming up in the next few weeks.</p></div>
        </div>
      </div>
    </div>

  </div>`;
};

/* dashboard events (delegated) */
document.addEventListener("click", e=>{
  const t=e.target, cl=s=>t.closest&&t.closest(s);
  const ht=cl("[data-hubtoast]"); if (ht){ hubToast(ht.dataset.hubtoast); return; }
  const hs=cl("[data-hscroll]"); if (hs){ const n=$("#"+hs.dataset.hscroll); if(n) n.scrollIntoView({behavior:RM?"auto":"smooth",block:"center"}); return; }
});
let hubCompact=compactChart(); window.addEventListener("resize",()=>{ const c=compactChart(); if(c!==hubCompact){ hubCompact=c; if(parse().view==="home") render(true); } });
document.addEventListener("change", e=>{
  if (e.target.id==="hubWeek"){ hubWeek=+e.target.value; render(true); }
});
