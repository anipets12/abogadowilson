import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import TurnstileWidget from '../TurnstileWidget';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que Turnstile esté completo
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Enviar datos a la API
      const response = await fetch('/api/contacto/enviar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje');
      }
      
      // Mensaje de éxito
      toast.success('Mensaje enviado correctamente. Nos pondremos en contacto pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Resetear Turnstile
      setTurnstileVerified(false);
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error(error.message || 'Ha ocurrido un error al enviar el mensaje');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono (opcional)"
          value={formData.phone}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <textarea
          name="message"
          placeholder="Escribe tu consulta o mensaje..."
          value={formData.message}
          onChange={handleChange}
          className="form-control"
          rows="5"
          required
        ></textarea>
      </div>
      
      <div className="form-group turnstile-container">
        <TurnstileWidget
          onVerify={() => setTurnstileVerified(true)}
          onExpire={() => setTurnstileVerified(false)}
          onError={(msg) => {
            toast.error(`Error en verificación: ${msg}`);
            setTurnstileVerified(false);
          }}
          action="contact_form"
          theme="light"
        />
      </div>
      
      <div className="form-group">
        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={isSubmitting || !turnstileVerified}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
