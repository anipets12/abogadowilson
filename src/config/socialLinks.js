/**
 * socialLinks.js - Configuración centralizada de enlaces y claves para redes sociales
 * 
 * Este archivo contiene todas las URLs y configuraciones de redes sociales
 * para mantener consistencia en toda la aplicación.
 */

// Enlaces a redes sociales
export const SOCIAL_LINKS = {
  // Facebook
  facebook: {
    page: "https://www.facebook.com/share/1AF7jU97kh/",
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
    phone: "+59398835269",
    api: "https://wa.me/59398835269",
    groups: {
      comunidad: "https://chat.whatsapp.com/IcEzDg0dFay5xmzV8NeQpA",
      grupo: "https://chat.whatsapp.com/JI57y20YAsXAzvxpegahUd"
    }
  },
  
  // Correos electrónicos
  email: {
    firma: "Wifirmalegal@gmail.com",
    personal: "alexip2@hotmail.com"
  }
};

// Configuraciones de APIs externas
export const API_KEYS = {
  // n8n Automation
  n8n: {
    baseUrl: "https://n8nom.onrender.com",
    apiKey: "eyJhbGciOiJIUzI1NilsInR5cCI6IkpXVCJ9.eyJzdWliOilwYTAyOTI1Yy0wYmQzLTQWZTQtYWU1MC1lMzE4YmFlYjAyMDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsa WMtYXBpliwiaWF0IjoxNzQ1MDcwMjQxfQ.qRIKTOe3b6cMnxaIcYaa0QjEzukpg UAp3zgJwR9b6Mw",
    webhooks: {
      test: "https://n8nom.onrender.com/webhook-test/1cfd2baa-f5ec-4bc4-a99d-dfb36793eabd",
      production: "https://n8nom.onrender.com/webhook/1cfd2baa-f5ec-4bc4-a99d-dfb36793eabd"
    }
  },
  
  // OpenRouter AI
  openrouter: {
    key: "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"
  },
  
  // Cloudflare
  cloudflare: {
    accountId: "f21b24d86935a055c03d21f7fffd1514",
    apiToken: "hVCek95JiWpq9zRqRgN1LVp176mWH88FOE6vHIvL",
    kvNamespaceId: "d977cf29acc749ba8aeabbcb2d395cb3",
    d1DatabaseId: "f00d15a2-6069-4f19-a8eb-6f2217af2176",
    workerToken: "L8-HPOIhILSiSCWvpf-YAx3uy6AkQ5XYJ23om8c5",
    workerAiToken: "-ZnUO_608QrrL-cMDH1aX8D_QV49NfgkQlgwCbSL",
    accessApi: "d46a0864e1ab44f88866fc60e7823c10.access",
    accessSecret: "9711127589ad17cbe3aa4ca88202fa7ae58aef7af5e70ecdb42d99289383630a",
    integrationToken: "225a75a7-5ce1-4dd0-b5e4-8ee8cf03068d-0.0.2-integration-token",
    balancingToken: "qTLOQB4vwKB2p5oP3LTM8YwrcVGPaVjq8uMpiXBq",
    registrosToken: "p_Xa1BF3_AoaEttuo6GNYUqhcA6KW_KMiijo9Fgl",
    turnstile: {
      siteKey: "0x4AAAAAABDkl--Sw4n_bwmU",
      secretKey: "0x4AAAAAABDkl-wPYTurHAniMDA2wqOJ__k"
    }
  },
  
  // Supabase
  supabase: {
    url: "https://phzldiaohelbyobhjrnc.supabase.co",
    key: "sbp_db5898ecc094d37ec87562399efe3833e63ab20f",
    orgId: "d88ad960-5b90-47d9-a228-4a84269229d8",
    actorId: "232b2e74-3c38-426f-890c-fb9844bebbe2",
    organizations: {
      main: "phzldiaohelbyobhjrnc",
      other: "pedbyeekyumrocgbozzp"
    }
  },
  
  // Prisma
  prisma: {
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMmM1Y2UzYjAtMDM0OC00MmU0LWE4NTUtM2FiZjQwOWI5OWQ5IiwidGVuYW50X2lkIjoiY2IxYzRhMjEwMGZjYzA3YjQ4ZmI3MWY5Mzc2ZGFiMzhkNmYxMDBmYTY0NmVhYTY4NmVhYjRmYjQwOTgwYjFjOSIsImludGVybmFsX3NlY3JldCI6IjllOTVjNDRjLWEzNzItNDAwYi05ODY5LTk3OTkzMjBmYjYxMSJ9.tX-fqerLHhznPGz4DbrXoVW08tUpTADWPT8EFMcCm6M",
    databaseUrl: "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMTRhNDU5ZTgtNjYxOC00ZGNmLTk1MWItYzAxMjNhNDFkMGE3IiwidGVuYW50X2lkIjoiY2IxYzRhMjEwMGZjYzA3YjQ4ZmI3MWY5Mzc2ZGFiMzhkNmYxMDBmYTY0NmVhYTY4NmVhYjRmYjQwOTgwYjFjOSIsImludGVybmFsX3NlY3JldCI6IjllOTVjNDRjLWEzNzItNDAwYi05ODY5LTk3OTkzMjBmYjYxMSJ9.RAhNmhcUfJpMRWb296WK1bZL6oXTg3Rt1kXfeSs_SyE"
  },
  
  // Turso
  turso: {
    databaseUrl: "libsql://abogadowilson-abogadowilson.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJnaWQiOiJiOTJkODlhMi0wNWQ4LTQ0YjUtYWE4OS1iMTc5MzU1YzIyMmIiLCJpYXQiOjE3NDI3ODAxNzMsInJpZCI6IjAzNjkwMTA4LWEyOGQtNDk3ZC1iNzMyLTA5YzhiYWE4OTlhOSJ9.X2ZZbus9HbjQeGvnCRSx3y13U2MsriMu3dzx96eimj7yaNVKKgPWjCsnGDcSxgOoH5fENalLAhQsAjMNwOgkAg"
  },
  
  // Notion
  notion: {
    apiKey: "ntn_R407761822221KGTOQZ5t9GAeWBScapIokr22BNXyS0gr3",
    databaseId: "your_notion_database_id_here"
  }
};

// Configuración para JWT
export const JWT_CONFIG = {
  secret: "abogadowilsonsecretkeyforsecuritytokens2025",
  expiresIn: "7d"
};

// Exportar todos los valores por defecto
export default {
  links: SOCIAL_LINKS,
  apis: API_KEYS,
  jwt: JWT_CONFIG
};
