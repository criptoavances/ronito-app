from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/check")
async def health_check():
    return {
        "status": "healthy",
        "service": "RONITO API",
        "environment": settings.ENVIRONMENT
    }

@router.get("/db")
async def db_health():
    try:
        from app.services.supabase_client import supabase
        # Simple query to test connection
        result = supabase.table("users").select("id").limit(1).execute()
        return {"status": "connected", "db": "OK"}
    except Exception as e:
        return {"status": "error", "db": str(e)}
