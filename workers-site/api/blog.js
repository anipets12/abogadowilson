// API endpoint para gestionar entradas de blog
import { corsHeaders } from '../cors-headers';

/**
 * Maneja solicitudes para el blog
 */
export async function handleBlogRequests(request) {
  // Manejar preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  }

  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/blog', '');
    
    // Para solicitudes de lista de blogs
    if (path === '' || path === '/') {
      const mockPosts = [
        {
          id: 1,
          title: 'Derecho de Tránsito en Ecuador: Lo que debe saber',
          slug: 'derecho-transito-ecuador',
          excerpt: 'Conozca sus derechos y responsabilidades al volante según las leyes ecuatorianas.',
          category: 'Tránsito',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-18',
          imageUrl: 'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhZmZpYyUyMGxhd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 2,
          title: 'Reforma al Código Penal y su impacto en los procesos judiciales',
          slug: 'reforma-codigo-penal-impacto',
          excerpt: 'Análisis de las recientes reformas al COIP y cómo afectan a los ciudadanos ecuatorianos.',
          category: 'Penal',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-15',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNyaW1pbmFsJTIwbGF3fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: 3,
          title: 'Derechos del consumidor: Cómo reclamar por productos defectuosos',
          slug: 'derechos-consumidor-productos-defectuosos',
          excerpt: 'Guía legal sobre los procedimientos para reclamar por productos y servicios defectuosos.',
          category: 'Civil',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-10',
          imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3VtZXIlMjByaWdodHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60'
        }
      ];
      
      return new Response(JSON.stringify({
        data: mockPosts,
        status: 'success'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Para solicitudes de entradas específicas
    if (path.startsWith('/post/')) {
      const slug = path.replace('/post/', '');
      
      // Base de datos simulada de posts de blog
      const postDatabase = {
        'derecho-transito-ecuador': {
          id: 1,
          title: 'Derecho de Tránsito en Ecuador: Lo que debe saber',
          slug: 'derecho-transito-ecuador',
          content: `
# Derecho de Tránsito en Ecuador: Lo que debe saber

Ecuador, como muchos países, tiene un conjunto específico de leyes y regulaciones que gobiernan el tránsito y la seguridad vial. Conocer estas leyes no solo es importante para evitar multas y sanciones, sino también para garantizar la seguridad de todos los usuarios de las vías.

## Ley Orgánica de Transporte Terrestre, Tránsito y Seguridad Vial

La Ley Orgánica de Transporte Terrestre, Tránsito y Seguridad Vial (LOTTTSV) es el principal marco legal que regula el tránsito en Ecuador. Esta ley establece:

- Normas generales de circulación
- Derechos y obligaciones de los conductores y peatones
- Sanciones por infracciones de tránsito
- Procedimientos para la emisión de licencias y matriculaciones

### Tipos de Infracciones de Tránsito

Las infracciones de tránsito en Ecuador se clasifican en:

1. **Leves**: Como estacionarse en lugares no permitidos o no usar el cinturón de seguridad.
2. **Graves**: Como conducir sin licencia o exceder los límites de velocidad.
3. **Muy graves**: Como conducir bajo la influencia del alcohol o drogas.

### ¿Qué hacer si recibe una multa de tránsito?

Si recibe una multa de tránsito en Ecuador, tiene varias opciones:

- Pagar la multa dentro del plazo establecido
- Impugnar la multa si considera que fue injustamente aplicada

### Procedimiento para impugnar una multa

Para impugnar una multa de tránsito, debe seguir estos pasos:

1. Presentar una solicitud de impugnación ante el juez de tránsito competente
2. Adjuntar pruebas que respalden su impugnación
3. Asistir a la audiencia programada
4. Recibir la resolución del juez

### Conclusión

El conocimiento y respeto de las leyes de tránsito es fundamental para garantizar la seguridad vial. Si tiene preguntas específicas sobre un caso de tránsito, le recomendamos consultar con un abogado especializado.

Para más información o asesoría legal personalizada, no dude en contactar al Abg. Wilson Ipiales.
`,
          category: 'Tránsito',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-18',
          imageUrl: 'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhZmZpYyUyMGxhd3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80'
        },
        'reforma-codigo-penal-impacto': {
          id: 2,
          title: 'Reforma al Código Penal y su impacto en los procesos judiciales',
          slug: 'reforma-codigo-penal-impacto',
          content: `
# Reforma al Código Penal y su impacto en los procesos judiciales

Las recientes reformas al Código Orgánico Integral Penal (COIP) de Ecuador han introducido cambios significativos en el sistema judicial ecuatoriano. Este artículo analiza estas reformas y su impacto en los procesos judiciales.

## Principales cambios en el COIP

1. **Procedimientos más ágiles**: Se han simplificado algunos procedimientos para reducir la carga procesal y agilizar los juicios.
2. **Nuevos tipos penales**: Se han incorporado nuevos delitos, como los relacionados con la ciberseguridad.
3. **Modificaciones en las penas**: Algunos delitos han visto modificadas sus penas, generalmente aumentándolas.
4. **Mayor protección a grupos vulnerables**: Se han reforzado las protecciones para mujeres, niños y otros grupos vulnerables.

## Impacto en los procesos judiciales

### Reducción de tiempos procesales

Uno de los objetivos principales de las reformas ha sido reducir los tiempos de los procesos judiciales. Se han establecido plazos más cortos para ciertas etapas procesales y se han simplificado algunos procedimientos.

### Mayor uso de medios tecnológicos

Las reformas también han impulsado el uso de tecnología en los procesos judiciales, permitiendo audiencias virtuales y la presentación de documentos electrónicos.

### Desafíos de implementación

A pesar de las mejoras, la implementación de estas reformas ha enfrentado varios desafíos:

- Falta de recursos en el sistema judicial
- Resistencia al cambio por parte de algunos operadores de justicia
- Necesidad de capacitación para jueces, fiscales y abogados

## Conclusión

Las reformas al COIP representan un esfuerzo por modernizar el sistema judicial ecuatoriano y hacerlo más eficiente. Sin embargo, su éxito dependerá de una adecuada implementación y del compromiso de todos los actores del sistema de justicia.

Para más información o asesoría legal personalizada sobre cómo estas reformas pueden afectar su caso, no dude en contactar al Abg. Wilson Ipiales.
`,
          category: 'Penal',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-15',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNyaW1pbmFsJTIwbGF3fGVufDB8fDB8fHww&auto=format&fit=crop&w=1200&q=80'
        },
        'derechos-consumidor-productos-defectuosos': {
          id: 3,
          title: 'Derechos del consumidor: Cómo reclamar por productos defectuosos',
          slug: 'derechos-consumidor-productos-defectuosos',
          content: `
# Derechos del consumidor: Cómo reclamar por productos defectuosos

En Ecuador, los consumidores están protegidos por la Ley Orgánica de Defensa del Consumidor, que establece los derechos y mecanismos de protección para los consumidores frente a productos y servicios defectuosos.

## Derechos básicos del consumidor

Todo consumidor en Ecuador tiene derecho a:

1. **Productos de calidad**: Recibir bienes y servicios de óptima calidad.
2. **Información adecuada**: Obtener información veraz, clara y completa sobre los productos o servicios.
3. **Reparación e indemnización**: Recibir reparación o indemnización por daños y perjuicios causados por deficiencias en los productos o servicios.
4. **Protección contra publicidad engañosa**: No ser engañado por publicidad falsa o engañosa.

## Pasos para reclamar por un producto defectuoso

### 1. Contactar al proveedor

El primer paso es contactar directamente al proveedor del producto o servicio defectuoso. Presente su reclamo de manera formal, idealmente por escrito, conservando una copia del mismo.

### 2. Presentar una queja formal

Si el proveedor no resuelve su reclamo, puede presentar una queja formal ante:

- **Defensoría del Pueblo**: Esta institución puede mediar entre usted y el proveedor.
- **Dirección de Defensa del Consumidor**: Dependencia del Ministerio de Industrias.

### 3. Iniciar acciones legales

Si las instancias anteriores no resuelven su caso, puede iniciar acciones legales ante:

- **Juzgados de Contravenciones**: Para casos menores.
- **Juzgados de lo Civil**: Para casos de mayor cuantía.

## Documentación necesaria

Para cualquier reclamo, es importante contar con:

- Factura o comprobante de compra
- Garantía del producto (si existe)
- Evidencia del defecto (fotos, videos, etc.)
- Registro de comunicaciones previas con el proveedor

## Conclusión

Los consumidores en Ecuador cuentan con un marco legal que protege sus derechos. Conocer estos derechos y los mecanismos para hacerlos valer es fundamental para enfrentar situaciones de productos o servicios defectuosos.

Para más información o asesoría legal personalizada sobre cómo proceder en un caso específico, no dude en contactar al Abg. Wilson Ipiales.
`,
          category: 'Civil',
          author: 'Abg. Wilson Ipiales',
          date: '2025-04-10',
          imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3VtZXIlMjByaWdodHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1200&q=80'
        }
      };
      
      // Buscar el post por su slug
      const post = postDatabase[slug];
      
      if (post) {
        return new Response(JSON.stringify({
          data: post,
          status: 'success'
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } else {
        return new Response(JSON.stringify({
          message: 'Entrada de blog no encontrada',
          status: 'error'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
    }
    
    // Para cualquier otra ruta de blog no reconocida
    return new Response(JSON.stringify({
      message: 'Ruta de blog no válida',
      status: 'error'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    console.error('Error al gestionar solicitud de blog:', error);
    
    return new Response(JSON.stringify({
      message: 'Error al procesar la solicitud',
      status: 'error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
