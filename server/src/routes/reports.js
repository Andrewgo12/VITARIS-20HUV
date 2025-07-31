const express = require('express');
const auth = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();
router.use(auth);

router.get('/dashboard', checkPermission('read_reports'), async (req, res) => {
  try {
    const dashboardData = {
      totalPatients: 1247,
      activeCases: 324,
      todayAppointments: 45,
      emergencyCases: 12,
      bedOccupancy: 85.5,
      avgWaitTime: 25
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    logger.error('Get dashboard reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
