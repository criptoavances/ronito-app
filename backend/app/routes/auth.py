from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from app.db import get_supabase

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
        supabase = get_supabase()
        result = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })
        if result.user:
            return {
                "user_id": result.user.id,
                "email": result.user.email,
                "access_token": result.session.access_token if result.session else "",
                "refresh_token": result.session.refresh_token if result.session else None
            }
        raise HTTPException(status_code=400, detail="Signup failed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    try:
        supabase = get_supabase()
        result = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        if result.session:
            return {
                "user_id": result.user.id,
                "email": result.user.email,
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/google")
async def google_oauth(request: GoogleOAuthRequest):
    try:
        supabase = get_supabase()
        result = supabase.auth.sign_in_with_id_token({
            "provider": "google",
            "id_token": request.id_token
        })
        if result.session:
            return {
                "user_id": result.user.id,
                "email": result.user.email,
                "access_token": result.session.access_token
            }
        raise HTTPException(status_code=401, detail="Google auth failed")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Google auth failed")

@router.post("/logout")
async def logout():
    return {"status": "logged_out"}

@router.get("/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    try:
        supabase = get_supabase()
        user = supabase.auth.get_user(token)
        if user:
            return {
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at
            }
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
