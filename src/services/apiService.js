import axios from 'axios';

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  // En producción con Cloudflare
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';  // URL relativa para Cloudflare
  }
  // En desarrollo local
  return 'http://localhost:8787';
};

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: `${getBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuración para evitar problemas de CORS y timeout
  timeout: 10000,
  withCredentials: false
});

// Función para manejar errores de red de manera uniforme
const handleNetworkError = (error) => {
  console.error('Error de red:', error);
  
  // Si es un error de timeout
  if (error.code === 'ECONNABORTED') {
    return { 
      data: null, 
      error: { 
        message: 'La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.', 
        status: 408 
      } 
    };
  }
  
  // Si no hay respuesta del servidor
  if (!error.response) {
    return { 
      data: null, 
      error: { 
        message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.', 
        status: 0 
      } 
    };
  }
  
  // Para otros errores HTTP
  return { 
    data: null, 
    error: error.response?.data || { 
      message: error.message, 
      status: error.response?.status || 500 
    } 
  };
};

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Para errores 401 (no autorizado), limpiar el almacenamiento
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // Opcional: redireccionar a la página de login si es necesario
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación
export const authService = {
  // Registrar un nuevo usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Iniciar sesión
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { error: null };
    } catch (error) {
      // Incluso si hay error, eliminamos el token
      localStorage.removeItem('authToken');
      return handleNetworkError(error);
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return { user: response.data.data, error: null };
    } catch (error) {
      return { user: null, error: handleNetworkError(error).error };
    }
  },

  // Obtener la sesión actual
  async getSession() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { data: { session: null }, error: null };
      }
      const response = await api.get('/auth/session');
      return { data: { session: response.data.data }, error: null };
    } catch (error) {
      return { data: { session: null }, error: handleNetworkError(error).error };
    }
  },

  // Escuchar cambios en el estado de autenticación
  onAuthStateChange(callback) {
    const currentToken = localStorage.getItem('authToken');
    
    // Verificar el estado inicial
    if (currentToken) {
      this.getCurrentUser().then(({ user, error }) => {
        if (user && !error) {
          callback('SIGNED_IN', { user });
        } else {
          // Token inválido
          localStorage.removeItem('authToken');
          callback('SIGNED_OUT', null);
        }
      });
    } else {
      callback('SIGNED_OUT', null);
    }
    
    // Implementar un mecanismo simple para detectar cambios en localStorage
    const checkAuthChange = setInterval(() => {
      const newToken = localStorage.getItem('authToken');
      if (newToken !== currentToken) {
        if (newToken) {
          this.getCurrentUser().then(({ user, error }) => {
            if (user && !error) {
              callback('SIGNED_IN', { user });
            }
          });
        } else {
          callback('SIGNED_OUT', null);
        }
      }
    }, 2000); // Verificar cada 2 segundos
    
    // Devolvemos una función para limpiar el intervalo
    return {
      data: {
        unsubscribe: () => {
          clearInterval(checkAuthChange);
        }
      }
    };
  },

  // Solicitar cambio de contraseña
  async resetPasswordForEmail(email) {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return { data: response.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Actualizar contraseña
  async updatePassword(newPassword, token) {
    try {
      const response = await api.post('/auth/update-password', { 
        password: newPassword,
        token 
      });
      return { data: response.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  }
};

// Servicio para operaciones CRUD
export const dataService = {
  // Servicios de autenticación (para compatibilidad con código existente)
  auth: authService,
  
  // Métodos para compatibilidad con Supabase
  from(table) {
    return {
      select(columns = '*') {
        return {
          eq(column, value) {
            return {
              order(orderColumn, { ascending = true } = {}) {
                return {
                  limit(limitVal) {
                    return this._execute({ table, columns, filters: { [column]: value }, order: { column: orderColumn, ascending }, limit: limitVal });
                  },
                  async _execute(params) {
                    try {
                      const response = await api.get(`/${params.table}`, { 
                        params: { 
                          columns: params.columns,
                          filters: JSON.stringify(params.filters || {}),
                          order: JSON.stringify(params.order || {}),
                          limit: params.limit
                        } 
                      });
                      return { data: response.data.data, error: null };
                    } catch (error) {
                      return handleNetworkError(error);
                    }
                  }
                };
              },
              async _execute(params) {
                try {
                  const response = await api.get(`/${params.table}`, { 
                    params: { 
                      columns: params.columns,
                      filters: JSON.stringify(params.filters || {})
                    } 
                  });
                  return { data: response.data.data, error: null };
                } catch (error) {
                  return handleNetworkError(error);
                }
              }
            };
          },
          async _execute(params) {
            try {
              const response = await api.get(`/${params.table}`, { 
                params: { columns: params.columns } 
              });
              return { data: response.data.data, error: null };
            } catch (error) {
              return handleNetworkError(error);
            }
          }
        };
      },
      async insert(items) {
        try {
          const response = await api.post(`/${table}`, { items });
          return { data: response.data.data, error: null };
        } catch (error) {
          return handleNetworkError(error);
        }
      },
      async update(data) {
        try {
          const response = await api.put(`/${table}`, { data });
          return { data: response.data.data, error: null };
        } catch (error) {
          return handleNetworkError(error);
        }
      },
      async delete() {
        try {
          const response = await api.delete(`/${table}`);
          return { data: response.data.data, error: null };
        } catch (error) {
          return handleNetworkError(error);
        }
      }
    };
  },
  
  // Métodos compatibles con Supabase para Forum.jsx
  async fetchData(resource) {
    try {
      const response = await api.get(`/${resource}`);
      return { data: response.data.data, success: true };
    } catch (error) {
      return { data: null, success: false, error: handleNetworkError(error).error };
    }
  },
  
  async insertData(resource, data) {
    try {
      const response = await api.post(`/${resource}`, data);
      return { data: response.data.data, success: true };
    } catch (error) {
      return { data: null, success: false, error: handleNetworkError(error).error };
    }
  },
  
  // Obtener todos los registros
  async getAll(resource) {
    try {
      const response = await api.get(`/${resource}`);
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Obtener un registro por ID
  async getById(resource, id) {
    try {
      const response = await api.get(`/${resource}/${id}`);
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Crear un nuevo registro
  async create(resource, data) {
    try {
      const response = await api.post(`/${resource}`, data);
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Actualizar un registro
  async update(resource, id, data) {
    try {
      const response = await api.put(`/${resource}/${id}`, data);
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Eliminar un registro
  async delete(resource, id) {
    try {
      await api.delete(`/${resource}/${id}`);
      return { error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  },

  // Búsqueda personalizada
  async search(resource, params) {
    try {
      const response = await api.get(`/${resource}/search`, { params });
      return { data: response.data.data, error: null };
    } catch (error) {
      return handleNetworkError(error);
    }
  }
};

// Exportar la instancia de axios para uso directo si es necesario
export default api;
