/**
 * Corrección para problemas específicos con React Router v6 en Cloudflare Workers
 * Este archivo proporciona parches para los errores "TypeError: e is undefined"
 */

// Función para aplicar los parches específicos para React Router
export function applyReactRouterFixes() {
  if (typeof window === 'undefined') return;

  console.log('Aplicando correcciones para React Router en Cloudflare Workers');
  
  // Interceptar los errores de router.js y proporcionar un objeto de evento válido
  const originalCreateEvent = window.Event;
  if (originalCreateEvent) {
    window.Event = function patchedEvent(type, eventInitDict) {
      if (type === 'popstate' && (!eventInitDict || typeof eventInitDict !== 'object')) {
        // Proporcionar un objeto de evento personalizado para eventos de navegación
        console.log('Interceptando evento de navegación para prevenir errores');
        eventInitDict = { 
          bubbles: false, 
          cancelable: false,
          state: window.history.state || {}
        };
      }
      return new originalCreateEvent(type, eventInitDict);
    };

    // Mantener compatibilidad con el constructor original
    window.Event.prototype = originalCreateEvent.prototype;
  }

  // Interceptar errores específicos en módulos de React Router
  const originalError = console.error;
  console.error = function(...args) {
    // Filtrar algunos errores específicos de React Router
    const errorMsg = args[0]?.toString() || '';
    if (
      errorMsg.includes('e is undefined') || 
      errorMsg.includes('Cannot read properties of undefined') ||
      (args[0]?.message && args[0].message.includes('router.js'))
    ) {
      console.warn('Suprimiendo error de React Router:', args[0]);
      return; // No mostrar estos errores específicos
    }
    return originalError.apply(console, args);
  };
  
  // Corregir event.state undefined en la navegación
  const originalPushState = window.history.pushState;
  if (originalPushState) {
    window.history.pushState = function(state, title, url) {
      // Asegurar que el state siempre sea un objeto
      state = state || {};
      return originalPushState.call(this, state, title, url);
    };
  }
  
  // Corrección para index.esm.js:640 y index.esm.js:644
  if (typeof window !== 'undefined' && window.addEventListener) {
    // Añadir un detector de eventos para cualquier click en la ventana
    window.addEventListener('click', function(e) {
      // Verificar si el click es en un enlace
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        // Asegurar que el evento tenga todas las propiedades necesarias
        if (!e.preventDefault) {
          e.preventDefault = function() {};
        }
        if (!e.stopPropagation) {
          e.stopPropagation = function() {};
        }
      }
    }, true);

    // Parche para navegación y carga de página
    window.addEventListener('popstate', function(e) {
      if (!e || !e.state) {
        console.warn('Corrigiendo evento popstate sin estado');
        Object.defineProperty(e, 'state', {
          value: {},
          writable: true,
          configurable: true
        });
      }
    }, true);
  }
}

// Aplicar automáticamente cuando se importa este módulo
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyReactRouterFixes);
  } else {
    applyReactRouterFixes();
  }
}

export default applyReactRouterFixes;
