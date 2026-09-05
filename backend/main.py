from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.config import settings
from app.routes import auth, goals, voice, health

# Startup & shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 RONITO Backend starting...")
    yield
    print("🛑 RONITO Backend shutting down...")

app = FastAPI(
    title="RONITO API",
    description="Your AI Life Manager - Backend",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080", "https://ronito.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "service": "RONITO Backend",
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT
    }

# Routes
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
