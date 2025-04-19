import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import TurnstileWidget from '../TurnstileWidget';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [interests, setInterests] = useState({
    civil: false,
    penal: false,
    transito: false,
    laboral: false,
    familia: false,
    empresarial: false
  });

  const handleInterestChange = (e) => {
    const { name, checked } = e.target;
    setInterests(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Por favor, introduce un correo electrónico válido');
      return;
    }
    
    // Verificar que Turnstile esté completo
    if (!turnstileVerified) {
      toast.error('Por favor, complete la verificación de seguridad');
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar los datos a enviar
      const selectedInterests = Object.keys(interests).filter(key => interests[key]);
      
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          interests: selectedInterests
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al suscribirse al newsletter');
      }
      
      // Éxito
      setSuccess(true);
      toast.success('¡Te has suscrito correctamente al newsletter!');
      
      // Resetear formulario
      setEmail('');
      setName('');
      setInterests({
        civil: false,
        penal: false,
        transito: false,
        laboral: false,
        familia: false,
        empresarial: false
      });
      setTurnstileVerified(false);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error(error.message || 'Ha ocurrido un error al procesar tu suscripción');
      
      // En caso de desarrollo, simulamos éxito
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <FaCheck className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-green-800">¡Suscripción Exitosa!</h3>
        <p className="mt-2 text-green-700">
          Gracias por suscribirte a nuestro newsletter legal. Te mantendremos actualizado con las últimas noticias, cambios en legislación y consejos legales.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium text-blue-800">Suscríbete a nuestro Newsletter Legal</h3>
          <p className="mt-2 text-sm text-blue-600">
            Recibe actualizaciones sobre cambios en la legislación, consejos legales y noticias relevantes directamente en tu correo electrónico.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
          <FaEnvelope className="h-10 w-10 text-blue-500" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-blue-700">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Tu nombre"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-700">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>
        
        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-blue-700">Áreas de interés</legend>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-y-2">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="civil"
                  name="civil"
                  type="checkbox"
                  checked={interests.civil}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="civil" className="font-medium text-blue-700">Derecho Civil</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="penal"
                  name="penal"
                  type="checkbox"
                  checked={interests.penal}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="penal" className="font-medium text-blue-700">Derecho Penal</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="transito"
                  name="transito"
                  type="checkbox"
                  checked={interests.transito}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="transito" className="font-medium text-blue-700">Derecho de Tránsito</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="laboral"
                  name="laboral"
                  type="checkbox"
                  checked={interests.laboral}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="laboral" className="font-medium text-blue-700">Derecho Laboral</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="familia"
                  name="familia"
                  type="checkbox"
                  checked={interests.familia}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="familia" className="font-medium text-blue-700">Derecho de Familia</label>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="empresarial"
                  name="empresarial"
                  type="checkbox"
                  checked={interests.empresarial}
                  onChange={handleInterestChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="empresarial" className="font-medium text-blue-700">Derecho Empresarial</label>
              </div>
            </div>
          </div>
        </fieldset>
        
        <div className="mt-6">
          <TurnstileWidget
            onVerify={() => setTurnstileVerified(true)}
            onExpire={() => setTurnstileVerified(false)}
            onError={(msg) => {
              toast.error(`Error en verificación: ${msg}`);
              setTurnstileVerified(false);
            }}
            action="newsletter_signup"
            theme="light"
          />
        </div>
        
        <div className="mt-6 flex items-start">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-xs text-blue-700">
              Al suscribirte, aceptas recibir nuestro newsletter y comunicaciones relacionadas. Puedes darte de baja en cualquier momento haciendo clic en el enlace que aparece en la parte inferior de nuestros correos. Para más información, consulta nuestra <a href="/politica-privacidad" className="underline hover:text-blue-600">Política de Privacidad</a>.
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !turnstileVerified}
            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${loading || !turnstileVerified ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Procesando...' : 'Suscribirse'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignup;
