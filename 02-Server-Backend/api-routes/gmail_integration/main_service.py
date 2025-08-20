"""
Main Gmail Integration Service for VITAL RED
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
import structlog

from gmail_client import GmailClient
from email_processor import EmailProcessor
from database import db_manager, email_repo, attachment_repo
from config import GMAIL_CONFIG, PROCESSING_CONFIG, TEMP_DIR, PROCESSED_DIR
# from monitoring import SystemMonitor  # Will be implemented separately

logger = structlog.get_logger(__name__)

class GmailIntegrationService:
    """
    Main service orchestrating Gmail integration for VITAL RED
    """
    
    def __init__(self):
        self.logger = logger.bind(component="gmail_service")
        self.gmail_client = GmailClient()
        self.email_processor = EmailProcessor(
            db_session=db_manager.get_session_direct(),
            file_storage_path=PROCESSED_DIR
        )
        # self.monitor = SystemMonitor()  # Will be implemented separately
        
        # Service state
        self.is_running = False
        self.last_check = None
        self.processed_count = 0
        self.error_count = 0
        
        # Ensure directories exist
        TEMP_DIR.mkdir(exist_ok=True)
        PROCESSED_DIR.mkdir(exist_ok=True)
    
    async def start_service(self):
        """Start the Gmail integration service"""
        try:
            self.logger.info("Starting Gmail Integration Service for VITAL RED")
            
            # Authenticate with Gmail
            if not self.gmail_client.authenticate():
                raise Exception("Gmail authentication failed")
            
            # Start monitoring
            # self.monitor.start()  # Will be implemented separately
            
            # Set service as running
            self.is_running = True
            self.last_check = datetime.now()
            
            self.logger.info("Gmail Integration Service started successfully")
            
            # Start main processing loop
            await self._main_processing_loop()
            
        except Exception as e:
            self.logger.error("Failed to start Gmail service", error=str(e))
            self.is_running = False
            raise
    
    async def stop_service(self):
        """Stop the Gmail integration service"""
        self.logger.info("Stopping Gmail Integration Service")
        self.is_running = False
        
        # Stop monitoring
        # self.monitor.stop()  # Will be implemented separately
        
        # Close database session
        if hasattr(self.email_processor, 'db_session'):
            self.email_processor.db_session.close()
        
        self.logger.info("Gmail Integration Service stopped")
    
    async def _main_processing_loop(self):
        """Main processing loop for checking and processing emails"""
        while self.is_running:
            try:
                self.logger.debug("Starting email processing cycle")
                
                # Check for new emails
                await self._check_new_emails()
                
                # Process pending emails
                await self._process_pending_emails()
                
                # Process pending attachments
                await self._process_pending_attachments()
                
                # Update last check time
                self.last_check = datetime.now()
                
                # Wait before next cycle
                await asyncio.sleep(GMAIL_CONFIG["POLL_INTERVAL"])
                
            except Exception as e:
                self.error_count += 1
                self.logger.error("Error in main processing loop", error=str(e))
                
                # If too many errors, stop the service
                if self.error_count > 10:
                    self.logger.error("Too many errors, stopping service")
                    await self.stop_service()
                    break
                
                # Wait before retrying
                await asyncio.sleep(60)
    
    async def _check_new_emails(self):
        """Check for new medical referral emails"""
        try:
            self.logger.debug("Checking for new emails")
            
            # Build query for medical referral emails
            query = self.gmail_client.build_referral_query()
            
            # Add time filter to only get recent emails
            if self.last_check:
                # Gmail date format: YYYY/MM/DD
                after_date = (self.last_check - timedelta(hours=1)).strftime("%Y/%m/%d")
                query += f" after:{after_date}"
            
            # Fetch messages
            messages = self.gmail_client.get_messages(
                query=query,
                max_results=GMAIL_CONFIG["BATCH_SIZE"]
            )
            
            self.logger.info(f"Found {len(messages)} new messages")
            
            # Process each message
            for message in messages:
                await self._process_new_message(message)
            
        except Exception as e:
            self.logger.error("Error checking new emails", error=str(e))
            raise
    
    async def _process_new_message(self, message: Dict[str, Any]):
        """Process a single new Gmail message"""
        try:
            gmail_id = message['id']
            self.logger.debug("Processing new message", gmail_id=gmail_id)
            
            # Check if already processed
            existing_email = email_repo.get_email_by_gmail_id(gmail_id)
            if existing_email:
                self.logger.debug("Message already processed", gmail_id=gmail_id)
                return
            
            # Get detailed message information
            detailed_message = self.gmail_client.get_message_details(gmail_id)
            if not detailed_message:
                self.logger.error("Failed to get message details", gmail_id=gmail_id)
                return
            
            # Parse message
            parsed_message = self.gmail_client.parse_message(detailed_message)
            if not parsed_message:
                self.logger.error("Failed to parse message", gmail_id=gmail_id)
                return
            
            # Download attachments
            await self._download_attachments(parsed_message)
            
            # Create email record in database
            email_record = email_repo.create_email({
                'gmail_id': parsed_message['gmail_id'],
                'thread_id': parsed_message['thread_id'],
                'subject': parsed_message['subject'],
                'sender_email': parsed_message['sender_email'],
                'sender_name': parsed_message['sender_name'],
                'recipient_email': parsed_message['recipient_email'],
                'date_received': parsed_message['date_received'],
                'body_text': parsed_message['body_text'],
                'body_html': parsed_message['body_html'],
                'snippet': parsed_message['snippet'],
                'processing_status': 'pending'
            })
            
            if email_record:
                self.logger.info("New email record created", 
                               gmail_id=gmail_id, email_id=email_record.id)
                
                # Mark email as processed in Gmail
                self.gmail_client.add_label(gmail_id, "VITAL_RED_PROCESSED")
            
        except Exception as e:
            self.logger.error("Error processing new message", 
                            gmail_id=message.get('id', 'unknown'), error=str(e))
    
    async def _download_attachments(self, parsed_message: Dict[str, Any]):
        """Download and save email attachments"""
        try:
            gmail_id = parsed_message['gmail_id']
            attachments = parsed_message.get('attachments', [])
            
            if not attachments:
                return
            
            self.logger.debug(f"Downloading {len(attachments)} attachments", gmail_id=gmail_id)
            
            for attachment_info in attachments:
                await self._download_single_attachment(gmail_id, attachment_info)
                
        except Exception as e:
            self.logger.error("Error downloading attachments", error=str(e))
    
    async def _download_single_attachment(self, gmail_id: str, attachment_info: Dict[str, Any]):
        """Download a single attachment"""
        try:
            attachment_id = attachment_info['attachment_id']
            filename = attachment_info['filename']
            
            self.logger.debug("Downloading attachment", 
                            gmail_id=gmail_id, filename=filename)
            
            # Download attachment data
            attachment_data = self.gmail_client.get_attachment(gmail_id, attachment_id)
            if not attachment_data:
                self.logger.error("Failed to download attachment", 
                                gmail_id=gmail_id, filename=filename)
                return
            
            # Create safe filename
            safe_filename = self._sanitize_filename(filename)
            file_path = TEMP_DIR / f"{gmail_id}_{attachment_id}_{safe_filename}"
            
            # Save attachment to disk
            with open(file_path, 'wb') as f:
                f.write(attachment_data)
            
            # Update attachment info with file path
            attachment_info['local_file_path'] = str(file_path)
            
            self.logger.debug("Attachment downloaded successfully", 
                            gmail_id=gmail_id, filename=filename, path=str(file_path))
            
        except Exception as e:
            self.logger.error("Error downloading single attachment", 
                            gmail_id=gmail_id, filename=attachment_info.get('filename', 'unknown'), 
                            error=str(e))
    
    async def _process_pending_emails(self):
        """Process emails with pending status"""
        try:
            pending_emails = email_repo.get_pending_emails(limit=GMAIL_CONFIG["BATCH_SIZE"])
            
            if not pending_emails:
                return
            
            self.logger.info(f"Processing {len(pending_emails)} pending emails")
            
            for email in pending_emails:
                await self._process_single_email(email)
                
        except Exception as e:
            self.logger.error("Error processing pending emails", error=str(e))
    
    async def _process_single_email(self, email_record):
        """Process a single email record"""
        try:
            self.logger.debug("Processing email", email_id=email_record.id)
            
            # Update status to processing
            email_repo.update_email_status(email_record.id, "processing")
            
            # Get detailed message for processing
            detailed_message = self.gmail_client.get_message_details(email_record.gmail_id)
            if not detailed_message:
                email_repo.update_email_status(email_record.id, "error", 
                                             "Failed to get message details")
                return
            
            # Parse message
            parsed_message = self.gmail_client.parse_message(detailed_message)
            
            # Process with email processor
            processed_email = self.email_processor.process_email(parsed_message)
            
            if processed_email:
                self.processed_count += 1
                self.logger.info("Email processed successfully", 
                               email_id=email_record.id, gmail_id=email_record.gmail_id)
            else:
                email_repo.update_email_status(email_record.id, "error", 
                                             "Email processing failed")
                
        except Exception as e:
            self.logger.error("Error processing single email", 
                            email_id=email_record.id, error=str(e))
            email_repo.update_email_status(email_record.id, "error", str(e))
    
    async def _process_pending_attachments(self):
        """Process attachments with pending status"""
        try:
            pending_attachments = attachment_repo.get_pending_attachments(
                limit=GMAIL_CONFIG["BATCH_SIZE"]
            )
            
            if not pending_attachments:
                return
            
            self.logger.info(f"Processing {len(pending_attachments)} pending attachments")
            
            for attachment in pending_attachments:
                await self._process_single_attachment(attachment)
                
        except Exception as e:
            self.logger.error("Error processing pending attachments", error=str(e))
    
    async def _process_single_attachment(self, attachment_record):
        """Process a single attachment record"""
        try:
            self.logger.debug("Processing attachment", attachment_id=attachment_record.id)
            
            # This would involve text extraction, OCR, etc.
            # For now, we'll just mark as completed
            # The actual processing is handled by EmailProcessor
            
            # Update status
            with db_manager.get_session() as session:
                attachment = session.query(EmailAttachment).filter_by(
                    id=attachment_record.id
                ).first()
                if attachment:
                    attachment.processing_status = "completed"
            
        except Exception as e:
            self.logger.error("Error processing single attachment", 
                            attachment_id=attachment_record.id, error=str(e))
    
    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage"""
        import re
        # Remove or replace unsafe characters
        safe_chars = re.sub(r'[^\w\-_\.]', '_', filename)
        return safe_chars[:255]  # Limit length
    
    def get_service_status(self) -> Dict[str, Any]:
        """Get current service status"""
        return {
            'is_running': self.is_running,
            'last_check': self.last_check.isoformat() if self.last_check else None,
            'processed_count': self.processed_count,
            'error_count': self.error_count,
            'uptime': (datetime.now() - self.last_check).total_seconds() if self.last_check else 0,
            'database_health': db_manager.health_check()
        }
    
    async def manual_sync(self) -> Dict[str, Any]:
        """Manually trigger email synchronization"""
        try:
            self.logger.info("Manual sync triggered")
            
            # Reset last check to get more emails
            original_last_check = self.last_check
            self.last_check = datetime.now() - timedelta(days=1)
            
            # Check for new emails
            await self._check_new_emails()
            
            # Process pending emails
            await self._process_pending_emails()
            
            # Restore original last check
            self.last_check = original_last_check
            
            return {
                'status': 'success',
                'message': 'Manual sync completed',
                'processed_count': self.processed_count
            }
            
        except Exception as e:
            self.logger.error("Manual sync failed", error=str(e))
            return {
                'status': 'error',
                'message': str(e)
            }

# Global service instance
gmail_service = GmailIntegrationService()

async def main():
    """Main entry point for the service"""
    try:
        await gmail_service.start_service()
    except KeyboardInterrupt:
        logger.info("Service interrupted by user")
        await gmail_service.stop_service()
    except Exception as e:
        logger.error("Service failed", error=str(e))
        await gmail_service.stop_service()

if __name__ == "__main__":
    # Configure logging
    import logging
    logging.basicConfig(level=logging.INFO)
    
    # Run the service
    asyncio.run(main())
