// Declaraciones de módulos para resolver errores de importación

// Librerías de React
declare module 'react-query' {}
declare module 'react-helmet-async' {}

// APIs externas
declare module '@paypal/checkout-server-sdk' {}
declare module '@cloudflare/workers-runtime-types' {}
declare module '@notionhq/client' {}
declare module 'axios' {}

// Módulos internos
declare module './lib/paypal' {
  export const paypalClient: any;
}

declare module './routes/auth' {
  export const authRouter: any;
}

declare module './routes/dashboard' {}
declare module './routes/consultation' {}
declare module './routes/payment' {}
declare module './routes/appointments' {}
declare module './routes' {}
declare module './supabaseClient' {}

// Configuración y utilidades
declare module '@cloudflare/kv-asset-handler' {
  export function getAssetFromKV(request: Request, options?: any): Promise<Response>;
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const content: string;
  export default content;
}

// Tipos globales
declare type User = {
  id: string;
  email?: string;
  nombre?: string;
  roles?: string[];
  token?: string;
};
