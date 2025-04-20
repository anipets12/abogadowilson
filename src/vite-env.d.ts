/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  readonly VITE_EMAIL_SERVICE_ID: string
  readonly VITE_EMAIL_TEMPLATE_ID: string
  readonly VITE_EMAIL_USER_ID: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
  readonly VITE_TURNSTILE_SITE_KEY: string
  readonly VITE_SITE_URL: string
  readonly VITE_CLOUDFLARE_ACCOUNT_ID: string
  readonly VITE_CLOUDFLARE_NAMESPACE_ID: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
