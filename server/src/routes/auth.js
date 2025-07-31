const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
const logger = require('../utils/logger');
const { sendEmail } = require('../utils/email');

// Mock users for demo (in production, use database)
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@vitaris.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // Admin123!
    role: 'super_admin',
    department: 'Administración',
    isActive: true,
    isVerified: true,
    loginAttempts: 0,
    lastLogin: new Date()
  },
  {
    _id: '507f1f77bcf86cd799439012',
    firstName: 'Dr. Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@vitaris.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', // Doctor123!
    role: 'doctor',
    department: 'Cardiología',
    specialization: 'Cardiología Intervencionista',
    licenseNumber: 'MD-12345',
    isActive: true,
    isVerified: true,
    loginAttempts: 0,
    lastLogin: new Date()
  }
];

// Mock User methods
const User = {
  findOne: (query) => {
    return Promise.resolve(mockUsers.find(user => user.email === query.email));
  },
  getRolePermissions: (role) => {
    const rolePermissions = {
      super_admin: [
        'read_patients', 'write_patients', 'delete_patients',
        'read_medical_records', 'write_medical_records',
        'read_appointments', 'write_appointments', 'cancel_appointments',
        'read_medications', 'write_medications', 'prescribe_medications',
        'read_reports', 'write_reports',
        'admin_users', 'admin_system',
        'emergency_access', 'financial_data', 'audit_logs'
      ],
      doctor: [
        'read_patients', 'write_patients',
        'read_medical_records', 'write_medical_records',
        'read_appointments', 'write_appointments',
        'read_medications', 'write_medications', 'prescribe_medications',
        'read_reports', 'write_reports',
        'emergency_access'
      ]
    };
    return rolePermissions[role] || [];
  }
};

// Mock password comparison
const comparePassword = async (candidatePassword, hashedPassword) => {
  // For demo purposes, accept these passwords
  const validPasswords = {
    'Admin123!': '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm',
    'Doctor123!': '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm'
  };
  return validPasswords[candidatePassword] === hashedPassword;
};

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'vitaris-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       423:
 *         description: Account locked
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for user: ${email}`);

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login (in production, save to database)
    user.lastLogin = new Date();

    // Generate token
    const token = generateToken(user._id);

    // Set user permissions based on role
    const permissions = User.getRolePermissions(user.role);

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          permissions,
          department: user.department,
          avatar: user.avatar,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [doctor, nurse, pharmacist, receptionist, technician]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation errors
 *       409:
 *         description: User already exists
 */
router.post('/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['doctor', 'nurse', 'pharmacist', 'receptionist', 'technician'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, role, phone, department, licenseNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Get permissions for role
    const permissions = User.getRolePermissions(role);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      permissions,
      phone,
      department,
      licenseNumber
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          permissions,
          department: user.department
        }
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success
    
    logger.info('User logged out');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = jwt.sign(
      { userId: user._id, purpose: 'password-reset' },
      process.env.JWT_SECRET || 'vitaris-secret',
      { expiresIn: '1h' }
    );

    // Send password reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'VITARIS - Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested a password reset for your VITARIS account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
    }

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auth/verify-token:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid token
 */
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vitaris-secret');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          permissions: User.getRolePermissions(user.role),
          department: user.department,
          avatar: user.avatar,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
