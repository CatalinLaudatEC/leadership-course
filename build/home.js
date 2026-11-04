/* ============================================================ HUB DASHBOARD (front page) ============================================================
   The Overview, laid out like The Hub's dashboard (hub.eracore.com/home) so the course can be seen in its future home.
   Hub-only data (tasks, quick links, activity, leave) is the demo content from The Hub screenshot; the course feeds
   Courses Due, its own pending tasks and the upcoming events. Hub-only links show a toast instead of leaving the page. */
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
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'
});

const HUB = {
  tasks: [
    {t:"Upload your government ID", s:"Required for verification", i:"idcard", tone:"blue"},
    {t:"AI Innovation", s:"Needs volunteers", i:"bulb", tone:"purple"}
  ],
  links: [
    ["My Workspace","View your tasks and projects","layout","blue"],
    ["My Profile","Update your information","user","teal"],
    ["Company Policies","View all company policies","gavel","amber"],
    ["My Documents","Your files and signed forms","doc","green"],
    ["Org Chart","Explore your team","org","purple"]
  ],
  clocks: [
    ["Adriatic BIM (EU)","Europe/Zagreb"], ["Egypt","Africa/Cairo"], ["India","Asia/Kolkata"], ["LATAM","America/Mexico_City"],
    ["MENA","Asia/Dubai"], ["Pakistan","Asia/Karachi"], ["Romania","Europe/Bucharest"], ["Ukraine","Europe/Kyiv"]
  ],
  /* Hubstaff activity %, Mon..Sun, newest week first (sample data) */
  activity: [[32,43,null,null,null,null,null],[61,68,57,72,64,null,null],[55,63,70,58,49,null,null],[66,59,62,71,60,22,null]]
};
let hubWeek = 0, hubMore = false;

const dayStart = d => { const x=new Date(d); x.setHours(0,0,0,0); return x; };
const weekMonday = off => { const t=dayStart(new Date()), dow=(t.getDay()+6)%7; t.setDate(t.getDate()-dow-7*off); return t; };
const fmtMD = d => d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
const hubToast = name => toast(`${name} lives in The Hub — not part of this course demo`, "link");

/* ---------- activity chart ---------- */
const compactChart = () => matchMedia("(max-width:600px)").matches;
function activityChart(off){
  const sm=compactChart(), W=sm?400:720, H=sm?250:318, l=sm?30:38, r=sm?10:14, t=16, b=34, cw=(W-l-r)/6, ch=H-t-b;
  const mon=weekMonday(off), today=dayStart(new Date()), raw=HUB.activity[off]||[];
  const days=[...Array(7)].map((_,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return d; });
  const vals=days.map((d,i)=> d>today ? null : (raw[i]??null));
  const X=i=>l+i*cw, Y=v=>t+ch-(v/100)*ch;
  let grid=""; for(let v=0; v<=100; v+=20) grid+=`<line x1="${l}" x2="${W-r}" y1="${Y(v)}" y2="${Y(v)}" class="${v?"gl":"base"}"/><text x="${l-8}" y="${Y(v)+4}" text-anchor="end" class="ax">${v}</text>`;
  const xl=days.map((d,i)=>`<text x="${X(i)}" y="${H-10}" text-anchor="${i===0?"start":i===6?"end":"middle"}" class="ax ${+d===+today?"now":""}">${sm?d.toLocaleDateString("en-US",{weekday:"narrow"}):d.toLocaleDateString("en-US",{weekday:"short"})+" "+d.getDate()}</text>`).join("");
  /* contiguous runs of tracked days become separate areas */
  const runs=[]; let cur=[]; vals.forEach((v,i)=>{ if(v==null){ if(cur.length) runs.push(cur); cur=[]; } else cur.push(i); }); if(cur.length) runs.push(cur);
  const areas=runs.map(run=>{ const pts=run.map(i=>`${X(i)},${Y(vals[i])}`).join(" ");
    return `<polygon class="area" points="${X(run[0])},${Y(0)} ${pts} ${X(run[run.length-1])},${Y(0)}"/><polyline class="line" pathLength="1" points="${pts}"/>`; }).join("");
  const dots=vals.map((v,i)=> v==null?"":`<circle class="pt" cx="${X(i)}" cy="${Y(v)}" r="5" tabindex="0" data-tip="<b>${days[i].toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</b>${v}% activity"/>`).join("");
  const ti=days.findIndex(d=>+d===+today);
  const nowLine=ti>=0?`<line class="nowl" x1="${X(ti)}" x2="${X(ti)}" y1="${t}" y2="${Y(0)}"/><text class="nowt" x="${X(ti)}" y="${t-2}" text-anchor="middle">Today</text>`:"";
  return `<svg class="actchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Activity for the week of ${fmtMD(mon)}">
    <defs><linearGradient id="actg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--blue-strong)" stop-opacity=".55"/><stop offset="1" stop-color="var(--blue-strong)" stop-opacity="0"/></linearGradient></defs>
    ${grid}${nowLine}${areas}${dots}${xl}</svg>`;
}
function activityStats(off){ const mon=weekMonday(off), today=dayStart(new Date());
  const v=(HUB.activity[off]||[]).filter((x,i)=>{ const d=new Date(mon); d.setDate(mon.getDate()+i); return x!=null && d<=today; });
  return {n:v.length, avg:v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0, peak:v.length?Math.max(...v):0}; }

/* ---------- world clock ---------- */
function tzParts(tz){ const p={}; new Intl.DateTimeFormat("en-US",{timeZone:tz,hour:"numeric",minute:"numeric",second:"numeric",hourCycle:"h23",weekday:"short",day:"numeric",month:"short"}).formatToParts(new Date()).forEach(x=>p[x.type]=x.value); return {h:+p.hour%24,m:+p.minute,s:+p.second,date:`${p.weekday} ${p.day} ${p.month}`}; }
function clockText(h,m){ const mm=String(m).padStart(2,"0"); return S.ui.h24 ? `${String(h).padStart(2,"0")}:${mm}` : `${h%12||12}:${mm}<small>${h<12?"AM":"PM"}</small>`; }
function clockFace(){ let ticks=""; for(let i=0;i<12;i++){ const a=i*30*Math.PI/180, r1=i%3?27:25, r2=29.5; ticks+=`<line x1="${32+r1*Math.sin(a)}" y1="${32-r1*Math.cos(a)}" x2="${32+r2*Math.sin(a)}" y2="${32-r2*Math.cos(a)}" class="${i%3?"tk":"tk q"}"/>`; }
  return `<svg class="face" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="31" class="rim"/>${ticks}<line class="hh" x1="32" y1="32" x2="32" y2="17"/><line class="mh" x1="32" y1="32" x2="32" y2="9"/><line class="sh" x1="32" y1="38" x2="32" y2="7"/><circle cx="32" cy="32" r="2.6" class="hub-dot"/></svg>`; }
function tickClocks(){ const box=$("#wclocks"); if(!box) return;
  box.querySelectorAll(".wclock").forEach(el=>{ const {h,m,s,date}=tzParts(el.dataset.tz);
    const set=(sel,deg)=>{ const n=el.querySelector(sel); if(n) n.setAttribute("transform",`rotate(${deg} 32 32)`); };
    set(".hh",(h%12)*30+m*.5); set(".mh",m*6+s*.1); set(".sh",s*6);
    const night=h<6||h>=19; el.classList.toggle("night",night);
    el.querySelector(".tm").innerHTML=clockText(h,m); el.querySelector(".dt").textContent=date;
    el.querySelector(".wc-p").innerHTML=ic(night?"moon":"sun","width:13px;height:13px"); });
}
setInterval(tickClocks, 1000);

/* ---------- course feed ---------- */
function courseTasks(){
  const nx=upNext()[0], list=[];
  if (nx) list.push({t:`Continue: ${nx.id}. ${nx.title}`, s:`${nx.weekLabel} · ${nx.theme}`, h:`#/c/${nx.id}`, i:"play", tone:"blue"});
  attention().forEach(a=>list.push({t:a.t, s:a.s, h:a.h, i:"alert", tone:a.chip[1]==="bad"?"red":"amber", chip:a.chip}));
  return list;
}
function courseEvents(){
  const start=dayStart(new Date(S.profile.start)), at=(w,d)=>{ const x=new Date(start); x.setDate(start.getDate()+(w-1)*7+d); return x; };
  const today=dayStart(new Date());
  return [
    {d:at(6,4), t:"Phase 1 checkpoint", s:"Team workflow scenario test · end of Week 6", h:"#/checkpoint", tone:"amber"},
    {d:at(7,0), t:"Phase 2 begins", s:"Facing the client · leading people", h:"#/map?f=p2", tone:"blue"},
    {d:at(10,4), t:"Final assessment", s:"Three live tasks, mentor present as observer", h:"#/record", tone:"green"}
  ].filter(e=>e.d>=today).map(e=>({...e, days:Math.round((e.d-today)/864e5)}));
}

/* ---------- view ---------- */
V.home = () => {
  const now=new Date(), hr=now.getHours(), greet=hr<12?"Good morning":hr<18?"Good afternoon":"Good evening";
  const first=esc((S.profile.name||"there").split(" ")[0]);
  const done=C.filter(c=>status(c.id)==="done").length, wk=weekNow();
  const ct=courseTasks(), total=HUB.tasks.length+ct.length, ev=courseEvents(), st=activityStats(hubWeek);
  const shown=hubMore?ct:ct.slice(0,2);
  const stat=(o)=>`<div class="card hstat ${o.cls||""}"><div class="hs-h"><span class="tile t-${o.tone}">${ic(o.i)}</span><h2>${o.title}</h2><span class="hcount ${o.badgeTone||""}">${o.badge}</span></div>
      <div class="hs-b">${o.body}</div><div class="hs-f">${o.foot}</div></div>`;
  const row=(x,attrs)=>`<${x.h?"a":"button"} class="htask" ${x.h?`href="${x.h}"`:`type="button" data-hubtoast="${esc(x.t)}"`} ${attrs||""}><span class="hi t-${x.tone}">${ic(x.i,"width:17px;height:17px")}</span><span class="ht"><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span>${x.chip?`<span class="chip ${x.chip[1]}">${x.chip[0]}</span>`:""}<span class="hchev">${ic("chev","width:15px;height:15px")}</span></${x.h?"a":"button"}>`;
  const weeks=HUB.activity.map((_,o)=>{ const m=weekMonday(o), e=new Date(m); e.setDate(m.getDate()+6); return `<option value="${o}" ${o===hubWeek?"selected":""}>${fmtMD(m)} – ${fmtMD(e)}</option>`; }).join("");
  queueMicrotask(tickClocks);
  return `
  <div class="hub">
    <div class="hub-head">
      <div><h1>${greet}, ${first} <span class="wave" aria-hidden="true">👋</span></h1><div class="sub">Here's what's happening across your hub today.</div></div>
      <div class="hub-date">${ic("cal","width:16px;height:16px")}<span>${now.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</span></div>
    </div>

    <div class="hub-main">
      <div class="hub-stats">
        ${stat({title:"Pending Tasks", i:"tasks", tone:"blue", badge:total, badgeTone:total?"amber":"", body:`<div class="v">${total}</div><div class="vt">items waiting for you</div><div class="hsplit" aria-hidden="true"><i style="flex:${HUB.tasks.length}"></i><i style="flex:${ct.length}"></i></div><div class="vs hlegend"><span><i class="lg-a"></i>${HUB.tasks.length} from The Hub</span><span><i class="lg-b"></i>${ct.length} from your program</span></div>`,
          foot:`<button class="hlink" type="button" data-hscroll="hubTasks">View All ${ic("arrow","width:15px;height:15px")}</button>`})}
        ${stat({title:"Courses Due", i:"cap", tone:"purple", badge:1, badgeTone:"blue", body:`<div class="v">1</div><div class="vt">course in progress</div>
            <a class="hcourse" href="#/map"><span><b>Team Leader Raising Program</b><small>Week ${wk} of 10 · ${done}/15 signed off</small></span><span class="pbar green"><i style="width:${done/15*100}%"></i></span></a>`,
          foot:`<a class="hlink" href="#/map">View All ${ic("arrow","width:15px;height:15px")}</a>`})}
        ${stat({title:"Leave Requests", i:"leave", tone:"green", badge:0, badgeTone:"green", body:`<div class="v na" data-tip="Leave balance comes from The Hub">N/A</div><div class="vt">days remaining this year</div><div class="vs">No requests pending</div>`,
          foot:`<button class="hlink" type="button" data-hubtoast="Leave">View All ${ic("arrow","width:15px;height:15px")}</button>`})}
      </div>

      <div class="hub-mid">
        <div class="card hact">
          <div class="card-h"><span class="tile sm t-blue">${ic("trend")}</span><div><h2>Your Activity</h2><div class="muted small">Hubstaff working activity</div></div>
            <div class="r"><label class="hsel">${ic("cal","width:15px;height:15px")}<select id="hubWeek" aria-label="Week">${weeks}</select></label></div></div>
          <div class="hact-stats"><span><b>${st.n?st.avg+"%":"—"}</b>average</span><span><b>${st.n?st.peak+"%":"—"}</b>peak day</span><span><b>${st.n}</b>day${st.n===1?"":"s"} tracked</span><span class="chip">Sample data</span></div>
          ${activityChart(hubWeek)}
        </div>
        <div class="card hlinks">
          <div class="card-h"><span class="tile sm t-amber">${ic("bolt")}</span><div><h2>Quick Links</h2><div class="muted small">Access your most used tools</div></div></div>
          <a class="qlink" href="#/map"><span class="hi t-blue">${ic("cap","width:17px;height:17px")}</span><span class="ht"><b>My Learning</b><small>Team Leader Raising Program</small></span><span class="hchev">${ic("chev","width:15px;height:15px")}</span></a>
          ${HUB.links.map(([t,s,i,tone])=>`<button class="qlink" type="button" data-hubtoast="${t}"><span class="hi t-${tone}">${ic(i,"width:17px;height:17px")}</span><span class="ht"><b>${t}</b><small>${s}</small></span><span class="hchev">${ic("chev","width:15px;height:15px")}</span></button>`).join("")}
        </div>
      </div>

      <div class="hub-low">
        <div class="card hlist" id="hubTasks">
          <div class="card-h"><span class="tile sm t-blue">${ic("tasks")}</span><h2>Pending Tasks</h2><div class="r"><span class="hcount ${total?"amber":""}">${total}</span></div></div>
          <div class="hgroup">The Hub</div>
          ${HUB.tasks.map(x=>row(x)).join("")}
          ${ct.length?`<div class="hgroup">Team Leader Raising Program</div>${shown.map(x=>row(x)).join("")}
            ${ct.length>2?`<button class="hmore" type="button" data-hubmore aria-expanded="${hubMore}">${hubMore?"Show fewer":`Show ${ct.length-2} more`}${ic("chev",`width:14px;height:14px;transform:rotate(${hubMore?-90:90}deg)`)}</button>`:""}`:""}
          <div class="hl-f"><button class="hlink" type="button" data-hubtoast="My Workspace">Go To My Workspace ${ic("arrow","width:15px;height:15px")}</button></div>
        </div>
        <div class="card hlist">
          <div class="card-h"><span class="tile sm t-purple">${ic("mega")}</span><h2>Recent Announcements</h2><div class="r"><span class="hcount green">0</span></div></div>
          <div class="hempty"><span class="he-ic">${ic("mega")}</span><b>Nothing new to read.</b><small>You're all caught up.</small></div>
          <div class="hl-f"><button class="hlink" type="button" data-hubtoast="Announcements">View All ${ic("arrow","width:15px;height:15px")}</button></div>
        </div>
        <div class="card hlist">
          <div class="card-h"><span class="tile sm t-teal">${ic("event")}</span><h2>Upcoming Events</h2><div class="r"><span class="hcount blue">${ev.length}</span></div></div>
          ${ev.length?ev.map(e=>`<a class="hevent" href="${e.h}"><span class="hdate t-${e.tone}"><small>${e.d.toLocaleDateString("en-US",{month:"short"})}</small><b>${e.d.getDate()}</b></span><span class="ht"><b>${esc(e.t)}</b><small>${esc(e.s)}</small></span><span class="chip ${e.days<=7?"warn":""}">${e.days===0?"Today":e.days===1?"Tomorrow":`In ${e.days} days`}</span></a>`).join("")
            :`<div class="hempty"><span class="he-ic">${ic("event")}</span><b>Nothing coming up in the next few weeks.</b><small>Program milestones appear here.</small></div>`}
          <div class="hl-f"><a class="hlink" href="#/map">View All ${ic("arrow","width:15px;height:15px")}</a></div>
        </div>
      </div>
    </div>

    <aside class="card hub-clock" aria-label="World clock">
      <div class="hc-h"><span class="tile sm t-blue">${ic("globe")}</span><div><h2>World Clock</h2><div class="muted small">Local time across our regions</div></div>
        <div class="toggle hc-fmt" role="group" aria-label="Time format"><button type="button" data-h24="0" aria-pressed="${!S.ui.h24}">12h</button><button type="button" data-h24="1" aria-pressed="${!!S.ui.h24}">24h</button></div></div>
      <div class="wclocks" id="wclocks">${HUB.clocks.map(([n,tz])=>`<div class="wclock" data-tz="${tz}" title="${tz.replace("_"," ")}"><div class="wc-n">${esc(n)}<span class="wc-p"></span></div>${clockFace()}<div class="tm"></div><div class="dt"></div></div>`).join("")}</div>
    </aside>
  </div>`;
};

/* dashboard events (delegated; the router re-renders on state changes) */
document.addEventListener("click", e=>{
  const t=e.target, cl=s=>t.closest&&t.closest(s);
  const ht=cl("[data-hubtoast]"); if (ht){ hubToast(ht.dataset.hubtoast); return; }
  const hs=cl("[data-hscroll]"); if (hs){ const n=$("#"+hs.dataset.hscroll); if(n) n.scrollIntoView({behavior:RM?"auto":"smooth",block:"center"}); return; }
  if (cl("[data-hubmore]")){ hubMore=!hubMore; render(true); return; }
  const f=cl("[data-h24]"); if (f){ S.ui.h24=f.dataset.h24==="1"; save(); $$(".hc-fmt button").forEach(b=>b.setAttribute("aria-pressed",String(b===f))); tickClocks(); return; }
});
/* the chart switches to its compact layout when the window crosses the phone breakpoint */
let hubCompact=compactChart(); window.addEventListener("resize",()=>{ const c=compactChart(); if(c!==hubCompact){ hubCompact=c; if(parse().view==="home") render(true); } });
document.addEventListener("change", e=>{ if (e.target.id==="hubWeek"){ hubWeek=+e.target.value; render(true); } });
