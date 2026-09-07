from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional
from app.db import get_supabase

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

class IdeaFolderRequest(BaseModel):
    name: str

class IdeaRequest(BaseModel):
    folder_id: str
    content: str
    is_voice: bool = False
    voice_url: Optional[str] = None

@router.get("/folders")
async def list_idea_folders(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("idea_folders").select("*").eq("user_id", token).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/folders")
async def create_idea_folder(folder: IdeaFolderRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("idea_folders").insert({
            "user_id": token,
            "name": folder.name
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/folders/{folder_id}")
async def delete_idea_folder(folder_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        supabase.table("idea_folders").delete().eq("id", folder_id).eq("user_id", token).execute()
        return {"deleted": folder_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{folder_id}")
async def list_ideas(folder_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("ideas").select("*").eq("folder_id", folder_id).eq("user_id", token).order("created_at", desc=True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("")
async def create_idea(idea: IdeaRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("ideas").insert({
            "user_id": token,
            "folder_id": idea.folder_id,
            "content": idea.content,
            "is_voice": idea.is_voice,
            "voice_url": idea.voice_url
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{idea_id}")
async def delete_idea(idea_id: str, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        supabase.table("ideas").delete().eq("id", idea_id).eq("user_id", token).execute()
        return {"deleted": idea_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
