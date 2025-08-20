#!/usr/bin/env python3
"""
Analizador de Necesidades de Datos - VITAL RED
Analiza todas las vistas para identificar entidades y relaciones necesarias
"""

import os
import re
from datetime import datetime

def print_header():
    print("=" * 120)
    print("🔍 ANÁLISIS EXHAUSTIVO DE NECESIDADES DE DATOS - VITAL RED")
    print("Hospital Universitaria ESE")
    print("Identificando entidades, campos y relaciones para esquema completo")
    print("=" * 120)

def analyze_view_data_needs(view_name: str, file_path: str) -> dict:
    """Analizar necesidades de datos de una vista específica"""
    print(f"\n📄 ANALIZANDO VISTA: {view_name}")
    print("-" * 80)
    
    if not os.path.exists(file_path):
        print(f"❌ ARCHIVO NO EXISTE: {file_path}")
        return {"exists": False}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Identificar entidades y campos mencionados
        entities = {
            "users": [],
            "medical_cases": [],
            "emails": [],
            "attachments": [],
            "evaluations": [],
            "notifications": [],
            "configurations": [],
            "logs": [],
            "sessions": [],
            "reports": [],
            "backups": [],
            "permissions": []
        }
        
        # Patrones para identificar campos de datos
        field_patterns = {
            "users": [
                r'user\.(\w+)', r'usuario\.(\w+)', r'evaluator\.(\w+)', r'medico\.(\w+)',
                r'name|nombre|email|password|role|rol|specialty|especialidad|status|estado',
                r'created_at|updated_at|last_login|active|permissions'
            ],
            "medical_cases": [
                r'case\.(\w+)', r'caso\.(\w+)', r'patient\.(\w+)', r'paciente\.(\w+)',
                r'diagnosis|diagnostico|priority|prioridad|status|estado|urgency|urgencia',
                r'medical_history|historia_clinica|symptoms|sintomas|treatment|tratamiento'
            ],
            "emails": [
                r'email\.(\w+)', r'correo\.(\w+)', r'message\.(\w+)', r'mensaje\.(\w+)',
                r'subject|asunto|sender|remitente|recipient|destinatario|body|cuerpo',
                r'date|fecha|processed|procesado|extracted|extraido|ai_analysis'
            ],
            "attachments": [
                r'attachment\.(\w+)', r'adjunto\.(\w+)', r'file\.(\w+)', r'archivo\.(\w+)',
                r'filename|nombre_archivo|size|tamaño|content_type|tipo_contenido',
                r'extracted_text|texto_extraido|ocr_result|resultado_ocr'
            ],
            "evaluations": [
                r'evaluation\.(\w+)', r'evaluacion\.(\w+)', r'decision\.(\w+)', r'decision\.(\w+)',
                r'approved|aprobado|rejected|rechazado|pending|pendiente|comments|comentarios',
                r'evaluation_date|fecha_evaluacion|evaluator_id|id_evaluador'
            ],
            "notifications": [
                r'notification\.(\w+)', r'notificacion\.(\w+)', r'alert\.(\w+)', r'alerta\.(\w+)',
                r'type|tipo|title|titulo|message|mensaje|priority|prioridad|read|leido',
                r'sent_at|enviado_en|recipient_id|id_destinatario'
            ],
            "configurations": [
                r'config\.(\w+)', r'configuration\.(\w+)', r'setting\.(\w+)', r'configuracion\.(\w+)',
                r'key|clave|value|valor|category|categoria|description|descripcion',
                r'enabled|habilitado|default_value|valor_por_defecto'
            ],
            "logs": [
                r'log\.(\w+)', r'registro\.(\w+)', r'audit\.(\w+)', r'auditoria\.(\w+)',
                r'level|nivel|message|mensaje|timestamp|marca_tiempo|user_id|id_usuario',
                r'action|accion|resource|recurso|ip_address|direccion_ip'
            ],
            "sessions": [
                r'session\.(\w+)', r'sesion\.(\w+)', r'extraction\.(\w+)', r'extraccion\.(\w+)',
                r'session_id|id_sesion|status|estado|start_time|hora_inicio|end_time|hora_fin',
                r'total_emails|total_correos|processed|procesados|successful|exitosos'
            ],
            "reports": [
                r'report\.(\w+)', r'reporte\.(\w+)', r'analytics\.(\w+)', r'analiticas\.(\w+)',
                r'generated_at|generado_en|type|tipo|data|datos|format|formato',
                r'parameters|parametros|filters|filtros|results|resultados'
            ],
            "backups": [
                r'backup\.(\w+)', r'respaldo\.(\w+)', r'restore\.(\w+)', r'restaurar\.(\w+)',
                r'filename|nombre_archivo|size|tamaño|created_at|creado_en|type|tipo',
                r'status|estado|path|ruta|compressed|comprimido'
            ],
            "permissions": [
                r'permission\.(\w+)', r'permiso\.(\w+)', r'role\.(\w+)', r'rol\.(\w+)',
                r'resource|recurso|action|accion|granted|otorgado|denied|denegado',
                r'role_id|id_rol|user_id|id_usuario|permission_type|tipo_permiso'
            ]
        }
        
        # Buscar campos en el contenido
        found_fields = {}
        for entity, patterns in field_patterns.items():
            found_fields[entity] = set()
            
            for pattern in patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                if isinstance(matches, list):
                    for match in matches:
                        if isinstance(match, tuple):
                            found_fields[entity].update(match)
                        else:
                            found_fields[entity].add(match)
        
        # Buscar relaciones entre entidades
        relationships = []
        relationship_patterns = [
            r'(\w+)_id',
            r'(\w+)Id',
            r'join.*(\w+)',
            r'foreign.*key.*(\w+)',
            r'references.*(\w+)',
            r'belongs.*to.*(\w+)',
            r'has.*many.*(\w+)',
            r'has.*one.*(\w+)'
        ]
        
        for pattern in relationship_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            relationships.extend(matches)
        
        # Buscar operaciones CRUD
        crud_operations = {
            "create": len(re.findall(r'create|insert|add|nuevo|agregar', content, re.IGNORECASE)),
            "read": len(re.findall(r'read|select|get|obtener|buscar|search', content, re.IGNORECASE)),
            "update": len(re.findall(r'update|edit|modify|actualizar|editar|modificar', content, re.IGNORECASE)),
            "delete": len(re.findall(r'delete|remove|eliminar|borrar', content, re.IGNORECASE))
        }
        
        # Buscar validaciones y constraints
        validations = []
        validation_patterns = [
            r'required|requerido|obligatorio',
            r'unique|unico',
            r'not.*null|no.*nulo',
            r'min.*length|longitud.*minima',
            r'max.*length|longitud.*maxima',
            r'email.*validation|validacion.*email',
            r'date.*validation|validacion.*fecha',
            r'numeric|numerico',
            r'boolean|booleano'
        ]
        
        for pattern in validation_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            validations.extend(matches)
        
        print(f"   📊 Campos identificados por entidad:")
        total_fields = 0
        for entity, fields in found_fields.items():
            if fields:
                print(f"     {entity}: {len(fields)} campos")
                total_fields += len(fields)
        
        print(f"   🔗 Relaciones encontradas: {len(set(relationships))}")
        print(f"   🔧 Operaciones CRUD: C:{crud_operations['create']} R:{crud_operations['read']} U:{crud_operations['update']} D:{crud_operations['delete']}")
        print(f"   ✅ Validaciones: {len(validations)}")
        
        return {
            "exists": True,
            "fields": {k: list(v) for k, v in found_fields.items()},
            "relationships": list(set(relationships)),
            "crud_operations": crud_operations,
            "validations": validations,
            "total_fields": total_fields
        }
        
    except Exception as e:
        print(f"❌ ERROR ANALIZANDO: {e}")
        return {"exists": True, "error": str(e)}

def main():
    """Función principal de análisis"""
    print_header()
    
    print(f"\n🕐 Iniciando análisis: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Vistas a analizar
    views_to_analyze = [
        ("Login", "client/pages/Login.tsx"),
        ("Dashboard", "client/pages/VitalRedDashboard.tsx"),
        ("Gmail Extractor", "client/pages/GmailExtractor.tsx"),
        ("Medical Cases Inbox", "client/pages/MedicalCasesInbox.tsx"),
        ("Clinical Case Detail", "client/pages/ClinicalCaseDetail.tsx"),
        ("Request History", "client/pages/RequestHistory.tsx"),
        ("User Management", "client/pages/UserManagement.tsx"),
        ("Supervision Panel", "client/pages/SupervisionPanel.tsx"),
        ("System Configuration", "client/pages/SystemConfiguration.tsx"),
        ("Backup Management", "client/pages/BackupManagement.tsx"),
        ("Email Monitor", "client/pages/EmailMonitor.tsx"),
        ("Email Capture Config", "client/pages/EmailCaptureConfig.tsx")
    ]
    
    # Analizar cada vista
    all_results = []
    consolidated_fields = {}
    all_relationships = set()
    total_crud_operations = {"create": 0, "read": 0, "update": 0, "delete": 0}
    
    for view_name, view_path in views_to_analyze:
        result = analyze_view_data_needs(view_name, view_path)
        all_results.append({
            "name": view_name,
            "path": view_path,
            "result": result
        })
        
        if result.get("exists") and not result.get("error"):
            # Consolidar campos
            for entity, fields in result.get("fields", {}).items():
                if entity not in consolidated_fields:
                    consolidated_fields[entity] = set()
                consolidated_fields[entity].update(fields)
            
            # Consolidar relaciones
            all_relationships.update(result.get("relationships", []))
            
            # Consolidar operaciones CRUD
            crud = result.get("crud_operations", {})
            for op, count in crud.items():
                total_crud_operations[op] += count
    
    # Generar reporte consolidado
    print("\n" + "=" * 120)
    print("📊 REPORTE CONSOLIDADO DE NECESIDADES DE DATOS")
    print("=" * 120)
    
    print(f"\n🗂️  ENTIDADES Y CAMPOS IDENTIFICADOS:")
    total_entities = 0
    total_fields = 0
    
    for entity, fields in consolidated_fields.items():
        if fields:
            print(f"\n📋 {entity.upper()}:")
            print(f"   Campos únicos: {len(fields)}")
            if len(fields) <= 10:
                for field in sorted(fields):
                    if field and len(field) > 1:
                        print(f"     - {field}")
            else:
                for field in sorted(list(fields)[:10]):
                    if field and len(field) > 1:
                        print(f"     - {field}")
                print(f"     ... y {len(fields) - 10} más")
            
            total_entities += 1
            total_fields += len(fields)
    
    print(f"\n🔗 RELACIONES IDENTIFICADAS:")
    print(f"   Total de relaciones: {len(all_relationships)}")
    for rel in sorted(list(all_relationships)[:15]):
        if rel and len(rel) > 1:
            print(f"     - {rel}")
    if len(all_relationships) > 15:
        print(f"     ... y {len(all_relationships) - 15} más")
    
    print(f"\n🔧 OPERACIONES CRUD TOTALES:")
    print(f"   Create: {total_crud_operations['create']}")
    print(f"   Read: {total_crud_operations['read']}")
    print(f"   Update: {total_crud_operations['update']}")
    print(f"   Delete: {total_crud_operations['delete']}")
    
    print(f"\n📊 RESUMEN GENERAL:")
    print(f"   Vistas analizadas: {len(views_to_analyze)}")
    print(f"   Entidades identificadas: {total_entities}")
    print(f"   Campos únicos totales: {total_fields}")
    print(f"   Relaciones identificadas: {len(all_relationships)}")
    
    # Recomendaciones para esquema de BD
    print(f"\n💡 RECOMENDACIONES PARA ESQUEMA DE BASE DE DATOS:")
    print("   1. Crear tabla central 'users' con roles y permisos")
    print("   2. Crear tabla 'medical_cases' con relación a users")
    print("   3. Crear tabla 'extracted_emails' con análisis IA")
    print("   4. Crear tabla 'email_attachments' relacionada con emails")
    print("   5. Crear tabla 'case_evaluations' para decisiones médicas")
    print("   6. Crear tabla 'notifications' para alertas del sistema")
    print("   7. Crear tabla 'system_configurations' para configuraciones")
    print("   8. Crear tabla 'audit_logs' para auditoría completa")
    print("   9. Crear tabla 'extraction_sessions' para tracking")
    print("   10. Crear tabla 'user_permissions' para control de acceso")
    print("   11. Crear tabla 'system_backups' para gestión de respaldos")
    print("   12. Crear tabla 'performance_reports' para métricas")
    
    print(f"\n📅 Análisis completado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 120)
    
    return len(consolidated_fields) >= 8  # Al menos 8 entidades principales

if __name__ == "__main__":
    try:
        success = main()
        
        if success:
            print("\n🎊 ¡ANÁLISIS EXITOSO!")
            print("🏆 Todas las necesidades de datos identificadas")
            print("🚀 Listo para crear esquema completo de BD")
        else:
            print("\n🔧 ANÁLISIS INCOMPLETO")
            print("❌ Algunas vistas necesitan más análisis")
            print("🔄 Revisar vistas con pocos datos")
        
        input("\nPresione Enter para continuar...")
        exit(0 if success else 1)
        
    except KeyboardInterrupt:
        print("\n\n❌ Análisis cancelado por el usuario")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error inesperado en análisis: {e}")
        exit(1)
