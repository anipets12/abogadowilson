import { useState } from 'react';
import { motion } from 'framer-motion';
import { insertData } from '../services/supabase';
import { FaGift, FaBookOpen, FaHandshake, FaFileAlt, FaMoneyBillWave } from 'react-icons/fa';

export default function Affiliates() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: '',
    experience: '',
    motivation: '',
    acceptTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Usar el servicio de Supabase para insertar datos
      await insertData('affiliates', formData);
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        profession: '',
        experience: '',
        motivation: '',
        acceptTerms: false
      });
    } catch (error) {
      setError('Error al enviar la solicitud. Por favor, inténtelo de nuevo.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: 'Comisiones Competitivas',
      description: 'Gane hasta un 25% de comisión por cada cliente referido que contrate nuestros servicios.',
      icon: <FaMoneyBillWave className="w-12 h-12 text-primary-600" />
    },
    {
      title: 'Herramientas de Marketing',
      description: 'Acceso a materiales promocionales exclusivos, enlaces de seguimiento y panel de control personalizado.',
      icon: <FaFileAlt className="w-12 h-12 text-primary-600" />
    },
    {
      title: 'Formación Continua',
      description: 'Capacitación regular sobre nuestros servicios y las mejores estrategias para promocionarlos.',
      icon: <FaBookOpen className="w-12 h-12 text-primary-600" />
    },
    {
      title: 'Soporte Dedicado',
      description: 'Equipo de soporte exclusivo para afiliados, disponible para resolver cualquier consulta o problema.',
      icon: <FaHandshake className="w-12 h-12 text-primary-600" />
    }
  ];

  const freeRewards = [
    {
      title: 'E-Book Legal Gratuito',
      description: 'Reciba inmediatamente un E-Book con consejos legales básicos al registrarse como afiliado',
      icon: <FaBookOpen className="w-10 h-10 text-green-600" />
    },
    {
      title: 'Consulta Legal Gratuita',
      description: 'Por cada 3 clientes referidos, obtenga una consulta legal gratuita de 30 minutos',
      icon: <FaHandshake className="w-10 h-10 text-green-600" />
    },
    {
      title: 'Capacitación Exclusiva',
      description: 'Acceso a webinars mensuales sobre temas legales de actualidad',
      icon: <FaGift className="w-10 h-10 text-green-600" />
    }
  ];

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Programa de Afiliados</h2>
          <p className="text-xl text-secondary-600">
            Únase a nuestro programa de afiliados y genere ingresos adicionales recomendando nuestros servicios legales
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-secondary-900 mb-6">
              ¿Por qué unirse a nuestro programa?
            </h3>
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-900 mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-secondary-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-100">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">
                Estructura de Comisiones
              </h4>
              <ul className="space-y-2 text-secondary-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>15% por servicios legales básicos</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>20% por servicios legales intermedios</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>25% por servicios legales premium</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Bonificaciones adicionales por volumen de referidos</span>
                </li>
              </ul>
            </div>
            
            {/* Nueva sección de recompensas gratuitas */}
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <FaGift className="mr-2 text-green-600" /> Recompensas Gratuitas
              </h4>
              <div className="space-y-4">
                {freeRewards.map((reward, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {reward.icon}
                    </div>
                    <div>
                      <h5 className="font-semibold text-secondary-800">{reward.title}</h5>
                      <p className="text-secondary-600 text-sm">{reward.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {success ? (
              <div className="card text-center py-8">
                <svg
                  className="w-16 h-16 text-green-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                  ¡Solicitud Enviada!
                </h3>
                <p className="text-secondary-600 mb-6">
                  Gracias por su interés en nuestro programa de afiliados. Revisaremos su solicitud y nos pondremos en contacto con usted en breve.
                </p>
                <motion.button
                  onClick={() => setSuccess(false)}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Enviar otra solicitud
                </motion.button>
              </div>
            ) : (
              <div className="card">
                <h3 className="text-2xl font-bold text-secondary-900 mb-6">
                  Solicitud de Afiliación
                </h3>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="profession" className="form-label">
                      Profesión u ocupación
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className="form-label">
                      Experiencia en marketing de afiliados
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="Ninguna">Ninguna</option>
                      <option value="Menos de 1 año">Menos de 1 año</option>
                      <option value="1-3 años">1-3 años</option>
                      <option value="Más de 3 años">Más de 3 años</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="motivation" className="form-label">
                      ¿Por qué desea ser parte de nuestro programa de afiliados?
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      rows="4"
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="form-checkbox mt-1"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="ml-2 text-secondary-600 text-sm"
                    >
                      Acepto los términos y condiciones del programa de afiliados
                    </label>
                  </div>
                  <motion.button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}