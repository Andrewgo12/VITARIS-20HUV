'use client'

import { useState, useEffect, useCallback } from 'react'

// Tipos para los casos médicos
export interface MedicalCase {
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
  emailSource?: {
    originalSubject: string
    originalSender: string
    originalDate: string
    sourceType: string
    sourcePath: string
  }
}

export interface MedicalCasesData {
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
  filtered_count?: number
}

export interface MedicalCasesFilters {
  priority?: string
  specialty?: string
  status?: string
  search?: string
}

export interface UseMedicalCasesReturn {
  // Datos
  data: MedicalCasesData | null
  cases: MedicalCase[]
  loading: boolean
  error: string | null
  
  // Filtros
  filters: MedicalCasesFilters
  setFilters: (filters: MedicalCasesFilters) => void
  clearFilters: () => void
  
  // Acciones
  refreshData: () => Promise<void>
  updateCaseStatus: (caseId: string, status: string) => Promise<boolean>
  
  // Estadísticas
  totalCases: number
  filteredCount: number
  priorityStats: Record<string, number>
  specialtyStats: Record<string, number>
  
  // Utilidades
  getCaseById: (id: string) => MedicalCase | undefined
  getCasesByPriority: (priority: string) => MedicalCase[]
  getCasesBySpecialty: (specialty: string) => MedicalCase[]
}

export function useMedicalCases(): UseMedicalCasesReturn {
  // Estados principales
  const [data, setData] = useState<MedicalCasesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<MedicalCasesFilters>({})

  // Función para cargar datos desde la API
  const loadData = useCallback(async (currentFilters: MedicalCasesFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      // Construir URL con parámetros de filtro
      const params = new URLSearchParams()
      if (currentFilters.priority) params.append('priority', currentFilters.priority)
      if (currentFilters.specialty) params.append('specialty', currentFilters.specialty)
      if (currentFilters.status) params.append('status', currentFilters.status)
      if (currentFilters.search) params.append('search', currentFilters.search)

      const url = `/api/medical-cases${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log('[useMedicalCases] Fetching data from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Siempre obtener datos frescos
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        console.log(`[useMedicalCases] Loaded ${result.data.cases.length} cases`)
      } else {
        throw new Error(result.error || 'Error desconocido')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando casos médicos'
      console.error('[useMedicalCases] Error loading data:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    loadData(filters)
  }, [loadData, filters])

  // Función para actualizar filtros
  const setFilters = useCallback((newFilters: MedicalCasesFilters) => {
    console.log('[useMedicalCases] Updating filters:', newFilters)
    setFiltersState(newFilters)
  }, [])

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    console.log('[useMedicalCases] Clearing filters')
    setFiltersState({})
  }, [])

  // Función para refrescar datos
  const refreshData = useCallback(async () => {
    console.log('[useMedicalCases] Refreshing data')
    await loadData(filters)
  }, [loadData, filters])

  // Función para actualizar estado de un caso
  const updateCaseStatus = useCallback(async (caseId: string, status: string): Promise<boolean> => {
    try {
      console.log(`[useMedicalCases] Updating case ${caseId} status to ${status}`)
      
      const response = await fetch('/api/medical-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          action: 'updateStatus',
          data: { status }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Refrescar datos después de la actualización
        await refreshData()
        return true
      } else {
        console.error('[useMedicalCases] Error updating case status:', result.error)
        return false
      }

    } catch (err) {
      console.error('[useMedicalCases] Error updating case status:', err)
      return false
    }
  }, [refreshData])

  // Funciones de utilidad
  const getCaseById = useCallback((id: string): MedicalCase | undefined => {
    return data?.cases.find(case_ => case_.id === id)
  }, [data])

  const getCasesByPriority = useCallback((priority: string): MedicalCase[] => {
    return data?.cases.filter(case_ => case_.priority === priority) || []
  }, [data])

  const getCasesBySpecialty = useCallback((specialty: string): MedicalCase[] => {
    return data?.cases.filter(case_ => case_.specialty === specialty) || []
  }, [data])

  // Valores computados
  const cases = data?.cases || []
  const totalCases = data?.metadata.total_cases || 0
  const filteredCount = data?.filtered_count || cases.length
  const priorityStats = data?.statistics.by_priority || {}
  const specialtyStats = data?.statistics.by_specialty || {}

  return {
    // Datos
    data,
    cases,
    loading,
    error,
    
    // Filtros
    filters,
    setFilters,
    clearFilters,
    
    // Acciones
    refreshData,
    updateCaseStatus,
    
    // Estadísticas
    totalCases,
    filteredCount,
    priorityStats,
    specialtyStats,
    
    // Utilidades
    getCaseById,
    getCasesByPriority,
    getCasesBySpecialty,
  }
}

// Hook para un caso específico
export function useMedicalCase(caseId: string) {
  const { getCaseById, loading, error, refreshData } = useMedicalCases()
  
  const case_ = getCaseById(caseId)
  
  return {
    case: case_,
    loading,
    error,
    refreshData,
    found: !!case_
  }
}

// Hook para estadísticas de casos médicos
export function useMedicalCasesStats() {
  const { data, loading, error } = useMedicalCases()
  
  const stats = {
    total: data?.metadata.total_cases || 0,
    byPriority: data?.statistics.by_priority || {},
    bySpecialty: data?.statistics.by_specialty || {},
    byStatus: data?.statistics.by_status || {},
    source: data?.metadata.source || 'Unknown',
    lastUpdated: data?.metadata.generated_at || null
  }
  
  return {
    stats,
    loading,
    error
  }
}
