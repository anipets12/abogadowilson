import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(message, code, severity = 'error', details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.details = details;
  }
}

export const errorHandler = {
  handle(error, showToast = true) {
    console.error('Error capturado:', error);

    const errorMessage = error.message || 'Error inesperado';
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const severity = error.severity || 'error';

    if (showToast) {
      toast[severity](errorMessage, {
        duration: 4000,
        position: 'top-right'
      });
    }

    // Manejar errores específicos
    switch (errorCode) {
      case 'SESSION_EXPIRED':
        localStorage.clear();
        window.location.href = '/login?session=expired';
        break;
      case 'NETWORK_ERROR':
        // Intentar reconectar o mostrar estado offline
        break;
      case 'VALIDATION_ERROR':
        // Mostrar errores de validación en el formulario
        break;
      default:
        // Manejar otros tipos de errores
        break;
    }

    return {
      message: errorMessage,
      code: errorCode,
      severity,
      details: error.details || null
    };
  }
};
