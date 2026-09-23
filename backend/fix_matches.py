import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

MONGO_DETAILS = 'mongodb+srv://abhijitve:abhijitve@cluster0.u8obfwb.mongodb.net/'
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client['pairly']

async def fix():
    # Remove all faulty matches and swipes that used string IDs or incorrect field names
    await db.matches.delete_many({})
    await db.swipes.delete_many({'swiper_id': {'$exists': True}})
    
    alex = await db.users.find_one({'email': 'alex@demo.com'})
    sarah = await db.users.find_one({'email': 'sarah@demo.com'})
    
    if alex and sarah:
        # Create proper ObjectId swipes
        await db.swipes.insert_one({'user_id': alex['_id'], 'target_user_id': sarah['_id'], 'action': 'LIKE', 'created_at': datetime.utcnow()})
        await db.swipes.insert_one({'user_id': sarah['_id'], 'target_user_id': alex['_id'], 'action': 'LIKE', 'created_at': datetime.utcnow()})
        
        # Create proper ObjectId match
        await db.matches.insert_one({'users': [alex['_id'], sarah['_id']], 'created_at': datetime.utcnow()})
        print('Fixed matches and swipes for Alex and Sarah!')

asyncio.run(fix())
