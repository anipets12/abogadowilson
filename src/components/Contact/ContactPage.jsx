import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaClock, FaGavel } from 'react-icons/fa';
import AppointmentCalendar from '../Appointment/AppointmentCalendar';
import Newsletter from '../Newsletter/Newsletter';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    // Simular envío (se implementará con Supabase)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({
        type: 'success',
        message: 'Su mensaje ha sido enviado con éxito. Nos pondremos en contacto pronto.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  const contactItems = [
    {
      icon: <FaMapMarkerAlt className="text-blue-600" />,
      title: 'Dirección',
      content: 'Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador',
      action: null
    },
    {
      icon: <FaPhone className="text-blue-600" />,
      title: 'Teléfono',
      content: '+593 988835269',
      action: {
        url: 'tel:+593988835269',
        text: 'Llamar ahora'
      }
    },
    {
      icon: <FaEnvelope className="text-blue-600" />,
      title: 'Email',
      content: 'alexip2@hotmail.com',
      action: {
        url: 'mailto:alexip2@hotmail.com',
        text: 'Enviar email'
      }
    },
    {
      icon: <FaGavel className="text-blue-600" />,
      title: 'Especialidades',
      content: 'Derecho penal, tránsito, civil, comercial, aduanas',
      action: null
    },
    {
      icon: <FaClock className="text-blue-600" />,
      title: 'Horario de Atención',
      content: 'Lunes - Viernes: 8:00 AM - 6:00 PM | Sábado: 9:00 AM - 1:00 PM',
      action: null
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white to-blue-50"
    >
      {/* Banner de contacto */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Contáctenos</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos aquí para ayudarle con cualquier consulta legal. Programe una cita o envíenos un mensaje.
            </p>
            
            {/* Botón de WhatsApp prominente */}
            <div className="mt-8">
              <a 
                href="https://wa.me/593988835269?text=Hola%20Abg.%20Wilson,%20necesito%20asesoría%20legal."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                <FaWhatsapp className="mr-2 text-2xl" />
                <span className="text-lg">Chatear por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal de contacto */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Información de Contacto</h2>
                
                <div className="space-y-6">
                  {contactItems.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mt-1 p-2 bg-blue-100 rounded-full">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-semibold text-gray-800">{item.title}:</h3>
                        <p className="text-gray-600">{item.content}</p>
                        {item.action && (
                          <a 
                            href={item.action.url}
                            className="inline-block mt-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.action.text} →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-80 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7600336027483!2d-78.12105048525697!3d0.3523379997509067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a3ca1785b375d%3A0x5f3c7e25c1a3f33d!2sJuan%20Jos%C3%A9%20Flores%20%26%20Vicente%20Rocafuerte%2C%20Ibarra!5e0!3m2!1ses!2sec!4v1650123456789!5m2!1ses!2sec" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  title="Ubicación de la oficina"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
          
          {/* Formulario de contacto */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Envíenos un mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Correo electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Asunto *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              {submitStatus.message && (
                <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 font-bold text-lg shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sección de calendario de citas */}
      <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Agende una Cita</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Seleccione el día y la hora que mejor se adapte a su agenda para programar una consulta jurídica personalizada.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
              <AppointmentCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de newsletter */}
      <div className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Newsletter />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
