import React from 'react';
import { motion } from 'framer-motion';
import { FaGavel, FaFileContract, FaShieldAlt, FaUserLock, FaExclamationTriangle } from 'react-icons/fa';

const TerminosCondiciones = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-blue-800 mb-6 flex items-center"
      >
        <FaFileContract className="mr-3 text-blue-600" /> 
        Términos y Condiciones
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaGavel className="mr-2 text-blue-600" />
          Términos de Uso
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Al acceder y utilizar los servicios ofrecidos por el Abogado Wilson Ipiales, usted acepta los siguientes términos y condiciones en su totalidad.
          </p>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">1. Aceptación de Términos</h4>
            <p>
              Los presentes Términos y Condiciones regulan el uso del sitio web y los servicios de consultoría legal proporcionados por el Abogado Wilson Ipiales. Al utilizar nuestros servicios, usted acepta estos términos en su totalidad.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">2. Descripción del Servicio</h4>
            <p>
              Nuestros servicios incluyen asesoría legal en materia penal, civil, comercial, tránsito y aduanas. Las consultas en línea tienen carácter informativo y no constituyen una relación abogado-cliente hasta la formalización de un contrato de servicios.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">3. Limitación de Responsabilidad</h4>
            <p>
              La información proporcionada en este sitio web y durante las consultas en línea es de carácter general y no debe considerarse como asesoramiento legal específico para su caso particular. El Abogado Wilson Ipiales no será responsable por decisiones tomadas en base a la información general proporcionada.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">4. Tarifas y Pagos</h4>
            <p>
              Las tarifas por los servicios legales se establecerán de manera individual para cada caso, previa evaluación de su complejidad. Los pagos realizados a través de este sitio web se procesarán de manera segura utilizando las plataformas de pago disponibles.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaShieldAlt className="mr-2 text-green-600" />
          Políticas de Privacidad Adicionales
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">5. Confidencialidad</h4>
            <p>
              Toda la información proporcionada durante las consultas será tratada con estricta confidencialidad y en cumplimiento con el secreto profesional que rige la práctica legal. Sin embargo, la confidencialidad completa no puede garantizarse en comunicaciones por internet.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">6. Propiedad Intelectual</h4>
            <p>
              Todos los contenidos del sitio web, incluyendo textos, gráficos, logos, imágenes y software, son propiedad del Abogado Wilson Ipiales y están protegidos por las leyes de propiedad intelectual. Se prohíbe su reproducción sin autorización expresa.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaExclamationTriangle className="mr-2 text-yellow-600" />
          Condiciones Adicionales
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">7. Modificaciones</h4>
            <p>
              El Abogado Wilson Ipiales se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado de nuestros servicios después de dichos cambios constituirá su aceptación de los nuevos términos.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">8. Ley Aplicable</h4>
            <p>
              Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de Ecuador. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales de Ecuador.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">9. Contacto</h4>
            <p>
              Si tiene alguna pregunta sobre estos términos y condiciones, puede contactarnos a través de los canales disponibles en la sección de contacto de nuestro sitio web.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">
            Última actualización: Marzo 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminosCondiciones;
