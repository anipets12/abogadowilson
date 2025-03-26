import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { WorkerEnv } from '../types'

let prisma: PrismaClient | null = null
let supabase: ReturnType<typeof createClient> | null = null

export const initializeDatabases = (env: WorkerEnv) => {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  
  if (!supabase) {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: { persistSession: false },
      db: { schema: 'public' }
    })
  }

  return { prisma, supabase }
}
