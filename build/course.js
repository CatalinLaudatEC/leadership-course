const COURSE = {
  id: "tlrp-electrical-bim",
  title: "Team Leader Raising Program",
  org: "Eracore Electrical BIM",
  summary: "Takes a strong electrical BIM engineer and builds the judgment of a team leader. Revit, Navisworks and Bluebeam skill is assumed. What is assessed is what you do when the client adds an area on a Thursday, when the team is heading into a weekend to hit a pour date, and when a package is one click from release with an error in it.",
  principle: "A competency is signed off when your mentor has seen you do it on a real project — not when you have read about it, and not when you sat in the room while someone else did it.",
  levels: [
    {code:"L1",name:"Observes",text:"Watches a senior lead do it and can explain afterwards what happened and why."},
    {code:"L2",name:"Does with review",text:"Does it themselves; the mentor checks before anything leaves the team."},
    {code:"L3",name:"Does independently",text:"Does it unsupervised. The target level for final sign-off."},
    {code:"L4",name:"Teaches others",text:"Coaches another engineer through it. Expected within six months of sign-off."}
  ],
  background: [
    "Nothing leaves your team without a signed check list, from the day the check list exists.",
    "Keep a written decision log: every question that comes up, classified decide or ask, with the reasoning.",
    "Sit in on every client meeting as a listener from Week 1. No speaking part until Phase 2."
  ],
  documents: {
    "Team Communication Workflow": "#/workflow",
    "Project Technical Standards & Preferences Form": "#/form"
  },
  competencies: /*COMPS*/[],
  scenarios: /*SCEN*/[],
  final: [
    {t:"Run a client coordination meeting end to end",d:"Agenda out in advance, your scope reported, decisions captured, minutes issued the same day. Mentor present as an observer only."},
    {t:"Release a real deliverable package",d:"Issued under your own check list, with the transmittal, the archived issued copy, and any known open items stated. Zero critical comments returned."},
    {t:"Present your project and your numbers",d:"The lifecycle map and the completed standards form, plus a review with the PM of your decision log, change log and capacity tracking for the last month."}
  ],
  workflow: [
    {n:1,p:"Preparation",w:"Before the daily · Lead",out:"Tasks published, capacity counted",lede:"The meeting is only as good as the hour before it. Both sides arrive with work already done.",rules:{
      "Team":["Review the daily tasks published by the lead in advance — mandatory before the meeting","Open all required files, models and viewpoints beforehand","Prepare a short status: done, in progress, blocked","Collect questions in advance instead of raising them live"],
      "Lead":["Publish the weekly and daily tasks in the thread channel before the meeting","Make sure every task is clear, bounded and prioritised","Know the overall progress of the team before anyone reports it","Prepare to facilitate — not to solve everything personally"],
      "Count the load":["Available engineer-hours today against the hours the tasks actually need","Include checking and revision time, not only modeling time","If the numbers do not meet, decide now what moves — do not publish a day the team cannot deliver"],
      "Meeting setup":["Daily scheduled in Outlook between 09:00 and 10:00, team local time","The lead is on time, or cancels in advance and hands it to the assistant lead"],
      "The first hour":["The hour before the daily runs on tasks agreed at the end of the previous day","If someone has nothing to run on in the morning, that is an end-of-day failure"]}},
    {n:2,p:"Daily meeting",w:"09:00–10:00 · Lead",out:"Priorities agreed, blockers surfaced",lede:"A short, structured sync. Its purpose is alignment and surfacing blockers — not solving them.",rules:{
      "Check-in (1–3 min)":["A short informal start to engage the team; keep it brief"],
      "Priority alignment":["Clear priorities and top focus areas for today?","When is the next formal submission or deadline?","Aligned on what is critical and what is secondary?"],
      "Capacity check":["Can we deliver today's priorities with the people available today?","Anyone whose task will not land today says so here, not on the due date"],
      "Status":["Each person: done, in progress, blockers","Reported against the definition of done in the task — not as a percentage","“Almost done” is not a status"],
      "Questions":["Only critical blockers are discussed","Long topics are parked to the deep dive, with named participants","Whole-team questions go to the Project Information channel as a thread","No internal answer → client meeting agenda as an RFI"],
      "Record it":["Within one hour, the lead posts what was decided and who owes what by when"]}},
    {n:3,p:"Execution",w:"After the daily · Team",out:"Work moves",lede:"The longest part of the day and the one that needs the least management.",rules:{
      "Team":["Work the assigned tasks","Ask questions only when genuinely blocked"],
      "Lead":["Support with blockers","Avoid unnecessary involvement"],
      "Blocker response":["Acknowledge a blocker within 30 minutes, even if the answer takes longer","No immediate answer → name the fallback: a documented assumption, or the next task"],
      "Finishing early":["Take the next item from the ranked priority list","Nothing ready → check another package against the check list","If this happens often, preparation is under-planning — fix it there"]}},
    {n:4,p:"Question workflow",w:"All day · Team → Lead",out:"Answers, or a routed escalation",lede:"A funnel. Every question passes four filters; most never reach the lead, and only a few reach the client.",rules:{
      "1 · Try yourself":["10 to 30 minutes first: drawings, model, previous examples, the standards, search"],
      "2 · Structure it":["What you need · what you tried · what didn't work — then ask once"],
      "3 · Now or later":["Blocker → ask immediately","Not a blocker → add it to the deep-dive list"],
      "4 · Route it":["Three options and no fourth: decide it, client RFI, or the PM","Pick one the same day using the escalation table","An RFI rarely returns the same day — pair it with a fallback"],
      "Lead response":["Explain why, not just what","Show direction and approach; clarify priority","Do not do the work instead of the team"],
      "Write it down":["Where it will still be found in a month: standards form, check list, project notes","A channel thread is not storage","If the answer would have prevented a returned comment, add it to the check list"]}},
    {n:5,p:"Deep dive",w:"Same day, if triggered · Lead",out:"Decisions on queued topics",lede:"The session where queued questions get resolved properly, with the model open.",rules:{
      "Hold it when":["Two or more non-critical questions are queued","A decision affects more than one person or more than one area","A new client answer or standard needs explaining to the whole team","None of the above — cancel it"],
      "Close it properly":["Every topic ends with a decision, an owner and a date — or a note that it goes to the client","Decisions written into the thread the same day, and into the standards or check list where durable"]}},
    {n:6,p:"Execution",w:"After the deep dive · Team",out:"Work moves on the clarified basis",lede:"Continue after the clarifications and keep momentum.",rules:{
      "Team":["Continue work after the clarifications","Apply the decisions from the deep dive","Maintain momentum"]}},
    {n:7,p:"Check before handover",w:"Before release · Lead",out:"Nothing unchecked leaves",lede:"A day of perfect syncs still ends in a rejected package if nobody checked the work before it went out.",rules:{
      "Done means checked":["“Finished” means checked against the check list, not finished modeling","Signed with the checker's name and date","The checker is not the person who modeled it"],
      "The late change":["Any change after the check re-triggers the check on whatever it touched","No exceptions for small fixes or the last hour before a deadline"],
      "Archive what went out":["Keep the exact issued package, with version and date","The model is not the record; the issued PDF is"]}},
    {n:8,p:"End of day",w:"Last 15 minutes · Team → Lead",out:"Written state of the project",lede:"For a team working against a client in another time zone, the end-of-day record is the main thing anyone outside the team sees.",rules:{
      "Team":["Two or three lines in the thread: done, in progress, blocked, at risk for tomorrow"],
      "Lead":["Consolidate into one end-of-day summary","Compare planned against actual hours while the variance is small","Flag anything threatening a date — to the PM today","Make sure tomorrow morning has tasks to run on"]}}
  ],
  escalation: [
    {s:"Inside the standards, reversible, precedent exists",to:"Lead decides",when:"Immediately"},
    {s:"Design intent, code interpretation, contract documents",to:"Client RFI",when:"Next client meeting or RFI batch"},
    {s:"Affects another trade's space or sequence",to:"Client RFI, copy the GC",when:"Same day"},
    {s:"Scope has grown beyond what was sold",to:"Eracore PM",when:"Same day it is noticed"},
    {s:"A date is not achievable with the assigned team",to:"Eracore PM",when:"As soon as it is knowable"},
    {s:"Client unresponsive and work is blocked",to:"Eracore PM",when:"After 48 hours"},
    {s:"Performance or availability puts the package at risk",to:"Eracore PM",when:"Before it affects the date"}
  ],
  drill: [
    {q:"An engineer asks whether to use 45° or 90° fittings on a branch run. Both are permitted on the standards form, and the area next door was done with 90° last week.",a:0,row:0},
    {q:"The client's redline routes a power conduit through an IDF room it does not serve. The standards form says power must not pass through IDF/MDF rooms unless serving them.",a:1,row:1},
    {q:"To clear a beam, your 4\" feeder would need to drop into the zone mechanical has reserved for a duct riser.",a:2,row:2},
    {q:"On a call, the client asks if the team can “also take care of” the Level 4 lighting branches. Level 4 lighting is not in the contracted deliverable list.",a:3,row:3},
    {q:"Two engineers are out sick until next week. Counting the remaining hours, Friday's issue cannot be made with who is left.",a:3,row:4},
    {q:"Three RFIs to the GC's VDC lead have gone unanswered for three days. The area cannot progress without them.",a:3,row:5},
    {q:"The specification calls for EMT throughout, but a drawing note in the parking garage calls for rigid conduit. The team needs to know which governs.",a:1,row:1},
    {q:"Stub-up locations would need to shift 6\" into the plumbing chase to clear a footing.",a:2,row:2},
    {q:"An engineer has missed his last three task dates and his area belongs to next week's package.",a:3,row:6},
    {q:"Junction box placement on a ceiling grid, inside the standards, can be moved later at no cost, and the same detail was accepted on Level 2.",a:0,row:0}
  ],
  routes: ["Lead decides","Client RFI","Client RFI, copy the GC","Eracore PM"],
  form: [
    {sec:"1.1 Conduit fill",items:[
      {id:"f1",q:"Maximum of 3 single-phase circuits (3-wire) in a single conduit",type:"yn"},
      {id:"f2",q:"Maximum of 2 single-phase circuits (4-wire) in a single conduit",type:"yn"},
      {id:"f3",q:"Only 1 three-phase circuit per conduit",type:"yn"}]},
    {sec:"1.2 Conduit spacing",chart:true,items:[
      {id:"f4",q:"The minimum raceway spacing chart governs all conduit installations",type:"yn"},
      {id:"f5",q:"Exceptions or special spacing requirements for specific areas",type:"text"}]},
    {sec:"1.3 Routing preferences",items:[
      {id:"f6",q:"Above ceiling / overhead routing accepted",hint:"Applicable scope, e.g. power and lighting branches",type:"text"},
      {id:"f7",q:"Underground / below slab routing accepted",hint:"e.g. MV feeders, telecom feeders",type:"text"},
      {id:"f8",q:"Embedded in-slab routing accepted",hint:"e.g. power branches",type:"text"},
      {id:"f9",q:"Exclusion zones (stairwells, elevator shafts, telecom/IDF rooms, others)",type:"text"},
      {id:"f10",q:"Minimum separation, power vs low-voltage",type:"sel",opts:["24\"","12\"","6\""]},
      {id:"f11",q:"Power conduits do not pass through IDF/MDF rooms unless serving them",type:"yn"},
      {id:"f12",q:"3\" clearance from building corners and door rough openings",type:"yn"}]},
    {sec:"2.1 Interior overhead — material",items:[
      {id:"f13",q:"EMT is the project standard for interior overhead conduit",type:"yn"},
      {id:"f14",q:"Material applies to all systems (power, FA, telecom, security, BMS, A/V)",type:"yn"},
      {id:"f15",q:"Alternative materials for wet, high-temperature or mechanical areas",type:"text"}]},
    {sec:"2.2 Bends, fittings and access points",items:[
      {id:"f16",q:"Permitted and preferred bend angles",hint:"5°, 10°, 11.25°, 15°, 22.5°, 30°, 45°, 60°, 90°",type:"text"},
      {id:"f17",q:"Special bend geometry needs a design deviation before installation",type:"yn"},
      {id:"f18",q:"Saddle configurations permitted (3-point / 4-point)",type:"text"},
      {id:"f19",q:"Conduit bodies permitted instead of field bends (C, LB, LL, LR, T, X)",type:"text"},
      {id:"f20",q:"Max cumulative bend between access points — power & lighting",hint:"Default 360°",type:"text"},
      {id:"f21",q:"Max cumulative bend — telecom, security, BMS, A/V",hint:"Default 180°",type:"text"},
      {id:"f22",q:"Max run length between access points — power feeders / branch circuits",hint:"Default 200 ft / 150 ft",type:"text"},
      {id:"f23",q:"Access point segregation (per panel, per voltage, per discipline)",type:"text"}]},
    {sec:"3.1 Below-grade — material",items:[
      {id:"f24",q:"PVC Schedule 40 in concrete-encased duct banks",type:"yn"},
      {id:"f25",q:"PVC Schedule 40 for direct-buried conduit",type:"yn"},
      {id:"f26",q:"Alternatives under roadways, contaminated soil or high-load zones",type:"text"}]},
    {sec:"3.2 Below-grade — sweeps and bends",items:[
      {id:"f27",q:"Long-radius sweep standard for all sizes",hint:"Default 180\"",type:"text"},
      {id:"f28",q:"Sweeps counted in the accumulated bend total between access structures",type:"yn"},
      {id:"f29",q:"Max cumulative bend between access structures — power / telecom",hint:"Default 360° / 180°",type:"text"}]}
  ]
};
