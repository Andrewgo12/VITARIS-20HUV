-- Database Initialization Script for VITAL RED Gmail Integration
-- Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

-- Set timezone to Colombia
SET timezone = 'America/Bogota';

-- Create database if not exists (handled by Docker)
-- CREATE DATABASE IF NOT EXISTS vital_red;

-- Connect to the database
\c vital_red;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom types
CREATE TYPE email_status AS ENUM ('pending', 'processing', 'completed', 'error', 'quarantined');
CREATE TYPE referral_status AS ENUM ('pending', 'in_review', 'assigned', 'completed', 'cancelled', 'expired');
CREATE TYPE priority_level AS ENUM ('baja', 'media', 'alta', 'critico');
CREATE TYPE document_type AS ENUM ('epicrisis', 'laboratorio', 'imagen', 'receta', 'remision', 'consulta', 'procedimiento', 'alta');
CREATE TYPE referral_type AS ENUM ('interconsulta', 'urgente', 'programada', 'seguimiento');

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS referral_number_seq START 1;

-- Email Messages Table
CREATE TABLE IF NOT EXISTS email_messages (
    id SERIAL PRIMARY KEY,
    gmail_id VARCHAR(255) UNIQUE NOT NULL,
    thread_id VARCHAR(255),
    subject TEXT,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    recipient_email VARCHAR(255),
    date_received TIMESTAMP WITH TIME ZONE NOT NULL,
    date_processed TIMESTAMP WITH TIME ZONE,
    body_text TEXT,
    body_html TEXT,
    snippet TEXT,
    processing_status email_status DEFAULT 'pending',
    is_medical_referral BOOLEAN DEFAULT FALSE,
    referral_type referral_type,
    priority_level priority_level DEFAULT 'media',
    patient_data JSONB,
    medical_data JSONB,
    extracted_entities JSONB,
    confidence_score DECIMAL(3,2),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Attachments Table
CREATE TABLE IF NOT EXISTS email_attachments (
    id SERIAL PRIMARY KEY,
    email_message_id INTEGER REFERENCES email_messages(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size BIGINT,
    file_path TEXT,
    attachment_id VARCHAR(255),
    document_type document_type,
    extracted_text TEXT,
    extraction_confidence DECIMAL(3,2),
    is_encrypted BOOLEAN DEFAULT FALSE,
    processing_status email_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Patient Records Table
CREATE TABLE IF NOT EXISTS patient_records (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(20) UNIQUE NOT NULL,
    document_type VARCHAR(10) DEFAULT 'CC',
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(155),
    age INTEGER,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    insurance_provider VARCHAR(100),
    insurance_id VARCHAR(50),
    insurance_type VARCHAR(50),
    emergency_contact JSONB,
    medical_history JSONB,
    allergies TEXT[],
    current_medications TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Medical Referrals Table
CREATE TABLE IF NOT EXISTS medical_referrals (
    id SERIAL PRIMARY KEY,
    referral_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'REF-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('referral_number_seq')::TEXT, 6, '0'),
    email_message_id INTEGER REFERENCES email_messages(id),
    patient_record_id INTEGER REFERENCES patient_records(id),
    referral_type referral_type NOT NULL DEFAULT 'interconsulta',
    specialty_requested VARCHAR(100) NOT NULL,
    priority_level priority_level DEFAULT 'media',
    status referral_status DEFAULT 'pending',
    primary_diagnosis TEXT,
    secondary_diagnoses TEXT[],
    clinical_summary TEXT,
    reason_for_referral TEXT,
    current_medications TEXT[],
    relevant_history TEXT,
    vital_signs JSONB,
    lab_results JSONB,
    imaging_results JSONB,
    referring_hospital VARCHAR(255),
    referring_physician VARCHAR(255),
    referring_department VARCHAR(100),
    assigned_to VARCHAR(255),
    assigned_at TIMESTAMP WITH TIME ZONE,
    appointment_date TIMESTAMP WITH TIME ZONE,
    appointment_location VARCHAR(255),
    referral_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    internal_notes TEXT,
    attachments_count INTEGER DEFAULT 0,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Processing Logs Table
CREATE TABLE IF NOT EXISTS processing_logs (
    id SERIAL PRIMARY KEY,
    email_message_id INTEGER REFERENCES email_messages(id),
    step_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds DECIMAL(10,3),
    error_details JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(20),
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_messages_gmail_id ON email_messages(gmail_id);
CREATE INDEX IF NOT EXISTS idx_email_messages_status ON email_messages(processing_status);
CREATE INDEX IF NOT EXISTS idx_email_messages_date_received ON email_messages(date_received DESC);
CREATE INDEX IF NOT EXISTS idx_email_messages_is_medical ON email_messages(is_medical_referral);
CREATE INDEX IF NOT EXISTS idx_email_messages_priority ON email_messages(priority_level);

CREATE INDEX IF NOT EXISTS idx_email_attachments_email_id ON email_attachments(email_message_id);
CREATE INDEX IF NOT EXISTS idx_email_attachments_type ON email_attachments(document_type);

CREATE INDEX IF NOT EXISTS idx_patient_records_document ON patient_records(document_number);
CREATE INDEX IF NOT EXISTS idx_patient_records_name ON patient_records USING gin(to_tsvector('spanish', full_name));
CREATE INDEX IF NOT EXISTS idx_patient_records_active ON patient_records(is_active);

CREATE INDEX IF NOT EXISTS idx_medical_referrals_number ON medical_referrals(referral_number);
CREATE INDEX IF NOT EXISTS idx_medical_referrals_status ON medical_referrals(status);
CREATE INDEX IF NOT EXISTS idx_medical_referrals_specialty ON medical_referrals(specialty_requested);
CREATE INDEX IF NOT EXISTS idx_medical_referrals_priority ON medical_referrals(priority_level);
CREATE INDEX IF NOT EXISTS idx_medical_referrals_date ON medical_referrals(referral_date DESC);
CREATE INDEX IF NOT EXISTS idx_medical_referrals_patient ON medical_referrals(patient_record_id);

CREATE INDEX IF NOT EXISTS idx_processing_logs_email_id ON processing_logs(email_message_id);
CREATE INDEX IF NOT EXISTS idx_processing_logs_step ON processing_logs(step_name);
CREATE INDEX IF NOT EXISTS idx_processing_logs_timestamp ON processing_logs(start_time DESC);

CREATE INDEX IF NOT EXISTS idx_system_metrics_name ON system_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_email_messages_fts ON email_messages USING gin(to_tsvector('spanish', coalesce(subject, '') || ' ' || coalesce(body_text, '')));
CREATE INDEX IF NOT EXISTS idx_medical_referrals_fts ON medical_referrals USING gin(to_tsvector('spanish', coalesce(clinical_summary, '') || ' ' || coalesce(reason_for_referral, '')));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_email_messages_updated_at BEFORE UPDATE ON email_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_attachments_updated_at BEFORE UPDATE ON email_attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patient_records_updated_at BEFORE UPDATE ON patient_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_referrals_updated_at BEFORE UPDATE ON medical_referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW v_pending_referrals AS
SELECT 
    mr.*,
    pr.full_name as patient_name,
    pr.document_number as patient_document,
    em.subject as email_subject,
    em.sender_name as referring_doctor
FROM medical_referrals mr
LEFT JOIN patient_records pr ON mr.patient_record_id = pr.id
LEFT JOIN email_messages em ON mr.email_message_id = em.id
WHERE mr.status = 'pending'
ORDER BY mr.priority_level DESC, mr.referral_date ASC;

CREATE OR REPLACE VIEW v_recent_emails AS
SELECT 
    em.*,
    COUNT(ea.id) as attachments_count,
    mr.referral_number
FROM email_messages em
LEFT JOIN email_attachments ea ON em.id = ea.email_message_id
LEFT JOIN medical_referrals mr ON em.id = mr.email_message_id
WHERE em.date_received >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY em.id, mr.referral_number
ORDER BY em.date_received DESC;

-- Insert initial data
INSERT INTO system_metrics (metric_name, metric_value, metric_unit) VALUES
('system_initialized', 1, 'boolean'),
('database_version', 1.0, 'version')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vital_red_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vital_red_user;

-- Database initialization complete
SELECT 'VITAL RED Gmail Integration Database Initialized Successfully' as status;
