export async function onRequest(context) {
  // Extraer la ruta solicitada
  const { request, params } = context;
  const { path } = params;
  const url = new URL(request.url);
  
  // Determinar qué recurso se está solicitando
  let resourcePath;
  if (path.length === 0 || path[0] === 'articles') {
    resourcePath = '/api/blog/articles.json';
  } else if (path[0] === 'categories') {
    resourcePath = '/api/blog/categories.json';
  } else if (path[0] === 'articles' && path.length > 1) {
    // Solicitud de artículo específico por ID
    resourcePath = '/api/blog/articles.json';
    const articleId = parseInt(path[1]);
    
    // Cargar todos los artículos
    const response = await fetch(new URL(resourcePath, url.origin));
    const articles = await response.json();
    
    // Encontrar el artículo específico
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
      return new Response(JSON.stringify({ error: 'Artículo no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    return new Response(JSON.stringify(article), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Recurso no encontrado' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
  
  // Para solicitudes de todos los artículos o categorías
  const response = await fetch(new URL(resourcePath, url.origin));
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
