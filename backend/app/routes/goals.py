from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.db import get_supabase
import os

router = APIRouter()

def get_user_id(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    return authorization.split(" ")[1]

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

@router.get("/big")
async def get_big_goal(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("big_goals").select("*").eq("user_id", token).single().execute()
        return result.data if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/big")
async def create_big_goal(goal: BigGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("big_goals").insert({
            "user_id": token,
            "title": goal.title,
            "why": goal.why
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/big/{goal_id}")
async def update_big_goal(goal_id: str, goal: BigGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("big_goals").update({
            "title": goal.title,
            "why": goal.why
        }).eq("id", goal_id).eq("user_id", token).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/yearly")
async def list_yearly_goals(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("yearly_goals").select("*").eq("user_id", token).order("position").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/yearly")
async def create_yearly_goal(goal: YearlyGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("yearly_goals").insert({
            "user_id": token,
            "title": goal.title
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/monthly")
async def list_monthly_goals(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("monthly_goals").select("*").eq("user_id", token).order("position").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/monthly")
async def create_monthly_goal(goal: MonthlyGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("monthly_goals").insert({
            "user_id": token,
            "yearly_goal_id": goal.yearly_goal_id,
            "title": goal.title
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/weekly")
async def list_weekly_goals(token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("weekly_goals").select("*").eq("user_id", token).order("position").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/weekly")
async def create_weekly_goal(goal: WeeklyGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("weekly_goals").insert({
            "user_id": token,
            "monthly_goal_id": goal.monthly_goal_id,
            "title": goal.title,
            "week_start": goal.week_start
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/daily")
async def list_daily_goals(goal_date: Optional[date] = None, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        query_date = goal_date or date.today()
        result = supabase.table("daily_goals").select("*").eq("user_id", token).eq("goal_date", query_date).order("position").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/daily")
async def create_daily_goal(goal: DailyGoalRequest, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("daily_goals").insert({
            "user_id": token,
            "weekly_goal_id": goal.weekly_goal_id,
            "title": goal.title,
            "goal_date": goal.goal_date
        }).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/daily/{goal_id}")
async def update_daily_goal(goal_id: str, updates: dict, token: str = Depends(get_user_id)):
    supabase = get_supabase()
    try:
        result = supabase.table("daily_goals").update(updates).eq("id", goal_id).eq("user_id", token).execute()
        return result.data[0] if result.data else {}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
