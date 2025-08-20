#!/usr/bin/env python3
"""
FastAPI Server for VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import structlog

# Import our modules
from database import DatabaseManager
from api_routes import api_router, auth_router, health_router

logger = structlog.get_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="VITAL RED API",
    description="Sistema de Gestión Médica - Hospital Universitaria ESE",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
db_manager = DatabaseManager()

# Include routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(api_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "VITAL RED API - Hospital Universitaria ESE",
        "version": "2.0.0",
        "status": "running",
        "timestamp": datetime.utcnow(),
        "docs": "/docs"
    }

@app.get("/status")
async def status():
    """System status endpoint"""
    try:
        health = db_manager.get_health_status()
        return {
            "status": "healthy" if health.get('database', {}).get('status') == 'healthy' else "unhealthy",
            "timestamp": datetime.utcnow(),
            "components": health,
            "version": "2.0.0"
        }
    except Exception as e:
        logger.error("Status check failed", error=str(e))
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "timestamp": datetime.utcnow(),
                "error": str(e)
            }
        )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc),
            "timestamp": datetime.utcnow()
        }
    )

def main():
    """Main function to run the server"""
    print("🏥 VITAL RED API Server")
    print("Hospital Universitaria ESE")
    print("=" * 50)
    print("🚀 Iniciando servidor...")
    
    try:
        # Test database connection
        health = db_manager.get_health_status()
        if health.get('database', {}).get('status') == 'healthy':
            print("✅ Base de datos: CONECTADA")
        else:
            print("⚠️  Base de datos: CON ADVERTENCIAS")
        
        print("🌐 Servidor disponible en:")
        print("   - API: http://localhost:8001")
        print("   - Docs: http://localhost:8001/docs")
        print("   - Status: http://localhost:8001/status")
        print("=" * 50)
        
        # Run server
        uvicorn.run(
            "api_server:app",
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info"
        )
        
    except Exception as e:
        print(f"❌ Error iniciando servidor: {e}")
        return False

if __name__ == "__main__":
    main()
