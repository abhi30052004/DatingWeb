from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from .api import auth, profiles, swipes, messages, notifications, admin
from .database import get_db
from dotenv import load_dotenv
import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database indexes to improve performance
    db = get_db()
    
    import pymongo
    # users collection
    await db["users"].create_index([("email", pymongo.ASCENDING)], unique=True)
    
    # profiles collection
    await db["profiles"].create_index([("user_id", pymongo.ASCENDING)], unique=True)
    await db["profiles"].create_index([("city", pymongo.ASCENDING)])
    await db["profiles"].create_index([("profession", pymongo.ASCENDING)])
    
    # swipes collection
    await db["swipes"].create_index([("user_id", pymongo.ASCENDING)])
    await db["swipes"].create_index([("target_user_id", pymongo.ASCENDING)])
    await db["swipes"].create_index([("user_id", pymongo.ASCENDING), ("target_user_id", pymongo.ASCENDING)], unique=True)
    
    # matches collection
    await db["matches"].create_index([("users", pymongo.ASCENDING)])
    
    # messages collection
    await db["messages"].create_index([("match_id", pymongo.ASCENDING)])
    await db["messages"].create_index([("created_at", pymongo.ASCENDING)])
    
    yield
    # Cleanup on shutdown (if needed)

app = FastAPI(title="Pairly Dating App API", lifespan=lifespan)

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
app.include_router(admin.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Pairly API (MongoDB Backend)"}
