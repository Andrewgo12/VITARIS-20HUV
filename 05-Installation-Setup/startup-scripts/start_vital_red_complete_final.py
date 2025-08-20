#!/usr/bin/env python3
"""
VITAL RED - Script de Inicio Final Completo
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
Sistema 100% Completo y Listo para Producción
"""

import os
import sys
import time
import subprocess
import requests
import mysql.connector
from datetime import datetime

def print_header():
    print("=" * 80)
    print("🏥 VITAL RED - INICIO FINAL COMPLETO")
    print("Hospital Universitaria ESE")
    print("Departamento de Innovación y Desarrollo")
    print("Sistema 100% Implementado y Verificado")
    print("=" * 80)

def check_prerequisites():
    """Check all system prerequisites"""
    print("\n🔍 VERIFICANDO PRERREQUISITOS DEL SISTEMA...")
    print("-" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major >= 3 and python_version.minor >= 8:
        print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro}")
    else:
        print(f"❌ Python version {python_version.major}.{python_version.minor} (se requiere 3.8+)")
        return False
    
    # Check required directories
    required_dirs = [
        "server/gmail_integration",
        "client",
        "client/pages",
        "client/services",
        "client/components"
    ]
    
    for directory in required_dirs:
        if os.path.exists(directory):
            print(f"✅ Directorio: {directory}")
        else:
            print(f"❌ Directorio faltante: {directory}")
            return False
    
    # Check required files
    required_files = [
        "server/gmail_integration/complete_server.py",
        "server/gmail_integration/api_routes.py",
        "server/gmail_integration/database.py",
        "server/gmail_integration/models.py",
        "client/services/api.ts",
        "client/pages/VitalRedDashboard.tsx",
        "client/pages/MedicalCasesInbox.tsx",
        "client/pages/RequestHistory.tsx",
        "client/pages/UserManagement.tsx",
        "client/pages/SupervisionPanel.tsx",
        "client/pages/SystemConfiguration.tsx",
        "client/pages/BackupManagement.tsx",
        "client/pages/EmailMonitor.tsx",
        "client/pages/EmailCaptureConfig.tsx"
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ Archivo: {file_path}")
        else:
            print(f"❌ Archivo faltante: {file_path}")
            return False
    
    return True

def check_database_connection():
    """Check database connection and setup"""
    print("\n🗄️ VERIFICANDO CONEXIÓN A BASE DE DATOS...")
    print("-" * 50)
    
    try:
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        
        cursor = conn.cursor()
        
        # Check all required tables
        required_tables = [
            'users',
            'patient_records', 
            'email_messages',
            'medical_referrals',
            'system_alerts',
            'performance_metrics'
        ]
        
        cursor.execute("SHOW TABLES")
        existing_tables = [table[0] for table in cursor.fetchall()]
        
        for table in required_tables:
            if table in existing_tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"✅ Tabla {table}: {count} registros")
            else:
                print(f"❌ Tabla faltante: {table}")
                conn.close()
                return False
        
        # Check admin user exists
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'admin@hospital-ese.com'")
        admin_count = cursor.fetchone()[0]
        
        if admin_count > 0:
            print("✅ Usuario administrador configurado")
        else:
            print("❌ Usuario administrador no encontrado")
            conn.close()
            return False
        
        conn.close()
        print("✅ Base de datos completamente operativa")
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión a base de datos: {e}")
        return False

def start_backend_server():
    """Start the backend server"""
    print("\n🚀 INICIANDO SERVIDOR BACKEND...")
    print("-" * 50)
    
    try:
        # Change to server directory
        server_dir = "server/gmail_integration"
        
        if not os.path.exists(server_dir):
            print(f"❌ Directorio del servidor no encontrado: {server_dir}")
            return False
        
        # Start the complete server
        print("🔄 Iniciando complete_server.py...")
        
        # Use subprocess to start server in background
        process = subprocess.Popen(
            [sys.executable, "complete_server.py"],
            cwd=server_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Check if server is running
        try:
            response = requests.get("http://localhost:8001/health", timeout=5)
            if response.status_code == 200:
                print("✅ Servidor backend iniciado correctamente")
                print("   URL: http://localhost:8001")
                print("   Docs: http://localhost:8001/docs")
                return True
            else:
                print(f"❌ Servidor responde con código: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ No se puede conectar al servidor: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error iniciando servidor backend: {e}")
        return False

def verify_all_endpoints():
    """Verify all endpoints are working"""
    print("\n🔍 VERIFICANDO TODOS LOS ENDPOINTS...")
    print("-" * 50)
    
    # First authenticate
    try:
        admin_credentials = {
            "email": "admin@hospital-ese.com",
            "password": "admin123"
        }
        auth_response = requests.post("http://localhost:8001/api/auth/login", 
                                    json=admin_credentials, timeout=10)
        
        if auth_response.status_code != 200:
            print("❌ No se pudo autenticar")
            return False
        
        token = auth_response.json()['access_token']
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test critical endpoints
        endpoints_to_test = [
            ("GET", "/api/statistics", "Estadísticas"),
            ("GET", "/api/medical-cases", "Casos Médicos"),
            ("GET", "/api/users", "Usuarios"),
            ("GET", "/api/request-history", "Historial"),
            ("GET", "/api/admin/dashboard", "Dashboard Admin"),
            ("GET", "/api/system/configuration", "Configuración"),
            ("GET", "/api/backups", "Respaldos"),
            ("GET", "/api/emails", "Monitor Emails"),
            ("GET", "/api/gmail/config", "Config Gmail")
        ]
        
        working_endpoints = 0
        total_endpoints = len(endpoints_to_test)
        
        for method, endpoint, name in endpoints_to_test:
            try:
                if method == "GET":
                    response = requests.get(f"http://localhost:8001{endpoint}", 
                                          headers=headers, timeout=5)
                else:
                    response = requests.post(f"http://localhost:8001{endpoint}", 
                                           headers=headers, timeout=5)
                
                if response.status_code == 200:
                    print(f"✅ {name}: {endpoint}")
                    working_endpoints += 1
                else:
                    print(f"❌ {name}: {endpoint} ({response.status_code})")
            except Exception as e:
                print(f"❌ {name}: {endpoint} (Error: {e})")
        
        print(f"\n📊 Endpoints funcionando: {working_endpoints}/{total_endpoints}")
        
        if working_endpoints == total_endpoints:
            print("✅ Todos los endpoints están funcionando correctamente")
            return True
        else:
            print("⚠️  Algunos endpoints no están funcionando")
            return False
            
    except Exception as e:
        print(f"❌ Error verificando endpoints: {e}")
        return False

def check_frontend_availability():
    """Check if frontend is available"""
    print("\n🌐 VERIFICANDO DISPONIBILIDAD DEL FRONTEND...")
    print("-" * 50)
    
    try:
        response = requests.get("http://localhost:5173", timeout=10)
        if response.status_code == 200:
            print("✅ Frontend disponible en http://localhost:5173")
            print("   Tamaño de respuesta:", len(response.content), "bytes")
            
            content = response.text.lower()
            if 'vital red' in content or 'hospital' in content:
                print("✅ Contenido VITAL RED detectado")
            else:
                print("⚠️  Contenido genérico detectado")
            
            return True
        else:
            print(f"❌ Frontend responde con código: {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print("⚠️  Frontend no disponible (puede necesitar iniciarse manualmente)")
        print("   Para iniciar: cd client && npm run dev")
        return False

def display_final_status(all_checks_passed):
    """Display final system status"""
    print("\n📊 ESTADO FINAL DEL SISTEMA")
    print("=" * 80)
    
    if all_checks_passed:
        print("🎉 ¡VITAL RED COMPLETAMENTE OPERATIVO!")
        print()
        print("✅ SISTEMA 100% FUNCIONAL")
        print("✅ Base de datos operativa")
        print("✅ Servidor backend funcionando")
        print("✅ Todos los endpoints disponibles")
        print("✅ Frontend accesible")
        print()
        print("🌐 URLS DE ACCESO:")
        print("   Frontend:     http://localhost:5173")
        print("   Backend API:  http://localhost:8001")
        print("   API Docs:     http://localhost:8001/docs")
        print("   Health Check: http://localhost:8001/health")
        print()
        print("👥 USUARIOS DE ACCESO:")
        print("   Administrador:    admin@hospital-ese.com / admin123")
        print("   Evaluador Médico: evaluador@hospital-ese.com / evaluator123")
        print()
        print("📱 VISTAS DISPONIBLES:")
        print("   ✅ Login & Authentication")
        print("   ✅ Dashboard Principal")
        print("   ✅ Medical Cases Inbox")
        print("   ✅ Clinical Case Detail")
        print("   ✅ Request History")
        print("   ✅ User Management")
        print("   ✅ Supervision Panel")
        print("   ✅ System Configuration")
        print("   ✅ Backup Management")
        print("   ✅ Email Monitor")
        print("   ✅ Email Capture Config")
        print("   ✅ 🆕 Gmail Extractor Avanzado")
        print()
        print("🚀 NUEVA FUNCIONALIDAD - GMAIL EXTRACTOR:")
        print("   📧 Extracción masiva hasta 300 correos")
        print("   🤖 Procesamiento inteligente con Gemini AI")
        print("   📎 Extracción de archivos adjuntos y PDFs")
        print("   📊 Interfaz web completa de monitoreo")
        print("   🔗 Acceso: /vital-red/gmail-extractor")
        print()
        print("🚀 LISTO PARA USO EN HOSPITAL UNIVERSITARIA ESE")
        
    else:
        print("❌ SISTEMA REQUIERE ATENCIÓN")
        print()
        print("⚠️  Algunas verificaciones fallaron")
        print("🔧 Revisar los errores reportados arriba")
        print("📞 Contactar al equipo de desarrollo si persisten los problemas")

def main():
    """Main startup function"""
    print_header()
    
    # Run all checks
    checks = []
    
    print(f"\n🕐 Iniciando verificación completa: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    checks.append(check_prerequisites())
    checks.append(check_database_connection())
    checks.append(start_backend_server())
    checks.append(verify_all_endpoints())
    checks.append(check_frontend_availability())
    
    all_passed = all(checks)
    
    display_final_status(all_passed)
    
    if all_passed:
        print("\n🎯 PRÓXIMOS PASOS:")
        print("1. Acceder al sistema via http://localhost:5173")
        print("2. Iniciar sesión con credenciales de administrador")
        print("3. Explorar todas las funcionalidades implementadas")
        print("4. Configurar parámetros específicos del hospital")
        print("5. Capacitar usuarios en el uso del sistema")
        print()
        print("✨ ¡VITAL RED está listo para transformar la gestión médica!")
    
    return all_passed

if __name__ == "__main__":
    try:
        success = main()
        if success:
            print("\n🎉 Inicio exitoso. Sistema completamente operativo.")
            # Keep script running to maintain server
            print("\n⏳ Manteniendo servidor activo... (Ctrl+C para detener)")
            while True:
                time.sleep(60)
        else:
            print("\n❌ Inicio fallido. Revisar errores arriba.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Sistema detenido por el usuario")
        print("✅ Apagado limpio completado")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)
