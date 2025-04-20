/**
 * jsx-runtime.js - Garantiza que React esté disponible globalmente en todos los contextos
 * Esta implementación resuelve problemas específicos con Cloudflare Workers
 * donde React no está disponible en algunos componentes durante el renderizado
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';

// Función para inyectar React en varias APIs globales
function injectReactGlobally() {
  const targets = [
    typeof window !== 'undefined' ? window : null,
    typeof self !== 'undefined' ? self : null, 
    typeof global !== 'undefined' ? global : null,
    typeof globalThis !== 'undefined' ? globalThis : null
  ].filter(Boolean);

  for (const target of targets) {
    // Previene conflictos de módulos
    if (!target._REACT_INJECTED) {
      // Core React APIs
      target.React = React;
      target.ReactDOM = ReactDOM;
      target.ReactDOMClient = ReactDOMClient;
      
      // JSX Runtime
      target.jsx = jsx;
      target.jsxs = jsxs;
      target.Fragment = Fragment;
      
      // Hooks comunes
      target.useState = React.useState;
      target.useEffect = React.useEffect;
      target.useContext = React.useContext;
      target.useReducer = React.useReducer;
      target.useCallback = React.useCallback;
      target.useMemo = React.useMemo;
      target.useRef = React.useRef;
      target.useLayoutEffect = React.useLayoutEffect;
      target.useImperativeHandle = React.useImperativeHandle;
      
      // Component utilities
      target.createElement = React.createElement;
      target.cloneElement = React.cloneElement;
      target.createContext = React.createContext;
      target.memo = React.memo;
      target.forwardRef = React.forwardRef;
      
      target._REACT_INJECTED = true;
    }
  }
  
  console.log('✅ React JSX Runtime inicializado y disponible globalmente');
  return React;
}

// Ejecutar inmediatamente para garantizar disponibilidad
const injectedReact = injectReactGlobally();

// Exportamos React y JSX runtime para uso explícito
export { 
  injectedReact as React,
  jsx,
  jsxs,
  Fragment
};

// Exportamos el runtime para compatibilidad con vite/esbuild
export default {
  jsx,
  jsxs,
  Fragment
};
