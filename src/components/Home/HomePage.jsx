/* 
 * HomePage.jsx - Componente principal de la página de inicio
 * Versión optimizada para entornos de producción en Cloudflare Workers
 */
import React, { useEffect, useState, useMemo } from 'react';

// Importar componentes principales (importaciones estáticas para evitar errores de carga dinámica)
import Hero from '../Hero';
import Services from '../Services';
import Testimonials from '../Testimonials';
import JudicialNews from '../JudicialNews';
import Newsletter from '../Newsletter/Newsletter';
import ProcessSearch from '../ProcessSearch';
import SocialMediaIntegration from '../Social/SocialMediaIntegration';
import IntelligentChatbot from '../Chat/IntelligentChatbot';

// Usar nuestro HelmetWrapper seguro en lugar de Helmet directamente
import HelmetWrapper from '../Common/HelmetWrapper';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  // Efecto para mostrar un mensaje de bienvenida
  useEffect(() => {
    // Mostrar mensaje de bienvenida después de 2 segundos (para darle tiempo a la página de cargarse)
    const welcomeTimer = setTimeout(() => {
      toast.success('¡Bienvenido al sitio oficial del Abogado Wilson Ipiales!', {
        duration: 5000,
        position: 'top-center',
      });
    }, 2000);
    
    return () => clearTimeout(welcomeTimer);
  }, []);
  
  return (
    <>
      <HelmetWrapper
        title="Abogado Wilson Ipiales - Asesoría Legal Profesional"
        description="Servicios legales profesionales por el Abogado Wilson Alexander Ipiales Guerrón. Especialista en derecho penal, civil, tránsito, comercial y aduanas."
        image="/assets/images/abogado-wilson-profile.jpg"
        url="https://abogado-wilson.anipets12.workers.dev"
      >
        <meta name="keywords" content="abogado, wilson ipiales, asesoría legal, derecho penal, derecho civil, derecho de tránsito, consulta legal, Ecuador" />
      </HelmetWrapper>
      
      {/* Barra flotante de redes sociales */}
      <SocialMediaIntegration variant="floating" />
      
      {/* Componentes principales */}
      <Hero />
      <Services />
      <Testimonials />
      <ProcessSearch />
      <JudicialNews />
      
      {/* Integración social completa */}
      <div className="container mx-auto px-4 py-8">
        <SocialMediaIntegration />
      </div>
      
      <Newsletter />
      
      {/* Chatbot inteligente */}
      <IntelligentChatbot />
    </>
  );
};

export default HomePage;
