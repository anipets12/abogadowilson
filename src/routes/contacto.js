import { corsHeaders } from '../utils/cors';

/**
 * Maneja las rutas relacionadas con consultas y formularios de contacto
 */
export async function handleContactRoutes(request, services) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/contacto', '');
  
  // Cabeceras comunes para todas las respuestas
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders
  };

  try {
    // Procesar formulario de contacto
    if (path === '/enviar' && request.method === 'POST') {
      return await handleContactForm(request, services, headers);
    }
    
    // Manejar consulta ru00e1pida
    if (path === '/consulta-rapida' && request.method === 'POST') {
      return await handleQuickConsultation(request, services, headers);
    }

    // Ruta no encontrada
    return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), { 
      status: 404,
      headers
    });
  } catch (error) {
    console.error('Error en rutas de contacto:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500,
      headers
    });
  }
}

/**
 * Procesa el envu00edo de formulario de contacto general
 */
async function handleContactForm(request, services, headers) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Los campos nombre, email y mensaje son obligatorios'
      }), { 
        status: 400,
        headers
      });
    }
    
    // Guardar en Supabase
    const { data: result, error } = await services.supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        status: 'pending',
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Mensaje enviado correctamente'
    }), { 
      status: 201,
      headers
    });
  } catch (error) {
    console.error('Error al procesar formulario de contacto:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al procesar la solicitud',
      error: error.message
    }), { 
      status: 500, 
      headers
    });
  }
}

/**
 * Procesa consultas legales ru00e1pidas
 */
async function handleQuickConsultation(request, services, headers) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Los campos nombre, email y mensaje son obligatorios'
      }), { 
        status: 400,
        headers
      });
    }
    
    // Guardar en Supabase
    const { data: result, error } = await services.supabase
      .from('consultations')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        area: data.area || 'general',
        status: 'pending',
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    
    return new Response(JSON.stringify({
      success: true,
      consultation: result[0],
      message: 'Consulta enviada correctamente'
    }), { 
      status: 201,
      headers
    });
  } catch (error) {
    console.error('Error al procesar consulta ru00e1pida:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al procesar la consulta',
      error: error.message
    }), { 
      status: 500, 
      headers
    });
  }
}
