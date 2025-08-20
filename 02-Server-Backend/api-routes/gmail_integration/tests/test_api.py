"""
API Tests for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import pytest
import json
from datetime import datetime, timedelta
from fastapi.testclient import TestClient

from api import app
from conftest import create_test_email, create_test_patient, create_test_referral

class TestHealthEndpoints:
    """Test health and status endpoints"""
    
    def test_health_check(self, api_client):
        """Test health check endpoint"""
        response = api_client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert "service" in data
    
    def test_service_status(self, api_client):
        """Test service status endpoint"""
        response = api_client.get("/service/status")
        
        assert response.status_code == 200
        data = response.json()
        assert "is_running" in data
        assert "processed_count" in data
        assert "error_count" in data

class TestEmailEndpoints:
    """Test email-related endpoints"""
    
    def test_get_emails(self, api_client, db_session):
        """Test get emails endpoint"""
        # Create test emails
        email1 = create_test_email(db_session, subject="Test Email 1")
        email2 = create_test_email(db_session, subject="Test Email 2", is_medical_referral=True)
        
        response = api_client.get("/emails")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
    
    def test_get_emails_with_filters(self, api_client, db_session):
        """Test get emails with filtering"""
        # Create test emails with different statuses
        email1 = create_test_email(db_session, processing_status="pending")
        email2 = create_test_email(db_session, processing_status="completed")
        email3 = create_test_email(db_session, is_medical_referral=True)
        
        # Test status filter
        response = api_client.get("/emails?status=pending")
        assert response.status_code == 200
        data = response.json()
        assert all(email["processing_status"] == "pending" for email in data)
        
        # Test referral filter
        response = api_client.get("/emails?is_referral=true")
        assert response.status_code == 200
        data = response.json()
        assert all(email["is_medical_referral"] is True for email in data)
    
    def test_get_emails_with_date_range(self, api_client, db_session):
        """Test get emails with date range filter"""
        # Create emails with different dates
        today = datetime.now().date()
        yesterday = today - timedelta(days=1)
        
        email1 = create_test_email(db_session, date_received=datetime.combine(today, datetime.min.time()))
        email2 = create_test_email(db_session, date_received=datetime.combine(yesterday, datetime.min.time()))
        
        # Test date range filter
        response = api_client.get(f"/emails?start_date={today}&end_date={today}")
        assert response.status_code == 200
        data = response.json()
        
        # Should only return today's emails
        for email in data:
            email_date = datetime.fromisoformat(email["date_received"]).date()
            assert email_date == today
    
    def test_get_email_details(self, api_client, db_session):
        """Test get email details endpoint"""
        # Create test email
        email = create_test_email(db_session, subject="Detailed Email Test")
        
        response = api_client.get(f"/emails/{email.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "attachments" in data
        assert data["email"]["id"] == email.id
        assert data["email"]["subject"] == "Detailed Email Test"
    
    def test_get_email_details_not_found(self, api_client):
        """Test get email details for non-existent email"""
        response = api_client.get("/emails/99999")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

class TestPatientEndpoints:
    """Test patient-related endpoints"""
    
    def test_get_patients(self, api_client, db_session):
        """Test get patients endpoint"""
        # Create test patients
        patient1 = create_test_patient(db_session, full_name="Juan Pérez")
        patient2 = create_test_patient(db_session, full_name="María García")
        
        response = api_client.get("/patients")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
    
    def test_search_patients(self, api_client, db_session):
        """Test patient search functionality"""
        # Create test patients
        patient1 = create_test_patient(db_session, full_name="Juan Pérez", document_number="12345678")
        patient2 = create_test_patient(db_session, full_name="María García", document_number="87654321")
        
        # Search by name
        response = api_client.get("/patients?search=Juan")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any("Juan" in patient["full_name"] for patient in data)
        
        # Search by document
        response = api_client.get("/patients?search=12345678")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(patient["document_number"] == "12345678" for patient in data)
    
    def test_get_patient_details(self, api_client, db_session):
        """Test get patient details endpoint"""
        # Create test patient
        patient = create_test_patient(db_session, full_name="Test Patient")
        
        # Create related referral
        email = create_test_email(db_session)
        referral = create_test_referral(db_session, email_id=email.id, patient_id=patient.id)
        
        response = api_client.get(f"/patients/{patient.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert "patient" in data
        assert "referrals" in data
        assert data["patient"]["id"] == patient.id
        assert len(data["referrals"]) >= 1
    
    def test_get_patient_details_not_found(self, api_client):
        """Test get patient details for non-existent patient"""
        response = api_client.get("/patients/99999")
        
        assert response.status_code == 404

class TestReferralEndpoints:
    """Test referral-related endpoints"""
    
    def test_get_referrals(self, api_client, db_session):
        """Test get referrals endpoint"""
        # Create test referrals
        email = create_test_email(db_session)
        referral1 = create_test_referral(db_session, email_id=email.id, specialty_requested="cardiologia")
        referral2 = create_test_referral(db_session, email_id=email.id, specialty_requested="neurologia")
        
        response = api_client.get("/referrals")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2
    
    def test_get_referrals_with_filters(self, api_client, db_session):
        """Test get referrals with filtering"""
        # Create test referrals with different attributes
        email = create_test_email(db_session)
        referral1 = create_test_referral(
            db_session, 
            email_id=email.id, 
            status="pending", 
            specialty_requested="cardiologia",
            priority_level="alta"
        )
        referral2 = create_test_referral(
            db_session, 
            email_id=email.id, 
            status="completed", 
            specialty_requested="neurologia",
            priority_level="media"
        )
        
        # Test status filter
        response = api_client.get("/referrals?status=pending")
        assert response.status_code == 200
        data = response.json()
        assert all(ref["status"] == "pending" for ref in data)
        
        # Test specialty filter
        response = api_client.get("/referrals?specialty=cardiologia")
        assert response.status_code == 200
        data = response.json()
        assert all(ref["specialty_requested"] == "cardiologia" for ref in data)
        
        # Test priority filter
        response = api_client.get("/referrals?priority=alta")
        assert response.status_code == 200
        data = response.json()
        assert all(ref["priority_level"] == "alta" for ref in data)
    
    def test_update_referral(self, api_client, db_session):
        """Test update referral endpoint"""
        # Create test referral
        email = create_test_email(db_session)
        referral = create_test_referral(db_session, email_id=email.id, status="pending")
        
        # Update referral
        update_data = {
            "status": "in_review",
            "notes": "Under review by cardiologist",
            "assigned_to": "Dr. Rodriguez"
        }
        
        response = api_client.put(f"/referrals/{referral.id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        
        # Verify update in database
        db_session.refresh(referral)
        assert referral.status == "in_review"
    
    def test_update_referral_not_found(self, api_client):
        """Test update non-existent referral"""
        update_data = {"status": "completed"}
        
        response = api_client.put("/referrals/99999", json=update_data)
        
        assert response.status_code == 404

class TestServiceManagementEndpoints:
    """Test service management endpoints"""
    
    def test_manual_sync(self, api_client):
        """Test manual sync endpoint"""
        response = api_client.post("/service/sync")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data

class TestStatisticsEndpoints:
    """Test statistics endpoints"""
    
    def test_get_statistics(self, api_client, db_session):
        """Test get statistics endpoint"""
        # Create test data
        email1 = create_test_email(db_session, processing_status="completed", is_medical_referral=True)
        email2 = create_test_email(db_session, processing_status="pending")
        patient = create_test_patient(db_session)
        referral = create_test_referral(db_session, email_id=email1.id, status="pending")
        
        response = api_client.get("/statistics")
        
        assert response.status_code == 200
        data = response.json()
        assert "emails" in data
        assert "patients" in data
        assert "referrals" in data
        assert "service" in data
        
        # Verify statistics structure
        assert "total" in data["emails"]
        assert "pending" in data["emails"]
        assert "medical_referrals" in data["emails"]
        assert "total" in data["patients"]
        assert "total" in data["referrals"]
        assert "pending" in data["referrals"]

class TestAPIErrorHandling:
    """Test API error handling"""
    
    def test_invalid_endpoint(self, api_client):
        """Test invalid endpoint returns 404"""
        response = api_client.get("/invalid/endpoint")
        
        assert response.status_code == 404
    
    def test_invalid_method(self, api_client):
        """Test invalid HTTP method"""
        response = api_client.delete("/emails")  # DELETE not allowed
        
        assert response.status_code == 405
    
    def test_invalid_json_data(self, api_client, db_session):
        """Test invalid JSON data in request"""
        email = create_test_email(db_session)
        
        # Send invalid JSON
        response = api_client.put(
            f"/referrals/{email.id}",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422

class TestAPIPerformance:
    """Test API performance"""
    
    def test_large_dataset_performance(self, api_client, db_session):
        """Test API performance with large dataset"""
        # Create many test records
        emails = []
        for i in range(50):
            email = create_test_email(db_session, subject=f"Test Email {i}")
            emails.append(email)
        
        # Test response time
        import time
        start_time = time.time()
        response = api_client.get("/emails?limit=50")
        response_time = time.time() - start_time
        
        assert response.status_code == 200
        assert response_time < 5.0  # Should respond within 5 seconds
        
        data = response.json()
        assert len(data) <= 50  # Respects limit
    
    def test_pagination_performance(self, api_client, db_session):
        """Test pagination performance"""
        # Create test data
        for i in range(20):
            create_test_email(db_session, subject=f"Email {i}")
        
        # Test different page sizes
        for limit in [5, 10, 20]:
            response = api_client.get(f"/emails?limit={limit}")
            assert response.status_code == 200
            data = response.json()
            assert len(data) <= limit

class TestAPIAuthentication:
    """Test API authentication (if implemented)"""
    
    @pytest.mark.skip(reason="Authentication not yet implemented")
    def test_protected_endpoint_without_auth(self, api_client):
        """Test protected endpoint without authentication"""
        # This would test authentication when implemented
        pass
    
    @pytest.mark.skip(reason="Authentication not yet implemented")
    def test_protected_endpoint_with_invalid_token(self, api_client):
        """Test protected endpoint with invalid token"""
        # This would test invalid token handling when implemented
        pass

class TestAPIIntegration:
    """Integration tests for API"""
    
    def test_complete_workflow_via_api(self, api_client, db_session):
        """Test complete workflow through API endpoints"""
        # 1. Create test data
        email = create_test_email(db_session, is_medical_referral=True)
        patient = create_test_patient(db_session)
        referral = create_test_referral(db_session, email_id=email.id, patient_id=patient.id)
        
        # 2. Get emails
        response = api_client.get("/emails")
        assert response.status_code == 200
        emails_data = response.json()
        assert len(emails_data) >= 1
        
        # 3. Get email details
        response = api_client.get(f"/emails/{email.id}")
        assert response.status_code == 200
        email_details = response.json()
        assert email_details["email"]["id"] == email.id
        
        # 4. Get referrals
        response = api_client.get("/referrals")
        assert response.status_code == 200
        referrals_data = response.json()
        assert len(referrals_data) >= 1
        
        # 5. Update referral
        update_data = {"status": "in_review", "notes": "Processing"}
        response = api_client.put(f"/referrals/{referral.id}", json=update_data)
        assert response.status_code == 200
        
        # 6. Get statistics
        response = api_client.get("/statistics")
        assert response.status_code == 200
        stats = response.json()
        assert stats["emails"]["total"] >= 1
        assert stats["referrals"]["total"] >= 1
