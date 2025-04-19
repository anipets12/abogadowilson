/**
 * Utilitarios para manejar tipos desconocidos de forma segura
 */

/**
 * Funciu00f3n de utilidad para convertir un valor de tipo 'unknown' a un tipo especu00edfico
 * para evitar errores de TypeScript en tiempo de compilaciu00f3n
 */
export function typedBody<T>(body: unknown): T {
  return body as T;
}

/**
 * Funciu00f3n de utilidad para acceder a una propiedad de un objeto desconocido
 * de forma segura en tiempo de compilaciu00f3n
 */
export function getProp<T>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === 'object' && key in obj) {
    return (obj as Record<string, T>)[key];
  }
  return undefined;
}

/**
 * Extrae un valor tipado desde un objeto desconocido o devuelve un valor por defecto
 */
export function extractValue<T>(
  obj: unknown,
  key: string,
  defaultValue: T
): T {
  const value = getProp<T>(obj, key);
  return value !== undefined ? value : defaultValue;
}

/**
 * Verifica si un objeto desconocido tiene una determinada forma/estructura
 */
export function hasShape<T>(
  obj: unknown,
  requiredProps: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false;
  
  for (const prop of requiredProps) {
    if (!(prop in obj)) return false;
  }
  
  return true;
}
