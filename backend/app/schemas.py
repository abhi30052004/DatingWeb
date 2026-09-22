from pydantic import BaseModel, EmailStr, Field
from pydantic.functional_validators import BeforeValidator
from typing import Annotated, Optional
from datetime import date, datetime

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    name: str
    email: EmailStr
    date_of_birth: date
    gender: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    role: str
    status: str
    created_at: datetime
    profile_photo: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ProfileBase(BaseModel):
    bio: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    relationship_goal: Optional[str] = ""
    profile_photo: Optional[str] = ""
    photos: Optional[list[str]] = []
    interests: Optional[list[str]] = []
    languages: Optional[list[str]] = []
    
    # Preferences
    interested_in: Optional[str] = "everyone"
    min_age: Optional[int] = 18
    max_age: Optional[int] = 99
    
    # Lifestyle
    smoking: Optional[str] = "No preference"
    drinking: Optional[str] = "No preference"
    pets: Optional[str] = "No preference"
    
    # Personality
    introvert_extrovert: Optional[str] = ""
    weekend_preference: Optional[str] = ""
    personality_traits: Optional[list[str]] = []

class ProfileUpdate(ProfileBase):
    name: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: PyObjectId

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class SwipeCreate(BaseModel):
    target_user_id: str
    action: str # "LIKE" | "PASS" | "SUPER_LIKE"

class MatchResponse(BaseModel):
    match: bool
    matched_user_id: Optional[str] = None

