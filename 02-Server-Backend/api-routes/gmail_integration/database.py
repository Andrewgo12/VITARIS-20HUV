"""
Database Management for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import os
from typing import Optional, Dict, Any, List
from contextlib import contextmanager
import structlog

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from sqlalchemy.exc import SQLAlchemyError
import redis

from models import Base, EmailMessage, EmailAttachment, ProcessingLog, PatientRecord, MedicalReferral
from config import DATABASE_CONFIG, REDIS_CONFIG

logger = structlog.get_logger(__name__)

class DatabaseManager:
    """
    Database connection and session management
    """
    
    def __init__(self):
        self.logger = logger.bind(component="database_manager")
        self.engine = None
        self.SessionLocal = None
        self.redis_client = None
        
        # Initialize database connection
        self._initialize_database()
        self._initialize_redis()
    
    def _initialize_database(self):
        """Initialize MySQL database connection for XAMPP"""
        try:
            # Create database engine for MySQL
            self.engine = create_engine(
                DATABASE_CONFIG["URL"],
                pool_pre_ping=True,
                pool_recycle=3600,  # Recycle connections every hour
                echo=False,  # Set to True for SQL debugging
                connect_args={"charset": "utf8mb4"}  # MySQL specific charset
            )
            
            # Create session factory
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.engine
            )
            
            # Test connection
            with self.engine.connect() as conn:
                from sqlalchemy import text
                conn.execute(text("SELECT 1"))
            
            self.logger.info("Database connection established successfully")
            
            # Create tables if they don't exist
            self._create_tables()
            
        except Exception as e:
            self.logger.error("Database initialization failed", error=str(e))
            raise
    
    def _initialize_redis(self):
        """Initialize Redis connection for caching and queuing"""
        try:
            self.redis_client = redis.Redis(
                host=REDIS_CONFIG["HOST"],
                port=REDIS_CONFIG["PORT"],
                db=REDIS_CONFIG["DB"],
                password=REDIS_CONFIG["PASSWORD"],
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            
            # Test Redis connection
            self.redis_client.ping()
            self.logger.info("Redis connection established successfully")
            
        except Exception as e:
            self.logger.warning("Redis initialization failed", error=str(e))
            self.redis_client = None
    
    def _create_tables(self):
        """Create database tables if they don't exist"""
        try:
            Base.metadata.create_all(bind=self.engine)
            self.logger.info("Database tables created/verified successfully")
        except Exception as e:
            self.logger.error("Table creation failed", error=str(e))
            raise
    
    @contextmanager
    def get_session(self):
        """
        Context manager for database sessions
        
        Usage:
            with db_manager.get_session() as session:
                # Use session here
                pass
        """
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            self.logger.error("Database session error", error=str(e))
            raise
        finally:
            session.close()
    
    def get_session_direct(self) -> Session:
        """Get a database session directly (remember to close it)"""
        return self.SessionLocal()
    
    def health_check(self) -> Dict[str, Any]:
        """Check database and Redis health"""
        health_status = {
            'database': {'status': 'unknown', 'error': None},
            'redis': {'status': 'unknown', 'error': None}
        }
        
        # Check database
        try:
            with self.get_session() as session:
                from sqlalchemy import text
                session.execute(text("SELECT 1"))
            health_status['database']['status'] = 'healthy'
        except Exception as e:
            health_status['database']['status'] = 'unhealthy'
            health_status['database']['error'] = str(e)
        
        # Check Redis
        try:
            if self.redis_client:
                self.redis_client.ping()
                health_status['redis']['status'] = 'healthy'
            else:
                health_status['redis']['status'] = 'not_configured'
        except Exception as e:
            health_status['redis']['status'] = 'unhealthy'
            health_status['redis']['error'] = str(e)
        
        return health_status

    def get_health_status(self):
        """Get system health status"""
        return self.health_check()

class EmailRepository:
    """
    Repository pattern for email-related database operations
    """
    
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.logger = logger.bind(component="email_repository")
    
    def create_email(self, email_data: Dict[str, Any]) -> Optional[EmailMessage]:
        """Create a new email record"""
        try:
            with self.db_manager.get_session() as session:
                email = EmailMessage(**email_data)
                session.add(email)
                session.flush()
                session.refresh(email)
                return email
        except Exception as e:
            self.logger.error("Failed to create email record", error=str(e))
            return None
    
    def get_email_by_gmail_id(self, gmail_id: str) -> Optional[EmailMessage]:
        """Get email by Gmail ID"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(EmailMessage).filter_by(gmail_id=gmail_id).first()
        except Exception as e:
            self.logger.error("Failed to get email by Gmail ID", gmail_id=gmail_id, error=str(e))
            return None
    
    def get_pending_emails(self, limit: int = 10) -> List[EmailMessage]:
        """Get emails with pending processing status"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(EmailMessage).filter_by(
                    processing_status="pending"
                ).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get pending emails", error=str(e))
            return []
    
    def get_medical_referrals(self, status: Optional[str] = None, limit: int = 50) -> List[EmailMessage]:
        """Get medical referral emails"""
        try:
            with self.db_manager.get_session() as session:
                query = session.query(EmailMessage).filter_by(is_medical_referral=True)
                
                if status:
                    query = query.filter_by(processing_status=status)
                
                return query.order_by(EmailMessage.date_received.desc()).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get medical referrals", error=str(e))
            return []
    
    def update_email_status(self, email_id: int, status: str, error_message: str = None) -> bool:
        """Update email processing status"""
        try:
            with self.db_manager.get_session() as session:
                email = session.query(EmailMessage).filter_by(id=email_id).first()
                if email:
                    email.processing_status = status
                    if error_message:
                        email.processing_error = error_message
                    return True
                return False
        except Exception as e:
            self.logger.error("Failed to update email status", email_id=email_id, error=str(e))
            return False
    
    def get_emails_by_date_range(self, start_date, end_date) -> List[EmailMessage]:
        """Get emails within date range"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(EmailMessage).filter(
                    EmailMessage.date_received >= start_date,
                    EmailMessage.date_received <= end_date
                ).order_by(EmailMessage.date_received.desc()).all()
        except Exception as e:
            self.logger.error("Failed to get emails by date range", error=str(e))
            return []

    def count_emails(self, status: str = None) -> int:
        """Count emails with optional status filter"""
        try:
            with self.db_manager.get_session() as session:
                query = session.query(EmailMessage)
                if status:
                    query = query.filter(EmailMessage.status == status)
                return query.count()
        except Exception as e:
            self.logger.error("Failed to count emails", status=status, error=str(e))
            return 0

    def get_emails(self, skip: int = 0, limit: int = 50, status: str = None) -> List[EmailMessage]:
        """Get emails with pagination and optional status filter"""
        try:
            with self.db_manager.get_session() as session:
                query = session.query(EmailMessage)
                if status:
                    query = query.filter(EmailMessage.status == status)
                return query.order_by(EmailMessage.created_at.desc()).offset(skip).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get emails", skip=skip, limit=limit, status=status, error=str(e))
            return []

class AttachmentRepository:
    """
    Repository for attachment-related operations
    """
    
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.logger = logger.bind(component="attachment_repository")
    
    def create_attachment(self, attachment_data: Dict[str, Any]) -> Optional[EmailAttachment]:
        """Create a new attachment record"""
        try:
            with self.db_manager.get_session() as session:
                attachment = EmailAttachment(**attachment_data)
                session.add(attachment)
                session.flush()
                session.refresh(attachment)
                return attachment
        except Exception as e:
            self.logger.error("Failed to create attachment record", error=str(e))
            return None
    
    def get_attachments_by_email(self, email_id: int) -> List[EmailAttachment]:
        """Get all attachments for an email"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(EmailAttachment).filter_by(
                    email_message_id=email_id
                ).all()
        except Exception as e:
            self.logger.error("Failed to get attachments", email_id=email_id, error=str(e))
            return []
    
    def get_pending_attachments(self, limit: int = 10) -> List[EmailAttachment]:
        """Get attachments with pending processing"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(EmailAttachment).filter_by(
                    processing_status="pending"
                ).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get pending attachments", error=str(e))
            return []

class PatientRepository:
    """
    Repository for patient-related operations
    """
    
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.logger = logger.bind(component="patient_repository")
    
    def create_or_update_patient(self, patient_data: Dict[str, Any]) -> Optional[PatientRecord]:
        """Create new patient or update existing one"""
        try:
            with self.db_manager.get_session() as session:
                document_number = patient_data.get('document_number')
                
                if not document_number:
                    return None
                
                # Check if patient exists
                patient = session.query(PatientRecord).filter_by(
                    document_number=document_number
                ).first()
                
                if patient:
                    # Update existing patient
                    for key, value in patient_data.items():
                        if hasattr(patient, key) and value:
                            setattr(patient, key, value)
                else:
                    # Create new patient
                    patient = PatientRecord(**patient_data)
                    session.add(patient)
                
                session.flush()
                session.refresh(patient)
                return patient
                
        except Exception as e:
            self.logger.error("Failed to create/update patient", error=str(e))
            return None
    
    def get_patient_by_document(self, document_number: str) -> Optional[PatientRecord]:
        """Get patient by document number"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(PatientRecord).filter_by(
                    document_number=document_number
                ).first()
        except Exception as e:
            self.logger.error("Failed to get patient", document=document_number, error=str(e))
            return None
    
    def search_patients(self, search_term: str, limit: int = 20) -> List[PatientRecord]:
        """Search patients by name or document"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(PatientRecord).filter(
                    (PatientRecord.full_name.ilike(f"%{search_term}%")) |
                    (PatientRecord.document_number.ilike(f"%{search_term}%"))
                ).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to search patients", search_term=search_term, error=str(e))
            return []

    def count_patients(self) -> int:
        """Count total patients"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(PatientRecord).count()
        except Exception as e:
            self.logger.error("Failed to count patients", error=str(e))
            return 0

class ReferralRepository:
    """
    Repository for medical referral operations
    """
    
    def __init__(self, db_manager: DatabaseManager):
        self.db_manager = db_manager
        self.logger = logger.bind(component="referral_repository")
    
    def create_referral(self, referral_data: Dict[str, Any]) -> Optional[MedicalReferral]:
        """Create a new medical referral"""
        try:
            with self.db_manager.get_session() as session:
                referral = MedicalReferral(**referral_data)
                session.add(referral)
                session.flush()
                session.refresh(referral)
                return referral
        except Exception as e:
            self.logger.error("Failed to create referral", error=str(e))
            return None
    
    def get_referrals_by_status(self, status: str, limit: int = 50) -> List[MedicalReferral]:
        """Get referrals by status"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(MedicalReferral).filter_by(
                    status=status
                ).order_by(MedicalReferral.referral_date.desc()).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get referrals by status", status=status, error=str(e))
            return []
    
    def get_referrals_by_specialty(self, specialty: str, limit: int = 50) -> List[MedicalReferral]:
        """Get referrals by specialty"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(MedicalReferral).filter_by(
                    specialty_requested=specialty
                ).order_by(MedicalReferral.referral_date.desc()).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get referrals by specialty", specialty=specialty, error=str(e))
            return []
    
    def update_referral_status(self, referral_id: int, status: str, notes: str = None) -> bool:
        """Update referral status"""
        try:
            with self.db_manager.get_session() as session:
                referral = session.query(MedicalReferral).filter_by(id=referral_id).first()
                if referral:
                    referral.status = status
                    if notes:
                        referral.notes = notes
                    return True
                return False
        except Exception as e:
            self.logger.error("Failed to update referral status", referral_id=referral_id, error=str(e))
            return False

    def count_referrals(self, status: str = None) -> int:
        """Count referrals with optional status filter"""
        try:
            with self.db_manager.get_session() as session:
                query = session.query(MedicalReferral)
                if status:
                    query = query.filter(MedicalReferral.status == status)
                return query.count()
        except Exception as e:
            self.logger.error("Failed to count referrals", status=status, error=str(e))
            return 0

    def get_referrals(self, skip: int = 0, limit: int = 50, status: str = None, priority: str = None) -> List[MedicalReferral]:
        """Get referrals with pagination and filtering"""
        try:
            with self.db_manager.get_session() as session:
                query = session.query(MedicalReferral)

                if status:
                    query = query.filter(MedicalReferral.status == status)
                if priority:
                    query = query.filter(MedicalReferral.priority_level == priority)

                return query.order_by(MedicalReferral.created_at.desc()).offset(skip).limit(limit).all()
        except Exception as e:
            self.logger.error("Failed to get referrals", skip=skip, limit=limit, status=status, priority=priority, error=str(e))
            return []

    def get_referral_by_id(self, referral_id: int) -> Optional[MedicalReferral]:
        """Get referral by ID"""
        try:
            with self.db_manager.get_session() as session:
                return session.query(MedicalReferral).filter(MedicalReferral.id == referral_id).first()
        except Exception as e:
            self.logger.error("Failed to get referral by ID", referral_id=referral_id, error=str(e))
            return None

class CacheManager:
    """
    Redis-based caching manager
    """
    
    def __init__(self, redis_client):
        self.redis_client = redis_client
        self.logger = logger.bind(component="cache_manager")
    
    def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        try:
            if self.redis_client:
                return self.redis_client.get(key)
            return None
        except Exception as e:
            self.logger.error("Cache get failed", key=key, error=str(e))
            return None
    
    def set(self, key: str, value: str, expire: int = 3600) -> bool:
        """Set value in cache with expiration"""
        try:
            if self.redis_client:
                return self.redis_client.setex(key, expire, value)
            return False
        except Exception as e:
            self.logger.error("Cache set failed", key=key, error=str(e))
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if self.redis_client:
                return bool(self.redis_client.delete(key))
            return False
        except Exception as e:
            self.logger.error("Cache delete failed", key=key, error=str(e))
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            if self.redis_client:
                return bool(self.redis_client.exists(key))
            return False
        except Exception as e:
            self.logger.error("Cache exists check failed", key=key, error=str(e))
            return False

# Global database manager instance
db_manager = DatabaseManager()

# Repository instances
email_repo = EmailRepository(db_manager)
attachment_repo = AttachmentRepository(db_manager)
patient_repo = PatientRepository(db_manager)
referral_repo = ReferralRepository(db_manager)
cache_manager = CacheManager(db_manager.redis_client)
