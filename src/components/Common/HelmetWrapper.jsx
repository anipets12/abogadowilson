/**
 * HelmetWrapper.jsx - Componente envolvente seguro para react-helmet-async
 * 
 * Este componente soluciona los problemas de "TypeError: e is undefined" en Cloudflare Workers
 * proporcionando una interfaz segura para react-helmet-async.
 */
import React from 'react';

// Importación condicional para evitar errores si react-helmet-async falla
let Helmet;
try {
  // Intentar importar de react-helmet-async
  Helmet = require('react-helmet-async').Helmet;
} catch (error) {
  // Si falla, crear un componente de respaldo que no haga nada
  console.warn('Error al cargar react-helmet-async, usando componente de respaldo');
  Helmet = ({ children }) => <>{children}</>;
}

/**
 * HelmetWrapper - Wrapper seguro para Helmet que previene errores en Cloudflare Workers
 */
const HelmetWrapper = ({ title, description, image, url, children }) => {
  try {
    return (
      <Helmet>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        
        {/* Open Graph / Facebook */}
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image} />}
        
        {/* Twitter */}
        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
        {image && <meta name="twitter:image" content={image} />}
        {image && <meta name="twitter:card" content="summary_large_image" />}
        
        {/* Cualquier otro children pasado al componente */}
        {children}
      </Helmet>
    );
  } catch (error) {
    console.error('Error en HelmetWrapper:', error);
    // En caso de error, devolver un fragmento vacío para no interrumpir el renderizado
    return <>{children}</>;
  }
};

export default HelmetWrapper;
