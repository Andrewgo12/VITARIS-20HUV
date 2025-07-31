const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();

// Apply authentication to all routes
router.use(auth);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, deceased, transferred]
 *     responses:
 *       200:
 *         description: List of patients
 */
router.get('/', checkPermission('read_patients'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive', 'deceased', 'transferred'])
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, status } = req.query;

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { documentNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const patients = await Patient.find(query)
      .populate('registeredBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
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
 *         description: Patient details
 *       404:
 *         description: Patient not found
 */
router.get('/:id', checkPermission('read_patients'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('registeredBy', 'firstName lastName')
      .populate('lastUpdatedBy', 'firstName lastName')
      .populate('medications.prescribedBy', 'firstName lastName')
      .populate('medicalHistory.doctor', 'firstName lastName')
      .populate('notes.author', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });

  } catch (error) {
    logger.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - documentType
 *               - documentNumber
 *               - dateOfBirth
 *               - gender
 *               - emergencyContact
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               documentType:
 *                 type: string
 *                 enum: [CC, TI, CE, PP, RC, AS]
 *               documentNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [M, F, O]
 *               emergencyContact:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   relationship:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Validation errors
 *       409:
 *         description: Patient already exists
 */
router.post('/', checkPermission('write_patients'), [
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('documentType').isIn(['CC', 'TI', 'CE', 'PP', 'RC', 'AS']),
  body('documentNumber').trim().isLength({ min: 5, max: 20 }),
  body('dateOfBirth').isISO8601(),
  body('gender').isIn(['M', 'F', 'O']),
  body('emergencyContact.name').trim().isLength({ min: 2, max: 100 }),
  body('emergencyContact.relationship').trim().isLength({ min: 2, max: 50 }),
  body('emergencyContact.phone').isMobilePhone(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone()
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

    const { documentType, documentNumber } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findByDocument(documentType, documentNumber);
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this document already exists'
      });
    }

    // Create new patient
    const patient = new Patient({
      ...req.body,
      registeredBy: req.user.id
    });

    await patient.save();

    logger.info(`New patient created: ${patient.documentNumber} by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient }
    });

  } catch (error) {
    logger.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
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
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 */
router.put('/:id', checkPermission('write_patients'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update patient
    Object.assign(patient, req.body);
    patient.lastUpdatedBy = req.user.id;
    
    await patient.save();

    logger.info(`Patient updated: ${patient.documentNumber} by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient }
    });

  } catch (error) {
    logger.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}/vital-signs:
 *   put:
 *     summary: Update patient vital signs
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               bloodPressure:
 *                 type: object
 *                 properties:
 *                   systolic:
 *                     type: number
 *                   diastolic:
 *                     type: number
 *               heartRate:
 *                 type: number
 *               temperature:
 *                 type: number
 *               respiratoryRate:
 *                 type: number
 *               oxygenSaturation:
 *                 type: number
 *     responses:
 *       200:
 *         description: Vital signs updated successfully
 */
router.put('/:id/vital-signs', checkPermission('write_patients'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    await patient.updateVitalSigns(req.body);

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('vitalSignsUpdate', {
      patientId: patient._id,
      vitalSigns: patient.vitalSigns
    });

    logger.info(`Vital signs updated for patient: ${patient.documentNumber}`);

    res.json({
      success: true,
      message: 'Vital signs updated successfully',
      data: { vitalSigns: patient.vitalSigns }
    });

  } catch (error) {
    logger.error('Update vital signs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}/notes:
 *   post:
 *     summary: Add note to patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Note added successfully
 */
router.post('/:id/notes', checkPermission('write_patients'), [
  body('content').trim().isLength({ min: 1, max: 1000 }),
  body('isPrivate').optional().isBoolean()
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

    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const { content, isPrivate = false } = req.body;
    await patient.addNote(content, req.user.id, isPrivate);

    logger.info(`Note added to patient: ${patient.documentNumber} by user: ${req.user.email}`);

    res.json({
      success: true,
      message: 'Note added successfully',
      data: { notes: patient.notes }
    });

  } catch (error) {
    logger.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/patients/search:
 *   get:
 *     summary: Search patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [name, document, email, phone]
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', checkPermission('read_patients'), [
  query('q').trim().isLength({ min: 2 }),
  query('type').optional().isIn(['name', 'document', 'email', 'phone'])
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

    const { q, type } = req.query;
    let searchQuery = {};

    switch (type) {
      case 'document':
        searchQuery.documentNumber = { $regex: q, $options: 'i' };
        break;
      case 'email':
        searchQuery.email = { $regex: q, $options: 'i' };
        break;
      case 'phone':
        searchQuery.phone = { $regex: q, $options: 'i' };
        break;
      default:
        searchQuery.$or = [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } }
        ];
    }

    const patients = await Patient.find(searchQuery)
      .select('firstName lastName documentType documentNumber email phone status')
      .limit(20)
      .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      data: { patients }
    });

  } catch (error) {
    logger.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
