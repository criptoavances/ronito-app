from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class MeditationSessionRequest(BaseModel):
    title: str
    duration_minutes: Optional[int] = None
    file_url: Optional[str] = None
    media_type: str

@router.get("")
async def list_meditation_sessions(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("meditation_sessions").select("*").eq("user_id", token).order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_meditation_session(session: MeditationSessionRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("meditation_sessions").insert({
            "user_id": token,
            "title": session.title,
            "duration_minutes": session.duration_minutes,
            "file_url": session.file_url,
            "media_type": session.media_type
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{session_id}")
async def delete_meditation_session(session_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        supabase.table("meditation_sessions").delete().eq("id", session_id).eq("user_id", token).execute()
        return {"deleted": session_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Built-in guided sessions
@router.get("/library")
async def get_guided_sessions():
    return [
        {
            "id": "breathwork_1",
            "title": "5-Minute Box Breathing",
            "duration_minutes": 5,
            "description": "Simple grounding technique",
            "media_type": "audio"
        },
        {
            "id": "breathwork_2",
            "title": "10-Minute Body Scan",
            "duration_minutes": 10,
            "description": "Progressive relaxation",
            "media_type": "audio"
        }
    ]
