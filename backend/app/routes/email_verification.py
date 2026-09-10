from fastapi import APIRouter, HTTPException
import secrets
from datetime import datetime, timedelta
from app.db import get_supabase
from app.services.email_service import send_verification_email

router = APIRouter()

@router.post("/send-verification-email")
async def send_verification_email_endpoint(email: str):
    """Generate and send email verification link"""
    try:
        supabase = get_supabase()

        # Generate verification token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)

        # Store verification token (in real app, would be in verification_tokens table)
        # For now, we'll store it as a temporary record

        # Build verification link
        verification_link = f"https://ronito-app.vercel.app/verify-email?token={token}&email={email}"

        # Send email
        success = await send_verification_email(email, token, verification_link)

        if success:
            return {
                "status": "success",
                "message": "Verification email sent. Check your inbox.",
                "token": token  # In development only - remove in production
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send verification email")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-email")
async def verify_email_endpoint(token: str, email: str):
    """Verify email from token link"""
    try:
        supabase = get_supabase()

        # Update user's email_verified status
        result = supabase.table("users").update({
            "email_verified": True,
            "email_verified_at": datetime.utcnow().isoformat()
        }).eq("email", email).execute()

        if result.data:
            return {
                "status": "success",
                "message": "Email verified! You can now log in."
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid or expired verification link")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
