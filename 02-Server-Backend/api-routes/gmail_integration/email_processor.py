"""
Email Processing Engine for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import re
import json
import hashlib
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from pathlib import Path
import structlog

from models import EmailMessage, EmailAttachment, ProcessingLog, PatientRecord, MedicalReferral
from config import EMAIL_CONFIG, MEDICAL_PATTERNS, PROCESSING_CONFIG
from text_extractor import TextExtractor
from medical_classifier import MedicalClassifier

logger = structlog.get_logger(__name__)

class EmailProcessor:
    """
    Main email processing engine that coordinates all processing steps
    """
    
    def __init__(self, db_session, file_storage_path: Path):
        self.db_session = db_session
        self.file_storage_path = file_storage_path
        self.text_extractor = TextExtractor()
        self.medical_classifier = MedicalClassifier()
        self.logger = logger.bind(component="email_processor")
        
        # Ensure storage directory exists
        self.file_storage_path.mkdir(parents=True, exist_ok=True)
    
    def process_email(self, parsed_message: Dict[str, Any]) -> Optional[EmailMessage]:
        """
        Main method to process a complete email message
        
        Args:
            parsed_message: Parsed Gmail message from GmailClient
            
        Returns:
            EmailMessage instance or None if processing failed
        """
        gmail_id = parsed_message.get('gmail_id')
        self.logger.info("Starting email processing", gmail_id=gmail_id)
        
        # Check if email already exists
        existing_email = self.db_session.query(EmailMessage).filter_by(gmail_id=gmail_id).first()
        if existing_email:
            self.logger.info("Email already processed", gmail_id=gmail_id)
            return existing_email
        
        try:
            # Create email record
            email_message = self._create_email_record(parsed_message)
            self.db_session.add(email_message)
            self.db_session.flush()  # Get the ID
            
            # Log processing start
            self._log_processing_step(email_message.id, "email_creation", "completed", 
                                    "Email record created successfully")
            
            # Process email content
            self._process_email_content(email_message, parsed_message)
            
            # Process attachments
            if parsed_message.get('attachments'):
                self._process_attachments(email_message, parsed_message['attachments'])
            
            # Classify as medical referral
            self._classify_medical_referral(email_message)
            
            # Extract medical data if it's a referral
            if email_message.is_medical_referral:
                self._extract_medical_data(email_message)
                self._create_patient_record(email_message)
                self._create_referral_record(email_message)
            
            # Update processing status
            email_message.processing_status = "completed"
            email_message.date_processed = datetime.now()
            
            self.db_session.commit()
            
            self.logger.info("Email processing completed successfully", 
                           gmail_id=gmail_id, email_id=email_message.id)
            
            return email_message
            
        except Exception as e:
            self.logger.error("Email processing failed", gmail_id=gmail_id, error=str(e))
            self.db_session.rollback()
            
            # Update error status if email record exists
            if 'email_message' in locals():
                email_message.processing_status = "error"
                email_message.processing_error = str(e)
                self._log_processing_step(email_message.id, "processing", "error", str(e))
                self.db_session.commit()
            
            return None
    
    def _create_email_record(self, parsed_message: Dict[str, Any]) -> EmailMessage:
        """Create EmailMessage database record"""
        email_message = EmailMessage(
            gmail_id=parsed_message['gmail_id'],
            thread_id=parsed_message['thread_id'],
            subject=parsed_message['subject'],
            sender_email=parsed_message['sender_email'],
            sender_name=parsed_message['sender_name'],
            recipient_email=parsed_message['recipient_email'],
            date_received=parsed_message['date_received'],
            body_text=parsed_message['body_text'],
            body_html=parsed_message['body_html'],
            snippet=parsed_message['snippet'],
            processing_status="processing"
        )
        
        return email_message
    
    def _process_email_content(self, email_message: EmailMessage, parsed_message: Dict[str, Any]):
        """Process email text content for medical information"""
        try:
            self._log_processing_step(email_message.id, "content_processing", "started", 
                                    "Processing email content")
            
            # Combine subject and body for analysis
            full_text = f"{email_message.subject}\n\n{email_message.body_text}"
            
            # Extract basic medical information from text
            extracted_data = self._extract_medical_info_from_text(full_text)
            
            # Store extracted data
            email_message.patient_data = extracted_data.get('patient_data', {})
            email_message.medical_data = extracted_data.get('medical_data', {})
            
            self._log_processing_step(email_message.id, "content_processing", "completed", 
                                    f"Extracted {len(extracted_data)} data fields")
            
        except Exception as e:
            self._log_processing_step(email_message.id, "content_processing", "error", str(e))
            raise
    
    def _process_attachments(self, email_message: EmailMessage, attachments_info: List[Dict[str, Any]]):
        """Process all email attachments"""
        try:
            self._log_processing_step(email_message.id, "attachment_processing", "started", 
                                    f"Processing {len(attachments_info)} attachments")
            
            for attachment_info in attachments_info:
                self._process_single_attachment(email_message, attachment_info)
            
            self._log_processing_step(email_message.id, "attachment_processing", "completed", 
                                    "All attachments processed")
            
        except Exception as e:
            self._log_processing_step(email_message.id, "attachment_processing", "error", str(e))
            raise
    
    def _process_single_attachment(self, email_message: EmailMessage, attachment_info: Dict[str, Any]):
        """Process a single email attachment"""
        try:
            filename = attachment_info['filename']
            self.logger.debug("Processing attachment", filename=filename)
            
            # Create attachment record
            attachment = EmailAttachment(
                email_message_id=email_message.id,
                filename=self._sanitize_filename(filename),
                original_filename=filename,
                mime_type=attachment_info['mime_type'],
                file_size=attachment_info['size'],
                attachment_id=attachment_info['attachment_id'],
                processing_status="processing"
            )
            
            self.db_session.add(attachment)
            self.db_session.flush()
            
            # Download and save file (this would be done by the Gmail client)
            # For now, we'll simulate the file path
            file_path = self._generate_file_path(email_message.id, attachment.id, filename)
            attachment.file_path = str(file_path)
            
            # Extract text from attachment
            extracted_text = self.text_extractor.extract_text(file_path, attachment_info['mime_type'])
            attachment.extracted_text = extracted_text
            
            # Classify document type
            doc_type = self.medical_classifier.classify_document_type(extracted_text, filename)
            attachment.document_type = doc_type
            
            # Check for medical and patient data
            attachment.contains_patient_data = self._contains_patient_data(extracted_text)
            attachment.contains_medical_data = self._contains_medical_data(extracted_text)
            
            # Generate file hash for integrity
            attachment.file_hash = self._generate_file_hash(file_path)
            
            attachment.processing_status = "completed"
            
        except Exception as e:
            if 'attachment' in locals():
                attachment.processing_status = "error"
                attachment.processing_error = str(e)
            raise
    
    def _classify_medical_referral(self, email_message: EmailMessage):
        """Classify if email is a medical referral"""
        try:
            self._log_processing_step(email_message.id, "medical_classification", "started", 
                                    "Classifying email as medical referral")
            
            # Combine all text content
            all_text = f"{email_message.subject}\n{email_message.body_text}"
            
            # Add attachment text
            for attachment in email_message.attachments:
                if attachment.extracted_text:
                    all_text += f"\n{attachment.extracted_text}"
            
            # Use medical classifier
            is_referral, referral_type, priority = self.medical_classifier.classify_referral(all_text)
            
            email_message.is_medical_referral = is_referral
            email_message.referral_type = referral_type
            email_message.priority_level = priority
            
            self._log_processing_step(email_message.id, "medical_classification", "completed", 
                                    f"Classified as referral: {is_referral}")
            
        except Exception as e:
            self._log_processing_step(email_message.id, "medical_classification", "error", str(e))
            raise
    
    def _extract_medical_data(self, email_message: EmailMessage):
        """Extract detailed medical information from email and attachments"""
        try:
            self._log_processing_step(email_message.id, "medical_extraction", "started", 
                                    "Extracting medical data")
            
            # Combine all text
            all_text = f"{email_message.subject}\n{email_message.body_text}"
            for attachment in email_message.attachments:
                if attachment.extracted_text:
                    all_text += f"\n{attachment.extracted_text}"
            
            # Extract medical information
            medical_data = self._extract_medical_info_from_text(all_text)
            
            # Update email record
            if email_message.patient_data:
                email_message.patient_data.update(medical_data.get('patient_data', {}))
            else:
                email_message.patient_data = medical_data.get('patient_data', {})
            
            if email_message.medical_data:
                email_message.medical_data.update(medical_data.get('medical_data', {}))
            else:
                email_message.medical_data = medical_data.get('medical_data', {})
            
            # Extract referring institution info
            email_message.referring_institution = medical_data.get('referring_institution')
            email_message.referring_physician = medical_data.get('referring_physician')
            
            self._log_processing_step(email_message.id, "medical_extraction", "completed", 
                                    "Medical data extracted")
            
        except Exception as e:
            self._log_processing_step(email_message.id, "medical_extraction", "error", str(e))
            raise
    
    def _extract_medical_info_from_text(self, text: str) -> Dict[str, Any]:
        """Extract medical information using regex patterns"""
        extracted_data = {
            'patient_data': {},
            'medical_data': {},
            'referring_institution': None,
            'referring_physician': None
        }
        
        text_lower = text.lower()
        
        # Extract patient information
        for field, patterns in MEDICAL_PATTERNS.items():
            for pattern in patterns:
                match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
                if match:
                    value = match.group(1).strip()
                    
                    if field in ['PATIENT_ID', 'AGE']:
                        extracted_data['patient_data'][field.lower()] = value
                    elif field == 'PATIENT_NAME':
                        extracted_data['patient_data']['full_name'] = value
                    else:
                        extracted_data['medical_data'][field.lower()] = value
                    break
        
        # Extract referring institution
        institution_patterns = [
            r"(?:hospital|clinica|eps|ips)[\s:]*([^.\n]+)",
            r"(?:institucion|entidad)[\s:]*([^.\n]+)"
        ]
        
        for pattern in institution_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted_data['referring_institution'] = match.group(1).strip()
                break
        
        # Extract referring physician
        physician_patterns = [
            r"(?:dr|dra|doctor|doctora|medico)[\s.]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)",
            r"(?:firma|atiende|solicita)[\s:]*(?:dr|dra)?[\s.]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)"
        ]
        
        for pattern in physician_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                extracted_data['referring_physician'] = match.group(1).strip()
                break
        
        return extracted_data
    
    def _create_patient_record(self, email_message: EmailMessage):
        """Create or update patient record"""
        if not email_message.patient_data:
            return
        
        patient_data = email_message.patient_data
        document_number = patient_data.get('patient_id')
        
        if not document_number:
            return
        
        try:
            # Check if patient already exists
            patient = self.db_session.query(PatientRecord).filter_by(
                document_number=document_number
            ).first()
            
            if not patient:
                patient = PatientRecord(
                    document_number=document_number,
                    full_name=patient_data.get('full_name', ''),
                    age=int(patient_data.get('age', 0)) if patient_data.get('age') else None,
                    source_emails=[email_message.gmail_id]
                )
                self.db_session.add(patient)
            else:
                # Update existing patient
                if email_message.gmail_id not in patient.source_emails:
                    patient.source_emails.append(email_message.gmail_id)
                patient.last_updated = datetime.now()
            
            self.db_session.flush()
            
        except Exception as e:
            self.logger.error("Error creating patient record", error=str(e))
    
    def _create_referral_record(self, email_message: EmailMessage):
        """Create medical referral record"""
        if not email_message.is_medical_referral:
            return
        
        try:
            # Generate referral number
            referral_number = f"REF-{email_message.id}-{datetime.now().strftime('%Y%m%d')}"
            
            referral = MedicalReferral(
                email_message_id=email_message.id,
                referral_number=referral_number,
                referral_type=email_message.referral_type or "interconsulta",
                specialty_requested=email_message.medical_data.get('specialty', 'medicina general'),
                priority_level=email_message.priority_level or "media",
                primary_diagnosis=email_message.medical_data.get('diagnosis'),
                clinical_summary=email_message.body_text[:1000],  # First 1000 chars
                reason_for_referral=email_message.medical_data.get('reason'),
                referring_hospital=email_message.referring_institution,
                referring_physician=email_message.referring_physician,
                referral_date=email_message.date_received,
                status="pending"
            )
            
            self.db_session.add(referral)
            
        except Exception as e:
            self.logger.error("Error creating referral record", error=str(e))
    
    def _log_processing_step(self, email_id: int, step_name: str, status: str, message: str):
        """Log a processing step"""
        log_entry = ProcessingLog(
            email_message_id=email_id,
            step_name=step_name,
            status=status,
            message=message,
            start_time=datetime.now()
        )
        
        if status in ["completed", "error"]:
            log_entry.end_time = datetime.now()
            if log_entry.start_time:
                duration = (log_entry.end_time - log_entry.start_time).total_seconds()
                log_entry.duration_seconds = duration
        
        self.db_session.add(log_entry)
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage"""
        # Remove or replace unsafe characters
        safe_chars = re.sub(r'[^\w\-_\.]', '_', filename)
        return safe_chars[:255]  # Limit length
    
    def _generate_file_path(self, email_id: int, attachment_id: int, filename: str) -> Path:
        """Generate file storage path"""
        safe_filename = self._sanitize_filename(filename)
        return self.file_storage_path / str(email_id) / f"{attachment_id}_{safe_filename}"
    
    def _generate_file_hash(self, file_path: Path) -> str:
        """Generate SHA-256 hash of file"""
        if not file_path.exists():
            return ""
        
        hash_sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        return hash_sha256.hexdigest()
    
    def _contains_patient_data(self, text: str) -> bool:
        """Check if text contains patient data"""
        patient_indicators = [
            r"\b\d{6,12}\b",  # Document numbers
            r"(?:cedula|cc|documento)",
            r"(?:paciente|nombre)",
            r"(?:edad|años)"
        ]
        
        for pattern in patient_indicators:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False
    
    def _contains_medical_data(self, text: str) -> bool:
        """Check if text contains medical data"""
        medical_indicators = [
            r"(?:diagnostico|dx)",
            r"(?:sintomas|signos)",
            r"(?:tratamiento|medicamento)",
            r"(?:examen|laboratorio)",
            r"(?:cirugia|procedimiento)"
        ]
        
        for pattern in medical_indicators:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        return False
