import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import random
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "pairly")

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client[DATABASE_NAME]

# Pre-computed bcrypt hash for "password123" to bypass passlib bugs on newer python/bcrypt versions
HARDCODED_HASH = "$2b$12$YvYF/j8M9X8elUSqx9saJ.0EbJE5QRwVrNFIvWaYRE2iVc75Gwnl6"

DEMO_PROFILES = [
    {
        "name": "Alex",
        "email": "alex@demo.com",
        "gender": "male",
        "bio": "Software engineer by day, musician by night. Always looking for new coffee spots and someone to go to concerts with.",
        "profession": "Software Engineer",
        "city": "San Francisco",
        "interests": ["Music", "Coffee", "Technology", "Concerts"],
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Sarah",
        "email": "sarah@demo.com",
        "gender": "female",
        "bio": "Love hiking, photography, and weekend getaways. Looking for someone adventurous!",
        "profession": "Photographer",
        "city": "Seattle",
        "interests": ["Photography", "Travel", "Hiking", "Art"],
        "photo": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "David",
        "email": "david@demo.com",
        "gender": "male",
        "bio": "Big foodie. I know all the best restaurants in town. If you love sushi, we'll get along.",
        "profession": "Chef",
        "city": "New York",
        "interests": ["Food", "Cooking", "Movies", "Wine"],
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Emma",
        "email": "emma@demo.com",
        "gender": "female",
        "bio": "Yoga enthusiast and dog mom. Usually found at the farmers market on Sundays.",
        "profession": "Marketing Manager",
        "city": "Austin",
        "interests": ["Yoga", "Dogs", "Wellness", "Books"],
        "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Michael",
        "email": "michael@demo.com",
        "gender": "male",
        "bio": "Entrepreneur and fitness junkie. I work hard but I know how to have a good time.",
        "profession": "Founder",
        "city": "Miami",
        "interests": ["Fitness", "Business", "Travel", "Sports"],
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Jessica",
        "email": "jessica@demo.com",
        "gender": "female",
        "bio": "Art history major turned UI designer. I love visiting museums and discussing design.",
        "profession": "UX/UI Designer",
        "city": "Chicago",
        "interests": ["Art", "Design", "Museums", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ryan",
        "email": "ryan@demo.com",
        "gender": "male",
        "bio": "Med student trying to find some work/life balance. Coffee is my best friend.",
        "profession": "Medical Student",
        "city": "Boston",
        "interests": ["Coffee", "Science", "Running", "Reading"],
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Olivia",
        "email": "olivia@demo.com",
        "gender": "female",
        "bio": "Just moved here! Looking for someone to show me around the city and find the best tacos.",
        "profession": "Architect",
        "city": "Los Angeles",
        "interests": ["Architecture", "Food", "Travel", "Music"],
        "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "James",
        "email": "james@demo.com",
        "gender": "male",
        "bio": "Avid reader and occasional writer. Let's debate our favorite books over a drink.",
        "profession": "Journalist",
        "city": "Washington DC",
        "interests": ["Books", "Writing", "Politics", "Movies"],
        "photo": "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Sophia",
        "email": "sophia@demo.com",
        "gender": "female",
        "bio": "Professional dancer. Always moving. If you can keep up, swipe right!",
        "profession": "Dancer",
        "city": "Las Vegas",
        "interests": ["Dancing", "Music", "Fitness", "Nightlife"],
        "photo": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Daniel",
        "email": "daniel@demo.com",
        "gender": "male",
        "bio": "Nature lover. I spend my weekends in the mountains. Looking for a hiking buddy.",
        "profession": "Environmental Scientist",
        "city": "Denver",
        "interests": ["Hiking", "Nature", "Camping", "Photography"],
        "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Mia",
        "email": "mia@demo.com",
        "gender": "female",
        "bio": "Gamer, coder, and anime fan. Let's play some co-op games and eat pizza.",
        "profession": "Game Developer",
        "city": "San Jose",
        "interests": ["Gaming", "Technology", "Anime", "Pizza"],
        "photo": "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Lucas",
        "email": "lucas@demo.com",
        "gender": "male",
        "bio": "Skater, surfer, and casual guitarist. Looking for someone with a chill vibe.",
        "profession": "Graphic Designer",
        "city": "San Diego",
        "interests": ["Skating", "Surfing", "Music", "Art"],
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Chloe",
        "email": "chloe@demo.com",
        "gender": "female",
        "bio": "Always planning my next trip. I have an obsession with matcha lattes.",
        "profession": "Travel Blogger",
        "city": "Portland",
        "interests": ["Travel", "Coffee", "Writing", "Photography"],
        "photo": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ethan",
        "email": "ethan@demo.com",
        "gender": "male",
        "bio": "Just a regular guy looking for a regular girl. Love movie marathons and popcorn.",
        "profession": "Accountant",
        "city": "Dallas",
        "interests": ["Movies", "Finance", "Gaming", "Food"],
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Zoe",
        "email": "zoe@demo.com",
        "gender": "female",
        "bio": "Fitness instructor and marathon runner. Let's get active!",
        "profession": "Fitness Coach",
        "city": "Phoenix",
        "interests": ["Fitness", "Sports", "Health", "Running"],
        "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Liam",
        "email": "liam@demo.com",
        "gender": "male",
        "bio": "Tech enthusiast and crypto trader. Can talk about web3 for hours.",
        "profession": "Trader",
        "city": "San Francisco",
        "interests": ["Technology", "Finance", "Gaming", "Business"],
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Aria",
        "email": "aria@demo.com",
        "gender": "female",
        "bio": "Indie music fan, vintage clothes collector, and plant mom.",
        "profession": "Boutique Owner",
        "city": "Brooklyn",
        "interests": ["Fashion", "Music", "Art", "Nature"],
        "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Mason",
        "email": "mason@demo.com",
        "gender": "male",
        "bio": "Stand-up comedy amateur. If I can't make you laugh, the drinks are on me.",
        "profession": "Sales Representative",
        "city": "Chicago",
        "interests": ["Comedy", "Writing", "Movies", "Food"],
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Lily",
        "email": "lily@demo.com",
        "gender": "female",
        "bio": "I spend too much time on TikTok and not enough time reading. Help me change that.",
        "profession": "Social Media Manager",
        "city": "Los Angeles",
        "interests": ["Social Media", "Books", "Movies", "Dancing"],
        "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Logan",
        "email": "logan@demo.com",
        "gender": "male",
        "bio": "I fix cars for a living. I can also fix your broken heart.",
        "profession": "Mechanic",
        "city": "Detroit",
        "interests": ["Cars", "Sports", "Music", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Grace",
        "email": "grace@demo.com",
        "gender": "female",
        "bio": "I bake a mean chocolate chip cookie. Looking for someone to taste test them.",
        "profession": "Baker",
        "city": "Seattle",
        "interests": ["Baking", "Food", "Movies", "Pets"],
        "photo": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Jack",
        "email": "jack@demo.com",
        "gender": "male",
        "bio": "History buff. I love museums and old architecture.",
        "profession": "Teacher",
        "city": "Boston",
        "interests": ["History", "Museums", "Books", "Architecture"],
        "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Hannah",
        "email": "hannah@demo.com",
        "gender": "female",
        "bio": "Dog walker by day, aspiring novelist by night.",
        "profession": "Freelance Writer",
        "city": "Austin",
        "interests": ["Dogs", "Writing", "Books", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Noah",
        "email": "noah@demo.com",
        "gender": "male",
        "bio": "Musician trying to make it big. Come to my next gig!",
        "profession": "Musician",
        "city": "Nashville",
        "interests": ["Music", "Concerts", "Writing", "Nightlife"],
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ava",
        "email": "ava@demo.com",
        "gender": "female",
        "bio": "I love astronomy and stargazing. Let's go to the planetarium.",
        "profession": "Astronomer",
        "city": "Tucson",
        "interests": ["Science", "Nature", "Movies", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
    }
]

async def seed_db():
    print("Clearing old demo users...")
    await db.users.delete_many({"email": {"$regex": "@demo.com"}})
    
    # We must also clean up profiles associated with demo users
    await db.profiles.delete_many({}) # Just wipe profiles and let's rely on users re-registering or demo users
    # Actually wait, let's only wipe demo profiles to keep real users safe if there are any.
    demo_users_cursor = db.users.find({"email": {"$regex": "@demo.com"}})
    demo_users = await demo_users_cursor.to_list(length=None)
    demo_user_ids = [u["_id"] for u in demo_users]
    if demo_user_ids:
        await db.profiles.delete_many({"user_id": {"$in": demo_user_ids}})
    
    print(f"Seeding {len(DEMO_PROFILES)} demo profiles...")
    for p in DEMO_PROFILES:
        # Create user
        user = {
            "email": p["email"],
            "password_hash": HARDCODED_HASH,
            "name": p["name"],
            "date_of_birth": datetime(1995 + random.randint(-5, 5), random.randint(1, 12), random.randint(1, 28)),
            "gender": p["gender"],
            "role": "user",
            "created_at": datetime.now(timezone.utc)
        }
        user_res = await db.users.insert_one(user)
        user_id = user_res.inserted_id

        # Create profile
        profile = {
            "user_id": user_id,
            "bio": p["bio"],
            "profession": p["profession"],
            "city": p["city"],
            "state": "CA", # Mock state
            "interests": p["interests"],
            "languages": ["English"],
            "relationship_goal": random.choice(["Casual dating", "Long-term relationship", "Friendship"]),
            "interested_in": "everyone",
            "max_distance": 50,
            "age_range": {"min": 18, "max": 60},
            "is_visible": True,
            "incognito_mode": False,
            "profile_photo": p["photo"],
            "photos": [p["photo"]]
        }
        await db.profiles.insert_one(profile)

    print("Seed complete! Users created with password 'password123'")

if __name__ == "__main__":
    asyncio.run(seed_db())
