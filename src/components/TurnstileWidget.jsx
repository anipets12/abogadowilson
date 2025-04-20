import React, { useState, useEffect } from 'react';

/**
 * Componente simplificado de Cloudflare Turnstile
 */
const TurnstileWidget = ({ 
  onVerify, 
  onError, 
  onExpire,
  action = 'default',
  theme = 'auto',
  size = 'normal'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos una verificación exitosa para desarrollo
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (typeof onVerify === 'function') {
        onVerify('simulated-token-000000000');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onVerify]);

  return (
    <div className="turnstile-wrapper" style={{ margin: '1rem 0' }}>
      <div 
        style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '0.25rem',
          border: '1px solid #e2e8f0',
          fontSize: '0.875rem',
          color: '#4a5568',
          textAlign: 'center'
        }}
      >
        {isLoading ? 'Cargando verificación...' : 'Verificación completada ✓'}
      </div>
    </div>
  );
};

export default TurnstileWidget;
