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

class GratitudeRequest(BaseModel):
    things: List[str]
    entry_date: Optional[date] = None

@router.get("")
async def get_gratitude(entry_date: Optional[date] = None, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        query_date = entry_date or date.today()
        result = supabase.table("gratitude_entries").select("*").eq("user_id", token).eq("entry_date", query_date).single().execute()
        return result.data if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_gratitude(gratitude: GratitudeRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        entry_date = gratitude.entry_date or date.today()
        result = supabase.table("gratitude_entries").upsert({
            "user_id": token,
            "entry_date": entry_date,
            "things": gratitude.things
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/all/{month}")
async def get_monthly_gratitude(month: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("gratitude_entries").select("*").eq("user_id", token).gte("entry_date", f"{month}-01").lte("entry_date", f"{month}-31").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
