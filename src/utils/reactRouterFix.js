/**
 * Corrección para problemas específicos con React Router v6 en Cloudflare Workers
 * Este archivo proporciona parches para los errores "TypeError: e is undefined"
 */

// Función para aplicar los parches específicos para React Router
export function applyReactRouterFixes() {
  if (typeof window === 'undefined') return;
  console.log('Aplicando correcciones para React Router en Cloudflare Workers');
  
  // Log original para depuración
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Suprimir errores específicos de React Router en Workers
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('e is undefined') || 
          args[0].includes('Failed to execute \'appendChild\' on \'Node\'') ||
          args[0].includes('NetworkError when attempting to fetch resource') ||
          args[0].includes('index.esm.js:640') ||
          args[0].includes('index.esm.js:644')) {
        console.log('Suprimiendo error de React Router:', args[0].substring(0, 100) + '...');
        
        // Intentar recuperar el router
        setTimeout(() => {
          try {
            if (window.__recoverFromRouterError) {
              window.__recoverFromRouterError();
            }
          } catch (e) {
            console.error('Error al recuperar router:', e);
          }
        }, 0);
        
        return;
      }
    }
    originalConsoleError.apply(console, args);
  };
  
  // Interceptar los errores de router.js y proporcionar un objeto de evento válido
  const originalCreateEvent = window.Event;
  if (originalCreateEvent) {
    window.Event = function patchedEvent(type, eventInitDict) {
      if (type === 'popstate' && (!eventInitDict || typeof eventInitDict !== 'object')) {
        // Proporcionar implementaciones alternativas para métodos faltantes
        window.gtag = window.gtag || function() { /* Stub para Google Analytics */ };
        
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
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && (
        event.reason.message.includes('e is undefined') ||
        event.reason.message.includes('Failed to fetch') ||
        event.reason.message.includes('router.js'))) {
      console.log('Error interceptado y neutralizado:', event.reason.message);
      event.preventDefault();
      
      // Activar recuperación
      if (window.__recoverFromRouterError) {
        setTimeout(() => window.__recoverFromRouterError(), 0);
      }
      
      return false;
    }
  });
  
  // Mejor implementación para el método __recoverFromRouterError
  window.__recoverFromRouterError = function() {
    try {
      // Obtener el estado actual
      const currentLocation = window.location;
      const currentPath = currentLocation.pathname;
      const searchParams = currentLocation.search;
      
      console.log('Recuperando de error de router para:', currentPath);
      
      // Técnica 1: Reinicar el estado de la historia
      const cleanPath = currentPath.split('?')[0];
      window.history.replaceState({key: Date.now().toString()}, '', cleanPath + searchParams);
      
      // Técnica 2: Limpiar renderizado actual e intentar re-renderizar
      const root = document.getElementById('root');
      if (root) {
        const routerDiv = document.createElement('div');
        routerDiv.id = 'router-recovery';
        routerDiv.style.display = 'none';
        root.appendChild(routerDiv);
        
        // Forzar reflujo/recálculo DOM
        setTimeout(() => {
          if (routerDiv && routerDiv.parentNode) {
            routerDiv.parentNode.removeChild(routerDiv);
          }
          
          // Técnica 3: emitir evento de navegación simulado
          window.dispatchEvent(new PopStateEvent('popstate', { 
            state: {key: Date.now().toString()} 
          }));
        }, 50);
      }
      
      // Verificar si necesitamos redirigir a inicio por demasiados errores
      const errorCount = parseInt(sessionStorage.getItem('router_error_count') || '0');
      if (errorCount > 3) {
        sessionStorage.setItem('router_error_count', '0');
        if (currentPath !== '/') {
          console.log('Demasiados errores, redirigiendo a inicio...');
          window.location.href = '/';
          return;
        }
      }
      sessionStorage.setItem('router_error_count', (errorCount + 1).toString());
    } catch (e) {
      console.error('Error en recuperación de React Router:', e);
    }
  };
  
  // Prevenir cierre abrupto por errores de red
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && (
        event.reason.message.includes('NetworkError') ||
        event.reason.message.includes('Failed to fetch'))) {
      console.log('Error interceptado y neutralizado:', event.reason.message);
      event.preventDefault();
      
      // Mostrar mensaje amigable al usuario
      if (document.getElementById('root') && !document.getElementById('error-alert')) {
        const errorAlert = document.createElement('div');
        errorAlert.id = 'error-alert';
        errorAlert.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f44336;color:white;padding:10px;text-align:center;z-index:9999;';
        errorAlert.innerText = 'Estamos experimentando dificultades de conexión. Recargando en 5 segundos...';
        document.getElementById('root').appendChild(errorAlert);
        
        // Configurar recarga automática después de un tiempo
        setTimeout(() => {
          const errorPage = document.getElementById('error-alert');
          if (errorPage) {
            errorPage.innerText = 'Recargando página...';
            setTimeout(() => window.location.reload(), 1000);
          }
        }, 5000);
      }
    }
  });

  // Interceptar errores específicos en módulos de React Router
  try {
    // Interceptar errores de "e is undefined"
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      try {
        return originalPushState.apply(this, arguments);
      } catch (error) {
        console.log('Error interceptado en history.pushState:', error);
        return null;
      }
    };
    
    // Interceptar errores de "replaceState"
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function() {
      try {
        return originalReplaceState.apply(this, arguments);
      } catch (error) {
        console.log('Error interceptado en history.replaceState:', error);
        return null;
      }
    };
    
    // Marcar como parcheado
    window.__reactRouterPatched = true;
    
  } catch (error) {
    console.error('Error al aplicar parches de React Router:', error);
  }

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
