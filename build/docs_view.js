/* ============================================================ DOCUMENTS ============================================================ */
const DOC_META = {
  program:{name:"Team Leader Raising Program",short:"Program",icon:"book",desc:"The 10-week program: phases, weeks, all 15 competencies, checkpoint and final sign-off"},
  workflow:{name:"Team Communication Workflow",short:"Workflow",icon:"flow",desc:"The daily operating rhythm: 8 phases, escalation path and guidance for leads"},
  standards:{name:"Technical Standards & Preferences Form",short:"Standards form",icon:"form",desc:"The client's requirements: fill, spacing, routing, bends, fittings, below-grade"},
  candidate:{name:"Scenario Test — Candidate",short:"Scenario test",icon:"check",desc:"Phase 1 checkpoint: ten situations, open book, answered in writing"},
  mentor:{name:"Scenario Test — Mentor",short:"Mentor marking",icon:"shield",desc:"Required elements, wrong turns, marking scale, score sheet and outcome",mentor:true}
};
const DOC_KEYS = Object.keys(DOC_META);
const SEC_TEXT = {};
DOC_KEYS.forEach(k=>{ SEC_TEXT[k]={}; DOCS[k].sections.forEach(s=>{
  SEC_TEXT[k][s.id] = (s.kicker+" "+s.title+" "+(s.meta||[]).join(" ")+" "+JSON.stringify(s.blocks).replace(/"(id|t|k|ph|which)":"[^"]*"/g,"").replace(/[{}\[\]",:]|true|false|null/g," ")).toLowerCase().replace(/\s+/g," ");
});});
const wordCount = k => Object.values(SEC_TEXT[k]).join(" ").split(" ").length;
const PROG_SEC = {};
DOCS.program.sections.forEach(s=>s.blocks.forEach(b=>{ if(b.t==="sub"&&b.num) PROG_SEC[b.num]=s.id; }));
const SCN_SEC = { candidate:{}, mentor:{} };
["candidate","mentor"].forEach(k=>DOCS[k].sections.forEach(s=>{ if(s.num) SCN_SEC[k][s.num]=s.id; }));

/* standards widgets index (for answered counts, gaps and PM questions) */
const STD_W = [];
DOCS.standards.sections.forEach(s=>{ let head="";
  s.blocks.forEach(b=>{
    if (b.t==="head") head=b.text.replace(/:$/,"");
    if (b.t==="yesno") STD_W.push({id:b.id,sec:s.id,secTitle:s.title,label:b.label||"Yes / No",kind:"yesno"});
    if (b.t==="table") STD_W.push({id:b.id,sec:s.id,secTitle:s.title,label:head,kind:"table",b});
    if (b.t==="notes" && b.label && !/remarks/i.test(b.label)) STD_W.push({id:b.id,sec:s.id,secTitle:s.title,label:b.label,kind:"notes"});
  });});
function stdAnswered(w){
  if (w.kind==="yesno") return !!S.inp[w.id];
  if (w.kind==="notes") return !!(S.inp[w.id]||"").trim();
  return w.b.rows.some((r,ri)=>r.some((c,ci)=> c.k==="check"?!!S.inp[c.id] : c.k==="input"?!!(S.inp[c.id]||"").trim() : (S.inp[`${w.id}-${ri}-${ci}`]!=null)));
}
const gapsList = () => STD_W.filter(w=>S.gap[w.id]).map(w=>({sec:w.secTitle,q:w.label}));

/* reading progress */
const readOf = k => DOCS[k].sections.filter(s=>(S.read[k]||{})[s.id]).length;
const docPct = k => readOf(k)/DOCS[k].sections.length;

/* program diagram (the image in the program document, rebuilt as data) */
const DIAGRAM = {
  p1:{title:"Phase 1 — weeks 1 to 6 — internal work, no client exposure",target:"Target: level 2 on every competency",
    weeks:[["Week 1 — The standards you work to","Hands in: the completed standards form and the open questions for the PM"],
      ["Week 2 — The project and the check list","Hands in: a Gantt table of drawing deliverables and the check list"],
      ["Week 3 — Does the check list actually work","Hands in: the planted-defect result and the check list it corrected"],
      ["Week 4 — Can it actually be built","Hands in: five places that are clash-free but cannot be built"],
      ["Week 5 — Running the team's work","Hands in: written daily tasks and priorities drawn from recorded meetings"],
      ["Week 6 — Load, escalation and scope","Hands in: a deadline letter, RFIs on spec differences, a change log"]],
    bg:{title:"Running in the background from Week 3",lines:["A signed check list on every release · a written decision log","Sitting in on client meetings as a listener — no speaking part yet"]}},
  cp:{title:"Checkpoint — scenario test on the Team Communication Workflow",sub:"Ten situations, open book. All ten must be answered"},
  p2:{title:"Phase 2 — weeks 7 to 10 — live project, client-facing",target:"Target: level 3, signed off as the situations come up",
    boxes:[["Facing the client","Attend → report your scope → run the meeting → own the RFI batch"],["Leading people","One-to-ones, feedback, onboarding"]]},
  legend:["Internal, controlled","Checkpoint","Client-facing, live project"]
};
/* spacing chart (the image in section 1.2 of the standards form, transcribed) */
const SPACING = {
  title:"Table 2a: Minimum Raceway Spacing",
  caption:"Distance Between Centers in Inches at Junction and Pull Boxes (Allows Approximately ¼-inch Spacing Between Locknuts)",
  sizes:["½","¾","1","1¼","1½","2","2½","3","3½","4","5","6"],
  v:[["1⅜"],["1½","1¾"],["1¾","1⅞","2⅛"],["2","2⅛","2⅜","2⅝"],["2⅛","2¼","2½","2¾","2⅞"],["2⅜","2⅝","2¾","3","3⅛","3½"],
     ["2⅝","2¾","3","3¼","3⅜","3⅝","3⅞"],["3","3⅛","3¼","3½","3¾","4","4⅛","4½"],["3¼","3⅜","3⅝","3⅞","4","4¼","4½","4¾","5⅛"],
     ["3½","3⅝","3⅞","4⅛","4¼","4½","4¾","5⅛","5⅜","5⅝"],["4⅛","4⅜","4½","4¾","4⅞","5¼","5⅜","5¾","6","6¼","7"],
     ["4¾","5","5⅛","5⅜","5½","5⅞","6","6⅜","6⅝","6⅞","7⅝","8¼"]]
};
const fracVal = s => { const m={"⅛":.125,"¼":.25,"⅜":.375,"½":.5,"⅝":.625,"¾":.75,"⅞":.875}; let n=parseFloat(s)||0; const f=[...s].find(c=>m[c]); return (isNaN(parseFloat(s))?0:n)+(f?m[f]:0); };
let spA=5, spB=3;

/* ---------- inline text ---------- */
const segsHtml = segs => (segs||[]).map(([t,b,i])=>{ let h=esc(t); if(i) h=`<em>${h}</em>`; if(b) h=`<strong>${h}</strong>`; return h; }).join("");
const leadPara = segs => segs.length>1 && segs[0][1] && /\.\s*$/.test(segs[0][0]) ? `<p class="leadp"><strong>${esc(segs[0][0])}</strong> ${segsHtml(segs.slice(1))}</p>` : `<p>${segsHtml(segs)}</p>`;
const docHref = name => /workflow/i.test(name) ? "#/doc/workflow" : /standards/i.test(name) ? "#/doc/standards" : null;

/* ---------- block renderers ---------- */
let docOpen = {}, docQ = {}, wfEng = false, pendingScroll = null;

function renderBlocks(blocks, ctx){ return blocks.map(b=>renderBlock(b,ctx)).join(""); }
function renderBlock(b, ctx){
  const k=ctx.key;
  switch(b.t){
    case "p": return leadPara(b.segs);
    case "note": return `<p class="dnote">${ic("book","width:15px;height:15px")}<em>${esc(b.text)}</em></p>`;
    case "head": return `<h3 class="dhead">${esc(b.text)}</h3>`;
    case "bullets": return `<ul class="dbul">${b.items.map(s=>`<li>${segsHtml(s)}</li>`).join("")}</ul>`;
    case "callout": {
      const bonus = k==="candidate" && /^Bonus/.test(((b.blocks[0]||{}).segs||[[""]])[0][0]);
      return `<div class="callout">${renderBlocks(b.blocks,ctx)}</div>${bonus?`<label class="q-label" for="bonusAns">Your proposal</label><textarea id="bonusAns" data-ans="bonus" data-k="0" ${isMentor()?"readonly":""} placeholder="Name what the workflow does not cover, and the phase it belongs to">${esc((S.answers.bonus||[])[0]||"")}</textarea>`:""}`;
    }
    case "fields": return `<div class="fields">${b.items.map(f=>fieldHtml(f,ctx)).join("")}</div>`;
    case "levels": return `<div class="lvlcards">${b.items.map(([c,n,t],i)=>`<div class="lvlcard ${i===2?"target":""}"><span class="c">${c}</span><div><b>${esc(n)}</b><div class="muted small">${esc(t)}</div>${i===2?`<span class="chip done" style="margin-top:6px">Target for sign-off</span>`:""}</div></div>`).join("")}</div>`;
    case "sub": {
      if (!b.num) return `<div class="subhead also"><span class="n">${ic("book","width:18px;height:18px")}</span><div><div class="kick">${esc(b.kicker)}</div><h3>${esc(b.title)}</h3></div>${docHref(b.title)?`<a class="btn out sm" href="${docHref(b.title)}">Open document</a>`:""}</div>`;
      return `<div class="subhead" id="comp-${b.num}"><span class="n ${status(b.num)}">${b.num}</span><div style="flex:1;min-width:0"><div class="kick">Competency ${b.num}</div><h3>${esc(b.title)}</h3></div>${statusChip(b.num)}<a class="btn out sm" href="#/c/${b.num}">Open competency</a></div>`;
    }
    case "def": return defHtml(b,ctx);
    case "table": return tableHtml(b,ctx);
    case "yesno": return yesnoHtml(b,ctx);
    case "notes": return `<div class="notes"><label class="f" for="${b.id}">${esc(b.label||"Notes")}</label><textarea id="${b.id}" data-inp="${b.id}" rows="${Math.max(2,b.lines)}" placeholder="${/specify|identify|list/i.test(b.label||"")?"Specify":"Notes / remarks"}" style="min-height:${40+b.lines*14}px">${esc(S.inp[b.id]||"")}</textarea></div>`;
    case "image": return b.which==="program-diagram" ? diagramHtml() : spacingHtml();
  }
  return "";
}
function fieldHtml(f, ctx){
  const L=f.label;
  if (/out of ten/i.test(L)) { const n=SC.filter(s=>(S.marks[s.id]||{}).ok).length; return `<div><label class="f">${esc(L)}</label><div class="fieldval"><b>${n}</b> / 10 <span class="muted small">from the score sheet</span></div></div>`; }
  const date = /\bdate\b|\bon$/i.test(L);
  const def = /^Candidate Name/.test(L) ? S.profile.name : /^Mentor Name/.test(L) ? S.profile.mentor : /^Start Date/.test(L) ? S.profile.start : "";
  const v = S.inp[f.id]!=null ? S.inp[f.id] : def;
  return `<div><label class="f" for="${f.id}">${esc(L)}</label><input id="${f.id}" type="${date?"date":"text"}" data-inp="${f.id}" value="${esc(v)}"></div>`;
}
function w1Bar(id){
  if (S.ui.w1===false) return "";
  return `<div class="w1"><span class="w1t">${ic("form","width:14px;height:14px")}Week 1 task</span>
    <input type="text" data-src="${id}" value="${esc(S.src[id]||"")}" placeholder="Source: spec §, BEP, sheet, RFI" aria-label="Source">
    <select data-comp="${id}" aria-label="Model complies"><option value="">Model complies?</option>${["Yes","No","Not checked"].map(o=>`<option ${S.comp[id]===o?"selected":""}>${o}</option>`).join("")}</select>
    <button class="gapbtn" data-gap="${id}" aria-pressed="${!!S.gap[id]}">${S.gap[id]?"Gap · question for PM":"Mark as gap"}</button></div>`;
}
function yesnoHtml(b){
  const v=S.inp[b.id];
  return `<div class="yn ${S.gap[b.id]?"isgap":""}"><div class="yn-row"><div class="ynq">${esc(b.label||"Yes / No")}${b.ref==="chart"?` <span class="muted small">(chart above)</span>`:""}</div>
    <div class="toggle yn-t" role="group" aria-label="Yes or no"><button type="button" data-yn="${b.id}" data-v="Yes" aria-pressed="${v==="Yes"}">Yes</button><button type="button" data-yn="${b.id}" data-v="No" aria-pressed="${v==="No"}">No</button></div></div>
    ${b.extra?`<textarea data-inp="${b.id}-x" placeholder="${/specify/i.test(b.label||"")?"If yes, specify":"Details"}" style="min-height:56px;margin-top:8px">${esc(S.inp[b.id+"-x"]||"")}</textarea>`:""}
    ${w1Bar(b.id)}</div>`;
}

const DEF_STYLE = {
  "Purpose":"lede","Uses":"uses","What good looks like":"good","Common failures":"bad","Practice task":"task","Sign-off":"sign",
  "Situation":"situation","Questions":"questions","Required elements":"req","Wrong turns":"wrong"
};
function defHtml(b, ctx){
  const k=ctx.key;
  if (k==="workflow") return `<div class="rules">${b.rows.map(r=>`<div class="rule"><h3>${esc(r.label)}</h3>${r.blocks.map(x=>x.t==="bullets"?`<ul>${x.items.map(s=>`<li><span style="color:var(--text)">${segsHtml(s)}</span></li>`).join("")}</ul>`:renderBlock(x,ctx)).join("")}</div>`).join("")}</div>`;
  return `<div class="dl">${b.rows.map(r=>{ const st=DEF_STYLE[r.label]; let body="";
    const bl=r.blocks;
    if (st==="lede") body=`<div class="lede" style="color:var(--text)">${renderBlocks(bl,ctx)}</div>`;
    else if (st==="uses") body=bl.map(x=>{ const name=(x.segs||[]).map(s=>s[0]).join(""); const h=docHref(name); return h?`<a class="chip progress" href="${h}">${ic("link","width:13px;height:13px")}${esc(name)}</a>`:renderBlock(x,ctx); }).join(" ");
    else if (st==="good"||st==="bad") body=`<ul class="lst">${bl.flatMap(x=>x.t==="bullets"?x.items:[x.segs]).map(s=>`<li><span class="mk ${st==="good"?"t-green":"t-red"}">${ic(st==="good"?"ok":"x")}</span><span>${segsHtml(s)}</span></li>`).join("")}</ul>`;
    else if (st==="task") body=`<div class="callout">${renderBlocks(bl,ctx)}</div>`;
    else if (st==="sign") body=`<div class="callout green">${renderBlocks(bl,ctx)}</div>`;
    else if (st==="situation") body=`<div class="callout">${renderBlocks(bl,ctx)}</div>`;
    else if (st==="questions") body=questionsHtml(bl,ctx);
    else if (st==="req") body=reqHtml(bl,ctx);
    else if (st==="wrong") body=wrongHtml(bl,ctx);
    else body=renderBlocks(bl,ctx);
    return `<div class="drow ${st||""}"><div class="dlab">${esc(r.label)}</div><div class="dval">${body}</div></div>`; }).join("")}</div>`;
}
function questionsHtml(bl, ctx){
  const n=ctx.num, qs=bl.filter(x=>x.t==="p");
  if (ctx.key==="candidate") return qs.map((q,i)=>`<div class="qa"><div class="qq">${segsHtml(q.segs)}</div><textarea data-ans="${n}" data-k="${i}" ${isMentor()?"readonly":""} placeholder="${isMentor()?"No answer yet":"Write in full sentences. Name who and by when."}">${esc((S.answers[n]||[])[i]||"")}</textarea></div>`).join("");
  return qs.map((q,i)=>{ const a=(S.answers[n]||[])[i]; return `<div class="qa"><div class="qq">${segsHtml(q.segs)}</div><div class="ansbox ${a&&a.trim()?"":"empty"}"><span class="muted small">Candidate's answer</span><div>${a&&a.trim()?esc(a):"No answer yet"}</div></div></div>`; }).join("");
}
function reqHtml(bl, ctx){
  const n=ctx.num, items=bl.flatMap(x=>x.t==="bullets"?x.items:[x.segs]), el=S.elem[n]||{}, got=items.filter((_,i)=>el[i]).length;
  return `<div class="reqhead"><span class="muted small">Tick each element the answer contains</span><b class="small">${got}/${items.length}</b></div><div class="pbar ${got===items.length?"green":""}" style="margin-bottom:8px"><i style="width:${got/items.length*100}%"></i></div>
    ${items.map((s,i)=>`<label class="reqi ${el[i]?"on":""}"><input type="checkbox" data-elem="${n}:${i}" ${el[i]?"checked":""}><span>${segsHtml(s)}</span></label>`).join("")}`;
}
function wrongHtml(bl, ctx){
  const n=ctx.num, w=!!S.wrong[n], items=S.elem[n]||{}, total=(DOCS.mentor.sections.find(s=>s.num===n).blocks[0].rows.find(r=>r.label==="Required elements").blocks.flatMap(x=>x.t==="bullets"?x.items:[x.segs])).length;
  const got=Object.values(items).filter(Boolean).length, m=S.marks[n]||{};
  const verdict = w ? ["Wrong turn","bad","Mark incomplete and discuss it directly."] : got===total ? ["All elements present","done","Every required element is there — mark it Complete."] : ["Incomplete","warn",`${total-got} required element${total-got>1?"s":""} missing.`];
  return `<div class="callout amber">${renderBlocks(bl,ctx)}</div>
    <div class="frow" style="margin-top:10px;align-items:center"><button class="gapbtn" data-wrong="${n}" aria-pressed="${w}" style="flex:0 0 auto">${w?"Wrong turn spotted":"Flag a wrong turn"}</button><span class="chip ${verdict[1]}" style="flex:0 0 auto">${verdict[0]}</span><span class="muted small" style="flex:1">${verdict[2]}</span></div>
    <div class="mark"><label style="display:flex;gap:8px;align-items:center;font-weight:600;flex:0 0 auto"><input type="checkbox" data-mark="${n}" ${m.ok?"checked":""}> Complete</label><textarea data-mnote="${n}" placeholder="Notes for the walk-through with the candidate">${esc(m.note||"")}</textarea></div>`;
}

function tableHtml(b, ctx){
  const k=ctx.key, H=b.head, sig=H.join("|");
  const cellTxt = c => c.k==="text" ? (c.blocks ? renderBlocks(c.blocks,ctx) : segsHtml(c.segs)) : "";
  let head=`<thead><tr>${H.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead>`, rows="";
  if (sig==="Document|What it is|Used in") rows=b.rows.map(r=>{ const nm=r[0].text, h=docHref(nm); return `<tr><td>${h?`<a class="link" href="${h}">${esc(nm)}</a>`:`<b>${esc(nm)}</b>`}</td><td>${cellTxt(r[1])}</td><td class="muted">${cellTxt(r[2])}</td></tr>`; }).join("");
  else if (H.includes("Component")) rows=b.rows.map((r,i)=>`<tr><td><span class="avatar sm" style="width:30px;height:30px">${i+1}</span></td><td><b>${esc(r[1].text)}</b></td><td>${cellTxt(r[2])}</td><td><input type="checkbox" data-final="${i}" ${S.final[i]?"checked":""} ${isMentor()?"":"disabled"} aria-label="Assessed" style="accent-color:var(--green);width:18px;height:18px"></td></tr>`).join("");
  else if (H.includes("Level") && H.includes("Mentor")) rows=b.rows.map(r=>{ const id=+r[0].text, s=S.sign[id]||{}, l=lvl(id); return `<tr><td><span class="avatar sm" style="width:30px;height:30px">${id}</span></td><td><a href="#/c/${id}" style="font-weight:600">${esc(r[1].text)}</a></td><td class="muted">${esc(r[2].text)}</td>
      <td>${isMentor()?`<select data-rec="${id}" aria-label="Level" style="width:auto"><option value="">—</option>${[1,2,3,4].map(x=>`<option value="${x}" ${l===x?"selected":""}>L${x}</option>`).join("")}</select>`:(l?`<span class="chip ${l>=3?"done":"progress"}">L${l}</span>`:`<span class="muted">—</span>`)}</td><td class="muted">${esc(s.mentor||"—")}</td><td class="muted">${esc(s.date||"—")}</td></tr>`; }).join("");
  else if (sig==="#|Phase|Who drives|What it produces") rows=b.rows.map(r=>`<tr class="clickrow" data-jump="workflow:s${+r[0].text+1}" tabindex="0"><td><span class="avatar sm" style="width:30px;height:30px">${esc(r[0].text)}</span></td><td><b>${esc(r[1].text)}</b></td><td>${cellTxt(r[2])}</td><td>${cellTxt(r[3])}</td></tr>`).join("");
  else if (sig==="Situation|Goes to|By when") rows=b.rows.map(r=>{ const kx=COURSE.routes.indexOf(r[1].text); return `<tr><td>${cellTxt(r[0])}</td><td><span class="chip ${ROUTE_CLS[kx]}" style="border-color:transparent">${esc(r[1].text)}</span></td><td class="muted">${cellTxt(r[2])}</td></tr>`; }).join("");
  else if (sig==="#|Situation|Complete|Notes") rows=b.rows.map(r=>{ const n=+r[0].text, m=S.marks[n]||{}; return `<tr><td><span class="avatar sm" style="width:30px;height:30px">${n}</span></td><td><a class="link" data-jump="mentor:${SCN_SEC.mentor[n]}" href="javascript:void 0">${esc(r[1].text)}</a></td><td><input type="checkbox" data-mark="${n}" ${m.ok?"checked":""} aria-label="Complete" style="width:18px;height:18px;accent-color:var(--green)"></td><td><input type="text" data-mnote="${n}" value="${esc(m.note||"")}" placeholder="Notes"></td></tr>`; }).join("");
  else if (sig==="Result|Meaning") rows=b.rows.map(r=>{ const c={Complete:"done",Incomplete:"warn","Wrong turn":"bad",Afterwards:"progress"}[r[0].text]||""; return `<tr><td><span class="chip ${c}">${esc(r[0].text)}</span></td><td>${cellTxt(r[1])}</td></tr>`; }).join("");
  else rows=b.rows.map((r,ri)=>`<tr>${r.map((c,ci)=>{
      if (c.k==="check") return `<td class="cc"><input type="checkbox" data-chk="${c.id}" ${S.inp[c.id]?"checked":""} aria-label="${esc(H[ci])} — ${esc((r[0]||{}).text||"")}"></td>`;
      if (c.k==="input" && H[ci]==="Function") return `<td></td>`;
      if (c.k==="input") return `<td><input type="text" data-inp="${c.id}" value="${esc(S.inp[c.id]||"")}" placeholder="${esc(c.ph||"")}" aria-label="${esc(H[ci])}"></td>`;
      if (k==="standards" && /Max|Radius/.test(H[ci]) && /^[\d?]/.test(c.text)) { const id=`${b.id}-${ri}-${ci}`, v=S.inp[id]; return `<td><input type="text" class="valin ${v!=null&&v!==c.text?"changed":""}" data-inp="${id}" value="${esc(v!=null?v:c.text)}" aria-label="${esc(H[ci])}" title="Default: ${esc(c.text)}"></td>`; }
      return `<td>${cellTxt(c)}</td>`; }).join("")}</tr>`).join("");
  return `<div class="tbl-wrap dtbl"><table>${head}<tbody>${rows}</tbody></table></div>${k==="standards"?w1Bar(b.id):""}`;
}

function diagramHtml(){
  const D=DIAGRAM, wk=weekNow();
  return `<div class="diag">
    <div class="dg-phase p1"><div class="dg-h"><b>${esc(D.p1.title)}</b><span class="muted small">${esc(D.p1.target)}</span></div>
      ${D.p1.weeks.map(([t,h],i)=>`<button class="dg-week ${wk===i+1?"now":""}" data-jump="program:s${5+i}"><b>${esc(t)}</b><span>${esc(h)}</span>${wk===i+1?`<span class="chip progress">This week</span>`:""}</button>`).join("")}
      <div class="dg-bg"><b>${esc(D.p1.bg.title)}</b>${D.p1.bg.lines.map(l=>`<span>${esc(l)}</span>`).join("")}</div></div>
    <div class="dg-arrow">${ic("chev","transform:rotate(90deg)")}</div>
    <button class="dg-cp" data-jump="program:s11"><b>${esc(D.cp.title)}</b><span>${esc(D.cp.sub)}</span></button>
    <div class="dg-arrow">${ic("chev","transform:rotate(90deg)")}</div>
    <div class="dg-phase p2"><div class="dg-h"><b>${esc(D.p2.title)}</b><span class="muted small">${esc(D.p2.target)}</span></div>
      <div class="dg-boxes">${D.p2.boxes.map(([t,s],i)=>`<button class="dg-box" data-jump="program:s12"><b>${esc(t)}</b><span>${esc(s)}</span></button>`).join("")}</div></div>
    <div class="dg-leg"><span><i class="l1"></i>${D.legend[0]}</span><span><i class="l2"></i>${D.legend[1]}</span><span><i class="l3"></i>${D.legend[2]}</span></div>
    <div class="callout amber small" style="margin-top:12px">Rebuilt from the diagram image in the document. Note the diagram says the background track runs from Week 3 and lists a “planted-defect result” for Week 3, while the text says the background starts in Week 1 and the Week 3 task is five team-lead-accepted checks.</div>
  </div>`;
}
function spacingHtml(){
  const T=SPACING, a=Math.max(spA,spB), b=Math.min(spA,spB), val=T.v[a][b], mx=fracVal("8¼");
  return `<div class="spc"><div class="spc-h"><div><b>${esc(T.title)}</b><div class="muted small">${esc(T.caption)}</div></div>
    <div class="spc-calc"><label class="f">Conduit A</label><select data-sp="A">${T.sizes.map((s,i)=>`<option value="${i}" ${i===spA?"selected":""}>${s}"</option>`).join("")}</select>
      <label class="f">Conduit B</label><select data-sp="B">${T.sizes.map((s,i)=>`<option value="${i}" ${i===spB?"selected":""}>${s}"</option>`).join("")}</select>
      <div class="spc-res"><span class="muted small">Min. distance between centers</span><b>${val}"</b></div></div></div>
    <div class="tbl-wrap"><table class="spc-t"><thead><tr><th>Trade size</th>${T.sizes.map((s,i)=>`<th class="${i===b?"hl":""}">${s}</th>`).join("")}</tr></thead><tbody>
    ${T.v.map((row,ri)=>`<tr><th class="${ri===a?"hl":""}">${T.sizes[ri]}</th>${T.sizes.map((_,ci)=>{ const x=row[ci]; if(!x) return `<td></td>`; const f=fracVal(x)/mx; return `<td class="spc-c ${ri===a&&ci===b?"sel":""}" data-spc="${ri}:${ci}" style="background:color-mix(in srgb, var(--blue-strong) ${Math.round(8+f*55)}%, transparent)" title="${T.sizes[ri]}&quot; × ${T.sizes[ci]}&quot; = ${x}&quot;">${x}</td>`; }).join("")}</tr>`).join("")}
    </tbody></table></div><p class="muted small" style="margin:8px 0 0">Select two trade sizes, or click a cell. Transcribed from the chart image embedded in the form.</p></div>`;
}

/* ---------- table of contents ---------- */
function tocHtml(key, secs){
  const D=DOCS[key], read=S.read[key]||{}; let g=null, html="";
  secs.forEach(s=>{
    if (s.group && s.group!==g){ g=s.group; html+=`<div class="toc-g">${esc(g)}</div>`; }
    let extra="";
    if (key==="standards"){ const ws=STD_W.filter(w=>w.sec===s.id); extra=`<span class="toc-n">${ws.filter(stdAnswered).length}/${ws.length}</span>`; }
    if (key==="candidate" && s.num){ const st=scnState(SC.find(x=>x.id===s.num)); extra=`<span class="toc-dot ${st}"></span>`; }
    if (key==="mentor" && s.num){ extra=(S.marks[s.num]||{}).ok?`<span class="toc-dot full"></span>`:S.wrong[s.num]?`<span class="toc-dot bad"></span>`:`<span class="toc-dot none"></span>`; }
    html+=`<button class="toc-i ${read[s.id]?"read":""}" data-jump="${key}:${s.id}"><span class="toc-ck">${read[s.id]?ic("ok","width:12px;height:12px"):""}</span><span class="toc-t">${s.kicker&&key!=="standards"?`<small>${esc(s.kicker)}</small>`:""}${esc(s.title)}</span>${extra}</button>`;
  });
  return `<div class="toc-top"><b>Contents</b><span class="muted small">${readOf(key)}/${D.sections.length} read</span></div><div class="pbar green" style="margin:6px 0 10px"><i style="width:${docPct(key)*100}%"></i></div>${html}`;
}

/* ---------- return bar: back to the page that opened this document ---------- */
const retBar = () => RET ? `<a class="retbar" href="${esc(RET.h)}"><span class="rb-ic">${ic("chev","width:16px;height:16px")}</span><span class="rb-t"><small>Back to</small>${esc(RET.label)}</span>${RET.sub?`<span class="chip">${esc(RET.sub)}</span>`:""}</a>` : "";

/* ---------- doc page ---------- */
V.doc = (key, qs) => {
  const D=DOCS[key]; if(!D) return V.home();
  const M=DOC_META[key];
  if (M.mentor && !isMentor()) return `${retBar()}<div class="crumb"><a href="#/">Overview</a>${ic("chev","width:14px;height:14px")}Documents</div>
    <div class="card dochead"><div class="grad"></div><h1 class="doctitle">${esc(D.title)}</h1><div class="meta">${D.subtitle.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>
    <div class="locked">${ic("shield","width:40px;height:40px")}<h2>Mentor version — not for circulation</h2><p class="muted">It holds the required elements and wrong turns for each situation. Switch to Mentor in the profile menu to open it.</p><button class="btn" data-role="mentor">View as mentor</button>
    <p class="muted small" style="margin-top:14px">In this demo the content still ships inside the page. In production it must come from the server, only for mentors.</p></div></div>`;
  if (!docOpen[key]) docOpen[key]=new Set(["s0"]);
  if (qs && qs.sec){ docOpen[key].add(qs.sec); pendingScroll=qs.sec; }
  const q=(docQ[key]||"").trim().toLowerCase();
  let secs=D.sections;
  if (key==="workflow" && wfEng) secs=secs.filter(s=>["s0","s1","s3","s4","s5","s9"].includes(s.id));
  const vis = q ? secs.filter(s=>SEC_TEXT[key][s.id].includes(q)) : secs;
  const mins = Math.max(1,Math.round(wordCount(key)/200));
  const read=S.read[key]||{};
  let extra="";
  if (key==="workflow") extra=`<div class="card mt"><div class="card-h"><h2>The cycle at a glance</h2><div class="r"><span class="muted small">Dashed = held only when triggered · select a phase to jump to it</span></div></div>
    <div class="flow" role="group" aria-label="Phases">${COURSE.workflow.map(p=>`<button data-jump="workflow:s${p.n+1}" class="${p.n===5?"trig":""}" aria-pressed="${!!read["s"+(p.n+1)]}"><span class="c">${read["s"+(p.n+1)]?ic("ok","width:20px;height:20px"):p.n}</span><span class="p">${esc(p.p)}</span><span class="w">${esc(p.w)}</span></button>`).join("")}</div></div>`;
  if (key==="standards"){ const ans=STD_W.filter(stdAnswered).length, gaps=gapsList(), nonc=STD_W.filter(w=>S.comp[w.id]==="No").length;
    extra=`<div class="grid g-wide mt"><div class="card" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">${ring(ans/STD_W.length,"var(--blue-strong)",120,"answered")}
      <div style="flex:1;min-width:220px"><h2>${ans} of ${STD_W.length} items answered</h2><p class="muted small" style="margin:6px 0 10px">Competency 1 asks you to fill this in for your own project, cite a source for every answer, list every gap for the PM, and mark whether the model complies.</p>
      <div class="frow" style="gap:8px"><span class="chip ${nonc?"bad":""}" style="flex:0 0 auto">${nonc} non-compliant</span><span class="chip ${gaps.length?"warn":""}" style="flex:0 0 auto">${gaps.length} gaps</span>
      <button class="btn quiet sm" data-w1 style="flex:0 0 auto">${S.ui.w1===false?"Show":"Hide"} Week 1 task fields</button></div></div></div>
      <div class="card"><div class="card-h"><span class="count">${gaps.length}</span><h2>Open questions for the PM</h2></div>${gaps.length?`<ol style="margin:0;padding-left:20px">${gaps.map(g=>`<li style="margin:6px 0"><span class="muted small">${esc(g.sec)}</span><br>${esc(g.q)}</li>`).join("")}</ol><button class="btn out sm mt" id="copyGaps">Copy list</button>`:`<div class="empty">Use “Mark as gap” on any item you cannot find an answer for.</div>`}</div></div>`; }
  if (key==="candidate"){ const full=SC.filter(s=>scnState(s)==="full").length;
    extra=`<div class="card mt"><div class="card-h"><h2>Your answers</h2><div class="r"><span class="muted small">${full}/10 complete · answers save as you type</span></div></div><div class="dots big">${SC.map(s=>`<span class="${scnState(s)==="full"?"ok":scnState(s)==="part"?"part":""}" data-jump="candidate:${SCN_SEC.candidate[s.id]}" role="button" tabindex="0" title="${esc(s.title)}">${s.id}</span>`).join("")}<span class="${(S.answers.bonus||[])[0]?"ok":""}" data-jump="candidate:s11" role="button" tabindex="0" title="Bonus">★</span></div></div>`; }
  if (key==="mentor"){ const ok=SC.filter(s=>(S.marks[s.id]||{}).ok).length, wr=SC.filter(s=>S.wrong[s.id]).length;
    extra=`<div class="card mt"><div class="card-h"><h2>Marking progress</h2><div class="r"><span class="muted small">${ok}/10 complete · ${wr} wrong turn${wr===1?"":"s"}</span></div></div><div class="dots big">${SC.map(s=>`<span class="${(S.marks[s.id]||{}).ok?"ok":S.wrong[s.id]?"no":scnState(s)!=="none"?"part":""}" data-jump="mentor:${SCN_SEC.mentor[s.id]}" role="button" tabindex="0" title="${esc(s.title)}">${s.id}</span>`).join("")}</div></div>`; }

  const secHtml = s => { const open=docOpen[key].has(s.id)||!!q, idx=D.sections.indexOf(s), nxt=D.sections[idx+1];
    const ctx={key,sec:s.id,num:s.num};
    let chip="";
    if (key==="candidate"&&s.num){ const st=scnState(SC.find(x=>x.id===s.num)); chip=`<span class="chip ${st==="full"?"done":st==="part"?"warn":""}">${answeredCount(s.num)}/${SC.find(x=>x.id===s.num).questions.length} answered</span>`; }
    if (key==="mentor"&&s.num){ const m=S.marks[s.num]||{}; chip=m.ok?`<span class="chip done">Complete</span>`:S.wrong[s.num]?`<span class="chip bad">Wrong turn</span>`:`<span class="chip">Not marked</span>`; }
    if (key==="standards"){ const ws=STD_W.filter(w=>w.sec===s.id), a=ws.filter(stdAnswered).length; chip=`<span class="chip ${a===ws.length&&ws.length?"done":a?"progress":""}">${a}/${ws.length}</span>`; }
    return `<section class="dsec ${open?"open":""} ${read[s.id]?"isread":""}" id="sec-${s.id}">
      <button class="dsec-h" data-sec="${key}:${s.id}" aria-expanded="${open}">
        ${s.kicker||s.group?`<span class="kick">${esc(s.kicker||s.group)}</span>`:""}<span class="ttl">${esc(s.title)}</span>
        ${(s.meta||[]).map(m=>`<span class="chip">${esc(m)}</span>`).join("")}${chip}
        <span class="rd">${read[s.id]?ic("ok","width:14px;height:14px"):""}</span><span class="chev">${ic("chev")}</span></button>
      <div class="dsec-b">${renderBlocks(s.blocks,ctx)}
        <div class="dsec-f"><button class="btn ${read[s.id]?"quiet":"out"} sm" data-read="${key}:${s.id}">${read[s.id]?ic("ok","width:15px;height:15px")+"Read":"Mark as read"}</button>
        ${nxt?`<button class="btn sm" data-next="${key}:${s.id}:${nxt.id}">Next: ${esc(nxt.title)}${ic("chev","width:15px;height:15px")}</button>`:`<span class="muted small">End of document</span>`}</div></div></section>`; };

  return `${retBar()}
  <div class="crumb"><a href="#/">Overview</a>${ic("chev","width:14px;height:14px")}Documents${ic("chev","width:14px;height:14px")}${esc(M.name)}</div>
  <div class="card dochead"><div class="grad"></div>
    <div class="frow" style="align-items:center;gap:20px">
      <div style="flex:1 1 420px"><div class="muted small" style="font-weight:600;margin-bottom:6px">${ic(M.icon,"width:16px;height:16px;display:inline-block;vertical-align:-3px;margin-right:6px")}Document ${DOC_KEYS.indexOf(key)+1} of 5</div>
        <h1 class="doctitle">${esc(D.title)}</h1>
        <div class="meta">${D.subtitle.map(x=>`<span class="chip">${esc(x)}</span>`).join("")||`<span class="chip">${esc(M.desc)}</span>`}</div>
        <div class="docstats"><span>${ic("log","width:15px;height:15px")}${D.sections.length} sections</span><span>${ic("cal","width:15px;height:15px")}~${mins} min read</span><span>${ic("ok","width:15px;height:15px")}${readOf(key)} read</span></div></div>
      <div style="flex:0 0 auto">${ring(docPct(key),"var(--green)",112,"read")}</div></div>
    <div class="toolbar" style="margin:16px 0 0">
      <label class="search" style="flex:1 1 260px">${ic("book","width:16px;height:16px")}<input id="docSearch" type="search" placeholder="Search this document" value="${esc(docQ[key]||"")}" aria-label="Search this document"></label>
      ${q?`<span class="muted small">${vis.length} section${vis.length===1?"":"s"} match</span>`:""}
      <button class="btn quiet sm" data-expand="${key}">Expand all</button><button class="btn quiet sm" data-collapse="${key}">Collapse all</button>
      ${key==="workflow"?`<button class="btn ${wfEng?"":"quiet"} sm" data-wfeng>${wfEng?"Showing engineer sections":"Engineer sections only"}</button>`:""}
    </div></div>
  ${extra}
  <div class="docgrid mt"><nav class="card toc" id="toc" aria-label="Contents">${tocHtml(key,secs)}</nav>
    <div id="docbody">${vis.map(secHtml).join("")||`<div class="card empty">No section mentions “${esc(docQ[key])}”. Try a shorter word.</div>`}
    ${D.closing&&!q?`<p class="dnote" style="margin-top:14px">${ic("book","width:15px;height:15px")}<em>${esc(D.closing)}</em></p>`:""}</div></div>`;
};
function highlightDoc(q){
  if (!q) return; const root=$("#docbody"); if(!root) return;
  const re=new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode.closest("textarea,script,style,option")||!n.nodeValue.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n=>{ if(!re.test(n.nodeValue)) return; re.lastIndex=0; const span=document.createElement("span"); span.innerHTML=esc(n.nodeValue).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),m=>`<mark>${m}</mark>`); n.parentNode.replaceChild(span,n); });
}
function jumpTo(key, sec){
  if (parse().view!=="doc" || parse().arg!==key){ location.hash=`#/doc/${key}?sec=${sec}`; return; }
  docOpen[key] ||= new Set(); docOpen[key].add(sec);
  if (docQ[key] && !SEC_TEXT[key][sec].includes(docQ[key].toLowerCase())) docQ[key]="";
  if (key==="workflow" && wfEng && !["s0","s1","s3","s4","s5","s9"].includes(sec)) wfEng=false;
  render(true); const el=$("#sec-"+sec); if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
}
function refreshLight(){ const {view,arg}=parse(); if(view==="doc"){ const t=$("#toc"); if(t){ let secs=DOCS[arg].sections; if(arg==="workflow"&&wfEng) secs=secs.filter(s=>["s0","s1","s3","s4","s5","s9"].includes(s.id)); t.innerHTML=tocHtml(arg,secs); } } renderChrome(); }
