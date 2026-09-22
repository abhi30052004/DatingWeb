from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from bson import ObjectId
from datetime import datetime

from .. import schemas
from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/swipes", tags=["swipes"])

@router.post("/", response_model=schemas.MatchResponse)
async def create_swipe(
    swipe: schemas.SwipeCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db)
):
    try:
        target_id = ObjectId(swipe.target_user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid target user ID")

    # Prevent self-swiping
    if current_user["_id"] == target_id:
        raise HTTPException(status_code=400, detail="Cannot swipe on yourself")

    # 1. Record the swipe
    swipe_record = {
        "user_id": current_user["_id"],
        "target_user_id": target_id,
        "action": swipe.action,
        "created_at": datetime.utcnow()
    }
    
    # Upsert the swipe to avoid duplicates
    await db["swipes"].update_one(
        {"user_id": current_user["_id"], "target_user_id": target_id},
        {"$set": swipe_record},
        upsert=True
    )

    # 2. Check for a match if the action is LIKE or SUPER_LIKE
    if swipe.action in ["LIKE", "SUPER_LIKE"]:
        # Did the target user already LIKE or SUPER_LIKE the current user?
        target_swipe = await db["swipes"].find_one({
            "user_id": target_id,
            "target_user_id": current_user["_id"],
            "action": {"$in": ["LIKE", "SUPER_LIKE"]}
        })

        if target_swipe:
            # IT'S A MATCH!
            match_record = {
                "users": [current_user["_id"], target_id],
                "created_at": datetime.utcnow()
            }
            # Upsert the match
            await db["matches"].update_one(
                {"users": {"$all": [current_user["_id"], target_id]}},
                {"$set": match_record},
                upsert=True
            )
            
            # Send notifications
            from .notifications import notification_manager
            
            current_user_name = current_user.get("name", "Someone")
            target_user = await db["users"].find_one({"_id": target_id})
            target_name = target_user.get("name", "Someone") if target_user else "Someone"

            # Notify the target user
            await notification_manager.send_personal_message(
                {"type": "NEW_MATCH", "message": f"🌟 New match with {current_user_name}!"},
                str(target_id)
            )

            # Notify the current user
            await notification_manager.send_personal_message(
                {"type": "NEW_MATCH", "message": f"🌟 New match with {target_name}!"},
                str(current_user["_id"])
            )

            return {"match": True, "matched_user_id": str(target_id)}

    return {"match": False, "matched_user_id": None}

@router.get("/matches")
async def get_my_matches(
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db)
):
    # Find all matches where the current user is in the "users" array
    cursor = db["matches"].find({"users": current_user["_id"]})
    matches = await cursor.to_list(length=100)
    
    # For each match, fetch the OTHER user's profile info
    match_list = []
    for m in matches:
        other_user_id = next(uid for uid in m["users"] if uid != current_user["_id"])
        
        # Get profile
        profile = await db["profiles"].find_one({"user_id": other_user_id})
        # Get basic user info (name)
        user = await db["users"].find_one({"_id": other_user_id})
        
        if profile and user:
            match_list.append({
                "match_id": str(m["_id"]),
                "user_id": str(other_user_id),
                "name": user.get("name", "Unknown"),
                "profile_photo": profile.get("profile_photo", ""),
                "created_at": m.get("created_at")
            })
            
    # Sort by most recent
    match_list.sort(key=lambda x: x["created_at"] or datetime.min, reverse=True)
    return match_list
