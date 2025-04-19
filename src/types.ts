/// <reference path="./cloudflare.d.ts" />

// Tipos requeridos para Auth Context
export interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (data: LoginData) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<any>;
  isAuthenticated: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  nombre?: string;
  roles?: string[];
  token?: string;
}

// Tipos para API respuestas
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
}

// Tipos para Health Check
export interface HealthCheck {
  database: boolean;
  supabase: boolean;
  paypal: boolean;
  status: 'ok' | 'error';
  timestamp: string;
}

// Interfaces para consultas
export interface ConsultaData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

// Tipo SEO Props
export interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  ogUrl?: string;
}

// Interfaces para los clientes simulados
export interface SupabaseClient {
  auth: {
    signInWithPassword(credentials: { email: string; password: string }): Promise<any>;
    signUp(credentials: { email: string; password: string; options?: any }): Promise<any>;
  };
}

export interface PrismaClient {
  document: {
    findMany(params: { take: number; orderBy: any }): Promise<any[]>;
    findUnique(params: { where: { id: number } }): Promise<any | null>;
    create(params: { data: any }): Promise<any>;
    update(params: { where: { id: number }; data: any }): Promise<any>;
    delete(params: { where: { id: number } }): Promise<any>;
  };
  servicio: {
    findMany(params?: { where?: any; take?: number; orderBy?: any }): Promise<any[]>;
    findUnique(params: { where: { id: string } }): Promise<any | null>;
    create(params: { data: any }): Promise<any>;
    update(params: { where: { id: string }; data: any }): Promise<any>;
    delete(params: { where: { id: string } }): Promise<any>;
  };
  pago: {
    findMany(params?: { where?: any; take?: number; orderBy?: any }): Promise<any[]>;
    findUnique(params: { where: { id: string } }): Promise<any | null>;
    create(params: { data: any }): Promise<any>;
    update(params: { where: { id: string }; data: any }): Promise<any>;
  };
  usuario: {
    findMany(params?: { where?: any; take?: number; orderBy?: any }): Promise<any[]>;
    findUnique(params: { where: { id: string } | { email: string } }): Promise<any | null>;
    create(params: { data: any }): Promise<any>;
    update(params: { where: { id: string } | { email: string }; data: any }): Promise<any>;
  };
  cita: {
    findMany(params?: { where?: any; take?: number; orderBy?: any }): Promise<any[]>;
    findUnique(params: { where: { id: string } }): Promise<any | null>;
    create(params: { data: any }): Promise<any>;
    update(params: { where: { id: string }; data: any }): Promise<any>;
    delete(params: { where: { id: string } }): Promise<any>;
  };
  ai_consulta: {
    create(params: { data: any }): Promise<any>;
    findMany(params?: { where?: any; take?: number; orderBy?: any }): Promise<any[]>;
  };
  ai_token: {
    findUnique(params: { where: { usuario_id: string } }): Promise<any | null>;
    upsert(params: { where: any; update: any; create: any }): Promise<any>;
  };
  system_log: {
    create(params: { data: any }): Promise<any>;
  };
}

export interface NotionClient {
  createPage(data: any): Promise<any>;
  updatePage(pageId: string, data: any): Promise<any>;
  queryDatabase(databaseId: string, filter?: any): Promise<any>;
  registrarCliente(cliente: {
    nombre: string;
    email: string;
    telefono: string;
    asunto?: string;
    mensaje?: string;
  }): Promise<any>;
  registrarPago(pago: {
    usuario_id: string;
    monto: number;
    estado: string;
    metodo_pago: string;
    servicio_id?: string;
    referencia_externa?: string;
  }): Promise<any>;
  registrarCita(cita: {
    usuario_id: string;
    servicio_id: string;
    fecha: Date;
    estado: string;
    notas?: string;
  }): Promise<any>;
  registrarServicio(servicio: {
    nombre: string;
    descripcion: string;
    precio: number;
    duracion?: number;
    categoria: string;
  }): Promise<any>;
  actualizarEstadoCliente(clienteId: string, estado: string): Promise<any>;
}

export interface OpenAIClient {
  createCompletion(params: {
    prompt: string;
    model: string;
    max_tokens?: number;
    temperature?: number;
  }): Promise<{
    id: string;
    choices: Array<{ text: string }>;
    usage: { total_tokens: number; prompt_tokens: number; completion_tokens: number };
  }>;
  createEmbedding(params: {
    input: string | string[];
    model: string;
  }): Promise<{
    data: Array<{ embedding: number[] }>;
    usage: { total_tokens: number };
  }>;
}

export interface PayPalClient {
  createOrder: (amount: number, currency: string) => Promise<string>;
  captureOrder: (orderId: string) => Promise<any>;
  createSubscription: (planId: string, email: string) => Promise<string>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
}

export interface MistralClient {
  createCompletion: (params: {
    prompt: string;
    model: string;
    max_tokens?: number;
    temperature?: number;
  }) => Promise<{
    id: string;
    choices: Array<{ text: string }>;
    usage: { total_tokens: number; prompt_tokens: number; completion_tokens: number };
  }>;
  createEmbedding: (params: {
    input: string | string[];
    model: string;
  }) => Promise<{
    data: Array<{ embedding: number[] }>;
    usage: { total_tokens: number };
  }>;
}

export interface WorkerEnv {
  DB: D1Database
  ASSETS: KVNamespace
  SUPABASE_URL: string
  SUPABASE_KEY: string
  DATABASE_URL: string
  JWT_SECRET: string
  TURSO_DATABASE_URL: string
  TURSO_AUTH_TOKEN: string
  CORS_ORIGIN: string
  NOTION_API_KEY: string
  NOTION_DATABASE_ID: string
  OPENAI_API_KEY: string
  MISTRAL_API_KEY: string
  PAYPAL_CLIENT_ID: string
  PAYPAL_CLIENT_SECRET: string
}

export interface WorkerRequest extends Request {
  env: WorkerEnv
}

export interface Services {
  supabase: SupabaseClient;
  prisma: PrismaClient;
  notion: NotionClient;
  openai: OpenAIClient;
  paypal: PayPalClient;
  mistral: MistralClient;
  db: D1Database;
  assets: KVNamespace;
}
