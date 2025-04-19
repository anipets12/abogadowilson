import React, { useEffect, useRef } from 'react';

/**
 * Componente de Cloudflare Turnstile para protecciu00f3n anti-bot
 * 
 * @param {Object} props
 * @param {Function} props.onVerify - Funciu00f3n a llamar cuando la verificaciu00f3n es exitosa
 * @param {Function} props.onError - Funciu00f3n a llamar cuando hay un error en la verificaciu00f3n
 * @param {Function} props.onExpire - Funciu00f3n a llamar cuando el token expira
 * @param {string} props.action - Identificador de la acciu00f3n que se estu00e1 protegiendo (ej: 'login', 'contact_form')
 * @param {string} props.theme - Tema del widget ('light', 'dark', 'auto')
 * @param {string} props.size - Tamau00f1o del widget ('normal', 'compact')
 */
const TurnstileWidget = ({ 
  onVerify, 
  onError, 
  onExpire,
  action = 'default',
  theme = 'auto',
  size = 'normal'
}) => {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  
  // Clave pu00fablica de Turnstile (site key)
  const siteKey = '0x4AAAAAABDkl--Sw4n_bwmU';

  // Funciu00f3n para verificar el token con nuestro backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, action }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (typeof onVerify === 'function') {
          onVerify(token, data);
        }
      } else {
        console.error('Error al verificar token de Turnstile:', data.message);
        if (typeof onError === 'function') {
          onError(data.message, data.errors);
        }
        // Reiniciar el widget si hay error
        if (window.turnstile && widgetId.current) {
          window.turnstile.reset(widgetId.current);
        }
      }
    } catch (error) {
      console.error('Error en la verificaciu00f3n de Turnstile:', error);
      if (typeof onError === 'function') {
        onError('Error de conexiu00f3n', error);
      }
    }
  };

  useEffect(() => {
    // Cargar el script de Turnstile si no estu00e1 ya cargado
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Una vez cargado el script, renderizar el widget
        renderTurnstile();
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      // Si ya estu00e1 cargado, renderizar el widget
      renderTurnstile();
    }
  }, []);

  const renderTurnstile = () => {
    // Limpiar el widget anterior si existe
    if (widgetId.current && window.turnstile) {
      window.turnstile.remove(widgetId.current);
    }
    
    // Solo renderizar si el DOM estu00e1 listo y la API de turnstile estu00e1 disponible
    if (containerRef.current && window.turnstile) {
      try {
        widgetId.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: theme,
          size: size,
          action: action,
          callback: (token) => {
            verifyToken(token);
          },
          'expired-callback': () => {
            console.log('Token de Turnstile expirado');
            if (typeof onExpire === 'function') {
              onExpire();
            }
          },
          'error-callback': (error) => {
            console.error('Error en widget de Turnstile:', error);
            if (typeof onError === 'function') {
              onError('Error en widget', error);
            }
          },
        });
      } catch (error) {
        console.error('Error al renderizar widget de Turnstile:', error);
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="turnstile-container" 
      data-action={action}
      style={{ margin: '1rem 0' }}
    />
  );
};

export default TurnstileWidget;
