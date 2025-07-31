const express = require('express');
const auth = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();
router.use(auth);

// Mock pharmacy data
const medications = [
  {
    id: 'med_001',
    name: 'Atorvastatina',
    genericName: 'Atorvastatin',
    dosage: '20mg',
    form: 'Tableta',
    stock: 150,
    minStock: 20,
    price: 2500,
    supplier: 'Laboratorios ABC',
    expiryDate: new Date('2025-06-15')
  },
  {
    id: 'med_002',
    name: 'Metformina',
    genericName: 'Metformin',
    dosage: '500mg',
    form: 'Tableta',
    stock: 200,
    minStock: 30,
    price: 1200,
    supplier: 'Farmacéutica XYZ',
    expiryDate: new Date('2025-03-20')
  }
];

router.get('/medications', checkPermission('read_medications'), async (req, res) => {
  try {
    res.json({
      success: true,
      data: { medications }
    });
  } catch (error) {
    logger.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
