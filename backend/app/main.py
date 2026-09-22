from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api import auth, profiles, swipes, messages, notifications
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Pairly Dating App API")

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS for frontend
allowed_origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://datingweb02.vercel.app" # explicitly add your vercel URL
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Handle multiple URLs if comma-separated, and strip trailing slashes
    urls = [url.strip().rstrip('/') for url in frontend_url.split(',')]
    allowed_origins.extend(urls)

# Remove duplicates
allowed_origins = list(set(allowed_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(profiles.router, prefix="/api")
app.include_router(swipes.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Pairly API (MongoDB Backend)"}
