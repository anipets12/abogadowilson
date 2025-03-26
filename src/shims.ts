/**
 * Shims para permitir que la aplicación funcione en Cloudflare Workers 
 * sin necesidad de instalar dependencias localmente
 */

// Supabase client shim
export const createSupabaseClient = (supabaseUrl: string, supabaseKey: string) => {
  return {
    auth: {
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        
        if (!response.ok) {
          return { data: null, error: new Error('Falló la autenticación') };
        }
        
        const data = await response.json();
        return { data, error: null };
      },
      
      signUp: async (credentials: { email: string; password: string; options?: any }) => {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            data: credentials.options?.data
          })
        });
        
        if (!response.ok) {
          return { data: null, error: new Error('Falló el registro') };
        }
        
        const data = await response.json();
        return { data, error: null };
      }
    }
  };
};

// Prisma client shim
export const createPrismaClient = (databaseUrl: string) => {
  // Mantenemos un pequeño almacenamiento en memoria para simular una base de datos
  const db = {
    documents: [] as any[],
    servicios: [] as any[],
    pagos: [] as any[],
    usuarios: [] as any[],
    citas: [] as any[],
    ai_consultas: [] as any[],
    ai_tokens: [] as any[],
    system_logs: [] as any[]
  };
  
  return {
    document: {
      findMany: async ({ take, orderBy }: { take: number; orderBy: any }) => {
        // Ordenar por fecha de creación descendente
        const sorted = [...db.documents].sort((a, b) => 
          orderBy.createdAt === 'desc' ? 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        return sorted.slice(0, take);
      },
      
      findUnique: async ({ where }: { where: { id: number } }) => {
        return db.documents.find(doc => doc.id === where.id) || null;
      },
      
      create: async ({ data }: { data: any }) => {
        const newId = db.documents.length > 0 ? 
          Math.max(...db.documents.map(doc => doc.id)) + 1 : 
          1;
        
        const newDoc = {
          id: newId,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        db.documents.push(newDoc);
        return newDoc;
      },
      
      update: async ({ where, data }: { where: { id: number }; data: any }) => {
        const index = db.documents.findIndex(doc => doc.id === where.id);
        
        if (index === -1) {
          throw new Error(`Documento con ID ${where.id} no encontrado`);
        }
        
        db.documents[index] = {
          ...db.documents[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        return db.documents[index];
      },
      
      delete: async ({ where }: { where: { id: number } }) => {
        const index = db.documents.findIndex(doc => doc.id === where.id);
        
        if (index === -1) {
          throw new Error(`Documento con ID ${where.id} no encontrado`);
        }
        
        const deleted = db.documents[index];
        db.documents.splice(index, 1);
        
        return deleted;
      }
    },

    servicio: {
      findMany: async (params: { where?: any; take?: number; orderBy?: any } = {}) => {
        let filtered = [...db.servicios];
        
        if (params.where) {
          if (params.where.categoria) {
            filtered = filtered.filter(s => s.categoria === params.where.categoria);
          }
          if (params.where.disponible !== undefined) {
            filtered = filtered.filter(s => s.disponible === params.where.disponible);
          }
        }
        
        if (params.orderBy) {
          if (params.orderBy.precio) {
            filtered.sort((a, b) => params.orderBy.precio === 'asc' ? a.precio - b.precio : b.precio - a.precio);
          }
        }
        
        if (params.take) {
          filtered = filtered.slice(0, params.take);
        }
        
        return filtered;
      },
      
      findUnique: async ({ where }: { where: { id: string } }) => {
        return db.servicios.find(s => s.id === where.id) || null;
      },
      
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newServicio = {
          id,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        db.servicios.push(newServicio);
        return newServicio;
      },
      
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const index = db.servicios.findIndex(s => s.id === where.id);
        
        if (index === -1) {
          throw new Error(`Servicio con ID ${where.id} no encontrado`);
        }
        
        db.servicios[index] = {
          ...db.servicios[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        return db.servicios[index];
      },
      
      delete: async ({ where }: { where: { id: string } }) => {
        const index = db.servicios.findIndex(s => s.id === where.id);
        
        if (index === -1) {
          throw new Error(`Servicio con ID ${where.id} no encontrado`);
        }
        
        const deleted = db.servicios[index];
        db.servicios.splice(index, 1);
        
        return deleted;
      }
    },

    pago: {
      findMany: async (params: { where?: any; take?: number; orderBy?: any } = {}) => {
        let filtered = [...db.pagos];
        
        if (params.where) {
          if (params.where.usuario_id) {
            filtered = filtered.filter(p => p.usuario_id === params.where.usuario_id);
          }
          if (params.where.estado) {
            filtered = filtered.filter(p => p.estado === params.where.estado);
          }
        }
        
        if (params.orderBy) {
          if (params.orderBy.created_at) {
            filtered.sort((a, b) => params.orderBy.created_at === 'asc' ? 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          }
        }
        
        if (params.take) {
          filtered = filtered.slice(0, params.take);
        }
        
        return filtered;
      },
      
      findUnique: async ({ where }: { where: { id: string } }) => {
        return db.pagos.find(p => p.id === where.id) || null;
      },
      
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newPago = {
          id,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        db.pagos.push(newPago);
        return newPago;
      },
      
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const index = db.pagos.findIndex(p => p.id === where.id);
        
        if (index === -1) {
          throw new Error(`Pago con ID ${where.id} no encontrado`);
        }
        
        db.pagos[index] = {
          ...db.pagos[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        return db.pagos[index];
      }
    },

    usuario: {
      findMany: async (params: { where?: any; take?: number; orderBy?: any } = {}) => {
        let filtered = [...db.usuarios];
        
        if (params.where) {
          if (params.where.email) {
            filtered = filtered.filter(u => u.email === params.where.email);
          }
          if (params.where.roles) {
            filtered = filtered.filter(u => u.roles.includes(params.where.roles));
          }
        }
        
        if (params.orderBy) {
          if (params.orderBy.created_at) {
            filtered.sort((a, b) => params.orderBy.created_at === 'asc' ? 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          }
        }
        
        if (params.take) {
          filtered = filtered.slice(0, params.take);
        }
        
        return filtered;
      },
      
      findUnique: async ({ where }: { where: { id: string } | { email: string } }) => {
        if ('id' in where) {
          return db.usuarios.find(u => u.id === where.id) || null;
        } else {
          return db.usuarios.find(u => u.email === where.email) || null;
        }
      },
      
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newUsuario = {
          id,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        db.usuarios.push(newUsuario);
        return newUsuario;
      },
      
      update: async ({ where, data }: { where: { id: string } | { email: string }; data: any }) => {
        let index = -1;
        
        if ('id' in where) {
          index = db.usuarios.findIndex(u => u.id === where.id);
        } else {
          index = db.usuarios.findIndex(u => u.email === where.email);
        }
        
        if (index === -1) {
          throw new Error(`Usuario no encontrado`);
        }
        
        db.usuarios[index] = {
          ...db.usuarios[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        return db.usuarios[index];
      }
    },

    cita: {
      findMany: async (params: { where?: any; take?: number; orderBy?: any } = {}) => {
        let filtered = [...db.citas];
        
        if (params.where) {
          if (params.where.usuario_id) {
            filtered = filtered.filter(c => c.usuario_id === params.where.usuario_id);
          }
          if (params.where.servicio_id) {
            filtered = filtered.filter(c => c.servicio_id === params.where.servicio_id);
          }
          if (params.where.estado) {
            filtered = filtered.filter(c => c.estado === params.where.estado);
          }
          if (params.where.fecha) {
            // Filter by date range if provided
            if (params.where.fecha.gte) {
              filtered = filtered.filter(c => new Date(c.fecha) >= new Date(params.where.fecha.gte));
            }
            if (params.where.fecha.lte) {
              filtered = filtered.filter(c => new Date(c.fecha) <= new Date(params.where.fecha.lte));
            }
          }
        }
        
        if (params.orderBy) {
          if (params.orderBy.fecha) {
            filtered.sort((a, b) => params.orderBy.fecha === 'asc' ? 
              new Date(a.fecha).getTime() - new Date(b.fecha).getTime() : 
              new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          }
        }
        
        if (params.take) {
          filtered = filtered.slice(0, params.take);
        }
        
        return filtered;
      },
      
      findUnique: async ({ where }: { where: { id: string } }) => {
        return db.citas.find(c => c.id === where.id) || null;
      },
      
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newCita = {
          id,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        db.citas.push(newCita);
        return newCita;
      },
      
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const index = db.citas.findIndex(c => c.id === where.id);
        
        if (index === -1) {
          throw new Error(`Cita con ID ${where.id} no encontrada`);
        }
        
        db.citas[index] = {
          ...db.citas[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        
        return db.citas[index];
      },
      
      delete: async ({ where }: { where: { id: string } }) => {
        const index = db.citas.findIndex(c => c.id === where.id);
        
        if (index === -1) {
          throw new Error(`Cita con ID ${where.id} no encontrada`);
        }
        
        const deleted = db.citas[index];
        db.citas.splice(index, 1);
        
        return deleted;
      }
    },

    ai_consulta: {
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newConsulta = {
          id,
          ...data,
          created_at: new Date().toISOString()
        };
        
        db.ai_consultas.push(newConsulta);
        return newConsulta;
      },
      
      findMany: async (params: { where?: any; take?: number; orderBy?: any } = {}) => {
        let filtered = [...db.ai_consultas];
        
        if (params.where) {
          if (params.where.usuario_id) {
            filtered = filtered.filter(c => c.usuario_id === params.where.usuario_id);
          }
          if (params.where.modelo) {
            filtered = filtered.filter(c => c.modelo === params.where.modelo);
          }
        }
        
        if (params.orderBy) {
          if (params.orderBy.created_at) {
            filtered.sort((a, b) => params.orderBy.created_at === 'asc' ? 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          }
        }
        
        if (params.take) {
          filtered = filtered.slice(0, params.take);
        }
        
        return filtered;
      }
    },

    ai_token: {
      findUnique: async ({ where }: { where: { usuario_id: string } }) => {
        return db.ai_tokens.find(t => t.usuario_id === where.usuario_id) || null;
      },
      
      upsert: async ({ where, update, create }: { where: any; update: any; create: any }) => {
        const index = db.ai_tokens.findIndex(t => t.usuario_id === where.usuario_id);
        
        if (index === -1) {
          const id = crypto.randomUUID();
          const newToken = {
            id,
            ...create,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          db.ai_tokens.push(newToken);
          return newToken;
        } else {
          db.ai_tokens[index] = {
            ...db.ai_tokens[index],
            ...update,
            updated_at: new Date().toISOString()
          };
          
          return db.ai_tokens[index];
        }
      }
    },

    system_log: {
      create: async ({ data }: { data: any }) => {
        const id = crypto.randomUUID();
        const newLog = {
          id,
          ...data,
          created_at: new Date().toISOString()
        };
        
        db.system_logs.push(newLog);
        return newLog;
      }
    }
  };
};

// Notion client shim
export const createNotionClient = (apiKey: string, databaseId: string) => {
  const db = {
    clients: [] as any[],
    pagos: [] as any[],
    citas: [] as any[],
    servicios: [] as any[],
    blog_posts: [] as any[],
    ebooks: [] as any[],
    debates: [] as any[],
    notifications: [] as any[]
  };

  const createNotionRequest = async (endpoint: string, method: string, body?: any) => {
    try {
      // Esta función simula solicitudes a la API de Notion
      // En un entorno de producción, haría solicitudes HTTP reales
      return {
        success: true,
        message: 'Operación simulada exitosa',
        data: body || {}
      };
    } catch (error) {
      console.error('Error en solicitud a Notion:', error);
      throw error;
    }
  };

  return {
    createPage: async (data: any) => {
      const pageId = crypto.randomUUID();
      const newPage = {
        id: pageId,
        ...data,
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString()
      };
      return { id: pageId, object: 'page', ...newPage };
    },

    updatePage: async (pageId: string, data: any) => {
      return {
        id: pageId,
        ...data,
        last_edited_time: new Date().toISOString()
      };
    },

    queryDatabase: async (dbId: string = databaseId, filter?: any) => {
      // Determina qué colección devolver basado en el filtro
      let results = db.clients;
      
      if (filter && filter.property && filter.property === 'Tipo' && filter.select && filter.select.equals) {
        if (filter.select.equals === 'Pago') {
          results = db.pagos;
        } else if (filter.select.equals === 'Cita') {
          results = db.citas;
        } else if (filter.select.equals === 'Servicio') {
          results = db.servicios;
        }
      }
      
      return {
        results,
        has_more: false,
        next_cursor: null
      };
    },

    registrarCliente: async (cliente: {
      nombre: string;
      email: string;
      telefono: string;
      asunto?: string;
      mensaje?: string;
    }) => {
      const clientId = crypto.randomUUID();
      const newClient = {
        id: clientId,
        properties: {
          'Nombre': { title: [{ text: { content: cliente.nombre } }] },
          'Email': { email: cliente.email },
          'Teléfono': { phone_number: cliente.telefono },
          'Asunto': { rich_text: [{ text: { content: cliente.asunto || 'Consulta general' } }] },
          'Mensaje': { rich_text: [{ text: { content: cliente.mensaje || '' } }] },
          'Estado': { select: { name: 'Nuevo' } },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Cliente' } }
        },
        created_time: new Date().toISOString()
      };
      
      db.clients.push(newClient);
      
      return {
        id: clientId,
        object: 'page',
        created_time: newClient.created_time
      };
    },
    
    registrarPago: async (pago: {
      usuario_id: string;
      monto: number;
      estado: string;
      metodo_pago: string;
      servicio_id?: string;
      referencia_externa?: string;
    }) => {
      const pagoId = crypto.randomUUID();
      const newPago = {
        id: pagoId,
        properties: {
          'Usuario ID': { rich_text: [{ text: { content: pago.usuario_id } }] },
          'Monto': { number: pago.monto },
          'Estado': { select: { name: pago.estado } },
          'Método de Pago': { select: { name: pago.metodo_pago } },
          'Servicio ID': { rich_text: [{ text: { content: pago.servicio_id || '' } }] },
          'Referencia': { rich_text: [{ text: { content: pago.referencia_externa || '' } }] },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Pago' } }
        },
        created_time: new Date().toISOString()
      };
      
      db.pagos.push(newPago);
      
      return {
        id: pagoId,
        object: 'page',
        created_time: newPago.created_time
      };
    },
    
    registrarCita: async (cita: {
      usuario_id: string;
      servicio_id: string;
      fecha: Date;
      estado: string;
      notas?: string;
    }) => {
      const citaId = crypto.randomUUID();
      const newCita = {
        id: citaId,
        properties: {
          'Usuario ID': { rich_text: [{ text: { content: cita.usuario_id } }] },
          'Servicio ID': { rich_text: [{ text: { content: cita.servicio_id } }] },
          'Fecha': { date: { start: cita.fecha.toISOString() } },
          'Estado': { select: { name: cita.estado } },
          'Notas': { rich_text: [{ text: { content: cita.notas || '' } }] },
          'Tipo': { select: { name: 'Cita' } }
        },
        created_time: new Date().toISOString()
      };
      
      db.citas.push(newCita);
      
      return {
        id: citaId,
        object: 'page',
        created_time: newCita.created_time
      };
    },
    
    registrarServicio: async (servicio: {
      nombre: string;
      descripcion: string;
      precio: number;
      duracion?: number;
      categoria: string;
    }) => {
      const servicioId = crypto.randomUUID();
      const newServicio = {
        id: servicioId,
        properties: {
          'Nombre': { title: [{ text: { content: servicio.nombre } }] },
          'Descripción': { rich_text: [{ text: { content: servicio.descripcion } }] },
          'Precio': { number: servicio.precio },
          'Duración (min)': { number: servicio.duracion || 60 },
          'Categoría': { select: { name: servicio.categoria } },
          'Disponible': { checkbox: true },
          'Tipo': { select: { name: 'Servicio' } }
        },
        created_time: new Date().toISOString()
      };
      
      db.servicios.push(newServicio);
      
      return {
        id: servicioId,
        object: 'page',
        created_time: newServicio.created_time
      };
    },
    
    registrarBlogPost: async (post: {
      title: string;
      content: string;
      author_id: string;
    }) => {
      const postId = crypto.randomUUID();
      const newPost = {
        id: postId,
        properties: {
          'Título': { title: [{ text: { content: post.title } }] },
          'Contenido': { rich_text: [{ text: { content: post.content } }] },
          'Autor ID': { rich_text: [{ text: { content: post.author_id } }] },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Blog Post' } }
        },
        created_time: new Date().toISOString()
      };
      db.blog_posts.push(newPost);
      return newPost;
    },

    registrarEbook: async (ebook: {
      title: string;
      description: string;
      file_url: string;
    }) => {
      const ebookId = crypto.randomUUID();
      const newEbook = {
        id: ebookId,
        properties: {
          'Título': { title: [{ text: { content: ebook.title } }] },
          'Descripción': { rich_text: [{ text: { content: ebook.description } }] },
          'Archivo': { url: ebook.file_url },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Ebook' } }
        },
        created_time: new Date().toISOString()
      };
      db.ebooks.push(newEbook);
      return newEbook;
    },

    registrarDebate: async (debate: {
      title: string;
      content: string;
      author_id: string;
    }) => {
      const debateId = crypto.randomUUID();
      const newDebate = {
        id: debateId,
        properties: {
          'Título': { title: [{ text: { content: debate.title } }] },
          'Contenido': { rich_text: [{ text: { content: debate.content } }] },
          'Autor ID': { rich_text: [{ text: { content: debate.author_id } }] },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Debate' } }
        },
        created_time: new Date().toISOString()
      };
      db.debates.push(newDebate);
      return newDebate;
    },

    registrarNotificacion: async (notification: {
      user_id: string;
      message: string;
    }) => {
      const notificationId = crypto.randomUUID();
      const newNotification = {
        id: notificationId,
        properties: {
          'Usuario ID': { rich_text: [{ text: { content: notification.user_id } }] },
          'Mensaje': { rich_text: [{ text: { content: notification.message } }] },
          'Estado': { select: { name: 'Pendiente' } },
          'Fecha': { date: { start: new Date().toISOString() } },
          'Tipo': { select: { name: 'Notificación' } }
        },
        created_time: new Date().toISOString()
      };
      db.notifications.push(newNotification);
      return newNotification;
    },

    actualizarEstadoCliente: async (clienteId: string, estado: string) => {
      const clientIndex = db.clients.findIndex(client => client.id === clienteId);
      
      if (clientIndex === -1) {
        throw new Error(`Cliente con ID ${clienteId} no encontrado`);
      }
      
      db.clients[clientIndex].properties.Estado.select.name = estado;
      db.clients[clientIndex].last_edited_time = new Date().toISOString();
      
      return {
        id: clienteId,
        object: 'page',
        last_edited_time: db.clients[clientIndex].last_edited_time
      };
    }
  };
};

// OpenAI client shim
export const createOpenAIClient = (apiKey: string) => {
  return {
    createCompletion: async (params: {
      prompt: string;
      model: string;
      max_tokens?: number;
      temperature?: number;
    }) => {
      // Simula una respuesta de la API de OpenAI
      const id = crypto.randomUUID();
      const prompt_tokens = Math.ceil(params.prompt.length / 4);
      const completion_tokens = params.max_tokens || 100;
      
      // Respuesta simulada basada en el prompt
      let responseText = '';
      if (params.prompt.toLowerCase().includes('abogado')) {
        responseText = 'Para su consulta legal, le recomendaría consultar con un abogado especializado en esta área. Los asuntos legales requieren asesoramiento profesional adaptado a su situación específica.';
      } else if (params.prompt.toLowerCase().includes('servicio')) {
        responseText = 'Ofrecemos servicios de asesoría legal en diversas áreas incluyendo derecho civil, penal, laboral y corporativo. Para más información, puede agendar una consulta con uno de nuestros especialistas.';
      } else {
        responseText = 'Gracias por su consulta. Para poder ayudarle de manera efectiva, necesitaríamos más detalles sobre su situación. ¿Podría proporcionar información adicional?';
      }
      
      return {
        id,
        choices: [{ text: responseText }],
        usage: {
          total_tokens: prompt_tokens + completion_tokens,
          prompt_tokens,
          completion_tokens
        }
      };
    },
    
    createEmbedding: async (params: {
      input: string | string[];
      model: string;
    }) => {
      const input = Array.isArray(params.input) ? params.input : [params.input];
      const embeddings = input.map(() => {
        // Genera un vector de embedding simulado aleatorio
        const embedding = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
        return { embedding };
      });
      
      const tokenCount = input.reduce((acc, text) => acc + Math.ceil(text.length / 4), 0);
      
      return {
        data: embeddings,
        usage: { total_tokens: tokenCount }
      };
    }
  };
};

// PayPal client shim
export const createPayPalClient = (clientId: string, clientSecret: string) => {
  return {
    createOrder: async (amount: number, currency: string) => {
      const orderId = crypto.randomUUID();
      return orderId;
    },
    captureOrder: async (orderId: string) => {
      return {
        id: orderId,
        status: 'COMPLETED',
        amount: { total: '100.00', currency: 'USD' }
      };
    },
    createSubscription: async (planId: string, email: string) => {
      const subscriptionId = crypto.randomUUID();
      return subscriptionId;
    },
    cancelSubscription: async (subscriptionId: string) => {
      return true;
    }
  };
};

// Mistral client shim
export const createMistralClient = (apiKey: string) => {
  return {
    createCompletion: async (params: {
      prompt: string;
      model: string;
      max_tokens?: number;
      temperature?: number;
    }) => {
      const id = crypto.randomUUID();
      const prompt_tokens = Math.ceil(params.prompt.length / 4);
      const completion_tokens = params.max_tokens || 100;
      
      let responseText = 'Respuesta simulada de Mistral para: ' + params.prompt;
      
      return {
        id,
        choices: [{ text: responseText }],
        usage: {
          total_tokens: prompt_tokens + completion_tokens,
          prompt_tokens,
          completion_tokens
        }
      };
    },
    createEmbedding: async (params: {
      input: string | string[];
      model: string;
    }) => {
      const input = Array.isArray(params.input) ? params.input : [params.input];
      const embeddings = input.map(() => {
        const embedding = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
        return { embedding };
      });
      
      const tokenCount = input.reduce((acc, text) => acc + Math.ceil(text.length / 4), 0);
      
      return {
        data: embeddings,
        usage: { total_tokens: tokenCount }
      };
    }
  };
};
