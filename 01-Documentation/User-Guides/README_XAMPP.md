# 🏥 VITAL RED - Configuración con XAMPP
## Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

---

## 📋 **Guía Completa de Instalación y Configuración**

Esta guía te ayudará a configurar y probar **VITAL RED** usando **XAMPP** como servidor de base de datos.

---

## 🔧 **REQUISITOS PREVIOS**

### **1. Software Requerido**
- ✅ **XAMPP** (Apache + MySQL + PHP)
- ✅ **Node.js** (v16 o superior)
- ✅ **Python** (v3.8 o superior)
- ✅ **Git** (para clonar el repositorio)

### **2. Descargar XAMPP**
1. Ir a: https://www.apachefriends.org/
2. Descargar XAMPP para Windows
3. Instalar con configuración por defecto
4. Iniciar **Apache** y **MySQL** desde el Panel de Control

---

## 🚀 **INSTALACIÓN PASO A PASO**

### **PASO 1: Preparar XAMPP**

1. **Abrir XAMPP Control Panel**
2. **Iniciar servicios:**
   - ✅ **Apache** (puerto 80)
   - ✅ **MySQL** (puerto 3306)
3. **Verificar que estén ejecutándose** (luz verde)

### **PASO 2: Configurar Base de Datos**

#### **Opción A: Script Automático (Recomendado)**
```bash
# Ejecutar script de configuración automática
python setup_xampp.py
```

#### **Opción B: Configuración Manual**
1. **Abrir phpMyAdmin:** http://localhost/phpmyadmin
2. **Crear base de datos:**
   - Nombre: `vital_red`
   - Cotejamiento: `utf8mb4_unicode_ci`
3. **Importar estructura:**
   - Ir a "Importar"
   - Seleccionar archivo: `sql/init_xampp.sql`
   - Ejecutar

### **PASO 3: Instalar Dependencias**

#### **Backend (Python)**
```bash
# Instalar dependencias Python
pip install mysql-connector-python pymysql sqlalchemy fastapi uvicorn redis google-api-python-client google-auth-httplib2 google-auth-oauthlib spacy structlog python-decouple pytest pytest-asyncio
```

#### **Frontend (Node.js)**
```bash
# Ir al directorio del cliente
cd client

# Instalar dependencias
npm install

# Construir proyecto
npm run build
```

### **PASO 4: Configurar Variables de Entorno**

Crear archivo `.env` en la raíz del proyecto:
```env
# Database Configuration (MySQL XAMPP)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vital_red
DB_USER=root
DB_PASSWORD=
DB_DRIVER=mysql+pymysql

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Gmail API Configuration
GMAIL_CREDENTIALS_FILE=credentials.json
GMAIL_TOKEN_FILE=token.json
GMAIL_SCOPES=https://www.googleapis.com/auth/gmail.readonly

# Security Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ENCRYPTION_KEY=your-encryption-key-here-change-in-production

# Application Configuration
DEBUG=True
LOG_LEVEL=INFO
ENVIRONMENT=development
```

---

## 🧪 **PRUEBAS DEL SISTEMA**

### **Prueba Automática Completa**
```bash
# Ejecutar todas las pruebas
python test_complete_system.py
```

### **Pruebas Manuales**

#### **1. Verificar Base de Datos**
```bash
# Conectar a MySQL
mysql -u root -p
use vital_red;
show tables;
select * from users;
```

#### **2. Probar Backend**
```bash
# Ir al directorio del backend
cd server/gmail_integration

# Iniciar servidor
python main_service.py
```

#### **3. Probar Frontend**
```bash
# Ir al directorio del frontend
cd client

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🌐 **ACCESO AL SISTEMA**

### **URLs de Acceso**
- 🌐 **Frontend:** http://localhost:5173
- 🔌 **Backend API:** http://localhost:8001
- 📡 **WebSocket:** ws://localhost:8002
- 🗄️ **phpMyAdmin:** http://localhost/phpmyadmin

### **Usuarios de Prueba**
| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@hospital-ese.com` | `admin123` | Administrador |
| `evaluador@hospital-ese.com` | `evaluator123` | Evaluador Médico |

---

## 📊 **VERIFICACIÓN DE FUNCIONAMIENTO**

### **✅ Checklist de Verificación**

#### **XAMPP Services**
- [ ] Apache ejecutándose (puerto 80)
- [ ] MySQL ejecutándose (puerto 3306)
- [ ] phpMyAdmin accesible

#### **Base de Datos**
- [ ] Base de datos `vital_red` creada
- [ ] Todas las tablas creadas (10 tablas)
- [ ] Usuarios de prueba insertados
- [ ] Datos de ejemplo cargados

#### **Backend**
- [ ] Dependencias Python instaladas
- [ ] Módulos importan correctamente
- [ ] Servidor API responde (puerto 8001)
- [ ] Endpoints funcionando

#### **Frontend**
- [ ] Dependencias Node.js instaladas
- [ ] Build exitoso
- [ ] Servidor dev ejecutándose (puerto 5173)
- [ ] Aplicación carga correctamente

#### **Integración**
- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Navegación entre vistas
- [ ] WebSocket conecta

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Problema: MySQL no inicia**
```bash
# Verificar puerto 3306
netstat -an | findstr 3306

# Cambiar puerto en XAMPP si está ocupado
# Editar: xampp/mysql/bin/my.ini
# Cambiar: port = 3307
```

### **Problema: Error de conexión a base de datos**
```bash
# Verificar credenciales en .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=

# Probar conexión manual
mysql -u root -h localhost -P 3306
```

### **Problema: Frontend no carga**
```bash
# Limpiar cache y reinstalar
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Problema: Backend no inicia**
```bash
# Verificar dependencias
pip list | grep mysql
pip list | grep sqlalchemy

# Reinstalar si es necesario
pip install --upgrade mysql-connector-python
```

---

## 📈 **MONITOREO Y LOGS**

### **Logs del Sistema**
- **Backend:** `server/gmail_integration/logs/`
- **Frontend:** Consola del navegador (F12)
- **MySQL:** `xampp/mysql/data/`
- **Apache:** `xampp/apache/logs/`

### **Métricas de Rendimiento**
- **Base de datos:** phpMyAdmin → Estado
- **API:** http://localhost:8001/health
- **Frontend:** Herramientas de desarrollador

---

## 🚀 **DESPLIEGUE EN PRODUCCIÓN**

### **Configuración de Producción**
1. **Cambiar credenciales de base de datos**
2. **Configurar SSL/HTTPS**
3. **Optimizar configuración MySQL**
4. **Configurar backup automático**
5. **Implementar monitoreo**

### **Backup de Base de Datos**
```bash
# Backup manual
mysqldump -u root vital_red > backup_vital_red.sql

# Restaurar backup
mysql -u root vital_red < backup_vital_red.sql
```

---

## 📞 **SOPORTE TÉCNICO**

### **Contacto**
- 📧 **Email:** soporte@hospital-ese.com
- 📞 **Teléfono:** +57 (2) 555-0123
- 🌐 **Documentación:** https://docs.vital-red.com

### **Recursos Adicionales**
- 📖 **Manual de Usuario:** `docs/manual_usuario.pdf`
- 🔧 **Guía Técnica:** `docs/guia_tecnica.pdf`
- 🎥 **Videos Tutorial:** `docs/videos/`

---

## 🎉 **¡SISTEMA LISTO!**

Una vez completados todos los pasos, **VITAL RED** estará completamente funcional con XAMPP:

- ✅ **Base de datos MySQL** configurada
- ✅ **Backend API** ejecutándose
- ✅ **Frontend React** funcionando
- ✅ **WebSocket** para tiempo real
- ✅ **Integración Gmail** lista
- ✅ **Sistema de usuarios** activo

**¡El sistema está listo para transformar la gestión médica en el Hospital Universitaria ESE!** 🏥✨

---

**Desarrollado por:** Departamento de Innovación y Desarrollo  
**Hospital Universitaria ESE**  
**Versión:** 2.0.0  
**Fecha:** Enero 2025
