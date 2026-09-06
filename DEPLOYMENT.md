# RONITO Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ronito-app` (or your choice)
3. Description: "Your AI Life Manager - Backend & Landing"
4. **Public** (free tier)
5. Click "Create repository"

Copy the commands GitHub shows you. Should be something like:
```bash
git remote add origin https://github.com/YOUR-USERNAME/ronito-app.git
git branch -m main
git push -u origin main
```

Run those from your project directory:
```bash
cd /Users/ronny/Downloads/ronito-app
git remote add origin https://github.com/YOUR-USERNAME/ronito-app.git
git branch -m main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up / Login (use GitHub for easiest auth)
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access GitHub
6. Select `ronito-app` repo
7. Click "Deploy Now"

Railway will:
- Detect `Dockerfile` in `/backend`
- Build Docker image
- Deploy container
- Assign URL like `ronito-app-production.up.railway.app`

---

## Step 3: Set Environment Variables in Railway

After deployment starts:

1. Click your service in Railway dashboard
2. Go to "Variables" tab
3. Add these variables:
   ```
   SUPABASE_URL=https://huweovrtkogqcjbfuspx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ENVIRONMENT=production
   API_PORT=8000
   ```

4. Leave these blank for now (will set in frontend):
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

---

## Step 4: Test Backend API

Once Railway deployment succeeds (green checkmark):

1. Click "Open logs" to get your backend URL
2. Test endpoints:
   ```bash
   curl https://your-railway-url/
   curl https://your-railway-url/api/health/check
   ```

Should return:
```json
{"status": "healthy", "service": "RONITO API", "environment": "production"}
```

---

## Step 5: Update Frontend (Next Week)

When building Next.js frontend:
1. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url
   ```
2. API calls use: `${process.env.NEXT_PUBLIC_API_URL}/api/goals`

---

## Cost Breakdown

| Service | Free Tier | Cost |
|---------|-----------|------|
| GitHub | ✅ Unlimited repos | FREE |
| Railway | ✅ $5/mo credits | FREE first month |
| Supabase | ✅ 500MB database | FREE |
| Cloudflare Pages | ✅ Landing page | FREE |
| **Total** | | **FREE** |

After Railway free credits expire: ~$5/mo for backend

---

## Troubleshooting

**Railway build fails:**
- Check logs: "Deploy" tab → View logs
- Common: Missing `gunicorn` in requirements.txt (already added ✅)

**API returns 502 Bad Gateway:**
- Check if `.env` variables are set in Railway dashboard
- Restart deployment

**CORS errors from frontend:**
- Update `CORS_ORIGINS` in `backend/main.py` to include your frontend URL

---

## Next Steps

1. Push code to GitHub (Step 1)
2. Deploy to Railway (Step 2-3)
3. Test endpoints with `curl`
4. Create database schema in Supabase
5. Build Next.js frontend
6. Point frontend to Railway backend URL
# Deployment trigger
