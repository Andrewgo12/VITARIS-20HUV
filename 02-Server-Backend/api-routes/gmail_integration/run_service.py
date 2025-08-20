#!/usr/bin/env python3
"""
Service Runner for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import signal
import sys
import os
from pathlib import Path
import structlog
import uvicorn
from concurrent.futures import ThreadPoolExecutor

# Add current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from main_service import GmailIntegrationService
from api import app
from websocket_server import start_websocket_server
from monitoring import SystemMonitor
from config import API_CONFIG, LOGGING_CONFIG

# Configure logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)

class VitalRedGmailService:
    """
    Main service orchestrator for VITAL RED Gmail Integration
    """
    
    def __init__(self):
        self.logger = logger.bind(component="service_runner")
        self.gmail_service = None
        self.api_server = None
        self.websocket_server = None
        self.monitoring_service = None
        self.executor = ThreadPoolExecutor(max_workers=4)
        self.shutdown_event = asyncio.Event()
        
    async def start_all_services(self):
        """Start all services"""
        self.logger.info("Starting VITAL RED Gmail Integration Services")
        
        try:
            # Start Gmail Integration Service
            self.gmail_service = GmailIntegrationService()
            gmail_task = asyncio.create_task(self.gmail_service.start_service())
            
            # Start WebSocket Server
            self.websocket_server = await start_websocket_server(
                host=API_CONFIG["HOST"],
                port=8002
            )
            
            # Start Monitoring Service
            self.monitoring_service = SystemMonitor()
            monitoring_task = asyncio.create_task(self.monitoring_service.start())
            
            # Start API Server in thread pool
            api_task = asyncio.create_task(self.start_api_server())
            
            self.logger.info("All services started successfully")
            
            # Wait for shutdown signal
            await self.shutdown_event.wait()
            
            # Graceful shutdown
            await self.shutdown_all_services()
            
        except Exception as e:
            self.logger.error("Failed to start services", error=str(e))
            raise
    
    async def start_api_server(self):
        """Start FastAPI server"""
        try:
            config = uvicorn.Config(
                app,
                host=API_CONFIG["HOST"],
                port=API_CONFIG["PORT"],
                workers=1,  # Single worker for async
                log_level=LOGGING_CONFIG["LEVEL"].lower(),
                access_log=True,
                reload=False
            )
            
            server = uvicorn.Server(config)
            self.api_server = server
            
            self.logger.info("Starting API server", 
                           host=API_CONFIG["HOST"], 
                           port=API_CONFIG["PORT"])
            
            await server.serve()
            
        except Exception as e:
            self.logger.error("API server error", error=str(e))
            raise
    
    async def shutdown_all_services(self):
        """Gracefully shutdown all services"""
        self.logger.info("Shutting down all services")
        
        try:
            # Stop Gmail service
            if self.gmail_service:
                await self.gmail_service.stop_service()
            
            # Stop monitoring service
            if self.monitoring_service:
                self.monitoring_service.stop()
            
            # Stop WebSocket server
            if self.websocket_server:
                self.websocket_server.close()
                await self.websocket_server.wait_closed()
            
            # Stop API server
            if self.api_server:
                self.api_server.should_exit = True
            
            self.logger.info("All services stopped successfully")
            
        except Exception as e:
            self.logger.error("Error during shutdown", error=str(e))
    
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        self.logger.info("Received shutdown signal", signal=signum)
        self.shutdown_event.set()

def setup_signal_handlers(service):
    """Setup signal handlers for graceful shutdown"""
    signal.signal(signal.SIGINT, service.signal_handler)
    signal.signal(signal.SIGTERM, service.signal_handler)
    
    if hasattr(signal, 'SIGHUP'):
        signal.signal(signal.SIGHUP, service.signal_handler)

def check_prerequisites():
    """Check system prerequisites"""
    logger.info("Checking system prerequisites")
    
    # Check required directories
    required_dirs = ['credentials', 'logs', 'temp', 'processed', 'attachments']
    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if not dir_path.exists():
            dir_path.mkdir(parents=True, exist_ok=True)
            logger.info("Created directory", directory=str(dir_path))
    
    # Check environment variables
    required_env_vars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
    missing_vars = []
    
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error("Missing required environment variables", 
                    missing=missing_vars)
        logger.info("Please check your .env file or environment configuration")
        return False
    
    # Check Gmail credentials
    credentials_file = Path("credentials/credentials.json")
    if not credentials_file.exists():
        logger.warning("Gmail credentials file not found", 
                      file=str(credentials_file))
        logger.info("Please place your Gmail API credentials.json file in the credentials/ directory")
    
    logger.info("Prerequisites check completed")
    return True

def main():
    """Main entry point"""
    print("🏥 VITAL RED Gmail Integration Service")
    print("Hospital Universitaria ESE - Departamento de Innovación y Desarrollo")
    print("=" * 60)
    
    # Check prerequisites
    if not check_prerequisites():
        sys.exit(1)
    
    # Create service instance
    service = VitalRedGmailService()
    
    # Setup signal handlers
    setup_signal_handlers(service)
    
    try:
        # Run the service
        asyncio.run(service.start_all_services())
        
    except KeyboardInterrupt:
        logger.info("Service interrupted by user")
    except Exception as e:
        logger.error("Service failed", error=str(e))
        sys.exit(1)
    
    logger.info("Service shutdown complete")

if __name__ == "__main__":
    main()
