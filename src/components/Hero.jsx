import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt, FaArrowRight, FaUserTie, FaShieldAlt, FaFileContract, FaClock } from 'react-icons/fa';

const Hero = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fecha para la oferta de tiempo limitado (15 días desde hoy)
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 15);

  // Actualizar la cuenta regresiva
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = offerEndDate - now;

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Variantes de animación
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

  // Servicios destacados
  const featuredServices = [
    {
      id: 1,
      title: 'Derecho Penal',
      description: 'Defensa especializada en casos penales',
      icon: <FaShieldAlt className="text-white text-2xl" />,
      link: '/servicios/penal'
    },
    {
      id: 2,
      title: 'Derecho Civil',
      description: 'Resolución de conflictos civiles y patrimoniales',
      icon: <FaFileContract className="text-white text-2xl" />,
      link: '/servicios/civil'
    },
    {
      id: 3,
      title: 'Consulta Rápida',
      description: 'Respuestas inmediatas a sus dudas legales',
      icon: <FaClock className="text-white text-2xl" />,
      link: '/consultas'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 overflow-hidden">
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="white" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10 text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Abg. Wilson Alexander Ipiales Guerron
              </h1>
              <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
                Con más de 5 años de experiencia y más de 50 casos ganados exitosamente, ofrecemos soluciones legales efectivas y personalizadas. Más de 200 clientes satisfechos confían en nuestra experiencia y dedicación.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/contacto"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-lg inline-flex items-center justify-center"
                >
                  Consulta Gratis
                  <FaArrowRight className="ml-2" />
                </Link>
                <a 
                  href={`https://wa.me/593988835269?text=Hola%20Abg.%20Wilson,%20necesito%20asesoría%20legal.`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all"
                >
                  <FaWhatsapp className="mr-2 text-xl" />
                  Chatear Ahora
                </a>
                <Link 
                  to="/calendario" 
                  className="flex-1 bg-white hover:bg-blue-50 text-primary-700 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all"
                >
                  <FaCalendarAlt className="mr-2 text-xl" />
                  Agendar Cita
                </Link>
              </div>
            </motion.div>

            {/* Columna de tarjetas de servicios */}
            <div className="lg:w-full">
              <motion.div 
                className="grid gap-4 md:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {featuredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all group"
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Link to={service.link} className="flex flex-col h-full">
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg bg-primary-700 mr-3">
                          {service.icon}
                        </div>
                        <h3 className="text-lg font-bold text-white">{service.title}</h3>
                      </div>
                      <p className="text-sm text-blue-100 mb-3">{service.description}</p>
                      <div className="mt-auto pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-xs text-blue-200">Ver detalles</span>
                        <div className="bg-white/20 rounded-full p-1 group-hover:bg-primary-700 transition-all">
                          <FaArrowRight className="text-white text-xs" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Tarjeta de estadísticas */}
                <motion.div 
                  className="md:col-span-2 bg-gradient-to-r from-primary-700 to-primary-800 border border-primary-600 rounded-xl p-5"
                  variants={itemVariants}
                >
                  <h3 className="text-lg font-bold text-white mb-4">Resultados Probados</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">5+</div>
                      <div className="text-xs text-blue-100">Años de Experiencia</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">50+</div>
                      <div className="text-xs text-blue-100">Casos Ganados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">200+</div>
                      <div className="text-xs text-blue-100">Clientes Satisfechos</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Oferta de tiempo limitado */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8 border border-white/20"
            variants={itemVariants}
          >
            <div className="flex items-center mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">OFERTA ESPECIAL</span>
              <span className="ml-2 text-white font-medium">¡Tiempo Limitado!</span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Primera Consulta Legal GRATUITA</h3>
            <p className="text-sm text-blue-100 mb-3">
              Reciba asesoramiento legal personalizado sin costo. Oferta válida solo por:
            </p>
            
            {/* Contador regresivo */}
            <div className="flex justify-center space-x-4 mb-3">
              <div className="flex flex-col items-center">
                <div className="bg-primary-700 text-white rounded-md px-3 py-2 font-mono text-xl font-bold">
                  {countdown.days}
                </div>
                <span className="text-xs text-blue-200 mt-1">Días</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-700 text-white rounded-md px-3 py-2 font-mono text-xl font-bold">
                  {countdown.hours}
                </div>
                <span className="text-xs text-blue-200 mt-1">Horas</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-700 text-white rounded-md px-3 py-2 font-mono text-xl font-bold">
                  {countdown.minutes}
                </div>
                <span className="text-xs text-blue-200 mt-1">Min</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-700 text-white rounded-md px-3 py-2 font-mono text-xl font-bold">
                  {countdown.seconds}
                </div>
                <span className="text-xs text-blue-200 mt-1">Seg</span>
              </div>
            </div>
            
            <Link 
              to="/contacto" 
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-primary-900 font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
            >
              Reservar Mi Consulta Gratuita
              <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
