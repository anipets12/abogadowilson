import { Services } from '../types'

export async function handleDocumentRoutes(request: Request, services: Services): Promise<Response> {
  const { prisma, db } = services
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/documents', '')
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  try {
    // GET /api/documents - Listar todos los documentos
    if (request.method === 'GET' && path === '/') {
      const documents = await prisma.document.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
      })

      return new Response(JSON.stringify({
        documentos: documents,
        total: documents.length,
        mensaje: 'Documentos recuperados correctamente'
      }), {
        status: 200,
        headers: corsHeaders
      })
    }

    // POST /api/documents - Crear nuevo documento
    if (request.method === 'POST' && path === '/') {
      const body = await request.json() as {
        title: string;
        content: string;
        type: string;
        userId: string;
      }
      const document = await prisma.document.create({
        data: {
          title: body.title,
          content: body.content,
          type: body.type,
          userId: body.userId,
        },
      })

      // También almacenar en D1 para acceso rápido
      try {
        await db.prepare(
          `INSERT INTO documents (id, title, content, type, user_id) VALUES (?, ?, ?, ?, ?)`
        ).bind(document.id, document.title, document.content, document.type, document.userId).run()
      } catch (dbError) {
        console.error('Error al guardar en D1:', dbError)
        // Continuar incluso si D1 falla, ya que Prisma ya guardó el documento
      }

      return new Response(JSON.stringify({
        documento: document,
        mensaje: 'Documento creado correctamente'
      }), {
        status: 201,
        headers: corsHeaders
      })
    }

    // GET /api/documents/:id - Obtener un documento
    if (request.method === 'GET' && path.match(/^\/[0-9]+$/)) {
      const id = parseInt(path.split('/')[1])
      const document = await prisma.document.findUnique({
        where: { id },
      })

      if (!document) {
        return new Response(JSON.stringify({
          error: 'Documento no encontrado'
        }), { 
          status: 404,
          headers: corsHeaders
        })
      }

      return new Response(JSON.stringify({
        documento: document
      }), {
        status: 200,
        headers: corsHeaders
      })
    }

    // PUT /api/documents/:id - Actualizar documento
    if (request.method === 'PUT' && path.match(/^\/[0-9]+$/)) {
      const id = parseInt(path.split('/')[1])
      const body = await request.json() as {
        title: string;
        content: string;
        type: string;
      }
      
      const document = await prisma.document.update({
        where: { id },
        data: {
          title: body.title,
          content: body.content,
          type: body.type,
        },
      })

      // Actualizar también en D1
      try {
        await db.prepare(
          `UPDATE documents SET title = ?, content = ?, type = ? WHERE id = ?`
        ).bind(document.title, document.content, document.type, id).run()
      } catch (dbError) {
        console.error('Error al actualizar en D1:', dbError)
        // Continuar incluso si D1 falla
      }

      return new Response(JSON.stringify({
        documento: document,
        mensaje: 'Documento actualizado correctamente'
      }), {
        status: 200,
        headers: corsHeaders
      })
    }

    // DELETE /api/documents/:id - Eliminar documento
    if (request.method === 'DELETE' && path.match(/^\/[0-9]+$/)) {
      const id = parseInt(path.split('/')[1])
      
      await prisma.document.delete({
        where: { id },
      })

      // Eliminar también de D1
      try {
        await db.prepare('DELETE FROM documents WHERE id = ?').bind(id).run()
      } catch (dbError) {
        console.error('Error al eliminar en D1:', dbError)
        // Continuar incluso si D1 falla
      }

      return new Response(JSON.stringify({
        mensaje: 'Documento eliminado correctamente'
      }), {
        status: 200,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({
      error: 'Método no permitido'
    }), { 
      status: 405,
      headers: corsHeaders
    })
  } catch (error) {
    console.error('Error en documentos:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Operación de documento fallida',
      }),
      {
        status: 400,
        headers: corsHeaders
      }
    )
  }
}
