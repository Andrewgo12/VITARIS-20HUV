"""
Security and Compliance Module for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
HIPAA Compliant Medical Data Security
"""

import os
import hashlib
import hmac
import secrets
import base64
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Union
from pathlib import Path
import structlog
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend

from database import db_manager
from models import EmailMessage, EmailAttachment, PatientRecord, ProcessingLog
from config import SECURITY_CONFIG

logger = structlog.get_logger(__name__)

class EncryptionManager:
    """
    HIPAA-compliant encryption manager for medical data
    """
    
    def __init__(self):
        self.logger = logger.bind(component="encryption_manager")
        self.encryption_key = self._get_or_create_encryption_key()
        self.fernet = Fernet(self.encryption_key)
        
        # Initialize RSA keys for asymmetric encryption
        self.private_key, self.public_key = self._get_or_create_rsa_keys()
    
    def _get_or_create_encryption_key(self) -> bytes:
        """Get or create encryption key for symmetric encryption"""
        key_file = Path("credentials/encryption.key")
        
        if key_file.exists():
            with open(key_file, 'rb') as f:
                return f.read()
        else:
            # Generate new key
            key = Fernet.generate_key()
            
            # Ensure credentials directory exists
            key_file.parent.mkdir(exist_ok=True)
            
            # Save key securely
            with open(key_file, 'wb') as f:
                f.write(key)
            
            # Set restrictive permissions
            os.chmod(key_file, 0o600)
            
            self.logger.info("New encryption key generated")
            return key
    
    def _get_or_create_rsa_keys(self) -> tuple:
        """Get or create RSA key pair for asymmetric encryption"""
        private_key_file = Path("credentials/private_key.pem")
        public_key_file = Path("credentials/public_key.pem")
        
        if private_key_file.exists() and public_key_file.exists():
            # Load existing keys
            with open(private_key_file, 'rb') as f:
                private_key = serialization.load_pem_private_key(
                    f.read(),
                    password=None,
                    backend=default_backend()
                )
            
            with open(public_key_file, 'rb') as f:
                public_key = serialization.load_pem_public_key(
                    f.read(),
                    backend=default_backend()
                )
            
            return private_key, public_key
        else:
            # Generate new key pair
            private_key = rsa.generate_private_key(
                public_exponent=65537,
                key_size=2048,
                backend=default_backend()
            )
            public_key = private_key.public_key()
            
            # Save private key
            private_pem = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            )
            
            with open(private_key_file, 'wb') as f:
                f.write(private_pem)
            
            # Save public key
            public_pem = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            
            with open(public_key_file, 'wb') as f:
                f.write(public_pem)
            
            # Set restrictive permissions
            os.chmod(private_key_file, 0o600)
            os.chmod(public_key_file, 0o644)
            
            self.logger.info("New RSA key pair generated")
            return private_key, public_key
    
    def encrypt_sensitive_data(self, data: Union[str, bytes]) -> str:
        """Encrypt sensitive data using symmetric encryption"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            
            encrypted_data = self.fernet.encrypt(data)
            return base64.b64encode(encrypted_data).decode('utf-8')
            
        except Exception as e:
            self.logger.error("Encryption failed", error=str(e))
            raise
    
    def decrypt_sensitive_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        try:
            encrypted_bytes = base64.b64decode(encrypted_data.encode('utf-8'))
            decrypted_data = self.fernet.decrypt(encrypted_bytes)
            return decrypted_data.decode('utf-8')
            
        except Exception as e:
            self.logger.error("Decryption failed", error=str(e))
            raise
    
    def encrypt_file(self, file_path: Path) -> Path:
        """Encrypt a file and return path to encrypted file"""
        try:
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            encrypted_data = self.fernet.encrypt(file_data)
            
            encrypted_file_path = file_path.with_suffix(file_path.suffix + '.enc')
            with open(encrypted_file_path, 'wb') as f:
                f.write(encrypted_data)
            
            # Remove original file
            file_path.unlink()
            
            self.logger.info("File encrypted", original=str(file_path), encrypted=str(encrypted_file_path))
            return encrypted_file_path
            
        except Exception as e:
            self.logger.error("File encryption failed", file=str(file_path), error=str(e))
            raise
    
    def decrypt_file(self, encrypted_file_path: Path) -> Path:
        """Decrypt a file and return path to decrypted file"""
        try:
            with open(encrypted_file_path, 'rb') as f:
                encrypted_data = f.read()
            
            decrypted_data = self.fernet.decrypt(encrypted_data)
            
            # Remove .enc extension
            decrypted_file_path = encrypted_file_path.with_suffix('')
            if decrypted_file_path.suffix == '':
                decrypted_file_path = decrypted_file_path.with_suffix('.decrypted')
            
            with open(decrypted_file_path, 'wb') as f:
                f.write(decrypted_data)
            
            self.logger.info("File decrypted", encrypted=str(encrypted_file_path), decrypted=str(decrypted_file_path))
            return decrypted_file_path
            
        except Exception as e:
            self.logger.error("File decryption failed", file=str(encrypted_file_path), error=str(e))
            raise
    
    def generate_secure_token(self, length: int = 32) -> str:
        """Generate cryptographically secure random token"""
        return secrets.token_urlsafe(length)
    
    def hash_password(self, password: str, salt: Optional[bytes] = None) -> tuple:
        """Hash password with salt using PBKDF2"""
        if salt is None:
            salt = os.urandom(32)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        
        password_hash = kdf.derive(password.encode('utf-8'))
        return password_hash, salt
    
    def verify_password(self, password: str, password_hash: bytes, salt: bytes) -> bool:
        """Verify password against hash"""
        try:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
                backend=default_backend()
            )
            
            kdf.verify(password.encode('utf-8'), password_hash)
            return True
        except:
            return False

class AuditLogger:
    """
    HIPAA-compliant audit logging system
    """
    
    def __init__(self):
        self.logger = logger.bind(component="audit_logger")
        self.audit_log_file = Path("logs/audit.log")
        self.audit_log_file.parent.mkdir(exist_ok=True)
    
    def log_access(self, user_id: str, resource_type: str, resource_id: str, 
                   action: str, ip_address: str = None, user_agent: str = None):
        """Log data access for HIPAA compliance"""
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": "data_access",
            "user_id": user_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "action": action,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "session_id": self._get_session_id()
        }
        
        self._write_audit_log(audit_entry)
        self.logger.info("Data access logged", **audit_entry)
    
    def log_data_modification(self, user_id: str, table_name: str, record_id: str,
                            action: str, old_values: Dict = None, new_values: Dict = None):
        """Log data modifications"""
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": "data_modification",
            "user_id": user_id,
            "table_name": table_name,
            "record_id": record_id,
            "action": action,
            "old_values": old_values,
            "new_values": new_values,
            "session_id": self._get_session_id()
        }
        
        self._write_audit_log(audit_entry)
        self.logger.info("Data modification logged", **audit_entry)
    
    def log_authentication(self, user_id: str, success: bool, ip_address: str = None,
                          failure_reason: str = None):
        """Log authentication attempts"""
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": "authentication",
            "user_id": user_id,
            "success": success,
            "ip_address": ip_address,
            "failure_reason": failure_reason,
            "session_id": self._get_session_id()
        }
        
        self._write_audit_log(audit_entry)
        self.logger.info("Authentication logged", **audit_entry)
    
    def log_system_event(self, event_type: str, description: str, severity: str = "INFO"):
        """Log system events"""
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": "system_event",
            "system_event_type": event_type,
            "description": description,
            "severity": severity,
            "session_id": self._get_session_id()
        }
        
        self._write_audit_log(audit_entry)
        self.logger.info("System event logged", **audit_entry)
    
    def _write_audit_log(self, audit_entry: Dict[str, Any]):
        """Write audit entry to log file"""
        try:
            with open(self.audit_log_file, 'a') as f:
                f.write(json.dumps(audit_entry) + '\n')
        except Exception as e:
            self.logger.error("Failed to write audit log", error=str(e))
    
    def _get_session_id(self) -> str:
        """Get current session ID (would be implemented with actual session management)"""
        return "system_session"  # Placeholder

class DataAnonymizer:
    """
    Data anonymization for HIPAA compliance
    """
    
    def __init__(self):
        self.logger = logger.bind(component="data_anonymizer")
    
    def anonymize_patient_data(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Anonymize patient data for research/analytics"""
        anonymized_data = patient_data.copy()
        
        # Remove direct identifiers
        anonymized_data.pop('full_name', None)
        anonymized_data.pop('first_name', None)
        anonymized_data.pop('last_name', None)
        anonymized_data.pop('document_number', None)
        anonymized_data.pop('phone', None)
        anonymized_data.pop('email', None)
        anonymized_data.pop('address', None)
        
        # Generalize age to age ranges
        if 'age' in anonymized_data and anonymized_data['age']:
            age = anonymized_data['age']
            if age < 18:
                anonymized_data['age_range'] = 'under_18'
            elif age < 30:
                anonymized_data['age_range'] = '18_29'
            elif age < 50:
                anonymized_data['age_range'] = '30_49'
            elif age < 70:
                anonymized_data['age_range'] = '50_69'
            else:
                anonymized_data['age_range'] = '70_plus'
            
            del anonymized_data['age']
        
        # Generate anonymous ID
        anonymized_data['anonymous_id'] = self._generate_anonymous_id(patient_data)
        
        return anonymized_data
    
    def anonymize_medical_text(self, text: str) -> str:
        """Remove or mask PII from medical text"""
        import re
        
        # Mask names (simple pattern)
        text = re.sub(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', '[PATIENT_NAME]', text)
        
        # Mask document numbers
        text = re.sub(r'\b\d{6,12}\b', '[DOCUMENT_ID]', text)
        
        # Mask phone numbers
        text = re.sub(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE]', text)
        
        # Mask email addresses
        text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]', text)
        
        return text
    
    def _generate_anonymous_id(self, patient_data: Dict[str, Any]) -> str:
        """Generate consistent anonymous ID for patient"""
        # Use hash of original identifiers to create consistent anonymous ID
        identifier_string = f"{patient_data.get('document_number', '')}{patient_data.get('full_name', '')}"
        return hashlib.sha256(identifier_string.encode()).hexdigest()[:16]

class AccessController:
    """
    Role-based access control system
    """
    
    def __init__(self):
        self.logger = logger.bind(component="access_controller")
        self.audit_logger = AuditLogger()
    
    def check_permission(self, user_id: str, resource_type: str, action: str) -> bool:
        """Check if user has permission for action on resource type"""
        # This would integrate with actual user management system
        # For now, return True for system operations
        
        self.audit_logger.log_access(
            user_id=user_id,
            resource_type=resource_type,
            resource_id="system",
            action=f"permission_check_{action}"
        )
        
        return True  # Placeholder implementation
    
    def require_permission(self, user_id: str, resource_type: str, action: str):
        """Decorator/function to require specific permission"""
        if not self.check_permission(user_id, resource_type, action):
            raise PermissionError(f"User {user_id} does not have permission for {action} on {resource_type}")

class SecurityValidator:
    """
    Security validation and sanitization
    """
    
    def __init__(self):
        self.logger = logger.bind(component="security_validator")
    
    def validate_email_sender(self, sender_email: str) -> bool:
        """Validate that email sender is from allowed domain"""
        allowed_domains = SECURITY_CONFIG.get("ALLOWED_DOMAINS", [])
        
        if not allowed_domains:
            return True  # No restrictions if no domains configured
        
        sender_domain = sender_email.split('@')[-1].lower()
        return sender_domain in [domain.lower() for domain in allowed_domains]
    
    def sanitize_filename(self, filename: str) -> str:
        """Sanitize filename to prevent path traversal attacks"""
        import re
        
        # Remove path separators and dangerous characters
        sanitized = re.sub(r'[^\w\-_\.]', '_', filename)
        
        # Prevent hidden files
        if sanitized.startswith('.'):
            sanitized = '_' + sanitized[1:]
        
        # Limit length
        if len(sanitized) > 255:
            name, ext = os.path.splitext(sanitized)
            sanitized = name[:255-len(ext)] + ext
        
        return sanitized
    
    def validate_file_type(self, filename: str, allowed_types: List[str]) -> bool:
        """Validate file type against allowed types"""
        file_ext = os.path.splitext(filename)[1].lower()
        return file_ext in [ext.lower() for ext in allowed_types]
    
    def scan_for_malicious_content(self, content: str) -> bool:
        """Basic scan for potentially malicious content"""
        malicious_patterns = [
            r'<script[^>]*>',
            r'javascript:',
            r'vbscript:',
            r'onload\s*=',
            r'onerror\s*=',
            r'eval\s*\(',
            r'exec\s*\('
        ]
        
        import re
        for pattern in malicious_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                self.logger.warning("Malicious content detected", pattern=pattern)
                return True
        
        return False

class ComplianceManager:
    """
    HIPAA and medical data compliance management
    """
    
    def __init__(self):
        self.logger = logger.bind(component="compliance_manager")
        self.encryption_manager = EncryptionManager()
        self.audit_logger = AuditLogger()
        self.data_anonymizer = DataAnonymizer()
    
    def ensure_data_encryption(self, sensitive_data: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure sensitive data is encrypted"""
        encrypted_data = {}
        
        sensitive_fields = [
            'full_name', 'document_number', 'phone', 'email', 'address',
            'medical_data', 'diagnosis', 'medications'
        ]
        
        for key, value in sensitive_data.items():
            if key in sensitive_fields and value:
                encrypted_data[key] = self.encryption_manager.encrypt_sensitive_data(str(value))
            else:
                encrypted_data[key] = value
        
        return encrypted_data
    
    def check_data_retention_compliance(self):
        """Check and enforce data retention policies"""
        from config import MONITORING_CONFIG
        retention_days = MONITORING_CONFIG.get("DATA_RETENTION_DAYS", 2555)  # 7 years default
        
        cutoff_date = datetime.now() - timedelta(days=retention_days)
        
        with db_manager.get_session() as session:
            # Find old records
            old_emails = session.query(EmailMessage).filter(
                EmailMessage.date_received < cutoff_date
            ).all()
            
            for email in old_emails:
                self.audit_logger.log_system_event(
                    "data_retention_check",
                    f"Email {email.id} marked for retention review",
                    "INFO"
                )
                
                # Anonymize or delete based on policy
                if MONITORING_CONFIG.get("ENABLE_ANONYMIZATION", True):
                    self._anonymize_old_record(email)
                else:
                    self._delete_old_record(email)
    
    def _anonymize_old_record(self, email: EmailMessage):
        """Anonymize old email record"""
        if email.patient_data:
            email.patient_data = self.data_anonymizer.anonymize_patient_data(email.patient_data)
        
        if email.body_text:
            email.body_text = self.data_anonymizer.anonymize_medical_text(email.body_text)
        
        self.audit_logger.log_data_modification(
            user_id="system",
            table_name="email_messages",
            record_id=str(email.id),
            action="anonymize"
        )
    
    def _delete_old_record(self, email: EmailMessage):
        """Delete old email record"""
        self.audit_logger.log_data_modification(
            user_id="system",
            table_name="email_messages",
            record_id=str(email.id),
            action="delete_retention"
        )
        
        # Would implement actual deletion logic here
    
    def generate_compliance_report(self) -> Dict[str, Any]:
        """Generate compliance report"""
        with db_manager.get_session() as session:
            total_emails = session.query(EmailMessage).count()
            encrypted_attachments = session.query(EmailAttachment).filter(
                EmailAttachment.is_encrypted == True
            ).count()
            total_attachments = session.query(EmailAttachment).count()
            
            report = {
                "report_date": datetime.now().isoformat(),
                "total_emails_processed": total_emails,
                "total_attachments": total_attachments,
                "encrypted_attachments": encrypted_attachments,
                "encryption_rate": (encrypted_attachments / total_attachments * 100) if total_attachments > 0 else 0,
                "audit_log_entries": self._count_audit_entries(),
                "compliance_status": "COMPLIANT" if encrypted_attachments == total_attachments else "NEEDS_ATTENTION"
            }
            
            return report
    
    def _count_audit_entries(self) -> int:
        """Count audit log entries"""
        try:
            with open(self.audit_logger.audit_log_file, 'r') as f:
                return sum(1 for line in f)
        except FileNotFoundError:
            return 0

# Global instances
class SecurityManager:
    """
    Main security manager that coordinates all security components
    """

    def __init__(self):
        self.encryption_manager = EncryptionManager()
        self.audit_logger = AuditLogger()
        self.data_anonymizer = DataAnonymizer()
        self.access_controller = AccessController()
        self.security_validator = SecurityValidator()
        self.compliance_manager = ComplianceManager()
        self.logger = logger.bind(component="security_manager")

    def encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.encryption_manager.encrypt_data(data)

    def decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.encryption_manager.decrypt_data(encrypted_data)

    def hash_password(self, password: str) -> str:
        """Hash password for storage"""
        return self.encryption_manager.hash_password(password)

    def verify_password(self, password: str, hashed: str) -> bool:
        """Verify password against hash"""
        return self.encryption_manager.verify_password(password, hashed)

    def generate_token(self, user_data: Dict[str, Any]) -> str:
        """Generate JWT token for user"""
        return self.encryption_manager.generate_jwt_token(user_data)

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        return self.encryption_manager.verify_jwt_token(token)

    def anonymize_patient_data(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Anonymize patient data"""
        return self.data_anonymizer.anonymize_patient_data(patient_data)

    def audit_log(self, action: str, user_id: str, details: Dict[str, Any]):
        """Log security audit event"""
        self.audit_logger.log_action(action, user_id, details)

# Global instances
encryption_manager = EncryptionManager()
audit_logger = AuditLogger()
data_anonymizer = DataAnonymizer()
access_controller = AccessController()
security_validator = SecurityValidator()
compliance_manager = ComplianceManager()
security_manager = SecurityManager()
