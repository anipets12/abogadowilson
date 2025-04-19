import { corsHeaders } from '../utils/cors';

/**
 * Maneja las rutas relacionadas con citas y programaciu00f3n
 */
export async function handleAppointmentRoutes(request, services) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/appointments', '');
  
  // Cabeceras comunes para todas las respuestas
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders
  };

  try {
    // Comprobar la ruta y mu00e9todo
    if (path === '/schedule' && request.method === 'POST') {
      return await scheduleAppointment(request, services, headers);
    }
    
    if (path === '/available' && request.method === 'GET') {
      return await getAvailableSlots(request, services, headers);
    }
    
    if (path.startsWith('/cancel/') && request.method === 'POST') {
      const appointmentId = path.replace('/cancel/', '');
      return await cancelAppointment(appointmentId, request, services, headers);
    }

    // Ruta no encontrada
    return new Response(JSON.stringify({ error: 'Ruta no encontrada' }), { 
      status: 404,
      headers
    });
  } catch (error) {
    console.error('Error en rutas de citas:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500,
      headers
    });
  }
}

/**
 * Programa una nueva cita
 */
async function scheduleAppointment(request, services, headers) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    if (!data.name || !data.email || !data.date || !data.time) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Faltan datos requeridos para programar la cita'
      }), { 
        status: 400,
        headers
      });
    }
    
    // Verificar disponibilidad (prevenir doble reserva)
    const { data: existingAppointments, error: checkError } = await services.supabase
      .from('appointments')
      .select('*')
      .eq('date', data.date)
      .eq('time', data.time)
      .neq('status', 'cancelled');
      
    if (checkError) throw checkError;
    
    if (existingAppointments?.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Lo sentimos, este horario ya ha sido reservado'
      }), { 
        status: 409, // Conflict
        headers
      });
    }
    
    // Crear la cita en Supabase
    const { data: appointment, error } = await services.supabase
      .from('appointments')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        reason: data.reason,
        area: data.area || 'general',
        date: data.date,
        time: data.time,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    
    // Enviar correo de confirmacion (implementaciu00f3n posterior)
    // await sendAppointmentConfirmation(data.email, appointment[0]);
    
    return new Response(JSON.stringify({
      success: true,
      appointment: appointment[0],
      message: 'Cita agendada correctamente'
    }), { 
      status: 201,
      headers
    });
  } catch (error) {
    console.error('Error al programar cita:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al programar la cita',
      error: error.message
    }), { 
      status: 500, 
      headers
    });
  }
}

/**
 * Obtiene los horarios disponibles para una fecha especu00edfica
 */
async function getAvailableSlots(request, services, headers) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    
    if (!date) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Debe especificar una fecha'
      }), { 
        status: 400,
        headers
      });
    }
    
    // Obtener citas existentes para la fecha
    const { data: existingAppointments, error } = await services.supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .neq('status', 'cancelled');
      
    if (error) throw error;
    
    // Horarios disponibles (9am a 5pm)
    const allTimeSlots = [];
    for (let hour = 9; hour <= 17; hour++) {
      allTimeSlots.push(`${hour}:00`);
    }
    
    // Filtrar horarios ya reservados
    const bookedTimes = existingAppointments.map(app => app.time);
    const availableSlots = allTimeSlots.filter(time => !bookedTimes.includes(time));
    
    return new Response(JSON.stringify({
      success: true,
      date,
      availableSlots
    }), { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al obtener horarios disponibles',
      error: error.message
    }), { 
      status: 500, 
      headers
    });
  }
}

/**
 * Cancela una cita existente
 */
async function cancelAppointment(appointmentId, request, services, headers) {
  try {
    // Verificar que la cita exista
    const { data: appointment, error: checkError } = await services.supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
      
    if (checkError) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Cita no encontrada'
      }), { 
        status: 404,
        headers
      });
    }
    
    // Actualizar estado a cancelado
    const { data, error } = await services.supabase
      .from('appointments')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', appointmentId);
      
    if (error) throw error;
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Cita cancelada correctamente'
    }), { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al cancelar la cita',
      error: error.message
    }), { 
      status: 500, 
      headers
    });
  }
}
