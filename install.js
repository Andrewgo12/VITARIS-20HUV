#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏥 VITARIS - Sistema Integral de Gestión Hospitalaria');
console.log('📦 Iniciando instalación completa...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd = process.cwd()) {
  try {
    log(`Ejecutando: ${command}`, 'cyan');
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error ejecutando: ${command}`, 'red');
    log(error.message, 'red');
    return false;
  }
}

function createEnvFile() {
  const serverEnvPath = path.join(__dirname, 'server', '.env');
  const serverEnvExamplePath = path.join(__dirname, 'server', '.env.example');
  
  if (!fs.existsSync(serverEnvPath) && fs.existsSync(serverEnvExamplePath)) {
    log('📝 Creando archivo .env del servidor...', 'yellow');
    fs.copyFileSync(serverEnvExamplePath, serverEnvPath);
    log('✅ Archivo .env creado. Por favor, configura las variables de entorno.', 'green');
  }
}

function checkPrerequisites() {
  log('🔍 Verificando prerrequisitos...', 'blue');
  
  try {
    execSync('node --version', { stdio: 'pipe' });
    log('✅ Node.js encontrado', 'green');
  } catch (error) {
    log('❌ Node.js no encontrado. Por favor, instala Node.js 18+ desde https://nodejs.org', 'red');
    process.exit(1);
  }

  try {
    execSync('npm --version', { stdio: 'pipe' });
    log('✅ npm encontrado', 'green');
  } catch (error) {
    log('❌ npm no encontrado. Por favor, instala npm', 'red');
    process.exit(1);
  }

  try {
    execSync('mongod --version', { stdio: 'pipe' });
    log('✅ MongoDB encontrado', 'green');
  } catch (error) {
    log('⚠️  MongoDB no encontrado. Por favor, instala MongoDB desde https://www.mongodb.com/try/download/community', 'yellow');
    log('   O usa MongoDB Atlas (cloud) configurando MONGODB_URI en .env', 'yellow');
  }
}

function installDependencies() {
  log('\n📦 Instalando dependencias del cliente...', 'blue');
  const clientPath = path.join(__dirname, 'client');
  
  if (!execCommand('npm install', clientPath)) {
    log('❌ Error instalando dependencias del cliente', 'red');
    process.exit(1);
  }
  
  log('✅ Dependencias del cliente instaladas', 'green');

  log('\n📦 Instalando dependencias del servidor...', 'blue');
  const serverPath = path.join(__dirname, 'server');
  
  if (!execCommand('npm install', serverPath)) {
    log('❌ Error instalando dependencias del servidor', 'red');
    process.exit(1);
  }
  
  log('✅ Dependencias del servidor instaladas', 'green');
}

function createDirectories() {
  log('\n📁 Creando directorios necesarios...', 'blue');
  
  const directories = [
    path.join(__dirname, 'server', 'logs'),
    path.join(__dirname, 'server', 'uploads'),
    path.join(__dirname, 'server', 'backups'),
    path.join(__dirname, 'client', 'dist')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log(`✅ Directorio creado: ${path.relative(__dirname, dir)}`, 'green');
    }
  });
}

function initializeDatabase() {
  log('\n🗄️  Inicializando base de datos...', 'blue');
  const serverPath = path.join(__dirname, 'server');
  
  if (!execCommand('node src/scripts/init.js', serverPath)) {
    log('⚠️  Error inicializando base de datos. Puedes hacerlo manualmente más tarde.', 'yellow');
    log('   Ejecuta: cd server && node src/scripts/init.js', 'yellow');
  } else {
    log('✅ Base de datos inicializada con datos de ejemplo', 'green');
  }
}

function createStartScripts() {
  log('\n📜 Creando scripts de inicio...', 'blue');
  
  // Script para Windows
  const startBatContent = `@echo off
echo 🏥 VITARIS - Iniciando sistema completo...
echo.

echo 📊 Iniciando servidor backend...
start "VITARIS Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak > nul

echo 🌐 Iniciando cliente frontend...
start "VITARIS Client" cmd /k "cd client && npm run dev"

echo.
echo ✅ VITARIS iniciado correctamente!
echo 📱 Cliente: http://localhost:5173
echo 🔧 Servidor: http://localhost:3001
echo 📚 API Docs: http://localhost:3001/api-docs
echo.
pause
`;

  // Script para Unix/Linux/Mac
  const startShContent = `#!/bin/bash
echo "🏥 VITARIS - Iniciando sistema completo..."
echo

echo "📊 Iniciando servidor backend..."
cd server && npm run dev &
SERVER_PID=$!

sleep 3

echo "🌐 Iniciando cliente frontend..."
cd ../client && npm run dev &
CLIENT_PID=$!

echo
echo "✅ VITARIS iniciado correctamente!"
echo "📱 Cliente: http://localhost:5173"
echo "🔧 Servidor: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api-docs"
echo

# Function to handle script termination
cleanup() {
    echo "🛑 Deteniendo VITARIS..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
`;

  fs.writeFileSync(path.join(__dirname, 'start.bat'), startBatContent);
  fs.writeFileSync(path.join(__dirname, 'start.sh'), startShContent);
  
  // Make shell script executable on Unix systems
  try {
    execSync('chmod +x start.sh');
  } catch (error) {
    // Ignore on Windows
  }
  
  log('✅ Scripts de inicio creados (start.bat y start.sh)', 'green');
}

function createPackageJson() {
  log('\n📄 Creando package.json principal...', 'blue');
  
  const packageJson = {
    name: "vitaris-hospital-system",
    version: "2.0.0",
    description: "Sistema Integral de Gestión Hospitalaria VITARIS",
    scripts: {
      "install:all": "npm install && cd client && npm install && cd ../server && npm install",
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "server": "cd server && npm run dev",
      "client": "cd client && npm run dev",
      "build": "cd client && npm run build",
      "start": "cd server && npm start",
      "init-db": "cd server && node src/scripts/init.js",
      "backup": "cd server && node src/scripts/backup.js",
      "test": "cd server && npm test && cd ../client && npm test"
    },
    keywords: [
      "hospital",
      "management",
      "medical",
      "healthcare",
      "vitaris",
      "react",
      "nodejs",
      "mongodb"
    ],
    author: "VITARIS Development Team",
    license: "MIT",
    devDependencies: {
      "concurrently": "^8.2.0"
    }
  };

  fs.writeFileSync(
    path.join(__dirname, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  log('✅ package.json principal creado', 'green');
}

function showCompletionMessage() {
  log('\n🎉 ¡INSTALACIÓN COMPLETADA EXITOSAMENTE!', 'green');
  log('═══════════════════════════════════════════', 'green');
  
  log('\n📋 INFORMACIÓN IMPORTANTE:', 'bright');
  log('• Cliente (Frontend): http://localhost:5173', 'cyan');
  log('• Servidor (Backend): http://localhost:3001', 'cyan');
  log('• Documentación API: http://localhost:3001/api-docs', 'cyan');
  log('• Health Check: http://localhost:3001/health', 'cyan');
  
  log('\n🔑 CREDENCIALES POR DEFECTO:', 'bright');
  log('• Admin: admin@vitaris.com / Admin123!', 'yellow');
  log('• Doctor: carlos.martinez@vitaris.com / Doctor123!', 'yellow');
  
  log('\n🚀 COMANDOS PARA INICIAR:', 'bright');
  log('• Windows: start.bat', 'magenta');
  log('• Linux/Mac: ./start.sh', 'magenta');
  log('• Manual: npm run dev', 'magenta');
  
  log('\n⚙️  CONFIGURACIÓN:', 'bright');
  log('• Edita server/.env para configurar base de datos y servicios', 'cyan');
  log('• MongoDB debe estar ejecutándose en localhost:27017', 'cyan');
  log('• O configura MONGODB_URI para usar MongoDB Atlas', 'cyan');
  
  log('\n📚 DOCUMENTACIÓN:', 'bright');
  log('• README.md - Documentación completa', 'cyan');
  log('• server/src/routes/ - Documentación de API', 'cyan');
  log('• client/src/components/ - Componentes de UI', 'cyan');
  
  log('\n🆘 SOPORTE:', 'bright');
  log('• GitHub: https://github.com/hospital-valle/vitaris', 'cyan');
  log('• Email: soporte@vitaris.com', 'cyan');
  
  log('\n═══════════════════════════════════════════', 'green');
  log('¡Gracias por usar VITARIS! 🏥✨', 'green');
}

// Main installation process
async function main() {
  try {
    checkPrerequisites();
    createDirectories();
    createEnvFile();
    createPackageJson();
    
    // Install concurrently for running both client and server
    log('\n📦 Instalando herramientas de desarrollo...', 'blue');
    execCommand('npm install');
    
    installDependencies();
    createStartScripts();
    
    // Ask user if they want to initialize the database
    log('\n🗄️  ¿Deseas inicializar la base de datos con datos de ejemplo? (y/N)', 'yellow');
    
    // For automated installation, skip database initialization
    // In interactive mode, you could use readline to get user input
    const shouldInitDb = process.argv.includes('--init-db');
    
    if (shouldInitDb) {
      initializeDatabase();
    } else {
      log('⏭️  Saltando inicialización de base de datos. Puedes hacerlo más tarde con: npm run init-db', 'yellow');
    }
    
    showCompletionMessage();
    
  } catch (error) {
    log('\n❌ Error durante la instalación:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run installation
main();
