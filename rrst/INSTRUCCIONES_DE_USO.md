# 🏥 VITAL RED System - Instrucciones de Uso

## 🚀 **INICIO RÁPIDO**

### **1. Iniciar el Sistema**
```bash
cd rrst
php artisan serve
```

### **2. Acceder al Sistema**
- **URL**: http://127.0.0.1:8000
- **Login**: http://127.0.0.1:8000/login

### **3. Credenciales de Acceso**
| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | admin@hospital.com | password |
| **Médico** | medico@hospital.com | password |

---

## 👨‍💼 **PANEL ADMINISTRATIVO**

### **Acceso**
- **URL**: http://127.0.0.1:8000/admin/dashboard
- **Usuario**: admin@hospital.com / password

### **Funciones Disponibles**

#### **📊 Dashboard Administrativo**
- Estadísticas del sistema en tiempo real
- Métricas de usuarios activos
- Estado de los servicios
- Resumen de actividad

#### **👥 Gestión de Usuarios**
- Crear, editar y eliminar usuarios
- Asignar roles (Admin/Médico)
- Gestionar especialidades médicas
- Control de acceso por usuario

#### **⚙️ Configuración del Sistema**
- Configuración de email
- Parámetros del sistema de IA
- Configuración de seguridad
- Ajustes de notificaciones

#### **💾 Sistema de Respaldos**
- Configurar respaldos automáticos
- Ejecutar respaldos manuales
- Restaurar desde respaldos
- Historial de respaldos

#### **🔍 Centro de Supervisión**
- Monitoreo del sistema en tiempo real
- Logs de actividad
- Métricas de rendimiento
- Alertas del sistema

#### **🤖 Monitor de IA**
- Estado del sistema de procesamiento de Gmail
- Métricas de procesamiento de IA
- Configuración de parámetros de IA
- Historial de procesamiento

---

## 👨‍⚕️ **PANEL MÉDICO**

### **Acceso**
- **URL**: http://127.0.0.1:8000/medico/dashboard
- **Usuario**: medico@hospital.com / password

### **Funciones Disponibles**

#### **📊 Dashboard Médico**
- Casos pendientes de evaluación
- Estadísticas de casos por prioridad
- Métricas de tiempo de respuesta
- Resumen de actividad médica

#### **📋 Gestión de Casos Médicos**
- Lista completa de casos médicos
- Filtros por prioridad, especialidad, estado
- Búsqueda avanzada de casos
- Exportación de reportes

#### **🔍 Detalle de Casos**
- Información completa del paciente
- Historia clínica detallada
- Estudios y exámenes
- Notas y comentarios médicos
- Acciones: Aprobar/Rechazar/Solicitar información

#### **👥 Gestión de Pacientes**
- Lista de pacientes
- Información demográfica
- Historial médico
- Estado actual de cada paciente

#### **🚨 Centro de Urgencias**
- Casos críticos y de alta prioridad
- Tiempo de espera por caso
- Signos vitales actuales
- Priorización automática

#### **🏥 Pacientes Hospitalizados**
- Lista de pacientes internados
- Información de camas y salas
- Planes de tratamiento
- Fechas estimadas de alta

#### **📚 Historial Médico**
- Registro histórico completo
- Casos resueltos
- Estadísticas de tratamientos
- Búsqueda por fechas y criterios

---

## 🛠️ **COMANDOS DE ADMINISTRACIÓN**

### **Diagnóstico del Sistema**
```bash
# Estado básico
php artisan vital-red:status

# Estado detallado
php artisan vital-red:status --detailed
```

### **Gestión de Cache**
```bash
# Limpiar cache del sistema
php artisan vital-red:cache-clear

# Limpiar todo el cache (incluye Laravel)
php artisan vital-red:cache-clear --all
```

### **Gestión de Datos**
```bash
# Crear datos de prueba
php artisan vital-red:seed

# Recrear todos los datos
php artisan vital-red:seed --fresh
```

### **Comandos Laravel Estándar**
```bash
# Limpiar cache de configuración
php artisan config:clear

# Limpiar cache de rutas
php artisan route:clear

# Limpiar cache de vistas
php artisan view:clear

# Ejecutar migraciones
php artisan migrate

# Ver estado de migraciones
php artisan migrate:status
```

---

## 🔧 **SOLUCIÓN DE PROBLEMAS**

### **Problema: Error de Clave de Aplicación**
```bash
php artisan key:generate
```

### **Problema: Error de Base de Datos**
```bash
php artisan migrate
php artisan vital-red:seed
```

### **Problema: Errores de Cache**
```bash
php artisan vital-red:cache-clear --all
```

### **Problema: Sistema de IA No Disponible**
- El sistema funciona normalmente sin el sistema de IA
- Usa datos de prueba locales como respaldo
- Verificar configuración en `.env`: `AI_SYSTEM_URL`

### **Problema: Permisos de Archivos (Linux/Mac)**
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

---

## 📱 **NAVEGACIÓN DEL SISTEMA**

### **Sidebar Dinámico**
- El menú lateral cambia según el rol del usuario
- **Admin**: Ve todas las opciones administrativas
- **Médico**: Ve solo las opciones médicas

### **Navegación Rápida**
- **Logo**: Regresa al dashboard principal
- **Notificaciones**: Campana en el header
- **Perfil**: Menú desplegable en el header
- **Logout**: Cerrar sesión segura

### **Filtros y Búsquedas**
- **Casos Médicos**: Filtrar por prioridad, especialidad, estado
- **Pacientes**: Buscar por nombre, documento, estado
- **Historial**: Filtrar por fechas, especialidad, médico

---

## 🔒 **SEGURIDAD Y ACCESO**

### **Roles del Sistema**
- **Admin**: Acceso completo al sistema
- **Médico**: Acceso solo a funciones médicas

### **Protección de Rutas**
- Todas las rutas están protegidas por autenticación
- Control de acceso basado en roles
- Redirección automática según permisos

### **Sesiones**
- Tiempo de sesión: 120 minutos
- Cierre automático por inactividad
- Protección CSRF en formularios

---

## 📊 **DATOS Y REPORTES**

### **Exportación de Datos**
- Casos médicos en formato PDF/Excel
- Reportes de pacientes
- Estadísticas del sistema
- Logs de actividad

### **Estadísticas Disponibles**
- Casos por prioridad y especialidad
- Tiempos de respuesta médica
- Ocupación hospitalaria
- Métricas de rendimiento del sistema

---

## 🌐 **INTEGRACIÓN CON SISTEMA DE IA**

### **Configuración**
- Configurar `AI_SYSTEM_URL` en `.env`
- El sistema funciona con o sin IA
- Fallback automático a datos locales

### **APIs Disponibles**
- `/api/vital-red/medical-cases`
- `/api/vital-red/patient-data`
- `/api/vital-red/urgency-data`
- `/api/vital-red/hospitalization-data`
- `/api/vital-red/historical-data`
- `/api/vital-red/admin-data`

---

## 📞 **SOPORTE TÉCNICO**

### **Información del Sistema**
```bash
php artisan --version
php artisan vital-red:status --detailed
```

### **Logs del Sistema**
- **Ubicación**: `storage/logs/laravel.log`
- **Nivel de detalle**: Configurable en `.env`

### **Contacto**
- **Sistema**: VITAL RED v1.0.0
- **Tecnología**: Laravel 11 + PHP 8.2+
- **Documentación**: Ver archivos README y TECHNICAL_DOCUMENTATION

---

**🏥 VITAL RED System**  
**Hospital Universitaria ESE**  
**Versión 1.0.0 - Laravel**
