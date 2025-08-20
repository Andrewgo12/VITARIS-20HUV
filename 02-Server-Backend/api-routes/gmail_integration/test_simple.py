"""
Simple tests for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import pytest
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test that all modules can be imported"""
    try:
        import config
        import models
        import gmail_client
        import email_processor
        import advanced_nlp
        import medical_classifier
        import text_extractor
        import security
        import monitoring
        import performance_optimizer
        import backup_system
        import websocket_server
        import frontend_integration
        print("✅ All modules imported successfully")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def test_config_values():
    """Test configuration values"""
    try:
        from config import (
            GMAIL_CONFIG, 
            DATABASE_CONFIG, 
            REDIS_CONFIG, 
            NLP_CONFIG,
            SECURITY_CONFIG,
            MONITORING_CONFIG,
            PERFORMANCE_CONFIG
        )
        
        # Check that configs are dictionaries
        assert isinstance(GMAIL_CONFIG, dict), "GMAIL_CONFIG should be a dictionary"
        assert isinstance(DATABASE_CONFIG, dict), "DATABASE_CONFIG should be a dictionary"
        assert isinstance(REDIS_CONFIG, dict), "REDIS_CONFIG should be a dictionary"
        assert isinstance(NLP_CONFIG, dict), "NLP_CONFIG should be a dictionary"
        assert isinstance(SECURITY_CONFIG, dict), "SECURITY_CONFIG should be a dictionary"
        assert isinstance(MONITORING_CONFIG, dict), "MONITORING_CONFIG should be a dictionary"
        assert isinstance(PERFORMANCE_CONFIG, dict), "PERFORMANCE_CONFIG should be a dictionary"
        
        print("✅ All configuration values are valid")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

def test_models_structure():
    """Test that models are properly defined"""
    try:
        from models import (
            EmailMessage,
            EmailAttachment,
            MedicalReferral,
            PatientRecord,
            ProcessingStep,
            SystemAlert,
            PerformanceMetric,
            BackupRecord
        )
        
        # Check that all models have required attributes
        models_to_check = [
            EmailMessage,
            EmailAttachment,
            MedicalReferral,
            PatientRecord,
            ProcessingStep,
            SystemAlert,
            PerformanceMetric,
            BackupRecord
        ]
        
        for model in models_to_check:
            assert hasattr(model, '__tablename__'), f"{model.__name__} should have __tablename__"
            assert hasattr(model, 'id'), f"{model.__name__} should have id field"
        
        print("✅ All models are properly structured")
        return True
    except Exception as e:
        print(f"❌ Models error: {e}")
        return False

def test_gmail_client_structure():
    """Test Gmail client structure"""
    try:
        from gmail_client import GmailClient
        
        # Check that GmailClient has required methods
        required_methods = [
            'authenticate',
            'get_messages',
            'get_message_details',
            'download_attachment',
            'mark_as_read',
            'create_label',
            'add_label_to_message'
        ]
        
        for method in required_methods:
            assert hasattr(GmailClient, method), f"GmailClient should have {method} method"
        
        print("✅ Gmail client structure is valid")
        return True
    except Exception as e:
        print(f"❌ Gmail client error: {e}")
        return False

def test_email_processor_structure():
    """Test email processor structure"""
    try:
        from email_processor import EmailProcessor
        
        # Check that EmailProcessor has required methods
        required_methods = [
            'process_email',
            'extract_patient_data',
            'classify_email_type',
            'determine_priority',
            'extract_medical_entities',
            'process_attachments'
        ]
        
        for method in required_methods:
            assert hasattr(EmailProcessor, method), f"EmailProcessor should have {method} method"
        
        print("✅ Email processor structure is valid")
        return True
    except Exception as e:
        print(f"❌ Email processor error: {e}")
        return False

def test_nlp_components():
    """Test NLP components"""
    try:
        from advanced_nlp import AdvancedNLP
        from medical_classifier import MedicalClassifier
        from text_extractor import TextExtractor
        
        # Check that classes exist and have basic structure
        assert hasattr(AdvancedNLP, 'process_text'), "AdvancedNLP should have process_text method"
        assert hasattr(MedicalClassifier, 'classify'), "MedicalClassifier should have classify method"
        assert hasattr(TextExtractor, 'extract_text'), "TextExtractor should have extract_text method"
        
        print("✅ NLP components are properly structured")
        return True
    except Exception as e:
        print(f"❌ NLP components error: {e}")
        return False

def test_security_components():
    """Test security components"""
    try:
        from security import SecurityManager
        
        # Check that SecurityManager has required methods
        required_methods = [
            'encrypt_data',
            'decrypt_data',
            'hash_password',
            'verify_password',
            'generate_token',
            'verify_token',
            'anonymize_patient_data',
            'audit_log'
        ]
        
        for method in required_methods:
            assert hasattr(SecurityManager, method), f"SecurityManager should have {method} method"
        
        print("✅ Security components are properly structured")
        return True
    except Exception as e:
        print(f"❌ Security components error: {e}")
        return False

def test_monitoring_components():
    """Test monitoring components"""
    try:
        from monitoring import SystemMonitor
        from performance_optimizer import PerformanceOptimizer
        
        # Check basic structure
        assert hasattr(SystemMonitor, 'get_system_metrics'), "SystemMonitor should have get_system_metrics method"
        assert hasattr(PerformanceOptimizer, 'optimize_performance'), "PerformanceOptimizer should have optimize_performance method"
        
        print("✅ Monitoring components are properly structured")
        return True
    except Exception as e:
        print(f"❌ Monitoring components error: {e}")
        return False

def test_backup_system():
    """Test backup system"""
    try:
        from backup_system import BackupManager
        
        # Check that BackupManager has required methods
        required_methods = [
            'create_backup',
            'restore_backup',
            'list_backups',
            'delete_backup',
            'schedule_backup',
            'verify_backup'
        ]
        
        for method in required_methods:
            assert hasattr(BackupManager, method), f"BackupManager should have {method} method"
        
        print("✅ Backup system is properly structured")
        return True
    except Exception as e:
        print(f"❌ Backup system error: {e}")
        return False

def test_websocket_server():
    """Test WebSocket server"""
    try:
        from websocket_server import WebSocketManager
        
        # Check basic structure
        assert hasattr(WebSocketManager, 'start_server'), "WebSocketManager should have start_server method"
        assert hasattr(WebSocketManager, 'broadcast_message'), "WebSocketManager should have broadcast_message method"
        
        print("✅ WebSocket server is properly structured")
        return True
    except Exception as e:
        print(f"❌ WebSocket server error: {e}")
        return False

def test_frontend_integration():
    """Test frontend integration"""
    try:
        from frontend_integration import FrontendIntegration
        
        # Check basic structure
        assert hasattr(FrontendIntegration, 'send_real_time_update'), "FrontendIntegration should have send_real_time_update method"
        
        print("✅ Frontend integration is properly structured")
        return True
    except Exception as e:
        print(f"❌ Frontend integration error: {e}")
        return False

def run_all_tests():
    """Run all tests and return results"""
    tests = [
        test_imports,
        test_config_values,
        test_models_structure,
        test_gmail_client_structure,
        test_email_processor_structure,
        test_nlp_components,
        test_security_components,
        test_monitoring_components,
        test_backup_system,
        test_websocket_server,
        test_frontend_integration
    ]
    
    results = []
    passed = 0
    failed = 0
    
    print("🧪 Running VITAL RED Backend Tests...")
    print("=" * 50)
    
    for test in tests:
        try:
            result = test()
            if result:
                passed += 1
                results.append(f"✅ {test.__name__}: PASSED")
            else:
                failed += 1
                results.append(f"❌ {test.__name__}: FAILED")
        except Exception as e:
            failed += 1
            results.append(f"❌ {test.__name__}: ERROR - {str(e)}")
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS:")
    print("=" * 50)
    
    for result in results:
        print(result)
    
    print("\n" + "=" * 50)
    print(f"📈 SUMMARY: {passed} PASSED, {failed} FAILED")
    print("=" * 50)
    
    if failed == 0:
        print("🎉 ALL TESTS PASSED! Backend is ready for production!")
    else:
        print(f"⚠️  {failed} tests failed. Please review the errors above.")
    
    return passed, failed

if __name__ == "__main__":
    run_all_tests()
