"""
Configuración del Gmail Extractor - VITAL RED
"""

import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv('.env.gmail')

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

# Configuración de Gmail
GMAIL_CONFIG = {
    'email_account': os.getenv('GMAIL_EMAIL', 'kevinrlinze@gmail.com'),
    'password': os.getenv('GMAIL_PASSWORD', ''),  # Se configurará en tiempo de ejecución por seguridad
    'imap_server': os.getenv('GMAIL_IMAP_SERVER', 'imap.gmail.com'),
    'imap_port': int(os.getenv('GMAIL_IMAP_PORT', '993')),
    'smtp_server': os.getenv('GMAIL_SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('GMAIL_SMTP_PORT', '587')),
    'use_app_password': os.getenv('GMAIL_USE_APP_PASSWORD', 'true').lower() == 'true',
    'folders_to_monitor': os.getenv('GMAIL_FOLDERS', 'INBOX,Sent').split(','),
    'search_criteria': os.getenv('GMAIL_SEARCH_CRITERIA', 'ALL')
}

# Configuración de extracción
EXTRACTION_CONFIG = {
    'max_emails_per_session': 300,
    'batch_size': 10,
    'retry_attempts': 3,
    'retry_delay': 5,
    'download_attachments': True,
    'process_pdfs': True,
    'enable_ai_analysis': True,
    'target_email': 'kevinrlinze@gmail.com'  # Email objetivo para extracción
}

# Configuración de logging
LOGGING_CONFIG = {
    'level': 'INFO',
    'file': 'gmail_extraction.log',
    'max_size_mb': 100,
    'backup_count': 5
}
