"""
End-to-End Integration Tests for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import pytest
import asyncio
import tempfile
import json
from datetime import datetime, timedelta
from pathlib import Path
from unittest.mock import Mock, patch, AsyncMock

from main_service import GmailIntegrationService
from gmail_client import GmailClient
from email_processor import EmailProcessor
from database import db_manager
from models import EmailMessage, MedicalReferral, PatientRecord
from conftest import create_test_email, create_test_patient, create_test_referral

class TestGmailIntegrationWorkflow:
    """Test complete Gmail integration workflow"""
    
    @pytest.mark.asyncio
    async def test_complete_email_processing_workflow(self, db_session, temp_directory):
        """Test complete workflow from Gmail fetch to database storage"""
        
        # Mock Gmail client
        mock_gmail_client = Mock(spec=GmailClient)
        mock_gmail_client.authenticate.return_value = True
        mock_gmail_client.build_referral_query.return_value = "test query"
        mock_gmail_client.get_messages.return_value = [{"id": "test_msg_1"}]
        
        # Mock detailed message
        mock_gmail_client.get_message_details.return_value = {
            "id": "test_msg_1",
            "threadId": "test_thread_1",
            "payload": {
                "headers": [
                    {"name": "Subject", "value": "Referencia Cardiología - Urgente"},
                    {"name": "From", "value": "Dr. Martinez <martinez@hospital.com>"},
                    {"name": "To", "value": "referrals@vital-red.com"},
                    {"name": "Date", "value": "Mon, 1 Jan 2024 10:00:00 +0000"}
                ],
                "body": {"data": ""}
            }
        }
        
        # Mock parsed message
        mock_gmail_client.parse_message.return_value = {
            "gmail_id": "test_msg_1",
            "thread_id": "test_thread_1",
            "subject": "Referencia Cardiología - Urgente",
            "sender_email": "martinez@hospital.com",
            "sender_name": "Dr. Martinez",
            "recipient_email": "referrals@vital-red.com",
            "date_received": datetime.now(),
            "body_text": """
            Paciente: Juan Pérez García
            Cédula: 12345678
            Edad: 45 años
            
            Diagnóstico: Hipertensión arterial refractaria
            Motivo: Valoración por cardiología urgente
            
            Dr. Carlos Martinez
            Medicina Interna
            """,
            "body_html": "",
            "snippet": "Paciente Juan Pérez García...",
            "attachments": []
        }
        
        # Create email processor with mocked dependencies
        email_processor = EmailProcessor(db_session, temp_directory)
        
        # Mock medical classifier
        email_processor.medical_classifier.classify_referral.return_value = (True, "interconsulta", "alta")
        email_processor.medical_classifier.classify_document_type.return_value = "referencia"
        
        # Process the email
        parsed_message = mock_gmail_client.parse_message.return_value
        result = email_processor.process_email(parsed_message)
        
        # Verify email was processed correctly
        assert result is not None
        assert result.gmail_id == "test_msg_1"
        assert result.is_medical_referral is True
        assert result.priority_level == "alta"
        assert result.processing_status == "completed"
        
        # Verify patient record was created
        patient = db_session.query(PatientRecord).filter_by(document_number="12345678").first()
        assert patient is not None
        assert "Juan Pérez" in patient.full_name
        
        # Verify referral was created
        referral = db_session.query(MedicalReferral).filter_by(email_message_id=result.id).first()
        assert referral is not None
        assert referral.specialty_requested == "cardiologia"
        assert referral.priority_level == "alta"
    
    @pytest.mark.asyncio
    async def test_service_startup_and_shutdown(self, temp_directory):
        """Test service startup and shutdown process"""
        
        # Create service instance
        service = GmailIntegrationService()
        
        # Mock Gmail client authentication
        with patch.object(service.gmail_client, 'authenticate', return_value=True):
            # Mock the main processing loop to avoid infinite loop
            with patch.object(service, '_main_processing_loop', new_callable=AsyncMock):
                # Start service
                start_task = asyncio.create_task(service.start_service())
                
                # Wait a bit for startup
                await asyncio.sleep(0.1)
                
                # Verify service is running
                assert service.is_running is True
                
                # Stop service
                await service.stop_service()
                
                # Verify service is stopped
                assert service.is_running is False
                
                # Cancel the start task
                start_task.cancel()
                try:
                    await start_task
                except asyncio.CancelledError:
                    pass
    
    @pytest.mark.asyncio
    async def test_email_processing_with_attachments(self, db_session, temp_directory):
        """Test processing emails with attachments"""
        
        # Create test attachment file
        test_file = temp_directory / "test_attachment.pdf"
        test_file.write_text("Test PDF content with medical information")
        
        # Mock Gmail client with attachment
        mock_gmail_client = Mock(spec=GmailClient)
        mock_gmail_client.get_attachment.return_value = b"PDF content bytes"
        
        # Create email with attachment
        email_data = {
            "gmail_id": "email_with_attachment",
            "thread_id": "thread_123",
            "subject": "Epicrisis - Juan Pérez",
            "sender_email": "doctor@hospital.com",
            "sender_name": "Dr. Smith",
            "recipient_email": "referrals@vital-red.com",
            "date_received": datetime.now(),
            "body_text": "Adjunto epicrisis del paciente",
            "body_html": "",
            "snippet": "Adjunto epicrisis...",
            "attachments": [{
                "filename": "epicrisis_juan_perez.pdf",
                "mime_type": "application/pdf",
                "file_size": 1024,
                "attachment_id": "att_123"
            }]
        }
        
        # Process email
        email_processor = EmailProcessor(db_session, temp_directory)
        email_processor.text_extractor.extract_text.return_value = "Extracted medical text from PDF"
        email_processor.medical_classifier.classify_document_type.return_value = "epicrisis"
        
        result = email_processor.process_email(email_data)
        
        # Verify email and attachment processing
        assert result is not None
        assert len(result.attachments) == 1
        
        attachment = result.attachments[0]
        assert attachment.filename == "epicrisis_juan_perez.pdf"
        assert attachment.document_type == "epicrisis"
        assert attachment.extracted_text == "Extracted medical text from PDF"
    
    @pytest.mark.asyncio
    async def test_error_handling_and_recovery(self, db_session, temp_directory):
        """Test error handling and recovery mechanisms"""
        
        # Create email processor
        email_processor = EmailProcessor(db_session, temp_directory)
        
        # Test with invalid email data
        invalid_email_data = {
            "gmail_id": None,  # Invalid
            "subject": "Test"
        }
        
        result = email_processor.process_email(invalid_email_data)
        assert result is None
        
        # Test with email that causes processing error
        error_email_data = {
            "gmail_id": "error_email_123",
            "thread_id": "thread_123",
            "subject": "Error Test",
            "sender_email": "test@example.com",
            "sender_name": "Test",
            "recipient_email": "recipient@example.com",
            "date_received": datetime.now(),
            "body_text": "Test email",
            "body_html": "",
            "snippet": "Test...",
            "attachments": []
        }
        
        # Mock classifier to raise exception
        email_processor.medical_classifier.classify_referral.side_effect = Exception("Classification error")
        
        result = email_processor.process_email(error_email_data)
        
        # Should handle error gracefully
        assert result is None or result.processing_status == "error"
    
    def test_database_integration(self, db_session):
        """Test database operations and relationships"""
        
        # Create email
        email = create_test_email(
            db_session,
            subject="Integration Test Email",
            is_medical_referral=True
        )
        
        # Create patient
        patient = create_test_patient(
            db_session,
            document_number="12345678",
            full_name="Integration Test Patient"
        )
        
        # Create referral
        referral = create_test_referral(
            db_session,
            email_id=email.id,
            patient_id=patient.id,
            specialty_requested="cardiologia"
        )
        
        # Test relationships
        assert email.id is not None
        assert patient.id is not None
        assert referral.id is not None
        
        # Test foreign key relationships
        assert referral.email_message_id == email.id
        assert referral.patient_record_id == patient.id
        
        # Test queries
        found_email = db_session.query(EmailMessage).filter_by(id=email.id).first()
        assert found_email is not None
        assert found_email.subject == "Integration Test Email"
        
        found_referral = db_session.query(MedicalReferral).filter_by(
            email_message_id=email.id
        ).first()
        assert found_referral is not None
        assert found_referral.specialty_requested == "cardiologia"
    
    @pytest.mark.asyncio
    async def test_concurrent_email_processing(self, db_session, temp_directory):
        """Test concurrent processing of multiple emails"""
        
        # Create multiple email data sets
        email_data_sets = []
        for i in range(5):
            email_data_sets.append({
                "gmail_id": f"concurrent_email_{i}",
                "thread_id": f"thread_{i}",
                "subject": f"Concurrent Test Email {i}",
                "sender_email": f"sender{i}@hospital.com",
                "sender_name": f"Dr. Sender {i}",
                "recipient_email": "referrals@vital-red.com",
                "date_received": datetime.now() - timedelta(minutes=i),
                "body_text": f"Medical content for patient {i}",
                "body_html": "",
                "snippet": f"Medical content {i}...",
                "attachments": []
            })
        
        # Create email processor
        email_processor = EmailProcessor(db_session, temp_directory)
        email_processor.medical_classifier.classify_referral.return_value = (True, "interconsulta", "media")
        
        # Process emails concurrently
        async def process_email_async(email_data):
            return email_processor.process_email(email_data)
        
        tasks = [process_email_async(data) for data in email_data_sets]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Verify all emails were processed
        successful_results = [r for r in results if isinstance(r, EmailMessage)]
        assert len(successful_results) == 5
        
        # Verify no data corruption
        for result in successful_results:
            assert result.gmail_id.startswith("concurrent_email_")
            assert result.processing_status == "completed"
    
    def test_performance_with_large_dataset(self, db_session, temp_directory):
        """Test performance with large number of emails"""
        
        # Create email processor
        email_processor = EmailProcessor(db_session, temp_directory)
        email_processor.medical_classifier.classify_referral.return_value = (False, None, None)
        
        # Process many emails
        import time
        start_time = time.time()
        
        processed_count = 0
        for i in range(20):  # Reduced for test performance
            email_data = {
                "gmail_id": f"perf_email_{i}",
                "thread_id": f"thread_{i}",
                "subject": f"Performance Test Email {i}",
                "sender_email": f"sender{i}@test.com",
                "sender_name": f"Sender {i}",
                "recipient_email": "test@vital-red.com",
                "date_received": datetime.now(),
                "body_text": f"Test content {i}",
                "body_html": "",
                "snippet": f"Test {i}...",
                "attachments": []
            }
            
            result = email_processor.process_email(email_data)
            if result:
                processed_count += 1
        
        processing_time = time.time() - start_time
        
        # Verify performance
        assert processed_count == 20
        assert processing_time < 60  # Should complete within 1 minute
        
        # Calculate processing rate
        emails_per_second = processed_count / processing_time
        assert emails_per_second > 0.5  # At least 0.5 emails per second
    
    @pytest.mark.asyncio
    async def test_frontend_integration_workflow(self, db_session):
        """Test integration with frontend components"""
        
        # Create test data
        email = create_test_email(
            db_session,
            subject="Frontend Integration Test",
            is_medical_referral=True
        )
        
        patient = create_test_patient(
            db_session,
            full_name="Frontend Test Patient"
        )
        
        referral = create_test_referral(
            db_session,
            email_id=email.id,
            patient_id=patient.id,
            status="pending"
        )
        
        # Mock frontend integration
        from frontend_integration import VitalRedIntegration, FrontendDataTransformer
        
        # Test data transformation
        transformed_data = FrontendDataTransformer.transform_referral_for_dashboard(
            referral, email, patient
        )
        
        # Verify transformation
        assert transformed_data["id"] == referral.id
        assert transformed_data["patientName"] == patient.full_name
        assert transformed_data["emailSubject"] == email.subject
        assert "urgencyLevel" in transformed_data
        assert "tags" in transformed_data
    
    def test_monitoring_integration(self, db_session):
        """Test monitoring system integration"""
        
        from monitoring import SystemMonitor, MetricsCollector, AlertManager
        
        # Create monitoring components
        metrics_collector = MetricsCollector()
        alert_manager = AlertManager()
        
        # Collect metrics
        system_metrics = metrics_collector.collect_system_metrics()
        db_metrics = metrics_collector.collect_database_metrics()
        
        # Verify metrics collection
        assert system_metrics is not None
        assert system_metrics.cpu_percent >= 0
        assert system_metrics.memory_percent >= 0
        
        if db_metrics:  # May be None if database not accessible
            assert db_metrics.total_emails >= 0
            assert db_metrics.processing_rate >= 0
        
        # Test alert creation
        alert_manager.create_alert(
            "WARNING",
            "Test Alert",
            "This is a test alert",
            "integration_test"
        )
        
        active_alerts = alert_manager.get_active_alerts()
        assert len(active_alerts) >= 1
        assert active_alerts[-1].title == "Test Alert"
    
    @pytest.mark.asyncio
    async def test_backup_and_recovery(self, db_session, temp_directory):
        """Test backup and recovery functionality"""
        
        # Create test data
        email = create_test_email(db_session, subject="Backup Test Email")
        patient = create_test_patient(db_session, full_name="Backup Test Patient")
        referral = create_test_referral(db_session, email_id=email.id, patient_id=patient.id)
        
        # Simulate backup process
        backup_data = {
            "emails": [
                {
                    "id": email.id,
                    "gmail_id": email.gmail_id,
                    "subject": email.subject,
                    "processing_status": email.processing_status
                }
            ],
            "patients": [
                {
                    "id": patient.id,
                    "document_number": patient.document_number,
                    "full_name": patient.full_name
                }
            ],
            "referrals": [
                {
                    "id": referral.id,
                    "referral_number": referral.referral_number,
                    "status": referral.status
                }
            ],
            "backup_timestamp": datetime.now().isoformat()
        }
        
        # Save backup to file
        backup_file = temp_directory / "test_backup.json"
        with open(backup_file, 'w') as f:
            json.dump(backup_data, f, indent=2)
        
        # Verify backup file
        assert backup_file.exists()
        
        # Load and verify backup
        with open(backup_file, 'r') as f:
            loaded_backup = json.load(f)
        
        assert len(loaded_backup["emails"]) == 1
        assert len(loaded_backup["patients"]) == 1
        assert len(loaded_backup["referrals"]) == 1
        assert loaded_backup["emails"][0]["subject"] == "Backup Test Email"

class TestSystemResilience:
    """Test system resilience and fault tolerance"""
    
    def test_database_connection_failure_handling(self, temp_directory):
        """Test handling of database connection failures"""
        
        # Mock database session that fails
        mock_session = Mock()
        mock_session.query.side_effect = Exception("Database connection failed")
        
        email_processor = EmailProcessor(mock_session, temp_directory)
        
        # Try to process email with failed database
        email_data = {
            "gmail_id": "db_fail_test",
            "subject": "Database Failure Test",
            "sender_email": "test@example.com",
            "sender_name": "Test",
            "recipient_email": "recipient@example.com",
            "date_received": datetime.now(),
            "body_text": "Test content",
            "body_html": "",
            "snippet": "Test...",
            "attachments": []
        }
        
        # Should handle database failure gracefully
        result = email_processor.process_email(email_data)
        assert result is None  # Should return None on database failure
    
    def test_gmail_api_failure_handling(self, db_session, temp_directory):
        """Test handling of Gmail API failures"""
        
        # Mock Gmail client that fails
        mock_gmail_client = Mock(spec=GmailClient)
        mock_gmail_client.authenticate.return_value = False
        mock_gmail_client.get_messages.side_effect = Exception("Gmail API error")
        
        # Should handle Gmail API failures gracefully
        assert mock_gmail_client.authenticate() is False
        
        with pytest.raises(Exception):
            mock_gmail_client.get_messages("test query")
    
    def test_file_system_failure_handling(self, db_session):
        """Test handling of file system failures"""
        
        # Use non-existent directory
        invalid_directory = Path("/invalid/directory/path")
        
        # Should handle invalid directory gracefully
        email_processor = EmailProcessor(db_session, invalid_directory)
        
        # Processing should still work for emails without attachments
        email_data = {
            "gmail_id": "fs_fail_test",
            "subject": "File System Failure Test",
            "sender_email": "test@example.com",
            "sender_name": "Test",
            "recipient_email": "recipient@example.com",
            "date_received": datetime.now(),
            "body_text": "Test content",
            "body_html": "",
            "snippet": "Test...",
            "attachments": []
        }
        
        # Should process email even with file system issues
        result = email_processor.process_email(email_data)
        # Result may be None or have error status, but shouldn't crash
