"""
Database Models for Gmail Integration - VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, JSON, ForeignKey, LargeBinary, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, Dict, Any, List
import uuid

Base = declarative_base()

class EmailMessage(Base):
    """
    Main table for storing Gmail messages related to medical referrals
    """
    __tablename__ = "email_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    gmail_id = Column(String(255), unique=True, index=True, nullable=False)
    thread_id = Column(String(255), index=True)
    
    # Email metadata
    subject = Column(Text, nullable=False)
    sender_email = Column(String(255), nullable=False, index=True)
    sender_name = Column(String(255))
    recipient_email = Column(String(255), nullable=False)
    date_received = Column(DateTime, nullable=False, index=True)
    date_processed = Column(DateTime, default=func.now())
    
    # Email content
    body_text = Column(Text)
    body_html = Column(Text)
    snippet = Column(Text)
    
    # Processing status
    processing_status = Column(String(50), default="pending", index=True)  # pending, processing, completed, error
    processing_error = Column(Text)
    retry_count = Column(Integer, default=0)
    
    # Medical referral classification
    is_medical_referral = Column(Boolean, default=False, index=True)
    referral_type = Column(String(100))  # urgente, programado, interconsulta
    priority_level = Column(String(20))  # alta, media, baja
    
    # Extracted medical information
    patient_data = Column(JSON)  # Structured patient information
    medical_data = Column(JSON)  # Diagnosis, specialty, etc.
    referring_institution = Column(String(255))
    referring_physician = Column(String(255))
    
    # AI Processing fields
    ai_processed = Column(Boolean, default=False)
    extracted_data = Column(JSON)  # AI extracted fields
    confidence_score = Column(Float, default=0.0)
    processing_time = Column(Integer, default=0)  # Processing time in seconds
    error_message = Column(Text)
    status = Column(String(50), default="pending")  # pending, processed, error
    attachment_count = Column(Integer, default=0)

    # System metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    processed_by = Column(String(100))  # System user/process identifier
    
    # Relationships
    attachments = relationship("EmailAttachment", back_populates="email_message", cascade="all, delete-orphan")
    processing_logs = relationship("ProcessingLog", back_populates="email_message", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<EmailMessage(id={self.id}, gmail_id='{self.gmail_id}', subject='{self.subject[:50]}...')>"

class EmailAttachment(Base):
    """
    Table for storing email attachments and their processed content
    """
    __tablename__ = "email_attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    email_message_id = Column(Integer, ForeignKey("email_messages.id"), nullable=False)
    
    # Attachment metadata
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    attachment_id = Column(String(255))  # Gmail attachment ID
    
    # File storage
    file_path = Column(String(500))  # Path to stored file
    file_hash = Column(String(64))   # SHA-256 hash for integrity
    is_encrypted = Column(Boolean, default=False)
    
    # Content extraction
    extracted_text = Column(Text)
    ocr_text = Column(Text)
    extraction_method = Column(String(50))  # pdf, ocr, docx, etc.
    extraction_confidence = Column(Float)
    
    # Medical document classification
    document_type = Column(String(100))  # epicrisis, laboratorio, imagen, etc.
    contains_patient_data = Column(Boolean, default=False)
    contains_medical_data = Column(Boolean, default=False)
    
    # Processing status
    processing_status = Column(String(50), default="pending")
    processing_error = Column(Text)
    
    # System metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    email_message = relationship("EmailMessage", back_populates="attachments")
    
    def __repr__(self):
        return f"<EmailAttachment(id={self.id}, filename='{self.filename}', type='{self.document_type}')>"

class ProcessingLog(Base):
    """
    Detailed logging table for tracking email processing steps
    """
    __tablename__ = "processing_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    email_message_id = Column(Integer, ForeignKey("email_messages.id"), nullable=False)
    
    # Log details
    step_name = Column(String(100), nullable=False)  # fetch, parse, extract, classify, etc.
    status = Column(String(20), nullable=False)      # started, completed, error
    message = Column(Text)
    error_details = Column(Text)
    
    # Performance metrics
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    duration_seconds = Column(Float)
    
    # Additional data
    additional_metadata = Column(JSON)  # Any additional step-specific data
    
    # System metadata
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    email_message = relationship("EmailMessage", back_populates="processing_logs")
    
    def __repr__(self):
        return f"<ProcessingLog(id={self.id}, step='{self.step_name}', status='{self.status}')>"

class PatientRecord(Base):
    """
    Consolidated patient information extracted from emails
    """
    __tablename__ = "patient_records"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Patient identification
    document_number = Column(String(20), unique=True, index=True)
    document_type = Column(String(10))  # CC, TI, CE, etc.
    full_name = Column(String(255), nullable=False, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    
    # Demographics
    age = Column(Integer)
    birth_date = Column(DateTime)
    gender = Column(String(10))
    
    # Contact information
    phone = Column(String(20))
    email = Column(String(255))
    address = Column(Text)
    city = Column(String(100))
    
    # Insurance information
    insurance_provider = Column(String(255))
    insurance_id = Column(String(50))
    insurance_type = Column(String(50))  # contributivo, subsidiado, etc.
    
    # System metadata
    first_seen = Column(DateTime, default=func.now())
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    source_emails = Column(JSON)  # List of email IDs that mention this patient
    
    def __repr__(self):
        return f"<PatientRecord(id={self.id}, name='{self.full_name}', document='{self.document_number}')>"

class MedicalReferral(Base):
    """
    Structured medical referral information extracted from emails
    """
    __tablename__ = "medical_referrals"
    
    id = Column(Integer, primary_key=True, index=True)
    email_message_id = Column(Integer, ForeignKey("email_messages.id"), nullable=False)
    patient_record_id = Column(Integer, ForeignKey("patient_records.id"))
    
    # Referral details
    referral_number = Column(String(50), unique=True, index=True)
    referral_type = Column(String(50), nullable=False)  # interconsulta, traslado, etc.
    specialty_requested = Column(String(100), nullable=False, index=True)
    priority_level = Column(String(20), nullable=False, index=True)
    
    # Medical information
    primary_diagnosis = Column(Text)
    secondary_diagnosis = Column(Text)
    icd10_codes = Column(JSON)  # List of ICD-10 codes
    clinical_summary = Column(Text)
    reason_for_referral = Column(Text)
    
    # Referring institution
    referring_hospital = Column(String(255))
    referring_department = Column(String(100))
    referring_physician = Column(String(255))
    referring_physician_license = Column(String(50))
    
    # Dates and timeline
    referral_date = Column(DateTime, nullable=False)
    requested_date = Column(DateTime)
    expiration_date = Column(DateTime)
    
    # Status tracking
    status = Column(String(50), default="pending", index=True)  # pending, accepted, rejected, completed
    assigned_to = Column(String(255))  # Assigned physician/department
    notes = Column(Text)
    
    # System metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    email_message = relationship("EmailMessage")
    patient_record = relationship("PatientRecord")
    
    def __repr__(self):
        return f"<MedicalReferral(id={self.id}, number='{self.referral_number}', specialty='{self.specialty_requested}')>"

class SystemConfiguration(Base):
    """
    System configuration and settings
    """
    __tablename__ = "system_configuration"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Text)
    data_type = Column(String(20))  # string, integer, boolean, json
    description = Column(Text)
    is_sensitive = Column(Boolean, default=False)  # For passwords, tokens, etc.
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    updated_by = Column(String(100))
    
    def __repr__(self):
        return f"<SystemConfiguration(key='{self.key}', type='{self.data_type}')>"

class ProcessingQueue(Base):
    """
    Queue for managing email processing tasks
    """
    __tablename__ = "processing_queue"
    
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(36), unique=True, default=lambda: str(uuid.uuid4()))
    
    # Task details
    task_type = Column(String(50), nullable=False)  # process_email, extract_attachment, etc.
    priority = Column(Integer, default=5, index=True)  # 1=highest, 10=lowest
    status = Column(String(20), default="pending", index=True)  # pending, processing, completed, failed
    
    # Task data
    email_message_id = Column(Integer, ForeignKey("email_messages.id"))
    task_data = Column(JSON)  # Additional task-specific data
    
    # Scheduling
    scheduled_at = Column(DateTime, default=func.now())
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Error handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # System metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<ProcessingQueue(id={self.id}, task_type='{self.task_type}', status='{self.status}')>"

# Create all tables
class User(Base):
    """
    User model for authentication and authorization
    """
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('medical_evaluator', 'administrator', name='user_roles'), nullable=False)
    permissions = Column(JSON)
    is_active = Column(Boolean, default=True, index=True)
    last_login = Column(DateTime)
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime)

    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"

def create_tables(engine):
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def drop_tables(engine):
    """Drop all database tables"""
    Base.metadata.drop_all(bind=engine)
