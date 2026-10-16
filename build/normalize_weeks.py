# Step 2: turn "WEEK 1 The Standards You Work To Phase 1 • Competency 1" into weekLabel / theme / phase
import json,re
c=json.load(open("comps.json"))
for x in c:
    if "week" not in x: continue
    m=re.match(r"(WEEKS? [\d]+(?: TO \d+)?)\s+(.*?)\s+Phase (\d)",x["week"])
    x["weekLabel"]=m[1].title().replace(" To ","–"); x["theme"]=m[2]; x["phase"]=int(m[3]); del x["week"]
    x["uses"]=x.get("uses")
json.dump(c,open("comps.json","w"),ensure_ascii=False)
print("normalized",len(c))
