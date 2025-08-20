"""
WebSocket Server for Real-time Updates - VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import json
import websockets
from datetime import datetime
from typing import Dict, Set, Any, Optional
from websockets.server import WebSocketServerProtocol
import structlog

from database import db_manager, email_repo, referral_repo
from models import EmailMessage, MedicalReferral
from security import audit_logger, access_controller

logger = structlog.get_logger(__name__)

class WebSocketManager:
    """
    Manages WebSocket connections and real-time updates
    """
    
    def __init__(self):
        self.logger = logger.bind(component="websocket_manager")
        self.connections: Set[WebSocketServerProtocol] = set()
        self.user_connections: Dict[str, Set[WebSocketServerProtocol]] = {}
        self.room_connections: Dict[str, Set[WebSocketServerProtocol]] = {}
        
    async def register_connection(self, websocket: WebSocketServerProtocol, user_id: str = None):
        """Register a new WebSocket connection"""
        self.connections.add(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(websocket)
        
        self.logger.info("WebSocket connection registered", 
                        user_id=user_id, 
                        total_connections=len(self.connections))
        
        # Send welcome message
        await self.send_to_connection(websocket, {
            "type": "connection_established",
            "timestamp": datetime.now().isoformat(),
            "message": "Connected to VITAL RED Gmail Integration"
        })
    
    async def unregister_connection(self, websocket: WebSocketServerProtocol):
        """Unregister a WebSocket connection"""
        self.connections.discard(websocket)
        
        # Remove from user connections
        for user_id, user_websockets in self.user_connections.items():
            user_websockets.discard(websocket)
        
        # Remove from room connections
        for room, room_websockets in self.room_connections.items():
            room_websockets.discard(websocket)
        
        self.logger.info("WebSocket connection unregistered", 
                        total_connections=len(self.connections))
    
    async def join_room(self, websocket: WebSocketServerProtocol, room: str):
        """Add connection to a specific room"""
        if room not in self.room_connections:
            self.room_connections[room] = set()
        
        self.room_connections[room].add(websocket)
        
        await self.send_to_connection(websocket, {
            "type": "room_joined",
            "room": room,
            "timestamp": datetime.now().isoformat()
        })
    
    async def leave_room(self, websocket: WebSocketServerProtocol, room: str):
        """Remove connection from a specific room"""
        if room in self.room_connections:
            self.room_connections[room].discard(websocket)
    
    async def send_to_connection(self, websocket: WebSocketServerProtocol, message: Dict[str, Any]):
        """Send message to a specific connection"""
        try:
            await websocket.send(json.dumps(message))
        except websockets.exceptions.ConnectionClosed:
            await self.unregister_connection(websocket)
        except Exception as e:
            self.logger.error("Failed to send message to connection", error=str(e))
    
    async def send_to_user(self, user_id: str, message: Dict[str, Any]):
        """Send message to all connections of a specific user"""
        if user_id in self.user_connections:
            for websocket in self.user_connections[user_id].copy():
                await self.send_to_connection(websocket, message)
    
    async def send_to_room(self, room: str, message: Dict[str, Any]):
        """Send message to all connections in a room"""
        if room in self.room_connections:
            for websocket in self.room_connections[room].copy():
                await self.send_to_connection(websocket, message)
    
    async def broadcast(self, message: Dict[str, Any], exclude_user: str = None):
        """Broadcast message to all connections"""
        for websocket in self.connections.copy():
            # Skip connections of excluded user
            if exclude_user and websocket in self.user_connections.get(exclude_user, set()):
                continue
            
            await self.send_to_connection(websocket, message)
    
    async def notify_new_email(self, email: EmailMessage):
        """Notify about new email"""
        message = {
            "type": "new_email",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "id": email.id,
                "gmail_id": email.gmail_id,
                "subject": email.subject,
                "sender_email": email.sender_email,
                "sender_name": email.sender_name,
                "date_received": email.date_received.isoformat(),
                "is_medical_referral": email.is_medical_referral,
                "priority_level": email.priority_level,
                "processing_status": email.processing_status
            }
        }
        
        # Send to dashboard room
        await self.send_to_room("dashboard", message)
        
        # Send to emails room
        await self.send_to_room("emails", message)
    
    async def notify_new_referral(self, referral: MedicalReferral):
        """Notify about new medical referral"""
        message = {
            "type": "new_referral",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "id": referral.id,
                "referral_number": referral.referral_number,
                "referral_type": referral.referral_type,
                "specialty_requested": referral.specialty_requested,
                "priority_level": referral.priority_level,
                "status": referral.status,
                "referral_date": referral.referral_date.isoformat(),
                "primary_diagnosis": referral.primary_diagnosis,
                "referring_hospital": referral.referring_hospital,
                "referring_physician": referral.referring_physician
            }
        }
        
        # Send to dashboard room
        await self.send_to_room("dashboard", message)
        
        # Send to referrals room
        await self.send_to_room("referrals", message)
        
        # Send to specialty-specific room
        specialty_room = f"specialty_{referral.specialty_requested}"
        await self.send_to_room(specialty_room, message)
    
    async def notify_referral_updated(self, referral: MedicalReferral, old_status: str = None):
        """Notify about referral status update"""
        message = {
            "type": "referral_updated",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "id": referral.id,
                "referral_number": referral.referral_number,
                "old_status": old_status,
                "new_status": referral.status,
                "specialty_requested": referral.specialty_requested,
                "priority_level": referral.priority_level,
                "updated_at": referral.updated_at.isoformat() if referral.updated_at else None
            }
        }
        
        # Send to relevant rooms
        await self.send_to_room("dashboard", message)
        await self.send_to_room("referrals", message)
        
        specialty_room = f"specialty_{referral.specialty_requested}"
        await self.send_to_room(specialty_room, message)
    
    async def notify_processing_status(self, email_id: int, status: str, message_text: str = None):
        """Notify about email processing status"""
        message = {
            "type": "processing_status",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "email_id": email_id,
                "status": status,
                "message": message_text
            }
        }
        
        await self.send_to_room("processing", message)
    
    async def notify_system_alert(self, alert_level: str, title: str, message_text: str):
        """Notify about system alerts"""
        message = {
            "type": "system_alert",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "level": alert_level,
                "title": title,
                "message": message_text
            }
        }
        
        await self.send_to_room("alerts", message)
        
        # Also broadcast critical alerts
        if alert_level == "CRITICAL":
            await self.broadcast(message)

# Global WebSocket manager instance
websocket_manager = WebSocketManager()

async def handle_websocket_connection(websocket: WebSocketServerProtocol, path: str):
    """Handle incoming WebSocket connections"""
    logger.info("New WebSocket connection", path=path)
    
    user_id = None
    
    try:
        # Register connection
        await websocket_manager.register_connection(websocket, user_id)
        
        # Handle messages
        async for message in websocket:
            try:
                data = json.loads(message)
                await handle_websocket_message(websocket, data)
            except json.JSONDecodeError:
                await websocket_manager.send_to_connection(websocket, {
                    "type": "error",
                    "message": "Invalid JSON format"
                })
            except Exception as e:
                logger.error("Error handling WebSocket message", error=str(e))
                await websocket_manager.send_to_connection(websocket, {
                    "type": "error",
                    "message": "Internal server error"
                })
    
    except websockets.exceptions.ConnectionClosed:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error("WebSocket connection error", error=str(e))
    finally:
        await websocket_manager.unregister_connection(websocket)

async def handle_websocket_message(websocket: WebSocketServerProtocol, data: Dict[str, Any]):
    """Handle incoming WebSocket messages"""
    message_type = data.get("type")
    
    if message_type == "join_room":
        room = data.get("room")
        if room:
            await websocket_manager.join_room(websocket, room)
    
    elif message_type == "leave_room":
        room = data.get("room")
        if room:
            await websocket_manager.leave_room(websocket, room)
    
    elif message_type == "get_recent_emails":
        await send_recent_emails(websocket, data.get("limit", 10))
    
    elif message_type == "get_recent_referrals":
        await send_recent_referrals(websocket, data.get("limit", 10))
    
    elif message_type == "get_statistics":
        await send_statistics(websocket)
    
    elif message_type == "ping":
        await websocket_manager.send_to_connection(websocket, {
            "type": "pong",
            "timestamp": datetime.now().isoformat()
        })
    
    else:
        await websocket_manager.send_to_connection(websocket, {
            "type": "error",
            "message": f"Unknown message type: {message_type}"
        })

async def send_recent_emails(websocket: WebSocketServerProtocol, limit: int):
    """Send recent emails to client"""
    try:
        emails = email_repo.get_medical_referrals(limit=limit)
        
        email_data = []
        for email in emails:
            email_data.append({
                "id": email.id,
                "gmail_id": email.gmail_id,
                "subject": email.subject,
                "sender_email": email.sender_email,
                "sender_name": email.sender_name,
                "date_received": email.date_received.isoformat(),
                "is_medical_referral": email.is_medical_referral,
                "priority_level": email.priority_level,
                "processing_status": email.processing_status
            })
        
        await websocket_manager.send_to_connection(websocket, {
            "type": "recent_emails",
            "timestamp": datetime.now().isoformat(),
            "data": email_data
        })
        
    except Exception as e:
        logger.error("Failed to send recent emails", error=str(e))
        await websocket_manager.send_to_connection(websocket, {
            "type": "error",
            "message": "Failed to fetch recent emails"
        })

async def send_recent_referrals(websocket: WebSocketServerProtocol, limit: int):
    """Send recent referrals to client"""
    try:
        referrals = referral_repo.get_referrals_by_status("pending", limit=limit)
        
        referral_data = []
        for referral in referrals:
            referral_data.append({
                "id": referral.id,
                "referral_number": referral.referral_number,
                "referral_type": referral.referral_type,
                "specialty_requested": referral.specialty_requested,
                "priority_level": referral.priority_level,
                "status": referral.status,
                "referral_date": referral.referral_date.isoformat(),
                "primary_diagnosis": referral.primary_diagnosis,
                "referring_hospital": referral.referring_hospital,
                "referring_physician": referral.referring_physician
            })
        
        await websocket_manager.send_to_connection(websocket, {
            "type": "recent_referrals",
            "timestamp": datetime.now().isoformat(),
            "data": referral_data
        })
        
    except Exception as e:
        logger.error("Failed to send recent referrals", error=str(e))
        await websocket_manager.send_to_connection(websocket, {
            "type": "error",
            "message": "Failed to fetch recent referrals"
        })

async def send_statistics(websocket: WebSocketServerProtocol):
    """Send system statistics to client"""
    try:
        with db_manager.get_session() as session:
            total_emails = session.query(EmailMessage).count()
            pending_emails = session.query(EmailMessage).filter_by(processing_status="pending").count()
            medical_referrals = session.query(EmailMessage).filter_by(is_medical_referral=True).count()
            
            total_referrals = session.query(MedicalReferral).count()
            pending_referrals = session.query(MedicalReferral).filter_by(status="pending").count()
            
            stats = {
                "emails": {
                    "total": total_emails,
                    "pending": pending_emails,
                    "medical_referrals": medical_referrals
                },
                "referrals": {
                    "total": total_referrals,
                    "pending": pending_referrals
                },
                "timestamp": datetime.now().isoformat()
            }
        
        await websocket_manager.send_to_connection(websocket, {
            "type": "statistics",
            "timestamp": datetime.now().isoformat(),
            "data": stats
        })
        
    except Exception as e:
        logger.error("Failed to send statistics", error=str(e))
        await websocket_manager.send_to_connection(websocket, {
            "type": "error",
            "message": "Failed to fetch statistics"
        })

async def start_websocket_server(host: str = "localhost", port: int = 8002):
    """Start the WebSocket server"""
    logger.info("Starting WebSocket server", host=host, port=port)
    
    server = await websockets.serve(
        handle_websocket_connection,
        host,
        port,
        ping_interval=30,
        ping_timeout=10
    )
    
    logger.info("WebSocket server started", host=host, port=port)
    return server

# Integration functions for use by other modules
async def notify_new_email_processed(email: EmailMessage):
    """Notify WebSocket clients about new processed email"""
    await websocket_manager.notify_new_email(email)

async def notify_new_referral_created(referral: MedicalReferral):
    """Notify WebSocket clients about new referral"""
    await websocket_manager.notify_new_referral(referral)

async def notify_referral_status_changed(referral: MedicalReferral, old_status: str = None):
    """Notify WebSocket clients about referral status change"""
    await websocket_manager.notify_referral_updated(referral, old_status)

async def notify_processing_update(email_id: int, status: str, message: str = None):
    """Notify WebSocket clients about processing status"""
    await websocket_manager.notify_processing_status(email_id, status, message)

async def notify_system_alert(level: str, title: str, message: str):
    """Notify WebSocket clients about system alerts"""
    await websocket_manager.notify_system_alert(level, title, message)
