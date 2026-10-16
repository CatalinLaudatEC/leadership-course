# Eracore Learning Center — Team Leader Raising Program (Leadership Course)

Full handoff for recreating, continuing or extending this project in a new chat.

- **What it is:** a single self-contained HTML/CSS/JS web app that turns five Eracore Word documents into an interactive learning platform.
- **Status:** working demo, published as a claude.ai artifact, about 360 KB in one file.
- **Built:** October 2026, iterated over five rounds:
  1. analysis
  2. first demo
  3. dashboard restyle
  4. full document coverage
  5. animation layer

---

## 1. How to use this in a new chat

### Option A — continue editing the finished page (fastest)

1. **Upload:**
   - `dist/leadership-course-demo.html` — the complete, working code.
   - This `RECREATE.md`.
   - Optionally the five `.docx` files from `source/`.
2. **Paste this prompt:**

> I'm continuing a project. Attached is `leadership-course-demo.html`, a finished single-file learning platform, and `RECREATE.md`, which documents its architecture, data model, design system and every feature. Read RECREATE.md fully first, then the HTML. Keep the existing architecture, design tokens, state schema (localStorage key `tlrp-demo-v3`) and animation layer. Publish the result as an HTML artifact. My change request is: **[describe change]**

### Option B — rebuild from the source documents (reproducible)

1. **Upload:** the whole `bundle/` folder (zip it), plus this file.
2. **Run:** `pip install python-docx` then `bash build/build.sh`.
3. **Check the result:** it writes `dist/leadership-course-demo.html` and is byte-identical to the published version.
4. **Edit the pieces, not the output:**
   - `build/base.html`, `build/docs_view.js`, `build/fx.js`, `build/*.css`, `build/course.js`.
   - Then rebuild.

### Option C — recreate from scratch with no files

- Give the new chat this file plus the five `.docx` documents.
- Ask it to follow sections 3–9 exactly.

---

## 2. Background and context

- **Owner:** Catalin Laudat, System Administrator & Automation Engineer, Eracore.
  - Eracore is a multi-brand AEC/BIM company: eracore.com, nexeradesign.com, genusys.ai, eracoretraining.com.
- **The original request (from management):**
  > Need you guys to work on a system to create training programs for the team to add to the learning center. The goal would be for us to provide the documentation, requirements, course outline, and you guys can develop the structure, the engagement (answers and questions, etc.) and videos. We can create a Claude project that we can all work out of and load in a bunch of .md files into the context. This is the documentation for the first course we have to create. It's a Leadership Course.
- **Key insight from the analysis:**
  - The leadership course is not a self-paced e-learning course. It is a 10-week, mentor-assessed, on-the-job competency program.
  - The rule is "assessed on behavior, not attendance".
  - So the product is a program platform (content + progress + evidence + mentor sign-off + checkpoint), not just slides and quizzes.
  - It must be data-driven so the next course is a new data file, not new code.
- **Visual brief:**
  - Match the user's existing **Eracore Admin** dashboard.
  - Dark navy UI, blue accent, KPI tiles with icon squares, a grouped sidebar with uppercase group labels.
  - Then "flashy and professional": animations, glow, tilt, pop-ups.

---

## 3. Source documents (all five are covered in full)

| Key | File | What it is | Sections in app |
|---|---|---|---|
| `program` | Team_Leader_Raising_Program_2.docx | The program: 2 phases, 15 competencies, 10 weeks, proficiency levels L1–L4, background habits, weekly competencies, Phase 1 checkpoint, final assessment, sign-off record. Contains a **diagram image** ("How the Program Is Built"). | 15 |
| `workflow` | Team_Communication_Workflow.docx | Daily operating rhythm for team leads: 8 phases, daily cycle table, escalation path table, guidance. | 12 |
| `standards` | Project_Technical_Standards.docx | Project Technical Standards & Preferences Form. Fill, spacing (contains a **spacing chart image**, Table 2a), routing, interior overhead, bends & fittings, below-grade. | 7 |
| `candidate` | Phase_1_Scenario_Test_Candidate.docx | Phase 1 checkpoint: 10 situations with 2–4 questions each, plus a bonus question. | 12 |
| `mentor` | Phase_1_Scenario_Test_Mentor.docx | Mentor version, **not for circulation**: required elements and wrong turns per situation, marking scale, score sheet, outcome. | 15 |

**Coverage was verified programmatically.** Every paragraph and table cell in every document was checked against the app data. The only differences are cosmetic transforms:
- Banner headings are split into kicker + title.
- `☐` in table headers is removed.
- Placeholders such as `[Type FOW here…]` become input placeholders.

**The two content images were rebuilt as interactive components:**
- **Program diagram:** Phase 1 box, six weeks each with a "Hands in" line, a "Running in the background from Week 3" box, the checkpoint bar, the Phase 2 box with "Facing the client" and "Leading people", and the legend. It is transcribed as data (`DIAGRAM` in `docs_view.js`).
- **Spacing chart:** "Table 2a: Minimum Raceway Spacing — Distance Between Centers in Inches at Junction and Pull Boxes (Allows Approximately ¼-inch Spacing Between Locknuts)".
  - A 12×12 lower-triangular matrix for trade sizes ½ ¾ 1 1¼ 1½ 2 2½ 3 3½ 4 5 6.
  - Transcribed as `SPACING` in `docs_view.js`.
  - Rendered as a heat-map table with a two-select calculator.

The header and footer images are only the Eracore logo and a gradient line. Their cyan→purple gradient is reused as the document header strip.

---

## 4. Architecture

```
bundle/
├─ RECREATE.md                 ← this file
├─ source/                     ← the 5 original .docx files
├─ dist/
│  └─ leadership-course-demo.html   ← THE FINISHED APP (single file, open in any browser)
└─ build/
   ├─ build.sh                 ← runs the whole pipeline
   ├─ parse.py                 ← docx → comps.json (15 competencies), scen.json (10 scenarios)
   ├─ normalize_weeks.py       ← adds weekLabel / theme / phase to competencies
   ├─ dparse.py                ← docx → docs_raw.json (every paragraph/table/run with bold+italic)
   ├─ build_docs.py            ← docs_raw.json → docs.json (sectioned, typed block model)
   ├─ base.html                ← app shell: CSS design system + engine + views (dashboard style)
   ├─ course.js                ← COURSE object (levels, workflow summary, escalation, drill, routes…)
   ├─ docs.css / docs_view.js  ← document reader engine + doc-specific widgets
   ├─ integrate.py             ← merges docs_view/docs.css into base.html → stage2.html
   ├─ fx.css / fx.js           ← animation & interaction layer
   └─ fx.py                    ← merges FX into stage2.html, injects JSON → dist/…html
```

**Build pipeline:**
1. `parse.py` → `comps.json`, `scen.json`
2. `normalize_weeks.py`
3. `dparse.py` → `docs_raw.json`
4. `build_docs.py` → `docs.json`
5. `integrate.py` → `stage2.html`
6. `fx.py` → final HTML, with placeholders `/*COURSE*/`, `/*COMPS*/[]`, `/*SCEN*/[]`, `/*DOCS*/{}` replaced by the data.

**Runtime:**
- One `<script>` contains the data constants (`COURSE`, `DOCS`) → engine → views (`V.*`) → document engine → FX engine → router & events → `render(false)`.
- No frameworks. Only Google Fonts (Inter) is loaded externally.
- It runs as a published claude.ai artifact or as a local file.

### 4.1 Document model (`docs.json`)

```js
DOCS[key] = { key, title, subtitle:[...], closing:"italic closing line" | null,
  sections:[ { id:"s0", title, kicker:"WEEK 1"|"Situation 3"|"", meta:["Phase 1","Competency 1"], group:"1.0 GENERAL"|"", num?:3, blocks:[…] } ] }
```

| Block `t` | Meaning / rendering |
|---|---|
| `p` | paragraph `segs:[[text,bold,italic]]`. A bold lead such as "Who this program is for." is rendered as a blue lead-in |
| `bullets` | items from "—  " dash-bullets |
| `head` | bold sub-heading, e.g. "Approved Routing Methods:" |
| `note` | italic line, e.g. "Two meetings per day…" |
| `callout` | 1×1 table → highlighted box (bonus callout gets an answer textarea in the candidate doc) |
| `fields` | header form fields (Candidate Name, Start Date…) → inputs; date-typed when the label matches `\bdate\b` or ends in "on" |
| `levels` | L1–L4 lines → 4 cards, L3 marked as the target |
| `sub` | "N — Title" competency header (program) or "Also this week — …" |
| `def` | 2-column label/value table (Purpose, Uses, What good looks like, Common failures, Practice task, Sign-off, Situation, Questions, Required elements, Wrong turns, Team, Lead…) |
| `table` | data table: `head`, `rows` of cells `{k:"text"|"check"|"input", id, ph}` |
| `yesno` | "Yes / No:" box → Yes/No toggle (+ details textarea if extra rows) |
| `notes` | empty N×1 table → textarea, with label from the preceding paragraph |
| `image` | `program-diagram` or `spacing-chart` component |

**How sections are split:**
- Banner tables (WEEK, WEEKS, CHECKPOINT, FINAL, PHASE, ROUTING, GUIDANCE, BONUS).
- Named bold headings ("Documents You Will Need", "How the Program Is Built", "Proficiency Levels", "Running in the Background", "Competency Sign-Off Record", "Daily Workflow Cycle", "Marking Scale", "Score Sheet", "Outcome").
- Heading 2 in the standards form, grouped under its Heading 1.
- In the test documents, each "N — Situation".

### 4.2 Routes (hash router)

| Route | View |
|---|---|
| `#/` | Overview dashboard |
| `#/map` | Program map (conduit route + filterable/searchable competency cards; `?f=done|progress|todo|p1|p2`) |
| `#/c/N` | Competency N (tabs: Overview, Practice task, Quick check, Evidence & sign-off) |
| `#/doc/{program|workflow|standards|candidate|mentor}` | Document reader (`?sec=sN` opens and scrolls to a section) |
| `#/drill` | Escalation drill (10 practice situations) |
| `#/logs` | Decision log and change log |
| `#/record` | Sign-off record + final assessment |
| `#/engine` | "How it's built" |

Aliases: `#/workflow` → workflow doc, `#/form` → standards doc, `#/checkpoint` → candidate doc.

### 4.3 State (localStorage key `tlrp-demo-v3`, all reads/writes wrapped in try/catch)

```js
{ role:"candidate"|"mentor",
  ui:{theme:"dark"|"light", collapsed, w1 /*standards Week-1 fields on*/, welcomed},
  profile:{name, start /*program start date → current week*/, mentor},
  sign:{[compId]:{level,mentor,date,note}}, evidence:{[compId]:url}, qc:{[compId]:score0to6},
  drill:{i, r:{[idx]:routeIndex}}, decisions:[{date,q,c:"Decide"|"Ask",r}], changes:[{date,q,r,h,c}],
  answers:{[situation]:[...], bonus:[text]}, marks:{[situation]:{ok,note}},
  elem:{[situation]:{[i]:bool}}, wrong:{[situation]:bool}, final:{[0..2]:bool},
  read:{[docKey]:{[sectionId]:true}}, inp:{[widgetId]:value}, src:{[id]:source}, comp:{[id]:"Yes"|"No"|"Not checked"}, gap:{[id]:bool} }
```

**Status and derived values:**
- A competency's status comes from its level: L≥3 = done; any level, evidence or quick-check score = in progress.
- Current week = weeks since `profile.start` + 1, clamped to 1–10.

**Sample data** (`sample()`) is loaded on first open: Week 5, competencies 1–3 at L3, 4–5 at L2, 6–7 at L1, partly filled standards form, logs, a few answers and reading progress. The profile menu has "Load sample progress" and "Start empty".

---

## 5. Design system

**Font:** Inter (Google Fonts) with a system fallback. Base size 14.5px, h1 1.6rem/600.

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | #0F131A | #F3F5F9 |
| `--side` (top bar, sidebar) | #11161F | #FFFFFF |
| `--panel` (cards) | #161B25 | #FFFFFF |
| `--panel-2` | #1B212D | #F6F8FB |
| `--border` | #252C39 | #E1E6EE |
| `--text` / `--muted` | #E7EAF0 / #9AA3B2 | #141A24 / #5E6878 |
| `--blue` / `--blue-strong` | #7AA3F7 / #5B8DEF | #3E73E0 |
| `--green` | #4CC38A | #22A06B |
| `--amber` | #F0A63A | #D98A14 |
| `--red` | #EF6B6B | #D64545 |
| `--purple` / `--teal` | #A78BFA / #2DD4BF | #7C3AED / #0D9488 |
| `--grad` | `linear-gradient(135deg,#22D3EE,#5B8DEF 45%,#A855F7)` (brand cyan→blue→purple) | same |

**Theme mechanics:**
- Light tokens are the base.
- Dark tokens apply under `@media (prefers-color-scheme:dark)` guarded with `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
- The theme toggle sets `data-theme` on the root element.

**Layout:**
- 64px sticky top bar (logo "ERACORE | Learning Center", search-everything button, theme, bell, avatar with CANDIDATE/MENTOR badge and dropdown).
- 272px grouped sidebar (PROGRAM / DOCUMENTS / PRACTICE / ASSESS / ABOUT), with count badges and a collapse chevron down to a 72px icon rail.
- Content max-width 1500px.

**Components:**
- Cards: radius 12, 1px border.
- KPI tiles: 46px icon square + label + big number.
- Chips: status pills.
- `.pbar` progress bars, `.ring` progress rings, donut, SVG charts with a hover tooltip.
- `.toggle` segmented buttons, tabs, accordions (`.dsec`), toast, modal, command palette.

**Responsive:**
- At ≤1280px the grids drop to 2–3 columns.
- At ≤1100px they become single-column and the document contents panel stops being sticky.
- At ≤860px the sidebar becomes an off-canvas drawer behind a Menu button, tables scroll horizontally, and the page never scrolls sideways.
- Safe-area insets are handled.

---

## 6. Features by screen

### Overview (`#/`)
- **Greeting** that changes with the time of day, the date, the current week and the signed-off count.
- **Role-aware buttons:**
  - Candidate: "Open checkpoint" and "Continue: competency N".
  - Mentor: "Sign-off record" and "Mark checkpoint".
- **4 KPI tiles:** signed off /15, current week, checkpoint answered /10, open standards questions.
- **Documents card:** 5 tiles showing read % and section count; the mentor tile is locked for candidates.
- **Level by competency** bar chart (L0–L4, dashed Target L3 line, Phase 1/2 split, click a bar to open it).
- **Overall progress** donut plus a progress bar per phase.
- **Program timeline:** 10-week Gantt chart, current-week marker, clickable competency chips, checkpoint row, background-habits row.
- **Up next** (next 5 competencies not yet done).
- **Needs attention** (computed): standards gaps, missing evidence, low quick-check scores, unread program/workflow, open checkpoint situations from Week 5, flagged scope changes, and (for mentors) answered-but-unmarked situations.
- **Jump to** grid.

### Program map (`#/map`)
- Conduit-run SVG: Phase 1 runs right into the Checkpoint pull box, then Phase 2 runs back to Final.
- Each box is coloured by status, and the completed run is drawn in green.
- Filter pills, search, and competency cards with a 4-segment level bar.

### Competency (`#/c/N`)
- Header with a number badge, chips, a link to the document it uses, and "Read in program document" (deep link to the right week section).
- **L1–L4 stepper:** the mentor clicks a level to set it.
- **Overview tab:** purpose, what good looks like (✓) and common failures (✗), plus a video placeholder.
- **Practice task tab:** the task and the sign-off criterion.
- **Quick check tab:** 6 statements to sort as Good or Failure (deterministic shuffle), scored out of 6.
- **Evidence & sign-off tab:** SharePoint link field; for mentors, name, date and notes.

### Document reader (`#/doc/key`) — the same engine for all five
- Header with the gradient strip, title, subtitle chips, section count, reading time, read count and a read % ring.
- **In-document search:** filters sections and highlights matches with `<mark>`. Expand all / Collapse all.
- Sticky contents panel with read ticks and per-document markers:
  - Standards: answered counts per section.
  - Candidate: answer-state dots.
  - Mentor: marking dots.
- Accordion sections with smooth expand. Closed sections are `inert`.
- Each section ends with "Mark as read" and "Next: …".
- **Return bar:** opening a document from another page (e.g. "Open Team Communication Workflow" on a competency's Practice task tab) shows a sticky "Back to 7. Writes Tasks… · Practice task" pill. It, and the browser's Back button, return to the same competency tab and scroll position. It survives jumps between documents and clears on leaving the documents (`RET`, `trackReturn()` in the router, `retBar()` in `docs_view.js`).

**Document-specific additions:**
- **Program:**
  - Header fields (Candidate Name, Start Date, Mentor Name, Target Sign-Off Date, Current Project, Role Today).
  - The documents table links to the other documents.
  - Interactive program diagram.
  - Level cards.
  - Competency headers with status and an "Open competency" link.
  - A live final assessment and a live sign-off record (mentor edits levels).
- **Workflow:**
  - "Cycle at a glance" 8-phase stepper (the deep dive is dashed because it is held only when triggered).
  - Clickable cycle-table rows.
  - Phase rules shown as card grids.
  - Escalation table with colour-coded routes (Lead decides = green, Client RFI = blue, RFI + copy GC = purple, Eracore PM = amber).
  - "Engineer sections only" filter: phases 2, 3, 4 and 8, as the document specifies.
- **Standards form:**
  - Every Yes/No question is a toggle, every matrix is a checkbox table, every value cell (max bend, run length, sweep radius) is an editable input that keeps its default, and every remarks field is a textarea.
  - Optional **Week 1 task row** per item (Competency 1 practice task): Source, Model complies?, Mark as gap.
  - Summary panel: answered ring, non-compliant count, and "Open questions for the PM" with a copy button.
  - Spacing-chart calculator.
- **Candidate test:**
  - An answer textarea under every question, saved as you type.
  - A dot strip for situations 1–10 plus ★ bonus, and per-situation "x/y answered" chips.
- **Mentor test** (locked for candidates):
  - The candidate's answers appear inline.
  - Required elements are tick-boxes with a progress bar.
  - "Flag a wrong turn" toggle.
  - Verdict chip: All elements present / Incomplete / Wrong turn.
  - Complete checkbox and notes.
  - The score sheet and the outcome "Answers complete out of ten" are synced automatically.

### Escalation drill (`#/drill`)
- 10 practice situations, written separately from the checkpoint's 10 situations.
- 4 route buttons; feedback cites the matching escalation-table row.
- Result ring and a breakdown by route.

### Logs (`#/logs`)
- KPI tiles.
- **Decision log:** date, question, Decide/Ask, reasoning, with a decide/ask ratio bar.
- **Change log:** date, request, why it is out of scope, hours, status (Flagged / With PM / Priced / Declined), with an hours-per-change bar.

### Sign-off record (`#/record`)
- Count per level, the 15-row record (mentor edits the level select) and the 3-part final assessment.

### Global
- **Role switch** (Candidate/Mentor), theme toggle, sidebar collapse.
- **Command palette:** `Ctrl/⌘K` or `/` searches pages, competencies, every document section and section body text.
- Bell shows a dot when something needs attention.
- Toasts confirm saves.

---

## 7. Animation and interaction layer (`fx.css` + `fx.js`)

- **Splash:** about 1.15s logo with a spinning conic glow and a gradient loading bar.
- **Welcome modal** on first visit, with confetti.
- **Background:** three blurred brand-colour shapes drift slowly; the top bar and sidebar are frosted glass.
- **Navigation:**
  - Gradient loading bar under the top bar on every route change.
  - Reading-progress bar.
  - Back-to-top button after 700px of scroll.
- **Page entrance:**
  - `afterRender(changed)` adds `.anim-in` only when the view changes, so re-renders while typing or ticking don't replay it.
  - Staggered rise for up to 40 elements.
  - Numbers count up: KPIs, rings, donut legend.
- **Charts:**
  - Bars grow with a spring, timeline bars sweep, rings fill from 0 (CSS var `--a`), the donut spins in, the conduit live path draws itself, route boxes pop in one by one.
  - Hover: scale plus glow.
- **Hover:**
  - Tilt and lift: 3D perspective tilt following the cursor on KPIs, document tiles, competency cards, level cards, rules, drill choices, diagram boxes and jump links. Large elements get a weaker tilt. Mouse pointers only.
  - Spotlight: a radial glow follows the cursor on all cards.
  - Shine: a light sweep on cards and buttons.
  - Glowing borders.
- **Buttons:** gradient primary, lift + glow on hover, press-down scale, ripple at the click point.
- **Nav:** slide on hover, icon spin/scale, gradient active marker with glow.
- **Headings:** slow animated gradient sheen.
- **Feedback:**
  - Correct answers pop with a green glow; wrong answers shake.
  - Checkboxes pop.
  - Progress bars carry a travelling shine.
  - Smooth `grid-template-rows` accordion.
- **Modals:** glass panel, rotating conic-gradient border (`@property --ang`), shine sweep, spring scale-in.
  - The **celebration watcher** (`watch()`, called from `renderChrome`) compares before/after metrics and fires:
    - Document complete (confetti + next-document button).
    - Competency reached L3 (confetti).
    - Drill finished (score).
    - All ten checkpoint situations answered (shows the document's closing line).
    - Perfect quick check (confetti burst).
- **Theme switch:** circular reveal from the toggle using the View Transitions API, with a graceful fallback.
- **Confetti:** lightweight canvas particle system.
- **Accessibility:** `prefers-reduced-motion` disables every animation and transition, the background glow, confetti and tilt.

---

## 8. Known issues found in the source documents (raise with the documents' owner)

1. **Checkpoint format conflict.** The program doc says "Verbal, open book, 30 to 60 minutes". The candidate test says "Open book, 60 to 90 minutes, written". The mentor version doesn't say.
2. **Mentor key contradicts the workflow (Scenario 3).**
   - The workflow's deep-dive trigger: "A decision affects more than one person or more than one area". Two engineers = more than one person.
   - The mentor key says a two-person topic does *not* trigger it.
   - Marking is all-or-nothing, so a candidate who quotes the document is marked wrong.
3. **The diagram contradicts the text.**
   - The diagram says the background track runs "from Week 3"; the text says start early, listen from Week 1, check list from Week 2.
   - The diagram's Week 3 "hands in" is a "planted-defect result"; the text's Week 3 task is five sets accepted by the team lead with no comments.
4. **Minutes timing.** Competency 12's task says within two hours; its good-looks-like and the final assessment say same day.
5. **Decision log start.** "Start early" vs "since Week 3".
6. **The standards form has no Source or Compliance columns,** but the Week 1 task requires both. The app adds them as an optional Week 1 row.
7. **The standards form doesn't cover** working clearance, equipment space or supports, although the program says the form covers "access and clearance". The spacing chart is an image from a third-party table, so confirm its source before republishing it.
8. **Sign-off criteria that need measurable definitions:**
   - Comp 7 ("no clarifying questions"; 25% estimate accuracy, per task or in aggregate?).
   - Comp 9 (only the delay letter is assessed).
   - Comp 4 (five clean checks in one week).
   - L4 is never tracked.
9. **Typos:** "it's sequence", "whishes", "Unclear wide not specific", "could easily causes", "without notify", "Type FOW here", "11.25" without a degree symbol, empty rows in the sweep table.

---

## 9. Demo limits and production path

- **Progress is per browser** (localStorage). Production needs sign-in and shared storage so mentor and candidate see the same record.
  - Options: Azure Static Web Apps + Entra ID + a small API/Table storage, SharePoint Lists via Graph, or SCORM/xAPI packaging if the Learning Center is an LMS.
  - Graph/app-registration consent routes through a Global Admin.
- **The mentor marking key ships inside the page.** It is hidden behind the role switch, but anyone can read it in the page source. Production must serve it from the server to mentors only.
- **Videos** are placeholders (one slot per competency). Scripts can be generated from the competency data.
- **Evidence** is a SharePoint link per competency. The app never stores files.

---

## 10. How to extend

- **New course:**
  - Replace the five `.docx` files in `source/`, adjust `CFG` and the section-head names in `build_docs.py`, update `course.js` (levels, drill, routes, final), then run `build.sh`.
  - The reader, widgets, palette and animations adapt automatically.
- **New document type:** add a key in `CFG` (build_docs.py) and in `DOC_META` (docs_view.js), and add nav and overview entries.
- **New widget:**
  - Add the block type in `build_docs.py`'s `conv_table`/paragraph rules.
  - Render it in `renderBlock()`.
  - Bind its state through `data-*` attributes handled in the delegated `click`/`change`/`input` listeners.
- **Editing the finished file directly:** the logical order inside the single `<script>` is:
  1. `COURSE`
  2. `DOCS`
  3. state/helpers
  4. icons `I`
  5. `NAV`/chrome
  6. charts
  7. views `V.*`
  8. document engine
  9. FX engine
  10. router/events
  11. `render(false)`

### Event/data-attribute map (delegated listeners)

| Attribute | Action |
|---|---|
| `data-go` | navigate to the hash |
| `data-tab` | competency tab |
| `data-setlvl` | mentor sets level from the stepper |
| `data-rec` | level select in the record |
| `data-sec` | toggle an accordion section |
| `data-jump="doc:sN"` | open and scroll to a section (crosses documents) |
| `data-read` | mark a section read |
| `data-next` | mark read and go to the next section |
| `data-expand` / `data-collapse` | expand / collapse all sections |
| `data-yn` | Yes/No toggle |
| `data-chk` | table checkbox |
| `data-inp` | text/date/select input |
| `data-src` / `data-comp` / `data-gap` | Week 1 task row (source / complies / gap) |
| `data-ans` + `data-k` | candidate answer |
| `data-mark` / `data-mnote` | mentor complete flag / mentor notes |
| `data-elem="n:i"` | mentor required-element tick |
| `data-wrong` | flag a wrong turn |
| `data-final` | final assessment item |
| `data-spc` / `data-sp` | spacing chart cell / selects |
| `data-route` | drill answer |
| `data-filter` | program map filter |
| `data-add` / `data-del` / `data-log` | log rows |
| `data-role` | role switch |
| `data-act` | sample/reset data |
| `data-mclose` | close modal |
| `data-pi` | palette item |
| `data-w1` | toggle Week 1 fields |
| `data-wfeng` | engineer-sections filter |

---

## 11. Original analysis recommendations (still valid)

- Build the course as a **data-driven engine** so the Claude Project becomes a pipeline:
  - `/source` — the documents as `.md`.
  - `/schema` — the course JSON schema.
  - `/prompts` — quiz, scenario and video-script generators.
- The engine renders whatever the course team supplies.
- **Engagement that fits this material:**
  - routing drills from the escalation table
  - good-vs-failure sorting
  - fillable working tools (standards form, logs, task writer, minutes, delay letter)
  - new practice scenarios, keeping the real ten for the checkpoint
  - short videos, 2–4 minutes per competency
- **Before production:**
  - Confirm the Learning Center platform (LMS → SCORM/xAPI; SharePoint or Azure → web app with Entra sign-in).
  - Resolve the document conflicts in section 8.
  - Move mentor content server-side.
