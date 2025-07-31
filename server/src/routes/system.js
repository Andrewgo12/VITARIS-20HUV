const express = require('express');
const auth = require('../middleware/auth');
const { checkPermission } = require('../middleware/checkPermission');
const logger = require('../utils/logger');

const router = express.Router();
router.use(auth);

router.get('/health', async (req, res) => {
  try {
    const healthData = {
      status: 'OK',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0'
    };

    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    logger.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

router.get('/metrics', checkPermission('admin_system'), async (req, res) => {
  try {
    const metrics = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      database: {
        status: 'connected',
        collections: 5
      },
      api: {
        totalRequests: 1250,
        avgResponseTime: 150
      }
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    logger.error('Get system metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
