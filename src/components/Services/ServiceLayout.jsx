import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt, FaArrowRight, FaClock, FaCheck, FaStar, FaQuoteLeft } from 'react-icons/fa';

const ServiceLayout = ({
  title,
  icon,
  description,
  services,
  successCases,
  whatsappText,
  specialties
}) => {
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // WhatsApp link con texto personalizado
  const whatsappLink = `https://wa.me/593988835269?text=${encodeURIComponent(whatsappText || `Hola Abg. Wilson, necesito asesoría en derecho ${title.toLowerCase()}.`)}`;

  return (
    <div className="pt-8 pb-16 bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 md:py-16 mb-12 md:mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/law-pattern.png')] bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4 md:mb-6">
              {icon}
              <span className="text-sm font-medium">Servicio Especializado</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">Derecho {title}</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all shadow-lg"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Consulta Inmediata
              </a>
              <Link
                to="/calendario"
                className="flex-1 bg-white hover:bg-blue-50 text-primary-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all shadow-lg"
              >
                <FaCalendarAlt className="mr-2 text-xl" />
                Agendar Reunión
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Oferta de tiempo limitado */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-5 sm:p-6 text-white mb-12 md:mb-16 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-40 h-40 -translate-y-1/2 translate-x-1/4 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
            <div>
              <div className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-2">OFERTA POR TIEMPO LIMITADO</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Primera Consulta {title} a $30</h3>
              <p className="text-white/80 text-base sm:text-lg mb-2">
                <span className="line-through">$50</span> <span className="font-bold text-yellow-300">40% DESCUENTO</span>
              </p>
              <p className="text-white/90 text-sm sm:text-base">
                Incluye evaluación completa de su caso y estrategia preliminar
              </p>
            </div>
            <div className="flex flex-col items-start md:items-center w-full md:w-auto">
              <div className="flex items-center gap-2 mb-3 md:mb-4 text-sm md:text-base">
                <FaClock className="text-yellow-300" />
                <span>Oferta válida por 7 días</span>
              </div>
              <Link 
                to="/contacto"
                className="bg-white hover:bg-blue-50 text-red-600 font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg flex items-center justify-center w-full md:w-auto"
              >
                Reservar Ahora <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Áreas de Especialización */}
        <motion.div 
          className="mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Áreas de Especialización en Derecho {title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Ofrecemos asesoría legal especializada en diversos asuntos de derecho {title.toLowerCase()}, brindando la mejor estrategia para cada caso particular.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {specialties.map((area, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="text-primary-600 text-2xl md:text-3xl mb-3 md:mb-4">{area.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{area.title}</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">{area.description}</p>
                <Link to={`/contacto?area=${encodeURIComponent(area.title)}`} className="text-primary-600 hover:text-primary-800 flex items-center font-medium text-sm md:text-base">
                  Más información <FaArrowRight className="ml-2 text-xs md:text-sm" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Planes y Tarifas */}
        <motion.div 
          className="mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Nuestros Servicios y Tarifas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Ofrecemos diferentes opciones adaptadas a sus necesidades y presupuesto, siempre con la máxima calidad y dedicación.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 px-4">
            {services.map((servicio) => (
              <motion.div 
                key={servicio.id}
                variants={itemVariants}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  servicio.destacado 
                    ? 'border-2 border-primary-500 relative transform hover:-translate-y-1'
                    : 'border border-gray-100 hover:shadow-xl'
                } transition-all bg-white`}
              >
                {servicio.destacado && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary-500 text-white text-xs font-bold uppercase rounded-full px-3 py-1 flex items-center">
                      <FaStar className="mr-1" />
                      Recomendado
                    </span>
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{servicio.nombre}</h3>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">{servicio.descripcion}</p>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl md:text-4xl font-bold text-primary-600">${servicio.precio}</span>
                    <span className="text-gray-500 ml-2">/ {servicio.duracion}</span>
                  </div>
                  
                  {servicio.caracteristicas && (
                    <ul className="mb-6 space-y-2">
                      {servicio.caracteristicas.map((caracteristica, idx) => (
                        <li key={idx} className="flex items-start">
                          <FaCheck className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-auto space-y-3">
                    <Link 
                      to={`/contacto?servicio=${encodeURIComponent(servicio.nombre)}`}
                      className={`w-full flex items-center justify-center py-2 md:py-3 px-4 rounded-lg font-bold transition-colors ${
                        servicio.destacado
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-white border border-primary-600 text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      Contratar
                    </Link>
                    <a 
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-2 md:py-3 px-4 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white transition-colors"
                    >
                      <FaWhatsapp className="mr-2" />
                      Consultar
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Casos de éxito */}
        <motion.div
          className="mb-12 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Casos de Éxito</h2>
            <p className="text-gray-600 max-w-2xl mx-auto px-4">
              Estos son algunos de los resultados que hemos logrado para nuestros clientes en casos similares.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 px-4">
            {successCases.map((caso, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100"
              >
                <div className="text-primary-600 text-2xl mb-3">
                  <FaQuoteLeft />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{caso.titulo}</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">{caso.descripcion}</p>
                <div className="py-2 px-3 bg-green-100 text-green-800 rounded-lg inline-block font-medium text-sm">
                  {caso.resultado}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl py-8 px-5 md:px-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">¿Necesita asesoría legal en {title}?</h3>
              <p className="text-blue-100 mb-0 text-sm md:text-base">
                Contáctenos hoy para una evaluación personalizada de su caso
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="mr-2" />
                WhatsApp
              </a>
              <Link
                to="/contacto"
                className="bg-white hover:bg-blue-50 text-primary-700 font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center transition-colors"
              >
                Contactar
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLayout;
