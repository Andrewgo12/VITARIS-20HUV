# 📧 **GMAIL EXTRACTOR AVANZADO - VITAL RED**

## **Sistema de Extracción Masiva de Gmail sin API Oficial**

### **Hospital Universitaria ESE - Departamento de Innovación y Desarrollo**

---

## 🎯 **DESCRIPCIÓN GENERAL**

El **Gmail Extractor Avanzado** es una funcionalidad revolucionaria integrada en VITAL RED que permite la extracción masiva de correos electrónicos de Gmail **sin utilizar la API oficial de Google**. Utiliza tecnologías avanzadas de web scraping, automatización con Selenium, y procesamiento inteligente con Gemini AI.

### **Características Principales:**

- ✅ **Extracción masiva**: Hasta 300 correos por sesión
- ✅ **Sin API oficial**: No requiere permisos especiales de Google
- ✅ **Procesamiento inteligente**: Análisis con Gemini AI
- ✅ **Extracción completa**: Texto, adjuntos, metadatos
- ✅ **Procesamiento de PDFs**: Extracción automática de texto
- ✅ **Manejo robusto de errores**: Reintentos automáticos
- ✅ **Interfaz web completa**: Monitoreo en tiempo real
- ✅ **Base de datos integrada**: Almacenamiento estructurado

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Componentes Principales:**

```
Gmail Extractor/
├── core_extractor.py      # Motor principal de extracción
├── batch_processor.py     # Procesamiento masivo
├── api_endpoints.py       # Endpoints de la API
├── config.py             # Configuración del sistema
└── __init__.py           # Inicialización del módulo
```

### **Tecnologías Utilizadas:**

- **Selenium WebDriver**: Automatización del navegador
- **BeautifulSoup**: Parsing de HTML
- **Gemini AI**: Análisis inteligente de contenido
- **PyPDF2**: Procesamiento de archivos PDF
- **MySQL**: Base de datos para almacenamiento
- **FastAPI**: API REST para integración
- **React**: Interfaz de usuario

---

## 🚀 **INSTALACIÓN Y CONFIGURACIÓN**

### **1. Instalación Automática:**

```bash
# Ejecutar instalador automático
python install_gmail_extractor_dependencies.py
```

### **2. Instalación Manual:**

```bash
# Instalar dependencias de Python
pip install selenium beautifulsoup4 requests PyPDF2 python-docx
pip install Pillow pytesseract google-generativeai mysql-connector-python
pip install webdriver-manager fastapi pydantic[email] uvicorn

# Instalar ChromeDriver (automático con webdriver-manager)
pip install webdriver-manager
```

### **3. Configuración de Tesseract OCR:**

1. Descargar desde: https://github.com/UB-Mannheim/tesseract/wiki
2. Instalar en el sistema
3. Agregar al PATH del sistema
4. Reiniciar el sistema

### **4. Configuración de Gemini AI:**

```python
# En server/gmail_extractor/config.py
GEMINI_CONFIG = {
    'api_key': 'TU_CLAVE_API_GEMINI',  # Obtener de Google AI Studio
    'model': 'gemini-pro',
    'max_tokens': 2048
}
```

---

## 📊 **BASE DE DATOS**

### **Tablas Creadas Automáticamente:**

#### **1. extracted_emails**
```sql
CREATE TABLE extracted_emails (
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
);
```

#### **2. email_attachments**
```sql
CREATE TABLE email_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email_id VARCHAR(255),
    filename VARCHAR(500),
    content_type VARCHAR(200),
    size_bytes INT,
    content LONGBLOB,
    extracted_text LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email_id) REFERENCES extracted_emails(id)
);
```

#### **3. extraction_logs**
```sql
CREATE TABLE extraction_logs (
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
);
```

---

## 🔌 **API ENDPOINTS**

### **Endpoints Principales:**

#### **1. Iniciar Extracción**
```http
POST /api/gmail-extractor/start
Content-Type: application/json

{
    "email": "usuario@gmail.com",
    "password": "contraseña",
    "max_emails": 300,
    "gemini_api_key": "opcional",
    "headless": true
}
```

#### **2. Obtener Progreso**
```http
GET /api/gmail-extractor/progress
```

#### **3. Controlar Extracción**
```http
POST /api/gmail-extractor/pause    # Pausar
POST /api/gmail-extractor/resume   # Reanudar
POST /api/gmail-extractor/stop     # Detener
```

#### **4. Buscar Correos Extraídos**
```http
GET /api/gmail-extractor/emails?query=texto&sender=remitente&limit=50
```

#### **5. Obtener Detalle de Correo**
```http
GET /api/gmail-extractor/emails/{email_id}
```

#### **6. Estadísticas**
```http
GET /api/gmail-extractor/stats
```

---

## 💻 **USO DE LA INTERFAZ WEB**

### **Acceso:**
```
http://localhost:5173/vital-red/gmail-extractor
```

### **Funcionalidades de la Interfaz:**

#### **1. Tab Extractor:**
- Configuración de credenciales de Gmail
- Configuración de parámetros de extracción
- Control de sesión (iniciar, pausar, reanudar, detener)
- Monitoreo de progreso en tiempo real

#### **2. Tab Correos Extraídos:**
- Búsqueda y filtrado de correos
- Vista previa de contenido
- Acceso a archivos adjuntos
- Eliminación de correos

#### **3. Tab Estadísticas:**
- Total de correos extraídos
- Correos con archivos adjuntos
- Correos con análisis de IA
- Gráficos de actividad

#### **4. Tab Configuración:**
- Configuración del sistema
- Parámetros avanzados
- Información del sistema

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **Parámetros de Extracción:**

```python
EXTRACTION_CONFIG = {
    'max_emails_per_session': 300,     # Máximo por sesión
    'batch_size': 10,                  # Correos por lote
    'retry_attempts': 3,               # Intentos por correo
    'retry_delay': 5,                  # Segundos entre intentos
    'download_attachments': True,      # Descargar adjuntos
    'process_pdfs': True,              # Procesar PDFs
    'enable_ai_analysis': True         # Análisis con IA
}
```

### **Configuración de Selenium:**

```python
SELENIUM_CONFIG = {
    'headless': True,                  # Modo sin interfaz
    'window_size': (1920, 1080),      # Tamaño de ventana
    'timeout': 30,                     # Timeout general
    'implicit_wait': 10,               # Espera implícita
    'user_agent': 'Mozilla/5.0...'    # User agent personalizado
}
```

---

## 🛡️ **SEGURIDAD Y CONSIDERACIONES**

### **Medidas de Seguridad Implementadas:**

1. **Anti-detección**: User agents realistas, delays aleatorios
2. **Manejo de errores**: Reintentos con backoff exponencial
3. **Almacenamiento seguro**: Contraseñas no almacenadas
4. **Logs detallados**: Seguimiento completo de actividad
5. **Límites de velocidad**: Prevención de sobrecarga

### **Consideraciones Legales:**

- ⚠️ **Términos de Servicio**: Asegurar cumplimiento con ToS de Gmail
- ⚠️ **Uso Responsable**: No sobrecargar servidores de Google
- ⚠️ **Datos Personales**: Cumplir con regulaciones de privacidad
- ⚠️ **Autorización**: Usar solo con cuentas propias o autorizadas

---

## 🧪 **PRUEBAS Y VERIFICACIÓN**

### **Script de Prueba Básica:**

```bash
# Ejecutar pruebas básicas
python test_gmail_extractor_basic.py
```

### **Pruebas Incluidas:**

1. **Importaciones**: Verificar dependencias
2. **Configuración**: Validar parámetros
3. **Base de Datos**: Probar conexión
4. **Selenium**: Verificar ChromeDriver
5. **Gemini AI**: Probar API (si configurada)

---

## 📈 **MONITOREO Y LOGS**

### **Archivos de Log:**

- `gmail_extraction.log`: Log principal de extracción
- `selenium.log`: Logs específicos de Selenium
- `database.log`: Logs de base de datos

### **Métricas Monitoreadas:**

- Correos procesados por minuto
- Tasa de éxito de extracción
- Errores por tipo
- Tiempo promedio por correo
- Uso de recursos del sistema

---

## 🔄 **FLUJO DE TRABAJO TÍPICO**

### **1. Preparación:**
```bash
# Instalar dependencias
python install_gmail_extractor_dependencies.py

# Configurar Gemini AI
# Editar server/gmail_extractor/config.py

# Verificar instalación
python test_gmail_extractor_basic.py
```

### **2. Extracción:**
```bash
# Iniciar VITAL RED
python start_vital_red_complete_final.py

# Acceder a interfaz web
# http://localhost:5173/vital-red/gmail-extractor

# Configurar credenciales y parámetros
# Iniciar extracción
# Monitorear progreso
```

### **3. Análisis:**
```bash
# Buscar correos extraídos
# Revisar análisis de IA
# Exportar datos si necesario
# Generar reportes
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes:**

#### **1. Error de ChromeDriver:**
```bash
# Reinstalar webdriver-manager
pip uninstall webdriver-manager
pip install webdriver-manager
```

#### **2. Error de Tesseract:**
```bash
# Verificar instalación
tesseract --version

# Agregar al PATH si es necesario
```

#### **3. Error de Base de Datos:**
```python
# Verificar configuración en config.py
DATABASE_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '',
    'database': 'vital_red'
}
```

#### **4. Error de Gemini AI:**
```python
# Verificar clave API
GEMINI_CONFIG = {
    'api_key': 'TU_CLAVE_VALIDA'
}
```

---

## 📞 **SOPORTE Y CONTACTO**

### **Equipo de Desarrollo:**
- **Hospital Universitaria ESE**
- **Departamento de Innovación y Desarrollo**
- **Sistema VITAL RED**

### **Documentación Adicional:**
- Manual de Usuario Completo
- Guía de Administrador
- API Reference
- Troubleshooting Guide

---

## 🎉 **CONCLUSIÓN**

El **Gmail Extractor Avanzado** representa una solución innovadora y robusta para la extracción masiva de correos electrónicos sin depender de APIs oficiales. Su integración con VITAL RED proporciona al Hospital Universitaria ESE una herramienta poderosa para el procesamiento automatizado de comunicaciones médicas.

**¡El sistema está listo para transformar la gestión de correos electrónicos en el hospital!** 🏥✨
