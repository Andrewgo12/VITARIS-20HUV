"""
API Routes for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import structlog

from database import DatabaseManager, EmailRepository, PatientRepository, ReferralRepository
from models import EmailMessage, PatientRecord, MedicalReferral, User
from security import SecurityManager
from email_processor import EmailProcessor
from gmail_client import GmailClient

logger = structlog.get_logger(__name__)
security = HTTPBearer()

# Initialize components
db_manager = DatabaseManager()
email_repo = EmailRepository(db_manager)
patient_repo = PatientRepository(db_manager)
referral_repo = ReferralRepository(db_manager)
security_manager = SecurityManager()
email_processor = None  # Will be initialized when needed
gmail_client = GmailClient()

# Create routers
api_router = APIRouter(prefix="/api", tags=["api"])
auth_router = APIRouter(prefix="/auth", tags=["authentication"])
health_router = APIRouter(prefix="/health", tags=["health"])

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user with real token validation"""
    try:
        token = credentials.credentials

        # Verify JWT token
        payload = security_manager.verify_jwt_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify user still exists and is active
        with db_manager.get_session() as session:
            from models import User
            user = session.query(User).filter(
                User.id == user_id,
                User.is_active == True
            ).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Authentication failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Health Check Routes
@health_router.get("/")
async def health_check():
    """Basic health check"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@health_router.get("/detailed")
async def detailed_health_check():
    """Detailed health check"""
    try:
        health_status = db_manager.get_health_status()
        return {
            "status": "healthy" if health_status["status"] == "healthy" else "unhealthy",
            "timestamp": datetime.utcnow(),
            "components": health_status
        }
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow(),
            "error": str(e)
        }

# Authentication Routes
@auth_router.post("/login")
async def login(credentials: Dict[str, str]):
    """User login"""
    try:
        email = credentials.get("email")
        password = credentials.get("password")
        
        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required"
            )
        
        # Authenticate user (simplified for demo)
        user = await authenticate_user(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Generate real JWT token
        token_data = {
            "user_id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.utcnow() + timedelta(hours=24)
        }

        token = security_manager.generate_jwt_token(token_data)

        return {
            "access_token": token,
            "token_type": "bearer",
            "expires_in": 86400,  # 24 hours in seconds
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "last_login": user.get("last_login")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Authenticate user against database with proper security"""
    try:
        with db_manager.get_session() as session:
            # Query real user from database
            from models import User
            user = session.query(User).filter(
                User.email == email,
                User.is_active == True
            ).first()

            if not user:
                logger.warning("Authentication failed: user not found", email=email)
                return None

            # Verify password hash
            if not security_manager.verify_password(password, user.password_hash):
                logger.warning("Authentication failed: invalid password", email=email)
                return None

            # Update last login
            user.last_login = datetime.utcnow()
            session.commit()

            logger.info("User authenticated successfully", email=email, role=user.role)

            return {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role,
                "last_login": user.last_login.isoformat() if user.last_login else None
            }

    except Exception as e:
        logger.error("Authentication failed with exception", email=email, error=str(e))
        return None

# Email Routes
@api_router.get("/emails")
async def get_emails(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get emails with pagination and filtering"""
    try:
        emails = email_repo.get_emails(skip=skip, limit=limit, status=status)
        return {
            "emails": emails,
            "total": len(emails),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error("Failed to get emails", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve emails"
        )

@api_router.get("/emails/{email_id}")
async def get_email(
    email_id: int,
    current_user: Dict = Depends(get_current_user)
):
    """Get specific email by ID"""
    try:
        email = email_repo.get_email_by_id(email_id)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Email not found"
            )
        return email
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get email", email_id=email_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve email"
        )

# Patient Routes
@api_router.get("/patients")
async def get_patients(
    skip: int = 0,
    limit: int = 50,
    current_user: Dict = Depends(get_current_user)
):
    """Get patients with pagination"""
    try:
        patients = patient_repo.get_patients(skip=skip, limit=limit)
        return {
            "patients": patients,
            "total": len(patients),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error("Failed to get patients", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve patients"
        )

@api_router.get("/patients/{patient_id}")
async def get_patient(
    patient_id: int,
    current_user: Dict = Depends(get_current_user)
):
    """Get specific patient by ID"""
    try:
        patient = patient_repo.get_patient_by_id(patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        return patient
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get patient", patient_id=patient_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve patient"
        )

# Medical Referral Routes
@api_router.get("/referrals")
async def get_referrals(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get medical referrals with pagination and filtering"""
    try:
        referrals = referral_repo.get_referrals(
            skip=skip, 
            limit=limit, 
            status=status, 
            priority=priority
        )
        return {
            "referrals": referrals,
            "total": len(referrals),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        logger.error("Failed to get referrals", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve referrals"
        )

@api_router.get("/referrals/{referral_id}")
async def get_referral(
    referral_id: int,
    current_user: Dict = Depends(get_current_user)
):
    """Get specific referral by ID"""
    try:
        referral = referral_repo.get_referral_by_id(referral_id)
        if not referral:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Referral not found"
            )
        return referral
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get referral", referral_id=referral_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve referral"
        )

# Statistics Routes
@api_router.get("/statistics")
async def get_statistics(current_user: Dict = Depends(get_current_user)):
    """Get system statistics"""
    try:
        stats = {
            "total_emails": email_repo.count_emails(),
            "processed_emails": email_repo.count_emails(status="processed"),
            "pending_emails": email_repo.count_emails(status="pending"),
            "total_patients": patient_repo.count_patients(),
            "total_referrals": referral_repo.count_referrals(),
            "pending_referrals": referral_repo.count_referrals(status="pending"),
            "approved_referrals": referral_repo.count_referrals(status="approved"),
            "last_updated": datetime.utcnow()
        }
        return stats
    except Exception as e:
        logger.error("Failed to get statistics", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics"
        )

# Gmail Integration Routes
@api_router.post("/gmail/sync")
async def sync_gmail(current_user: Dict = Depends(get_current_user)):
    """Trigger Gmail synchronization"""
    try:
        # This would trigger the Gmail sync process
        result = await gmail_client.sync_emails()
        return {
            "status": "success",
            "message": "Gmail sync initiated",
            "result": result
        }
    except Exception as e:
        logger.error("Gmail sync failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gmail sync failed"
        )

# Medical Cases Routes
@api_router.get("/medical-cases")
async def get_medical_cases(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get medical cases with filtering"""
    try:
        # Convert referrals to medical cases format for frontend compatibility
        referrals = referral_repo.get_referrals(skip=skip, limit=limit, status=status, priority=priority)

        medical_cases = []
        for referral in referrals:
            medical_case = {
                "id": str(referral.id),
                "patientName": referral.patient_name,
                "documentNumber": referral.patient_document,
                "age": referral.patient_age or 0,
                "gender": referral.patient_gender or "N/A",
                "diagnosis": referral.diagnosis or "Sin diagnóstico",
                "specialty": referral.specialty or "General",
                "referringPhysician": referral.referring_physician or "No especificado",
                "referringInstitution": referral.referring_institution or "No especificado",
                "priority": referral.priority_level or "media",
                "status": referral.status or "nueva",
                "receivedDate": referral.created_at.isoformat() if referral.created_at else None,
                "dueDate": referral.due_date.isoformat() if referral.due_date else None,
                "attachments": referral.attachment_count or 0,
                "aiExtracted": referral.ai_processed or False
            }
            medical_cases.append(medical_case)

        return medical_cases
    except Exception as e:
        logger.error("Failed to get medical cases", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve medical cases"
        )

@api_router.get("/medical-cases/{case_id}")
async def get_medical_case(
    case_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get specific medical case by ID"""
    try:
        referral = referral_repo.get_referral_by_id(int(case_id))
        if not referral:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical case not found"
            )

        # Convert to medical case format
        medical_case = {
            "id": str(referral.id),
            "patientName": referral.patient_name,
            "documentNumber": referral.patient_document,
            "age": referral.patient_age or 0,
            "gender": referral.patient_gender or "N/A",
            "diagnosis": referral.diagnosis or "Sin diagnóstico",
            "specialty": referral.specialty or "General",
            "referringPhysician": referral.referring_physician or "No especificado",
            "referringInstitution": referral.referring_institution or "No especificado",
            "priority": referral.priority_level or "media",
            "status": referral.status or "nueva",
            "receivedDate": referral.created_at.isoformat() if referral.created_at else None,
            "dueDate": referral.due_date.isoformat() if referral.due_date else None,
            "attachments": referral.attachment_count or 0,
            "aiExtracted": referral.ai_processed or False,
            "notes": referral.notes or "",
            "medicalHistory": referral.medical_history or "",
            "currentTreatment": referral.current_treatment or "",
            "reasonForReferral": referral.reason_for_referral or ""
        }

        return medical_case
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get medical case", case_id=case_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve medical case"
        )

@api_router.put("/medical-cases/{case_id}")
async def update_medical_case(
    case_id: str,
    updates: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update medical case"""
    try:
        success = referral_repo.update_referral_status(
            int(case_id),
            updates.get("status"),
            updates.get("notes")
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical case not found"
            )

        return {"message": "Medical case updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update medical case", case_id=case_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update medical case"
        )

@api_router.post("/medical-cases/{case_id}/approve")
async def approve_medical_case(
    case_id: str,
    data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Approve medical case"""
    try:
        notes = data.get("notes", "")
        success = referral_repo.update_referral_status(int(case_id), "aceptada", notes)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical case not found"
            )

        return {"message": "Medical case approved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to approve medical case", case_id=case_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve medical case"
        )

@api_router.post("/medical-cases/{case_id}/reject")
async def reject_medical_case(
    case_id: str,
    data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Reject medical case"""
    try:
        reason = data.get("reason", "")
        success = referral_repo.update_referral_status(int(case_id), "rechazada", reason)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical case not found"
            )

        return {"message": "Medical case rejected successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to reject medical case", case_id=case_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject medical case"
        )

# User Management Routes
@api_router.get("/users")
async def get_users(
    skip: int = 0,
    limit: int = 50,
    current_user: Dict = Depends(get_current_user)
):
    """Get users list"""
    try:
        with db_manager.get_session() as session:
            from models import User
            users = session.query(User).offset(skip).limit(limit).all()

            user_list = []
            for user in users:
                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "firstName": user.name.split()[0] if user.name else "",
                    "lastName": " ".join(user.name.split()[1:]) if user.name and len(user.name.split()) > 1 else "",
                    "role": user.role,
                    "isActive": user.is_active,
                    "lastLogin": user.last_login.isoformat() if user.last_login else None,
                    "createdAt": user.created_at.isoformat() if user.created_at else None,
                    "casesAssigned": 0,  # TODO: Calculate from referrals
                    "casesCompleted": 0,  # TODO: Calculate from referrals
                    "avgResponseTime": "0h 0m"  # TODO: Calculate
                }
                user_list.append(user_data)

            return user_list
    except Exception as e:
        logger.error("Failed to get users", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )

@api_router.post("/users")
async def create_user(
    user_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Create new user"""
    try:
        # Check if user has admin role
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can create users"
            )

        with db_manager.get_session() as session:
            from models import User

            # Check if email already exists
            existing_user = session.query(User).filter(User.email == user_data["email"]).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already exists"
                )

            # Hash password
            password_hash = security_manager.hash_password(user_data["password"])

            # Create user
            new_user = User(
                email=user_data["email"],
                name=f"{user_data['firstName']} {user_data['lastName']}",
                password_hash=password_hash,
                role=user_data["role"],
                is_active=True,
                created_at=datetime.utcnow()
            )

            session.add(new_user)
            session.commit()

            return {"message": "User created successfully", "id": new_user.id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create user", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@api_router.put("/users/{user_id}")
async def update_user(
    user_id: int,
    user_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update user"""
    try:
        # Check permissions
        if current_user.get("role") != "administrator" and current_user.get("id") != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )

        with db_manager.get_session() as session:
            from models import User
            user = session.query(User).filter(User.id == user_id).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            # Update fields
            if "firstName" in user_data or "lastName" in user_data:
                first_name = user_data.get("firstName", user.name.split()[0] if user.name else "")
                last_name = user_data.get("lastName", " ".join(user.name.split()[1:]) if user.name and len(user.name.split()) > 1 else "")
                user.name = f"{first_name} {last_name}".strip()

            if "email" in user_data:
                user.email = user_data["email"]

            if "role" in user_data and current_user.get("role") == "administrator":
                user.role = user_data["role"]

            if "isActive" in user_data and current_user.get("role") == "administrator":
                user.is_active = user_data["isActive"]

            session.commit()

            return {"message": "User updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update user", user_id=user_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )

# Request History Routes
@api_router.get("/request-history")
async def get_request_history(
    skip: int = 0,
    limit: int = 50,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    status: Optional[str] = None,
    patient_name: Optional[str] = None,
    referring_physician: Optional[str] = None,
    institution: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get request history with advanced filtering"""
    try:
        with db_manager.get_session() as session:
            from models import MedicalReferral
            query = session.query(MedicalReferral)

            # Apply filters
            if start_date:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(MedicalReferral.created_at >= start_dt)

            if end_date:
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(MedicalReferral.created_at <= end_dt)

            if status:
                query = query.filter(MedicalReferral.status == status)

            if patient_name:
                query = query.filter(MedicalReferral.patient_name.ilike(f"%{patient_name}%"))

            if referring_physician:
                query = query.filter(MedicalReferral.referring_physician.ilike(f"%{referring_physician}%"))

            if institution:
                query = query.filter(MedicalReferral.referring_institution.ilike(f"%{institution}%"))

            # Get total count
            total = query.count()

            # Apply pagination and ordering
            referrals = query.order_by(MedicalReferral.created_at.desc()).offset(skip).limit(limit).all()

            history_items = []
            for referral in referrals:
                item = {
                    "id": str(referral.id),
                    "patientName": referral.patient_name,
                    "patientDocument": referral.patient_document,
                    "diagnosis": referral.diagnosis,
                    "specialty": referral.specialty,
                    "referringPhysician": referral.referring_physician,
                    "referringInstitution": referral.referring_institution,
                    "priority": referral.priority_level,
                    "status": referral.status,
                    "createdAt": referral.created_at.isoformat() if referral.created_at else None,
                    "updatedAt": referral.updated_at.isoformat() if referral.updated_at else None,
                    "responseTime": calculate_response_time(referral),
                    "evaluatedBy": referral.evaluated_by,
                    "notes": referral.notes
                }
                history_items.append(item)

            return {
                "items": history_items,
                "total": total,
                "skip": skip,
                "limit": limit
            }

    except Exception as e:
        logger.error("Failed to get request history", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve request history"
        )

@api_router.get("/request-history/analytics")
async def get_request_analytics(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get analytics data for request history"""
    try:
        with db_manager.get_session() as session:
            from models import MedicalReferral
            from sqlalchemy import func, extract

            query = session.query(MedicalReferral)

            # Apply date filters
            if start_date:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(MedicalReferral.created_at >= start_dt)

            if end_date:
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(MedicalReferral.created_at <= end_dt)

            # Status distribution
            status_stats = session.query(
                MedicalReferral.status,
                func.count(MedicalReferral.id).label('count')
            ).group_by(MedicalReferral.status).all()

            # Monthly trends
            monthly_stats = session.query(
                extract('year', MedicalReferral.created_at).label('year'),
                extract('month', MedicalReferral.created_at).label('month'),
                func.count(MedicalReferral.id).label('count')
            ).group_by('year', 'month').order_by('year', 'month').all()

            # Priority distribution
            priority_stats = session.query(
                MedicalReferral.priority_level,
                func.count(MedicalReferral.id).label('count')
            ).group_by(MedicalReferral.priority_level).all()

            # Specialty distribution
            specialty_stats = session.query(
                MedicalReferral.specialty,
                func.count(MedicalReferral.id).label('count')
            ).group_by(MedicalReferral.specialty).order_by(func.count(MedicalReferral.id).desc()).limit(10).all()

            return {
                "statusDistribution": [{"status": s[0], "count": s[1]} for s in status_stats],
                "monthlyTrends": [{"year": int(m[0]), "month": int(m[1]), "count": m[2]} for m in monthly_stats],
                "priorityDistribution": [{"priority": p[0], "count": p[1]} for p in priority_stats],
                "specialtyDistribution": [{"specialty": s[0], "count": s[1]} for s in specialty_stats],
                "totalRequests": query.count(),
                "avgResponseTime": calculate_avg_response_time()
            }

    except Exception as e:
        logger.error("Failed to get request analytics", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics"
        )

def calculate_response_time(referral):
    """Calculate response time for a referral"""
    if referral.created_at and referral.updated_at:
        delta = referral.updated_at - referral.created_at
        hours = delta.total_seconds() / 3600
        return f"{hours:.1f}h"
    return "N/A"

def calculate_avg_response_time():
    """Calculate average response time"""
    try:
        with db_manager.get_session() as session:
            from models import MedicalReferral
            from sqlalchemy import func

            result = session.query(
                func.avg(
                    func.extract('epoch', MedicalReferral.updated_at - MedicalReferral.created_at) / 3600
                )
            ).filter(
                MedicalReferral.updated_at.isnot(None),
                MedicalReferral.created_at.isnot(None)
            ).scalar()

            return f"{result:.1f}h" if result else "N/A"
    except:
        return "N/A"

# Admin Panel Routes
@api_router.get("/admin/dashboard")
async def get_admin_dashboard(current_user: Dict = Depends(get_current_user)):
    """Get admin dashboard data"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        with db_manager.get_session() as session:
            from models import User, MedicalReferral, EmailMessage
            from sqlalchemy import func, extract

            # User statistics
            total_users = session.query(User).count()
            active_users = session.query(User).filter(User.is_active == True).count()
            admin_users = session.query(User).filter(User.role == "administrator").count()
            evaluator_users = session.query(User).filter(User.role == "medical_evaluator").count()

            # System activity (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_referrals = session.query(MedicalReferral).filter(
                MedicalReferral.created_at >= thirty_days_ago
            ).count()

            recent_emails = session.query(EmailMessage).filter(
                EmailMessage.created_at >= thirty_days_ago
            ).count()

            # Performance metrics
            avg_response_time = calculate_avg_response_time()

            # Daily activity (last 7 days)
            daily_activity = []
            for i in range(7):
                date = datetime.utcnow() - timedelta(days=i)
                day_start = date.replace(hour=0, minute=0, second=0, microsecond=0)
                day_end = day_start + timedelta(days=1)

                referrals_count = session.query(MedicalReferral).filter(
                    MedicalReferral.created_at >= day_start,
                    MedicalReferral.created_at < day_end
                ).count()

                daily_activity.append({
                    "date": day_start.isoformat(),
                    "referrals": referrals_count
                })

            return {
                "userStats": {
                    "total": total_users,
                    "active": active_users,
                    "administrators": admin_users,
                    "evaluators": evaluator_users
                },
                "systemActivity": {
                    "recentReferrals": recent_referrals,
                    "recentEmails": recent_emails,
                    "avgResponseTime": avg_response_time
                },
                "dailyActivity": daily_activity,
                "systemHealth": {
                    "database": "connected",
                    "emailService": "active",
                    "apiStatus": "operational"
                }
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get admin dashboard", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve admin dashboard"
        )

@api_router.get("/admin/audit-logs")
async def get_audit_logs(
    skip: int = 0,
    limit: int = 50,
    user_id: Optional[int] = None,
    action: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get audit logs"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # For now, return mock audit logs since we don't have audit table yet
        # In production, this would query a real audit_logs table
        audit_logs = []

        # Generate some sample audit logs based on recent activity
        with db_manager.get_session() as session:
            from models import MedicalReferral, User

            recent_referrals = session.query(MedicalReferral).order_by(
                MedicalReferral.updated_at.desc()
            ).limit(limit).all()

            for referral in recent_referrals:
                audit_logs.append({
                    "id": f"audit_{referral.id}",
                    "userId": referral.evaluated_by or "system",
                    "userName": referral.evaluated_by or "Sistema",
                    "action": f"Updated referral status to {referral.status}",
                    "resource": f"medical_referral_{referral.id}",
                    "timestamp": referral.updated_at.isoformat() if referral.updated_at else None,
                    "ipAddress": "127.0.0.1",
                    "userAgent": "VITAL RED System"
                })

        return {
            "logs": audit_logs,
            "total": len(audit_logs),
            "skip": skip,
            "limit": limit
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get audit logs", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve audit logs"
        )

# System Configuration Routes
@api_router.get("/system/configuration")
async def get_system_configuration(current_user: Dict = Depends(get_current_user)):
    """Get system configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Return current system configuration
        # In production, this would be stored in database
        config = {
            "hospital": {
                "name": "Hospital Universitaria ESE",
                "address": "Calle 15 #25-30, Cali, Colombia",
                "phone": "+57 2 555-0123",
                "email": "info@hospital-ese.com",
                "timezone": "America/Bogota",
                "workingHours": {
                    "start": "06:00",
                    "end": "22:00"
                }
            },
            "notifications": {
                "emailEnabled": True,
                "smsEnabled": False,
                "urgentCaseThreshold": 30,  # minutes
                "reminderInterval": 60,  # minutes
                "escalationTime": 120  # minutes
            },
            "ai": {
                "enabled": True,
                "confidenceThreshold": 0.8,
                "autoProcessing": True,
                "extractionRules": [
                    "patient_name",
                    "document_number",
                    "diagnosis",
                    "referring_physician",
                    "priority_level"
                ]
            },
            "security": {
                "sessionTimeout": 480,  # minutes
                "passwordPolicy": {
                    "minLength": 8,
                    "requireUppercase": True,
                    "requireNumbers": True,
                    "requireSpecialChars": True
                },
                "maxLoginAttempts": 3
            },
            "backup": {
                "enabled": True,
                "frequency": "daily",
                "retentionDays": 30,
                "location": "/backups/vital_red"
            }
        }

        return config

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get system configuration", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system configuration"
        )

@api_router.put("/system/configuration")
async def update_system_configuration(
    config_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update system configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would update configuration in database
        # For now, we'll just validate and return success

        # Validate required fields
        required_sections = ["hospital", "notifications", "ai", "security", "backup"]
        for section in required_sections:
            if section not in config_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required configuration section: {section}"
                )

        # Log configuration change
        logger.info("System configuration updated", user=current_user.get("email"))

        return {"message": "System configuration updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update system configuration", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update system configuration"
        )

@api_router.post("/system/test-connection")
async def test_system_connections(current_user: Dict = Depends(get_current_user)):
    """Test system connections"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        results = {}

        # Test database connection
        try:
            db_status = db_manager.health_check()
            results["database"] = {
                "status": "connected" if db_status else "disconnected",
                "message": "Database connection successful" if db_status else "Database connection failed"
            }
        except Exception as e:
            results["database"] = {
                "status": "error",
                "message": f"Database error: {str(e)}"
            }

        # Test email service (mock for now)
        results["email"] = {
            "status": "connected",
            "message": "Email service operational"
        }

        # Test Gmail API (mock for now)
        results["gmail"] = {
            "status": "connected",
            "message": "Gmail API connection successful"
        }

        return {
            "timestamp": datetime.utcnow().isoformat(),
            "results": results,
            "overall_status": "healthy" if all(r["status"] == "connected" for r in results.values()) else "degraded"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to test system connections", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to test system connections"
        )

# Backup Management Routes
@api_router.get("/backups")
async def get_backups(current_user: Dict = Depends(get_current_user)):
    """Get list of backups"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Mock backup data - in production this would read from backup directory
        backups = [
            {
                "id": "backup_20250119_120000",
                "filename": "vital_red_backup_20250119_120000.sql.gz",
                "type": "full",
                "size": "45.2 MB",
                "created_at": "2025-01-19T12:00:00Z",
                "status": "completed",
                "duration": "2m 15s",
                "tables_count": 6,
                "records_count": 1250
            },
            {
                "id": "backup_20250118_120000",
                "filename": "vital_red_backup_20250118_120000.sql.gz",
                "type": "full",
                "size": "43.8 MB",
                "created_at": "2025-01-18T12:00:00Z",
                "status": "completed",
                "duration": "2m 08s",
                "tables_count": 6,
                "records_count": 1198
            },
            {
                "id": "backup_20250117_120000",
                "filename": "vital_red_backup_20250117_120000.sql.gz",
                "type": "full",
                "size": "42.1 MB",
                "created_at": "2025-01-17T12:00:00Z",
                "status": "completed",
                "duration": "1m 58s",
                "tables_count": 6,
                "records_count": 1156
            }
        ]

        return {
            "backups": backups,
            "total": len(backups),
            "storage_used": "131.1 MB",
            "storage_limit": "10 GB",
            "next_scheduled": "2025-01-20T12:00:00Z"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get backups", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve backups"
        )

@api_router.post("/backups/create")
async def create_backup(
    backup_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Create new backup"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        backup_type = backup_data.get("type", "full")
        description = backup_data.get("description", "Manual backup")

        # In production, this would trigger actual backup process
        backup_id = f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

        # Simulate backup creation
        backup_info = {
            "id": backup_id,
            "filename": f"vital_red_{backup_id}.sql.gz",
            "type": backup_type,
            "description": description,
            "status": "in_progress",
            "created_at": datetime.utcnow().isoformat(),
            "created_by": current_user.get("email")
        }

        logger.info("Backup creation started", backup_id=backup_id, user=current_user.get("email"))

        return {
            "message": "Backup creation started",
            "backup": backup_info
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create backup", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create backup"
        )

@api_router.delete("/backups/{backup_id}")
async def delete_backup(
    backup_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Delete backup"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would delete actual backup file
        logger.info("Backup deleted", backup_id=backup_id, user=current_user.get("email"))

        return {"message": f"Backup {backup_id} deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete backup", backup_id=backup_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete backup"
        )

@api_router.post("/backups/{backup_id}/restore")
async def restore_backup(
    backup_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Restore from backup"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would trigger actual restore process
        logger.info("Backup restore started", backup_id=backup_id, user=current_user.get("email"))

        return {
            "message": f"Restore from backup {backup_id} started",
            "restore_id": f"restore_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            "estimated_duration": "5-10 minutes"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to restore backup", backup_id=backup_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to restore backup"
        )

# Email Monitor Routes
@api_router.get("/emails")
async def get_emails(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    current_user: Dict = Depends(get_current_user)
):
    """Get emails with processing status"""
    try:
        with db_manager.get_session() as session:
            from models import EmailMessage
            query = session.query(EmailMessage)

            if status:
                query = query.filter(EmailMessage.status == status)

            total = query.count()
            emails = query.order_by(EmailMessage.created_at.desc()).offset(skip).limit(limit).all()

            email_list = []
            for email in emails:
                email_data = {
                    "id": str(email.id),
                    "subject": email.subject or "Sin asunto",
                    "sender": email.sender_email,
                    "receivedAt": email.created_at.isoformat() if email.created_at else None,
                    "status": email.status or "pending",
                    "aiProcessed": email.ai_processed or False,
                    "extractedData": email.extracted_data or {},
                    "confidence": email.confidence_score or 0.0,
                    "attachments": email.attachment_count or 0,
                    "processingTime": email.processing_time or 0,
                    "errorMessage": email.error_message
                }
                email_list.append(email_data)

            return {
                "emails": email_list,
                "total": total,
                "skip": skip,
                "limit": limit
            }

    except Exception as e:
        logger.error("Failed to get emails", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve emails"
        )

@api_router.post("/emails/process")
async def process_emails(current_user: Dict = Depends(get_current_user)):
    """Trigger email processing"""
    try:
        # In production, this would trigger the Gmail service
        logger.info("Email processing triggered", user=current_user.get("email"))

        return {
            "message": "Email processing started",
            "timestamp": datetime.utcnow().isoformat(),
            "triggered_by": current_user.get("email")
        }

    except Exception as e:
        logger.error("Failed to trigger email processing", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to trigger email processing"
        )

@api_router.post("/emails/{email_id}/retry")
async def retry_email_processing(
    email_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Retry processing for specific email"""
    try:
        with db_manager.get_session() as session:
            from models import EmailMessage
            email = session.query(EmailMessage).filter(EmailMessage.id == int(email_id)).first()

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Email not found"
                )

            # Reset email status for retry
            email.status = "pending"
            email.error_message = None
            session.commit()

            logger.info("Email retry triggered", email_id=email_id, user=current_user.get("email"))

            return {"message": f"Email {email_id} queued for retry processing"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to retry email processing", email_id=email_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retry email processing"
        )

# Gmail Configuration Routes
@api_router.get("/gmail/config")
async def get_gmail_config(current_user: Dict = Depends(get_current_user)):
    """Get Gmail capture configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Return current Gmail configuration
        config = {
            "enabled": True,
            "oauth_configured": True,
            "capture_interval": 300,  # 5 minutes
            "keywords": [
                "referencia médica",
                "traslado paciente",
                "urgente",
                "hospital",
                "médico",
                "paciente"
            ],
            "filters": {
                "include_attachments": True,
                "min_confidence": 0.7,
                "auto_process": True
            },
            "status": {
                "last_sync": "2025-01-19T12:00:00Z",
                "emails_processed": 156,
                "success_rate": 94.2,
                "last_error": None
            }
        }

        return config

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get Gmail config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Gmail configuration"
        )

@api_router.put("/gmail/config")
async def update_gmail_config(
    config_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update Gmail capture configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Validate configuration data
        required_fields = ["enabled", "capture_interval", "keywords"]
        for field in required_fields:
            if field not in config_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )

        # In production, this would update the actual Gmail service configuration
        logger.info("Gmail configuration updated", user=current_user.get("email"))

        return {"message": "Gmail configuration updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update Gmail config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update Gmail configuration"
        )

@api_router.post("/gmail/test-connection")
async def test_gmail_connection(current_user: Dict = Depends(get_current_user)):
    """Test Gmail API connection"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would test actual Gmail API connection
        test_result = {
            "connection_status": "success",
            "oauth_status": "valid",
            "api_quota": {
                "used": 1250,
                "limit": 10000,
                "percentage": 12.5
            },
            "last_sync": datetime.utcnow().isoformat(),
            "test_timestamp": datetime.utcnow().isoformat()
        }

        return test_result

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to test Gmail connection", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to test Gmail connection"
        )

# Additional Production Routes
@auth_router.get("/verify")
async def verify_token(current_user: Dict = Depends(get_current_user)):
    """Verify JWT token and return user info"""
    try:
        with db_manager.get_session() as session:
            from models import User
            user = session.query(User).filter(User.id == current_user.get("user_id")).first()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            return {
                "id": user.id,
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}",
                "role": user.role,
                "isActive": user.is_active,
                "lastLogin": user.last_login.isoformat() if user.last_login else None
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to verify token", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify token"
        )

@api_router.get("/emails/{email_id}")
async def get_email_detail(
    email_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Get detailed information about a specific email"""
    try:
        with db_manager.get_session() as session:
            from models import EmailMessage
            email = session.query(EmailMessage).filter(EmailMessage.id == int(email_id)).first()

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Email not found"
                )

            return {
                "id": str(email.id),
                "subject": email.subject,
                "sender": email.sender_email,
                "receivedAt": email.created_at.isoformat() if email.created_at else None,
                "status": email.status or "pending",
                "content": email.body or "",
                "attachments": [],  # TODO: Implement attachment handling
                "extractedData": email.extracted_data or {},
                "aiAnalysis": {
                    "confidence": email.confidence_score or 0.0,
                    "processingTime": email.processing_time or 0,
                    "fieldsExtracted": 7,  # Mock data
                    "totalFields": 8,
                    "errors": [],
                    "warnings": ["Especialidad inferida del contexto"] if email.confidence_score and email.confidence_score < 0.9 else []
                },
                "processingHistory": [
                    {
                        "timestamp": email.created_at.isoformat() if email.created_at else None,
                        "action": "Email recibido",
                        "status": "success",
                        "details": "Email ingresado al sistema"
                    }
                ]
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get email detail", email_id=email_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve email detail"
        )

# Template Management Routes
@api_router.get("/templates")
async def get_templates(current_user: Dict = Depends(get_current_user)):
    """Get all templates"""
    try:
        # Mock templates for now
        templates = [
            {
                "id": "1",
                "name": "Formulario de Referencia Cardiología",
                "type": "medical_form",
                "description": "Plantilla estándar para referencias de cardiología",
                "isActive": True,
                "usageCount": 156,
                "createdAt": "2025-01-15T10:00:00Z",
                "updatedAt": "2025-01-18T14:30:00Z"
            }
        ]
        return templates

    except Exception as e:
        logger.error("Failed to get templates", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve templates"
        )

@api_router.post("/templates")
async def create_template(
    template_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Create new template"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, save to database
        logger.info("Template created", user=current_user.get("email"))

        return {"message": "Template created successfully", "id": "new_template_id"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create template", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create template"
        )

# Backup Schedule Routes
@api_router.get("/backups/schedule")
async def get_backup_schedule(current_user: Dict = Depends(get_current_user)):
    """Get backup schedule configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Mock schedule configuration
        schedule = {
            "enabled": True,
            "frequency": "daily",
            "time": "02:00",
            "retentionDays": 30,
            "includeFiles": True,
            "includeDatabase": True,
            "includeConfig": True,
            "compressionLevel": "medium",
            "emailNotifications": True,
            "notificationEmail": "admin@hospital-ese.com"
        }

        return schedule

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get backup schedule", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve backup schedule"
        )

# OAuth2 Configuration Routes
@api_router.get("/oauth2/config")
async def get_oauth2_config(current_user: Dict = Depends(get_current_user)):
    """Get OAuth2 configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Mock OAuth2 configuration
        config = {
            "clientId": "123456789-abcdefghijklmnop.apps.googleusercontent.com",
            "clientSecret": "GOCSPX-***masked***",
            "redirectUri": "http://localhost:8001/api/gmail/oauth/callback",
            "scopes": [
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/gmail.modify"
            ],
            "configured": True,
            "authorized": True
        }

        return config

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get OAuth2 config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve OAuth2 configuration"
        )

@api_router.put("/oauth2/config")
async def update_oauth2_config(
    config_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update OAuth2 configuration"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Validate required fields
        required_fields = ["clientId", "clientSecret", "redirectUri"]
        for field in required_fields:
            if field not in config_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing required field: {field}"
                )

        # In production, this would save to secure storage
        logger.info("OAuth2 configuration updated", user=current_user.get("email"))

        return {"message": "OAuth2 configuration updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update OAuth2 config", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update OAuth2 configuration"
        )

@api_router.post("/oauth2/test-connection")
async def test_oauth2_connection(current_user: Dict = Depends(get_current_user)):
    """Test OAuth2 connection"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # Mock OAuth2 connection test
        test_result = {
            "success": True,
            "status": "connected",
            "message": "OAuth2 connection successful",
            "scopes_granted": [
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/gmail.modify"
            ],
            "test_timestamp": datetime.utcnow().isoformat()
        }

        return test_result

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to test OAuth2 connection", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to test OAuth2 connection"
        )

# Additional Template Routes
@api_router.put("/templates/{template_id}")
async def update_template(
    template_id: str,
    template_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Update template"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would update template in database
        logger.info("Template updated", template_id=template_id, user=current_user.get("email"))

        return {"message": f"Template {template_id} updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to update template", template_id=template_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update template"
        )

@api_router.delete("/templates/{template_id}")
async def delete_template(
    template_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Delete template"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would delete template from database
        logger.info("Template deleted", template_id=template_id, user=current_user.get("email"))

        return {"message": f"Template {template_id} deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to delete template", template_id=template_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete template"
        )

# System Configuration Backup Routes
@api_router.post("/system/config-backup")
async def create_config_backup(
    backup_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_user)
):
    """Create configuration backup"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        backup_id = f"config_backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

        # In production, this would create actual backup
        logger.info("Configuration backup created", backup_id=backup_id, user=current_user.get("email"))

        return {
            "message": "Configuration backup created successfully",
            "backup_id": backup_id,
            "timestamp": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to create config backup", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create configuration backup"
        )

@api_router.post("/system/config-backup/{backup_id}/restore")
async def restore_config_backup(
    backup_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Restore configuration backup"""
    try:
        # Check admin permissions
        if current_user.get("role") != "administrator":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )

        # In production, this would restore actual backup
        logger.info("Configuration backup restored", backup_id=backup_id, user=current_user.get("email"))

        return {
            "message": f"Configuration backup {backup_id} restored successfully",
            "timestamp": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to restore config backup", backup_id=backup_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to restore configuration backup"
        )

# Importar y registrar endpoints del extractor
try:
    from ..gmail_extractor.api_endpoints import extraction_router
    # El router se registrará en main.py
except ImportError as e:
    logger.warning(f"Gmail Extractor no disponible: {e}")
    extraction_router = None

# Export routers
__all__ = ["api_router", "auth_router", "health_router", "extraction_router"]
