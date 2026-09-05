from supabase import create_client
from app.config import settings

# Initialize Supabase client
supabase = create_client(
    supabase_url=settings.SUPABASE_URL,
    supabase_key=settings.SUPABASE_ANON_KEY
)

def get_supabase():
    return supabase
