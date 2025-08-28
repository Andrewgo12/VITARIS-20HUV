# 🏥 VITAL RED System - Technical Documentation

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Installation Guide](#installation-guide)
3. [Configuration](#configuration)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Security](#security)
7. [Performance](#performance)
8. [Troubleshooting](#troubleshooting)
9. [Development](#development)
10. [Deployment](#deployment)

---

## 🏗️ System Architecture

### Technology Stack
- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: Blade Templates + Tailwind CSS + Alpine.js
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Cache**: File/Database (development) / Redis (production)
- **Queue**: Database (development) / Redis (production)

### Directory Structure
```
rrst/
├── app/
│   ├── Console/Commands/          # Custom Artisan commands
│   ├── Http/Controllers/          # Application controllers
│   ├── Http/Middleware/           # Custom middleware
│   ├── Models/                    # Eloquent models
│   └── Services/                  # Business logic services
├── config/                        # Configuration files
├── database/                      # Migrations and seeders
├── resources/views/               # Blade templates
├── routes/                        # Route definitions
└── storage/                       # File storage and logs
```

### Service Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Laravel API   │    │   AI System     │
│   (Blade/JS)    │◄──►│   (Backend)     │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Database      │    │   Gmail API     │
│                 │    │   (SQLite/MySQL)│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚀 Installation Guide

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js (optional, for asset compilation)
- Database (SQLite/MySQL/PostgreSQL)

### Quick Installation

#### Option 1: Automated Script (Recommended)

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
install.bat
```

#### Option 2: Manual Installation

1. **Install Dependencies**
   ```bash
   composer install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   php artisan migrate
   php artisan vital-red:seed
   ```

4. **Start Server**
   ```bash
   php artisan serve
   ```

---

## ⚙️ Configuration

### Environment Variables

#### Core Application
```env
APP_NAME="VITAL RED System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
```

#### Database
```env
DB_CONNECTION=sqlite
# OR for MySQL/PostgreSQL:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=vital_red
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

#### AI System Integration
```env
AI_SYSTEM_URL=http://localhost:3000
AI_SYSTEM_TIMEOUT=30
AI_SYSTEM_RETRY=3
AI_AUTO_PROCESSING=true
AI_PROCESSING_INTERVAL=5
AI_CONFIDENCE_THRESHOLD=85
```

#### Hospital Information
```env
HOSPITAL_NAME="Hospital Universitaria ESE"
HOSPITAL_ADDRESS="Your Hospital Address"
HOSPITAL_PHONE="+57 (1) 234-5678"
HOSPITAL_EMAIL="contact@hospital.com"
```

### Custom Configuration File
The system uses `config/vital_red.php` for centralized configuration:

```php
return [
    'ai_system' => [
        'base_url' => env('AI_SYSTEM_URL', 'http://localhost:3000'),
        'timeout' => env('AI_SYSTEM_TIMEOUT', 30),
        // ... more settings
    ],
    'hospital' => [
        'name' => env('HOSPITAL_NAME', 'Hospital Universitaria ESE'),
        // ... more settings
    ],
    // ... more sections
];
```

---

## 📡 API Documentation

### Internal APIs (Laravel)

#### Medical Cases
```http
GET /api/vital-red/medical-cases
```
**Parameters:**
- `priority` (optional): Alta, Media, Baja
- `specialty` (optional): Cardiología, Neurología, etc.
- `status` (optional): Pendiente, Aprobado, Rechazado
- `search` (optional): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "metadata": {
      "generated_at": "2025-08-28T10:30:00Z",
      "total_cases": 5,
      "source": "Laravel API"
    },
    "cases": [...],
    "statistics": {...}
  }
}
```

#### Other Endpoints
- `GET /api/vital-red/patient-data` - Patient information
- `GET /api/vital-red/urgency-data` - Emergency cases
- `GET /api/vital-red/hospitalization-data` - Hospitalized patients
- `GET /api/vital-red/historical-data` - Historical records
- `GET /api/vital-red/admin-data` - Administrative data

#### Health Check
```http
GET /api/vital-red/health
GET /api/vital-red/status
GET /api/vital-red/ping
```

### External AI System APIs

The system integrates with external AI APIs:
- `GET http://localhost:3000/api/medical-cases`
- `GET http://localhost:3000/api/patient-data`
- `GET http://localhost:3000/api/urgency-data`
- `GET http://localhost:3000/api/hospitalization-data`
- `GET http://localhost:3000/api/historical-data`
- `GET http://localhost:3000/api/admin-data`

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'medico',
    specialty VARCHAR(100) NULL,
    license_number VARCHAR(50) NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Roles and Permissions
- **admin**: Full system access, user management, configuration
- **medico**: Medical case management, patient data access

---

## 🔒 Security

### Authentication
- Laravel's built-in authentication system
- Session-based authentication
- CSRF protection on all forms
- Password hashing with bcrypt

### Authorization
- Role-based access control (RBAC)
- Middleware protection for routes
- Admin-only areas protected

### API Security
- CORS middleware for API endpoints
- Rate limiting (configurable)
- Input validation and sanitization

### Security Headers
```php
// Automatically applied
'X-Frame-Options' => 'DENY',
'X-Content-Type-Options' => 'nosniff',
'X-XSS-Protection' => '1; mode=block',
```

---

## ⚡ Performance

### Caching Strategy
- **API Cache**: 1-minute cache for external API calls
- **Local Cache**: 30-second cache for local API responses
- **View Cache**: Blade template compilation cache
- **Config Cache**: Configuration caching for production

### Database Optimization
- Indexed columns for frequent queries
- Eager loading for relationships
- Query optimization

### Frontend Optimization
- Minified CSS/JS in production
- Image optimization
- Lazy loading for heavy components

---

## 🔧 Troubleshooting

### Common Issues

#### 1. AI System Connection Failed
```bash
# Check AI system status
php artisan vital-red:status

# Clear API cache
php artisan vital-red:cache-clear
```

#### 2. Database Connection Issues
```bash
# Check database configuration
php artisan config:show database

# Run migrations
php artisan migrate:status
php artisan migrate
```

#### 3. Permission Errors (Linux/Mac)
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

#### 4. Cache Issues
```bash
# Clear all caches
php artisan vital-red:cache-clear --all
```

### Debug Mode
Enable debug mode in `.env`:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

### Logs Location
- Application logs: `storage/logs/laravel.log`
- Web server logs: Check your web server configuration

---

## 👨‍💻 Development

### Custom Commands
```bash
# Check system status
php artisan vital-red:status [--detailed]

# Clear system cache
php artisan vital-red:cache-clear [--all]

# Seed database
php artisan vital-red:seed [--fresh]
```

### Adding New Features

#### 1. Create Controller
```bash
php artisan make:controller YourController
```

#### 2. Add Routes
```php
// routes/web.php
Route::get('/your-route', [YourController::class, 'method']);
```

#### 3. Create Views
```php
// resources/views/your-view.blade.php
@extends('layouts.dashboard')
@section('page-content')
    <!-- Your content -->
@endsection
```

### Testing
```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter YourTestName
```

---

## 🚀 Deployment

### Production Checklist

1. **Environment Configuration**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Optimize Application**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Database Setup**
   ```bash
   php artisan migrate --force
   php artisan vital-red:seed
   ```

4. **Web Server Configuration**
   - Point document root to `public/` directory
   - Configure SSL certificate
   - Set up proper file permissions

5. **Security**
   - Generate new APP_KEY
   - Configure firewall
   - Set up backup strategy

### Docker Deployment
```dockerfile
FROM php:8.2-fpm
# ... Docker configuration
```

### Monitoring
- Set up application monitoring
- Configure log aggregation
- Monitor AI system connectivity
- Database performance monitoring

---

## 📞 Support

### Getting Help
1. Check this documentation
2. Review Laravel documentation
3. Check system logs
4. Use diagnostic commands

### Reporting Issues
Include the following information:
- Laravel version: `php artisan --version`
- System status: `php artisan vital-red:status --detailed`
- Error logs from `storage/logs/`
- Steps to reproduce the issue

---

**VITAL RED System v1.0.0**  
**Technical Documentation**  
**Last Updated: August 28, 2025**
