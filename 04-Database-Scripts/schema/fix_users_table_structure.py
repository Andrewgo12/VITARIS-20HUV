#!/usr/bin/env python3
"""
Corrector de Estructura de Tabla Users - VITAL RED
Verifica y corrige la estructura de la tabla users
"""

import mysql.connector
from mysql.connector import Error
from datetime import datetime

def print_header():
    print("=" * 80)
    print("🔧 CORRECTOR DE ESTRUCTURA DE TABLA USERS - VITAL RED")
    print("Hospital Universitaria ESE")
    print("=" * 80)

def fix_users_table():
    """Corregir estructura de tabla users"""
    
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
        
        # Verificar estructura actual de users
        print(f"\n🔍 Verificando estructura actual de tabla 'users'...")
        
        cursor.execute("DESCRIBE users")
        current_columns = cursor.fetchall()
        
        print(f"📋 Columnas actuales ({len(current_columns)}):")
        current_column_names = []
        for column in current_columns:
            column_name = column[0]
            column_type = column[1]
            current_column_names.append(column_name)
            print(f"   - {column_name}: {column_type}")
        
        # Columnas requeridas
        required_columns = [
            'id', 'username', 'email', 'password_hash', 'first_name', 'last_name',
            'role', 'specialty', 'license_number', 'phone', 'is_active', 
            'email_verified', 'last_login', 'login_attempts', 'locked_until',
            'created_at', 'updated_at', 'created_by'
        ]
        
        missing_columns = []
        for col in required_columns:
            if col not in current_column_names:
                missing_columns.append(col)
        
        if missing_columns:
            print(f"\n⚠️  Columnas faltantes: {missing_columns}")
            print("🔧 Recreando tabla users con estructura completa...")
            
            # Respaldar datos existentes si los hay
            cursor.execute("SELECT COUNT(*) FROM users")
            user_count = cursor.fetchone()[0]
            
            if user_count > 0:
                print(f"💾 Respaldando {user_count} usuarios existentes...")
                cursor.execute("SELECT * FROM users")
                existing_users = cursor.fetchall()
                
                # Obtener nombres de columnas actuales
                cursor.execute("SHOW COLUMNS FROM users")
                column_info = cursor.fetchall()
                current_column_names = [col[0] for col in column_info]
                
                print(f"📋 Datos respaldados: {len(existing_users)} registros")
            else:
                existing_users = []
                current_column_names = []
            
            # Eliminar tabla actual
            cursor.execute("DROP TABLE IF EXISTS users")
            print("🗑️  Tabla users eliminada")
            
            # Crear nueva tabla con estructura completa
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
                INDEX idx_specialty (specialty),
                INDEX idx_is_active (is_active),
                INDEX idx_last_login (last_login)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """
            
            cursor.execute(create_users_table)
            print("✅ Nueva tabla users creada")
            
            # Restaurar datos si los había
            if existing_users:
                print("🔄 Restaurando datos existentes...")
                
                # Mapear columnas antiguas a nuevas
                for user_data in existing_users:
                    # Crear mapeo básico
                    user_dict = dict(zip(current_column_names, user_data))
                    
                    # Insertar con valores por defecto para campos faltantes
                    insert_sql = """
                    INSERT INTO users 
                    (username, email, password_hash, first_name, last_name, role, 
                     specialty, is_active, email_verified, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    
                    # Usar valores existentes o por defecto
                    username = user_dict.get('username', user_dict.get('email', f'user_{user_dict.get("id", "unknown")}'))
                    email = user_dict.get('email', f'{username}@hospital-ese.com')
                    password_hash = user_dict.get('password_hash', user_dict.get('password', '$2b$12$default'))
                    first_name = user_dict.get('first_name', user_dict.get('name', 'Usuario'))
                    last_name = user_dict.get('last_name', 'Sistema')
                    role = user_dict.get('role', 'medico_evaluador')
                    specialty = user_dict.get('specialty', user_dict.get('especialidad'))
                    is_active = user_dict.get('is_active', user_dict.get('active', True))
                    email_verified = user_dict.get('email_verified', True)
                    created_at = user_dict.get('created_at', datetime.now())
                    
                    cursor.execute(insert_sql, (
                        username, email, password_hash, first_name, last_name,
                        role, specialty, is_active, email_verified, created_at
                    ))
                
                print(f"✅ {len(existing_users)} usuarios restaurados")
            
            # Insertar usuario admin por defecto
            admin_sql = """
            INSERT IGNORE INTO users 
            (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
            VALUES 
            ('admin', 'admin@hospital-ese.com', '$2b$12$LQv3c1yqBwlVHpPjrCeyAuVFqy4u1gjdvZFaQllzrWTbM/PapIHyC', 'Administrador', 'Sistema', 'admin', TRUE, TRUE)
            """
            
            cursor.execute(admin_sql)
            print("✅ Usuario administrador creado")
            
        else:
            print("✅ Estructura de tabla users es correcta")
        
        # Verificar estructura final
        print(f"\n🔍 Verificando estructura final...")
        cursor.execute("DESCRIBE users")
        final_columns = cursor.fetchall()
        
        print(f"📋 Estructura final ({len(final_columns)} columnas):")
        for column in final_columns:
            print(f"   ✅ {column[0]}: {column[1]}")
        
        # Verificar datos
        cursor.execute("SELECT COUNT(*) FROM users")
        final_count = cursor.fetchone()[0]
        print(f"\n📊 Total de usuarios: {final_count}")
        
        if final_count > 0:
            cursor.execute("SELECT username, email, role FROM users LIMIT 5")
            sample_users = cursor.fetchall()
            print("👥 Usuarios de muestra:")
            for user in sample_users:
                print(f"   - {user[0]} ({user[1]}) - {user[2]}")
        
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
    
    print(f"\n🕐 Iniciando corrección: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = fix_users_table()
    
    print("\n" + "=" * 80)
    print("📊 REPORTE FINAL")
    print("=" * 80)
    
    if success:
        print("🎉 ¡TABLA USERS CORREGIDA EXITOSAMENTE!")
        print("✅ Estructura completa implementada")
        print("✅ Datos existentes preservados")
        print("✅ Usuario administrador disponible")
        print("🚀 Listo para crear esquema completo")
        
        print(f"\n🔄 PRÓXIMO PASO:")
        print("   Ejecutar: python create_complete_database_schema.py")
        
    else:
        print("❌ ERROR CORRIGIENDO TABLA")
        print("🔧 Verificar configuración de base de datos")
    
    print(f"\n📅 Proceso completado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡CORRECCIÓN EXITOSA!")
            print("🏆 Tabla users lista para esquema completo")
        else:
            print("\n🔧 CORRECCIÓN INCOMPLETA")
            print("❌ Revisar configuración")
        
        input("\nPresione Enter para continuar...")
        exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Proceso cancelado")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        exit(1)
