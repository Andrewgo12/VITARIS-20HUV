import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Tipos para los datos de hospitalización
interface Hospitalization {
  id: string
  patientId: string
  patientName: string
  admissionDate: string
  dischargeDate?: string
  roomNumber: string
  bedNumber: string
  ward: string
  admissionReason: string
  diagnosis: string
  attendingPhysician: string
  status: 'Admitted' | 'Discharged' | 'Transferred' | 'Pending Discharge'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  estimatedStay: number // days
  actualStay?: number // days
  dailyCost: number
  totalCost: number
  insurance: {
    provider: string
    coverage: string
    preAuthorization: string
  }
  vitalSigns: {
    lastUpdated: string
    bloodPressure: string
    heartRate: string
    temperature: string
    oxygenSaturation: string
    respiratoryRate: string
  }
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: string
    endDate?: string
  }>
  procedures: Array<{
    name: string
    date: string
    doctor: string
    status: 'Scheduled' | 'Completed' | 'Cancelled'
  }>
  notes: Array<{
    date: string
    doctor: string
    note: string
    type: 'Progress' | 'Nursing' | 'Discharge Planning'
  }>
  dischargeInstructions?: string
  followUpRequired: boolean
  emailSource: {
    originalSubject: string
    originalSender: string
    originalDate: string
    sourceType: string
    sourcePath: string
  }
}

interface HospitalizationData {
  metadata: {
    generated_at: string
    total_admissions: number
    source: string
    version: string
  }
  admissions: Hospitalization[]
  statistics: {
    by_status: Record<string, number>
    by_priority: Record<string, number>
    by_ward: Record<string, number>
    occupancy_rate: number
    average_stay: number
  }
}

// Datos de hospitalización por defecto (fallback)
const defaultHospitalizations: Hospitalization[] = [
  {
    id: "HOSP-2024-001",
    patientId: "PAT-2024-001",
    patientName: "María Elena Rodríguez",
    admissionDate: "2024-01-15T14:30:00Z",
    roomNumber: "301",
    bedNumber: "301-A",
    ward: "Cardiología",
    admissionReason: "Dolor torácico agudo",
    diagnosis: "Síndrome coronario agudo",
    attendingPhysician: "Dr. Carlos Mendoza",
    status: "Admitted",
    priority: "High",
    estimatedStay: 3,
    dailyCost: 850000,
    totalCost: 2550000,
    insurance: {
      provider: "EPS Sanitas",
      coverage: "Plan Complementario",
      preAuthorization: "AUTH-2024-001"
    },
    vitalSigns: {
      lastUpdated: "2024-01-16T08:00:00Z",
      bloodPressure: "140/85 mmHg",
      heartRate: "95 bpm",
      temperature: "36.8°C",
      oxygenSaturation: "97%",
      respiratoryRate: "18 rpm"
    },
    medications: [
      {
        name: "Aspirina",
        dosage: "100mg",
        frequency: "Cada 24 horas",
        startDate: "2024-01-15T14:30:00Z"
      },
      {
        name: "Atorvastatina",
        dosage: "40mg",
        frequency: "Cada 24 horas",
        startDate: "2024-01-15T14:30:00Z"
      }
    ],
    procedures: [
      {
        name: "Cateterismo cardíaco",
        date: "2024-01-16T10:00:00Z",
        doctor: "Dr. Carlos Mendoza",
        status: "Scheduled"
      }
    ],
    notes: [
      {
        date: "2024-01-15T14:30:00Z",
        doctor: "Dr. Carlos Mendoza",
        note: "Paciente ingresa por dolor torácico agudo. EKG muestra cambios sugestivos de isquemia.",
        type: "Progress"
      }
    ],
    followUpRequired: true,
    emailSource: {
      originalSubject: "Admisión hospitalaria - María Elena Rodríguez",
      originalSender: "cmendoza@hospitalsanjose.com",
      originalDate: "2024-01-15T14:30:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/hospitalization_001"
    }
  },
  {
    id: "HOSP-2024-002",
    patientId: "PAT-2024-002",
    patientName: "Carlos Alberto Pérez",
    admissionDate: "2024-01-14T09:15:00Z",
    dischargeDate: "2024-01-16T11:00:00Z",
    roomNumber: "205",
    bedNumber: "205-B",
    ward: "Medicina Interna",
    admissionReason: "Descompensación de insuficiencia cardíaca",
    diagnosis: "Insuficiencia cardíaca congestiva",
    attendingPhysician: "Dra. Ana García",
    status: "Discharged",
    priority: "Medium",
    estimatedStay: 2,
    actualStay: 2,
    dailyCost: 650000,
    totalCost: 1300000,
    insurance: {
      provider: "Nueva EPS",
      coverage: "Plan Básico",
      preAuthorization: "AUTH-2024-002"
    },
    vitalSigns: {
      lastUpdated: "2024-01-16T10:30:00Z",
      bloodPressure: "130/80 mmHg",
      heartRate: "85 bpm",
      temperature: "36.5°C",
      oxygenSaturation: "95%",
      respiratoryRate: "16 rpm"
    },
    medications: [
      {
        name: "Furosemida",
        dosage: "40mg",
        frequency: "Cada 12 horas",
        startDate: "2024-01-14T09:15:00Z",
        endDate: "2024-01-16T11:00:00Z"
      }
    ],
    procedures: [
      {
        name: "Ecocardiograma",
        date: "2024-01-15T14:00:00Z",
        doctor: "Dra. Ana García",
        status: "Completed"
      }
    ],
    notes: [
      {
        date: "2024-01-16T10:30:00Z",
        doctor: "Dra. Ana García",
        note: "Paciente estable, mejoría clínica. Apto para egreso con seguimiento ambulatorio.",
        type: "Discharge Planning"
      }
    ],
    dischargeInstructions: "Continuar con medicación oral. Control en 1 semana. Dieta hiposódica.",
    followUpRequired: true,
    emailSource: {
      originalSubject: "Alta hospitalaria - Carlos Alberto Pérez",
      originalSender: "agarcia@clinicacentral.com",
      originalDate: "2024-01-16T11:00:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/hospitalization_002"
    }
  }
]

// Función para cargar datos de hospitalización desde el archivo generado por el transformer
function loadHospitalizationDataFromFile(): HospitalizationData | null {
  try {
    // Ruta al archivo generado por el transformer de Gmail
    const filePath = path.join(process.cwd(), 'ia', 'hospitalization_data_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: HospitalizationData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.admissions.length} hospitalizations from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail hospitalization data file not found, using default data')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading hospitalization data from file:', error)
    return null
  }
}

// Función para generar estadísticas de hospitalización por defecto
function generateDefaultStatistics(admissions: Hospitalization[]) {
  const stats = {
    by_status: { Admitted: 0, Discharged: 0, Transferred: 0, 'Pending Discharge': 0 },
    by_priority: { Low: 0, Medium: 0, High: 0, Critical: 0 },
    by_ward: {} as Record<string, number>,
    occupancy_rate: 0,
    average_stay: 0
  }

  let totalStay = 0
  let stayCount = 0

  admissions.forEach(admission => {
    // Contar por estado
    stats.by_status[admission.status] = (stats.by_status[admission.status] || 0) + 1
    
    // Contar por prioridad
    stats.by_priority[admission.priority] = (stats.by_priority[admission.priority] || 0) + 1
    
    // Contar por sala
    stats.by_ward[admission.ward] = (stats.by_ward[admission.ward] || 0) + 1
    
    // Calcular estancia promedio
    if (admission.actualStay) {
      totalStay += admission.actualStay
      stayCount++
    }
  })

  stats.average_stay = stayCount > 0 ? totalStay / stayCount : 0
  stats.occupancy_rate = (stats.by_status.Admitted / (stats.by_status.Admitted + stats.by_status.Discharged)) * 100

  return stats
}

// GET - Obtener todos los datos de hospitalización
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const ward = searchParams.get('ward')
    const search = searchParams.get('search')

    // Intentar cargar datos desde Gmail, si no usar datos por defecto
    let hospitalizationData = loadHospitalizationDataFromFile()
    
    if (!hospitalizationData) {
      // Usar datos por defecto
      hospitalizationData = {
        metadata: {
          generated_at: new Date().toISOString(),
          total_admissions: defaultHospitalizations.length,
          source: 'Default Hospitalization Data',
          version: '1.0'
        },
        admissions: defaultHospitalizations,
        statistics: generateDefaultStatistics(defaultHospitalizations)
      }
    }

    let filteredAdmissions = hospitalizationData.admissions

    // Aplicar filtros
    if (status && status !== 'all') {
      filteredAdmissions = filteredAdmissions.filter(admission => admission.status === status)
    }

    if (priority && priority !== 'all') {
      filteredAdmissions = filteredAdmissions.filter(admission => admission.priority === priority)
    }

    if (ward && ward !== 'all') {
      filteredAdmissions = filteredAdmissions.filter(admission => admission.ward === ward)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAdmissions = filteredAdmissions.filter(admission =>
        admission.patientName.toLowerCase().includes(searchLower) ||
        admission.id.toLowerCase().includes(searchLower) ||
        admission.diagnosis.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...hospitalizationData,
        admissions: filteredAdmissions,
        filtered_count: filteredAdmissions.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/hospitalization-data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: {
          metadata: {
            generated_at: new Date().toISOString(),
            total_admissions: 0,
            source: 'Error fallback',
            version: '1.0'
          },
          admissions: [],
          statistics: { by_status: {}, by_priority: {}, by_ward: {}, occupancy_rate: 0, average_stay: 0 }
        }
      },
      { status: 500 }
    )
  }
}

// POST - Actualizar datos de hospitalización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { admissionId, action, data } = body

    console.log(`[API] Processing action '${action}' for admission ${admissionId}`)

    // Aquí se podría implementar la lógica para actualizar los datos de hospitalización
    // Por ahora solo retornamos éxito
    return NextResponse.json({
      success: true,
      message: `Admisión ${admissionId} actualizada correctamente`,
      action,
      data
    })

  } catch (error) {
    console.error('[API] Error in POST /api/hospitalization-data:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
