t=open("base.html").read()
def rep(a,b,cnt=1):
    global t
    assert t.count(a)==cnt, (t.count(a),a[:80]); t=t.replace(a,b)
def cut(start,end):
    global t
    i=t.index(start); j=t.index(end,i); t=t[:i]+t[j:]
rep("@media (max-width:1280px){ .g4","/*DOCSCSS*/\n@media (max-width:1280px){ .g4")
t=t.replace("/*DOCSCSS*/",open('docs.css').read())
rep("/*COURSE*/","/*COURSE*/\nconst DOCS = /*DOCS*/{};")
rep('const KEY = "tlrp-demo-v2";','const KEY = "tlrp-demo-v3";')
rep('sign:{},evidence:{},qc:{},drill:{},form:{},decisions:[],changes:[],answers:{},marks:{},final:{},seeded:false});',
    'sign:{},evidence:{},qc:{},drill:{},form:{},decisions:[],changes:[],answers:{},marks:{},final:{},read:{},inp:{},src:{},comp:{},gap:{},elem:{},wrong:{},seeded:false});')
rep("""  return s;
}
let S;""","""  const yn=[], tb=[]; DOCS.standards.sections.forEach(sec=>sec.blocks.forEach(b=>{ if(b.t==="yesno") yn.push(b.id); if(b.t==="table") tb.push(b); }));
  const srcs=["Spec 26 05 33 §3.1","Spec 26 05 33 §3.1","BEP §4.2","Spec 26 05 33 §3.4","Spec 26 05 33 §3.5","Spec 27 05 28 §3.2","Spec 26 05 33 §3.2","Spec 26 05 33 §2.1"];
  ["Yes","Yes","Yes","Yes","No","Yes","Yes","Yes"].forEach((v,i)=>{ s.inp[yn[i]]=v; s.src[yn[i]]=srcs[i]; s.comp[yn[i]]=i===3?"No":i===5?"Not checked":"Yes"; });
  const rm=tb[0]; s.inp[rm.rows[0][1].id]="Power branches, lighting branches"; s.inp[rm.rows[0][2].id]=true; s.inp[rm.rows[1][1].id]="MV feeders, telecom feeders"; s.inp[rm.rows[1][2].id]=true; s.src[rm.id]="Spec 26 05 33 §3.2"; s.comp[rm.id]="Yes";
  s.gap[yn[9]]=true; s.gap[yn[12]]=true; s.gap[tb[1].id]=true;
  s.read={program:{s0:1,s1:1,s2:1,s3:1,s4:1,s5:1,s6:1},workflow:{s0:1,s1:1,s2:1,s3:1,s4:1,s5:1},standards:{s0:1,s1:1},candidate:{s0:1,s1:1,s2:1}};
  s.elem={1:{0:true,1:true,2:true,3:true},2:{0:true,1:true}}; s.marks={1:{ok:true,note:"Clear on Step 2 and the lead response."}};
  return s;
}
let S;""")
cut("const gapsList = () =>","function shuffle(")  # keep shuffle(): the quick check uses it
i=t.index("const NAV = ["); j=t.index("];",i)+2
t=t[:i]+'''const NAV = [
  {g:"PROGRAM",first:true},
  {h:"#/",t:"Overview",i:"grid"},
  {h:"#/map",t:"Program map",i:"map",cnt:()=>`${C.filter(c=>status(c.id)==="done").length}/15`},
  {g:"DOCUMENTS"},
  {h:"#/doc/program",t:"Leader Raising Program",i:"book",cnt:()=>`${readOf("program")}/${DOCS.program.sections.length}`},
  {h:"#/doc/workflow",t:"Communication Workflow",i:"flow",cnt:()=>`${readOf("workflow")}/${DOCS.workflow.sections.length}`},
  {h:"#/doc/standards",t:"Standards form",i:"form",cnt:()=>{const g=gapsList().length; return g?{v:g+" gaps",warn:true}:`${readOf("standards")}/${DOCS.standards.sections.length}`;}},
  {h:"#/doc/candidate",t:"Scenario test",i:"check",cnt:()=>`${SC.filter(s=>scnState(s)==="full").length}/10`},
  {h:"#/doc/mentor",t:"Mentor marking",i:"shield",cnt:()=>isMentor()?`${SC.filter(s=>(S.marks[s.id]||{}).ok).length}/10`:"Mentor"},
  {g:"PRACTICE"},
  {h:"#/drill",t:"Escalation drill",i:"route",cnt:()=>{const n=Object.keys(S.drill.r||{}).length; return n<COURSE.drill.length?`${n}/${COURSE.drill.length}`:"";}},
  {h:"#/logs",t:"Decision & change logs",i:"log",cnt:()=>S.decisions.length+S.changes.length||""},
  {g:"ASSESS"},
  {h:"#/record",t:"Sign-off record",i:"award"},
  {g:"ABOUT"},
  {h:"#/engine",t:"How it's built",i:"cpu"}
];'''+t[j:]
rep('''const h = location.hash || "#/"; const base = h.startsWith("#/c/") ? "#/map" : "#/"+(h.split("/")[1]||"");''',
    '''const p=parse(); const base = p.view==="c" ? "#/map" : p.view==="doc" ? "#/doc/"+p.arg : p.view==="home" ? "#/" : "#/"+p.view;''')
rep('''  const fl = S.changes.filter(c=>c.c==="Flagged").length;''','''  if (isMentor()){ const um=SC.filter(s=>scnState(s)!=="none" && !(S.marks[s.id]||{}).ok).length; if(um) a.unshift({t:`${um} answered situation${um>1?"s":""} not marked yet`,s:"Mark against the required elements",chip:["Mark","warn"],h:"#/doc/mentor"}); }
  ["program","workflow"].filter(k=>docPct(k)<1).forEach(k=>a.push({t:`${DOC_META[k].name}: ${readOf(k)}/${DOCS[k].sections.length} sections read`,s:k==="workflow"?"Tested at the Phase 1 checkpoint":"The program document, read in full",chip:["Read","warn"],h:`#/doc/${k}`}));
  const fl = S.changes.filter(c=>c.c==="Flagged").length;''')
rep('h:"#/form"});','h:"#/doc/standards"});')
rep('h:"#/checkpoint"});','h:"#/doc/candidate"});')
rep('''  <div class="grid g-wide mt">
  <div class="card"><div class="card-h"><h2>Level by competency</h2>''','''  <div class="card mt"><div class="card-h"><span class="count blue">5</span><h2>Documents</h2><div class="r"><span class="muted small">Each source document, segmented and interactive — reading progress saves as you go</span></div></div>
    <div class="docgrid5">${DOC_KEYS.map((k,i)=>{ const M=DOC_META[k], p=docPct(k), locked=M.mentor&&!isMentor(); return `<a class="doctile" href="#/doc/${k}"><div class="frow" style="align-items:center;gap:10px;justify-content:space-between"><span class="tile ${["t-blue","t-green","t-amber","t-blue","t-red"][i]}" style="flex:0 0 auto">${ic(M.icon)}</span><span style="flex:0 0 auto">${locked?`<span class="chip">Mentor only</span>`:`<span class="chip ${p===1?"done":p?"progress":""}">${Math.round(p*100)}% read</span>`}</span></div><b>${esc(M.name)}</b><span class="muted small" style="flex:1">${esc(M.desc)}</span><div class="pbar green"><i style="width:${p*100}%"></i></div><span class="muted small">${DOCS[k].sections.length} sections</span></a>`; }).join("")}</div></div>

  <div class="grid g-wide mt">
    <div class="card"><div class="card-h"><h2>Level by competency</h2>''')
rep('''[["#/workflow","flow","Team workflow"],["#/drill","route","Escalation drill"],["#/form","form","Standards form"],["#/logs","log","Decision & change logs"],["#/checkpoint","check","Phase 1 checkpoint"],["#/record","award","Sign-off record"],["#/map","map","Program map"],["#/c/1","book","Competency 1"],["#/engine","cpu","How it's built"]]''',
    '''[["#/doc/program","book","Program document"],["#/doc/workflow","flow","Team workflow"],["#/doc/standards","form","Standards form"],["#/doc/candidate","check","Scenario test"],["#/doc/mentor","shield","Mentor marking"],["#/map","map","Program map"],["#/drill","route","Escalation drill"],["#/logs","log","Decision & change logs"],["#/record","award","Sign-off record"],["#/engine","cpu","How it's built"]]''')
cut("let wfPhase = 1;","V.drill = ")
cut("let formOpen = {0:true};","V.logs = ")
cut("let cpSel = 1;","V.record = ")
rep("/* ============================================================ ROUTER & EVENTS","/*DOCSVIEW*/\n/* ============================================================ ROUTER & EVENTS")
t=t.replace("/*DOCSVIEW*/",open('docs_view.js').read())
rep('''return {view:parts[0]||"home",arg:parts[1],qs}; }''','''let view=parts[0]||"home", arg=parts[1]; const AL={workflow:"workflow",form:"standards",checkpoint:"candidate"}; if(AL[view]){ arg=AL[view]; view="doc"; } return {view,arg,qs}; }''')
rep('''  renderChrome(); if(keep){''','''  if (view==="doc"){ highlightDoc((docQ[arg]||"").trim()); if(pendingScroll){ const el=$("#sec-"+pendingScroll); pendingScroll=null; if(el && !restoring) setTimeout(()=>el.scrollIntoView({block:"start"}),30); } }
  renderChrome(); if(keep){''')
rep('''  if (d.gap) return `[data-gap="${d.gap}"]`; if (el.id) return "#"+el.id; return null; }''','''  if (d.gap) return `[data-gap="${d.gap}"]`; if (el.id) return "#"+el.id; if (d.inp) return `[data-inp="${d.inp}"]`; if (d.src) return `[data-src="${d.src}"]`;
  if (d.ans) return `[data-ans="${d.ans}"][data-k="${d.k}"]`; if (d.mnote) return `${el.tagName.toLowerCase()}[data-mnote="${d.mnote}"]`; return null; }''')
rep('''  const gb=cl("[data-gap]"); if (gb){ const v=S.form[gb.dataset.gap] ||= {}; v.gap=!v.gap; save(); render(true); return; }''',
'''  const gb=cl("[data-gap]"); if (gb){ const id=gb.dataset.gap; S.gap[id]=!S.gap[id]; save(); render(true); toast(S.gap[id]?"Added to questions for the PM":"Removed from questions for the PM"); return; }
  const sh=cl("[data-sec]"); if (sh){ const [k,s]=sh.dataset.sec.split(":"); docOpen[k] ||= new Set(); const el=sh.closest(".dsec"), o=!el.classList.contains("open"); o?docOpen[k].add(s):docOpen[k].delete(s); el.classList.toggle("open",o); sh.setAttribute("aria-expanded",String(o)); return; }
  const jp=cl("[data-jump]"); if (jp){ const [k,s]=jp.dataset.jump.split(":"); jumpTo(k,s); return; }
  const rd=cl("[data-read]"); if (rd){ const [k,s]=rd.dataset.read.split(":"); S.read[k] ||= {}; S.read[k][s]=!S.read[k][s]; save(); render(true); if(S.read[k][s]) toast(docPct(k)===1?"Document complete":"Marked as read"); return; }
  const nx=cl("[data-next]"); if (nx){ const [k,s,n]=nx.dataset.next.split(":"); S.read[k] ||= {}; S.read[k][s]=true; save(); docOpen[k].delete(s); jumpTo(k,n); return; }
  const ex=cl("[data-expand]"); if (ex){ const k=ex.dataset.expand; docOpen[k]=new Set(DOCS[k].sections.map(s=>s.id)); render(true); return; }
  const co=cl("[data-collapse]"); if (co){ docOpen[co.dataset.collapse]=new Set(); render(true); return; }
  if (cl("[data-wfeng]")){ wfEng=!wfEng; render(true); return; }
  if (cl("[data-w1]")){ S.ui.w1 = S.ui.w1===false; save(); render(true); return; }
  const yb=cl("[data-yn]"); if (yb){ const id=yb.dataset.yn; S.inp[id] = S.inp[id]===yb.dataset.v ? "" : yb.dataset.v; save(); render(true); return; }
  const wr=cl("[data-wrong]"); if (wr){ const n=wr.dataset.wrong; S.wrong[n]=!S.wrong[n]; if(S.wrong[n]) (S.marks[n] ||= {}).ok=false; save(); render(true); return; }
  const spc=cl("[data-spc]"); if (spc){ const [a,b]=spc.dataset.spc.split(":"); spA=+a; spB=+b; render(true); return; }''')
rep('''  if (t.dataset.f){ (S.form[t.dataset.f] ||= {})[t.dataset.k]=t.value; save(); render(true); return; }''','''  if (t.dataset.chk){ S.inp[t.dataset.chk]=t.checked; save(); render(true); return; }
  if (t.dataset.comp){ S.comp[t.dataset.comp]=t.value; save(); render(true); return; }
  if (t.dataset.elem){ const [n,i]=t.dataset.elem.split(":"); (S.elem[n] ||= {})[i]=t.checked; save(); render(true); return; }
  if (t.dataset.sp){ t.dataset.sp==="A"?spA=+t.value:spB=+t.value; render(true); return; }
  if (t.dataset.inp && (t.tagName==="SELECT"||t.type==="date")){ S.inp[t.dataset.inp]=t.value; save(); refreshLight(); return; }''')
rep('''  if (t.dataset.ans){''','''  if (t.id==="docSearch"){ docQ[parse().arg]=t.value; render(true); const n=$("#docSearch"); if(n){ n.focus(); const L=n.value.length; try{n.setSelectionRange(L,L);}catch(_){} } return; }
  if (t.dataset.inp){ S.inp[t.dataset.inp]=t.value; save(); clearTimeout(window._rl); window._rl=setTimeout(refreshLight,250); return; }
  if (t.dataset.src){ S.src[t.dataset.src]=t.value; save(); return; }
  if (t.dataset.ans){''')
rep('''    const s=SC.find(x=>String(x.id)===t.dataset.ans); if (s){ const n=$(`[data-scn="${s.id}"] .n`); if(n) n.className="n "+scnState(s); } return; }''',
    '''    clearTimeout(window._rl); window._rl=setTimeout(refreshLight,250); return; }''')
rep('''  if (go && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); location.hash=go.dataset.go; }''','''  if (go && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); location.hash=go.dataset.go; }
  const jp=e.target.closest&&e.target.closest("[data-jump]"); if (jp && jp.tagName!=="BUTTON" && jp.tagName!=="A" && (e.key==="Enter"||e.key===" ")){ e.preventDefault(); const [k,s]=jp.dataset.jump.split(":"); jumpTo(k,s); }''')
rep('''${docH?`<a class="chip progress" href="${docH}">${ic("link","width:13px;height:13px")}${esc(c.uses)}</a>`:""}</div></div>''',
    '''${docH?`<a class="chip progress" href="${docH}">${ic("link","width:13px;height:13px")}${esc(c.uses)}</a>`:""}<a class="chip" href="#/doc/program?sec=${PROG_SEC[c.id]}">${ic("book","width:13px;height:13px")}Read in program document</a></div></div>''')
rep('''["Program document: phases, weeks, competencies","Reference documents: workflow, standards form","Checkpoint scenarios, candidate version","Escalation and routing rules"]''',
    '''["Program document: phases, weeks, competencies, diagram","Team Communication Workflow","Technical Standards & Preferences Form, with its spacing chart","Scenario test, candidate and mentor versions"]''')
rep('''["Overview, timeline and progress charts","Competency pages with quick checks","Practice drills from rule tables","Working tools: standards form and logs","Mentor sign-off and record"]''',
    '''["A segmented, searchable reader for each document, with reading progress","Every form field, check box and table made fillable","Competency pages, quick checks and drills","Answering and mentor marking for the scenario test","Overview, timeline, charts and sign-off record"]''')
rep('''"Video slots are placeholders on each competency's Overview tab."''','''"Video slots are placeholders on each competency's Overview tab.","The two images in the documents (program diagram, spacing chart) were rebuilt as interactive components from their content."''')
t=t.replace('href="#/workflow">Review the workflow','href="#/doc/workflow">Review the workflow')
open("stage2.html","w").write(t)
import json
c=open('course.js').read().replace('"Team Communication Workflow": "#/workflow"','"Team Communication Workflow": "#/doc/workflow"').replace('"Project Technical Standards & Preferences Form": "#/form"','"Project Technical Standards & Preferences Form": "#/doc/standards"')
out=t.replace('/*COURSE*/',c).replace('/*COMPS*/[]',json.dumps(json.load(open('comps.json')),ensure_ascii=False)).replace('/*SCEN*/[]',json.dumps(json.load(open('scen.json')),ensure_ascii=False)).replace('/*DOCS*/{}',json.dumps(json.load(open('docs.json')),ensure_ascii=False))
open('../dist/leadership-course-demo.html','w').write(out)
open('s.js','w').write(out.split('<script>')[1].split('</script>')[0])
print(len(out))
