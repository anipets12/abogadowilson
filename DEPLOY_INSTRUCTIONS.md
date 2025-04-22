# Instrucciones para desplegar Abogado Wilson en Cloudflare Workers

Este archivo contiene los pasos para desplegar correctamente la aplicación en Cloudflare Workers.

## Prerrequisitos
- Node.js y npm instalados
- Cuenta en Cloudflare con Workers habilitado

## Pasos para desplegar

1. Instalar Wrangler (CLI de Cloudflare Workers):
   `ash
   npm install -g wrangler
   `

2. Autenticarse en Cloudflare:
   `ash
   wrangler login
   `

3. Desplegar la aplicación:
   `ash
   wrangler deploy
   `

## Solución de problemas

Si encuentras el error 1042 o problemas con favicon.ico:
- Verifica que la carpeta dist exista y contenga los archivos necesarios
- Asegúrate de que _routes.json esté copiado a la carpeta dist
- Comprueba que error-free-worker.js esté configurado correctamente

## Variables de entorno importantes

- SUPABASE_URL: https://phzldiaohelbyobhjrnc.supabase.co
- SUPABASE_KEY: sbp_db5898ecc094d37ec87562399efe3833e63ab20f
- CLOUDFLARE_ACCOUNT_ID: f21b24d86935a055c03d21f7fffd1514

## Estructura de la aplicación

- error-free-worker.js: Worker principal que maneja todas las solicitudes
- dist/: Directorio que contiene los archivos estáticos de la aplicación
- wrangler.toml: Configuración del worker y variables de entorno
