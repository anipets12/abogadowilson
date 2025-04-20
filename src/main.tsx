/**
 * main.tsx - Punto de entrada principal de la aplicación
 * Implementa soluciones para resolver problemas de Cloudflare Workers
 */

// Importar JSX runtime primero para asegurar que React esté disponible globalmente
import './jsx-runtime'; // Usa nuestro runtime personalizado en lugar de jsxImportSource

// Asegúrate de que React esté disponible para react-helmet-async
import * as React from 'react'
window.React = React; // Asignación explícita para asegurar que React esté disponible globalmente

// Importaciones estándar de la aplicación
import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Componentes de contexto y utilidades
import { AuthProvider } from './context/AuthContext'
import { initializeAnalytics } from './utils/seo'
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

// React Helmet - utilizamos un manejador personalizado para Cloudflare Workers
import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

initializeAnalytics();

// Función para inicializar la aplicación después de que el DOM esté listo
const initializeApp = () => {
  const rootElement = document.getElementById('root')
  if (!rootElement) throw new Error('Root element not found')
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                  <App />
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
};

// En entornos de producción como Cloudflare Workers, asegúrate de esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // Si el DOM ya está cargado, inicializa inmediatamente
  console.log('DOM ya cargado, inicializando la aplicación inmediatamente');
  initializeApp();
}
