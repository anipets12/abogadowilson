import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Importamos nuestro parche para corregir errores en router.js e index.esm.js
import { applyRouterPatches } from './utils/routerPatch'

// Aseguramos que React esté disponible globalmente para evitar errores
if (typeof window !== 'undefined') {
  window.React = React;
  
  // Aplicar parches para errores comunes
  applyRouterPatches();
  
  // Configurar variables globales para Turnstile
  window.turnstileSitekey = "0x4AAAAAABDkl--Sw4n_bwmU";
  
  // Prevenir propagación de errores en Workers
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && (
        event.error.message.includes('is undefined') ||
        event.error.message.includes('NetworkError when attempting')
      )) {
      console.warn('Error interceptado y neutralizado:', event.error.message);
      event.preventDefault();
    }
  }, true);
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
