/**
 * Utilidades para manejar la seguridad de tipos y evitar errores de compilaciu00f3n
 * Este archivo ayuda a trabajar con datos de tipo unknown de manera segura
 */

/**
 * Convierte un valor desconocido al tipo especificado
 * Usar con precauciu00f3n, solo cuando se esté seguro del tipo real
 */
export function assertType<T>(value: unknown): T {
  return value as T;
}

/**
 * Obtiene un valor tipado de un objeto potencialmente desconocido
 */
export function getTypedProp<T>(obj: unknown, key: string): T | undefined {
  if (obj && typeof obj === 'object' && key in obj) {
    return (obj as Record<string, unknown>)[key] as T;
  }
  return undefined;
}

/**
 * Convierte un cuerpo de solicitud (request.json()) en un tipo seguro
 */
export function safeRequestBody<T extends Record<string, any>>(body: unknown): T {
  if (!body || typeof body !== 'object') {
    return {} as T;
  }
  return body as T;
}

/**
 * Envuelve un objeto en una verificaciu00f3n de seguridad de tipos
 * Permite acceder a propiedades de manera segura
 */
export function safeParse<T>(obj: unknown): SafeObject<T> {
  return new SafeObject<T>(obj as T);
}

class SafeObject<T> {
  private data: Partial<T>;

  constructor(data: unknown) {
    this.data = (data || {}) as Partial<T>;
  }

  get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K] | undefined {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  has<K extends keyof T>(key: K): boolean {
    return this.data[key] !== undefined;
  }

  requireKeys(...keys: (keyof T)[]): boolean {
    for (const key of keys) {
      if (this.data[key] === undefined) {
        return false;
      }
    }
    return true;
  }

  raw(): Partial<T> {
    return this.data;
  }
}

/**
 * Crea un objeto Response con JSON para APIs
 */
export function jsonResponse(data: unknown, status = 200, headers = {}): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }
  );
}

/**
 * Crea un objeto Response de error para APIs
 */
export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}
