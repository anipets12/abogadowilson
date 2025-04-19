/**
 * Servicio para integraciu00f3n con WhatsApp Business API de Meta
 * Permite enviar mensajes y templates a travu00e9s de la API oficial
 */

// Definición de tipo para acceso seguro a variables de entorno en TypeScript
declare global {
  interface Window {
    ENV: {
      REACT_APP_WHATSAPP_PHONE_NUMBER_ID?: string;
      REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID?: string;
      REACT_APP_WHATSAPP_ACCESS_TOKEN?: string;
    }
  }
}

// Obtener variables de entorno de forma segura en TypeScript
const getEnv = (key: string, defaultValue: string = ''): string => {
  // Primero verificamos si está disponible en window.ENV (para web)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key as keyof typeof window.ENV]) {
    return window.ENV[key as keyof typeof window.ENV] || defaultValue;
  }
  
  // Luego verificamos process.env (para servidor y compilación)
  // @ts-ignore - Ignoramos el error de TypeScript ya que process.env es accesible en entorno Node
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
};

export const WHATSAPP_CONFIG = {
  // Configuración con el número real del abogado
  apiUrl: 'https://graph.facebook.com/v22.0',
  phoneNumberId: getEnv('REACT_APP_WHATSAPP_PHONE_NUMBER_ID', '673108542544676'),
  businessAccountId: getEnv('REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID', '453687004470438'),
  accessToken: getEnv('REACT_APP_WHATSAPP_ACCESS_TOKEN', 'EAATPuPTf2DcBOzBhZCZCQy38etJ2sxnidA8JCbgp2iGENMSPKypnGZB8rNKj00DmWDBnq0Tyo7YyjBw6KuKepmBz7gzCWZCcZA0nTMlm0UlW49fMnC05YmSJnUEJ3ckbKcFMkuABA2zVUV2c1oyliocNfx28elgdXoHJQPuTKLkyrQrS43dSSKyAZByDzVP9dHhpB1TWlrCV66Bn7fpDkmJomdvkIGPYwKWZCjtPu6swZC8ZD'),
  // Número oficial del abogado
  officialPhone: '+593988835269'
};

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document' | 'audio' | 'video' | 'sticker' | 'location' | 'interactive';
  text?: {
    body: string;
    preview_url?: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<any>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    caption?: string;
    filename?: string;
  };
  // Otros tipos de mensajes pueden agregarse segu00fan necesidad
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  data?: any;
}

export const whatsappService = {
  /**
   * Enviar mensaje a travu00e9s de la API de WhatsApp Business
   * @param message Mensaje a enviar
   */
  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      // Verificar token de acceso
      if (!WHATSAPP_CONFIG.accessToken) {
        throw new Error('Token de acceso no configurado');
      }
      
      // Formatear nu00famero si no comienza con +
      if (message.to && !message.to.startsWith('+')) {
        message.to = `+${message.to}`;
      }
      
      // Construir payload para la API
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: message.to,
        type: message.type,
        ...this.buildMessageContent(message)
      };
      
      // Enviar peticiu00f3n a la API
      const response = await fetch(`${WHATSAPP_CONFIG.apiUrl}/${WHATSAPP_CONFIG.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de API: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        data
      };
    } catch (error) {
      console.error('Error al enviar mensaje de WhatsApp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },
  
  /**
   * Enviar mensaje de texto simple
   * @param to Nu00famero de telu00e9fono del destinatario
   * @param text Texto del mensaje
   */
  async sendTextMessage(to: string, text: string): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: 'text',
      text: {
        body: text,
        preview_url: true
      }
    });
  },
  
  /**
   * Enviar mensaje de plantilla
   * @param to Nu00famero de telu00e9fono del destinatario
   * @param templateName Nombre de la plantilla
   * @param languageCode Cu00f3digo de idioma (default: es_ES)
   * @param components Componentes variables de la plantilla
   */
  async sendTemplateMessage(
    to: string, 
    templateName: string, 
    languageCode: string = 'es_ES',
    components?: Array<any>
  ): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode
        },
        components
      }
    });
  },
  
  /**
   * Construir el contenido del mensaje segu00fan su tipo
   * @param message Mensaje a enviar
   */
  buildMessageContent(message: WhatsAppMessage): Record<string, any> {
    const content: Record<string, any> = {};
    
    switch (message.type) {
      case 'text':
        content.text = message.text;
        break;
      case 'template':
        content.template = message.template;
        break;
      case 'image':
        content.image = message.image;
        break;
      case 'document':
        content.document = message.document;
        break;
      // Agregar mu00e1s casos segu00fan se necesite
    }
    
    return content;
  },
  
  /**
   * Obtener ejemplos de plantillas para pruebas
   */
  getTemplateExamples() {
    return [
      {
        name: 'hello_world',
        description: 'Mensaje simple de bienvenida',
        languageCode: 'es_ES'
      },
      {
        name: 'consulta_legal',
        description: 'Confirmaciu00f3n de consulta legal',
        languageCode: 'es_ES'
      },
      {
        name: 'cita_confirmada',
        description: 'Confirmaciu00f3n de cita',
        languageCode: 'es_ES'
      },
      {
        name: 'recordatorio_cita',
        description: 'Recordatorio de cita programada',
        languageCode: 'es_ES'
      }
    ];
  }
};
