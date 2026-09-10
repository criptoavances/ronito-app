from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.db import get_supabase
from app.services.email_marketing import EmailMarketingSequence
from datetime import datetime

router = APIRouter()

class EnrollSequenceRequest(BaseModel):
    user_id: str
    email: str
    sequence_name: str = "welcome"

@router.post("/enroll")
async def enroll_user_in_sequence(request: EnrollSequenceRequest):
    """
    Enroll user in email marketing sequence

    Triggered on signup to start automated email campaign
    """
    try:
        supabase = get_supabase()

        # Check if already enrolled
        existing = supabase.table("email_sequences").select("*").eq(
            "user_id", request.user_id
        ).eq("sequence_name", request.sequence_name).execute()

        if existing.data:
            return {"status": "already_enrolled"}

        # Enroll in sequence
        enrollment = {
            "user_id": request.user_id,
            "email": request.email,
            "sequence_name": request.sequence_name,
            "status": "active",
            "current_email_index": 0
        }

        result = supabase.table("email_sequences").insert(enrollment).execute()

        if result.data:
            # Log enrollment event
            supabase.table("email_events").insert({
                "user_id": request.user_id,
                "email": request.email,
                "event_type": "enrolled",
                "sequence_name": request.sequence_name
            }).execute()

            return {
                "status": "success",
                "message": f"User enrolled in {request.sequence_name} sequence"
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to enroll user")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/send-sequence-email/{user_id}")
async def trigger_sequence_email(user_id: str):
    """
    Manually trigger next email in sequence (for testing/admin)
    """
    try:
        supabase = get_supabase()

        # Get user's active sequence
        sequence = supabase.table("email_sequences").select("*").eq(
            "user_id", user_id
        ).eq("status", "active").execute()

        if not sequence.data:
            raise HTTPException(status_code=404, detail="No active sequence found")

        seq = sequence.data[0]
        seq_name = seq["sequence_name"]
        current_index = seq["current_email_index"]

        # Get sequence template
        if seq_name == "welcome":
            template = EmailMarketingSequence.WELCOME_SEQUENCE[current_index]
        else:
            raise HTTPException(status_code=400, detail="Unknown sequence")

        # Log email event
        supabase.table("email_events").insert({
            "user_id": user_id,
            "email": seq["email"],
            "event_type": "sent",
            "email_subject": template["subject"],
            "sequence_name": seq_name,
            "email_index": current_index
        }).execute()

        # Update sequence progress
        supabase.table("email_sequences").update({
            "current_email_index": current_index + 1,
            "last_sent_at": datetime.utcnow().isoformat(),
            "status": "active" if current_index + 1 < len(EmailMarketingSequence.WELCOME_SEQUENCE) else "completed"
        }).eq("id", seq["id"]).execute()

        return {
            "status": "sent",
            "email": {
                "subject": template["subject"],
                "template": template["template"],
                "day": template["day"]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sequences/{user_id}")
async def get_user_sequences(user_id: str):
    """Get user's email sequences and status"""
    try:
        supabase = get_supabase()
        sequences = supabase.table("email_sequences").select("*").eq(
            "user_id", user_id
        ).execute()

        return {"sequences": sequences.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
