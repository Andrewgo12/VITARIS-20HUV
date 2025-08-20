"""
Performance Optimization and Caching System for VITAL RED Gmail Integration
Hospital Universitaria ESE - Departamento de Innovación y Desarrollo
"""

import asyncio
import time
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Callable, Union
from functools import wraps, lru_cache
from dataclasses import dataclass
import structlog
import redis
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import multiprocessing as mp

from database import db_manager, cache_manager
from models import EmailMessage, EmailAttachment, MedicalReferral
from config import PERFORMANCE_CONFIG, REDIS_CONFIG

logger = structlog.get_logger(__name__)

@dataclass
class PerformanceMetrics:
    operation: str
    start_time: float
    end_time: float
    duration: float
    memory_usage: int
    cpu_usage: float
    cache_hit: bool = False

class PerformanceMonitor:
    """
    Performance monitoring and metrics collection
    """
    
    def __init__(self):
        self.logger = logger.bind(component="performance_monitor")
        self.metrics: List[PerformanceMetrics] = []
        self.operation_stats: Dict[str, Dict[str, float]] = {}
    
    def record_metric(self, metric: PerformanceMetrics):
        """Record a performance metric"""
        self.metrics.append(metric)
        
        # Update operation statistics
        if metric.operation not in self.operation_stats:
            self.operation_stats[metric.operation] = {
                'total_calls': 0,
                'total_duration': 0,
                'avg_duration': 0,
                'min_duration': float('inf'),
                'max_duration': 0,
                'cache_hit_rate': 0
            }
        
        stats = self.operation_stats[metric.operation]
        stats['total_calls'] += 1
        stats['total_duration'] += metric.duration
        stats['avg_duration'] = stats['total_duration'] / stats['total_calls']
        stats['min_duration'] = min(stats['min_duration'], metric.duration)
        stats['max_duration'] = max(stats['max_duration'], metric.duration)
        
        # Calculate cache hit rate
        cache_hits = sum(1 for m in self.metrics 
                        if m.operation == metric.operation and m.cache_hit)
        stats['cache_hit_rate'] = (cache_hits / stats['total_calls']) * 100
    
    def get_performance_report(self) -> Dict[str, Any]:
        """Generate performance report"""
        return {
            'timestamp': datetime.now().isoformat(),
            'total_operations': len(self.metrics),
            'operation_stats': self.operation_stats,
            'recent_metrics': [
                {
                    'operation': m.operation,
                    'duration': m.duration,
                    'cache_hit': m.cache_hit,
                    'timestamp': m.end_time
                }
                for m in self.metrics[-50:]  # Last 50 operations
            ]
        }

class CacheManager:
    """
    Advanced caching system with Redis backend
    """
    
    def __init__(self):
        self.logger = logger.bind(component="cache_manager")
        self.redis_client = self._initialize_redis()
        self.local_cache = {}
        self.cache_stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0
        }
    
    def _initialize_redis(self) -> Optional[redis.Redis]:
        """Initialize Redis connection"""
        try:
            client = redis.Redis(
                host=REDIS_CONFIG["HOST"],
                port=REDIS_CONFIG["PORT"],
                db=REDIS_CONFIG["DB"],
                password=REDIS_CONFIG["PASSWORD"],
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            client.ping()
            self.logger.info("Redis cache initialized successfully")
            return client
        except Exception as e:
            self.logger.warning("Redis not available, using local cache only", error=str(e))
            return None
    
    def _generate_cache_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_data = f"{prefix}:{':'.join(map(str, args))}"
        if kwargs:
            key_data += f":{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"
        
        # Hash long keys
        if len(key_data) > 200:
            key_data = f"{prefix}:{hashlib.md5(key_data.encode()).hexdigest()}"
        
        return key_data
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            # Try Redis first
            if self.redis_client:
                value = self.redis_client.get(key)
                if value is not None:
                    self.cache_stats['hits'] += 1
                    return json.loads(value)
            
            # Fallback to local cache
            if key in self.local_cache:
                entry = self.local_cache[key]
                if entry['expires'] > time.time():
                    self.cache_stats['hits'] += 1
                    return entry['value']
                else:
                    del self.local_cache[key]
            
            self.cache_stats['misses'] += 1
            return None
            
        except Exception as e:
            self.logger.error("Cache get error", key=key, error=str(e))
            self.cache_stats['misses'] += 1
            return None
    
    def set(self, key: str, value: Any, expire: int = 3600):
        """Set value in cache"""
        try:
            serialized_value = json.dumps(value, default=str)
            
            # Set in Redis
            if self.redis_client:
                self.redis_client.setex(key, expire, serialized_value)
            
            # Set in local cache
            self.local_cache[key] = {
                'value': value,
                'expires': time.time() + expire
            }
            
            self.cache_stats['sets'] += 1
            
        except Exception as e:
            self.logger.error("Cache set error", key=key, error=str(e))
    
    def delete(self, key: str):
        """Delete key from cache"""
        try:
            if self.redis_client:
                self.redis_client.delete(key)
            
            if key in self.local_cache:
                del self.local_cache[key]
            
            self.cache_stats['deletes'] += 1
            
        except Exception as e:
            self.logger.error("Cache delete error", key=key, error=str(e))
    
    def clear_pattern(self, pattern: str):
        """Clear all keys matching pattern"""
        try:
            if self.redis_client:
                keys = self.redis_client.keys(pattern)
                if keys:
                    self.redis_client.delete(*keys)
            
            # Clear from local cache
            keys_to_delete = [k for k in self.local_cache.keys() if pattern in k]
            for key in keys_to_delete:
                del self.local_cache[key]
                
        except Exception as e:
            self.logger.error("Cache clear pattern error", pattern=pattern, error=str(e))
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.cache_stats['hits'] + self.cache_stats['misses']
        hit_rate = (self.cache_stats['hits'] / total_requests * 100) if total_requests > 0 else 0
        
        return {
            **self.cache_stats,
            'hit_rate': hit_rate,
            'local_cache_size': len(self.local_cache),
            'redis_available': self.redis_client is not None
        }

class QueryOptimizer:
    """
    Database query optimization
    """
    
    def __init__(self):
        self.logger = logger.bind(component="query_optimizer")
        self.query_cache = CacheManager()
    
    def cached_query(self, cache_key: str = "default", expire: int = 3600):
        """Decorator for caching database queries"""
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Generate cache key
                full_key = self.query_cache._generate_cache_key(cache_key, *args, **kwargs)
                
                # Try to get from cache
                cached_result = self.query_cache.get(full_key)
                if cached_result is not None:
                    return cached_result
                
                # Execute query
                result = func(*args, **kwargs)
                
                # Cache result
                if result is not None:
                    self.query_cache.set(full_key, result, expire)
                
                return result
            return wrapper
        return decorator
    
    @cached_query("email_count", expire=300)  # 5 minutes
    def get_email_count_by_status(self, status: str) -> int:
        """Get cached email count by status"""
        with db_manager.get_session() as session:
            return session.query(EmailMessage).filter_by(processing_status=status).count()
    
    @cached_query("referral_count", expire=300)
    def get_referral_count_by_specialty(self, specialty: str) -> int:
        """Get cached referral count by specialty"""
        with db_manager.get_session() as session:
            return session.query(MedicalReferral).filter_by(specialty_requested=specialty).count()
    
    @cached_query("recent_emails", expire=60)  # 1 minute
    def get_recent_medical_emails(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get cached recent medical emails"""
        with db_manager.get_session() as session:
            emails = session.query(EmailMessage).filter_by(
                is_medical_referral=True
            ).order_by(EmailMessage.date_received.desc()).limit(limit).all()
            
            return [
                {
                    'id': email.id,
                    'subject': email.subject,
                    'sender_email': email.sender_email,
                    'date_received': email.date_received.isoformat(),
                    'priority_level': email.priority_level
                }
                for email in emails
            ]

class ProcessingOptimizer:
    """
    Email processing optimization with parallel processing
    """
    
    def __init__(self):
        self.logger = logger.bind(component="processing_optimizer")
        self.thread_pool = ThreadPoolExecutor(max_workers=PERFORMANCE_CONFIG["MAX_WORKERS"])
        self.process_pool = ProcessPoolExecutor(max_workers=min(4, mp.cpu_count()))
        self.processing_queue = asyncio.Queue(maxsize=PERFORMANCE_CONFIG["QUEUE_SIZE"])
        self.performance_monitor = PerformanceMonitor()
    
    async def process_emails_batch(self, emails: List[Dict[str, Any]]) -> List[Any]:
        """Process multiple emails in parallel"""
        start_time = time.time()
        
        try:
            # Split emails into batches for parallel processing
            batch_size = PERFORMANCE_CONFIG["BATCH_SIZE"]
            batches = [emails[i:i + batch_size] for i in range(0, len(emails), batch_size)]
            
            # Process batches concurrently
            tasks = []
            for batch in batches:
                task = asyncio.create_task(self._process_email_batch(batch))
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Flatten results
            processed_emails = []
            for result in results:
                if isinstance(result, list):
                    processed_emails.extend(result)
                elif isinstance(result, Exception):
                    self.logger.error("Batch processing error", error=str(result))
            
            # Record performance metric
            duration = time.time() - start_time
            metric = PerformanceMetrics(
                operation="batch_email_processing",
                start_time=start_time,
                end_time=time.time(),
                duration=duration,
                memory_usage=0,  # Would implement actual memory monitoring
                cpu_usage=0     # Would implement actual CPU monitoring
            )
            self.performance_monitor.record_metric(metric)
            
            self.logger.info("Batch processing completed", 
                           total_emails=len(emails),
                           processed=len(processed_emails),
                           duration=duration)
            
            return processed_emails
            
        except Exception as e:
            self.logger.error("Batch processing failed", error=str(e))
            return []
    
    async def _process_email_batch(self, email_batch: List[Dict[str, Any]]) -> List[Any]:
        """Process a single batch of emails"""
        from email_processor import EmailProcessor
        
        results = []
        
        # Create processor instance for this batch
        with db_manager.get_session() as session:
            processor = EmailProcessor(session, Path("temp"))
            
            for email_data in email_batch:
                try:
                    result = processor.process_email(email_data)
                    if result:
                        results.append(result)
                except Exception as e:
                    self.logger.error("Email processing error", 
                                    email_id=email_data.get('gmail_id'), 
                                    error=str(e))
        
        return results
    
    async def optimize_text_extraction(self, file_path: str) -> Optional[str]:
        """Optimize text extraction using parallel processing"""
        start_time = time.time()
        
        try:
            # Use process pool for CPU-intensive text extraction
            loop = asyncio.get_event_loop()
            
            # Run text extraction in separate process
            result = await loop.run_in_executor(
                self.process_pool,
                self._extract_text_worker,
                file_path
            )
            
            duration = time.time() - start_time
            
            # Record performance metric
            metric = PerformanceMetrics(
                operation="text_extraction",
                start_time=start_time,
                end_time=time.time(),
                duration=duration,
                memory_usage=0,
                cpu_usage=0
            )
            self.performance_monitor.record_metric(metric)
            
            return result
            
        except Exception as e:
            self.logger.error("Text extraction optimization failed", 
                            file_path=file_path, error=str(e))
            return None
    
    def _extract_text_worker(self, file_path: str) -> Optional[str]:
        """Worker function for text extraction"""
        from text_extractor import TextExtractor
        
        try:
            extractor = TextExtractor()
            return extractor.extract_text(file_path)
        except Exception as e:
            logger.error("Text extraction worker error", file_path=file_path, error=str(e))
            return None

class MemoryOptimizer:
    """
    Memory usage optimization
    """
    
    def __init__(self):
        self.logger = logger.bind(component="memory_optimizer")
        self._cleanup_interval = 300  # 5 minutes
        self._last_cleanup = time.time()
    
    def optimize_memory_usage(self):
        """Optimize memory usage"""
        current_time = time.time()
        
        if current_time - self._last_cleanup > self._cleanup_interval:
            self._cleanup_memory()
            self._last_cleanup = current_time
    
    def _cleanup_memory(self):
        """Cleanup memory"""
        try:
            import gc
            
            # Force garbage collection
            collected = gc.collect()
            
            # Clear local caches
            self._clear_local_caches()
            
            self.logger.info("Memory cleanup completed", objects_collected=collected)
            
        except Exception as e:
            self.logger.error("Memory cleanup error", error=str(e))
    
    def _clear_local_caches(self):
        """Clear local caches"""
        # Clear function caches
        for obj in gc.get_objects():
            if hasattr(obj, 'cache_clear') and callable(obj.cache_clear):
                try:
                    obj.cache_clear()
                except:
                    pass

class ConnectionPoolManager:
    """
    Database connection pool optimization
    """
    
    def __init__(self):
        self.logger = logger.bind(component="connection_pool")
        self.pool_stats = {
            'active_connections': 0,
            'total_connections': 0,
            'connection_errors': 0
        }
    
    def optimize_connection_pool(self):
        """Optimize database connection pool"""
        try:
            # Monitor connection pool health
            engine = db_manager.engine
            pool = engine.pool
            
            self.pool_stats.update({
                'active_connections': pool.checkedout(),
                'total_connections': pool.size(),
                'connection_errors': 0  # Would implement actual error tracking
            })
            
            # Log pool statistics
            if self.pool_stats['active_connections'] > pool.size() * 0.8:
                self.logger.warning("High connection pool usage", stats=self.pool_stats)
            
        except Exception as e:
            self.logger.error("Connection pool optimization error", error=str(e))
            self.pool_stats['connection_errors'] += 1

# Performance decorators
def performance_monitor(operation_name: str):
    """Decorator to monitor function performance"""
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = await func(*args, **kwargs)
                
                # Record successful operation
                duration = time.time() - start_time
                metric = PerformanceMetrics(
                    operation=operation_name,
                    start_time=start_time,
                    end_time=time.time(),
                    duration=duration,
                    memory_usage=0,
                    cpu_usage=0
                )
                
                # Would record to global performance monitor
                logger.info("Operation completed", 
                          operation=operation_name, 
                          duration=duration)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                logger.error("Operation failed", 
                           operation=operation_name, 
                           duration=duration, 
                           error=str(e))
                raise
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                result = func(*args, **kwargs)
                duration = time.time() - start_time
                
                logger.info("Operation completed", 
                          operation=operation_name, 
                          duration=duration)
                
                return result
                
            except Exception as e:
                duration = time.time() - start_time
                logger.error("Operation failed", 
                           operation=operation_name, 
                           duration=duration, 
                           error=str(e))
                raise
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

# Global instances (lazy initialization to avoid import errors)
performance_monitor = None
cache_manager_optimized = None
query_optimizer = None
processing_optimizer = None
memory_optimizer = None
connection_pool_manager = None

def get_performance_monitor():
    global performance_monitor
    if performance_monitor is None:
        performance_monitor = PerformanceMonitor()
    return performance_monitor

def get_cache_manager():
    global cache_manager_optimized
    if cache_manager_optimized is None:
        cache_manager_optimized = CacheManager()
    return cache_manager_optimized

def get_query_optimizer():
    global query_optimizer
    if query_optimizer is None:
        query_optimizer = QueryOptimizer()
    return query_optimizer

# Optimization functions
async def optimize_system_performance():
    """Run all system optimizations"""
    try:
        # Memory optimization
        memory_optimizer.optimize_memory_usage()
        
        # Connection pool optimization
        connection_pool_manager.optimize_connection_pool()
        
        # Clear old cache entries
        # Would implement cache cleanup logic
        
        logger.info("System performance optimization completed")
        
    except Exception as e:
        logger.error("System optimization error", error=str(e))

def get_performance_report() -> Dict[str, Any]:
    """Get comprehensive performance report"""
    return {
        'timestamp': datetime.now().isoformat(),
        'performance_metrics': performance_monitor.get_performance_report(),
        'cache_stats': cache_manager_optimized.get_stats(),
        'connection_pool_stats': connection_pool_manager.pool_stats,
        'system_optimization': {
            'last_memory_cleanup': memory_optimizer._last_cleanup,
            'optimization_interval': memory_optimizer._cleanup_interval
        }
    }
