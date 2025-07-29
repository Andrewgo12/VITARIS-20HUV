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
**Descripción:** Sistema completo de protocolos médicos de emergencia con códigos hospitalarios

**Elementos Visuales Específicos:**
- **Header Principal:** Título con gradiente rojo-rosa, descripción del sistema
- **Botón de navegación:** "Volver al Sistema" con ícono de flecha izquierda
- **Sistema de pestañas:** Tres tabs (Protocolos, Códigos, Entrenamiento)

**Protocolos Incluidos (Cards individuales):**
- **Reanimación Cardiopulmonar (RCP):**
  - Ícono: Corazón rojo
  - Badge de severidad: "CRÍTICO" (fondo rojo)
  - Badge de categoría: "Cardiovascular" (outline)
  - Lista numerada de pasos (7 pasos específicos)
  - Medicamentos: Epinefrina 1mg IV, Amiodarona 300mg IV, Atropina 1mg IV
  - Límite de tiempo: "Inmediato"
  - Equipo: Médico intensivista, Enfermería especializada, Técnico respiratorio
  - Botón de activación: "Activar Protocolo" (fondo rojo)

- **Código Stroke:**
  - Ícono: Cerebro azul
  - Badge de severidad: "CRÍTICO" (fondo rojo)
  - Badge de categoría: "Neurológico" (outline)
  - Lista de pasos: Evaluación FAST, TAC cerebral urgente, Laboratorios stat
  - Medicamentos: Alteplase (tPA), Ácido acetilsalicílico, Anticoagulantes
  - Límite de tiempo: "4.5 horas" (texto rojo)
  - Equipo: Neurólogo, Radiólogo, Enfermería stroke

**Pestañas del Sistema:**
- **Protocolos:** Grid de cards con protocolos detallados
- **Códigos:** Alert con información del sistema de códigos (azul, rojo, amarillo, verde)
- **Entrenamiento:** Alert con información de simulacros y certificaciones

**Diseño Visual:**
- Fondo: Gradiente de rojo-50 a rosa-50
- Cards: Hover con shadow-lg
- Íconos: Lucide React con colores específicos por protocolo
- Badges: Sistema de colores por severidad y categoría

### 2. ICUMonitoring.tsx - Monitoreo de UCI
**Función Principal:** Cuidados intensivos en tiempo real
**Descripción:** Sistema completo de monitoreo para unidad de cuidados intensivos

**Elementos Visuales Específicos:**
- **Header con estadísticas:** 5 cards con estadísticas (Total pacientes UCI, Estado crítico, Con ventilador, Camas disponibles, Alertas activas)
- **Timer en tiempo real:** Actualización cada 30 segundos del tiempo actual
- **Badge de alertas:** "Críticos" con animación pulse en rojo
- **Sistema de pestañas:** 4 tabs (Monitoreo, Ventiladores, Scores, Intervenciones)

**Cards de Pacientes UCI (diseño específico):**
- **Header del Card:** Nombre del paciente con badge de severidad
- **Información básica:** Cama, edad, condición médica
- **Grid de signos vitales (5 elementos):**
  - FC: Fondo rojo-50, ícono corazón rojo, valor con tendencia (emojis de flechas)
  - PA: Fondo azul-50, ícono actividad azul, valor sistólica/diastólica
  - Temperatura: Fondo naranja-50, ícono termómetro naranja
  - SpO2: Fondo cian-50, ícono droplets cian
  - FR: Fondo púrpura-50, ícono viento púrpura
  - Glasgow: Fondo verde-50, ícono cerebro verde

**Sistema de Alertas Visuales:**
- **Colores por severidad:** CRÍTICO (rojo), GRAVE (naranja), MODERADO (amarillo), ESTABLE (verde)
- **Indicadores de tendencia:** "↗️ SUBIENDO", "↘️ BAJANDO", "➡️ ESTABLE"
- **Estados de alerta:** Clase CSS para valores críticos (text-red-600, text-green-600)

**Ventilación Mecánica (cuando aplica):**
- Card azul-50 con ícono viento
- Grid 3 columnas: Modo (SIMV, AC), FiO2 (%), PEEP (cmH2O)

**Medicamentos Críticos:**
- Lista de badges con medicamentos actuales
- Badges outline con nombres específicos

**Pestañas Especializadas:**
- **Monitoreo:** Grid de cards con pacientes y signos vitales completos
- **Ventiladores:** Alert informativo sobre control de ventiladores
- **Scores:** Cards individuales con APACHE II y Glasgow por paciente
- **Intervenciones:** Lista de dispositivos activos por paciente (catéteres, monitores)

**Diseño Visual:**
- Fondo: Gradiente rojo-50 a naranja-50
- Actualización automática cada 30 segundos
- Sistema de colores médicos profesionales
- Cards con hover y transición de sombras

### 3. AdmissionsManagement.tsx - Gestión de Admisiones
**Función Principal:** Control completo de admisiones, altas y gestión de camas
**Descripción:** Sistema integral para manejo hospitalario de admisiones

**Elementos Visuales Específicos:**
- **Header con acciones:** Botones "Nueva Admisión" (verde) y "Dar de Alta" (outline)
- **Estadísticas principales:** 6 cards (Total admisiones, Activas, Pre-quirúrgicas, Post-quirúrgicas, Camas disponibles, Camas ocupadas)
- **Sistema de pestañas:** 4 tabs principales

**Tab 1: Admisiones Activas**
- **Card de filtros:** Búsqueda por nombre/diagnóstico/ID y selector de estado
- **Cards de admisiones (diseño complejo en grid 4 columnas):**
  - **Columna 1 - Información del Paciente:**
    - Ícono usuario azul + nombre
    - Edad, documento, tipo de sangre, teléfono
    - Contacto de emergencia (texto pequeño gris)
  - **Columna 2 - Información de Admisión:**
    - Ícono building verde + título "Admisión"
    - Badges de estado y tipo con colores específicos:
      - ACTIVA: azul, PRE-QUIRÚRGICA: amarillo, POST-QUIRÚRGICA: verde
      - URGENTE: texto rojo, PROGRAMADA: texto azul
    - ID, fecha/hora, departamento, médico, diagnóstico
  - **Columna 3 - Ubicación & Signos Vitales:**
    - Ícono mapPin púrpura + título
    - Habitación y cama
    - Grid de signos vitales (PA, FC, T°, SpO2)
    - Badge de estabilidad (Estable/Inestable)
  - **Columna 4 - Acciones:**
    - Ícono activity naranja + botones:
    - "Ver Historia Clínica", "Actualizar Estado", "Transferir Cama", "Programar Alta"
    - Información adicional: estancia esperada, seguro

**Tab 2: Gestión de Camas**
- Grid de cards de camas con información:
  - ID de cama, tipo (UCI, General, Quirúrgica, Trauma)
  - Estado con colores: DISPONIBLE (verde), OCUPADA (rojo), MANTENIMIENTO (amarillo)
  - Departamento asignado
  - Botones de acción según estado (Asignar paciente, Ver paciente, Finalizar mantenimiento)

**Tab 3: Transferencias**
- Alert informativo sobre funcionalidad en desarrollo
- Ícono car + descripción del sistema de transferencias

**Tab 4: Facturación**
- Cards por admisión con información financiera:
  - Grid 3 columnas: Paciente, Costos, Acciones
  - Detalles de costos: habitación, tratamiento, total estimado
  - Información del seguro y porcentaje de cobertura
  - Botones: "Ver Factura", "Enviar a Seguro"

**Sistema de Colores por Estado:**
- ACTIVA: bg-blue-500, PRE-QUIRÚRGICA: bg-yellow-500, POST-QUIRÚRGICA: bg-green-500
- URGENTE: text-red-600, PROGRAMADA: text-blue-600
- Camas DISPONIBLE: bg-green-100, OCUPADA: bg-red-100, MANTENIMIENTO: bg-yellow-100

### 4. LabsImaging.tsx - Laboratorios e Imágenes
**Función Principal:** Sistema integral de diagnósticos y resultados
**Descripción:** Gestión completa de laboratorios clínicos e imágenes diagnósticas

**Elementos Específicos del Sistema:**
- **Header con iconos:** TestTube (laboratorios) y Camera (imágenes)
- **Pestañas principales:** Laboratorios, Imágenes Diagnósticas, Resultados Pendientes, Reportes

**Laboratorios (mock data específico):**
- **Cards de resultados con estructura completa:**
  - Información del paciente (nombre, edad, documento, habitación)
  - Detalles de la orden (fecha, hora, médico, prioridad, técnico)
  - **Tabla de pruebas individuales:**
    - Nombre de la prueba, categoría (Cardiología, Hematología, Química)
    - Resultado numérico, unidad de medida, valor de referencia
    - **Estado con colores:** NORMAL (verde), ELEVADO/ANORMAL (rojo), badges específicos
    - Flag "critical" para valores críticos
  - **Interpretación médica:**
    - Resumen clínico, recomendaciones
    - Nivel de alerta: CRÍTICO, NORMAL, etc.

**Ejemplos específicos de pruebas:**
- Troponina I: 15.2 ng/mL (ref <0.04) - ANORMAL/CRÍTICO
- CK-MB: 45 ng/mL (ref 0-6.3) - ELEVADO/CRÍTICO
- Hemoglobina: 12.8 g/dL (ref 12.0-15.5) - NORMAL
- Glucosa: 180 mg/dL (ref 70-100) - ELEVADO

**Imágenes Diagnósticas:**
- Estudios: ECG, Radiografías, TAC, Ecografías
- Información del estudio: tipo, categoría, fecha/hora, prioridad
- Personal técnico especializado por modalidad
- Hallazgos e impresiones radiológicas

### 5. PharmacyManagement.tsx - Gestión Farmacéutica
**Función Principal:** Control de medicamentos, prescripciones e inventario
**Descripción:** Sistema completo de farmacia hospitalaria

**Elementos Visuales Específicos:**
- **Fondo:** Gradiente naranja-50 a ámbar-50
- **Header:** Título con gradiente naranja-ámbar, botón "Nueva Prescripción" (naranja)
- **Estadísticas:** 4 cards (Prescripciones activas, Medicamentos en stock, Stock bajo, Interacciones detectadas)

**Sistema de Pestañas (4 tabs):**
- **Prescripciones:** Lista de medicamentos activos por paciente
- **Inventario:** Control de stock y medicamentos disponibles
- **Interacciones:** Detección y manejo de interacciones medicamentosas
- **Reportes:** Análisis farmacéutico y estadísticas

**Datos específicos de medicamentos (mock data):**
- **Atorvastatina:** 40mg, cada 24h, oral, stock 45 unidades, interacción con Warfarina
- **Morfina:** 10mg, PRN dolor, IV, stock 12 unidades, sin interacciones
- Estados: ACTIVO, prescriptor, fechas de inicio/fin, alergias

### 6. Vistas Médicas Adicionales (12 vistas más)

**AppointmentsScheduler.tsx - Programación de Citas**
- **Función:** Gestión integral de citas médicas
- **Elementos:** Calendario interactivo, slots de tiempo, especialidades médicas
- **Características:** Disponibilidad en tiempo real, notificaciones automáticas

**ConsultationsHub.tsx - Hub de Interconsultas**
- **Función:** Gestión de interconsultas entre especialidades
- **Elementos:** Sistema de derivación, seguimiento de consultas, comunicación inter-departamental

**MedicalEducation.tsx - Educación Médica**
- **Función:** Formación continua y desarrollo profesional
- **Elementos:** Cursos online, simulacros, certificaciones, evaluaciones

**MedicalReports.tsx - Reportes Médicos**
- **Función:** Estadísticas, análisis y reportes del sistema
- **Elementos:** Gráficos de Recharts, métricas KPI, exportación de datos

**SurgeriesSchedule.tsx - Programación de Cirugías**
- **Función:** Sistema completo de programación quirúrgica
- **Elementos:** Calendario quirúrgico, asignación de quirófanos, equipos médicos

**TeamCommunication.tsx - Comunicación Médica**
- **Función:** Comunicación segura entre equipos médicos
- **Elementos:** Chat interno, notificaciones, alertas críticas

**Telemedicine.tsx - Telemedicina**
- **Función:** Consultas médicas a distancia
- **Elementos:** Video conferencias, historias clínicas digitales, prescripción remota

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
