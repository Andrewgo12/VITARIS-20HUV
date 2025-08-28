import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Tipos para los datos de pacientes
interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalHistory: string[]
  allergies: string[]
  currentMedications: string[]
  lastVisit: string
  nextAppointment: string
  status: 'Active' | 'Inactive' | 'Follow-up'
  assignedDoctor: string
  insuranceInfo: {
    provider: string
    policyNumber: string
    coverage: string
  }
  communicationHistory: Array<{
    date: string
    type: 'Email' | 'Phone' | 'Visit'
    summary: string
    doctor: string
  }>
  followUpRequired: boolean
  riskLevel: 'Low' | 'Medium' | 'High'
  emailSource: {
    originalSubject: string
    originalSender: string
    originalDate: string
    sourceType: string
    sourcePath: string
  }
}

interface PatientData {
  metadata: {
    generated_at: string
    total_patients: number
    source: string
    version: string
  }
  patients: Patient[]
  statistics: {
    by_status: Record<string, number>
    by_risk_level: Record<string, number>
    by_gender: Record<string, number>
    by_age_group: Record<string, number>
  }
}

// Datos de pacientes por defecto (fallback)
const defaultPatients: Patient[] = [
  {
    id: "PAT-2024-001",
    name: "María Elena Rodríguez",
    age: 45,
    gender: "Femenino",
    phone: "+57 300 123 4567",
    email: "maria.rodriguez@email.com",
    address: "Calle 123 #45-67, Bogotá",
    emergencyContact: {
      name: "Carlos Rodríguez",
      relationship: "Esposo",
      phone: "+57 301 234 5678"
    },
    medicalHistory: [
      "Hipertensión arterial",
      "Diabetes mellitus tipo 2",
      "Antecedente familiar de enfermedad cardiovascular"
    ],
    allergies: ["Penicilina", "Mariscos"],
    currentMedications: ["Losartán 50mg", "Metformina 850mg", "Atorvastatina 20mg"],
    lastVisit: "2024-01-15T14:30:00Z",
    nextAppointment: "2024-02-15T10:00:00Z",
    status: "Active",
    assignedDoctor: "Dr. Carlos Mendoza",
    insuranceInfo: {
      provider: "EPS Sanitas",
      policyNumber: "123456789",
      coverage: "Plan Complementario"
    },
    communicationHistory: [
      {
        date: "2024-01-15T14:30:00Z",
        type: "Email",
        summary: "Consulta por dolor torácico agudo",
        doctor: "Dr. Carlos Mendoza"
      }
    ],
    followUpRequired: true,
    riskLevel: "High",
    emailSource: {
      originalSubject: "Seguimiento paciente - María Elena Rodríguez",
      originalSender: "cmendoza@hospitalsanjose.com",
      originalDate: "2024-01-15T14:30:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/patient_001"
    }
  },
  {
    id: "PAT-2024-002",
    name: "Carlos Alberto Pérez",
    age: 62,
    gender: "Masculino",
    phone: "+57 301 987 6543",
    email: "carlos.perez@email.com",
    address: "Carrera 45 #123-89, Medellín",
    emergencyContact: {
      name: "Ana Pérez",
      relationship: "Hija",
      phone: "+57 302 345 6789"
    },
    medicalHistory: [
      "Infarto agudo de miocardio previo",
      "Hipertensión arterial",
      "Dislipidemia"
    ],
    allergies: ["Aspirina"],
    currentMedications: ["Enalapril 10mg", "Furosemida 40mg", "Clopidogrel 75mg"],
    lastVisit: "2024-01-15T13:58:00Z",
    nextAppointment: "2024-01-30T15:30:00Z",
    status: "Follow-up",
    assignedDoctor: "Dra. Ana García",
    insuranceInfo: {
      provider: "Nueva EPS",
      policyNumber: "987654321",
      coverage: "Plan Básico"
    },
    communicationHistory: [
      {
        date: "2024-01-15T13:58:00Z",
        type: "Email",
        summary: "Consulta cardiológica - Insuficiencia cardíaca",
        doctor: "Dra. Ana García"
      }
    ],
    followUpRequired: true,
    riskLevel: "Medium",
    emailSource: {
      originalSubject: "Seguimiento cardiológico - Carlos Alberto Pérez",
      originalSender: "agarcia@clinicacentral.com",
      originalDate: "2024-01-15T13:58:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/patient_002"
    }
  }
]

// Función para cargar datos de pacientes desde el archivo generado por el transformer
function loadPatientDataFromFile(): PatientData | null {
  try {
    // Ruta al archivo generado por el transformer de Gmail
    const filePath = path.join(process.cwd(), 'ia', 'patient_data_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: PatientData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.patients.length} patients from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail patient data file not found, using default patients')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading patient data from file:', error)
    return null
  }
}

// Función para generar estadísticas de los pacientes por defecto
function generateDefaultStatistics(patients: Patient[]) {
  const stats = {
    by_status: { Active: 0, Inactive: 0, 'Follow-up': 0 },
    by_risk_level: { Low: 0, Medium: 0, High: 0 },
    by_gender: { Masculino: 0, Femenino: 0, Otro: 0 },
    by_age_group: { '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0 }
  }

  patients.forEach(patient => {
    // Contar por estado
    stats.by_status[patient.status] = (stats.by_status[patient.status] || 0) + 1
    
    // Contar por nivel de riesgo
    stats.by_risk_level[patient.riskLevel] = (stats.by_risk_level[patient.riskLevel] || 0) + 1
    
    // Contar por género
    stats.by_gender[patient.gender] = (stats.by_gender[patient.gender] || 0) + 1
    
    // Contar por grupo de edad
    if (patient.age <= 18) stats.by_age_group['0-18']++
    else if (patient.age <= 35) stats.by_age_group['19-35']++
    else if (patient.age <= 50) stats.by_age_group['36-50']++
    else if (patient.age <= 65) stats.by_age_group['51-65']++
    else stats.by_age_group['65+']++
  })

  return stats
}

// GET - Obtener todos los datos de pacientes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const riskLevel = searchParams.get('riskLevel')
    const search = searchParams.get('search')

    // Intentar cargar datos desde Gmail, si no usar datos por defecto
    let patientData = loadPatientDataFromFile()
    
    if (!patientData) {
      // Usar datos por defecto
      patientData = {
        metadata: {
          generated_at: new Date().toISOString(),
          total_patients: defaultPatients.length,
          source: 'Default Patient Data',
          version: '1.0'
        },
        patients: defaultPatients,
        statistics: generateDefaultStatistics(defaultPatients)
      }
    }

    let filteredPatients = patientData.patients

    // Aplicar filtros
    if (status && status !== 'all') {
      filteredPatients = filteredPatients.filter(patient => patient.status === status)
    }

    if (riskLevel && riskLevel !== 'all') {
      filteredPatients = filteredPatients.filter(patient => patient.riskLevel === riskLevel)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPatients = filteredPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchLower) ||
        patient.id.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...patientData,
        patients: filteredPatients,
        filtered_count: filteredPatients.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/patient-data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: {
          metadata: {
            generated_at: new Date().toISOString(),
            total_patients: 0,
            source: 'Error fallback',
            version: '1.0'
          },
          patients: [],
          statistics: { by_status: {}, by_risk_level: {}, by_gender: {}, by_age_group: {} }
        }
      },
      { status: 500 }
    )
  }
}

// POST - Actualizar datos de un paciente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientId, action, data } = body

    console.log(`[API] Processing action '${action}' for patient ${patientId}`)

    // Aquí se podría implementar la lógica para actualizar los datos del paciente
    // Por ahora solo retornamos éxito
    return NextResponse.json({
      success: true,
      message: `Paciente ${patientId} actualizado correctamente`,
      action,
      data
    })

  } catch (error) {
    console.error('[API] Error in POST /api/patient-data:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
