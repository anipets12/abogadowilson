import axios from 'axios';
import { supabase } from '../config/database';
// import { getRuntime } from '@cloudflare/workers-runtime-types' - Removed due to missing type
import type { ApiResponse, HealthCheck } from '../types';

const api = axios?.create ? axios.create({
  baseURL: (typeof process !== 'undefined' ? process.env?.VITE_API_URL : 
           (typeof window !== 'undefined' ? window.__ENV__?.VITE_API_URL : '/api')),
  timeout: 10000,
}) : axios;

api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  if (session?.data.session?.access_token) {
    config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

async function checkHealth(env: any): Promise<HealthCheck> {
  const services: Record<string, boolean> = {};
  try {
    const [apiCheck, dbCheck] = await Promise.all([
      api.get('/health'),
      env.DB.prepare('SELECT 1').run()
    ]);
    
    services.api = apiCheck.status === 200;
    services.database = !!dbCheck;
    services.kv = !!(await env.ASSETS.get('test-key'));
    
    return {
      status: Object.values(services).every(Boolean) ? 'ok' : 'error',
      services,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      services,
      timestamp: new Date().toISOString()
    };
  }
}

async function handleAuthRequest(request: Request, env: any): Promise<Response> {
  return new Response('Auth endpoint', { status: 200 })
}

async function handleApiRequest(request: Request, env: any): Promise<Response> {
  return new Response('API endpoint', { status: 200 })
}

const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof Error) {
    return {
      error: 'API Error',
      details: error.message,
      code: 'API_ERROR'
    }
  }
  return {
    error: 'Unknown Error',
    code: 'UNKNOWN_ERROR'
  }
}

export const consultaService = {
  crear: async (data: ConsultaData): Promise<ApiResponse> => {
    try {
      const { error } = await supabase
        .from('consultas')
        .insert(data)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: handleApiError(error)
      }
    }
  },
  listar: () => api.get('/consultas'),
};

export const authService = {
  login: (credentials: LoginData) => api.post('/auth/login', credentials),
  registro: (userData: UserData) => api.post('/auth/registro', userData),
};

const runtime = getRuntime()

export const createApiHandler = (env: any) => ({
  async handleRequest(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url)
    
    // Health check
    if (pathname === '/api/health') {
      const status = await checkHealth(env)
      return new Response(JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Auth endpoints
    if (pathname.startsWith('/api/auth/')) {
      return handleAuthRequest(request, env)
    }

    // Otros endpoints API
    return handleApiRequest(request, env)
  }
})

export default api;
