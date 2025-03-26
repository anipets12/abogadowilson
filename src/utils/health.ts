import { supabase, prisma, turso } from '../config/database'
import api from '../services/api'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  services: Record<string, boolean>
  error?: any
}

export const checkHealth = async (): Promise<HealthStatus> => {
  const services: Record<string, boolean> = {}

  try {
    // API Check
    await api.get('/health')
    services.api = true

    // Supabase Check
    const { error: supabaseError } = await supabase
      .from('health_check')
      .select('count')
    services.supabase = !supabaseError

    // Prisma Check
    await prisma.$queryRaw`SELECT 1`
    services.prisma = true

    // Turso Check
    await turso.execute('SELECT 1')
    services.turso = true

    // Auth Check
    const { data: { session } } = await supabase.auth.getSession()
    services.auth = !!session

    const isHealthy = Object.values(services).every(Boolean)

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      services
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      status: 'unhealthy',
      services,
      error
    }
  }
}
