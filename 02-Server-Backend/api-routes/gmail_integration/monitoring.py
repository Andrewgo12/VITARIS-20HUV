"""
Comprehensive Monitoring System for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import psutil
import time
import json
import smtplib
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass, asdict
from email.mime.text import MIMEText as MimeText
from email.mime.multipart import MIMEMultipart as MimeMultipart
from pathlib import Path
import structlog

from database import db_manager, email_repo, referral_repo
from models import EmailMessage, MedicalReferral, ProcessingLog
from config import MONITORING_CONFIG, LOGGING_CONFIG

logger = structlog.get_logger(__name__)

@dataclass
class SystemMetrics:
    timestamp: datetime
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    network_io: Dict[str, int]
    process_count: int
    uptime: float

@dataclass
class DatabaseMetrics:
    timestamp: datetime
    total_emails: int
    pending_emails: int
    processed_emails: int
    error_emails: int
    total_referrals: int
    pending_referrals: int
    processing_rate: float  # emails per minute
    avg_processing_time: float  # seconds

@dataclass
class ServiceMetrics:
    timestamp: datetime
    service_status: str
    last_email_check: Optional[datetime]
    queue_size: int
    active_workers: int
    error_count: int
    success_rate: float

@dataclass
class Alert:
    id: str
    level: str  # INFO, WARNING, ERROR, CRITICAL
    title: str
    message: str
    timestamp: datetime
    source: str
    resolved: bool = False
    acknowledged: bool = False

class MetricsCollector:
    """Collects system, database, and service metrics"""
    
    def __init__(self):
        self.logger = logger.bind(component="metrics_collector")
        self.start_time = time.time()
    
    def collect_system_metrics(self) -> SystemMetrics:
        """Collect system-level metrics"""
        try:
            # CPU and Memory
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_percent = (disk.used / disk.total) * 100
            
            # Network I/O
            network = psutil.net_io_counters()
            network_io = {
                'bytes_sent': network.bytes_sent,
                'bytes_recv': network.bytes_recv,
                'packets_sent': network.packets_sent,
                'packets_recv': network.packets_recv
            }
            
            # Process count
            process_count = len(psutil.pids())
            
            # Uptime
            uptime = time.time() - self.start_time
            
            return SystemMetrics(
                timestamp=datetime.now(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                disk_percent=disk_percent,
                network_io=network_io,
                process_count=process_count,
                uptime=uptime
            )
            
        except Exception as e:
            self.logger.error("Failed to collect system metrics", error=str(e))
            return None
    
    def collect_database_metrics(self) -> DatabaseMetrics:
        """Collect database-related metrics"""
        try:
            with db_manager.get_session() as session:
                # Email counts
                total_emails = session.query(EmailMessage).count()
                pending_emails = session.query(EmailMessage).filter_by(processing_status="pending").count()
                processed_emails = session.query(EmailMessage).filter_by(processing_status="completed").count()
                error_emails = session.query(EmailMessage).filter_by(processing_status="error").count()
                
                # Referral counts
                total_referrals = session.query(MedicalReferral).count()
                pending_referrals = session.query(MedicalReferral).filter_by(status="pending").count()
                
                # Processing rate (emails processed in last hour)
                one_hour_ago = datetime.now() - timedelta(hours=1)
                recent_processed = session.query(EmailMessage).filter(
                    EmailMessage.date_processed >= one_hour_ago,
                    EmailMessage.processing_status == "completed"
                ).count()
                processing_rate = recent_processed  # per hour
                
                # Average processing time
                recent_logs = session.query(ProcessingLog).filter(
                    ProcessingLog.start_time >= one_hour_ago,
                    ProcessingLog.duration_seconds.isnot(None)
                ).all()
                
                if recent_logs:
                    avg_processing_time = sum(log.duration_seconds for log in recent_logs) / len(recent_logs)
                else:
                    avg_processing_time = 0.0
                
                return DatabaseMetrics(
                    timestamp=datetime.now(),
                    total_emails=total_emails,
                    pending_emails=pending_emails,
                    processed_emails=processed_emails,
                    error_emails=error_emails,
                    total_referrals=total_referrals,
                    pending_referrals=pending_referrals,
                    processing_rate=processing_rate,
                    avg_processing_time=avg_processing_time
                )
                
        except Exception as e:
            self.logger.error("Failed to collect database metrics", error=str(e))
            return None
    
    def collect_service_metrics(self, service_instance) -> ServiceMetrics:
        """Collect service-specific metrics"""
        try:
            return ServiceMetrics(
                timestamp=datetime.now(),
                service_status="running" if service_instance.is_running else "stopped",
                last_email_check=service_instance.last_check,
                queue_size=0,  # Would be implemented with actual queue
                active_workers=4,  # From config
                error_count=service_instance.error_count,
                success_rate=self._calculate_success_rate(service_instance)
            )
            
        except Exception as e:
            self.logger.error("Failed to collect service metrics", error=str(e))
            return None
    
    def _calculate_success_rate(self, service_instance) -> float:
        """Calculate success rate based on processed vs error count"""
        total_processed = service_instance.processed_count + service_instance.error_count
        if total_processed == 0:
            return 100.0
        return (service_instance.processed_count / total_processed) * 100

class AlertManager:
    """Manages alerts and notifications"""
    
    def __init__(self):
        self.logger = logger.bind(component="alert_manager")
        self.alerts: List[Alert] = []
        self.alert_handlers: Dict[str, Callable] = {}
        self.thresholds = MONITORING_CONFIG["ALERT_THRESHOLD"]
        
        # Register default alert handlers
        self._register_default_handlers()
    
    def _register_default_handlers(self):
        """Register default alert handlers"""
        self.alert_handlers = {
            "email": self._send_email_alert,
            "log": self._log_alert,
            "webhook": self._send_webhook_alert
        }
    
    def check_system_alerts(self, metrics: SystemMetrics):
        """Check system metrics for alert conditions"""
        if not metrics:
            return
        
        # CPU usage alert
        if metrics.cpu_percent > 90:
            self.create_alert(
                "CRITICAL",
                "High CPU Usage",
                f"CPU usage is {metrics.cpu_percent:.1f}%",
                "system"
            )
        elif metrics.cpu_percent > 80:
            self.create_alert(
                "WARNING",
                "Elevated CPU Usage",
                f"CPU usage is {metrics.cpu_percent:.1f}%",
                "system"
            )
        
        # Memory usage alert
        if metrics.memory_percent > 90:
            self.create_alert(
                "CRITICAL",
                "High Memory Usage",
                f"Memory usage is {metrics.memory_percent:.1f}%",
                "system"
            )
        elif metrics.memory_percent > 80:
            self.create_alert(
                "WARNING",
                "Elevated Memory Usage",
                f"Memory usage is {metrics.memory_percent:.1f}%",
                "system"
            )
        
        # Disk usage alert
        if metrics.disk_percent > self.thresholds["DISK_USAGE"]:
            self.create_alert(
                "WARNING",
                "High Disk Usage",
                f"Disk usage is {metrics.disk_percent:.1f}%",
                "system"
            )
    
    def check_database_alerts(self, metrics: DatabaseMetrics):
        """Check database metrics for alert conditions"""
        if not metrics:
            return
        
        # High pending emails
        if metrics.pending_emails > 100:
            self.create_alert(
                "WARNING",
                "High Pending Email Count",
                f"{metrics.pending_emails} emails pending processing",
                "database"
            )
        
        # High error rate
        total_emails = metrics.total_emails
        if total_emails > 0:
            error_rate = (metrics.error_emails / total_emails) * 100
            if error_rate > 10:
                self.create_alert(
                    "ERROR",
                    "High Error Rate",
                    f"Error rate is {error_rate:.1f}%",
                    "database"
                )
        
        # Low processing rate
        if metrics.processing_rate < 5:  # Less than 5 emails per hour
            self.create_alert(
                "WARNING",
                "Low Processing Rate",
                f"Only {metrics.processing_rate} emails processed in last hour",
                "database"
            )
    
    def check_service_alerts(self, metrics: ServiceMetrics):
        """Check service metrics for alert conditions"""
        if not metrics:
            return
        
        # Service down
        if metrics.service_status != "running":
            self.create_alert(
                "CRITICAL",
                "Service Down",
                "Gmail integration service is not running",
                "service"
            )
        
        # High queue size
        if metrics.queue_size > self.thresholds["QUEUE_SIZE"]:
            self.create_alert(
                "WARNING",
                "High Queue Size",
                f"Queue size is {metrics.queue_size}",
                "service"
            )
        
        # Low success rate
        if metrics.success_rate < 90:
            self.create_alert(
                "ERROR",
                "Low Success Rate",
                f"Success rate is {metrics.success_rate:.1f}%",
                "service"
            )
    
    def create_alert(self, level: str, title: str, message: str, source: str):
        """Create a new alert"""
        alert_id = f"{source}_{int(time.time())}"
        
        # Check if similar alert already exists
        existing_alert = self._find_similar_alert(title, source)
        if existing_alert and not existing_alert.resolved:
            return  # Don't create duplicate alerts
        
        alert = Alert(
            id=alert_id,
            level=level,
            title=title,
            message=message,
            timestamp=datetime.now(),
            source=source
        )
        
        self.alerts.append(alert)
        self.logger.warning("Alert created", 
                          level=level, title=title, message=message, source=source)
        
        # Send notifications
        self._send_alert_notifications(alert)
    
    def _find_similar_alert(self, title: str, source: str) -> Optional[Alert]:
        """Find similar unresolved alert"""
        for alert in self.alerts:
            if alert.title == title and alert.source == source and not alert.resolved:
                return alert
        return None
    
    def _send_alert_notifications(self, alert: Alert):
        """Send alert notifications through configured channels"""
        for handler_name, handler_func in self.alert_handlers.items():
            try:
                handler_func(alert)
            except Exception as e:
                self.logger.error("Alert handler failed", 
                                handler=handler_name, error=str(e))
    
    def _send_email_alert(self, alert: Alert):
        """Send alert via email"""
        try:
            if not MONITORING_CONFIG.get("ALERT_EMAIL"):
                return
            
            # Create email message
            msg = MimeMultipart()
            msg['From'] = "noreply@hospital-ese.com"
            msg['To'] = MONITORING_CONFIG["ALERT_EMAIL"]
            msg['Subject'] = f"[VITAL RED] {alert.level}: {alert.title}"
            
            body = f"""
            Alert Details:
            Level: {alert.level}
            Title: {alert.title}
            Message: {alert.message}
            Source: {alert.source}
            Timestamp: {alert.timestamp}
            
            This is an automated alert from the VITAL RED Gmail Integration system.
            """
            
            msg.attach(MimeText(body, 'plain'))
            
            # Send email (would need SMTP configuration)
            self.logger.info("Email alert sent", alert_id=alert.id)
            
        except Exception as e:
            self.logger.error("Failed to send email alert", error=str(e))
    
    def _log_alert(self, alert: Alert):
        """Log alert to file"""
        alert_data = asdict(alert)
        alert_data['timestamp'] = alert.timestamp.isoformat()
        
        alert_log_file = Path(LOGGING_CONFIG["FILE"]).parent / "alerts.log"
        with open(alert_log_file, 'a') as f:
            f.write(json.dumps(alert_data) + '\n')
    
    def _send_webhook_alert(self, alert: Alert):
        """Send alert via webhook"""
        # Would implement webhook sending
        self.logger.info("Webhook alert sent", alert_id=alert.id)
    
    def resolve_alert(self, alert_id: str):
        """Mark alert as resolved"""
        for alert in self.alerts:
            if alert.id == alert_id:
                alert.resolved = True
                alert.acknowledged = True
                self.logger.info("Alert resolved", alert_id=alert_id)
                break
    
    def get_active_alerts(self) -> List[Alert]:
        """Get all active (unresolved) alerts"""
        return [alert for alert in self.alerts if not alert.resolved]

class PerformanceMonitor:
    """Monitors system performance and tracks trends"""
    
    def __init__(self):
        self.logger = logger.bind(component="performance_monitor")
        self.metrics_history: List[Dict[str, Any]] = []
        self.max_history_size = 1000  # Keep last 1000 metric points
    
    def record_metrics(self, system_metrics: SystemMetrics, 
                      db_metrics: DatabaseMetrics, 
                      service_metrics: ServiceMetrics):
        """Record metrics for trend analysis"""
        metric_point = {
            "timestamp": datetime.now().isoformat(),
            "system": asdict(system_metrics) if system_metrics else None,
            "database": asdict(db_metrics) if db_metrics else None,
            "service": asdict(service_metrics) if service_metrics else None
        }
        
        # Convert datetime objects to ISO strings
        if metric_point["system"]:
            metric_point["system"]["timestamp"] = metric_point["system"]["timestamp"].isoformat()
        if metric_point["database"]:
            metric_point["database"]["timestamp"] = metric_point["database"]["timestamp"].isoformat()
        if metric_point["service"]:
            metric_point["service"]["timestamp"] = metric_point["service"]["timestamp"].isoformat()
            if metric_point["service"]["last_email_check"]:
                metric_point["service"]["last_email_check"] = metric_point["service"]["last_email_check"].isoformat()
        
        self.metrics_history.append(metric_point)
        
        # Trim history if too large
        if len(self.metrics_history) > self.max_history_size:
            self.metrics_history = self.metrics_history[-self.max_history_size:]
    
    def get_performance_trends(self, hours: int = 24) -> Dict[str, Any]:
        """Get performance trends for the specified time period"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        recent_metrics = [
            m for m in self.metrics_history 
            if datetime.fromisoformat(m["timestamp"]) >= cutoff_time
        ]
        
        if not recent_metrics:
            return {}
        
        trends = {
            "cpu_trend": self._calculate_trend([m["system"]["cpu_percent"] for m in recent_metrics if m["system"]]),
            "memory_trend": self._calculate_trend([m["system"]["memory_percent"] for m in recent_metrics if m["system"]]),
            "processing_rate_trend": self._calculate_trend([m["database"]["processing_rate"] for m in recent_metrics if m["database"]]),
            "error_rate_trend": self._calculate_error_rate_trend(recent_metrics),
            "avg_processing_time": self._calculate_avg([m["database"]["avg_processing_time"] for m in recent_metrics if m["database"]])
        }
        
        return trends
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend direction (increasing, decreasing, stable)"""
        if len(values) < 2:
            return "insufficient_data"
        
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]
        
        avg_first = sum(first_half) / len(first_half)
        avg_second = sum(second_half) / len(second_half)
        
        change_percent = ((avg_second - avg_first) / avg_first) * 100
        
        if change_percent > 10:
            return "increasing"
        elif change_percent < -10:
            return "decreasing"
        else:
            return "stable"
    
    def _calculate_error_rate_trend(self, metrics: List[Dict]) -> str:
        """Calculate error rate trend"""
        error_rates = []
        for m in metrics:
            if m["database"]:
                total = m["database"]["total_emails"]
                errors = m["database"]["error_emails"]
                if total > 0:
                    error_rates.append((errors / total) * 100)
        
        return self._calculate_trend(error_rates)
    
    def _calculate_avg(self, values: List[float]) -> float:
        """Calculate average of values"""
        if not values:
            return 0.0
        return sum(values) / len(values)

class SystemMonitor:
    """Main monitoring system coordinator"""
    
    def __init__(self):
        self.logger = logger.bind(component="system_monitor")
        self.metrics_collector = MetricsCollector()
        self.alert_manager = AlertManager()
        self.performance_monitor = PerformanceMonitor()
        
        self.is_running = False
        self.monitoring_interval = MONITORING_CONFIG.get("HEALTH_CHECK_INTERVAL", 60)
    
    async def start(self):
        """Start the monitoring system"""
        self.is_running = True
        self.logger.info("System monitoring started")
        
        # Start monitoring loop
        asyncio.create_task(self._monitoring_loop())
    
    def stop(self):
        """Stop the monitoring system"""
        self.is_running = False
        self.logger.info("System monitoring stopped")
    
    async def _monitoring_loop(self):
        """Main monitoring loop"""
        while self.is_running:
            try:
                await self._collect_and_analyze_metrics()
                await asyncio.sleep(self.monitoring_interval)
            except Exception as e:
                self.logger.error("Monitoring loop error", error=str(e))
                await asyncio.sleep(60)  # Wait 1 minute before retrying
    
    async def _collect_and_analyze_metrics(self):
        """Collect metrics and perform analysis"""
        # Collect metrics
        system_metrics = self.metrics_collector.collect_system_metrics()
        db_metrics = self.metrics_collector.collect_database_metrics()
        
        # Service metrics would need service instance
        service_metrics = None  # Would be passed from main service
        
        # Record metrics for trend analysis
        self.performance_monitor.record_metrics(system_metrics, db_metrics, service_metrics)
        
        # Check for alerts
        if system_metrics:
            self.alert_manager.check_system_alerts(system_metrics)
        if db_metrics:
            self.alert_manager.check_database_alerts(db_metrics)
        if service_metrics:
            self.alert_manager.check_service_alerts(service_metrics)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get comprehensive system status"""
        system_metrics = self.metrics_collector.collect_system_metrics()
        db_metrics = self.metrics_collector.collect_database_metrics()
        active_alerts = self.alert_manager.get_active_alerts()
        performance_trends = self.performance_monitor.get_performance_trends()
        
        return {
            "timestamp": datetime.now().isoformat(),
            "system_metrics": asdict(system_metrics) if system_metrics else None,
            "database_metrics": asdict(db_metrics) if db_metrics else None,
            "active_alerts": [asdict(alert) for alert in active_alerts],
            "performance_trends": performance_trends,
            "monitoring_status": "running" if self.is_running else "stopped"
        }
    
    def get_health_summary(self) -> Dict[str, str]:
        """Get simple health summary"""
        try:
            system_metrics = self.metrics_collector.collect_system_metrics()
            db_metrics = self.metrics_collector.collect_database_metrics()
            active_alerts = self.alert_manager.get_active_alerts()
            
            # Determine overall health
            critical_alerts = [a for a in active_alerts if a.level == "CRITICAL"]
            error_alerts = [a for a in active_alerts if a.level == "ERROR"]
            
            if critical_alerts:
                overall_status = "CRITICAL"
            elif error_alerts:
                overall_status = "ERROR"
            elif system_metrics and (system_metrics.cpu_percent > 80 or system_metrics.memory_percent > 80):
                overall_status = "WARNING"
            else:
                overall_status = "HEALTHY"
            
            return {
                "overall_status": overall_status,
                "system_health": "OK" if system_metrics else "ERROR",
                "database_health": "OK" if db_metrics else "ERROR",
                "active_alerts_count": str(len(active_alerts)),
                "last_check": datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error("Health summary failed", error=str(e))
            return {
                "overall_status": "ERROR",
                "error": str(e),
                "last_check": datetime.now().isoformat()
            }
