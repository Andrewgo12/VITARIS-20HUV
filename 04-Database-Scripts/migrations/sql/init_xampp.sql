-- VITAL RED Database Initialization for XAMPP MySQL
-- Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

-- Create database
CREATE DATABASE IF NOT EXISTS vital_red 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE vital_red;

-- Create email_messages table
CREATE TABLE IF NOT EXISTS email_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gmail_id VARCHAR(255) UNIQUE NOT NULL,
    thread_id VARCHAR(255),
    subject TEXT,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    recipient_email VARCHAR(255),
    date_received DATETIME NOT NULL,
    date_processed DATETIME,
    body_text LONGTEXT,
    body_html LONGTEXT,
    snippet TEXT,
    processing_status ENUM('pending', 'processing', 'processed', 'error', 'quarantined') DEFAULT 'pending',
    is_medical_referral BOOLEAN DEFAULT FALSE,
    referral_type ENUM('interconsulta', 'urgente', 'programada', 'seguimiento'),
    priority_level ENUM('baja', 'media', 'alta', 'critico') DEFAULT 'media',
    patient_data JSON,
    medical_data JSON,
    extracted_entities JSON,
    confidence_score DECIMAL(3,2),
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gmail_id (gmail_id),
    INDEX idx_sender_email (sender_email),
    INDEX idx_date_received (date_received),
    INDEX idx_processing_status (processing_status),
    INDEX idx_is_medical_referral (is_medical_referral),
    INDEX idx_priority_level (priority_level)
);

-- Create email_attachments table
CREATE TABLE IF NOT EXISTS email_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_message_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size BIGINT,
    file_path VARCHAR(500),
    attachment_id VARCHAR(255),
    document_type ENUM('epicrisis', 'laboratorio', 'imagen', 'receta', 'remision', 'consulta', 'procedimiento', 'alta'),
    extracted_text LONGTEXT,
    extraction_confidence DECIMAL(3,2),
    is_encrypted BOOLEAN DEFAULT FALSE,
    processing_status ENUM('pending', 'processing', 'processed', 'error', 'quarantined') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email_message_id) REFERENCES email_messages(id) ON DELETE CASCADE,
    INDEX idx_email_message_id (email_message_id),
    INDEX idx_document_type (document_type),
    INDEX idx_processing_status (processing_status)
);

-- Create patient_records table
CREATE TABLE IF NOT EXISTS patient_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_number VARCHAR(20) UNIQUE NOT NULL,
    document_type VARCHAR(10) DEFAULT 'CC',
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INT,
    gender ENUM('M', 'F', 'O'),
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    insurance_provider VARCHAR(100),
    insurance_id VARCHAR(50),
    insurance_type VARCHAR(50),
    emergency_contact JSON,
    medical_history JSON,
    allergies JSON,
    current_medications JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_document_number (document_number),
    INDEX idx_full_name (full_name),
    INDEX idx_is_active (is_active)
);

-- Create medical_referrals table
CREATE TABLE IF NOT EXISTS medical_referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referral_number VARCHAR(50) UNIQUE NOT NULL,
    email_message_id INT,
    patient_record_id INT,
    referral_type ENUM('interconsulta', 'urgente', 'programada', 'seguimiento') NOT NULL,
    specialty_requested VARCHAR(100) NOT NULL,
    priority_level ENUM('baja', 'media', 'alta', 'critico') DEFAULT 'media',
    status ENUM('pending', 'in_review', 'assigned', 'completed', 'cancelled', 'expired') DEFAULT 'pending',
    primary_diagnosis TEXT,
    secondary_diagnoses JSON,
    clinical_summary TEXT,
    reason_for_referral TEXT,
    current_medications JSON,
    relevant_history TEXT,
    vital_signs JSON,
    lab_results JSON,
    imaging_results JSON,
    referring_hospital VARCHAR(255),
    referring_physician VARCHAR(255),
    referring_department VARCHAR(100),
    assigned_to VARCHAR(255),
    assigned_at DATETIME,
    appointment_date DATETIME,
    appointment_location VARCHAR(255),
    referral_date DATETIME NOT NULL,
    response_date DATETIME,
    completion_date DATETIME,
    expiry_date DATETIME,
    notes TEXT,
    internal_notes TEXT,
    attachments_count INT DEFAULT 0,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email_message_id) REFERENCES email_messages(id) ON DELETE SET NULL,
    FOREIGN KEY (patient_record_id) REFERENCES patient_records(id) ON DELETE SET NULL,
    INDEX idx_referral_number (referral_number),
    INDEX idx_email_message_id (email_message_id),
    INDEX idx_patient_record_id (patient_record_id),
    INDEX idx_referral_type (referral_type),
    INDEX idx_specialty_requested (specialty_requested),
    INDEX idx_priority_level (priority_level),
    INDEX idx_status (status),
    INDEX idx_referral_date (referral_date)
);

-- Create processing_logs table
CREATE TABLE IF NOT EXISTS processing_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_message_id INT,
    step_name VARCHAR(100) NOT NULL,
    step_type ENUM('extraction', 'classification', 'validation', 'storage', 'notification') NOT NULL,
    status ENUM('started', 'completed', 'failed', 'skipped') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_ms INT,
    input_data JSON,
    output_data JSON,
    error_message TEXT,
    additional_metadata JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_message_id) REFERENCES email_messages(id) ON DELETE CASCADE,
    INDEX idx_email_message_id (email_message_id),
    INDEX idx_step_name (step_name),
    INDEX idx_step_type (step_type),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
);

-- Create system_alerts table
CREATE TABLE IF NOT EXISTS system_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    component VARCHAR(100),
    details JSON,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at DATETIME,
    resolved_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_alert_type (alert_type),
    INDEX idx_component (component),
    INDEX idx_is_resolved (is_resolved),
    INDEX idx_created_at (created_at)
);

-- Create performance_metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(20),
    component VARCHAR(100),
    timestamp DATETIME NOT NULL,
    additional_data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_name (metric_name),
    INDEX idx_component (component),
    INDEX idx_timestamp (timestamp)
);

-- Create backup_records table
CREATE TABLE IF NOT EXISTS backup_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_type ENUM('full', 'incremental', 'differential') NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    compression_type VARCHAR(20),
    encryption_enabled BOOLEAN DEFAULT FALSE,
    backup_status ENUM('in_progress', 'completed', 'failed') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_seconds INT,
    tables_included JSON,
    error_message TEXT,
    checksum VARCHAR(64),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_backup_type (backup_type),
    INDEX idx_backup_status (backup_status),
    INDEX idx_start_time (start_time)
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('medical_evaluator', 'administrator') NOT NULL,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- Create medical_cases table
CREATE TABLE IF NOT EXISTS medical_cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_document VARCHAR(20) NOT NULL,
    diagnosis TEXT NOT NULL,
    urgency ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    priority ENUM('baja', 'media', 'alta', 'critico') DEFAULT 'media',
    status ENUM('pending', 'in_review', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    submitted_date DATETIME NOT NULL,
    evaluator_id INT,
    notes TEXT,
    referral_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_records(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (referral_id) REFERENCES medical_referrals(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_urgency (urgency),
    INDEX idx_status (status),
    INDEX idx_submitted_date (submitted_date),
    INDEX idx_evaluator_id (evaluator_id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, name, password_hash, role, permissions, is_active) 
VALUES (
    'admin@hospital-ese.com', 
    'Administrador Sistema', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/..G', 
    'administrator',
    '["view_medical_cases", "edit_medical_cases", "approve_medical_cases", "reject_medical_cases", "view_users", "create_users", "edit_users", "delete_users", "view_dashboard", "view_reports", "manage_system", "view_gmail_integration", "configure_gmail"]',
    TRUE
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert default medical evaluator (password: evaluator123)
INSERT INTO users (email, name, password_hash, role, permissions, is_active) 
VALUES (
    'evaluador@hospital-ese.com', 
    'Dr. Evaluador Médico', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/..G', 
    'medical_evaluator',
    '["view_medical_cases", "edit_medical_cases", "approve_medical_cases", "reject_medical_cases", "view_dashboard"]',
    TRUE
) ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample patient records
INSERT INTO patient_records (document_number, document_type, full_name, first_name, last_name, age, gender, phone, email, insurance_provider, is_active) 
VALUES 
    ('12345678', 'CC', 'Juan Pérez García', 'Juan', 'Pérez García', 45, 'M', '3001234567', 'juan.perez@email.com', 'EPS Sura', TRUE),
    ('87654321', 'CC', 'María González López', 'María', 'González López', 32, 'F', '3009876543', 'maria.gonzalez@email.com', 'Nueva EPS', TRUE),
    ('11223344', 'CC', 'Carlos Rodríguez Martín', 'Carlos', 'Rodríguez Martín', 58, 'M', '3005566778', 'carlos.rodriguez@email.com', 'Compensar', TRUE)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Create indexes for better performance
CREATE INDEX idx_email_messages_composite ON email_messages(processing_status, is_medical_referral, date_received);
CREATE INDEX idx_medical_referrals_composite ON medical_referrals(status, priority_level, referral_date);
CREATE INDEX idx_patient_records_composite ON patient_records(document_number, is_active);

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE email_messages;
DESCRIBE medical_referrals;
DESCRIBE patient_records;
DESCRIBE users;
