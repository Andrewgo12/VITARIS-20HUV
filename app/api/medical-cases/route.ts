import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Tipos para los casos médicos
interface MedicalCase {
  id: string
  patient: string
  age: number
  gender: string
  diagnosis: string
  priority: 'Alta' | 'Media' | 'Baja'
  status: string
  origin: string
  specialty: string
  receivedAt: string
  timeElapsed: string
  clinicalSummary: string
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    temperature: string
    oxygenSaturation: string
    respiratoryRate: string
  }
  medicalHistory: string[]
  currentMedications: string[]
  attachments: Array<{
    name: string
    type: string
    size: string
    url: string
  }>
  referringDoctor: {
    name: string
    specialty: string
    phone: string
    email: string
  }
  urgencyScore: number
  aiConfidence: number
  estimatedCost: string
  emailSource: {
    originalSubject: string
    originalSender: string
    originalDate: string
    sourceType: string
    sourcePath: string
  }
}

interface MedicalCasesData {
  metadata: {
    generated_at: string
    total_cases: number
    source: string
    version: string
  }
  cases: MedicalCase[]
  statistics: {
    by_priority: Record<string, number>
    by_specialty: Record<string, number>
    by_status: Record<string, number>
  }
}

// Casos médicos por defecto (fallback)
const defaultCases: MedicalCase[] = [
  {
    id: "REF-2024-001",
    patient: "María Elena Rodríguez",
    age: 45,
    gender: "Femenino",
    diagnosis: "Dolor torácico agudo",
    priority: "Alta",
    status: "Pendiente",
    origin: "Hospital San José",
    specialty: "Cardiología",
    receivedAt: "2024-01-15T14:30:00Z",
    timeElapsed: "2h 15min",
    clinicalSummary: "Paciente femenina de 45 años que consulta por dolor torácico de inicio súbito, tipo opresivo, irradiado a brazo izquierdo, asociado a diaforesis y náuseas. Sin antecedentes cardiovasculares conocidos.",
    vitalSigns: {
      bloodPressure: "150/95 mmHg",
      heartRate: "110 bpm",
      temperature: "36.8°C",
      oxygenSaturation: "96%",
      respiratoryRate: "22 rpm",
    },
    medicalHistory: [
      "Hipertensión arterial diagnosticada hace 2 años",
      "Diabetes mellitus tipo 2 en tratamiento",
      "Madre con antecedente de infarto agudo de miocardio",
    ],
    currentMedications: ["Losartán 50mg c/24h", "Metformina 850mg c/12h", "Atorvastatina 20mg c/24h"],
    attachments: [
      { name: "EKG_Maria_Rodriguez.pdf", type: "PDF", size: "2.3 MB", url: "/electrocardiogram.png" },
      { name: "Laboratorios.pdf", type: "PDF", size: "1.1 MB", url: "/placeholder-7auak.png" },
      { name: "Radiografia_Torax.jpg", type: "IMAGE", size: "1.8 MB", url: "/chest-xray.png" },
    ],
    referringDoctor: {
      name: "Dr. Carlos Mendoza",
      specialty: "Medicina Interna",
      phone: "+57 300 123 4567",
      email: "cmendoza@hospitalsanjose.com",
    },
    urgencyScore: 8.5,
    aiConfidence: 92,
    estimatedCost: "$2,500,000",
    emailSource: {
      originalSubject: "Referencia urgente - Dolor torácico",
      originalSender: "cmendoza@hospitalsanjose.com",
      originalDate: "2024-01-15T14:30:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/email_001"
    }
  },
  {
    id: "REF-2024-002",
    patient: "Carlos Alberto Pérez",
    age: 62,
    gender: "Masculino",
    diagnosis: "Insuficiencia cardíaca",
    priority: "Media",
    status: "Pendiente",
    origin: "Clínica Central",
    specialty: "Cardiología",
    receivedAt: "2024-01-15T13:58:00Z",
    timeElapsed: "2h 47min",
    clinicalSummary: "Paciente masculino de 62 años con antecedente de infarto agudo de miocardio, presenta disnea de esfuerzo progresiva y edema en miembros inferiores.",
    vitalSigns: {
      bloodPressure: "140/85 mmHg",
      heartRate: "95 bpm",
      temperature: "36.5°C",
      oxygenSaturation: "92%",
      respiratoryRate: "20 rpm",
    },
    medicalHistory: [
      "Infarto agudo de miocardio previo",
      "Hipertensión arterial",
      "Dislipidemia",
    ],
    currentMedications: ["Enalapril 10mg", "Furosemida 40mg", "ASA 100mg"],
    attachments: [
      { name: "Ecocardiograma.pdf", type: "PDF", size: "3.2 MB", url: "/placeholder-7auak.png" },
      { name: "BNP.pdf", type: "PDF", size: "0.8 MB", url: "/placeholder-7auak.png" },
    ],
    referringDoctor: {
      name: "Dra. Ana García",
      specialty: "Medicina Interna",
      phone: "+57 301 987 6543",
      email: "agarcia@clinicacentral.com",
    },
    urgencyScore: 6.5,
    aiConfidence: 88,
    estimatedCost: "$1,800,000",
    emailSource: {
      originalSubject: "Consulta cardiológica - Insuficiencia cardíaca",
      originalSender: "agarcia@clinicacentral.com",
      originalDate: "2024-01-15T13:58:00Z",
      sourceType: "professional",
      sourcePath: "/ia/Professional_Email_Records/email_002"
    }
  }
]

// Función para cargar casos médicos desde el archivo generado por el transformer
function loadMedicalCasesFromFile(): MedicalCasesData | null {
  try {
    // Ruta al archivo generado por el transformer de Gmail
    const filePath = path.join(process.cwd(), 'ia', 'medical_cases_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: MedicalCasesData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.cases.length} medical cases from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail medical cases file not found, using default cases')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading medical cases from file:', error)
    return null
  }
}

// Función para generar estadísticas de los casos por defecto
function generateDefaultStatistics(cases: MedicalCase[]) {
  const stats = {
    by_priority: { Alta: 0, Media: 0, Baja: 0 },
    by_specialty: {} as Record<string, number>,
    by_status: { Pendiente: 0, 'En Revisión': 0, Completado: 0 }
  }

  cases.forEach(case_ => {
    // Contar por prioridad
    stats.by_priority[case_.priority] = (stats.by_priority[case_.priority] || 0) + 1
    
    // Contar por especialidad
    stats.by_specialty[case_.specialty] = (stats.by_specialty[case_.specialty] || 0) + 1
    
    // Contar por estado
    stats.by_status[case_.status] = (stats.by_status[case_.status] || 0) + 1
  })

  return stats
}

// GET - Obtener todos los casos médicos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const priority = searchParams.get('priority')
    const specialty = searchParams.get('specialty')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Intentar cargar casos desde Gmail, si no usar casos por defecto
    let medicalData = loadMedicalCasesFromFile()
    
    if (!medicalData) {
      // Usar casos por defecto
      medicalData = {
        metadata: {
          generated_at: new Date().toISOString(),
          total_cases: defaultCases.length,
          source: 'Default Medical Cases',
          version: '1.0'
        },
        cases: defaultCases,
        statistics: generateDefaultStatistics(defaultCases)
      }
    }

    let filteredCases = medicalData.cases

    // Aplicar filtros
    if (priority && priority !== 'all') {
      filteredCases = filteredCases.filter(case_ => case_.priority === priority)
    }

    if (specialty && specialty !== 'all') {
      filteredCases = filteredCases.filter(case_ => case_.specialty === specialty)
    }

    if (status && status !== 'all') {
      filteredCases = filteredCases.filter(case_ => case_.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCases = filteredCases.filter(case_ =>
        case_.patient.toLowerCase().includes(searchLower) ||
        case_.diagnosis.toLowerCase().includes(searchLower) ||
        case_.id.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...medicalData,
        cases: filteredCases,
        filtered_count: filteredCases.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/medical-cases:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: {
          metadata: {
            generated_at: new Date().toISOString(),
            total_cases: 0,
            source: 'Error fallback',
            version: '1.0'
          },
          cases: [],
          statistics: { by_priority: {}, by_specialty: {}, by_status: {} }
        }
      },
      { status: 500 }
    )
  }
}

// POST - Actualizar estado de un caso médico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { caseId, action, data } = body

    console.log(`[API] Processing action '${action}' for case ${caseId}`)

    // Aquí se podría implementar la lógica para actualizar el estado
    // Por ahora solo retornamos éxito
    return NextResponse.json({
      success: true,
      message: `Caso ${caseId} actualizado correctamente`,
      action,
      data
    })

  } catch (error) {
    console.error('[API] Error in POST /api/medical-cases:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
