from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from bson import ObjectId

from .. import schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/me", response_model=schemas.ProfileResponse)
async def get_my_profile(current_user: Annotated[dict, Depends(get_current_user)], db = Depends(get_db)):
    profile = await db["profiles"].find_one({"user_id": current_user["_id"]})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=schemas.ProfileResponse)
async def update_my_profile(profile_update: schemas.ProfileUpdate, current_user: Annotated[dict, Depends(get_current_user)], db = Depends(get_db)):
    update_data = {k: v for k, v in profile_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided to update")

    result = await db["profiles"].find_one_and_update(
        {"user_id": current_user["_id"]},
        {"$set": update_data},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result

@router.get("/discover")
async def discover_profiles(current_user: Annotated[dict, Depends(get_current_user)], db = Depends(get_db)):
    # Simple discovery: everyone except the current user
    # In a real app, this would use geospatial queries, preferences, and exclude passed/liked profiles
    cursor = db["profiles"].aggregate([
        { "$match": { "user_id": { "$ne": current_user["_id"] } } },
        { "$limit": 20 },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        { "$unwind": "$user" },
        {
            "$project": {
                "_id": 1,
                "user_id": 1,
                "bio": 1,
                "city": 1,
                "state": 1,
                "relationship_goal": 1,
                "profile_photo": 1,
                "photos": 1,
                "interests": 1,
                "languages": 1,
                "interested_in": 1,
                "name": "$user.name",
                "date_of_birth": "$user.date_of_birth",
                "gender": "$user.gender"
            }
        }
    ])
    
    profiles = await cursor.to_list(length=20)
    
    # Calculate age from date_of_birth and convert ObjectId to string
    from datetime import datetime
    for p in profiles:
        p["_id"] = str(p["_id"])
        p["user_id"] = str(p["user_id"])
        # Format location for frontend
        p["location"] = f"{p.get('city', '')}, {p.get('state', '')}".strip(', ')
        if "date_of_birth" in p and p["date_of_birth"]:
            dob = p["date_of_birth"]
            today = datetime.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            p["age"] = age
            del p["date_of_birth"]
        else:
            p["age"] = 25 # Fallback
            
    return profiles
