import React from 'react';
import { Helmet } from 'react-helmet-async';
import FreeConsultation from '../components/FreeTrial/FreeConsultation';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { motion } from 'framer-motion';
import { FaBalanceScale, FaFileAlt, FaUserCheck } from 'react-icons/fa';

const FreeConsultationPage = () => {
  return (
    <>
      <Helmet>
        <title>Consulta Legal Gratuita | Abg. Wilson Ipiales</title>
        <meta name="description" content="Obtenga un documento legal gratuito generado por nuestra IA especializada en derecho ecuatoriano." />
      </Helmet>
      
      <Header />
      
      <main className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Consulta Legal Gratuita
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Obtenga un documento legal generado por nuestra IA especializada en derecho ecuatoriano, totalmente gratis para su primera consulta.
            </motion.p>
          </div>
          
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaBalanceScale className="h-10 w-10 text-blue-600" />,
                title: "Asesoría Especializada",
                description: "Nuestra IA está entrenada con leyes ecuatorianas actualizadas para ofrecerle documentos precisos y relevantes."
              },
              {
                icon: <FaFileAlt className="h-10 w-10 text-blue-600" />,
                title: "Documentos Personalizados",
                description: "Obtenga documentos adaptados a su situación específica en materia civil, penal o de tránsito."
              },
              {
                icon: <FaUserCheck className="h-10 w-10 text-blue-600" />,
                title: "Privacidad Garantizada",
                description: "Su información se maneja con absoluta confidencialidad y no se comparte con terceros."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <FreeConsultation />
          
          <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Preguntas Frecuentes</h2>
            
            <div className="space-y-4">
              {[
                {
                  question: "¿La consulta gratuita tiene algún costo oculto?",
                  answer: "No, la consulta gratuita es completamente gratuita y sin compromiso, disponible una vez por usuario. Para servicios adicionales, ofrecemos planes accesibles que se ajustan a sus necesidades."
                },
                {
                  question: "¿Puedo confiar en un documento generado por IA?",
                  answer: "Nuestra IA genera documentos informativos basados en la legislación ecuatoriana. Sin embargo, para casos complejos, siempre recomendamos una consulta personalizada con nuestros abogados profesionales."
                },
                {
                  question: "¿Qué tipos de documentos puedo obtener?",
                  answer: "Puede obtener borradores de documentos como solicitudes, impugnaciones o denuncias en materia civil, penal o de tránsito, adaptados a su situación específica."
                },
                {
                  question: "¿Qué sucede después de usar mi consulta gratuita?",
                  answer: "Después de utilizar su consulta gratuita, puede registrarse en nuestra plataforma para acceder a servicios adicionales, incluyendo consultas con abogados especializados, documentos legales avanzados y más."
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default FreeConsultationPage;
