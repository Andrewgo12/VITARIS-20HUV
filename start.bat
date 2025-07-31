@echo off
chcp 65001 > nul
echo.
echo ═══════════════════════════════════════════════════════════════
echo 🏥 VITARIS v2.0.0 - Sistema Integral de Gestión Hospitalaria
echo    Hospital Universitario del Valle
echo ═══════════════════════════════════════════════════════════════
echo.

echo 🔍 Verificando prerrequisitos...

:: Check Node.js
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado. Por favor instala Node.js 18+ desde https://nodejs.org
    pause
    exit /b 1
)

:: Check npm
npm --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no encontrado. Por favor instala npm
    pause
    exit /b 1
)

echo ✅ Node.js y npm encontrados

echo.
echo 📦 Verificando dependencias...

:: Check if node_modules exists in server
if not exist "server\node_modules" (
    echo 📥 Instalando dependencias del servidor...
    cd server
    call npm install
    cd ..
)

:: Check if node_modules exists in client
if not exist "client\node_modules" (
    echo 📥 Instalando dependencias del cliente...
    cd client
    call npm install
    cd ..
)

echo ✅ Dependencias verificadas

echo.
echo 🚀 Iniciando VITARIS...
echo.

echo 📊 Iniciando servidor backend...
start "VITARIS Server" cmd /k "cd /d %~dp0server && node src/simple-server.js"

echo ⏳ Esperando que el servidor inicie...
timeout /t 5 /nobreak > nul

echo 🌐 Iniciando cliente frontend...
start "VITARIS Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ✅ VITARIS iniciado correctamente!
echo.
echo 🌐 URLS DEL SISTEMA:
echo    📱 Cliente (Frontend): http://localhost:5173
echo    🔧 Servidor (Backend): http://localhost:3001
echo    📊 Health Check: http://localhost:3001/health
echo    📋 API Status: http://localhost:3001/api/system/metrics
echo.
echo 🔑 CREDENCIALES DE DEMO:
echo    👨‍💼 Administrador:
echo       Email: admin@vitaris.com
echo       Password: Admin123!
echo       Permisos: Acceso completo al sistema
echo.
echo    👨‍⚕️ Doctor:
echo       Email: carlos.martinez@vitaris.com
echo       Password: Doctor123!
echo       Permisos: Acceso médico completo
echo.
echo 📋 FUNCIONALIDADES DISPONIBLES:
echo    ✅ Gestión de Pacientes
echo    ✅ Monitoreo en Tiempo Real
echo    ✅ Sistema de Notificaciones
echo    ✅ Admisiones y UCI
echo    ✅ Gestión de Cirugías
echo    ✅ Sistema de Farmacia
echo    ✅ Inventario Médico
echo    ✅ Facturación y Pagos
echo    ✅ Logs de Auditoría
echo    ✅ Configuración del Sistema
echo    ✅ Backup y Recuperación
echo.
echo ⏳ Esperando 8 segundos antes de abrir el navegador...
timeout /t 8 /nobreak > nul

echo 🌐 Abriendo navegador web...
start http://localhost:5173

echo.
echo 🎉 ¡Sistema VITARIS completamente operativo!
echo.
echo 💡 CONSEJOS DE USO:
echo    • Usa las credenciales de demo para explorar el sistema
echo    • Todas las funcionalidades están completamente implementadas
echo    • Los datos son de demostración (no se requiere MongoDB)
echo    • El sistema es completamente responsivo (móvil/tablet/desktop)
echo.
echo 📞 SOPORTE:
echo    • GitHub: https://github.com/hospital-valle/vitaris
echo    • Email: soporte@vitaris.com
echo    • Documentación: README.md
echo.
echo ⚠️  PARA DETENER EL SISTEMA:
echo    • Cierra las ventanas del servidor y cliente
echo    • O presiona Ctrl+C en cada terminal
echo.
echo ═══════════════════════════════════════════════════════════════
echo    Presiona cualquier tecla para cerrar esta ventana...
echo ═══════════════════════════════════════════════════════════════
pause > nul
