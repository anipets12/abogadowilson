# Rutas del Proyecto

## API Routes
- `/api/auth` - Autenticación y autorización
  - `POST /login` - Inicio de sesión
    - Request: `{ email: string, password: string }`
    - Response: `{ token: string, user: Object }`
  - `POST /register` - Registro de usuario
    - Request: `{ email: string, password: string, name: string }`
    - Response: `{ success: boolean, message: string }`
  - `OPTIONS` - Verificación CORS
  - `GET /verify` - Verificación de token JWT

- `/api/ebooks/*` - Gestión de ebooks
  - `GET /list` - Obtener lista de ebooks
  - `GET /:id` - Obtener ebook específico
  - `POST /create` - Crear nuevo ebook (admin)
  - `PUT /:id` - Actualizar ebook (admin)
  - `DELETE /:id` - Eliminar ebook (admin)

## Configuración Cloudflare Workers
- Nombre del Worker: `abogado-wilson-api`
- Rutas personalizadas:
  - `api.abogadowilson.com/*` -> `abogado-wilson-api`
  - `abogadowilson.com/*` -> `abogado-wilson-frontend`

## Dominios y Entornos
- Producción: https://abogadowilson.com
- API: https://api.abogadowilson.com
- Desarrollo: http://localhost:3000
- Staging: https://staging.abogadowilson.com

## Seguridad y Headers
- CORS Headers:
  ```js
  Access-Control-Allow-Origin: ['abogadowilson.com', 'api.abogadowilson.com']
  Access-Control-Allow-Methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  Access-Control-Allow-Headers: ['Content-Type', 'Authorization']
  ```
- Rate Limiting: 100 requests/minuto
- Cache-Control: `no-store`
- Security Headers:
  ```js
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  ```

## Manejo de Errores
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 429 - Too Many Requests
- 500 - Internal Server Error

## Configuración Git Requerida
- Configurar identidad de usuario:
  ```bash
  git config --global user.email "your.email@example.com"
  git config --global user.name "Your Name"
  ```
- Para configurar solo en este repositorio, omitir --global:
  ```bash
  git config user.email "your.email@example.com"
  git config user.name "Your Name"
  ```

## Notas de Despliegue
- Verificar variables de entorno en Cloudflare
- Configurar KV Namespaces para sesiones
- Habilitar API Tokens necesarios
- Configurar DNS y SSL/TLS
