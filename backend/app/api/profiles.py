from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Annotated
from bson import ObjectId
import os
import shutil
import uuid

from .. import schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate a unique filename
    extension = file.filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{extension}"
    filepath = os.path.join("uploads", filename)

    # Save the file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # The URL to access the photo
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    photo_url = f"{backend_url}/uploads/{filename}"

    # Update profile in database
    await db["profiles"].update_one(
        {"user_id": current_user["_id"]},
        {"$set": {"profile_photo": photo_url}}
    )

    return {"url": photo_url}

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

    # If name or date_of_birth is provided, update the user collection
    user_updates = {}
    if "name" in update_data:
        user_updates["name"] = update_data.pop("name")
    if "date_of_birth" in update_data:
        from datetime import datetime
        dob = update_data.pop("date_of_birth")
        user_updates["date_of_birth"] = datetime.combine(dob, datetime.min.time())
        
    if user_updates:
        await db["users"].update_one(
            {"_id": current_user["_id"]},
            {"$set": user_updates}
        )

    # If there's still profile data to update
    if update_data:
        result = await db["profiles"].find_one_and_update(
            {"user_id": current_user["_id"]},
            {"$set": update_data},
            return_document=True
        )
    else:
        result = await db["profiles"].find_one({"user_id": current_user["_id"]})

    if not result:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result

@router.get("/discover")
async def discover_profiles(current_user: Annotated[dict, Depends(get_current_user)], db = Depends(get_db)):
    # 1. Get all target_user_ids that the current user has already swiped on
    swipes_cursor = db["swipes"].find({"user_id": current_user["_id"]})
    swiped_users = await swipes_cursor.to_list(length=None)
    swiped_user_ids = [s["target_user_id"] for s in swiped_users]
    
    # 2. Exclude the current user AND the already swiped users
    excluded_ids = [current_user["_id"]] + swiped_user_ids

    # 3. Simple discovery: return remaining profiles
    # Filter out users who have is_visible: false or incognito_mode: true
    cursor = db["profiles"].aggregate([
        { "$match": { 
            "user_id": { "$nin": excluded_ids },
            "is_visible": { "$ne": False },
            "incognito_mode": { "$ne": True }
        } },
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
                "profession": 1,
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

@router.get("/explore")
async def explore_profiles(
    current_user: Annotated[dict, Depends(get_current_user)],
    q: str = "",
    db = Depends(get_db)
):
    # Get swiped users to exclude
    swipes_cursor = db["swipes"].find({"user_id": current_user["_id"]})
    swiped_users = await swipes_cursor.to_list(length=None)
    swiped_user_ids = [s["target_user_id"] for s in swiped_users]
    
    excluded_ids = [current_user["_id"]] + swiped_user_ids

    # Base match query
    match_query = { 
        "user_id": { "$nin": excluded_ids },
        "is_visible": { "$ne": False },
        "incognito_mode": { "$ne": True }
    }

    pipeline = [
        { "$match": match_query },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        { "$unwind": "$user" }
    ]

    # If search query is provided, add regex matching on name, city, profession, interests
    if q:
        regex_query = {"$regex": q, "$options": "i"}
        pipeline.append({
            "$match": {
                "$or": [
                    {"user.name": regex_query},
                    {"city": regex_query},
                    {"profession": regex_query},
                    {"interests": regex_query}
                ]
            }
        })

    pipeline.extend([
        { "$limit": 50 },
        {
            "$project": {
                "_id": 1,
                "user_id": 1,
                "bio": 1,
                "profession": 1,
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

    cursor = db["profiles"].aggregate(pipeline)
    profiles = await cursor.to_list(length=50)
    
    from datetime import datetime
    for p in profiles:
        p["_id"] = str(p["_id"])
        p["user_id"] = str(p["user_id"])
        p["location"] = f"{p.get('city', '')}, {p.get('state', '')}".strip(', ')
        if "date_of_birth" in p and p["date_of_birth"]:
            dob = p["date_of_birth"]
            today = datetime.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            p["age"] = age
            del p["date_of_birth"]
        else:
            p["age"] = 25
            
    return profiles

