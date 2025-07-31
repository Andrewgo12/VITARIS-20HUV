const jwt = require('jsonwebtoken');
// const User = require('../models/User');
const logger = require('../utils/logger');

// Mock users for demo
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@vitaris.com',
    role: 'super_admin',
    department: 'Administración',
    isActive: true,
    isVerified: true
  },
  {
    _id: '507f1f77bcf86cd799439012',
    firstName: 'Dr. Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@vitaris.com',
    role: 'doctor',
    department: 'Cardiología',
    isActive: true,
    isVerified: true
  }
];

const User = {
  findById: (id) => {
    return Promise.resolve(mockUsers.find(user => user._id === id));
  }
};

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vitaris-secret');
    
    // Get user from mock data
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Skip password change check for demo

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    logger.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

module.exports = auth;
