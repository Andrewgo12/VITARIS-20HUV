#!/usr/bin/env python3
"""
Script para iniciar el servidor completo VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import sys
import os
import subprocess
import time
import requests
from pathlib import Path

def check_dependencies():
    """Verificar dependencias del sistema"""
    print("🔍 Verificando dependencias...")
    
    # Verificar Python
    if sys.version_info < (3, 8):
        print("❌ Error: Se requiere Python 3.8 o superior")
        return False
    
    # Verificar MySQL
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host='localhost',
            port=3306,
            user='root',
            password='',
            database='vital_red'
        )
        conn.close()
        print("✅ MySQL: Conectado")
    except Exception as e:
        print(f"❌ MySQL: Error de conexión - {e}")
        return False
    
    # Verificar módulos Python
    required_modules = [
        'fastapi', 'uvicorn', 'sqlalchemy', 'structlog',
        'google-auth', 'google-auth-oauthlib', 'google-api-python-client'
    ]
    
    for module in required_modules:
        try:
            __import__(module.replace('-', '_'))
            print(f"✅ {module}: Instalado")
        except ImportError:
            print(f"❌ {module}: No instalado")
            return False
    
    return True

def setup_environment():
    """Configurar variables de entorno"""
    print("⚙️ Configurando entorno...")
    
    # Cambiar al directorio del servidor
    server_dir = Path(__file__).parent / "server" / "gmail_integration"
    if not server_dir.exists():
        print(f"❌ Error: Directorio del servidor no encontrado: {server_dir}")
        return False
    
    os.chdir(server_dir)
    print(f"✅ Directorio de trabajo: {server_dir}")
    
    # Verificar archivos de configuración
    config_files = ["config.py", "models.py", "database.py", "complete_server.py"]
    for file in config_files:
        if not Path(file).exists():
            print(f"❌ Error: Archivo requerido no encontrado: {file}")
            return False
        print(f"✅ {file}: Encontrado")
    
    return True

def start_server():
    """Iniciar el servidor completo"""
    print("🚀 Iniciando servidor completo VITAL RED...")
    
    try:
        # Comando para iniciar el servidor
        cmd = [
            sys.executable, 
            "complete_server.py"
        ]
        
        print(f"📝 Comando: {' '.join(cmd)}")
        
        # Iniciar el proceso
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        print("⏳ Esperando que el servidor inicie...")
        
        # Esperar y mostrar logs
        for i in range(30):  # Esperar hasta 30 segundos
            time.sleep(1)
            
            # Verificar si el proceso sigue corriendo
            if process.poll() is not None:
                output, _ = process.communicate()
                print(f"❌ El servidor se detuvo inesperadamente:")
                print(output)
                return False
            
            # Probar conexión
            try:
                response = requests.get("http://localhost:8001/health", timeout=2)
                if response.status_code == 200:
                    print("✅ Servidor iniciado correctamente!")
                    print(f"🌐 URL: http://localhost:8001")
                    print(f"📖 Documentación: http://localhost:8001/docs")
                    return True
            except:
                pass
            
            print(f"⏳ Esperando... ({i+1}/30)")
        
        print("❌ Timeout: El servidor no respondió en 30 segundos")
        process.terminate()
        return False
        
    except Exception as e:
        print(f"❌ Error iniciando servidor: {e}")
        return False

def test_endpoints():
    """Probar endpoints principales"""
    print("🧪 Probando endpoints principales...")
    
    base_url = "http://localhost:8001"
    
    endpoints = [
        ("/", "Root"),
        ("/health", "Health Check"),
        ("/docs", "API Documentation")
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"✅ {name}: OK")
            else:
                print(f"❌ {name}: {response.status_code}")
        except Exception as e:
            print(f"❌ {name}: {e}")

def main():
    """Función principal"""
    print("=" * 60)
    print("🏥 VITAL RED - SERVIDOR COMPLETO")
    print("Hospital Universitaria ESE")
    print("Departamento de Innovación y Desarrollo")
    print("=" * 60)
    
    # Verificar dependencias
    if not check_dependencies():
        print("\n❌ Error: Dependencias no satisfechas")
        print("💡 Solución:")
        print("   1. Verificar que XAMPP esté ejecutándose")
        print("   2. Instalar dependencias: pip install -r requirements.txt")
        return False
    
    # Configurar entorno
    if not setup_environment():
        print("\n❌ Error: No se pudo configurar el entorno")
        return False
    
    # Iniciar servidor
    if not start_server():
        print("\n❌ Error: No se pudo iniciar el servidor")
        return False
    
    # Probar endpoints
    test_endpoints()
    
    print("\n🎉 ¡SERVIDOR COMPLETO INICIADO EXITOSAMENTE!")
    print("\n📋 Información del servidor:")
    print("   🌐 Frontend: http://localhost:5173")
    print("   🔌 Backend API: http://localhost:8001")
    print("   📖 API Docs: http://localhost:8001/docs")
    print("   🗄️ phpMyAdmin: http://localhost/phpmyadmin")
    
    print("\n👥 Usuarios de prueba:")
    print("   👨‍💼 Administrador: admin@hospital-ese.com / admin123")
    print("   👨‍⚕️ Evaluador: evaluador@hospital-ese.com / evaluator123")
    
    print("\n⚠️  Para detener el servidor, presione Ctrl+C")
    
    try:
        # Mantener el script corriendo
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Deteniendo servidor...")
        return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n❌ Proceso cancelado por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        sys.exit(1)
