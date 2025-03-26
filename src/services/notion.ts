/**
 * Servicio para integración con la API de Notion
 */

interface NotionClient {
  createPage(data: any): Promise<any>;
  updatePage(pageId: string, data: any): Promise<any>;
  queryDatabase(databaseId: string, filter?: any): Promise<any>;
}

export class NotionService implements NotionClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.notion.com/v1';
  private defaultDatabaseId: string;

  constructor(apiKey: string, defaultDatabaseId: string) {
    this.apiKey = apiKey;
    this.defaultDatabaseId = defaultDatabaseId;
  }

  private async request(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en API de Notion: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en solicitud a Notion:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo cliente en la base de datos de Notion
   */
  async registrarCliente(cliente: {
    nombre: string;
    email: string;
    telefono: string;
    asunto?: string;
    mensaje?: string;
  }): Promise<any> {
    return this.createPage({
      parent: { database_id: this.defaultDatabaseId },
      properties: {
        'Nombre': {
          title: [
            {
              text: {
                content: cliente.nombre
              }
            }
          ]
        },
        'Email': {
          email: cliente.email
        },
        'Teléfono': {
          phone_number: cliente.telefono
        },
        'Asunto': {
          rich_text: [
            {
              text: {
                content: cliente.asunto || 'Consulta general'
              }
            }
          ]
        },
        'Mensaje': {
          rich_text: [
            {
              text: {
                content: cliente.mensaje || ''
              }
            }
          ]
        },
        'Estado': {
          select: {
            name: 'Nuevo'
          }
        },
        'Fecha': {
          date: {
            start: new Date().toISOString()
          }
        }
      }
    });
  }

  /**
   * Crea una nueva página en Notion
   */
  async createPage(data: any): Promise<any> {
    return this.request('/pages', 'POST', data);
  }

  /**
   * Actualiza una página existente en Notion
   */
  async updatePage(pageId: string, data: any): Promise<any> {
    return this.request(`/pages/${pageId}`, 'PATCH', data);
  }

  /**
   * Consulta una base de datos de Notion
   */
  async queryDatabase(databaseId: string = this.defaultDatabaseId, filter?: any): Promise<any> {
    const data = filter ? { filter } : {};
    return this.request(`/databases/${databaseId}/query`, 'POST', data);
  }
}

/**
 * Crea un cliente simulado de Notion para el entorno de desarrollo
 */
export function createNotionClient(apiKey: string, databaseId: string): NotionClient {
  // En entorno de producción, usamos el cliente real
  return new NotionService(apiKey, databaseId);
}
