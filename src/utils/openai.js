// OpenAI API integration utility functions
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_API_KEY_HERE';

// Function to generate legal advice based on user query
export const generateLegalAdvice = async (query, area = 'general') => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
      advice: 'Lo siento, no pudimos procesar su consulta en este momento. Por favor, intente nuevamente más tarde o contacte directamente al Abg. Wilson Ipiales.',
      success: false,
      error: error.message
    };
  }
};

// Function to generate document templates
export const generateLegalDocument = async (documentType, userInfo) => {
  try {
    // Create a prompt based on document type and user info
    const prompt = `Genera un documento legal de tipo ${documentType} con la siguiente información:
                   ${Object.entries(userInfo).map(([key, value]) => `${key}: ${value}`).join('\n')}
                   
                   El formato debe ser profesional y cumplir con la normativa ecuatoriana vigente.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
      document: 'Error en la generación del documento. Por favor, intente nuevamente o contacte directamente al Abg. Wilson Ipiales.',
      success: false,
      error: error.message
    };
  }
};

// Function to analyze legal cases
export const analyzeLegalCase = async (caseDetails) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
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
      analysis: 'No se pudo completar el análisis del caso. Por favor, contacte directamente al Abg. Wilson Ipiales para una consulta personalizada.',
      success: false,
      error: error.message
    };
  }
};
