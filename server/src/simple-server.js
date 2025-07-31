const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockUsers = [
  {
    _id: '507f1f77bcf86cd799439011',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@vitaris.com',
    password: 'Admin123!',
    role: 'super_admin',
    department: 'Administración',
    isActive: true,
    permissions: [
      'read_patients', 'write_patients', 'delete_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments', 'cancel_appointments',
      'read_medications', 'write_medications', 'prescribe_medications',
      'read_reports', 'write_reports',
      'admin_users', 'admin_system',
      'emergency_access', 'financial_data', 'audit_logs'
    ]
  },
  {
    _id: '507f1f77bcf86cd799439012',
    firstName: 'Dr. Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@vitaris.com',
    password: 'Doctor123!',
    role: 'doctor',
    department: 'Cardiología',
    isActive: true,
    permissions: [
      'read_patients', 'write_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments',
      'read_medications', 'write_medications', 'prescribe_medications',
      'read_reports', 'write_reports',
      'emergency_access'
    ]
  }
];

const mockPatients = [
  {
    _id: '507f1f77bcf86cd799439021',
    firstName: 'Juan Carlos',
    lastName: 'Pérez González',
    documentType: 'CC',
    documentNumber: '12345678',
    dateOfBirth: '1978-05-15',
    gender: 'M',
    bloodType: 'O+',
    phone: '+57 300 123 4567',
    email: 'juan.perez@email.com',
    status: 'active',
    vitalSigns: {
      heartRate: 72,
      bloodPressure: { systolic: 130, diastolic: 85 },
      temperature: 36.5,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      lastUpdated: new Date()
    }
  },
  {
    _id: '507f1f77bcf86cd799439022',
    firstName: 'María Elena',
    lastName: 'Rodríguez Silva',
    documentType: 'CC',
    documentNumber: '87654321',
    dateOfBirth: '1955-11-22',
    gender: 'F',
    bloodType: 'A+',
    phone: '+57 301 987 6543',
    email: 'maria.rodriguez@email.com',
    status: 'active',
    vitalSigns: {
      heartRate: 78,
      bloodPressure: { systolic: 140, diastolic: 90 },
      temperature: 36.3,
      oxygenSaturation: 96,
      respiratoryRate: 18,
      lastUpdated: new Date()
    }
  }
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'vitaris-secret', {
    expiresIn: '7d'
  });
};

// Permission check middleware
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. No permissions found.'
      });
    }

    const userPermissions = req.user.permissions;
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        required: requiredPermissions,
        current: userPermissions
      });
    }

    next();
  };
};

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vitaris-secret');
    const user = mockUsers.find(u => u._id === decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

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
          permissions: user.permissions,
          department: user.department
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/auth/verify-token', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
        department: req.user.department
      }
    }
  });
});

// Patient routes
app.get('/api/patients', auth, (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let patients = [...mockPatients];

  if (search) {
    patients = patients.filter(p => 
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.documentNumber.includes(search)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPatients = patients.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      patients: paginatedPatients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: patients.length,
        pages: Math.ceil(patients.length / limit)
      }
    }
  });
});

app.get('/api/patients/:id', auth, (req, res) => {
  const patient = mockPatients.find(p => p._id === req.params.id);
  
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
});

// Medical routes
app.get('/api/medical/vital-signs', auth, (req, res) => {
  const vitalSignsData = mockPatients.map(patient => ({
    patientId: patient._id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    documentNumber: patient.documentNumber,
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
    }
  }));

  res.json({
    success: true,
    data: {
      vitalSigns: vitalSignsData,
      timestamp: new Date(),
      totalPatients: vitalSignsData.length
    }
  });
});

app.get('/api/medical/metrics', auth, (req, res) => {
  const metrics = {
    hospital: {
      totalPatients: 1247 + Math.floor(Math.random() * 20),
      activeCases: 324 + Math.floor(Math.random() * 10),
      bedOccupancy: 85 + Math.random() * 10,
      emergencyCases: 12 + Math.floor(Math.random() * 5),
      surgeries: 8 + Math.floor(Math.random() * 3),
      discharges: 15 + Math.floor(Math.random() * 5)
    },
    systemHealth: {
      cpuUsage: 45 + Math.random() * 30,
      memoryUsage: 60 + Math.random() * 25,
      diskUsage: 70 + Math.random() * 15,
      uptime: 99.8 + Math.random() * 0.2
    }
  };

  res.json({
    success: true,
    data: {
      metrics,
      timestamp: new Date()
    }
  });
});

// Notifications routes
app.get('/api/notifications', auth, (req, res) => {
  const notifications = [
    {
      id: 'notif_001',
      type: 'emergency',
      title: 'Código Azul - Paro Cardíaco',
      message: 'Paro cardíaco en habitación 402B. Equipo de emergencia requerido.',
      timestamp: new Date(),
      read: false,
      priority: 'critical'
    },
    {
      id: 'notif_002',
      type: 'warning',
      title: 'Ocupación UCI Crítica',
      message: 'La UCI está al 95% de capacidad.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: 'notif_003',
      type: 'info',
      title: 'Mantenimiento Programado',
      message: 'Sistema de respaldo programado para las 2:00 AM.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    }
  ];

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount: notifications.filter(n => !n.read).length,
      total: notifications.length
    }
  });
});

// Additional medical routes
app.get('/api/medical/admissions', auth, (req, res) => {
  const admissions = [
    {
      id: 'adm_001',
      patient: {
        id: '507f1f77bcf86cd799439021',
        name: 'Juan Carlos Pérez',
        documentNumber: '12345678',
        age: 45
      },
      admissionDate: new Date('2024-01-15T08:30:00'),
      department: 'Cardiología',
      room: '201A',
      attendingPhysician: 'Dr. Carlos Martínez',
      diagnosis: 'Infarto Agudo de Miocardio',
      status: 'stable',
      priority: 'high'
    },
    {
      id: 'adm_002',
      patient: {
        id: '507f1f77bcf86cd799439022',
        name: 'María Elena Rodríguez',
        documentNumber: '87654321',
        age: 67
      },
      admissionDate: new Date('2024-01-14T14:15:00'),
      department: 'Medicina Interna',
      room: '305B',
      attendingPhysician: 'Dra. María González',
      diagnosis: 'Diabetes Descompensada',
      status: 'stable',
      priority: 'medium'
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
      }
    }
  });
});

app.get('/api/medical/surgeries', auth, (req, res) => {
  const surgeries = [
    {
      id: 'surg_001',
      patient: {
        id: '507f1f77bcf86cd799439021',
        name: 'Juan Carlos Pérez',
        documentNumber: '12345678'
      },
      procedure: 'Angioplastia Coronaria',
      surgeon: 'Dr. Carlos Martínez',
      scheduledDate: new Date('2024-01-17T09:00:00'),
      estimatedDuration: 120,
      operatingRoom: 'OR-1',
      status: 'scheduled',
      priority: 'urgent'
    },
    {
      id: 'surg_002',
      patient: {
        id: '507f1f77bcf86cd799439023',
        name: 'Carmen López',
        documentNumber: '55667788'
      },
      procedure: 'Colecistectomía Laparoscópica',
      surgeon: 'Dr. Luis Herrera',
      scheduledDate: new Date('2024-01-17T14:30:00'),
      estimatedDuration: 90,
      operatingRoom: 'OR-2',
      status: 'scheduled',
      priority: 'elective'
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
        completed: surgeries.filter(s => s.status === 'completed').length
      }
    }
  });
});

// Appointments routes
app.get('/api/appointments', auth, (req, res) => {
  const appointments = [
    {
      id: 'apt_001',
      patientId: '507f1f77bcf86cd799439021',
      patientName: 'Juan Carlos Pérez',
      doctorName: 'Dr. Carlos Martínez',
      date: new Date('2024-01-17T14:30:00'),
      duration: 30,
      type: 'consultation',
      status: 'scheduled',
      department: 'Cardiología'
    },
    {
      id: 'apt_002',
      patientId: '507f1f77bcf86cd799439022',
      patientName: 'María Elena Rodríguez',
      doctorName: 'Dra. María González',
      date: new Date('2024-01-17T10:00:00'),
      duration: 45,
      type: 'follow_up',
      status: 'scheduled',
      department: 'Medicina Interna'
    }
  ];

  res.json({
    success: true,
    data: { appointments }
  });
});

// Pharmacy routes
app.get('/api/pharmacy/medications', auth, (req, res) => {
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
      supplier: 'Laboratorios ABC'
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
      supplier: 'Farmacéutica XYZ'
    }
  ];

  res.json({
    success: true,
    data: { medications }
  });
});

// Users routes
app.get('/api/users', auth, (req, res) => {
  const users = mockUsers.map(user => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    department: user.department,
    isActive: user.isActive
  }));

  res.json({
    success: true,
    data: { users }
  });
});

app.get('/api/users/profile', auth, (req, res) => {
  const user = {
    id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    department: req.user.department,
    permissions: req.user.permissions
  };

  res.json({
    success: true,
    data: { user }
  });
});

// System routes
app.get('/api/system/metrics', auth, (req, res) => {
  const systemMetrics = {
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
    data: systemMetrics
  });
});

// Reports routes
app.get('/api/reports/dashboard', auth, (req, res) => {
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
});

// Additional routes for complete functionality

// Emergency alerts route
app.get('/api/medical/emergency-alerts', auth, (req, res) => {
  const alerts = [
    {
      id: 'alert_001',
      type: 'cardiac_arrest',
      patient: {
        id: '507f1f77bcf86cd799439025',
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
        id: '507f1f77bcf86cd799439026',
        name: 'Miguel Ángel Torres',
        documentNumber: '44556677',
        age: 65
      },
      location: 'UCI-02',
      department: 'UCI',
      severity: 'high',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
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
      }
    }
  });
});

// Laboratory results route
app.get('/api/medical/labs-imaging', auth, (req, res) => {
  const labResults = [
    {
      id: 'lab_001',
      patientId: '507f1f77bcf86cd799439021',
      patientName: 'Juan Carlos Pérez',
      testType: 'Hemograma Completo',
      status: 'completed',
      requestDate: new Date('2024-01-15T08:00:00'),
      completedDate: new Date('2024-01-15T14:30:00'),
      results: {
        hemoglobin: '14.2 g/dL',
        hematocrit: '42.1%',
        leukocytes: '7,200/μL',
        platelets: '285,000/μL'
      },
      normalRanges: {
        hemoglobin: '13.5-17.5 g/dL',
        hematocrit: '41-53%',
        leukocytes: '4,500-11,000/μL',
        platelets: '150,000-450,000/μL'
      },
      doctor: 'Dr. Carlos Martínez',
      technician: 'Lab Tech María'
    },
    {
      id: 'img_001',
      patientId: '507f1f77bcf86cd799439022',
      patientName: 'María Elena Rodríguez',
      testType: 'Radiografía de Tórax',
      status: 'pending',
      requestDate: new Date('2024-01-16T10:00:00'),
      scheduledDate: new Date('2024-01-16T16:00:00'),
      doctor: 'Dra. María González',
      technician: 'Rad Tech Pedro',
      priority: 'routine'
    }
  ];

  res.json({
    success: true,
    data: {
      labResults,
      totalTests: labResults.length,
      byStatus: {
        completed: labResults.filter(l => l.status === 'completed').length,
        pending: labResults.filter(l => l.status === 'pending').length,
        in_progress: labResults.filter(l => l.status === 'in_progress').length
      }
    }
  });
});

// Telemedicine route
app.get('/api/medical/telemedicine', auth, (req, res) => {
  const sessions = [
    {
      id: 'tele_001',
      patientId: '507f1f77bcf86cd799439021',
      patientName: 'Juan Carlos Pérez',
      doctorId: '507f1f77bcf86cd799439012',
      doctorName: 'Dr. Carlos Martínez',
      scheduledDate: new Date('2024-01-17T15:00:00'),
      duration: 30,
      status: 'scheduled',
      type: 'follow_up',
      platform: 'VITARIS Video',
      notes: 'Control post-operatorio remoto'
    },
    {
      id: 'tele_002',
      patientId: '507f1f77bcf86cd799439022',
      patientName: 'María Elena Rodríguez',
      doctorId: '507f1f77bcf86cd799439013',
      doctorName: 'Dra. María González',
      scheduledDate: new Date('2024-01-17T11:00:00'),
      duration: 45,
      status: 'in_progress',
      type: 'consultation',
      platform: 'VITARIS Video',
      notes: 'Consulta de diabetes'
    }
  ];

  res.json({
    success: true,
    data: {
      sessions,
      totalSessions: sessions.length,
      byStatus: {
        scheduled: sessions.filter(s => s.status === 'scheduled').length,
        in_progress: sessions.filter(s => s.status === 'in_progress').length,
        completed: sessions.filter(s => s.status === 'completed').length
      }
    }
  });
});

// Inventory management route
app.get('/api/inventory', auth, (req, res) => {
  const inventory = [
    {
      id: 'inv_001',
      category: 'medical_supplies',
      name: 'Guantes de Látex',
      currentStock: 2500,
      minStock: 500,
      maxStock: 5000,
      unit: 'unidades',
      cost: 0.15,
      supplier: 'Suministros Médicos SA',
      lastRestocked: new Date('2024-01-10T00:00:00'),
      expiryDate: new Date('2025-01-10T00:00:00'),
      location: 'Almacén A-1'
    },
    {
      id: 'inv_002',
      category: 'equipment',
      name: 'Termómetros Digitales',
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      unit: 'unidades',
      cost: 25.50,
      supplier: 'Equipos Médicos Ltda',
      lastRestocked: new Date('2024-01-05T00:00:00'),
      location: 'Almacén B-2'
    }
  ];

  res.json({
    success: true,
    data: {
      inventory,
      totalItems: inventory.length,
      lowStock: inventory.filter(i => i.currentStock <= i.minStock).length,
      totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
    }
  });
});

// Billing and financial route
app.get('/api/billing', auth, (req, res) => {
  const bills = [
    {
      id: 'bill_001',
      patientId: '507f1f77bcf86cd799439021',
      patientName: 'Juan Carlos Pérez',
      admissionId: 'adm_001',
      totalAmount: 2500000,
      paidAmount: 0,
      pendingAmount: 2500000,
      status: 'pending',
      dueDate: new Date('2024-02-15T00:00:00'),
      items: [
        { description: 'Consulta Cardiología', amount: 150000 },
        { description: 'Angioplastia', amount: 2000000 },
        { description: 'Medicamentos', amount: 350000 }
      ],
      insurance: {
        provider: 'EPS Sanitas',
        coverage: 80,
        coveredAmount: 2000000,
        patientResponsibility: 500000
      }
    }
  ];

  res.json({
    success: true,
    data: {
      bills,
      totalBills: bills.length,
      totalPending: bills.reduce((sum, bill) => sum + bill.pendingAmount, 0),
      totalPaid: bills.reduce((sum, bill) => sum + bill.paidAmount, 0)
    }
  });
});

// Quality metrics route
app.get('/api/quality/metrics', auth, (req, res) => {
  const qualityMetrics = {
    patientSatisfaction: {
      overall: 92.3,
      nursing: 94.1,
      medical: 91.8,
      facilities: 89.5,
      food: 87.2
    },
    clinicalIndicators: {
      mortalityRate: 2.1,
      readmissionRate: 8.5,
      infectionRate: 1.2,
      averageLengthOfStay: 4.2
    },
    staffMetrics: {
      nursePatientRatio: 1.2,
      physicianAvailability: 95.8,
      staffSatisfaction: 88.7,
      turnoverRate: 12.3
    },
    operationalMetrics: {
      bedOccupancyRate: 85.4,
      emergencyWaitTime: 25,
      surgeryOnTimeRate: 94.2,
      dischargeEfficiency: 91.7
    }
  };

  res.json({
    success: true,
    data: qualityMetrics
  });
});

// Audit logs route
app.get('/api/audit/logs', auth, (req, res) => {
  const auditLogs = [
    {
      id: 'audit_001',
      timestamp: new Date(),
      userId: '507f1f77bcf86cd799439011',
      userName: 'Super Admin',
      action: 'patient_access',
      resource: 'patient_12345678',
      details: 'Accessed patient medical record',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      success: true
    },
    {
      id: 'audit_002',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      userId: '507f1f77bcf86cd799439012',
      userName: 'Dr. Carlos Martínez',
      action: 'prescription_create',
      resource: 'prescription_001',
      details: 'Created new prescription for patient',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0...',
      success: true
    }
  ];

  res.json({
    success: true,
    data: {
      logs: auditLogs,
      totalLogs: auditLogs.length,
      recentActivity: auditLogs.filter(log =>
        new Date() - new Date(log.timestamp) < 24 * 60 * 60 * 1000
      ).length
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /health',
      'POST /api/auth/login',
      'GET /api/auth/verify-token',
      'GET /api/patients',
      'GET /api/medical/vital-signs',
      'GET /api/medical/metrics',
      'GET /api/medical/admissions',
      'GET /api/medical/surgeries',
      'GET /api/medical/emergency-alerts',
      'GET /api/medical/labs-imaging',
      'GET /api/medical/telemedicine',
      'GET /api/notifications',
      'GET /api/appointments',
      'GET /api/pharmacy/medications',
      'GET /api/users',
      'GET /api/users/profile',
      'GET /api/system/metrics',
      'GET /api/reports/dashboard',
      'GET /api/inventory',
      'GET /api/billing',
      'GET /api/quality/metrics',
      'GET /api/audit/logs'
    ]
  });
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// File upload route (multipart/form-data)
app.post('/api/files/upload', auth, (req, res) => {
  // Simulate file upload
  const uploadedFile = {
    id: `file_${Date.now()}`,
    filename: 'document.pdf',
    originalName: 'patient_document.pdf',
    size: 1024000,
    mimetype: 'application/pdf',
    uploadDate: new Date(),
    uploadedBy: req.user._id,
    type: 'patient'
  };

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: { file: uploadedFile }
  });
});

// File delete route
app.delete('/api/files/:fileId', auth, (req, res) => {
  const { fileId } = req.params;

  res.json({
    success: true,
    message: 'File deleted successfully',
    data: { fileId }
  });
});

// Advanced patient routes
app.put('/api/patients/:id/vital-signs', auth, (req, res) => {
  const { id } = req.params;
  const vitalSigns = req.body;

  res.json({
    success: true,
    message: 'Vital signs updated successfully',
    data: { patientId: id, vitalSigns }
  });
});

app.post('/api/patients/:id/notes', auth, (req, res) => {
  const { id } = req.params;
  const { content, isPrivate } = req.body;

  const note = {
    id: `note_${Date.now()}`,
    patientId: id,
    content,
    isPrivate: isPrivate || false,
    createdBy: req.user._id,
    createdAt: new Date()
  };

  res.json({
    success: true,
    message: 'Note added successfully',
    data: { note }
  });
});

app.get('/api/patients/:id/history', auth, (req, res) => {
  const { id } = req.params;

  const history = [
    {
      id: 'hist_001',
      date: new Date('2024-01-15'),
      type: 'admission',
      description: 'Ingreso por dolor torácico',
      doctor: 'Dr. Carlos Martínez'
    },
    {
      id: 'hist_002',
      date: new Date('2024-01-16'),
      type: 'procedure',
      description: 'Angioplastia coronaria',
      doctor: 'Dr. Carlos Martínez'
    }
  ];

  res.json({
    success: true,
    data: { history }
  });
});

app.get('/api/patients/search', auth, (req, res) => {
  const { q, type } = req.query;

  // Simulate search results
  const searchResults = mockPatients.filter(patient => {
    switch (type) {
      case 'name':
        return patient.firstName.toLowerCase().includes(q.toLowerCase()) ||
               patient.lastName.toLowerCase().includes(q.toLowerCase());
      case 'document':
        return patient.documentNumber.includes(q);
      case 'email':
        return patient.email?.toLowerCase().includes(q.toLowerCase());
      case 'phone':
        return patient.phone?.includes(q);
      default:
        return patient.firstName.toLowerCase().includes(q.toLowerCase()) ||
               patient.lastName.toLowerCase().includes(q.toLowerCase()) ||
               patient.documentNumber.includes(q);
    }
  });

  res.json({
    success: true,
    data: { patients: searchResults }
  });
});

// Advanced appointment routes
app.post('/api/appointments', auth, (req, res) => {
  const appointment = {
    id: `apt_${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    createdBy: req.user._id
  };

  res.json({
    success: true,
    message: 'Appointment created successfully',
    data: { appointment }
  });
});

app.put('/api/appointments/:id', auth, (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: 'Appointment updated successfully',
    data: { appointmentId: id, ...req.body }
  });
});

app.put('/api/appointments/:id/cancel', auth, (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  res.json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: { appointmentId: id, reason, cancelledBy: req.user._id }
  });
});

// Advanced user routes
app.post('/api/users', auth, checkPermission(['admin_users']), (req, res) => {
  const user = {
    id: `user_${Date.now()}`,
    ...req.body,
    createdAt: new Date(),
    createdBy: req.user._id,
    isActive: true
  };

  res.json({
    success: true,
    message: 'User created successfully',
    data: { user }
  });
});

app.put('/api/users/:id', auth, checkPermission(['admin_users']), (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { userId: id, ...req.body }
  });
});

app.put('/api/users/:id/deactivate', auth, checkPermission(['admin_users']), (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: 'User deactivated successfully',
    data: { userId: id, deactivatedBy: req.user._id }
  });
});

app.post('/api/users/:id/reset-password', auth, checkPermission(['admin_users']), (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: 'Password reset successfully',
    data: { userId: id, resetBy: req.user._id }
  });
});

// System configuration routes
app.get('/api/system/config', auth, checkPermission(['admin_system']), (req, res) => {
  const config = {
    hospital: {
      name: 'Hospital Universitario del Valle',
      address: 'Calle 5 # 36-08, Cali, Colombia',
      phone: '+57 (2) 555-0123',
      email: 'info@huv.gov.co'
    },
    system: {
      version: '2.0.0',
      environment: 'production',
      maintenanceMode: false,
      backupEnabled: true,
      notificationsEnabled: true
    },
    features: {
      telemedicine: true,
      aiAssistant: false,
      mobileApp: true,
      voiceCommands: false,
      biometricAuth: false,
      blockchain: false,
      iot: true,
      analytics: true
    }
  };

  res.json({
    success: true,
    data: { config }
  });
});

app.put('/api/system/config', auth, checkPermission(['admin_system']), (req, res) => {
  res.json({
    success: true,
    message: 'System configuration updated successfully',
    data: { config: req.body, updatedBy: req.user._id }
  });
});

app.post('/api/system/backup', auth, checkPermission(['admin_system']), (req, res) => {
  const backup = {
    id: `backup_${Date.now()}`,
    filename: `vitaris_backup_${new Date().toISOString().split('T')[0]}.sql`,
    size: 15728640, // 15MB
    createdAt: new Date(),
    createdBy: req.user._id,
    type: 'full'
  };

  res.json({
    success: true,
    message: 'Backup created successfully',
    data: { backup }
  });
});

app.post('/api/system/restore', auth, checkPermission(['admin_system']), (req, res) => {
  const { backupId } = req.body;

  res.json({
    success: true,
    message: 'System restored successfully',
    data: { backupId, restoredBy: req.user._id, restoredAt: new Date() }
  });
});

// WebSocket simulation endpoint
app.get('/api/realtime/connect', auth, (req, res) => {
  res.json({
    success: true,
    message: 'WebSocket connection established',
    data: {
      connectionId: `ws_${Date.now()}`,
      userId: req.user._id,
      connectedAt: new Date()
    }
  });
});

// Complete system status endpoint
app.get('/api/system/complete-status', auth, (req, res) => {
  const completeStatus = {
    system: {
      version: '2.0.0',
      environment: 'production',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    },
    modules: {
      medical: {
        patients: { status: 'active', count: 1247 },
        admissions: { status: 'active', count: 89 },
        surgeries: { status: 'active', count: 23 },
        pharmacy: { status: 'active', count: 456 },
        inventory: { status: 'active', count: 1890 },
        billing: { status: 'active', count: 567 },
        telemedicine: { status: 'active', count: 34 },
        labs: { status: 'active', count: 234 },
        icu: { status: 'active', count: 12 },
        emergency: { status: 'active', count: 45 },
        consultations: { status: 'active', count: 123 },
        appointments: { status: 'active', count: 89 }
      },
      administrative: {
        users: { status: 'active', count: 247 },
        audit: { status: 'active', count: 15678 },
        quality: { status: 'active', metrics: 'updated' },
        reports: { status: 'active', count: 456 },
        backup: { status: 'active', lastBackup: new Date() }
      },
      system: {
        notifications: { status: 'active', count: 123 },
        metrics: { status: 'active', realtime: true },
        configuration: { status: 'active', version: '2.0.0' },
        security: { status: 'active', level: 'high' }
      }
    },
    statistics: {
      totalUsers: 247,
      activeUsers: 89,
      patientsToday: 67,
      totalModules: 18,
      systemHealth: 100,
      apiResponseTime: 150,
      databaseConnections: 25,
      memoryUsage: Math.round((process.memoryUsage().used / 1024 / 1024) * 100) / 100
    }
  };

  res.json({
    success: true,
    data: completeStatus
  });
});

// Module usage analytics
app.get('/api/analytics/module-usage', auth, (req, res) => {
  const moduleUsage = [
    { module: 'patients', usage: 95, trend: 'up' },
    { module: 'admissions', usage: 87, trend: 'stable' },
    { module: 'surgeries', usage: 76, trend: 'up' },
    { module: 'pharmacy', usage: 89, trend: 'up' },
    { module: 'inventory', usage: 67, trend: 'down' },
    { module: 'billing', usage: 78, trend: 'up' },
    { module: 'telemedicine', usage: 45, trend: 'up' },
    { module: 'labs', usage: 82, trend: 'stable' },
    { module: 'icu', usage: 98, trend: 'stable' },
    { module: 'emergency', usage: 91, trend: 'up' },
    { module: 'audit', usage: 34, trend: 'stable' },
    { module: 'quality', usage: 56, trend: 'up' },
    { module: 'reports', usage: 67, trend: 'stable' },
    { module: 'system-config', usage: 23, trend: 'stable' }
  ];

  res.json({
    success: true,
    data: { moduleUsage }
  });
});

// System performance metrics
app.get('/api/system/performance', auth, (req, res) => {
  const performance = {
    cpu: {
      usage: Math.random() * 30 + 20, // 20-50%
      cores: 8,
      temperature: Math.random() * 20 + 45 // 45-65°C
    },
    memory: {
      total: 16384, // 16GB
      used: Math.random() * 8192 + 4096, // 4-12GB
      available: 16384 - (Math.random() * 8192 + 4096),
      percentage: Math.random() * 50 + 25 // 25-75%
    },
    disk: {
      total: 1024, // 1TB
      used: Math.random() * 512 + 256, // 256-768GB
      available: 1024 - (Math.random() * 512 + 256),
      percentage: Math.random() * 50 + 25 // 25-75%
    },
    network: {
      inbound: Math.random() * 100 + 50, // 50-150 Mbps
      outbound: Math.random() * 50 + 25, // 25-75 Mbps
      latency: Math.random() * 10 + 5 // 5-15ms
    },
    database: {
      connections: Math.floor(Math.random() * 50 + 10), // 10-60
      queryTime: Math.random() * 100 + 50, // 50-150ms
      size: Math.random() * 10 + 5 // 5-15GB
    }
  };

  res.json({
    success: true,
    data: { performance }
  });
});

// Advanced search across all modules
app.get('/api/search/global', auth, (req, res) => {
  const { q, modules, limit = 50 } = req.query;

  // Simulate global search results
  const searchResults = [
    {
      type: 'patient',
      id: 'pat_001',
      title: 'Juan Carlos Pérez',
      description: 'Paciente - Documento: 12345678',
      module: 'patients',
      url: '/patient-detail/pat_001',
      relevance: 95
    },
    {
      type: 'user',
      id: 'user_001',
      title: 'Dr. Carlos Martínez',
      description: 'Médico - Cardiología',
      module: 'users',
      url: '/admin/users/user_001',
      relevance: 87
    },
    {
      type: 'appointment',
      id: 'apt_001',
      title: 'Cita Cardiología',
      description: 'Consulta programada para mañana',
      module: 'appointments',
      url: '/medical/appointments/apt_001',
      relevance: 76
    },
    {
      type: 'medication',
      id: 'med_001',
      title: 'Aspirina 100mg',
      description: 'Medicamento - Stock: 250 unidades',
      module: 'pharmacy',
      url: '/medical/pharmacy/med_001',
      relevance: 65
    }
  ].filter(result =>
    !q || result.title.toLowerCase().includes(q.toLowerCase()) ||
    result.description.toLowerCase().includes(q.toLowerCase())
  ).slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      results: searchResults,
      total: searchResults.length,
      query: q
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🏥 ═══════════════════════════════════════════');
  console.log('🏥 VITARIS - Sistema Hospitalario Iniciado');
  console.log('🏥 ═══════════════════════════════════════════');
  console.log('');
  console.log(`📊 Servidor: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/system/metrics`);
  console.log('');
  console.log('🔑 CREDENCIALES DE DEMO:');
  console.log('   👨‍💼 Admin: admin@vitaris.com / Admin123!');
  console.log('   👨‍⚕️ Doctor: carlos.martinez@vitaris.com / Doctor123!');
  console.log('');
  console.log('📋 RUTAS DISPONIBLES:');
  console.log('   🔐 Autenticación: /api/auth/*');
  console.log('   👥 Pacientes: /api/patients/*');
  console.log('   🏥 Sistema Médico: /api/medical/*');
  console.log('   🔔 Notificaciones: /api/notifications/*');
  console.log('   📅 Citas: /api/appointments/*');
  console.log('   💊 Farmacia: /api/pharmacy/*');
  console.log('   👤 Usuarios: /api/users/*');
  console.log('   ⚙️  Sistema: /api/system/*');
  console.log('   📊 Reportes: /api/reports/*');
  console.log('   📦 Inventario: /api/inventory/*');
  console.log('   💰 Facturación: /api/billing/*');
  console.log('   📈 Calidad: /api/quality/*');
  console.log('   📋 Auditoría: /api/audit/*');
  console.log('');
  console.log('✅ Sistema VITARIS completamente operativo');
  console.log('🏥 ═══════════════════════════════════════════');
  console.log('');
});

module.exports = { app, server };
