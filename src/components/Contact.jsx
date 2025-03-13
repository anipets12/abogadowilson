import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactPage from './Contact/ContactPage';

export default function Contact() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirigir a la nueva página de contacto
    navigate('/contacto');
  }, [navigate]);
  
  // Este componente ahora solo sirve como redirección
  return <ContactPage />;
}