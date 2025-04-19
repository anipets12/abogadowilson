/**
 * Sistema avanzado de diagnu00f3stico y recuperaciu00f3n para el sitio web del Abogado Wilson
 * 
 * Este sistema se encarga de:
 * 1. Detectar errores de red (como el error 1042)
 * 2. Manejar problemas con favicon
 * 3. Monitorear la conectividad con Supabase
 * 4. Proporcionar mecanismos de recuperaciu00f3n automtica
 */

// Contador global de intentos de recuperaciu00f3n
let recoveryAttempts = 0;
const MAX_RECOVERY_ATTEMPTS = 3;

// Inicializar sistema de diagnu00f3stico
export function initDiagnosticSystem() {
  console.log('[DiagnosticSystem] Inicializado');
  
  // Manejar favicon de manera proactiva para prevenir 404
  setupFaviconHandler();
  
  // Detectar errores de red
  setupNetworkErrorDetection();
  
  // Monitorear sesiones de Supabase
  monitorSupabaseSession();
  
  // Verificar si estamos en un proceso de recuperaciu00f3n
  handleRecoveryProcess();
}

// Configurar manejo de favicon para evitar errores 404
function setupFaviconHandler() {
  const faviconBase64 = 'AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREQAAAAAAEAAAEAAAAAEAAAABAAAAEAAAAAAQAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAERAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  
  // Crear link de favicon inline
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = 'data:image/x-icon;base64,' + faviconBase64;
  document.head.appendChild(link);
  
  // Interceptar solicitudes de favicon
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    if (typeof resource === 'string' && resource.includes('favicon')) {
      console.log('[DiagnosticSystem] Interceptando solicitud de favicon');
      return Promise.resolve(new Response(new Blob(), {status: 200}));
    }
    return originalFetch.apply(this, arguments);
  };
}

// Detectar errores de red
function setupNetworkErrorDetection() {
  window.addEventListener('error', function(e) {
    // Detectar error 1042 (error de conexiu00f3n a la red)
    if (e.message && (e.message.includes('1042') || e.message.includes('network'))) {
      console.warn('[DiagnosticSystem] Error 1042 detectado, iniciando recuperaciu00f3n...');
      handleNetworkError();
    }
  });
  
  // Detectar desconexiones de red
  window.addEventListener('offline', function() {
    console.warn('[DiagnosticSystem] Conexiu00f3n a internet perdida');
    displayConnectionAlert('offline');
  });
  
  window.addEventListener('online', function() {
    console.log('[DiagnosticSystem] Conexiu00f3n a internet restaurada');
    displayConnectionAlert('online');
  });
}

// Manejar errores de red
function handleNetworkError() {
  recoveryAttempts++;
  
  if (recoveryAttempts > MAX_RECOVERY_ATTEMPTS) {
    console.warn('[DiagnosticSystem] Demasiados intentos de recuperaciu00f3n, realizando limpieza completa...');
    clearAllData();
  }
  
  // Redirigir a la pu00e1gina principal con paru00e1metros de recuperaciu00f3n
  if (!window.location.href.includes('recovered=true')) {
    window.location.href = '/?recovered=true&from=1042&t=' + Date.now();
  }
}

// Monitnear sesiu00f3n de Supabase
function monitorSupabaseSession() {
  // Verificar regularmente la sesiu00f3n de Supabase
  setInterval(() => {
    const authToken = localStorage.getItem('supabase.auth.token');
    if (authToken) {
      try {
        const tokenData = JSON.parse(authToken);
        const expiresAt = tokenData?.currentSession?.expires_at;
        
        if (expiresAt && expiresAt * 1000 < Date.now()) {
          console.warn('[DiagnosticSystem] Sesiu00f3n de Supabase expirada, limpiando tokens...');
          localStorage.removeItem('supabase.auth.token');
        }
      } catch (e) {
        console.error('[DiagnosticSystem] Error al procesar token de Supabase:', e);
        localStorage.removeItem('supabase.auth.token');
      }
    }
  }, 60000); // Verificar cada minuto
}

// Manejar proceso de recuperaciu00f3n
function handleRecoveryProcess() {
  if (window.location.search.includes('recovered=true')) {
    // Mostrar la pantalla de recuperaciu00f3n
    showRecoveryScreen();
    
    // Iniciar proceso de recuperaciu00f3n
    setTimeout(() => {
      // Limpiar cachu00e9 y datos potencialmente corruptos
      clearLocalData();
      
      // Esperar un momento y luego recargar la pu00e1gina limpia
      setTimeout(() => {
        localStorage.setItem('recoverySuccessful', 'true');
        window.location.replace('/');
      }, 2000);
    }, 1500);
  } else if (localStorage.getItem('recoverySuccessful') === 'true') {
    // Acabamos de completar una recuperaciu00f3n exitosa
    localStorage.removeItem('recoverySuccessful');
    showSuccessMessage();
  }
}

// Mostrar pantalla de recuperaciu00f3n
function showRecoveryScreen() {
  // Crear y mostrar la pantalla de recuperaciu00f3n si no existe
  if (!document.getElementById('recovery-screen')) {
    const recoveryScreen = document.createElement('div');
    recoveryScreen.id = 'recovery-screen';
    recoveryScreen.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 9999; text-align: center; padding-top: 20vh;';
    
    recoveryScreen.innerHTML = `
      <h1 style="color: #3457dc;">Recuperando conexiu00f3n</h1>
      <p>Estamos restableciendo la conexiu00f3n con nuestros servidores. Por favor, espera un momento...</p>
      <div style="width: 80%; max-width: 300px; height: 10px; background: #f0f0f0; margin: 30px auto; border-radius: 5px; overflow: hidden;">
        <div id="progress-bar" style="width: 0%; height: 100%; background: #3457dc; transition: width 0.5s;"></div>
      </div>
      <p id="recovery-message">Iniciando proceso de recuperaciu00f3n...</p>
    `;
    
    document.body.appendChild(recoveryScreen);
    
    // Simular progreso
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      document.getElementById('progress-bar').style.width = progress + '%';
      
      if (progress === 30) {
        document.getElementById('recovery-message').textContent = 'Limpiando cachu00e9 y tokens corruptos...';
      } else if (progress === 50) {
        document.getElementById('recovery-message').textContent = 'Eliminando datos de navegaciu00f3n...';
      } else if (progress === 75) {
        document.getElementById('recovery-message').textContent = 'Restaurando conexiu00f3n segura...';
      } else if (progress === 90) {
        document.getElementById('recovery-message').textContent = 'Completado. Redirigiendo...';
      } else if (progress >= 100) {
        clearInterval(interval);
      }
    }, 80);
  }
}

// Mostrar mensaje de u00e9xito
function showSuccessMessage() {
  setTimeout(() => {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #4caf50; color: white; padding: 10px 20px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 9999; transition: opacity 0.5s;';
    successMsg.textContent = 'Recuperaciu00f3n completada con u00e9xito';
    document.body.appendChild(successMsg);
    
    // Ocultar despu00e9s de 3 segundos
    setTimeout(() => {
      successMsg.style.opacity = '0';
      setTimeout(() => successMsg.remove(), 500);
    }, 3000);
  }, 1000);
}

// Mostrar alerta de conexiu00f3n
function displayConnectionAlert(status) {
  const alertClass = status === 'online' ? 'connection-restored' : 'connection-lost';
  const alertText = status === 'online' ? 'Conexiu00f3n a internet restaurada' : 'Conexiu00f3n a internet perdida';
  
  const connectionAlert = document.createElement('div');
  connectionAlert.className = `connection-alert ${alertClass}`;
  connectionAlert.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    background-color: ${status === 'online' ? '#4caf50' : '#f44336'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 9999;
    transition: opacity 0.5s;
  `;
  connectionAlert.textContent = alertText;
  
  document.body.appendChild(connectionAlert);
  
  // Eliminar despuu00e9s de 3 segundos
  setTimeout(() => {
    connectionAlert.style.opacity = '0';
    setTimeout(() => connectionAlert.remove(), 500);
  }, 3000);
}

// Limpiar todos los datos locales
function clearLocalData() {
  try {
    // Limpiar datos relacionados con autenticaciu00f3n
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('authSession');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    
    // Limpiar datos de cachu00e9
    for (const key in localStorage) {
      if (key.includes('cache') || key.includes('token') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    }
    
    // Limpiar datos de sesiu00f3n
    sessionStorage.clear();
  } catch (e) {
    console.error('[DiagnosticSystem] Error al limpiar datos locales:', e);
  }
}

// Limpiar completamente todos los datos y cookies
function clearAllData() {
  try {
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpiar todas las cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  } catch (e) {
    console.error('[DiagnosticSystem] Error al limpiar todos los datos:', e);
  }
}

// Exportar funciones u00fatiles
export {
  clearLocalData,
  clearAllData,
  handleNetworkError
};
