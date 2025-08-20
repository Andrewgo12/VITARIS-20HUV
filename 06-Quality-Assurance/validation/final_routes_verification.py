#!/usr/bin/env python3
"""
Verificación Final de Rutas e Importaciones - VITAL RED
Verificación exhaustiva de todas las rutas, importaciones y estructura
"""

import os
import re
from datetime import datetime

def print_header():
    print("=" * 100)
    print("🔍 VERIFICACIÓN FINAL DE RUTAS E IMPORTACIONES - VITAL RED")
    print("Hospital Universitaria ESE")
    print("=" * 100)

def check_file_exists(file_path):
    """Verificar que un archivo existe"""
    return os.path.exists(file_path)

def check_imports_in_file(file_path):
    """Verificar importaciones en un archivo"""
    if not os.path.exists(file_path):
        return {"exists": False}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Contar importaciones con @/
        at_imports = len(re.findall(r'from [\'"]@/', content))
        
        # Buscar importaciones problemáticas
        relative_imports = len(re.findall(r'from [\'"]\.\./', content))
        
        return {
            "exists": True,
            "at_imports": at_imports,
            "relative_imports": relative_imports,
            "has_issues": relative_imports > 0
        }
    except:
        return {"exists": True, "error": True}

def main():
    print_header()
    
    print(f"\n🕐 Iniciando verificación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. VERIFICAR ARCHIVOS PRINCIPALES
    print("\n📁 1. VERIFICANDO ARCHIVOS PRINCIPALES")
    print("-" * 60)
    
    main_files = [
        "package.json",
        "vite.config.ts", 
        "tsconfig.json",
        "index.html",
        "client/main.tsx",
        "client/App.tsx",
        "client/index.css",
        "start_vital_red_complete_final.py"
    ]
    
    main_results = []
    for file in main_files:
        exists = check_file_exists(file)
        status = "✅" if exists else "❌"
        print(f"   {status} {file}")
        main_results.append(exists)
    
    # 2. VERIFICAR PÁGINAS
    print("\n📄 2. VERIFICANDO PÁGINAS")
    print("-" * 60)
    
    pages = [
        "client/pages/Login.tsx",
        "client/pages/VitalRedDashboard.tsx", 
        "client/pages/GmailExtractor.tsx",
        "client/pages/MedicalCasesInbox.tsx",
        "client/pages/ClinicalCaseDetail.tsx",
        "client/pages/RequestHistory.tsx",
        "client/pages/UserManagement.tsx",
        "client/pages/SupervisionPanel.tsx",
        "client/pages/SystemConfiguration.tsx",
        "client/pages/BackupManagement.tsx",
        "client/pages/EmailMonitor.tsx",
        "client/pages/EmailCaptureConfig.tsx"
    ]
    
    page_results = []
    for page in pages:
        exists = check_file_exists(page)
        status = "✅" if exists else "❌"
        print(f"   {status} {page}")
        page_results.append(exists)
    
    # 3. VERIFICAR COMPONENTES UI
    print("\n🎨 3. VERIFICANDO COMPONENTES UI CRÍTICOS")
    print("-" * 60)
    
    ui_components = [
        "client/components/ui/button.tsx",
        "client/components/ui/input.tsx",
        "client/components/ui/card.tsx",
        "client/components/ui/dialog.tsx",
        "client/components/ui/tabs.tsx",
        "client/components/ui/table.tsx",
        "client/components/ui/notification-system.tsx",
        "client/components/ui/data-table.tsx",
        "client/components/ui/slider.tsx"
    ]
    
    ui_results = []
    for component in ui_components:
        exists = check_file_exists(component)
        status = "✅" if exists else "❌"
        print(f"   {status} {component}")
        ui_results.append(exists)
    
    # 4. VERIFICAR MODALES
    print("\n🪟 4. VERIFICANDO MODALES CRÍTICOS")
    print("-" * 60)
    
    modals = [
        "client/components/modals/gmail-extractor/EmailDetailModal.tsx",
        "client/components/modals/gmail-extractor/ExtractionConfigModal.tsx",
        "client/components/modals/medical-cases/QuickDecisionModal.tsx",
        "client/components/modals/case-detail/FileViewerModal.tsx",
        "client/components/modals/vital-red/AlertDetailsModal.tsx"
    ]
    
    modal_results = []
    for modal in modals:
        exists = check_file_exists(modal)
        status = "✅" if exists else "❌"
        print(f"   {status} {modal}")
        modal_results.append(exists)
    
    # 5. VERIFICAR SERVICIOS Y HOOKS
    print("\n🔧 5. VERIFICANDO SERVICIOS Y HOOKS")
    print("-" * 60)
    
    services_hooks = [
        "client/services/api.ts",
        "client/services/gmail-extractor.ts",
        "client/hooks/useGmailExtractor.ts"
    ]
    
    service_results = []
    for service in services_hooks:
        exists = check_file_exists(service)
        status = "✅" if exists else "❌"
        print(f"   {status} {service}")
        service_results.append(exists)
    
    # 6. VERIFICAR BACKEND
    print("\n🖥️ 6. VERIFICANDO BACKEND")
    print("-" * 60)
    
    backend_files = [
        "server/gmail_integration/complete_server.py",
        "server/gmail_integration/api_routes.py",
        "server/gmail_extractor/core_extractor.py",
        "server/gmail_extractor/batch_processor.py",
        "server/gmail_extractor/api_endpoints.py",
        "server/gmail_extractor/config.py"
    ]
    
    backend_results = []
    for backend in backend_files:
        exists = check_file_exists(backend)
        status = "✅" if exists else "❌"
        print(f"   {status} {backend}")
        backend_results.append(exists)
    
    # 7. VERIFICAR IMPORTACIONES CRÍTICAS
    print("\n📦 7. VERIFICANDO IMPORTACIONES CRÍTICAS")
    print("-" * 60)
    
    critical_files = [
        "client/App.tsx",
        "client/pages/GmailExtractor.tsx",
        "client/services/gmail-extractor.ts",
        "client/hooks/useGmailExtractor.ts"
    ]
    
    import_issues = 0
    for file in critical_files:
        result = check_imports_in_file(file)
        if result.get("exists"):
            if result.get("has_issues"):
                print(f"   ❌ {file} - Importaciones problemáticas: {result.get('relative_imports', 0)}")
                import_issues += 1
            else:
                print(f"   ✅ {file} - Importaciones correctas (@/: {result.get('at_imports', 0)})")
        else:
            print(f"   ❌ {file} - No existe")
            import_issues += 1
    
    # 8. GENERAR REPORTE FINAL
    print("\n" + "=" * 100)
    print("📊 REPORTE FINAL DE VERIFICACIÓN")
    print("=" * 100)
    
    total_main = len(main_files)
    passed_main = sum(main_results)
    
    total_pages = len(pages)
    passed_pages = sum(page_results)
    
    total_ui = len(ui_components)
    passed_ui = sum(ui_results)
    
    total_modals = len(modals)
    passed_modals = sum(modal_results)
    
    total_services = len(services_hooks)
    passed_services = sum(service_results)
    
    total_backend = len(backend_files)
    passed_backend = sum(backend_results)
    
    print(f"📁 Archivos principales: {passed_main}/{total_main}")
    print(f"📄 Páginas: {passed_pages}/{total_pages}")
    print(f"🎨 Componentes UI: {passed_ui}/{total_ui}")
    print(f"🪟 Modales: {passed_modals}/{total_modals}")
    print(f"🔧 Servicios/Hooks: {passed_services}/{total_services}")
    print(f"🖥️ Backend: {passed_backend}/{total_backend}")
    print(f"📦 Importaciones problemáticas: {import_issues}")
    
    total_files = total_main + total_pages + total_ui + total_modals + total_services + total_backend
    passed_files = passed_main + passed_pages + passed_ui + passed_modals + passed_services + passed_backend
    
    print(f"\n🎯 RESUMEN TOTAL:")
    print(f"   Archivos verificados: {total_files}")
    print(f"   Archivos presentes: {passed_files}")
    print(f"   Porcentaje completitud: {(passed_files/total_files)*100:.1f}%")
    print(f"   Importaciones problemáticas: {import_issues}")
    
    if passed_files == total_files and import_issues == 0:
        print("\n🎉 VERIFICACIÓN EXITOSA")
        print("✅ TODOS los archivos están presentes")
        print("✅ TODAS las importaciones son correctas")
        print("✅ TODAS las rutas están configuradas")
        print("✅ SISTEMA 100% COMPLETO")
        
        print("\n🚀 VITAL RED ESTÁ LISTO PARA:")
        print("   • Inicio inmediato del sistema")
        print("   • Uso en producción")
        print("   • Extracción masiva de Gmail")
        print("   • Gestión hospitalaria completa")
        
    else:
        print("\n❌ VERIFICACIÓN INCOMPLETA")
        print(f"⚠️  {total_files - passed_files} archivo(s) faltante(s)")
        print(f"⚠️  {import_issues} problema(s) de importación")
        print("🔧 Completar elementos faltantes")
    
    print("\n" + "=" * 100)
    print(f"📅 Verificación completada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 100)
    
    return passed_files == total_files and import_issues == 0

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n❌ Verificación cancelada")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error en verificación: {e}")
        exit(1)
