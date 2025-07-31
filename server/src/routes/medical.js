const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const { checkPermission, auditAccess } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

/**
 * @swagger
 * /api/medical/vital-signs:
 *   get:
 *     summary: Get real-time vital signs for all patients
 *     tags: [Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time vital signs data
 */
router.get('/vital-signs', checkPermission('read_patients'), auditAccess('vital-signs'), async (req, res) => {
  try {
    const patients = await Patient.find({ status: 'active' })
      .select('firstName lastName documentNumber vitalSigns currentAdmission')
      .populate('currentAdmission', 'room department');

    // Generate real-time vital signs (in production, this would come from medical devices)
    const vitalSignsData = patients.map(patient => ({
      patientId: patient._id,
      patientName: patient.fullName,
      documentNumber: patient.documentNumber,
      room: patient.currentAdmission?.room || 'N/A',
      department: patient.currentAdmission?.department || 'N/A',
      vitalSigns: {
        heartRate: Math.round(72 + Math.random() * 20),
        bloodPressure: {
          systolic: Math.round(120 + Math.random() * 20),
          diastolic: Math.round(80 + Math.random() * 10)
        },
        temperature: Number((36.5 + Math.random() * 1.5).toFixed(1)),
        oxygenSaturation: Math.round(95 + Math.random() * 5),
        respiratoryRate: Math.round(16 + Math.random() * 8),
        lastUpdated: new Date()
      },
      alerts: generateVitalSignsAlerts(patient.vitalSigns)
    }));

    res.json({
      success: true,
      data: {
        vitalSigns: vitalSignsData,
        timestamp: new Date(),
        totalPatients: vitalSignsData.length
      }
    });

  } catch (error) {
    logger.error('Get vital signs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/medical/admissions:
 *   get:
 *     summary: Get current hospital admissions
 *     tags: [Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admissions data
 */
router.get('/admissions', checkPermission('read_patients'), async (req, res) => {
  try {
    // Mock admissions data (in production, this would come from an Admission model)
    const admissions = [
      {
        id: 'adm_001',
        patient: {
          id: '507f1f77bcf86cd799439011',
          name: 'Juan Carlos Pérez',
          documentNumber: '12345678',
          age: 45
        },
        admissionDate: new Date('2024-01-15T08:30:00'),
        department: 'Cardiología',
        room: '201A',
        bed: '1',
        attendingPhysician: 'Dr. Carlos Martínez',
        diagnosis: 'Infarto Agudo de Miocardio',
        status: 'stable',
        priority: 'high'
      },
      {
        id: 'adm_002',
        patient: {
          id: '507f1f77bcf86cd799439012',
          name: 'María Elena Rodríguez',
          documentNumber: '87654321',
          age: 67
        },
        admissionDate: new Date('2024-01-14T14:15:00'),
        department: 'Medicina Interna',
        room: '305B',
        bed: '2',
        attendingPhysician: 'Dra. María González',
        diagnosis: 'Diabetes Descompensada',
        status: 'stable',
        priority: 'medium'
      },
      {
        id: 'adm_003',
        patient: {
          id: '507f1f77bcf86cd799439013',
          name: 'Roberto Silva',
          documentNumber: '11223344',
          age: 33
        },
        admissionDate: new Date('2024-01-16T02:45:00'),
        department: 'UCI',
        room: 'UCI-01',
        bed: '3',
        attendingPhysician: 'Dr. Carlos Martínez',
        diagnosis: 'Politraumatismo',
        status: 'critical',
        priority: 'critical'
      }
    ];

    res.json({
      success: true,
      data: {
        admissions,
        totalAdmissions: admissions.length,
        byStatus: {
          critical: admissions.filter(a => a.status === 'critical').length,
          stable: admissions.filter(a => a.status === 'stable').length,
          recovering: admissions.filter(a => a.status === 'recovering').length
        },
        byDepartment: {
          'UCI': admissions.filter(a => a.department === 'UCI').length,
          'Cardiología': admissions.filter(a => a.department === 'Cardiología').length,
          'Medicina Interna': admissions.filter(a => a.department === 'Medicina Interna').length
        }
      }
    });

  } catch (error) {
    logger.error('Get admissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/medical/surgeries:
 *   get:
 *     summary: Get scheduled surgeries
 *     tags: [Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scheduled surgeries data
 */
router.get('/surgeries', checkPermission('read_patients'), async (req, res) => {
  try {
    // Mock surgeries data
    const surgeries = [
      {
        id: 'surg_001',
        patient: {
          id: '507f1f77bcf86cd799439011',
          name: 'Juan Carlos Pérez',
          documentNumber: '12345678',
          age: 45
        },
        procedure: 'Angioplastia Coronaria',
        surgeon: 'Dr. Carlos Martínez',
        assistants: ['Dra. María González', 'Dr. Pedro López'],
        scheduledDate: new Date('2024-01-17T09:00:00'),
        estimatedDuration: 120, // minutes
        operatingRoom: 'OR-1',
        status: 'scheduled',
        priority: 'urgent',
        preOpNotes: 'Paciente estable, preparado para procedimiento',
        anesthesiologist: 'Dr. Ana Ruiz'
      },
      {
        id: 'surg_002',
        patient: {
          id: '507f1f77bcf86cd799439014',
          name: 'Carmen López',
          documentNumber: '55667788',
          age: 52
        },
        procedure: 'Colecistectomía Laparoscópica',
        surgeon: 'Dr. Luis Herrera',
        assistants: ['Dr. Miguel Torres'],
        scheduledDate: new Date('2024-01-17T14:30:00'),
        estimatedDuration: 90,
        operatingRoom: 'OR-2',
        status: 'scheduled',
        priority: 'elective',
        preOpNotes: 'Colelitiasis sintomática',
        anesthesiologist: 'Dra. Patricia Vega'
      },
      {
        id: 'surg_003',
        patient: {
          id: '507f1f77bcf86cd799439013',
          name: 'Roberto Silva',
          documentNumber: '11223344',
          age: 33
        },
        procedure: 'Reducción Abierta Fractura Fémur',
        surgeon: 'Dr. Fernando Castro',
        assistants: ['Dr. Andrés Morales'],
        scheduledDate: new Date('2024-01-16T16:00:00'),
        estimatedDuration: 180,
        operatingRoom: 'OR-3',
        status: 'in_progress',
        priority: 'urgent',
        preOpNotes: 'Fractura cerrada de fémur derecho',
        anesthesiologist: 'Dr. Ricardo Mendez'
      }
    ];

    res.json({
      success: true,
      data: {
        surgeries,
        totalSurgeries: surgeries.length,
        byStatus: {
          scheduled: surgeries.filter(s => s.status === 'scheduled').length,
          in_progress: surgeries.filter(s => s.status === 'in_progress').length,
          completed: surgeries.filter(s => s.status === 'completed').length,
          cancelled: surgeries.filter(s => s.status === 'cancelled').length
        },
        byPriority: {
          urgent: surgeries.filter(s => s.priority === 'urgent').length,
          elective: surgeries.filter(s => s.priority === 'elective').length,
          emergency: surgeries.filter(s => s.priority === 'emergency').length
        }
      }
    });

  } catch (error) {
    logger.error('Get surgeries error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/medical/emergency-alerts:
 *   get:
 *     summary: Get current emergency alerts
 *     tags: [Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current emergency alerts
 */
router.get('/emergency-alerts', checkPermission('emergency_access'), async (req, res) => {
  try {
    // Mock emergency alerts
    const alerts = [
      {
        id: 'alert_001',
        type: 'cardiac_arrest',
        patient: {
          id: '507f1f77bcf86cd799439015',
          name: 'Elena Vargas',
          documentNumber: '99887766',
          age: 78
        },
        location: 'Room 402B',
        department: 'Cardiología',
        severity: 'critical',
        timestamp: new Date(),
        status: 'active',
        respondingTeam: ['Dr. Carlos Martínez', 'Enf. Ana López'],
        description: 'Paro cardíaco, iniciada RCP'
      },
      {
        id: 'alert_002',
        type: 'respiratory_distress',
        patient: {
          id: '507f1f77bcf86cd799439016',
          name: 'Miguel Ángel Torres',
          documentNumber: '44556677',
          age: 65
        },
        location: 'UCI-02',
        department: 'UCI',
        severity: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        status: 'responding',
        respondingTeam: ['Dra. María González', 'Enf. Pedro Ruiz'],
        description: 'Dificultad respiratoria severa, saturación 85%'
      }
    ];

    res.json({
      success: true,
      data: {
        alerts,
        totalAlerts: alerts.length,
        bySeverity: {
          critical: alerts.filter(a => a.severity === 'critical').length,
          high: alerts.filter(a => a.severity === 'high').length,
          medium: alerts.filter(a => a.severity === 'medium').length,
          low: alerts.filter(a => a.severity === 'low').length
        },
        byStatus: {
          active: alerts.filter(a => a.status === 'active').length,
          responding: alerts.filter(a => a.status === 'responding').length,
          resolved: alerts.filter(a => a.status === 'resolved').length
        }
      }
    });

  } catch (error) {
    logger.error('Get emergency alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/medical/metrics:
 *   get:
 *     summary: Get real-time hospital metrics
 *     tags: [Medical]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Real-time hospital metrics
 */
router.get('/metrics', checkPermission('read_reports'), async (req, res) => {
  try {
    // Generate real-time metrics
    const metrics = {
      hospital: {
        totalPatients: 1247 + Math.floor(Math.random() * 20),
        activeCases: 324 + Math.floor(Math.random() * 10),
        bedOccupancy: 85 + Math.random() * 10,
        emergencyCases: 12 + Math.floor(Math.random() * 5),
        surgeries: 8 + Math.floor(Math.random() * 3),
        discharges: 15 + Math.floor(Math.random() * 5)
      },
      departments: {
        'UCI': {
          capacity: 20,
          occupied: 18,
          occupancyRate: 90
        },
        'Medicina Interna': {
          capacity: 60,
          occupied: 45,
          occupancyRate: 75
        },
        'Cardiología': {
          capacity: 30,
          occupied: 25,
          occupancyRate: 83
        },
        'Pediatría': {
          capacity: 20,
          occupied: 12,
          occupancyRate: 60
        }
      },
      staff: {
        totalStaff: 450,
        onDuty: 180,
        doctors: 45,
        nurses: 120,
        technicians: 15
      },
      performance: {
        avgWaitTime: 25, // minutes
        patientSatisfaction: 92.3, // percentage
        avgLengthOfStay: 4.2, // days
        readmissionRate: 8.5 // percentage
      }
    };

    res.json({
      success: true,
      data: {
        metrics,
        timestamp: new Date(),
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    logger.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Helper function to generate vital signs alerts
function generateVitalSignsAlerts(vitalSigns) {
  const alerts = [];
  
  if (!vitalSigns) return alerts;

  // Heart rate alerts
  if (vitalSigns.heartRate < 60) {
    alerts.push({ type: 'bradycardia', severity: 'medium', message: 'Frecuencia cardíaca baja' });
  } else if (vitalSigns.heartRate > 100) {
    alerts.push({ type: 'tachycardia', severity: 'medium', message: 'Frecuencia cardíaca alta' });
  }

  // Blood pressure alerts
  if (vitalSigns.bloodPressure) {
    if (vitalSigns.bloodPressure.systolic > 140 || vitalSigns.bloodPressure.diastolic > 90) {
      alerts.push({ type: 'hypertension', severity: 'medium', message: 'Presión arterial elevada' });
    }
  }

  // Temperature alerts
  if (vitalSigns.temperature > 38) {
    alerts.push({ type: 'fever', severity: 'medium', message: 'Fiebre' });
  } else if (vitalSigns.temperature < 36) {
    alerts.push({ type: 'hypothermia', severity: 'high', message: 'Hipotermia' });
  }

  // Oxygen saturation alerts
  if (vitalSigns.oxygenSaturation < 95) {
    alerts.push({ type: 'hypoxia', severity: 'high', message: 'Saturación de oxígeno baja' });
  }

  return alerts;
}

module.exports = router;
