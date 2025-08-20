# VITAL RED - Estructura del Proyecto Limpia

## Descripción General
VITAL RED es un sistema de gestión digital para el proceso de referencia y contra-referencia de pacientes en el Hospital Universitaria ESE. El proyecto ha sido limpiado y optimizado para incluir únicamente los componentes necesarios para el funcionamiento del sistema.

## Estructura de Archivos

### 📁 Páginas Principales (`client/pages/`)
- **Login.tsx** - Sistema de autenticación con roles específicos
- **VitalRedDashboard.tsx** - Panel principal con métricas y navegación según rol
- **MedicalCasesInbox.tsx** - Bandeja de casos médicos (Médico Evaluador)
- **ClinicalCaseDetail.tsx** - Detalle de caso clínico (Médico Evaluador)
- **RequestHistory.tsx** - Historial de solicitudes (Médico Evaluador)
- **UserManagement.tsx** - Gestión de usuarios (Administrador)

### 📁 Modales Únicos por Vista (`client/components/modals/`)

#### 🔹 Bandeja de Casos Médicos (`medical-cases/`)
- **QuickDecisionModal.tsx** - Decisiones rápidas de aceptar/rechazar
- **BulkActionModal.tsx** - Acciones masivas en múltiples casos
- **AdvancedFilterModal.tsx** - Filtros avanzados de búsqueda

#### 🔹 Detalle de Caso Clínico (`case-detail/`)
- **FileViewerModal.tsx** - Visualizador de archivos médicos
- **ObservationEntryModal.tsx** - Añadir observaciones clínicas
- **AdditionalInfoRequestModal.tsx** - Solicitar información adicional
- **CaseHistoryTimelineModal.tsx** - Historial completo del caso

#### 🔹 Gestión de Usuarios (`user-management/`)
- **UserCreationEditModal.tsx** - Crear/editar usuarios del sistema
- **PasswordResetModal.tsx** - Restablecer contraseñas con múltiples métodos
- **RoleAssignmentModal.tsx** - Asignar roles y permisos específicos
- **UserActivityModal.tsx** - Monitorear actividad y logs de usuarios

#### 🔹 Historial de Solicitudes (`request-history/`)
- **RequestTimelineModal.tsx** - Cronología detallada de cada solicitud
- **DecisionAnalysisModal.tsx** - Análisis de decisiones médicas con IA
- **PerformanceReportModal.tsx** - Reportes de rendimiento del evaluador

#### 🔹 Dashboard VITAL RED (`vital-red/`)
- **AlertDetailsModal.tsx** - Detalles de alertas del sistema
- **ChartDrillDownModal.tsx** - Análisis detallado de gráficos

### 📁 Componentes UI Esenciales (`client/components/ui/`)
Se mantuvieron únicamente los componentes UI necesarios:
- **alert-dialog.tsx**, **alert.tsx** - Alertas y diálogos
- **badge.tsx**, **button.tsx**, **card.tsx** - Componentes básicos
- **calendar.tsx**, **checkbox.tsx** - Formularios
- **dialog.tsx**, **dropdown-menu.tsx** - Modales y menús
- **form.tsx**, **input.tsx**, **label.tsx** - Formularios
- **notification-system.tsx** - Sistema de notificaciones
- **permissions-system.tsx** - Control de permisos
- **popover.tsx**, **progress.tsx** - Componentes interactivos
- **radio-group.tsx**, **select.tsx** - Selecciones
- **separator.tsx**, **table.tsx**, **tabs.tsx** - Estructura
- **textarea.tsx**, **toast.tsx**, **toaster.tsx** - Entrada y notificaciones
- **tooltip.tsx**, **use-toast.ts** - Ayudas contextuales

### 📁 Contextos (`client/context/`)
- **LanguageContext.tsx** - Gestión de idiomas (español/inglés)

### 📁 Hooks (`client/hooks/`)
- **use-mobile.tsx** - Detección de dispositivos móviles
- **use-toast.ts** - Gestión de notificaciones toast

### 📁 Utilidades (`client/lib/`)
- **utils.ts** - Funciones utilitarias generales

### 📁 Componentes Generales (`client/components/`)
- **ErrorBoundary.tsx** - Manejo de errores
- **LanguageFloatingButton.tsx** - Botón flotante de idiomas

## Rutas del Sistema

### 🔹 Rutas Comunes
- `/` - Redirección al login
- `/login` - Página de autenticación

### 🔹 Rutas del Médico Evaluador
- `/vital-red/dashboard` - Dashboard principal
- `/vital-red/medical-cases` - Bandeja de casos médicos
- `/vital-red/case-detail/:caseId` - Detalle de caso específico
- `/vital-red/request-history` - Historial de solicitudes evaluadas

### 🔹 Rutas del Administrador
- `/vital-red/dashboard` - Dashboard principal
- `/vital-red/user-management` - Gestión de usuarios del sistema

## Funcionalidades Implementadas

### ✅ Para Médicos Evaluadores
1. **Bandeja de Casos Médicos**
   - Lista de solicitudes con filtros avanzados
   - Decisiones rápidas y acciones masivas
   - Priorización automática por IA

2. **Detalle de Caso Clínico**
   - Visualización completa de información médica
   - Visor de archivos PDF e imágenes
   - Sistema de observaciones y solicitudes de información
   - Historial completo del caso

3. **Historial de Solicitudes**
   - Cronología detallada de cada caso
   - Análisis de decisiones con métricas de calidad
   - Reportes de rendimiento personal

### ✅ Para Administradores
1. **Gestión de Usuarios**
   - Crear, editar y eliminar usuarios
   - Restablecimiento de contraseñas con múltiples métodos
   - Asignación de roles y permisos granulares
   - Monitoreo de actividad de usuarios

2. **Dashboard de Supervisión**
   - Métricas generales del sistema
   - Alertas y notificaciones
   - Análisis de rendimiento global

## Características Técnicas

### 🔧 Tecnologías Utilizadas
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Query + Context API

### 🔧 Características de Diseño
- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **Accesibilidad**: Componentes accesibles con ARIA
- **Internacionalización**: Soporte para español e inglés
- **Tema**: Diseño moderno con esquema de colores médicos

### 🔧 Seguridad y Permisos
- **Control de Acceso**: Basado en roles (Médico Evaluador / Administrador)
- **Autenticación**: Sistema de login con validación
- **Auditoría**: Logs de actividad de usuarios
- **Permisos Granulares**: Control específico por funcionalidad

## Archivos Eliminados (Limpieza)

### 🗑️ Componentes No Utilizados
- AlertsManager.tsx, VitalSignsChart.tsx
- Modales genéricos no específicos de VITAL RED
- Componentes UI no utilizados (accordion, avatar, carousel, etc.)

### 🗑️ Configuraciones No Utilizadas
- complete-system.ts, system.ts
- Contextos no utilizados (FormContext, ThemeContext, MockFormContext)
- Utilidades no utilizadas (accessibility, performance, responsive)

### 🗑️ Servicios No Utilizados
- api.ts (reemplazado por sistema interno)
- Hooks no utilizados (use-auto-save)

## Estado del Proyecto

### ✅ Completado
- [x] Sistema de autenticación
- [x] Dashboard principal para ambos roles
- [x] Bandeja de casos médicos con modales únicos
- [x] Detalle de caso clínico con modales únicos
- [x] Gestión de usuarios con modales únicos
- [x] Historial de solicitudes con modales únicos
- [x] Sistema de permisos y roles
- [x] Diseño responsive
- [x] Limpieza de archivos no utilizados

### 📋 Pendiente (Según guía de vistas)
- [ ] Panel de supervisión (Administrador)
- [ ] Configuración de sistema (Administrador)
- [ ] Gestión de respaldo (Administrador)
- [ ] Monitor de correos entrantes (Módulo IA)
- [ ] Configuración del capturador de correos (Módulo IA)

## Próximos Pasos

1. **Implementar vistas faltantes del administrador**
2. **Crear módulo de IA para procesamiento de correos**
3. **Integrar con backend Laravel**
4. **Pruebas de usuario en entorno hospitalario**
5. **Optimización de rendimiento**

---

**Desarrollado por**: Kevin Andrés González Dinas y Kevin David Chabarro  
**Institución**: Hospital Universitaria ESE - Departamento de Innovación y Desarrollo  
**Fecha**: Agosto 2025
