from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel
import os
from supabase import create_client, Client

# Initialize Supabase
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_KEY", "")
supabase: Client = create_client(supabase_url, supabase_key)

router = APIRouter()

# Dependency to get user from token
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user = supabase.auth.get_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

# Models
class BigGoalRequest(BaseModel):
    title: str
    why: Optional[str] = None

class YearlyGoalRequest(BaseModel):
    title: str

class MonthlyGoalRequest(BaseModel):
    yearly_goal_id: Optional[str] = None
    title: str

class WeeklyGoalRequest(BaseModel):
    monthly_goal_id: Optional[str] = None
    title: str
    week_start: Optional[date] = None

class DailyGoalRequest(BaseModel):
    weekly_goal_id: Optional[str] = None
    title: str
    goal_date: date

class TimeBlockRequest(BaseModel):
    name: str
    color: Optional[str] = "#8B5CF6"
    start_time: str
    end_time: str
    day_of_week: Optional[int] = None

class GratitudeRequest(BaseModel):
    things: List[str]
    entry_date: Optional[date] = None

class ReflectionRequest(BaseModel):
    what_done: Optional[str] = None
    what_didnt: Optional[str] = None
    why_didnt: Optional[str] = None
    three_good_things: List[str]
    day_rating: Optional[int] = None
    journal_entry: Optional[str] = None
    tomorrow_preview: Optional[str] = None
    entry_date: Optional[date] = None

class IdeaFolderRequest(BaseModel):
    name: str

class IdeaRequest(BaseModel):
    folder_id: str
    content: str
    is_voice: bool = False
    voice_url: Optional[str] = None

class SpecialDateRequest(BaseModel):
    date_value: date
    date_type: str
    name: str

class UserSettingsRequest(BaseModel):
    why_reminder_frequency: Optional[str] = None
    ai_voice_choice: Optional[str] = None
    morning_routine_enabled: Optional[bool] = None
    evening_routine_enabled: Optional[bool] = None

class MeditationSessionRequest(BaseModel):
    title: str
    duration_minutes: Optional[int] = None
    file_url: Optional[str] = None
    media_type: str

# Big Goal endpoints
@router.get("/api/goals/big")
async def get_big_goal(user=Depends(get_current_user)):
    result = supabase.table("big_goals").select("*").eq("user_id", user.id).single().execute()
    return result.data if result.data else None

@router.post("/api/goals/big")
async def create_big_goal(goal: BigGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("big_goals").insert({
        "user_id": user.id,
        "title": goal.title,
        "why": goal.why
    }).execute()
    return result.data[0] if result.data else None

@router.put("/api/goals/big/{goal_id}")
async def update_big_goal(goal_id: str, goal: BigGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("big_goals").update({
        "title": goal.title,
        "why": goal.why
    }).eq("id", goal_id).eq("user_id", user.id).execute()
    return result.data[0] if result.data else None

# Yearly Goals endpoints
@router.get("/api/goals/yearly")
async def list_yearly_goals(user=Depends(get_current_user)):
    result = supabase.table("yearly_goals").select("*").eq("user_id", user.id).order("position").execute()
    return result.data

@router.post("/api/goals/yearly")
async def create_yearly_goal(goal: YearlyGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("yearly_goals").insert({
        "user_id": user.id,
        "title": goal.title
    }).execute()
    return result.data[0] if result.data else None

# Monthly Goals endpoints
@router.get("/api/goals/monthly")
async def list_monthly_goals(user=Depends(get_current_user)):
    result = supabase.table("monthly_goals").select("*").eq("user_id", user.id).order("position").execute()
    return result.data

@router.post("/api/goals/monthly")
async def create_monthly_goal(goal: MonthlyGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("monthly_goals").insert({
        "user_id": user.id,
        "yearly_goal_id": goal.yearly_goal_id,
        "title": goal.title
    }).execute()
    return result.data[0] if result.data else None

# Weekly Goals endpoints
@router.get("/api/goals/weekly")
async def list_weekly_goals(user=Depends(get_current_user)):
    result = supabase.table("weekly_goals").select("*").eq("user_id", user.id).order("position").execute()
    return result.data

@router.post("/api/goals/weekly")
async def create_weekly_goal(goal: WeeklyGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("weekly_goals").insert({
        "user_id": user.id,
        "monthly_goal_id": goal.monthly_goal_id,
        "title": goal.title,
        "week_start": goal.week_start
    }).execute()
    return result.data[0] if result.data else None

# Daily Goals endpoints
@router.get("/api/goals/daily")
async def list_daily_goals(goal_date: Optional[date] = None, user=Depends(get_current_user)):
    query = supabase.table("daily_goals").select("*").eq("user_id", user.id)
    if goal_date:
        query = query.eq("goal_date", goal_date)
    else:
        query = query.eq("goal_date", date.today())
    result = query.order("position").execute()
    return result.data

@router.post("/api/goals/daily")
async def create_daily_goal(goal: DailyGoalRequest, user=Depends(get_current_user)):
    result = supabase.table("daily_goals").insert({
        "user_id": user.id,
        "weekly_goal_id": goal.weekly_goal_id,
        "title": goal.title,
        "goal_date": goal.goal_date
    }).execute()
    return result.data[0] if result.data else None

@router.put("/api/goals/daily/{goal_id}")
async def update_daily_goal(goal_id: str, updates: dict, user=Depends(get_current_user)):
    result = supabase.table("daily_goals").update(updates).eq("id", goal_id).eq("user_id", user.id).execute()
    return result.data[0] if result.data else None

# Time Blocks endpoints
@router.get("/api/time-blocks")
async def list_time_blocks(user=Depends(get_current_user)):
    result = supabase.table("time_blocks").select("*").eq("user_id", user.id).execute()
    return result.data

@router.post("/api/time-blocks")
async def create_time_block(block: TimeBlockRequest, user=Depends(get_current_user)):
    result = supabase.table("time_blocks").insert({
        "user_id": user.id,
        "name": block.name,
        "color": block.color,
        "start_time": block.start_time,
        "end_time": block.end_time,
        "day_of_week": block.day_of_week
    }).execute()
    return result.data[0] if result.data else None

# Gratitude endpoints
@router.get("/api/gratitude")
async def get_gratitude(entry_date: Optional[date] = None, user=Depends(get_current_user)):
    if not entry_date:
        entry_date = date.today()
    result = supabase.table("gratitude_entries").select("*").eq("user_id", user.id).eq("entry_date", entry_date).single().execute()
    return result.data if result.data else None

@router.post("/api/gratitude")
async def create_gratitude(gratitude: GratitudeRequest, user=Depends(get_current_user)):
    entry_date = gratitude.entry_date or date.today()
    result = supabase.table("gratitude_entries").upsert({
        "user_id": user.id,
        "entry_date": entry_date,
        "things": gratitude.things
    }).execute()
    return result.data[0] if result.data else None

# Reflection endpoints
@router.get("/api/reflections")
async def get_reflection(entry_date: Optional[date] = None, user=Depends(get_current_user)):
    if not entry_date:
        entry_date = date.today()
    result = supabase.table("reflection_entries").select("*").eq("user_id", user.id).eq("entry_date", entry_date).single().execute()
    return result.data if result.data else None

@router.post("/api/reflections")
async def create_reflection(reflection: ReflectionRequest, user=Depends(get_current_user)):
    entry_date = reflection.entry_date or date.today()
    result = supabase.table("reflection_entries").upsert({
        "user_id": user.id,
        "entry_date": entry_date,
        "what_done": reflection.what_done,
        "what_didnt": reflection.what_didnt,
        "why_didnt": reflection.why_didnt,
        "three_good_things": reflection.three_good_things,
        "day_rating": reflection.day_rating,
        "journal_entry": reflection.journal_entry,
        "tomorrow_preview": reflection.tomorrow_preview
    }).execute()
    return result.data[0] if result.data else None

# Idea Folders endpoints
@router.get("/api/idea-folders")
async def list_idea_folders(user=Depends(get_current_user)):
    result = supabase.table("idea_folders").select("*").eq("user_id", user.id).execute()
    return result.data

@router.post("/api/idea-folders")
async def create_idea_folder(folder: IdeaFolderRequest, user=Depends(get_current_user)):
    result = supabase.table("idea_folders").insert({
        "user_id": user.id,
        "name": folder.name
    }).execute()
    return result.data[0] if result.data else None

# Ideas endpoints
@router.get("/api/ideas/{folder_id}")
async def list_ideas(folder_id: str, user=Depends(get_current_user)):
    result = supabase.table("ideas").select("*").eq("folder_id", folder_id).eq("user_id", user.id).execute()
    return result.data

@router.post("/api/ideas")
async def create_idea(idea: IdeaRequest, user=Depends(get_current_user)):
    result = supabase.table("ideas").insert({
        "user_id": user.id,
        "folder_id": idea.folder_id,
        "content": idea.content,
        "is_voice": idea.is_voice,
        "voice_url": idea.voice_url
    }).execute()
    return result.data[0] if result.data else None

# Special Dates endpoints
@router.get("/api/special-dates")
async def list_special_dates(user=Depends(get_current_user)):
    result = supabase.table("special_dates").select("*").eq("user_id", user.id).execute()
    return result.data

@router.post("/api/special-dates")
async def create_special_date(date_entry: SpecialDateRequest, user=Depends(get_current_user)):
    result = supabase.table("special_dates").insert({
        "user_id": user.id,
        "date_value": date_entry.date_value,
        "date_type": date_entry.date_type,
        "name": date_entry.name
    }).execute()
    return result.data[0] if result.data else None

# User Settings endpoints
@router.get("/api/settings")
async def get_settings(user=Depends(get_current_user)):
    result = supabase.table("user_settings").select("*").eq("user_id", user.id).single().execute()
    return result.data if result.data else None

@router.post("/api/settings")
async def update_settings(settings: UserSettingsRequest, user=Depends(get_current_user)):
    data = {}
    if settings.why_reminder_frequency is not None:
        data["why_reminder_frequency"] = settings.why_reminder_frequency
    if settings.ai_voice_choice is not None:
        data["ai_voice_choice"] = settings.ai_voice_choice
    if settings.morning_routine_enabled is not None:
        data["morning_routine_enabled"] = settings.morning_routine_enabled
    if settings.evening_routine_enabled is not None:
        data["evening_routine_enabled"] = settings.evening_routine_enabled

    result = supabase.table("user_settings").upsert({
        "user_id": user.id,
        **data
    }).execute()
    return result.data[0] if result.data else None

# Meditation Sessions endpoints
@router.get("/api/meditation")
async def list_meditation_sessions(user=Depends(get_current_user)):
    result = supabase.table("meditation_sessions").select("*").eq("user_id", user.id).execute()
    return result.data

@router.post("/api/meditation")
async def create_meditation_session(session: MeditationSessionRequest, user=Depends(get_current_user)):
    result = supabase.table("meditation_sessions").insert({
        "user_id": user.id,
        "title": session.title,
        "duration_minutes": session.duration_minutes,
        "file_url": session.file_url,
        "media_type": session.media_type
    }).execute()
    return result.data[0] if result.data else None
