import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { WorkerEnv, WorkerRequest } from './types'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const assetManifest = JSON.parse(manifestJSON)

export interface Env {
  DB: D1Database
  ASSETS: KVNamespace
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleOptions(request: Request) {
  if (request.headers.get('Origin') !== null) {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  return new Response(null, {
    headers: {
      Allow: 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}

// Agrega función para responder llamadas API desde el Worker
function handleApiRequest(request: Request, env: Env): Promise<Response> {
  // Aquí se integra la lógica (por ejemplo, createApiHandler)
  return new Response('API endpoint from Worker', { status: 200 })
}

export default {
  async fetch(request: WorkerRequest, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'",
      ...corsHeaders
    }

    try {
      // Validate environment
      if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
        throw new Error('Missing required environment variables')
      }

      // Handle API routes
      if (request.url.includes('/api/')) {
        return handleApiRequest(request, env)
      }

      // Serve static assets
      return await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
        manifest: assetManifest,
        cacheControl: {
          browserTTL: 60 * 60 * 24 * 365, // 1 year
          edgeTTL: 60 * 60 * 24 * 2 // 2 days
        }
      })
    } catch (error) {
      const errorResponse = {
        error: error instanceof Error ? error.message : 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        timestamp: Date.now()
      }

      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      })
    }
  }
}
