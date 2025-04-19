import { User } from '@supabase/supabase-js'
import { KVNamespace } from '@cloudflare/workers-types'

// Define D1Database type locally since it's missing from the current version
type D1Database = any
import { PrismaClient } from '@prisma/client'

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ConsultaData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: number;
}

export interface UserData {
  email: string;
  password?: string;
  nombre: string;
  telefono?: string;
}

export interface ServiceStatus {
  supabase: boolean
  prisma: boolean
  turso: boolean
  cloudflare: boolean
  database: {
    connected: boolean
    latency: number
    lastSync: number
    replicationLag?: number
    connectionPool: {
      active: number
      idle: number
      waiting: number
    }
  }
}

export interface WorkerEnv {
  DB: D1Database
  ASSETS: KVNamespace
  ENVIRONMENT: string
  SUPABASE_URL: string
  SUPABASE_KEY: string
  JWT_SECRET: string
  DATABASE_URL: string
  TURSO_DB_URL: string
  TURSO_DB_TOKEN: string
  RATE_LIMIT_MAX: number
  CACHE_TTL: number
  MONITORING_KEY: string
}

export interface CacheConfig {
  ttl: number
  strategy: 'memory' | 'kv' | 'hybrid'
  namespace: string
  invalidationPatterns: string[]
}

export interface MonitoringMetrics {
  requestCount: number
  errorRate: number
  averageLatency: number
  cacheHitRate: number
  serviceHealth: ServiceStatus
  lastDeployment: number
}

export interface ApiErrorResponse {
  error: string
  details?: string
  code: string
  timestamp: number
  service?: keyof ServiceStatus
  retryable?: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  suggestedAction?: string
}

export interface ServiceConfig {
  supabase: {
    url: string
    key: string
    options: {
      autoRefreshToken: boolean
      persistSession: boolean
      detectSessionInUrl: boolean
    }
    rateLimit: {
      points: number
      duration: number
    }
    cache: CacheConfig
  }
  api: {
    url: string
    timeout: number
    retryConfig: {
      maxRetries: number
      backoff: number
    }
    monitoring: {
      enabled: boolean
      metrics: string[]
      alertThresholds: Record<string, number>
    }
  }
  cloudflare: {
    accountId: string
    apiToken: string
    workerConfig: {
      memory: number
      timeout: number
    }
    security: {
      wafEnabled: boolean
      botProtection: boolean
      tlsVersion: '1.2' | '1.3'
    }
  }
  database: {
    prisma: ConnectionConfig & {
      migration: {
        auto: boolean
        lockTimeout: number
      }
    }
    turso: ConnectionConfig & {
      readReplicas?: number
    }
  }
}

export interface DatabaseClients {
  prisma: PrismaClient
  turso: D1Database
}

export interface ConnectionConfig {
  maxRetries: number
  timeout: number
  poolSize?: number
  ssl: boolean
}

export interface ServiceValidation {
  supabase: {
    urlValid: boolean
    keyValid: boolean
    connection: boolean
  }
  prisma: {
    schemaValid: boolean
    connection: boolean
    migrations: boolean
  }
  turso: {
    urlValid: boolean
    tokenValid: boolean
    connection: boolean
  }
}

export interface WorkerRequest extends Request {
  env: WorkerEnv
  ctx: ExecutionContext
}
