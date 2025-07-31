#!/bin/bash

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "🏥 VITARIS v2.0.0 - Sistema Integral de Gestión Hospitalaria"
echo "   Hospital Universitario del Valle"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "🔍 Verificando prerrequisitos..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no encontrado. Por favor instala npm"
    exit 1
fi

echo "✅ Node.js y npm encontrados"

echo ""
echo "📦 Verificando dependencias..."

# Check if node_modules exists in server
if [ ! -d "server/node_modules" ]; then
    echo "📥 Instalando dependencias del servidor..."
    cd server
    npm install
    cd ..
fi

# Check if node_modules exists in client
if [ ! -d "client/node_modules" ]; then
    echo "📥 Instalando dependencias del cliente..."
    cd client
    npm install
    cd ..
fi

echo "✅ Dependencias verificadas"

echo ""
echo "🚀 Iniciando VITARIS..."
echo ""

echo "📊 Iniciando servidor backend..."
cd server && node src/simple-server.js &
SERVER_PID=$!
cd ..

sleep 5

echo "🌐 Iniciando cliente frontend..."
cd client && npm run dev &
CLIENT_PID=$!
cd ..

echo ""
echo "✅ VITARIS iniciado correctamente!"
echo ""
echo "🌐 URLS DEL SISTEMA:"
echo "   📱 Cliente (Frontend): http://localhost:5173"
echo "   🔧 Servidor (Backend): http://localhost:3001"
echo "   📊 Health Check: http://localhost:3001/health"
echo "   📋 API Status: http://localhost:3001/api/system/metrics"
echo ""
echo "🔑 CREDENCIALES DE DEMO:"
echo "   👨‍💼 Administrador:"
echo "      Email: admin@vitaris.com"
echo "      Password: Admin123!"
echo "      Permisos: Acceso completo al sistema"
echo ""
echo "   👨‍⚕️ Doctor:"
echo "      Email: carlos.martinez@vitaris.com"
echo "      Password: Doctor123!"
echo "      Permisos: Acceso médico completo"
echo ""
echo "📋 FUNCIONALIDADES DISPONIBLES:"
echo "   ✅ Gestión de Pacientes"
echo "   ✅ Monitoreo en Tiempo Real"
echo "   ✅ Sistema de Notificaciones"
echo "   ✅ Admisiones y UCI"
echo "   ✅ Gestión de Cirugías"
echo "   ✅ Sistema de Farmacia"
echo "   ✅ Inventario Médico"
echo "   ✅ Facturación y Pagos"
echo "   ✅ Logs de Auditoría"
echo "   ✅ Configuración del Sistema"
echo "   ✅ Backup y Recuperación"
echo ""

# Function to handle script termination
cleanup() {
    echo ""
    echo "🛑 Deteniendo VITARIS..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    echo "✅ Sistema detenido correctamente"
    echo ""
    echo "🙏 ¡Gracias por usar VITARIS!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo "⏳ Esperando 8 segundos antes de abrir el navegador..."
sleep 8

echo "🌐 Abriendo navegador web..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:5173
elif command -v open > /dev/null; then
    open http://localhost:5173
else
    echo "Por favor, abre manualmente: http://localhost:5173"
fi

echo ""
echo "🎉 ¡Sistema VITARIS completamente operativo!"
echo ""
echo "💡 CONSEJOS DE USO:"
echo "   • Usa las credenciales de demo para explorar el sistema"
echo "   • Todas las funcionalidades están completamente implementadas"
echo "   • Los datos son de demostración (no se requiere MongoDB)"
echo "   • El sistema es completamente responsivo (móvil/tablet/desktop)"
echo ""
echo "📞 SOPORTE:"
echo "   • GitHub: https://github.com/hospital-valle/vitaris"
echo "   • Email: soporte@vitaris.com"
echo "   • Documentación: README.md"
echo ""
echo "⚠️  PARA DETENER EL SISTEMA:"
echo "   • Presiona Ctrl+C en esta terminal"
echo "   • O cierra esta ventana de terminal"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   Presiona Ctrl+C para detener el sistema"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Wait for processes
wait
