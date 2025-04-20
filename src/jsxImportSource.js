/**
 * Este archivo asegura que React esté disponible globalmente para todos los componentes JSX
 * Esto es especialmente importante para el entorno de producción en Cloudflare Workers
 * donde los componentes pueden cargar de forma asíncrona y perder la referencia a React
 */
import * as React from 'react';

// Definición explícita de React para entornos JavaScript globales
if (typeof window !== 'undefined') {
  window.React = React;
}

// Para entornos Web Workers y Service Workers (como Cloudflare Workers)
if (typeof self !== 'undefined') {
  self.React = React;
}

// Para entornos Node.js (en caso de SSR)
if (typeof global !== 'undefined') {
  global.React = React;
}

// Respaldo global para entornos modernos
if (typeof globalThis !== 'undefined') {
  globalThis.React = React;
}

// También exportamos los hooks principales para asegurar su disponibilidad
const {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useLayoutEffect,
  Fragment,
  createContext,
  createElement,
  Children,
  Component,
  PureComponent,
  memo,
  forwardRef
} = React;

// Hacemos disponibles globalmente los hooks más utilizados
if (typeof window !== 'undefined') {
  window.useState = useState;
  window.useEffect = useEffect;
  window.useRef = useRef;
  window.useContext = useContext;
  window.useMemo = useMemo;
  window.useCallback = useCallback;
  window.Fragment = Fragment;
  window.createContext = createContext;
  window.createElement = createElement;
}

console.log('✅ React está disponible globalmente:', !!React);

export default React;
