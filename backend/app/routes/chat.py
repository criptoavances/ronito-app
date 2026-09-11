from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.services.qwen_service import qwen_service
from app.db import get_supabase

router = APIRouter()


class ChatMessage(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    user_id: str


def get_user_id_from_token(authorization: str = Header(None)) -> str:
    """Extract user_id from Bearer token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    return authorization.split(" ")[1]


async def get_user_context(user_id: str):
    """Fetch user's goals and context for the chat"""
    supabase = get_supabase()
    try:
        # Fetch big goal
        big_goal_response = supabase.table("big_goals").select("*").eq("user_id", user_id).execute()
        big_goal = None
        if big_goal_response.data and len(big_goal_response.data) > 0:
            big_goal = big_goal_response.data[0].get("title")

        # Fetch today's daily goals
        from datetime import date
        today = date.today().isoformat()
        daily_goals_response = supabase.table("daily_goals").select("*").eq("user_id", user_id).eq("goal_date", today).execute()
        daily_goals = [g.get("title") for g in daily_goals_response.data or []]

        return {
            "big_goal": big_goal,
            "daily_goals": daily_goals
        }
    except Exception as e:
        print(f"Error fetching user context: {e}")
        return {}


@router.post("/api/chat", response_model=ChatResponse)
async def send_chat_message(request: ChatMessage, authorization: str = Header(None)):
    """Send a message to the Ronnie AI and get a response"""
    user_id = get_user_id_from_token(authorization)

    # Get user context
    user_context = await get_user_context(user_id)

    # Get response from Qwen
    response = await qwen_service.chat(request.message, user_context)

    # Store message in database (optional - for analytics)
    try:
        supabase = get_supabase()
        from datetime import datetime
        supabase.table("chat_messages").insert({
            "user_id": user_id,
            "message": request.message,
            "response": response,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
    except Exception as e:
        print(f"Error storing chat message: {e}")

    return ChatResponse(response=response, user_id=user_id)


@router.get("/api/chat/motivation")
async def get_motivation(authorization: str = Header(None)):
    """Get a motivational message"""
    user_id = get_user_id_from_token(authorization)
    user_context = await get_user_context(user_id)
    response = await qwen_service.get_motivation(user_context)
    return {"response": response, "user_id": user_id}


@router.get("/api/chat/next-action")
async def get_next_action(authorization: str = Header(None)):
    """Get a suggestion for what to work on next"""
    user_id = get_user_id_from_token(authorization)
    from datetime import datetime
    current_time = datetime.now().strftime("%I:%M %p")
    user_context = await get_user_context(user_id)
    response = await qwen_service.suggest_next_action(current_time, user_context)
    return {"response": response, "user_id": user_id}
