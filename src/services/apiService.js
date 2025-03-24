import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

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

// Servicio de autenticación
export const authService = {
  // Registrar un nuevo usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
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
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { error: null };
    } catch (error) {
      return { error: error.response?.data || error.message };
    }
  },

  // Obtener usuario actual
  async getUser() {
    try {
      const response = await api.get('/auth/me');
      return { data: { user: response.data.data }, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Solicitar cambio de contraseña
  async resetPasswordForEmail(email) {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
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
      return { data: null, error: error.response?.data || error.message };
    }
  }
};

// Servicio para operaciones CRUD
export const dataService = {
  // Obtener todos los registros
  async getAll(resource) {
    try {
      const response = await api.get(`/${resource}`);
      return { data: response.data.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Obtener un registro por ID
  async getById(resource, id) {
    try {
      const response = await api.get(`/${resource}/${id}`);
      return { data: response.data.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Crear un nuevo registro
  async create(resource, data) {
    try {
      const response = await api.post(`/${resource}`, data);
      return { data: response.data.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Actualizar un registro
  async update(resource, id, data) {
    try {
      const response = await api.put(`/${resource}/${id}`, data);
      return { data: response.data.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  },

  // Eliminar un registro
  async delete(resource, id) {
    try {
      await api.delete(`/${resource}/${id}`);
      return { error: null };
    } catch (error) {
      return { error: error.response?.data || error.message };
    }
  },

  // Búsqueda personalizada
  async search(resource, params) {
    try {
      const response = await api.get(`/${resource}/search`, { params });
      return { data: response.data.data, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data || error.message };
    }
  }
};

// Exportar la instancia de axios para uso directo si es necesario
export default api;
