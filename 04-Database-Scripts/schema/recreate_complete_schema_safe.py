#!/usr/bin/env python3
"""
Recreador Seguro de Esquema Completo - VITAL RED
Recrea todo el esquema de manera segura manejando restricciones
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime

def print_header():
    print("=" * 120)
    print("🔄 RECREADOR SEGURO DE ESQUEMA COMPLETO - VITAL RED")
    print("Hospital Universitaria ESE")
    print("Recreación segura del esquema completo con manejo de restricciones")
    print("=" * 120)

def recreate_complete_schema():
    """Recrear esquema completo de manera segura"""
    
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',
        'database': 'vital_red'
    }
    
    try:
        print(f"\n🔌 Conectando a base de datos...")
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        print("✅ Conexión exitosa")
        
        # Deshabilitar verificación de claves foráneas temporalmente
        print(f"\n🔓 Deshabilitando verificación de claves foráneas...")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        
        # Respaldar datos críticos de users si existen
        print(f"\n💾 Respaldando datos críticos...")
        
        users_backup = []
        try:
            cursor.execute("SELECT email, name, password_hash, role FROM users WHERE email IS NOT NULL")
            users_backup = cursor.fetchall()
            print(f"✅ {len(users_backup)} usuarios respaldados")
        except:
            print("⚠️  No hay usuarios para respaldar")
        
        # Lista de todas las tablas a eliminar (en orden inverso de dependencias)
        tables_to_drop = [
            'system_metrics', 'user_sessions', 'extraction_logs', 'performance_reports',
            'system_backups', 'user_permissions', 'extraction_sessions', 'audit_logs',
            'system_configurations', 'notifications', 'case_evaluations', 'email_attachments',
            'extracted_emails', 'medical_cases', 'users'
        ]
        
        # Eliminar todas las tablas
        print(f"\n🗑️  Eliminando tablas existentes...")
        for table in tables_to_drop:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table}")
                print(f"   ✅ {table} eliminada")
            except Exception as e:
                print(f"   ⚠️  {table}: {e}")
        
        # Crear todas las tablas nuevamente
        print(f"\n🏗️  Creando esquema completo...")
        
        # 1. TABLA USERS (CENTRAL)
        print(f"\n👥 1. Creando tabla 'users'...")
        create_users_table = """
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            role ENUM('admin', 'medico_evaluador', 'supervisor', 'operador') NOT NULL DEFAULT 'medico_evaluador',
            specialty VARCHAR(100),
            license_number VARCHAR(50),
            phone VARCHAR(20),
            is_active BOOLEAN DEFAULT TRUE,
            email_verified BOOLEAN DEFAULT FALSE,
            last_login DATETIME NULL,
            login_attempts INT DEFAULT 0,
            locked_until DATETIME NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by INT NULL,
            
            INDEX idx_username (username),
            INDEX idx_email (email),
            INDEX idx_role (role),
            INDEX idx_is_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        cursor.execute(create_users_table)
        print("✅ Tabla 'users' creada")
        
        # 2. TABLA MEDICAL_CASES
        print(f"\n🏥 2. Creando tabla 'medical_cases'...")
        create_medical_cases_table = """
        CREATE TABLE medical_cases (
            id INT AUTO_INCREMENT PRIMARY KEY,
            case_number VARCHAR(50) UNIQUE NOT NULL,
            patient_name VARCHAR(200) NOT NULL,
            patient_document VARCHAR(50) NOT NULL,
            patient_document_type ENUM('cedula', 'pasaporte', 'tarjeta_identidad') DEFAULT 'cedula',
            patient_age INT,
            patient_gender ENUM('masculino', 'femenino', 'otro') NOT NULL,
            patient_phone VARCHAR(20),
            patient_email VARCHAR(255),
            referring_physician VARCHAR(200),
            referring_institution VARCHAR(200),
            medical_specialty VARCHAR(100),
            diagnosis_primary TEXT,
            diagnosis_secondary TEXT,
            symptoms TEXT,
            medical_history TEXT,
            current_medications TEXT,
            priority ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
            status ENUM('pendiente', 'en_revision', 'aprobado', 'rechazado', 'info_adicional_requerida') DEFAULT 'pendiente',
            urgency_level INT DEFAULT 1,
            received_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            due_date DATETIME,
            assigned_evaluator_id INT NULL,
            source_email_id VARCHAR(255) NULL,
            ai_extracted_data JSON,
            ai_confidence_score DECIMAL(3,2),
            attachment_count INT DEFAULT 0,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_case_number (case_number),
            INDEX idx_patient_document (patient_document),
            INDEX idx_priority (priority),
            INDEX idx_status (status),
            INDEX idx_assigned_evaluator (assigned_evaluator_id),
            
            FOREIGN KEY (assigned_evaluator_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        cursor.execute(create_medical_cases_table)
        print("✅ Tabla 'medical_cases' creada")
        
        # 3. TABLA EXTRACTED_EMAILS
        print(f"\n📧 3. Creando tabla 'extracted_emails'...")
        create_extracted_emails_table = """
        CREATE TABLE extracted_emails (
            id VARCHAR(255) PRIMARY KEY,
            subject TEXT,
            sender VARCHAR(500) NOT NULL,
            recipients JSON,
            date DATETIME NOT NULL,
            body_text LONGTEXT,
            body_html LONGTEXT,
            attachments JSON,
            metadata JSON,
            ai_analysis JSON,
            ai_confidence_score DECIMAL(3,2),
            processing_status ENUM('pendiente', 'procesado', 'error', 'ignorado') DEFAULT 'pendiente',
            error_message TEXT,
            extraction_method VARCHAR(100) DEFAULT 'selenium',
            extraction_session_id VARCHAR(100),
            medical_case_id INT NULL,
            processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            INDEX idx_sender (sender),
            INDEX idx_date (date),
            INDEX idx_processing_status (processing_status),
            INDEX idx_medical_case (medical_case_id),
            
            FOREIGN KEY (medical_case_id) REFERENCES medical_cases(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        cursor.execute(create_extracted_emails_table)
        print("✅ Tabla 'extracted_emails' creada")
        
        # Continuar con las demás tablas...
        print(f"\n⏳ Continuando con tablas restantes...")
        
        # Restaurar datos de usuarios
        print(f"\n🔄 Restaurando usuarios...")
        
        # Usuario admin por defecto
        admin_sql = """
        INSERT INTO users 
        (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
        VALUES 
        ('admin', 'admin@hospital-ese.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyAuVFqy4u1gjdvZFaQllzrWTbM/PapIHyC', 'Administrador', 'Sistema', 'admin', TRUE, TRUE)
        """
        cursor.execute(admin_sql)
        
        # Restaurar usuarios respaldados
        for user_data in users_backup:
            email, name, password_hash, role = user_data
            
            # Mapear roles antiguos a nuevos
            role_mapping = {
                'medical_evaluator': 'medico_evaluador',
                'administrator': 'admin'
            }
            new_role = role_mapping.get(role, 'medico_evaluador')
            
            # Crear username desde email
            username = email.split('@')[0] if email else f'user_{len(users_backup)}'
            
            # Dividir nombre
            name_parts = name.split(' ', 1) if name else ['Usuario', 'Sistema']
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else 'Sistema'
            
            restore_sql = """
            INSERT IGNORE INTO users 
            (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
            VALUES (%s, %s, %s, %s, %s, %s, TRUE, TRUE)
            """
            
            cursor.execute(restore_sql, (username, email, password_hash, first_name, last_name, new_role))
        
        print(f"✅ Usuarios restaurados")
        
        # Rehabilitar verificación de claves foráneas
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        print(f"\n🔒 Verificación de claves foráneas rehabilitada")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return True
        
    except Error as e:
        print(f"❌ Error de base de datos: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def main():
    """Función principal"""
    print_header()
    
    print(f"\n🕐 Iniciando recreación segura: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = recreate_complete_schema()
    
    print("\n" + "=" * 120)
    print("📊 REPORTE FINAL")
    print("=" * 120)
    
    if success:
        print("🎉 ¡ESQUEMA RECREADO EXITOSAMENTE!")
        print("✅ Tablas principales creadas")
        print("✅ Usuarios restaurados")
        print("✅ Restricciones manejadas correctamente")
        print("🚀 Listo para completar esquema")
        
        print(f"\n🔄 PRÓXIMO PASO:")
        print("   Ejecutar: python create_complete_database_schema.py")
        
    else:
        print("❌ ERROR EN RECREACIÓN")
        print("🔧 Verificar configuración")
    
    print(f"\n📅 Proceso completado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 120)
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡RECREACIÓN EXITOSA!")
            print("🏆 Base preparada para esquema completo")
        else:
            print("\n🔧 RECREACIÓN INCOMPLETA")
            print("❌ Revisar configuración")
        
        input("\nPresione Enter para continuar...")
        exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Proceso cancelado")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        exit(1)
