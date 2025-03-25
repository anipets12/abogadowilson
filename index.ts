import { PrismaClient } from '@prisma/client'; // ...asegúrate de tener la dependencia instalada...
import { createClient } from '@supabase/supabase-js'; // ...asegúrate de tener la dependencia instalada...

// Instancias de conexiones (utiliza los bindings de Workers para pasar las variables adecuadas)
const prisma = new PrismaClient();
let supabase: ReturnType<typeof createClient>;

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    // Inicializa Supabase utilizando las variables del entorno pasadas por bindings
    if (!supabase) {
      supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    }
  
    const url = new URL(request.url);
    const { pathname } = url;
    const headers = {
      'Access-Control-Allow-Origin': env.CORS_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Manejo de OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
  
    try {
      // Endpoints CRUD para "items" (utilizando Prisma y PostgreSQL)
      if (pathname.startsWith('/api/items')) {
        if (request.method === 'GET') {
          // Obtener todos los items
          const items = await prisma.item.findMany();
          return new Response(JSON.stringify(items), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 });
        } else if (request.method === 'POST') {
          // Crear un nuevo item
          const data = await request.json();
          const newItem = await prisma.item.create({ data });
          return new Response(JSON.stringify(newItem), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 201 });
        } else if (request.method === 'PUT') {
          // Actualizar un item existente; se espera que el JSON incluya "id"
          const data = await request.json();
          const updatedItem = await prisma.item.update({
            where: { id: data.id },
            data,
          });
          return new Response(JSON.stringify(updatedItem), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 });
        } else if (request.method === 'DELETE') {
          // Borrar un item; se espera un objeto JSON con "id"
          const { id } = await request.json();
          await prisma.item.delete({ where: { id } });
          return new Response(JSON.stringify({ deleted: true }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 });
        }
      }
  
      // Ejemplo de endpoint adicional (integración Supabase)
      if (pathname.startsWith('/api/supabase')) {
        // ...existing code para integración Supabase...
        const { data, error } = await supabase.from('table_name').select('*');
        if (error) {
          throw error;
        }
        return new Response(JSON.stringify(data), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 });
      }
  
      // Se pueden agregar endpoints adicionales para Turso, KV o D1 según sea necesario
      // ...existing code...
  
      return new Response(JSON.stringify({ message: 'Not Found' }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 404 });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 });
    }
  }
};