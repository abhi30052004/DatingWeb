from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from typing import Annotated, List, Dict
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field

from ..database import get_db
from .auth import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

class ConnectionManager:
    def __init__(self):
        # Maps match_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, match_id: str):
        await websocket.accept()
        if match_id not in self.active_connections:
            self.active_connections[match_id] = []
        self.active_connections[match_id].append(websocket)

    def disconnect(self, websocket: WebSocket, match_id: str):
        if match_id in self.active_connections:
            self.active_connections[match_id].remove(websocket)
            if not self.active_connections[match_id]:
                del self.active_connections[match_id]

    async def broadcast(self, match_id: str, message: dict):
        if match_id in self.active_connections:
            for connection in self.active_connections[match_id]:
                await connection.send_json(message)

manager = ConnectionManager()

class MessageCreate(BaseModel):
    match_id: str
    content: str

class MessageResponse(BaseModel):
    id: str
    match_id: str
    sender_id: str
    content: str
    created_at: datetime

@router.websocket("/ws/{match_id}")
async def websocket_endpoint(websocket: WebSocket, match_id: str):
    await manager.connect(websocket, match_id)
    try:
        while True:
            # We keep the connection open, but we expect messages to come via the REST POST endpoint
            # for simpler authentication and database saving.
            # If the client sends something here, we just ignore it for now.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, match_id)

@router.post("/", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db)
):
    try:
        match_obj_id = ObjectId(message.match_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid match ID")

    # Verify the match exists and the user is part of it
    match = await db["matches"].find_one({
        "_id": match_obj_id,
        "users": current_user["_id"]
    })
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found or you don't have access")

    msg_doc = {
        "match_id": match_obj_id,
        "sender_id": current_user["_id"],
        "content": message.content,
        "created_at": datetime.utcnow()
    }
    
    result = await db["messages"].insert_one(msg_doc)
    
    # Create the response dict
    response_data = {
        "id": str(result.inserted_id),
        "match_id": str(match_obj_id),
        "sender_id": str(current_user["_id"]),
        "content": message.content,
        "created_at": msg_doc["created_at"].isoformat() # Convert to string for JSON
    }
    
    # Broadcast the new message to all clients connected to this match's room
    await manager.broadcast(str(match_obj_id), response_data)
    
    # Broadcast to the global notification manager (only to the recipient)
    from .notifications import notification_manager
    recipient_id = next(uid for uid in match["users"] if uid != current_user["_id"])
    sender_name = current_user.get("name", "Someone")
    
    notification_msg = {
        "type": "NEW_MESSAGE",
        "message": f"💬 {sender_name}: {message.content[:30]}{'...' if len(message.content) > 30 else ''}",
        "match_id": str(match_obj_id)
    }
    await notification_manager.send_personal_message(notification_msg, str(recipient_id))
    
    return response_data

@router.get("/{match_id}", response_model=List[MessageResponse])
async def get_messages(
    match_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db=Depends(get_db)
):
    try:
        match_obj_id = ObjectId(match_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid match ID")

    # Verify access
    match = await db["matches"].find_one({
        "_id": match_obj_id,
        "users": current_user["_id"]
    })
    
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    cursor = db["messages"].find({"match_id": match_obj_id}).sort("created_at", 1)
    messages = await cursor.to_list(length=200)
    
    response = []
    for msg in messages:
        response.append({
            "id": str(msg["_id"]),
            "match_id": str(msg["match_id"]),
            "sender_id": str(msg["sender_id"]),
            "content": msg["content"],
            "created_at": msg["created_at"]
        })
        
    return response
