import { Services } from '../types'

export async function handleContactRoutes(request: Request, services: Services): Promise<Response> {
  const { notion } = services
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/contacto', '')
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // POST /api/contacto - Enviar formulario de contacto
    if (request.method === 'POST' && path === '/') {
      const body = await request.json() as {
        nombre: string;
        email: string;
        telefono: string;
        asunto?: string;
        mensaje?: string;
      }
      
      // Validar campos requeridos
      if (!body.nombre || !body.email || !body.telefono) {
        return new Response(JSON.stringify({
          error: 'Nombre, email y teléfono son campos obligatorios'
        }), { 
          status: 400,
          headers: corsHeaders
        })
      }

      // Registrar cliente en Notion
      const result = await notion.registrarCliente({
        nombre: body.nombre,
        email: body.email,
        telefono: body.telefono,
        asunto: body.asunto,
        mensaje: body.mensaje
      })

      return new Response(JSON.stringify({
        mensaje: 'Información de contacto enviada correctamente',
        id: result.id
      }), {
        status: 201,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({
      error: 'Método no permitido'
    }), { 
      status: 405, 
      headers: corsHeaders
    })
    
  } catch (error) {
    console.error('Error en contacto:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Error al procesar el formulario de contacto',
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    )
  }
}
