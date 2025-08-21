import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Types for urgency data
interface UrgencyRecord {
  id: string
  patientName: string
  urgencyLevel: 'Crítico' | 'Urgente' | 'Moderado'
  condition: string
  arrivalTime: string
  triageCategory: 'Rojo' | 'Amarillo' | 'Verde'
  status: string
  location: string
  summary: string
}

interface UrgencyData {
  metadata: {
    generated_at: string
    total_records: number
    source: string
    version: string
  }
  records: UrgencyRecord[]
  statistics: {
    by_urgency_level: Record<string, number>
    by_triage_category: Record<string, number>
    total_in_triage: number
  }
}

// Default urgency data
const defaultUrgencyData: UrgencyData = {
  metadata: {
    generated_at: new Date().toISOString(),
    total_records: 6,
    source: 'Default Emergency Data',
    version: '1.0'
  },
  records: [
    {
      id: "URG-001",
      patientName: "Carlos Mendoza",
      urgencyLevel: "Crítico",
      condition: "Infarto agudo de miocardio",
      arrivalTime: "2024-01-21T08:15:00Z",
      triageCategory: "Rojo",
      status: "En Tratamiento",
      location: "Sala de Emergencias 1",
      summary: "Paciente masculino de 58 años con dolor torácico severo y cambios electrocardiográficos..."
    },
    {
      id: "URG-002",
      patientName: "María González",
      urgencyLevel: "Urgente",
      condition: "Fractura de fémur",
      arrivalTime: "2024-01-21T09:30:00Z",
      triageCategory: "Amarillo",
      status: "En Triaje",
      location: "Área de Triaje",
      summary: "Paciente femenina de 45 años con fractura de fémur derecho tras accidente vehicular..."
    },
    {
      id: "URG-003",
      patientName: "José Ramírez",
      urgencyLevel: "Moderado",
      condition: "Gastroenteritis aguda",
      arrivalTime: "2024-01-21T10:45:00Z",
      triageCategory: "Verde",
      status: "Esperando",
      location: "Sala de Espera",
      summary: "Paciente masculino de 32 años con síntomas gastrointestinales de 2 días de evolución..."
    },
    {
      id: "URG-004",
      patientName: "Ana Rodríguez",
      urgencyLevel: "Crítico",
      condition: "Accidente cerebrovascular",
      arrivalTime: "2024-01-21T07:20:00Z",
      triageCategory: "Rojo",
      status: "En Tratamiento",
      location: "UCI",
      summary: "Paciente femenina de 67 años con síntomas neurológicos agudos compatibles con ACV..."
    },
    {
      id: "URG-005",
      patientName: "Pedro Silva",
      urgencyLevel: "Urgente",
      condition: "Crisis asmática severa",
      arrivalTime: "2024-01-21T11:10:00Z",
      triageCategory: "Amarillo",
      status: "En Triaje",
      location: "Área de Triaje",
      summary: "Paciente masculino de 28 años con crisis asmática severa y dificultad respiratoria..."
    },
    {
      id: "URG-006",
      patientName: "Carmen López",
      urgencyLevel: "Moderado",
      condition: "Dolor abdominal",
      arrivalTime: "2024-01-21T12:00:00Z",
      triageCategory: "Verde",
      status: "Esperando",
      location: "Sala de Espera",
      summary: "Paciente femenina de 38 años con dolor abdominal de características inespecíficas..."
    }
  ],
  statistics: {
    by_urgency_level: {
      "Crítico": 2,
      "Urgente": 2,
      "Moderado": 2
    },
    by_triage_category: {
      "Rojo": 2,
      "Amarillo": 2,
      "Verde": 2
    },
    total_in_triage: 2
  }
}

// Function to load urgency data from Gmail processing
function loadUrgencyDataFromFile(): UrgencyData | null {
  try {
    const filePath = path.join(process.cwd(), 'ia', 'urgency_data_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: UrgencyData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.records.length} urgency records from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail urgency data file not found, using default data')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading urgency data from file:', error)
    return null
  }
}

// GET - Get urgency data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const urgencyLevel = searchParams.get('urgencyLevel')
    const triageCategory = searchParams.get('triageCategory')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Try to load data from Gmail, fallback to default
    let urgencyData = loadUrgencyDataFromFile()
    
    if (!urgencyData) {
      urgencyData = defaultUrgencyData
    }

    let filteredRecords = urgencyData.records

    // Apply filters
    if (urgencyLevel && urgencyLevel !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.urgencyLevel === urgencyLevel)
    }

    if (triageCategory && triageCategory !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.triageCategory === triageCategory)
    }

    if (status && status !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredRecords = filteredRecords.filter(record =>
        record.patientName.toLowerCase().includes(searchLower) ||
        record.condition.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...urgencyData,
        records: filteredRecords,
        filtered_count: filteredRecords.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/urgency-data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: defaultUrgencyData
      },
      { status: 500 }
    )
  }
}

// POST - Update urgency record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recordId, action, data } = body

    console.log(`[API] Processing action '${action}' for urgency record ${recordId}`)

    return NextResponse.json({
      success: true,
      message: `Registro de urgencia ${recordId} actualizado correctamente`,
      action,
      data
    })

  } catch (error) {
    console.error('[API] Error in POST /api/urgency-data:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
