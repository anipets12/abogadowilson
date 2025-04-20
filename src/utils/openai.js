// OpenRouter API integration utility functions
const OPENROUTER_API_KEY = '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';

// Configuración de fallback para evitar errores en desarrollo
const FALLBACK_RESPONSE = {
  consejo: 'Este es un consejo legal simulado para propósitos de desarrollo. En producción, obtendrás un análisis real basado en IA.',
  documento: 'Este es un documento legal simulado para propósitos de desarrollo.',
  analisis: 'Este es un análisis de caso simulado para propósitos de desarrollo.'
};

// Function to generate legal advice based on user query
export const generateLegalAdvice = async (query, area = 'general') => {
  try {
    // Verificamos si estamos en un entorno que puede hacer peticiones externas
    if (typeof window === 'undefined' || !navigator.onLine) {
      // Respuesta simulada para entorno sin conexión
      return {
        advice: FALLBACK_RESPONSE.consejo,
        success: true
      };
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin || 'https://abogado-wilson.anipets12.workers.dev',
        'X-Title': 'Abogado Wilson - Consulta Legal'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku:beta',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente legal especializado en derecho ecuatoriano, 
                     particularmente en el área de ${area}. Proporciona respuestas 
                     informativas y orientación general, pero siempre aconseja 
                     consultar con el abogado Wilson Alexander Ipiales Guerron 
                     para asesoramiento legal específico y completo. Incluye 
                     referencias a la legislación ecuatoriana cuando sea relevante.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      // Si hay un error en la respuesta, devolver un fallback amigable
      return {
        advice: `Por el momento no podemos procesar su consulta (${response.status}). Por favor contacte al Abg. Wilson Ipiales directamente al +593988835269 para una consulta personalizada.`,
        success: false
      };
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error al generar respuesta');
    }
    
    return {
      advice: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error al generar consejo legal:', error);
    return {
      advice: 'Lo siento, no pudimos procesar su consulta en este momento. Por favor, contacte directamente al Abg. Wilson Ipiales al +593988835269 para obtener asesoramiento legal personalizado.',
      success: false,
      error: error.message
    };
  }
};

// Function to generate document templates
export const generateLegalDocument = async (documentType, userInfo) => {
  try {
    // Verificamos si estamos en un entorno que puede hacer peticiones externas
    if (typeof window === 'undefined' || !navigator.onLine) {
      // Respuesta simulada para entorno sin conexión
      return {
        document: FALLBACK_RESPONSE.documento,
        success: true
      };
    }
    
    // Create a prompt based on document type and user info
    const prompt = `Genera un documento legal de tipo ${documentType} con la siguiente información:
                   ${Object.entries(userInfo).map(([key, value]) => `${key}: ${value}`).join('\n')}
                   
                   El formato debe ser profesional y cumplir con la normativa ecuatoriana vigente.`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin || 'https://abogado-wilson.anipets12.workers.dev',
        'X-Title': 'Abogado Wilson - Generación de Documento'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku:beta',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente legal especializado en la generación de documentos legales ecuatorianos. Genera documentos con formato apropiado y lenguaje legal correcto.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      // Si hay un error en la respuesta, devolver un fallback amigable
      return {
        document: `Por el momento no podemos generar su documento (${response.status}). Por favor contacte al Abg. Wilson Ipiales directamente al +593988835269 para asistencia personalizada.`,
        success: false
      };
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error al generar documento');
    }
    
    return {
      document: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error al generar documento:', error);
    return {
      document: 'Error en la generación del documento. Por favor, contacte directamente al Abg. Wilson Ipiales al +593988835269 para asistencia personalizada.',
      success: false,
      error: error.message
    };
  }
};

// Function to analyze legal cases
export const analyzeLegalCase = async (caseDetails) => {
  try {
    // Verificamos si estamos en un entorno que puede hacer peticiones externas
    if (typeof window === 'undefined' || !navigator.onLine) {
      // Respuesta simulada para entorno sin conexión
      return {
        analysis: FALLBACK_RESPONSE.analisis,
        success: true
      };
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin || 'https://abogado-wilson.anipets12.workers.dev',
        'X-Title': 'Abogado Wilson - Análisis de Caso'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku:beta',
        messages: [
          {
            role: 'system',
            content: `Eres un asistente legal especializado en analizar casos legales en Ecuador. 
                     Proporciona un análisis preliminar de fortalezas, debilidades, opciones legales 
                     y posibles resultados, pero recomienda siempre consultar con el 
                     Abg. Wilson Alexander Ipiales Guerron para un análisis completo.`
          },
          {
            role: 'user',
            content: `Por favor, analiza el siguiente caso legal:\n${caseDetails}`
          }
        ],
        temperature: 0.6,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      // Si hay un error en la respuesta, devolver un fallback amigable
      return {
        analysis: `Por el momento no podemos analizar su caso (${response.status}). Por favor contacte al Abg. Wilson Ipiales directamente al +593988835269 para una consulta personalizada.`,
        success: false
      };
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error al analizar caso');
    }
    
    return {
      analysis: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error al analizar caso legal:', error);
    return {
      analysis: `No se pudo completar el análisis del caso: ${error.message}. Por favor, contacte directamente al Abg. Wilson Ipiales al +593988835269 para una consulta personalizada.`,
      success: false,
      error: error.message
    };
  }
};
