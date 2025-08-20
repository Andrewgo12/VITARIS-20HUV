# 🏥 VITAL RED - Frontend Application
## Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

---

## 📋 **Descripción**

Frontend de la aplicación VITAL RED, un sistema de evaluación médica automatizada que integra procesamiento de emails de Gmail con inteligencia artificial para la gestión de referencias médicas.

---

## 🚀 **Tecnologías Utilizadas**

- **React 18** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de interfaz
- **React Router** - Enrutamiento
- **date-fns** - Manejo de fechas
- **Lucide React** - Iconos

---

## 📁 **Estructura del Proyecto**

```
client/
├── components/           # Componentes reutilizables
│   ├── modals/          # Modales especializados
│   │   ├── case-detail/     # Modales para detalle de casos
│   │   ├── medical-cases/   # Modales para casos médicos
│   │   ├── request-history/ # Modales para historial
│   │   ├── user-management/ # Modales para usuarios
│   │   └── vital-red/       # Modales para dashboard
│   └── ui/              # Componentes UI base (shadcn/ui)
├── config/              # Configuración de la aplicación
├── context/             # Contextos de React
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades de librerías
├── pages/               # Páginas principales
├── services/            # Servicios de API y comunicación
├── types/               # Definiciones de tipos TypeScript
├── utils/               # Utilidades y helpers
└── App.tsx              # Componente principal
```

---

## 🎯 **Funcionalidades Principales**

### **Autenticación y Autorización**
- ✅ Login con roles (Evaluador Médico / Administrador)
- ✅ Control de acceso basado en roles
- ✅ Gestión de sesiones seguras
- ✅ Navegación automática según rol

### **Dashboard Principal**
- ✅ Métricas en tiempo real
- ✅ Gráficos y estadísticas
- ✅ Alertas del sistema
- ✅ Resumen de actividad

### **Gestión de Casos Médicos**
- ✅ Bandeja de casos pendientes
- ✅ Filtros avanzados
- ✅ Detalle completo de casos
- ✅ Aprobación/rechazo de casos
- ✅ Historial de decisiones

### **Administración de Usuarios**
- ✅ Gestión completa de usuarios
- ✅ Asignación de roles y permisos
- ✅ Monitoreo de actividad
- ✅ Restablecimiento de contraseñas

### **Integración Gmail (Módulo IA)**
- ✅ Monitor de correos entrantes
- ✅ Configuración del capturador
- ✅ Procesamiento automático
- ✅ Estadísticas de procesamiento

### **Comunicación en Tiempo Real**
- ✅ WebSocket para actualizaciones instantáneas
- ✅ Notificaciones push
- ✅ Sincronización automática
- ✅ Estado de conexión

---

## ⚙️ **Configuración**

### **Variables de Entorno**

Copia el archivo `.env` y configura las variables según tu entorno:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_GMAIL_API_URL=http://localhost:8001
VITE_WEBSOCKET_URL=ws://localhost:8002

# Application Configuration
VITE_APP_NAME=VITAL RED
VITE_HOSPITAL_NAME=Hospital Universitaria ESE

# Feature Flags
VITE_ENABLE_GMAIL_INTEGRATION=true
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_NOTIFICATIONS=true
```

### **Configuración de Desarrollo**

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## 🔧 **Servicios Implementados**

### **API Service (`services/api.ts`)**
- Manejo centralizado de llamadas HTTP
- Autenticación automática con tokens
- Manejo de errores y reintentos
- Endpoints para todas las funcionalidades

### **WebSocket Service (`services/websocket.ts`)**
- Comunicación en tiempo real
- Reconexión automática
- Manejo de salas (rooms)
- Eventos especializados

### **Auth Service (`services/auth.ts`)**
- Gestión de autenticación
- Control de roles y permisos
- Verificación de rutas
- Renovación automática de tokens

---

## 🎣 **Hooks Personalizados**

### **useAuth**
```typescript
const { user, isAuthenticated, login, logout, hasRole } = useAuth();
```

### **useApi**
```typescript
const { data, loading, error, execute } = useApi(apiService.getMedicalCases);
```

### **useWebSocket**
```typescript
const { isConnected, subscribe, send } = useWebSocket();
```

### **Hooks Especializados**
- `useMedicalCases` - Gestión de casos médicos
- `useEmailUpdates` - Actualizaciones de emails
- `useReferralUpdates` - Actualizaciones de referencias
- `useSystemAlerts` - Alertas del sistema

---

## 🛠️ **Utilidades**

### **Constantes (`utils/constants.ts`)**
- Endpoints de API
- Roles y permisos
- Estados y tipos
- Mensajes de error/éxito

### **Helpers (`utils/helpers.ts`)**
- Formateo de fechas
- Validaciones
- Utilidades de archivos
- Funciones de string y números

### **Validadores (`utils/validators.ts`)**
- Validación de formularios
- Reglas de negocio
- Validaciones específicas médicas

### **Formateadores (`utils/formatters.ts`)**
- Formateo de fechas y números
- Formateo médico especializado
- Formateo de estados y roles

---

## 🎨 **Componentes UI**

### **Componentes Base (shadcn/ui)**
- Button, Input, Select, Textarea
- Card, Badge, Alert, Toast
- Dialog, Dropdown, Tabs
- Table, Progress, Calendar

### **Modales Especializados**
- **case-detail/**: Detalle de casos médicos
- **medical-cases/**: Gestión de casos
- **request-history/**: Historial de solicitudes
- **user-management/**: Administración de usuarios
- **vital-red/**: Dashboard y alertas

---

## 🔒 **Seguridad**

### **Autenticación**
- JWT tokens con expiración
- Renovación automática de tokens
- Logout automático por inactividad

### **Autorización**
- Control de acceso basado en roles
- Verificación de permisos por ruta
- Protección de componentes sensibles

### **Validación**
- Validación client-side robusta
- Sanitización de inputs
- Protección contra XSS

---

## 📱 **Responsive Design**

- ✅ Diseño adaptativo para móviles
- ✅ Breakpoints optimizados
- ✅ Navegación móvil
- ✅ Componentes touch-friendly

---

## 🧪 **Testing**

```bash
# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 📦 **Build y Deployment**

### **Desarrollo**
```bash
npm run dev
```

### **Producción**
```bash
npm run build
npm run preview
```

### **Docker**
```bash
docker build -t vital-red-frontend .
docker run -p 3000:3000 vital-red-frontend
```

---

## 🔧 **Scripts Disponibles**

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "lint": "eslint . --ext ts,tsx",
  "lint:fix": "eslint . --ext ts,tsx --fix",
  "type-check": "tsc --noEmit"
}
```

---

## 🐛 **Debugging**

### **Herramientas de Desarrollo**
- React DevTools
- Redux DevTools (si aplica)
- Network tab para APIs
- Console logs en desarrollo

### **Variables de Debug**
```bash
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true
```

---

## 📚 **Documentación Adicional**

- [Guía de Componentes](./docs/components.md)
- [API Reference](./docs/api.md)
- [Guía de Estilos](./docs/styles.md)
- [Deployment Guide](./docs/deployment.md)

---

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 **Licencia**

Este proyecto es propiedad del Hospital Universitaria ESE - Departamento de Innovación y Desarrollo.

---

## 👥 **Equipo de Desarrollo**

**Hospital Universitaria ESE**  
Departamento de Innovación y Desarrollo  
📧 desarrollo@hospital-ese.com  
🌐 https://hospital-ese.com

---

## 🆘 **Soporte**

Para soporte técnico:
- 📧 soporte@hospital-ese.com
- 📞 +57 (2) 555-0123
- 💬 Slack: #vital-red-support

---

**Versión:** 2.0.0  
**Última actualización:** Enero 2025  
**Estado:** ✅ Producción Ready
