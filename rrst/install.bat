@echo off
setlocal enabledelayedexpansion

:: VITAL RED System - Windows Installation Script
:: This script automates the installation and setup of the VITAL RED Laravel system

echo.
echo 🏥 VITAL RED System - Windows Installation Script
echo ==================================================
echo.

:: Check if PHP is installed
php --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP is not installed or not in PATH. Please install PHP 8.2 or higher.
    pause
    exit /b 1
)
echo ✅ PHP detected

:: Check if Composer is installed
composer --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Composer is not installed or not in PATH. Please install Composer first.
    pause
    exit /b 1
)
echo ✅ Composer detected

:: Install PHP dependencies
echo.
echo ℹ️  Installing PHP dependencies...
composer install --optimize-autoloader
if errorlevel 1 (
    echo ❌ Failed to install PHP dependencies
    pause
    exit /b 1
)
echo ✅ PHP dependencies installed

:: Setup environment file
echo.
echo ℹ️  Setting up environment configuration...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ Environment file created
) else (
    echo ⚠️  Environment file already exists
)

:: Generate application key
php artisan key:generate --force
if errorlevel 1 (
    echo ❌ Failed to generate application key
    pause
    exit /b 1
)
echo ✅ Application key generated

:: Setup database
echo.
echo ℹ️  Setting up database...
php artisan migrate --force
if errorlevel 1 (
    echo ❌ Database migration failed
    pause
    exit /b 1
)
echo ✅ Database migrations completed

:: Seed database
php artisan vital-red:seed
if errorlevel 1 (
    echo ⚠️  Database seeding failed, but installation can continue
) else (
    echo ✅ Database seeded with sample data
)

:: Clear caches
echo.
echo ℹ️  Clearing application caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan vital-red:cache-clear
echo ✅ Caches cleared

:: Ask about production optimization
echo.
set /p production="Is this a production installation? (y/N): "
if /i "!production!"=="y" (
    echo ℹ️  Optimizing for production...
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    echo ✅ Production optimizations applied
    echo ⚠️  Remember to set APP_ENV=production and APP_DEBUG=false in .env
)

:: Display completion information
echo.
echo 🎉 VITAL RED System Installation Complete!
echo ==========================================
echo.
echo ℹ️  Next steps:
echo 1. Start the development server: php artisan serve
echo 2. Access the system at: http://127.0.0.1:8000
echo.
echo ℹ️  Default login credentials:
echo 👨‍💼 Admin: admin@hospital.com / password
echo 👨‍⚕️ Doctor: medico@hospital.com / password
echo.
echo ℹ️  Available commands:
echo • php artisan vital-red:status - Check system status
echo • php artisan vital-red:cache-clear - Clear system cache
echo • php artisan vital-red:seed - Reseed database
echo.
echo ⚠️  Remember to:
echo • Configure your .env file with proper database credentials
echo • Set up the AI system URL in .env (AI_SYSTEM_URL)
echo • Configure email settings for notifications
echo.

pause
