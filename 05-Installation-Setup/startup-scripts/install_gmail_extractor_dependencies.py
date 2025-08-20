#!/usr/bin/env python3
"""
Instalador de Dependencias - Gmail Extractor VITAL RED
Instala todas las dependencias necesarias para el extractor avanzado de Gmail
"""

import subprocess
import sys
import os
from datetime import datetime

def print_header():
    print("=" * 80)
    print("📦 INSTALADOR DE DEPENDENCIAS - GMAIL EXTRACTOR VITAL RED")
    print("Hospital Universitaria ESE")
    print("Instalación de dependencias para extracción avanzada de Gmail")
    print("=" * 80)

def run_command(command, description):
    """Ejecutar comando y mostrar resultado"""
    print(f"\n🔄 {description}")
    print("-" * 60)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print(f"✅ {description} - EXITOSO")
            if result.stdout.strip():
                print(f"   Salida: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} - FALLIDO")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏰ {description} - TIMEOUT")
        return False
    except Exception as e:
        print(f"❌ {description} - ERROR: {e}")
        return False

def install_python_dependencies():
    """Instalar dependencias de Python"""
    print("\n🐍 INSTALANDO DEPENDENCIAS DE PYTHON")
    print("=" * 60)
    
    dependencies = [
        "selenium",
        "beautifulsoup4",
        "requests",
        "PyPDF2",
        "python-docx",
        "Pillow",
        "pytesseract",
        "google-generativeai",
        "mysql-connector-python",
        "asyncio",
        "aiofiles",
        "fastapi",
        "pydantic[email]",
        "uvicorn",
        "python-multipart"
    ]
    
    results = []
    
    for dep in dependencies:
        success = run_command(f"pip install {dep}", f"Instalando {dep}")
        results.append(success)
    
    successful = sum(results)
    total = len(results)
    
    print(f"\n📊 Dependencias de Python: {successful}/{total} instaladas")
    return successful == total

def install_selenium_driver():
    """Instalar ChromeDriver para Selenium"""
    print("\n🌐 CONFIGURANDO SELENIUM CHROMEDRIVER")
    print("=" * 60)
    
    try:
        # Instalar webdriver-manager para gestión automática de drivers
        success1 = run_command("pip install webdriver-manager", "Instalando webdriver-manager")
        
        if success1:
            print("✅ ChromeDriver se gestionará automáticamente")
            return True
        else:
            print("❌ Error instalando webdriver-manager")
            return False
            
    except Exception as e:
        print(f"❌ Error configurando ChromeDriver: {e}")
        return False

def install_tesseract():
    """Instalar Tesseract OCR"""
    print("\n👁️ CONFIGURANDO TESSERACT OCR")
    print("=" * 60)
    
    print("⚠️  NOTA: Tesseract OCR debe instalarse manualmente:")
    print("   1. Descargar desde: https://github.com/UB-Mannheim/tesseract/wiki")
    print("   2. Instalar en el sistema")
    print("   3. Agregar al PATH del sistema")
    print("   4. Reiniciar el sistema")
    
    # Verificar si Tesseract está disponible
    try:
        result = subprocess.run("tesseract --version", shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Tesseract OCR ya está instalado")
            return True
        else:
            print("⚠️  Tesseract OCR no detectado - instalación manual requerida")
            return False
    except Exception:
        print("⚠️  Tesseract OCR no detectado - instalación manual requerida")
        return False

def create_config_file():
    """Crear archivo de configuración"""
    print("\n⚙️ CREANDO ARCHIVO DE CONFIGURACIÓN")
    print("=" * 60)
    
    config_content = '''"""
Configuración del Gmail Extractor - VITAL RED
"""

# Configuración de base de datos
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '',
    'database': 'vital_red'
}

# Configuración de Gemini AI
GEMINI_CONFIG = {
    'api_key': None,  # Configurar con clave real
    'model': 'gemini-pro',
    'max_tokens': 2048
}

# Configuración de Selenium
SELENIUM_CONFIG = {
    'headless': True,
    'window_size': (1920, 1080),
    'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'timeout': 30,
    'implicit_wait': 10
}

# Configuración de extracción
EXTRACTION_CONFIG = {
    'max_emails_per_session': 300,
    'batch_size': 10,
    'retry_attempts': 3,
    'retry_delay': 5,
    'download_attachments': True,
    'process_pdfs': True,
    'enable_ai_analysis': True
}

# Configuración de logging
LOGGING_CONFIG = {
    'level': 'INFO',
    'file': 'gmail_extraction.log',
    'max_size_mb': 100,
    'backup_count': 5
}
'''
    
    try:
        config_path = "server/gmail_extractor/config.py"
        os.makedirs(os.path.dirname(config_path), exist_ok=True)
        
        with open(config_path, 'w', encoding='utf-8') as f:
            f.write(config_content)
        
        print(f"✅ Archivo de configuración creado: {config_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error creando archivo de configuración: {e}")
        return False

def create_requirements_file():
    """Crear archivo requirements.txt específico"""
    print("\n📄 CREANDO ARCHIVO REQUIREMENTS.TXT")
    print("=" * 60)
    
    requirements_content = '''# Gmail Extractor Dependencies - VITAL RED
selenium>=4.15.0
beautifulsoup4>=4.12.0
requests>=2.31.0
PyPDF2>=3.0.0
python-docx>=0.8.11
Pillow>=10.0.0
pytesseract>=0.3.10
google-generativeai>=0.3.0
mysql-connector-python>=8.2.0
webdriver-manager>=4.0.0
fastapi>=0.104.0
pydantic[email]>=2.5.0
uvicorn>=0.24.0
python-multipart>=0.0.6
aiofiles>=23.2.1
'''
    
    try:
        with open("requirements_gmail_extractor.txt", 'w', encoding='utf-8') as f:
            f.write(requirements_content)
        
        print("✅ Archivo requirements_gmail_extractor.txt creado")
        return True
        
    except Exception as e:
        print(f"❌ Error creando requirements.txt: {e}")
        return False

def verify_installation():
    """Verificar que todas las dependencias estén instaladas"""
    print("\n🔍 VERIFICANDO INSTALACIÓN")
    print("=" * 60)
    
    verification_tests = [
        ("selenium", "from selenium import webdriver"),
        ("beautifulsoup4", "from bs4 import BeautifulSoup"),
        ("requests", "import requests"),
        ("PyPDF2", "import PyPDF2"),
        ("python-docx", "import docx"),
        ("Pillow", "from PIL import Image"),
        ("pytesseract", "import pytesseract"),
        ("google-generativeai", "import google.generativeai as genai"),
        ("mysql-connector-python", "import mysql.connector"),
        ("webdriver-manager", "from webdriver_manager.chrome import ChromeDriverManager"),
        ("fastapi", "from fastapi import FastAPI"),
        ("pydantic", "from pydantic import BaseModel")
    ]
    
    results = []
    
    for package, import_test in verification_tests:
        try:
            exec(import_test)
            print(f"✅ {package} - Importación exitosa")
            results.append(True)
        except ImportError as e:
            print(f"❌ {package} - Error de importación: {e}")
            results.append(False)
        except Exception as e:
            print(f"⚠️  {package} - Error: {e}")
            results.append(False)
    
    successful = sum(results)
    total = len(results)
    
    print(f"\n📊 Verificación: {successful}/{total} paquetes funcionando")
    return successful == total

def create_test_script():
    """Crear script de prueba básica"""
    print("\n🧪 CREANDO SCRIPT DE PRUEBA")
    print("=" * 60)
    
    test_script_content = '''#!/usr/bin/env python3
"""
Test Básico - Gmail Extractor VITAL RED
Prueba básica de funcionalidad del extractor
"""

import sys
import os

# Agregar path del proyecto
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_imports():
    """Probar importaciones básicas"""
    print("🔍 Probando importaciones...")
    
    try:
        from server.gmail_extractor.core_extractor import GmailExtractor, DEFAULT_CONFIG
        print("✅ Core extractor importado")
        
        from server.gmail_extractor.batch_processor import BatchProcessor
        print("✅ Batch processor importado")
        
        from server.gmail_extractor.api_endpoints import extraction_router
        print("✅ API endpoints importados")
        
        return True
        
    except ImportError as e:
        print(f"❌ Error de importación: {e}")
        return False

def test_config():
    """Probar configuración"""
    print("🔍 Probando configuración...")
    
    try:
        from server.gmail_extractor.core_extractor import DEFAULT_CONFIG
        
        required_keys = ['headless', 'max_emails', 'db_host', 'db_port']
        
        for key in required_keys:
            if key in DEFAULT_CONFIG:
                print(f"✅ Configuración '{key}': {DEFAULT_CONFIG[key]}")
            else:
                print(f"❌ Configuración faltante: {key}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error en configuración: {e}")
        return False

def test_database_connection():
    """Probar conexión a base de datos"""
    print("🔍 Probando conexión a base de datos...")
    
    try:
        import mysql.connector
        from server.gmail_extractor.core_extractor import DEFAULT_CONFIG
        
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        if connection.is_connected():
            print("✅ Conexión a base de datos exitosa")
            connection.close()
            return True
        else:
            print("❌ No se pudo conectar a la base de datos")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión a BD: {e}")
        return False

def main():
    """Función principal de pruebas"""
    print("=" * 60)
    print("🧪 PRUEBA BÁSICA - GMAIL EXTRACTOR")
    print("=" * 60)
    
    tests = [
        ("Importaciones", test_imports),
        ("Configuración", test_config),
        ("Base de Datos", test_database_connection)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\\n📋 Ejecutando: {test_name}")
        result = test_func()
        results.append(result)
        print(f"   Resultado: {'✅ PASÓ' if result else '❌ FALLÓ'}")
    
    successful = sum(results)
    total = len(results)
    
    print(f"\\n📊 RESUMEN DE PRUEBAS")
    print(f"   Exitosas: {successful}/{total}")
    print(f"   Porcentaje: {(successful/total)*100:.1f}%")
    
    if successful == total:
        print("\\n🎉 TODAS LAS PRUEBAS PASARON")
        print("✅ Gmail Extractor listo para usar")
    else:
        print("\\n❌ ALGUNAS PRUEBAS FALLARON")
        print("🔧 Revisar configuración e instalación")
    
    return successful == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
'''
    
    try:
        with open("test_gmail_extractor_basic.py", 'w', encoding='utf-8') as f:
            f.write(test_script_content)
        
        print("✅ Script de prueba creado: test_gmail_extractor_basic.py")
        return True
        
    except Exception as e:
        print(f"❌ Error creando script de prueba: {e}")
        return False

def main():
    """Función principal del instalador"""
    print_header()
    
    print(f"\n🕐 Iniciando instalación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Ejecutar todas las instalaciones
    results = []
    
    results.append(install_python_dependencies())
    results.append(install_selenium_driver())
    results.append(install_tesseract())
    results.append(create_config_file())
    results.append(create_requirements_file())
    results.append(create_test_script())
    results.append(verify_installation())
    
    # Generar reporte final
    successful = sum(results)
    total = len(results)
    
    print("\n" + "=" * 80)
    print("📊 REPORTE FINAL DE INSTALACIÓN")
    print("=" * 80)
    
    installation_steps = [
        "Dependencias de Python",
        "Selenium ChromeDriver",
        "Tesseract OCR",
        "Archivo de Configuración",
        "Archivo Requirements",
        "Script de Prueba",
        "Verificación Final"
    ]
    
    print("📋 Resultados por Paso:")
    for i, (step, result) in enumerate(zip(installation_steps, results)):
        status = "✅ EXITOSO" if result else "❌ FALLIDO"
        print(f"   {step:<30} {status}")
    
    print(f"\n🎯 RESUMEN:")
    print(f"   Pasos exitosos: {successful}/{total}")
    print(f"   Porcentaje: {(successful/total)*100:.1f}%")
    
    if successful == total:
        print("\n🎉 INSTALACIÓN COMPLETADA EXITOSAMENTE")
        print("✅ Gmail Extractor listo para usar")
        print("✅ Todas las dependencias instaladas")
        print("✅ Configuración creada")
        print("✅ Scripts de prueba disponibles")
        print()
        print("📋 PRÓXIMOS PASOS:")
        print("   1. Configurar clave API de Gemini en config.py")
        print("   2. Verificar configuración de base de datos")
        print("   3. Ejecutar: python test_gmail_extractor_basic.py")
        print("   4. Iniciar el sistema VITAL RED")
        print("   5. Acceder a /vital-red/gmail-extractor")
        
    else:
        print("\n❌ INSTALACIÓN INCOMPLETA")
        print(f"⚠️  {total - successful} paso(s) fallaron")
        print("🔧 Revisar errores y ejecutar nuevamente")
        print()
        print("📋 PASOS FALLIDOS:")
        for step, result in zip(installation_steps, results):
            if not result:
                print(f"   - {step}")
    
    print("\n" + "=" * 80)
    print("📈 VEREDICTO FINAL")
    print("=" * 80)
    
    if successful == total:
        print("🎉 ¡GMAIL EXTRACTOR COMPLETAMENTE INSTALADO!")
        print("🚀 SISTEMA LISTO PARA EXTRACCIÓN MASIVA")
    else:
        print("❌ Instalación requiere correcciones")
        print("🔧 Revisar errores y repetir instalación")
    
    print("=" * 80)
    
    return successful == total

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡FELICITACIONES!")
            print("🏆 Gmail Extractor instalado exitosamente")
            print("🚀 Sistema listo para extracción masiva")
        else:
            print("\n🔧 CORRECCIONES REQUERIDAS")
            print("❌ Algunos pasos fallaron")
            print("🔄 Revisar y ejecutar nuevamente")
        
        input("\nPresione Enter para continuar...")
        sys.exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Instalación cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado en instalación: {e}")
        sys.exit(1)
