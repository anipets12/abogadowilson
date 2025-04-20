/* Aseguramos que React esté disponible para este componente */
import React, { useEffect, useState, useMemo } from 'react';
import Hero from '../Hero';
import Services from '../Services';
import Testimonials from '../Testimonials';
import JudicialNews from '../JudicialNews';
import Newsletter from '../Newsletter/Newsletter';
import ProcessSearch from '../ProcessSearch';
import SocialMediaIntegration from '../Social/SocialMediaIntegration';
import IntelligentChatbot from '../Chat/IntelligentChatbot';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Abogado Wilson Ipiales - Asesoría Legal Profesional</title>
        <meta name="description" content="Servicios legales profesionales por el Abogado Wilson Alexander Ipiales Guerrón. Especialista en derecho penal, civil, tránsito, comercial y aduanas." />
        <meta name="keywords" content="abogado, wilson ipiales, asesoría legal, derecho penal, derecho civil, derecho de tránsito, consulta legal, Ecuador" />
        <meta property="og:title" content="Abogado Wilson Ipiales - Asesoría Legal Profesional" />
        <meta property="og:description" content="Servicios legales profesionales por el Abogado Wilson Alexander Ipiales Guerrón. Especialista en derecho penal, civil, tránsito, comercial y aduanas." />
        <meta property="og:image" content="/assets/images/abogado-wilson-profile.jpg" />
        <meta property="og:url" content="https://abogadowilson.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
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
