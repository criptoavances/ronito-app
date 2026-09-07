from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class TimeBlockRequest(BaseModel):
    name: str
    color: Optional[str] = "#8B5CF6"
    start_time: str
    end_time: str
    day_of_week: Optional[int] = None

@router.get("")
async def list_time_blocks(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("time_blocks").select("*").eq("user_id", token).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_time_block(block: TimeBlockRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("time_blocks").insert({
            "user_id": token,
            "name": block.name,
            "color": block.color,
            "start_time": block.start_time,
            "end_time": block.end_time,
            "day_of_week": block.day_of_week
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{block_id}")
async def update_time_block(block_id: str, block: TimeBlockRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("time_blocks").update({
            "name": block.name,
            "color": block.color,
            "start_time": block.start_time,
            "end_time": block.end_time,
            "day_of_week": block.day_of_week
        }).eq("id", block_id).eq("user_id", token).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{block_id}")
async def delete_time_block(block_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        supabase.table("time_blocks").delete().eq("id", block_id).eq("user_id", token).execute()
        return {"deleted": block_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
