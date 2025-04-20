// Este archivo asegura que React esté disponible globalmente para todos los componentes JSX
import * as React from 'react';

// Hacemos que React esté disponible globalmente de varias maneras para mayor compatibilidad
window.React = React;
globalThis.React = React;

// Para entornos que no reconocen window o globalThis
if (typeof global !== 'undefined') {
  global.React = React;
}

// Asegurarse de que los componentes principales de React estén disponibles globalmente
const { useState, useEffect, useContext, useRef, useMemo, useCallback, useReducer } = React;
window.useState = useState;
window.useEffect = useEffect;
window.useContext = useContext;
window.useRef = useRef;
window.useMemo = useMemo;
window.useCallback = useCallback;
window.useReducer = useReducer;

export default React;
