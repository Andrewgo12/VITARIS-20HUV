#!/bin/bash

# VITAL RED System - Installation Script
# This script automates the installation and setup of the VITAL RED Laravel system

echo "🏥 VITAL RED System - Installation Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if PHP is installed
check_php() {
    if ! command -v php &> /dev/null; then
        print_error "PHP is not installed. Please install PHP 8.2 or higher."
        exit 1
    fi
    
    PHP_VERSION=$(php -v | head -n1 | cut -d' ' -f2 | cut -d'.' -f1,2)
    print_status "PHP $PHP_VERSION detected"
}

# Check if Composer is installed
check_composer() {
    if ! command -v composer &> /dev/null; then
        print_error "Composer is not installed. Please install Composer first."
        exit 1
    fi
    print_status "Composer detected"
}

# Install PHP dependencies
install_dependencies() {
    print_info "Installing PHP dependencies..."
    composer install --optimize-autoloader
    if [ $? -eq 0 ]; then
        print_status "PHP dependencies installed"
    else
        print_error "Failed to install PHP dependencies"
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    print_info "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_status "Environment file created"
    else
        print_warning "Environment file already exists"
    fi
    
    # Generate application key
    php artisan key:generate --force
    print_status "Application key generated"
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    
    # Run migrations
    php artisan migrate --force
    if [ $? -eq 0 ]; then
        print_status "Database migrations completed"
    else
        print_error "Database migration failed"
        exit 1
    fi
    
    # Seed database
    php artisan vital-red:seed
    if [ $? -eq 0 ]; then
        print_status "Database seeded with sample data"
    else
        print_warning "Database seeding failed, but installation can continue"
    fi
}

# Clear caches
clear_caches() {
    print_info "Clearing application caches..."
    
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear
    php artisan vital-red:cache-clear
    
    print_status "Caches cleared"
}

# Set permissions (for Linux/Mac)
set_permissions() {
    if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
        print_info "Setting file permissions..."
        
        chmod -R 755 storage
        chmod -R 755 bootstrap/cache
        
        print_status "File permissions set"
    fi
}

# Optimize for production
optimize_production() {
    read -p "Is this a production installation? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Optimizing for production..."
        
        php artisan config:cache
        php artisan route:cache
        php artisan view:cache
        
        print_status "Production optimizations applied"
        print_warning "Remember to set APP_ENV=production and APP_DEBUG=false in .env"
    fi
}

# Display final information
show_completion_info() {
    echo ""
    echo "🎉 VITAL RED System Installation Complete!"
    echo "=========================================="
    echo ""
    print_info "Next steps:"
    echo "1. Start the development server: php artisan serve"
    echo "2. Access the system at: http://127.0.0.1:8000"
    echo ""
    print_info "Default login credentials:"
    echo "👨‍💼 Admin: admin@hospital.com / password"
    echo "👨‍⚕️ Doctor: medico@hospital.com / password"
    echo ""
    print_info "Available commands:"
    echo "• php artisan vital-red:status - Check system status"
    echo "• php artisan vital-red:cache-clear - Clear system cache"
    echo "• php artisan vital-red:seed - Reseed database"
    echo ""
    print_warning "Remember to:"
    echo "• Configure your .env file with proper database credentials"
    echo "• Set up the AI system URL in .env (AI_SYSTEM_URL)"
    echo "• Configure email settings for notifications"
    echo ""
}

# Main installation process
main() {
    echo "Starting VITAL RED System installation..."
    echo ""
    
    # Pre-installation checks
    check_php
    check_composer
    
    # Installation steps
    install_dependencies
    setup_environment
    setup_database
    clear_caches
    set_permissions
    optimize_production
    
    # Show completion information
    show_completion_info
}

# Run main function
main
