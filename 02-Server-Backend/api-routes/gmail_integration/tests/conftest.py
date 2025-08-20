"""
Test Configuration and Fixtures for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import pytest
import asyncio
import tempfile
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import Mock, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import application modules
from database import DatabaseManager
from models import Base, EmailMessage, EmailAttachment, PatientRecord, MedicalReferral
from gmail_client import GmailClient
from email_processor import EmailProcessor
from medical_classifier import MedicalClassifier
from text_extractor import TextExtractor
from advanced_nlp import AdvancedMedicalNLP

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_database():
    """Create a test database for the session"""
    # Use in-memory SQLite for testing
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    yield SessionLocal, engine
    
    # Cleanup
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(test_database):
    """Create a database session for each test"""
    SessionLocal, engine = test_database
    session = SessionLocal()
    
    yield session
    
    session.rollback()
    session.close()

@pytest.fixture
def temp_directory():
    """Create a temporary directory for test files"""
    temp_dir = Path(tempfile.mkdtemp())
    yield temp_dir
    shutil.rmtree(temp_dir)

@pytest.fixture
def mock_gmail_client():
    """Mock Gmail client for testing"""
    client = Mock(spec=GmailClient)
    client.authenticate.return_value = True
    client.service = Mock()
    
    # Mock message data
    client.get_messages.return_value = [
        {"id": "test_message_1"},
        {"id": "test_message_2"}
    ]
    
    client.get_message_details.return_value = {
        "id": "test_message_1",
        "threadId": "test_thread_1",
        "payload": {
            "headers": [
                {"name": "Subject", "value": "Referencia médica urgente"},
                {"name": "From", "value": "Dr. Martinez <martinez@hospital.com>"},
                {"name": "To", "value": "referrals@vital-red.com"},
                {"name": "Date", "value": "Mon, 1 Jan 2024 10:00:00 +0000"}
            ],
            "body": {"data": "VGVzdCBlbWFpbCBib2R5"}  # Base64 encoded "Test email body"
        }
    }
    
    client.parse_message.return_value = {
        "gmail_id": "test_message_1",
        "thread_id": "test_thread_1",
        "subject": "Referencia médica urgente",
        "sender_email": "martinez@hospital.com",
        "sender_name": "Dr. Martinez",
        "recipient_email": "referrals@vital-red.com",
        "date_received": datetime.now(),
        "body_text": "Paciente Juan Pérez, CC 12345678, requiere interconsulta cardiología",
        "body_html": "",
        "snippet": "Paciente Juan Pérez...",
        "attachments": []
    }
    
    return client

@pytest.fixture
def sample_email_data():
    """Sample email data for testing"""
    return {
        "gmail_id": "test_email_123",
        "thread_id": "test_thread_123",
        "subject": "Referencia médica - Cardiología",
        "sender_email": "dr.martinez@hospital.com",
        "sender_name": "Dr. Carlos Martinez",
        "recipient_email": "referrals@vital-red.com",
        "date_received": datetime.now(),
        "body_text": """
        Paciente: Juan Pérez García
        Cédula: 12345678
        Edad: 45 años
        
        Diagnóstico: Hipertensión arterial
        Motivo de referencia: Valoración por cardiología para manejo de hipertensión refractaria
        
        Dr. Carlos Martinez
        Medicina Interna
        Hospital San José
        """,
        "body_html": "",
        "snippet": "Paciente Juan Pérez García...",
        "processing_status": "pending"
    }

@pytest.fixture
def sample_medical_text():
    """Sample medical text for NLP testing"""
    return """
    EPICRISIS MÉDICA
    
    Paciente: María González López
    Documento: 87654321
    Edad: 32 años
    Sexo: Femenino
    
    DIAGNÓSTICO PRINCIPAL: Diabetes Mellitus Tipo 2
    DIAGNÓSTICOS SECUNDARIOS: Hipertensión arterial, Obesidad
    
    MOTIVO DE CONSULTA: Control de diabetes y ajuste de tratamiento
    
    ANTECEDENTES:
    - Diabetes diagnosticada hace 2 años
    - Hipertensión arterial en tratamiento
    - Madre diabética
    
    EXAMEN FÍSICO:
    - Presión arterial: 140/90 mmHg
    - Frecuencia cardíaca: 80 lpm
    - Peso: 85 kg, Talla: 1.60 m, IMC: 33.2
    
    LABORATORIOS:
    - Glucosa: 180 mg/dl
    - HbA1c: 8.5%
    - Creatinina: 1.0 mg/dl
    
    TRATAMIENTO:
    - Metformina 850 mg cada 12 horas
    - Enalapril 10 mg cada 24 horas
    - Dieta hipocalórica
    
    PLAN:
    - Control en 3 meses
    - Interconsulta endocrinología
    - Educación diabetológica
    
    Dr. Ana Rodríguez
    Medicina Interna
    """

@pytest.fixture
def sample_attachment_data():
    """Sample attachment data for testing"""
    return {
        "filename": "laboratorio_paciente.pdf",
        "mime_type": "application/pdf",
        "file_size": 1024000,
        "attachment_id": "test_attachment_123"
    }

@pytest.fixture
def mock_text_extractor():
    """Mock text extractor for testing"""
    extractor = Mock(spec=TextExtractor)
    extractor.extract_text.return_value = "Extracted text from document"
    extractor.get_extraction_confidence.return_value = 0.95
    extractor.is_supported_format.return_value = True
    return extractor

@pytest.fixture
def mock_medical_classifier():
    """Mock medical classifier for testing"""
    classifier = Mock(spec=MedicalClassifier)
    classifier.classify_referral.return_value = (True, "interconsulta", "alta")
    classifier.classify_document_type.return_value = "epicrisis"
    classifier.extract_medical_entities.return_value = []
    classifier.classify_urgency_level.return_value = ("alta", 0.9)
    return classifier

@pytest.fixture
def mock_advanced_nlp():
    """Mock advanced NLP processor for testing"""
    nlp = Mock(spec=AdvancedMedicalNLP)
    nlp.process_medical_document.return_value = {
        "document_type": "epicrisis",
        "urgency_level": "alta",
        "patient_info": {
            "name": "Juan Pérez",
            "document_id": "12345678",
            "age": 45
        },
        "medical_info": {
            "primary_diagnosis": "Hipertensión arterial",
            "medications": ["Enalapril 10mg"]
        },
        "referral_info": {
            "specialty": "cardiologia",
            "reason": "Valoración hipertensión refractaria"
        },
        "processing_metadata": {
            "confidence_score": 0.85
        }
    }
    return nlp

@pytest.fixture
def email_processor(db_session, temp_directory, mock_text_extractor, mock_medical_classifier):
    """Create email processor instance for testing"""
    processor = EmailProcessor(db_session, temp_directory)
    processor.text_extractor = mock_text_extractor
    processor.medical_classifier = mock_medical_classifier
    return processor

@pytest.fixture
def sample_patient_data():
    """Sample patient data for testing"""
    return {
        "document_number": "12345678",
        "document_type": "CC",
        "full_name": "Juan Pérez García",
        "first_name": "Juan",
        "last_name": "Pérez García",
        "age": 45,
        "gender": "M",
        "phone": "3001234567",
        "insurance_provider": "EPS Sanitas",
        "insurance_id": "12345678",
        "insurance_type": "contributivo"
    }

@pytest.fixture
def sample_referral_data():
    """Sample referral data for testing"""
    return {
        "referral_number": "REF-2024-001",
        "referral_type": "interconsulta",
        "specialty_requested": "cardiologia",
        "priority_level": "alta",
        "primary_diagnosis": "Hipertensión arterial",
        "clinical_summary": "Paciente con hipertensión refractaria",
        "reason_for_referral": "Valoración especializada",
        "referring_hospital": "Hospital San José",
        "referring_physician": "Dr. Carlos Martinez",
        "referral_date": datetime.now(),
        "status": "pending"
    }

@pytest.fixture
def api_client():
    """Create test client for API testing"""
    from fastapi.testclient import TestClient
    from api import app
    
    return TestClient(app)

# Test data generators
def create_test_email(db_session, **kwargs):
    """Create a test email record"""
    default_data = {
        "gmail_id": f"test_email_{datetime.now().timestamp()}",
        "thread_id": "test_thread",
        "subject": "Test Email",
        "sender_email": "test@example.com",
        "sender_name": "Test Sender",
        "recipient_email": "recipient@example.com",
        "date_received": datetime.now(),
        "body_text": "Test email body",
        "processing_status": "pending"
    }
    default_data.update(kwargs)
    
    email = EmailMessage(**default_data)
    db_session.add(email)
    db_session.commit()
    db_session.refresh(email)
    return email

def create_test_patient(db_session, **kwargs):
    """Create a test patient record"""
    default_data = {
        "document_number": f"test_doc_{datetime.now().timestamp()}",
        "full_name": "Test Patient",
        "age": 30
    }
    default_data.update(kwargs)
    
    patient = PatientRecord(**default_data)
    db_session.add(patient)
    db_session.commit()
    db_session.refresh(patient)
    return patient

def create_test_referral(db_session, email_id=None, patient_id=None, **kwargs):
    """Create a test referral record"""
    default_data = {
        "referral_number": f"REF-TEST-{datetime.now().timestamp()}",
        "referral_type": "interconsulta",
        "specialty_requested": "medicina_general",
        "priority_level": "media",
        "referral_date": datetime.now(),
        "status": "pending"
    }
    default_data.update(kwargs)
    
    if email_id:
        default_data["email_message_id"] = email_id
    if patient_id:
        default_data["patient_record_id"] = patient_id
    
    referral = MedicalReferral(**default_data)
    db_session.add(referral)
    db_session.commit()
    db_session.refresh(referral)
    return referral

# Utility functions for tests
def assert_email_processed_correctly(email, expected_status="completed"):
    """Assert that email was processed correctly"""
    assert email.processing_status == expected_status
    if expected_status == "completed":
        assert email.date_processed is not None

def assert_patient_data_extracted(patient, expected_name=None, expected_document=None):
    """Assert that patient data was extracted correctly"""
    if expected_name:
        assert patient.full_name == expected_name
    if expected_document:
        assert patient.document_number == expected_document

def assert_referral_created(referral, expected_specialty=None, expected_priority=None):
    """Assert that referral was created correctly"""
    assert referral.status == "pending"
    if expected_specialty:
        assert referral.specialty_requested == expected_specialty
    if expected_priority:
        assert referral.priority_level == expected_priority

# Mock data for external services
@pytest.fixture
def mock_gmail_api_responses():
    """Mock responses from Gmail API"""
    return {
        "messages_list": {
            "messages": [
                {"id": "msg1", "threadId": "thread1"},
                {"id": "msg2", "threadId": "thread2"}
            ]
        },
        "message_detail": {
            "id": "msg1",
            "threadId": "thread1",
            "payload": {
                "headers": [
                    {"name": "Subject", "value": "Medical Referral"},
                    {"name": "From", "value": "doctor@hospital.com"},
                    {"name": "Date", "value": "Mon, 1 Jan 2024 10:00:00 +0000"}
                ],
                "body": {"data": "VGVzdCBtZXNzYWdl"}  # "Test message" in base64
            }
        }
    }

# Performance testing fixtures
@pytest.fixture
def performance_test_data():
    """Generate data for performance testing"""
    emails = []
    for i in range(100):
        emails.append({
            "gmail_id": f"perf_test_{i}",
            "subject": f"Test Email {i}",
            "sender_email": f"sender{i}@test.com",
            "body_text": f"Test email body {i} with medical content",
            "date_received": datetime.now() - timedelta(minutes=i)
        })
    return emails
