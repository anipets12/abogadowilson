# Abg. Wilson Alexander Ipiales Guerron

Sitio web profesional para servicios legales en Ibarra, Ecuador.

## Información de Contacto

- **Dirección:** Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador
- **Email:** alexip2@hotmail.com
- **Teléfono:** +593 988835269

## Áreas de Especialización

- Derecho Penal
- Derecho de Tránsito
- Derecho Civil
- Derecho Comercial
- Derecho Aduanero

## Tecnologías Utilizadas

- React
- Vite
- TailwindCSS
- Cloudflare Workers
- Supabase (Autenticación)
- Prisma (Base de datos)
- Cloudflare D1 (Base de datos en el edge)
- Cloudflare KV (Almacenamiento de activos)

## Instrucciones de Implementación

Este proyecto está diseñado para ser implementado en Cloudflare Workers y Pages. Siga los siguientes pasos para implementar el sitio:

### Requisitos previos

1. Instalar [Node.js](https://nodejs.org/) (versión 18 o superior)
2. Instalar [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
3. Tener una cuenta en [Cloudflare](https://dash.cloudflare.com/sign-up)

### Implementación del frontend (Cloudflare Pages)

1. Clone este repositorio: `git clone https://github.com/tu-usuario/abogado-wilson-website.git`
2. Navegue al directorio del proyecto: `cd abogado-wilson-website`
3. Instale las dependencias: `npm install`
4. Compile el frontend: `npm run build`
5. Despliegue en Cloudflare Pages: `wrangler pages deploy dist`

### Implementación del backend (Cloudflare Workers)

1. Configure las variables de entorno en `.env` con los valores correspondientes (ver `env.example`)
2. Implemente el Worker en Cloudflare:
   ```sh
   npm run deploy:worker
   ```
   
3. Verifique que el Worker esté funcionando correctamente visitando la URL proporcionada por Wrangler.

### Configuración de la base de datos D1

1. Cree una base de datos D1 en Cloudflare Dashboard o use el comando:
   ```sh
   wrangler d1 create abogado-wilson-db
   ```

2. Ejecute el script SQL para crear las tablas:
   ```sh
   wrangler d1 execute abogado-wilson-db --file=./schema.sql
   ```

### Configuración de Supabase

1. Configure su proyecto Supabase siguiendo las instrucciones en [Supabase Docs](https://supabase.com/docs)
2. Actualice las variables de entorno `SUPABASE_URL` y `SUPABASE_KEY` en su archivo `.env`

### Estructura del proyecto

- `/src`: Código fuente
  - `/routes`: Controladores para las rutas de la API
  - `/worker.ts`: Punto de entrada del Cloudflare Worker
  - `/shims.ts`: Implementaciones para ejecutar sin dependencias externas
- `/public`: Archivos estáticos
- `/prisma`: Esquema de la base de datos
- `/schema.sql`: Esquema de la base de datos D1

## Documentación de API

La API REST está disponible en el endpoint `/api`:

- **Autenticación**:
  - POST `/api/auth/login` - Iniciar sesión
  - POST `/api/auth/register` - Registrar usuario
  - GET `/api/auth/session` - Verificar sesión actual

- **Documentos**:
  - GET `/api/documents` - Listar documentos
  - POST `/api/documents` - Crear documento
  - GET `/api/documents/:id` - Obtener documento
  - PUT `/api/documents/:id` - Actualizar documento
  - DELETE `/api/documents/:id` - Eliminar documento

## Licencia

Todos los derechos reservados © 2025 Abg. Wilson Alexander Ipiales Guerron
