const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  
  // Role and Permissions
  role: {
    type: String,
    enum: [
      'super_admin',
      'admin',
      'doctor',
      'nurse',
      'pharmacist',
      'receptionist',
      'technician',
      'auditor',
      'guest',
      // VITAL RED specific roles
      'medical_evaluator',
      'vital_red_admin'
    ],
    default: 'guest'
  },
  permissions: [{
    type: String,
    enum: [
      'read_patients',
      'write_patients',
      'delete_patients',
      'read_medical_records',
      'write_medical_records',
      'read_appointments',
      'write_appointments',
      'cancel_appointments',
      'read_medications',
      'write_medications',
      'prescribe_medications',
      'read_reports',
      'write_reports',
      'admin_users',
      'admin_system',
      'emergency_access',
      'financial_data',
      'audit_logs'
    ]
  }],
  
  // Professional Information
  licenseNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  specialization: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Security
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // Two-Factor Authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },
  
  // Profile
  avatar: {
    type: String
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['es', 'en', 'fr'],
      default: 'es'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    timezone: {
      type: String,
      default: 'America/Bogota'
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Static method to get role permissions
userSchema.statics.getRolePermissions = function(role) {
  const rolePermissions = {
    super_admin: [
      'read_patients', 'write_patients', 'delete_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments', 'cancel_appointments',
      'read_medications', 'write_medications', 'prescribe_medications',
      'read_reports', 'write_reports',
      'admin_users', 'admin_system',
      'emergency_access', 'financial_data', 'audit_logs'
    ],
    admin: [
      'read_patients', 'write_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments', 'cancel_appointments',
      'read_medications', 'write_medications',
      'read_reports', 'write_reports',
      'admin_users', 'financial_data', 'audit_logs'
    ],
    doctor: [
      'read_patients', 'write_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments',
      'read_medications', 'write_medications', 'prescribe_medications',
      'read_reports', 'write_reports',
      'emergency_access'
    ],
    nurse: [
      'read_patients', 'write_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments',
      'read_medications', 'write_medications',
      'read_reports'
    ],
    pharmacist: [
      'read_patients',
      'read_medical_records',
      'read_medications', 'write_medications',
      'read_reports'
    ],
    receptionist: [
      'read_patients', 'write_patients',
      'read_appointments', 'write_appointments'
    ],
    technician: [
      'read_patients',
      'read_appointments',
      'read_reports'
    ],
    auditor: [
      'read_patients',
      'read_medical_records',
      'read_appointments',
      'read_medications',
      'read_reports',
      'audit_logs'
    ],
    guest: [
      'read_patients',
      'read_appointments'
    ],
    // VITAL RED specific roles
    medical_evaluator: [
      'read_patients',
      'read_medical_records',
      'write_medical_records',
      'read_appointments',
      'write_appointments',
      'read_reports',
      'write_reports',
      'evaluate_medical_cases',
      'make_transfer_decisions'
    ],
    vital_red_admin: [
      'read_patients', 'write_patients', 'delete_patients',
      'read_medical_records', 'write_medical_records',
      'read_appointments', 'write_appointments', 'cancel_appointments',
      'read_medications', 'write_medications',
      'read_reports', 'write_reports',
      'admin_users', 'admin_system',
      'audit_logs', 'system_configuration',
      'manage_medical_evaluators',
      'supervise_decisions',
      'backup_management',
      'ai_module_config'
    ]
  };
  
  return rolePermissions[role] || [];
};

module.exports = mongoose.model('User', userSchema);
