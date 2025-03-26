import { Services } from '../types'

export async function handleAuthRoutes(request: Request, services: Services): Promise<Response> {
  const { supabase } = services
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth', '')
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  try {
    if (request.method === 'POST') {
      const body = await request.json()

      if (path === '/login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        })

        if (error) throw error
        return new Response(JSON.stringify({ 
          user: data.user,
          session: data.session,
          token: data.session?.access_token
        }), {
          status: 200,
          headers: corsHeaders
        })
      }

      if (path === '/register') {
        const { data, error } = await supabase.auth.signUp({
          email: body.email,
          password: body.password,
          options: {
            data: {
              name: body.name,
              role: body.role || 'user'
            },
          },
        })

        if (error) throw error
        return new Response(JSON.stringify({
          user: data.user,
          message: 'Usuario registrado correctamente'
        }), {
          status: 201,
          headers: corsHeaders
        })
      }
    }
    
    // Ruta para verificar sesión actual
    if (request.method === 'GET' && path === '/session') {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'No autorizado' }), {
          status: 401,
          headers: corsHeaders
        })
      }
      
      // En una implementación real, verificaríamos el token
      // Aquí simulamos una respuesta correcta
      return new Response(JSON.stringify({ 
        authenticated: true,
        user: { id: 'user-id', email: 'usuario@ejemplo.com', role: 'user' }
      }), {
        status: 200,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({ error: 'Método no permitido' }), { 
      status: 405,
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Error de autenticación:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Falló la autenticación',
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    )
  }
}
