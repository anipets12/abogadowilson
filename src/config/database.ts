import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { WorkerEnv } from '../types'

export let prisma: PrismaClient | null = null
export let supabase: ReturnType<typeof createClient> | null = null

type Database = {
  [key: string]: any
}

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
