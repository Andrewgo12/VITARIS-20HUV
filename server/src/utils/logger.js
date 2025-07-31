const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/exceptions.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/rejections.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add custom methods for medical-specific logging
logger.medical = {
  patientAccess: (userId, patientId, action) => {
    logger.info(`Medical Access - User: ${userId}, Patient: ${patientId}, Action: ${action}`, {
      type: 'medical_access',
      userId,
      patientId,
      action,
      timestamp: new Date().toISOString()
    });
  },
  
  vitalSigns: (patientId, vitalSigns, recordedBy) => {
    logger.info(`Vital Signs Updated - Patient: ${patientId}, Recorded by: ${recordedBy}`, {
      type: 'vital_signs',
      patientId,
      vitalSigns,
      recordedBy,
      timestamp: new Date().toISOString()
    });
  },
  
  prescription: (patientId, medication, prescribedBy) => {
    logger.info(`Prescription Created - Patient: ${patientId}, Medication: ${medication}, Prescribed by: ${prescribedBy}`, {
      type: 'prescription',
      patientId,
      medication,
      prescribedBy,
      timestamp: new Date().toISOString()
    });
  },
  
  appointment: (patientId, appointmentId, action, userId) => {
    logger.info(`Appointment ${action} - Patient: ${patientId}, Appointment: ${appointmentId}, User: ${userId}`, {
      type: 'appointment',
      patientId,
      appointmentId,
      action,
      userId,
      timestamp: new Date().toISOString()
    });
  },
  
  emergency: (patientId, emergencyType, handledBy) => {
    logger.warn(`Emergency Alert - Patient: ${patientId}, Type: ${emergencyType}, Handled by: ${handledBy}`, {
      type: 'emergency',
      patientId,
      emergencyType,
      handledBy,
      timestamp: new Date().toISOString()
    });
  }
};

// Add custom methods for security logging
logger.security = {
  login: (userId, email, ip, success) => {
    const level = success ? 'info' : 'warn';
    const message = `Login ${success ? 'successful' : 'failed'} - User: ${email}, IP: ${ip}`;
    
    logger[level](message, {
      type: 'authentication',
      userId,
      email,
      ip,
      success,
      timestamp: new Date().toISOString()
    });
  },
  
  logout: (userId, email, ip) => {
    logger.info(`Logout - User: ${email}, IP: ${ip}`, {
      type: 'authentication',
      userId,
      email,
      ip,
      action: 'logout',
      timestamp: new Date().toISOString()
    });
  },
  
  permissionDenied: (userId, email, resource, requiredPermission) => {
    logger.warn(`Permission Denied - User: ${email}, Resource: ${resource}, Required: ${requiredPermission}`, {
      type: 'authorization',
      userId,
      email,
      resource,
      requiredPermission,
      timestamp: new Date().toISOString()
    });
  },
  
  suspiciousActivity: (userId, email, activity, ip) => {
    logger.error(`Suspicious Activity - User: ${email}, Activity: ${activity}, IP: ${ip}`, {
      type: 'security_alert',
      userId,
      email,
      activity,
      ip,
      timestamp: new Date().toISOString()
    });
  }
};

// Add custom methods for system logging
logger.system = {
  startup: (port, environment) => {
    logger.info(`🏥 VITARIS Server started on port ${port} in ${environment} mode`, {
      type: 'system',
      event: 'startup',
      port,
      environment,
      timestamp: new Date().toISOString()
    });
  },
  
  shutdown: (reason) => {
    logger.info(`Server shutting down - Reason: ${reason}`, {
      type: 'system',
      event: 'shutdown',
      reason,
      timestamp: new Date().toISOString()
    });
  },
  
  databaseConnection: (status, host) => {
    const level = status === 'connected' ? 'info' : 'error';
    logger[level](`Database ${status} - Host: ${host}`, {
      type: 'database',
      status,
      host,
      timestamp: new Date().toISOString()
    });
  },
  
  backup: (status, filename, size) => {
    const level = status === 'success' ? 'info' : 'error';
    logger[level](`Backup ${status} - File: ${filename}, Size: ${size}`, {
      type: 'backup',
      status,
      filename,
      size,
      timestamp: new Date().toISOString()
    });
  },
  
  performance: (metric, value, threshold) => {
    const level = value > threshold ? 'warn' : 'info';
    logger[level](`Performance Metric - ${metric}: ${value} (threshold: ${threshold})`, {
      type: 'performance',
      metric,
      value,
      threshold,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = logger;
