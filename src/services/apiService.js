import axios from 'axios';

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  // En producción con Cloudflare
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // URL relativa para Cloudflare - no se necesita especificar dominio completo
    return '';
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
  // Aumentar timeout para dar más tiempo a Cloudflare Workers
  timeout: 15000,
  withCredentials: false
});

// Función para manejar errores de red de manera uniforme
const handleNetworkError = (error) => {
  // Verificar conexión a internet
  if (!navigator.onLine) {
    return {
      error: {
        message: 'No hay conexión a internet. Por favor, verifique su conexión.',
        code: 'NETWORK_ERROR',
        severity: 'error'
      }
    };
  }

  // Manejar errores de autenticación
  if (error.response?.status === 401) {
    const currentPath = window.location.pathname;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Guardar la ruta actual para redireccionar después del login
    if (currentPath !== '/login') {
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    window.location.href = '/login?session=expired';
    return {
      error: {
        message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        code: 'SESSION_EXPIRED',
        severity: 'warning'
      }
    };
  }

  // Manejar errores de permisos
  if (error.response?.status === 403) {
    return {
      error: {
        message: 'No tiene permisos para realizar esta acción.',
        code: 'FORBIDDEN',
        severity: 'error'
      }
    };
  }

  // Manejar errores de validación
  if (error.response?.status === 422) {
    return {
      error: {
        message: 'Datos inválidos. Por favor, verifique la información.',
        code: 'VALIDATION_ERROR',
        details: error.response.data.errors,
        severity: 'warning'
      }
    };
  }

  // Error general del servidor
  return {
    error: {
      message: error.response?.data?.message || 'Error del servidor. Por favor, intente nuevamente.',
      code: error.response?.status || 'SERVER_ERROR',
      severity: 'error',
      details: error.response?.data?.details || null
    }
  };
};

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return { data: response.data, error: null };
  },
  (error) => {
    // Manejo mejorado de errores
    const errorResponse = {
      success: false,
      error: {
        message: error.response?.data?.message || 'Error de servidor',
        code: error.response?.status || 500,
        details: error.response?.data?.details || null
      }
    };

    // Manejar errores específicos
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login?session=expired';
    }

    if (error.response?.status === 403) {
      window.location.href = '/acceso-denegado';
    }

    if (!navigator.onLine) {
      errorResponse.error.message = 'Error de conexión. Por favor, verifica tu internet.';
    }

    return Promise.resolve(errorResponse);
  }
);

// Servicio de autenticación
export const authService = {
  // Registrar un nuevo usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      return handleNetworkError(error);
    }
  },
  
  // Iniciar sesión
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      return handleNetworkError(error);
    }
  },
  
  // Cerrar sesión
  async signOut() {
    try {
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error) {
      return handleNetworkError(error);
    }
  },
  
  // Obtener usuario actual
  async getCurrentUser() {
    try {
      if (!localStorage.getItem('authToken')) {
        return { user: null, error: null };
      }
      return await api.get('/auth/user');
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return { user: null, error: handleNetworkError(error).error };
    }
  },
  
  // Solicitar cambio de contraseña
  async resetPasswordForEmail(email) {
    try {
      return await api.post('/auth/reset-password', { email });
    } catch (error) {
      console.error('Error al solicitar cambio de contraseña:', error);
      return handleNetworkError(error);
    }
  },
  
  // Actualizar contraseña
  async updatePassword(newPassword, token) {
    try {
      return await api.post('/auth/update-password', { 
        password: newPassword,
        token
      });
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      return handleNetworkError(error);
    }
  }
};

// Servicio para operaciones CRUD
export const dataService = {
  // Obtener todos los registros
  async getAll(resource, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros si existen
      if (params) {
        Object.keys(params).forEach(key => {
          queryParams.append(key, params[key]);
        });
      }
      
      const queryString = queryParams.toString();
      const url = `/data/${resource}${queryString ? `?${queryString}` : ''}`;
      
      return await api.get(url);
    } catch (error) {
      console.error(`Error al obtener ${resource}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Obtener un registro por ID
  async getById(resource, id) {
    try {
      return await api.get(`/data/${resource}/${id}`);
    } catch (error) {
      console.error(`Error al obtener ${resource} con ID ${id}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Crear un nuevo registro
  async create(resource, data) {
    try {
      return await api.post(`/data/${resource}`, data);
    } catch (error) {
      console.error(`Error al crear ${resource}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Actualizar un registro
  async update(resource, id, data) {
    try {
      return await api.put(`/data/${resource}/${id}`, data);
    } catch (error) {
      console.error(`Error al actualizar ${resource} con ID ${id}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Eliminar un registro
  async remove(resource, id) {
    try {
      return await api.delete(`/data/${resource}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar ${resource} con ID ${id}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Búsqueda personalizada
  async search(resource, params = {}) {
    try {
      return await api.post(`/data/${resource}/search`, params);
    } catch (error) {
      console.error(`Error al buscar en ${resource}:`, error);
      return handleNetworkError(error);
    }
  },
  
  // Método especial para manejar archivos
  async uploadFile(file, resourceType) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resourceType', resourceType);
      
      return await axios.post(`${getBaseUrl()}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    } catch (error) {
      console.error('Error al subir archivo:', error);
      return handleNetworkError(error);
    }
  }
};

// Exportar la instancia de axios para uso directo si es necesario
export default api;
