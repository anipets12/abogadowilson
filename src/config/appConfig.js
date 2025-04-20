/**
 * Configuración global de la aplicación
 * 
 * Este archivo centraliza todas las configuraciones, API keys, enlaces sociales
 * y demás información importante para la aplicación.
 */

// Entorno de la aplicación
export const isProduction = typeof process !== 'undefined' ? process.env?.PROD : 
                           (typeof window !== 'undefined' ? window.__ENV__?.PROD : false);
export const isDevelopment = !isProduction;

// URLs base
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://abogado-wilson.anipets12.workers.dev';
};

// Información de contacto
export const contactInfo = {
  // Correos electrónicos
  emails: {
    primary: "alexip2@hotmail.com",
    secondary: "Wifirmalegal@gmail.com"
  },
  
  // Teléfonos
  phones: {
    primary: "+593988835269",
    whatsappApi: "593988835269" // Sin el + para la API de WhatsApp
  },
  
  // Dirección
  address: "Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador",
  
  // Horario
  businessHours: "Lunes a Viernes: 8:00 - 18:00"
};

// Redes sociales
export const socialMedia = {
  // Facebook
  facebook: {
    pagina: "https://www.facebook.com/share/1AF7jU97kh/",
    groups: {
      derechoEcuador: "https://www.facebook.com/groups/1409181976927303/?ref=share&mibextid=NSMWBT",
      abogadosEcuador: "https://www.facebook.com/groups/1046470634036664/?ref=share&mibextid=NSMWBT"
    }
  },
  
  // Twitter/X
  twitter: {
    profile: "https://x.com/Wilsonelm?t=e_4JumFg2kRM5Baa_pP2JA&s=09",
    username: "@wilsonelm"
  },
  
  // WhatsApp
  whatsapp: {
    comunidad: "https://chat.whatsapp.com/IcEzDg0dFay5xmzV8NeQpA",
    grupo: "https://chat.whatsapp.com/JI57y20YAsXAzvxpegahUd",
    api: `https://wa.me/593988835269`
  }
};

// Servicios externos y APIs
export const externalServices = {
  // n8n
  n8n: {
    baseUrl: "https://n8nom.onrender.com",
    apiKey: "eyJhbGciOiJIUzI1NilsInR5cCI6IkpXVCJ9.eyJzdWliOilwYTAyOTI1Yy0wYmQzLTQWZTQtYWU1MC1lMzE4YmFlYjAyMDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsa WMtYXBpliwiaWF0IjoxNzQ1MDcwMjQxfQ.qRIKTOe3b6cMnxaIcYaa0QjEzukpg UAp3zgJwR9b6Mw",
    webhooks: {
      test: "https://n8nom.onrender.com/webhook-test/1cfd2baa-f5ec-4bc4-a99d-dfb36793eabd",
      production: "https://n8nom.onrender.com/webhook/1cfd2baa-f5ec-4bc4-a99d-dfb36793eabd"
    }
  },
  
  // OpenRouter para IA
  openRouter: {
    apiKey: "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"
  },
  
  // Turso Database
  turso: {
    databaseUrl: "libsql://abogadowilson-abogadowilson.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJnaWQiOiJiOTJkODlhMi0wNWQ4LTQ0YjUtYWE4OS1iMTc5MzU1YzIyMmIiLCJpYXQiOjE3NDI3ODAxNzMsInJpZCI6IjAzNjkwMTA4LWEyOGQtNDk3ZC1iNzMyLTA5YzhiYWE4OTlhOSJ9.X2ZZbus9HbjQeGvnCRSx3y13U2MsriMu3dzx96eimj7yaNVKKgPWjCsnGDcSxgOoH5fENalLAhQsAjMNwOgkAg"
  },
  
  // Prisma
  prisma: {
    databaseUrl: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMTRhNDU5ZTgtNjYxOC00ZGNmLTk1MWItYzAxMjNhNDFkMGE3IiwidGVuYW50X2lkIjoiY2IxYzRhMjEwMGZjYzA3YjQ4ZmI3MWY5Mzc2ZGFiMzhkNmYxMDBmYTY0NmVhYTY4NmVhYjRmYjQwOTgwYjFjOSIsImludGVybmFsX3NlY3JldCI6IjllOTVjNDRjLWEzNzItNDAwYi05ODY5LTk3OTkzMjBmYjYxMSJ9.RAhNmhcUfJpMRWb296WK1bZL6oXTg3Rt1kXfeSs_SyE",
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMmM1Y2UzYjAtMDM0OC00MmU0LWE4NTUtM2FiZjQwOWI5OWQ5IiwidGVuYW50X2lkIjoiY2IxYzRhMjEwMGZjYzA3YjQ4ZmI3MWY5Mzc2ZGFiMzhkNmYxMDBmYTY0NmVhYTY4NmVhYjRmYjQwOTgwYjFjOSIsImludGVybmFsX3NlY3JldCI6IjllOTVjNDRjLWEzNzItNDAwYi05ODY5LTk3OTkzMjBmYjYxMSJ9.tX-fqerLHhznPGz4DbrXoVW08tUpTADWPT8EFMcCm6M"
  }
};

// Configuración de Cloudflare
export const cloudflareConfig = {
  accountId: "f21b24d86935a055c03d21f7fffd1514",
  apiToken: "hVCek95JiWpq9zRqRgN1LVp176mWH88FOE6vHIvL",
  kvNamespaceId: "d977cf29acc749ba8aeabbcb2d395cb3",
  d1DatabaseId: "f00d15a2-6069-4f19-a8eb-6f2217af2176",
  turnstile: {
    siteKey: "0x4AAAAAABDkl--Sw4n_bwmU",
    secretKey: "0x4AAAAAABDkl-wPYTurHAniMDA2wqOJ__k"
  }
};

// Configuración de Supabase
export const supabaseConfig = {
  url: typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : 
      (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_URL : 
      'https://phzldiaohelbyobhjrnc.supabase.co'),
  key: typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_KEY : 
      (typeof window !== 'undefined' ? window.__ENV__?.VITE_SUPABASE_KEY : 
      'sbp_db5898ecc094d37ec87562399efe3833e63ab20f'),
  headers: {
    'X-Client-Info': 'abogado-wilson'
  }
};

// Configuración de correo electrónico
export const emailConfig = {
  serviceId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_SERVICE_ID : 
            (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_SERVICE_ID : 'default_service'),
  templateId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_TEMPLATE_ID : 
             (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_TEMPLATE_ID : 'default_template'),
  userId: typeof process !== 'undefined' ? process.env?.VITE_EMAIL_USER_ID : 
         (typeof window !== 'undefined' ? window.__ENV__?.VITE_EMAIL_USER_ID : 'default_user')
};

// Configuración de reCAPTCHA
export const recaptchaConfig = {
  siteKey: typeof process !== 'undefined' ? process.env?.VITE_RECAPTCHA_SITE_KEY : 
          (typeof window !== 'undefined' ? window.__ENV__?.VITE_RECAPTCHA_SITE_KEY : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'), // Clave de prueba
};

// Configuración de Turnstile
export const turnstileConfig = {
  siteKey: typeof process !== 'undefined' ? process.env?.VITE_TURNSTILE_SITE_KEY : 
          (typeof window !== 'undefined' ? window.__ENV__?.VITE_TURNSTILE_SITE_KEY : '0x4AAAAAAABY3h5dF4SWQyP'),
};

// URLs del API
export const apiUrls = {
  base: typeof process !== 'undefined' ? process.env?.VITE_API_URL : 
       (typeof window !== 'undefined' ? window.__ENV__?.VITE_API_URL : '/api'),
  blog: '/api/blog',
  contact: '/api/contact',
  newsletter: '/api/newsletter',
  courses: '/api/courses',
  ebooks: '/api/ebooks',
  consultation: '/api/consultation',
  checkout: '/api/checkout',
};

// Configuración JWT
export const jwtConfig = {
  secret: "abogadowilsonsecretkeyforsecuritytokens2025",
  expiresIn: "7d" // 7 días
};

// Exportar configuración completa
export default {
  isProduction,
  isDevelopment,
  getBaseUrl,
  contactInfo,
  socialMedia,
  externalServices,
  cloudflareConfig,
  supabaseConfig,
  emailConfig,
  recaptchaConfig,
  turnstileConfig,
  apiUrls,
  jwtConfig
};
