import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const WhatsAppFloatingButton = () => {
  // Mensaje predeterminado para WhatsApp
  const whatsappMessage = "Hola Abg. Wilson, me gustaría consultar sobre sus servicios legales.";
  const phoneNumber = "593988835269"; // Número de teléfono del abogado (Ecuador)
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  
  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-4">
      {/* Botón de WhatsApp */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300"
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5 
        }}
      >
        <FaWhatsapp className="text-white text-xl mr-2" />
        <span className="font-medium">Consulta Gratis</span>
      </motion.a>
      
      {/* Botón de Teléfono */}
      <motion.a
        href={`tel:+${phoneNumber}`}
        className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
        whileHover={{ scale: 1.05, x: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.7 
        }}
      >
        <FaPhone className="text-white text-xl mr-2" />
        <span className="font-medium">Llamar Ahora</span>
      </motion.a>
    </div>
  );
};

export default WhatsAppFloatingButton;