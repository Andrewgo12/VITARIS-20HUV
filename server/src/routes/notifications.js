const express = require('express');
const { body, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

// In-memory notification storage (in production, use Redis or database)
let notifications = [
  {
    id: 'notif_001',
    userId: null, // null means broadcast to all users
    type: 'emergency',
    title: 'Código Azul - Paro Cardíaco',
    message: 'Paro cardíaco en habitación 402B. Equipo de emergencia requerido inmediatamente.',
    timestamp: new Date(),
    read: false,
    priority: 'critical',
    patientId: '507f1f77bcf86cd799439015',
    patientName: 'Elena Vargas',
    actionRequired: true,
    autoExpire: null,
    sound: true,
    metadata: {
      location: 'Room 402B',
      department: 'Cardiología',
      alertType: 'cardiac_arrest'
    }
  },
  {
    id: 'notif_002',
    userId: null,
    type: 'warning',
    title: 'Ocupación UCI Crítica',
    message: 'La UCI está al 95% de capacidad. Considerar transferencias o altas.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: 'high',
    actionRequired: false,
    autoExpire: 30 * 60 * 1000, // 30 minutes
    sound: false,
    metadata: {
      department: 'UCI',
      occupancyRate: 95,
      availableBeds: 1
    }
  },
  {
    id: 'notif_003',
    userId: null,
    type: 'info',
    title: 'Mantenimiento Programado',
    message: 'Sistema de respaldo programado para las 2:00 AM del 17 de enero.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'medium',
    actionRequired: false,
    autoExpire: 24 * 60 * 60 * 1000, // 24 hours
    sound: false,
    metadata: {
      maintenanceType: 'backup',
      scheduledTime: '2024-01-17T02:00:00Z'
    }
  },
  {
    id: 'notif_004',
    userId: null,
    type: 'appointment',
    title: 'Recordatorio de Cita',
    message: 'Cita con Dr. Martínez en 30 minutos - Juan Carlos Pérez.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'medium',
    patientId: '507f1f77bcf86cd799439011',
    patientName: 'Juan Carlos Pérez',
    actionRequired: false,
    autoExpire: 60 * 60 * 1000, // 1 hour
    sound: true,
    metadata: {
      appointmentId: 'apt_001',
      doctorName: 'Dr. Carlos Martínez',
      appointmentTime: '2024-01-16T14:30:00Z'
    }
  },
  {
    id: 'notif_005',
    userId: null,
    type: 'vital_signs',
    title: 'Signos Vitales Anómalos',
    message: 'Frecuencia cardíaca elevada (125 bpm) - María Elena Rodríguez.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    priority: 'high',
    patientId: '507f1f77bcf86cd799439012',
    patientName: 'María Elena Rodríguez',
    actionRequired: true,
    autoExpire: null,
    sound: true,
    metadata: {
      vitalSign: 'heartRate',
      value: 125,
      normalRange: '60-100',
      location: 'Room 305B'
    }
  }
];

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *           default: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [emergency, warning, info, success, appointment, message, vital_signs, system]
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', async (req, res) => {
  try {
    const { unreadOnly = false, limit = 50, type } = req.query;
    const userId = req.user.id;

    // Filter notifications for user (broadcast notifications + user-specific)
    let userNotifications = notifications.filter(notif => 
      notif.userId === null || notif.userId === userId
    );

    // Filter by type if specified
    if (type) {
      userNotifications = userNotifications.filter(notif => notif.type === type);
    }

    // Filter by read status if specified
    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(notif => !notif.read);
    }

    // Remove expired notifications
    const now = new Date();
    userNotifications = userNotifications.filter(notif => {
      if (notif.autoExpire) {
        const expiryTime = new Date(notif.timestamp.getTime() + notif.autoExpire);
        return now < expiryTime;
      }
      return true;
    });

    // Sort by timestamp (newest first) and limit
    userNotifications = userNotifications
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    const unreadCount = userNotifications.filter(notif => !notif.read).length;

    res.json({
      success: true,
      data: {
        notifications: userNotifications,
        unreadCount,
        total: userNotifications.length
      }
    });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - message
 *               - priority
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [emergency, warning, info, success, appointment, message, vital_signs, system]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *               userId:
 *                 type: string
 *               patientId:
 *                 type: string
 *               patientName:
 *                 type: string
 *               actionRequired:
 *                 type: boolean
 *               autoExpire:
 *                 type: integer
 *               sound:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router.post('/', checkPermission(['admin_system', 'emergency_access']), [
  body('type').isIn(['emergency', 'warning', 'info', 'success', 'appointment', 'message', 'vital_signs', 'system']),
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('message').trim().isLength({ min: 1, max: 500 }),
  body('priority').isIn(['low', 'medium', 'high', 'critical']),
  body('userId').optional().isMongoId(),
  body('patientId').optional().isMongoId(),
  body('patientName').optional().trim().isLength({ min: 1, max: 100 }),
  body('actionRequired').optional().isBoolean(),
  body('autoExpire').optional().isInt({ min: 1000 }), // minimum 1 second
  body('sound').optional().isBoolean()
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

    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.body.userId || null,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      timestamp: new Date(),
      read: false,
      priority: req.body.priority,
      patientId: req.body.patientId || null,
      patientName: req.body.patientName || null,
      actionRequired: req.body.actionRequired || false,
      autoExpire: req.body.autoExpire || null,
      sound: req.body.sound !== false, // default to true
      metadata: req.body.metadata || {}
    };

    // Add to notifications array
    notifications.unshift(notification);

    // Emit real-time notification via Socket.IO
    const io = req.app.get('io');
    if (notification.userId) {
      // Send to specific user
      io.to(notification.userId).emit('notification', notification);
    } else {
      // Broadcast to all connected users
      io.emit('notification', notification);
    }

    logger.info(`Notification created: ${notification.title} by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });

  } catch (error) {
    logger.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notification = notifications.find(notif => 
      notif.id === notificationId && 
      (notif.userId === null || notif.userId === userId)
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.read = true;

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });

  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user.id;

    // Mark all user notifications as read
    notifications.forEach(notif => {
      if (notif.userId === null || notif.userId === userId) {
        notif.read = true;
      }
    });

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const notificationIndex = notifications.findIndex(notif => 
      notif.id === notificationId && 
      (notif.userId === null || notif.userId === userId)
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notifications.splice(notificationIndex, 1);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications/clear-all:
 *   delete:
 *     summary: Clear all notifications for user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications cleared
 */
router.delete('/clear-all', async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove all user-specific notifications
    notifications = notifications.filter(notif => 
      notif.userId !== userId && notif.userId !== null
    );

    res.json({
      success: true,
      message: 'All notifications cleared'
    });

  } catch (error) {
    logger.error('Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/notifications/stats:
 *   get:
 *     summary: Get notification statistics
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    // Filter notifications for user
    const userNotifications = notifications.filter(notif => 
      notif.userId === null || notif.userId === userId
    );

    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(notif => !notif.read).length,
      byType: {},
      byPriority: {},
      recent: userNotifications.filter(notif => 
        new Date() - new Date(notif.timestamp) < 24 * 60 * 60 * 1000 // last 24 hours
      ).length
    };

    // Count by type
    ['emergency', 'warning', 'info', 'success', 'appointment', 'message', 'vital_signs', 'system'].forEach(type => {
      stats.byType[type] = userNotifications.filter(notif => notif.type === type).length;
    });

    // Count by priority
    ['low', 'medium', 'high', 'critical'].forEach(priority => {
      stats.byPriority[priority] = userNotifications.filter(notif => notif.priority === priority).length;
    });

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    logger.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
