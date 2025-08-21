import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Types for historical data
interface HistoricalRecord {
  id: string
  patient: string
  age: number
  diagnosis: string
  decision: string
  priority: 'Alta' | 'Media' | 'Baja'
  specialty: string
  origin: string
  evaluatedAt: string
  responseTime: string
  observations: string
  outcome: string
  emailSource?: {
    originalSubject: string
    originalSender: string
    sourceType: string
  }
}

interface HistoricalData {
  metadata: {
    generated_at: string
    total_records: number
    source: string
    version: string
  }
  records: HistoricalRecord[]
  statistics: {
    by_decision: Record<string, number>
    by_specialty: Record<string, number>
    by_priority: Record<string, number>
  }
}

// Default historical data
const defaultHistoricalData: HistoricalData = {
  metadata: {
    generated_at: new Date().toISOString(),
    total_records: 8,
    source: 'Default Historical Data',
    version: '1.0'
  },
  records: [
    {
      id: "HIST-001",
      patient: "María Elena Rodríguez",
      age: 45,
      diagnosis: "Dolor torácico agudo",
      decision: "Aceptado",
      priority: "Alta",
      specialty: "Cardiología",
      origin: "Hospital San José",
      evaluatedAt: "2024-01-15T14:30:00Z",
      responseTime: "15 min",
      observations: "Caso prioritario evaluado inmediatamente. Paciente estabilizada.",
      outcome: "Tratamiento exitoso - Alta médica"
    },
    {
      id: "HIST-002",
      patient: "Carlos Alberto Pérez",
      age: 62,
      diagnosis: "Insuficiencia cardíaca",
      decision: "Aceptado",
      priority: "Media",
      specialty: "Cardiología",
      origin: "Clínica Central",
      evaluatedAt: "2024-01-14T13:45:00Z",
      responseTime: "45 min",
      observations: "Evaluación completa realizada. Ajuste de medicación.",
      outcome: "Mejoría clínica - Seguimiento ambulatorio"
    },
    {
      id: "HIST-003",
      patient: "Ana Sofía López",
      age: 28,
      diagnosis: "Embarazo de alto riesgo",
      decision: "Aceptado",
      priority: "Alta",
      specialty: "Ginecología",
      origin: "Centro de Salud Norte",
      evaluatedAt: "2024-01-13T12:20:00Z",
      responseTime: "20 min",
      observations: "Evaluación obstétrica urgente. Monitoreo fetal continuo.",
      outcome: "Parto exitoso - Madre e hijo estables"
    },
    {
      id: "HIST-004",
      patient: "José Miguel Torres",
      age: 55,
      diagnosis: "Accidente cerebrovascular",
      decision: "Aceptado",
      priority: "Alta",
      specialty: "Neurología",
      origin: "Hospital Regional",
      evaluatedAt: "2024-01-12T11:10:00Z",
      responseTime: "10 min",
      observations: "Trombolisis administrada dentro de ventana terapéutica.",
      outcome: "Recuperación parcial - Rehabilitación"
    },
    {
      id: "HIST-005",
      patient: "Carmen Rosa Díaz",
      age: 38,
      diagnosis: "Fractura compleja de fémur",
      decision: "Rechazado",
      priority: "Media",
      specialty: "Ortopedia",
      origin: "Clínica del Valle",
      evaluatedAt: "2024-01-11T10:30:00Z",
      responseTime: "60 min",
      observations: "Capacidad hospitalaria completa. Referido a otro centro.",
      outcome: "Transferido a hospital de referencia"
    },
    {
      id: "HIST-006",
      patient: "Roberto Jiménez",
      age: 67,
      diagnosis: "Neumonía bilateral",
      decision: "Aceptado",
      priority: "Alta",
      specialty: "Medicina Interna",
      origin: "Hospital Universitario",
      evaluatedAt: "2024-01-10T16:45:00Z",
      responseTime: "25 min",
      observations: "Paciente con comorbilidades. Requirió UCI.",
      outcome: "Recuperación completa - Alta médica"
    },
    {
      id: "HIST-007",
      patient: "Lucía Fernández",
      age: 34,
      diagnosis: "Apendicitis aguda",
      decision: "Aceptado",
      priority: "Media",
      specialty: "Cirugía General",
      origin: "Clínica Santa María",
      evaluatedAt: "2024-01-09T14:20:00Z",
      responseTime: "30 min",
      observations: "Cirugía laparoscópica realizada sin complicaciones.",
      outcome: "Cirugía exitosa - Alta al día siguiente"
    },
    {
      id: "HIST-008",
      patient: "Diego Morales",
      age: 42,
      diagnosis: "Crisis hipertensiva",
      decision: "Aceptado",
      priority: "Media",
      specialty: "Medicina Interna",
      origin: "Centro Médico Norte",
      evaluatedAt: "2024-01-08T09:15:00Z",
      responseTime: "40 min",
      observations: "Estabilización hemodinámica lograda. Ajuste antihipertensivo.",
      outcome: "Control ambulatorio - Seguimiento cardiología"
    }
  ],
  statistics: {
    by_decision: {
      "Aceptado": 7,
      "Rechazado": 1,
      "Pendiente": 0
    },
    by_specialty: {
      "Cardiología": 2,
      "Ginecología": 1,
      "Neurología": 1,
      "Ortopedia": 1,
      "Medicina Interna": 2,
      "Cirugía General": 1
    },
    by_priority: {
      "Alta": 4,
      "Media": 4,
      "Baja": 0
    }
  }
}

// Function to load historical data from Gmail processing
function loadHistoricalDataFromFile(): HistoricalData | null {
  try {
    const filePath = path.join(process.cwd(), 'ia', 'historical_data_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: HistoricalData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.records.length} historical records from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail historical data file not found, using default data')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading historical data from file:', error)
    return null
  }
}

// GET - Get historical data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const decision = searchParams.get('decision')
    const specialty = searchParams.get('specialty')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Try to load data from Gmail, fallback to default
    let historicalData = loadHistoricalDataFromFile()
    
    if (!historicalData) {
      historicalData = defaultHistoricalData
    }

    let filteredRecords = historicalData.records

    // Apply filters
    if (decision && decision !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.decision === decision)
    }

    if (specialty && specialty !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.specialty === specialty)
    }

    if (priority && priority !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.priority === priority)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredRecords = filteredRecords.filter(record =>
        record.patient.toLowerCase().includes(searchLower) ||
        record.diagnosis.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower) ||
        record.origin.toLowerCase().includes(searchLower)
      )
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.evaluatedAt)
        const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01')
        const toDate = dateTo ? new Date(dateTo) : new Date('2100-01-01')
        
        return recordDate >= fromDate && recordDate <= toDate
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...historicalData,
        records: filteredRecords,
        filtered_count: filteredRecords.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/historical-data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: defaultHistoricalData
      },
      { status: 500 }
    )
  }
}

// POST - Export historical data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, filters, format } = body

    console.log(`[API] Processing historical data action: ${action}`)

    if (action === 'export') {
      // Here you could implement export functionality
      return NextResponse.json({
        success: true,
        message: 'Exportación iniciada',
        downloadUrl: '/api/historical-data/export',
        format
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Acción procesada correctamente',
      action
    })

  } catch (error) {
    console.error('[API] Error in POST /api/historical-data:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
