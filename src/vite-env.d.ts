/// <reference types="vite/client" />

// Ampliando la interfaz ImportMetaEnv para incluir todas las variables de entorno que usamos
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
  readonly VITE_EMAIL_SERVICE_ID: string;
  readonly VITE_EMAIL_TEMPLATE_ID: string;
  readonly VITE_EMAIL_USER_ID: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_TURNSTILE_SITE_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
  readonly VITE_GOOGLE_GENERATIVE_API_KEY: string;
  readonly VITE_GOOGLE_API_KEY_ALTERNATIVE: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_CLIENT_SECRET: string;
  readonly VITE_GOOGLE_SERVICE_ACCOUNT: string;
}

// Ampliando la interfaz ImportMeta para asegurar el tipado correcto
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Definir la estructura de window.__ENV__ para compatibilidad con Cloudflare Workers
interface Window {
  __ENV__?: {
    PROD: boolean;
    DEV: boolean;
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_KEY: string;
    VITE_EMAIL_SERVICE_ID: string;
    VITE_EMAIL_TEMPLATE_ID: string;
    VITE_EMAIL_USER_ID: string;
    VITE_RECAPTCHA_SITE_KEY: string;
    VITE_TURNSTILE_SITE_KEY: string;
    VITE_API_URL: string;
    VITE_GOOGLE_ANALYTICS_ID: string;
    VITE_GOOGLE_GENERATIVE_API_KEY: string;
    VITE_GOOGLE_API_KEY_ALTERNATIVE: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_GOOGLE_CLIENT_SECRET: string;
    VITE_GOOGLE_SERVICE_ACCOUNT: string;
  };
}
