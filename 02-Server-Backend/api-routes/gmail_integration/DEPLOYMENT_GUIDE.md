# VITAL RED Gmail Integration - Deployment Guide

## 🏥 Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

This guide provides step-by-step instructions for deploying the Gmail Integration system in production.

## 📋 Pre-Deployment Checklist

### System Requirements
- [ ] Ubuntu 20.04+ or CentOS 8+ server
- [ ] Minimum 4GB RAM, 8GB recommended
- [ ] 50GB+ available disk space
- [ ] Python 3.8+ installed
- [ ] PostgreSQL 12+ installed and configured
- [ ] Redis 6+ installed (optional but recommended)
- [ ] SSL certificates for HTTPS (production)

### Gmail API Setup
- [ ] Google Cloud Console project created
- [ ] Gmail API enabled
- [ ] OAuth 2.0 credentials generated
- [ ] Service account configured (if using service account)
- [ ] Institutional Gmail account access verified

### Network Requirements
- [ ] Firewall configured for ports 8001 (API), 5432 (PostgreSQL), 6379 (Redis)
- [ ] HTTPS certificates installed
- [ ] Domain name configured (if applicable)

## 🚀 Production Deployment

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    postgresql \
    postgresql-contrib \
    redis-server \
    nginx \
    tesseract-ocr \
    tesseract-ocr-spa \
    supervisor \
    git \
    curl \
    unzip

# Create application user
sudo useradd -m -s /bin/bash vitalred
sudo usermod -aG sudo vitalred
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE DATABASE vital_red;
CREATE USER vitalred_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE vital_red TO vitalred_user;
ALTER USER vitalred_user CREATEDB;
\q

# Configure PostgreSQL
sudo nano /etc/postgresql/12/main/postgresql.conf
# Uncomment and modify:
# listen_addresses = 'localhost'
# max_connections = 100

sudo nano /etc/postgresql/12/main/pg_hba.conf
# Add line:
# local   vital_red   vitalred_user   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

### Step 3: Redis Configuration

```bash
# Configure Redis
sudo nano /etc/redis/redis.conf
# Modify:
# requirepass your_redis_password_here
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

### Step 4: Application Deployment

```bash
# Switch to application user
sudo su - vitalred

# Create application directory
mkdir -p /home/vitalred/vital-red-gmail
cd /home/vitalred/vital-red-gmail

# Copy application files (from your development environment)
# You can use scp, rsync, or git clone

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p credentials logs temp processed backups

# Copy environment configuration
cp .env.example .env
nano .env
# Configure all environment variables
```

### Step 5: Environment Configuration

```bash
# Edit .env file with production values
nano .env
```

```env
# Production Environment Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vital_red
DB_USER=vitalred_user
DB_PASSWORD=your_secure_db_password

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

API_HOST=0.0.0.0
API_PORT=8001
API_WORKERS=4

LOG_LEVEL=INFO
LOG_CONSOLE=false

ENCRYPTION_KEY=your-32-character-encryption-key
FRONTEND_API=https://vitalred.hospital-ese.com/api
WEBHOOK_URL=https://vitalred.hospital-ese.com/webhook/gmail

# Add all other production configurations
```

### Step 6: Gmail API Credentials

```bash
# Copy Gmail API credentials
# Upload credentials.json to /home/vitalred/vital-red-gmail/credentials/

# Set proper permissions
chmod 600 credentials/credentials.json
chown vitalred:vitalred credentials/credentials.json

# Initial authentication (run interactively first time)
python gmail_client.py
# Follow OAuth flow to generate token.json
```

### Step 7: Database Initialization

```bash
# Initialize database tables
python -c "
from database import db_manager
from models import create_tables
create_tables(db_manager.engine)
print('Database initialized successfully')
"

# Verify database connection
python -c "
from database import db_manager
health = db_manager.health_check()
print('Database health:', health)
"
```

### Step 8: Supervisor Configuration

```bash
# Create supervisor configuration
sudo nano /etc/supervisor/conf.d/vital-red-gmail.conf
```

```ini
[program:vital-red-gmail-service]
command=/home/vitalred/vital-red-gmail/venv/bin/python main_service.py
directory=/home/vitalred/vital-red-gmail
user=vitalred
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/vitalred/vital-red-gmail/logs/supervisor.log
environment=PATH="/home/vitalred/vital-red-gmail/venv/bin"

[program:vital-red-gmail-api]
command=/home/vitalred/vital-red-gmail/venv/bin/python -m uvicorn api:app --host 0.0.0.0 --port 8001 --workers 4
directory=/home/vitalred/vital-red-gmail
user=vitalred
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/vitalred/vital-red-gmail/logs/api.log
environment=PATH="/home/vitalred/vital-red-gmail/venv/bin"
```

```bash
# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start vital-red-gmail-service
sudo supervisorctl start vital-red-gmail-api
```

### Step 9: Nginx Configuration

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/vital-red-gmail
```

```nginx
server {
    listen 80;
    server_name gmail-api.hospital-ese.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name gmail-api.hospital-ese.com;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/hospital-ese.com.crt;
    ssl_certificate_key /etc/ssl/private/hospital-ese.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    location / {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint (no rate limiting)
    location /health {
        proxy_pass http://127.0.0.1:8001/health;
        access_log off;
    }
    
    # Static files (if any)
    location /static/ {
        alias /home/vitalred/vital-red-gmail/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vital-red-gmail /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 10: Monitoring Setup

```bash
# Create monitoring script
nano /home/vitalred/vital-red-gmail/scripts/monitor.sh
```

```bash
#!/bin/bash
# VITAL RED Gmail Integration Monitoring Script

LOG_FILE="/home/vitalred/vital-red-gmail/logs/monitor.log"
API_URL="http://localhost:8001/health"

# Function to log with timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check API health
check_api() {
    response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)
    if [ $response -eq 200 ]; then
        log_message "API health check: OK"
        return 0
    else
        log_message "API health check: FAILED (HTTP $response)"
        return 1
    fi
}

# Check database connection
check_database() {
    cd /home/vitalred/vital-red-gmail
    source venv/bin/activate
    python -c "
from database import db_manager
health = db_manager.health_check()
if health['database']['status'] == 'healthy':
    print('Database: OK')
    exit(0)
else:
    print('Database: FAILED')
    exit(1)
" >> $LOG_FILE 2>&1
}

# Check disk space
check_disk_space() {
    usage=$(df /home/vitalred/vital-red-gmail | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $usage -gt 90 ]; then
        log_message "Disk space warning: ${usage}% used"
        return 1
    else
        log_message "Disk space: OK (${usage}% used)"
        return 0
    fi
}

# Main monitoring
log_message "Starting health checks"
check_api
check_database
check_disk_space
log_message "Health checks completed"
```

```bash
# Make script executable
chmod +x /home/vitalred/vital-red-gmail/scripts/monitor.sh

# Add to crontab
crontab -e
# Add line:
# */5 * * * * /home/vitalred/vital-red-gmail/scripts/monitor.sh
```

### Step 11: Backup Configuration

```bash
# Create backup script
nano /home/vitalred/vital-red-gmail/scripts/backup.sh
```

```bash
#!/bin/bash
# VITAL RED Gmail Integration Backup Script

BACKUP_DIR="/home/vitalred/vital-red-gmail/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="vital_red"
DB_USER="vitalred_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Application files backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz \
    --exclude='venv' \
    --exclude='temp' \
    --exclude='logs' \
    --exclude='__pycache__' \
    /home/vitalred/vital-red-gmail

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make script executable
chmod +x /home/vitalred/vital-red-gmail/scripts/backup.sh

# Add to crontab for daily backups
crontab -e
# Add line:
# 0 2 * * * /home/vitalred/vital-red-gmail/scripts/backup.sh
```

## 🔍 Post-Deployment Verification

### 1. Service Status Check
```bash
# Check all services
sudo supervisorctl status
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server

# Check application logs
tail -f /home/vitalred/vital-red-gmail/logs/gmail_integration.log
```

### 2. API Testing
```bash
# Test health endpoint
curl https://gmail-api.hospital-ese.com/health

# Test authentication
curl -H "Authorization: Bearer your-token" \
     https://gmail-api.hospital-ese.com/service/status
```

### 3. Database Verification
```bash
# Connect to database
psql -h localhost -U vitalred_user -d vital_red

-- Check tables
\dt

-- Check for data
SELECT COUNT(*) FROM email_messages;
SELECT COUNT(*) FROM medical_referrals;
```

## 🚨 Troubleshooting

### Common Issues

1. **Gmail Authentication Fails**
   - Check credentials.json file permissions
   - Verify OAuth scopes in Google Cloud Console
   - Re-run authentication process

2. **Database Connection Errors**
   - Verify PostgreSQL is running
   - Check database credentials in .env
   - Ensure user has proper permissions

3. **High Memory Usage**
   - Reduce CONCURRENT_WORKERS in config
   - Enable Redis caching
   - Monitor with `htop` or `free -h`

4. **Processing Delays**
   - Check email volume vs. processing capacity
   - Increase BATCH_SIZE if needed
   - Monitor queue size

### Log Analysis
```bash
# Monitor real-time logs
tail -f logs/gmail_integration.log | grep ERROR

# Check processing statistics
grep "processed successfully" logs/gmail_integration.log | wc -l

# Monitor API requests
tail -f /var/log/nginx/access.log | grep gmail-api
```

## 🔒 Security Hardening

1. **Firewall Configuration**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 8001  # Block direct API access
```

2. **File Permissions**
```bash
chmod 600 .env
chmod 600 credentials/*
chmod 755 scripts/*
```

3. **Regular Updates**
```bash
# Create update script
echo '#!/bin/bash
sudo apt update && sudo apt upgrade -y
pip install --upgrade -r requirements.txt
sudo supervisorctl restart vital-red-gmail-service
sudo supervisorctl restart vital-red-gmail-api
' > scripts/update.sh
chmod +x scripts/update.sh
```

## 📞 Support and Maintenance

- **Logs Location**: `/home/vitalred/vital-red-gmail/logs/`
- **Configuration**: `/home/vitalred/vital-red-gmail/.env`
- **Service Control**: `sudo supervisorctl [start|stop|restart] vital-red-gmail-*`
- **Database Access**: `psql -h localhost -U vitalred_user -d vital_red`

For technical support, contact the Development Team at Hospital Universitaria ESE.
