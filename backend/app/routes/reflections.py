from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class ReflectionRequest(BaseModel):
    what_done: Optional[str] = None
    what_didnt: Optional[str] = None
    why_didnt: Optional[str] = None
    three_good_things: List[str]
    day_rating: Optional[int] = None
    journal_entry: Optional[str] = None
    tomorrow_preview: Optional[str] = None
    entry_date: Optional[date] = None

@router.get("")
async def get_reflection(entry_date: Optional[date] = None, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        query_date = entry_date or date.today()
        result = supabase.table("reflection_entries").select("*").eq("user_id", token).eq("entry_date", query_date).single().execute()
        return result.data if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_reflection(reflection: ReflectionRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        entry_date = reflection.entry_date or date.today()
        result = supabase.table("reflection_entries").upsert({
            "user_id": token,
            "entry_date": entry_date,
            "what_done": reflection.what_done,
            "what_didnt": reflection.what_didnt,
            "why_didnt": reflection.why_didnt,
            "three_good_things": reflection.three_good_things,
            "day_rating": reflection.day_rating,
            "journal_entry": reflection.journal_entry,
            "tomorrow_preview": reflection.tomorrow_preview
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/stats/{month}")
async def get_monthly_stats(month: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("reflection_entries").select("day_rating, entry_date").eq("user_id", token).gte("entry_date", f"{month}-01").lte("entry_date", f"{month}-31").execute()
        ratings = [r["day_rating"] for r in result.data if r.get("day_rating")]
        return {
            "total_days": len(result.data),
            "avg_rating": sum(ratings) / len(ratings) if ratings else 0,
            "entries": result.data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
