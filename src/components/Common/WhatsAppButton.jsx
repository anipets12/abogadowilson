import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Mensaje predeterminado para WhatsApp
  const whatsappMessage = "Hola Abg. Wilson, me gustaría consultar sobre sus servicios legales.";
  const phoneNumber = "593988835269"; // Número de teléfono del abogado (Ecuador)
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
    >
      <FaWhatsapp className="text-white text-3xl" />
      <span className="sr-only">Contáctenos por WhatsApp</span>
    </motion.a>
  );
};

export default WhatsAppButton;
