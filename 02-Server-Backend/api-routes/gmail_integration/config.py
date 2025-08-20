"""
Gmail Integration Configuration for VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import os
from pathlib import Path
from decouple import config
from typing import List, Dict, Any

# Base Configuration
BASE_DIR = Path(__file__).parent
CREDENTIALS_DIR = BASE_DIR / "credentials"
LOGS_DIR = BASE_DIR / "logs"
TEMP_DIR = BASE_DIR / "temp"
PROCESSED_DIR = BASE_DIR / "processed"

# Create directories if they don't exist
for directory in [CREDENTIALS_DIR, LOGS_DIR, TEMP_DIR, PROCESSED_DIR]:
    directory.mkdir(exist_ok=True)

# Gmail API Configuration
GMAIL_CONFIG = {
    "SCOPES": [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
    ],
    "CREDENTIALS_FILE": CREDENTIALS_DIR / "credentials.json",
    "TOKEN_FILE": CREDENTIALS_DIR / "token.json",
    "APPLICATION_NAME": "VITAL RED Gmail Integration",
    "BATCH_SIZE": 10,  # Number of emails to process in each batch
    "MAX_RESULTS": 100,  # Maximum emails to fetch per request
    "POLL_INTERVAL": 300,  # Check for new emails every 5 minutes
}

# Email Processing Configuration
EMAIL_CONFIG = {
    "REFERRAL_KEYWORDS": [
        "referencia", "remision", "traslado", "interconsulta",
        "referral", "transfer", "consultation", "derivacion",
        "urgente", "emergencia", "critico", "prioritario"
    ],
    "MEDICAL_SPECIALTIES": [
        "cardiologia", "neurologia", "cirugia", "medicina interna",
        "pediatria", "ginecologia", "urologia", "ortopedia",
        "oncologia", "psiquiatria", "dermatologia", "oftalmologia",
        "otorrinolaringologia", "anestesiologia", "radiologia"
    ],
    "PRIORITY_KEYWORDS": {
        "alta": ["urgente", "critico", "emergencia", "inmediato", "stat"],
        "media": ["prioritario", "pronto", "temprano", "moderado"],
        "baja": ["rutina", "programado", "electivo", "normal"]
    },
    "ATTACHMENT_TYPES": [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".tiff"],
    "MAX_ATTACHMENT_SIZE": 50 * 1024 * 1024,  # 50MB
}

# Database Configuration for XAMPP MySQL
DATABASE_CONFIG = {
    "HOST": config("DB_HOST", default="localhost"),
    "PORT": config("DB_PORT", default=3306, cast=int),  # MySQL port for XAMPP
    "NAME": config("DB_NAME", default="vital_red"),
    "USER": config("DB_USER", default="root"),  # Default XAMPP MySQL user
    "PASSWORD": config("DB_PASSWORD", default=""),  # Default XAMPP MySQL password (empty)
    "DRIVER": config("DB_DRIVER", default="mysql+pymysql"),  # MySQL driver for XAMPP
    "URL": f"mysql+pymysql://{config('DB_USER', default='root')}:{config('DB_PASSWORD', default='')}@{config('DB_HOST', default='localhost')}:{config('DB_PORT', default=3306, cast=int)}/{config('DB_NAME', default='vital_red')}"
}

# Redis Configuration for Caching and Queue
REDIS_CONFIG = {
    "HOST": config("REDIS_HOST", default="localhost"),
    "PORT": config("REDIS_PORT", default=6379, cast=int),
    "DB": config("REDIS_DB", default=0, cast=int),
    "PASSWORD": config("REDIS_PASSWORD", default=None),
    "URL": f"redis://:{config('REDIS_PASSWORD', default='')}@{config('REDIS_HOST', default='localhost')}:{config('REDIS_PORT', default=6379, cast=int)}/{config('REDIS_DB', default=0, cast=int)}"
}

# Logging Configuration
LOGGING_CONFIG = {
    "LEVEL": config("LOG_LEVEL", default="INFO"),
    "FORMAT": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    "FILE": LOGS_DIR / "gmail_integration.log",
    "MAX_BYTES": 10 * 1024 * 1024,  # 10MB
    "BACKUP_COUNT": 5,
    "ENABLE_CONSOLE": config("LOG_CONSOLE", default=True, cast=bool),
}

# Processing Configuration
PROCESSING_CONFIG = {
    "MAX_RETRIES": 3,
    "RETRY_DELAY": 60,  # seconds
    "TIMEOUT": 300,  # 5 minutes per email processing
    "CONCURRENT_WORKERS": 4,
    "ENABLE_OCR": True,
    "OCR_LANGUAGE": "spa+eng",  # Spanish and English
    "BACKUP_PROCESSED_EMAILS": True,
}

# Security Configuration
SECURITY_CONFIG = {
    "ENCRYPT_ATTACHMENTS": True,
    "ENCRYPTION_KEY": config("ENCRYPTION_KEY", default=""),
    "ALLOWED_DOMAINS": [
        "eps-sanitas.com.co",
        "compensar.com",
        "sura.com.co",
        "nuevaeps.com.co",
        "famisanar.com.co",
        "salud.gov.co",
        "minsalud.gov.co"
    ],
    "QUARANTINE_SUSPICIOUS": True,
}

# API Configuration
API_CONFIG = {
    "HOST": config("API_HOST", default="0.0.0.0"),
    "PORT": config("API_PORT", default=8001, cast=int),
    "RELOAD": config("API_RELOAD", default=False, cast=bool),
    "WORKERS": config("API_WORKERS", default=1, cast=int),
}

# Medical Data Extraction Patterns
MEDICAL_PATTERNS = {
    "PATIENT_ID": [
        r"(?:cedula|cc|documento|id)[\s:]*(\d{6,12})",
        r"(?:identificacion)[\s:]*(\d{6,12})",
        r"(?:numero de documento)[\s:]*(\d{6,12})"
    ],
    "PATIENT_NAME": [
        r"(?:paciente|nombre)[\s:]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)",
        r"(?:apellidos y nombres)[\s:]*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)"
    ],
    "AGE": [
        r"(?:edad)[\s:]*(\d{1,3})(?:\s*años?)?",
        r"(\d{1,3})\s*años?"
    ],
    "DIAGNOSIS": [
        r"(?:diagnostico|dx)[\s:]*([^.\n]+)",
        r"(?:impresion diagnostica)[\s:]*([^.\n]+)"
    ],
    "SPECIALTY": [
        r"(?:especialidad|servicio)[\s:]*([^.\n]+)",
        r"(?:interconsulta)[\s:]*([^.\n]+)"
    ],
    "URGENCY": [
        r"(?:urgencia|prioridad)[\s:]*([^.\n]+)",
        r"(?:nivel de urgencia)[\s:]*([^.\n]+)"
    ]
}

# File Processing Configuration
FILE_CONFIG = {
    "SUPPORTED_FORMATS": {
        "pdf": ["application/pdf"],
        "doc": ["application/msword"],
        "docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        "image": ["image/jpeg", "image/png", "image/tiff", "image/bmp"]
    },
    "OCR_CONFIG": {
        "DPI": 300,
        "LANGUAGE": "spa+eng",
        "PSM": 6,  # Page segmentation mode
        "OEM": 3   # OCR Engine Mode
    },
    "PDF_CONFIG": {
        "EXTRACT_IMAGES": True,
        "EXTRACT_TEXT": True,
        "MERGE_PAGES": True
    }
}

# Monitoring and Alerts Configuration
MONITORING_CONFIG = {
    "ENABLE_HEALTH_CHECK": True,
    "HEALTH_CHECK_INTERVAL": 60,  # seconds
    "ALERT_EMAIL": config("ALERT_EMAIL", default=""),
    "ALERT_THRESHOLD": {
        "PROCESSING_ERRORS": 5,  # Alert after 5 consecutive errors
        "QUEUE_SIZE": 100,       # Alert if queue exceeds 100 items
        "DISK_USAGE": 90,        # Alert if disk usage exceeds 90%
    }
}

# Integration with VITAL RED Frontend
FRONTEND_CONFIG = {
    "API_ENDPOINT": config("FRONTEND_API", default="http://localhost:3000/api"),
    "WEBHOOK_URL": config("WEBHOOK_URL", default="http://localhost:3000/webhook/gmail"),
    "AUTH_TOKEN": config("FRONTEND_AUTH_TOKEN", default=""),
    "SYNC_INTERVAL": 30,  # seconds
}

# Performance Configuration
PERFORMANCE_CONFIG = {
    "MAX_CONCURRENT_EMAILS": config("MAX_CONCURRENT_EMAILS", default=10, cast=int),
    "BATCH_SIZE": config("BATCH_SIZE", default=50, cast=int),
    "CACHE_TTL": config("CACHE_TTL", default=3600, cast=int),
    "MEMORY_LIMIT_MB": config("MEMORY_LIMIT_MB", default=512, cast=int),
    "CPU_THRESHOLD": config("CPU_THRESHOLD", default=80, cast=int),
    "DISK_THRESHOLD": config("DISK_THRESHOLD", default=85, cast=int),
    "OPTIMIZATION_INTERVAL": config("OPTIMIZATION_INTERVAL", default=300, cast=int)
}

# Backup Configuration
BACKUP_CONFIG = {
    "BACKUP_DIR": config("BACKUP_DIR", default="backups"),
    "MAX_BACKUPS": config("MAX_BACKUPS", default=10, cast=int),
    "COMPRESSION": config("BACKUP_COMPRESSION", default=True, cast=bool),
    "ENCRYPTION": config("BACKUP_ENCRYPTION", default=True, cast=bool),
    "SCHEDULE": config("BACKUP_SCHEDULE", default="daily"),
    "RETENTION_DAYS": config("BACKUP_RETENTION_DAYS", default=30, cast=int)
}

# Export all configurations
__all__ = [
    "GMAIL_CONFIG",
    "EMAIL_CONFIG",
    "DATABASE_CONFIG",
    "REDIS_CONFIG",
    "LOGGING_CONFIG",
    "PROCESSING_CONFIG",
    "SECURITY_CONFIG",
    "API_CONFIG",
    "MEDICAL_PATTERNS",
    "FILE_CONFIG",
    "MONITORING_CONFIG",
    "FRONTEND_CONFIG",
    "PERFORMANCE_CONFIG",
    "BACKUP_CONFIG"
]
