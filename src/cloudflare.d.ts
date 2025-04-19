/**
 * Definiciones de tipos personalizadas para Cloudflare Workers
 */

// Definir módulos externos que necesitamos
declare module '@cloudflare/kv-asset-handler' {
  export function getAssetFromKV(request: Request, options?: any): Promise<Response>;
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const content: string;
  export default content;
}

interface Env {
  // KV Namespaces
  ASSETS: KVNamespace;
  
  // D1 Database
  DB: D1Database;
  
  // Conexiones a APIs
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  JWT_SECRET: string;
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  CORS_ORIGIN: string;
  NOTION_API_KEY: string;
  NOTION_DATABASE_ID: string;
  
  // Configuraciones de seguridad
  TURNSTILE_SECRET_KEY: string;
  CLOUDFLARE_ENV: string;
  ENABLE_DIAGNOSTICS: string;
  
  // APIs externas
  WHATSAPP_API_KEY: string;
  WHATSAPP_API_URL: string;
  WHATSAPP_AUTH_TOKEN: string;
  N8N_WEBHOOK_URL: string;
  AUTOMATION_API_KEY: string;
  
  // APIs de pago
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  
  // APIs de IA
  OPENAI_API_KEY: string;
  MISTRAL_API_KEY: string;
  
  // Variables faltantes detectadas en los errores
  API_KEY: string;
  WHATSAPP_TOKEN: string;
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  DATABASE_URL: string;
  NOTION_KEY: string;
  WHATSAPP_VERIFY_TOKEN: string;
  NODE_ENV: string;
}

// Definición para D1 Database
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  dump(): Promise<ArrayBuffer>;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(column?: string): Promise<T>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  success: boolean;
  error?: string;
  results?: T[];
  meta?: {
    duration: number;
    changes?: number;
    last_row_id?: number;
    rows_read?: number;
    rows_written?: number;
  };
}

// Definición para KV Namespace
interface KVNamespace {
  get(key: string, options?: KVNamespaceGetOptions): Promise<string | null>;
  getWithMetadata<Metadata = unknown>(key: string, options?: KVNamespaceGetOptions): Promise<{
    value: string | null;
    metadata: Metadata | null;
  }>;
  put(key: string, value: string | ReadableStream | ArrayBuffer, options?: KVNamespacePutOptions): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult>;
}

interface KVNamespaceGetOptions {
  type?: 'text' | 'json' | 'arrayBuffer' | 'stream';
  cacheTtl?: number;
}

interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: any;
}

interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

interface KVNamespaceListKey {
  name: string;
  expiration?: number;
  metadata?: any;
}

interface KVNamespaceListResult {
  keys: KVNamespaceListKey[];
  list_complete: boolean;
  cursor?: string;
}

// Definición de ExecutionContext para Cloudflare Workers
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

// Augment WorkerRequest to include URL property needed in the worker
declare global {
  interface Request {
    url: string;
  }
}
