import json, re
raw=json.load(open('docs_raw.json'))
CFG={
 'program':('Team_Leader_Raising_Program_2','About the program',['Documents You Will Need','How the Program Is Built','Proficiency Levels','Running in the Background','Competency Sign-Off Record']),
 'workflow':('Team_Communication_Workflow','About this workflow',['Daily Workflow Cycle']),
 'standards':('Project_Technical_Standards','About this form',[]),
 'candidate':('Phase_1_Scenario_Test_Candidate','About this test',[]),
 'mentor':('Phase_1_Scenario_Test_Mentor','How to use this version',['Marking Scale','Score Sheet','Outcome']),
}
BANNER=re.compile(r'^(WEEKS?|CHECKPOINT|FINAL|PHASE|ROUTING|GUIDANCE|BONUS)\b')
def S(segs): 
    out=[]
    for s in segs:
        t=s['t']
        if out and out[-1][1]==s['b'] and out[-1][2]==s['i']: out[-1][0]+=t
        else: out.append([t,s['b'],s['i']])
    # trim
    if out: out[0][0]=out[0][0].lstrip(); out[-1][0]=out[-1][0].rstrip()
    return [x for x in out if x[0]!='']
def ptext(p): return ''.join(s['t'] for s in p['segs']).strip()
def cell_text(c): return ' '.join(ptext(i) if i['k']=='p' else '' for i in c['items']).strip()
def allbold(p): return all(s['b'] for s in p['segs'] if s['t'].strip())
def is_bullet(p): return bool(re.match(r'^—\s{2,}',''.join(s['t'] for s in p['segs']))) and p['segs'][0]['b']
def strip_bullet(p):
    segs=[dict(s) for s in p['segs']]
    segs[0]['t']=re.sub(r'^—\s+','',segs[0]['t'])
    return S(segs)
def paras_to_blocks(items):
    out=[]
    for it in items:
        if it['k']!='p': out.append({'t':'raw'}); continue
        if not ptext(it): continue
        if is_bullet(it):
            if out and out[-1]['t']=='bullets': out[-1]['items'].append(strip_bullet(it))
            else: out.append({'t':'bullets','items':[strip_bullet(it)]})
        else: out.append({'t':'p','segs':S(it['segs'])})
    return out
ctr={'n':0}
def nid(doc): ctr['n']+=1; return f"{doc}-{ctr['n']}"
def conv_table(t,doc,img_next=None):
    rows=t['rows']; nr=len(rows); nc=max(len(r) for r in rows)
    texts=[[cell_text(c) for c in r] for r in rows]
    flat=[x for r in texts for x in r]
    first=rows[0][0]['items'][0] if rows[0][0]['items'] else None
    # banner
    if nr==1 and nc==1 and first and allbold(first) and BANNER.match(ptext(first)):
        ps=[i for i in rows[0][0]['items'] if i['k']=='p' and ptext(i)]
        head=ptext(ps[0]); parts=re.split(r'\s{3,}',head,1)
        meta=[m.strip() for m in ptext(ps[1]).split('•')] if len(ps)>1 else []
        return {'t':'banner','kicker':parts[0],'title':parts[1] if len(parts)>1 else '','meta':meta}
    # yes/no
    if nc==1 and flat[0].startswith('Yes') and '/' in flat[0] and 'No' in flat[0]:
        return {'t':'yesno','id':nid(doc),'extra':nr-1}
    # notes
    if nc==1 and all(x=='' for x in flat):
        return {'t':'notes','id':nid(doc),'lines':nr}
    # fields
    if all(x.endswith(':') for x in flat if x) and all(flat):
        return {'t':'fields','items':[{'id':nid(doc),'label':x.rstrip(':').strip()} for x in flat]}
    # callout
    if nr==1 and nc==1:
        return {'t':'callout','blocks':paras_to_blocks(rows[0][0]['items'])}
    # deftable
    two=all(len(r)==2 for r in rows)
    def isbold(c): 
        ps=[i for i in c['items'] if i['k']=='p' and ptext(i)]
        return ps and all(allbold(p) for p in ps)
    if two and all(isbold(r[0]) and len(cell_text(r[0]))<60 for r in rows) and not (isbold(rows[0][1]) and len(texts[0][1])<35):
        return {'t':'def','rows':[{'label':texts[i][0],'blocks':paras_to_blocks(r[1]['items'])} for i,r in enumerate(rows)]}
    # data table
    head=[re.sub(r'\s*☐\s*$','',x).strip() for x in texts[0]]
    checkcols=[i for i,x in enumerate(texts[0]) if '☐' in x or x=='✓']
    body=[]
    for r in rows[1:]:
        cells=[]
        for ci,c in enumerate(r):
            tx=cell_text(c)
            ps=[i for i in c['items'] if i['k']=='p']
            segs=S(ps[0]['segs']) if ps and ptext(ps[0]) else []
            if tx=='☐': cells.append({'k':'check','id':nid(doc)})
            elif re.match(r'^\[.*\]$',tx) or re.match(r'^<.*>$',tx): cells.append({'k':'input','id':nid(doc),'ph':tx.strip('[]<>')})
            elif tx=='?': cells.append({'k':'input','id':nid(doc),'ph':'Specify'})
            elif tx=='': cells.append({'k':'input','id':nid(doc),'ph':''})
            else:
                blocks=paras_to_blocks(c['items'])
                cells.append({'k':'text','segs':segs,'blocks':blocks if len(blocks)>1 else None,'text':tx})
        body.append(cells)
    return {'t':'table','id':nid(doc),'head':head,'checkcols':checkcols,'rows':body}

DOCS={}
for key,(fn,introTitle,heads) in CFG.items():
    bl=raw[fn]['blocks']
    title=ptext(bl[0]); i=1
    subtitle=[]
    if key!='standards':
        subtitle=[x.strip() for x in ptext(bl[1]).split('•')]; i=2
    out=[]
    for b in bl[i:]:
        if b['k']=='tbl': out.append(conv_table(b,key)); continue
        tx=ptext(b)
        if b['img']: out.append({'t':'image','which':'program-diagram' if key=='program' else 'spacing-chart'}); continue
        if b['style'].startswith('Heading 1'): out.append({'t':'h1','text':tx}); continue
        if b['style'].startswith('Heading 2'): out.append({'t':'h2','text':tx}); continue
        m=re.match(r'^(\d{1,2})\s+—\s+(.+)$',tx)
        if m and b['segs'][0]['b']: out.append({'t':'sub','num':int(m[1]),'title':m[2].strip()}); continue
        m=re.match(r'^Also this week\s+—\s+(.+)$',tx)
        if m: out.append({'t':'sub','num':None,'kicker':'Also this week','title':m[1]}); continue
        m=re.match(r'^(L\d)\s+—\s+(.+?)\s+—\s+(.+)$',tx)
        if m:
            if out and out[-1]['t']=='levels': out[-1]['items'].append([m[1],m[2],m[3]])
            else: out.append({'t':'levels','items':[[m[1],m[2],m[3]]]})
            continue
        if is_bullet(b):
            if out and out[-1]['t']=='bullets': out[-1]['items'].append(strip_bullet(b))
            else: out.append({'t':'bullets','items':[strip_bullet(b)]})
            continue
        if all(s['i'] for s in b['segs'] if s['t'].strip()): out.append({'t':'note','text':tx}); continue
        if allbold(b) and len(tx)<90: out.append({'t':'head','text':tx}); continue
        out.append({'t':'p','segs':S(b['segs'])})
    # attach labels to yesno/notes
    res=[]
    for x in out:
        if x['t'] in ('yesno','notes') and res and res[-1]['t']=='p' and not any(s[1] for s in res[-1]['segs']):
            q=res.pop(); x['label']=''.join(s[0] for s in q['segs'])
        res.append(x)
    out=res
    for k2,x in enumerate(out):
        if x['t']=='yesno' and 'label' not in x and k2>=2 and out[k2-1]['t']=='image' and out[k2-2]['t']=='p':
            x['label']=''.join(z[0] for z in out[k2-2]['segs']); x['ref']='chart'
    # closing note
    closing=None
    if out and out[-1]['t']=='note': closing=out.pop()['text']
    # sections
    secs=[]; cur={'id':'intro','title':introTitle,'blocks':[],'kicker':'','meta':[],'group':''}; group=''
    def push():
        if cur['blocks'] or cur['id']!='intro' or True: secs.append(cur)
    for x in out:
        start=None
        if x['t']=='banner': start={'title':x['title'] or x['kicker'].title(),'kicker':x['kicker'],'meta':x['meta']}
        elif x['t']=='h1': group=re.sub(r'\s+',' ',x['text']); continue
        elif x['t']=='h2': start={'title':x['text'],'kicker':'','meta':[]}
        elif x['t']=='head' and x['text'] in heads: start={'title':x['text'],'kicker':'','meta':[]}
        elif x['t']=='sub' and key in ('candidate','mentor'): start={'title':x['title'],'kicker':f"Situation {x['num']}",'meta':[],'num':x['num']}
        elif x['t']=='callout' and key=='candidate' and x['blocks'] and x['blocks'][0]['t']=='p' and x['blocks'][0]['segs'][0][0].startswith('Bonus'):
            start={'title':'Bonus question','kicker':'Not scored','meta':[]}
        if start:
            start['title']=re.sub(r'\s+',' ',start['title']); start['kicker']=re.sub(r'\s+',' ',start['kicker'])
            if cur['blocks'] or cur['id']=='intro': secs.append(cur)
            cur={'id':f"s{len(secs)}",'blocks':[],'group':group,**start}
            if x['t'] in ('banner','h2','head','sub'): 
                continue
        cur['blocks'].append(x)
    secs.append(cur)
    secs=[s for s in secs if s['blocks'] or s.get('num')]
    for k,s in enumerate(secs): s['id']=f"s{k}"
    DOCS[key]={'key':key,'title':title,'subtitle':subtitle,'sections':secs,'closing':closing}
json.dump(DOCS,open('docs.json','w'),ensure_ascii=False)
for k,v in DOCS.items():
    print('##',k,v['title'],v['subtitle'],'| closing:',v['closing'])
    for s in v['sections']: print('  ',s['id'],s.get('group',''),'|',s['kicker'],'|',s['title'],'|',s['meta'],[b['t'] for b in s['blocks']][:14])
print(len(json.dumps(DOCS)))
