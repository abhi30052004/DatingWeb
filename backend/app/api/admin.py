from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Annotated, List
from datetime import timedelta
from jose import jwt, JWTError
from bson import ObjectId

from ..database import get_db
from ..auth.security import create_access_token, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from .auth import oauth2_scheme
from .. import schemas

router = APIRouter(prefix="/admin", tags=["admin"])

class AdminLogin(BaseModel):
    username: str
    password: str

async def get_admin_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role: str = payload.get("role")
        if role != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return True

@router.post("/login")
async def admin_login(data: AdminLogin):
    if data.username != "admin" or data.password != "admin123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "admin", "role": "admin"}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/stats")
async def get_stats(is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    users_count = await db["users"].count_documents({})
    swipes_count = await db["swipes"].count_documents({})
    matches_count = await db["matches"].count_documents({})
    return {
        "users": users_count,
        "swipes": swipes_count,
        "matches": matches_count
    }

@router.get("/users")
async def get_users(is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    cursor = db["users"].find({})
    users = await cursor.to_list(length=1000)
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    
    result = await db["users"].delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Also delete associated data
    await db["profiles"].delete_one({"user_id": obj_id})
    await db["swipes"].delete_many({"$or": [{"swiper_id": obj_id}, {"target_id": obj_id}]})
    await db["matches"].delete_many({"$or": [{"user1_id": obj_id}, {"user2_id": obj_id}]})
    await db["messages"].delete_many({"$or": [{"sender_id": obj_id}, {"receiver_id": obj_id}]})
    
    return {"message": "User and all associated data deleted successfully"}

class UserStatusUpdate(BaseModel):
    status: str

class UserUpdate(BaseModel):
    name: str
    email: str
    gender: str

@router.get("/users/{user_id}/profile")
async def get_user_profile(user_id: str, is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    user = await db["users"].find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    profile = await db["profiles"].find_one({"user_id": obj_id})
    
    user["_id"] = str(user["_id"])
    if profile:
        profile["_id"] = str(profile["_id"])
        profile["user_id"] = str(profile["user_id"])
        
    return {"user": user, "profile": profile}

@router.put("/users/{user_id}")
async def update_user(user_id: str, update_data: UserUpdate, is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    result = await db["users"].update_one(
        {"_id": obj_id}, 
        {"$set": {"name": update_data.name, "email": update_data.email, "gender": update_data.gender}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": "User updated successfully"}

@router.put("/users/{user_id}/status")
async def update_user_status(user_id: str, data: UserStatusUpdate, is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    if data.status not in ["active", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    result = await db["users"].update_one({"_id": obj_id}, {"$set": {"status": data.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": f"User status updated to {data.status}"}
