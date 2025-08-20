"""
Frontend Integration Module for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import json
import aiohttp
from typing import Dict, Any, List, Optional
from datetime import datetime
import structlog

from database import db_manager, email_repo, referral_repo
from models import EmailMessage, EmailAttachment, PatientRecord, MedicalReferral
from config import FRONTEND_CONFIG

logger = structlog.get_logger(__name__)

class VitalRedIntegration:
    """
    Integration layer between Gmail processing and VITAL RED React frontend
    """
    
    def __init__(self):
        self.logger = logger.bind(component="frontend_integration")
        self.frontend_api = FRONTEND_CONFIG["API_ENDPOINT"]
        self.webhook_url = FRONTEND_CONFIG["WEBHOOK_URL"]
        self.auth_token = FRONTEND_CONFIG["AUTH_TOKEN"]
        self.sync_interval = FRONTEND_CONFIG["SYNC_INTERVAL"]
        
        # HTTP session for API calls
        self.session = None
    
    async def initialize(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession(
            headers={
                "Authorization": f"Bearer {self.auth_token}",
                "Content-Type": "application/json"
            },
            timeout=aiohttp.ClientTimeout(total=30)
        )
        self.logger.info("Frontend integration initialized")
    
    async def close(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()
    
    async def sync_new_referrals(self):
        """Sync new medical referrals to VITAL RED frontend"""
        try:
            self.logger.info("Syncing new referrals to frontend")
            
            # Get pending referrals from last sync
            pending_referrals = referral_repo.get_referrals_by_status("pending", limit=50)
            
            for referral in pending_referrals:
                await self._send_referral_to_frontend(referral)
            
            self.logger.info(f"Synced {len(pending_referrals)} referrals to frontend")
            
        except Exception as e:
            self.logger.error("Failed to sync referrals", error=str(e))
    
    async def _send_referral_to_frontend(self, referral):
        """Send individual referral to frontend"""
        try:
            # Get related email and patient data
            with db_manager.get_session() as session:
                email = session.query(EmailMessage).filter_by(id=referral.email_message_id).first()
                patient = session.query(PatientRecord).filter_by(id=referral.patient_record_id).first()
                attachments = session.query(EmailAttachment).filter_by(
                    email_message_id=referral.email_message_id
                ).all()
            
            # Prepare referral data for frontend
            referral_data = {
                "id": referral.id,
                "referral_number": referral.referral_number,
                "type": referral.referral_type,
                "specialty": referral.specialty_requested,
                "priority": referral.priority_level,
                "status": referral.status,
                "diagnosis": referral.primary_diagnosis,
                "clinical_summary": referral.clinical_summary,
                "reason": referral.reason_for_referral,
                "referring_hospital": referral.referring_hospital,
                "referring_physician": referral.referring_physician,
                "referral_date": referral.referral_date.isoformat(),
                "created_at": referral.created_at.isoformat(),
                
                # Patient information
                "patient": {
                    "id": patient.id if patient else None,
                    "document_number": patient.document_number if patient else None,
                    "full_name": patient.full_name if patient else None,
                    "age": patient.age if patient else None,
                    "insurance_provider": patient.insurance_provider if patient else None
                } if patient else None,
                
                # Email information
                "email": {
                    "id": email.id if email else None,
                    "subject": email.subject if email else None,
                    "sender": email.sender_email if email else None,
                    "date_received": email.date_received.isoformat() if email else None
                } if email else None,
                
                # Attachments
                "attachments": [{
                    "id": att.id,
                    "filename": att.filename,
                    "document_type": att.document_type,
                    "contains_patient_data": att.contains_patient_data,
                    "contains_medical_data": att.contains_medical_data
                } for att in attachments] if attachments else []
            }
            
            # Send to frontend API
            await self._post_to_frontend("/referrals", referral_data)
            
            self.logger.debug("Referral sent to frontend", referral_id=referral.id)
            
        except Exception as e:
            self.logger.error("Failed to send referral to frontend", 
                            referral_id=referral.id, error=str(e))
    
    async def _post_to_frontend(self, endpoint: str, data: Dict[str, Any]):
        """Make POST request to frontend API"""
        try:
            url = f"{self.frontend_api}{endpoint}"
            
            async with self.session.post(url, json=data) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_text = await response.text()
                    raise Exception(f"Frontend API error {response.status}: {error_text}")
                    
        except Exception as e:
            self.logger.error("Frontend API request failed", 
                            endpoint=endpoint, error=str(e))
            raise
    
    async def send_webhook_notification(self, event_type: str, data: Dict[str, Any]):
        """Send webhook notification to frontend"""
        try:
            webhook_data = {
                "event": event_type,
                "timestamp": datetime.now().isoformat(),
                "data": data
            }
            
            async with self.session.post(self.webhook_url, json=webhook_data) as response:
                if response.status != 200:
                    error_text = await response.text()
                    self.logger.warning("Webhook delivery failed", 
                                      status=response.status, error=error_text)
                else:
                    self.logger.debug("Webhook delivered successfully", event=event_type)
                    
        except Exception as e:
            self.logger.error("Webhook delivery error", event=event_type, error=str(e))
    
    async def notify_new_referral(self, referral_id: int):
        """Notify frontend of new referral"""
        await self.send_webhook_notification("new_referral", {"referral_id": referral_id})
    
    async def notify_referral_updated(self, referral_id: int, status: str):
        """Notify frontend of referral status update"""
        await self.send_webhook_notification("referral_updated", {
            "referral_id": referral_id,
            "status": status
        })
    
    async def notify_processing_error(self, email_id: int, error: str):
        """Notify frontend of processing error"""
        await self.send_webhook_notification("processing_error", {
            "email_id": email_id,
            "error": error
        })
    
    async def get_frontend_status(self) -> Dict[str, Any]:
        """Get status from frontend API"""
        try:
            async with self.session.get(f"{self.frontend_api}/status") as response:
                if response.status == 200:
                    return await response.json()
                else:
                    return {"status": "error", "message": f"HTTP {response.status}"}
                    
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def sync_referral_updates(self):
        """Sync referral status updates from frontend"""
        try:
            # Get referrals that might have been updated in frontend
            with db_manager.get_session() as session:
                referrals = session.query(MedicalReferral).filter(
                    MedicalReferral.status.in_(["pending", "in_review", "assigned"])
                ).all()
            
            for referral in referrals:
                await self._check_referral_updates(referral)
                
        except Exception as e:
            self.logger.error("Failed to sync referral updates", error=str(e))
    
    async def _check_referral_updates(self, referral):
        """Check for updates to a specific referral in frontend"""
        try:
            # Get current status from frontend
            async with self.session.get(
                f"{self.frontend_api}/referrals/{referral.id}"
            ) as response:
                if response.status == 200:
                    frontend_data = await response.json()
                    frontend_status = frontend_data.get("status")
                    
                    # Update local status if different
                    if frontend_status and frontend_status != referral.status:
                        referral_repo.update_referral_status(
                            referral.id, 
                            frontend_status,
                            f"Updated from frontend at {datetime.now()}"
                        )
                        
                        self.logger.info("Referral status updated from frontend",
                                       referral_id=referral.id,
                                       old_status=referral.status,
                                       new_status=frontend_status)
                        
        except Exception as e:
            self.logger.error("Failed to check referral updates",
                            referral_id=referral.id, error=str(e))

class FrontendDataTransformer:
    """
    Transform Gmail integration data for VITAL RED frontend consumption
    """
    
    @staticmethod
    def transform_referral_for_dashboard(referral, email=None, patient=None) -> Dict[str, Any]:
        """Transform referral data for dashboard display"""
        return {
            "id": referral.id,
            "referralNumber": referral.referral_number,
            "patientName": patient.full_name if patient else "Unknown",
            "patientDocument": patient.document_number if patient else None,
            "specialty": referral.specialty_requested,
            "priority": referral.priority_level,
            "status": referral.status,
            "diagnosis": referral.primary_diagnosis,
            "referringHospital": referral.referring_hospital,
            "referringPhysician": referral.referring_physician,
            "referralDate": referral.referral_date.isoformat(),
            "emailSubject": email.subject if email else None,
            "emailSender": email.sender_email if email else None,
            "hasAttachments": bool(email and email.attachments) if email else False,
            "urgencyLevel": FrontendDataTransformer._map_priority_to_urgency(referral.priority_level),
            "estimatedProcessingTime": FrontendDataTransformer._estimate_processing_time(referral),
            "tags": FrontendDataTransformer._generate_tags(referral, email)
        }
    
    @staticmethod
    def _map_priority_to_urgency(priority: str) -> str:
        """Map internal priority to frontend urgency levels"""
        mapping = {
            "alta": "urgent",
            "media": "normal", 
            "baja": "low"
        }
        return mapping.get(priority, "normal")
    
    @staticmethod
    def _estimate_processing_time(referral) -> str:
        """Estimate processing time based on priority and specialty"""
        if referral.priority_level == "alta":
            return "< 2 hours"
        elif referral.priority_level == "media":
            return "< 24 hours"
        else:
            return "< 72 hours"
    
    @staticmethod
    def _generate_tags(referral, email=None) -> List[str]:
        """Generate tags for referral categorization"""
        tags = []
        
        # Priority tags
        if referral.priority_level == "alta":
            tags.append("urgent")
        
        # Specialty tags
        if referral.specialty_requested:
            tags.append(referral.specialty_requested.lower().replace(" ", "_"))
        
        # Source tags
        if email and email.sender_email:
            domain = email.sender_email.split("@")[-1]
            tags.append(f"from_{domain.replace('.', '_')}")
        
        # Document tags
        if email and email.attachments:
            for attachment in email.attachments:
                if attachment.document_type:
                    tags.append(f"has_{attachment.document_type}")
        
        return tags

# Global integration instance
frontend_integration = VitalRedIntegration()

async def initialize_frontend_integration():
    """Initialize frontend integration"""
    await frontend_integration.initialize()

async def cleanup_frontend_integration():
    """Cleanup frontend integration"""
    await frontend_integration.close()

# Background task for continuous sync
async def continuous_sync_task():
    """Background task for continuous synchronization with frontend"""
    while True:
        try:
            await frontend_integration.sync_new_referrals()
            await frontend_integration.sync_referral_updates()
            await asyncio.sleep(frontend_integration.sync_interval)
        except Exception as e:
            logger.error("Continuous sync task error", error=str(e))
            await asyncio.sleep(60)  # Wait 1 minute before retrying
