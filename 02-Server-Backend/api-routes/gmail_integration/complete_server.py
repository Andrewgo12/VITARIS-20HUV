#!/usr/bin/env python3
"""
Complete VITAL RED Server - Production Ready
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import structlog

# Import all components
from database import db_manager, email_repo, patient_repo, referral_repo
from security import security_manager
from api_routes import api_router, auth_router, health_router
from main_service import GmailIntegrationService
from config import SERVER_CONFIG, GMAIL_CONFIG

# Configure logging
logger = structlog.get_logger(__name__)

# Global service instance
gmail_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global gmail_service
    
    logger.info("Starting VITAL RED Complete Server")
    
    try:
        # Initialize database
        logger.info("Initializing database connection")
        if not db_manager.initialize():
            raise Exception("Failed to initialize database")
        
        # Initialize security
        logger.info("Initializing security manager")
        security_manager.initialize()
        
        # Initialize Gmail service
        logger.info("Initializing Gmail Integration Service")
        gmail_service = GmailIntegrationService()
        
        # Start Gmail service in background
        asyncio.create_task(gmail_service.start_service())
        
        logger.info("VITAL RED server started successfully")
        yield
        
    except Exception as e:
        logger.error("Failed to start server", error=str(e))
        raise
    finally:
        # Cleanup
        logger.info("Shutting down VITAL RED server")
        if gmail_service:
            gmail_service.is_running = False
        db_manager.close()

# Create FastAPI application
app = FastAPI(
    title="VITAL RED API",
    description="Hospital Universitaria ESE - Sistema de Gestión de Referencias Médicas",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.hospital-ese.com"]
)

# Include routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(api_router)

# Include Gmail Extractor router if available
try:
    from .api_routes import extraction_router
    if extraction_router:
        app.include_router(extraction_router)
        logger.info("Gmail Extractor router incluido exitosamente")
except ImportError as e:
    logger.warning(f"Gmail Extractor no disponible: {e}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "VITAL RED API - Hospital Universitaria ESE",
        "version": "2.0.0",
        "status": "operational",
        "services": {
            "database": "connected" if db_manager.health_check() else "disconnected",
            "gmail": "active" if gmail_service and gmail_service.is_running else "inactive",
            "security": "enabled"
        }
    }

@app.get("/health")
async def health_check():
    """Comprehensive health check"""
    try:
        # Check database
        db_status = db_manager.health_check()
        
        # Check Gmail service
        gmail_status = gmail_service and gmail_service.is_running
        
        # Get basic stats
        stats = {
            "users": 0,
            "emails": 0,
            "patients": 0,
            "referrals": 0
        }
        
        if db_status:
            try:
                stats["users"] = len(db_manager.get_session().execute("SELECT id FROM users").fetchall())
                stats["emails"] = email_repo.count_emails()
                stats["patients"] = patient_repo.count_patients()
                stats["referrals"] = referral_repo.count_referrals()
            except Exception as e:
                logger.warning("Failed to get stats for health check", error=str(e))
        
        return {
            "status": "healthy" if db_status and gmail_status else "degraded",
            "database": "connected" if db_status else "disconnected",
            "gmail_service": "running" if gmail_status else "stopped",
            "security": "enabled",
            "statistics": stats,
            "timestamp": asyncio.get_event_loop().time()
        }
        
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(status_code=500, detail="Health check failed")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    logger.warning("HTTP exception", status_code=exc.status_code, detail=exc.detail)
    return {"error": exc.detail, "status_code": exc.status_code}

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error("Unhandled exception", error=str(exc))
    return {"error": "Internal server error", "status_code": 500}

def main():
    """Main server function"""
    try:
        logger.info("Starting VITAL RED Complete Server")
        
        # Server configuration
        config = {
            "host": SERVER_CONFIG.get("host", "0.0.0.0"),
            "port": SERVER_CONFIG.get("port", 8001),
            "reload": SERVER_CONFIG.get("reload", False),
            "workers": SERVER_CONFIG.get("workers", 1),
            "log_level": SERVER_CONFIG.get("log_level", "info")
        }
        
        logger.info("Server configuration", **config)
        
        # Start server
        uvicorn.run(
            "complete_server:app",
            **config
        )
        
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error("Server failed to start", error=str(e))
        raise

if __name__ == "__main__":
    main()
