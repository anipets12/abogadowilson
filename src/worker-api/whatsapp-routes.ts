/**
 * Rutas de WhatsApp para Cloudflare Workers
 * Integración con n8n y agentes MCP
 */

import { supabase } from '../supabase';

export interface WhatsAppMessage {
  phone: string;
  message: string;
  name?: string;
  metadata?: Record<string, any>;
}

export interface WhatsAppWebhookEvent {
  from: string;  // Número de teléfono en formato internacional
  body: string;  // Contenido del mensaje
  mediaUrl?: string; // URL de multimedia si existe
  timestamp: number; // Timestamp del mensaje
  senderName?: string; // Nombre del remitente si está disponible
}

// Endpoints para integración con WhatsApp y n8n
export async function handleWhatsAppRoutes(request: Request, env: any) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Verificar API key para todas las rutas de WhatsApp
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== env.WHATSAPP_API_KEY) {
    return new Response(JSON.stringify({
      success: false,
      message: 'API key inválida'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (path === '/api/whatsapp/webhook' && request.method === 'POST') {
      // Recibir eventos de webhook de WhatsApp
      return handleWhatsAppWebhook(request, env);
    }
    
    if (path === '/api/whatsapp/send' && request.method === 'POST') {
      // Enviar mensaje de WhatsApp
      return handleSendMessage(request, env);
    }
    
    if (path === '/api/whatsapp/register-lead' && request.method === 'POST') {
      // Registrar nuevo lead desde WhatsApp
      return handleRegisterLead(request, env);
    }

    if (path === '/api/whatsapp/schedule-followup' && request.method === 'POST') {
      // Programar seguimiento automático
      return handleScheduleFollowup(request, env);
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ruta no encontrada'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en rutas de WhatsApp:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Manejar webhook de WhatsApp
async function handleWhatsAppWebhook(request: Request, env: any) {
  const data = await request.json() as WhatsAppWebhookEvent;
  
  try {
    // Guardar mensaje en Supabase para análisis y seguimiento
    const { error: dbError } = await supabase(env)
      .from('whatsapp_messages')
      .insert({
        phone: data.from,
        message: data.body,
        timestamp: new Date(data.timestamp).toISOString(),
        sender_name: data.senderName || null,
        media_url: data.mediaUrl || null
      });

    if (dbError) throw dbError;
    
    // Enviar evento a n8n para procesamiento adicional
    const n8nResponse = await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'whatsapp_message',
        data
      })
    });

    if (!n8nResponse.ok) {
      throw new Error(`Error al enviar a n8n: ${n8nResponse.status}`);
    }
    
    // Generar respuesta automática basada en el contexto del mensaje
    // Esto se puede ampliar con lógica más compleja según sea necesario
    let autoReply = false;
    let replyMessage = '';
    
    // Palabras clave para respuestas automáticas
    const message = data.body.toLowerCase();
    if (message.includes('precio') || message.includes('costo') || message.includes('valor')) {
      replyMessage = 'Gracias por contactar al Abogado Wilson. ¿En qué servicio específico está interesado para brindarle información sobre costos?';
      autoReply = true;
    } else if (message.includes('cita') || message.includes('turno') || message.includes('agenda')) {
      replyMessage = 'Para agendar una cita, necesitamos algunos datos. ¿Podría indicarnos qué día y hora le convendría?';
      autoReply = true;
    } else if (message.includes('ubicación') || message.includes('dirección') || message.includes('donde')) {
      replyMessage = 'Nos encontramos ubicados en Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra. ¿Desea agendar una visita presencial?';
      autoReply = true;
    } else if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes')) {
      replyMessage = 'Bienvenido al servicio de atención legal del Abogado Wilson. ¿En qué podemos ayudarle hoy?';
      autoReply = true;
    }
    
    // Si se determina enviar respuesta automática
    if (autoReply) {
      await sendWhatsAppReply(data.from, replyMessage, env);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Webhook procesado correctamente',
      autoReply
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error procesando webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Enviar mensaje de WhatsApp
async function handleSendMessage(request: Request, env: any) {
  const data = await request.json() as WhatsAppMessage;
  
  // Validar datos requeridos
  if (!data.phone || !data.message) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Los campos phone y message son requeridos'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Enviar mensaje mediante la API de WhatsApp Business
    await sendWhatsAppReply(data.phone, data.message, env);
    
    // Registrar mensaje enviado en Supabase
    const { error: dbError } = await supabase(env)
      .from('whatsapp_messages')
      .insert({
        phone: data.phone,
        message: data.message,
        timestamp: new Date().toISOString(),
        direction: 'outbound',
        metadata: data.metadata || null
      });

    if (dbError) throw dbError;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Mensaje enviado correctamente'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error enviando mensaje',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Registrar nuevo lead desde WhatsApp
async function handleRegisterLead(request: Request, env: any) {
  const data = await request.json();
  
  // Validar datos requeridos
  if (!data.phone || !data.name) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Los campos phone y name son requeridos'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Registrar lead en Supabase
    const { data: leadData, error: dbError } = await supabase(env)
      .from('leads')
      .insert({
        phone: data.phone,
        name: data.name,
        email: data.email || null,
        service_interest: data.service || null,
        source: 'whatsapp',
        created_at: new Date().toISOString(),
        metadata: {
          initial_message: data.initialMessage,
          tags: data.tags || []
        }
      })
      .select()
      .single();

    if (dbError) throw dbError;
    
    // Enviar a n8n para flujo de automatización de seguimiento
    const n8nResponse = await fetch(`${env.N8N_WEBHOOK_URL}/new-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        id: leadData.id,
        created_at: leadData.created_at
      })
    });

    if (!n8nResponse.ok) {
      console.warn(`Advertencia: Error al enviar lead a n8n: ${n8nResponse.status}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Lead registrado correctamente',
      data: leadData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error registrando lead:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error registrando lead',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Programar seguimiento automático
async function handleScheduleFollowup(request: Request, env: any) {
  const data = await request.json();
  
  // Validar datos requeridos
  if (!data.phone || !data.scheduledDate || !data.type) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Los campos phone, scheduledDate y type son requeridos'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Guardar en la tabla de seguimientos
    const { data: followupData, error: dbError } = await supabase(env)
      .from('follow_ups')
      .insert({
        phone: data.phone,
        scheduled_date: data.scheduledDate,
        type: data.type,
        status: 'pending',
        message_template: data.messageTemplate || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Seguimiento programado correctamente',
      data: followupData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error programando seguimiento:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error programando seguimiento',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Función para enviar mensajes de WhatsApp
async function sendWhatsAppReply(to: string, message: string, env: any) {
  // Formatear el número si es necesario (asegurar formato internacional)
  let formattedNumber = to;
  if (!to.startsWith('+')) {
    formattedNumber = `+${to}`;
  }
  
  // Integración con API de WhatsApp Business
  // Este es un ejemplo; debe ser reemplazado con la API real que se utilizará
  const response = await fetch(env.WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.WHATSAPP_AUTH_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error en API de WhatsApp: ${response.status} - ${errorData}`);
  }
  
  return response.json();
}
