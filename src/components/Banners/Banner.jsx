import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const Banner = ({ 
  title, 
  description, 
  image, 
  link, 
  buttonText = 'Ver Más', 
  type = 'primary',
  countdown = null,
  discount = null
}) => {
  
  // Configuraciones para diferentes tipos de banners
  const bannerStyles = {
    primary: 'bg-gradient-to-r from-blue-900 to-indigo-800',
    offer: 'bg-gradient-to-r from-orange-600 to-red-600',
    info: 'bg-gradient-to-r from-gray-700 to-gray-900'
  };
  
  // Calcular tiempo restante para ofertas con countdown
  const getTimeRemaining = () => {
    if (!countdown) return null;
    
    const currentTime = new Date();
    const endTime = new Date(countdown);
    const timeRemaining = endTime - currentTime;
    
    if (timeRemaining <= 0) return null;
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };
  
  const timeRemaining = getTimeRemaining();
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-xl ${bannerStyles[type]} my-8`}
    >
      {/* Overlay con imagen de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 hover:scale-110" 
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      </div>
      
      {/* Contenido del banner */}
      <div className="relative z-10 px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-2/3">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-100 mb-6 max-w-2xl"
          >
            {description}
          </motion.p>
          
          {/* Countdown para ofertas limitadas */}
          {timeRemaining && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4 mb-6"
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <span className="block text-2xl font-bold text-white">{timeRemaining.days}</span>
                <span className="text-xs text-gray-200">DÍAS</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <span className="block text-2xl font-bold text-white">{timeRemaining.hours}</span>
                <span className="text-xs text-gray-200">HORAS</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <span className="block text-2xl font-bold text-white">{timeRemaining.minutes}</span>
                <span className="text-xs text-gray-200">MINUTOS</span>
              </div>
            </motion.div>
          )}
          
          {/* Descuento para ofertas especiales */}
          {discount && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-block bg-yellow-500 text-yellow-900 font-bold px-4 py-2 rounded-full mb-6"
            >
              ¡{discount}% DE DESCUENTO!
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link 
              to={link} 
              className="inline-flex items-center px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-300"
            >
              {buttonText}
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
        
        {type === 'offer' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden md:block md:w-1/3 mt-8 md:mt-0"
          >
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Oferta Especial</h3>
              <p className="text-gray-200 mb-4">¡No pierdas esta oportunidad única! Tiempo limitado.</p>
              <div className="text-3xl font-bold text-yellow-300">
                {discount && `${discount}% OFF`}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Banner;
