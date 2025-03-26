import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { paypalClient } from './lib/paypal';
import { authRouter } from './routes/auth';
import { dashboardRouter } from './routes/dashboard';
import { consultationRouter } from './routes/consultation';
import { paymentRouter } from './routes/payment';

interface Env {
  // ...existing code...
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_MODE: 'sandbox' | 'live';
}

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: ['error'],
});

let supabase: ReturnType<typeof createClient>;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Initialize Supabase only once
    if (!supabase) {
      supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    }

    const url = new URL(request.url);
    const headers = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    try {
      // Health check endpoint
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok' }), { headers });
      }

      // Route handlers
      const routeHandlers = {
        '/api/auth': () => authRouter(request, env, { prisma, supabase, headers }),
        '/api/consultation': () => handleConsultation(request, prisma, headers),
        '/api/payment': () => handlePayment(request, env, headers),
      };

      for (const [path, handler] of Object.entries(routeHandlers)) {
        if (url.pathname.startsWith(path)) {
          return await handler();
        }
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), { 
        headers, 
        status: 404 
      });

    } catch (err: any) {
      console.error('Error:', err);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: err.message 
      }), { 
        headers, 
        status: 500 
      });
    } finally {
      // Cleanup
      await prisma.$disconnect();
    }
  }
};
