import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone

MONGO_DETAILS = 'mongodb+srv://abhijitve:abhijitve@cluster0.u8obfwb.mongodb.net/'
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client['pairly']

async def create_match():
    # find alex and sarah
    alex = await db.users.find_one({'email': 'alex@demo.com'})
    sarah = await db.users.find_one({'email': 'sarah@demo.com'})
    
    if alex and sarah:
        # Create mutual right swipes
        await db.swipes.update_one(
            {'swiper_id': str(alex['_id']), 'swiped_id': str(sarah['_id'])}, 
            {'$set': {'direction': 'right', 'timestamp': datetime.now(timezone.utc)}}, 
            upsert=True
        )
        await db.swipes.update_one(
            {'swiper_id': str(sarah['_id']), 'swiped_id': str(alex['_id'])}, 
            {'$set': {'direction': 'right', 'timestamp': datetime.now(timezone.utc)}}, 
            upsert=True
        )
        
        # Create match
        match = await db.matches.find_one({'users': {'$all': [str(alex['_id']), str(sarah['_id'])]}})
        if not match:
            match_doc = {
                'users': [str(alex['_id']), str(sarah['_id'])],
                'created_at': datetime.now(timezone.utc),
                'last_message_at': datetime.now(timezone.utc)
            }
            await db.matches.insert_one(match_doc)
        print('Match created successfully between Alex and Sarah!')
    else:
        print('Users not found!')

asyncio.run(create_match())
