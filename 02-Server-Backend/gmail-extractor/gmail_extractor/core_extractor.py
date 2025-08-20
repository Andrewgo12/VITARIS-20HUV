"""
Core Gmail Extractor - VITAL RED
Sistema avanzado de extracción de correos sin API oficial de Google
Utiliza Selenium, BeautifulSoup y Gemini AI para procesamiento inteligente
"""

import asyncio
import time
import json
import re
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, asdict
import base64
import hashlib

# Web scraping y automatización
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import requests

# Procesamiento de documentos
import PyPDF2
import docx
from PIL import Image
import pytesseract

# AI Processing
import google.generativeai as genai

# Database
import mysql.connector
from mysql.connector import Error

@dataclass
class EmailData:
    """Estructura de datos para un correo extraído"""
    id: str
    subject: str
    sender: str
    recipients: List[str]
    date: datetime
    body_text: str
    body_html: str
    attachments: List[Dict[str, Any]]
    metadata: Dict[str, Any]
    processed_at: datetime
    extraction_method: str
    ai_analysis: Optional[Dict[str, Any]] = None

class GmailExtractor:
    """Extractor principal de Gmail sin API oficial"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = self._setup_logger()
        self.driver = None
        self.gemini_client = None
        self.db_connection = None
        
        # Configurar Gemini AI
        if config.get('gemini_api_key'):
            genai.configure(api_key=config['gemini_api_key'])
            self.gemini_client = genai.GenerativeModel('gemini-pro')
        
        # Configurar base de datos
        self._setup_database()
    
    def _setup_logger(self) -> logging.Logger:
        """Configurar sistema de logging"""
        logger = logging.getLogger('gmail_extractor')
        logger.setLevel(logging.INFO)
        
        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        
        return logger
    
    def _setup_database(self):
        """Configurar conexión a base de datos"""
        try:
            self.db_connection = mysql.connector.connect(
                host=self.config.get('db_host', 'localhost'),
                port=self.config.get('db_port', 3306),
                user=self.config.get('db_user', 'root'),
                password=self.config.get('db_password', ''),
                database=self.config.get('db_name', 'vital_red')
            )
            self._create_tables()
            self.logger.info("Base de datos configurada correctamente")
        except Error as e:
            self.logger.error(f"Error configurando base de datos: {e}")
    
    def _create_tables(self):
        """Crear tablas necesarias para almacenar correos"""
        cursor = self.db_connection.cursor()
        
        # Tabla principal de correos extraídos
        create_emails_table = """
        CREATE TABLE IF NOT EXISTS extracted_emails (
            id VARCHAR(255) PRIMARY KEY,
            subject TEXT,
            sender VARCHAR(500),
            recipients JSON,
            date DATETIME,
            body_text LONGTEXT,
            body_html LONGTEXT,
            attachments JSON,
            metadata JSON,
            processed_at DATETIME,
            extraction_method VARCHAR(100),
            ai_analysis JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
        """
        
        # Tabla de archivos adjuntos
        create_attachments_table = """
        CREATE TABLE IF NOT EXISTS email_attachments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email_id VARCHAR(255),
            filename VARCHAR(500),
            content_type VARCHAR(200),
            size_bytes INT,
            content LONGBLOB,
            extracted_text LONGTEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (email_id) REFERENCES extracted_emails(id)
        )
        """
        
        # Tabla de logs de extracción
        create_extraction_logs = """
        CREATE TABLE IF NOT EXISTS extraction_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(100),
            email_account VARCHAR(200),
            status ENUM('started', 'processing', 'completed', 'failed'),
            emails_processed INT DEFAULT 0,
            total_emails INT DEFAULT 0,
            error_message TEXT,
            started_at DATETIME,
            completed_at DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        
        cursor.execute(create_emails_table)
        cursor.execute(create_attachments_table)
        cursor.execute(create_extraction_logs)
        self.db_connection.commit()
        cursor.close()
    
    def _setup_driver(self) -> webdriver.Chrome:
        """Configurar driver de Selenium para Gmail"""
        chrome_options = Options()
        
        # Configuraciones para evitar detección
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # User agent realista
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        # Configuraciones adicionales
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-images')  # Acelerar carga
        
        # Modo headless opcional
        if self.config.get('headless', False):
            chrome_options.add_argument('--headless')
        
        driver = webdriver.Chrome(options=chrome_options)
        
        # Ejecutar script para evitar detección
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        return driver
    
    async def login_to_gmail(self, email: str, password: str) -> bool:
        """Login a Gmail usando Selenium"""
        try:
            self.driver = self._setup_driver()
            self.logger.info(f"Iniciando login para {email}")
            
            # Ir a Gmail
            self.driver.get("https://accounts.google.com/signin")
            
            # Esperar y llenar email
            email_input = WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.ID, "identifierId"))
            )
            email_input.send_keys(email)
            
            # Hacer clic en siguiente
            next_button = self.driver.find_element(By.ID, "identifierNext")
            next_button.click()
            
            # Esperar y llenar contraseña
            password_input = WebDriverWait(self.driver, 20).until(
                EC.element_to_be_clickable((By.NAME, "password"))
            )
            
            # Simular escritura humana
            for char in password:
                password_input.send_keys(char)
                await asyncio.sleep(0.1)
            
            # Hacer clic en siguiente
            password_next = self.driver.find_element(By.ID, "passwordNext")
            password_next.click()
            
            # Verificar login exitoso
            WebDriverWait(self.driver, 30).until(
                EC.url_contains("myaccount.google.com") or 
                EC.url_contains("mail.google.com")
            )
            
            # Ir a Gmail
            self.driver.get("https://mail.google.com")
            
            # Verificar que estamos en Gmail
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[role='main']"))
            )
            
            self.logger.info("Login exitoso a Gmail")
            return True
            
        except Exception as e:
            self.logger.error(f"Error en login: {e}")
            return False
    
    def extract_email_list(self, max_emails: int = 300) -> List[str]:
        """Extraer lista de IDs de correos"""
        try:
            self.logger.info(f"Extrayendo lista de hasta {max_emails} correos")
            
            email_ids = []
            processed_count = 0
            
            while processed_count < max_emails:
                # Buscar elementos de correo en la página actual
                email_elements = self.driver.find_elements(
                    By.CSS_SELECTOR, 
                    "[data-thread-id]"
                )
                
                for element in email_elements:
                    if processed_count >= max_emails:
                        break
                    
                    thread_id = element.get_attribute("data-thread-id")
                    if thread_id and thread_id not in email_ids:
                        email_ids.append(thread_id)
                        processed_count += 1
                
                # Scroll para cargar más correos
                if processed_count < max_emails:
                    self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(2)
                    
                    # Verificar si hay más correos para cargar
                    new_count = len(self.driver.find_elements(By.CSS_SELECTOR, "[data-thread-id]"))
                    if new_count == len(email_elements):
                        # No hay más correos para cargar
                        break
            
            self.logger.info(f"Extraídos {len(email_ids)} IDs de correos")
            return email_ids
            
        except Exception as e:
            self.logger.error(f"Error extrayendo lista de correos: {e}")
            return []
    
    async def extract_single_email(self, email_id: str) -> Optional[EmailData]:
        """Extraer datos completos de un correo específico"""
        try:
            self.logger.info(f"Extrayendo correo {email_id}")
            
            # Navegar al correo específico
            email_url = f"https://mail.google.com/mail/u/0/#inbox/{email_id}"
            self.driver.get(email_url)
            
            # Esperar a que cargue el correo
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "[role='main']"))
            )
            
            # Extraer datos del correo
            email_data = self._parse_email_content()
            email_data.id = email_id
            email_data.processed_at = datetime.now()
            email_data.extraction_method = "selenium_scraping"
            
            # Procesar con Gemini AI si está disponible
            if self.gemini_client:
                email_data.ai_analysis = await self._analyze_with_gemini(email_data)
            
            # Guardar en base de datos
            self._save_email_to_db(email_data)
            
            self.logger.info(f"Correo {email_id} extraído exitosamente")
            return email_data
            
        except Exception as e:
            self.logger.error(f"Error extrayendo correo {email_id}: {e}")
            return None
    
    def _parse_email_content(self) -> EmailData:
        """Parsear contenido del correo desde la página"""
        # Obtener HTML de la página
        page_source = self.driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Extraer asunto
        subject_element = soup.find('h2', {'data-legacy-thread-id': True})
        subject = subject_element.text.strip() if subject_element else "Sin asunto"
        
        # Extraer remitente
        sender_element = soup.find('span', {'email': True})
        sender = sender_element.get('email', '') if sender_element else ""
        
        # Extraer fecha
        date_element = soup.find('span', {'data-date': True})
        date_str = date_element.get('data-date', '') if date_element else ""
        date = self._parse_date(date_str)
        
        # Extraer cuerpo del correo
        body_elements = soup.find_all('div', {'dir': 'ltr'})
        body_text = ""
        body_html = ""
        
        for element in body_elements:
            if element.text.strip():
                body_text += element.text.strip() + "\n"
                body_html += str(element) + "\n"
        
        # Extraer archivos adjuntos
        attachments = self._extract_attachments(soup)
        
        return EmailData(
            id="",  # Se asignará después
            subject=subject,
            sender=sender,
            recipients=[],  # Se extraerá después
            date=date,
            body_text=body_text,
            body_html=body_html,
            attachments=attachments,
            metadata={
                "extraction_timestamp": datetime.now().isoformat(),
                "page_title": soup.title.string if soup.title else "",
                "total_attachments": len(attachments)
            },
            processed_at=datetime.now(),
            extraction_method="selenium_scraping"
        )
    
    def _parse_date(self, date_str: str) -> datetime:
        """Parsear fecha del correo"""
        try:
            # Intentar varios formatos de fecha
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%d/%m/%Y %H:%M",
                "%Y-%m-%dT%H:%M:%S",
                "%d %b %Y %H:%M"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_str, fmt)
                except ValueError:
                    continue
            
            # Si no se puede parsear, usar fecha actual
            return datetime.now()
            
        except Exception:
            return datetime.now()
    
    def _extract_attachments(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extraer información de archivos adjuntos"""
        attachments = []
        
        try:
            # Buscar elementos de archivos adjuntos
            attachment_elements = soup.find_all('span', {'download_url': True})
            
            for element in attachment_elements:
                download_url = element.get('download_url', '')
                filename = element.text.strip()
                
                if filename and download_url:
                    attachment_info = {
                        'filename': filename,
                        'download_url': download_url,
                        'content_type': self._guess_content_type(filename),
                        'extracted_at': datetime.now().isoformat()
                    }
                    
                    # Intentar descargar y procesar el archivo
                    content = self._download_attachment(download_url)
                    if content:
                        attachment_info['content'] = base64.b64encode(content).decode('utf-8')
                        attachment_info['size_bytes'] = len(content)
                        
                        # Extraer texto si es PDF
                        if filename.lower().endswith('.pdf'):
                            extracted_text = self._extract_pdf_text(content)
                            attachment_info['extracted_text'] = extracted_text
                    
                    attachments.append(attachment_info)
            
        except Exception as e:
            self.logger.error(f"Error extrayendo archivos adjuntos: {e}")
        
        return attachments
    
    def _guess_content_type(self, filename: str) -> str:
        """Adivinar tipo de contenido basado en extensión"""
        extension = filename.lower().split('.')[-1]
        
        content_types = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif'
        }
        
        return content_types.get(extension, 'application/octet-stream')
    
    def _download_attachment(self, download_url: str) -> Optional[bytes]:
        """Descargar archivo adjunto"""
        try:
            # Usar las cookies del driver para la descarga
            cookies = self.driver.get_cookies()
            session = requests.Session()
            
            for cookie in cookies:
                session.cookies.set(cookie['name'], cookie['value'])
            
            response = session.get(download_url, timeout=30)
            
            if response.status_code == 200:
                return response.content
            else:
                self.logger.warning(f"Error descargando archivo: {response.status_code}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error descargando archivo adjunto: {e}")
            return None
    
    def _extract_pdf_text(self, pdf_content: bytes) -> str:
        """Extraer texto de PDF"""
        try:
            import io
            pdf_file = io.BytesIO(pdf_content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
            
        except Exception as e:
            self.logger.error(f"Error extrayendo texto de PDF: {e}")
            return ""
    
    async def _analyze_with_gemini(self, email_data: EmailData) -> Dict[str, Any]:
        """Analizar correo con Gemini AI"""
        try:
            if not self.gemini_client:
                return {}
            
            # Preparar prompt para análisis
            prompt = f"""
            Analiza el siguiente correo electrónico y extrae información médica relevante:
            
            Asunto: {email_data.subject}
            Remitente: {email_data.sender}
            Fecha: {email_data.date}
            Contenido: {email_data.body_text[:2000]}  # Limitar texto
            
            Por favor proporciona:
            1. Tipo de documento médico (si aplica)
            2. Información del paciente mencionada
            3. Diagnósticos o procedimientos mencionados
            4. Urgencia del caso (alta, media, baja)
            5. Resumen ejecutivo
            6. Palabras clave médicas
            
            Responde en formato JSON.
            """
            
            response = await self.gemini_client.generate_content_async(prompt)
            
            # Intentar parsear respuesta JSON
            try:
                analysis = json.loads(response.text)
            except json.JSONDecodeError:
                # Si no es JSON válido, crear estructura básica
                analysis = {
                    "raw_response": response.text,
                    "analysis_timestamp": datetime.now().isoformat(),
                    "status": "partial_analysis"
                }
            
            return analysis
            
        except Exception as e:
            self.logger.error(f"Error en análisis con Gemini: {e}")
            return {"error": str(e), "analysis_timestamp": datetime.now().isoformat()}
    
    def _save_email_to_db(self, email_data: EmailData):
        """Guardar correo en base de datos"""
        try:
            cursor = self.db_connection.cursor()
            
            # Insertar correo principal
            insert_email_query = """
            INSERT INTO extracted_emails 
            (id, subject, sender, recipients, date, body_text, body_html, 
             attachments, metadata, processed_at, extraction_method, ai_analysis)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            subject = VALUES(subject),
            body_text = VALUES(body_text),
            body_html = VALUES(body_html),
            updated_at = CURRENT_TIMESTAMP
            """
            
            cursor.execute(insert_email_query, (
                email_data.id,
                email_data.subject,
                email_data.sender,
                json.dumps(email_data.recipients),
                email_data.date,
                email_data.body_text,
                email_data.body_html,
                json.dumps(email_data.attachments),
                json.dumps(email_data.metadata),
                email_data.processed_at,
                email_data.extraction_method,
                json.dumps(email_data.ai_analysis) if email_data.ai_analysis else None
            ))
            
            # Insertar archivos adjuntos
            for attachment in email_data.attachments:
                if 'content' in attachment:
                    insert_attachment_query = """
                    INSERT INTO email_attachments 
                    (email_id, filename, content_type, size_bytes, content, extracted_text)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    
                    cursor.execute(insert_attachment_query, (
                        email_data.id,
                        attachment['filename'],
                        attachment['content_type'],
                        attachment.get('size_bytes', 0),
                        base64.b64decode(attachment['content']),
                        attachment.get('extracted_text', '')
                    ))
            
            self.db_connection.commit()
            cursor.close()
            
        except Exception as e:
            self.logger.error(f"Error guardando correo en BD: {e}")
    
    def cleanup(self):
        """Limpiar recursos"""
        if self.driver:
            self.driver.quit()
        
        if self.db_connection:
            self.db_connection.close()
        
        self.logger.info("Recursos limpiados")

# Importar configuración
try:
    from .config import DEFAULT_CONFIG, COMPLETE_CONFIG
except ImportError:
    # Configuración por defecto si no existe el archivo de configuración
    DEFAULT_CONFIG = {
        'headless': False,
        'max_emails': 300,
        'db_host': 'localhost',
        'db_port': 3306,
        'db_user': 'root',
        'db_password': '',
        'db_name': 'vital_red',
        'gemini_api_key': None,  # Configurar con clave real
        'download_attachments': True,
        'process_pdfs': True
    }
