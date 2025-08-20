# VITAL RED - Sistema de Gestión Hospitalaria
## Hospital Universitaria ESE

### 🏥 Sistema Completo de Gestión Médica con Gmail Extractor Avanzado

---

## 📁 Estructura del Proyecto

### 01-Documentation/
Toda la documentación del proyecto
- **User-Guides/**: Guías para usuarios finales
- **Technical-Documentation/**: Documentación técnica
- **Installation-Guides/**: Guías de instalación
- **API-Documentation/**: Documentación de APIs

### 02-Server-Backend/
Servidor y lógica de negocio
- **gmail-extractor/**: Motor de extracción de Gmail
- **api-routes/**: Rutas y endpoints de la API
- **database/**: Configuración de base de datos
- **configuration/**: Configuraciones del servidor

### 03-Client-Frontend/
Interfaz de usuario web
- **src/**: Código fuente del frontend
- **public/**: Archivos públicos y assets
- **styles/**: Estilos y temas

### 04-Database-Scripts/
Scripts de base de datos
- **schema/**: Esquemas y estructura de BD
- **migrations/**: Migraciones de base de datos
- **seed-data/**: Datos iniciales
- **backups/**: Scripts de respaldo

### 05-Installation-Setup/
Instalación y configuración
- **dependencies/**: Dependencias del proyecto
- **configuration/**: Archivos de configuración
- **startup-scripts/**: Scripts de inicio

### 06-Quality-Assurance/
Pruebas y validación
- **tests/**: Pruebas esenciales
- **validation/**: Scripts de validación
- **reports/**: Reportes de calidad

### 07-Configuration/
Configuraciones del sistema
- **environment/**: Variables de entorno
- **security/**: Configuraciones de seguridad
- **gmail-settings/**: Configuración de Gmail

### 08-Utilities/
Herramientas y utilidades
- **scripts/**: Scripts de utilidad
- **tools/**: Herramientas de desarrollo
- **helpers/**: Funciones auxiliares

---

## 🚀 Inicio Rápido

### 1. Configuración Inicial
```bash
cd 05-Installation-Setup/startup-scripts/
python install_gmail_extractor_dependencies.py
```

### 2. Configurar Base de Datos
```bash
cd 04-Database-Scripts/schema/
python create_complete_database_schema.py
```

### 3. Iniciar Servidor
```bash
cd 02-Server-Backend/
python vital_red_simple_server.py
```

### 4. Iniciar Frontend
```bash
cd 03-Client-Frontend/
npm install
npm run dev
```

---

## 🔑 Credenciales de Acceso

- **Email**: admin@hospital-ese.com
- **Password**: admin123
- **Rol**: Administrador

---

## 📧 Gmail Extractor

- **Email Configurado**: kevinrlinze@gmail.com
- **Capacidad**: Hasta 300 correos por sesión
- **Tecnología**: Selenium + IA Gemini

---

## 🌐 URLs del Sistema

- **Backend API**: http://localhost:8003
- **Frontend Web**: http://localhost:5173
- **Health Check**: http://localhost:8003/health
- **API Docs**: http://localhost:8003/docs

---

## 📞 Soporte

Para soporte técnico, consultar la documentación en `01-Documentation/`

---

**© 2025 Hospital Universitaria ESE - Departamento de Innovación y Desarrollo**
