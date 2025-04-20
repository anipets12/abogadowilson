/**
 * HelmetWrapper.jsx - Componente envolvente seguro para react-helmet-async
 * 
 * Este componente soluciona los problemas de "TypeError: e is undefined" en Cloudflare Workers
 * proporcionando una interfaz segura para react-helmet-async.
 * 
 * Versión mejorada para prevenir errores en Workers sin React disponible
 */
import React from 'react';

// Solucionamos el problema de React no disponible
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}

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
  // Verificamos si estamos en un entorno donde podría fallar
  const isBrowser = typeof window !== 'undefined';
  const isSafeEnvironment = isBrowser && typeof document !== 'undefined';
  
  // Si no estamos en un entorno seguro, solo devolvemos los children
  if (!isSafeEnvironment) {
    console.warn('HelmetWrapper: No estamos en un entorno seguro, saltando SEO');
    return <>{children}</>;
  }
  
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
        
        {/* Metatags para SEO básico */}
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Abg. Wilson Alexander Ipiales Guerrón" />
        
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
