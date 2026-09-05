from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SignUpRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleOAuthRequest(BaseModel):
    access_token: str
    id_token: str

class AuthResponse(BaseModel):
    user_id: str
    email: str
    access_token: str
    refresh_token: Optional[str] = None

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    try:
        # TODO: Implement Supabase signup
        return {
            "user_id": "user_123",
            "email": request.email,
            "access_token": "token_xyz",
            "refresh_token": "refresh_xyz"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    try:
        # TODO: Implement Supabase login
        return {
            "user_id": "user_123",
            "email": request.email,
            "access_token": "token_xyz",
            "refresh_token": "refresh_xyz"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/google")
async def google_oauth(request: GoogleOAuthRequest):
    try:
        # TODO: Implement Google OAuth via Supabase
        return {
            "user_id": "user_123",
            "email": "user@example.com",
            "access_token": "token_xyz"
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google auth failed")

@router.post("/logout")
async def logout():
    return {"status": "logged_out"}

@router.get("/me")
async def get_current_user():
    # TODO: Add JWT validation middleware
    return {
        "user_id": "user_123",
        "email": "user@example.com",
        "created_at": "2026-09-05T00:00:00Z"
    }
