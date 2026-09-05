# Ronito — Project Status

**Date:** 2026-09-05  
**Session:** Backend Scaffold & Supabase Setup

---

## ✅ Completed

### Backend Scaffolding
- [x] Resumed Supabase project (was paused)
- [x] Extracted API credentials from Supabase dashboard
- [x] Created Python/FastAPI project structure
- [x] Configured environment variables (.env with Supabase URL + ANON_KEY)
- [x] Set up dependencies (requirements.txt with FastAPI, Supabase, Whisper, Piper)
- [x] Created initial route handlers for:
  - [x] Authentication (signup, login, Google OAuth stubs)
  - [x] Goals CRUD (list, create, update, delete, complete)
  - [x] Voice I/O (transcribe, synthesize, capture stubs)
  - [x] Health checks (service & database)
- [x] Initialized Supabase client service
- [x] Created project documentation (backend/README.md)

### Landing Page
- [x] Created `/landing/public/index.html` — single-file, self-contained page
- [x] Multilingual support (EN/ES/DE) with language switcher
- [x] Responsive design (mobile-first, Tailwind-equivalent CSS)
- [x] Color scheme: purple/blue gradients + gold accents on WHY moments
- [x] Hero, pain, three "moments" cards, founder story, footer
- [x] Waitlist email collection via form (client-side validation)

### Cloudflare Pages Deployment
- [x] Created `ronito-app` Pages project
- [x] Deployed landing page to `ronito-app.pages.dev`
- [x] Added Cloudflare Pages Functions for waitlist backend
- [x] Created KV namespace `WAITLIST` for email storage
- [x] Waitlist API endpoint `/api/waitlist` operational (stores emails)

### DNS & Domain Routing
- [x] Updated `ronito.app` DNS CNAME: `landings-2.pages.dev` → `ronito-app.pages.dev`
- [x] Proxied through Cloudflare (SSL-enabled)
- [x] Other 15 `ronito.*` domains remain on `landings-2` placeholder (untouched)
- [x] `ronito.site` remains on `domain-dashboard` (internal use)

---

## 🚀 Current Work

### Backend Foundation (Week 1)
- [x] **Day 1:** Supabase setup + backend scaffold ✅
- [ ] **Day 2:** Database schema (users, goals, ideas, journal_entries tables)
- [ ] **Day 3:** Auth endpoint with Supabase (JWT validation middleware)
- [ ] **Day 4:** Goals API working end-to-end with database persistence
- [ ] **Day 5:** Whisper integration (voice transcription)
- [ ] **Day 6:** Piper TTS integration (voice synthesis)
- [ ] **Day 7:** Full voice loop end-to-end testing

### Frontend Foundation (Week 2+)
- [ ] Next.js project setup with TypeScript
- [ ] Auth pages (login, Google OAuth flow)
- [ ] Dashboard layout (sidebar, main content area)
- [ ] Goals UI (create, list, hierarchy view)
- [ ] Time blocks visualization
- [ ] Integration with backend API

---

## ⚠️ Blocked / In Progress

### Custom Domain Registration
**Status:** CRITICAL BLOCKER — ronito.app still returns HTTP 522  
**Issue:** Custom domain not fully registered in Cloudflare Pages  
**Next Action (MANUAL):**
1. Go to Cloudflare Dashboard → Pages → ronito-app → "Custom domains" tab
2. Check if ronito.app is listed:
   - If "Verifying" → wait 5–10 min for SSL cert issuance
   - If not listed → click "Set up a custom domain" → enter `ronito.app` → Continue
   - If listed as "Active" → DNS is correct, but Pages may need reload
3. Once status shows "Active" → test: `curl -I https://ronito.app` should return HTTP 200

**Images:** All 5 pictures (RONITO LP 1-5.png) deployed with landing page. Auto-display on EN/ES/DE (same HTML, i18n text only).

**Status:** Landing page + images live at `ronito-app.pages.dev` ✅  
Waiting for: ronito.app custom domain verification ⏳

---

## 📋 Still To Do (Priority Order)

### Phase 0: Landing Page Final Checks
1. [x] Landing page deployed to ronito.app ✅
2. [x] Waitlist endpoint working ✅
3. [ ] **Verify 11 benefit images rendering correctly** on production
4. [ ] **Test waitlist end-to-end** on production
   - Submit test email, verify data via Cloudflare dashboard
   - Test all three languages (EN/ES/DE)

### Phase 1: Backend (THIS WEEK)
Priority breakdown:

1. **Database Schema** — CRITICAL BLOCKER
   - Create tables: `users`, `goals`, `ideas`, `journal_entries`, `time_blocks`
   - Run migrations via Supabase CLI or dashboard
   
2. **Authentication** — HIGH PRIORITY
   - Implement JWT validation middleware
   - Supabase `signUp()`, `signIn()`, `signOut()` methods
   - Google OAuth redirect flow

3. **Goals API** — HIGH PRIORITY
   - Persist goals to database
   - Implement goal hierarchy queries
   - Add completion tracking
   
4. **Voice Services** — MEDIUM PRIORITY
   - Install and test Whisper locally (or via API)
   - Install and test Piper locally (or via API)
   - Create voice capture endpoint
   
5. **Onboarding Flow**
   - Google OAuth login
   - Record Big Goal / WHY (voice + text fallback)
   - Set yearly/monthly/weekly goals
   - Define time blocks (work, personal, exercise, catch-all)
   - Create custom idea folders
   - Set special dates
   - Choose WHY reminder frequency & voice

2. **Daily Calendar + Tasks**
   - Visualize time blocks (color-coded)
   - Add/move/complete tasks by voice or typing
   - 3 non-negotiable daily goals
   - Goal hierarchy UI

3. **Voice System Foundation**
   - Whisper API integration (voice-to-text)
   - Task/idea capture by voice
   - Gemini 2.0 Flash parsing ("remind me to…", "add idea…")
   - ElevenLabs TTS setup (for WHY reminders, evening reflection)
   - First voice loop: user speaks → app responds

4. **Morning & Evening Routines**
   - Morning: greeting + goal display + voice gratitude capture + daily goals
   - Evening: day summary + 3 good things + day rating + voice journal + tomorrow preview

5. **WHY Reminders + Nudges**
   - Push notifications at user's chosen frequency
   - Gold-accent visual styling
   - Anti-distraction nudges when user drifts from time block

6. **Google Calendar Two-Way Sync**
   - Fiddliest phase — OAuth approval loops

7. **Meditation Space**
   - User upload personal audio/video
   - Starter library (AI-recommended sessions)
   - Guided breathing exercise

8. **Progress Dashboard**
   - Completion %, streaks, simple charts

---

## 🏗️ Tech Stack (Confirmed)

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Next.js (React) | App pages + landing page |
| Styling | Tailwind CSS | Purple/blue/gold palette |
| Database | Supabase (Postgres) | Auth, user data, session state |
| Hosting | Vercel | Automatic deployments |
| Voice Input | Whisper API | ES/EN/DE support |
| Voice Output | ElevenLabs + Google TTS | ElevenLabs for emotional moments |
| AI Brain | Gemini 2.0 Flash | Command parsing, motivational messages |
| Calendar | Google Calendar API | Two-way sync |
| Domains | Cloudflare DNS | ronito.app + others |

---

## 📁 Key Files & Paths

| Path | Purpose |
|------|---------|
| `/backend/main.py` | FastAPI entry point |
| `/backend/.env` | Supabase credentials (git ignored) |
| `/backend/requirements.txt` | Python dependencies |
| `/backend/app/config.py` | Settings management |
| `/backend/app/routes/auth.py` | Authentication endpoints |
| `/backend/app/routes/goals.py` | Goals CRUD endpoints |
| `/backend/app/routes/voice.py` | Voice I/O endpoints |
| `/backend/app/services/supabase_client.py` | Supabase client singleton |
| `/landing/public/index.html` | Landing page (single file) |
| `/landing/public/api/waitlist.js` | Waitlist storage function |
| `STATUS.md` (this file) | Session progress tracker |

---

## 💬 For Next Session

**Immediate Next Steps:**
1. **Run backend:** `cd backend && python main.py` to test server starts
2. **Create database schema** — start with `users` table for auth
3. **Implement Supabase auth** — get login/signup working
4. **Test goals API** — integrate database persistence

**Commands to Know:**
```bash
# Backend development
cd backend
source venv/bin/activate  # Activate virtual env
pip install -r requirements.txt
python main.py  # Start dev server on http://localhost:8000

# Test endpoints
curl http://localhost:8000
curl http://localhost:8000/api/health/check
curl -X POST http://localhost:8000/api/goals -H "Content-Type: application/json"
```

---

## 📊 Overall Progress

- **Landing Page:** ✅ 100% (live on ronito.app)
- **Backend Scaffold:** ✅ 90% (structure done, DB schema pending)
- **Authentication:** 🟡 20% (endpoints stubbed, needs Supabase integration)
- **Goals API:** 🟡 20% (endpoints stubbed, needs DB persistence)
- **Voice Services:** 🟠 10% (stubs only, needs Whisper/Piper setup)
- **Frontend:** 🔴 0% (next phase)

**ETA to V1.0 MVP:** ~15–18 additional sessions (accelerated with scaffold)
