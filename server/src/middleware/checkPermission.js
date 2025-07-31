const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to check if user has required permission
 * @param {string|string[]} requiredPermissions - Permission(s) required to access the route
 * @returns {Function} Express middleware function
 */
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Ensure user is authenticated (should be set by auth middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Convert single permission to array for consistent handling
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Get user's permissions based on role
      const userPermissions = User.getRolePermissions(req.user.role);

      // Check if user has all required permissions
      const hasAllPermissions = permissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        logger.warn(`Access denied for user ${req.user.email}. Required: ${permissions.join(', ')}, Has: ${userPermissions.join(', ')}`);
        
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to access this resource',
          required: permissions,
          userRole: req.user.role
        });
      }

      // User has required permissions, proceed
      next();

    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param {string[]} permissions - Array of permissions, user needs at least one
 * @returns {Function} Express middleware function
 */
const checkAnyPermission = (permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = User.getRolePermissions(req.user.role);

      // Check if user has at least one of the required permissions
      const hasAnyPermission = permissions.some(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        logger.warn(`Access denied for user ${req.user.email}. Required any of: ${permissions.join(', ')}, Has: ${userPermissions.join(', ')}`);
        
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to access this resource',
          requiredAny: permissions,
          userRole: req.user.role
        });
      }

      next();

    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Middleware to check if user has a specific role
 * @param {string|string[]} requiredRoles - Role(s) required to access the route
 * @returns {Function} Express middleware function
 */
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!roles.includes(req.user.role)) {
        logger.warn(`Access denied for user ${req.user.email}. Required role: ${roles.join(' or ')}, User role: ${req.user.role}`);
        
        return res.status(403).json({
          success: false,
          message: 'Insufficient role to access this resource',
          requiredRoles: roles,
          userRole: req.user.role
        });
      }

      next();

    } catch (error) {
      logger.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

/**
 * Middleware for admin-only routes
 */
const adminOnly = checkRole(['super_admin', 'admin']);

/**
 * Middleware for medical staff only
 */
const medicalStaffOnly = checkRole(['super_admin', 'admin', 'doctor', 'nurse']);

/**
 * Middleware for emergency access
 */
const emergencyAccess = checkPermission('emergency_access');

/**
 * Middleware to check if user can access patient data
 * This can be extended to include department-based access control
 */
const canAccessPatient = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = User.getRolePermissions(req.user.role);

    // Check basic patient read permission
    if (!userPermissions.includes('read_patients')) {
      return res.status(403).json({
        success: false,
        message: 'No permission to access patient data'
      });
    }

    // Additional checks can be added here:
    // - Department-based access
    // - Patient privacy level
    // - Doctor-patient relationship
    // - Emergency override

    next();

  } catch (error) {
    logger.error('Patient access check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Middleware to log access attempts for audit purposes
 */
const auditAccess = (resource) => {
  return (req, res, next) => {
    try {
      const auditData = {
        userId: req.user?.id,
        userEmail: req.user?.email,
        userRole: req.user?.role,
        resource,
        action: req.method,
        endpoint: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      };

      // Log the access attempt
      logger.info('Resource access:', auditData);

      // In a production environment, you might want to store this in a separate audit log collection
      // await AuditLog.create(auditData);

      next();

    } catch (error) {
      logger.error('Audit logging error:', error);
      // Don't block the request if audit logging fails
      next();
    }
  };
};

module.exports = {
  checkPermission,
  checkAnyPermission,
  checkRole,
  adminOnly,
  medicalStaffOnly,
  emergencyAccess,
  canAccessPatient,
  auditAccess
};
