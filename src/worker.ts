/// <reference path="./cloudflare.d.ts" />
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { WorkerEnv, WorkerRequest, Services } from './types'
import { handleAuthRoutes } from './routes/auth'
import { handleDocumentRoutes } from './routes/documents'
import { handleContactRoutes } from './routes/contacto'
import { handleAppointmentRoutes } from './routes/appointments'
import { handleWhatsAppRoutes } from './worker-api/whatsapp-routes'
import { handleAutomationRoutes } from './worker-api/automation-routes'
import { createSupabaseClient, createPrismaClient, createNotionClient, createOpenAIClient, createPayPalClient, createMistralClient } from './shims'
import manifestJSON from '__STATIC_CONTENT_MANIFEST'
const assetManifest = JSON.parse(manifestJSON)

// Valores por defecto para servicios esenciales (útiles para desarrollo local)
const DEFAULT_SUPABASE_URL = 'https://phzldiaohelbyobhjrnc.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sbp_db5898ecc094d37ec87562399efe3833e63ab20f';

// Configuración de Cloudflare Turnstile
const TURNSTILE_SITE_KEY = '0x4AAAAAABDkl--Sw4n_bwmU';
const TURNSTILE_SECRET_KEY = '0x4AAAAAABDkl-wPYTurHAniMDA2wqOJ__k';

// Lista de rutas SPA que deben redirigir a index.html
const SPA_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/profile',
  '/dashboard',
  '/services',
  '/contact',
  '/blog',
  '/ebooks',
  '/forum',
  '/certificates',
  '/sponsorships',
  '/afiliados',
  '/appointments',
  '/auth',
  '/legal'
];

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
  TURNSTILE_SECRET_KEY: string
  CLOUDFLARE_ENV: string
  ENABLE_DIAGNOSTICS: string
  WHATSAPP_API_KEY: string
  WHATSAPP_API_URL: string
  WHATSAPP_AUTH_TOKEN: string
  N8N_WEBHOOK_URL: string
  AUTOMATION_API_KEY: string
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
  // Usar valores por defecto si no están disponibles en las variables de entorno
  const supabaseUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_KEY || DEFAULT_SUPABASE_KEY;
  
  if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
    console.warn('Variables de entorno de Supabase no encontradas, usando valores por defecto');
  }
  
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
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
    turnstileSecret: env.TURNSTILE_SECRET_KEY || TURNSTILE_SECRET_KEY,
    whatsappApiKey: env.WHATSAPP_API_KEY,
    whatsappApiUrl: env.WHATSAPP_API_URL,
    whatsappAuthToken: env.WHATSAPP_AUTH_TOKEN,
    n8nWebhookUrl: env.N8N_WEBHOOK_URL,
    automationApiKey: env.AUTOMATION_API_KEY
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
      return handleAuthRoutes(request, services)
    } else if (path.startsWith('/documents')) {
      // Document endpoints
      return await handleDocumentRoutes(request, services)
    } else if (path.startsWith('/contacto')) {
      // Contacto endpoints
      return await handleContactRoutes(request, services)
    } else if (path.startsWith('/appointments')) {
      // Citas endpoints
      return await handleAppointmentRoutes(request, services)
    } else if (path.startsWith('/whatsapp')) {
      // WhatsApp integration endpoints
      return await handleWhatsAppRoutes(request, env)
    } else if (path.startsWith('/automation')) {
      // Automation endpoints for n8n and MCP agents
      return await handleAutomationRoutes(request, env)
    } else if (path === '/status') {
      // Endpoint de estado y diagnóstico
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: env.CLOUDFLARE_ENV || 'development',
        turnstile_enabled: true
      }), { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } else if (path === '/verify-turnstile' && request.method === 'POST') {
      // Endpoint para verificar tokens de Turnstile
      return await handleTurnstileVerification(request, services.turnstileSecret);
    }

    return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      details: env.ENABLE_DIAGNOSTICS === 'true' ? (error as Error).message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
}

// Función para manejar la verificación de Turnstile
async function handleTurnstileVerification(request: Request, secretKey: string): Promise<Response> {
  try {
    const { token, action } = await request.json() as { token: string; action: string };
    
    if (!token) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Token de Turnstile es requerido'
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Verificar token con Turnstile API
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', request.headers.get('CF-Connecting-IP') || '');
    
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const turnstileResult = await turnstileResponse.json() as { success: boolean; 'error-codes'?: string[] };
    
    if (turnstileResult.success) {
      return new Response(JSON.stringify({
        success: true,
        verification: turnstileResult
      }), { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: 'Verificación de Turnstile fallida',
        errors: turnstileResult['error-codes']
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  } catch (error) {
    console.error('Error al verificar token de Turnstile:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al verificar token de Turnstile',
      error: (error as Error).message
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const securityHeaders = {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://*.turso.io https://api.notion.com https://challenges.cloudflare.com https://*.n8n.cloud",
      ...corsHeaders
    }

    try {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return handleOptions(request)
      }

      // Validate essential environment variables, pero usando valores por defecto para algunos servicios
      if (!env.DATABASE_URL || !env.JWT_SECRET) {
        console.warn('Faltan algunas variables de entorno, utilizando valores por defecto donde sea posible')
      }

      const url = new URL(request.url)
      
      // Handle API requests
      if (url.pathname.startsWith('/api')) {
        return handleApiRequest(request, env as Env)
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
          // Verificar si la ruta actual debe ser manejada por React Router
          const { pathname } = new URL(request.url);
          const isSpaRoute = SPA_ROUTES.some(route => 
            pathname === route || pathname.startsWith(`${route}/`)
          );
          
          // También considerar rutas sin extensión que no son /api/
          const hasExtension = /\.\w+$/.test(pathname);
          const shouldServeIndexHtml = isSpaRoute || (!hasExtension && pathname !== '/');
          
          // Si es una ruta SPA, servir index.html
          if (shouldServeIndexHtml) {
            console.log(`Sirviendo index.html para ruta SPA: ${pathname}`);
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
          }
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
