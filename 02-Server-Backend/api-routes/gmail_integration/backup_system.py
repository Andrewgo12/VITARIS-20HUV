"""
Backup and Recovery System for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import os
import json
import gzip
import shutil
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, List, Optional
import structlog
import asyncio
from concurrent.futures import ThreadPoolExecutor

from database import db_manager
from models import EmailMessage, EmailAttachment, PatientRecord, MedicalReferral, ProcessingLog
from security import encryption_manager, audit_logger
from config import BACKUP_CONFIG, DATABASE_CONFIG

logger = structlog.get_logger(__name__)

class BackupManager:
    """
    Comprehensive backup and recovery system
    """
    
    def __init__(self):
        self.logger = logger.bind(component="backup_manager")
        self.backup_dir = Path(BACKUP_CONFIG["BACKUP_DIR"])
        self.retention_days = BACKUP_CONFIG["RETENTION_DAYS"]
        self.compression_enabled = BACKUP_CONFIG["COMPRESSION"]
        self.encryption_enabled = BACKUP_CONFIG["ENCRYPTION"]
        
        # Ensure backup directory exists
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
        # Thread pool for async operations
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    async def create_full_backup(self) -> Dict[str, Any]:
        """Create a complete system backup"""
        backup_id = f"full_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        backup_path = self.backup_dir / backup_id
        backup_path.mkdir(exist_ok=True)
        
        self.logger.info("Starting full backup", backup_id=backup_id)
        
        try:
            # Create backup manifest
            manifest = {
                "backup_id": backup_id,
                "backup_type": "full",
                "timestamp": datetime.now().isoformat(),
                "components": []
            }
            
            # Backup database
            db_backup_path = await self._backup_database(backup_path)
            if db_backup_path:
                manifest["components"].append({
                    "type": "database",
                    "path": str(db_backup_path.relative_to(backup_path)),
                    "size": db_backup_path.stat().st_size
                })
            
            # Backup attachments
            attachments_backup_path = await self._backup_attachments(backup_path)
            if attachments_backup_path:
                manifest["components"].append({
                    "type": "attachments",
                    "path": str(attachments_backup_path.relative_to(backup_path)),
                    "size": self._get_directory_size(attachments_backup_path)
                })
            
            # Backup configuration
            config_backup_path = await self._backup_configuration(backup_path)
            if config_backup_path:
                manifest["components"].append({
                    "type": "configuration",
                    "path": str(config_backup_path.relative_to(backup_path)),
                    "size": self._get_directory_size(config_backup_path)
                })
            
            # Backup logs
            logs_backup_path = await self._backup_logs(backup_path)
            if logs_backup_path:
                manifest["components"].append({
                    "type": "logs",
                    "path": str(logs_backup_path.relative_to(backup_path)),
                    "size": self._get_directory_size(logs_backup_path)
                })
            
            # Save manifest
            manifest_path = backup_path / "manifest.json"
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            # Compress backup if enabled
            if self.compression_enabled:
                compressed_path = await self._compress_backup(backup_path)
                if compressed_path:
                    # Remove uncompressed backup
                    shutil.rmtree(backup_path)
                    backup_path = compressed_path
            
            # Encrypt backup if enabled
            if self.encryption_enabled:
                encrypted_path = await self._encrypt_backup(backup_path)
                if encrypted_path:
                    # Remove unencrypted backup
                    if backup_path.is_file():
                        backup_path.unlink()
                    else:
                        shutil.rmtree(backup_path)
                    backup_path = encrypted_path
            
            # Calculate final backup size
            backup_size = backup_path.stat().st_size if backup_path.is_file() else self._get_directory_size(backup_path)
            
            # Log backup completion
            audit_logger.log_system_event(
                "backup_completed",
                f"Full backup completed: {backup_id}",
                "INFO"
            )
            
            self.logger.info("Full backup completed", 
                           backup_id=backup_id, 
                           backup_size=backup_size,
                           backup_path=str(backup_path))
            
            return {
                "backup_id": backup_id,
                "backup_path": str(backup_path),
                "backup_size": backup_size,
                "manifest": manifest,
                "status": "completed"
            }
            
        except Exception as e:
            self.logger.error("Full backup failed", backup_id=backup_id, error=str(e))
            audit_logger.log_system_event(
                "backup_failed",
                f"Full backup failed: {backup_id} - {str(e)}",
                "ERROR"
            )
            
            # Cleanup failed backup
            if backup_path.exists():
                if backup_path.is_file():
                    backup_path.unlink()
                else:
                    shutil.rmtree(backup_path)
            
            return {
                "backup_id": backup_id,
                "status": "failed",
                "error": str(e)
            }
    
    async def create_incremental_backup(self, last_backup_date: datetime) -> Dict[str, Any]:
        """Create an incremental backup since last backup date"""
        backup_id = f"incremental_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        backup_path = self.backup_dir / backup_id
        backup_path.mkdir(exist_ok=True)
        
        self.logger.info("Starting incremental backup", 
                        backup_id=backup_id, 
                        since=last_backup_date.isoformat())
        
        try:
            # Create backup manifest
            manifest = {
                "backup_id": backup_id,
                "backup_type": "incremental",
                "timestamp": datetime.now().isoformat(),
                "since": last_backup_date.isoformat(),
                "components": []
            }
            
            # Backup changed data
            changed_data = await self._backup_changed_data(backup_path, last_backup_date)
            if changed_data:
                manifest["components"].append({
                    "type": "changed_data",
                    "path": "changed_data.json",
                    "size": (backup_path / "changed_data.json").stat().st_size,
                    "records_count": len(changed_data)
                })
            
            # Backup new attachments
            new_attachments = await self._backup_new_attachments(backup_path, last_backup_date)
            if new_attachments:
                manifest["components"].append({
                    "type": "new_attachments",
                    "path": "new_attachments",
                    "size": self._get_directory_size(backup_path / "new_attachments"),
                    "files_count": len(new_attachments)
                })
            
            # Save manifest
            manifest_path = backup_path / "manifest.json"
            with open(manifest_path, 'w') as f:
                json.dump(manifest, f, indent=2)
            
            # Compress and encrypt if enabled
            if self.compression_enabled:
                backup_path = await self._compress_backup(backup_path) or backup_path
            
            if self.encryption_enabled:
                backup_path = await self._encrypt_backup(backup_path) or backup_path
            
            backup_size = backup_path.stat().st_size if backup_path.is_file() else self._get_directory_size(backup_path)
            
            self.logger.info("Incremental backup completed", 
                           backup_id=backup_id, 
                           backup_size=backup_size)
            
            return {
                "backup_id": backup_id,
                "backup_path": str(backup_path),
                "backup_size": backup_size,
                "manifest": manifest,
                "status": "completed"
            }
            
        except Exception as e:
            self.logger.error("Incremental backup failed", backup_id=backup_id, error=str(e))
            return {
                "backup_id": backup_id,
                "status": "failed",
                "error": str(e)
            }
    
    async def _backup_database(self, backup_path: Path) -> Optional[Path]:
        """Backup PostgreSQL database"""
        try:
            db_backup_file = backup_path / "database.sql"
            
            # Use pg_dump to create database backup
            cmd = [
                "pg_dump",
                "-h", DATABASE_CONFIG["HOST"],
                "-p", str(DATABASE_CONFIG["PORT"]),
                "-U", DATABASE_CONFIG["USER"],
                "-d", DATABASE_CONFIG["NAME"],
                "-f", str(db_backup_file),
                "--verbose",
                "--no-password"
            ]
            
            # Set password via environment variable
            env = os.environ.copy()
            env["PGPASSWORD"] = DATABASE_CONFIG["PASSWORD"]
            
            # Run pg_dump in thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor,
                lambda: subprocess.run(cmd, env=env, capture_output=True, text=True)
            )
            
            if result.returncode == 0:
                self.logger.info("Database backup completed", file=str(db_backup_file))
                return db_backup_file
            else:
                self.logger.error("Database backup failed", error=result.stderr)
                return None
                
        except Exception as e:
            self.logger.error("Database backup error", error=str(e))
            return None
    
    async def _backup_attachments(self, backup_path: Path) -> Optional[Path]:
        """Backup email attachments"""
        try:
            attachments_dir = Path("processed")  # From config
            if not attachments_dir.exists():
                return None
            
            backup_attachments_dir = backup_path / "attachments"
            
            # Copy attachments directory
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                self.executor,
                lambda: shutil.copytree(attachments_dir, backup_attachments_dir)
            )
            
            self.logger.info("Attachments backup completed", 
                           source=str(attachments_dir),
                           destination=str(backup_attachments_dir))
            
            return backup_attachments_dir
            
        except Exception as e:
            self.logger.error("Attachments backup error", error=str(e))
            return None
    
    async def _backup_configuration(self, backup_path: Path) -> Optional[Path]:
        """Backup configuration files"""
        try:
            config_backup_dir = backup_path / "configuration"
            config_backup_dir.mkdir(exist_ok=True)
            
            # Files to backup
            config_files = [
                ".env",
                "config.py",
                "credentials/credentials.json",
                "credentials/token.json"
            ]
            
            for config_file in config_files:
                source_path = Path(config_file)
                if source_path.exists():
                    dest_path = config_backup_dir / source_path.name
                    shutil.copy2(source_path, dest_path)
            
            self.logger.info("Configuration backup completed")
            return config_backup_dir
            
        except Exception as e:
            self.logger.error("Configuration backup error", error=str(e))
            return None
    
    async def _backup_logs(self, backup_path: Path) -> Optional[Path]:
        """Backup log files"""
        try:
            logs_dir = Path("logs")
            if not logs_dir.exists():
                return None
            
            backup_logs_dir = backup_path / "logs"
            
            # Copy logs directory
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                self.executor,
                lambda: shutil.copytree(logs_dir, backup_logs_dir)
            )
            
            self.logger.info("Logs backup completed")
            return backup_logs_dir
            
        except Exception as e:
            self.logger.error("Logs backup error", error=str(e))
            return None
    
    async def _backup_changed_data(self, backup_path: Path, since_date: datetime) -> Optional[List[Dict]]:
        """Backup data changed since specified date"""
        try:
            changed_data = []
            
            with db_manager.get_session() as session:
                # Get changed emails
                changed_emails = session.query(EmailMessage).filter(
                    EmailMessage.date_processed >= since_date
                ).all()
                
                for email in changed_emails:
                    changed_data.append({
                        "type": "email",
                        "id": email.id,
                        "data": {
                            "gmail_id": email.gmail_id,
                            "subject": email.subject,
                            "sender_email": email.sender_email,
                            "date_received": email.date_received.isoformat(),
                            "processing_status": email.processing_status,
                            "is_medical_referral": email.is_medical_referral
                        }
                    })
                
                # Get changed referrals
                changed_referrals = session.query(MedicalReferral).filter(
                    MedicalReferral.updated_at >= since_date
                ).all()
                
                for referral in changed_referrals:
                    changed_data.append({
                        "type": "referral",
                        "id": referral.id,
                        "data": {
                            "referral_number": referral.referral_number,
                            "status": referral.status,
                            "specialty_requested": referral.specialty_requested,
                            "priority_level": referral.priority_level,
                            "referral_date": referral.referral_date.isoformat()
                        }
                    })
            
            # Save changed data
            if changed_data:
                changed_data_file = backup_path / "changed_data.json"
                with open(changed_data_file, 'w') as f:
                    json.dump(changed_data, f, indent=2)
                
                return changed_data
            
            return None
            
        except Exception as e:
            self.logger.error("Changed data backup error", error=str(e))
            return None
    
    async def _backup_new_attachments(self, backup_path: Path, since_date: datetime) -> Optional[List[str]]:
        """Backup attachments created since specified date"""
        try:
            new_attachments = []
            
            with db_manager.get_session() as session:
                new_attachment_records = session.query(EmailAttachment).filter(
                    EmailAttachment.created_at >= since_date
                ).all()
                
                if not new_attachment_records:
                    return None
                
                new_attachments_dir = backup_path / "new_attachments"
                new_attachments_dir.mkdir(exist_ok=True)
                
                for attachment in new_attachment_records:
                    if attachment.file_path and Path(attachment.file_path).exists():
                        source_file = Path(attachment.file_path)
                        dest_file = new_attachments_dir / f"{attachment.id}_{source_file.name}"
                        shutil.copy2(source_file, dest_file)
                        new_attachments.append(str(dest_file))
            
            return new_attachments if new_attachments else None
            
        except Exception as e:
            self.logger.error("New attachments backup error", error=str(e))
            return None
    
    async def _compress_backup(self, backup_path: Path) -> Optional[Path]:
        """Compress backup using gzip"""
        try:
            compressed_path = backup_path.with_suffix('.tar.gz')
            
            # Create tar.gz archive
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                self.executor,
                lambda: shutil.make_archive(
                    str(backup_path),
                    'gztar',
                    str(backup_path.parent),
                    str(backup_path.name)
                )
            )
            
            self.logger.info("Backup compressed", 
                           original=str(backup_path),
                           compressed=str(compressed_path))
            
            return compressed_path
            
        except Exception as e:
            self.logger.error("Backup compression error", error=str(e))
            return None
    
    async def _encrypt_backup(self, backup_path: Path) -> Optional[Path]:
        """Encrypt backup file"""
        try:
            if backup_path.is_file():
                encrypted_path = encryption_manager.encrypt_file(backup_path)
                return encrypted_path
            else:
                # For directories, create archive first then encrypt
                archive_path = backup_path.with_suffix('.tar')
                shutil.make_archive(str(backup_path), 'tar', str(backup_path.parent), str(backup_path.name))
                encrypted_path = encryption_manager.encrypt_file(archive_path)
                return encrypted_path
                
        except Exception as e:
            self.logger.error("Backup encryption error", error=str(e))
            return None
    
    def _get_directory_size(self, directory: Path) -> int:
        """Calculate total size of directory"""
        total_size = 0
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                filepath = Path(dirpath) / filename
                total_size += filepath.stat().st_size
        return total_size
    
    async def cleanup_old_backups(self):
        """Remove backups older than retention period"""
        try:
            cutoff_date = datetime.now() - timedelta(days=self.retention_days)
            
            for backup_item in self.backup_dir.iterdir():
                if backup_item.stat().st_mtime < cutoff_date.timestamp():
                    if backup_item.is_file():
                        backup_item.unlink()
                    else:
                        shutil.rmtree(backup_item)
                    
                    self.logger.info("Old backup removed", backup=str(backup_item))
            
        except Exception as e:
            self.logger.error("Backup cleanup error", error=str(e))
    
    def list_backups(self) -> List[Dict[str, Any]]:
        """List all available backups"""
        backups = []
        
        try:
            for backup_item in self.backup_dir.iterdir():
                backup_info = {
                    "name": backup_item.name,
                    "path": str(backup_item),
                    "size": backup_item.stat().st_size if backup_item.is_file() else self._get_directory_size(backup_item),
                    "created": datetime.fromtimestamp(backup_item.stat().st_ctime).isoformat(),
                    "type": "file" if backup_item.is_file() else "directory"
                }
                
                # Try to read manifest if available
                manifest_path = backup_item / "manifest.json" if backup_item.is_dir() else None
                if manifest_path and manifest_path.exists():
                    with open(manifest_path, 'r') as f:
                        manifest = json.load(f)
                        backup_info["manifest"] = manifest
                
                backups.append(backup_info)
            
            # Sort by creation date (newest first)
            backups.sort(key=lambda x: x["created"], reverse=True)
            
        except Exception as e:
            self.logger.error("Error listing backups", error=str(e))
        
        return backups

class RecoveryManager:
    """
    System recovery from backups
    """
    
    def __init__(self):
        self.logger = logger.bind(component="recovery_manager")
        self.backup_manager = BackupManager()
    
    async def restore_from_backup(self, backup_path: str, components: List[str] = None) -> Dict[str, Any]:
        """Restore system from backup"""
        backup_path = Path(backup_path)
        
        if not backup_path.exists():
            return {"status": "failed", "error": "Backup not found"}
        
        self.logger.info("Starting system restore", backup_path=str(backup_path))
        
        try:
            # Decrypt backup if needed
            if backup_path.suffix == '.enc':
                backup_path = encryption_manager.decrypt_file(backup_path)
            
            # Decompress backup if needed
            if backup_path.suffix in ['.gz', '.tar.gz']:
                # Extract archive
                extract_dir = backup_path.parent / f"restore_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                shutil.unpack_archive(str(backup_path), str(extract_dir))
                backup_path = extract_dir
            
            # Read manifest
            manifest_path = backup_path / "manifest.json"
            if manifest_path.exists():
                with open(manifest_path, 'r') as f:
                    manifest = json.load(f)
            else:
                manifest = None
            
            # Restore components
            restore_results = {}
            
            if not components or "database" in components:
                restore_results["database"] = await self._restore_database(backup_path)
            
            if not components or "attachments" in components:
                restore_results["attachments"] = await self._restore_attachments(backup_path)
            
            if not components or "configuration" in components:
                restore_results["configuration"] = await self._restore_configuration(backup_path)
            
            # Log restore completion
            audit_logger.log_system_event(
                "restore_completed",
                f"System restore completed from {backup_path}",
                "INFO"
            )
            
            return {
                "status": "completed",
                "backup_path": str(backup_path),
                "manifest": manifest,
                "restore_results": restore_results
            }
            
        except Exception as e:
            self.logger.error("System restore failed", error=str(e))
            audit_logger.log_system_event(
                "restore_failed",
                f"System restore failed: {str(e)}",
                "ERROR"
            )
            
            return {
                "status": "failed",
                "error": str(e)
            }
    
    async def _restore_database(self, backup_path: Path) -> Dict[str, Any]:
        """Restore database from backup"""
        try:
            db_backup_file = backup_path / "database.sql"
            
            if not db_backup_file.exists():
                return {"status": "skipped", "reason": "Database backup not found"}
            
            # Use psql to restore database
            cmd = [
                "psql",
                "-h", DATABASE_CONFIG["HOST"],
                "-p", str(DATABASE_CONFIG["PORT"]),
                "-U", DATABASE_CONFIG["USER"],
                "-d", DATABASE_CONFIG["NAME"],
                "-f", str(db_backup_file)
            ]
            
            env = os.environ.copy()
            env["PGPASSWORD"] = DATABASE_CONFIG["PASSWORD"]
            
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: subprocess.run(cmd, env=env, capture_output=True, text=True)
            )
            
            if result.returncode == 0:
                return {"status": "completed"}
            else:
                return {"status": "failed", "error": result.stderr}
                
        except Exception as e:
            return {"status": "failed", "error": str(e)}
    
    async def _restore_attachments(self, backup_path: Path) -> Dict[str, Any]:
        """Restore attachments from backup"""
        try:
            backup_attachments_dir = backup_path / "attachments"
            
            if not backup_attachments_dir.exists():
                return {"status": "skipped", "reason": "Attachments backup not found"}
            
            restore_dir = Path("processed")  # From config
            
            # Remove existing attachments
            if restore_dir.exists():
                shutil.rmtree(restore_dir)
            
            # Copy backup attachments
            shutil.copytree(backup_attachments_dir, restore_dir)
            
            return {"status": "completed"}
            
        except Exception as e:
            return {"status": "failed", "error": str(e)}
    
    async def _restore_configuration(self, backup_path: Path) -> Dict[str, Any]:
        """Restore configuration from backup"""
        try:
            config_backup_dir = backup_path / "configuration"
            
            if not config_backup_dir.exists():
                return {"status": "skipped", "reason": "Configuration backup not found"}
            
            # Restore configuration files
            for config_file in config_backup_dir.iterdir():
                if config_file.is_file():
                    dest_path = Path(config_file.name)
                    
                    # Special handling for credentials
                    if config_file.name in ["credentials.json", "token.json"]:
                        dest_path = Path("credentials") / config_file.name
                        dest_path.parent.mkdir(exist_ok=True)
                    
                    shutil.copy2(config_file, dest_path)
            
            return {"status": "completed"}
            
        except Exception as e:
            return {"status": "failed", "error": str(e)}

# Global instances
backup_manager = BackupManager()
recovery_manager = RecoveryManager()
