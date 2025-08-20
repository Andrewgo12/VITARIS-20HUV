#!/usr/bin/env python3
"""
Iniciador Simplificado de VITAL RED
Servidor básico funcional para pruebas
"""

import os
import sys
import time
import subprocess
import threading
from datetime import datetime

def print_header():
    print("=" * 80)
    print("🏥 VITAL RED - INICIADOR SIMPLIFICADO")
    print("Hospital Universitaria ESE")
    print("Servidor básico para pruebas y desarrollo")
    print("=" * 80)

def start_backend_simple():
    """Iniciar backend simplificado"""
    print(f"\n🖥️  INICIANDO BACKEND SIMPLIFICADO...")
    print("-" * 60)
    
    try:
        # Crear servidor básico con FastAPI
        server_code = '''
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import mysql.connector
from datetime import datetime

app = FastAPI(title="VITAL RED API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de base de datos
DB_CONFIG = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "",
    "database": "vital_red"
}

@app.get("/")
async def root():
    return {"message": "VITAL RED API - Hospital Universitaria ESE", "status": "running", "timestamp": datetime.now().isoformat()}

@app.get("/health")
async def health_check():
    try:
        # Verificar conexión a base de datos
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.close()
        connection.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "users": user_count,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@app.post("/api/auth/login")
async def login(credentials: dict):
    email = credentials.get("email")
    password = credentials.get("password")
    
    # Validación básica
    if email == "admin@hospital-ese.com" and password == "admin123":
        return {
            "success": True,
            "token": "mock_jwt_token_for_testing",
            "user": {
                "id": 1,
                "email": email,
                "name": "Administrador",
                "role": "admin"
            }
        }
    else:
        return JSONResponse(
            status_code=401,
            content={"success": False, "message": "Credenciales inválidas"}
        )

@app.get("/api/gmail-extractor/status")
async def gmail_extractor_status():
    return {
        "status": "ready",
        "configured_email": "kevinrlinze@gmail.com",
        "last_extraction": None,
        "total_emails": 0
    }

@app.post("/api/gmail-extractor/start")
async def start_extraction():
    return {
        "success": True,
        "session_id": "test_session_001",
        "message": "Extracción iniciada (modo de prueba)"
    }

@app.get("/api/gmail-extractor/progress")
async def extraction_progress():
    return {
        "session_id": "test_session_001",
        "status": "completed",
        "total_emails": 5,
        "processed": 5,
        "successful": 5,
        "failed": 0,
        "progress_percentage": 100
    }

@app.get("/api/medical-cases")
async def get_medical_cases():
    return {
        "cases": [],
        "total": 0,
        "page": 1,
        "per_page": 10
    }

@app.get("/api/users")
async def get_users():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, first_name, last_name, role, is_active FROM users")
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return {"users": users, "total": len(users)}
    except Exception as e:
        return {"users": [], "total": 0, "error": str(e)}

if __name__ == "__main__":
    print("🚀 Iniciando VITAL RED API Server...")
    print("📍 URL: http://localhost:8001")
    print("📖 Docs: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
'''
        
        # Guardar servidor temporal
        with open('temp_server.py', 'w', encoding='utf-8') as f:
            f.write(server_code)
        
        print("✅ Servidor simplificado creado")
        print("🚀 Iniciando en puerto 8001...")
        
        # Iniciar servidor en hilo separado
        def run_server():
            try:
                subprocess.run([sys.executable, 'temp_server.py'], cwd=os.getcwd())
            except Exception as e:
                print(f"❌ Error en servidor: {e}")
        
        server_thread = threading.Thread(target=run_server, daemon=True)
        server_thread.start()
        
        # Esperar un momento para que inicie
        time.sleep(3)
        
        print("✅ Backend iniciado en http://localhost:8001")
        return True
        
    except Exception as e:
        print(f"❌ Error iniciando backend: {e}")
        return False

def start_frontend():
    """Iniciar frontend"""
    print(f"\n🌐 INICIANDO FRONTEND...")
    print("-" * 60)
    
    try:
        # Verificar si Node.js está disponible
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Node.js no está instalado")
            print("📥 Instalar desde: https://nodejs.org/")
            return False
        
        print(f"✅ Node.js {result.stdout.strip()}")
        
        # Verificar si las dependencias están instaladas
        if not os.path.exists('client/node_modules'):
            print("📦 Instalando dependencias...")
            install_result = subprocess.run(['npm', 'install'], cwd='client', capture_output=True, text=True)
            if install_result.returncode != 0:
                print(f"❌ Error instalando dependencias: {install_result.stderr}")
                return False
            print("✅ Dependencias instaladas")
        
        # Iniciar servidor de desarrollo
        print("🚀 Iniciando servidor de desarrollo...")
        
        def run_frontend():
            try:
                subprocess.run(['npm', 'run', 'dev'], cwd='client')
            except Exception as e:
                print(f"❌ Error en frontend: {e}")
        
        frontend_thread = threading.Thread(target=run_frontend, daemon=True)
        frontend_thread.start()
        
        time.sleep(5)
        print("✅ Frontend iniciado en http://localhost:5173")
        return True
        
    except Exception as e:
        print(f"❌ Error iniciando frontend: {e}")
        return False

def verify_system():
    """Verificar que el sistema esté funcionando"""
    print(f"\n🔍 VERIFICANDO SISTEMA...")
    print("-" * 60)
    
    try:
        import requests
        
        # Verificar backend
        try:
            response = requests.get('http://localhost:8001/health', timeout=5)
            if response.status_code == 200:
                print("✅ Backend funcionando correctamente")
                data = response.json()
                print(f"   Estado: {data.get('status')}")
                print(f"   Base de datos: {data.get('database')}")
                print(f"   Usuarios: {data.get('users')}")
            else:
                print(f"⚠️  Backend responde con código: {response.status_code}")
        except Exception as e:
            print(f"❌ Backend no responde: {e}")
        
        # Verificar frontend
        try:
            response = requests.get('http://localhost:5173', timeout=5)
            if response.status_code == 200:
                print("✅ Frontend funcionando correctamente")
            else:
                print(f"⚠️  Frontend responde con código: {response.status_code}")
        except Exception as e:
            print(f"❌ Frontend no responde: {e}")
        
        return True
        
    except ImportError:
        print("⚠️  Módulo 'requests' no disponible para verificación")
        return True
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return False

def main():
    """Función principal"""
    print_header()
    
    print(f"\n🕐 Iniciando VITAL RED: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Iniciar backend
    backend_success = start_backend_simple()
    
    # Iniciar frontend
    frontend_success = start_frontend()
    
    # Verificar sistema
    if backend_success:
        verify_system()
    
    # Mostrar resumen
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE INICIO")
    print("=" * 80)
    
    if backend_success:
        print("✅ Backend: http://localhost:8001")
        print("   📖 API Docs: http://localhost:8001/docs")
        print("   🔍 Health: http://localhost:8001/health")
    else:
        print("❌ Backend: Error al iniciar")
    
    if frontend_success:
        print("✅ Frontend: http://localhost:5173")
        print("   🏥 VITAL RED: http://localhost:5173/vital-red/dashboard")
        print("   📧 Gmail Extractor: http://localhost:5173/vital-red/gmail-extractor")
    else:
        print("❌ Frontend: Error al iniciar")
    
    print(f"\n🔑 CREDENCIALES DE PRUEBA:")
    print("   Email: admin@hospital-ese.com")
    print("   Password: admin123")
    
    print(f"\n📧 GMAIL CONFIGURADO:")
    print("   Cuenta: kevinrlinze@gmail.com")
    print("   Estado: Listo para configurar contraseña")
    
    if backend_success and frontend_success:
        print(f"\n🎉 ¡VITAL RED INICIADO EXITOSAMENTE!")
        print("🚀 Sistema listo para uso en Hospital Universitaria ESE")
        
        # Mantener servidor corriendo
        try:
            print(f"\n⏳ Manteniendo servidores activos...")
            print("   Presione Ctrl+C para detener")
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n\n🛑 Deteniendo servidores...")
            print("✅ VITAL RED detenido correctamente")
    else:
        print(f"\n⚠️  INICIO PARCIAL")
        print("🔧 Revisar errores arriba")
    
    return backend_success and frontend_success

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n\n🛑 Proceso cancelado por el usuario")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        exit(1)
