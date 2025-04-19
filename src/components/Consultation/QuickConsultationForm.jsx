import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import TurnstileWidget from '../TurnstileWidget';

/**
 * Componente de formulario de consulta ru00e1pida optimizado
 * Permite a los usuarios enviar consultas legales ru00e1pidas sin necesidad de registro
 * Incluye protecciu00f3n anti-bot con Turnstile
 */
const QuickConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    area: 'general' // u00c1rea legal por defecto
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [success, setSuccess] = useState(false);

  // Opciones de u00e1reas legales
  const legalAreas = [
    { value: 'general', label: 'Consulta General' },
    { value: 'penal', label: 'Derecho Penal' },
    { value: 'civil', label: 'Derecho Civil' },
    { value: 'laboral', label: 'Derecho Laboral' },
    { value: 'mercantil', label: 'Derecho Mercantil' },
    { value: 'familia', label: 'Derecho de Familia' },
    { value: 'transito', label: 'Derecho de Tru00e1nsito' },
    { value: 'administrativo', label: 'Derecho Administrativo' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que Turnstile estu00e9 completo
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificaciu00f3n de seguridad');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Enviar datos a la API
      const response = await fetch('/api/quick-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar la consulta');
      }
      
      // Mensajes de u00e9xito
      toast.success('Consulta enviada correctamente. Un abogado se pondrá en contacto pronto.');
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        area: 'general'
      });
      
      // Resetear Turnstile
      setTurnstileVerified(false);
      
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      toast.error(error.message || 'Ha ocurrido un error al enviar la consulta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si se ha enviado correctamente, mostrar mensaje de u00e9xito
  if (success) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-10">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">¡Consulta Enviada!</h2>
          <p className="mt-2 text-gray-600">Hemos recibido su consulta correctamente.</p>
          <p className="text-gray-600">Un abogado especializado se pondrá en contacto en breve.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Realizar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Consulta Rápida</h2>
      <p className="text-gray-600 mb-6">Complete el formulario y un abogado especializado le contactará en breve.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área legal</label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {legalAreas.map(area => (
              <option key={area.value} value={area.value}>{area.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Su consulta</label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describa brevemente su situación legal..."
            required
          ></textarea>
        </div>
        
        <div className="mt-4">
          <TurnstileWidget
            onVerify={() => setTurnstileVerified(true)}
            onExpire={() => setTurnstileVerified(false)}
            onError={(msg) => {
              toast.error(`Error en verificación: ${msg}`);
              setTurnstileVerified(false);
            }}
            action="quick_consultation"
            theme="light"
          />
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting || !turnstileVerified}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isSubmitting || !turnstileVerified) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Al enviar este formulario, acepta nuestra <a href="/politica-privacidad" className="text-blue-600 hover:underline">Política de Privacidad</a> y
          los <a href="/terminos-condiciones" className="text-blue-600 hover:underline">Términos y Condiciones</a>.
        </p>
      </form>
    </div>
  );
};

export default QuickConsultationForm;
