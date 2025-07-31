const express = require('express');
const auth = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();
router.use(auth);

// Mock appointments data
const appointments = [
  {
    id: 'apt_001',
    patientId: '507f1f77bcf86cd799439011',
    patientName: 'Juan Carlos Pérez',
    doctorId: '507f1f77bcf86cd799439021',
    doctorName: 'Dr. Carlos Martínez',
    date: new Date('2024-01-17T14:30:00'),
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    department: 'Cardiología',
    room: 'Consultorio 201',
    notes: 'Control post-operatorio'
  },
  {
    id: 'apt_002',
    patientId: '507f1f77bcf86cd799439012',
    patientName: 'María Elena Rodríguez',
    doctorId: '507f1f77bcf86cd799439022',
    doctorName: 'Dra. María González',
    date: new Date('2024-01-17T10:00:00'),
    duration: 45,
    type: 'follow_up',
    status: 'scheduled',
    department: 'Medicina Interna',
    room: 'Consultorio 305',
    notes: 'Control de diabetes'
  }
];

router.get('/', checkPermission('read_appointments'), async (req, res) => {
  try {
    res.json({
      success: true,
      data: { appointments }
    });
  } catch (error) {
    logger.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
