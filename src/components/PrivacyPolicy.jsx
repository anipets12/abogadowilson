import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Política de Privacidad y Seguridad</h2>
          <p className="text-xl text-secondary-600">
            Su privacidad y la seguridad de sus datos son nuestra prioridad
          </p>
        </div>

        <motion.div
          className="card max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                1. Información que Recopilamos
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  En Abg. Wilson Ipiales, recopilamos información personal con el único propósito de brindarle servicios legales de calidad. Esta información puede incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Datos de identificación personal (nombre, cédula, dirección)</li>
                  <li>Información de contacto (correo electrónico, número telefónico)</li>
                  <li>Detalles específicos relacionados con su caso legal</li>
                  <li>Información de pago para servicios contratados</li>
                  <li>Datos de navegación en nuestro sitio web (mediante cookies)</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                2. Uso de la Información
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  La información que recopilamos se utiliza exclusivamente para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar asesoramiento legal personalizado</li>
                  <li>Gestionar su caso y representarlo adecuadamente</li>
                  <li>Comunicarnos con usted sobre actualizaciones de su caso</li>
                  <li>Mejorar nuestros servicios y experiencia del usuario</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                </ul>
                <p>
                  Nunca venderemos, alquilaremos o compartiremos su información personal con terceros para fines de marketing sin su consentimiento explícito.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                3. Protección de Datos
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información personal contra acceso no autorizado, pérdida, alteración o destrucción:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encriptación SSL en todas las transmisiones de datos</li>
                  <li>Acceso restringido a información personal por parte de nuestro personal</li>
                  <li>Sistemas de seguridad informática actualizados</li>
                  <li>Políticas estrictas de confidencialidad para todos los empleados</li>
                  <li>Almacenamiento seguro de documentos físicos</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                4. Confidencialidad Cliente-Abogado
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  Respetamos rigurosamente el privilegio de confidencialidad cliente-abogado. Toda la información que nos proporcione en el contexto de nuestra relación profesional está protegida por este privilegio legal y ético.
                </p>
                <p>
                  Solo divulgaremos información confidencial cuando sea expresamente autorizado por usted o cuando sea requerido por ley o por orden judicial.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                5. Cookies y Tecnologías de Seguimiento
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de navegación. Estas herramientas nos ayudan a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Recordar sus preferencias y configuraciones</li>
                  <li>Entender cómo interactúa con nuestro sitio</li>
                  <li>Mejorar la funcionalidad y rendimiento del sitio</li>
                  <li>Personalizar el contenido según sus intereses</li>
                </ul>
                <p>
                  Puede configurar su navegador para rechazar cookies o alertarle cuando se envíen cookies. Sin embargo, algunas partes de nuestro sitio pueden no funcionar correctamente si deshabilita las cookies.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                6. Derechos del Usuario
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  De acuerdo con la Ley Orgánica de Protección de Datos Personales de Ecuador, usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Acceder a sus datos personales que poseemos</li>
                  <li>Solicitar la rectificación de datos inexactos</li>
                  <li>Solicitar la eliminación de sus datos (derecho al olvido)</li>
                  <li>Oponerse al procesamiento de sus datos</li>
                  <li>Retirar su consentimiento en cualquier momento</li>
                  <li>Presentar una reclamación ante la autoridad de control</li>
                </ul>
                <p>
                  Para ejercer cualquiera de estos derechos, por favor contáctenos a través de los medios proporcionados al final de esta política.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                7. Cambios a esta Política
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  Podemos actualizar nuestra Política de Privacidad periódicamente. Cualquier cambio significativo será notificado a través de un aviso prominente en nuestro sitio web o mediante un correo electrónico a los clientes registrados.
                </p>
                <p>
                  Le recomendamos revisar esta política regularmente para estar informado sobre cómo protegemos su información.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                8. Contacto
              </h3>
              <div className="space-y-4 text-secondary-700">
                <p>
                  Si tiene preguntas o inquietudes sobre nuestra Política de Privacidad o sobre cómo manejamos sus datos personales, por favor contáctenos:
                </p>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <p className="font-medium">Abg. Wilson Ipiales</p>
                  <p>Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador</p>
                  <p>Email: <a href="mailto:alexip2@hotmail.com" className="text-primary-600 hover:underline">alexip2@hotmail.com</a></p>
                  <p>Teléfono: <a href="tel:+593988835269" className="text-primary-600 hover:underline">+593 988835269</a></p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-200 text-center">
            <p className="text-secondary-600">
              Última actualización: {new Date().toLocaleDateString('es-ES', {year: 'numeric', month: 'long', day: 'numeric'})}
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            ¿Tiene preguntas sobre cómo protegemos sus datos?
          </h3>
          <p className="text-lg text-secondary-600 mb-6">
            Nuestro equipo está disponible para aclarar cualquier duda sobre nuestra política de privacidad y seguridad.
          </p>
          <a
            href="/contacto"
            className="btn-primary inline-block"
          >
            Contactar Ahora
          </a>
        </motion.div>
      </div>
    </div>
  );
}