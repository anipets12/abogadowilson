import api from './apiService';
import { supabaseService } from './supabaseService';

// Planes de tokens disponibles
export const tokenPlans = [
  {
    id: 'basic',
    name: 'Plan Básico',
    tokens: 5,
    price: 5.99,
    description: 'Ideal para consultas sencillas y documentos básicos',
    features: ['5 tokens', 'Documentos básicos', 'Consultas simples']
  },
  {
    id: 'standard',
    name: 'Plan Estándar',
    tokens: 15,
    price: 14.99,
    popular: true,
    description: 'Perfecto para cubrir varias consultas y documentos',
    features: ['15 tokens', 'Documentos completos', 'Consultas detalladas', '5% descuento']
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    tokens: 30,
    price: 24.99,
    description: 'La mejor opción para profesionales y empresas',
    features: ['30 tokens', 'Documentos personalizados', 'Consultas urgentes', '10% descuento']
  },
  {
    id: 'enterprise',
    name: 'Plan Empresarial',
    tokens: 100,
    price: 69.99,
    description: 'Solución completa para despachos y empresas',
    features: ['100 tokens', 'Documentos ilimitados', 'Consultas prioritarias', '15% descuento', 'Soporte personalizado']
  }
];

// Servicios disponibles y su costo en tokens
export const tokenServices = {
  // Consultas legales
  'consulta-simple': { tokens: 1, name: 'Consulta Simple', description: 'Asesoría legal básica sobre temas generales' },
  'consulta-detallada': { tokens: 2, name: 'Consulta Detallada', description: 'Análisis más profundo de su situación legal' },
  'consulta-urgente': { tokens: 5, name: 'Consulta Urgente', description: 'Atención prioritaria para casos que requieren respuesta inmediata' },
  
  // Documentos legales
  'documento-basico': { tokens: 2, name: 'Documento Básico', description: 'Generación de documentos legales sencillos' },
  'documento-complejo': { tokens: 3, name: 'Documento Complejo', description: 'Documentos personalizados con mayor detalle' },
  'documento-especializado': { tokens: 5, name: 'Documento Especializado', description: 'Documentos legales complejos adaptados a su caso específico' },
  
  // Revisiones
  'revision-contrato': { tokens: 3, name: 'Revisión de Contrato', description: 'Análisis de contratos existentes' },
  'revision-demanda': { tokens: 4, name: 'Revisión de Demanda', description: 'Análisis de demandas y respuestas legales' },
  
  // Áreas específicas
  'penal-consulta': { tokens: 2, name: 'Consulta Penal', description: 'Asesoría especializada en derecho penal' },
  'civil-consulta': { tokens: 2, name: 'Consulta Civil', description: 'Asesoría especializada en derecho civil' },
  'transito-consulta': { tokens: 2, name: 'Consulta Tránsito', description: 'Asesoría especializada en casos de tránsito' },
  'comercial-consulta': { tokens: 2, name: 'Consulta Comercial', description: 'Asesoría especializada en derecho comercial' }
};

// Servicio principal de tokens
export const tokenService = {
  /**
   * Obtiene la cantidad actual de tokens del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
   */
  async getUserTokens(userId) {
    try {
      // Intentar usar Supabase primero
      if (supabaseService) {
        const { data, error } = await supabaseService.supabase
          .from('user_tokens')
          .select('tokens')
          .eq('user_id', userId)
          .single();
          
        if (!error && data) {
          return {
            success: true,
            tokens: data.tokens || 0,
            error: null
          };
        }
      }
      
      // Fallback a la API
      const response = await api.get(`/tokens/${userId}`);
      return {
        success: true,
        tokens: response.data?.tokens || 0,
        error: null
      };
    } catch (error) {
      console.error('Error al obtener tokens:', error);
      
      // Modo de desarrollo, simular tokens
      if (process.env.NODE_ENV === 'development' || 
          (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev'))) {
        console.log('Modo de desarrollo: Simulando tokens');
        return {
          success: true,
          tokens: 10, // En desarrollo, simular 10 tokens disponibles
          simulated: true,
          error: null
        };
      }
      
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al obtener tokens')
      };
    }
  },

  /**
   * Utiliza tokens para un servicio específico
   * @param {string} userId - ID del usuario
   * @param {string} serviceId - ID del servicio a utilizar
   * @param {number} [quantity=1] - Cantidad personalizada de tokens a usar
   * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
   */
  async useToken(userId, serviceId, quantity = null) {
    try {
      // Determinar la cantidad de tokens a usar
      let tokensToUse = 1; // Valor predeterminado
      
      if (quantity !== null) {
        tokensToUse = quantity;
      } else if (serviceId && tokenServices[serviceId]) {
        tokensToUse = tokenServices[serviceId].tokens;
      } else if (typeof window !== 'undefined' && window.__tokenValues) {
        // Usar valores globales si están disponibles
        const serviceMapping = {
          'consulta': window.__tokenValues.consultaEstandar,
          'consultaCompleja': window.__tokenValues.consultaCompleja,
          'documento': window.__tokenValues.generarDocumento,
          'urgente': window.__tokenValues.consultaUrgente
        };
        tokensToUse = serviceMapping[serviceId] || 1;
      }
      
      // Intentar usar Supabase primero
      if (supabaseService) {
        // Primero verificar si el usuario tiene suficientes tokens
        const { data: userData, error: userError } = await supabaseService.supabase
          .from('user_tokens')
          .select('tokens')
          .eq('user_id', userId)
          .single();
          
        if (userError) throw userError;
        
        if (!userData || userData.tokens < tokensToUse) {
          return {
            success: false,
            tokens: userData?.tokens || 0,
            error: new Error('No tiene suficientes tokens para realizar esta operación'),
            insufficientTokens: true
          };
        }
        
        // Actualizar tokens del usuario
        const { data, error } = await supabaseService.supabase
          .from('user_tokens')
          .update({ tokens: userData.tokens - tokensToUse })
          .eq('user_id', userId)
          .select()
          .single();
          
        if (error) throw error;
        
        // Registrar el uso de tokens
        await supabaseService.supabase
          .from('token_usage')
          .insert({
            user_id: userId,
            service_id: serviceId,
            tokens_used: tokensToUse,
            used_at: new Date().toISOString()
          });
        
        return {
          success: true,
          tokens: data.tokens,
          tokensUsed: tokensToUse,
          error: null
        };
      }
      
      // Fallback a la API
      const response = await api.post(`/tokens/use`, { 
        userId, 
        serviceId,
        tokens: tokensToUse 
      });
      
      return {
        success: response.data?.success,
        tokens: response.data?.tokens,
        tokensUsed: tokensToUse,
        error: null
      };
    } catch (error) {
      console.error('Error al usar token:', error);
      
      // Modo de desarrollo, simular uso de tokens
      if (process.env.NODE_ENV === 'development' || 
          (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev'))) {
        console.log('Modo de desarrollo: Simulando uso de tokens');
        return {
          success: true,
          tokens: 9, // Simular que quedan 9 tokens después de usar 1
          tokensUsed: 1,
          simulated: true,
          error: null
        };
      }
      
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al usar token')
      };
    }
  },

  /**
   * Recarga tokens para un usuario con un plan específico
   * @param {string} userId - ID del usuario
   * @param {string} planId - ID del plan de recarga
   * @param {Object} paymentInfo - Información del pago
   * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
   */
  async refillTokens(userId, planId = 'standard', paymentInfo = {}) {
    try {
      // Obtener información del plan
      const plan = tokenPlans.find(p => p.id === planId) || tokenPlans[1]; // Plan estándar por defecto
      
      // Intentar usar Supabase primero
      if (supabaseService) {
        // Primero verificar si el usuario existe en la tabla de tokens
        const { data: userData, error: userError } = await supabaseService.supabase
          .from('user_tokens')
          .select('tokens')
          .eq('user_id', userId);
          
        if (userError) throw userError;
        
        if (!userData || userData.length === 0) {
          // Si el usuario no existe, crearlo
          const { data, error } = await supabaseService.supabase
            .from('user_tokens')
            .insert({ user_id: userId, tokens: plan.tokens })
            .select()
            .single();
            
          if (error) throw error;
          
          // Registrar la transacción
          await supabaseService.supabase
            .from('token_transactions')
            .insert({
              user_id: userId,
              plan_id: planId,
              tokens_added: plan.tokens,
              amount_paid: plan.price,
              payment_method: paymentInfo.method || 'card',
              payment_id: paymentInfo.id,
              created_at: new Date().toISOString()
            });
          
          return {
            success: true,
            tokens: data.tokens,
            firstPurchase: true,
            error: null
          };
        } else {
          // Si el usuario existe, actualizar sus tokens
          const { data, error } = await supabaseService.supabase
            .from('user_tokens')
            .update({ tokens: userData[0].tokens + plan.tokens })
            .eq('user_id', userId)
            .select()
            .single();
            
          if (error) throw error;
          
          // Registrar la transacción
          await supabaseService.supabase
            .from('token_transactions')
            .insert({
              user_id: userId,
              plan_id: planId,
              tokens_added: plan.tokens,
              amount_paid: plan.price,
              payment_method: paymentInfo.method || 'card',
              payment_id: paymentInfo.id,
              created_at: new Date().toISOString()
            });
          
          return {
            success: true,
            tokens: data.tokens,
            error: null
          };
        }
      }
      
      // Fallback a la API
      const response = await api.post(`/tokens/refill`, { 
        userId,
        planId,
        paymentInfo
      });
      
      return {
        success: response.data?.success,
        tokens: response.data?.tokens,
        error: null
      };
    } catch (error) {
      console.error('Error al recargar tokens:', error);
      
      // Modo de desarrollo, simular recarga de tokens
      if (process.env.NODE_ENV === 'development' || 
          (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev'))) {
        // Obtener información del plan
        const plan = tokenPlans.find(p => p.id === planId) || tokenPlans[1]; // Plan estándar por defecto
        
        console.log(`Modo de desarrollo: Simulando recarga de ${plan.tokens} tokens`);
        return {
          success: true,
          tokens: 15, // Simular que ahora tiene 15 tokens en total
          tokensAdded: plan.tokens,
          planId,
          plan,
          simulated: true,
          error: null
        };
      }
      
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al recargar tokens')
      };
    }
  },
  
  /**
   * Asigna tokens gratuitos a un nuevo usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, tokens: number, error: Error|null}>}
   */
  async giveNewUserTokens(userId) {
    try {
      const tokensToGive = typeof window !== 'undefined' && window.__tokenValues ? 
        window.__tokenValues.tokensNuevoUsuario : 3;
      
      // Intentar usar Supabase primero
      if (supabaseService) {
        // Verificar si el usuario ya existe
        const { data: userData, error: userError } = await supabaseService.supabase
          .from('user_tokens')
          .select('tokens')
          .eq('user_id', userId);
          
        if (userError) throw userError;
        
        if (!userData || userData.length === 0) {
          // Si el usuario no existe, crearlo con tokens gratuitos
          const { data, error } = await supabaseService.supabase
            .from('user_tokens')
            .insert({ user_id: userId, tokens: tokensToGive })
            .select()
            .single();
            
          if (error) throw error;
          
          // Registrar la asignación de tokens gratuitos
          await supabaseService.supabase
            .from('token_transactions')
            .insert({
              user_id: userId,
              plan_id: 'free',
              tokens_added: tokensToGive,
              amount_paid: 0,
              payment_method: 'free',
              payment_id: 'new_user_gift',
              created_at: new Date().toISOString()
            });
          
          return {
            success: true,
            tokens: data.tokens,
            freeTokens: true,
            error: null
          };
        } else {
          // El usuario ya existe, no se agregan tokens adicionales
          return {
            success: true,
            tokens: userData[0].tokens,
            alreadyExists: true,
            error: null
          };
        }
      }
      
      // Fallback a la API
      const response = await api.post(`/tokens/new-user`, { userId });
      return {
        success: response.data?.success,
        tokens: response.data?.tokens,
        error: null
      };
    } catch (error) {
      console.error('Error al asignar tokens gratuitos:', error);
      
      // Modo de desarrollo, simular asignación de tokens gratuitos
      if (process.env.NODE_ENV === 'development' || 
          (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev'))) {
        const tokensToGive = typeof window !== 'undefined' && window.__tokenValues ? 
          window.__tokenValues.tokensNuevoUsuario : 3;
        
        console.log(`Modo de desarrollo: Simulando asignación de ${tokensToGive} tokens gratuitos`);
        return {
          success: true,
          tokens: tokensToGive,
          freeTokens: true,
          simulated: true,
          error: null
        };
      }
      
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al asignar tokens gratuitos')
      };
    }
  },
  
  /**
   * Obtiene el historial de uso de tokens del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<{success: boolean, history: Array, error: Error|null}>}
   */
  async getTokenHistory(userId) {
    try {
      // Intentar usar Supabase primero
      if (supabaseService) {
        // Obtener historial de uso
        const { data: usageData, error: usageError } = await supabaseService.supabase
          .from('token_usage')
          .select('*')
          .eq('user_id', userId)
          .order('used_at', { ascending: false });
          
        if (usageError) throw usageError;
        
        // Obtener historial de transacciones
        const { data: transactionData, error: transactionError } = await supabaseService.supabase
          .from('token_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (transactionError) throw transactionError;
        
        return {
          success: true,
          usage: usageData || [],
          transactions: transactionData || [],
          error: null
        };
      }
      
      // Fallback a la API
      const response = await api.get(`/tokens/history/${userId}`);
      return {
        success: true,
        usage: response.data?.usage || [],
        transactions: response.data?.transactions || [],
        error: null
      };
    } catch (error) {
      console.error('Error al obtener historial de tokens:', error);
      
      // Modo de desarrollo, simular historial
      if (process.env.NODE_ENV === 'development' || 
          (typeof window !== 'undefined' && window.location.hostname.includes('workers.dev'))) {
        console.log('Modo de desarrollo: Simulando historial de tokens');
        
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        
        return {
          success: true,
          usage: [
            { id: 1, user_id: userId, service_id: 'consulta-detallada', tokens_used: 2, used_at: now.toISOString() },
            { id: 2, user_id: userId, service_id: 'documento-basico', tokens_used: 2, used_at: yesterday.toISOString() },
            { id: 3, user_id: userId, service_id: 'penal-consulta', tokens_used: 2, used_at: lastWeek.toISOString() }
          ],
          transactions: [
            { id: 1, user_id: userId, plan_id: 'free', tokens_added: 3, amount_paid: 0, payment_method: 'free', created_at: lastWeek.toISOString() },
            { id: 2, user_id: userId, plan_id: 'standard', tokens_added: 15, amount_paid: 14.99, payment_method: 'card', created_at: yesterday.toISOString() }
          ],
          simulated: true,
          error: null
        };
      }
      
      return {
        success: false,
        usage: [],
        transactions: [],
        error: new Error('Error al obtener historial de tokens')
      };
    }
  }
};
