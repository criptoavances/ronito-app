# RONITO Backend

Python/FastAPI backend for RONITO - Your AI Life Manager

## Setup

### 1. Create virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
The `.env` file is already created with Supabase credentials. Update any placeholders if needed:
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (for OAuth)
- `DATABASE_URL` (add your database password if needed)

### 4. Run development server
```bash
python main.py
```

Server runs on http://localhost:8000

## API Endpoints

### Health
- `GET /` - Root health check
- `GET /api/health/check` - Service health
- `GET /api/health/db` - Database connection check

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Goals
- `GET /api/goals` - List user's goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/{goal_id}` - Update goal
- `DELETE /api/goals/{goal_id}` - Delete goal
- `POST /api/goals/{goal_id}/complete` - Mark goal complete

### Voice
- `POST /api/voice/transcribe` - Convert audio to text (Whisper)
- `POST /api/voice/synthesize` - Convert text to speech (Piper)
- `POST /api/voice/capture` - Capture voice input (goals/ideas/gratitude/journal)

## Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Settings & environment variables
│   ├── routes/            # API endpoint handlers
│   │   ├── auth.py
│   │   ├── goals.py
│   │   ├── health.py
│   │   └── voice.py
│   └── services/          # Business logic
│       ├── supabase_client.py
│       ├── whisper.py      # (TODO)
│       ├── piper.py        # (TODO)
│       └── google_auth.py  # (TODO)
├── main.py                # FastAPI app entry point
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (git ignored)
└── README.md
```

## Next Steps

1. **Database Schema**: Create tables in Supabase (users, goals, ideas, journal_entries, etc.)
2. **Authentication**: Implement JWT-based auth with Supabase
3. **Voice Services**: Integrate Whisper (transcription) and Piper (synthesis)
4. **AI Features**: Add goal analysis and motivational messaging via Gemini
5. **Frontend**: Build Next.js web app connecting to these endpoints

## Testing

```bash
pytest
```

## Deployment

1. Set production environment variables
2. Build Docker image (Dockerfile TODO)
3. Deploy to cloud provider (Railway, Render, AWS, etc.)
