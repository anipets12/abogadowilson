import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaBell, FaCheck } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    
    // Simulación de envío a API (en implementación real conectaría con backend)
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 1500);
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Este navegador no soporta notificaciones push");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        // Aquí se registraría el service worker y se enviaría el token al servidor
        new Notification("Notificaciones Activadas", {
          body: "Recibirá alertas sobre nuevos servicios y promociones legales",
          icon: "/logo.png"
        });
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-blue-600 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-4">Manténgase Informado</h3>
                <p className="mb-6">
                  Suscríbase a nuestro boletín legal para recibir:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                    <span>Cambios importantes en la legislación ecuatoriana</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                    <span>Consejos legales gratuitos para negocios y personas</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                    <span>Ofertas exclusivas en servicios legales</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                    <span>Invitaciones a eventos y seminarios</span>
                  </li>
                </ul>
                <div className="border-t border-blue-400 pt-4">
                  <p className="text-sm opacity-80">
                    Sus datos están seguros con nosotros. Consulte nuestra política de privacidad para más información.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="p-8">
              {!subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-6">
                    <FaEnvelope className="text-blue-600 text-xl mr-3" />
                    <h3 className="text-xl font-bold">Suscríbase a nuestro boletín</h3>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ejemplo@correo.com"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        'Procesando...'
                      ) : (
                        <>
                          Suscribirse <FaPaperPlane className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="flex items-center mb-2">
                      <FaBell className="text-blue-600 text-xl mr-3" />
                      <h4 className="font-medium">Notificaciones Push</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Active las notificaciones para recibir alertas sobre nuevos contenidos y promociones.
                    </p>
                    <button
                      onClick={requestNotificationPermission}
                      disabled={notificationsEnabled}
                      className={`w-full py-2 px-4 rounded-lg border border-blue-600 flex items-center justify-center transition-colors ${
                        notificationsEnabled
                          ? 'bg-green-50 text-green-700 border-green-600'
                          : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {notificationsEnabled ? (
                        <>
                          <FaCheck className="mr-2" /> Notificaciones Activadas
                        </>
                      ) : (
                        <>
                          <FaBell className="mr-2" /> Activar Notificaciones
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FaCheck className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">¡Gracias por suscribirse!</h3>
                  <p className="text-gray-600 mb-6">
                    Hemos enviado un correo de confirmación a <span className="font-medium">{email}</span>.
                    Por favor revise su bandeja de entrada para completar la suscripción.
                  </p>
                  {!notificationsEnabled && (
                    <button
                      onClick={requestNotificationPermission}
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <FaBell className="mr-2" /> Activar notificaciones push
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
