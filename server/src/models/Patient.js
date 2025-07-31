const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: ['CC', 'TI', 'CE', 'PP', 'RC', 'AS']
  },
  documentNumber: {
    type: String,
    required: [true, 'Document number is required'],
    unique: true,
    trim: true
  },
  
  // Demographics
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['M', 'F', 'O']
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Colombia' }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required']
    },
    relationship: {
      type: String,
      required: [true, 'Emergency contact relationship is required']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required']
    },
    email: String
  },
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    validUntil: Date
  },
  
  // Medical Information
  allergies: [{
    allergen: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    reaction: String,
    notes: String
  }],
  
  chronicConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'resolved']
    },
    notes: String
  }],
  
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date,
    prescribedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  
  // Current Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased', 'transferred'],
    default: 'active'
  },
  
  currentAdmission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission'
  },
  
  // Vital Signs (Latest)
  vitalSigns: {
    height: Number, // cm
    weight: Number, // kg
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number, // Celsius
    respiratoryRate: Number,
    oxygenSaturation: Number,
    lastUpdated: Date
  },
  
  // Medical History
  medicalHistory: [{
    date: Date,
    type: {
      type: String,
      enum: ['diagnosis', 'procedure', 'surgery', 'treatment', 'test']
    },
    description: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    attachments: [String]
  }],
  
  // Risk Factors
  riskFactors: {
    smoking: {
      status: {
        type: String,
        enum: ['never', 'former', 'current']
      },
      packsPerDay: Number,
      yearsSmoked: Number
    },
    alcohol: {
      status: {
        type: String,
        enum: ['never', 'occasional', 'regular', 'heavy']
      },
      drinksPerWeek: Number
    },
    familyHistory: [{
      condition: String,
      relationship: String,
      ageAtDiagnosis: Number
    }]
  },
  
  // Preferences
  preferences: {
    language: {
      type: String,
      default: 'es'
    },
    communicationMethod: {
      type: String,
      enum: ['phone', 'email', 'sms'],
      default: 'phone'
    },
    privacyLevel: {
      type: String,
      enum: ['public', 'restricted', 'private'],
      default: 'restricted'
    }
  },
  
  // Metadata
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Flags
  isVIP: {
    type: Boolean,
    default: false
  },
  isMinor: {
    type: Boolean,
    default: false
  },
  
  // Notes
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for BMI
patientSchema.virtual('bmi').get(function() {
  if (!this.vitalSigns?.height || !this.vitalSigns?.weight) return null;
  const heightInMeters = this.vitalSigns.height / 100;
  return (this.vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

// Indexes
patientSchema.index({ documentNumber: 1 });
patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ dateOfBirth: 1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ 'emergencyContact.phone': 1 });

// Pre-save middleware
patientSchema.pre('save', function(next) {
  // Set isMinor flag based on age
  if (this.dateOfBirth) {
    const age = this.age;
    this.isMinor = age < 18;
  }
  
  next();
});

// Static methods
patientSchema.statics.findByDocument = function(documentType, documentNumber) {
  return this.findOne({ documentType, documentNumber });
};

patientSchema.statics.findActivePatients = function() {
  return this.find({ status: 'active' });
};

patientSchema.statics.findByAge = function(minAge, maxAge) {
  const today = new Date();
  const maxBirthDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const minBirthDate = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate());
  
  return this.find({
    dateOfBirth: {
      $gte: minBirthDate,
      $lte: maxBirthDate
    }
  });
};

// Instance methods
patientSchema.methods.addMedicalHistory = function(entry) {
  this.medicalHistory.push({
    ...entry,
    date: entry.date || new Date()
  });
  return this.save();
};

patientSchema.methods.updateVitalSigns = function(vitalSigns) {
  this.vitalSigns = {
    ...this.vitalSigns,
    ...vitalSigns,
    lastUpdated: new Date()
  };
  return this.save();
};

patientSchema.methods.addNote = function(content, author, isPrivate = false) {
  this.notes.push({
    content,
    author,
    isPrivate,
    createdAt: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Patient', patientSchema);
