import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaBalanceScale, FaGavel, FaCar, FaBuilding, FaShip, FaMoneyBillWave, FaUserTie } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

const ServicesPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const services = [
    {
      id: 'penal',
      title: 'Derecho Penal',
      description: 'Defensa legal completa en procesos penales con estrategias personalizadas y efectivas.',
      details: [
        'Defensa en delitos contra la propiedad',
        'Defensa en delitos contra las personas',
        'Litigios en delitos económicos y financieros',
        'Representación en audiencias y juicios penales',
        'Medidas alternativas a la prisión preventiva'
      ],
      icon: <FaGavel className="text-4xl mb-4 text-blue-600" />,
      color: 'blue',
      link: '/servicios/penal',
      price: 'Desde $150 / Consulta',
      tokens: 30
    },
    {
      id: 'civil',
      title: 'Derecho Civil',
      description: 'Asesoría en contratos, propiedades, sucesiones y obligaciones con enfoque práctico.',
      details: [
        'Elaboración y revisión de contratos',
        'Procesos de divorcios y pensiones alimenticias',
        'Juicios de inquilinato',
        'Trámites sucesorios',
        'Compraventa de bienes inmuebles'
      ],
      icon: <FaBalanceScale className="text-4xl mb-4 text-green-600" />,
      color: 'green',
      link: '/servicios/civil',
      price: 'Desde $120 / Consulta',
      tokens: 25
    },
    {
      id: 'transito',
      title: 'Derecho de Tránsito',
      description: 'Representación legal en infracciones y accidentes de tránsito con alta tasa de éxito.',
      details: [
        'Impugnación de multas de tránsito',
        'Defensa en accidentes de tránsito',
        'Recuperación de puntos en licencias',
        'Trámites administrativos de tránsito',
        'Asesoría en seguros vehiculares'
      ],
      icon: <FaCar className="text-4xl mb-4 text-red-600" />,
      color: 'red',
      link: '/servicios/transito',
      price: 'Desde $100 / Consulta',
      tokens: 20
    },
    {
      id: 'comercial',
      title: 'Derecho Comercial',
      description: 'Servicios legales para empresas y emprendedores con visión estratégica de negocios.',
      details: [
        'Constitución y estructuración de empresas',
        'Contratos mercantiles y comerciales',
        'Protección de propiedad intelectual',
        'Asesoría para startups y emprendedores',
        'Litigios comerciales'
      ],
      icon: <FaBuilding className="text-4xl mb-4 text-purple-600" />,
      color: 'purple',
      link: '/servicios/comercial',
      price: 'Desde $180 / Consulta',
      tokens: 35
    },
    {
      id: 'aduanas',
      title: 'Derecho Aduanero',
      description: 'Especialistas en normativa aduanera, importaciones y exportaciones de mercancías.',
      details: [
        'Asesoría en regímenes aduaneros',
        'Recursos contra sanciones aduaneras',
        'Clasificación arancelaria de mercancías',
        'Trámites de importación y exportación',
        'Defensa en procedimientos administrativos'
      ],
      icon: <FaShip className="text-4xl mb-4 text-indigo-600" />,
      color: 'indigo',
      link: '/servicios/aduanas',
      price: 'Desde $200 / Consulta',
      tokens: 40
    },
    {
      id: 'laboral',
      title: 'Derecho Laboral',
      description: 'Defensa de derechos laborales para trabajadores y asesoría a empleadores.',
      details: [
        'Despidos injustificados e indemnizaciones',
        'Acoso laboral y discriminación',
        'Negociación de contratos colectivos',
        'Cumplimiento de normativa laboral',
        'Mediación en conflictos laborales'
      ],
      icon: <FaUserTie className="text-4xl mb-4 text-yellow-600" />,
      color: 'yellow',
      link: '/servicios/laboral',
      price: 'Desde $130 / Consulta',
      tokens: 25
    }
  ];

  return (
    <>
      <Helmet>
        <title>Servicios Legales | Abogado Wilson Ipiales</title>
        <meta name="description" content="Servicios legales profesionales en derecho penal, civil, tránsito, comercial, aduanero y más. Asesoría jurídica de calidad con enfoque en resultados." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            Servicios Legales Profesionales
          </motion.h1>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TypeAnimation
              sequence={[
                'Defendemos sus derechos con excelencia',
                2000,
                'Soluciones legales personalizadas',
                2000,
                'Compromiso, experiencia y resultados',
                2000
              ]}
              wrapper="h2"
              speed={50}
              repeat={Infinity}
              className="text-xl md:text-2xl text-blue-100 mb-8"
            />
            
            <p className="text-lg mb-8">
              Ofrecemos asesoría jurídica integral con un enfoque personalizado para resolver eficazmente sus necesidades legales.
            </p>
          </motion.div>

          <motion.div
            className="mt-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/consulta-rapida" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-lg"
            >
              Consulta Gratuita
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Áreas de Práctica</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Expertos en diversas áreas del derecho para ofrecerle soluciones integrales a sus problemas legales.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={`bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-${service.color}-500 hover:shadow-2xl transition-shadow duration-300`}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-center mb-4">{service.description}</p>
                  
                  <ul className="mt-4 space-y-2">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`flex-shrink-0 h-5 w-5 rounded-full bg-${service.color}-100 flex items-center justify-center mr-2`}>
                          <span className={`h-2 w-2 rounded-full bg-${service.color}-600`}></span>
                        </span>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <span className="text-gray-500">Honorarios:</span>
                      <p className="font-semibold text-gray-900">{service.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tokens:</span>
                      <p className="font-semibold text-gray-900">{service.tokens} <FaMoneyBillWave className="inline ml-1 text-yellow-500" /></p>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      to={service.link}
                      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${service.color}-600 hover:bg-${service.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${service.color}-500`}
                    >
                      Más información
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Elegirnos?</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Nuestro compromiso con la excelencia nos distingue en el campo legal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experiencia Probada</h3>
              <p className="text-gray-600">Más de 15 años de trayectoria profesional en casos complejos con resultados favorables.</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Atención Personalizada</h3>
              <p className="text-gray-600">Cada caso recibe atención directa y estrategias adaptadas a sus necesidades específicas.</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparencia Total</h3>
              <p className="text-gray-600">Comunicación clara sobre honorarios, plazos y perspectivas realistas de su caso.</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enfoque Tecnológico</h3>
              <p className="text-gray-600">Utilizamos herramientas digitales avanzadas para hacer su experiencia más eficiente.</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Disponibilidad</h3>
              <p className="text-gray-600">Atención rápida y eficiente a consultas urgentes, incluso fuera del horario habitual.</p>
            </motion.div>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Red de Especialistas</h3>
              <p className="text-gray-600">Contamos con una amplia red de profesionales para abordar todos los aspectos de su caso.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sistema de Tokens */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Sistema de Tokens</h2>
            <p className="max-w-3xl mx-auto text-xl">
              Nuestra innovadora forma de acceder a servicios legales de manera flexible y económica.
            </p>
          </motion.div>

          <motion.div 
            className="bg-white text-gray-800 rounded-xl shadow-2xl p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <span className="font-bold text-yellow-600">1</span>
                    </span>
                    <span>Adquiera paquetes de tokens según sus necesidades.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <span className="font-bold text-yellow-600">2</span>
                    </span>
                    <span>Utilice sus tokens para acceder a diversos servicios legales.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <span className="font-bold text-yellow-600">3</span>
                    </span>
                    <span>Cada servicio tiene un costo específico en tokens.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                      <span className="font-bold text-yellow-600">4</span>
                    </span>
                    <span>Los tokens no caducan y puede utilizarlos cuando los necesite.</span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link 
                    to="/dashboard/tokens" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    Adquirir Tokens
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Beneficios del Sistema</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Mayor flexibilidad en la gestión de sus necesidades legales.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Ahorro significativo frente a honorarios convencionales.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Prioridad en la atención de consultas y casos.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Acceso a recursos exclusivos y documentos personalizados.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Gestión transparente de su saldo a través del dashboard.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-yellow-500 mr-2">
                      ✓
                    </span>
                    <span>Posibilidad de ganar tokens adicionales mediante el programa de referidos.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lo Que Dicen Nuestros Clientes</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              La satisfacción de nuestros clientes es nuestro mejor testimonio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-blue-700">MR</span>
                </div>
                <div>
                  <h4 className="font-bold">María Rodriguez</h4>
                  <p className="text-gray-500">Caso Civil</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"El Dr. Wilson demostró un profesionalismo excepcional durante todo mi caso de divorcio. Siempre accesible y claro en sus explicaciones, logró un acuerdo justo en tiempo récord."</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-green-700">JP</span>
                </div>
                <div>
                  <h4 className="font-bold">Juan Pérez</h4>
                  <p className="text-gray-500">Caso Penal</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"En un momento muy difícil, el Dr. Ipiales me brindó no solo una defensa legal impecable, sino también la tranquilidad que necesitaba. Su conocimiento del derecho penal es admirable."</p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-purple-700">CS</span>
                </div>
                <div>
                  <h4 className="font-bold">Comercial Suárez S.A.</h4>
                  <p className="text-gray-500">Caso Mercantil</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"Como empresa, valoramos enormemente el enfoque estratégico y la rapidez con que el bufete del Dr. Wilson resolvió nuestro litigio comercial. Una inversión que valió cada centavo."</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            ¿Listo para resolver su asunto legal?
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-8 text-blue-100"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Agende su consulta ahora y dé el primer paso hacia la solución de su problema legal.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/agendar-cita" 
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300"
            >
              Agendar Cita
            </Link>
            
            <Link 
              to="/contacto" 
              className="px-8 py-4 bg-transparent text-white font-bold rounded-lg shadow-lg border-2 border-white hover:bg-blue-800 transition-colors duration-300"
            >
              Contactar
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
