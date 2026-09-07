from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class SpecialDateRequest(BaseModel):
    date_value: date
    date_type: str
    name: str

@router.get("")
async def list_special_dates(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("special_dates").select("*").eq("user_id", token).order("date_value").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_special_date(date_entry: SpecialDateRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("special_dates").insert({
            "user_id": token,
            "date_value": date_entry.date_value,
            "date_type": date_entry.date_type,
            "name": date_entry.name
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{date_id}")
async def update_special_date(date_id: str, date_entry: SpecialDateRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("special_dates").update({
            "date_value": date_entry.date_value,
            "date_type": date_entry.date_type,
            "name": date_entry.name
        }).eq("id", date_id).eq("user_id", token).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{date_id}")
async def delete_special_date(date_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        supabase.table("special_dates").delete().eq("id", date_id).eq("user_id", token).execute()
        return {"deleted": date_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
