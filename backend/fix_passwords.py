import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import os

MONGO_DETAILS = 'mongodb+srv://abhijitve:abhijitve@cluster0.u8obfwb.mongodb.net/'
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client['pairly']

async def fix_passwords():
    # Hash password123
    new_hash = bcrypt.hashpw(b'password123', bcrypt.gensalt()).decode('utf-8')
    
    # Update all demo users
    result = await db.users.update_many(
        {'email': {'$regex': '@demo.com'}},
        {'$set': {'password_hash': new_hash}}
    )
    print(f"Updated passwords for {result.modified_count} users to 'password123'")

asyncio.run(fix_passwords())
