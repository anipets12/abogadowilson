import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'blue', fullScreen = false }) => {
  // Configuración de tamaños
  const sizeClasses = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4'
  };

  // Configuración de colores
  const colorClasses = {
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    gray: 'border-gray-500',
    white: 'border-white'
  };

  // Determinar las clases específicas
  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.blue;

  // Componente spinner con o sin pantalla completa
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className={`animate-spin rounded-full ${spinnerSize} border-t-transparent ${spinnerColor}`}></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-transparent ${spinnerColor}`}></div>
    </div>
  );
};

export default LoadingSpinner;
