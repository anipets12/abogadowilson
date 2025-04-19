/**
 * Rutas para automatización con n8n y agentes MCP
 * Permite la integración con sistemas externos para marketing, contenido y actualizaciones
 */

import { supabase } from '../supabase';

export async function handleAutomationRoutes(request: Request, env: any) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Verificar API key para rutas de automatización
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== env.AUTOMATION_API_KEY) {
    return new Response(JSON.stringify({
      success: false,
      message: 'API key inválida'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    if (path === '/api/automation/update-news' && request.method === 'POST') {
      // Actualizar noticias del blog automáticamente
      return handleUpdateNews(request, env);
    }
    
    if (path === '/api/automation/create-campaign' && request.method === 'POST') {
      // Crear nueva campaña de marketing
      return handleCreateCampaign(request, env);
    }
    
    if (path === '/api/automation/sync-clients' && request.method === 'POST') {
      // Sincronizar base de datos de clientes
      return handleSyncClients(request, env);
    }

    if (path === '/api/automation/process-leads' && request.method === 'POST') {
      // Procesar leads automáticamente
      return handleProcessLeads(request, env);
    }
    
    return new Response(JSON.stringify({
      success: false,
      message: 'Ruta no encontrada'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en rutas de automatización:', error);
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

// Actualizar noticias del blog automáticamente desde agentes MCP o APIs externas
async function handleUpdateNews(request: Request, env: any) {
  const data = await request.json();
  
  // Validar datos requeridos
  if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Se requiere un array de artículos válido'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Procesar cada artículo
    const results = [];
    for (const article of data.articles) {
      // Validar datos mínimos requeridos
      if (!article.title || !article.content || !article.category) {
        results.push({
          success: false,
          message: 'Artículo inválido, se requiere title, content y category',
          article
        });
        continue;
      }
      
      // Preparar datos para inserción
      const articleData = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || article.content.substring(0, 150) + '...',
        category: article.category,
        image: article.image || null,
        author: article.author || 'Wilson Alexander Ipiales Guerrón',
        date: article.date || new Date().toISOString(),
        tags: article.tags || [],
        read_time: article.readTime || Math.ceil(article.content.split(' ').length / 200), // ~200 palabras por minuto
        status: article.status || 'published',
        created_by: 'automation',
        is_automated: true
      };
      
      // Insertar en Supabase
      const { data: insertedData, error } = await supabase(env)
        .from('blog_articles')
        .insert(articleData)
        .select()
        .single();
      
      if (error) {
        results.push({
          success: false,
          message: 'Error al insertar artículo',
          error: error.message,
          article
        });
      } else {
        results.push({
          success: true,
          message: 'Artículo creado correctamente',
          id: insertedData.id,
          article
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: `Procesados ${results.length} artículos`,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error actualizando noticias:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error actualizando noticias',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Crear nueva campaña de marketing automáticamente
async function handleCreateCampaign(request: Request, env: any) {
  const data = await request.json();
  
  // Validar datos requeridos
  if (!data.title || !data.description || !data.linkCode) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Los campos title, description y linkCode son requeridos'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Insertar campaña en Supabase
    const campaignData = {
      title: data.title,
      description: data.description,
      image_url: data.imageUrl || null,
      link_code: data.linkCode,
      reward: data.reward || 0,
      reward_description: data.rewardDescription || null,
      expiry: data.expiry || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 días por defecto
      active: data.active !== undefined ? data.active : true,
      created_at: new Date().toISOString(),
      created_by: 'automation',
      campaign_type: data.campaignType || 'referral',
      metadata: data.metadata || null
    };
    
    const { data: insertedData, error } = await supabase(env)
      .from('marketing_campaigns')
      .insert(campaignData)
      .select()
      .single();
    
    if (error) throw error;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Campaña creada correctamente',
      data: insertedData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creando campaña:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error creando campaña',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Sincronizar base de datos de clientes con sistemas externos
async function handleSyncClients(request: Request, env: any) {
  const data = await request.json();
  
  try {
    // Validar datos
    if (!data.clients || !Array.isArray(data.clients)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Se requiere un array de clientes válido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const results = [];
    for (const client of data.clients) {
      // Verificar si el cliente ya existe por email o teléfono
      const { data: existingClient, error: searchError } = await supabase(env)
        .from('clients')
        .select('id')
        .or(`email.eq.${client.email},phone.eq.${client.phone}`)
        .single();
      
      if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = no se encontró ningún registro
        results.push({
          success: false,
          message: 'Error al buscar cliente',
          error: searchError.message,
          client
        });
        continue;
      }
      
      // Si el cliente existe, actualizar
      if (existingClient?.id) {
        const { data: updatedData, error: updateError } = await supabase(env)
          .from('clients')
          .update({
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address || null,
            identification: client.identification || null,
            status: client.status || 'active',
            updated_at: new Date().toISOString(),
            metadata: client.metadata || null
          })
          .eq('id', existingClient.id)
          .select()
          .single();
        
        if (updateError) {
          results.push({
            success: false,
            message: 'Error al actualizar cliente',
            error: updateError.message,
            client
          });
        } else {
          results.push({
            success: true,
            message: 'Cliente actualizado correctamente',
            id: updatedData.id,
            updated: true,
            client
          });
        }
      } else {
        // Si el cliente no existe, crear
        const clientData = {
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address || null,
          identification: client.identification || null,
          status: client.status || 'active',
          created_at: new Date().toISOString(),
          source: client.source || 'sync',
          metadata: client.metadata || null
        };
        
        const { data: insertedData, error: insertError } = await supabase(env)
          .from('clients')
          .insert(clientData)
          .select()
          .single();
        
        if (insertError) {
          results.push({
            success: false,
            message: 'Error al crear cliente',
            error: insertError.message,
            client
          });
        } else {
          results.push({
            success: true,
            message: 'Cliente creado correctamente',
            id: insertedData.id,
            created: true,
            client
          });
        }
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: `Procesados ${results.length} clientes`,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sincronizando clientes:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error sincronizando clientes',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Procesar leads automáticamente
async function handleProcessLeads(request: Request, env: any) {
  const data = await request.json();
  
  try {
    // Obtener leads sin procesar
    const { data: leads, error: fetchError } = await supabase(env)
      .from('leads')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true });
    
    if (fetchError) throw fetchError;
    
    if (!leads || leads.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No hay leads pendientes para procesar',
        processed: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Procesar cada lead
    const results = [];
    for (const lead of leads) {
      // En un entorno real, aquí se realizaría lógica más compleja
      // como categorización, asignación a vendedores, etc.
      
      // Simulamos envío a CRM externo
      try {
        // Marcar como procesado
        const { error: updateError } = await supabase(env)
          .from('leads')
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
            status: 'assigned', // o el estado que corresponda según la lógica de negocio
            notes: `Procesado automáticamente el ${new Date().toLocaleString()}`
          })
          .eq('id', lead.id);
        
        if (updateError) throw updateError;
        
        // Programar seguimiento si corresponde
        if (data.scheduleFollowup !== false) {
          const followupDate = new Date();
          followupDate.setDate(followupDate.getDate() + 1); // seguimiento al día siguiente
          
          const { error: followupError } = await supabase(env)
            .from('follow_ups')
            .insert({
              lead_id: lead.id,
              phone: lead.phone,
              scheduled_date: followupDate.toISOString(),
              type: 'initial_contact',
              status: 'pending',
              created_at: new Date().toISOString()
            });
          
          if (followupError) console.warn('Error al programar seguimiento:', followupError);
        }
        
        results.push({
          success: true,
          message: 'Lead procesado correctamente',
          lead_id: lead.id
        });
      } catch (error) {
        results.push({
          success: false,
          message: 'Error al procesar lead',
          error: error instanceof Error ? error.message : 'Unknown error',
          lead_id: lead.id
        });
      }
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: `Procesados ${results.length} leads`,
      results,
      processed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error procesando leads:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error procesando leads',
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
