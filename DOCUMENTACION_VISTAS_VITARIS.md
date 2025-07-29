# Documentación Completa del Sistema VITARIS
**Sistema médico integral para gestión de remisiones EPS al Hospital Universitario del Valle (HUV)**

> Documentación exhaustiva de todas las vistas, modales y elementos específicos del sistema médico VITARIS

## Índice Completo

1. [Vistas Principales del Sistema](#vistas-principales-del-sistema)
2. [Modales del Formulario EPS](#modales-del-formulario-eps)
3. [Vistas Médicas Avanzadas](#vistas-médicas-avanzadas)
4. [Vistas de Demos Individuales](#vistas-de-demos-individuales)
5. [Vistas de Diagramas del Sistema](#vistas-de-diagramas-del-sistema)
6. [Vista de Detalle de Paciente](#vista-de-detalle-de-paciente)
7. [Vista de Error 404](#vista-de-error-404)
8. [Navegador del Sistema](#navegador-del-sistema)
9. [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)

---

## Vistas Principales del Sistema

### 1. Index.tsx - Página Principal
**Función Principal:** Portal de entrada al sistema de remisión EPS
**Descripción:** Página inicial que presenta el sistema de remisión médica con un formulario completo integrado

**Características:**
- Branding profesional del HUV con logos institucionales
- Integración del formulario EPSFormWizard completo en 5 pasos
- Diseño responsivo con gradientes médicos profesionales
- Botón de emergencia flotante para situaciones críticas
- Información institucional y de seguridad
- Patrón de fondo médico sutil

**Elementos Visuales:**
- Header con logo dual (EPS + HUV)
- Indicador de sistema digital y seguro
- Formulario wizard integrado paso a paso
- Footer con información de derechos y estándares

### 2. LandingPage.tsx - Página de Presentación
**Función Principal:** Página informativa y promocional del sistema
**Descripción:** Landing page comercial que explica las funcionalidades del sistema

**Secciones Principales:**
- **Hero Section:** Presentación del sistema con estadísticas clave
- **Características:** 4 features principales con iconos y descripciones
- **Proceso:** Flujo de trabajo en 5 pasos visuales
- **Beneficios:** Ventajas para EPS y HUV por separado
- **Especificaciones Técnicas:** Seguridad, accesibilidad y calidad
- **Soporte:** Información de contacto y capacitación

**Call-to-Action:**
- Botón principal "Acceder al Sistema"
- Botón secundario "Explorar Vistas Demo"
- Enlace de descarga de información

### 3. Login.tsx - Sistema de Autenticación
**Función Principal:** Portal de acceso seguro al sistema
**Descripción:** Sistema de login dual para EPS y personal hospitalario

**Características de Seguridad:**
- Autenticación diferenciada por tipo de usuario (EPS vs HUV)
- Selección visual del tipo de acceso con iconos descriptivos
- Validación de credenciales en tiempo real
- Opción "recordar sesión"
- Recuperación de contraseña
- Indicadores de conexión segura

**Tipos de Usuario:**
- **EPS:** Acceso para generar remisiones médicas
- **HUV:** Acceso para personal médico y administrativo

**Elementos de UX:**
- Diseño split-screen con branding en la izquierda
- Formulario centrado con validación visual
- Información de soporte técnico
- Redirección automática según tipo de usuario

### 4. EPSForm.tsx - Formulario de Remisión
**Función Principal:** Interfaz simplificada para el formulario EPS
**Descripción:** Versión limpia del formulario con header institucional

**Características:**
- Header con información de sesión
- Botón de cierre de sesión visible
- Integración completa del wizard de 5 pasos
- Diseño enfocado en la tarea sin distracciones
- Footer con información legal

### 5. HUVDashboard.tsx - Dashboard Básico
**Función Principal:** Gestión básica de remisiones para el HUV
**Descripción:** Dashboard médico para revisar y autorizar remisiones

**Funcionalidades:**
- **Lista de Pacientes:** Tabla con información completa de remisiones
- **Filtros:** Por estado (pendiente, autorizado, rechazado)
- **Acciones por Paciente:**
  - Ver detalles completos en modal
  - Calificar prioridad médica
  - Autorizar o rechazar remisión
- **Información Mostrada:**
  - Datos de identificación
  - EPS de origen
  - Síntomas y prioridad
  - Signos vitales básicos
  - Tiempo de llegada

**Estados del Sistema:**
- Pacientes pendientes de evaluación
- Casos autorizados para traslado
- Casos rechazados con justificación

### 6. HUVDashboardAdvanced.tsx - Dashboard Médico Profesional
**Función Principal:** Monitoreo médico completo en tiempo real
**Descripción:** Dashboard avanzado para gestión hospitalaria profesional

**Características Avanzadas:**
- **Estadísticas en Tiempo Real:** Pacientes totales, críticos, urgentes, nuevos
- **Sistema de Alertas:** Notificaciones críticas automáticas
- **Filtros Múltiples:** Por urgencia, proceso médico, términos de búsqueda
- **Información Detallada por Paciente:**
  - Datos demográficos completos
  - Diagnósticos y síntomas detallados
  - Signos vitales con estado (normal/alerta/vigilancia)
  - Medicamentos actuales
  - Información de contacto y emergencia
  - Ubicación y médico asignado

**Herramientas Integradas:**
- Calculadoras médicas rápidas (IMC, dosificación)
- Monitor de signos vitales
- Protocolos de emergencia
- Exportación de reportes

---

## Modales del Formulario EPS

El sistema utiliza un wizard de 5 pasos con modales especializados:

### 1. PatientIdentificationModal.tsx - Identificación del Paciente
**Función Principal:** Captura completa de datos del paciente
**Descripción:** Primer paso del formulario con información básica y médica

**Secciones de Información:**
- **Información Personal:** Identificación, nombre, fecha de nacimiento, edad (calculada), sexo
- **Información EPS:** EPS, régimen, tipo de afiliado, número, estado, SISBEN
- **Contacto:** Teléfono, email, dirección completa
- **Contacto de Emergencia:** Nombre, teléfono, parentesco
- **Información Sociodemográfica:** Ocupación, educación, estado civil
- **Información Reproductiva:** Estado de embarazo (si aplica), semanas de gestación
- **Evaluación Clínica Inicial:** Síntomas actuales, inicio, intensidad, escala de dolor
- **Historial Médico:** Condiciones crónicas, hospitalizaciones previas
- **Autorización:** Número de autorización de la aseguradora

**Validaciones:**
- Campos obligatorios marcados con asterisco
- Cálculo automático de edad basado en fecha de nacimiento
- Validación de formatos (email, teléfono, documentos)
- Campos condicionales para embarazo
- Carga obligatoria de archivos (documentos de identidad, carné EPS)

### 2. ReferralDiagnosisModal.tsx - Motivo de Remisión y Diagnóstico
**Función Principal:** Información médica especializada de la remisión
**Descripción:** Segundo paso enfocado en aspectos clínicos

**Información de Remisión:**
- Fecha y hora de consulta
- Servicio de destino (urgencias, consulta externa, hospitalización)
- Motivo detallado de remisión
- Especialidad médica solicitada

**Diagnósticos CIE10:**
- Diagnóstico principal con búsqueda inteligente
- Dos diagnósticos secundarios obligatorios
- Base de datos de códigos CIE10 integrada

**Historial Médico:**
- Antecedentes personales (HTA, diabetes, cardiopatía, etc.)
- Antecedentes familiares relevantes
- Alergias conocidas detalladas
- Medicamentos actuales con dosis y frecuencia

### 3. VitalSignsModal.tsx - Signos Vitales y Estado Clínico
**Función Principal:** Registro de parámetros vitales del paciente
**Descripción:** Tercer paso con mediciones clínicas precisas

**Signos Vitales Principales:**
- Frecuencia cardíaca con indicadores de estado (normal/bradicardia/taquicardia)
- Frecuencia respiratoria
- Temperatura con alertas de fiebre/hipotermia
- Presión arterial (sistólica y diastólica) con visualización combinada
- Saturación de oxígeno con alertas críticas

**Mediciones Adicionales:**
- Escala de Glasgow (evaluación neurológica)
- Glucometría
- Peso y talla del paciente
- Cálculo automático de IMC con categorización

**Indicadores Inteligentes:**
- Clasificación automática de signos vitales (normal/anormal)
- Alertas visuales para valores críticos
- Categorización de IMC con recomendaciones
- Validación de rangos normales

**Archivos de Soporte:**
- Carga de hojas de signos vitales
- Fotografías de monitores
- Documentos de respaldo médico

### 4. DocumentsModal.tsx - Documentos de Soporte y Observaciones
**Función Principal:** Gestión completa de archivos médicos
**Descripción:** Cuarto paso para documentación de respaldo

**Información del Profesional:**
- Nombre completo del profesional que diligencia
- Cargo o posición (médico, enfermero, etc.)
- Teléfono de contacto directo

**Observaciones Clínicas:**
- Campo de texto libre para observaciones adicionales de la EPS
- Recomendaciones especiales para el HUV
- Contexto específico del caso

**Sistema de Archivos Avanzado:**
- **Categorización Automática:** Historia clínica, exámenes de laboratorio, imágenes diagnósticas, informes clínicos, evidencia fotográfica, pruebas especiales
- **Drag & Drop:** Interfaz de arrastrar y soltar archivos
- **Validación de Formatos:** PDF, DOC, DOCX, JPG, JPEG, PNG
- **Límites de Tamaño:** Máximo 10MB por archivo
- **Previsualización:** Iconos y detalles de cada archivo
- **Gestión:** Eliminación individual de archivos
- **Estadísticas:** Contador total de archivos y tamaño

**Funciones Adicionales:**
- Guardado local del formulario
- Descarga de PDF del formulario completo
- Validación completa antes del envío

### 5. ValidationModal.tsx - Validación Final y Confirmación
**Función Principal:** Revisión completa antes del envío
**Descripción:** Quinto y último paso con resumen ejecutivo

**Resumen por Secciones:**
- **Datos del Paciente:** Nombre, identificación, edad, EPS, teléfono, archivos
- **Remisión y Diagnóstico:** Servicio, motivo, diagnóstico principal, especialidad
- **Signos Vitales:** FC, FR, temperatura, PA, SatO2, IMC, archivos
- **Documentos:** Profesional, cargo, teléfono, archivos de soporte, observaciones

**Funcionalidades de Edición:**
- Botones de edición para volver a cualquier paso
- Navegación directa a secciones específicas
- Validación en tiempo real de completitud

**Resumen Final:**
- Estadísticas totales (archivos, destino, servicio, prioridad)
- Confirmación de envío al HUV
- Alerta final de verificación

**Estado Post-Envío:**
- Pantalla de confirmación exitosa
- Número de referencia único generado
- Tiempo estimado de respuesta
- Opciones de impresión y nuevo formulario

---

## Vistas Médicas Avanzadas

### 1. EmergencyProtocols.tsx - Protocolos de Emergencia
**Función Principal:** Guías de manejo para situaciones críticas
**Descripción:** Sistema de protocolos médicos de emergencia

**Protocolos Incluidos:**
- **Reanimación Cardiopulmonar (RCP):** Pasos detallados, medicamentos, equipo médico
- **Código Stroke:** Evaluación FAST, tiempos críticos, protocolo trombolítico
- **Shock Anafiláctico:** Manejo inmediato con epinefrina
- **Trauma Severo:** Protocolos de la hora dorada

**Características:**
- Pasos numerados y secuenciales
- Medicamentos específicos con dosis
- Tiempos límite críticos
- Equipos médicos requeridos
- Botones de activación de protocolo

**Pestañas del Sistema:**
- **Protocolos:** Guías detalladas paso a paso
- **Códigos:** Sistema de códigos hospitalarios (azul, rojo, amarillo)
- **Entrenamiento:** Simulacros y certificaciones

### 2. ICUMonitoring.tsx - Monitoreo de UCI
**Función Principal:** Cuidados intensivos en tiempo real
**Descripción:** Sistema completo de monitoreo para unidad de cuidados intensivos

**Información de Pacientes UCI:**
- **Datos Básicos:** Nombre, edad, cama, condición, severidad
- **Signos Vitales en Tiempo Real:** FC, PA, temperatura, SpO2, FR con tendencias
- **Estado Neurológico:** Escala de Glasgow actualizada
- **Ventilación Mecánica:** Modo, FiO2, PEEP cuando aplica
- **Medicamentos Críticos:** Vasoactivos, sedantes, antibióticos
- **Scores Pronósticos:** APACHE II, cálculo de mortalidad

**Visualización Avanzada:**
- Códigos de color por severidad
- Indicadores de tendencia en signos vitales
- Alertas automáticas por valores anormales
- Actualización en tiempo real (cada 30 segundos)

**Pestañas Especializadas:**
- **Monitoreo:** Vista principal con signos vitales
- **Ventiladores:** Control de parámetros ventilatorios
- **Scores:** APACHE II y Glasgow detallados
- **Intervenciones:** Catéteres, monitores, dispositivos activos

### 3. MedicalTools.tsx - Herramientas Médicas
**Función Principal:** Calculadoras y herramientas para práctica clínica
**Descripción:** Suite completa de herramientas médicas profesionales

**Calculadoras Médicas:**
- **IMC:** Cálculo con categorización y recomendaciones
- **Dosificación:** Cálculo por peso corporal para medicamentos
- **Zonas de Frecuencia Cardíaca:** Cardíaco de entrenamiento y rehabilitación
- **Monitor de Signos Vitales:** Valores de referencia normales

**Protocolos de Emergencia:**
- RCP adultos con pasos detallados
- Shock anafiláctico con medicamentos
- Código stroke con tiempos críticos

**Medicamentos de Emergencia:**
- Epinefrina: dosis, indicaciones, vías
- Adenosina: para taquicardia supraventricular
- Atropina: para bradicardia sintomática
- Amiodarona: para arritmias ventriculares

**Tiempos Críticos:**
- Stroke: ventana de 4.5 horas para trombolítico
- IAM: 90 minutos para angioplastia
- Trauma severo: hora dorada
- Sepsis: 1 hora para antibióticos

### 4. SystemIndex.tsx - Navegador del Sistema
**Función Principal:** Portal de navegación completo
**Descripción:** Vista de exploración de todas las funcionalidades del sistema

**Categorías de Vistas:**
- **Principales (4):** Landing, Login, Formulario EPS, Dashboard HUV
- **Médicas Básicas (2):** Dashboard avanzado, Herramientas médicas
- **Médicas Avanzadas (12):** UCI, Emergencias, Admisiones, Cirugías, Laboratorios, Farmacia, Interconsultas, Reportes, Comunicación, Citas, Telemedicina, Educación
- **Modales Demo (5):** Cada paso del formulario EPS
- **Diagramas (2):** Flujo frontend y backend

**Funcionalidades:**
- Estadísticas completas del sistema
- Filtros por categoría
- Navegación directa a cualquier vista
- Descripción detallada de cada componente
- Badges tecnológicos (React, TypeScript, TailwindCSS)

---

## Arquitectura General

### Tecnologías Utilizadas
- **Frontend:** React 18 + TypeScript + Vite
- **Routing:** React Router 6 (SPA)
- **Styling:** TailwindCSS 3 + Radix UI
- **Backend:** Express integrado
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React

### Estructura del Proyecto
```
client/
├── pages/           # Vistas principales
├── components/
│   ├── ui/         # Componentes de interfaz
│   └── modals/     # Modales del formulario
├── context/        # Estado global (FormContext)
├── hooks/          # Hooks personalizados
└── lib/            # Utilidades y validaciones

server/
├── routes/         # API endpoints
└── index.ts        # Servidor Express

shared/
└── api.ts          # Tipos compartidos
```

### Flujo de Datos
1. **Entrada:** Usuario accede por Landing o Login
2. **Autenticación:** Diferenciación EPS vs HUV
3. **EPS Flow:** Formulario de 5 pasos con validación
4. **HUV Flow:** Dashboard de gestión y autorización
5. **Estado Global:** FormContext maneja datos del formulario
6. **Validación:** Tiempo real con retroalimentación visual
7. **Persistencia:** Guardado local y envío al servidor

### Características de UX/UI
- **Design System:** Consistente con colores médicos profesionales
- **Responsive:** Optimizado para tablet y móvil
- **Accesibilidad:** Navegación por teclado y lectores de pantalla
- **Performance:** Carga lazy de componentes pesados
- **Internacionalización:** Preparado para múltiples idiomas
- **Temas:** Soporte para modo claro/oscuro

---

## Resumen Ejecutivo

El sistema VITARIS es una plataforma médica integral que facilita la comunicación entre EPS y el Hospital Universitario del Valle. Con **23 vistas principales** y **5 modales especializados**, cubre todo el espectro de la gestión médica moderna:

- **Sistema de Remisión:** Flujo completo de 5 pasos con validación médica
- **Dashboard Médico:** Gestión profesional de pacientes con herramientas avanzadas
- **Herramientas Clínicas:** Calculadoras, protocolos y referencias médicas
- **Monitoreo UCI:** Cuidados intensivos en tiempo real
- **Emergencias:** Protocolos críticos con tiempos de respuesta
- **Gestión Hospitalaria:** Admisiones, cirugías, laboratorios, farmacia

El sistema está diseñado para mejorar la calidad de atención médica, reducir tiempos de respuesta, y facilitar la comunicación efectiva entre diferentes niveles de atención sanitaria.
