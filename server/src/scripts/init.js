const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const logger = require('../utils/logger');
require('dotenv').config();

// Sample users data
const sampleUsers = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@vitaris.com',
    password: 'Admin123!',
    role: 'super_admin',
    department: 'Administración',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Dr. Carlos',
    lastName: 'Martínez',
    email: 'carlos.martinez@vitaris.com',
    password: 'Doctor123!',
    role: 'doctor',
    department: 'Cardiología',
    specialization: 'Cardiología Intervencionista',
    licenseNumber: 'MD-12345',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Dra. María',
    lastName: 'González',
    email: 'maria.gonzalez@vitaris.com',
    password: 'Doctor123!',
    role: 'doctor',
    department: 'Medicina Interna',
    specialization: 'Medicina Interna',
    licenseNumber: 'MD-12346',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Enfermera Ana',
    lastName: 'López',
    email: 'ana.lopez@vitaris.com',
    password: 'Nurse123!',
    role: 'nurse',
    department: 'UCI',
    licenseNumber: 'RN-12345',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Farm. Pedro',
    lastName: 'Rodríguez',
    email: 'pedro.rodriguez@vitaris.com',
    password: 'Pharm123!',
    role: 'pharmacist',
    department: 'Farmacia',
    licenseNumber: 'PH-12345',
    isActive: true,
    isVerified: true
  },
  {
    firstName: 'Recep. Laura',
    lastName: 'Hernández',
    email: 'laura.hernandez@vitaris.com',
    password: 'Recep123!',
    role: 'receptionist',
    department: 'Recepción',
    isActive: true,
    isVerified: true
  }
];

// Sample patients data
const samplePatients = [
  {
    firstName: 'Juan Carlos',
    lastName: 'Pérez González',
    documentType: 'CC',
    documentNumber: '12345678',
    dateOfBirth: new Date('1978-05-15'),
    gender: 'M',
    bloodType: 'O+',
    phone: '+57 300 123 4567',
    email: 'juan.perez@email.com',
    address: {
      street: 'Calle 15 #25-30',
      city: 'Cali',
      state: 'Valle del Cauca',
      zipCode: '760001',
      country: 'Colombia'
    },
    emergencyContact: {
      name: 'María Pérez',
      relationship: 'Esposa',
      phone: '+57 300 765 4321',
      email: 'maria.perez@email.com'
    },
    insurance: {
      provider: 'EPS Sanitas',
      policyNumber: 'SAN-123456789',
      validUntil: new Date('2024-12-31')
    },
    allergies: [
      {
        allergen: 'Penicilina',
        severity: 'severe',
        reaction: 'Erupción cutánea',
        notes: 'Reacción severa documentada en 2020'
      }
    ],
    chronicConditions: [
      {
        condition: 'Hipertensión Arterial',
        diagnosedDate: new Date('2020-03-10'),
        status: 'active',
        notes: 'Controlada con medicación'
      }
    ],
    vitalSigns: {
      height: 175,
      weight: 80,
      bloodPressure: {
        systolic: 130,
        diastolic: 85
      },
      heartRate: 72,
      temperature: 36.5,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      lastUpdated: new Date()
    },
    status: 'active'
  },
  {
    firstName: 'María Elena',
    lastName: 'Rodríguez Silva',
    documentType: 'CC',
    documentNumber: '87654321',
    dateOfBirth: new Date('1955-11-22'),
    gender: 'F',
    bloodType: 'A+',
    phone: '+57 301 987 6543',
    email: 'maria.rodriguez@email.com',
    address: {
      street: 'Carrera 10 #45-67',
      city: 'Cali',
      state: 'Valle del Cauca',
      zipCode: '760002',
      country: 'Colombia'
    },
    emergencyContact: {
      name: 'Carlos Rodríguez',
      relationship: 'Hijo',
      phone: '+57 301 234 5678'
    },
    insurance: {
      provider: 'Nueva EPS',
      policyNumber: 'NEP-987654321',
      validUntil: new Date('2024-12-31')
    },
    chronicConditions: [
      {
        condition: 'Diabetes Tipo 2',
        diagnosedDate: new Date('2018-07-15'),
        status: 'active',
        notes: 'Requiere monitoreo constante de glucosa'
      }
    ],
    vitalSigns: {
      height: 160,
      weight: 65,
      bloodPressure: {
        systolic: 140,
        diastolic: 90
      },
      heartRate: 78,
      temperature: 36.3,
      respiratoryRate: 18,
      oxygenSaturation: 96,
      lastUpdated: new Date()
    },
    status: 'active'
  },
  {
    firstName: 'Roberto',
    lastName: 'Silva Martínez',
    documentType: 'CC',
    documentNumber: '11223344',
    dateOfBirth: new Date('1990-08-30'),
    gender: 'M',
    bloodType: 'B+',
    phone: '+57 302 456 7890',
    email: 'roberto.silva@email.com',
    address: {
      street: 'Avenida 6N #28-15',
      city: 'Cali',
      state: 'Valle del Cauca',
      zipCode: '760003',
      country: 'Colombia'
    },
    emergencyContact: {
      name: 'Ana Silva',
      relationship: 'Madre',
      phone: '+57 302 789 0123'
    },
    insurance: {
      provider: 'Compensar EPS',
      policyNumber: 'COM-112233445',
      validUntil: new Date('2024-12-31')
    },
    vitalSigns: {
      height: 180,
      weight: 75,
      bloodPressure: {
        systolic: 120,
        diastolic: 80
      },
      heartRate: 68,
      temperature: 36.7,
      respiratoryRate: 14,
      oxygenSaturation: 99,
      lastUpdated: new Date()
    },
    status: 'active'
  }
];

const initializeDatabase = async () => {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitaris';
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB for initialization');

    // Clear existing data (only in development)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Patient.deleteMany({});
      logger.info('Cleared existing data');
    }

    // Create admin user first
    const adminUser = await User.create(sampleUsers[0]);
    logger.info(`Created admin user: ${adminUser.email}`);

    // Create other users with admin as creator
    for (let i = 1; i < sampleUsers.length; i++) {
      const userData = { ...sampleUsers[i], createdBy: adminUser._id };
      const user = await User.create(userData);
      logger.info(`Created user: ${user.email} (${user.role})`);
    }

    // Create sample patients
    for (const patientData of samplePatients) {
      const patient = await Patient.create({
        ...patientData,
        registeredBy: adminUser._id
      });
      logger.info(`Created patient: ${patient.fullName} (${patient.documentNumber})`);
    }

    logger.info('✅ Database initialization completed successfully!');
    logger.info('\n🔑 Default Admin Credentials:');
    logger.info('Email: admin@vitaris.com');
    logger.info('Password: Admin123!');
    logger.info('\n👨‍⚕️ Sample Doctor Credentials:');
    logger.info('Email: carlos.martinez@vitaris.com');
    logger.info('Password: Doctor123!');

  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase, sampleUsers, samplePatients };
