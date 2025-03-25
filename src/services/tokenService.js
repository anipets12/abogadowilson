import api from './apiService';

export const tokenService = {
  async getUserTokens(userId) {
    try {
      const response = await api.get(`/tokens/${userId}`);
      return {
        success: true,
        tokens: response.data?.tokens || 0,
        error: null
      };
    } catch (error) {
      console.error('Error al obtener tokens:', error);
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al obtener tokens')
      };
    }
  },

  async useToken(userId) {
    try {
      const response = await api.post(`/tokens/use`, { userId });
      return {
        success: response.data?.success,
        tokens: response.data?.tokens,
        error: null
      };
    } catch (error) {
      console.error('Error al usar token:', error);
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al usar token')
      };
    }
  },

  async refillTokens(userId) {
    try {
      const response = await api.post(`/tokens/refill`, { userId });
      return {
        success: response.data?.success,
        tokens: response.data?.tokens,
        error: null
      };
    } catch (error) {
      console.error('Error al recargar tokens:', error);
      return {
        success: false,
        tokens: 0,
        error: new Error('Error al recargar tokens')
      };
    }
  }
};
