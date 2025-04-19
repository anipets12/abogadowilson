import { Services } from '../types'

import { typedBody } from '../utils/typeUtils';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  name?: string;
  role?: string;
}

export async function handleAuthRoutes(request: Request, services: Services): Promise<Response> {
  const { supabase } = services;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    if (request.method === 'POST') {
      // Usar un enfoque diferente para manejar el cuerpo JSON
      let requestBody: any = {};
      try {
        requestBody = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Error parsing JSON body' }), {
          status: 400,
          headers: corsHeaders
        });
      }

      if (path === '/login') {
        // Extraer valores de manera segura
        const email = requestBody?.email || '';
        const password = requestBody?.password || '';
        
        if (!email || !password) {
          return new Response(JSON.stringify({ error: 'Email y password son requeridos' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        return new Response(JSON.stringify({ 
          user: data.user,
          session: data.session,
          token: data.session?.access_token
        }), {
          status: 200,
          headers: corsHeaders
        });
      }

      if (path === '/register') {
        // Extraer valores de manera segura
        const email = requestBody?.email || '';
        const password = requestBody?.password || '';
        const name = requestBody?.name || '';
        const role = requestBody?.role || 'user';

        if (!email || !password) {
          return new Response(JSON.stringify({ error: 'Email y password son requeridos' }), {
            status: 400,
            headers: corsHeaders
          });
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role
            },
          },
        });

        if (error) throw error;
        return new Response(JSON.stringify({
          user: data.user,
          message: 'Usuario registrado correctamente'
        }), {
          status: 201,
          headers: corsHeaders
        });
      }
    }
    
    // Ruta para verificar sesión actual
    if (request.method === 'GET' && path === '/session') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
          status: 401,
          headers: corsHeaders
        });
      }
      
      // En una implementación real, verificaríamos el token
      // Aquí simulamos una respuesta correcta
      return new Response(JSON.stringify({ 
        authenticated: true,
        user: { id: 'user-id', email: 'usuario@ejemplo.com', role: 'user' }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    // Para cualquier otra ruta o método no permitido
    return new Response(JSON.stringify({ error: 'Ruta no encontrada o método no permitido' }), {
      status: 404,
      headers: corsHeaders
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error de autenticación'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
