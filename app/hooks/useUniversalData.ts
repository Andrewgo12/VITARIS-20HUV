'use client'

import { useState, useEffect, useCallback } from 'react'

// Base types for all data
export interface BaseDataFilters {
  search?: string
  [key: string]: any
}

export interface BaseDataResponse<T> {
  metadata: {
    generated_at: string
    total_records: number
    source: string
    version: string
  }
  records: T[]
  statistics: Record<string, any>
  filtered_count?: number
}

export interface UseDataReturn<T> {
  data: BaseDataResponse<T> | null
  records: T[]
  loading: boolean
  error: string | null
  filters: BaseDataFilters
  setFilters: (filters: BaseDataFilters) => void
  clearFilters: () => void
  refreshData: () => Promise<void>
  totalRecords: number
  filteredCount: number
  statistics: Record<string, any>
}

// Generic hook for any data type
function useGenericData<T>(
  endpoint: string,
  initialFilters: BaseDataFilters = {}
): UseDataReturn<T> {
  const [data, setData] = useState<BaseDataResponse<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<BaseDataFilters>(initialFilters)

  const loadData = useCallback(async (currentFilters: BaseDataFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value.toString())
        }
      })

      const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log(`[useGenericData] Fetching data from: ${url}`)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
        console.log(`[useGenericData] Loaded ${result.data.records.length} records from ${endpoint}`)
      } else {
        throw new Error(result.error || 'Error desconocido')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error cargando datos de ${endpoint}`
      console.error(`[useGenericData] Error loading data from ${endpoint}:`, err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    loadData(filters)
  }, [loadData, filters])

  const setFilters = useCallback((newFilters: BaseDataFilters) => {
    console.log(`[useGenericData] Updating filters for ${endpoint}:`, newFilters)
    setFiltersState(newFilters)
  }, [endpoint])

  const clearFilters = useCallback(() => {
    console.log(`[useGenericData] Clearing filters for ${endpoint}`)
    setFiltersState({})
  }, [endpoint])

  const refreshData = useCallback(async () => {
    console.log(`[useGenericData] Refreshing data for ${endpoint}`)
    await loadData(filters)
  }, [loadData, filters, endpoint])

  const records = data?.records || []
  const totalRecords = data?.metadata.total_records || 0
  const filteredCount = data?.filtered_count || records.length
  const statistics = data?.statistics || {}

  return {
    data,
    records,
    loading,
    error,
    filters,
    setFilters,
    clearFilters,
    refreshData,
    totalRecords,
    filteredCount,
    statistics,
  }
}

// Specific hooks for each data type

// Admin Data Hook
export interface AdminRecord {
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

export interface AdminDataFilters extends BaseDataFilters {
  category?: string
  priority?: string
  status?: string
}

export function useAdminData(initialFilters: AdminDataFilters = {}) {
  return useGenericData<AdminRecord>('/api/admin-data', initialFilters)
}

// Urgency Data Hook
export interface UrgencyRecord {
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

export interface UrgencyDataFilters extends BaseDataFilters {
  urgencyLevel?: string
  triageCategory?: string
  status?: string
}

export function useUrgencyData(initialFilters: UrgencyDataFilters = {}) {
  return useGenericData<UrgencyRecord>('/api/urgency-data', initialFilters)
}

// Historical Data Hook
export interface HistoricalRecord {
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

export interface HistoricalDataFilters extends BaseDataFilters {
  decision?: string
  specialty?: string
  priority?: string
  dateFrom?: string
  dateTo?: string
}

export function useHistoricalData(initialFilters: HistoricalDataFilters = {}) {
  return useGenericData<HistoricalRecord>('/api/historical-data', initialFilters)
}

// Combined Data Hook - for dashboard overview
export interface CombinedDataStats {
  medicalCases: {
    total: number
    pending: number
    highPriority: number
    bySpecialty: Record<string, number>
  }
  adminData: {
    total: number
    pending: number
    byCategory: Record<string, number>
  }
  urgencyData: {
    total: number
    critical: number
    byTriageCategory: Record<string, number>
  }
  historicalData: {
    total: number
    acceptanceRate: number
    bySpecialty: Record<string, number>
  }
  lastUpdated: string
  dataSource: string
}

export function useCombinedData() {
  const [combinedStats, setCombinedStats] = useState<CombinedDataStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const medicalCases = useGenericData('/api/medical-cases')
  const adminData = useGenericData('/api/admin-data')
  const urgencyData = useGenericData('/api/urgency-data')
  const historicalData = useGenericData('/api/historical-data')

  useEffect(() => {
    const allLoading = [
      medicalCases.loading,
      adminData.loading,
      urgencyData.loading,
      historicalData.loading
    ].some(Boolean)

    const anyError = [
      medicalCases.error,
      adminData.error,
      urgencyData.error,
      historicalData.error
    ].find(Boolean)

    setLoading(allLoading)
    setError(anyError)

    if (!allLoading && !anyError) {
      // Combine all statistics
      const combined: CombinedDataStats = {
        medicalCases: {
          total: medicalCases.totalRecords,
          pending: medicalCases.statistics.by_status?.['Pendiente'] || 0,
          highPriority: medicalCases.statistics.by_priority?.['Alta'] || 0,
          bySpecialty: medicalCases.statistics.by_specialty || {}
        },
        adminData: {
          total: adminData.totalRecords,
          pending: adminData.statistics.total_pending || 0,
          byCategory: adminData.statistics.by_category || {}
        },
        urgencyData: {
          total: urgencyData.totalRecords,
          critical: urgencyData.statistics.by_urgency_level?.['Crítico'] || 0,
          byTriageCategory: urgencyData.statistics.by_triage_category || {}
        },
        historicalData: {
          total: historicalData.totalRecords,
          acceptanceRate: historicalData.totalRecords > 0 
            ? ((historicalData.statistics.by_decision?.['Aceptado'] || 0) / historicalData.totalRecords) * 100 
            : 0,
          bySpecialty: historicalData.statistics.by_specialty || {}
        },
        lastUpdated: new Date().toISOString(),
        dataSource: medicalCases.data?.metadata.source || 'Default Data'
      }

      setCombinedStats(combined)
    }
  }, [
    medicalCases.loading, medicalCases.error, medicalCases.data,
    adminData.loading, adminData.error, adminData.data,
    urgencyData.loading, urgencyData.error, urgencyData.data,
    historicalData.loading, historicalData.error, historicalData.data
  ])

  const refreshAll = useCallback(async () => {
    await Promise.all([
      medicalCases.refreshData(),
      adminData.refreshData(),
      urgencyData.refreshData(),
      historicalData.refreshData()
    ])
  }, [medicalCases.refreshData, adminData.refreshData, urgencyData.refreshData, historicalData.refreshData])

  return {
    combinedStats,
    loading,
    error,
    refreshAll,
    individual: {
      medicalCases,
      adminData,
      urgencyData,
      historicalData
    }
  }
}

// Data source indicator hook
export function useDataSourceStatus() {
  const [status, setStatus] = useState<{
    isGmailData: boolean
    lastUpdated: string | null
    source: string
    totalRecords: number
  }>({
    isGmailData: false,
    lastUpdated: null,
    source: 'Default Data',
    totalRecords: 0
  })

  const medicalCases = useGenericData('/api/medical-cases')

  useEffect(() => {
    if (medicalCases.data) {
      const isGmail = medicalCases.data.metadata.source.includes('Gmail')
      setStatus({
        isGmailData: isGmail,
        lastUpdated: medicalCases.data.metadata.generated_at,
        source: medicalCases.data.metadata.source,
        totalRecords: medicalCases.data.metadata.total_records
      })
    }
  }, [medicalCases.data])

  return {
    ...status,
    loading: medicalCases.loading,
    error: medicalCases.error,
    refresh: medicalCases.refreshData
  }
}
