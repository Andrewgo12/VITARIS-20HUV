# 🚀 **GMAIL EXTRACTOR - GUÍA DE INICIO RÁPIDO**

## **VITAL RED - Hospital Universitaria ESE**

### **⚡ Inicio Rápido en 5 Minutos**

---

## **1. 📦 INSTALACIÓN AUTOMÁTICA**

```bash
# Ejecutar instalador automático
python install_gmail_extractor_dependencies.py
```

**¿Qué hace este comando?**
- ✅ Instala todas las dependencias de Python
- ✅ Configura Selenium ChromeDriver automáticamente
- ✅ Crea archivos de configuración
- ✅ Verifica la instalación completa

---

## **2. 🔧 CONFIGURACIÓN BÁSICA**

### **Configurar Gemini AI (Opcional pero Recomendado)**

1. **Obtener clave API gratuita:**
   - Ir a: https://makersuite.google.com/app/apikey
   - Crear nueva clave API
   - Copiar la clave

2. **Configurar en el sistema:**
   ```bash
   # Editar archivo de configuración
   server/gmail_extractor/config.py
   
   # Cambiar línea:
   GEMINI_API_KEY = 'tu_clave_api_aqui'
   ```

### **Verificar Base de Datos**

```bash
# Verificar que MySQL esté corriendo
# El sistema usa la misma BD de VITAL RED
```

---

## **3. 🚀 INICIAR EL SISTEMA**

```bash
# Iniciar VITAL RED completo
python start_vital_red_complete_final.py
```

**El sistema iniciará:**
- ✅ Backend API en puerto 8001
- ✅ Frontend en puerto 5173
- ✅ Gmail Extractor integrado

---

## **4. 🌐 ACCEDER AL EXTRACTOR**

### **URL de Acceso:**
```
http://localhost:5173/vital-red/gmail-extractor
```

### **Credenciales de Prueba:**
```
Usuario: admin@hospital-ese.com
Contraseña: admin123
```

---

## **5. 📧 PRIMERA EXTRACCIÓN**

### **Paso 1: Configurar Credenciales**
1. Ir a la pestaña "Extractor"
2. Ingresar email de Gmail
3. Ingresar contraseña de Gmail
4. Configurar máximo de correos (ej: 50 para prueba)

### **Paso 2: Iniciar Extracción**
1. Hacer clic en "Iniciar Extracción"
2. Monitorear progreso en tiempo real
3. Ver correos extraídos en la pestaña "Correos Extraídos"

### **Paso 3: Revisar Resultados**
1. Ver estadísticas en la pestaña "Estadísticas"
2. Buscar y filtrar correos extraídos
3. Ver análisis de IA (si está configurado)

---

## **6. 🔍 VERIFICACIÓN COMPLETA**

```bash
# Ejecutar pruebas exhaustivas
python test_gmail_extractor_complete.py
```

**Esto verifica:**
- ✅ Todas las dependencias
- ✅ Configuración de base de datos
- ✅ Selenium y ChromeDriver
- ✅ Conexión con Gemini AI
- ✅ Endpoints de la API

---

## **7. 🛠️ SOLUCIÓN DE PROBLEMAS COMUNES**

### **Error: ChromeDriver no encontrado**
```bash
# Reinstalar webdriver-manager
pip uninstall webdriver-manager
pip install webdriver-manager
```

### **Error: Tesseract no encontrado**
```bash
# Descargar e instalar Tesseract OCR
# https://github.com/UB-Mannheim/tesseract/wiki
# Agregar al PATH del sistema
```

### **Error: Base de datos no conecta**
```bash
# Verificar MySQL esté corriendo
# Verificar credenciales en config.py
```

### **Error: Gemini AI no funciona**
```bash
# Verificar clave API en config.py
# Probar conexión desde la interfaz
```

---

## **8. 📊 CARACTERÍSTICAS PRINCIPALES**

### **✅ Extracción Masiva**
- Hasta 300 correos por sesión
- Procesamiento por lotes inteligente
- Reintentos automáticos en errores

### **✅ Análisis Inteligente**
- Procesamiento con Gemini AI
- Extracción de información médica
- Detección automática de urgencia

### **✅ Gestión de Archivos**
- Descarga automática de adjuntos
- Extracción de texto de PDFs
- OCR para imágenes con texto

### **✅ Interfaz Completa**
- Monitoreo en tiempo real
- Búsqueda y filtrado avanzado
- Exportación de datos

---

## **9. 🎯 CASOS DE USO TÍPICOS**

### **Caso 1: Extracción de Historias Clínicas**
1. Configurar filtros por remitente médico
2. Habilitar análisis de IA
3. Extraer y analizar automáticamente

### **Caso 2: Procesamiento de Resultados de Laboratorio**
1. Filtrar por tipo de archivo (PDF)
2. Habilitar extracción de texto
3. Buscar palabras clave médicas

### **Caso 3: Monitoreo de Comunicaciones Urgentes**
1. Configurar análisis de urgencia
2. Filtrar por nivel de prioridad
3. Generar alertas automáticas

---

## **10. 📈 MÉTRICAS Y MONITOREO**

### **Estadísticas Disponibles:**
- Total de correos extraídos
- Correos con archivos adjuntos
- Correos con análisis de IA
- Tasa de éxito de extracción
- Tiempo promedio por correo

### **Exportación de Datos:**
- Formato CSV para análisis
- Formato JSON para integración
- Filtros personalizables

---

## **11. 🔒 SEGURIDAD Y CUMPLIMIENTO**

### **Medidas de Seguridad:**
- ✅ No almacena contraseñas permanentemente
- ✅ Delays inteligentes anti-detección
- ✅ Logs de auditoría completos
- ✅ Acceso solo para administradores

### **Cumplimiento:**
- ⚠️ Verificar términos de servicio de Gmail
- ⚠️ Usar solo con cuentas autorizadas
- ⚠️ Cumplir regulaciones de privacidad

---

## **12. 🆘 SOPORTE**

### **Documentación Completa:**
- `GMAIL_EXTRACTOR_DOCUMENTATION.md` - Manual completo
- `test_gmail_extractor_complete.py` - Pruebas exhaustivas
- `install_gmail_extractor_dependencies.py` - Instalador

### **Logs del Sistema:**
- `gmail_extraction.log` - Log principal
- Logs en consola durante ejecución
- Métricas en tiempo real

---

## **🎉 ¡LISTO PARA USAR!**

**El Gmail Extractor está completamente configurado y listo para transformar la gestión de correos electrónicos en el Hospital Universitaria ESE.**

### **Próximos Pasos:**
1. ✅ Realizar primera extracción de prueba
2. ✅ Configurar análisis de IA con Gemini
3. ✅ Entrenar al personal en el uso
4. ✅ Implementar en producción

**¡Disfrute de la extracción masiva avanzada de Gmail!** 📧✨
