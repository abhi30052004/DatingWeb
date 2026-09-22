from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import datetime, timedelta
from typing import Annotated

from .. import schemas
from ..database import get_db
from ..auth.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
        
    user = await db["users"].find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db = Depends(get_db)):
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "date_of_birth": datetime.combine(user.date_of_birth, datetime.min.time()),
        "gender": user.gender,
        "role": "user",
        "status": "active",
        "created_at": datetime.utcnow()
    }
    
    result = await db["users"].insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    # Create empty profile
    profile_doc = {
        "user_id": result.inserted_id,
        "bio": "",
        "city": "",
        "state": "",
        "latitude": None,
        "longitude": None,
        "relationship_goal": "",
        "profile_photo": "",
        "photos": [],
        "interests": [],
        "languages": [],
        "interested_in": "everyone",
        "min_age": 18,
        "max_age": 99,
        "smoking": "No preference",
        "drinking": "No preference",
        "pets": "No preference",
        "introvert_extrovert": "",
        "weekend_preference": "",
        "personality_traits": []
    }
    await db["profiles"].insert_one(profile_doc)
    
    return user_doc

@router.post("/login", response_model=schemas.Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db = Depends(get_db)):
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: Annotated[dict, Depends(get_current_user)], db = Depends(get_db)):
    profile = await db["profiles"].find_one({"user_id": current_user["_id"]})
    if profile and "profile_photo" in profile:
        current_user["profile_photo"] = profile["profile_photo"]
    return current_user
