#!/usr/bin/env python3
"""
Creador de Tablas - Gmail Extractor VITAL RED
Crea las tablas necesarias para el funcionamiento del Gmail Extractor
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime

def print_header():
    print("=" * 80)
    print("🗄️  CREADOR DE TABLAS - GMAIL EXTRACTOR VITAL RED")
    print("Hospital Universitaria ESE")
    print("=" * 80)

def create_database_tables():
    """Crear todas las tablas necesarias para Gmail Extractor"""
    
    # Configuración de base de datos
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',
        'database': 'vital_red'
    }
    
    try:
        print(f"\n🔌 Conectando a base de datos...")
        print(f"   Host: {config['host']}:{config['port']}")
        print(f"   Database: {config['database']}")
        print(f"   User: {config['user']}")
        
        # Conectar a la base de datos
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        print("✅ Conexión exitosa")
        
        # 1. Tabla extracted_emails
        print(f"\n📧 Creando tabla 'extracted_emails'...")
        
        create_extracted_emails_table = """
        CREATE TABLE IF NOT EXISTS extracted_emails (
            id VARCHAR(255) PRIMARY KEY,
            subject TEXT,
            sender VARCHAR(500),
            recipients JSON,
            date DATETIME,
            body_text LONGTEXT,
            body_html LONGTEXT,
            attachments JSON,
            metadata JSON,
            ai_analysis JSON,
            processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            extraction_method VARCHAR(100) DEFAULT 'selenium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_sender (sender),
            INDEX idx_date (date),
            INDEX idx_processed_at (processed_at),
            INDEX idx_extraction_method (extraction_method)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        
        cursor.execute(create_extracted_emails_table)
        print("✅ Tabla 'extracted_emails' creada")
        
        # 2. Tabla email_attachments (verificar si existe)
        print(f"\n📎 Verificando tabla 'email_attachments'...")
        
        cursor.execute("SHOW TABLES LIKE 'email_attachments'")
        if not cursor.fetchone():
            print("   Creando tabla 'email_attachments'...")
            
            create_attachments_table = """
            CREATE TABLE IF NOT EXISTS email_attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email_id VARCHAR(255),
                filename VARCHAR(500),
                content_type VARCHAR(200),
                size_bytes BIGINT,
                content LONGBLOB,
                extracted_text LONGTEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (email_id) REFERENCES extracted_emails(id) ON DELETE CASCADE,
                INDEX idx_email_id (email_id),
                INDEX idx_filename (filename),
                INDEX idx_content_type (content_type)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            cursor.execute(create_attachments_table)
            print("✅ Tabla 'email_attachments' creada")
        else:
            print("✅ Tabla 'email_attachments' ya existe")
        
        # 3. Tabla extraction_logs
        print(f"\n📝 Creando tabla 'extraction_logs'...")
        
        create_logs_table = """
        CREATE TABLE IF NOT EXISTS extraction_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(100),
            log_level VARCHAR(20),
            message TEXT,
            details JSON,
            email_id VARCHAR(255),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_session_id (session_id),
            INDEX idx_log_level (log_level),
            INDEX idx_created_at (created_at),
            INDEX idx_email_id (email_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        
        cursor.execute(create_logs_table)
        print("✅ Tabla 'extraction_logs' creada")
        
        # 4. Tabla extraction_sessions (para tracking de sesiones)
        print(f"\n🔄 Creando tabla 'extraction_sessions'...")
        
        create_sessions_table = """
        CREATE TABLE IF NOT EXISTS extraction_sessions (
            session_id VARCHAR(100) PRIMARY KEY,
            status VARCHAR(50) DEFAULT 'running',
            total_emails INT DEFAULT 0,
            processed_emails INT DEFAULT 0,
            successful_extractions INT DEFAULT 0,
            failed_extractions INT DEFAULT 0,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_time DATETIME NULL,
            config JSON,
            error_message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_status (status),
            INDEX idx_start_time (start_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        
        cursor.execute(create_sessions_table)
        print("✅ Tabla 'extraction_sessions' creada")
        
        # Confirmar cambios
        connection.commit()
        
        # Verificar tablas creadas
        print(f"\n🔍 Verificando tablas creadas...")
        
        tables_to_check = [
            'extracted_emails',
            'email_attachments', 
            'extraction_logs',
            'extraction_sessions'
        ]
        
        for table in tables_to_check:
            cursor.execute(f"SHOW TABLES LIKE '{table}'")
            if cursor.fetchone():
                print(f"✅ Tabla '{table}' verificada")
                
                # Mostrar estructura de la tabla
                cursor.execute(f"DESCRIBE {table}")
                columns = cursor.fetchall()
                print(f"   Columnas: {len(columns)}")
            else:
                print(f"❌ Tabla '{table}' no encontrada")
        
        # Insertar datos de prueba (opcional)
        print(f"\n🧪 Insertando datos de prueba...")
        
        # Insertar sesión de prueba
        test_session_sql = """
        INSERT IGNORE INTO extraction_sessions 
        (session_id, status, total_emails, processed_emails, successful_extractions, config)
        VALUES 
        ('test_session_001', 'completed', 5, 5, 5, '{"test": true, "max_emails": 5}')
        """
        
        cursor.execute(test_session_sql)
        
        # Insertar log de prueba
        test_log_sql = """
        INSERT IGNORE INTO extraction_logs
        (session_id, log_level, message, details)
        VALUES
        ('test_session_001', 'INFO', 'Sistema inicializado correctamente', '{"component": "test"}')
        """
        
        cursor.execute(test_log_sql)
        
        connection.commit()
        print("✅ Datos de prueba insertados")
        
        # Mostrar estadísticas finales
        print(f"\n📊 ESTADÍSTICAS FINALES:")
        
        for table in tables_to_check:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   {table}: {count} registros")
        
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
    
    print(f"\n🕐 Iniciando creación de tablas: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = create_database_tables()
    
    print("\n" + "=" * 80)
    print("📊 REPORTE FINAL")
    print("=" * 80)
    
    if success:
        print("🎉 ¡TABLAS CREADAS EXITOSAMENTE!")
        print("✅ Todas las tablas del Gmail Extractor están listas")
        print("✅ Base de datos configurada correctamente")
        print("🚀 Sistema listo para extraer correos de Gmail")
        
        print(f"\n📋 TABLAS CREADAS:")
        print("   • extracted_emails - Almacena correos extraídos")
        print("   • email_attachments - Almacena archivos adjuntos")
        print("   • extraction_logs - Almacena logs del sistema")
        print("   • extraction_sessions - Almacena sesiones de extracción")
        
        print(f"\n🔄 PRÓXIMOS PASOS:")
        print("   1. Configurar clave API de Gemini (opcional)")
        print("   2. Iniciar servidor: python start_vital_red_complete_final.py")
        print("   3. Acceder a: http://localhost:5173/vital-red/gmail-extractor")
        print("   4. Realizar primera extracción de prueba")
        
    else:
        print("❌ ERROR CREANDO TABLAS")
        print("🔧 Verificar configuración de base de datos")
        print("🔄 Asegurar que MySQL esté corriendo")
        print("🔄 Verificar credenciales de acceso")
    
    print(f"\n📅 Proceso completado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡BASE DE DATOS LISTA!")
            print("🏆 Gmail Extractor completamente configurado")
            print("🚀 Listo para transformar la gestión de correos")
        else:
            print("\n🔧 CONFIGURACIÓN INCOMPLETA")
            print("❌ Revisar configuración de base de datos")
            print("🔄 Intentar nuevamente")
        
        input("\nPresione Enter para continuar...")
        exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Proceso cancelado por el usuario")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        exit(1)
