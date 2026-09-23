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

@router.post("/seed-demo-data")
async def seed_demo_data(is_admin: Annotated[bool, Depends(get_admin_user)], db = Depends(get_db)):
    """Seed the database with 26 demo profiles. Safe to run multiple times - skips existing users."""
    from datetime import timezone
    import random

    HARDCODED_HASH = "$2b$12$YvYF/j8M9X8elUSqx9saJ.0EbJE5QRwVrNFIvWaYRE2iVc75Gwnl6"

    DEMO_PROFILES = [
        {"name": "Alex", "email": "alex@demo.com", "gender": "male", "dob": datetime(1995, 4, 12), "bio": "Software engineer by day, musician by night. Always looking for new coffee spots.", "profession": "Software Engineer", "city": "San Francisco", "interests": ["Music", "Coffee", "Technology", "Concerts"], "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"},
        {"name": "Sarah", "email": "sarah@demo.com", "gender": "female", "dob": datetime(1997, 8, 23), "bio": "Love hiking, photography, and weekend getaways. Looking for someone adventurous!", "profession": "Photographer", "city": "Seattle", "interests": ["Photography", "Travel", "Hiking", "Art"], "photo": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"},
        {"name": "David", "email": "david@demo.com", "gender": "male", "dob": datetime(1993, 11, 5), "bio": "Big foodie. If you love sushi, we'll get along great.", "profession": "Chef", "city": "New York", "interests": ["Food", "Cooking", "Movies", "Wine"], "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"},
        {"name": "Emma", "email": "emma@demo.com", "gender": "female", "dob": datetime(1998, 3, 17), "bio": "Yoga enthusiast and dog mom. Usually found at the farmers market on Sundays.", "profession": "Marketing Manager", "city": "Austin", "interests": ["Yoga", "Dogs", "Wellness", "Books"], "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"},
        {"name": "Michael", "email": "michael@demo.com", "gender": "male", "dob": datetime(1991, 7, 30), "bio": "Entrepreneur and fitness junkie. I work hard but know how to have fun.", "profession": "Founder & CEO", "city": "Miami", "interests": ["Fitness", "Business", "Travel", "Sports"], "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"},
        {"name": "Jessica", "email": "jessica@demo.com", "gender": "female", "dob": datetime(1996, 1, 9), "bio": "Art history major turned UI designer. Love visiting museums.", "profession": "UX/UI Designer", "city": "Chicago", "interests": ["Art", "Design", "Museums", "Coffee"], "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"},
        {"name": "Ryan", "email": "ryan@demo.com", "gender": "male", "dob": datetime(1994, 5, 20), "bio": "Med student finding work/life balance. Coffee is my best friend.", "profession": "Medical Student", "city": "Boston", "interests": ["Coffee", "Science", "Running", "Reading"], "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"},
        {"name": "Olivia", "email": "olivia@demo.com", "gender": "female", "dob": datetime(1999, 10, 2), "bio": "Just moved here! Looking for someone to show me the city.", "profession": "Architect", "city": "Los Angeles", "interests": ["Architecture", "Food", "Travel", "Music"], "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"},
        {"name": "James", "email": "james@demo.com", "gender": "male", "dob": datetime(1992, 6, 14), "bio": "Avid reader and writer. Let's debate books over a drink.", "profession": "Journalist", "city": "Washington DC", "interests": ["Books", "Writing", "Politics", "Movies"], "photo": "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80"},
        {"name": "Sophia", "email": "sophia@demo.com", "gender": "female", "dob": datetime(1997, 12, 25), "bio": "Professional dancer. Always moving. If you can keep up, swipe right!", "profession": "Dancer", "city": "Las Vegas", "interests": ["Dancing", "Music", "Fitness", "Nightlife"], "photo": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"},
        {"name": "Daniel", "email": "daniel@demo.com", "gender": "male", "dob": datetime(1990, 9, 8), "bio": "Nature lover. Weekends in the mountains. Need a hiking buddy.", "profession": "Environmental Scientist", "city": "Denver", "interests": ["Hiking", "Nature", "Camping", "Photography"], "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"},
        {"name": "Mia", "email": "mia@demo.com", "gender": "female", "dob": datetime(2000, 2, 14), "bio": "Gamer, coder, and anime fan. Co-op games and pizza anyone?", "profession": "Game Developer", "city": "San Jose", "interests": ["Gaming", "Technology", "Anime", "Pizza"], "photo": "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=600&q=80"},
        {"name": "Lucas", "email": "lucas@demo.com", "gender": "male", "dob": datetime(1996, 7, 19), "bio": "Skater, surfer, and casual guitarist. Looking for a chill vibe.", "profession": "Graphic Designer", "city": "San Diego", "interests": ["Skating", "Surfing", "Music", "Art"], "photo": "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80"},
        {"name": "Chloe", "email": "chloe@demo.com", "gender": "female", "dob": datetime(1995, 4, 3), "bio": "Always planning the next trip. Obsessed with matcha and vintage bookstores.", "profession": "Travel Blogger", "city": "Portland", "interests": ["Travel", "Coffee", "Writing", "Photography"], "photo": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"},
        {"name": "Ethan", "email": "ethan@demo.com", "gender": "male", "dob": datetime(1993, 11, 27), "bio": "Movie marathons and popcorn are my love language.", "profession": "Accountant", "city": "Dallas", "interests": ["Movies", "Finance", "Gaming", "Food"], "photo": "https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?auto=format&fit=crop&w=600&q=80"},
        {"name": "Zoe", "email": "zoe@demo.com", "gender": "female", "dob": datetime(1994, 8, 11), "bio": "Fitness instructor and marathon runner. Health is wealth.", "profession": "Fitness Coach", "city": "Phoenix", "interests": ["Fitness", "Sports", "Health", "Running"], "photo": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80"},
        {"name": "Liam", "email": "liam@demo.com", "gender": "male", "dob": datetime(1997, 1, 16), "bio": "Tech enthusiast and startup guy. Can talk about AI for hours.", "profession": "Product Manager", "city": "San Francisco", "interests": ["Technology", "Finance", "Gaming", "Business"], "photo": "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=600&q=80"},
        {"name": "Aria", "email": "aria@demo.com", "gender": "female", "dob": datetime(1998, 5, 29), "bio": "Indie music fan, vintage clothes, and proud plant mom of 47 plants.", "profession": "Boutique Owner", "city": "Brooklyn", "interests": ["Fashion", "Music", "Art", "Nature"], "photo": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"},
        {"name": "Mason", "email": "mason@demo.com", "gender": "male", "dob": datetime(1991, 3, 6), "bio": "Amateur stand-up comedian. If I can't make you laugh, drinks are on me.", "profession": "Marketing Director", "city": "Chicago", "interests": ["Comedy", "Writing", "Movies", "Food"], "photo": "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80"},
        {"name": "Lily", "email": "lily@demo.com", "gender": "female", "dob": datetime(2001, 9, 18), "bio": "Content creator and coffee addict trying to read more books.", "profession": "Social Media Manager", "city": "Los Angeles", "interests": ["Social Media", "Books", "Movies", "Dancing"], "photo": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80"},
        {"name": "Logan", "email": "logan@demo.com", "gender": "male", "dob": datetime(1989, 12, 10), "bio": "Fix cars for a living. Pretty handy in general. Also can fix a broken heart.", "profession": "Automotive Engineer", "city": "Detroit", "interests": ["Cars", "Sports", "Music", "Coffee"], "photo": "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?auto=format&fit=crop&w=600&q=80"},
        {"name": "Grace", "email": "grace@demo.com", "gender": "female", "dob": datetime(1996, 6, 22), "bio": "I bake a mean chocolate chip cookie. Looking for a taste tester.", "profession": "Pastry Chef", "city": "Seattle", "interests": ["Baking", "Food", "Movies", "Pets"], "photo": "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=600&q=80"},
        {"name": "Jack", "email": "jack@demo.com", "gender": "male", "dob": datetime(1988, 10, 15), "bio": "History buff and museum lover. Let's explore an old city together.", "profession": "History Teacher", "city": "Boston", "interests": ["History", "Museums", "Books", "Architecture"], "photo": "https://images.unsplash.com/photo-1495216875107-c6c043eb703f?auto=format&fit=crop&w=600&q=80"},
        {"name": "Hannah", "email": "hannah@demo.com", "gender": "female", "dob": datetime(1999, 7, 4), "bio": "Dog walker by day, aspiring novelist by night. My golden retriever is a better judge of character.", "profession": "Freelance Writer", "city": "Austin", "interests": ["Dogs", "Writing", "Books", "Coffee"], "photo": "https://images.unsplash.com/photo-1546961342-ea5f60b193ef?auto=format&fit=crop&w=600&q=80"},
        {"name": "Noah", "email": "noah@demo.com", "gender": "male", "dob": datetime(1993, 2, 28), "bio": "Musician trying to make it big. Come to my next gig!", "profession": "Musician", "city": "Nashville", "interests": ["Music", "Concerts", "Writing", "Nightlife"], "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"},
        {"name": "Ava", "email": "ava@demo.com", "gender": "female", "dob": datetime(1995, 11, 7), "bio": "I love astronomy and stargazing. Let's go to the planetarium then get tacos.", "profession": "Astrophysicist", "city": "Tucson", "interests": ["Science", "Nature", "Movies", "Coffee"], "photo": "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=600&q=80"},
    ]

    seeded = 0
    skipped = 0

    for p in DEMO_PROFILES:
        existing = await db["users"].find_one({"email": p["email"]})
        if existing:
            await db["profiles"].update_one(
                {"user_id": existing["_id"]},
                {"$set": {"profile_photo": p["photo"], "bio": p["bio"], "city": p["city"],
                          "profession": p["profession"], "interests": p["interests"]}}
            )
            skipped += 1
            continue

        user_doc = {
            "email": p["email"],
            "password_hash": HARDCODED_HASH,
            "name": p["name"],
            "date_of_birth": p["dob"],
            "gender": p["gender"],
            "role": "user",
            "status": "active",
            "created_at": datetime.utcnow()
        }
        user_res = await db["users"].insert_one(user_doc)
        user_id = user_res.inserted_id

        profile_doc = {
            "user_id": user_id,
            "bio": p["bio"],
            "profession": p["profession"],
            "city": p["city"],
            "state": "",
            "latitude": None,
            "longitude": None,
            "relationship_goal": random.choice(["Long-term relationship", "Casual dating", "Friendship"]),
            "profile_photo": p["photo"],
            "photos": [p["photo"]],
            "interests": p["interests"],
            "languages": ["English"],
            "interested_in": "everyone",
            "min_age": 18,
            "max_age": 45,
            "smoking": "No preference",
            "drinking": "No preference",
            "pets": "No preference",
            "introvert_extrovert": random.choice(["Introvert", "Extrovert", "Ambivert"]),
            "weekend_preference": random.choice(["Going out", "Staying in", "Both"]),
            "personality_traits": []
        }
        await db["profiles"].insert_one(profile_doc)
        seeded += 1

    return {
        "status": "success",
        "seeded": seeded,
        "skipped_already_exist": skipped,
        "total": len(DEMO_PROFILES),
        "message": "Login password for all demo users: password123"
    }

