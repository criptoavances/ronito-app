from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Server
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    ENVIRONMENT: str = "development"

    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    DATABASE_URL: Optional[str] = None

    # AI Services
    WHISPER_MODEL: str = "base"
    PIPER_VOICE: str = "en_US-amy-medium"
    ALIBABA_QWEN_API_KEY: Optional[str] = None

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_CALLBACK_URL: str = "http://localhost:3000/api/auth/callback/google"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
