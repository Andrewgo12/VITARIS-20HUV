"""
Batch Processor - VITAL RED Gmail Extractor
Procesamiento masivo de hasta 300 correos con manejo robusto de errores
"""

import asyncio
import time
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Callable
import logging
from concurrent.futures import ThreadPoolExecutor
import threading
from dataclasses import dataclass

from .core_extractor import GmailExtractor, EmailData, DEFAULT_CONFIG

@dataclass
class BatchProgress:
    """Estado del procesamiento por lotes"""
    session_id: str
    total_emails: int
    processed_emails: int
    successful_extractions: int
    failed_extractions: int
    current_email_id: Optional[str]
    status: str  # 'running', 'paused', 'completed', 'failed'
    started_at: datetime
    estimated_completion: Optional[datetime]
    errors: List[Dict[str, str]]

class BatchProcessor:
    """Procesador masivo de correos de Gmail"""
    
    def __init__(self, config: Dict = None):
        self.config = {**DEFAULT_CONFIG, **(config or {})}
        self.logger = self._setup_logger()
        self.extractor = None
        self.current_session: Optional[BatchProgress] = None
        self.is_running = False
        self.should_pause = False
        self.should_stop = False
        
        # Callbacks para monitoreo
        self.progress_callbacks: List[Callable] = []
        self.completion_callbacks: List[Callable] = []
        
        # Thread pool para procesamiento paralelo
        self.executor = ThreadPoolExecutor(max_workers=3)
        
    def _setup_logger(self) -> logging.Logger:
        """Configurar sistema de logging"""
        logger = logging.getLogger('batch_processor')
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            # Handler para archivo
            file_handler = logging.FileHandler('gmail_extraction.log')
            file_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            file_handler.setFormatter(file_formatter)
            logger.addHandler(file_handler)
            
            # Handler para consola
            console_handler = logging.StreamHandler()
            console_formatter = logging.Formatter(
                '%(asctime)s - %(levelname)s - %(message)s'
            )
            console_handler.setFormatter(console_formatter)
            logger.addHandler(console_handler)
        
        return logger
    
    def add_progress_callback(self, callback: Callable[[BatchProgress], None]):
        """Agregar callback para monitoreo de progreso"""
        self.progress_callbacks.append(callback)
    
    def add_completion_callback(self, callback: Callable[[BatchProgress], None]):
        """Agregar callback para finalización"""
        self.completion_callbacks.append(callback)
    
    async def start_batch_extraction(
        self, 
        email: str, 
        password: str, 
        max_emails: int = 300,
        resume_session_id: Optional[str] = None
    ) -> str:
        """Iniciar extracción masiva de correos"""
        
        if self.is_running:
            raise RuntimeError("Ya hay una extracción en progreso")
        
        # Crear o reanudar sesión
        if resume_session_id:
            session_id = resume_session_id
            self.logger.info(f"Reanudando sesión {session_id}")
        else:
            session_id = str(uuid.uuid4())
            self.logger.info(f"Iniciando nueva sesión {session_id}")
        
        # Inicializar progreso
        self.current_session = BatchProgress(
            session_id=session_id,
            total_emails=max_emails,
            processed_emails=0,
            successful_extractions=0,
            failed_extractions=0,
            current_email_id=None,
            status='running',
            started_at=datetime.now(),
            estimated_completion=None,
            errors=[]
        )
        
        self.is_running = True
        self.should_pause = False
        self.should_stop = False
        
        try:
            # Inicializar extractor
            self.extractor = GmailExtractor(self.config)
            
            # Login a Gmail
            login_success = await self.extractor.login_to_gmail(email, password)
            if not login_success:
                raise Exception("Error en login a Gmail")
            
            # Obtener lista de correos
            self.logger.info("Obteniendo lista de correos...")
            email_ids = self.extractor.extract_email_list(max_emails)
            
            if not email_ids:
                raise Exception("No se pudieron obtener correos")
            
            self.current_session.total_emails = len(email_ids)
            self.logger.info(f"Encontrados {len(email_ids)} correos para procesar")
            
            # Procesar correos
            await self._process_emails_batch(email_ids)
            
            # Finalizar sesión
            self.current_session.status = 'completed'
            self.logger.info(f"Extracción completada: {self.current_session.successful_extractions}/{self.current_session.total_emails}")
            
        except Exception as e:
            self.logger.error(f"Error en extracción masiva: {e}")
            if self.current_session:
                self.current_session.status = 'failed'
                self.current_session.errors.append({
                    'timestamp': datetime.now().isoformat(),
                    'error': str(e),
                    'type': 'batch_error'
                })
        
        finally:
            self.is_running = False
            if self.extractor:
                self.extractor.cleanup()
            
            # Notificar finalización
            for callback in self.completion_callbacks:
                try:
                    callback(self.current_session)
                except Exception as e:
                    self.logger.error(f"Error en callback de finalización: {e}")
        
        return session_id
    
    async def _process_emails_batch(self, email_ids: List[str]):
        """Procesar lista de correos por lotes"""
        
        batch_size = 10  # Procesar de 10 en 10
        total_batches = (len(email_ids) + batch_size - 1) // batch_size
        
        for batch_num in range(total_batches):
            if self.should_stop:
                self.logger.info("Extracción detenida por usuario")
                break
            
            # Pausa si se solicita
            while self.should_pause and not self.should_stop:
                await asyncio.sleep(1)
            
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, len(email_ids))
            batch_emails = email_ids[start_idx:end_idx]
            
            self.logger.info(f"Procesando lote {batch_num + 1}/{total_batches} ({len(batch_emails)} correos)")
            
            # Procesar lote actual
            await self._process_single_batch(batch_emails)
            
            # Actualizar estimación de tiempo
            self._update_time_estimation()
            
            # Notificar progreso
            for callback in self.progress_callbacks:
                try:
                    callback(self.current_session)
                except Exception as e:
                    self.logger.error(f"Error en callback de progreso: {e}")
            
            # Pausa entre lotes para evitar sobrecarga
            await asyncio.sleep(2)
    
    async def _process_single_batch(self, email_ids: List[str]):
        """Procesar un lote individual de correos"""
        
        # Crear tareas para procesamiento paralelo (limitado)
        semaphore = asyncio.Semaphore(2)  # Máximo 2 correos simultáneos
        
        async def process_with_semaphore(email_id: str):
            async with semaphore:
                return await self._process_single_email_safe(email_id)
        
        # Ejecutar tareas
        tasks = [process_with_semaphore(email_id) for email_id in email_ids]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Procesar resultados
        for email_id, result in zip(email_ids, results):
            if isinstance(result, Exception):
                self.logger.error(f"Error procesando {email_id}: {result}")
                self.current_session.failed_extractions += 1
                self.current_session.errors.append({
                    'timestamp': datetime.now().isoformat(),
                    'email_id': email_id,
                    'error': str(result),
                    'type': 'extraction_error'
                })
            elif result:
                self.current_session.successful_extractions += 1
            else:
                self.current_session.failed_extractions += 1
            
            self.current_session.processed_emails += 1
    
    async def _process_single_email_safe(self, email_id: str) -> bool:
        """Procesar un correo individual con manejo de errores"""
        max_retries = 3
        retry_delay = 5
        
        for attempt in range(max_retries):
            try:
                self.current_session.current_email_id = email_id
                self.logger.info(f"Procesando correo {email_id} (intento {attempt + 1})")
                
                # Extraer correo
                email_data = await self.extractor.extract_single_email(email_id)
                
                if email_data:
                    self.logger.info(f"Correo {email_id} extraído exitosamente")
                    return True
                else:
                    self.logger.warning(f"No se pudo extraer correo {email_id}")
                    
            except Exception as e:
                self.logger.error(f"Error en intento {attempt + 1} para {email_id}: {e}")
                
                if attempt < max_retries - 1:
                    self.logger.info(f"Reintentando en {retry_delay} segundos...")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2  # Backoff exponencial
                else:
                    self.logger.error(f"Falló después de {max_retries} intentos: {email_id}")
                    return False
        
        return False
    
    def _update_time_estimation(self):
        """Actualizar estimación de tiempo de finalización"""
        if self.current_session.processed_emails > 0:
            elapsed_time = datetime.now() - self.current_session.started_at
            avg_time_per_email = elapsed_time.total_seconds() / self.current_session.processed_emails
            
            remaining_emails = self.current_session.total_emails - self.current_session.processed_emails
            estimated_remaining_seconds = remaining_emails * avg_time_per_email
            
            self.current_session.estimated_completion = datetime.now() + \
                timedelta(seconds=estimated_remaining_seconds)
    
    def pause_extraction(self):
        """Pausar extracción actual"""
        if self.is_running:
            self.should_pause = True
            self.current_session.status = 'paused'
            self.logger.info("Extracción pausada")
    
    def resume_extraction(self):
        """Reanudar extracción pausada"""
        if self.is_running and self.should_pause:
            self.should_pause = False
            self.current_session.status = 'running'
            self.logger.info("Extracción reanudada")
    
    def stop_extraction(self):
        """Detener extracción actual"""
        if self.is_running:
            self.should_stop = True
            self.current_session.status = 'stopped'
            self.logger.info("Deteniendo extracción...")
    
    def get_progress(self) -> Optional[BatchProgress]:
        """Obtener progreso actual"""
        return self.current_session
    
    def get_extraction_stats(self) -> Dict[str, any]:
        """Obtener estadísticas de extracción"""
        if not self.current_session:
            return {}
        
        elapsed_time = datetime.now() - self.current_session.started_at
        
        return {
            'session_id': self.current_session.session_id,
            'status': self.current_session.status,
            'total_emails': self.current_session.total_emails,
            'processed_emails': self.current_session.processed_emails,
            'successful_extractions': self.current_session.successful_extractions,
            'failed_extractions': self.current_session.failed_extractions,
            'success_rate': (self.current_session.successful_extractions / 
                           max(self.current_session.processed_emails, 1)) * 100,
            'elapsed_time_seconds': elapsed_time.total_seconds(),
            'estimated_completion': self.current_session.estimated_completion.isoformat() 
                                  if self.current_session.estimated_completion else None,
            'errors_count': len(self.current_session.errors),
            'current_email_id': self.current_session.current_email_id
        }
    
    def cleanup(self):
        """Limpiar recursos"""
        self.stop_extraction()
        self.executor.shutdown(wait=True)
        
        if self.extractor:
            self.extractor.cleanup()
        
        self.logger.info("Batch processor limpiado")

# Función de utilidad para crear procesador con configuración por defecto
def create_batch_processor(gemini_api_key: str = None, headless: bool = True) -> BatchProcessor:
    """Crear procesador por lotes con configuración optimizada"""
    config = DEFAULT_CONFIG.copy()
    config['headless'] = headless
    config['gemini_api_key'] = gemini_api_key
    
    return BatchProcessor(config)
