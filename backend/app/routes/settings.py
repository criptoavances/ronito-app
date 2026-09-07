from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class UserSettingsRequest(BaseModel):
    why_reminder_frequency: Optional[str] = None
    ai_voice_choice: Optional[str] = None
    morning_routine_enabled: Optional[bool] = None
    evening_routine_enabled: Optional[bool] = None

@router.get("")
async def get_settings(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("user_settings").select("*").eq("user_id", token).single().execute()
        if result.data:
            return result.data
        else:
            return {
                "user_id": token,
                "why_reminder_frequency": "1h",
                "ai_voice_choice": "nova",
                "morning_routine_enabled": True,
                "evening_routine_enabled": True
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("")
async def update_settings(settings: UserSettingsRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        data = {"user_id": token}
        if settings.why_reminder_frequency is not None:
            data["why_reminder_frequency"] = settings.why_reminder_frequency
        if settings.ai_voice_choice is not None:
            data["ai_voice_choice"] = settings.ai_voice_choice
        if settings.morning_routine_enabled is not None:
            data["morning_routine_enabled"] = settings.morning_routine_enabled
        if settings.evening_routine_enabled is not None:
            data["evening_routine_enabled"] = settings.evening_routine_enabled

        result = supabase.table("user_settings").upsert(data).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
