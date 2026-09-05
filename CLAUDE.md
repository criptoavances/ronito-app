

# **PART 1**

# **RONITO — Product Brief**

## **What This App Is (read this first — it defines every decision below)**

Ronito is **not** a to-do list app, **not** a calendar app, and **not** a planner app. Do not build something that ends up feeling like Todoist, Notion, or Google Calendar with different colors. Ronito is a **Daily Life OS** standing on four pillars that must all be genuinely present and visible — not one dominant feature with three afterthoughts bolted on:

1. **Productivity & Time Management** — goal hierarchy, time-blocking, task capture, calendar  
2. **Gratitude & Reflection** — morning gratitude, evening reflection, the "WHY" reminder system  
3. **Mindfulness & Health** — a real meditation/breathwork space, exercise reminders  
4. **AI Companion** — a voice-based AI that talks *with* the user, not a chat window you type into

If a build decision makes the app feel like "yet another productivity app," it's the wrong decision. Goal-setting, gratitude, and mindfulness are not secondary — they carry equal weight to the task list.

## **Founder Context**

Solo, non-technical founder (Ronny) building this himself using Claude Code, without a hired development team. Trilingual: Spanish, English, German — all three are launch-day target markets, not an afterthought. Named after his son (Roni / "Ronito" \= "little Ronny").

## **Brand**

* Name: **Ronito**  
* Positioning line: "Your AI Life Manager" / "Your Second Brain"  
* Tone: warm, motivating coach — never clinical or corporate  
* Colors: purple/blue gradients as primary, gold/yellow as the accent used specifically for WHY-reminder and gratitude moments

---

## **🟢 V1.0 — BUILD THIS NOW**

### **Onboarding (one-time setup flow)**

* Record BIG GOAL / WHY (voice, with text fallback)  
* Set yearly goals (3), monthly goals (3), weekly goals (3)  
* Define daily time blocks: work, personal/family, exercise, and a "catch-all" block for unplanned things  
* Create custom idea folders (e.g., books to read, business ideas, travel plans — user names these themselves)  
* Set special dates (birthdays, anniversaries)  
* Choose WHY-reminder frequency (30 min / 1 hr / 2 hr)  
* Choose the AI's voice (see Voice Persona below)

### **Pillar 1 — Productivity & Time Management**

* Goal hierarchy: Big Goal → Yearly → Monthly → Weekly → Daily (3 non-negotiable goals/day)  
* Visual daily calendar, color-coded time blocks  
* Google Calendar two-way sync  
* Voice task capture ("remind me to…"), voice idea capture into folders  
* Move / reschedule / cancel tasks by voice  
* Anti-distraction nudges when the user drifts from a planned block  
* Progress tracking: daily/weekly completion %, streak counter, simple dashboard

### **Pillar 2 — Gratitude & Reflection**

* Morning: greeting \+ display/spoken reading of the chosen goal level, voice gratitude prompt (3 things), voice-set daily goals  
* Evening: end-of-day summary (what got done, what didn't, and why), 3 good things (voice), rate the day 1–10, free-form voice journal entry, tomorrow preview  
* WHY reminders recur through the day per the user's chosen frequency, spoken or shown as text per preference

### **Pillar 3 — Mindfulness & Health**

* **Meditation & Mindfulness space** (build now, keep it simple):  
  * Users can **upload their own meditation audio/video** for personal use  
  * Users can also receive a small set of **AI-recommended/curated meditation sessions** (a starter library — this doesn't need to be large for V1.0)  
  * A simple guided breathing exercise built in  
* Basic daily exercise reminder (full video library comes in V2.0 — see below)

### **Pillar 4 — AI Companion (voice, both directions)**

* Voice **input**: user speaks tasks, goals, gratitude, and journal entries (Whisper API — Spanish/English/German)  
* Voice **output** — the AI Voice Persona: it can *speak* to the user, not just receive voice  
  * Morning: "Good morning\! How are you? Tell me your three goals for today" — spoken aloud, waits for a spoken reply  
  * Evening: "Tell me three things you're grateful for today" — spoken aloud, waits for a spoken reply  
  * WHY reminders can be read aloud  
  * User picks a voice at setup (gender/tone)  
  * Loop: TTS speaks prompt → Whisper transcribes reply → AI (Gemini) processes → TTS responds  
  * Voice engine: ElevenLabs for the emotionally-important moments (WHY reminders, evening reflection) where realism matters; Google Cloud TTS or Amazon Polly as a cheaper fallback for routine notifications if cost becomes an issue at scale  
* AI chat: "what should I work on next," "how am I doing on my goals," motivational messages  
* Authentication: Google OAuth (primary), username/password \+ JWT (backup)

### **V1.0 AI/Tech Stack**

* **Google Gemini 2.0 Flash** — parsing voice commands, journal summarization, motivational messages, scheduling suggestions  
* **Whisper API** — voice-to-text  
* **ElevenLabs** (primary) / **Google Cloud TTS** (cost fallback) — voice output  
* **Google Calendar API** — calendar sync  
* **Google OAuth** — auth

---

## **🟡 V2.0 — DOCUMENTED NOW, DO NOT BUILD YET** 

Design the V1.0 data model with these in mind so V2.0 doesn't require a rebuild — but do not implement them yet.

* **Full Health & Wellness library**: office-friendly exercise videos (no equipment needed), expanded meditation/breathwork library, possible Wim Hof Method partnership  
* **Mood tracking**: daily mood log, trend graphs, energy/stress levels, correlations  
* **Habit streaks with visual graphs**, weekly/monthly/quarterly review summaries with AI coaching commentary, pattern recognition (e.g., "you've skipped exercise 3 Mondays in a row")  
* **Email management**: forward emails to Ronito → AI summarizes → drafts a reply → user approves and sends  
* **"Running Late? AI Rescue Mode"**: detects a meeting running over, drafts a reschedule message, sends it via WhatsApp/Email/SMS (user approves each message before it sends), cascades the change to affected meetings  
  * ⚠️ **Blocked on:** a real registered business, a business website, and Meta Business verification for WhatsApp Business API (this typically takes 1–5 business days once documents are correct and cannot be sped up with better AI — it requires an actual legal business behind it). Start this process as its own track once V1.0 is live.  
* **WhatsApp connector for AI-answered messages** (as requested — flagged for later, not built now): connects to WhatsApp so incoming messages can be summarized and optionally auto-answered by AI. Same WhatsApp Business API dependency as above.  
* Idea folder upgrades (voice search, better categorization, export)  
* Quarterly goals added to the hierarchy  
* Team/family sharing: shared goals, task delegation, family calendar visibility

---

## **🔵 V3.0 — FUTURE VISION, DOCUMENTED NOW, DO NOT BUILD YET** 

* **Unified inbox**: WhatsApp, Telegram, Slack, Instagram, Facebook Messenger, AI-prioritized  
* **Voice cloning**: AI drafts and sends responses in the user's own voice/style  
* **AI call screening**: answers calls with the voice clone, transcribes, summarizes, forwards only urgent calls  
* **Fully automatic cascading reschedules** — no manual approval step  
* **AI executive assistant tasks**: booking flights/hotels, research summaries, drafting documents, expense tracking  
* **Advanced health integration**: wearable sync (Apple Health, Fitbit), nutrition, sleep optimization, mental health check-ins  
* **Predictive intelligence**: flags an overbooked day before it becomes a problem  
* Language expansion beyond Spanish/English/German  
* Enterprise tier: SSO, team analytics, Slack/Teams integration

---

## **Monetization Context (not to be built yet, but relevant to how you architect feature-gating)**

| Tier | V1.0 price | Notes |
| ----- | ----- | ----- |
| Free | $0 | Limited goals, ad-supported, no voice |
| Pro | $15/mo | Full voice, WHY reminders, time blocking |
| Premium | $30/mo | Everything in Pro \+ priority features |

Architect feature access so tiers can be toggled per-user later without restructuring the database.

---

## **How You Should Work**

* The founder is **not** a professional software developer. Explain technical decisions in plain language before making them, not just in code comments.  
* **Confirm before**: signing up for any paid API/service, deploying anything publicly, or making any irreversible change (deleting data, overwriting files without a backup).  
* **Plan before you build.** Propose the architecture and the build order first; get a explicit "yes, go ahead" before writing code for each new slice of the app.  
* Build in **vertical slices** — one full working flow at a time (e.g., "onboarding end-to-end" before "morning routine end-to-end") rather than a little bit of everything at once.  
* Test each slice yourself (navigate it, check it visually, verify it actually works) before presenting it as done.  
* Only V1.0 features get built now. V2.0 and V3.0 exist in this document purely so you understand where the product is headed and can make architecture choices that won't need to be undone later.

—---------------------------------------------------------------------------------------------------------

​​