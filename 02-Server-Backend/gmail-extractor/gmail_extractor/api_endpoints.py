"""
API Endpoints - VITAL RED Gmail Extractor
Endpoints para la funcionalidad avanzada de extracción de Gmail
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime
import asyncio
import logging

from .batch_processor import BatchProcessor, create_batch_processor
from .core_extractor import DEFAULT_CONFIG

# Router para endpoints de extracción
extraction_router = APIRouter(prefix="/api/gmail-extractor", tags=["Gmail Extractor"])

# Instancia global del procesador
global_processor: Optional[BatchProcessor] = None

# Modelos Pydantic
class ExtractionRequest(BaseModel):
    email: EmailStr
    password: str
    max_emails: int = 300
    gemini_api_key: Optional[str] = None
    headless: bool = True

class ExtractionConfig(BaseModel):
    gemini_api_key: Optional[str] = None
    headless: bool = True
    max_emails: int = 300
    download_attachments: bool = True
    process_pdfs: bool = True

class ExtractionResponse(BaseModel):
    session_id: str
    status: str
    message: str

class ProgressResponse(BaseModel):
    session_id: str
    status: str
    total_emails: int
    processed_emails: int
    successful_extractions: int
    failed_extractions: int
    success_rate: float
    elapsed_time_seconds: float
    estimated_completion: Optional[str]
    current_email_id: Optional[str]
    errors_count: int

class EmailSearchRequest(BaseModel):
    query: Optional[str] = None
    sender: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    has_attachments: Optional[bool] = None
    limit: int = 50
    offset: int = 0

# Dependency para obtener procesador
def get_processor() -> BatchProcessor:
    global global_processor
    if not global_processor:
        global_processor = create_batch_processor()
    return global_processor

# Endpoints principales
@extraction_router.post("/start", response_model=ExtractionResponse)
async def start_extraction(
    request: ExtractionRequest,
    background_tasks: BackgroundTasks,
    processor: BatchProcessor = Depends(get_processor)
):
    """Iniciar extracción masiva de correos de Gmail"""
    try:
        # Validar que no haya otra extracción en progreso
        if processor.is_running:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya hay una extracción en progreso"
            )
        
        # Configurar procesador si se proporciona clave de Gemini
        if request.gemini_api_key:
            processor.config['gemini_api_key'] = request.gemini_api_key
        
        processor.config['headless'] = request.headless
        
        # Iniciar extracción en background
        session_id = await processor.start_batch_extraction(
            email=request.email,
            password=request.password,
            max_emails=request.max_emails
        )
        
        return ExtractionResponse(
            session_id=session_id,
            status="started",
            message=f"Extracción iniciada para {request.max_emails} correos"
        )
        
    except Exception as e:
        logging.error(f"Error iniciando extracción: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error iniciando extracción: {str(e)}"
        )

@extraction_router.get("/progress", response_model=ProgressResponse)
async def get_extraction_progress(processor: BatchProcessor = Depends(get_processor)):
    """Obtener progreso de la extracción actual"""
    try:
        stats = processor.get_extraction_stats()
        
        if not stats:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hay extracción en progreso"
            )
        
        return ProgressResponse(**stats)
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error obteniendo progreso: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo progreso: {str(e)}"
        )

@extraction_router.post("/pause")
async def pause_extraction(processor: BatchProcessor = Depends(get_processor)):
    """Pausar extracción actual"""
    try:
        if not processor.is_running:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hay extracción en progreso"
            )
        
        processor.pause_extraction()
        
        return {"message": "Extracción pausada", "status": "paused"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error pausando extracción: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error pausando extracción: {str(e)}"
        )

@extraction_router.post("/resume")
async def resume_extraction(processor: BatchProcessor = Depends(get_processor)):
    """Reanudar extracción pausada"""
    try:
        if not processor.is_running:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hay extracción en progreso"
            )
        
        processor.resume_extraction()
        
        return {"message": "Extracción reanudada", "status": "running"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error reanudando extracción: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error reanudando extracción: {str(e)}"
        )

@extraction_router.post("/stop")
async def stop_extraction(processor: BatchProcessor = Depends(get_processor)):
    """Detener extracción actual"""
    try:
        if not processor.is_running:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No hay extracción en progreso"
            )
        
        processor.stop_extraction()
        
        return {"message": "Extracción detenida", "status": "stopped"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deteniendo extracción: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deteniendo extracción: {str(e)}"
        )

@extraction_router.get("/emails")
async def search_extracted_emails(request: EmailSearchRequest = Depends()):
    """Buscar correos extraídos"""
    try:
        import mysql.connector
        from mysql.connector import Error
        
        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        cursor = connection.cursor(dictionary=True)
        
        # Construir query
        where_conditions = []
        params = []
        
        if request.query:
            where_conditions.append("(subject LIKE %s OR body_text LIKE %s)")
            params.extend([f"%{request.query}%", f"%{request.query}%"])
        
        if request.sender:
            where_conditions.append("sender LIKE %s")
            params.append(f"%{request.sender}%")
        
        if request.date_from:
            where_conditions.append("date >= %s")
            params.append(request.date_from)
        
        if request.date_to:
            where_conditions.append("date <= %s")
            params.append(request.date_to)
        
        if request.has_attachments is not None:
            if request.has_attachments:
                where_conditions.append("JSON_LENGTH(attachments) > 0")
            else:
                where_conditions.append("JSON_LENGTH(attachments) = 0")
        
        # Query principal
        where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
        
        query = f"""
        SELECT id, subject, sender, date, 
               JSON_LENGTH(attachments) as attachment_count,
               SUBSTRING(body_text, 1, 200) as preview,
               processed_at, extraction_method
        FROM extracted_emails 
        WHERE {where_clause}
        ORDER BY date DESC 
        LIMIT %s OFFSET %s
        """
        
        params.extend([request.limit, request.offset])
        cursor.execute(query, params)
        emails = cursor.fetchall()
        
        # Query para contar total
        count_query = f"SELECT COUNT(*) as total FROM extracted_emails WHERE {where_clause}"
        cursor.execute(count_query, params[:-2])  # Excluir LIMIT y OFFSET
        total_count = cursor.fetchone()['total']
        
        cursor.close()
        connection.close()
        
        return {
            "emails": emails,
            "total": total_count,
            "limit": request.limit,
            "offset": request.offset
        }
        
    except Exception as e:
        logging.error(f"Error buscando correos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error buscando correos: {str(e)}"
        )

@extraction_router.get("/emails/{email_id}")
async def get_email_detail(email_id: str):
    """Obtener detalle completo de un correo"""
    try:
        import mysql.connector
        from mysql.connector import Error
        
        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        cursor = connection.cursor(dictionary=True)
        
        # Obtener correo
        cursor.execute("SELECT * FROM extracted_emails WHERE id = %s", (email_id,))
        email = cursor.fetchone()
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Correo no encontrado"
            )
        
        # Obtener archivos adjuntos
        cursor.execute(
            "SELECT id, filename, content_type, size_bytes, extracted_text FROM email_attachments WHERE email_id = %s",
            (email_id,)
        )
        attachments = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        # Parsear campos JSON
        import json
        if email['recipients']:
            email['recipients'] = json.loads(email['recipients'])
        if email['attachments']:
            email['attachments'] = json.loads(email['attachments'])
        if email['metadata']:
            email['metadata'] = json.loads(email['metadata'])
        if email['ai_analysis']:
            email['ai_analysis'] = json.loads(email['ai_analysis'])
        
        email['attachment_details'] = attachments
        
        return email
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error obteniendo detalle de correo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo detalle de correo: {str(e)}"
        )

@extraction_router.get("/stats")
async def get_extraction_stats():
    """Obtener estadísticas generales de extracción"""
    try:
        import mysql.connector
        from mysql.connector import Error
        
        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        cursor = connection.cursor(dictionary=True)
        
        # Estadísticas generales
        stats_queries = {
            'total_emails': "SELECT COUNT(*) as count FROM extracted_emails",
            'emails_with_attachments': "SELECT COUNT(*) as count FROM extracted_emails WHERE JSON_LENGTH(attachments) > 0",
            'emails_with_ai_analysis': "SELECT COUNT(*) as count FROM extracted_emails WHERE ai_analysis IS NOT NULL",
            'total_attachments': "SELECT COUNT(*) as count FROM email_attachments",
            'extraction_methods': "SELECT extraction_method, COUNT(*) as count FROM extracted_emails GROUP BY extraction_method"
        }
        
        stats = {}
        
        for key, query in stats_queries.items():
            cursor.execute(query)
            if key == 'extraction_methods':
                stats[key] = cursor.fetchall()
            else:
                result = cursor.fetchone()
                stats[key] = result['count'] if result else 0
        
        # Estadísticas por fecha
        cursor.execute("""
            SELECT DATE(processed_at) as date, COUNT(*) as count 
            FROM extracted_emails 
            WHERE processed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(processed_at) 
            ORDER BY date DESC
        """)
        stats['daily_extractions'] = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return stats
        
    except Exception as e:
        logging.error(f"Error obteniendo estadísticas: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo estadísticas: {str(e)}"
        )

@extraction_router.delete("/emails/{email_id}")
async def delete_extracted_email(email_id: str):
    """Eliminar correo extraído"""
    try:
        import mysql.connector
        from mysql.connector import Error
        
        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )
        
        cursor = connection.cursor()
        
        # Eliminar archivos adjuntos primero
        cursor.execute("DELETE FROM email_attachments WHERE email_id = %s", (email_id,))
        
        # Eliminar correo
        cursor.execute("DELETE FROM extracted_emails WHERE id = %s", (email_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Correo no encontrado"
            )
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return {"message": "Correo eliminado exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error eliminando correo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error eliminando correo: {str(e)}"
        )

# Endpoint para configuración
@extraction_router.post("/config")
async def update_extraction_config(config: ExtractionConfig):
    """Actualizar configuración de extracción"""
    try:
        global global_processor
        
        # Actualizar configuración global
        if global_processor:
            global_processor.config.update(config.dict(exclude_unset=True))
        
        # Actualizar configuración por defecto
        DEFAULT_CONFIG.update(config.dict(exclude_unset=True))
        
        return {"message": "Configuración actualizada", "config": config.dict()}
        
    except Exception as e:
        logging.error(f"Error actualizando configuración: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error actualizando configuración: {str(e)}"
        )

@extraction_router.get("/config")
async def get_extraction_config():
    """Obtener configuración actual"""
    return DEFAULT_CONFIG

@extraction_router.post("/test-gemini")
async def test_gemini_connection(request: dict):
    """Probar conexión con Gemini AI"""
    try:
        import google.generativeai as genai

        api_key = request.get('api_key')
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Clave API requerida"
            )

        # Configurar Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        # Probar generación simple
        response = model.generate_content("Test connection")

        if response.text:
            return {"success": True, "message": "Conexión exitosa con Gemini AI"}
        else:
            return {"success": False, "message": "No se pudo generar contenido"}

    except Exception as e:
        logging.error(f"Error probando Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error probando conexión con Gemini: {str(e)}"
        )

@extraction_router.get("/attachments/{attachment_id}/download")
async def download_attachment(attachment_id: int):
    """Descargar archivo adjunto"""
    try:
        import mysql.connector
        from mysql.connector import Error

        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )

        cursor = connection.cursor()

        # Obtener archivo adjunto
        cursor.execute(
            "SELECT filename, content_type, content FROM email_attachments WHERE id = %s",
            (attachment_id,)
        )
        attachment = cursor.fetchone()

        if not attachment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Archivo adjunto no encontrado"
            )

        filename, content_type, content = attachment

        cursor.close()
        connection.close()

        from fastapi.responses import Response

        return Response(
            content=content,
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error descargando archivo adjunto: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error descargando archivo adjunto: {str(e)}"
        )

@extraction_router.get("/export")
async def export_emails(
    format: str = "csv",
    query: Optional[str] = None,
    sender: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    has_attachments: Optional[bool] = None
):
    """Exportar correos extraídos"""
    try:
        import mysql.connector
        from mysql.connector import Error
        import csv
        import json
        import io

        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )

        cursor = connection.cursor(dictionary=True)

        # Construir query (similar al endpoint de búsqueda)
        where_conditions = []
        params = []

        if query:
            where_conditions.append("(subject LIKE %s OR body_text LIKE %s)")
            params.extend([f"%{query}%", f"%{query}%"])

        if sender:
            where_conditions.append("sender LIKE %s")
            params.append(f"%{sender}%")

        if date_from:
            where_conditions.append("date >= %s")
            params.append(date_from)

        if date_to:
            where_conditions.append("date <= %s")
            params.append(date_to)

        if has_attachments is not None:
            if has_attachments:
                where_conditions.append("JSON_LENGTH(attachments) > 0")
            else:
                where_conditions.append("JSON_LENGTH(attachments) = 0")

        where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"

        query_sql = f"""
        SELECT id, subject, sender, date, body_text,
               JSON_LENGTH(attachments) as attachment_count,
               processed_at, extraction_method
        FROM extracted_emails
        WHERE {where_clause}
        ORDER BY date DESC
        """

        cursor.execute(query_sql, params)
        emails = cursor.fetchall()

        cursor.close()
        connection.close()

        # Generar archivo según formato
        if format.lower() == 'csv':
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=emails[0].keys() if emails else [])
            writer.writeheader()
            writer.writerows(emails)
            content = output.getvalue()
            media_type = "text/csv"

        elif format.lower() == 'json':
            content = json.dumps(emails, default=str, indent=2)
            media_type = "application/json"

        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato no soportado. Use 'csv' o 'json'"
            )

        from fastapi.responses import Response

        return Response(
            content=content,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename=correos_extraidos.{format}"}
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error exportando correos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exportando correos: {str(e)}"
        )

@extraction_router.get("/logs")
async def get_extraction_logs(session_id: Optional[str] = None):
    """Obtener logs de extracción"""
    try:
        import mysql.connector
        from mysql.connector import Error

        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )

        cursor = connection.cursor(dictionary=True)

        if session_id:
            cursor.execute(
                "SELECT * FROM extraction_logs WHERE session_id = %s ORDER BY created_at DESC",
                (session_id,)
            )
        else:
            cursor.execute(
                "SELECT * FROM extraction_logs ORDER BY created_at DESC LIMIT 100"
            )

        logs = cursor.fetchall()

        cursor.close()
        connection.close()

        return logs

    except Exception as e:
        logging.error(f"Error obteniendo logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo logs: {str(e)}"
        )

@extraction_router.post("/cleanup")
async def cleanup_old_data(request: dict):
    """Limpiar datos antiguos"""
    try:
        import mysql.connector
        from mysql.connector import Error
        from datetime import timedelta

        days_old = request.get('days_old', 30)
        cutoff_date = datetime.now() - timedelta(days=days_old)

        # Conectar a base de datos
        connection = mysql.connector.connect(
            host=DEFAULT_CONFIG['db_host'],
            port=DEFAULT_CONFIG['db_port'],
            user=DEFAULT_CONFIG['db_user'],
            password=DEFAULT_CONFIG['db_password'],
            database=DEFAULT_CONFIG['db_name']
        )

        cursor = connection.cursor()

        # Eliminar archivos adjuntos antiguos
        cursor.execute(
            "DELETE FROM email_attachments WHERE email_id IN (SELECT id FROM extracted_emails WHERE processed_at < %s)",
            (cutoff_date,)
        )

        # Eliminar correos antiguos
        cursor.execute(
            "DELETE FROM extracted_emails WHERE processed_at < %s",
            (cutoff_date,)
        )

        deleted_count = cursor.rowcount

        # Eliminar logs antiguos
        cursor.execute(
            "DELETE FROM extraction_logs WHERE created_at < %s",
            (cutoff_date,)
        )

        connection.commit()
        cursor.close()
        connection.close()

        return {
            "message": f"Datos anteriores a {days_old} días eliminados",
            "deleted_count": deleted_count
        }

    except Exception as e:
        logging.error(f"Error limpiando datos: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error limpiando datos: {str(e)}"
        )
