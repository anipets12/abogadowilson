import { useState, useEffect } from 'react';
import { tokenService } from './tokenService';

export const useToken = {
  getUserTokens: async (userId) => {
    try {
      const result = await tokenService.getUserTokens(userId);
      return result;
    } catch (error) {
      console.error('Error al obtener tokens desde useToken:', error);
      return {
        success: false,
        tokens: 0,
        error: error
      };
    }
  }
};

export default useToken;
