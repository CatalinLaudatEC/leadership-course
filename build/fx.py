import json
t=open("stage2.html").read()
def rep(a,b,cnt=1):
    global t
    assert t.count(a)==cnt,(t.count(a),a[:90]); t=t.replace(a,b)
# CSS at end of style
rep("</style>\n</head>", open('fx.css').read()+"\n</style>\n</head>")
# body additions
rep('<body>\n<header class="top">','''<body>
<div id="splash" aria-hidden="true"><div class="sp-in"><div class="sp-logo"><svg viewBox="0 0 32 32"><defs><linearGradient id="slg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".5" stop-color="#5B8DEF"/><stop offset="1" stop-color="#A855F7"/></linearGradient></defs><circle cx="16" cy="16" r="12" fill="none" stroke="url(#slg)" stroke-width="3.5"/><path d="M10.5 16h11" stroke="url(#slg)" stroke-width="3.5" stroke-linecap="round"/></svg></div><div class="sp-t"><b>ERACORE</b> · LEARNING CENTER</div><div class="sp-bar"><i></i></div><div class="sp-s">Loading the Team Leader Raising Program</div></div></div>
<div id="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<div id="loadbar" aria-hidden="true"></div><div id="scrollbar" aria-hidden="true"></div>
<header class="top">''')
rep('<div class="grow"></div>\n  <button class="iconbtn" id="themeBtn"','''<div class="grow"></div>
  <button class="palbtn" id="palBtn" aria-label="Search everything"><svg class="ico" viewBox="0 0 24 24" style="width:16px;height:16px"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>Search everything…</span><kbd>Ctrl K</kbd></button>
  <button class="iconbtn" id="themeBtn"''')
rep('<div class="toast" id="toast" role="status"></div>','''<div class="toast" id="toast" role="status"></div>
<div class="overlay" id="modal"></div><div class="overlay" id="pal"></div><canvas id="fx" aria-hidden="true"></canvas>
<button id="totop" aria-label="Back to top"><svg class="ico" viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button>''')
# fx js before router
rep("/* ============================================================ ROUTER & EVENTS","/*FXJS*/\n/* ============================================================ ROUTER & EVENTS")
t=t.replace("/*FXJS*/",open('fx.js').read())
# render hook
rep('''  renderChrome(); if(keep){ window.scrollTo(0,y); if(fs){ const n=$(fs); if(n){ n.focus({preventScroll:true}); } } }
}''','''  renderChrome(); if(keep){ window.scrollTo(0,y); if(fs){ const n=$(fs); if(n){ n.focus({preventScroll:true}); } } }
  afterRender(!keep);
}''')
# loadbar on navigation
rep('''window.addEventListener("hashchange",()=>{ const {view,arg}=parse();''','''window.addEventListener("hashchange",()=>{ loadStart(); const {view,arg}=parse();''')
# watcher in renderChrome
rep('''  }).join("");
  markNav();
}''','''  }).join("");
  markNav(); if (typeof watch==="function") watch();
}''')
rep('S=sample(); S.ui.theme=th;','SNAP=null; S=sample(); S.ui.theme=th; S.ui.welcomed=true;')
rep('S=blank(); S.ui.theme=th;','SNAP=null; S=blank(); S.ui.theme=th; S.ui.welcomed=true;')
rep('''if (cl("#themeBtn")){ S.ui.theme=S.ui.theme==="dark"?"light":"dark"; save(); render(true); return; }''','''if (cl("#themeBtn")){ themeSwitch(e); return; }''')
# comp tab pane
rep('''\n  ${body}\n''','''\n  <div class="tabpane">${body}</div>\n''')
# charts
rep('<rect class="bar" x="${x}"','<rect class="bar" style="--i:${i}" x="${x}"')
rep('<rect x="${x0}" y="${yy+3}" width="${w}"','<rect class="tl-bar" style="--i:${i}" x="${x0}" y="${yy+3}" width="${w}"')
rep('const box=c=>{ const P=pos[c.id]; return `<g class="box ${status(c.id)}"','const box=(c,i)=>{ const P=pos[c.id]; return `<g class="box ${status(c.id)}" style="--i:${i}"')
rep('''<circle cx="60" cy="60" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${pct*L} ${L}" transform="rotate(-90 60 60)"/><text x="60"''','''<circle class="ring-p" style="--a:${pct*L}" cx="60" cy="60" r="${r}" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${pct*L} ${L}" transform="rotate(-90 60 60)"/><text class="ring-txt" x="60"''')
rep('''return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img"''','''return `<svg class="donut-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img"''')
rep('''<text x="${cx}" y="${cy-4}" text-anchor="middle" style="font:700 28px var(--font);fill:var(--text)">''','''<text class="ring-txt" x="${cx}" y="${cy-4}" text-anchor="middle" style="font:700 28px var(--font);fill:var(--text)">''')
# smooth sections
rep('<div class="dsec-b">${renderBlocks(s.blocks,ctx)}','<div class="dsec-b" ${open?"":"inert"}><div class="dsec-in">${renderBlocks(s.blocks,ctx)}')
rep('''`<span class="muted small">End of document</span>`}</div></div></section>`; };''','''`<span class="muted small">End of document</span>`}</div></div></div></section>`; };''')
rep('''el.classList.toggle("open",o); sh.setAttribute("aria-expanded",String(o)); return; }''','''el.classList.toggle("open",o); sh.setAttribute("aria-expanded",String(o)); const bd=el.querySelector(".dsec-b"); o?bd.removeAttribute("inert"):bd.setAttribute("inert",""); return; }''')
# search icons
t=t.replace('<label class="search" style="flex:1 1 260px">${ic("book","width:16px;height:16px")}','<label class="search" style="flex:1 1 260px">${ic("search","width:16px;height:16px")}')
t=t.replace('<label class="search">${ic("book","width:16px;height:16px")}','<label class="search">${ic("search","width:16px;height:16px")}')
# old toast removed function? keep; old toast defined as function toast(m) — later definition wins
open("stage3.html","w").write(t)
c=open('course.js').read().replace('"Team Communication Workflow": "#/workflow"','"Team Communication Workflow": "#/doc/workflow"').replace('"Project Technical Standards & Preferences Form": "#/form"','"Project Technical Standards & Preferences Form": "#/doc/standards"')
out=t.replace('/*COURSE*/',c).replace('/*COMPS*/[]',json.dumps(json.load(open('comps.json')),ensure_ascii=False)).replace('/*SCEN*/[]',json.dumps(json.load(open('scen.json')),ensure_ascii=False)).replace('/*DOCS*/{}',json.dumps(json.load(open('docs.json')),ensure_ascii=False))
open('../dist/leadership-course-demo.html','w').write(out)
open('s.js','w').write(out.split('<script>')[1].split('</script>')[0])
print(len(out))
