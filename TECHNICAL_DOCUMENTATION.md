# 📚 VITARIS v2.0.0 - Documentación Técnica Completa

## 🏗️ ARQUITECTURA DEL SISTEMA

### **Stack Tecnológico**

#### **Frontend (Cliente)**
```typescript
React 18.2.0 + TypeScript 5.0.0
├── Build Tool: Vite 4.4.0
├── Styling: Tailwind CSS 3.3.0
├── UI Components: Radix UI
├── Animations: Framer Motion 10.16.0
├── Routing: React Router 6.15.0
├── Icons: Lucide React 0.279.0
├── State Management: React Context + Hooks
├── HTTP Client: Fetch API
└── Development: ESLint + Prettier
```

#### **Backend (Servidor)**
```javascript
Node.js 18+ + Express 4.18.2
├── Authentication: JWT (jsonwebtoken)
├── Security: bcrypt + Helmet + CORS
├── Validation: Express Validator
├── Logging: Winston (ready)
├── Real-time: Socket.IO (ready)
├── Database: MongoDB/Mongoose (optional)
├── Environment: dotenv
└── Development: Nodemon
```

---

## 📁 ESTRUCTURA DETALLADA DEL PROYECTO

### **Frontend Structure**
```
client/
├── components/
│   ├── ui/                     # Componentes base (50+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── switch.tsx
│   │   ├── notification-system.tsx
│   │   └── analytics-dashboard.tsx
│   ├── medical/                # Componentes médicos
│   │   ├── PatientCard.tsx
│   │   ├── VitalSignsMonitor.tsx
│   │   └── MedicalChart.tsx
│   └── admin/                  # Componentes administrativos
│       ├── UserManagement.tsx
│       └── SystemMetrics.tsx
├── pages/                      # Páginas principales (15+)
│   ├── auth/
│   │   └── Login.tsx
│   ├── medical/
│   │   ├── PatientManagement.tsx
│   │   ├── RealTimeMetrics.tsx
│   │   ├── InventoryManagement.tsx
│   │   ├── BillingManagement.tsx
│   │   └── TelemedicineConsole.tsx
│   └── admin/
│       ├── AuditLogs.tsx
│       ├── QualityMetrics.tsx
│       └── SystemConfiguration.tsx
├── services/
│   └── api.ts                  # Cliente API completo
├── config/
│   └── system.ts               # Configuración del sistema
├── context/
│   └── LanguageContext.tsx     # Contexto de idioma
├── hooks/                      # Custom hooks
└── lib/
    └── utils.ts                # Utilidades
```

### **Backend Structure**
```
server/
├── src/
│   ├── routes/                 # Rutas API (25+)
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── appointments.js
│   │   ├── pharmacy.js
│   │   ├── reports.js
│   │   ├── users.js
│   │   └── system.js
│   ├── middleware/             # Middleware de seguridad
│   │   ├── auth.js
│   │   ├── checkPermission.js
│   │   └── errorHandler.js
│   ├── models/                 # Modelos de datos
│   │   ├── User.js
│   │   ├── Patient.js
│   │   └── Appointment.js
│   ├── utils/                  # Utilidades
│   │   ├── logger.js
│   │   └── email.js
│   ├── socket/                 # WebSocket handlers
│   │   └── handlers.js
│   ├── scripts/                # Scripts de inicialización
│   │   ├── init.js
│   │   └── backup.js
│   └── simple-server.js        # Servidor principal
├── logs/                       # Logs del sistema
└── .env                        # Variables de entorno
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN Y AUTORIZACIÓN

### **Roles de Usuario (9 roles)**
```javascript
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin', 
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PHARMACIST: 'pharmacist',
  RECEPTIONIST: 'receptionist',
  TECHNICIAN: 'technician',
  AUDITOR: 'auditor',
  GUEST: 'guest'
};
```

### **Permisos Granulares (19 permisos)**
```javascript
const PERMISSIONS = [
  // Pacientes
  'read_patients',
  'write_patients', 
  'delete_patients',
  
  // Registros médicos
  'read_medical_records',
  'write_medical_records',
  
  // Citas
  'read_appointments',
  'write_appointments',
  'cancel_appointments',
  
  // Medicamentos
  'read_medications',
  'write_medications',
  'prescribe_medications',
  
  // Reportes
  'read_reports',
  'write_reports',
  
  // Administración
  'admin_users',
  'admin_system',
  
  // Especiales
  'emergency_access',
  'financial_data',
  'audit_logs'
];
```

### **Flujo de Autenticación**
```javascript
// 1. Login
POST /api/auth/login
{
  "email": "admin@vitaris.com",
  "password": "Admin123!"
}

// 2. Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "Super",
      "lastName": "Admin",
      "email": "admin@vitaris.com",
      "role": "super_admin",
      "permissions": [...],
      "department": "Administración"
    }
  }
}

// 3. Uso del token
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🌐 API REST COMPLETA

### **Endpoints Implementados (25+)**

#### **Autenticación**
```
POST   /api/auth/login           # Login de usuario
GET    /api/auth/verify-token    # Verificar token
POST   /api/auth/logout          # Logout
```

#### **Pacientes**
```
GET    /api/patients             # Listar pacientes
GET    /api/patients/:id         # Obtener paciente
POST   /api/patients             # Crear paciente
PUT    /api/patients/:id         # Actualizar paciente
DELETE /api/patients/:id         # Eliminar paciente
GET    /api/patients/search      # Buscar pacientes
PUT    /api/patients/:id/vital-signs    # Actualizar signos vitales
POST   /api/patients/:id/notes   # Agregar nota
GET    /api/patients/:id/history # Historial del paciente
```

#### **Sistema Médico**
```
GET    /api/medical/vital-signs        # Signos vitales en tiempo real
GET    /api/medical/metrics           # Métricas hospitalarias
GET    /api/medical/admissions        # Admisiones
GET    /api/medical/surgeries         # Cirugías
GET    /api/medical/emergency-alerts  # Alertas de emergencia
GET    /api/medical/labs-imaging      # Laboratorios e imágenes
GET    /api/medical/telemedicine      # Sesiones de telemedicina
```

#### **Administración**
```
GET    /api/users                # Listar usuarios
POST   /api/users                # Crear usuario
PUT    /api/users/:id            # Actualizar usuario
DELETE /api/users/:id            # Eliminar usuario
GET    /api/users/profile        # Perfil del usuario
POST   /api/users/:id/reset-password  # Resetear contraseña
```

#### **Sistema**
```
GET    /health                   # Health check
GET    /api/system/metrics       # Métricas del sistema
GET    /api/system/config        # Configuración
PUT    /api/system/config        # Actualizar configuración
POST   /api/system/backup        # Crear backup
POST   /api/system/restore       # Restaurar backup
```

#### **Otros Módulos**
```
GET    /api/appointments         # Citas médicas
GET    /api/pharmacy/medications # Medicamentos
GET    /api/inventory            # Inventario
GET    /api/billing              # Facturación
GET    /api/quality/metrics      # Métricas de calidad
GET    /api/audit/logs           # Logs de auditoría
GET    /api/notifications        # Notificaciones
POST   /api/files/upload         # Subir archivos
DELETE /api/files/:id            # Eliminar archivos
```

---

## 💾 MODELO DE DATOS

### **Usuario**
```typescript
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // bcrypt hash
  role: UserRole;
  department: string;
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Paciente**
```typescript
interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'Other';
  bloodType?: string;
  phone?: string;
  email?: string;
  address?: Address;
  emergencyContact?: Contact;
  status: 'active' | 'inactive' | 'deceased';
  vitalSigns?: VitalSigns;
  medicalHistory?: MedicalRecord[];
  createdAt: Date;
  updatedAt: Date;
}
```

### **Signos Vitales**
```typescript
interface VitalSigns {
  heartRate: number;           // bpm
  bloodPressure: {
    systolic: number;          // mmHg
    diastolic: number;         // mmHg
  };
  temperature: number;         // °C
  oxygenSaturation: number;    // %
  respiratoryRate: number;     // rpm
  lastUpdated: Date;
}
```

---

## 🔒 SEGURIDAD IMPLEMENTADA

### **Autenticación JWT**
```javascript
// Configuración JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  algorithm: 'HS256'
};

// Middleware de autenticación
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### **Encriptación de Contraseñas**
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Encriptar contraseña
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Verificar contraseña
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

### **Middleware de Permisos**
```javascript
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions;
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### **Headers de Seguridad**
```javascript
// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Security Headers
app.use(helmet());

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

---

## 📊 MONITOREO Y LOGGING

### **Sistema de Logs**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### **Métricas del Sistema**
```javascript
const getSystemMetrics = () => ({
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
    totalRequests: requestCounter,
    avgResponseTime: calculateAvgResponseTime()
  }
});
```

---

## 🚀 DESPLIEGUE Y CONFIGURACIÓN

### **Variables de Entorno**
```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/vitaris

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Client
CLIENT_URL=https://vitaris.hospital.com

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Scripts de Despliegue**
```json
{
  "scripts": {
    "start": "node src/simple-server.js",
    "dev": "nodemon src/simple-server.js",
    "build": "npm run build:client",
    "build:client": "cd ../client && npm run build",
    "test": "jest",
    "lint": "eslint src/",
    "backup": "node src/scripts/backup.js"
  }
}
```

---

## 🧪 TESTING

### **Estructura de Tests**
```
tests/
├── unit/
│   ├── auth.test.js
│   ├── patients.test.js
│   └── utils.test.js
├── integration/
│   ├── api.test.js
│   └── database.test.js
└── e2e/
    ├── login.test.js
    └── patient-flow.test.js
```

### **Ejemplo de Test**
```javascript
const request = require('supertest');
const app = require('../src/simple-server');

describe('Authentication', () => {
  test('POST /api/auth/login - valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@vitaris.com',
        password: 'Admin123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

---

## 📈 RENDIMIENTO Y OPTIMIZACIÓN

### **Métricas de Rendimiento**
- **Tiempo de carga inicial**: < 2 segundos
- **Tiempo de respuesta API**: < 200ms
- **Actualización en tiempo real**: 2 segundos
- **Bundle size (gzipped)**: < 500KB
- **Lighthouse Score**: 95+

### **Optimizaciones Implementadas**
- **Code Splitting**: Lazy loading de componentes
- **Tree Shaking**: Eliminación de código no utilizado
- **Compression**: Gzip/Brotli en producción
- **Caching**: Headers de cache apropiados
- **Minification**: CSS y JS minificados
- **Image Optimization**: Formatos modernos (WebP)

---

## 🔧 MANTENIMIENTO

### **Backup Automático**
```javascript
const createBackup = async () => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `vitaris_backup_${timestamp}.sql`;
  
  // MongoDB backup
  exec(`mongodump --db vitaris --out ./backups/${filename}`, (error) => {
    if (error) {
      logger.error('Backup failed:', error);
    } else {
      logger.info(`Backup created: ${filename}`);
    }
  });
};
```

### **Health Checks**
```javascript
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0'
  };
  
  res.json(health);
});
```

---

## 📞 SOPORTE Y DOCUMENTACIÓN

### **Recursos Disponibles**
- **README.md**: Documentación principal
- **INSTALL.md**: Guía de instalación
- **STATUS.md**: Estado del sistema
- **TECHNICAL_DOCUMENTATION.md**: Este documento
- **API Documentation**: Swagger/OpenAPI (en desarrollo)

### **Contacto de Soporte**
- **GitHub**: https://github.com/hospital-valle/vitaris
- **Email**: soporte@vitaris.com
- **Documentación**: https://docs.vitaris.com

---

**🏥 VITARIS v2.0.0 - Sistema Hospitalario Completo**
*Documentación Técnica Completa*
*© 2024 VITARIS Development Team*
