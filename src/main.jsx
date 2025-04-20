import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importamos nuestros parches para corregir errores
import { applyRouterPatches } from './utils/routerPatch'
import { applyReactRouterFixes } from './utils/reactRouterFix'

// Aseguramos que React esté disponible globalmente para evitar errores
if (typeof window !== 'undefined') {
  window.React = React;
  
  // Aplicar parches para errores comunes
  applyRouterPatches();
  applyReactRouterFixes();
  
  // Configurar variables globales para Turnstile
  window.turnstileSitekey = "0x4AAAAAABDkl--Sw4n_bwmU";
  
  // Definir valores globales para tokens de consulta
  window.__tokenValues = {
    consultaEstandar: 1,      // 1 token por consulta estándar
    consultaCompleja: 2,      // 2 tokens por consulta compleja
    generarDocumento: 3,      // 3 tokens por documento generado
    consultaUrgente: 5,       // 5 tokens por consulta urgente
    tokensNuevoUsuario: 3,    // Tokens gratuitos para nuevos usuarios
    descuentoRecarga: 0.1     // 10% de descuento en recargas mayores a 10 tokens
  };
  
  // Prevenir propagación de errores en Workers
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && (
        event.error.message.includes('is undefined') ||
        event.error.message.includes('NetworkError when attempting') ||
        event.error.message.includes('router.js') ||
        event.error.message.includes('index.esm.js')
      )) {
      console.warn('Error interceptado y neutralizado:', event.error.message);
      event.preventDefault();
    }
  }, true);
  
  // Detectar si la aplicación está funcionando correctamente
  let appStartTime = Date.now();
  let appStartupCheck = setInterval(() => {
    // Si después de 5 segundos no se ha renderizado nada, intentar recuperación
    if (Date.now() - appStartTime > 5000) {
      clearInterval(appStartupCheck);
      
      // Verificar si la aplicación se ha renderizado correctamente
      const rootElement = document.getElementById('root');
      if (rootElement && !rootElement.hasChildNodes()) {
        console.error('La aplicación no se ha renderizado correctamente. Intentando recuperación...');
        
        // Mostrar mensaje de error al usuario
        rootElement.innerHTML = `
          <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
            <h2 style="color: #333;">Estamos teniendo dificultades técnicas</h2>
            <p style="margin: 1rem 0;">Por favor, intente recargar la página o contacte al Abg. Wilson Ipiales.</p>
            <button 
              onclick="location.reload()" 
              style="background: #0056b3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;"
            >
              Reintentar
            </button>
            <div style="margin-top: 2rem;">
              <p style="font-size: 0.9rem; color: #666;">
                <strong>Contacto directo:</strong> +593988835269 
                <a href="https://wa.me/593988835269" style="color: #0056b3; text-decoration: none;">
                  (WhatsApp)
                </a>
              </p>
            </div>
          </div>
        `;
      }
    }
  }, 1000);
}

// Creat root con manejo de errores
let root;
try {
  // Guardar referencia al root para recuperación en caso de error
  root = ReactDOM.createRoot(document.getElementById('root'));
  window.__reactRoot = root;
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error al renderizar la aplicación:', error);
  
  // Intentar recuperar en modo degradado
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Estamos experimentando dificultades técnicas</h2>
        <p>Por favor, contacte directamente al Abg. Wilson Ipiales al +593988835269</p>
        <button onclick="location.reload()">Reintentar</button>
      </div>
    `;
  }
}
