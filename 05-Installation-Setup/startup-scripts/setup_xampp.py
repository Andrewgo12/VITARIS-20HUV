#!/usr/bin/env python3
"""
XAMPP Setup Script for VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

Este script configura XAMPP para trabajar con VITAL RED
"""

import os
import sys
import subprocess
import time
import mysql.connector
from mysql.connector import Error

def print_header():
    """Print setup header"""
    print("=" * 60)
    print("🏥 VITAL RED - XAMPP Setup Script")
    print("Hospital Universitaria ESE")
    print("Departamento de Innovación y Desarrollo")
    print("=" * 60)

def check_xampp_running():
    """Check if XAMPP services are running"""
    print("\n🔍 Verificando servicios de XAMPP...")
    
    try:
        # Check if MySQL is running on port 3306
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', 3306))
        sock.close()
        
        if result == 0:
            print("✅ MySQL está ejecutándose en puerto 3306")
            return True
        else:
            print("❌ MySQL no está ejecutándose")
            return False
    except Exception as e:
        print(f"❌ Error verificando MySQL: {e}")
        return False

def create_database():
    """Create VITAL RED database in MySQL"""
    print("\n📊 Creando base de datos VITAL RED...")
    
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password=''  # Default XAMPP password is empty
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database
            cursor.execute("CREATE DATABASE IF NOT EXISTS vital_red CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✅ Base de datos 'vital_red' creada exitosamente")
            
            # Show databases
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("📋 Bases de datos disponibles:")
            for db in databases:
                if 'vital_red' in db[0]:
                    print(f"   ✅ {db[0]}")
                else:
                    print(f"   📁 {db[0]}")
            
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"❌ Error creando base de datos: {e}")
        return False

def install_python_dependencies():
    """Install required Python dependencies"""
    print("\n📦 Instalando dependencias de Python...")
    
    dependencies = [
        'mysql-connector-python',
        'pymysql',
        'sqlalchemy',
        'fastapi',
        'uvicorn',
        'redis',
        'google-api-python-client',
        'google-auth-httplib2',
        'google-auth-oauthlib',
        'spacy',
        'structlog',
        'python-decouple',
        'pytest',
        'pytest-asyncio'
    ]
    
    for dep in dependencies:
        try:
            print(f"📥 Instalando {dep}...")
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep], 
                                stdout=subprocess.DEVNULL, 
                                stderr=subprocess.DEVNULL)
            print(f"✅ {dep} instalado")
        except subprocess.CalledProcessError:
            print(f"❌ Error instalando {dep}")
            return False
    
    print("✅ Todas las dependencias instaladas correctamente")
    return True

def create_env_file():
    """Create .env file for XAMPP configuration"""
    print("\n⚙️ Creando archivo de configuración .env...")
    
    env_content = """# VITAL RED Configuration for XAMPP
# Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

# Database Configuration (MySQL XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vital_red
DB_USER=root
DB_PASSWORD=
DB_DRIVER=mysql+pymysql

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Gmail API Configuration
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json
GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly

# Security Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ENCRYPTION_KEY=your-encryption-key-here-change-in-production

# Application Configuration
DEBUG=True
LOG_LEVEL=INFO
ENVIRONMENT=development

# WebSocket Configuration
WEBSOCKET_HOST=localhost
WEBSOCKET_PORT=8002

# API Configuration
API_HOST=localhost
API_PORT=8001
"""
    
    try:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("✅ Archivo .env creado exitosamente")
        return True
    except Exception as e:
        print(f"❌ Error creando archivo .env: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🧪 Probando conexión a la base de datos...")
    
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
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ Conexión exitosa a MySQL {version[0]}")
            
            cursor.close()
            connection.close()
            return True
            
    except Error as e:
        print(f"❌ Error de conexión: {e}")
        return False

def create_tables():
    """Create database tables using SQLAlchemy"""
    print("\n🏗️ Creando tablas de la base de datos...")
    
    try:
        # Import after dependencies are installed
        sys.path.append('server/gmail_integration')
        from database import DatabaseManager
        from models import Base
        
        # Initialize database manager
        db_manager = DatabaseManager()
        
        # Create all tables
        Base.metadata.create_all(bind=db_manager.engine)
        print("✅ Tablas creadas exitosamente")
        
        # Show created tables
        from sqlalchemy import inspect
        inspector = inspect(db_manager.engine)
        tables = inspector.get_table_names()
        print("📋 Tablas creadas:")
        for table in tables:
            print(f"   📊 {table}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando tablas: {e}")
        return False

def run_tests():
    """Run basic tests"""
    print("\n🧪 Ejecutando pruebas básicas...")
    
    try:
        # Test imports
        sys.path.append('server/gmail_integration')
        import config
        import models
        import database
        print("✅ Imports básicos funcionando")
        
        # Test database connection
        if test_database_connection():
            print("✅ Conexión a base de datos funcionando")
        else:
            return False
        
        print("✅ Todas las pruebas básicas pasaron")
        return True
        
    except Exception as e:
        print(f"❌ Error en pruebas: {e}")
        return False

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "=" * 60)
    print("🎉 ¡CONFIGURACIÓN COMPLETADA!")
    print("=" * 60)
    print("\n📋 PRÓXIMOS PASOS:")
    print("\n1. 🚀 Iniciar el backend:")
    print("   cd server/gmail_integration")
    print("   python main_service.py")
    print("\n2. 🌐 Iniciar el frontend:")
    print("   cd client")
    print("   npm run dev")
    print("\n3. 📧 Configurar Gmail API:")
    print("   - Obtener credentials.json de Google Cloud Console")
    print("   - Colocar en server/gmail_integration/")
    print("   - Ejecutar autenticación inicial")
    print("\n4. 🔧 Acceder al sistema:")
    print("   - Frontend: http://localhost:5173")
    print("   - Backend API: http://localhost:8001")
    print("   - WebSocket: ws://localhost:8002")
    print("\n5. 🗄️ Administrar base de datos:")
    print("   - phpMyAdmin: http://localhost/phpmyadmin")
    print("   - Base de datos: vital_red")
    print("\n" + "=" * 60)
    print("🏥 VITAL RED está listo para funcionar con XAMPP!")
    print("=" * 60)

def main():
    """Main setup function"""
    print_header()
    
    # Check if XAMPP is running
    if not check_xampp_running():
        print("\n❌ XAMPP no está ejecutándose.")
        print("📋 Por favor:")
        print("   1. Abrir XAMPP Control Panel")
        print("   2. Iniciar Apache y MySQL")
        print("   3. Ejecutar este script nuevamente")
        return False
    
    # Install Python dependencies
    if not install_python_dependencies():
        print("❌ Error instalando dependencias")
        return False
    
    # Create database
    if not create_database():
        print("❌ Error creando base de datos")
        return False
    
    # Create .env file
    if not create_env_file():
        print("❌ Error creando configuración")
        return False
    
    # Create tables
    if not create_tables():
        print("❌ Error creando tablas")
        return False
    
    # Run tests
    if not run_tests():
        print("❌ Error en pruebas")
        return False
    
    # Print next steps
    print_next_steps()
    return True

if __name__ == "__main__":
    try:
        success = main()
        if success:
            sys.exit(0)
        else:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n❌ Configuración cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)
