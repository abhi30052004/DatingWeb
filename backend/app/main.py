from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import auth, profiles
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Pairly API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(profiles.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Pairly API (MongoDB Backend)"}
