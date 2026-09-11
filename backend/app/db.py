import os
from supabase import create_client, Client
import psycopg2
from psycopg2.extras import RealDictCursor

_supabase_client: Client = None
_db_conn = None

def get_db_connection():
    global _db_conn
    if _db_conn is None:
        db_url = os.getenv("DATABASE_URL", "")
        if db_url:
            db_url = db_url.replace("postgres://", "postgresql://")
            _db_conn = psycopg2.connect(db_url)
    return _db_conn

def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        supabase_url = os.getenv("SUPABASE_URL", "")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") or os.getenv("SUPABASE_ANON_KEY", "") or os.getenv("SUPABASE_KEY", "")
        _supabase_client = create_client(supabase_url, supabase_key)
    return _supabase_client
