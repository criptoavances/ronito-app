from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None
    level: str  # "big", "yearly", "monthly", "weekly", "daily"
    priority: Optional[int] = None
    parent_id: Optional[str] = None

class Goal(BaseModel):
    id: str
    title: str
    description: Optional[str]
    level: str
    priority: Optional[int]
    parent_id: Optional[str]
    completed: bool
    created_at: str
    updated_at: str

@router.get("/", response_model=List[Goal])
async def list_goals(user_id: str, level: Optional[str] = None):
    # TODO: Query from Supabase
    return [
        {
            "id": "goal_1",
            "title": "Build RONITO MVP",
            "description": "Complete the minimum viable product",
            "level": "yearly",
            "priority": 1,
            "parent_id": None,
            "completed": False,
            "created_at": "2026-09-05T00:00:00Z",
            "updated_at": "2026-09-05T00:00:00Z"
        }
    ]

@router.post("/", response_model=Goal)
async def create_goal(user_id: str, goal: GoalCreate):
    try:
        # TODO: Save to Supabase
        return {
            "id": "goal_123",
            "title": goal.title,
            "description": goal.description,
            "level": goal.level,
            "priority": goal.priority,
            "parent_id": goal.parent_id,
            "completed": False,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(user_id: str, goal_id: str, goal: GoalCreate):
    # TODO: Update in Supabase
    return {
        "id": goal_id,
        "title": goal.title,
        "description": goal.description,
        "level": goal.level,
        "priority": goal.priority,
        "parent_id": goal.parent_id,
        "completed": False,
        "created_at": "2026-09-05T00:00:00Z",
        "updated_at": datetime.now().isoformat()
    }

@router.delete("/{goal_id}")
async def delete_goal(user_id: str, goal_id: str):
    # TODO: Delete from Supabase
    return {"deleted": goal_id}

@router.post("/{goal_id}/complete")
async def complete_goal(user_id: str, goal_id: str):
    # TODO: Mark as complete in Supabase
    return {"goal_id": goal_id, "completed": True, "completed_at": datetime.now().isoformat()}
