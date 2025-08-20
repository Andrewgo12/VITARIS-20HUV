"""
Setup and Installation Script for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import os
import sys
import subprocess
import json
from pathlib import Path
import structlog

# Configure basic logging
logging = structlog.get_logger(__name__)

class GmailIntegrationSetup:
    """
    Setup class for Gmail Integration system
    """
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.credentials_dir = self.base_dir / "credentials"
        self.logs_dir = self.base_dir / "logs"
        self.temp_dir = self.base_dir / "temp"
        self.processed_dir = self.base_dir / "processed"
        
    def run_setup(self):
        """Run complete setup process"""
        print("🏥 VITAL RED Gmail Integration Setup")
        print("=" * 50)
        
        try:
            # Step 1: Create directories
            self._create_directories()
            
            # Step 2: Install Python dependencies
            self._install_dependencies()
            
            # Step 3: Setup database
            self._setup_database()
            
            # Step 4: Configure Gmail API
            self._configure_gmail_api()
            
            # Step 5: Setup environment variables
            self._setup_environment()
            
            # Step 6: Initialize database tables
            self._initialize_database()
            
            # Step 7: Test connections
            self._test_connections()
            
            print("\n✅ Setup completed successfully!")
            print("\nNext steps:")
            print("1. Place your Gmail API credentials.json file in the credentials/ directory")
            print("2. Configure your database connection in .env file")
            print("3. Run the service: python main_service.py")
            
        except Exception as e:
            print(f"\n❌ Setup failed: {e}")
            sys.exit(1)
    
    def _create_directories(self):
        """Create necessary directories"""
        print("\n📁 Creating directories...")
        
        directories = [
            self.credentials_dir,
            self.logs_dir,
            self.temp_dir,
            self.processed_dir
        ]
        
        for directory in directories:
            directory.mkdir(exist_ok=True)
            print(f"   ✓ Created: {directory}")
    
    def _install_dependencies(self):
        """Install Python dependencies"""
        print("\n📦 Installing Python dependencies...")
        
        requirements_file = self.base_dir / "requirements.txt"
        
        if not requirements_file.exists():
            print("   ❌ requirements.txt not found")
            return
        
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
            ])
            print("   ✓ Dependencies installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"   ❌ Failed to install dependencies: {e}")
            raise
    
    def _setup_database(self):
        """Setup database configuration"""
        print("\n🗄️  Setting up database...")
        
        # Check if PostgreSQL is available
        try:
            import psycopg2
            print("   ✓ PostgreSQL driver available")
        except ImportError:
            print("   ⚠️  PostgreSQL driver not available, installing...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "psycopg2-binary"
            ])
    
    def _configure_gmail_api(self):
        """Configure Gmail API"""
        print("\n📧 Configuring Gmail API...")
        
        credentials_file = self.credentials_dir / "credentials.json"
        
        if not credentials_file.exists():
            print("   ⚠️  Gmail API credentials not found")
            print("   📝 Please follow these steps:")
            print("      1. Go to Google Cloud Console")
            print("      2. Create a new project or select existing one")
            print("      3. Enable Gmail API")
            print("      4. Create credentials (OAuth 2.0 Client ID)")
            print("      5. Download credentials.json")
            print(f"      6. Place it in: {credentials_file}")
            
            # Create sample credentials file
            sample_credentials = {
                "installed": {
                    "client_id": "your-client-id.googleusercontent.com",
                    "project_id": "your-project-id",
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_secret": "your-client-secret",
                    "redirect_uris": ["http://localhost"]
                }
            }
            
            sample_file = self.credentials_dir / "credentials_sample.json"
            with open(sample_file, 'w') as f:
                json.dump(sample_credentials, f, indent=2)
            
            print(f"   📄 Sample credentials created: {sample_file}")
        else:
            print("   ✓ Gmail API credentials found")
    
    def _setup_environment(self):
        """Setup environment variables"""
        print("\n🔧 Setting up environment variables...")
        
        env_file = self.base_dir / ".env"
        
        if not env_file.exists():
            env_content = """# VITAL RED Gmail Integration Environment Variables

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vital_red
DB_USER=postgres
DB_PASSWORD=your_password

# Redis Configuration (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=

# API Configuration
API_HOST=0.0.0.0
API_PORT=8001
API_RELOAD=false
API_WORKERS=1

# Logging Configuration
LOG_LEVEL=INFO
LOG_CONSOLE=true

# Security Configuration
ENCRYPTION_KEY=your-encryption-key-here

# Frontend Integration
FRONTEND_API=http://localhost:3000/api
WEBHOOK_URL=http://localhost:3000/webhook/gmail
FRONTEND_AUTH_TOKEN=your-auth-token

# Monitoring and Alerts
ALERT_EMAIL=admin@hospital.com
"""
            
            with open(env_file, 'w') as f:
                f.write(env_content)
            
            print(f"   ✓ Environment file created: {env_file}")
            print("   📝 Please update the values in .env file")
        else:
            print("   ✓ Environment file exists")
    
    def _initialize_database(self):
        """Initialize database tables"""
        print("\n🗃️  Initializing database...")
        
        try:
            from database import db_manager
            from models import create_tables
            
            # Create tables
            create_tables(db_manager.engine)
            print("   ✓ Database tables created")
            
        except Exception as e:
            print(f"   ⚠️  Database initialization skipped: {e}")
            print("   📝 Please ensure database is running and configured")
    
    def _test_connections(self):
        """Test system connections"""
        print("\n🔍 Testing connections...")
        
        # Test database connection
        try:
            from database import db_manager
            health = db_manager.health_check()
            
            if health['database']['status'] == 'healthy':
                print("   ✓ Database connection successful")
            else:
                print(f"   ❌ Database connection failed: {health['database']['error']}")
        except Exception as e:
            print(f"   ⚠️  Database test skipped: {e}")
        
        # Test Gmail API (if credentials exist)
        try:
            from gmail_client import GmailClient
            client = GmailClient()
            
            if client.credentials_file.exists():
                print("   ✓ Gmail API credentials found")
            else:
                print("   ⚠️  Gmail API credentials not configured")
        except Exception as e:
            print(f"   ⚠️  Gmail API test skipped: {e}")

def install_system_dependencies():
    """Install system-level dependencies"""
    print("\n🔧 Installing system dependencies...")
    
    # Check operating system
    import platform
    os_name = platform.system().lower()
    
    if os_name == "linux":
        print("   📋 For Ubuntu/Debian systems, run:")
        print("      sudo apt-get update")
        print("      sudo apt-get install postgresql postgresql-contrib")
        print("      sudo apt-get install redis-server")
        print("      sudo apt-get install tesseract-ocr")
        print("      sudo apt-get install tesseract-ocr-spa")  # Spanish language pack
        
    elif os_name == "darwin":  # macOS
        print("   📋 For macOS systems, run:")
        print("      brew install postgresql")
        print("      brew install redis")
        print("      brew install tesseract")
        print("      brew install tesseract-lang")
        
    elif os_name == "windows":
        print("   📋 For Windows systems:")
        print("      1. Install PostgreSQL from https://www.postgresql.org/download/windows/")
        print("      2. Install Redis from https://redis.io/download")
        print("      3. Install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki")
        
    else:
        print(f"   ⚠️  Unsupported operating system: {os_name}")

def create_service_script():
    """Create systemd service script for Linux"""
    print("\n🔧 Creating service script...")
    
    service_content = """[Unit]
Description=VITAL RED Gmail Integration Service
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/gmail_integration
Environment=PATH=/path/to/venv/bin
ExecStart=/path/to/venv/bin/python main_service.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path("vital-red-gmail.service")
    with open(service_file, 'w') as f:
        f.write(service_content)
    
    print(f"   ✓ Service script created: {service_file}")
    print("   📝 Update paths and copy to /etc/systemd/system/")

def main():
    """Main setup function"""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "install-deps":
            install_system_dependencies()
        elif command == "create-service":
            create_service_script()
        elif command == "full":
            install_system_dependencies()
            setup = GmailIntegrationSetup()
            setup.run_setup()
            create_service_script()
        else:
            print("Usage: python setup.py [install-deps|create-service|full]")
    else:
        # Run basic setup
        setup = GmailIntegrationSetup()
        setup.run_setup()

if __name__ == "__main__":
    main()
