import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Types for admin data
interface AdminRecord {
  id: string
  type: string
  subject: string
  sender: string
  date: string
  category: string
  priority: 'Alta' | 'Media' | 'Baja'
  status: string
  summary: string
  emailSource: {
    originalSubject: string
    originalSender: string
    sourceType: string
  }
}

interface AdminData {
  metadata: {
    generated_at: string
    total_records: number
    source: string
    version: string
  }
  records: AdminRecord[]
  statistics: {
    by_category: Record<string, number>
    by_priority: Record<string, number>
    total_pending: number
  }
}

// Default admin data
const defaultAdminData: AdminData = {
  metadata: {
    generated_at: new Date().toISOString(),
    total_records: 4,
    source: 'Default Administrative Data',
    version: '1.0'
  },
  records: [
    {
      id: "ADM-001",
      type: "administrative",
      subject: "Reporte mensual de facturación",
      sender: "facturacion@hospital.com",
      date: "2024-01-20T10:30:00Z",
      category: "Financiero",
      priority: "Alta",
      status: "Pendiente",
      summary: "Reporte mensual de facturación con análisis de ingresos y gastos del mes anterior...",
      emailSource: {
        originalSubject: "Reporte mensual de facturación",
        originalSender: "facturacion@hospital.com",
        sourceType: "default"
      }
    },
    {
      id: "ADM-002",
      type: "administrative",
      subject: "Actualización de políticas de personal",
      sender: "rrhh@hospital.com",
      date: "2024-01-19T14:15:00Z",
      category: "Recursos Humanos",
      priority: "Media",
      status: "Pendiente",
      summary: "Nuevas políticas de personal que entran en vigencia el próximo mes...",
      emailSource: {
        originalSubject: "Actualización de políticas de personal",
        originalSender: "rrhh@hospital.com",
        sourceType: "default"
      }
    },
    {
      id: "ADM-003",
      type: "administrative",
      subject: "Estadísticas de ocupación hospitalaria",
      sender: "estadisticas@hospital.com",
      date: "2024-01-18T09:45:00Z",
      category: "Reportes",
      priority: "Media",
      status: "Completado",
      summary: "Reporte semanal de ocupación de camas y utilización de servicios...",
      emailSource: {
        originalSubject: "Estadísticas de ocupación hospitalaria",
        originalSender: "estadisticas@hospital.com",
        sourceType: "default"
      }
    },
    {
      id: "ADM-004",
      type: "administrative",
      subject: "Presupuesto anual departamento",
      sender: "finanzas@hospital.com",
      date: "2024-01-17T16:20:00Z",
      category: "Financiero",
      priority: "Alta",
      status: "En Revisión",
      summary: "Propuesta de presupuesto anual para el departamento de cardiología...",
      emailSource: {
        originalSubject: "Presupuesto anual departamento",
        originalSender: "finanzas@hospital.com",
        sourceType: "default"
      }
    }
  ],
  statistics: {
    by_category: {
      "Financiero": 2,
      "Recursos Humanos": 1,
      "Reportes": 1
    },
    by_priority: {
      "Alta": 2,
      "Media": 2,
      "Baja": 0
    },
    total_pending: 2
  }
}

// Function to load admin data from Gmail processing
function loadAdminDataFromFile(): AdminData | null {
  try {
    const filePath = path.join(process.cwd(), 'ia', 'admin_data_for_frontend.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const data: AdminData = JSON.parse(fileContent)
      
      console.log(`[API] Loaded ${data.records.length} admin records from Gmail data`)
      return data
    } else {
      console.log('[API] Gmail admin data file not found, using default data')
      return null
    }
  } catch (error) {
    console.error('[API] Error loading admin data from file:', error)
    return null
  }
}

// GET - Get admin data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Try to load data from Gmail, fallback to default
    let adminData = loadAdminDataFromFile()
    
    if (!adminData) {
      adminData = defaultAdminData
    }

    let filteredRecords = adminData.records

    // Apply filters
    if (category && category !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.category === category)
    }

    if (priority && priority !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.priority === priority)
    }

    if (status && status !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredRecords = filteredRecords.filter(record =>
        record.subject.toLowerCase().includes(searchLower) ||
        record.summary.toLowerCase().includes(searchLower) ||
        record.id.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...adminData,
        records: filteredRecords,
        filtered_count: filteredRecords.length
      }
    })

  } catch (error) {
    console.error('[API] Error in GET /api/admin-data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        data: defaultAdminData
      },
      { status: 500 }
    )
  }
}

// POST - Update admin record status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recordId, action, data } = body

    console.log(`[API] Processing action '${action}' for admin record ${recordId}`)

    // Here you could implement logic to update the record
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: `Registro administrativo ${recordId} actualizado correctamente`,
      action,
      data
    })

  } catch (error) {
    console.error('[API] Error in POST /api/admin-data:', error)
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    )
  }
}
