"""
Unit Tests for Email Processor - VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import pytest
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock

from email_processor import EmailProcessor
from models import EmailMessage, EmailAttachment, PatientRecord, MedicalReferral
from conftest import (
    create_test_email, create_test_patient, create_test_referral,
    assert_email_processed_correctly, assert_patient_data_extracted,
    assert_referral_created
)

class TestEmailProcessor:
    """Test cases for EmailProcessor class"""
    
    def test_process_email_success(self, email_processor, sample_email_data, db_session):
        """Test successful email processing"""
        # Process the email
        result = email_processor.process_email(sample_email_data)
        
        # Verify email was processed
        assert result is not None
        assert isinstance(result, EmailMessage)
        assert result.gmail_id == sample_email_data["gmail_id"]
        assert result.processing_status == "completed"
        assert result.date_processed is not None
    
    def test_process_email_duplicate(self, email_processor, sample_email_data, db_session):
        """Test processing duplicate email"""
        # Create existing email
        existing_email = create_test_email(db_session, gmail_id=sample_email_data["gmail_id"])
        
        # Try to process same email again
        result = email_processor.process_email(sample_email_data)
        
        # Should return existing email
        assert result.id == existing_email.id
    
    def test_process_email_with_medical_content(self, email_processor, sample_medical_text, db_session):
        """Test processing email with medical content"""
        email_data = {
            "gmail_id": "medical_email_123",
            "thread_id": "thread_123",
            "subject": "Interconsulta Cardiología",
            "sender_email": "doctor@hospital.com",
            "sender_name": "Dr. Smith",
            "recipient_email": "referrals@vital-red.com",
            "date_received": datetime.now(),
            "body_text": sample_medical_text,
            "body_html": "",
            "snippet": "Medical referral...",
            "attachments": []
        }
        
        # Mock medical classifier to return positive classification
        email_processor.medical_classifier.classify_referral.return_value = (True, "interconsulta", "alta")
        
        result = email_processor.process_email(email_data)
        
        # Verify medical referral was identified
        assert result.is_medical_referral is True
        assert result.referral_type == "interconsulta"
        assert result.priority_level == "alta"
    
    def test_extract_medical_info_from_text(self, email_processor, sample_medical_text):
        """Test medical information extraction from text"""
        extracted_data = email_processor._extract_medical_info_from_text(sample_medical_text)
        
        # Verify patient data extraction
        patient_data = extracted_data.get("patient_data", {})
        assert "full_name" in patient_data or "patient_id" in patient_data
        
        # Verify medical data extraction
        medical_data = extracted_data.get("medical_data", {})
        assert isinstance(medical_data, dict)
    
    def test_create_email_record(self, email_processor, sample_email_data):
        """Test email record creation"""
        email_record = email_processor._create_email_record(sample_email_data)
        
        assert email_record.gmail_id == sample_email_data["gmail_id"]
        assert email_record.subject == sample_email_data["subject"]
        assert email_record.sender_email == sample_email_data["sender_email"]
        assert email_record.processing_status == "processing"
    
    def test_process_email_content(self, email_processor, db_session, sample_email_data):
        """Test email content processing"""
        # Create email record
        email = create_test_email(db_session, **sample_email_data)
        
        # Process content
        email_processor._process_email_content(email, sample_email_data)
        
        # Verify content was processed
        assert email.patient_data is not None or email.medical_data is not None
    
    def test_classify_medical_referral(self, email_processor, db_session, sample_email_data):
        """Test medical referral classification"""
        # Create email record
        email = create_test_email(db_session, **sample_email_data)
        
        # Mock classifier response
        email_processor.medical_classifier.classify_referral.return_value = (True, "urgente", "alta")
        
        # Classify email
        email_processor._classify_medical_referral(email)
        
        # Verify classification
        assert email.is_medical_referral is True
        assert email.referral_type == "urgente"
        assert email.priority_level == "alta"
    
    def test_extract_medical_data(self, email_processor, db_session, sample_medical_text):
        """Test detailed medical data extraction"""
        # Create email with medical content
        email = create_test_email(
            db_session,
            body_text=sample_medical_text,
            is_medical_referral=True
        )
        
        # Extract medical data
        email_processor._extract_medical_data(email)
        
        # Verify data extraction
        assert email.patient_data is not None
        assert email.medical_data is not None
    
    def test_create_patient_record(self, email_processor, db_session):
        """Test patient record creation"""
        # Create email with patient data
        email = create_test_email(
            db_session,
            patient_data={
                "patient_id": "12345678",
                "full_name": "Juan Pérez",
                "age": "45"
            }
        )
        
        # Create patient record
        email_processor._create_patient_record(email)
        
        # Verify patient was created
        patient = db_session.query(PatientRecord).filter_by(document_number="12345678").first()
        assert patient is not None
        assert patient.full_name == "Juan Pérez"
    
    def test_create_referral_record(self, email_processor, db_session):
        """Test referral record creation"""
        # Create medical referral email
        email = create_test_email(
            db_session,
            is_medical_referral=True,
            referral_type="interconsulta",
            priority_level="alta",
            medical_data={"specialty": "cardiologia"}
        )
        
        # Create referral record
        email_processor._create_referral_record(email)
        
        # Verify referral was created
        referral = db_session.query(MedicalReferral).filter_by(email_message_id=email.id).first()
        assert referral is not None
        assert referral.referral_type == "interconsulta"
        assert referral.priority_level == "alta"
    
    def test_process_attachments(self, email_processor, db_session, sample_attachment_data):
        """Test attachment processing"""
        # Create email record
        email = create_test_email(db_session)
        
        # Mock attachment processing
        attachments_info = [sample_attachment_data]
        
        # Process attachments
        email_processor._process_attachments(email, attachments_info)
        
        # Verify attachment processing was called
        email_processor.text_extractor.extract_text.assert_called()
    
    def test_process_single_attachment(self, email_processor, db_session, sample_attachment_data):
        """Test single attachment processing"""
        # Create email record
        email = create_test_email(db_session)
        
        # Process single attachment
        email_processor._process_single_attachment(email, sample_attachment_data)
        
        # Verify attachment record was created
        attachment = db_session.query(EmailAttachment).filter_by(email_message_id=email.id).first()
        assert attachment is not None
        assert attachment.filename == sample_attachment_data["filename"]
    
    def test_sanitize_filename(self, email_processor):
        """Test filename sanitization"""
        unsafe_filename = "test file with spaces & special chars!.pdf"
        safe_filename = email_processor._sanitize_filename(unsafe_filename)
        
        assert " " not in safe_filename or "_" in safe_filename
        assert len(safe_filename) <= 255
    
    def test_generate_file_path(self, email_processor, temp_directory):
        """Test file path generation"""
        email_id = 123
        attachment_id = 456
        filename = "test.pdf"
        
        file_path = email_processor._generate_file_path(email_id, attachment_id, filename)
        
        assert str(email_id) in str(file_path)
        assert str(attachment_id) in str(file_path)
        assert filename in str(file_path)
    
    def test_contains_patient_data(self, email_processor):
        """Test patient data detection"""
        text_with_patient_data = "Paciente Juan Pérez, CC 12345678, edad 45 años"
        text_without_patient_data = "This is a regular email without medical content"
        
        assert email_processor._contains_patient_data(text_with_patient_data) is True
        assert email_processor._contains_patient_data(text_without_patient_data) is False
    
    def test_contains_medical_data(self, email_processor):
        """Test medical data detection"""
        text_with_medical_data = "Diagnóstico: Hipertensión arterial. Tratamiento: Enalapril"
        text_without_medical_data = "This is a regular email"
        
        assert email_processor._contains_medical_data(text_with_medical_data) is True
        assert email_processor._contains_medical_data(text_without_medical_data) is False
    
    def test_error_handling(self, email_processor, db_session):
        """Test error handling during processing"""
        # Create invalid email data
        invalid_email_data = {
            "gmail_id": None,  # Invalid data
            "subject": "Test"
        }
        
        # Process should handle error gracefully
        result = email_processor.process_email(invalid_email_data)
        
        # Should return None on error
        assert result is None
    
    def test_logging_processing_step(self, email_processor, db_session):
        """Test processing step logging"""
        # Create email record
        email = create_test_email(db_session)
        
        # Log a processing step
        email_processor._log_processing_step(
            email.id, 
            "test_step", 
            "completed", 
            "Test message"
        )
        
        # Verify log was created
        from models import ProcessingLog
        log = db_session.query(ProcessingLog).filter_by(email_message_id=email.id).first()
        assert log is not None
        assert log.step_name == "test_step"
        assert log.status == "completed"

class TestEmailProcessorIntegration:
    """Integration tests for EmailProcessor"""
    
    def test_full_email_processing_workflow(self, email_processor, sample_email_data, db_session):
        """Test complete email processing workflow"""
        # Mock all dependencies
        email_processor.medical_classifier.classify_referral.return_value = (True, "interconsulta", "alta")
        email_processor.text_extractor.extract_text.return_value = "Extracted text"
        
        # Process email
        result = email_processor.process_email(sample_email_data)
        
        # Verify complete workflow
        assert result is not None
        assert result.processing_status == "completed"
        
        # Check if patient record was created
        if result.patient_data and result.patient_data.get("patient_id"):
            patient = db_session.query(PatientRecord).filter_by(
                document_number=result.patient_data["patient_id"]
            ).first()
            assert patient is not None
        
        # Check if referral was created
        if result.is_medical_referral:
            referral = db_session.query(MedicalReferral).filter_by(
                email_message_id=result.id
            ).first()
            assert referral is not None
    
    def test_processing_with_attachments(self, email_processor, sample_email_data, sample_attachment_data, db_session):
        """Test processing email with attachments"""
        # Add attachments to email data
        sample_email_data["attachments"] = [sample_attachment_data]
        
        # Process email
        result = email_processor.process_email(sample_email_data)
        
        # Verify attachment was processed
        attachment = db_session.query(EmailAttachment).filter_by(
            email_message_id=result.id
        ).first()
        assert attachment is not None
    
    def test_performance_with_large_text(self, email_processor, db_session):
        """Test performance with large text content"""
        # Create email with large text content
        large_text = "Large medical text content. " * 1000
        email_data = {
            "gmail_id": "large_email_123",
            "thread_id": "thread_123",
            "subject": "Large Email",
            "sender_email": "test@example.com",
            "sender_name": "Test",
            "recipient_email": "recipient@example.com",
            "date_received": datetime.now(),
            "body_text": large_text,
            "body_html": "",
            "snippet": "Large email...",
            "attachments": []
        }
        
        # Process should complete within reasonable time
        import time
        start_time = time.time()
        result = email_processor.process_email(email_data)
        processing_time = time.time() - start_time
        
        assert result is not None
        assert processing_time < 30  # Should complete within 30 seconds
    
    @pytest.mark.asyncio
    async def test_concurrent_processing(self, email_processor, db_session):
        """Test concurrent email processing"""
        import asyncio
        
        # Create multiple email data sets
        email_data_sets = []
        for i in range(5):
            email_data_sets.append({
                "gmail_id": f"concurrent_email_{i}",
                "thread_id": f"thread_{i}",
                "subject": f"Test Email {i}",
                "sender_email": f"test{i}@example.com",
                "sender_name": f"Test {i}",
                "recipient_email": "recipient@example.com",
                "date_received": datetime.now(),
                "body_text": f"Test email body {i}",
                "body_html": "",
                "snippet": f"Test email {i}...",
                "attachments": []
            })
        
        # Process emails concurrently
        async def process_email_async(email_data):
            return email_processor.process_email(email_data)
        
        tasks = [process_email_async(data) for data in email_data_sets]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Verify all emails were processed
        successful_results = [r for r in results if isinstance(r, EmailMessage)]
        assert len(successful_results) == 5
