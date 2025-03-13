import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaServer, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

const Seguridad = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-blue-800 mb-6 flex items-center"
      >
        <FaShieldAlt className="mr-3 text-blue-600" /> 
        Polu00edtica de Seguridad
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaLock className="mr-2 text-blue-600" />
          Protecciu00f3n de Datos
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            En el Bufete del Abogado Wilson Ipiales, la seguridad de su informaciu00f3n es nuestra prioridad. Implementamos rigurosas medidas de protecciu00f3n para garantizar la confidencialidad de todos sus datos personales y legales.
          </p>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Encriptaciu00f3n de Datos</h4>
            <p>
              Utilizamos tecnologu00eda de encriptaciu00f3n avanzada para proteger toda la informaciu00f3n transmitida entre su dispositivo y nuestros servidores. Esto asegura que sus datos personales y documentos legales permanezcan confidenciales durante la transmisiu00f3n.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Autenticaciu00f3n Segura</h4>
            <p>
              Nuestro sistema de inicio de sesiu00f3n implementa mu00e9todos de autenticaciu00f3n robustos, incluyendo la verificaciu00f3n en dos pasos cuando estu00e1 disponible, para garantizar que solo usted pueda acceder a su informaciu00f3n.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserShield className="mr-2 text-green-600" />
          Privacidad del Cliente
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Confidencialidad Profesional</h4>
            <p>
              Como abogados, estamos legalmente obligados a mantener la confidencialidad de toda la informaciu00f3n que nos proporciona. Respetamos estrictamente el secreto profesional y nunca compartimos sus datos con terceros sin su consentimiento explu00edcito, excepto cuando sea requerido por ley.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Acceso Limitado</h4>
            <p>
              Solo el personal autorizado y directamente involucrado en su caso tendru00e1 acceso a su informaciu00f3n. Todos nuestros empleados firman acuerdos de confidencialidad y reciben capacitaciu00f3n regular sobre la importancia de la privacidad de los datos.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaServer className="mr-2 text-purple-600" />
          Infraestructura Tecnolu00f3gica
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Servidores Seguros</h4>
            <p>
              Nuestra infraestructura digital estu00e1 protegida por firewalls avanzados y sistemas de detecciu00f3n de intrusiones. Realizamos auditoru00edas de seguridad periu00f3dicas y mantenemos nuestros sistemas actualizados con los u00faltimos parches de seguridad.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Respaldo de Datos</h4>
            <p>
              Implementamos sistemas de respaldo automu00e1tico para garantizar que su informaciu00f3n estu00e9 protegida contra pu00e9rdidas accidentales. Todos los respaldos estu00e1n igualmente encriptados y se almacenan en ubicaciones seguras.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaHandshake className="mr-2 text-yellow-600" />
          Nuestro Compromiso
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Nos comprometemos a proteger su informaciu00f3n con los mu00e1s altos estu00e1ndares de seguridad. Continuamente revisamos y mejoramos nuestras pru00e1cticas para adaptarnos a las nuevas amenazas y cumplir con las regulaciones de protecciu00f3n de datos vigentes.
          </p>
          
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Notificaciu00f3n de Brechas</h4>
            <p>
              En el improbable caso de una brecha de seguridad que afecte sus datos personales, nos comprometemos a notificarle de inmediato y tomar todas las medidas necesarias para mitigar cualquier posible dau00f1o.
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-800">
              <FaExclamationTriangle className="inline mr-2 text-yellow-600" />
              <span className="font-medium">Aviso importante:</span> Nunca le solicitaremos informaciu00f3n sensible como contraseu00f1as o datos bancarios a travu00e9s de correo electru00f3nico o mensaje de texto. Si recibe una solicitud sospechosa, por favor contu00e1ctenos directamente a travu00e9s de nuestros canales oficiales.
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              u00daltima actualizaciu00f3n de nuestra polu00edtica de seguridad: Marzo 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguridad;
