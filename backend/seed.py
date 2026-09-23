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

# Pre-computed bcrypt hash for "password123"
HARDCODED_HASH = "$2b$12$YvYF/j8M9X8elUSqx9saJ.0EbJE5QRwVrNFIvWaYRE2iVc75Gwnl6"

DEMO_PROFILES = [
    {
        "name": "Alex",
        "email": "alex@demo.com",
        "gender": "male",
        "dob": datetime(1995, 4, 12),
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
        "dob": datetime(1997, 8, 23),
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
        "dob": datetime(1993, 11, 5),
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
        "dob": datetime(1998, 3, 17),
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
        "dob": datetime(1991, 7, 30),
        "bio": "Entrepreneur and fitness junkie. I work hard but I know how to have a good time.",
        "profession": "Founder & CEO",
        "city": "Miami",
        "interests": ["Fitness", "Business", "Travel", "Sports"],
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Jessica",
        "email": "jessica@demo.com",
        "gender": "female",
        "dob": datetime(1996, 1, 9),
        "bio": "Art history major turned UI designer. I love visiting museums and discussing design over coffee.",
        "profession": "UX/UI Designer",
        "city": "Chicago",
        "interests": ["Art", "Design", "Museums", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ryan",
        "email": "ryan@demo.com",
        "gender": "male",
        "dob": datetime(1994, 5, 20),
        "bio": "Med student trying to find some work/life balance. Coffee is my best friend and worst enemy.",
        "profession": "Medical Student",
        "city": "Boston",
        "interests": ["Coffee", "Science", "Running", "Reading"],
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Olivia",
        "email": "olivia@demo.com",
        "gender": "female",
        "dob": datetime(1999, 10, 2),
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
        "dob": datetime(1992, 6, 14),
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
        "dob": datetime(1997, 12, 25),
        "bio": "Professional dancer. Always moving. If you can keep up, swipe right!",
        "profession": "Dancer & Choreographer",
        "city": "Las Vegas",
        "interests": ["Dancing", "Music", "Fitness", "Nightlife"],
        "photo": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Daniel",
        "email": "daniel@demo.com",
        "gender": "male",
        "dob": datetime(1990, 9, 8),
        "bio": "Nature lover. I spend my weekends in the mountains. Looking for a hiking buddy who can keep up.",
        "profession": "Environmental Scientist",
        "city": "Denver",
        "interests": ["Hiking", "Nature", "Camping", "Photography"],
        "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Mia",
        "email": "mia@demo.com",
        "gender": "female",
        "dob": datetime(2000, 2, 14),
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
        "dob": datetime(1996, 7, 19),
        "bio": "Skater, surfer, and casual guitarist. Looking for someone with a chill vibe.",
        "profession": "Graphic Designer",
        "city": "San Diego",
        "interests": ["Skating", "Surfing", "Music", "Art"],
        "photo": "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Chloe",
        "email": "chloe@demo.com",
        "gender": "female",
        "dob": datetime(1995, 4, 3),
        "bio": "Always planning my next trip. I have an obsession with matcha lattes and vintage bookstores.",
        "profession": "Travel Blogger",
        "city": "Portland",
        "interests": ["Travel", "Coffee", "Writing", "Photography"],
        "photo": "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ethan",
        "email": "ethan@demo.com",
        "gender": "male",
        "dob": datetime(1993, 11, 27),
        "bio": "Just a regular guy who loves movie marathons, popcorn, and making people laugh.",
        "profession": "Accountant",
        "city": "Dallas",
        "interests": ["Movies", "Finance", "Gaming", "Food"],
        "photo": "https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Zoe",
        "email": "zoe@demo.com",
        "gender": "female",
        "dob": datetime(1994, 8, 11),
        "bio": "Fitness instructor and marathon runner. Health is wealth. Let's get active!",
        "profession": "Fitness Coach",
        "city": "Phoenix",
        "interests": ["Fitness", "Sports", "Health", "Running"],
        "photo": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Liam",
        "email": "liam@demo.com",
        "gender": "male",
        "dob": datetime(1997, 1, 16),
        "bio": "Tech enthusiast and startup guy. Can talk about the future of AI for hours.",
        "profession": "Product Manager",
        "city": "San Francisco",
        "interests": ["Technology", "Finance", "Gaming", "Business"],
        "photo": "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Aria",
        "email": "aria@demo.com",
        "gender": "female",
        "dob": datetime(1998, 5, 29),
        "bio": "Indie music fan, vintage clothes collector, and proud plant mom of 47 plants.",
        "profession": "Boutique Owner",
        "city": "Brooklyn",
        "interests": ["Fashion", "Music", "Art", "Nature"],
        "photo": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Mason",
        "email": "mason@demo.com",
        "gender": "male",
        "dob": datetime(1991, 3, 6),
        "bio": "Stand-up comedy amateur. If I can't make you laugh, the drinks are on me.",
        "profession": "Marketing Director",
        "city": "Chicago",
        "interests": ["Comedy", "Writing", "Movies", "Food"],
        "photo": "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Lily",
        "email": "lily@demo.com",
        "gender": "female",
        "dob": datetime(2001, 9, 18),
        "bio": "Content creator, coffee addict, and aspiring reader. Help me put down my phone.",
        "profession": "Social Media Manager",
        "city": "Los Angeles",
        "interests": ["Social Media", "Books", "Movies", "Dancing"],
        "photo": "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Logan",
        "email": "logan@demo.com",
        "gender": "male",
        "dob": datetime(1989, 12, 10),
        "bio": "I fix cars for a living and am pretty handy around the house. Can also fix a broken heart.",
        "profession": "Automotive Engineer",
        "city": "Detroit",
        "interests": ["Cars", "Sports", "Music", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Grace",
        "email": "grace@demo.com",
        "gender": "female",
        "dob": datetime(1996, 6, 22),
        "bio": "I bake a mean chocolate chip cookie. Looking for someone to taste test them with me.",
        "profession": "Pastry Chef",
        "city": "Seattle",
        "interests": ["Baking", "Food", "Movies", "Pets"],
        "photo": "https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Jack",
        "email": "jack@demo.com",
        "gender": "male",
        "dob": datetime(1988, 10, 15),
        "bio": "History buff and museum lover. Let's get lost exploring an old city together.",
        "profession": "History Teacher",
        "city": "Boston",
        "interests": ["History", "Museums", "Books", "Architecture"],
        "photo": "https://images.unsplash.com/photo-1495216875107-c6c043eb703f?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Hannah",
        "email": "hannah@demo.com",
        "gender": "female",
        "dob": datetime(1999, 7, 4),
        "bio": "Dog walker by day, aspiring novelist by night. My golden retriever is a better judge of character than I am.",
        "profession": "Freelance Writer",
        "city": "Austin",
        "interests": ["Dogs", "Writing", "Books", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1546961342-ea5f60b193ef?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Noah",
        "email": "noah@demo.com",
        "gender": "male",
        "dob": datetime(1993, 2, 28),
        "bio": "Musician trying to make it big. Come to my next gig — I promise I'm better than my bio.",
        "profession": "Musician",
        "city": "Nashville",
        "interests": ["Music", "Concerts", "Writing", "Nightlife"],
        "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"
    },
    {
        "name": "Ava",
        "email": "ava@demo.com",
        "gender": "female",
        "dob": datetime(1995, 11, 7),
        "bio": "I love astronomy and stargazing. Let's go to the planetarium and then get tacos.",
        "profession": "Astrophysicist",
        "city": "Tucson",
        "interests": ["Science", "Nature", "Movies", "Coffee"],
        "photo": "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=600&q=80"
    },
]


async def seed_db():
    print("Starting seed...")

    seeded = 0
    skipped = 0

    for p in DEMO_PROFILES:
        # Skip if this email already exists
        existing = await db.users.find_one({"email": p["email"]})
        if existing:
            # Update profile photo in case it changed
            await db.profiles.update_one(
                {"user_id": existing["_id"]},
                {"$set": {"profile_photo": p["photo"], "bio": p["bio"], "city": p["city"],
                          "profession": p["profession"], "interests": p["interests"]}}
            )
            skipped += 1
            continue

        # Create user
        user_doc = {
            "email": p["email"],
            "password_hash": HARDCODED_HASH,
            "name": p["name"],
            "date_of_birth": p["dob"],
            "gender": p["gender"],
            "role": "user",
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }
        user_res = await db.users.insert_one(user_doc)
        user_id = user_res.inserted_id

        # Create profile
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
        await db.profiles.insert_one(profile_doc)
        seeded += 1

    print(f"Done! Seeded: {seeded} new users, Skipped (already exist): {skipped}")
    print("Login password for all demo users: password123")


if __name__ == "__main__":
    asyncio.run(seed_db())
