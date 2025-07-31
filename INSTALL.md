# 🚀 Guía de Instalación VITARIS

## 📋 Prerrequisitos

Antes de instalar VITARIS, asegúrate de tener instalado:

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **npm 9+** - Incluido con Node.js
- **Git** - [Descargar aquí](https://git-scm.com/)
- **MongoDB** (Opcional) - [Descargar aquí](https://www.mongodb.com/try/download/community)

## 🔧 Instalación Rápida

### Opción 1: Instalación Automática (Recomendada)

```bash
# 1. Clonar el repositorio
git clone https://github.com/hospital-valle/vitaris.git
cd vitaris/VITARIS-20HUV

# 2. Ejecutar instalación automática
node install.js --init-db

# 3. Iniciar el sistema
# Windows:
start.bat

# Linux/Mac:
./start.sh
```

### Opción 2: Instalación Manual

```bash
# 1. Clonar el repositorio
git clone https://github.com/hospital-valle/vitaris.git
cd vitaris/VITARIS-20HUV

# 2. Instalar dependencias
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 3. Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tus configuraciones

# 4. Inicializar base de datos (opcional)
cd server && node src/scripts/init.js
cd ..

# 5. Iniciar el sistema
npm run dev:full
```

## 🌐 Acceso al Sistema

Una vez instalado, el sistema estará disponible en:

- **Cliente (Frontend)**: http://localhost:5173
- **Servidor (Backend)**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Documentación API**: http://localhost:3001/api-docs (en desarrollo)

## 🔑 Credenciales de Demo

### Administrador
- **Email**: admin@vitaris.com
- **Password**: Admin123!
- **Permisos**: Acceso completo al sistema

### Doctor
- **Email**: carlos.martinez@vitaris.com
- **Password**: Doctor123!
- **Permisos**: Acceso médico completo

## ⚙️ Configuración

### Variables de Entorno del Servidor

Edita el archivo `server/.env`:

```env
# Configuración del Servidor
NODE_ENV=development
PORT=3001

# Base de Datos
MONGODB_URI=mongodb://localhost:27017/vitaris

# JWT
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRES_IN=7d

# Cliente
CLIENT_URL=http://localhost:5173
```

### Variables de Entorno del Cliente

Edita el archivo `client/.env`:

```env
# API
VITE_API_URL=http://localhost:3001/api

# Aplicación
VITE_APP_NAME=VITARIS
VITE_HOSPITAL_NAME=Hospital Universitario del Valle
```

## 🗄️ Base de Datos

### Opción 1: MongoDB Local

1. Instalar MongoDB Community Edition
2. Iniciar el servicio MongoDB
3. El sistema creará automáticamente la base de datos `vitaris`

### Opción 2: MongoDB Atlas (Cloud)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `MONGODB_URI` en `server/.env`

### Opción 3: Datos Mock (Por Defecto)

El sistema funciona sin MongoDB usando datos de demostración en memoria.

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev:full     # Iniciar cliente y servidor
npm run dev          # Solo cliente (Vite)
npm run server       # Solo servidor
npm run client       # Solo cliente

# Producción
npm run build        # Construir para producción
npm run start        # Iniciar en producción

# Utilidades
npm run install:all  # Instalar todas las dependencias
npm run test         # Ejecutar pruebas
npm run format.fix   # Formatear código
```

## 🔧 Solución de Problemas

### Error: Puerto en uso

```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Cambiar puerto en server/.env
PORT=3002
```

### Error: MongoDB no conecta

```bash
# Verificar que MongoDB esté ejecutándose
mongod --version

# Usar datos mock (sin MongoDB)
# El sistema funciona automáticamente sin base de datos
```

### Error: Dependencias

```bash
# Limpiar e instalar de nuevo
npm run clean
npm run install:all
```

### Error: Permisos (Linux/Mac)

```bash
# Dar permisos de ejecución
chmod +x start.sh
chmod +x install.js
```

## 📱 Dispositivos Soportados

- **Desktop**: 1280px+ (Experiencia completa)
- **Tablet**: 768px - 1024px (Interfaz adaptada)
- **Mobile**: 320px - 768px (Interfaz móvil)

## 🌐 Navegadores Soportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. **Revisa los logs** en la consola del navegador y terminal
2. **Verifica prerrequisitos** (Node.js, npm versions)
3. **Consulta la documentación** en README.md
4. **Reporta issues** en GitHub

## 🎉 ¡Instalación Completada!

Una vez que veas el mensaje "🎉 ¡Sistema VITARIS listo para usar!", puedes:

1. Abrir http://localhost:5173 en tu navegador
2. Iniciar sesión con las credenciales de demo
3. Explorar todas las funcionalidades del sistema
4. Personalizar la configuración según tus necesidades

---

**¡Bienvenido a VITARIS!** 🏥✨
