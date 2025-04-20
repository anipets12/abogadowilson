/**
 * Sistema de diagnóstico y recuperación para problemas críticos en Cloudflare Workers
 * 
 * Este módulo proporciona funciones para detectar y recuperarse de errores comunes
 * en entornos de Cloudflare Workers, especialmente relacionados con CORS y renderizado.
 */

// Función para inicializar sistema de recuperación automática
export const initErrorRecovery = () => {
  console.log('Aplicando parches para compatibilidad con Cloudflare Workers');
  
  if (typeof window === 'undefined') return; // No aplicar en SSR
  
  // Interceptar errores globales
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handlePromiseRejection);
  
  // Aplicar parches específicos para React Router en Cloudflare Workers
  patchReactRouter();
  
  // Verificar estado inicial y detectar posibles problemas
  runInitialDiagnostic();
};

// Manejador de errores globales
const handleGlobalError = (event) => {
  const error = event.error || new Error(event.message);
  
  // Detectar errores específicos
  if (error.message?.includes('CORS') || 
      error.message?.includes('Origin') || 
      error.message?.includes('network') ||
      error.message?.includes('1042')) {
    
    console.error('Error crítico detectado:', error.message);
    
    // Intentar recuperación específica para CORS
    if (error.message?.includes('CORS') || error.message?.includes('Origin')) {
      localStorage.setItem('use_proxy', 'true');
    }
    
    // Verificar si necesitamos mostrar pantalla de recuperación
    const recoveryAttempts = parseInt(localStorage.getItem('recoveryAttempts') || '0');
    
    if (recoveryAttempts > 3) {
      console.warn('Demasiados intentos de recuperación, realizando limpieza profunda');
      performDeepCleanup();
      return;
    }
    
    // Iniciar proceso de recuperación si no estamos ya en él
    if (!window.location.search.includes('recovered=true')) {
      localStorage.setItem('recoveryAttempts', (recoveryAttempts + 1).toString());
      startRecoveryProcess();
    }
  }
};

// Manejador para promesas rechazadas sin catch
const handlePromiseRejection = (event) => {
  console.error('Promesa no controlada:', event.reason);
  
  if (String(event.reason).includes('CORS') || 
      String(event.reason).includes('network') ||
      String(event.reason).includes('fetch') ||
      String(event.reason).includes('supabase')) {
    
    // Similar al manejo de errores globales
    localStorage.setItem('use_proxy', 'true');
    
    // Iniciar recuperación si es un error crítico
    const recoveryAttempts = parseInt(localStorage.getItem('recoveryAttempts') || '0');
    
    if (recoveryAttempts <= 3 && !window.location.search.includes('recovered=true')) {
      localStorage.setItem('recoveryAttempts', (recoveryAttempts + 1).toString());
      startRecoveryProcess();
    }
  }
};

// Limpieza profunda cuando hay demasiados errores
const performDeepCleanup = () => {
  try {
    // Limpiar storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpiar cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Recargar sin caché
    window.location.href = '/?forceRefresh=true&t=' + Date.now();
  } catch (e) {
    console.error('Error durante limpieza profunda:', e);
    window.location.reload(true);
  }
};

// Iniciar proceso de recuperación
const startRecoveryProcess = () => {
  console.log('Iniciando proceso de recuperación...');
  
  // Mostrar mensaje al usuario
  const recoveryMessage = document.createElement('div');
  recoveryMessage.innerHTML = 'La aplicación no se ha renderizado correctamente. Intentando recuperación...';
  recoveryMessage.style.position = 'fixed';
  recoveryMessage.style.top = '0';
  recoveryMessage.style.left = '0';
  recoveryMessage.style.width = '100%';
  recoveryMessage.style.padding = '10px';
  recoveryMessage.style.backgroundColor = '#f8d7da';
  recoveryMessage.style.color = '#721c24';
  recoveryMessage.style.textAlign = 'center';
  recoveryMessage.style.zIndex = '9999';
  
  document.body.prepend(recoveryMessage);
  
  // Redireccionar para iniciar recuperación
  setTimeout(() => {
    window.location.href = '/?recovered=true&t=' + Date.now();
  }, 1500);
};

// Aplicar parches específicos para problemas de React Router en Cloudflare Workers
const patchReactRouter = () => {
  console.log('Aplicando correcciones para React Router en Cloudflare Workers');
  
  // Intentar solucionar problemas con el historial
  try {
    const originalPushState = history.pushState;
    history.pushState = function() {
      try {
        return originalPushState.apply(this, arguments);
      } catch (e) {
        console.warn('Error en history.pushState:', e);
        // Intentar solución alternativa
        window.location.href = arguments[2];
        return null;
      }
    };
  } catch (e) {
    console.error('No se pudo aplicar patch a history.pushState:', e);
  }
};

// Realizar diagnóstico inicial para detectar potenciales problemas
const runInitialDiagnostic = () => {
  let isWorkerEnvironment = false;
  
  // Detectar si estamos en un entorno de Cloudflare Workers
  if (window.location.hostname.includes('workers.dev')) {
    isWorkerEnvironment = true;
    console.log('Entorno de Cloudflare Workers detectado');
  }
  
  // Verificar si estamos en producción
  const isProduction = !window.location.hostname.includes('localhost');
  console.log(`Entorno de ${isProduction ? 'producción' : 'desarrollo'} detectado, asumiendo API ${isProduction ? 'disponible' : 'no disponible'}`);
  
  // Configurar modo de API adecuado
  if (isProduction) {
    localStorage.setItem('use_proxy', 'true');
  }
  
  // Verificar si venimos de un proceso de recuperación
  if (window.location.search.includes('recovered=true')) {
    console.log('Proceso de recuperación en curso, realizando limpieza...');
    // Limpiar tokens de autenticación potencialmente corruptos
    localStorage.removeItem('supabase.auth.token');
  }
  
  // Verificar soporte para fetch
  if (!window.fetch) {
    console.error('Este navegador no soporta Fetch API');
    // Mostrar error al usuario
    showCompatibilityError('Este navegador no es compatible con la aplicación. Por favor actualice su navegador.');
  }
  
  console.log('[DiagnosticSystem] Inicializado');
};

// Mostrar error de compatibilidad
const showCompatibilityError = (message) => {
  const errorMessage = document.createElement('div');
  errorMessage.innerHTML = message;
  errorMessage.style.position = 'fixed';
  errorMessage.style.top = '0';
  errorMessage.style.left = '0';
  errorMessage.style.width = '100%';
  errorMessage.style.padding = '10px';
  errorMessage.style.backgroundColor = '#f8d7da';
  errorMessage.style.color = '#721c24';
  errorMessage.style.textAlign = 'center';
  errorMessage.style.zIndex = '9999';
  
  document.body.prepend(errorMessage);
};

export default {
  initErrorRecovery,
  handleGlobalError,
  handlePromiseRejection
};
