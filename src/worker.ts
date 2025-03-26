/// <reference path="./cloudflare.d.ts" />
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { WorkerEnv, WorkerRequest, Services } from './types'
import { handleAuthRoutes } from './routes/auth'
import { handleDocumentRoutes } from './routes/documents'
import { handleContactRoutes } from './routes/contacto'
import { createSupabaseClient, createPrismaClient, createNotionClient, createOpenAIClient, createPayPalClient, createMistralClient } from './shims'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const assetManifest = JSON.parse(manifestJSON)

export interface Env {
  DB: D1Database
  ASSETS: KVNamespace
  SUPABASE_URL: string
  SUPABASE_KEY: string
  DATABASE_URL: string
  JWT_SECRET: string
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
  CORS_ORIGIN: string
  NOTION_API_KEY: string
  NOTION_DATABASE_ID: string
  OPENAI_API_KEY: string
  PAYPAL_CLIENT_ID: string
  PAYPAL_CLIENT_SECRET: string
  MISTRAL_API_KEY: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

async function handleOptions(request: Request) {
  return new Response(null, {
    headers: {
      ...corsHeaders,
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}

function createServices(env: Env) {
  const supabase = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_KEY);
  const prisma = createPrismaClient(env.DATABASE_URL);
  const notion = createNotionClient(env.NOTION_API_KEY, env.NOTION_DATABASE_ID);
  const openai = createOpenAIClient(env.OPENAI_API_KEY);
  const paypal = createPayPalClient(env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET);
  const mistral = createMistralClient(env.MISTRAL_API_KEY);
  
  return {
    supabase,
    prisma,
    notion,
    openai,
    paypal,
    mistral,
    db: env.DB,
    assets: env.ASSETS,
  }
}

async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const services = createServices(env)
  const url = new URL(request.url)
  const path = url.pathname.replace('/api', '')

  try {
    // API routes handling
    if (path.startsWith('/auth')) {
      // Auth endpoints
      return await handleAuthRoutes(request, services)
    } else if (path.startsWith('/documents')) {
      // Document endpoints
      return await handleDocumentRoutes(request, services)
    } else if (path.startsWith('/contacto')) {
      // Contacto endpoints
      return await handleContactRoutes(request, services)
    }

    return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}

export default {
  async fetch(request: WorkerRequest, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://*.turso.io https://api.notion.com",
      ...corsHeaders
    }

    try {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return handleOptions(request)
      }

      // Validate environment
      if (!env.SUPABASE_URL || !env.SUPABASE_KEY || !env.DATABASE_URL || !env.JWT_SECRET || !env.OPENAI_API_KEY || !env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET || !env.MISTRAL_API_KEY) {
        throw new Error('Faltan variables de entorno requeridas')
      }

      const url = new URL(request.url)
      
      // Handle API requests
      if (url.pathname.startsWith('/api')) {
        return handleApiRequest(request, env)
      }

      // Serve static assets
      try {
        const page = await getAssetFromKV(request, {
          ASSET_MANIFEST: assetManifest,
          ASSET_NAMESPACE: env.ASSETS,
        })

        const response = new Response(page.body, page)
        response.headers.set('X-XSS-Protection', '1; mode=block')
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })

        return response
      } catch (e) {
        // Si no se encuentra el recurso, devolver index.html para rutas SPA
        try {
          // Creamos un nuevo objeto Request con la URL modificada para index.html
          const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
          
          const notFoundResponse = await getAssetFromKV(
            indexRequest,
            {
              ASSET_MANIFEST: assetManifest,
              ASSET_NAMESPACE: env.ASSETS,
            }
          );

          const response = new Response(notFoundResponse.body, {
            ...notFoundResponse,
            status: 200, // Devolvemos 200 para SPA routing
          });

          Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value)
          });

          return response;
        } catch (indexError) {
          return new Response('Página no encontrada', { 
            status: 404,
            headers: securityHeaders
          });
        }
      }
    } catch (error) {
      console.error('Worker Error:', error)
      return new Response('Error interno del servidor', {
        status: 500,
        headers: securityHeaders,
      })
    }
  },
}
