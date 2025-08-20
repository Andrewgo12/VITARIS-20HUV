#!/usr/bin/env python3
"""
Create missing tables for VITAL RED
"""

import mysql.connector
from mysql.connector import Error

def create_missing_tables():
    """Create missing tables in the database"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create system_alerts table
            cursor.execute("""
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
                )
            """)
            print("✅ Tabla system_alerts creada")
            
            # Create performance_metrics table
            cursor.execute("""
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
                )
            """)
            print("✅ Tabla performance_metrics creada")
            
            # Create backup_records table
            cursor.execute("""
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
                )
            """)
            print("✅ Tabla backup_records creada")
            
            # Create users table
            cursor.execute("""
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
                )
            """)
            print("✅ Tabla users creada")
            
            # Create medical_cases table
            cursor.execute("""
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
                )
            """)
            print("✅ Tabla medical_cases creada")
            
            # Insert default users
            cursor.execute("""
                INSERT INTO users (email, name, password_hash, role, permissions, is_active) 
                VALUES (
                    'admin@hospital-ese.com', 
                    'Administrador Sistema', 
                    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/..G', 
                    'administrator',
                    '["view_medical_cases", "edit_medical_cases", "approve_medical_cases", "reject_medical_cases", "view_users", "create_users", "edit_users", "delete_users", "view_dashboard", "view_reports", "manage_system", "view_gmail_integration", "configure_gmail"]',
                    TRUE
                ) ON DUPLICATE KEY UPDATE name = VALUES(name)
            """)
            
            cursor.execute("""
                INSERT INTO users (email, name, password_hash, role, permissions, is_active) 
                VALUES (
                    'evaluador@hospital-ese.com', 
                    'Dr. Evaluador Médico', 
                    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/..G', 
                    'medical_evaluator',
                    '["view_medical_cases", "edit_medical_cases", "approve_medical_cases", "reject_medical_cases", "view_dashboard"]',
                    TRUE
                ) ON DUPLICATE KEY UPDATE name = VALUES(name)
            """)
            print("✅ Usuarios por defecto creados")
            
            connection.commit()
            cursor.close()
            connection.close()
            
            print("✅ Todas las tablas faltantes han sido creadas exitosamente")
            return True
            
    except Error as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    create_missing_tables()
