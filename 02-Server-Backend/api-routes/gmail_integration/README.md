# VITAL RED Gmail Integration System

## 🏥 Hospital Universitaria ESE - Departamento de Innovación y Desarrollo

A comprehensive Gmail integration system for the VITAL RED medical referral platform that automatically processes medical referral emails, extracts patient information, and integrates with the existing React frontend.

## 🎯 Features

### Core Functionality
- **Gmail API Integration**: Secure connection to institutional Gmail accounts
- **Automated Email Processing**: Real-time monitoring and processing of medical referral emails
- **Intelligent Classification**: AI-powered classification of medical referrals vs. regular emails
- **Document Processing**: Extract text from PDFs, Word documents, and images using OCR
- **Medical Data Extraction**: Parse patient information, diagnoses, and referral details
- **Sequential Processing**: Organized, chronological processing with audit trails

### Data Management
- **Patient Records**: Automatic creation and updating of patient profiles
- **Medical Referrals**: Structured storage of referral information
- **Attachment Handling**: Secure storage and processing of medical documents
- **Error Prevention**: Robust error handling and data integrity checks

### Integration
- **REST API**: FastAPI-based API for frontend integration
- **Real-time Updates**: WebSocket support for live updates
- **Database Integration**: PostgreSQL with Redis caching
- **Monitoring**: Comprehensive logging and health monitoring

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Gmail API     │────│  Gmail Client    │────│ Email Processor │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Text Extractor  │────│ Medical Classifier│────│   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI       │────│  VITAL RED UI    │────│   Monitoring    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

### System Requirements
- Python 3.8+
- PostgreSQL 12+
- Redis 6+ (optional, for caching)
- Tesseract OCR (for image text extraction)

### Gmail API Setup
1. Google Cloud Console project with Gmail API enabled
2. OAuth 2.0 credentials (credentials.json)
3. Institutional Gmail account access

## 🚀 Installation

### 1. Quick Setup
```bash
# Clone or navigate to the gmail_integration directory
cd server/gmail_integration

# Run automated setup
python setup.py
```

### 2. Manual Setup

#### Install Dependencies
```bash
# Install Python packages
pip install -r requirements.txt

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib redis-server tesseract-ocr tesseract-ocr-spa
```

#### Configure Environment
```bash
# Copy and edit environment file
cp .env.example .env
# Edit .env with your database and API settings
```

#### Setup Database
```bash
# Create PostgreSQL database
sudo -u postgres createdb vital_red

# Initialize tables
python -c "from database import db_manager; from models import create_tables; create_tables(db_manager.engine)"
```

#### Configure Gmail API
1. Place your `credentials.json` file in the `credentials/` directory
2. Run initial authentication:
```bash
python gmail_client.py
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vital_red
DB_USER=postgres
DB_PASSWORD=your_password

# API
API_HOST=0.0.0.0
API_PORT=8001

# Gmail Integration
POLL_INTERVAL=300  # Check emails every 5 minutes

# Security
ENCRYPTION_KEY=your-encryption-key
```

### Gmail Configuration (config.py)
- Referral keywords for email filtering
- Medical specialties recognition
- Priority level classification
- Document type identification

## 🏃‍♂️ Running the Service

### Development Mode
```bash
# Start the main service
python main_service.py

# Start the API server (in another terminal)
python api.py

# Or use uvicorn directly
uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

### Production Mode
```bash
# Using systemd service
sudo systemctl start vital-red-gmail
sudo systemctl enable vital-red-gmail

# Or using Docker
docker-compose up -d
```

## 📡 API Endpoints

### Service Management
- `GET /health` - Health check
- `GET /service/status` - Service status
- `POST /service/sync` - Manual email sync

### Email Management
- `GET /emails` - List emails with filtering
- `GET /emails/{id}` - Email details
- `GET /emails?is_referral=true` - Medical referrals only

### Patient Management
- `GET /patients` - List patients
- `GET /patients/{id}` - Patient details
- `GET /patients?search=term` - Search patients

### Referral Management
- `GET /referrals` - List referrals
- `PUT /referrals/{id}` - Update referral status
- `GET /referrals?status=pending` - Filter by status

### Statistics
- `GET /statistics` - System statistics

## 🔍 Monitoring and Logging

### Log Files
- `logs/gmail_integration.log` - Main application log
- `logs/email_processing.log` - Email processing details
- `logs/errors.log` - Error tracking

### Health Monitoring
```bash
# Check service status
curl http://localhost:8001/health

# Get detailed statistics
curl http://localhost:8001/statistics
```

### Database Monitoring
```sql
-- Check processing status
SELECT processing_status, COUNT(*) FROM email_messages GROUP BY processing_status;

-- Recent referrals
SELECT * FROM medical_referrals WHERE referral_date > NOW() - INTERVAL '24 hours';
```

## 🔒 Security Features

- **Data Encryption**: Sensitive attachments encrypted at rest
- **Access Control**: Role-based API access
- **Audit Trails**: Complete processing history
- **Secure Storage**: Protected file storage with integrity checks
- **Domain Filtering**: Restrict to authorized email domains

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pytest

# Run specific test modules
pytest tests/test_email_processor.py
pytest tests/test_medical_classifier.py
```

### Integration Tests
```bash
# Test Gmail API connection
python tests/test_gmail_integration.py

# Test database operations
python tests/test_database.py
```

### Manual Testing
```bash
# Process a test email
python -c "
from main_service import gmail_service
import asyncio
asyncio.run(gmail_service.manual_sync())
"
```

## 🔧 Troubleshooting

### Common Issues

#### Gmail Authentication Errors
```bash
# Re-authenticate
rm credentials/token.json
python gmail_client.py
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
python -c "from database import db_manager; print(db_manager.health_check())"
```

#### OCR Not Working
```bash
# Install Tesseract
sudo apt-get install tesseract-ocr tesseract-ocr-spa

# Test OCR
tesseract --version
```

### Performance Optimization

#### Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_emails_date ON email_messages(date_received);
CREATE INDEX idx_emails_status ON email_messages(processing_status);
CREATE INDEX idx_referrals_status ON medical_referrals(status);
```

#### Memory Management
- Adjust `BATCH_SIZE` in config for memory constraints
- Enable Redis caching for better performance
- Use connection pooling for database

## 📈 Scaling

### Horizontal Scaling
- Deploy multiple worker instances
- Use Redis for shared state
- Load balance API requests

### Vertical Scaling
- Increase `CONCURRENT_WORKERS`
- Optimize database queries
- Use SSD storage for attachments

## 🤝 Integration with VITAL RED Frontend

### API Integration
```javascript
// Example React integration
const fetchReferrals = async () => {
  const response = await fetch('http://localhost:8001/referrals?status=pending');
  const referrals = await response.json();
  return referrals;
};
```

### WebSocket Updates (Future)
```javascript
// Real-time updates
const ws = new WebSocket('ws://localhost:8001/ws');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Update UI with new referral
};
```

## 📝 Development

### Adding New Features
1. Update models in `models.py`
2. Add processing logic in `email_processor.py`
3. Update API endpoints in `api.py`
4. Add tests in `tests/`

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Add docstrings for all functions
- Use structured logging

## 📄 License

This project is proprietary software developed for Hospital Universitaria ESE.

## 👥 Support

For technical support or questions:
- Email: desarrollo@hospital-ese.com
- Internal Documentation: [Hospital Wiki]
- Issue Tracking: [Internal System]

---

**Hospital Universitaria ESE - Departamento de Innovación y Desarrollo**  
*Transforming Healthcare Through Technology*
