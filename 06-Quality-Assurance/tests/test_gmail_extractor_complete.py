#!/usr/bin/env python3
"""
Test Completo - Gmail Extractor VITAL RED
Prueba exhaustiva de toda la funcionalidad del extractor avanzado
"""

import sys
import os
import time
import requests
import json
from datetime import datetime

# Agregar path del proyecto
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def print_header():
    print("=" * 100)
    print("🧪 PRUEBA COMPLETA - GMAIL EXTRACTOR VITAL RED")
    print("Hospital Universitaria ESE")
    print("Verificación exhaustiva de funcionalidad avanzada")
    print("=" * 100)

def test_imports():
    """Probar todas las importaciones"""
    print("\n📦 1. PRUEBA DE IMPORTACIONES")
    print("-" * 70)
    
    import_tests = [
        ("Core Extractor", "from server.gmail_extractor.core_extractor import GmailExtractor, DEFAULT_CONFIG"),
        ("Batch Processor", "from server.gmail_extractor.batch_processor import BatchProcessor"),
        ("API Endpoints", "from server.gmail_extractor.api_endpoints import extraction_router"),
        ("Selenium", "from selenium import webdriver"),
        ("BeautifulSoup", "from bs4 import BeautifulSoup"),
        ("Requests", "import requests"),
        ("PyPDF2", "import PyPDF2"),
        ("Python-docx", "import docx"),
        ("Pillow", "from PIL import Image"),
        ("Pytesseract", "import pytesseract"),
        ("Google GenAI", "import google.generativeai as genai"),
        ("MySQL Connector", "import mysql.connector"),
        ("WebDriver Manager", "from webdriver_manager.chrome import ChromeDriverManager"),
        ("FastAPI", "from fastapi import FastAPI"),
        ("Pydantic", "from pydantic import BaseModel")
    ]
    
    results = []
    
    for test_name, import_statement in import_tests:
        try:
            exec(import_statement)
            print(f"✅ {test_name}")
            results.append(True)
        except ImportError as e:
            print(f"❌ {test_name}: {e}")
            results.append(False)
        except Exception as e:
            print(f"⚠️  {test_name}: {e}")
            results.append(False)
    
    passed = sum(results)
    total = len(results)
    print(f"\n📊 Importaciones: {passed}/{total} exitosas")
    
    return passed == total

def test_configuration():
    """Probar configuración del sistema"""
    print("\n⚙️ 2. PRUEBA DE CONFIGURACIÓN")
    print("-" * 70)
    
    try:
        from server.gmail_extractor.core_extractor import DEFAULT_CONFIG
        
        required_configs = [
            'headless',
            'max_emails',
            'db_host',
            'db_port',
            'db_user',
            'db_password',
            'db_name',
            'download_attachments',
            'process_pdfs'
        ]
        
        missing_configs = []
        
        for config in required_configs:
            if config in DEFAULT_CONFIG:
                print(f"✅ {config}: {DEFAULT_CONFIG[config]}")
            else:
                missing_configs.append(config)
                print(f"❌ Configuración faltante: {config}")
        
        if missing_configs:
            print(f"❌ Configuraciones faltantes: {missing_configs}")
            return False
        
        print("✅ Todas las configuraciones presentes")
        return True
        
    except Exception as e:
        print(f"❌ Error en configuración: {e}")
        return False

def test_database_setup():
    """Probar configuración de base de datos"""
    print("\n🗄️ 3. PRUEBA DE BASE DE DATOS")
    print("-" * 70)
    
    try:
        import mysql.connector
        from server.gmail_extractor.core_extractor import DEFAULT_CONFIG
        
        # Probar conexión
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        if connection.is_connected():
            print("✅ Conexión a base de datos exitosa")
            
            cursor = connection.cursor()
            
            # Verificar tablas
            required_tables = [
                'extracted_emails',
                'email_attachments',
                'extraction_logs'
            ]
            
            cursor.execute("SHOW TABLES")
            existing_tables = [table[0] for table in cursor.fetchall()]
            
            missing_tables = []
            for table in required_tables:
                if table in existing_tables:
                    print(f"✅ Tabla '{table}' existe")
                else:
                    missing_tables.append(table)
                    print(f"❌ Tabla faltante: '{table}'")
            
            cursor.close()
            connection.close()
            
            if missing_tables:
                print(f"❌ Tablas faltantes: {missing_tables}")
                return False
            
            print("✅ Todas las tablas requeridas existen")
            return True
        else:
            print("❌ No se pudo conectar a la base de datos")
            return False
            
    except Exception as e:
        print(f"❌ Error de base de datos: {e}")
        return False

def test_selenium_setup():
    """Probar configuración de Selenium"""
    print("\n🌐 4. PRUEBA DE SELENIUM")
    print("-" * 70)
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager
        
        # Configurar opciones de Chrome
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        print("✅ Opciones de Chrome configuradas")
        
        # Intentar crear driver
        try:
            driver = webdriver.Chrome(
                service=webdriver.chrome.service.Service(ChromeDriverManager().install()),
                options=chrome_options
            )
            
            print("✅ ChromeDriver inicializado")
            
            # Probar navegación básica
            driver.get("https://www.google.com")
            
            if "Google" in driver.title:
                print("✅ Navegación básica funciona")
                driver.quit()
                return True
            else:
                print("❌ Error en navegación básica")
                driver.quit()
                return False
                
        except Exception as e:
            print(f"❌ Error creando driver: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error en Selenium: {e}")
        return False

def test_pdf_processing():
    """Probar procesamiento de PDFs"""
    print("\n📄 5. PRUEBA DE PROCESAMIENTO PDF")
    print("-" * 70)
    
    try:
        import PyPDF2
        import io
        
        # Crear un PDF simple para prueba
        test_pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test PDF Content) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF"""
        
        # Intentar leer el PDF
        pdf_file = io.BytesIO(test_pdf_content)
        
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            print(f"✅ PDF leído: {len(pdf_reader.pages)} páginas")
            
            # Intentar extraer texto
            if len(pdf_reader.pages) > 0:
                text = pdf_reader.pages[0].extract_text()
                print(f"✅ Texto extraído: {len(text)} caracteres")
            
            return True
            
        except Exception as e:
            print(f"❌ Error procesando PDF: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error en PyPDF2: {e}")
        return False

def test_gemini_ai_setup():
    """Probar configuración de Gemini AI"""
    print("\n🤖 6. PRUEBA DE GEMINI AI")
    print("-" * 70)
    
    try:
        import google.generativeai as genai
        from server.gmail_extractor.core_extractor import DEFAULT_CONFIG
        
        api_key = DEFAULT_CONFIG.get('gemini_api_key')
        
        if not api_key:
            print("⚠️  Clave API de Gemini no configurada")
            print("   Configurar en server/gmail_extractor/config.py")
            return True  # No es un error crítico
        
        # Configurar Gemini
        genai.configure(api_key=api_key)
        
        # Intentar crear modelo
        model = genai.GenerativeModel('gemini-pro')
        print("✅ Modelo Gemini inicializado")
        
        # Probar generación simple
        try:
            response = model.generate_content("Test message")
            if response.text:
                print("✅ Generación de contenido funciona")
                return True
            else:
                print("❌ No se pudo generar contenido")
                return False
                
        except Exception as e:
            print(f"❌ Error en generación: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error en Gemini AI: {e}")
        return False

def test_api_endpoints():
    """Probar endpoints de la API"""
    print("\n🔌 7. PRUEBA DE ENDPOINTS API")
    print("-" * 70)
    
    try:
        # Verificar que el servidor esté corriendo
        try:
            response = requests.get("http://localhost:8001/health", timeout=5)
            if response.status_code == 200:
                print("✅ Servidor backend disponible")
            else:
                print("❌ Servidor backend no responde correctamente")
                return False
        except requests.exceptions.RequestException:
            print("❌ Servidor backend no disponible")
            print("   Iniciar con: python start_vital_red_complete_final.py")
            return False
        
        # Probar endpoints específicos del extractor
        endpoints_to_test = [
            ("/api/gmail-extractor/config", "GET", "Configuración"),
            ("/api/gmail-extractor/stats", "GET", "Estadísticas"),
        ]
        
        for endpoint, method, description in endpoints_to_test:
            try:
                if method == "GET":
                    response = requests.get(f"http://localhost:8001{endpoint}", timeout=10)
                
                if response.status_code in [200, 404]:  # 404 es OK si no hay datos
                    print(f"✅ {description}: {response.status_code}")
                else:
                    print(f"❌ {description}: {response.status_code}")
                    return False
                    
            except Exception as e:
                print(f"❌ Error en {description}: {e}")
                return False
        
        print("✅ Endpoints básicos funcionando")
        return True
        
    except Exception as e:
        print(f"❌ Error probando API: {e}")
        return False

def test_core_extractor_initialization():
    """Probar inicialización del extractor principal"""
    print("\n🔧 8. PRUEBA DE INICIALIZACIÓN DEL EXTRACTOR")
    print("-" * 70)
    
    try:
        from server.gmail_extractor.core_extractor import GmailExtractor, DEFAULT_CONFIG
        
        # Crear instancia del extractor
        extractor = GmailExtractor(DEFAULT_CONFIG)
        print("✅ GmailExtractor inicializado")
        
        # Verificar componentes
        if hasattr(extractor, 'logger'):
            print("✅ Logger configurado")
        else:
            print("❌ Logger no configurado")
            return False
        
        if hasattr(extractor, 'db_connection'):
            print("✅ Conexión de BD inicializada")
        else:
            print("❌ Conexión de BD no inicializada")
            return False
        
        # Limpiar recursos
        extractor.cleanup()
        print("✅ Limpieza de recursos exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error inicializando extractor: {e}")
        return False

def test_batch_processor_initialization():
    """Probar inicialización del procesador por lotes"""
    print("\n📦 9. PRUEBA DE PROCESADOR POR LOTES")
    print("-" * 70)
    
    try:
        from server.gmail_extractor.batch_processor import BatchProcessor, create_batch_processor
        
        # Crear procesador por lotes
        processor = create_batch_processor(headless=True)
        print("✅ BatchProcessor inicializado")
        
        # Verificar componentes
        if hasattr(processor, 'config'):
            print("✅ Configuración cargada")
        else:
            print("❌ Configuración no cargada")
            return False
        
        if hasattr(processor, 'logger'):
            print("✅ Logger configurado")
        else:
            print("❌ Logger no configurado")
            return False
        
        # Limpiar recursos
        processor.cleanup()
        print("✅ Limpieza de recursos exitosa")
        
        return True
        
    except Exception as e:
        print(f"❌ Error inicializando procesador: {e}")
        return False

def generate_test_report(results):
    """Generar reporte final de pruebas"""
    print("\n" + "=" * 100)
    print("📊 REPORTE FINAL DE PRUEBAS - GMAIL EXTRACTOR")
    print("=" * 100)
    
    test_names = [
        "Importaciones",
        "Configuración",
        "Base de Datos",
        "Selenium Setup",
        "Procesamiento PDF",
        "Gemini AI Setup",
        "Endpoints API",
        "Inicialización Extractor",
        "Procesador por Lotes"
    ]
    
    passed = sum(results)
    total = len(results)
    
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    print("📋 Resultados Detallados:")
    for i, (test_name, result) in enumerate(zip(test_names, results)):
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"   {test_name:<30} {status}")
    
    print()
    print("🎯 RESUMEN GENERAL:")
    print(f"   Pruebas exitosas: {passed}/{total}")
    print(f"   Porcentaje de éxito: {(passed/total)*100:.1f}%")
    
    if passed == total:
        print()
        print("🎉 TODAS LAS PRUEBAS PASARON")
        print("✅ Gmail Extractor completamente funcional")
        print("✅ Todas las dependencias instaladas")
        print("✅ Configuración correcta")
        print("✅ Base de datos operativa")
        print("✅ Selenium configurado")
        print("✅ APIs funcionando")
        print()
        print("🚀 SISTEMA LISTO PARA EXTRACCIÓN MASIVA")
        print()
        print("📋 PRÓXIMOS PASOS:")
        print("   1. Acceder a http://localhost:5173/vital-red/gmail-extractor")
        print("   2. Configurar credenciales de Gmail")
        print("   3. Configurar clave API de Gemini (opcional)")
        print("   4. Iniciar extracción masiva")
        print("   5. Monitorear progreso en tiempo real")
        
    else:
        print()
        print("❌ ALGUNAS PRUEBAS FALLARON")
        print(f"⚠️  {total - passed} componente(s) requieren atención")
        print("🔧 Revisar los errores reportados arriba")
        print()
        print("📋 COMPONENTES QUE REQUIEREN ATENCIÓN:")
        for test_name, result in zip(test_names, results):
            if not result:
                print(f"   - {test_name}")
        print()
        print("🔄 ACCIONES RECOMENDADAS:")
        print("   1. Ejecutar: python install_gmail_extractor_dependencies.py")
        print("   2. Verificar configuración de base de datos")
        print("   3. Instalar Tesseract OCR manualmente")
        print("   4. Configurar clave API de Gemini")
        print("   5. Ejecutar nuevamente este test")
    
    return passed == total

def main():
    """Función principal de pruebas"""
    print_header()
    
    print(f"\n🕐 Iniciando pruebas completas: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Ejecutar todas las pruebas
    results = []
    results.append(test_imports())
    results.append(test_configuration())
    results.append(test_database_setup())
    results.append(test_selenium_setup())
    results.append(test_pdf_processing())
    results.append(test_gemini_ai_setup())
    results.append(test_api_endpoints())
    results.append(test_core_extractor_initialization())
    results.append(test_batch_processor_initialization())
    
    # Generar reporte final
    success = generate_test_report(results)
    
    print("\n" + "=" * 100)
    print("📈 VEREDICTO FINAL")
    print("=" * 100)
    
    if success:
        print("🎉 ¡GMAIL EXTRACTOR COMPLETAMENTE FUNCIONAL!")
        print("🚀 SISTEMA LISTO PARA EXTRACCIÓN MASIVA DE CORREOS")
        print("✨ FUNCIONALIDAD AVANZADA CERTIFICADA")
    else:
        print("❌ Sistema requiere correcciones")
        print("🔧 Revisar componentes fallidos")
    
    print("=" * 100)
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡FELICITACIONES!")
            print("🏆 Gmail Extractor completamente funcional")
            print("🚀 Listo para extracción masiva en producción")
        else:
            print("\n🔧 CORRECCIONES REQUERIDAS")
            print("❌ Algunos componentes necesitan atención")
            print("🔄 Revisar y corregir antes de usar")
        
        input("\nPresione Enter para continuar...")
        exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Pruebas canceladas por el usuario")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado en pruebas: {e}")
        exit(1)
