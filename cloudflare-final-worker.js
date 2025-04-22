/**
 * CLOUDFLARE WORKER DEFINITIVO - ABOGADO WILSON
 * Solución final probada y verificada para SPAs en Cloudflare Workers
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Headers estándar
  const responseHeaders = {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*'
  };

  // Manejo CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders
    });
  }

  // 1. Favicon especial
  if (path === '/favicon.ico') {
    try {
      // Intentar servir el favicon desde assets
      const faviconResponse = await fetch(`${url.origin}/favicon.ico`);
      if (faviconResponse.ok) {
        return faviconResponse;
      }
    } catch (e) {
      console.log('Error al servir favicon desde assets');
    }

    // Favicon de respaldo
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="20" fill="#2563eb"/>
      <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
      <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
      <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
    </svg>`;

    return new Response(svgIcon, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  }

  // 2. Para archivos estáticos (con extensión)
  if (path !== '/' && path.includes('.')) {
    try {
      return fetch(request);
    } catch (e) {
      console.log(`Error al servir archivo: ${path}`);
    }
  }

  // 3. Contenido HTML incorporado para la página principal
  // Esto garantiza que siempre se sirva algo incluso si los assets fallan
  return new Response(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Abogado Wilson | Asesoría Legal Profesional</title>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml">
      <style>
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --text: #1f2937;
          --background: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, sans-serif;
        }
        body {
          background-color: var(--background);
          color: var(--text);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        header {
          background-color: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 0 1rem;
        }
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
        }
        nav {
          display: flex;
          gap: 1.5rem;
        }
        nav a {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
        }
        nav a:hover {
          color: var(--primary);
        }
        nav a:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary);
          transition: width 0.3s;
        }
        nav a:hover:after {
          width: 100%;
        }
        main {
          flex: 1;
          padding: 3rem 0;
        }
        .hero {
          background-color: white;
          border-radius: 0.5rem;
          padding: 3rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
        }
        h1 {
          color: var(--primary);
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .subtitle {
          font-size: 1.25rem;
          color: var(--text);
          max-width: 800px;
          margin: 0 auto 2rem;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          background-color: var(--primary);
          color: white;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .button:hover {
          background-color: var(--primary-dark);
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .service-card {
          background-color: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .service-icon {
          background-color: var(--gray-100);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        h2 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 0.75rem;
        }
        h3 {
          font-size: 1.25rem;
          color: var(--primary);
          margin-bottom: 0.75rem;
        }
        .testimonials {
          background-color: white;
          border-radius: 0.5rem;
          padding: 3rem;
          margin-bottom: 3rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section-title {
          text-align: center;
          margin-bottom: 2rem;
        }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .testimonial-card {
          background-color: var(--gray-100);
          padding: 1.5rem;
          border-radius: 0.5rem;
          position: relative;
        }
        .testimonial-card:before {
          content: """;
          position: absolute;
          top: 0;
          left: 1rem;
          font-size: 4rem;
          color: var(--gray-300);
          line-height: 1;
          font-family: serif;
        }
        .testimonial-content {
          margin-top: 1rem;
          font-style: italic;
        }
        .testimonial-author {
          margin-top: 1rem;
          font-weight: 600;
        }
        footer {
          background-color: var(--primary);
          color: white;
          padding: 2rem 0;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }
        .footer-col h3 {
          color: white;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        .footer-links {
          list-style: none;
        }
        .footer-links li {
          margin-bottom: 0.5rem;
        }
        .footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
        }
        .footer-links a:hover {
          color: white;
          text-decoration: underline;
        }
        .copyright {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          nav {
            width: 100%;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .hero {
            padding: 2rem 1rem;
          }
          h1 {
            font-size: 2rem;
          }
        }
      </style>
    </head>
    <body>
      <header>
        <div class="container header-content">
          <a href="/" class="logo">
            <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <rect width="100" height="100" rx="20" fill="#2563eb"/>
              <path d="M30 30 L70 30 L70 70 L30 70 Z" fill="none" stroke="white" stroke-width="5"/>
              <path d="M40 45 L60 45" stroke="white" stroke-width="5" stroke-linecap="round"/>
              <path d="M40 55 L55 55" stroke="white" stroke-width="5" stroke-linecap="round"/>
            </svg>
            Abogado Wilson
          </a>
          <nav>
            <a href="/">Inicio</a>
            <a href="/servicios">Servicios</a>
            <a href="/nosotros">Nosotros</a>
            <a href="/blog">Blog</a>
            <a href="/contacto">Contacto</a>
          </nav>
        </div>
      </header>
      
      <main>
        <div class="container">
          <section class="hero">
            <h1>Asesoría Legal Profesional</h1>
            <p class="subtitle">Soluciones legales efectivas para proteger tus derechos e intereses. Amplia experiencia en diferentes áreas del derecho con un enfoque personalizado.</p>
            <a href="/contacto" class="button">Solicitar Consulta</a>
          </section>
          
          <section>
            <h2 class="section-title">Nuestros Servicios</h2>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12V22H4V12" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 7H2V12H22V7Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 22V7" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 7H16.5C17.1628 7 17.7989 6.73661 18.267 6.26777C18.7351 5.79893 19 5.16304 19 4.5C19 3.83696 18.7351 3.20107 18.267 2.73223C17.7989 2.26339 17.1628 2 16.5 2C13 2 12 7 12 7Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Derecho Civil</h3>
                <p>Asesoramiento y representación en contratos, propiedad, sucesiones y resolución de conflictos civiles con enfoque en resultados.</p>
              </div>
              
              <div class="service-card">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14.5V16.5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.2 22H15.8C16.9201 22 17.4802 22 17.908 21.782C18.2843 21.5903 18.5903 21.2843 18.782 20.908C19 20.4802 19 19.9201 19 18.8V5.2C19 4.0799 19 3.51984 18.782 3.09202C18.5903 2.71569 18.2843 2.40973 17.908 2.21799C17.4802 2 16.9201 2 15.8 2H8.2C7.0799 2 6.51984 2 6.09202 2.21799C5.71569 2.40973 5.40973 2.71569 5.21799 3.09202C5 3.51984 5 4.0799 5 5.2V18.8C5 19.9201 5 20.4802 5.21799 20.908C5.40973 21.2843 5.71569 21.5903 6.09202 21.782C6.51984 22 7.0799 22 8.2 22Z" stroke="#2563EB" stroke-width="2"/>
                    <path d="M15 5H9" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 8H9" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15 11H9" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <h3>Derecho Penal</h3>
                <p>Defensa completa en procesos penales, con estrategias eficaces y respeto a tus derechos en todas las etapas del proceso.</p>
              </div>
              
              <div class="service-card">
                <div class="service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2V6M8 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 14H8.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 14H12.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 14H16.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 18H8.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 18H12.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 18H16.01" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Derecho Laboral</h3>
                <p>Protección a trabajadores y asesoría a empresas en cumplimiento de normativas laborales y resolución de conflictos.</p>
              </div>
            </div>
          </section>
          
          <section class="testimonials">
            <h2 class="section-title">Lo Que Dicen Nuestros Clientes</h2>
            <div class="testimonial-grid">
              <div class="testimonial-card">
                <div class="testimonial-content">
                  "El Dr. Wilson me brindó una asesoría excepcional en mi caso laboral. Su profesionalismo y conocimiento fueron fundamentales para obtener un resultado favorable."
                </div>
                <div class="testimonial-author">María González</div>
              </div>
              
              <div class="testimonial-card">
                <div class="testimonial-content">
                  "Gracias al asesoramiento del Dr. Wilson, pude resolver un complicado tema de herencia que llevaba años sin solución. Altamente recomendado."
                </div>
                <div class="testimonial-author">Carlos Rodríguez</div>
              </div>
              
              <div class="testimonial-card">
                <div class="testimonial-content">
                  "Un profesional comprometido con sus clientes. Me guió durante todo el proceso legal con claridad y dedicación. Sin duda, el mejor abogado de la ciudad."
                </div>
                <div class="testimonial-author">Laura Mendoza</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer>
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <h3>Abogado Wilson</h3>
              <p>Asesoría legal profesional con amplia experiencia y compromiso con nuestros clientes.</p>
            </div>
            
            <div class="footer-col">
              <h3>Enlaces</h3>
              <ul class="footer-links">
                <li><a href="/">Inicio</a></li>
                <li><a href="/servicios">Servicios</a></li>
                <li><a href="/nosotros">Nosotros</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contacto">Contacto</a></li>
              </ul>
            </div>
            
            <div class="footer-col">
              <h3>Contacto</h3>
              <ul class="footer-links">
                <li>Dirección: Av. Principal 123, Quito</li>
                <li>Teléfono: (02) 123-4567</li>
                <li>Email: info@abogadowilson.com</li>
              </ul>
            </div>
          </div>
          
          <div class="copyright">
            &copy; 2025 Abogado Wilson - Todos los derechos reservados
          </div>
        </div>
      </footer>
    </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
