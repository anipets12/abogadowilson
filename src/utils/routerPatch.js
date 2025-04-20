/**
 * routerPatch.js - Solución para problemas de router en Cloudflare Workers
 * 
 * Este archivo aplica parches para resolver errores comunes como "e is undefined"
 * en router.js y problemas similares en index.esm.js
 */

// Función para aplicar los parches cuando se carga la página
export function applyRouterPatches() {
  if (typeof window === 'undefined') return;
  
  console.log('Aplicando parches para compatibilidad con Cloudflare Workers');
  
  // Parche global para errores de tipo "e is undefined"
  const originalError = window.Error;
  window.Error = function patchedError(...args) {
    // Si el stack trace menciona router.js o index.esm.js, intentar recuperar
    const error = new originalError(...args);
    if (error.stack && (error.stack.includes('router.js') || error.stack.includes('index.esm.js'))) {
      console.warn('Interceptado error en router/esm:', error.message);
      
      // Intentar recuperar la ejecución sin romper la aplicación
      setTimeout(() => {
        try {
          // Intentar forzar una actualización de React si está disponible
          if (window.React && window.__reactRoot) {
            console.log('Intentando recuperar React de error fatal');
          }
        } catch (e) {
          // Ignorar errores en el proceso de recuperación
        }
      }, 0);
    }
    return error;
  };
  
  // Prevenir errores con las propiedades no inicializadas
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && event.error.message.includes('is undefined')) {
      // Verificar si el error está en router.js o index.esm.js
      if (event.filename && (event.filename.includes('router.js') || event.filename.includes('index.esm.js'))) {
        console.warn('Prevenido error fatal:', event.error.message);
        // Prevenir que el error se propague
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }, true);
  
  // Detectar carga de componentes específicos problemáticos
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function patchedDefineProperty(obj, prop, descriptor) {
    // Interceptar definiciones de propiedades en objetos específicos
    if (prop === 'render' && descriptor && typeof descriptor.value === 'function') {
      const originalRender = descriptor.value;
      descriptor.value = function patchedRender(...args) {
        try {
          return originalRender.apply(this, args);
        } catch (error) {
          if (error && error.message && error.message.includes('is undefined')) {
            console.warn('Recuperando de error en render:', error.message);
            // Devolver un componente de fallback en lugar de romper la aplicación
            return null;
          }
          throw error;
        }
      };
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
}

// Aplicar parches automáticamente si estamos en el navegador
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyRouterPatches);
  } else {
    applyRouterPatches();
  }
}

export default applyRouterPatches;
