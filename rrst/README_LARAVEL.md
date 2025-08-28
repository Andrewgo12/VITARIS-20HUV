# VITAL RED System - Laravel Version

## 🏥 Sistema de Referencias Hospitalarias

Esta es la versión Laravel del sistema VITAL RED, convertida desde la aplicación Next.js original. Mantiene toda la funcionalidad del sistema médico con una arquitectura Laravel moderna.

## 🚀 Características

### 👨‍⚕️ Panel Médico
- **Dashboard Médico**: Estadísticas en tiempo real de casos médicos
- **Gestión de Casos**: Evaluación y seguimiento de casos médicos
- **Gestión de Pacientes**: Información completa de pacientes
- **Centro de Urgencias**: Manejo de casos de emergencia
- **Pacientes Hospitalizados**: Seguimiento de internaciones
- **Historial Médico**: Registro histórico completo

### 👨‍💼 Panel Administrativo
- **Dashboard Admin**: Control y supervisión del sistema
- **Gestión de Usuarios**: Administración de médicos y personal
- **Configuración del Sistema**: Parámetros y configuraciones
- **Respaldos**: Sistema de backup automático
- **Supervisión**: Monitoreo del sistema en tiempo real
- **Monitor de IA**: Seguimiento del procesamiento de IA

## 🛠️ Tecnologías

- **Backend**: Laravel 11
- **Frontend**: Blade Templates + Tailwind CSS + Alpine.js
- **Base de Datos**: MySQL/PostgreSQL
- **Autenticación**: Laravel Auth
- **UI**: Tailwind CSS + Lucide Icons
- **Interactividad**: Alpine.js

## 📦 Instalación

### Prerrequisitos
- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL/PostgreSQL

### Pasos de Instalación

1. **Instalar dependencias de PHP**
   ```bash
   cd rrst
   composer install
   ```

2. **Configurar el archivo de entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configurar la base de datos en `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=vital_red_laravel
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   ```

4. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

5. **Instalar dependencias de Node.js (opcional)**
   ```bash
   npm install
   npm run build
   ```

6. **Iniciar el servidor**
   ```bash
   php artisan serve
   ```

## 👥 Usuarios de Prueba

El sistema incluye usuarios de prueba:

### Administrador
- **Email**: admin@hospital.com
- **Contraseña**: password
- **Rol**: Administrador del sistema

### Médico
- **Email**: medico@hospital.com
- **Contraseña**: password
- **Rol**: Médico evaluador

### Médicos Adicionales
- **Email**: maria.gonzalez@hospital.com (Cardiología)
- **Email**: carlos.rodriguez@hospital.com (Neurología)
- **Contraseña**: password

## 🔗 Integración con Sistema de IA

El sistema Laravel se conecta automáticamente con el sistema de procesamiento de Gmail (IA) que se ejecuta en el puerto 3000. Las APIs disponibles son:

- `GET /api/medical-cases` - Casos médicos
- `GET /api/patient-data` - Datos de pacientes
- `GET /api/urgency-data` - Casos de urgencia
- `GET /api/hospitalization-data` - Datos de hospitalización
- `GET /api/historical-data` - Registros históricos
- `GET /api/admin-data` - Datos administrativos

## 📁 Estructura del Proyecto

```
rrst/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── MedicoController.php
│   │   │   └── AdminController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   └── Models/
│       └── User.php
├── resources/
│   └── views/
│       ├── layouts/
│       │   ├── app.blade.php
│       │   └── dashboard.blade.php
│       ├── components/
│       │   ├── sidebar.blade.php
│       │   └── header.blade.php
│       ├── auth/
│       │   └── login.blade.php
│       ├── medico/
│       │   ├── dashboard.blade.php
│       │   ├── casos.blade.php
│       │   ├── pacientes.blade.php
│       │   ├── urgencias.blade.php
│       │   ├── hospitalizados.blade.php
│       │   └── historial.blade.php
│       └── admin/
│           └── dashboard.blade.php
├── routes/
│   └── web.php
└── database/
    ├── migrations/
    └── seeders/
```

## 🎨 Características de UI

- **Diseño Responsivo**: Optimizado para desktop y móvil
- **Tema Moderno**: Gradientes y efectos de cristal
- **Iconografía**: Lucide Icons para consistencia visual
- **Interactividad**: Alpine.js para componentes dinámicos
- **Notificaciones**: Sistema de toast notifications
- **Navegación**: Sidebar dinámico según el rol del usuario

## 🔒 Seguridad

- **Autenticación**: Sistema de login seguro
- **Autorización**: Middleware para control de acceso por roles
- **CSRF Protection**: Protección contra ataques CSRF
- **Validación**: Validación de datos en formularios
- **Sanitización**: Limpieza de datos de entrada

## 🚀 Despliegue

### Producción
1. Configurar servidor web (Apache/Nginx)
2. Configurar base de datos de producción
3. Ejecutar `composer install --optimize-autoloader --no-dev`
4. Ejecutar `php artisan config:cache`
5. Ejecutar `php artisan route:cache`
6. Ejecutar `php artisan view:cache`

### Variables de Entorno Importantes
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com
```

## 📞 Soporte

Para soporte técnico o consultas sobre el sistema:
- Revisar la documentación del sistema original en `/COMPREHENSIVE_INTEGRATION_STATUS.md`
- Verificar que el sistema de IA esté ejecutándose en el puerto 3000
- Comprobar la conectividad con las APIs del sistema de Gmail

## 📄 Licencia

Este proyecto es parte del sistema VITAL RED para Hospital Universitaria ESE.

---

**Nota**: Este sistema Laravel funciona en conjunto con el sistema de procesamiento de Gmail con IA. Asegúrate de que ambos sistemas estén ejecutándose para una funcionalidad completa.
