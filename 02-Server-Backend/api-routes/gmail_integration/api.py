"""
FastAPI REST API for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, date
import structlog

from database import db_manager, email_repo, patient_repo, referral_repo
from models import EmailMessage, EmailAttachment, PatientRecord, MedicalReferral
from main_service import gmail_service
from config import API_CONFIG, FRONTEND_CONFIG

logger = structlog.get_logger(__name__)

# FastAPI app initialization
app = FastAPI(
    title="VITAL RED Gmail Integration API",
    description="API for Gmail integration with VITAL RED medical referral system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class EmailResponse(BaseModel):
    id: int
    gmail_id: str
    subject: str
    sender_email: str
    sender_name: Optional[str]
    date_received: datetime
    processing_status: str
    is_medical_referral: bool
    referral_type: Optional[str]
    priority_level: Optional[str]

class PatientResponse(BaseModel):
    id: int
    document_number: str
    full_name: str
    age: Optional[int]
    phone: Optional[str]
    insurance_provider: Optional[str]
    first_seen: datetime
    last_updated: datetime

class ReferralResponse(BaseModel):
    id: int
    referral_number: str
    referral_type: str
    specialty_requested: str
    priority_level: str
    primary_diagnosis: Optional[str]
    referring_hospital: Optional[str]
    referring_physician: Optional[str]
    referral_date: datetime
    status: str

class ServiceStatusResponse(BaseModel):
    is_running: bool
    last_check: Optional[datetime]
    processed_count: int
    error_count: int
    uptime: float
    database_health: Dict[str, Any]

class ReferralUpdateRequest(BaseModel):
    status: str = Field(..., description="New status for the referral")
    notes: Optional[str] = Field(None, description="Additional notes")
    assigned_to: Optional[str] = Field(None, description="Assigned physician/department")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        health_status = db_manager.health_check()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "service": "gmail_integration",
            "database": health_status
        }
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(status_code=503, detail="Service unhealthy")

# Service management endpoints
@app.get("/service/status", response_model=ServiceStatusResponse)
async def get_service_status():
    """Get Gmail integration service status"""
    try:
        status = gmail_service.get_service_status()
        return ServiceStatusResponse(**status)
    except Exception as e:
        logger.error("Failed to get service status", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get service status")

@app.post("/service/sync")
async def manual_sync(background_tasks: BackgroundTasks):
    """Manually trigger email synchronization"""
    try:
        # Run sync in background
        background_tasks.add_task(gmail_service.manual_sync)
        return {
            "status": "success",
            "message": "Manual sync initiated"
        }
    except Exception as e:
        logger.error("Manual sync failed", error=str(e))
        raise HTTPException(status_code=500, detail="Manual sync failed")

# Email endpoints
@app.get("/emails", response_model=List[EmailResponse])
async def get_emails(
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    is_referral: Optional[bool] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    """Get emails with optional filtering"""
    try:
        with db_manager.get_session() as session:
            query = session.query(EmailMessage)
            
            # Apply filters
            if status:
                query = query.filter(EmailMessage.processing_status == status)
            
            if is_referral is not None:
                query = query.filter(EmailMessage.is_medical_referral == is_referral)
            
            if start_date:
                query = query.filter(EmailMessage.date_received >= start_date)
            
            if end_date:
                query = query.filter(EmailMessage.date_received <= end_date)
            
            # Order by date and limit
            emails = query.order_by(EmailMessage.date_received.desc()).limit(limit).all()
            
            return [EmailResponse(
                id=email.id,
                gmail_id=email.gmail_id,
                subject=email.subject,
                sender_email=email.sender_email,
                sender_name=email.sender_name,
                date_received=email.date_received,
                processing_status=email.processing_status,
                is_medical_referral=email.is_medical_referral,
                referral_type=email.referral_type,
                priority_level=email.priority_level
            ) for email in emails]
            
    except Exception as e:
        logger.error("Failed to get emails", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve emails")

@app.get("/emails/{email_id}")
async def get_email_details(email_id: int):
    """Get detailed information for a specific email"""
    try:
        with db_manager.get_session() as session:
            email = session.query(EmailMessage).filter_by(id=email_id).first()
            
            if not email:
                raise HTTPException(status_code=404, detail="Email not found")
            
            # Get attachments
            attachments = session.query(EmailAttachment).filter_by(
                email_message_id=email_id
            ).all()
            
            return {
                "email": {
                    "id": email.id,
                    "gmail_id": email.gmail_id,
                    "subject": email.subject,
                    "sender_email": email.sender_email,
                    "sender_name": email.sender_name,
                    "date_received": email.date_received,
                    "body_text": email.body_text,
                    "body_html": email.body_html,
                    "processing_status": email.processing_status,
                    "is_medical_referral": email.is_medical_referral,
                    "referral_type": email.referral_type,
                    "priority_level": email.priority_level,
                    "patient_data": email.patient_data,
                    "medical_data": email.medical_data,
                    "referring_institution": email.referring_institution,
                    "referring_physician": email.referring_physician
                },
                "attachments": [{
                    "id": att.id,
                    "filename": att.filename,
                    "mime_type": att.mime_type,
                    "file_size": att.file_size,
                    "document_type": att.document_type,
                    "contains_patient_data": att.contains_patient_data,
                    "contains_medical_data": att.contains_medical_data,
                    "processing_status": att.processing_status
                } for att in attachments]
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get email details", email_id=email_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve email details")

# Patient endpoints
@app.get("/patients", response_model=List[PatientResponse])
async def get_patients(
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None)
):
    """Get patients with optional search"""
    try:
        if search:
            patients = patient_repo.search_patients(search, limit)
        else:
            with db_manager.get_session() as session:
                patients = session.query(PatientRecord).limit(limit).all()
        
        return [PatientResponse(
            id=patient.id,
            document_number=patient.document_number,
            full_name=patient.full_name,
            age=patient.age,
            phone=patient.phone,
            insurance_provider=patient.insurance_provider,
            first_seen=patient.first_seen,
            last_updated=patient.last_updated
        ) for patient in patients]
        
    except Exception as e:
        logger.error("Failed to get patients", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve patients")

@app.get("/patients/{patient_id}")
async def get_patient_details(patient_id: int):
    """Get detailed patient information"""
    try:
        with db_manager.get_session() as session:
            patient = session.query(PatientRecord).filter_by(id=patient_id).first()
            
            if not patient:
                raise HTTPException(status_code=404, detail="Patient not found")
            
            # Get related referrals
            referrals = session.query(MedicalReferral).filter_by(
                patient_record_id=patient_id
            ).all()
            
            return {
                "patient": {
                    "id": patient.id,
                    "document_number": patient.document_number,
                    "document_type": patient.document_type,
                    "full_name": patient.full_name,
                    "first_name": patient.first_name,
                    "last_name": patient.last_name,
                    "age": patient.age,
                    "birth_date": patient.birth_date,
                    "gender": patient.gender,
                    "phone": patient.phone,
                    "email": patient.email,
                    "address": patient.address,
                    "city": patient.city,
                    "insurance_provider": patient.insurance_provider,
                    "insurance_id": patient.insurance_id,
                    "insurance_type": patient.insurance_type,
                    "first_seen": patient.first_seen,
                    "last_updated": patient.last_updated,
                    "source_emails": patient.source_emails
                },
                "referrals": [{
                    "id": ref.id,
                    "referral_number": ref.referral_number,
                    "referral_type": ref.referral_type,
                    "specialty_requested": ref.specialty_requested,
                    "priority_level": ref.priority_level,
                    "primary_diagnosis": ref.primary_diagnosis,
                    "referral_date": ref.referral_date,
                    "status": ref.status
                } for ref in referrals]
            }
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get patient details", patient_id=patient_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve patient details")

# Referral endpoints
@app.get("/referrals", response_model=List[ReferralResponse])
async def get_referrals(
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None),
    priority: Optional[str] = Query(None)
):
    """Get medical referrals with optional filtering"""
    try:
        with db_manager.get_session() as session:
            query = session.query(MedicalReferral)
            
            # Apply filters
            if status:
                query = query.filter(MedicalReferral.status == status)
            
            if specialty:
                query = query.filter(MedicalReferral.specialty_requested == specialty)
            
            if priority:
                query = query.filter(MedicalReferral.priority_level == priority)
            
            # Order by date and limit
            referrals = query.order_by(MedicalReferral.referral_date.desc()).limit(limit).all()
            
            return [ReferralResponse(
                id=ref.id,
                referral_number=ref.referral_number,
                referral_type=ref.referral_type,
                specialty_requested=ref.specialty_requested,
                priority_level=ref.priority_level,
                primary_diagnosis=ref.primary_diagnosis,
                referring_hospital=ref.referring_hospital,
                referring_physician=ref.referring_physician,
                referral_date=ref.referral_date,
                status=ref.status
            ) for ref in referrals]
            
    except Exception as e:
        logger.error("Failed to get referrals", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve referrals")

@app.put("/referrals/{referral_id}")
async def update_referral(referral_id: int, update_data: ReferralUpdateRequest):
    """Update referral status and information"""
    try:
        success = referral_repo.update_referral_status(
            referral_id, 
            update_data.status, 
            update_data.notes
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Referral not found")
        
        return {
            "status": "success",
            "message": "Referral updated successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update referral", referral_id=referral_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to update referral")

# Statistics endpoints
@app.get("/statistics")
async def get_statistics():
    """Get system statistics"""
    try:
        with db_manager.get_session() as session:
            # Email statistics
            total_emails = session.query(EmailMessage).count()
            pending_emails = session.query(EmailMessage).filter_by(processing_status="pending").count()
            medical_referrals = session.query(EmailMessage).filter_by(is_medical_referral=True).count()
            
            # Patient statistics
            total_patients = session.query(PatientRecord).count()
            
            # Referral statistics
            total_referrals = session.query(MedicalReferral).count()
            pending_referrals = session.query(MedicalReferral).filter_by(status="pending").count()
            
            return {
                "emails": {
                    "total": total_emails,
                    "pending": pending_emails,
                    "medical_referrals": medical_referrals
                },
                "patients": {
                    "total": total_patients
                },
                "referrals": {
                    "total": total_referrals,
                    "pending": pending_referrals
                },
                "service": gmail_service.get_service_status()
            }
            
    except Exception as e:
        logger.error("Failed to get statistics", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host=API_CONFIG["HOST"],
        port=API_CONFIG["PORT"],
        reload=API_CONFIG["RELOAD"]
    )
